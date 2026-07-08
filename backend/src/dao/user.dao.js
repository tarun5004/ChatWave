import userModel from "../models/user.model.js";

//-----------------------------Create User---------------------------------
export const createUser = async ({ username, email, password }) => {

    const newuser = new userModel({ username, email, password });
    await newuser.save();
    return newuser;
}


// //-----------------------------Get User By Email or Username---------------------------------
// export const getUserByEmailOrUsername = async ({email, username}) => {
//     return await userModel.findOne({ 
//         $or: [
//             {email},
//             {username},
//         ]
//     });
// }

//-----------------------------Get User By Email---------------------------------
export const getUserByEmail = async (email) => {
    return await userModel.findOne({ email });
}

//-----------------------------Get User By ID---------------------------------
export const getUserById = async (id) => {
    return await userModel.findById(id).select("-password");
}

//-----------------------------Update User Profile---------------------------------
export const updateUserProfile = async (userId, updateData) => {
    if (!updateData.username && !updateData.email) {
        throw new Error("At least one field (username or email) must be provided for update");
    }
    if (updateData.username && updateData.username) {
        const existingUser = await userModel.findOne({
            $or: [
                { username: updateData.username },
                { email: updateData.email }
            ],
            _id: { $ne: userId } // Exclude the current user from the search
        });
        if (existingUser) {
            throw new Error("Username or email already exists");
        }
    }
    return await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
}



// -----------------------------Delete User---------------------------------
export const deleteUser = async (userId, password) => {
    if (!password) {
        throw new Error("Password is required to delete the user");
    }
    // Verify the password before deleting the user
    const user = await userModel.findById(userId);
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    // Delete the user from the database
    return await userModel.findByIdAndDelete(userId);
}



// -----------------------------Get User By ID (For search)---------------------------------
export const getUserByEmailOrUsername = async ({email, username}) => {
    if (!email && !username) {
        throw new Error("At least one field (email or username) must be provided");
    }
    const user = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    }).select("-password");
    return user;
    
    await userCacheService.getUserByEmailOrUsername({ email, username });
    
    }
