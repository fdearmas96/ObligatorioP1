let usuarios = [];       //Este es un array de usuarios, son los registrados en la aplicación.
let usuarioIngreso = ""; //Este es el usuario que ingresa
let ejercicios = [];     //Estos son los ejercicios planteados.
let idEjercicio = 0;     //Este es un id que es uníco para cada ejercicio que se plantea.
window.addEventListener("load", inicio);
function inicio(){
    datosPreCargados();
   
    document.querySelector("#btnRegistrar").addEventListener("click", registrarUsuario);
    document.querySelector("#regEsAlumno").addEventListener("click", hacerVisibleDocentes);

    document.querySelector("#btnIngresar").addEventListener("click", ingresoDeUsuario);
    document.querySelector("#btnVentanaRegistrar").addEventListener("click", verVentanaRegistrar);    
    document.querySelector("#btnVerAsignarNivel").addEventListener("click", verVentanaAsignarNivel);   
    document.querySelector("#btnAsignarNivel").addEventListener("click", asignarNivel);
    document.querySelector("#btnMostrarNiveles").addEventListener("click", mostrarNiveles);
    document.querySelector("#btnVerEjerciciosPlanteados").addEventListener("click", cargarEjercicios);
    document.querySelector("#btnPlantearEjercicio").addEventListener("click", subirEjercicio)                                                                        
}



function vaciarCampos(){

    document.querySelector("#loginUsuario").value="";
    document.querySelector("#loginPass").value="";

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
    let error = "";
    let hayError = false;
    if(comprobarSiUsuarioExiste(usuarioReg)){
        error = "El usuario ya existe<br>";
        hayError = true;
    }     
        
    if (usuarioReg.length===0){
        error += "Debe ingresar un usuario<br>";
        hayError = true;
    }
    error += comprobarPass(contraseñaReg);

    if (error != ""){
        hayError = true;              
    }

    if(hayError){
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
        usuarios.push(new usuario(usuarioReg, nombreReg, contraseñaReg, tipo,nivel,docente));
        mostrar("#divIngreso");
        ocultar("#divRegistro");
    }
       
}



function comprobarSiUsuarioExiste(user){
    /*Acá hay que recorrer los vectores o objetos para ver si el usuario ya existe*/
    let yaExiste = false;
    for (let i = 0; i <  usuarios.length && !yaExiste; i++){
        if(usuarios[i].id===user){
            yaExiste = true;
        }
    }
    return yaExiste;
}




function comprobarPass(pass){
    //Se comprueba que la contraseña cumpla con los parámetros:
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
        resultado += "La contraseña debe tener al menos una minúscula<br>";
    }
    if (tieneMay==="N"){
        resultado += "La contraseña debe tener al menos una mayúscula<br>";
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
            usuarioIngreso = new usuario(elemento.id, elemento.nombre, elemento.pass, elemento.tipo, elemento.nivel,elemento.docente);
            ocultar("#divIngreso");          

            if(elemento.tipo==="D"){
                mostrar("#divMenuDocente");              
            }else{
                mostrar("#divMenuAlumno");
            }
            cargarMenu(tipo)
            mostrar("#contenedor");
        }
    }    
    if(!usuarioRegistrado){
        alert('Usuario no registrado');  
    }
}

function verVentanaRegistrar(){
    document.querySelector("#loginUsuario").value = "";
    document.querySelector("#loginPass").value = "";
    mostrar("#divRegistro");
    ocultar("#divIngreso");
}

//Función para cerrar el menu alumno y su contenedor
function salirMenuAlumno(){
ocultar("#divMenuAlumno");
ocultar("#contenedor");
ocultar("#divVentanaPlanteoEjercicio()")
mostrar("#divIngreso");

vaciarCampos();
}

//Función para cerrar el menu docente y su contenedor
function salirMenuDocente(){
    ocultar("#divMenuDocente");
    ocultar("#contenedor");
    mostrar("#divIngreso");
    vaciarCampos();
    }
    




function cargarMenu(tipoUsuario){
let menuAmostrar = "";

    if(tipoUsuario==="A"){
        menuAmostrar = '<li onclick="cargarEjercicios()" > <a>'+"Ver ejercicios planteados y entregar"+'</a> </li>';
        menuAmostrar+= '<li> <a>'+"Ver ejercicios resueltos"+'</a> </li>';
        menuAmostrar+= '<li> <a>'+"Informacion estadistica"+'</a> </li>';
        menuAmostrar+= '<li onclick="salirMenuAlumno()" > <a>'+"Salir"+'</a> </li>';
        cargarEjercicios();
    }else{
        menuAmostrar = '<li onclick="verVentanaAsignarNivel()"> <a id="btnAsignarNivel">'+"Asignar nivel alumno"+'</a> </li>';
        menuAmostrar+= '<li onclick="verVentanaPlanteoEjercicio()"> <a>'+"Plantear ejercicios"+'</a> </li>';
        menuAmostrar+= '<li> <a>'+"Realizar devoluciones"+'</a> </li>'; 
        menuAmostrar+= '<li> <a>'+"Informacion estadistica"+'</a> </li>';
        menuAmostrar+= '<li onclick="salirMenuDocente()"> <a>'+"Salir"+'</a> </li>';
      
    }
 
    document.querySelector("#navPrincipal").innerHTML=menuAmostrar;
}

//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------MENU DOCENTE----------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

function verVentanaAsignarNivel(){
    ocultar("#divMenuDocente");
    mostrar("#divAsignacionNivel");
    let alumnos="";
    for (elemento of usuarios){
        if(elemento.tipo==="A" && elemento.docente ===usuarioIngreso.id){
            alumnos += '<option value="' + elemento.id +'">' + elemento.nombre +'(' + elemento.id + ')</option>';                
        }
    }   
    document.querySelector("#regAlumnos").innerHTML = alumnos;
}

function mostrarNiveles(){
    mostrar("#divMostrarNiveles")
    let id_alumno_seleccionado = document.getElementById("regAlumnos").value;

    let niveles_a_mostrar=""; 

    for(elemento of usuarios){
        if(id_alumno_seleccionado===elemento.id){
            let nivel_alumno=elemento.nivel;

            switch (nivel_alumno) {
                case '1':
                    niveles_a_mostrar += '<option value=2> Intermedio </option>'
                    niveles_a_mostrar += '<option value=3> Avanzado </option>'
                    break;

                 case '2':
                     niveles_a_mostrar = '<option value=3> Avanzado </option>'
                     break;

                 case '3':
                     ocultar("#divNivelesAsignar")
                     alert("El nivel del alumno es Avanzado, no se permite reducir el nivel del mismo");
                        break;
                 
                default:
                    break;
            }
            document.querySelector("#regNiveles").innerHTML=niveles_a_mostrar;

        }
    }
}

function asignarNivel(){
    let id_alumno_seleccionado = document.getElementById("regAlumnos").value;
    let nivel_nuevo=document.getElementById("regNiveles").value;    
    for(elemento of usuarios){
        if(id_alumno_seleccionado===elemento.id){        
            if(elemento.nivel==="1" && nivel_nuevo==="3"){
                alert("Solo se puede subir un nivel");
            }         else{ 
                elemento.nivel = nivel_nuevo;              
                alert("Se ha cambiado el nivel del alumno: "+id_alumno_seleccionado);
            }
            }
        }
    }    




//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------VISTA-PLANTEO DE EJERCICIOS-----------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//


//Constructor de ejercicio:



function cargarEjercicios(){
    document.querySelector("#divEjercicios").innerHTML = "";
    for(elemento of ejercicios){
        if(elemento.docente===usuarioIngreso.docente && elemento.nivel === usuarioIngreso.nivel){    
            agregarEjercicioAPantalla(elemento.titulo, elemento.imagen, elemento.descripcion);
        }
    }
}

function agregarEjercicioAPantalla(titulo,imagen,descripcion){
    /*Esta funcion recibe un ejercicio y lo agrega al div vistaEjercicio para verlo en la pantalla, 
    Debe recibir:
    -Titulo
    -Descripción
    -Ruta de imagen
    -id del ejercicio para luego hacer la entrega? por el título es tedioso    
    */
    let htmlEjercicio ='<h5 id="titEjercicio">'+titulo+'</h5><p id="ejercicioDescripcion">'+descripcion+'</p><img src="img/'+imagen+'" alt="" id="ejercicioImagen"><input type="button" value="Realizar entrega" id="btnRealizarEntrega">'        
    document.querySelector("#divEjercicios").innerHTML += htmlEjercicio;
}


//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------PLANTEO DE EJERCICIOS - DOCENTE-----------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

function verVentanaPlanteoEjercicio(){
    mostrar("#divPlanteoEjercicio");
}

function subirEjercicio(){
    let nivel=document.querySelector("#planteoNivel").value;
    let titulo=document.querySelector("#planteoTitulo").value;
    let descripcion=document.querySelector("#planteoDescripcion").value;
    let imagen = document.querySelector("#planteoImagen").value;

    imagen=imagen.replace('C:\\fakepath\\','')
    let id_del_usuario= usuarioIngreso.id;

   ejercicios.push(new ejercicio(titulo,descripcion,imagen,id_del_usuario,nivel));
   alert("SUBIO")
}




//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------DATOS PRE-CARGADOS----------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

function datosPreCargados(){
    //Cargo 2 docentes:
    usuarios.push(new usuario("doc1", "Docente 1", "1234aB", "D","",""));
    usuarios.push(new usuario("doc2", "Docente 2", "1234aB", "D","",""));
    usuarios.push(new usuario("doc3", "Docente 3", "1234aB", "D","",""));
    //Cargo 2 alumnos:
    usuarios.push(new usuario("alum1", "Alumno 1", "1234aB", "A","1","doc1"));
    usuarios.push(new usuario("alum2", "Alumno 2", "1234aB", "A","2","doc2"));
    usuarios.push(new usuario("alum3", "Alumno 3", "1234aB", "A","3","doc3"));
    //Cargo ejercicios
    ejercicios.push(new ejercicio("Este es el titulo del Ejercicio 1", "esta es la descripción del ejercicio", "ej1.png", "doc1", "1"));
    ejercicios.push(new ejercicio("Este es el titulo del Ejercicio 2", "esta es la descripción del ejercicio", "ej2.png", "doc1", "1"));
    ejercicios.push(new ejercicio("Este es el titulo del Ejercicio 3", "esta es la descripción del ejercicio", "ej3.png", "doc1", "1"));
    ejercicios.push(new ejercicio("Este es el titulo del Ejercicio 4", "esta es la descripción del ejercicio", "ej4.png", "doc1", "1"));
    ejercicios.push(new ejercicio("Este es el titulo del Ejercicio 5", "esta es la descripción del ejercicio", "ej5.png", "doc1", "2"));
    ejercicios.push(new ejercicio("Este es el titulo del Ejercicio 6", "esta es la descripción del ejercicio", "ej6.png", "doc1", "1"));
    

    //Cargo entregas    

}
