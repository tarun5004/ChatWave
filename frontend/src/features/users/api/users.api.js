
import httpClient from "../../../shared/api/httpClient";

export const searchUsers = async (query) => {
    const response = await httpClient.get(`/users?search=${query}`);
    return response.data.users;
};




/**
 * Sawaal: "User type karega search box mein — kya har keystroke pe API call maru?"
 *  Nahi — agar user "tarun" type kar raha hai, 5 letters = 5 API calls, wasteful aur
 *  backend pe load. Isliye debounce chahiye — user ke type rukne ke 400ms baad hi call karo.
 * 
 * Yeh function sirf ek kaam karta hai — API call. Component ke andar seedha axios.get nahi likhta, 
 * kyunki kal agar endpoint change ho, yahan ek jagah fix karna hai, 10 components mein nahi.
 */