import { cache } from "react";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "./auth.config";

import connectMongo from "@/lib/db/mongodb";

import User from "@/models/User";

import { LoginSchema } from "@/features/auth/validation";

const nextAuth = NextAuth({
    ...authConfig,

    providers: [
        Credentials({
            name: "Credentials",

            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                },

                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                await connectMongo();

                const parsed = LoginSchema.safeParse(credentials);

                if (!parsed.success) {
                    return null;
                }

                const { username, password } = parsed.data;

                const user = await User.findOne({
                    username,
                });

                if (!user) {
                    return null;
                }

                if (user.status !== "ACTIVE") {
                    return null;
                }

                const { verifyPassword } = await import(
                    "@/lib/auth/password"
                );

                const passwordValid = await verifyPassword(
                    password,
                    user.passwordHash,
                );

                if (!passwordValid) {
                    return null;
                }

                await User.updateOne(
                    { _id: user._id },
                    {
                        $set: {
                            lastLoginAt: new Date(),
                        },
                    },
                );

                return {
                    id: user._id.toString(),

                    username: user.username,

                    role: user.role,

                    memberId: user.memberId?.toString() ?? null,
                };
            },
        }),
    ],
});

export const { handlers, signIn, signOut } = nextAuth;

export const auth = cache(nextAuth.auth);
