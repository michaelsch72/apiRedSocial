const express = require('express');
const router=express.Router();
const multer = require('multer');
const UsuarioController=require("../controllers/usuario");
const auth=require("../middlewares/auth");



// Configuracion de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./almacenar/avatars/")
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});
//definir  rutas
router.get("/prueba",auth.auth);
router.post("/registro",UsuarioController.registro);
router.post("/login",UsuarioController.login);
router.get("/perfil/:id",auth.auth,UsuarioController.perfil);
router.get("/listar/:page?",auth.auth,UsuarioController.listar);
router.put("/actualizar",auth.auth,UsuarioController.actualizar);
router.post("/upload", [auth.auth, uploads.single("file0")], UsuarioController.upload);
router.get("/avatar/:file",auth.auth,UsuarioController.avatar);

//exportar router
module.exports= router;
