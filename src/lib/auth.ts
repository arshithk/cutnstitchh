import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || "cutnstitch-super-secret-key-123",
);

export async function signToken(payload: { email: string }) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!token) return null;
    return await verifyToken(token);
}

export async function requireAuth(req: NextRequest) {
    const token = req.cookies.get("admin_session")?.value;
    if (!token) return null;
    return await verifyToken(token);
}
