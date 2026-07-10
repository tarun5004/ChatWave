import * as userDao from '../dao/user.dao.js';

export const searchUsers = async (req, res, next) => {
    try {
        const { search } = req.query;

        if (!search || search.trim().length < 2) {
            return res.status(400).json({ message: "Search query must be at least 2 characters long." });
        }

        const users = await userDao.searchUsers(search.trim(), req.user._id);
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};