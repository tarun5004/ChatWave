import { body } from "express-validator";
import { validateRequest } from "../utils/validation.utils.js";

export const registerUserValidator = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    body("email")
        .trim()
        .normalizeEmail() 
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    validateRequest
]

//-----------------------------Login User---------------------------------
export const loginUserValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email or username is required"),
    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    validateRequest
];


// -----------------------------Update Profile---------------------------------
export const updateProfileValidator = [
    body("username")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    body("email")
        .optional({ values: "falsy" })
        .trim()
        .normalizeEmail()
        .isEmail().withMessage("Invalid email format"),
    validateRequest
];
