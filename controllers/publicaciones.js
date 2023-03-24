const publicacion=require("../models/publicacion")

// Acciones de pruebas 
const pruebaPublicaciones =(req,res)=>{
    return res.status(200).send({
       message: "mensaje enviado desde: Controlador/PUBLICACIONES.JS"
    });
   }
   //exportar acciones 
   module.exports={
       pruebaPublicaciones
   }