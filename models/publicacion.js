const {schema, model, Schema}=require('mongoose');

const publicacionSchema=Schema({
    usuario:{
        type:Schema.ObjectId,
        ref:"usuario"
    },
    text :{
        type:String,
        require:true,
    },
     file:String,
     created_at:{
        type:Date,
        default:Date.now
     }
});
module.exports=model("publicacion",publicacionSchema,"publiccaciones");