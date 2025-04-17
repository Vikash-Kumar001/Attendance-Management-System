// import jwt from "jsonwebtoken";
// import User from "../models/Users.js";

// // ✅ Middleware to protect private routes
// const protect = async (req, res, next) => {
//   let token;

//   // Check if Authorization header exists and starts with Bearer
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");

//       if (!req.user) {
//         return res.status(401).json({ message: "User not found" });
//       }

//       next();
//     } catch (error) {
//       console.error("JWT verification failed:", error.message);
//       return res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   } else {
//     return res.status(401).json({ message: "Not authorized, no token" });
//   }
// };

// // ✅ Middleware to restrict access to admins only
// const adminOnly = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     return res.status(403).json({ message: "Admin access only" });
//   }
// };

// export { protect, adminOnly };


import jwt from "jsonwebtoken";
import User from "../models/Users.js";

// ✅ Middleware to protect private routes
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from the header
      token = req.headers.authorization.split(" ")[1];

      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user data to the request object (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      // Check if user exists
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Proceed to the next middleware
      next();
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// ✅ Middleware to restrict access to admins only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role && req.user.role === "admin") {
    next(); // User is an admin, continue to the next middleware
  } else {
    return res.status(403).json({ message: "Admin access only" });
  }
};

export { protect, adminOnly };
