let usuarios = [];
window.addEventListener("load", inicio);
function inicio(){
    ocultar("#divRegistro");
    document.querySelector("#btnRegistrar").addEventListener("click", registrarUsuario);
    document.querySelector("#regEsAlumno").addEventListener("click", hacerVisibleDocentes);

    document.querySelector("#btnIngresar").addEventListener("click", ingresoDeUsuario);
    document.querySelector("#btnVentanaRegistrar").addEventListener("click", verVentanaRegistrar);    
    
}

function ocultar(id){    
    document.querySelector(id).style.display = "none";
}

function mostrar(id){
    document.querySelector(id).style.display = "block";
}

//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------REGISTRO DE USUARIOS--------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
function hacerVisibleDocentes(){
    let estaTildado = document.querySelector('#regEsAlumno').checked;
    let docentes = "";
    if(estaTildado){
        document.querySelector("#labelRegDocente").style.display = 'block';   
        document.querySelector("#regDocente").style.display = 'block';
        /*Agrego docentes a la lista de selección*/        
        for (elemento of usuarios){
            if(elemento.tipo==="D"){
                docentes += '<option value="' + elemento.id +'">' + elemento.nombre +'(' + elemento.id + ')</option>';                
            }
            
        }
        document.querySelector("#regDocente").innerHTML = docentes;
           
    }else{
        document.querySelector("#labelRegDocente").style.display = 'none';   
        document.querySelector("#regDocente").style.display = 'none'; 
    }
}
function registrarUsuario(){
    let usuarioReg = document.querySelector("#regUsuario").value.toUpperCase();
    let contraseñaReg = document.querySelector("#regPass").value;
    let nombreReg = document.querySelector("#regNombre").value;
    let tipo = 'D';
    let nivel = "";
    let docente = "";    
    if(comprobarSiUsuarioExiste(usuarioReg)){
        alert("El usuario ya existe");
    }else{
        let error = comprobarPass(contraseñaReg);
        if (error != ""){
            document.querySelector("#errorRegistro").innerHTML = error;
            document.querySelector("#errorRegistro").style.display = 'block';   
        }else{
            document.querySelector("#errorRegistro").innerHTML = "";        
            document.querySelector("#errorRegistro").style.display = 'none';
            
            if(document.querySelector('#regEsAlumno').checked){
                tipo = "A";
                nivel = "1";
                docente = document.querySelector("#regDocente").value;
                console.log(docente);
            }

            usuarios.push(new altaDeUsuario(usuarioReg, nombreReg, contraseñaReg, tipo,nivel,docente));
            mostrar("#divIngreso");
            ocultar("#divRegistro");
        }
    }   
}



function comprobarSiUsuarioExiste(user){
    /*Acá hay que recorrer los vectores o objetos para ver si el usuario ya existe*/
    let yaExiste = false;
    for (elemento of usuarios){
        if(elemento.id===user){
            yaExiste = true;
        }
    }
    return yaExiste;
}

function altaDeUsuario(user, nombre,  pass, tipo, nivel, docente){
    this.id = user;
    this.nombre = nombre
    this.pass = pass;
    this.tipo = tipo; //D:Docente - A:Alumno
    this.nivel = nivel;
    this.docente = docente;
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
    let tieneMin = "N";
    let tieneMay = "N";
    let tieneNum = "N";
    let tiene4Letras= "";
    if(pass.length<4){
        tiene4Letras = "N"//No cumple largo de 4
    }
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

    
    if (tiene4Letras==="N"){
        resultado = "La contraseña debe tener mínimo 4 caracteres<br>";
    }

    if (tieneMin==="N"){
        resultado += "La contraseña debe tener al menos una minúscula</br>";
    }
    if (tieneMay==="N"){
        resultado += "La contraseña debe tener al menos una mayúscula</br>";
    }
    if (tieneNum==="N"){
        resultado += "La contraseña debe tener al menos un número";
    }
    return resultado;
}

//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------INGRESO DE USUARIOS--------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

function ingresoDeUsuario(){
    let loginUsuario = document.querySelector("#loginUsuario").value.toUpperCase();
    let loginPass = document.querySelector("#loginPass").value;
    let usuarioRegistrado = false;
    let tipo = "";

    for(elemento of usuarios){
        if (elemento.id === loginUsuario && elemento.pass === loginPass){
            usuarioRegistrado = true;
            tipo = elemento.tipo;
        }
    }    
    if(usuarioRegistrado){
        ocultar("#divIngreso");        
    }else{
        alert('Usuario no registrado');
    }
}

function verVentanaRegistrar(){
    document.querySelector("#loginUsuario").value = "";
    document.querySelector("#loginPass").value = "";
    mostrar("#divRegistro");
    ocultar("#divIngreso");
}




//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------VISTA DE EJERCICIOS---------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

function agregarEjercicio(){
    /*Esta funcion recibe un ejercicio y lo agrega al div vistaEjercicio para verlo en la pantalla, 
    Debe recibir:
    -Titulo
    -Descripción
    -Ruta de imagen
    -id del ejercicio para luego hacer la entrega? por el título es tedioso    
    */
    let htmlEjercicio ='<h5 id="titEjercicio"></h5><label for="ejercicioDescripcion">Descripción</label><p id="ejercicioDescripcion"></p><img src="" alt="" id="ejercicioImagen"><input type="button" value="Realizar entrega" id="btnRealizarEntrega">'        
    document.querySelector("#vistaEjercicio").innerHTML += htmlEjercicio;
}









