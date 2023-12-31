import jwt from "jsonwebtoken";

const generateUserToken = (userId) => {
  if (!userId) return;
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return accessToken;
};

export { generateUserToken };
