import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const token = await cookies().get("access_token")?.value;

  if (!token) {
    return Response.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, 'egqmp84vs3uu9mlhptjka079');
    return Response.json({ user: decoded }); // send only safe user info
  } catch {
    return Response.json({ user: null }, { status: 401 });
  }
}
