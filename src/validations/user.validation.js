
import z from "zod";

export const userSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name length should be maximum than 2."),
        email: z.email("Invalid email type."),
        password: z.string().min(6, "Password must be greater than 6 characters."),
    }),
})


