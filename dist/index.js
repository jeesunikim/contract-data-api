"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connect_1 = require("./utils/connect");
const contract_data_1 = __importDefault(require("./routes/contract_data"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/api", contract_data_1.default);
app.get("/", (_req, res) => {
    res.json({ message: "Stellar Lab API is running!" });
});
let connectionClose = null;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        const { prisma, close } = await (0, connect_1.connect)({
            instanceConnectionName: process.env.POSTGRES_CONNECTION_NAME,
            user: process.env.POSTGRES_IAM_USER,
            database: process.env.DB_NAME,
        });
        connectionClose = close;
        // Test the connection
        await prisma.$connect();
        console.log("✅ Database connected successfully!");
        const rows = await prisma.$queryRaw `SELECT * FROM "public"."contract_data" LIMIT 5`;
        // use ORM to filter
        // Don't write raw query everytime. Use ORM
        console.table("Available columns:", rows);
        console.log("Connected to PostgreSQL database");
    }
    catch (error) {
        console.error("Failed to connect to database:", error);
    }
});
// Cleanup on exit
process.on("SIGINT", async () => {
    console.log("Shutting down gracefully...");
    if (connectionClose) {
        await connectionClose();
    }
    process.exit(0);
});
process.on("SIGTERM", async () => {
    console.log("Shutting down gracefully...");
    if (connectionClose) {
        await connectionClose();
    }
    process.exit(0);
});
//# sourceMappingURL=index.js.map