require("dotenv").config();
const express = require("express");
const cors = require("cors");
const  dbConnect  = require("./config/mongo");
const routers = require("./routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", routers);

// Conectar a la base de datos
if (process.env.ENGINE_DB === "nosql") {
  dbConnect(); // Conexión con MongoDB
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

dbConnect();