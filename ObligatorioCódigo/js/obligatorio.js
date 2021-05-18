window.addEventListener("load", inicio);
function inicio(){    
    agregarEjercicio();
    agregarEjercicio();
}

function comprobarPass(pass){
    /*Se comprueba que la contraseña cumpla con los parámetros:
    -Minimo 4 caracteres
    -Una minúscula
    -Una mayúscula
    -Un Número
    */
    let resultado = ""; //Correcta
    let codigo = 0;
    let tieneMin = "";
    let tieneMay = "";
    let tieneNum = "";
    if(pass.length<4){
        resultado = 1//No cumple largo de 4
    }else{
        //Primero ver si tiene una minúscula      
        //después ver si tiene una mayúscula
        //Por último ver si tiene un número
        for (let i = 0; i< pass.length; i++){
            codigo = pass.charCodeAt(i)
            if(codigo >=97 && codigo <= 118){
                tieneMin = 'S';
            }
            if(codigo >=65 && codigo <= 90){
                tieneMay = 'S';
            }
            if(codigo >=48 && codigo <= 57){
                tieneNum = 'S';
            }            
        }

    }
}


function agregarEjercicio(){
    /*Esta funcion recibe un ejercicio y lo agrega al div vistaEjercicio, 
    Debe recibir:
    -Titulo
    -Descripción
    -Ruta de imagen
    -id del ejercicio?    
    */
    let htmlEjercicio ='<h5 id="titEjercicio"></h5><label for="ejercicioDescripcion">Descripción</label><p id="ejercicioDescripcion"></p><img src="" alt="" id="ejercicioImagen"><input type="button" value="Realizar entrega" id="btnRealizarEntrega">'    
    let anterior = document.querySelector("#vistaEjercicio").value;
    document.querySelector("#vistaEjercicio").innerHTML += htmlEjercicio;
}
