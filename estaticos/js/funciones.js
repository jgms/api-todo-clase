const contenedorTareas = document.querySelector(".tareas");
const formulario = document.querySelector("form");
const input = document.querySelector('form input[type="text"]');


fetch("/api-todo")
.then(respuesta => respuesta.json())
.then(tareas => {
    tareas.forEach(({id,tarea,terminada}) => {
        new Tarea(id,tarea,terminada,contenedorTareas);
    });
});

formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    if(/^[a-záéíóúñü][a-záéíóúñü0-9 ]*$/i.test(input.value)){
        return fetch("/api-todo/crear",{
            method : "POST",
            body : JSON.stringify({ tarea : input.value }),
            headers : {
                "Content-type" : "application/json"
            }
        })
        .then(respuesta => respuesta.json())
        .then(({id}) => {
            if(id){
                new Tarea(id,input.value.trim(),false,contenedorTareas);
                return input.value = "";
            }
            console.log("..error creando la tarea");
        });
    }
    console.log("..error en el formulario");
});