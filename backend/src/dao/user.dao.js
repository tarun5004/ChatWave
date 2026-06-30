import userModel from "../models/user.model.js";

//-----------------------------Create User---------------------------------
export const createUser = async ({ username, email, password }) => {

    const newuser = new userModel({ username, email, password });
    await newuser.save();
    return newuser;
}


//-----------------------------Get User By Email or Username---------------------------------
export const getUserByEmailOrUsername = async ({email, username}) => {
    return await userModel.findOne({ 
        $or: [
            {email},
            {username},
        ]
    });
}

//-----------------------------Get User By Email---------------------------------
export const getUserByEmail = async (email) => {
    return await userModel.findOne({ email });
}

//-----------------------------Get User By ID---------------------------------
export const getUserById = async (id) => {
    return await userModel.findById(id).select("-password");
}
