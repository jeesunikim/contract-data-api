const express = require("express");
const { PrismaClient } = require("../generated/prisma");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function main() {
  // ... you will write your Prisma Client queries here
  const transactions = await prisma.transactions.findMany();
  console.log(transactions);
}

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Stellar Lab API is running!" });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await prisma.$connect();

    main()
      .then(async () => {
        await prisma.$disconnect();
      })
      .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });

    console.log("Connected to PostgreSQL database");
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
});
