import { useEffect, useState } from "react"
import { LoaderCircle, Search, X } from "lucide-react"
import { useDebounce } from "../../../shared/hooks/useDebounce"
import { searchUsers } from "../api/users.api"
import Avatar from "../../../shared/components/Avatar"


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
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const users = await searchUsers(debounceQuery) //Mean searchUsers function is called with the debounced query to fetch users from the API.
                setResults(Array.isArray(users) ? users : []); // check if the response is an array, if not set results to an empty array
            }catch (err) {
                console.error(err);
                setResults([]);
            } finally {
                setLoading (false);
            }
        };
        fetchResults();
    }, [debounceQuery]);

    const clearSearch = () => {
        setQuery("")
        setResults([])
    }

    const handleQueryChange = (event) => { // event is the input change event, event.target.value is the new value of the input field
        const nextQuery = event.target.value
        setQuery(nextQuery)

        if (nextQuery.trim().length < 2) {
            setResults([])
        }
    }

    return (
        <div className="relative border-b border-neutral-200 bg-white px-3 py-2">
          <div className="flex h-10 items-center gap-3 rounded-lg bg-[#f0f2f5] px-3 text-neutral-500 focus-within:ring-1 focus-within:ring-emerald-500">
            <Search size={17} strokeWidth={2} aria-hidden="true" />
            <input 
              className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
              type="search" 
              value={query}
              onChange={handleQueryChange}
              placeholder="Search or start a new chat"
              aria-label="Search users"
              autoComplete="off"
            />
            {loading ? (
              <LoaderCircle size={17} className="animate-spin" aria-label="Searching" />
            ) : query ? (
              <button
                type="button"
                className="grid h-7 w-7 place-items-center rounded-full hover:bg-neutral-200"
                onClick={clearSearch}
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>

          {debounceQuery.trim().length >= 2 && !loading ? (
            <div className="absolute left-3 right-3 top-[58px] z-30 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl">
              {results.length > 0 ? (
                <ul className="max-h-72 overflow-y-auto py-1">
                {results.map((user)=> (
                    <li key={user._id}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-neutral-50"
                        onClick={() => {
                          onSelectUser(user)
                          clearSearch()
                        }}
                      >
                        <Avatar name={user.username} size="sm" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-neutral-900">
                            {user.username}
                          </span>
                          <span className="block truncate text-xs text-neutral-500">
                            {user.email}
                          </span>
                        </span>
                      </button>
                    </li>
                ))}
                </ul>
              ) : (
                <p className="px-4 py-5 text-center text-sm text-neutral-500">
                  No people found
                </p>
              )}
            </div>
          ) : null}
        </div>
    )
};

export default UserSearch;
