export const generateToken = (
  user,
  statusCode,
  message,
  res
) => {
  try {

    // GENERATE JWT TOKEN
    const token = user.generateToken();



    // SEND COOKIE + RESPONSE
    res
      .status(statusCode)
      .cookie("token", token, {
        expires: new Date(
          Date.now() +
            process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),

        httpOnly: true,

        secure: false, // true in production

        sameSite: "strict",
      })

      .json({
        success: true,
        message,
        token,
        user,
      });

  } catch (error) {

    console.log(
      "Error from generateToken function:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Token generation failed",
    });
  }
};