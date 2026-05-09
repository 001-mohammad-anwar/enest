import User from "../model/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

// REGISTER Controller

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        error: true,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

   generateToken(user, 201, "User registered successfully", res);

  } catch (error) {
    console.log("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// LOGIN CONTROLLER

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid credential",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // GENERATE TOKEN
   generateToken(user , 201 , "login successfully" , res);

  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET PROFILE Controller
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.userId

    const user = await User.findById(userId).select("-password");

    return res.status(200).json({
      message: "User details fetched successfully",
      success: true,
      data : user,
      error: false
    });
  } catch (error) {
    console.log("PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: true
    });
  }
};


export const updateUserDetails = async (req, res) =>{
    try {
        const userId = req.userId;
        const {name , email , password } =req.body;

        let hashpassword;
        if(password){
            const salt = await bcrypt.genSalt(10);
            hashpassword = await bcrypt.hash(password , salt);      
        }

        const updateData = {
            ...(name && {name}),
            ...(email && {email}),
            ...(hashpassword && {password: hashpassword}),

        }

        const updateUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            {new: true}
        );

        if(!updateUser){
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }
     
      return res.status(201).json({
        message: "User updated successfully",
        error: false,
        success: true,
        data: updateUser
      })

        
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success : false
        })
    }
}