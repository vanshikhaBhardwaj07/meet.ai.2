import { initTRPC , TRPCError} from '@trpc/server';
import { cache } from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
export const createTRPCContext = async (opts?: { headers: Headers }) => {
  const reqHeaders = opts?.headers || await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  return { 
    auth: session,
    headers: reqHeaders,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ctx, next})=>{
      if(!ctx.auth){
        throw new TRPCError({ code: "UNAUTHORIZED", message:"UNAUTHORIZED"})
      }
      return next({ ctx:{...ctx, auth: ctx.auth }});
});