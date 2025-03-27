require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { dbConnectNoSql } = require("./config/mongo");
const authRoutes = require("./models/routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", authRoutes);

// Conectar a la base de datos
if (process.env.ENGINE_DB === "nosql") {
  dbConnectNoSql(); // Conexión con MongoDB
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
