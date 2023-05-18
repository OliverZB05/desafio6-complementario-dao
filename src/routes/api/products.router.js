/* import { Router } from 'express';
import { readProducts, writeProducts } from '../../files/utils__products.js';
import productManager from '../../manager/productManager.js';

const router = Router();
const productManagerInstance = new productManager();
let productsArray = [];

//################## Método GET / SIN SOCKETS ##################
router.get('/', async (req, res) => { 
    res.render('home', { data: readProducts() });
});
//################## Método GET / SIN SOCKETS ##################


//################## Método GET por ID / SIN SOCKETS ##################
router.get('/:pid', async (req, res) => {
    const index = await productManagerInstance.list(Number(req.params.pid));

    if (index === -1) {
        res.status(404).send({ error: 'Product not found' });
    } else {
        res.render('home', { data: [productManagerInstance.productsArray[index]] });
    }
});
//################## Método GET por ID / SIN SOCKETS ##################


//################## Método PUT ##################
router.put('/:pid', async (req, res) => {
    await productManagerInstance.update(Number(req.params.pid), req.body);

    const io = req.app.get('socketio');
    io.emit("showProducts", await productManagerInstance.listAll());
});
//################## Método PUT ##################


//################## Método POST ##################
router.post('/', async (req, res) => {
    await productManagerInstance.create(req.body);

    const io = req.app.get('socketio');
    io.emit("showProducts", await productManagerInstance.listAll());
});
//################## Método POST ##################


//################## Método DELETE ##################
router.delete('/:pid', async (req, res) => {

    const index = await productManagerInstance.delete(Number(req.params.pid));

    if(index !== -1) {
        const io = req.app.get('socketio');
        io.emit("showProducts", await productManagerInstance.listAll());
        res.redirect('/realtimeproducts');
    }
    else {
        res.status(404).send({ status: 'error', error: 'product not found' });
    }
});
//################## Método DELETE ##################

export {productsArray};
export default router; */

import { Router } from 'express';
import Product from "../../dao/dbManagers/productsManagerModel.js";

const router = Router();
const productManager = new Product();

router.get('/', async (req, res) => { 

    try {
        const products = await productManager.getAll();
        res.send({ status: "success", payload: products });
    }
    catch (error){
        res.status(500).send({ status: "error", error});
    }
});


router.get('/:pid', async (req, res) => { 
    const { pid } = req.params; 

    try {
        const products = await productManager.getId(pid);
        res.send({ status: "success", payload: products });
    }
    catch (error){
        res.status(500).send({ status: "error", error});
    }
});




router.post("/", async (req, res) => {
    const { title, description, price, thumbnail, stock, category } = req.body;

    if(!title || !description || !price || !thumbnail || !stock || !category){
        return res.status(400).send({ status: "error", error: "incomplete values"})
    }

    try{
        const result = await productManager.create({
            title,
            description,
            price,
            thumbnail,
            stock,
            category
        });

        res.send({status: "success", payload: result})
    }
    catch (error){
        res.status(500).send({ status: "error", error});
    }
});





router.put('/:pid', async (req, res) => {
    const { title, description, price, thumbnail, stock, category } = req.body;
    const { pid } = req.params; 
    
    if(!title || !description || !price || !thumbnail || !stock || !category){
        return res.status(400).send({ status: "error", error: "incomplete values"})
    }


    try{
        const result = await productManager.update(pid, {
            title,
            description,
            price,
            thumbnail,
            stock,
            category
        });

        res.send({status: "success", payload: result})
    }
    catch (error){
        console.error(error);
        res.status(500).send({ status: "error", error});
    }
});



router.delete('/:pid', async (req, res) => {

    const { pid } = req.params; 

    try {
        const products = await productManager.delete(pid);
        res.send({ status: "success", payload: products });
    }
    catch (error){
        res.status(500).send({ status: "error", error});
    }
});




export default router;