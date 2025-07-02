// import swaggerAutogen from "swagger-autogen";
const swaggerAutogen = require("swagger-autogen");

const doc = {
  info: {
    title: "Auto Service Api",
    description: "Automatically generated Swagger docs",
    version: "1.0.0",
  },
  host: "localhost:6001",
  schema: ["http"],
};

const outputFile = "./swagger-output.json";
const endPointsFiles = ["./routes/auth.router.ts"];

swaggerAutogen()(outputFile, endPointsFiles, doc);
