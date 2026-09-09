import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import {polar, checkout, portal} from "@polar-sh/better-auth";
import { polarClient } from "./polar";

import * as schema from "@/db/schema";
import { db } from "@/db"; 


export const auth = betterAuth({
   plugins: [
    polar({
         client: polarClient,
         // Kept off so sign-up never depends on a Polar API round-trip. The
         // customer is created lazily on first checkout instead; enabling this
         // makes every failed Polar call (bad token, wrong server) abort
         // sign-up before a session is issued.
         createCustomerOnSignUp:false,
         use: [
            checkout({
             authenticatedUsersOnly: true,
             successUrl: '/upgrade',
            }),
            portal(),
         ],
    }),
   ],
    // Better Auth rejects requests from origins not listed here, so the
    // deployed URL has to be included or sign-in fails in production. Read it
    // from the environment rather than hardcoding, so the same code works on
    // Vercel, on an ngrok tunnel, and locally.
    trustedOrigins: [
        "http://localhost:3000",
        process.env.NEXT_PUBLIC_APP_URL,
        process.env.BETTER_AUTH_URL,
        process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    ].filter((origin): origin is string => Boolean(origin)),
    
     socialProviders: {
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
         google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        },
        
    },

    emailAndPassword:{
        enabled:true,
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema:{
            ...schema,
        },
    }),
});

