import { z } from 'zod'
export const schema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required')
    .refine((v) => v !== null, { message: 'Not empty' }),
  password: z
    .string()
    .min(3, 'Password is 3 to 255 characters')
    .max(255, 'Password is 3 to 255 characters')
    .refine((v) => v !== null, { message: 'Not empty' }),
})
