import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

   // console.log("Token found:", !!token); // Debug log

    if (!token) {
      return Response.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return Response.json({ user: decoded });
  } catch (error) {
    console.error("Token verification error:", error);
    return Response.json({ user: null }, { status: 401 });
  }
}
