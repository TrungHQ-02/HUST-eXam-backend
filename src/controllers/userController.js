import userService from "../services/userService";

// LOGIN VIA USERNAME
let handleUserLogin = async (req, res) => {
  let user_name = req.body.user_name;
  let user_password = req.body.user_password;
  if (!user_name || !user_password) {
    return res.status(500).json({
      code: 1,
      message: "Missing required parameters",
    });
  }

  let userData = await userService.handleLogin(user_name, user_password);
  return res.status(200).json({
    code: userData.code,
    message: userData.message,
    token: userData.token,
    user: userData.user ? userData.user : {},
  });
};

// LOGIN VIA EMAIL
let handleUserLoginViaEmail = async (req, res) => {
  let email = req.body.email;
  let user_password = req.body.user_password;
  if (!email || !user_password) {
    return res.status(500).json({
      code: 1,
      message: "Missing required parameters",
    });
  }

  let userData = await userService.handleLoginViaEmail(email, user_password);
  return res.status(200).json({
    code: userData.code,
    message: userData.message,
    token: userData.token,
    user: userData.user ? userData.user : {},
  });
};

// SIGNUP
let handleUserSignup = async (req, res) => {
  let data = req.body;
  if (!data.email) {
    return res.status(500).json({
      code: 1,
      message: "Missing required parameter: email",
    });
  } else if (!data.user_name) {
    return res.status(500).json({
      code: 1,
      message: "Missing required parameter: user_name",
    });
  } else if (!data.user_password) {
    return res.status(500).json({
      code: 1,
      message: "Missing required parameter: user_password",
    });
  } else if (!data.gender) {
    return res.status(500).json({
      code: 1,
      message: "Missing required parameter: gender",
    });
  } else {
    let msg = await userService.createNewUSer(data);
    return res.status(200).json(msg);
  }
};

// GET USER INFO
let getUserInfo = async (req, res) => {
  let id = req.query.userId;
  let requestedId = parseInt(req.query.id);
  if (id !== requestedId) {
    return res.status(500).json({
      code: 3,
      message: "Unauthorized",
    });
  } else {
    if (!id) {
      return res.status(500).json({
        code: 1,
        message: "Missing required parameters",
      });
    }

    let userData = await userService.handleGetUserInfo(id);
    return res.status(200).json({
      code: userData.code,
      message: userData.message,
      user: userData.user ? userData.user : {},
    });
  }
};

module.exports = {
  handleUserLogin: handleUserLogin,
  handleUserLoginViaEmail: handleUserLoginViaEmail,
  getUserInfo: getUserInfo,
  handleUserSignup: handleUserSignup,
};
