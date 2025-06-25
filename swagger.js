const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Advertisement-Management-API",
    description: "Description",
  },
  host: "advertisement-app-1-gy0x.onrender.com",
  // host: "localhost:8008",
  // schemes: ["https"],
  schemes: ["https"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  // security : [{bearerAuth: [] }],
};

const outputFile = "./swagger-output.json";
const routes = ["./app.js "];

swaggerAutogen(outputFile, routes, doc);
