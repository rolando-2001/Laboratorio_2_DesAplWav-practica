import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 150 
    },
    description: {
        type: String,
        required: true,
        maxlength: 250 
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
});

// Modelo
const Dish = mongoose.model('Dish', dishSchema);

export default Dish;
