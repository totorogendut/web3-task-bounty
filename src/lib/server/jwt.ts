// src/lib/server/jwt.ts
import { JWT_SECRET } from "$env/static/private";
import { SignJWT, jwtVerify } from "jose";
import type { Hex } from "viem";

const secret = new TextEncoder().encode(JWT_SECRET);

export type JwtPayload = {
	userId: Hex;
};

export async function createJwt(payload: JwtPayload) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d") // adjust
		.sign(secret);
}

export async function verifyJwt(token: string) {
	const { payload } = await jwtVerify<JwtPayload>(token, secret);
	return payload;
}
