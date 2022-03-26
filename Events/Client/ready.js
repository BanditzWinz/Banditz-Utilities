const { DatabaseUrl } = require("../../Structures/config.json");
const { Client } = require("discord.js")
const mongoose = require("mongoose");

module.exports = {
    name: "ready",
    once: true,
    /**
    * @param {Client} client
    */
    async execute(client) {
        console.log('✅ Banditz Utilities is now ready!');
        // client.user.setPresence({ activities: [{ name: ` with Your Mom`, type: `STREAMING`, url: `https://www.twitch.tv/banditzwinz`}], status: 'dnd' });
        client.user.setPresence({ activities: [{ name: ` Banditz Basement`, type: `WATCHING`}], status: 'dnd' });


        if(!DatabaseUrl) return;
        mongoose.connect(DatabaseUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("✅ Connected to the database!")
        }).catch((err) => {
            console.log(err)
        });
    },
};