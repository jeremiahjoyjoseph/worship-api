const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/user");
const ErrorHandler = require("../util/errorHandler");
const sendToken = require("../util/jwtToken");
const {
  SUCCESS,
  BAD_REQUEST,
  UNAUTHORIZED,
} = require("../util/httpStatusCodes");
const moment = require("moment");
const csv = require("csv-parser");
const fs = require("fs");

//Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //Checks if email or password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", BAD_REQUEST));
  }

  //Finding user in database
  const user = await User.findOne({ email }).select("+password");
  const userEmail = await User.findOne({ email });
  const userPassword = await User.findOne().select("+password");

  if (!userEmail) {
    return next(new ErrorHandler("Invalid email", UNAUTHORIZED));
  }

  if (!userPassword) {
    return next(new ErrorHandler("Invalid password", UNAUTHORIZED));
  }

  //Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid password", UNAUTHORIZED));
  }

  //Create JSON web token
  sendToken(user, SUCCESS, res);
});

//Register new user => /register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  let body = req.body;

  const user = await User.create({
    ...body,
  });

  res.status(SUCCESS).json({
    success: true,
    message: "User created",
    data: user,
  });
});

// Function to handle CSV insert
exports.registerUsersFromCSV = catchAsyncErrors(async (req, res, next) => {
  // Ensure a file is uploaded
  if (!req.files || !req.files.file) {
    return res.status(400).json({
      success: false,
      message: "No CSV file uploaded",
    });
  }

  const file = req.files.file;
  const filePath = `${process.env.UPLOAD_PATH_USER_CSV}/${file.name}`;

  // Save the file temporarily
  file.mv(filePath, function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    const users = [];

    // Read and parse CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        users.push(row);
      })
      .on("end", async () => {
        // Process each user row
        const savedUsers = [];
        for (const row of users) {
          // Create the user object using the Mongoose model
          try {
            const user = await User.create({
              firstName: row.firstName.toLowerCase(), // Converting to lowercase
              middleName: row.middleName ? row.middleName.toLowerCase() : "", // Optional, lowercase
              lastName: row.lastName.toLowerCase(), // Converting to lowercase
              nickname: row.nickname ? row.nickname.toLowerCase() : "", // Optional, lowercase
              email: row.email.toLowerCase().trim(), // Converting to lowercase and trimming
              phone: row.phone.trim(), // Trimming phone number
              username: row.username ? row.username.trim() : "", // Trimming username, if exists
              password: row.password, // Will be hashed by the pre('save') hook
              dob: row.dob, // Date of birth, should match DD/MM format in schema
              role: row.role || "guest", // Default to "guest" if not provided
              wtRolePrimary: row.wtRolePrimary || "", // Primary worship team role
              wtRoleSecondary: row.wtRoleSecondary || "", // Optional secondary worship team role
              wtRoleSpare: row.wtRoleSpare || "", // Optional spare worship team role
              allBandRoles: row.allBandRoles.toLowerCase() || false, // Default to false
              gender: row.gender.toLowerCase().trim(), // Gender, required
              md: row.md.toLowerCase() || false, // Default to false
              status: row.status || "active", // Default to "active" if not provided
              locationPrimary: row.locationPrimary
                ? row.locationPrimary.trim().toLowerCase()
                : "", // Primary location
              locationSecondary: row.locationSecondary
                ? row.locationSecondary.trim().toLowerCase()
                : "", // Optional secondary location
              locationSpare: row.locationSpare
                ? row.locationSpare.trim().toLowerCase()
                : "", // Optional spare location
              allLocations: row.allLocations.toLowerCase() || false, // Default to false
            });

            savedUsers.push(user);
          } catch (error) {
            console.error(`Error saving user ${row.email}:`, error);
          }
        }

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        // Send the response after processing
        return res.status(200).json({
          success: true,
          message: "Users created successfully",
          data: savedUsers,
        });
      })
      .on("error", (error) => {
        // Handle file reading error
        return res.status(500).json({
          success: false,
          message: "Error reading CSV file",
          error: error.message,
        });
      });
  });
});

//Log out user
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("passage", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "You have logged out successfully",
  });
});
