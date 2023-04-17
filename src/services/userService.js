import db from "../models/index";
import jwt from "jsonwebtoken";

let handleLogin = (id, user_password) => {
  return new Promise(async (resolve, reject) => {
    let data = {};
    let user = await db.User.findOne({
      where: {
        id: id,
      },
      raw: true,
    });

    if (user) {
      let checkPassword = user_password === user.password;
      if (checkPassword) {
        const token = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: 86400, // expires in 24 hours
        });

        data.code = 0;
        data.message = "OK";
        data.user = user;
        data.token = token;
      } else {
        data.code = 3;
        data.message = "Wrong password";
      }
    } else {
      data.code = 2;
      data.message = "Your account does not exist";
    }
    resolve(data);
  });
};

module.exports = {
  handleLogin: handleLogin,
};
