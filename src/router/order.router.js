import express from "express";

import { actualizarOrden, deleteOrder, orderAll, updateOrder } from "../controllers/controller.order.js";

const router = express.Router();

router.get("/list",orderAll); 
router.get("/delete/:id",deleteOrder);
router.get("/update/:id",actualizarOrden);
router.post("/update/:id",updateOrder);



export default router;



