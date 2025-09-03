const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const getTransactionByHash = async (req, res) => {
  try {
    const { transaction_hash } = req.params;

    if (!transaction_hash) {
      return res.status(400).json({ error: "Transaction hash is required" });
    }

    const transaction = await prisma.transactions.findFirst({
      where: {
        transaction_hash: transaction_hash,
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getTransactionByHash,
};