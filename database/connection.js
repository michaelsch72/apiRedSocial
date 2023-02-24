const mongoose = require("mongoose");

const connection = async()=>{
   
    try{
        mongoose.set('strictQuery', true);
        await mongoose.connect("mongodb://127.0.0.1:27017/red_social",{useNewUrlParser: true});
        console.log("Conectado correctamemte a bd: red_social");

    }catch(error){
        console.log(error);
        throw new Error("no se a podido conector a la base de datos ");
    }

}
module.exports = connection
