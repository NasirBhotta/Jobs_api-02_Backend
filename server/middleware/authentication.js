const jwt = require("jsonwebtoken");
const {
  BadRequestError,
  UnauthenticatedError,
  CustomAPIError,
} = require("../errors");

const tokenAuthenticationMiddleWare = async (req, res, next) => {
  // const authHeader = req.headers.authorization;

  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   throw new UnauthenticatedError("No Token Provided");
  // }
  // const token = authHeader.split(" ")[1];

  const token = req.session.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, name } = decoded;
    req.user = { id: userId, name: name };

    next();
  } catch (error) {
    throw new CustomAPIError("not authorized");
  }
};

module.exports = tokenAuthenticationMiddleWare;
