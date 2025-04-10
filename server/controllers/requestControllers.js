import BloodRequest from "../models/request.js"; // Import model
import matchDonor from "./utilities/matchDonor.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import User from "../models/user.js";

export const createBloodRequest = AsyncHandler(async (req, res,next) => {
  const { fullName, bloodType, urgency, location } = req.body;
  if(!fullName || !bloodType || !urgency || !location){
    return next(new ExpressError(400,"All fields are required.."));
  }
  const seekerId = req.user._id;
  let coordinates = location.split(",").map(Number);
  // Create a new blood request document
  const newRequest = new BloodRequest({
    fullName,
    seekerId,
    bloodType,
    urgency,
    location: {
      type: "Point",
      coordinates,
    },
  });
  // Save to database
  const savedRequest = await newRequest.save();
  // match Donor after saving request
  let isFound = await matchDonor(savedRequest); // returns boolean
  if (isFound) {
    // even if it is undefined not a pblm
    let data = await BloodRequest.findById(savedRequest._id).populate(
      "matchedDonorsId"
    );
    // console.log(data)
    return res.status(200).json({
      success: true,
      message: "Donor's Found Successfully...!",
      responseData: {
        status: data.status,
      matchedDonors: data.matchedDonorsId,
      }
    });
  }
  // Respond with inserted ID
  res.status(201).json({
    success: true,
    message: "Blood request created, matching in progress!",
    requestId: savedRequest._id,
  });
});

export const getAllRequests = AsyncHandler(async (req,res,next)=>{
    const currUser = await User.findOne({_id: req.user._id});
    // console.log(currUser);

    const nearestRequests = await BloodRequest.find({
        seekerId: { $ne: req.user._id }, // exclude user 
        location: {
            $near: {
                $geometry: currUser.location,
                $maxDistance: 5000 // 5km radius
          }
      }
  });
  // console.log(nearestRequests);
  res.status(200).json({success:true, responseData:{
    nearestRequests,
  }});
})
