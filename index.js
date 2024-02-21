require("dotenv").config();
const express = require("express");
const {getTareas,crearTarea,borrarTarea,actualizarEstado,actualizarTexto} = require("./db");
const {json} = require("body-parser");

const servidor = express();

servidor.use(json());

servidor.use("/pruebas",express.static("./pruebas_api"));

servidor.get("/api-todo", async (peticion,respuesta) => {
    try{
        let tareas = await getTareas();

        respuesta.json(tareas);
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.post("/api-todo/crear", async (peticion,respuesta,siguiente) => {
    
    let {tarea} = peticion.body;

    if(tarea && tarea.trim() != ""){
        try{
            let id = await crearTarea({tarea});
            return respuesta.json({id});
        }catch(error){
            respuesta.status(500);
            return respuesta.json(error);
        }
       
    }

    siguiente({ error : "falta el argumento tarea en el objeto JSON" });
    
});

servidor.put("/api-todo/actualizar/:id([0-9]+)/:operacion(1|2)", async (peticion,respuesta,siguiente) => {
    
    let operacion = Number(peticion.params.operacion);

    let operaciones = [actualizarTexto,actualizarEstado];

    let {tarea} = peticion.body;

    if(operacion == 1 && (!tarea || tarea.trim() == "")){
        return siguiente({ error : "falta el argumento tarea en el objeto JSON" }); 
    }

    try{
        let cantidad = await operaciones[operacion - 1](peticion.params.id, operacion == 1 ? tarea : null);
        respuesta.json({ resultado : cantidad ? "ok" : "ko" });
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }

});

servidor.delete("/api-todo/borrar/:id([0-9]+)", async (peticion,respuesta) => {
    try{
        let cantidad = await borrarTarea(peticion.params.id);
        respuesta.json({ resultado : cantidad ? "ok" : "ko" });
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "not found" });
});

servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "petición no válida" });
});


servidor.listen(process.env.PORT);