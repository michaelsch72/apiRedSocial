// importar dependencias
const jwt=require("jwt-simple")
const moment=require("moment");
const usuario = require("../models/usuario");

//clave secreta
const clave_secreta="clave _secreta_del_proyecto";

//crear una funcion para generar tokens
const crearToken=(usuario)=>{
    const payload={
        id:usuario.id,
        name:usuario.name,
        apellido:usuario.apellido,
        nick:usuario.nick,
        correo:usuario.correo,
        rol:usuario.rol,
        imagen :usuario.imagen,
        iat:moment().unix(),
        exp:moment().add(30,"days").unix()

    };
    //devolver jwt token codificado 
    return jwt.encode(payload,clave_secreta);

}
module.exports={
    clave_secreta,
    crearToken
}

