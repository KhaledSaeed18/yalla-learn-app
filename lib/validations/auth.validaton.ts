import { z } from "zod";

// Block common disposable email domains
const BLOCKED_DOMAINS = [
    'test.com',
    'example.com',
    'localhost.com',
    'tempmail.com',
    'throwaway.com',
    'mailinator.com',
    'guerrillamail.com',
    'yopmail.com',
    'temp-mail.org',
    'fakeinbox.com',
    '10minutemail.com',
    'trashmail.com',
    'sharklasers.com',
    'mailnesia.com',
    'disposable.com',
    'getnada.com',
    'dispostable.com',
    'maildrop.cc'
];

// Commonly used passwords should be avoided
const COMMON_PASSWORDS = [
    'Password123!',
    'Admin123!',
    'P@ssw0rd',
    'P@ssw0rd2024',
    'P@ssw0rd2025',
    'Qwerty123!',
    'Welcome123!',
    'Secret123!',
    'Letmein123!',
    'ABC123abc!',
    '12345678Aa!',
    'Password1!',
    'Abcd1234!',
    'Login1234!',
    'Winter2025!',
    'Summer2025!',
    'Spring2025!',
    'Fall2025!',
    'Pa$$w0rd',
    'Adm1n123!',
    'L0g1n!123',
    'W3lc0me!',
    'Ch4ng3m3!'
];

const signupSchema = z.object({
    firstName: z.string()
        .trim()
        .min(1, "First name is required")
        .max(50, "First name cannot exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),

    lastName: z.string()
        .trim()
        .min(1, "Last name is required")
        .max(50, "Last name cannot exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),

    email: z.string()
        .trim()
        .email("Invalid email format")
        .refine(email => {
            const domain = email.split('@')[1];
            return !BLOCKED_DOMAINS.includes(domain.toLowerCase());
        }, "This email domain is not allowed. Please use a different email address"),

    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password cannot exceed 64 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
        .refine(
            (password) => !COMMON_PASSWORDS.includes(password),
            "This password is too common. Please choose a more unique password."
        ),
});

// Signin schema
const signinSchema = z.object({
    email: z.string()
        .trim()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),

    password: z.string()
        .min(1, "Password is required")
        .max(64, "Password exceeds maximum length")
});

// Refresh token schema
const refreshTokenSchema = z.object({
    refreshToken: z.string()
        .min(1, "Refresh token is required")
});

// Email verification schema
const verifyEmailSchema = z.object({
    email: z.string()
        .trim()
        .email("Invalid email format"),

    code: z.string()
        .trim()
        .length(6, "Verification code must be 6 digits")
        .regex(/^\d{6}$/, "Verification code must contain only digits")
});

// Resend verification schema
const resendVerificationSchema = z.object({
    email: z.string()
        .trim()
        .email("Invalid email format")
});

export {
    signupSchema,
    signinSchema,
    refreshTokenSchema,
    verifyEmailSchema,
    resendVerificationSchema
};