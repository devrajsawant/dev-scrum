import { z } from "zod";

export const projectSchema = z.object({
    name:z.string().min(1,"Project name is required").max(50,"Project name must be of 50 character or less"),
    key:z.string().min(2,"Project key must be atleast of 2 characters").max(25,"Project name must be of 25 character or less"),
    description:z.string().max(500,"Description must be 500 characters or less").optional()
})

export const sprintSchema = z.object({
  name: z.string().min(1, "Sprint name is required"),
  startDate: z.date(),
  endDate: z.date(),
});