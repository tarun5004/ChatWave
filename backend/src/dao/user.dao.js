import userModel from "../models/user.model.js";

const createHttpError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

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

export const getUserByLoginIdentifier = async (identifier) => {
    return await userModel.findOne({
        $or: [
            { email: identifier.toLowerCase() },
            { username: identifier }
        ]
    });
}

//-----------------------------Get User By ID---------------------------------
export const getUserById = async (id) => {
    return await userModel.findById(id).select("-password");
}

//-----------------------------Update User Profile---------------------------------
export const updateUserProfile = async (userId, updateData) => {
    if (!updateData.username && !updateData.email) {
        throw createHttpError("At least one field (username or email) must be provided for update", 400);
    }

    const duplicateChecks = [];
    if (updateData.username) duplicateChecks.push({ username: updateData.username });
    if (updateData.email) duplicateChecks.push({ email: updateData.email });

    if (duplicateChecks.length > 0) {
        const existingUser = await userModel.findOne({
            $or: duplicateChecks,
            _id: { $ne: userId }
        });
        if (existingUser) {
            throw createHttpError("Username or email already exists", 409);
        }
    }

    return await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
}



// -----------------------------Delete User---------------------------------
export const deleteUser = async (userId, password) => {
    if (!password) {
        throw createHttpError("Password is required to delete the user", 400);
    }
    // Verify the password before deleting the user
    const user = await userModel.findById(userId);
    if (!user) {
        throw createHttpError("User not found", 404);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw createHttpError("Invalid password", 401);
    }
    // Delete the user from the database
    return await userModel.findByIdAndDelete(userId);
}



// -----------------------------Get User By ID (For search)---------------------------------
export const getUserByEmailOrUsername = async ({email, username}) => {
    if (!email && !username) {
        throw createHttpError("At least one field (email or username) must be provided", 400);
    }

    const searchConditions = [];
    if (email) searchConditions.push({ email });
    if (username) searchConditions.push({ username });

    const user = await userModel.findOne({
        $or: searchConditions
    }).select("-password");
    return user;
}
