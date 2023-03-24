// importar dependencias
const usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const moongosePagination = require("mongoose-pagination");
const fs =require("fs");
const path=require("path");
//importar servicios de jwt
const jwt = require("../servicios/jwt");
const { exists } = require("../models/usuario");
const seguirServicio= require("../servicios/seguirServicio")

//registro de usuarios
const registro = (req, res) => {
  //recoger datos de la peticion
  let params = req.body;

  //hacer validacion de los datos
  if (!params.nombre || !params.contraseña || !params.nick) {
    return res.status(400).json({
      status: "error",
      message: "faltan datos por enviar",
      params,
    });
  }

  //controlar usuarios duplicados
  usuario
    .find({
      $or: [
        { correo: params.correo.toLowerCase() },
        { nick: params.nick.toLowerCase() },
      ],
    })
    .exec(async (error, usuarios) => {
      if (error)
        return res.status(500).json({
          status: "error",
          message: "Error en la consulta de usuarios",
        });

      if (usuarios && usuarios.length >= 1) {
        return res.status(200).send({
          status: "success",
          message: "El usuario ya existe",
        });
      }

      // Cifrar la contraseña
      let pwd = await bcrypt.hash(params.contraseña, 10);
      params.contraseña = pwd;

      // Crear objeto de usuario
      let user_to_save = new usuario(params);

      //Guardar usuario en la bbdd
      user_to_save.save((error, userStored) => {
        if (error || !userStored)
          return res
            .status(500)
            .send({ status: "error", message: "Error al guardar el usuario" });

        //Devolver resultado
        return res.status(200).json({
          status: "success",
          message: "Usuario registrado correctamente",
          user: userStored,
        });
      });
    });
};
const login = (req, res) => {
  //recoger parametros del body
  const params = req.body;

  if (!params.correo || !params.contraseña) {
    return res.status(404).send({
      status: "error",
      message: "faltan datos por enviar",
    });
  }

  //buscar en la base de datos si existe .select({"contraseña":0})
  usuario.findOne({ correo: params.correo }).exec((error, usuario) => {
    if (error || !usuario)
      return res
        .status(400)
        .send({ status: "error", message: "NO existe el usuario" });

    //comprobar la contraseña
    const pwd = bcrypt.compareSync(params.contraseña, usuario.contraseña);
    if (!pwd) {
      return res.status(400).send({
        status: "error",
        message: "La contraseña es incorrecta",
      });
    }

    //Conseguir el token
    const token = jwt.crearToken(usuario);

    //dev datos del usuario

    return res.status(200).send({
      status: "succes",
      message: "Te has identificado correctamente",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        nick: usuario.nick,
      },
      token,
    });
  });
};

const perfil = (req, res) => {
  //resibir el parametro del id de usurio por la url
  const id = req.params.id;

  //consulta para sacar los datos  del usuario
  usuario
    .findById(id)
    .select({ contraseña: 0, rol: 0 })
    .exec(async(error, perfilUsuario) => {
      if (error || !perfilUsuario) {
        returnres.status(404).send({
          message: "el usuario no existe o hay error",
        });
      }

      //informacion de seguimiento

      const seguirInfo=await seguirServicio.sigoEsteUsuario(req.usuario.id,id);

      //devolver informacion de datos al perfil
      return res.status(200).send({
        status: "success",
        usuario: perfilUsuario,
        seguidores:seguirInfo.seguidores,
      siguiendo:seguirInfo.siguiendo
          });
    });
};
const listar = (req, res) => {
  //controlar en que pagina estamos

  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  page = parseInt(page);

  //consulta con mongoose paginate
  let itemsporPagina = 2;

  usuario
    .find()
    .sort("_id")
    .paginate(page, itemsporPagina, async(error, usuarios, total) => {
      //Devolver el resultado
      if (error || !usuarios) {
        return res.status(404).send({
          status: "error",
          message: "No hay usuarios disponibles",
          error,
        });
      }

        let seguirServicio=await  seguirServicio.sigoEsteUsuario(req.user.id);
      return res.status(200).send({
        status: "success",
        usuarios,
        page,
        itemsporPagina,
        total,
        pages: Math.ceil(total / itemsporPagina),
        usuarioSeguido:idusuarioSeguidos.siguiendo,   
        seguidores:idusuarioSeguidos.seguidores
      });
    });
};

const actualizar = (req, res) => {
  // Recoger info del usuario a actualizar
  let userIdentity = req.usuario;
  let userToUpdate = req.body;

  // Eliminar campos sobrantes
  delete userToUpdate.iat;
  delete userToUpdate.exp;
  delete userToUpdate.role;
  delete userToUpdate.image;

  // Comprobar si el usuario ya existe
  usuario
    .find({
      $or: [
        { correo: userToUpdate.correo.toLowerCase() },
        { nick: userToUpdate.nick.toLowerCase() },
      ],
    })
    .exec(async (error, usuarios) => {
      if (error)
        return res
          .status(500)
          .json({
            status: "error",
            message: "Error en la consulta de usuarios",
          });

      let userIsset = false;
      usuarios.forEach((usuario) => {
        if (usuario && usuario._id != userIdentity.id) userIsset = true;
      });

      if (userIsset) {
        return res.status(200).send({
          status: "success",
          message: "El usuario ya existe",
        });
      }

      // Cifrar la contraseña
      if (userToUpdate.contraseña) {
        let pwd = await bcrypt.hash(userToUpdate.contraseña, 10);
        userToUpdate.contraseña = pwd;

        //añadido
      } else {
        delete userToUpdate.contraseña;
      }

      // Buscar y actualizar
      try {
        let userUpdated = await usuario.findByIdAndUpdate(
          { _id: userIdentity.id },
          userToUpdate,
          { new: true }
        );

        if (!userUpdated) {
          return res
            .status(400)
            .json({ status: "error", message: "Error al actualizar" });
        }

        // Devolver respuesta
        return res.status(200).send({
          status: "success",
          message: "Metodo de actualizar usuario",
          usuario: userUpdated,
        });
      } catch (error) {
        return res.status(500).send({
          status: "error",
          message: "Error al actualizar",
        });
      }
    });
};
const upload = (req, res) => {

  // Recoger el fichero de imagen y comprobar que existe
  if (!req.file) {
      return res.status(404).send({
          status: "error",
          message: "Petición no incluye la imagen"
      });
  }

  // Conseguir el nombre del archivo
  let imagen = req.file.originalname;

  // Sacar la extension del archivo
  const imageSplit = imagen.split("\.");
  const extension = imageSplit[1];

  // Comprobar extension
  if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {

      // Borrar archivo subido
      const filePath = req.file.path;
      const fileDeleted = fs.unlinkSync(filePath);

      // Devolver respuesta negativa
      return res.status(400).send({
          status: "error",
          message: "Extensión del fichero invalida"
      });
  }

  // Si si es correcta, guardar imagen en bbdd
  usuario.findOneAndUpdate({ _id: req.usuario.id }, { imagen: req.file.filename }, { new: true }, (error, userUpdated) => {
      if (error || !userUpdated) {
          return res.status(500).send({
              status: "error",
              message: "Error en la subida del avatar"
          })
      }

      // Devolver respuesta
      return res.status(200).send({
          status: "success",
          usuario: userUpdated,
          file: req.file,
      });
  });

}
const avatar =(req,res)=>{
//sacar los parametros de la url
const file =req.params.file;


//montar el path real de la imagen
const filePath="./almacenar/avatars/"+file;
// comprobar que el archivo existe
fs.stat(filePath,(error,exists)=>{

  if(!exists){
     return res.status(404).send({
      status:"error",
      message:"no existe la imagen"
    });
  }


//devolver un file
  return res.sendFile(path.resolve(filePath));
});
}



//exportar acciones
module.exports = {
  registro,
  login,
  perfil,
  listar,
  actualizar,
  upload,
  avatar
};
