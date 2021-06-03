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
