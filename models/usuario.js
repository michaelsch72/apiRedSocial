const {Schema, model}=require("mongoose");
const UsuarioSchema= Schema({
    nombre :{
        type:String,
        require:true
    },
    apellido: String,
    biografia:String,
    nick:{
        type:String,
        require:true
    },
    correo:{
        type:String,
        require:true,
    },
    contraseña:{
        type:String,
        require:true,
        },
    rol:{
        type:String,
        default:"role_user"
    },
    imagen:{
        type:String,
        default:"defaul.png"
    },
    create_at:{
        type:Date,
        default:Date.now
    }

});
module.exports= model("usuario",UsuarioSchema,"usuarios");