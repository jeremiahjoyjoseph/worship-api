// Create and send token and save in cookie

const sendToken = (user, statusCode, res) => {
  //Create JWT Token
  let token = user.getJwtToken();

  token = process.env.JWT_BEARER + " " + token;

  //Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie(process.env.JWT_BEARER_NAME, token, options)
    .json({ success: true, passage: token });
};

module.exports = sendToken;
