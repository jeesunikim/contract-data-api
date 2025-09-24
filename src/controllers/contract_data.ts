import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

import { encodeCursor, decodeCursor } from "../helpers/cursor";

const prisma = new PrismaClient();

// Build query parameters string
const buildQueryString = (params: Record<string, any>): string => {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return filteredParams ? `?${filteredParams}` : "";
};

export const getContractDataByContractId = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { contract_id, network = "mainnet" } = req.params;

    const {
      cursor,
      limit = "20",
      order = "desc",
      sort_by = "pk_id",
    } = req.query;

    const limitNum = Math.min(parseInt(limit as string) || 10, 200); // Max 200 records
    const isDesc = order === "desc";

    // Validate sort_by parameter
    const validSortFields = ["pk_id", "durability", "ttl", "updated_at"];
    const sortBy = validSortFields.includes(sort_by as string)
      ? (sort_by as string)
      : "pk_id";

    // Build where clause (no time filtering)
    let whereClause: any = {
      id: contract_id,
    };

    if (cursor) {
      try {
        const cursorData = decodeCursor(cursor as string);

        if (
          cursorData.sortBy &&
          cursorData.sortBy === sortBy &&
          cursorData.sortValue !== undefined
        ) {
          // Handle cursor for specific sort field
          const sortField = sortBy === "updated_at" ? "closed_at" : sortBy;

          if (sortBy === "ttl") {
            // For TTL sorting, we need to include the ttl relation
            whereClause = {
              ...whereClause,
              OR: [
                {
                  ttl: {
                    live_until_ledger_sequence: isDesc
                      ? { lt: cursorData.sortValue }
                      : { gt: cursorData.sortValue },
                  },
                },
                {
                  ttl: {
                    live_until_ledger_sequence: cursorData.sortValue,
                  },
                  pk_id: isDesc
                    ? { lt: cursorData.pkId }
                    : { gt: cursorData.pkId },
                },
              ],
            };
          } else {
            // For other fields (durability, updated_at/closed_at)
            whereClause = {
              ...whereClause,
              OR: [
                {
                  [sortField]: isDesc
                    ? { lt: cursorData.sortValue }
                    : { gt: cursorData.sortValue },
                },
                {
                  [sortField]: cursorData.sortValue,
                  pk_id: isDesc
                    ? { lt: cursorData.pkId }
                    : { gt: cursorData.pkId },
                },
              ],
            };
          }
        } else {
          // Fallback to pk_id cursor for backward compatibility
          whereClause = {
            ...whereClause,
            pk_id: isDesc ? { lt: cursorData.pkId } : { gt: cursorData.pkId },
          };
        }
      } catch (error) {
        return res.status(400).json({ error: "Invalid cursor" });
      }
    }

    // Build orderBy clause based on sort_by parameter
    let orderBy: any;
    let include: any = {};

    if (sortBy === "ttl") {
      orderBy = [
        { ttl: { live_until_ledger_sequence: isDesc ? "desc" : "asc" } },
        { pk_id: isDesc ? "desc" : "asc" }, // Secondary sort for stable pagination
      ];
      include = { ttl: true };
    } else if (sortBy === "updated_at") {
      orderBy = [
        { closed_at: isDesc ? "desc" : "asc" },
        { pk_id: isDesc ? "desc" : "asc" },
      ];
      include = { ttl: true }; // Include TTL for potential access in serialization
    } else if (sortBy === "durability") {
      orderBy = [
        { durability: isDesc ? "desc" : "asc" },
        { pk_id: isDesc ? "desc" : "asc" },
      ];
      include = { ttl: true }; // Include TTL for potential access in serialization
    } else {
      // Default to pk_id
      orderBy = { pk_id: isDesc ? "desc" : "asc" };
      include = { ttl: true }; // Include TTL for potential access in serialization
    }

    // Step 1: Get the max ledger_sequence for each key_hash (use base where clause without cursor)
    const baseWhereClause = {
      id: contract_id,
    };

    const latestPerKeyHash = await prisma.contract_data.groupBy({
      by: ['key_hash'],
      where: baseWhereClause,
      _max: {
        ledger_sequence: true
      }
    });

    // Step 2: Get the actual records with those max ledger_sequences, then apply cursor logic
    let finalWhereClause: any = {
      id: contract_id,
      OR: latestPerKeyHash.map(item => ({
        key_hash: item.key_hash,
        ledger_sequence: item._max.ledger_sequence!
      }))
    };

    // Apply cursor logic to the final query if cursor exists
    if (cursor) {
      try {
        const cursorData = decodeCursor(cursor as string);

        if (cursorData.sortBy && cursorData.sortBy === sortBy && cursorData.sortValue !== undefined) {
          // For cursor pagination, we need to filter the results after getting latest records
          const sortField = sortBy === "updated_at" ? "closed_at" : sortBy;

          if (sortBy === "ttl") {
            finalWhereClause.AND = [
              {
                OR: [
                  {
                    ttl: {
                      live_until_ledger_sequence: isDesc
                        ? { lt: cursorData.sortValue }
                        : { gt: cursorData.sortValue },
                    },
                  },
                  {
                    ttl: {
                      live_until_ledger_sequence: cursorData.sortValue,
                    },
                    pk_id: isDesc
                      ? { lt: cursorData.pkId }
                      : { gt: cursorData.pkId },
                  },
                ],
              }
            ];
          } else {
            finalWhereClause.AND = [
              {
                OR: [
                  {
                    [sortField]: isDesc
                      ? { lt: cursorData.sortValue }
                      : { gt: cursorData.sortValue },
                  },
                  {
                    [sortField]: cursorData.sortValue,
                    pk_id: isDesc
                      ? { lt: cursorData.pkId }
                      : { gt: cursorData.pkId },
                  },
                ],
              }
            ];
          }
        } else {
          // Fallback to pk_id cursor
          finalWhereClause.AND = [
            {
              pk_id: isDesc ? { lt: cursorData.pkId } : { gt: cursorData.pkId }
            }
          ];
        }
      } catch (error) {
        return res.status(400).json({ error: "Invalid cursor" });
      }
    }

    const contractData = await prisma.contract_data.findMany({
      where: finalWhereClause,
      orderBy,
      take: limitNum + 1, // Get one extra to check for next page
      include,
    });

    // Check if there are more records
    const hasMore = contractData.length > limitNum;
    const results = hasMore ? contractData.slice(0, limitNum) : contractData;


    // Convert BigInt values to strings for JSON serialization
    const serializedResults = results.map((item: any) => {
      // Get sort value for cursor generation
      let sortValue: any;
      if (sortBy === "ttl") {
        sortValue = item.ttl?.live_until_ledger_sequence || null;
      } else if (sortBy === "updated_at") {
        sortValue = item.closed_at;
      } else if (sortBy === "durability") {
        sortValue = item.durability;
      }

      return {
        durability: item.durability,
        key: item.key ? Buffer.from(item.key).toString("base64") : null,
        value: item.val ? Buffer.from(item.val).toString("base64") : null,
        updated: Math.floor(item.closed_at.getTime() / 1000), // Convert to Unix timestamp
        // ledger_sequence: item.ledger_sequence,
        key_hash: item.key_hash,
        ttl: item.ttl?.live_until_ledger_sequence || null,
        expired: item.ttl?.live_until_ledger_sequence
          ? Date.now() > item.ttl.live_until_ledger_sequence * 1000
          : false,
      };
    });

    // Build links
    const baseUrl = `/api/${network}/contract/${contract_id}/storage`;
    const currentParams = {
      order,
      limit: limitNum.toString(),
      ...(sortBy !== "pk_id" ? { sort_by: sortBy } : {}),
    };

    const links: any = {
      self: {
        href: baseUrl + buildQueryString({ ...currentParams, cursor }),
      },
    };

    // Add prev link if we have results and are not at the beginning
    if (results.length > 0) {
      const firstRecord = results[0] as (typeof results)[0] & {
        ttl?: { live_until_ledger_sequence: number };
      };
      let firstSortValue: any;
      if (sortBy === "ttl") {
        firstSortValue = firstRecord.ttl?.live_until_ledger_sequence || null;
      } else if (sortBy === "updated_at") {
        firstSortValue = firstRecord.closed_at;
      } else if (sortBy === "durability") {
        firstSortValue = firstRecord.durability;
      }

      links.prev = {
        href:
          baseUrl +
          buildQueryString({
            order: isDesc ? "asc" : "desc",
            limit: limitNum.toString(),
            cursor: encodeCursor(firstRecord.pk_id, firstSortValue, sortBy),
          }),
      };
    }

    // Add next link if there are more records
    if (hasMore && results.length > 0) {
      const lastRecord = results[results.length - 1] as (typeof results)[0] & {
        ttl?: { live_until_ledger_sequence: number };
      };
      let lastSortValue: any;
      if (sortBy === "ttl") {
        lastSortValue = lastRecord.ttl?.live_until_ledger_sequence || null;
      } else if (sortBy === "updated_at") {
        lastSortValue = lastRecord.closed_at;
      } else if (sortBy === "durability") {
        lastSortValue = lastRecord.durability;
      }

      links.next = {
        href:
          baseUrl +
          buildQueryString({
            ...currentParams,
            cursor: encodeCursor(lastRecord.pk_id, lastSortValue, sortBy),
          }),
      };
    }

    res.json({
      _links: links,
      results: serializedResults,
    });
  } catch (error) {
    console.error("Error fetching contract data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
