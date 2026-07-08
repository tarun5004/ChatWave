import sessionModel from "../models/session.model.js";

/**
 * Create or update user session.
 * If session already exists, update refresh token and save it.
 * save() will trigger pre-save hook, so refreshToken will be hashed.
 */
export const createSession = async ({ userId, refreshToken }) => {
    const existingSession = await sessionModel.findOne({ userId });

    if (existingSession) {
        existingSession.refreshToken = refreshToken;
        return await existingSession.save();
    }

    return await sessionModel.create({ userId, refreshToken });
};

/**
 * Get session by userId only.
 * Do not search by refreshToken because refreshToken is hashed in DB.
 */
export const getSessionByUserId = async (userId) => {
    return await sessionModel.findOne({ userId });
};



/**
 * Update refresh token safel
 * Do not use findOneAndUpdate because pre-save hook may not run.
 * 
 * i remove the update session function becuase it violet the schema rule
 * the schema rulw is that the refresh token not be null and 
 * this function will update the refresh token to null if the user logout and then the user will not be able to login again because the refresh token is null
 * so i will use the delete session function to delete the session when the user logout and then create a new session when the user login again
 * 
 *
*/
// export const updateSession = async ({ userId, refreshToken }) => {
//     const session = await sessionModel.findOne({ userId });

//     if (!session) {
//         throw new Error("Session not found");
//     }

//     session.refreshToken = refreshToken;
//     return await session.save();
// };

/**
 * Delete session on logout.
 */
export const deleteSession = async (userId) => {
    return await sessionModel.findOneAndDelete({ userId });
};

export default {
    createSession,
    getSessionByUserId,
    // updateSession,
    deleteSession
};