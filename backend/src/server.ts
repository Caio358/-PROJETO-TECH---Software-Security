import pool from "./config/database";
import express from "express";
import cors from "cors";
import sensorRoutes from "./routes/sensorRoutes";
import sensorReadingRoutes from "./routes/sensorReadingRoutes";
import sensorOccurrenceRoutes from "./routes/sensorOccurrenceRoutes";
import alertRoutes from "./routes/alertRoutes";
import emergencyProtocolRoutes from "./routes/emergencyProtocolRoutes";
import simulatorRoutes from "./routes/simulatorRoutes";
import mlRoutes from "./routes/mlRoutes";
import chatRoutes from "./routes/chatRoutes";
import residenceConfigRoutes from "./routes/residenceConfigRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import 'dotenv/config';


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/sensores", sensorRoutes);
app.use("/leituras", sensorReadingRoutes);
app.use("/ocorrencias", sensorOccurrenceRoutes);
app.use("/alertas", alertRoutes);
app.use("/protocolos-emergencia", emergencyProtocolRoutes);
app.use("/simulador", simulatorRoutes);
app.use("/ml", mlRoutes);
app.use("/chat", chatRoutes);
app.use("/configuracao-residencia", residenceConfigRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Primeira rota
app.get("/", (req, res) => {
    res.json({
        sistema: "Software Security",
        mensagem: "API funcionando corretamente!",
        status: "ONLINE"
    });
});

app.get("/db-status", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            sistema: "Software Security",
            banco: "PostgreSQL",
            status: "CONECTADO",
            horario_servidor: result.rows[0].now
        });

    } catch (error) {
        console.error("Erro na conexão:", error);

        res.status(500).json({
            sistema: "Software Security",
            banco: "PostgreSQL",
            status: "ERRO NA CONEXÃO"
        });
    }
});

// Inicialização do servidor
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});