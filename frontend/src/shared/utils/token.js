let accessToken = null;

export const tokenStore = {


    getAccessToken: () => {
        return accessToken;
    },


    setAccessToken: (newToken) => {
        accessToken = newToken;
    },


    clearAccessToken: () => {
        accessToken = null;
    }
}