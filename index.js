//import dependencias 
const connection=require("./database/connection");
const express =require("express");
const cors=require("cors");


//mensaje de Bienvenida
console.log("se ha iniciado la api RED SOCIAL");

//conexion en la base de datos 
connection();


// crear servidor node 
const app =express();
const puerto=3900;
// Configurar cors
app.use(cors()) 

//convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// cargar conf rutas
const usuarioRoutes= require("./routes/usuario");
const publicacionesRoutes=require("./routes/publicaciones");
const seguimientosRoutes=require("./routes/seguimiento");

app.use("/api/usuario",usuarioRoutes);
app.use("/api/publicaciones",publicacionesRoutes);
app.use("/api/seguimiento",seguimientosRoutes);
//Ruta de prueba
app.get("/ruta-prueba",(req,res)=>{
    return res.status(200).json(
        {
        "id": 1,
        "nombre": "maicol",
        }
    );
})

//poner servidor a escuchar peticiones http 
app.listen(puerto,()=>{
    console.log("servidor de node corriendo en el puerto :"+puerto);
})

