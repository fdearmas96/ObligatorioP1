let usuarios = [];       //Este es un array de usuarios, son los registrados en la aplicación.
let usuarioIngreso = ""; //Este es el usuario que ingresa
let ejercicios = [];     //Estos son los ejercicios planteados.
let idEjercicio = 0;     //Este es un id que es uníco para cada ejercicio que se plantea.
window.addEventListener("load", inicio);
function inicio(){
    datosPreCargados();
    ocultarTodo();//Primer se oculta todo y se deja visible el login.
    document.querySelector("#btnRegistrar").addEventListener("click", registrarUsuario);
    document.querySelector("#regEsAlumno").addEventListener("click", hacerVisibleDocentes);

    document.querySelector("#btnIngresar").addEventListener("click", ingresoDeUsuario);
    document.querySelector("#btnVentanaRegistrar").addEventListener("click", verVentanaRegistrar);    
    document.querySelector("#btnVerAsignarNivel").addEventListener("click", verVentanaAsignarNivel);   
    document.querySelector("#btnAsignarNivel").addEventListener("click", asignarNivel);

    document.querySelector("#btnVerEjerciciosPlanteados").addEventListener("click", cargarEjercicios);
    
}

function ocultarTodo(){
    ocultar("#divRegistro");
    ocultar("#divMenuDocente");
    ocultar("#divMenuAlumno");
    ocultar("#divAsignacionNivel");
    ocultar("#contenedor");
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
        usuarios.push(new altaDeUsuario(usuarioReg, nombreReg, contraseñaReg, tipo,nivel,docente));
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

//Constructor Usuarios
 function altaDeUsuario(user, nombre,  pass, tipo, nivel, docente){
    this.id = user.toUpperCase();
    this.nombre = nombre
    this.pass = pass;
    this.tipo = tipo; //D:Docente - A:Alumno
    this.nivel = nivel;
    this.docente = docente.toUpperCase(); 
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
            usuarioIngreso = new altaDeUsuario(elemento.id, elemento.nombre, elemento.pass, elemento.tipo, elemento.nivel,elemento.docente);
            ocultar("#divIngreso");          

            if(elemento.tipo==="D"){
                mostrar("#divMenuDocente");              
            }else{
                mostrar("#divMenuAlumno");
            }
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

function asignarNivel(){
    let id_alumno_seleccionado = document.getElementById("regAlumnos").value;
    let nivel_nuevo=document.getElementById("regNiveles").value;    
    for(elemento of usuarios){
        if(id_alumno_seleccionado===elemento.id){                 
            if(elemento.nivel>nivel_nuevo){
                alert("No se puede cambiar el nivel a uno inferior.")
            }else{ 
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
function altaEjercicios(titulo, descripcion, imagen, docente, nivel){
    idEjercicio ++;
    this.id = idEjercicio;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.docente = docente.toUpperCase();
    this.nivel = nivel;
}



function cargarEjercicios(){
    console.log("Cargar ejercicios")
    for(elemento of ejercicios){
        console.log(elemento.docente)
        console.log(usuarioIngreso.docente)
        if(elemento.docente===usuarioIngreso.docente && elemento.nivel === usuarioIngreso.nivel){
            console.log("agregoAPantalla");
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
    let htmlEjercicio ='<h5 id="titEjercicio">'+titulo+'</h5><p id="ejercicioDescripcion">'+descripcion+'</p><img src="'+imagen+'" alt="" id="ejercicioImagen"><input type="button" value="Realizar entrega" id="btnRealizarEntrega">'        
    document.querySelector("#divEjercicios").innerHTML += htmlEjercicio;
}







//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------DATOS PRE-CARGADOS----------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

function datosPreCargados(){
    //Cargo 2 docentes:
    usuarios.push(new altaDeUsuario("doc1", "Docente 1", "1234aB", "D","",""));
    usuarios.push(new altaDeUsuario("doc2", "Docente 2", "1234aB", "D","",""));
    usuarios.push(new altaDeUsuario("doc3", "Docente 3", "1234aB", "D","",""));
    //Cargo 2 alumnos:
    usuarios.push(new altaDeUsuario("alum1", "Alumno 1", "1234aB", "A","1","doc1"));
    usuarios.push(new altaDeUsuario("alum2", "Alumno 2", "1234aB", "A","2","doc2"));
    usuarios.push(new altaDeUsuario("alum3", "Alumno 3", "1234aB", "A","3","doc3"));
    //Cargo ejercicios
    ejercicios.push(new altaEjercicios("Este es el titulo del Ejercicio 1", "esta es la descripción del ejercicio", "img/ej1.png", "doc1", "1"));
    ejercicios.push(new altaEjercicios("Este es el titulo del Ejercicio 2", "esta es la descripción del ejercicio", "img/ej2.png", "doc1", "1"));
    ejercicios.push(new altaEjercicios("Este es el titulo del Ejercicio 3", "esta es la descripción del ejercicio", "img/ej3.png", "doc1", "1"));
    ejercicios.push(new altaEjercicios("Este es el titulo del Ejercicio 4", "esta es la descripción del ejercicio", "img/ej4.png", "doc1", "1"));
    ejercicios.push(new altaEjercicios("Este es el titulo del Ejercicio 5", "esta es la descripción del ejercicio", "img/ej5.png", "doc1", "2"));
    ejercicios.push(new altaEjercicios("Este es el titulo del Ejercicio 6", "esta es la descripción del ejercicio", "img/ej6.png", "doc1", "1"));
    

    //Cargo entregas    

}
