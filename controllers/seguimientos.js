// Acciones de pruebas 
const pruebaSeguimiento =(req,res)=>{
    return res.status(200).send({
       message: "mensaje enviado desde: Controlador/seguimiento.js"
    });
   }
   //exportar acciones 
   module.exports={
       pruebaSeguimiento
   }