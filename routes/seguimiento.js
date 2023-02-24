const express = require('express');
const router=express.Router();
const SeguimientoController=require("../controllers/seguimientos");

//definir  rutas
router.get("/prueba-seguimiento",SeguimientoController.pruebaSeguimiento);

//exportar router
module.exports= router;
