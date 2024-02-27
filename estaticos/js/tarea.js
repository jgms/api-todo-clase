class Tarea{
    constructor(id,textoTarea,estado,contenedor){
        this.id = id;
        this.textoTarea = textoTarea;
        this.DOM = null;//componente HTML
        this.editando = false;
        this.crearComponente(estado,contenedor);
    }
    crearComponente(estado,contenedor){
        this.DOM = document.createElement("div");
        this.DOM.classList.add("tarea");

        //texto
        let textoTarea = document.createElement("h2");
        textoTarea.classList.add("visible");
        textoTarea.innerText = this.textoTarea;

        //input
        let inputTarea = document.createElement("input");
        inputTarea.setAttribute("type","text");
        inputTarea.value = this.textoTarea;

        //boton editar
        let botonEditar = document.createElement("button");
        botonEditar.classList.add("boton");
        botonEditar.innerText = "editar";

        botonEditar.addEventListener("click", () => this.editarTarea());

        //boton borrar
        let botonBorrar = document.createElement("button");
        botonBorrar.classList.add("boton");
        botonBorrar.innerText = "borrar";

        
        botonBorrar.addEventListener("click",() => this.borrarTarea());

        //boton estado
        let botonEstado = document.createElement("button");
        botonEstado.classList.add("estado", estado ? "terminada" : null);
        botonEstado.appendChild(document.createElement("span"));

        botonEstado.addEventListener("click", () => {
            this.toggleEstado().then(({resultado}) =>{ 
                if(resultado == "ok"){
                    return botonEstado.classList.toggle("terminada");
                }
                console.log("error actualizando");
            });
        });

        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(inputTarea);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);
        contenedor.appendChild(this.DOM);
    }
    borrarTarea(){
        fetch("/api-todo/borrar/" + this.id, {
            method : "DELETE"
        })
        .then(respuesta => respuesta.json())
        .then(({resultado}) => {
            if(resultado == "ok"){
                return this.DOM.remove();
            }
            console.log("..error al borrar");
        });
        
    }
    toggleEstado(){
        return fetch(`/api-todo/actualizar/${this.id}/2`,{
            method : "PUT"
        })
        .then(respuesta => respuesta.json());
    }
    async editarTarea(){
        if(this.editando){
            //guardar
            let textoTemporal = this.DOM.children[1].value;

            if(textoTemporal.trim() != "" && textoTemporal.trim() != this.textoTarea){
                let {resultado} = await fetch(`https://api-todo-clase.onrender.com/api-todo/actualizar/${this.id}/1`,{
                                            method : "PUT",
                                            body : JSON.stringify({ tarea : textoTemporal.trim() }),
                                            headers : {
                                                "Content-type" : "application/json"
                                            }
                                        })
                                        .then(respuesta => respuesta.json());
                if(resultado == "ok"){
                    this.textoTarea = textoTemporal;
                }                        
            }


            this.DOM.children[0].innerText = this.textoTarea;
            this.DOM.children[0].classList.add("visible");
            this.DOM.children[1].classList.remove("visible");
            this.DOM.children[2].innerText = "editar";
            this.editando = false;
        }else{
            //editar
            this.DOM.children[0].classList.remove("visible");
            this.DOM.children[1].value = this.textoTarea;
            this.DOM.children[1].classList.add("visible");
            this.DOM.children[2].innerText = "guardar";
            this.editando = true;
        }
    }
}