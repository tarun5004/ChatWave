import * as userDao from "../dao/user.dao.js";


export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await userDao.getUserByEmailOrUsername({ email, username });
    if (existingUser) {
        return res.status(400).json({ message: "Email or username already exists" });
    }

    const newUser = await userDao.createUser({ username, email, password });
    res.status(201).json({ message: "User registered successfully", user: newUser });
}