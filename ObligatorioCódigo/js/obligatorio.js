
/*Se comprueba que la contraseña cumpla con los parámetros:
-Minimo 4 caracteres
-Una minúscula
-Una mayúscula
-Un Número
*/
function comprobarPass(pass){
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
    let html ='<h5 id="titEjercicio"></h5><label for="ejercicioDescripcion">Descripción</label><p id="ejercicioDescripcion"></p><img src="" alt="" id="ejercicioImagen"><input type="button" value="Realizar entrega" id="btnRealizarEntrega">'    
}
