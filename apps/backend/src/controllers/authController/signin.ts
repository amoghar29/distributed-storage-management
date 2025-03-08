import prismaSingleton from "../../config/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const client = prismaSingleton();

export default async function signinController(
  req: Request,
  res: Response
): Promise<void> {
  const { email, password } = req.body;
  const user = await client.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid password" });
    return;
  }
  console.log("sk", process.env.JWT_SECRET);

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );
  console.log(token);

  res.status(200).json({ token });
  return;
}
