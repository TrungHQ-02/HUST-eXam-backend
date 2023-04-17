import userService from "../services/userService";

let handleUserLogin = async (req, res) => {
  let id = req.body.id;
  let user_password = req.body.user_password;
  if (!id || !user_password) {
    return res.status(500).json({
      code: 1,
      message: "Missing required parameters",
    });
  }

  let userData = await userService.handleLogin(id, user_password);
  return res.status(200).json({
    code: userData.code,
    message: userData.message,
    token: userData.token,
    user: userData.user ? userData.user : {},
  });
};

let getUserInfo = async (req, res) => {
  let id = req.query.userId;

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
};

module.exports = {
  handleUserLogin: handleUserLogin,
  getUserInfo: getUserInfo,
};
