const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "music",
    alisis: "m",
    description: "Complete music system.",
    options: [
        { name: "play", description: "Play a song", type: "SUB_COMMAND",
            options: [{ name: "query", description: "Provide a name or a url for the song.", type: "STRING", required: true}]
        },
        { name: "volume", description: "Alter the volume of the song playing", type: "SUB_COMMAND",
            options: [{ name: "percent", description: "10 = 10%", type: "NUMBER", required: true}]
        },
        { name: "settings", description: "Select an option", type: "SUB_COMMAND",
            options: [{ name: "options", description: "Select an option.", type: "STRING", required: true,
            choices: [
                {name: "π’ View Queue", value: "queue"},
                {name: "β­οΈ Skip Song", value: "skip"},
                {name: "βΈοΈ Pause Song", value: "pause"},
                {name: "πΌ Resume Song", value: "resume"},
                {name: "βΉοΈ Stop Music", value: "stop"},
                {name: "π Shuffle Queue", value: "shuffle"},
                {name: "π Toggle Autoplay Modes", value: "AutoPlay"},
                {name: "π Add a Related Song", value: "RelatedSong"},
                {name: "π Toggle Repeat Mode", value: "RepeatMode"}
            ]}]
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;
        const VoiceChannel = member.voice.channel;

        if(!VoiceChannel)
        return interaction.reply({content: "You must be in a voice channel to be able to use the music commands.", ephemeral: true});

        if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
        return interaction.reply({content: `I'm always playing music in <#${guild.me.voice.channelId}>.`, ephemeral: true});

        try {
            switch(options.getSubcommand()) {
                case "play" : {
                    client.distube.play( VoiceChannel, options.getString("query"), { textChannel: channel, member: member });
                    return interaction.reply({content: "π΅ Request recieved."});
                }
                case "volume" : {
                    const Volume = options.getNumber("percent");
                    if(Volume > 100 || Volume < 1)
                    return interaction.reply({content: "You must specify a number between 1 and 100."});

                    client.distube.setVolume(VoiceChannel, Volume);
                    return interaction.reply({content: `πΆ Volume has been set to \`${Volume}%\``});
                }
                case "settings" : {
                    const queue = await client.distube.getQueue(VoiceChannel);

                    if(!queue)
                    return interaction.reply({content: "β There is no queue."});

                    switch(options.getString("options")) {
                        case "skip" :
                        await queue.skip(VoiceChannel);
                        return interaction.reply({content: "β­οΈ Song has been skipped."});

                        case "stop" :
                        await queue.stop(VoiceChannel);
                        return interaction.reply({content: "βΉοΈ Music has been stopped."});

                        case "pause" :
                        await queue.pause(VoiceChannel);
                        return interaction.reply({content: "βΈοΈ Song has been paused."});

                        case "resume" :
                        await queue.resume(VoiceChannel);
                        return interaction.reply({content: "β―οΈ Song has been resumed."});

                        case "shuffle" :
                        await queue.shuffle(VoiceChannel);
                        return interaction.reply({content: "π The queue has been shuffled."});

                        case "AutoPlay" :
                        let mode = await queue.toggleAutoplay(VoiceChannel);
                        return interaction.reply({content: `π Autoplay mode is set to ${mode ? "On" : "Off"}`});

                        case "RelatedSong" :
                        await queue.addRelatedSong(VoiceChannel);
                        return interaction.reply({content: "π A related song has been add to the queue."})

                        case "RepeatMode" :
                        let mode2 = await client.distube.setRepeatMode(queue);
                        return interaction.reply({content: `π Repeat mode is set to ${mode2 = mode2 ? mode2 == 2 ? "**Queue**" : "**Song**" : "**Off**"}`});

                        case "queue" :
                        return interaction.reply({embeds: [new MessageEmbed()
                        .setColor("PURPLE")
                        .setDescription(`${queue.songs.map(
                            (song, id) => `\n**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``)}`
                        )]});
                    }
                    return;
                }
            }
        } catch (e) {
            const errorEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`β Alert: ${e}`)
            return interaction.reply({embeds: [errorEmbed]});
        }
    }
}