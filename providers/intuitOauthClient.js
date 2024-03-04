const OAuthClient = require("intuit-oauth");

const oauthClient = new OAuthClient({
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    environment: process.env.REACT_APP_ENVIRONMENT,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
});

module.exports = {
    oauthClient
}