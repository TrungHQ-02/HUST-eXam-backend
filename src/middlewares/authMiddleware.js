import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // authorization using bearer token
  if (!authHeader) {
    return res.status(401).json({
      code: "x001",
      message: "Unauthorized: No token provided",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      code: "x001",
      message: "Unauthorized: No token provided",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ code: "x002", message: "Unauthorized: Token expired" });
      } else {
        return res
          .status(401)
          .json({ code: "x003", message: "Unauthorized: Invalid token" });
      }
    }
    console.log("after decoding", decoded);
    req.query.userId = decoded.id + "";
    req.body.userId = decoded.id + "";
    req.query.userEmail = decoded.email + "";
    req.body.userEmail = decoded.email + "";
    req.query.userName = decoded.user_name + "";
    req.body.userName = decoded.user_name + "";
    next();
  });
};

module.exports = {
  verifyToken: verifyToken,
};
