import { useState, useEffect } from "react";

export const useDebounce = (value , delay = 400) => {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounceValue (value), delay);
        return () => clearTimeout(timer); //cancle the previous timeout if value chnage again
    }, [value, delay])

    return debounceValue;
};

/**
 * Yeh kyun kaam karta hai: har keystroke pe value badalta hai, useEffect re-run hota hai,
 *  purana setTimeout cancel (clearTimeout) hokar naya start hota hai. Sirf jab user 400ms
 *  tak type nahi karta, timer poora chalta hai aur debouncedValue update hoti hai.
 */