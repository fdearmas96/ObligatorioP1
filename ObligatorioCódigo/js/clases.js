//Constructor Usuarios
class usuario{
    constructor(user, nombre,  pass, tipo, nivel, docente){ 
    this.id = user.toUpperCase();
    this.nombre = nombre
    this.pass = pass;
    this.tipo = tipo; //D:Docente - A:Alumno
    this.nivel = nivel;
    this.docente = docente.toUpperCase();    
    }
}

class ejercicio{
    
    constructor(titulo, descripcion, imagen, docente, nivel){
        idEjercicio++;
        this.id = idEjercicio;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.docente = docente.toUpperCase();
        this.nivel = nivel;
    }
}

class EjerciciosEntregados{

    constructor(ejercicio, audio,usuario,devolucion,corregido){
        this.ejercicio=ejercicio;
        this.audio=audio;
        //this.docente=docente; se guarda el ejercicio en si por lo tanto ya se puede tener el docente
        this.usuario=usuario;
        this.devolucion=devolucion;
        this.corregido=corregido;
    }
}


