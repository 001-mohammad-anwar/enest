import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },


  },
  {
    timestamps: true,
  },
);

// HASH PASSWORD
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    // next(error);
  }
});

// COMPARE PASSWORD
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// GENERATE TOKEN
// console.log("JWT_SECRET", JWT_SECRET)
userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    },
  );
};

const User = mongoose.model("User", userSchema);

export default User;
