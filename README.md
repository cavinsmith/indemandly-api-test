# indemandly-api-example

## Run
```
yarn start
```

When bot is configured and started properly, you'll see something like this in console:

```
1) Logging in as your@email.com and listing live chats...
2) Logged in and received 10 live chats
3) Selected 11111111-1111-1111-1111-111111111111 for connection, requesting chat token...
4) Received chat connection token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiTElWRUNIQVQiLCJ1dWlkIjoiMTExMTExMTEtMTExMS0xMTExLTExMTEtMTExMTExMTExMTExIn0.VyrmA33rYRPD2eNh48MX-IMzObTPRRpEOK1Uyf-8EfQ, connecting to socket.io...
5) Connected to socket, emitting admin auth...
6) Admin auth accepted, connected to chat 11111111-1111-1111-1111-111111111111
```

After that, socket will receive everything that admin can receive. And automatically answer to each message

## Build
```
yarn build
```
## Global packages

```
npm install nodemon -g
npm install mocha -g
npm install nyc -g
```

## Configuration
* Sample config files are located in `./config/development.js.dist`
