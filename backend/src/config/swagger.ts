import swaggerJsdoc from "swagger-jsdoc";
import type { Options } from "swagger-jsdoc";

const options: Options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Software Security API",
            version: "1.0.0",
            description: "Documentação da API do sistema Software Security."
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor local"
            }
        ]
    },
    apis: ["./src/routes/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;