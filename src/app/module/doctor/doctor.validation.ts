import z from "zod";

export const updateDoctorZodSchema = z.object({
    name:z.string("Name is required").min(5,"Name must be at least 5 characters long").max(30,"Name must be at most 30 characters long").optional(),
    profilePhoto:z.string("Profile photo URL is required").optional(),
    contactNumber:z.string("Contact number is required").min(11,"Contact number must be at least 11 characters long").max(14,"Contact number must be at most 14 characters long").optional(),
    address:z.string("Address is required").min(10,"Address must be at least 10 characters long").max(100,"Address must be at most 100 characters long").optional(),
    experience:z.number("Experience is required").nonnegative("Experience cannot be negative").optional(),
}).partial()