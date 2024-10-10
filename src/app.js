import { engine } from 'express-handlebars';
import { fileURLToPath } from "url"
import {join, dirname} from 'path'
import connectDB from "./database/db.js";
import dotenv from "dotenv";
import express from "express";
import morgan from 'morgan';
import RouterDetalle  from "./router/detalle.js";
import RouterOrder from "./router/order.router.js";

const __dirname = dirname(fileURLToPath(import.meta.url));


dotenv.config();
const app = express();


app.set('views', join(__dirname, 'views'));

                            
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        eq: (a, b) => {
          return a === b;
        }
      }
}));
app.set('view engine', '.hbs');


//Middlewares
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: false}));
app.use(express.json());




app.use(RouterOrder);
app.use(RouterDetalle);

app.use(express.static(join(__dirname, 'public')));


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is running on port 3000");
    connectDB();
});