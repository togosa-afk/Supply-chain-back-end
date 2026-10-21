
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../models/user";
import { type RegisterInput, UserRole } from "./auth.types";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error("JWT_SECRET environment variable is not set");
}

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const exsistigUser = await User.findOne({ where: { email } }) // TODO: move to service

        if (exsistigUser) {
            return res.status(400).json({ message: "email already exists" })
        }

        if (!name || !email || !password) {
            return res.status(400).json({ message: "fill all the blanks" })
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: passwordHash,
            role: UserRole.CUSTOMER
        })

        await newUser.save();

        res.status(201).json({ message: "user registered", })
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "fill the blanks" })
        }

        const user = await User.findOne({ where: { email } }); // move to servise

        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "invalid credintials" })
        }

        const token = jwt.sign(
            { email: user.email },
            secretKey,
            { expiresIn: "1d" }
        )

        res.status(200).json({
            message: "user logged in successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }catch(error){
        res.status(500).json({message:"internal server error"})
    }
}
