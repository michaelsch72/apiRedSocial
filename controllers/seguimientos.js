const seguir = require("../models/seguir");
const usuario = require("../models/usuario");
// importar servicios 
const seguirServicios=require("../servicios/seguirServicio")

//Importar dependencias
const mongoosePaginate = require("mongoose-pagination");

// Acciones de pruebas

const pruebaSeguimiento = (req, res) => {
  return res.status(200).send({
    message: "mensaje enviado desde: Controlador/seguimiento.js",
  });
};

//accion de seguir
const guardar = (req, res) => {
  //conseguir datos por el body
  const params = req.body;
  //sacar id del usuario identificado
  const identity = req.usuario;

  //crer objeto con modelo follow
  let usuarioSeguido = new seguir();
  usuarioSeguido.usuario = identity.id;
  usuarioSeguido.followed = params.followed;
  //guardar objeto en bbdd
  usuarioSeguido.save((error, seguidoGuardado) => {
    if (error || !seguidoGuardado) {
      return res.status(500).send({
        status: "error",
        message: "No se ha podido seguir el usuario",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "metodo dar seguir",
      identity: req.usuario,
      usuarioSeguido,
      follow: seguidoGuardado,
    });
  });
};
// accion de dejar de seguir
const dejarSeguir = (req, res) => {
  //recoger el id del usuario identificado
  const usuario_id = req.usuario.id;

  //recoger el idusuario que sigo y quiero dejar de seguir
  const followedId = req.params.id;

  //find de las coincidencias y hacer remove
  seguir
    .find({
      usuario: usuario_id,
      followed: followedId,
    })
    .remove((error, seguidoEliminar) => {
      if (error || !seguidoEliminar) {
        return res.status(500).send({
          status: "error",
          message: "No has dejado de seguir",
        });
      }
      return res.status(200).send({
        status: "success",
        message: "has dejado de seguir al usuario",
      });
    });
};

//accion listado de usuarios que estoy siguiendo
const siguiendo = (req, res) => {
  //sacar id del usuario identificado
  let usuario_id = req.usuario.id;

  //comprobar si me llega el id por parametro en la url
  if (req.params.id) usuario_id = req.params.id;

  //comprobar si me llega la pagina si no la pagina 1
  let pagina = 1;
  if (req.params.pagina) pagina = req.params.pagina;

  // usuario por pagina quiero mostrar
  const itemsPorPagina = 2;

  // find a follow,popular datos del usuario y paginar por mongoose  paginate
  seguir
    .find({ usuario: usuario_id })
    .populate("usuario followed","-contraseña -rol -__v")
    .paginate(pagina,itemsPorPagina,async(error, follows,total) => {
      //listado de usuario que siguen a un usauario me siguen a mi

      // sacar un array de id de los usuarios que me siguen y los que sigos como usuario identificado
      let idusuarioSeguidos=await seguirServicios.idusuarioSeguidos(req.usuario.id)

      return res.status(200).send({
        status: "success",
        message: "listado de usuarios que estoy siguiendo",
        follows,
        total,
        pagina:Math.ceil(total/itemsPorPagina),
        usuarioSeguido:idusuarioSeguidos.siguiendo,   
        seguidores:idusuarioSeguidos.seguidores

       });
    });
    
};

// accion listado de usuarios que me siguen

const seguidores = (res, req) => {
  return res.status(200).send({
    status: "success",
    message: "",
  });
};

//exportar acciones
module.exports = {
  pruebaSeguimiento,
  guardar,
  dejarSeguir,
  siguiendo,
  seguidores,
};
