import User from "../models/user.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import validateUser from "../middlewares/validateUser.js";
import { errorHandler } from "../utils/errorHandler.util.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getCoordinates } from "../controllers/utilities/nameToLatLong.js";

export const userSignUp = asyncHandler(async (req, res, next) => {
  let { fullName, username, password, email, phone, bloodType, location } = req.body;
  if (!fullName || !username || !email || !phone || !password || !bloodType || !location) {
    return next(new errorHandler( "All fields are required", 400)) ;
  }
  const rawCoordinates = await getCoordinates(location);
  if(rawCoordinates === null) {
    return next(new errorHandler("Invalid location name", 400));
  }
  
  // Ensure coordinates is always an array
  const coordinates = Array.isArray(rawCoordinates) ? rawCoordinates : [0, 0];

  const user = await User.findOne({ username });
  if (user) {
    return next(new errorHandler("User already exists", 400));
  }
  
  let userData = {
    fullName,
    username,
    password,
    email,
    phone,
    bloodType,
    location: {
      type: "Point",
      coordinates,
    },
  }
  validateUser(userData); // if there is any error it will throw an error caught by AsyncHandler
  const hashedPassword = await bcrypt.hash(password, 10);
  userData.password = hashedPassword;
  
  const newUser = new User(userData);
  await newUser.save(); // Added await
  // Generate and send JWT
  const tokenData = {
    _id: newUser?._id,
  };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      responseData: {
        newUser,
        token
      },
    });
});


// User Login 
export const userLogin = asyncHandler(
  async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new errorHandler("Your password or username is empty", 400))
    }

    const user = await User.findOne({ username });
    if (!user) {
      return next(new errorHandler("Your password or username is Invalid!", 400))
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return next(new errorHandler("Invalid credentials", 401));
    }

    // Generate and send JWT
    const tokenData = {
      _id: user?._id,
    }
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

    res.status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })
      .json({
        success: true,
        message: "Login successful",
        responseData: {
          user,
          token
        }
      })
  }
)


export const getProfile = asyncHandler(async (req, res, next) => {
  const userData = await User.findById(req.user._id)
    .populate({
      path: 'userBloodRequests',
      populate: {
        path: 'matchedDonorsId',
        model: 'User'
      }
    });
  res.status(200).json({
    success: true,
    responseData: userData
  });
})

export const getProfileById = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const userData = await User.findById(userId);
    
  res.status(200).json({
    success: true,
    responseData: userData
  });
})


export const userLogout = asyncHandler(
  async (req, res, next) => {

    res.status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "User logged out"
      });
  }
);