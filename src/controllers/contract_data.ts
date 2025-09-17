import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getKeysByContractId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contract_id } = req.params;

    const keys = await prisma.$queryRaw`
      SELECT key_decoded
      FROM contract_data
      WHERE id = ${contract_id}
    `;

    res.json(keys);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};