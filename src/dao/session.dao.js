import sessionModel from "../dao/session.dao.js";


/**  -----------Create a new session -----------
@param {Object} params - The parameters for creating a new session.
@param {string} params.userId - The ID of the user for whom the session is being created.
@param {string} params.refreshToken - The refresh token associated with the session.
@returns {Promise<Object>} - A promise that resolves to the newly created session object.
*/

export const createSession = async (req, res) => {
    const { userId, refreshToken } = req.body;
    const session = await sessionModel.create({ userId, refreshToken });
    res.status(201).json({ message: "Session created successfully", session });

    return session;
}


/**  -----------Retrieve a session by user ID -----------
@param {Object} params - The parameters for retrieving a session.
@param {string} params.email - The email of the user whose session is being retrieved.
@param {string} params.username - The username of the user whose session is being retrieved.
@returns {Promise<Object|null>} - A promise that resolves to the session object if found, or null if not found.
*/

export const getUserByEmailOrUsername = async (req, res) => {
    const user = await userModel.findOne({
        $or: [
            { email: req.body.email },
            { username: req.body.username }
        ]
    });

    if (!user) {
        return null;
    }

    const session = await sessionModel.findOne({ userId: user._id });
    return session;
}