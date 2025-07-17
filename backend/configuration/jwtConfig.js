// import crypto from 'crypto';

// const secretKey = crypto.randomBytes(32).toString("hex");
// console.log("Generated JWT Secret Key:", secretKey); // Debugging log

// export default secretKey;

// jwtConfig.js
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET || 'your-secure-secret-key-here';
export default secretKey;