import jwt from "jsonwebtoken"
import User from "../model/user.model.js"

export const isAuthenticated = async (req, res, next) => {
  try {

    let token;

    // 1. CHECK COOKIE
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    // 2. CHECK AUTH HEADER
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }


    // NO TOKEN
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // SAVE USER ID
    req.userId = decoded.userId;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });

  }
};

