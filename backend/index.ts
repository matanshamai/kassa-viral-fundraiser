import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import donationsRoutes from "./routes/donations";
import summaryRoutes from "./routes/summary";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/donations", donationsRoutes);
app.use("/summary", summaryRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
