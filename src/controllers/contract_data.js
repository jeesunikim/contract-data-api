const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const getKeysByContractId = async (req, res) => {
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

module.exports = {
  getKeysByContractId,
};
