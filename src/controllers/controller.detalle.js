import Dish from "../models/dish.js";
import { OrderDish } from "../models/order.js";
import { OrderDishItem } from "../models/orderDetalle.js";

//tabla
const allDetalle = async (req, res) => {
  try {
    const data = await OrderDishItem.find()
      .populate("order_dish_id")
      .populate("dish_id");

  
    const formattedData = data.map((item) => {
      const orderDish = item.order_dish_id || {}; // Usa un objeto vacío si es null

      return {
        _id: item._id,
        quantity: item.quantity,
        price: item.price,
        orden: {
          order_date: orderDish.order_date
            ? formatDate(orderDish.order_date)
            : null,
          total: orderDish.total || null,
          invoice_report_url: orderDish.invoice_report_url || null,
          status: orderDish.status || null,
        },
        dish: {
          name: item.dish_id.name,
          description: item.dish_id.description,
          price: item.dish_id.price,
          stock: item.dish_id.stock,
        },
      };
    });

    res.render("detalle/list", { data: formattedData });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).send("Error al obtener los detalles.");
  }
};

//delete
const deleteDetalle = async (req, res) => {
    try {
      
      const orderDishItem = await OrderDishItem.findById(req.params.id);
      if (!orderDishItem) {
        return res.status(404).send("Item de orden no encontrado.");
      }
  
      const orderDishId = orderDishItem.order_dish_id; 
  
      await OrderDishItem.findByIdAndDelete(req.params.id);
  
  
      const orderDish = await OrderDish.findById(orderDishId);
     
      if (orderDish) {
  
        orderDish.total -= orderDishItem.price * orderDishItem.quantity;
        orderDish.total = Math.max(orderDish.total, 0);
        await orderDish.save();
      } else {
        
      }
  
      res.redirect("/detalle");
    } catch (error) {
      console.log(`Error: ${error.message}`);
      res.status(500).send("Error al eliminar el detalle.");
    }
  };
  

const formularioDetalle = async (req, res) => {
  try {
    const data = await Dish.find();
    const formattedData = data.map((item) => ({
      _id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      stock: item.stock,
    }));

    const dataOrder = await OrderDish.find();
    const formattedDataOrder = dataOrder.map((item) => ({
      _id: item._id,
      order_date: formatDate(item.order_date),
    }));

    res.render("detalle/form", {
      dish: formattedData,
      order: formattedDataOrder,
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).send("Error al obtener los platos.");
  }
};

const agregarNuevoDetalle = async (req, res) => {
    const { quantity, price, order_dish_id, dish_id, createOrder } = req.body;
  
    try {
      const total = price * quantity;

      
      if (createOrder === "on") {
        const infoOrder = {
          order_date: new Date(),
          total,
          invoice_report_url: "http://example.com/invoice/3",
          status: "pending",
        };
  
        const order = new OrderDish(infoOrder);
        await order.save();
  
        const orderDishItem = new OrderDishItem({
          quantity,
          price,
          order_dish_id: order._id,
          dish_id,
        });
        await orderDishItem.save();
      } else if (order_dish_id) {
      
        const existingOrder = await OrderDish.findById(order_dish_id);
        
        if (existingOrder) {
          
          existingOrder.total += total; 
          await existingOrder.save();
  
          
          const orderDishItem = new OrderDishItem({
            quantity,
            price,
            order_dish_id,
            dish_id,
          });
          await orderDishItem.save();
        } else {
          return res.status(404).send("Orden no encontrada.");
        }
      } 
  
      res.redirect("/detalle");
    } catch (error) {
      console.log(`Error: ${error.message}`);
      res.status(500).send("Error al guardar el detalle.");
    }
  };
  

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await OrderDishItem.findById(id)
      .populate("order_dish_id")
      .populate("dish_id");

    if (!item) {
      return res.status(404).send("Elemento no encontrado.");
    }

    const formattedData = {
      _id: item._id,
      quantity: parseFloat(item.quantity),
      price: parseFloat(item.price),
    };

    const data = await Dish.find();
    const formattedData1 = data.map((item) => ({
      _id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      stock: item.stock,
    }));

    const dataOrder = await OrderDish.find();
    const formattedDataOrder = dataOrder.map((item) => ({
      _id: item._id,
      order_date: formatDate(item.order_date),
    }));

    res.render("detalle/formUp", {
      item: formattedData,
      dish: formattedData1,
      order: formattedDataOrder,
    });

  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).send("Error al obtener el detalle para actualizar.");
  }
};


const UpdateDetalle = async (req, res) => {
    const { id } = req.params;
  
    try {
      const { quantity, price, order_dish_id, dish_id } = req.body;
  
     
      const total = price * quantity;
  
     
      const orderDishItem = await OrderDishItem.findById(id);
      if (!orderDishItem) {
        return res.status(404).send("Detalle no encontrado.");
      }
  
     
      if (orderDishItem.dish_id === dish_id && orderDishItem.order_dish_id === order_dish_id) {
        
        orderDishItem.quantity += quantity; 
       
      } else {
        
        orderDishItem.quantity = quantity;
        orderDishItem.price = price;
        orderDishItem.order_dish_id = order_dish_id;
        orderDishItem.dish_id = dish_id;
      }
      await orderDishItem.save();
  
      
      const orderDish = await OrderDish.findById(order_dish_id);
      if (orderDish) {
       
        orderDish.total -= orderDishItem.price * (orderDishItem.quantity - quantity); 
        orderDish.total += total; 
        await orderDish.save();
      } else {
        console.log("Orden no encontrada para actualizar el total.");
      }
  
      res.redirect("/detalle");
    } catch (error) {
      console.log(`Error: ${error.message}`);
      res.status(500).send("Error al actualizar el detalle.");
    }
  };
  

export function formatDate(dateString) {
  const date = new Date(dateString);
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const formattedDate = date.toLocaleDateString("es-ES", dateOptions);
  const formattedTime = date.toLocaleTimeString("es-ES", timeOptions);

  return `${formattedDate} ${formattedTime}`;
}

export {
  allDetalle,
  deleteDetalle,
  formularioDetalle,
  agregarNuevoDetalle,
  actualizar,
  UpdateDetalle,
};
