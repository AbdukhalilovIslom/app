import { Router } from "express";

import Product from "../models/Product.js";
const router = Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Main Page" });
});

router.get("/add", (req, res) => {
  res.render("add", { title: "Add Page", isAdd: true });
});

router.get("/products", (req, res) => {
  res.render("products", { title: "Products Page", isProducts: true });
});

router.post("/add-product", async (req, res) => {
  const products = await Product.create(req.body);
  console.log(products);
  res.redirect("/");
});

export default router;
