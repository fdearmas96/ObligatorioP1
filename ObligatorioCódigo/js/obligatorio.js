let usuarios = []; //Este es un array de usuarios, son los registrados en la aplicación.
let usuarioIngreso = ""; //Este es el usuario que ingresa
let ejercicios = []; //Estos son los ejercicios planteados.
let idEjercicio = 0; //Este es un id que es uníco para cada ejercicio que se plantea.
let ejercicioEntregado = ""; //este es el ejercicio que se está entregando
let ejerciciosEntregados = []; //estos son todos los ejercicios entregados
window.addEventListener("load", inicio);
function inicio() {
  ocultarTodo();
  datosPreCargados();

  document.querySelector("#btnRegistrar").addEventListener("click", registrarUsuario);
  //document.querySelector("#regEsAlumno").addEventListener("click", hacerVisibleDocentes);
  document.querySelector("#btnContinuar").addEventListener("click", continuarRegistro);

  document.querySelector("#btnIngresar").addEventListener("click", ingresoDeUsuario);
  document.querySelector("#btnVentanaRegistrar").addEventListener("click", verVentanaRegistrar);
  document.querySelector("#btnAsignarNivel").addEventListener("click", asignarNivel);
  document.querySelector("#btnMostrarNiveles").addEventListener("click", mostrarNiveles);
  document.querySelector("#btnPlantearEjercicio").addEventListener("click", subirEjercicio);
  document.querySelector("#btnEntregarAudio").addEventListener("click", entregarEjercicio);
  document.querySelector("#buscador").addEventListener("keyup", cargarEjercicios);

}

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
  mostrar("#navPrincipal");

}

function vaciarCampos() {
  document.querySelector("#loginUsuario").value = "";
  document.querySelector("#loginPass").value = "";
}

function ocultar(id) {
  document.querySelector(id).style.display = "none";
}

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
  let tipoDeUsuario = document.querySelector("#regTipoUsuario").value;
  if (tipoDeUsuario === "A") {
    hacerVisibleDocentes();
  }

}

function hacerVisibleDocentes() {
  //let estaTildado = document.querySelector("#regEsAlumno").checked;
  let docentes = "";
  document.querySelector("#labelRegDocente").style.display = "block";
  document.querySelector("#regDocente").style.display = "block";
  /*Agrego docentes a la lista de selección*/
  for (let elemento of usuarios) {
    if (elemento.tipo === "D") {
      docentes += '<option value="' + elemento.id + '">' + elemento.nombre + "(" + elemento.id + ")</option>";
    }
  }
  document.querySelector("#regDocente").innerHTML = docentes;
}
function registrarUsuario() {
  let usuarioReg = document.querySelector("#regUsuario").value.toUpperCase();
  let contraseñaReg = document.querySelector("#regPass").value;
  let nombreReg = document.querySelector("#regNombre").value;
  let tipo = "D";
  let nivel = "";
  let docente = "";
  let error = "";
  let hayError = false;
  if (comprobarSiUsuarioExiste(usuarioReg)) {
    error = "El usuario ya existe<br>";
    //hayError = true;
  }

  if (usuarioReg.length === 0) {
    error += "Debe ingresar un usuario<br>";
    //hayError = true;
  }
  error += comprobarPass(contraseñaReg);

  //Si seleccionó que es alumno debe tener un docente
  docente = document.querySelector("#regDocente").value;
  tipo = document.querySelector("#regTipoUsuario").value;


  if (tipo == "A" && docente == "") {
    error += "Debe seleccionar un docente<br>"
  }

  if (error != "") {
    document.querySelector("#errorRegistro").innerHTML = error;
    document.querySelector("#errorRegistro").style.display = "block";
  } else {
    document.querySelector("#errorRegistro").innerHTML = "";
    document.querySelector("#errorRegistro").style.display = "none";

    if (tipo == "A") { //Datos que son solo del alumno     
      nivel = "1";
    } else {
      docente = "";
      nivel = "";
    }

    crearUsuario(usuarioReg, nombreReg, contraseñaReg, tipo, nivel, docente);
    mostrar("#divIngreso");
    ocultar("#divRegistro");
    usuarioReg = document.querySelector("#regUsuario").value = "";
    contraseñaReg = document.querySelector("#regPass").value = "";
    nombreReg = document.querySelector("#regNombre").value = "";
  }
}


function comprobarSiUsuarioExiste(user) {
  /*Acá hay que recorrer los vectores o objetos para ver si el usuario ya existe*/
  let yaExiste = false;
  for (let i = 0; i < usuarios.length && !yaExiste; i++) {
    if (usuarios[i].id === user) {
      yaExiste = true;
    }
  }
  return yaExiste;
}

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
  //Primero ver si tiene una minúscula
  //después ver si tiene una mayúscula
  //Por último ver si tiene un número
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
    resultado += "La contraseña debe tener al menos un número";
  }
  return resultado;
}

//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------INGRESO DE USUARIOS--------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

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

function verVentanaRegistrar() {
  document.querySelector("#loginUsuario").value = "";
  document.querySelector("#loginPass").value = "";
  ocultar("#divIngreso");
  ocultar("#divDatosDeUsuario");
  mostrar("#divRegistro");
  mostrar("#divSelectTipoUsuario")
}

function salir() {
  ocultarTodo();
  document.querySelector("#navPrincipal").innerHTML = "";
  mostrar("#divIngreso");
  vaciarCampos();
}

function cargarMenu(tipoUsuario) {
  let menuAmostrar = "";
  ocultarTodo();
  if (tipoUsuario === "A") {
    menuAmostrar = '<li onclick="cargarEjercicios()" > <a>' + "Ver ejercicios planteados y entregar" + "</a> </li>";
    menuAmostrar += '<li onclick="verVentanaEjerciciosResueltos()"> <a>' + "Ver ejercicios resueltos" + "</a> </li>";
    menuAmostrar += '<li onclick="infromacionEstedisticaAlumno()"> <a>' + "Informacion estadistica" + "</a> </li>";

    cargarEjercicios();
  } else {
    menuAmostrar = '<li onclick="verVentanaAsignarNivel()"> <a id="btnAsignarNivel">' + "Asignar nivel alumno" + "</a> </li>";
    menuAmostrar += '<li onclick="verVentanaPlanteoEjercicio()"> <a>' + "Plantear ejercicios" + "</a> </li>";
    menuAmostrar += '<li onclick="cargarEjerciciosEntregados()"> <a>' + "Realizar devoluciones" + "</a> </li>";
    menuAmostrar += '<li onclick="informacionEstadisticaDocente()"> <a>' + "Informacion estadistica" + "</a> </li>";
  }
  menuAmostrar += '<li onclick="salir()" > <a>' + "Salir." + "</a> </li>";

  document.querySelector("#navPrincipal").innerHTML = menuAmostrar;
}

//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------MENU DOCENTE----------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//

function verVentanaAsignarNivel() {
  ocultar("#divMenuDocente");
  mostrar("#divAsignacionNivel");
  let alumnos = "";
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
          ocultar("#divNivelesAsignar");
          alert(
            "El nivel del alumno es Avanzado, no se permite reducir el nivel del mismo"
          );
          break;

        default:
          break;
      }
      document.querySelector("#regNiveles").innerHTML = niveles_a_mostrar;
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
      }
    }
  }
}

//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------VISTA-PLANTEO DE EJERCICIOS-----------------------------------------------------//
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
  //Verifico si el alumno ya hizo una entrega para esa tarea
  let yaEntrego = false;
  for (let i = 0; i < ejerciciosEntregados.length && !yaEntrego; i++) {
    if (ejerciciosEntregados[i].usuario.id == usuarioIngreso.id && ejerciciosEntregados[i].ejercicio.id == id) {
      yaEntrego = true;
    }
  }

  if (yaEntrego) {
    alert("Ya realizó una entrega para este ejercicio")
  } else {

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

}

function agregarEjercicioAPantalla(id, titulo, imagen, descripcion) {
  /*Esta funcion recibe un ejercicio y lo agrega al div vistaEjercicio para verlo en la pantalla, 
    Debe recibir:
    -Titulo
    -Descripción
    -Ruta de imagen
    -id del ejercicio para luego hacer la entrega */


  let htmlEjercicio = "<div id=ejercicio" + id;
  htmlEjercicio += ' > <h5 id="titEjercicio">' + titulo;
  htmlEjercicio += '</h5><p id="ejercicioDescripcion">' + descripcion;
  htmlEjercicio += '</p><img src="img/' + imagen;
  htmlEjercicio += '" alt="" id="ejercicioImagen"><br><input type="button" value="Realizar entrega" id="btnRealizarEntrega" onclick="mostrarSubirEntrega(' + id;
  htmlEjercicio += ')"></div>';
  document.querySelector("#divEjercicios").innerHTML += htmlEjercicio;
}





//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------VER EJERCICIOS PLANTEADOS - ALUMNO---------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
function verVentanaEjerciciosResueltos() {
  if (ejerciciosEntregados.length == 0) {
    alert("No se entrego ningun ejercicio.");
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
      if ((ejerciciosEntregados[i].ejercicio.usuario == usuarioIngreso)) {
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
  htmlEjercicio += '<h5 id="docente">' + docente + "</h5>";
  htmlEjercicio += '<h5 id="ejercicioNivel">' + nivel + "</h5>";
  htmlEjercicio +=
    '<audio controls><source src="audio/' +
    audio +
    '" type="audio/mpeg">Su navegador no permite el control de audio</audio>';
  htmlEjercicio += "<h5>Usuario:" + _usuario + "</h5>";
  htmlEjercicio += '<h5 id="ejercicioDevolucion">' + devolucion + "</h5></div>";
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
    document.querySelector("planteoDescripcion").value = "";
    document.querySelector("#planteoImagen").value = "";
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
    mostrar("#divEjercicios");
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

  //Obtengo cada nombre de usuario de los ejercicios entregados y los comparo con el mismo arreglo para obtener la cantidad de ejercicios resueltos. 
  for (i = 0; i < ejerciciosEntregados.length; i++) {
    nombreUsuarioActual = ejerciciosEntregados[i].usuario.nombre;
    let contador = 0;
    for (y = 0; y < ejerciciosEntregados.length; y++) {
      if (ejerciciosEntregados[y].usuario.nombre == nombreUsuarioActual) {
        contador++;
      }

      if (contador > cantidadEjerciciosMayor) {
        nombreMayor = nombreUsuarioActual;
        cantidadEjerciciosMayor = contador;
      }
    }
  }

  (document.querySelector("#alumnosConMayorEjercicios").innerHTML = "El nombre del usuario con más ejercicios entregados es: " + nombreMayor), " con una cantidad de ejercicios de: " + cantidadEjerciciosMayor;




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
    if (elemento.nivel == nivel_alumno_seleccionado) {
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
  document.querySelector("#divEjerciciosEntregados").innerHTML = "";
  ocultarTodo();
  mostrar("#divEjerciciosEntregados");


  for (elemento of ejerciciosEntregados) {
    if (elemento.ejercicio.docente === usuarioIngreso.id) {
      agregarEjercicioEntregadoAPantalla(elemento.ejercicio, elemento.audio, elemento.usuario, elemento.devolucion, elemento.corregido);
    }
  }

}


function agregarEjercicioEntregadoAPantalla(ejercicio, audio, usuario, devolucion, corregido) {
  let htmlEjercicio = '<div id="ejercicio' + ejercicio.id;
  htmlEjercicio += '"><audio controls><source src="audio/' + audio + '" type="audio/mpeg">Su navegador no permite el control de audio</audio>';
  htmlEjercicio += '</h5><p id="usuarioEjercicio">Nombre de Usuario: ' + usuario.nombre;
  htmlEjercicio += '</h5><p id="devolucionEjercicio"> Devolucion: ' + devolucion;
  htmlEjercicio += '</h5><p id="corregidoEjercicio"> Corregido: ' + corregido;
  htmlEjercicio += '<br><input type="button" value="Corregir" id="btnCorregirEntrega" onclick="corregirEntrega(' + ejercicio.id;
  htmlEjercicio += ')"><hr></div>';
  document.querySelector("#divEjerciciosEntregados").innerHTML += htmlEjercicio;
}


function corregirEntrega(id) {
  ocultarTodo();
  document.querySelector("#divCorrecionEjerciciosEntregados").innerHTML = "";
  mostrar("#divCorrecionEjerciciosEntregados");
  let htmlCorrecion = "";
  for (elemento of ejerciciosEntregados) {
    if (elemento.ejercicio.id = id) {
      htmlCorrecion = '<div id="ejercicio' + elemento.ejercicio.id;
      htmlCorrecion += '"><audio controls><source src="audio/' + elemento.audio + '" type="audio/mpeg">Su navegador no permite el control de audio</audio>';
      htmlCorrecion += '</h5><p id="usuarioEjercicio">Nombre de Usuario: ' + elemento.usuario.nombre;
      htmlCorrecion += '<hr></div>';
    }
  

  htmlCorrecion += '<label for="calificacion">Ingrese devolución:</label>';
  htmlCorrecion += '<textarea id="calificacion" name="calificacion"></textarea><br>';
  htmlCorrecion += '<input type="button" value="Calificar" id="btnCalificar" name="btnCalificar" onclick="calificarEntrega(' + id + ')">'
  document.querySelector("#divCorrecionEjerciciosEntregados").innerHTML += htmlCorrecion;
}
}s

function calificarEntrega(id, devolucion) {
  devolucion = document.querySelector("#calificacion").value;


  for (elemento of ejerciciosEntregados) {
    if (elemento.ejercicio.id === id) {
      elemento.corregido = "S"
      elemento.devolucion = devolucion;
      alert("Se asigno una devolución a la tarea");
      ocultar("#divCorrecionEjerciciosEntregados")
      cargarEjerciciosEntregados();

    }
  }
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
  crearUsuario("alum2", "Alumno 2", "1234aB", "A", "2", "doc2");
  crearUsuario("alum3", "Alumno 3", "1234aB", "A", "3", "doc3");
  //Cargo ejercicios
  crearEjercicio("Este es el titulo del Ejercicio 1", "esta es la descripción del ejercicio", "ej1.png", "doc1", "1");
  crearEjercicio("Este es el titulo del Ejercicio 2", "Ejercicio 1 esta es la descripción del ejercicio", "ej2.png", "doc1", "1");
  crearEjercicio("Este es el titulo del Ejercicio 3", "esta es la descripción del ejercicio", "ej3.png", "doc1", "1");
  crearEjercicio("Este es el titulo del Ejercicio 4", "esta es la descripción del ejercicio", "ej4.png", "doc1", "1");
  crearEjercicio("Este es el titulo del Ejercicio 5", "esta es la descripción del ejercicio", "ej5.png", "doc1", "2");
  crearEjercicio("Este es el titulo del Ejercicio 6", "esta es la descripción del ejercicio", "ej6.png", "doc1", "1");
}

function crearUsuario(user, nombre, pass, tipo, nivel, docente) {
  usuarios.push(new usuario(user, nombre, pass, tipo, nivel, docente));
}

function crearEjercicio(titulo, descripcion, imagen, docente, nivel) {
  ejercicios.push(new ejercicio(titulo, descripcion, imagen, docente, nivel));
}

function crearEntregaDeEjercicio(ejercicio, audio, usuario, devolucion, corregido) {
  ejerciciosEntregados.push(new EjerciciosEntregados(ejercicio, audio, usuario, devolucion, corregido));
}
