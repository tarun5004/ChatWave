import {useState, useEffect} from "react"
import { useDebounce } from "../../../shared/hooks/useDebounce"
import { searchUsers } from "../api/users.api"


/**
on selectUser prop -  this componet only doing search , is't decide what is going on 
if slect the user, it has only single resonsebility to search the user.

Toh flow yeh hai: child (UserSearch) sirf "yeh event hua" bolta hai, parent decide karta hai
"iska matlab kya hai". Isko callback prop pattern kehte hain — React mein sabse common pattern hai.
Jaise HTML mein <button onClick={...}> kaam karta hai — button ko nahi pata click hone pe kya hoga,
wahi tum decide karte ho.
Agar onSelectUser na deta toh UserSearch ke andar hi conversation-opening logic likhna padta — 
fir agar kal koi doosri jagah se bhi user search karna ho (jaise "new group banao" screen mein),
tumhe pura logic duplicate karna padta.
 */
const UserSearch = ({ onSelectUser }) => {
    const [query, setQuery] = useState("");  // current text of input 
    const [results, setResults] = useState([]); // set data that comes from api
    const [loading, setLoading] = useState(false); // working in process "indicator"

    const debounceQuery = useDebounce(query);

    useEffect(() => {
        if (debounceQuery.trim().length < 2) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const users = await searchUsers(debounceQuery)
                setResults(users);
            }catch (err) {
                console.error(err);
                setResults([]);
            } finally {
                setLoading (false);
            }
        };
        fetchResults();
    }, [debounceQuery]);

    return (
        <div>
            <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username or email"
            />
            {loading && <p>Searching...</p>}
            <ul>
                {results.map((user)=> (
                    <li key={user._id} onClick={() => onSelectUser(user)}>
                        {user.username} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default UserSearch;