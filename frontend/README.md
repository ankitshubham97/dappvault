# Dappvault frontend

## Demo App:
Main interface(for members): https://dappvault-frontend.vercel.app/

Admin interface: https://dappvault-frontend.vercel.app/admin

## How to run locally
Auth server requires [Node.js](https://nodejs.org/) v10+ to run. The demo app is deployed with v16.16.0

Install the dependencies and devDependencies

```sh
git clone git@github.com:ankitshubham97/dappvault.git
cd dappvault/frontend
npm i
```

You would probably want to point the app to your locally deployed backend at http://localhost:3000  (You would probably need to change frontend/src/constants.js file a bit. Change the value of `API_BASE_URL` to `http://localhost:3000` (or wherever your backend is deployed).

Start the server.
```sh
npm run start
```
It should be up and running at http://localhost:3001

