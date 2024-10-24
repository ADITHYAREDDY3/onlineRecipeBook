import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { db } from '../../db'; 

export const recipeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      ingredients: z.string(),
      instructions: z.string(),
      imageUrl: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error("Unauthorized");
      }
      return await db.recipe.create({
        data: {
          ...input,
          userId: userId, 
        },
      });
    }),

  getAll: publicProcedure.query(async () => {
    return await db.recipe.findMany({
      orderBy:{
        createdAt: 'desc'
      }
    }); 
  }),

  getById: publicProcedure.input(z.number()).query(async ({ input }) => {
    return await db.recipe.findUnique({
      where: { id: input },
    });
  }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      ingredients: z.string().optional(),
      instructions: z.string().optional(),
      imageUrl: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      return await db.recipe.update({
        where: { id: input.id },
        data: input,
      });
    }),

  delete: protectedProcedure.input(z.number()).mutation(async ({ input }) => {
    return await db.recipe.delete({
      where: { id: input },
    });
  }),
});