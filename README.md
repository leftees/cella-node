# cella-node

The hassle-free way to build AI assistant service for WeChat, this is the node.js client of Cella platform

## Run demo

`TOKEN=WECHAT_APPID DEBUG=* node demo.js`

## Run test

`make test`

## Configuration your WeChat

[How to configure your WeChat Official Account to use this service](https://github.com/10cella/cella-node/issues/1)

## 1 minute integrate your WeChat to your service

### Add `cella-node` to your project

`npm i cella-node --save`

### Implement your *hello world* robot

```javascript
const CellaClient = require('cella-node')

const client = new CellaClient({
	token: process.env.TOKEN,
})

client.on('connect', _ => console.log('>>> Connected >>>'))

client.on('message', msg => {
	client.sendTextMessage(msg.userId, `Hello World`)
}
```
