import { chatModel } from "../models/messages";

export default class Chat {
    constructor() {
        console.log('Working users with DB')
    }

    create = async (data1, data2) => {
        const result = await chatModel.create({user: data1, message: data2});
        return result;
    }
}