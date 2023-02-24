const express = require('express');
const router=express.Router();
const PublicacionController=require("../controllers/publicaciones");

//definir  rutas
router.get("/prueba-publicacion",PublicacionController.pruebaPublicaciones);

//exportar router
module.exports= router;
