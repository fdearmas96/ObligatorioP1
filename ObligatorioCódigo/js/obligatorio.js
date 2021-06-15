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
  document.querySelector("#regEsAlumno").addEventListener("click", hacerVisibleDocentes);

  document.querySelector("#btnIngresar").addEventListener("click", ingresoDeUsuario);
  document.querySelector("#btnVentanaRegistrar").addEventListener("click", verVentanaRegistrar);
  document.querySelector("#btnAsignarNivel").addEventListener("click", asignarNivel);
  document.querySelector("#btnMostrarNiveles").addEventListener("click", mostrarNiveles);
  document.querySelector("#btnPlantearEjercicio").addEventListener("click", subirEjercicio);
  document.querySelector("#btnEntregarAudio").addEventListener("click", entregarEjercicio);
  document.querySelector("#buscador").addEventListener("keyup", cargarEjercicios);

  document.querySelector("#btnMostrarTotalEjercicios").addEventListener("click", MostrarTotalEjercicio());
}

function ocultarTodo() {
  ocultar("#divEjercicios");
  ocultar("#divPlanteoEjercicio");
  ocultar("#divAsignacionNivel");
  ocultar("#divEntregaTarea");
  ocultar("#divFiltro");
  ocultar("#divInformacionEstadisticaAlumno");
  ocultar("#EjerciciosResueltos");
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

function hacerVisibleDocentes() {
  let estaTildado = document.querySelector("#regEsAlumno").checked;
  let docentes = "";
  if (estaTildado) {
    document.querySelector("#labelRegDocente").style.display = "block";
    document.querySelector("#regDocente").style.display = "block";
    /*Agrego docentes a la lista de selección*/
    for (let elemento of usuarios) {
      if (elemento.tipo === "D") {
        docentes +='<option value="' + elemento.id +'">' + elemento.nombre +"(" + elemento.id +")</option>";
        }
    }
    document.querySelector("#regDocente").innerHTML = docentes;
  } else {
    document.querySelector("#labelRegDocente").style.display = "none";
    document.querySelector("#regDocente").style.display = "none";
  }
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
    hayError = true;
  }

  if (usuarioReg.length === 0) {
    error += "Debe ingresar un usuario<br>";
    hayError = true;
  }
  error += comprobarPass(contraseñaReg);

  if (error != "") {
    hayError = true;
  }

  if (hayError) {
    document.querySelector("#errorRegistro").innerHTML = error;
    document.querySelector("#errorRegistro").style.display = "block";
  } else {
    document.querySelector("#errorRegistro").innerHTML = "";
    document.querySelector("#errorRegistro").style.display = "none";

    if (document.querySelector("#regEsAlumno").checked) {
      tipo = "A";
      nivel = "1";
      docente = document.querySelector("#regDocente").value;
      console.log(docente);
    }
    
    crearUsuario(usuarioReg, nombreReg, contraseñaReg, tipo, nivel, docente);
    mostrar("#divIngreso");
    ocultar("#divRegistro");
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
  let loginUsuario = document
    .querySelector("#loginUsuario")
    .value.toUpperCase();
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
  mostrar("#divRegistro");
  ocultar("#divIngreso");
}

function salir() {
  ocultarTodo();
  ocultar("#navPrincipal");
  ocultar("#EjerciciosResueltos");
  ocultar("#divInformacionEstadisticaAlumno");
  mostrar("#divIngreso");
  vaciarCampos();
}

function cargarMenu(tipoUsuario) {
  let menuAmostrar = "";
  ocultarTodo();
  if (tipoUsuario === "A") {
    menuAmostrar =
      '<li onclick="cargarEjercicios()" > <a>' +
      "Ver ejercicios planteados y entregar" +
      "</a> </li>";
    menuAmostrar +=
      '<li onclick="verVentanaEjerciciosPlanteados()"> <a>' +
      "Ver ejercicios resueltos" +
      "</a> </li>";
    menuAmostrar +=
      '<li onclick="infromacionEstedisticaAlumno()"> <a>' +
      "Informacion estadistica" +
      "</a> </li>";

    cargarEjercicios();
  } else {
    menuAmostrar =
      '<li onclick="verVentanaAsignarNivel()"> <a id="btnAsignarNivel">' +
      "Asignar nivel alumno" +
      "</a> </li>";
    menuAmostrar +=
      '<li onclick="verVentanaPlanteoEjercicio()"> <a>' +
      "Plantear ejercicios" +
      "</a> </li>";
    menuAmostrar += "<li> <a>" + "Realizar devoluciones" + "</a> </li>";
    menuAmostrar +=
      '<li onclick="informacionEstadisticaDocente()"> <a>' +
      "Informacion estadistica" +
      "</a> </li>";
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
  document.querySelector("#divEjercicios").innerHTML = "";
  let nombre_a_buscar = document.getElementById("buscador").value.toUpperCase();
  listaAMostrar = buscarEjercicio(nombre_a_buscar);
  for (let elemento of listaAMostrar) {
    if (
      elemento.docente === usuarioIngreso.docente &&
      elemento.nivel === usuarioIngreso.nivel
    ) {
      agregarEjercicioAPantalla(
        elemento.id,
        elemento.titulo,
        elemento.imagen,
        elemento.descripcion
      );
    }
  }
}

function buscarEjercicio(nombre_a_buscar) {
  //Devuelve los ejercicios que  cumplen con el filtro.

  let listaAMostrar = [];
  encontro = false;
  for (let elemento of ejercicios) {
    if (
      elemento.docente === usuarioIngreso.docente &&
      elemento.nivel === usuarioIngreso.nivel &&
      elemento.titulo.toUpperCase().includes(nombre_a_buscar)
    ) {
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

 "<div id=ejercicio" + id;
  htmlEjercicio += ' > <h5 id="titEjercicio">' +titulo;
  htmlEjercicio += '</h5><p id="ejercicioDescripcion">' +descripcion;
  htmlEjercicio += '</p><img src="img/' + imagen;
  htmlEjercicio += '" alt="" id="ejercicioImagen"><br><input type="button" value="Realizar entrega" id="btnRealizarEntrega" onclick="mostrarSubirEntrega(' +id;
  htmlEjercicio +=  ')"></div>';
  document.querySelector("#divEjercicios").innerHTML += htmlEjercicio;
}


//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------VER EJERCICIOS PLANTEADOS - ALUMNO---------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
function verVentanaEjerciciosPlanteados() {
  if (ejerciciosEntregados.length == 0) {
    alert("No se entrego ningun ejercicio.");
  } else {
    ocultarTodo();
    mostrar("#EjerciciosResueltos");

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
    document.querySelector("#EjerciciosResueltos").innerHTML = "";
    for (let i = 0; i < ejerciciosEntregados.length; i++) {
      //Si el ejercicio entrega es del alumno ingresado, entonces llamo a la funcion que muestra los ejercicios entregados del mismo
      if ((ejerciciosEntregados[i].ejercicio.usuario = usuarioIngreso)) {
        id = ejerciciosEntregados[i].ejercicio.id;
        titulo = ejerciciosEntregados[i].ejercicio.titulo;
        descripcion = ejerciciosEntregados[i].ejercicio.descripcion;
        imagen = ejerciciosEntregados[i].ejercicio.imagen;
        docente = ejerciciosEntregados[i].ejercicio.docente;
        nivel = ejerciciosEntregados[i].ejercicio.nivel;
        audio = ejerciciosEntregados[i].audio;
        devolucion = ejerciciosEntregados[i].devolucion;
        corregido = ejerciciosEntregados[i].corregido;

        cargarEjerciciosResueltoAPantalla(id,titulo,descripcion,imagen,docente,nivel,audio,usuario,devolucion,corregido);
      }
    }
  }
}

//Funcion para mostrar en el HTML un ejercicio entregado
function cargarEjerciciosResueltoAPantalla(id,titulo,descripcion,imagen,docente,nivel,audio,_usuario,devolucion,corregid) {
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

  document.querySelector("#EjerciciosResueltos").innerHTML += htmlEjercicio;
}

function infromacionEstedisticaAlumno() {
  ocultarTodo();
  mostrar("#divInformacionEstadisticaAlumno");

  //Obtengo los ejercicios planteados para su nivel:
  let cantidadEjerciciosPlanteados = 0;
  let cantidadEjerciciosResueltos = 0;
  let cantidadConDevolucion = 0;
  let porcentajeResuelto = 0;
  for (let elemento of ejercicios) {
    if (elemento.nivel === usuarioIngreso.nivel) {
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
      }
    }
  }
  //regla de 3 para sacar el porcentaje
  if (cantidadEjerciciosPlanteados != 0) {
    porcentajeResuelto = (cantidadEjerciciosResueltos * 100) / cantidadEjerciciosPlanteados;
  }

  //Agrego resultados a pantalla:
  document.querySelector("#porcentajeEjResueltos").innerHTML = "El porcentaje de ejercicios resueltos es %" + porcentajeResuelto;
  document.querySelector("#ejerciciosConSinDevolucion").innerHTML = "De un total de " + cantidadEjerciciosPlanteados + " planteados, " + cantidadConDevolucion +
    " recibieron devolución.";
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
  let nivel = document.querySelector("#planteoNivel").value;
  let titulo = document.querySelector("#planteoTitulo").value;
  let descripcion = document.querySelector("#planteoDescripcion").value;
  let imagen = document.querySelector("#planteoImagen").value;

  imagen = nombreDeArchivo(imagen); //imagen.replace('C:\\fakepath\\','')
  let id_del_usuario = usuarioIngreso.id;

  //ejercicios.push(new ejercicio(titulo,descripcion,imagen,id_del_usuario,nivel));
  crearEjercicio(titulo, descripcion, imagen, id_del_usuario, nivel);
  alert("SUBIO");
}

//------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------PLANTEO DE EJERCICIOS - DOCENTE-----------------------------------------------------//
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
  ocultarTodo();
  mostrar("#divInformacionEstadisticaDocente");
  alert("Funciona");
  let nombreMayor = "";
  let cantidadEjerciciosMayor = 0;

  //Obtengo cada nombre de usuario de los ejercicios entregados y los comparo con el mismo arreglo para obtener la cantidad de ejercicios resueltos. (similar al método burbuja)
  for (i = 0; i < ejerciciosEntregados.length; i++) {
    nombreUsuarioActual = ejerciciosEntregados[i].usuario;
    let contador = 0;
    for (y = 0; y < ejerciciosEntregados.length; i++) {
      if (ejerciciosEntregados[y].usuario == nombreUsuarioActual) {
        contador++;
      }

      if (contador > cantidadEjerciciosMayor) {
        nombreMayor = nombreUsuarioActual;
        cantidadEjerciciosMayor = contador;
      }
    }
  }

  (document.querySelector("#alumnosConMayorEjercicios").innerHTML ="El nombre del usuario con más ejercicios entregados es: " + nombreMayor)," con una cantidad de ejercicios de: " + cantidadEjerciciosMayor;

  cantidadEjerciciosParaDocente = 0;

  for (elemento of ejerciciosEntregados) {
    if ((elemento.ejercicio.docente = usuarioIngreso)) {
      cantidadEjerciciosParaDocente++;
    }
  }
    
  document.querySelector("#cantidadDeEjercicios").innerHeight =
    "La cantidad de ejercicios entregados para el docente es: " +
    cantidadEjerciciosParaDocente;

  for (let elemento of usuarios) {
    if (elemento.tipo === "A" && elemento.docente === usuarioIngreso.id) {
      alumnos +='<option value="' +  elemento.id +'">' +elemento.nombre +"(" +elemento.id +")</option>";
    }
    document.querySelector("#regAlumnosInformacion").innerHTML = alumnos;
  }

  function MostrarTotalEjercicio() {
    let id_alumno_seleccionado = document.querySelector("regAlumnosInformacion").value;
    let nivel_alumno_seleccionado = "";
    //Obtengo el nivel del alumno seleccionado
    for (elemento of usuario) {
      if (id_alumno_seleccionado === elemento[i].id) {
        nivel_alumno_seleccionado = elemento[i].nivel;
      }
    }

    for (elemento of ejercicios) {
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
  crearEjercicio("Este es el titulo del Ejercicio 2","Ejercicio 1 esta es la descripción del ejercicio","ej2.png","doc1","1");
  crearEjercicio("Este es el titulo del Ejercicio 3","esta es la descripción del ejercicio","ej3.png","doc1","1");
  crearEjercicio("Este es el titulo del Ejercicio 4","esta es la descripción del ejercicio","ej4.png","doc1","1");
  crearEjercicio("Este es el titulo del Ejercicio 5","esta es la descripción del ejercicio","ej5.png","doc1","2");
  crearEjercicio("Este es el titulo del Ejercicio 6","esta es la descripción del ejercicio","ej6.png","doc1", "1");
}

function crearUsuario(user, nombre, pass, tipo, nivel, docente) {
  usuarios.push(new usuario(user, nombre, pass, tipo, nivel, docente));
}

function crearEjercicio(titulo, descripcion, imagen, docente, nivel) {
  ejercicios.push(new ejercicio(titulo, descripcion, imagen, docente, nivel));
}

function crearEntregaDeEjercicio(ejercicio,audio,usuario,devolucion,corregido) {
  ejerciciosEntregados.push(new EjerciciosEntregados(ejercicio, audio, usuario, devolucion, corregido));
}
