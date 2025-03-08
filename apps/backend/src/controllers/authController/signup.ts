import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prismaSingleton from "../../config/db";

const client = prismaSingleton();
const saltRounds = 10;

export default async function signupController(
  req: Request,
  res: Response
): Promise<void> {
  const { email, password } = req.body;
  const isEmailAlreadyUsed = await client.user.findUnique({
    where: { email: email },
  });
  if (isEmailAlreadyUsed) {
    res.status(409).json({
      success: false,
      error: "Email already used",
      data: null,
    });
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create the user
  const user = await client.user.create({
    data: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      storageLimit: true,
      storageUsed: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      data: null,
    });
    return;
  }
  res.status(201).json({
    success: true,
    error: null,
    data: user,
  });
  return;
}
