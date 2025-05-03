import { z } from 'zod'
export const schema = z
  .object({
    name: z
      .string()
      .min(5, 'Username is 5 to 255 characters')
      .max(255, 'Username is 5 to 255 characters'),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z
      .string()
      .min(3, 'Password is 3 to 255 characters')
      .max(255, 'Password is 3 to 255 characters'),
    passwordConfirm: z
      .string()
      .min(3, 'Password is 3 to 255 characters')
      .max(255, 'Password is 3 to 255 characters'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  })
