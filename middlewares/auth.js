//importar modules 
const jwt=require("jwt-simple");
const moment= require("moment");
const usuario= require("../models/usuario")

// importar clave secreta
const libjwt=require("../servicios/jwt");
const clave_secreta=libjwt.clave_secreta;

// middleware de autenticacion
exports.auth =(req,res,next)=>{
//comprobar si me llega la cabecera de auth
if(!req.headers.authorization){
    return res.status(403).send({
        status:"error",
        message :"la peticion no tiene la cabecera de autenticacion"
    });
}

// decodificar el token
let token =req.headers.authorization.replace(/['"]+/g,'');

try{

    
    let payload=jwt.decode(token,clave_secreta);
    console.log(payload);
    //comprobar expiracion del token
    if(payload.exp<=moment().unix()){
        return res.status(404).send({
            status:"error",
            message:"token expirado",
        });

        
    }
    //agregar datos de usuario a request
     
req.usuario=payload;
}catch(error){
    return res.status(404).send({
        status:"error",
        message:"token invalido",
        error
    });
}
//pasar a ejecucion de accion 
next();
}