const express = require('express');
const router=express.Router();
const SeguimientoController=require("../controllers/seguimientos");
const auth=require("../middlewares/auth");

//definir  rutas
router.get("/prueba-seguimiento",SeguimientoController.pruebaSeguimiento);
router.post("/guardar",auth.auth,SeguimientoController.guardar);
router.delete("/dejarSeguir/:id",auth.auth, SeguimientoController.dejarSeguir);
router.get("/siguiendo/:id?/:pagina?",auth.auth,SeguimientoController.siguiendo);
router.get("/seguidores/:id?/:pagina?",auth.auth,SeguimientoController.seguidores);
//exportar router
module.exports= router;
