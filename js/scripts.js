window.onload = function() {
    //Carga las categorais al cargar la pagina
    procesarCategorias();
    //Añadimos el evento al boton buscar
    var boton = document.getElementById("buscar");
    boton.addEventListener('click', procesarImagenes, false);
};



/**
 * Metodo para realizar una llamada Async/await al metodo cargarCategorias
 */
async function procesarCategorias() {
    try {
        const resultado = await cargarCategorias('https://my-json-server.typicode.com/DWEC-18-19/TheCatApi/categorias');
        console.log(resultado);
    } catch (error) {
        return console.log(error.message);
    }
}

/**
 * Metodo para cargar las categorias en el select
 * @param {type} url reicbe una url por parametro
 * @returns {XMLHttpRequest|cargarCategorias.xhr} devuelve como a finalizado la consulta
 */
function cargarCategorias(url) {    
    var xhr = new XMLHttpRequest(); 
    xhr.open('GET', url, true);
    
    //Se añade el evento para evaluar cuando a finalizado la consulta y si se han devuelto correctamente los datos
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState==4 && this.status == 200) {
            var resultados = eval( '(' +this.responseText+ ')');
            var select = document.getElementById("categorias");
            
            //Se añaden las categorias al select
            for (var i=0;i<resultados.length;i++){
                var option =document.createElement("option");
                option.setAttribute("value", resultados[i]['id']);
                option.innerHTML=resultados[i]['name'];
                select.appendChild(option);
            }
        }
    });
    xhr.send();
    return xhr;
}

/**
 * Metodo para realizar una llamada Async/await al metodo cargarImagenes
 */
async function procesarImagenes() {
    try {
        const resultado = await cargarImagenes();
        console.log(resultado);
    } catch (error) {
        return console.log(error.message);
    }
}

/**
 * Metodo para obtener las imagenes mediante el id seleccionado y cargar las imagenes paginandolas
 * @returns {XMLHttpRequest|cargarImagenes.xhr} devuelve como a finalizado la consulta
 */
function cargarImagenes() {
    var categoria = document.getElementById("categorias").value; //Se obtiene el id de la categoria
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.thecatapi.com/v1/images/search?limit=50&category_ids=" + categoria);
    xhr.setRequestHeader("x-api-key", "8be97cac-c638-4d91-91bb-fcb1bfb4e548"); //Key de la API

    //Se añade el evento para evaluar cuando a finalizado la consulta y si se han devuelto correctamente los datos
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState==4 && this.status == 200) {
            var resultados = eval( '(' +this.responseText+ ')');
            var div = document.getElementById("resultados");
            //Borra las imagenes si ya estuvieran cargas
            div.innerHTML='<img v-for="(gato, index) in gatos" v-show="(pag - 1) * NUM_RESULTS <= index  && pag * NUM_RESULTS > index" :src="gato.url" style="float: left; height: 25%; padding: 10px;" >';
            
            //Carga las imagenes
            new Vue({
                el: '#app',
                data: {
                    NUM_RESULTS: 6, // Numero de resultados por página
                    pag: 1, // Página inicial
                    // JSON a mostrar
                    gatos: resultados
                }
            });
        }
    });
    xhr.send();
    return xhr;
}


