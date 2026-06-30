import userModel from "../models/user.model.js";


export const createUser = async ({ username, email, password }) => {

    const newuser = new userModel({ username, email, password });
    await newuser.save();
    return newuser;
}

export const getUserByEmailOrUsername = async ({email, username}) => {
    return await userModel.findOne({ 
        $or: [
            {email},
            {username},
        ]
    });
    return user;
}