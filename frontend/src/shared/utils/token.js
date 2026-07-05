const ACCESS_TOKEN_KEY = "accessToken"

let accessToken =
    typeof localStorage === "undefined"
        ? null
        : localStorage.getItem(ACCESS_TOKEN_KEY)

export const tokenStore = {


    getAccessToken: () => {
        return accessToken;
    },


    setAccessToken: (newToken) => {
        accessToken = newToken;

        if (typeof localStorage !== "undefined" && newToken) {
            localStorage.setItem(ACCESS_TOKEN_KEY, newToken)
        }
    },


    clearAccessToken: () => {
        accessToken = null;

        if (typeof localStorage !== "undefined") {
            localStorage.removeItem(ACCESS_TOKEN_KEY)
        }
    }
}
