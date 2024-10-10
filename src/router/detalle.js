import express from "express";

import { actualizar, agregarNuevoDetalle, allDetalle, deleteDetalle, formularioDetalle, UpdateDetalle } from "../controllers/controller.detalle.js";

const router=express.Router();


router.get("/detalle", allDetalle);
router.get("/detalle/:id", deleteDetalle);
router.get("/form", formularioDetalle);
router.post("/form", agregarNuevoDetalle);
router.get("/form/:id", actualizar);
router.post("/actualizar/:id", UpdateDetalle);


export default router;
