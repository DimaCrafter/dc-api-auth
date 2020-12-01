# dc-api-auth

## Example

**./config.json:**

```json5
{
    "port": 8080,

    // Enables `dc-api-auth/vk` if exists
    "vk": {
        // App ID
        "id": 0,
        // Secure key
        "secret": "<application secret code>",
        // Route path for redirect to VK login form
        "loginPath": "/Auth/vk",
        // Redirect URL for callback
        "callbackURL": "http://localhost:8080/Auth/vk_callback"
    },
    // Enables `dc-api-auth/google` if exists
    "google": {
        // Client ID
        "id": "<application id>",
        // Client secret
        "secret": "<application secret code>",
        // Route path for redirect to Google OAuth page
        "loginPath": "/Auth/google",
        // Redirect URL for callback
        "callbackURL": "http://localhost:8080/Auth/google_callback"
    },

    "plugins": ["dc-api-mongo", "dc-api-auth"],
    "db": {
        "mongo": "mongodb://..."
    },

    "session": {
        "store": "mongo",
        "secret": "random string"
    }
}
```

**./controllers/Auth.js:**

```js
const AuthVK = require('dc-api-auth/vk');
const AuthGoogle = require('dc-api-auth/google');

module.exports = class Auth {
    async vk_callback () {
        this.controller.social_handler('vk', await AuthVK.parse(this));
    }

    async google_callback () {
        this.controller.social_handler('google', await AuthGoogle.parse(this));
    }

    /** @param {import('dc-api-auth').ParsedUserInfo} info */
    async social_handler (type, info) {
        if (info.error) return this.send(info.error, info.code);

        this.send({
            type, ...info
        });
    }
}
```

**Front-end:**

Now you can use `API.Auth.vk()` or `API.Auth.google()` with dc-api-client (crossdomain way)
or just redirect to <http://localhost:8080/Auth/vk> or <http://localhost:8080/Auth/google>.

> **Attention!** Crossdomain redirect (also including subdomains, ex. from example.com to api.example.com)
> in most cases will have unexpected behaviour. Using dc-api-client is more preferred.
