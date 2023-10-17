import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateUserToken } from "../services/token.js";
const router = Router();

const isLogged = (req, res) => {
  if (req.cookies.token) {
    res.redirect("/");
    return;
  }
};

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

router.get("/register", (req, res) => {
  isLogged(req, res);
  res.render("register", {
    title: "Register Page",
    isRegister: true,
    registerErr: req.flash("registerErr"),
  });
});

router.get("/login", (req, res) => {
  isLogged(req, res);
  res.render("login", {
    title: "Login Page",
    isLogin: true,
    loginErr: req.flash("loginErr"),
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash("loginErr", "Fill inputs.");
    res.redirect("/login");
    return;
  }

  const existUser = await User.findOne({ email });
  if (!existUser) {
    req.flash("loginErr", "User not found!");
    res.redirect("/login");
    return;
  }

  const isPassEqual = await bcrypt.compare(password, existUser.password);
  if (!isPassEqual) {
    req.flash("loginErr", "Incorrect password!");
    res.redirect("/login");
    return;
  }
  const token = generateUserToken(existUser._id);
  res.cookie("token", token, { secure: true });

  console.log(existUser);
  res.redirect("/");
});

router.post("/register", async (req, res) => {
  const { firstname, lastname, password, email } = req.body;
  if (!firstname || !lastname || !password || !email) {
    req.flash("registerErr", "Fill inputs.");
    res.redirect("/register");
    return;
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    req.flash("loginErr", "You had registered!");
    res.redirect("/login");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = {
    firstName: firstname,
    lastName: lastname,
    email: email,
    password: hashedPassword,
  };

  const user = await User.create(userData);
  const token = generateUserToken(user._id);
  res.cookie("token", token, { secure: true });
  res.redirect("/");
});

export default router;
