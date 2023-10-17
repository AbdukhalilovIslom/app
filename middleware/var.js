export default function (req, res, next) {
  const isAuth = !!req.cookies.token;
  console.log(isAuth);
  res.locals.token = isAuth;
  next();
}
