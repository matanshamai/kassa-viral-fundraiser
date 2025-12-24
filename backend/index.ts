import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import donationsRoutes from "./routes/donations";
import summaryRoutes from "./routes/summary";
import { errorHandler } from "./middleware/errorHandler";
import { prisma } from "./lib/prisma";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/donations", donationsRoutes);
app.use("/summary", summaryRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

const server = app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
