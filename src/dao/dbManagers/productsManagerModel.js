import { productModel } from '../models/products.js';

export default class Product {
    constructor() {
        console.log('Working users with DB')
    }

    getAll = async () => {
        const products = await productModel.find();
        return products.map(prod => prod.toObject());
    }

    getId = async (pid) => {
        const products = await productModel.find({ _id: pid });
        return products.map(prod => prod.toObject());
    }

    create = async (prod) => {
        const result = await productModel.create(prod);
        return result;
    }

    update = async (pid, prod) => {
        const result = await productModel.updateOne({ _id: pid }, prod);
        return result;
    }

    delete = async (pid) => {
        const result = await productModel.deleteOne({ _id: pid });
        return result;
    }
}