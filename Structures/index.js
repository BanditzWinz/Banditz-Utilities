// 24/7

const express = require('express')
const app = express();
const port = 3000

app.get('/', (req, res) => res.send('Bot is now running 24/7'))

app.listen(port, () =>
console.log('Your app is listening a http://localhost:${port}')
);

// Discord Bot Requirements
const { Client, Collection } = require("discord.js");
const client = new Client({intents: 32767});
const { Token } = require("./config.json");

const { promisify } = require("util");
const Ascii = require("ascii-table");
const { glob } = require("glob");
const PG = promisify(glob);

client.commands = new Collection();

// Logging System Client
//const logs = require('discord-logs');
//logs(client, {
//    debug: true
//})

// Music System Requirements
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()]
});

module.exports = client;

require("../Systems/GiveawaySys")(client);

["Events", "Commands"].forEach(handler => {
    require(`./Handlers/${handler}`)(client, PG, Ascii);
});

client.login(Token);
