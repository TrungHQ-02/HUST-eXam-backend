import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
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
    req.query.userId = decoded.id + "";
    next();
  });
};

module.exports = {
  verifyToken: verifyToken,
};
