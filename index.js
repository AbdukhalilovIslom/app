import express from "express";
import { create } from "express-handlebars";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import flash from "connect-flash";
import session from "express-session";
import varMiddleware from "./middleware/var.js";
import cookieParser from "cookie-parser";

//routes
import AuthRoutes from "./routes/auth.js";
import ProductsRoutes from "./routes/products.js";
dotenv.config();

const app = express();
const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
});

app.use(express.static("public"));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: "Islom", resave: false, saveUninitialized: false }));
app.use(flash());
app.use(varMiddleware);
app.use(AuthRoutes);
app.use(ProductsRoutes);

const mongooseCallback = () => {
  try {
    console.log("Mongo DB connected");
  } catch {
    console.log("Errr");
  }
};

(() => {
  try {
    mongoose.connect(
      process.env.MONGO_URI,
      { useNewUrlParser: true },
      mongooseCallback()
    );
    const PORT = process.env.PORT || 4100;
    app.listen(PORT, () => {
      console.log("Running on: " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
})();
