import { OrderDish } from "../models/order.js";
import { OrderDishItem } from "../models/orderDetalle.js";
import { formatDate } from "./controller.detalle.js"; 


const orderAll= async (req, res) => {
      try {
            const data= await OrderDish.find();
            
            const formattedData = data.map(item => ({
                _id: item._id,
                order_date: formatDate(item.order_date),
                total: item.total,
                invoice_report_url: item.invoice_report_url,
                status: item.status,
            }));
            
            res.render('orden/list' ,{ordenes:formattedData});

      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
       

}

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;


        await OrderDishItem.deleteMany({ order_dish_id: orderId });

        
        await OrderDish.findByIdAndDelete(orderId);
        
        res.redirect('/list');

    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send("Error al eliminar la orden.");
    }
};



const actualizarOrden = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await OrderDish.findById(orderId);
        if (!order) {
            return res.status(404).send("Orden no encontrada.");
        }

        
      const formattedData = {
            _id: order._id,
            order_date: formatDate(order.order_date),
            total: order.total,
            invoice_report_url: order.invoice_report_url,
            status: order.status,
      }


        res.render('orden/formorder', { order: formattedData });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send("Error al obtener la orden.");
    }
};


const updateOrder = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.params.id);

        const { order_date, invoice_report_url, status } = req.body;
        const orderId = req.params.id;

        const order = await OrderDish.findById(orderId);
        if (!order) {
            return res.status(404).send("Orden no encontrada.");
        }

        
        if (order_date && order_date.trim() !== "") {
            order.order_date = order_date;
        }        
        order.status = status;
        await order.save();
        res.redirect('/list');

    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send("Error al actualizar la orden.");
    }
};








export {orderAll,deleteOrder,actualizarOrden,updateOrder};