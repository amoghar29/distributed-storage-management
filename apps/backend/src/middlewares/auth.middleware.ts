import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ success: false, error: "Please login to continue" });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as unknown;
    console.log(decoded);
    const user = decoded as { id: string; role: string };

    if (!user) {
      res
        .status(403)
        .json({ success: false, error: "Invalid or expired token." });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {

    res
      .status(403)
      .json({ success: false, error: error.message || "Invalid token" });
    return;
  }
}

export default authMiddleware;
