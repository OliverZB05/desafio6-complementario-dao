import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import cartsRouter from './routes/api/carts.router.js';
import productsRouter from './routes/api/products.router.js';
import viewsRouter from './routes/web/views.router.js';
import viewsChatRouter from './routes/web/viewsChat.router.js';
import { Server } from "socket.io";
import productManager from './manager/productManager.js';
import mongoose from 'mongoose';
import { chatModel } from './dao/models/messages.js';

const app = express();
const productManagerInstance = new productManager();

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");

app.set("view engine", "handlebars");

app.use(express.static(__dirname+"/public"));

app.use('/chat', viewsChatRouter);
app.use('/realtimeproducts', viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


try {
    await mongoose.connect("mongodb+srv://oliverzapata_arg:bxhp_bVE7c_DebEeSfFDÑñC_r@ecommerce.qe4ogkk.mongodb.net/?retryWrites=true&w=majority")
} catch (error) {
    console.log(error);
}

const server = app.listen(8080);

const io = new Server(server);

const messages = [];
io.on("connection", (socket) => {
    console.log("New client connected");

    // Leer mensajes del evento:
    socket.on("message", (data) => {
    chatModel.create({ user: data.user, message: data.message });

    /* chatModel.deleteMany({}).then(() => {
        console.log('Todos los mensajes han sido eliminados');
    }); */
    messages.push(data);

    const lastMessages = messages.slice(-4);
    io.emit("messageLogs", lastMessages);

    console.log(lastMessages);
    /* chatModel.find().then(messages => {
        // Aquí puedes acceder a los mensajes almacenados en la base de datos
        console.log(messages);
    }); */
    });


    socket.on("auth", (data) => {
        socket.emit("messageLogs", messages);
        socket.broadcast.emit("newUser", data);
    });
   /*  // Leer mensajes luego de autenticarse.
    socket.on("auth", (data) => {
    socket.emit("messageLogs", messages);
    socket.broadcast.emit("newUser", data);
    }); */
});



/* const server = app.listen(8080,()=>console.log("Listening on 8080"));

const io = new Server(server)

io.on("connection", async socket => {  
    socket.emit("showProducts", await productManagerInstance.listAll());
});

app.set('socketio', io);
io.sockets.setMaxListeners(20); */