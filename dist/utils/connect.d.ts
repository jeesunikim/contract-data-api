import { PrismaClient } from "../../generated/prisma";
declare function connect({ instanceConnectionName, user, database, }: {
    instanceConnectionName: string;
    user: string;
    database: string;
}): Promise<{
    prisma: PrismaClient<{
        datasourceUrl: string;
    }, never, import("../../generated/prisma/runtime/library").DefaultArgs>;
    close(): Promise<void>;
}>;
export { connect };
//# sourceMappingURL=connect.d.ts.map