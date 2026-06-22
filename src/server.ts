import express from "express";
import cors from "cors";
import customerRoutes from "./routes/customer";
import transactionRoutes from "./routes/transaction";
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/customers", customerRoutes);
app.use("/api/transactions", transactionRoutes);
// app.use("/api/balances", balanceRoutes);

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// graceful shutdown (خیلی مهم برای prod)
process.on("SIGINT", async () => {
    console.log("Shutting down...");
    server.close(() => process.exit(0));
});