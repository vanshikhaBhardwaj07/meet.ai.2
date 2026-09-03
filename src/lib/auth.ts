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
         createCustomerOnSignUp:true,//this will allow us to synchronize our users with polar customers.
         use: [
            checkout({
             authenticatedUsersOnly: true,
             successUrl: '/upgrade',
            }),
            portal(),
         ],
    }),
   ],
    trustedOrigins: [
        "http://localhost:3000",
        "https://percy-drowsy-arlen.ngrok-free.dev",
    ],
    
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

