/* import {Router} from 'express'
import productManager from '../../manager/productManager.js';
import { readProducts, writeProducts } from '../../files/utils__products.js';

const router = Router();
const productManagerInstance = new productManager();

//################## Método GET / CON SOCKETS ##################
router.get('/', async (req, res) => { 
    const io = req.app.get('socketio');
    const data = await productManagerInstance.listAll();
    io.emit("showProducts", data);
    res.render('realTimeProducts', { data: readProducts() }); 
});
//################## Método GET CON SOCKETS ##################

export default router; */

import {Router} from 'express'
import Product from '../../dao/dbManagers/productsManagerModel.js'

const router = Router();

const productsManager = new Product();

router.get("/", async (req, res) => {
    try {
        const products = await productsManager.getAll();
        res.render("realTimeProducts", { products });
    }
    catch {
        console.log(error);
    }
})

export default router;
