require("dotenv").config()
const Insta = require("node-ig-framework");
const connection = require("./utils/connection");
const chokidar = require('chokidar');
const path = require('path');

let messageHandler = require("./messageHandler");

const client = new Insta.Client({
    disableReplyPrefix: true
});
const { IG_USERNAME, IG_PASSWORD } = process.env

// connection
client.on("connected", () => connection({ client }))
client.login(IG_USERNAME, IG_PASSWORD);

client.on("messageCreate", async (msg) => await messageHandler({ client, bot: msg }))

function reloadMessageHandler() {
    console.log("Reloading messageHandler...");
    try {
        delete require.cache[require.resolve("./messageHandler")];
        messageHandler = require("./messageHandler")
        console.log('messageHandler reloaded successfully.');
    } catch (error) {
        console.error('Error reloading messageHandler:', error);
    }
}


const watcher = chokidar.watch(path.resolve(__dirname, 'messageHandler.js'));
watcher.on('change', (changedPath) => {
    if (changedPath === path.resolve(__dirname, 'messageHandler.js')) {
        console.log(`File ${changedPath} has changed.`);
        reloadMessageHandler();
    }
});