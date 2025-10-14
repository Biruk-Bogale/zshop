import express from "express";
import "./jobs/product-crone.job";
import cors from "cors";
import { errorMiddleware } from "@packages/error-handler/error-middleware";
import cookieParser from "cookie-parser";
import router from "./routes/product.router";
import swaggerUi from "swagger-ui-express";
const swaggerDocument = require("./swagger-output.json");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000","http://localhost:3001"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

// ✅ Increase request body size limits
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "Hello product API" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs-json", (req, res) => {
  res.json(swaggerDocument);
});

// routes
app.use("/api", router);

app.use(errorMiddleware);

const port = process.env.PORT || 6002;
const server = app.listen(port, () => {
  console.log(`Product service is running at http://localhost:${port}/api`);
  console.log(`Swagger Docs availlable at http://localhost:${port}/docs-json`);
});

server.on("error", (err) => {
  console.log("Server Error :", err);
});
