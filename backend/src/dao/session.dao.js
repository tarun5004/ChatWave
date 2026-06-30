import sessionModel from "../models/session.model.js";


/**  -----------Create a new session -----------
@param {Object} params - The parameters for creating a new session.
@param {string} params.userId - The ID of the user for whom the session is being created.
@param {string} params.refreshToken - The refresh token associated with the session.
@returns {Promise<Object>} - A promise that resolves to the newly created session object.
*/

export const createSession = async ({ userId, refreshToken }) => {
    const existingSession = await sessionModel.findOne({ userId });

    if (existingSession) {
        existingSession.refreshToken = refreshToken;
        return await existingSession.save();
    }

    return await sessionModel.create({ userId, refreshToken });
}


/**
 * Retrieve a session by user ID.
 * @param {Object} params - The parameters for retrieving a session.
 * @param {string} params.userId - The ID of the user whose session is being retrieved.
 * @param {string} params.refreshToken - The refresh token associated with the session.
 * @returns {Promise<Object|null>} - A promise that resolves to the session object if found, or null if not found.
 */

export const getSessionByUserId = async ({ userId, refreshToken }) => {
    return await sessionModel.findOne({ userId, refreshToken });
}



//-----------------------------Update Session---------------------------------
export const updateSession = async ({ userId, refreshToken }) => {
    const session = await sessionModel.findOneAndUpdate({ userId }, { refreshToken }, { new: true });
    if (!session) {
        throw new Error("Session not found");
    }
    return session;
}
export default {
    createSession,
    getSessionByUserId,
    updateSession
};

