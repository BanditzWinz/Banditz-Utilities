const { MessageEmbed, Message, CommandInteraction, Client } = require("discord.js");
const DB = require("../../Structures/Schemas/suggestSetupDB");
module.exports = {
  name: "suggest-setup",
  description: "Set up the channel to where suggestions are sent.",
  usage: "/suggest-setup",
  permission: "ADMINISTRATOR",
  options: [
    {
        name: "set",
        description: "Set the channel where suggestions will be sent.",
        type: "SUB_COMMAND",
        options: [
            {name: "channel", description: "The channel where suggestions will be sent.", type: "CHANNEL", channelTypes: ["GUILD_TEXT"], required: true}
        ]
    },
    {
        name: "current-channel",
        description: "Display the current suggestions channel.",
        type: "SUB_COMMAND",
      },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {

    switch(interaction.options.getSubcommand()) {
        case "set":
            const channel = interaction.options.getChannel("channel");

            try {
                await channel.send({embeds: [new MessageEmbed().setColor("AQUA").setDescription(`✅ This channel has been set as a suggestions channel.`)]}).then(async() => {
                    await DB.findOneAndUpdate({GuildID: interaction.guild.id}, {ChannelID: channel.id}, {new: true, upsert: true})
                    interaction.reply({embeds: [new MessageEmbed().setColor("AQUA").setDescription(`✅ ${channel} has successfully been set as the suggestions channel for ${interaction.guild.name}.`)], ephemeral: true})
                })
            } catch (error) {
                if(error.message === "Missing Access") {
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`❌ The bot does not have access to this channel.`)]})
                } else {
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(` An error occured. \n\n \`\`\`${error}\`\`\``)]})
                }    
            }
        break;
        case "current-channel":
            const suggestion = await DB.findOne({GuildID: interaction.guild.id})

            if(!suggestion)
                return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`❌  This server has not setup the suggestion system.`)]})

            return interaction.reply({embeds: [new MessageEmbed().setColor("AQUA").setDescription(`The suggestions channel is currently set to <#${suggestion.ChannelID}>`)]})
        break;
    }


  },
};