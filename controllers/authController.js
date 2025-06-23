const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const mailTransporter = require("../utils/mailTransporter");
const signupMailTemplate = require("../utils/signUpMailTemplate");


const signUp = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: " User already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      role,
    });
    await user.save();

    // Send welcome email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      ...signupMailTemplate(username),
    };

   
    await mailTransporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User registered successfully, email sent",
      user: { username, role },
    });
  } catch (error) {
    console.error("Error in register function:", error); // this logs the error
    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credential",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      token: token,
      user: { username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    //  JWT token that expires in 1hr
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );
   // when the user press this link the frontend people will code a page to direct user to reset password
   // Just for practices
   const resetLink = `http://localhost:${process.env.PORT}/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      html: `<p>Hello ${user.username},</p>
             <p>Click below to reset your password:</p>
             <a href="${resetLink}">Press here to Reset Password</a>`
    };

    await mailTransporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send reset link" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params; // taking or grabbing the token from the url params /reset-password/:token
  const { newPassword } = req.body;

  try {
    // Decode token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Finding  the user in the database using the ID stored in the token.
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // change password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    
   return res.status(400).json({ message: "Reset link has expired" });
    
  }
};


module.exports = {
  signUp,
  login,
  forgotPassword,
  resetPassword
};
