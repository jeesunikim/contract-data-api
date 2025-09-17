"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeysByContractId = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const getKeysByContractId = async (req, res) => {
    try {
        const { contract_id } = req.params;
        const keys = await prisma.$queryRaw `
      SELECT key_decoded
      FROM contract_data
      WHERE id = ${contract_id}
    `;
        res.json(keys);
    }
    catch (error) {
        console.error("Error fetching transaction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getKeysByContractId = getKeysByContractId;
//# sourceMappingURL=contract_data.js.map