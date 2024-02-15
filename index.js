require("dotenv").config();
const express = require("express");

const servidor = express();

servidor.use("/pruebas",express.static("./pruebas_api"));

servidor.get("/api-todo", (peticion,respuesta) => {
    respuesta.send("método GET");
});

servidor.post("/api-todo", (peticion,respuesta) => {
    respuesta.send("método POST");
});

servidor.put("/api-todo", (peticion,respuesta) => {
    respuesta.send("método PUT");
});

servidor.delete("/api-todo", (peticion,respuesta) => {
    respuesta.send("método DELETE");
});

servidor.use((peticion,respuesta) => {
    respuesta.json({ error : "not found" });
});


servidor.listen(process.env.PORT);