const jwt = require("jsonwebtoken");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyeUBnbWFpbC5jb20iLCJpYXQiOjE3MzU1NjgzNDYsImV4cCI6MTczNTY1NDc0Nn0.Yxn8sRmTpLIC2aM8-DaHIT6nshFhfthHgAPZHS1vacs";
const secret = "VJfuF7$6Q6z7!2z";

try {
    const decoded = jwt.verify(token, secret);
    console.log("Decoded Token:", decoded);
} catch (err:any) {
    console.error("Verification Error:", err.message);
}