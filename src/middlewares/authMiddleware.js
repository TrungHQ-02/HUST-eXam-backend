import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized: Token expired" });
      } else {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
    }
    console.log("after decoding", decoded);
    req.query.userId = decoded.id;
    next();
  });
};

module.exports = {
  verifyToken: verifyToken,
};
