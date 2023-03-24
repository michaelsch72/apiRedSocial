const seguir = require("../models/seguir");
const idusuarioSeguidos = async (identityUsuarioId) => {
  try {
    //sacar informacion de seguimiento
    let siguiendo = await seguir
      .find({ usuario: identityUsuarioId })
      .select({ followed: 1, _id: 0 })
      .exec();
    let seguidores = await seguir
      .find({ followed: identityUsuarioId })
      .select({ usuario: 1, _id: 0 })
      .exec();
    // procesar array de identificadores
    let limpiar_seguiendo = [];
    siguiendo.forEach((follow) => {
      limpiar_seguiendo.push(follow.followed);
    });
    let limpiar_seguidores = [];
    seguidores.forEach((follow) => {
      limpiar_seguidores.push(follow.usuario);
    });

    return {
      siguiendo: limpiar_seguiendo,
      seguidores: limpiar_seguidores,
    };
  } catch (error) {
    return {};
  }
};
const sigoEsteUsuario = async (identityUsuarioId, profileUsuarioId) => {
  let siguiendo = await seguir
    .findOne({ usuario: identityUsuarioId ,"followed":profileUsuarioId})
  let seguidores = await seguir
    .findOne({ "usuario":profileUsuarioId, followed: identityUsuarioId })
    return {siguiendo,
    seguidores
    };
};
module.exports = {
  idusuarioSeguidos,
  sigoEsteUsuario
};
