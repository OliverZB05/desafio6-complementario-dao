import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.render("chat");
});

//Configuración de sweetalert clase 11 minuto 37:10

export default router;
