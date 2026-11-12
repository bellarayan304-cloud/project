import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Personal Finance Tracker API",
      version: "1.0.0",
      description: "API for tracking personal income, expenses, categories and monthly summaries."
    },
    servers: [
      { url: process.env.API_URL || `http://localhost:${process.env.PORT || 3000}`, description: "Current API server" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter the JWT token returned by /api/auth/login or /api/auth/register."
        }
      }
    }
  },
  apis: ["./routes/*.js"]
};

export default swaggerJsdoc(options);
