const express = require("express");
const { connect } = require("./utils/connect.cjs");
const contractRoutes = require("./routes/contract_data");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", contractRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Stellar Lab API is running!" });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    const { prisma } = await connect();

    const results =
      await prisma.$queryRaw`SELECT * FROM "public"."contract_data" LIMIT 5`;

    // use ORM to filter
    // Don't write raw query everytime. Use ORM
    console.log("Available columns:", results);
    console.log("Connected to PostgreSQL database");
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
});
