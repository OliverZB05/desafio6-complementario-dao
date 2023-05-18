/* import { Router } from 'express';
import { productsArray } from './products.router.js';
import { readCarts, writeCarts } from '../../files/utils__carts.js';
import { readProducts, writeProducts } from '../../files/utils__products.js';

const router = Router();

let carts = [];

//################## Método POST ##################
router.post('/', (req, res) => {

    const carts = readCarts();
    const cart = req.body;
    const maxId = Math.max(0, ...carts.map(p => p.id));
    cart.id = maxId + 1;
    cart.products = []
    carts.push(cart);
    writeCarts(carts);
    res.send({ status: 'success', payload:cart });

});
//################## Método POST ##################


//################## Método GET ##################
router.get('/:cid', (req, res) => {
    const productsArray = readProducts();
    const carts = readCarts();
    const cartId = Number(req.params.cid);

    const index = carts.findIndex(c => c.id === cartId);

    if (index === -1) {
        res.status(404).send({ error: 'cart not found' });
    } else {
        res.send(carts[index]);
    }
});
//################## Método GET ##################


//################## Método POST del producto en el carrito ##################  
router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCarts();
    const productsArray = readProducts();

    const cartId = Number(req.params.cid);
    const prodId = Number(req.params.pid);
    const quantity = req.body.quantity || 1;

    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) {
        return res.status(404).send({ error: 'Cart not found' });
    }

    const product = productsArray.find(p => p.id === prodId);
    if (!product) {
        return res.status(404).send({ error: 'Product id= ' + prodId + ' not found, array:' + productsArray.length});
    }

    const cartProductIndex = carts[cartIndex].products.findIndex(p => p.id === prodId);

    if (cartProductIndex === -1) {
        carts[cartIndex].products.push({ id: product.id, quantity });
        writeCarts(carts);
        res.send({ status: 'success', payload: { id: product.id, quantity } });
    } else {
        carts[cartIndex].products[cartProductIndex].quantity += quantity;
        writeCarts(carts);
        res.send({ status: 'success', payload: { id: product.id, quantity } });
    }
});
//################## Método POST del producto en el carrito ##################  


//-------------- Borrar producto del carrito --------------
router.delete('/:cid/product/:pid', (req, res) => {
    const carts = readCarts();
    const productsArray = readProducts();
    const cartId = Number(req.params.cid);
    const prodId = Number(req.params.pid);
    const quantity = req.body.quantity || 1;

    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) {
        return res.status(404).send({ error: 'Cart not found' });
    }

    const product = productsArray.find(p => p.id === prodId);
    if (!product) {
        return res.status(404).send({ error: 'Product not found' });
    }

    const cartProductIndex = carts[cartIndex].products.findIndex(p => p.id === prodId);
    if (cartProductIndex === -1) {
        return res.status(404).send({ error: 'Product not found in cart' });
    }

    carts[cartIndex].products[cartProductIndex].quantity -= quantity;
    if (carts[cartIndex].products[cartProductIndex].quantity <= 0) {
        carts[cartIndex].products.splice(cartProductIndex, 1);
        writeCarts(carts);
    }

    res.send({ status: 'success', payload: { id: product.id, quantity: -quantity } });
    writeCarts(carts);
});
//-------------- Borrar producto del carrito --------------


//-------------- Borrar carrito --------------
router.delete('/:cid', (req, res) => {
    const carts = readCarts();
    const cartId = Number(req.params.cid);
    const cartIndex = carts.findIndex(c => c.id === cartId);

    if (cartIndex === -1) {
        return res.status(404).send({ error: 'Cart not found' });
    }
    else{
        carts.splice(cartIndex, 1);
        res.send({ status: 'success', message: 'cart deleted' });
        writeCarts(carts);
    }
});
//-------------- Borrar carrito --------------

export default router; */


import { Router } from 'express';
import Cart from "../../dao/dbManagers/cartsManagerModel.js";
import Product from "../../dao/dbManagers/productsManagerModel.js";

const router = Router();
const cartManager = new Cart();
const productManager = new Product();

router.get('/getAll', async (req, res) => {
    try {
    const carts = await cartManager.getAll();
    res.send({ status: 'success', payload: carts });
    } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { products } = req.body;

    try{
        const result = await cartManager.create({
            products
        });

        res.send({status: "success", payload: result})
    }
    catch (error){
        res.status(500).send({ status: "error", error});
    }
});


router.get('/:cid', async (req, res) => {
    const { cid } = req.params; 

    try {
        const carts = await cartManager.getId(cid);
        res.send({ status: "success", payload: carts });
    }
    catch (error){
        console.error(error);
        res.status(500).send({ status: "error", error});
    }
});



router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        /* const cartData = await cartManager.getId(cartId); */

        const cartDataArray = await cartManager.getId(cartId);
        if (!cartDataArray || cartDataArray.length === 0) {
        return res.status(404).send({ error: 'Cart not found' });
        }
        const cartData = cartDataArray[0];

        if (!cartData) {
        return res.status(404).send({ error: 'Cart not found' });
        }

        const product = await productManager.getId(prodId);
        if (!product) {
        return res.status(404).send({ error: 'Product id= ' + prodId + ' not found, array:' + productsArray.length});
        }

        const cartProductIndex = cartData.products.findIndex(p => p.id === prodId);

        if (cartProductIndex !== -1) {
            cartData.products[cartProductIndex].quantity += quantity;
            await cartManager.update(cartId, cartData);
            res.send({ status: 'success', payload: { id: prodId, quantity } });
        }

        else {
            cartData.products.push({ id: prodId, quantity });
            await cartManager.update(cartId, cartData);
            res.send({ status: 'success', payload: { id: prodId, quantity } });
        }
    }
    
    catch (error) {
        console.error(error);
    res.status(500).send({ error: error.message });
    }
});




router.delete('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {

        const cartDataArray = await cartManager.getId(cartId);
        if (!cartDataArray || cartDataArray.length === 0) {
        return res.status(404).send({ error: 'Cart not found' });
        }
        const cartData = cartDataArray[0];

        if (!cartData) {
        return res.status(404).send({ error: 'Cart not found' });
        }

        const product = await productManager.getId(prodId);
        if (!product) {
        return res.status(404).send({ error: 'Product id= ' + prodId + ' not found, array:' + productsArray.length});
        }

        const cartProductIndex = cartData.products.findIndex(p => p.id === prodId);

        if (cartProductIndex === -1) {
            return res.status(404).send({ error: 'Product not found in cart' });
        }

        cartData.products[cartProductIndex].quantity -= quantity;

        if (cartData.products[cartProductIndex].quantity <= 0) {
        cartData.products.splice(cartProductIndex, 1);
        }

        await cartManager.update(cartId, cartData);
        res.send({ status: 'success', payload: { id: prodId } });
    }
    
    catch (error) {
        console.error(error);
    res.status(500).send({ error: error.message });
    }
});


router.delete('/:cid', async (req, res) => {
    const { cid } = req.params; 

    try {
        const carts = await cartManager.delete(cid);
        res.send({ status: "success", payload: carts });
    }
    catch (error){
        res.status(500).send({ status: "error", error});
    }
});

export default router;
