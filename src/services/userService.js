import db from "../models/index";
import jwt from "jsonwebtoken";

// FUNCTION FOR HASHING PASSWORD
// let hashPassword = (user_password) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let hashedPassword = await bcrypt.hashSync(user_password, salt);
//       resolve(hashedPassword);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

let checkUserNameExist = (user_name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {
          user_name: user_name,
        },
        raw: true,
      });

      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let handleLogin = (user_name, user_password) => {
  return new Promise(async (resolve, reject) => {
    let data = {};
    let checkUserExist = await checkUserNameExist(user_name);
    if (checkUserExist) {
      let user = await db.User.findOne({
        where: {
          user_name: user_name,
        },
        raw: true,
      });

      if (user) {
        // if the user with the provided username truly exists
        let checkPassword = user_password === user.user_password;
        if (checkPassword) {
          const token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: 86400, // expires in 24 hours
          });
          data.code = 0;
          data.message = "Successfully logged in!";
          // remove this line if using hashing
          delete user.user_password;
          // remove the upper line
          data.user = user;
          data.token = token;
        } else {
          data.code = 3;
          data.message = "Wrong password";
        }
      } else {
        // else return this
        data.code = 2;
        data.message = "The account with provided username does not exist";
      }
    } else {
      // 2-layer validation
      data.code = 2;
      data.message = "The account with provided username does not exist";
    }
    resolve(data);
  });
};

let checkEmailExist = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {
          email: email,
        },
        raw: true,
      });

      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let handleLoginViaEmail = (email, user_password) => {
  return new Promise(async (resolve, reject) => {
    let data = {};
    let checkUserExist = await checkEmailExist(email);
    if (checkUserExist) {
      let user = await db.User.findOne({
        where: {
          email: email,
        },
        raw: true,
      });

      if (user) {
        // if the user with the provided username truly exists
        let checkPassword = user_password === user.user_password;
        if (checkPassword) {
          const token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: 86400, // expires in 24 hours
          });
          data.code = 0;
          data.message = "Successfully logged in!";
          // remove this line if using hashing
          delete user.user_password;
          // remove the upper line
          data.user = user;
          data.token = token;
        } else {
          data.code = 3;
          data.message = "Wrong password";
        }
      } else {
        // else return this
        data.code = 2;
        data.message = "The account with provided email does not exist";
      }
    } else {
      // 2-layer validation
      data.code = 2;
      data.message = "The account with provided email does not exist";
    }
    resolve(data);
  });
};

// GET USER INFO

let handleGetUserInfo = (id) => {
  return new Promise(async (resolve, reject) => {
    let data = {};
    let user = await db.User.findOne({
      where: {
        id: id,
      },
      raw: true,
    });

    if (user) {
      data.code = 0;
      data.message = "OK";
      data.user = user;
    } else {
      data.code = 2;
      data.message = "Your account does not exist";
    }
    resolve(data);
  });
};

module.exports = {
  handleLogin: handleLogin,
  handleLoginViaEmail: handleLoginViaEmail,
  handleGetUserInfo: handleGetUserInfo,
};
