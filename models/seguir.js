const{Schema,model}=require("mongoose");
const seguirSchema=Schema({
    usuario:{
        type:Schema.ObjectId,
        ref:"usuario"
    },
    followed: {
        type: Schema.ObjectId,
        ref: "usuario"
    },
    create_at:{
        type:Date,
        default:Date.now
    }
});
module.exports=model("seguir",seguirSchema,"seguimientos");