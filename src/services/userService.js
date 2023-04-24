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
          const token = jwt.sign(
            {
              id: user.id,
              user_name: user.user_name,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: 86400, // expires in 24 hours
            }
          );
          data.code = 0;
          data.statusCode = 200;
          data.message = "Successfully logged in!";
          // remove this line if using hashing
          delete user.user_password;
          // remove the upper line
          data.user = user;
          data.token = token;
        } else {
          data.code = 3;
          data.statusCode = 401;
          data.message = "Wrong password";
        }
      } else {
        // else return this
        data.statusCode = 401;
        data.code = 2;
        data.message = "The account with provided username does not exist";
      }
    } else {
      // 2-layer validation
      data.statusCode = 401;
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
          const token = jwt.sign(
            {
              id: user.id,
              user_name: user.user_name,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: 86400, // expires in 24 hours
            }
          );
          data.code = 0;
          data.statusCode = 200;
          data.message = "Successfully logged in!";
          // remove this line if using hashing
          delete user.user_password;
          // remove the upper line
          data.user = user;
          data.token = token;
        } else {
          data.code = 3;
          data.statusCode = 401;
          data.message = "Wrong password";
        }
      } else {
        // else return this
        data.code = 2;
        data.statusCode = 401;
        data.message = "The account with provided email does not exist";
      }
    } else {
      // 2-layer validation
      data.code = 2;
      data.statusCode = 401;
      data.message = "The account with provided email does not exist";
    }
    resolve(data);
  });
};

// createNewUSer
let createNewUSer = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkExistEmail = await checkEmailExist(data.email);
      if (checkExistEmail === true) {
        resolve({
          code: 2,
          statusCode: 400,
          message: "Email has been used",
        });
      }

      let checkExistUsername = await checkUserNameExist(data.user_name);
      if (checkExistUsername === true) {
        resolve({
          code: 3,
          statusCode: 400,
          message: "Username has been used",
        });
      } else {
        // let user_password = await hashPassword(data.user_password);
        let user_password = data.user_password;
        await db.User.create({
          email: data.email,
          user_password: user_password,
          user_name: data.user_name,
          phone: data.phone ? data.phone : "",
          gender: data.gender,
        });
        resolve({
          code: 0,
          statusCode: 201,
          message: "Successfully created!",
        });
      }
    } catch (error) {
      reject(error);
    }
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
      delete user.user_password;
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
  createNewUSer: createNewUSer,
};
