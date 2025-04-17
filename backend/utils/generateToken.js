// import jwt from "jsonwebtoken";

// const generateToken = (userId) => {
//   if (!process.env.JWT_SECRET) {
//     throw new Error("JWT_SECRET not set in environment variables");
//   }

//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//     expiresIn: "7d", // You can customize token duration here
//   });
// };

// export default generateToken;



import jwt from "jsonwebtoken";

// ✅ Function to generate JWT token
const generateToken = (userId) => {
  // Ensure that JWT_SECRET is set in the environment variables
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not set in environment variables");
  }

  // Generate and return a JWT token for the user
  return jwt.sign(
    { id: userId }, // Payload: Include user ID in the token
    process.env.JWT_SECRET, // Secret key for signing the token
    {
      expiresIn: "7d", // Token expiration duration (can be customized)
    }
  );
};

export default generateToken;
