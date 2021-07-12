let usuarios = []; //Este es un array de usuarios, son los registrados en la aplicación.
let usuarioIngreso = ""; //Este es el usuario que ingresa
let ejercicios = []; //Estos son los ejercicios planteados.
let idEjercicio = 0; //Este es un id que es uníco para cada ejercicio que se plantea.
let idEntrega = 0;   //Este es el id unico de cada entrega
let ejercicioEntregado = ""; //este es el ejercicio que se está entregando
let ejerciciosEntregados = []; //estos son todos los ejercicios entregados

window.addEventListener("load", inicio);

function inicio() {
  datosPreCargados();
  ocultarTodo();


  document.querySelector("#btnRegistrar").addEventListener("click", registrarUsuario);  
  document.querySelector("#btnContinuar").addEventListener("click", continuarRegistro);
  document.querySelector("#btnIngresar").addEventListener("click", ingresoDeUsuario);
  document.querySelector("#btnVentanaRegistrar").addEventListener("click", verVentanaRegistrar);
  document.querySelector("#btnAsignarNivel").addEventListener("click", asignarNivel);  
  document.querySelector("#btnPlantearEjercicio").addEventListener("click", subirEjercicio);
  document.querySelector("#btnEntregarAudio").addEventListener("click", entregarEjercicio);
  document.querySelector("#buscador").addEventListener("keyup", cargarEjercicios);

}
/**Esta función permite escoger ventanas a ocultar de acuerdo a lo que necesitamos mostrar*/
function ocultarTodo() {

  ocultar("#divRegistro");
  ocultar("#divEjercicios");
  ocultar("#divPlanteoEjercicio");
  ocultar("#divAsignacionNivel");
  ocultar("#divEntregaTarea");
  ocultar("#divFiltro");
  ocultar("#divInformacionEstadisticaAlumno");
  ocultar("#divEjerciciosEntregados");
  ocultar("#divInformacionEstadisticaDocente")
  ocultar("#divEjerciciosResueltos");
  ocultar("#divCorrecionEjerciciosEntregados");
  ocultar("#divMostrarNiveles");
  ocultar("#divInformacionEstadisticaDocente");
  mostrar("#navPrincipal");

}
/**Vaciar campos ingresados para el login*/
function vaciarCampos() {
  document.querySelector("#loginUsuario").value = "";
  document.querySelector("#loginPass").value = "";
}

/**Oculta unicamente los id que pasemos por parametro*/
function ocultar(id) {
  document.querySelector(id).style.display = "none";
}

/**Muestra unicamente los id que pasemos por parametro*/
function mostrar(id) {
  document.querySelector(id).style.display = "block";
}

//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------REGISTRO DE USUARIOS--------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

function continuarRegistro() {
  ocultar("#divSelectTipoUsuario");
  mostrar("#divDatosDeUsuario")
  ocultar("#errorRegistro");

  //vaciamos los campos por si se vuelve a ingresar
  vaciarCamposRegistro()

  let tipoDeUsuario = document.querySelector("#regTipoUsuario").value;
  if (tipoDeUsuario === "A") {
    hacerVisibleDocentes();
  } else {
    ocultar("#labelRegDocente");
    ocultar("#regDocente");
  }


}
/**Si el usuario registrado es un alumno se muestra la lista de docentes registrados para seleccionar*/
function hacerVisibleDocentes() {
  let docentes = "";
  mostrar("#labelRegDocente");
  mostrar("#regDocente");
  /**Agrego docentes a la lista de selección*/
  for (let elemento of usuarios) {
    if (elemento.tipo === "D") {
      docentes += '<option value="' + elemento.id + '">' + elemento.nombre + "(" + elemento.id + ")</option>";
    }
  }
  document.querySelector("#regDocente").innerHTML = docentes;
}

/**Permite el registro de usuarios docente y alumno verificando que se cumplan las condiciones establecidas.
No pueden existir dos usuarios iguales La contraseña debe contener al menos 4 caracteres, 1 minúscula, 1 mayúscula y 1 número
Si el tipo de usuario es alumno deberá asignarse un docente*/
function registrarUsuario() {
  let usuarioReg = document.querySelector("#regUsuario").value.toUpperCase();
  let contraseñaReg = document.querySelector("#regPass").value;
  let nombreReg = document.querySelector("#regNombre").value;
  let tipo = "D";
  let nivel = "";
  let docente = "";
  let error = "";

  if (comprobarSiUsuarioExiste(usuarioReg)) {
    error = "El usuario ya existe<br>";
  }

  if (usuarioReg.length === 0) {
    error += "Debe ingresar un usuario<br>";
  }

  error += comprobarPass(contraseñaReg);

  /**Si seleccionó que es alumno debe tener un docente asignado*/
  docente = document.querySelector("#regDocente").value;
  tipo = document.querySelector("#regTipoUsuario").value;


  if (tipo == "A" && docente == "") {
    error += "Debe seleccionar un docente<br>"
  }

  if (error != "") {
    document.querySelector("#errorRegistro").innerHTML = error;
    mostrar("#errorRegistro");
  } else {
    document.querySelector("#errorRegistro").innerHTML = "";
    ocultar("#errorRegistro")
    if (tipo == "A") { //Datos que son solo del alumno     
      nivel = "1";
    } else {
      docente = "";
      nivel = "";
    }

    crearUsuario(usuarioReg, nombreReg, contraseñaReg, tipo, nivel, docente);
    mostrar("#divIngreso");
    ocultar("#divRegistro");
    vaciarCamposRegistro()
  }
}

function vaciarCamposRegistro() {
  usuarioReg = document.querySelector("#regUsuario").value = "";
  contraseñaReg = document.querySelector("#regPass").value = "";
  nombreReg = document.querySelector("#regNombre").value = "";
}

/**Comprueba que el usuario que se esté creando no haya sido creado anteriormente*/
function comprobarSiUsuarioExiste(user) {
  /*Acá hay que recorre el vector de usuarios  para ver si ya existe*/
  let yaExiste = false;
  for (let i = 0; i < usuarios.length && !yaExiste; i++) {
    if (usuarios[i].id === user) {
      yaExiste = true;
    }
  }
  return yaExiste;
}

/**Comprueba que la contraseña contenga un mínimo de 4 caracteres, 1 mayúscula, 1 minúscula y 1 número*/
function comprobarPass(pass) {
  //Se comprueba que la contraseña cumpla con los parámetros:
  let resultado = ""; //Correcta
  let codigo = 0;
  let tieneMin = "N";
  let tieneMay = "N";
  let tieneNum = "N";
  let tiene4Letras = "";
  if (pass.length < 4) {
    tiene4Letras = "N"; //No cumple largo de 4
  }

  for (let i = 0; i < pass.length; i++) {
    codigo = pass.charCodeAt(i);
    if (codigo >= 97 && codigo <= 118) {
      tieneMin = "S";
    }
    if (codigo >= 65 && codigo <= 90) {
      tieneMay = "S";
    }
    if (codigo >= 48 && codigo <= 57) {
      tieneNum = "S";
    }
  }

  if (tiene4Letras === "N") {
    resultado = "La contraseña debe tener mínimo 4 caracteres<br>";
  }

  if (tieneMin === "N") {
    resultado += "La contraseña debe tener al menos una minúscula<br>";
  }
  if (tieneMay === "N") {
    resultado += "La contraseña debe tener al menos una mayúscula<br>";
  }
  if (tieneNum === "N") {
    resultado += "La contraseña debe tener al menos un número<br>";
  }
  return resultado;
}

function verVentanaRegistrar() {
  document.querySelector("#loginUsuario").value = "";
  document.querySelector("#loginPass").value = "";
  ocultar("#divIngreso");
  ocultar("#divDatosDeUsuario");
  mostrar("#divRegistro");
  mostrar("#divSelectTipoUsuario")
}


//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------INGRESO DE USUARIOS--------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

/**Comprueba que el usuario a logearse exista y permite el ingreso al menú que corresponda según tipo de usuario
Oculta ventana de ingreso */
function ingresoDeUsuario() {
  let loginUsuario = document.querySelector("#loginUsuario").value.toUpperCase();
  let loginPass = document.querySelector("#loginPass").value;
  let usuarioRegistrado = false;
  let tipo = "";

  for (let elemento of usuarios) {
    if (elemento.id === loginUsuario && elemento.pass === loginPass) {
      usuarioRegistrado = true;
      tipo = elemento.tipo;
      usuarioIngreso = new usuario(
        elemento.id,
        elemento.nombre,
        elemento.pass,
        elemento.tipo,
        elemento.nivel,
        elemento.docente
      );
      ocultar("#divIngreso");
      cargarMenu(tipo);
      mostrar("#contenedor");
    }
  }
  if (!usuarioRegistrado) {
    alert("Usuario no registrado");
  }
}


//Retorna a ventana ingreso de usuario 
function salir() {
  ocultarTodo();
  document.querySelector("#navPrincipal").innerHTML = "";
  mostrar("#divIngreso");
  vaciarCampos();
}

//Carga menú según tipo de usuario
function cargarMenu(tipoUsuario) {
  let menuAmostrar = "";
  ocultarTodo();
  if (tipoUsuario === "A") {
    menuAmostrar = '<li onclick="cargarEjercicios()" > <a>' + "Ver ejercicios planteados y entregar" + "</a> </li>";
    menuAmostrar += '<li onclick="verVentanaEjerciciosResueltos()"> <a>' + "Ver ejercicios resueltos" + "</a> </li>";
    menuAmostrar += '<li onclick="infromacionEstedisticaAlumno()"> <a>' + "Informacion estadistica" + "</a> </li>";
    cargarEjercicios();//Carga ejercicios pendientes de realizar para el alumno en pantalla principal
  } else {
    menuAmostrar = '<li onclick="verVentanaAsignarNivel()"> <a id="btnAsignarNivel">' + "Asignar nivel alumno" + "</a> </li>";
    menuAmostrar += '<li onclick="verVentanaPlanteoEjercicio()"> <a>' + "Plantear ejercicios" + "</a> </li>";
    menuAmostrar += '<li onclick="cargarEjerciciosEntregados()"> <a>' + "Realizar devoluciones" + "</a> </li>";
    menuAmostrar += '<li onclick="informacionEstadisticaDocente()"> <a>' + "Informacion estadistica" + "</a> </li>";
    cargarEjerciciosEntregados();//Carga ejercicios entregados para el docente en pantalla principal
  }
  menuAmostrar += '<li onclick="salir()" > <a>' + "Salir." + "</a> </li>";

  document.querySelector("#navPrincipal").innerHTML = menuAmostrar;
}

//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------MENU DOCENTE /  Asignacion Nivel -------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

function verVentanaAsignarNivel() {
  ocultarTodo();
  mostrar("#divAsignacionNivel");
  let alumnos = '<option value="0">Seleccione</option>';
  for (let elemento of usuarios) {
    if (elemento.tipo === "A" && elemento.docente === usuarioIngreso.id) {
      alumnos +=
        '<option value="' +
        elemento.id +
        '">' +
        elemento.nombre +
        "(" +
        elemento.id +
        ")</option>";
    }
  }
  document.querySelector("#regAlumnos").innerHTML = alumnos;
}

function mostrarNiveles() {
  if (document.querySelector("#regAlumnos").value == "0") {
    ocultar("#divMostrarNiveles");

  } else {

    mostrar("#divMostrarNiveles");
    let id_alumno_seleccionado = document.getElementById("regAlumnos").value;

    let niveles_a_mostrar = "";

    for (let elemento of usuarios) {
      if (id_alumno_seleccionado === elemento.id) {
        let nivel_alumno = elemento.nivel;

        switch (nivel_alumno) {
          case "1":
            niveles_a_mostrar += "<option value=2> Intermedio </option>";
            niveles_a_mostrar += "<option value=3> Avanzado </option>";
            break;

          case "2":
            niveles_a_mostrar = "<option value=3> Avanzado </option>";
            break;

          case "3":
            ocultar("#divMostrarNiveles");
            alert("El nivel del alumno es Avanzado, no se permite reducir el nivel del mismo");
            break;

          default:
            break;
        }
        document.querySelector("#regNiveles").innerHTML = niveles_a_mostrar;
      }
    }
  }
}

function asignarNivel() {
  let id_alumno_seleccionado = document.getElementById("regAlumnos").value;
  let nivel_nuevo = document.getElementById("regNiveles").value;
  for (let elemento of usuarios) {
    if (id_alumno_seleccionado === elemento.id) {
      if (elemento.nivel === "1" && nivel_nuevo === "3") {
        alert("Solo se puede subir un nivel");
      } else {
        elemento.nivel = nivel_nuevo;
        alert("Se ha cambiado el nivel del alumno: " + id_alumno_seleccionado);
        ocultarTodo();
        cargarEjerciciosEntregados();

      }
    }
  }
}

//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------VISTA- DE EJERCICIOS Planteados -Alumno-----------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

function cargarEjercicios() {
  document.querySelector("#divEjercicios").innerHTML = "";

  ocultarTodo();
  mostrar("#divFiltro");
  mostrar("#divEjercicios");
  document.querySelector("#divEjercicios").innerHTML = '<p id="noHayEjercicios"></p>';
  let nombre_a_buscar = document.getElementById("buscador").value.toUpperCase();
  let listaAMostrar = buscarEjercicio(nombre_a_buscar);
  if (listaAMostrar.length == 0) {
    let mensaje = "No hay resultados que coincidan con su busqueda";
    if (nombre_a_buscar == "") {
      mensaje = "No hay ejercicios planteados."
    }
    document.querySelector("#noHayEjercicios").innerHTML = mensaje;

  } else {
    document.querySelector("#noHayEjercicios").innerHTML = "";
    for (let elemento of listaAMostrar) {
      if (elemento.docente === usuarioIngreso.docente && elemento.nivel === usuarioIngreso.nivel) {
        agregarEjercicioAPantalla(
          elemento.id,
          elemento.titulo,
          elemento.imagen,
          elemento.descripcion
        );
      }
    }
  }
}

function buscarEjercicio(nombre_a_buscar) {
  //Devuelve los ejercicios que  cumplen con el filtro.

  let listaAMostrar = [];
  encontro = false;

  for (let elemento of ejercicios) {
    //alert("elemento.docente " +elemento.docente + "_" + usuarioIngreso.docente + " niv= " + elemento.nivel +" _ = " + usuarioIngreso.nivel);    
    if (elemento.docente === usuarioIngreso.docente && elemento.nivel === usuarioIngreso.nivel && elemento.titulo.toUpperCase().includes(nombre_a_buscar)) {
      encontro = true;
      listaAMostrar.push(elemento);
    }
  }

  if (encontro == false) {
    for (let elemento of ejercicios) {
      if (
        elemento.docente === usuarioIngreso.docente &&
        elemento.nivel === usuarioIngreso.nivel &&
        elemento.descripcion.toUpperCase().includes(nombre_a_buscar)
      ) {
        listaAMostrar.push(elemento);
      }
    }
  }
  return listaAMostrar;
}

function mostrarSubirEntrega(id) {

  ocultarTodo();
  mostrar("#divEntregaTarea");

  let encontre = false;
  let titulo = "";
  let docente = "";
  let descripcion = "";
  let imagen = "";
  for (let i = 0; i < ejercicios.length && !encontre; i++) {
    if (ejercicios[i].id == id) {
      ejercicioEntregado = ejercicios[i];
      encontre = true;
      titulo = ejercicioEntregado.titulo;
      docente = ejercicioEntregado.docente;
      descripcion = ejercicioEntregado.descripcion;
      imagen = ejercicioEntregado.imagen;
    }
  }

  document.querySelector("#tituloEjercicio").innerHTML = titulo;
  document.querySelector("#descripcionEjercicio").innerHTML = descripcion;
  let divImagen = '<img src="img/';
  divImagen += imagen;
  divImagen += '" alt="imagen"></img>';
  document.querySelector("#imagenEjercicio").innerHTML = divImagen;


}

function agregarEjercicioAPantalla(id, titulo, imagen, descripcion) {
  /*Esta funcion recibe un ejercicio y lo agrega al div vistaEjercicio para verlo en la pantalla, 
    Debe recibir:
    -Titulo
    -Descripción
    -Ruta de imagen
    -id del ejercicio para luego hacer la entrega */

  let yaEntrego = false;
  let descripcionBoton = "Realizar entrega"
  let habilitado = ""
  //Verifico si el alumno ya hizo una entrega para esa tarea:
  for (let i = 0; i < ejerciciosEntregados.length && !yaEntrego; i++) {
    if (ejerciciosEntregados[i].usuario.id == usuarioIngreso.id && ejerciciosEntregados[i].ejercicio.id == id) {
      habilitado = "disabled";
      descripcionBoton = "Ya se realizó entrega."
      yaEntrego = true;
    }
  }

  let htmlEjercicio = "<div id=ejercicio" + id;
  htmlEjercicio += ' > <h5 id="titEjercicio">' + titulo;
  htmlEjercicio += '</h5><p id="ejercicioDescripcion">' + descripcion;
  htmlEjercicio += '</p><img src="img/' + imagen;
  htmlEjercicio += '" alt="" id="ejercicioImagen"><br><input type="button" value="' + descripcionBoton + '" id="btnRealizarEntrega" onclick="mostrarSubirEntrega(' + id;
  htmlEjercicio += ')" ' + habilitado + ' ></div>';
  document.querySelector("#divEjercicios").innerHTML += htmlEjercicio;
}





//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------VER EJERCICIOS RESUELTOS - ALUMNO---------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
function verVentanaEjerciciosResueltos() {
  if (ejerciciosEntregados.length == 0) {
    alert("No se entregó ningun ejercicio.");
  } else {
    ocultarTodo();
    mostrar("#divEjerciciosResueltos");

    let id = "";
    let titulo = "";
    let descripcion = "";
    let imagen = "";
    let docente = "";
    let nivel = "";
    let audio = "";
    let usuario = usuarioIngreso.nombre;
    let devolucion = "";
    let corregido = "";

    //Recorro el arreglo de Ejercicios Entregados
    document.querySelector("#divEjerciciosResueltos").innerHTML = "";
    for (let i = 0; i < ejerciciosEntregados.length; i++) {
      //Si el ejercicio entrega es del alumno ingresado, entonces llamo a la funcion que muestra los ejercicios entregados del mismo
      if ((ejerciciosEntregados[i].usuario.id == usuarioIngreso.id)) {
        id = ejerciciosEntregados[i].ejercicio.id;
        titulo = ejerciciosEntregados[i].ejercicio.titulo;
        descripcion = ejerciciosEntregados[i].ejercicio.descripcion;
        imagen = ejerciciosEntregados[i].ejercicio.imagen;
        docente = ejerciciosEntregados[i].ejercicio.docente;
        nivel = ejerciciosEntregados[i].ejercicio.nivel;
        audio = ejerciciosEntregados[i].audio;
        devolucion = ejerciciosEntregados[i].devolucion;
        corregido = ejerciciosEntregados[i].corregido;

        cargarEjerciciosResueltoAPantalla(id, titulo, descripcion, imagen, docente, nivel, audio, usuario, devolucion, corregido);
      }
    }
  }
}




//Funcion para mostrar en el HTML un ejercicio entregado
function cargarEjerciciosResueltoAPantalla(id, titulo, descripcion, imagen, docente, nivel, audio, _usuario, devolucion, corregid) {
  let htmlEjercicio = "<div id=ejercicio" + id + ">";
  htmlEjercicio += '<h5 id="titEjercicio">' + titulo + "</h5>";
  htmlEjercicio += '<p id="ejercicioDescripcion">' + descripcion + "</p>";
  htmlEjercicio +=
    '<img src="img/' + imagen + '" alt="imagen" id="ejercicioImagen">';
  htmlEjercicio += '<h5 id="docente">Docente: ' + docente + "</h5>";
  htmlEjercicio += '<h5 id="ejercicioNivel">Nivel: ' + nivel + "</h5>";
  htmlEjercicio +=
    '<audio controls><source src="audio/' +
    audio +
    '" type="audio/mpeg">Su navegador no permite el control de audio</audio>';
  htmlEjercicio += '<p id="ejercicioDevolucion">Devolución: ' + devolucion + "</p></div>";
  htmlEjercicio += "<hr>";

  document.querySelector("#divEjerciciosResueltos").innerHTML += htmlEjercicio;
}

function infromacionEstedisticaAlumno() {
  ocultarTodo();
  mostrar("#divInformacionEstadisticaAlumno");

  //Obtengo los ejercicios planteados para su nivel:
  let cantidadEjerciciosPlanteados = 0;
  let cantidadEjerciciosResueltos = 0;
  let cantidadConDevolucion = 0;
  let porcentajeResuelto = 0;
  let cantidadSinDevolucion = 0;
  for (let elemento of ejercicios) {
    if (elemento.nivel === usuarioIngreso.nivel && elemento.docente == usuarioIngreso.docente) {
      cantidadEjerciciosPlanteados += 1;
    }
  }

  //Obtengo la cantidad de ejercicios resueltos:
  for (let elemento of ejerciciosEntregados) {
    if (elemento.usuario.id === usuarioIngreso.id) {
      //Si el ejercicio resuelto es de este usuario
      cantidadEjerciciosResueltos += 1;
      //veo si tiene devolución:
      if (elemento.devolucion != "") {
        cantidadConDevolucion += 1;
      } else {
        cantidadSinDevolucion += 1
      }
    }
  }
  //regla de 3 para sacar el porcentaje
  if (cantidadEjerciciosPlanteados != 0) {
    porcentajeResuelto = (cantidadEjerciciosResueltos * 100) / cantidadEjerciciosPlanteados;
  }

  //Agrego resultados a pantalla:
  document.querySelector("#porcentajeEjResueltos").innerHTML = "El porcentaje de ejercicios resueltos es %" + porcentajeResuelto;
  document.querySelector("#ejerciciosConSinDevolucion").innerHTML = "De un total de " + cantidadEjerciciosResueltos + " resueltos, " + cantidadConDevolucion +
    " recibieron devolución y " + cantidadSinDevolucion + " no recibieron devolución";
}

//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------PLANTEO DE EJERCICIOS - DOCENTE-----------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

function verVentanaPlanteoEjercicio() {
  ocultarTodo();
  document.querySelector("#planteoTitulo").value = "";
  document.querySelector("#planteoDescripcion").value = "";
  document.querySelector("#planteoImagen").value = "";
  mostrar("#divPlanteoEjercicio");
}

function subirEjercicio() {
  let max = 200;
  let min = 20;
  let nivel = document.querySelector("#planteoNivel").value;
  let titulo = document.querySelector("#planteoTitulo").value;
  let descripcion = document.querySelector("#planteoDescripcion").value;
  let imagen = document.querySelector("#planteoImagen").value;
  imagen = nombreDeArchivo(imagen); //imagen.replace('C:\\fakepath\\','')
  let id_del_usuario = usuarioIngreso.id;
  let cantcaracteres = titulo.length + descripcion.length;

  if (titulo == "" || descripcion == "" || imagen == "") {//Veo si los campos están vacíos
    alert("No pueden existir campos vacios");
  } else if (cantcaracteres < min || cantcaracteres > max) {
    alert("El total de caracteres entre titulo y descripcion debe estar entre 20 y 200");
  } else {
    crearEjercicio(titulo, descripcion, imagen, id_del_usuario, nivel);
    alert("Tarea agregada.")

    document.querySelector("#planteoTitulo").value = "";
    document.querySelector("#planteoDescripcion").value = "";
    document.querySelector("#planteoImagen").value = "";
    cargarEjerciciosEntregados();
  }

}

//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------Entrega DE EJERCICIOS - Alumno--------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

function entregarEjercicio() {
  let audio = nombreDeArchivo(document.querySelector("#audio").value);
  audio = nombreDeArchivo(audio);
  if (audio == "") {
    alert("Debe seleccionar un audio.");
  } else {
    crearEntregaDeEjercicio(ejercicioEntregado, audio, usuarioIngreso, "", "N");
    document.querySelector("#audio").value = "";
    alert("Entrega agregada");
    ocultarTodo();

    cargarEjercicios()
  }
}

function nombreDeArchivo(ruta) {
  let ultimaBarra = ruta.lastIndexOf("\\");
  return ruta.substring(ultimaBarra + 1);
}

//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------INFO ESTADISTICA - DOCENTE-----------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
function informacionEstadisticaDocente() {
  document.querySelector("#totalEjerciciosDelAlumno").innerHTML = "";
  ocultarTodo();
  mostrar("#divInformacionEstadisticaDocente");
  let nombreMayor = "";
  let cantidadEjerciciosMayor = 0;
  let idUsuarioActual="";

  //Obtego el usuario con mas ejercicios entregados
  //Obtengo cada nombre de usuario de los ejercicios entregados y los comparo con el mismo arreglo para obtener la cantidad de ejercicios resueltos. 
  for(i = 0 ; i<usuarios.length; i++){
    if(usuarios[i].docente===usuarioIngreso.id && usuarios[i].tipo == "A"){
      let contador=0;
      idUsuarioActual=usuarios[i].id;
      for(y=0;y<ejerciciosEntregados.length;y++){
        if(ejerciciosEntregados[y].usuario.id===idUsuarioActual){
          contador++;
        }
      }
      if(cantidadEjerciciosMayor<contador){
        nombreMayor=usuarios[i].nombre;
        cantidadEjerciciosMayor=contador;
      }
    }
  }



  document.querySelector("#alumnosConMayorEjercicios").innerHTML = "El nombre del usuario con más ejercicios entregados es: " + nombreMayor + " con una cantidad de ejercicios de: " + cantidadEjerciciosMayor;




  //Obtengo la cantidad de ejercicios entregados para el docente
  cantidadEjerciciosParaDocente = 0;
  for (elemento of ejerciciosEntregados) {
    if ((elemento.ejercicio.docente == usuarioIngreso.id)) {
      cantidadEjerciciosParaDocente++;
    }
  }

  document.querySelector("#cantidadDeEjercicios").innerHTML = "La cantidad de ejercicios entregados para el docente es: " + cantidadEjerciciosParaDocente;

  mostrar("#divMostrarAlumnos")
  let alumnos = "";
  for (let elemento of usuarios) {
    if (elemento.tipo === "A" && elemento.docente === usuarioIngreso.id) {
      alumnos += '<option value="' + elemento.id + '">' + elemento.nombre + '(' + elemento.id + ')</option>';
    }
    document.querySelector("#regAlumnosInformacion").innerHTML = alumnos;
  }
}

function MostrarTotalEjercicios() {
  let id_alumno_seleccionado = document.querySelector("#regAlumnosInformacion").value;
  let nivel_alumno_seleccionado = "";
  //Obtengo el nivel del alumno seleccionado
  for (elemento of usuarios) {
    if (id_alumno_seleccionado === elemento.id) {
      nivel_alumno_seleccionado = elemento.nivel;
    }
  }

  //Muestro la cantidad de ejercicios planteados para el nivel del alumno
  cantidad_de_ejercicios_planteados = 0;
  for (elemento of ejercicios) {
    if (elemento.nivel == nivel_alumno_seleccionado && elemento.docente===usuarioIngreso.id) {
      cantidad_de_ejercicios_planteados++;
    }
  }

  //Muestro cantidad de ejercicios entregados
  let cantidad_de_ejercicios_entregados = 0;
  for (elemento of ejerciciosEntregados) {
    if (elemento.usuario.id == id_alumno_seleccionado && elemento.ejercicio.nivel == nivel_alumno_seleccionado) {
      cantidad_de_ejercicios_entregados++;
    }
  }

  document.querySelector("#totalEjerciciosDelAlumno").innerHTML = "De un total de " + cantidad_de_ejercicios_planteados + " ejercicios planteados para su nivel, el alumno entrego un total de " + cantidad_de_ejercicios_entregados;


}


//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------DEVOLUCION DE TAREAS- DOCENTE-----------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//



function cargarEjerciciosEntregados() {
  //Esta función carga todos los ejercicios que entregaron los alumnos del docente con el que se ingresó:

  document.querySelector("#divEjerciciosEntregados").innerHTML = '<p id = "noHayEjercicioEntregado"><p>';
  ocultarTodo();
  mostrar("#divEjerciciosEntregados");

  if (ejerciciosEntregados.length == 0) {
    document.querySelector("#noHayEjercicioEntregado").innerHTML = "No hay ejercicios entregados para dar devolución.";
  } else {
    document.querySelector("#noHayEjercicioEntregado").innerHTML = "";
    let ejerciciosCargadosAPantalla = false;
    for (elemento of ejerciciosEntregados) {
      if (elemento.ejercicio.docente === usuarioIngreso.id && elemento.corregido != "S") {
        agregarEjercicioEntregadoAPantalla(elemento.id, elemento.ejercicio.titulo, elemento.audio, elemento.usuario, elemento.devolucion, elemento.corregido);
        ejerciciosCargadosAPantalla = true;
      }
    }
    if (!ejerciciosCargadosAPantalla) {
      document.querySelector("#noHayEjercicioEntregado").innerHTML = "No hay ejercicios entregados para dar devolución.";
    }


  }
}




function agregarEjercicioEntregadoAPantalla(ejercicioID, titulo, audio, usuario, devolucion, corregido) {
  let corregir = "Corregir";

  let htmlEjercicio = "<div id=ejercicio" + ejercicioID + ">";
  htmlEjercicio = '<h5 id="ejercicioTitulo">' + titulo + '</h5>';
  htmlEjercicio += '<audio controls><source src="audio/' + audio + '" type="audio/mpeg">Su navegador no permite el control de audio</audio>';
  htmlEjercicio += '<h5 id="usuarioEjercicio">Nombre de Usuario: ' + usuario.nombre + '</h5>';
  htmlEjercicio += '</h5 id="devolucionEjercicio"> Devolucion: ' + devolucion + '</h5>';
  htmlEjercicio += '<h5 id="corregidoEjercicio"> Corregido: ' + corregido + '</h5><br>';
  //Por si en algun momento se permite cambiar la devolución.
  /*if(corregido==="S"){
    corregir="Modificar devolución"
  }*/
  htmlEjercicio += '<input type="button" value="' + corregir + '" id="btnCorregirEntrega" onclick="corregirEntrega(' + ejercicioID;
  htmlEjercicio += ')"><hr></div>';
  document.querySelector("#divEjerciciosEntregados").innerHTML += htmlEjercicio
}




function corregirEntrega(idEntrega) {
  //Esta función muestra un ejercicio en específico que se quiere corregir, se recibe el id de la entrega
  ocultarTodo();
  document.querySelector("#divCorrecionEjerciciosEntregados").innerHTML = "";
  mostrar("#divCorrecionEjerciciosEntregados");
  let htmlCorrecion = "";


  for (entrega of ejerciciosEntregados) {
    if (entrega.id == idEntrega) {
      htmlCorrecion = '<div id="ejercicioAEntregar' + entrega.id + '">';
      htmlCorrecion += '<h5> <p>' + entrega.ejercicio.titulo + '</p></h5>';
      htmlCorrecion += '<audio controls><source src="audio/' + entrega.audio + '" type="audio/mpeg">Su navegador no permite el control de audio</audio>';
      htmlCorrecion += '</h5><p id="usuarioEjercicio">Nombre de Usuario: ' + entrega.usuario.nombre;
      htmlCorrecion += '<hr></div>';
    }

  }


  htmlCorrecion += '<label for="calificacion">Ingrese devolución:</label>';
  htmlCorrecion += '<textarea id="calificacion" name="calificacion"></textarea><br>';
  htmlCorrecion += '<input type="button" value="Calificar" id="btnCalificar" name="btnCalificar" onclick="calificarEntrega(';
  htmlCorrecion += idEntrega + ')">'
  document.querySelector("#divCorrecionEjerciciosEntregados").innerHTML += htmlCorrecion;


}





function calificarEntrega(idEntrega) {
  let devolucion = document.querySelector("#calificacion").value;

  if (devolucion == "") {
    alert("Ingrese una devolución.")
  } else {
    for (entrega of ejerciciosEntregados) {
      if (entrega.id === idEntrega) {
        agregaDevolucionATarea(entrega, devolucion);
        alert("Se asigno una devolución a la tarea");
        cargarEjerciciosEntregados();
      }
    }
  }
}

function agregaDevolucionATarea(entrega, devolucion) {
  entrega.corregido = "S"
  entrega.devolucion = devolucion;
  ocultar("#divCorrecionEjerciciosEntregados")
}


//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------Se crean los objetos y se agregan al vector------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//


function crearUsuario(user, nombre, pass, tipo, nivel, docente) {
  usuarios.push(new usuario(user, nombre, pass, tipo, nivel, docente));
}

function crearEjercicio(titulo, descripcion, imagen, docente, nivel) {
  ejercicios.push(new ejercicio(titulo, descripcion, imagen, docente, nivel));
}

function crearEntregaDeEjercicio(ejercicio, audio, usuario, devolucion, corregido) {
  ejerciciosEntregados.push(new EjerciciosEntregados(ejercicio, audio, usuario, devolucion, corregido));
}


//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------DATOS PRE-CARGADOS----------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

function datosPreCargados() {
  //Cargo 2 docentes:
  crearUsuario("doc1", "Docente 1", "1234aB", "D", "", "");
  crearUsuario("doc2", "Docente 2", "1234aB", "D", "", "");
  crearUsuario("doc3", "Docente 3", "1234aB", "D", "", "");
  //Cargo 2 alumnos:
  crearUsuario("alum1", "Alumno 1", "1234aB", "A", "1", "doc1");
  crearUsuario("alum2", "Alumno 2", "1234aB", "A", "1", "doc1");
  crearUsuario("alum3", "Alumno 3", "1234aB", "A", "3", "doc3");
  //Cargo ejercicios
  crearEjercicio("Este es el titulo del Ejercicio 1", "esta es la descripción del ejercicio", "ej1.png", "doc1", "1");
  crearEjercicio("Este es el titulo del Ejercicio 2", "esta es la descripción del ejercicio", "ej2.png", "doc1", "1");
  crearEjercicio("Este es el titulo del Ejercicio 3", "esta es la descripción del ejercicio", "ej3.png", "doc1", "1");
  crearEjercicio("Este es el titulo del Ejercicio 4", "esta es la descripción del ejercicio", "ej4.png", "doc1", "1");
  crearEjercicio("Este es el titulo del Ejercicio 5", "esta es la descripción del ejercicio", "ej5.png", "doc1", "2");
  crearEjercicio("Este es el titulo del Ejercicio 6", "esta es la descripción del ejercicio", "ej6.png", "doc1", "1");
  //Agrego etregas:
  crearEntregaDeEjercicio(ejercicios[0], "ej1.m4a", usuarios[3], "", "N");
  crearEntregaDeEjercicio(ejercicios[0], "ej2.m4a", usuarios[4], "", "N");
  //Agrego devolución:
  agregaDevolucionATarea(ejerciciosEntregados[0], "Excelente tarea, cumplio con los requisitos y esta listo para seguir con el resto de tareas");
}