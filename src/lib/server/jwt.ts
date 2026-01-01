// src/lib/server/jwt.ts
import { SignJWT, jwtVerify } from "jose";
import type { Hex } from "viem";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export type JwtPayload = {
	userId: string;
	walletAddress: Hex;
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
