import { useDispatch, useSelector } from "react-redux";
import {
    getMe,
    loginUser,
    logoutUser,
    registerUser,
} from "../store/authSlice";


//-------------------useAuth-------------------//
export const useAuth = () => {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    // Return the auth state and action dispatchers
    return {
        ...authState,
        register: (payload) => dispatch(registerUser(payload)).unwrap(),
        login: (payload) => dispatch(loginUser(payload)).unwrap(),
        logout: () => dispatch(logoutUser()).unwrap(),
        getMe: () => dispatch(getMe()).unwrap(),
    };
}
