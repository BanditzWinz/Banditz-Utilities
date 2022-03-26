const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const suggestSetupDB = require("../../Structures/Schemas/suggestSetupDB");
const suggestDB = require("../../Structures/Schemas/suggestDB");

module.exports = {
  name: "suggest",
  description: "Create a suggestion.",
  usage: "/suggest",
  disabled: false,
  botCommandChannelOnly: true,
  options: [
    {
      name: "type",
      description: "Select a type.",
      required: true,
      type: "STRING",
      choices: [
        {
          name: "Command",
          value: "Command",
        },
        {
          name: "Event",
          value: "Event",
        },
        {
          name: "System",
          value: "System",
        },
        {
          name: "Other",
          value: "Other",
        },
      ],
    },
    {
      name: "suggestion",
      description: "Describe your suggestion.",
      type: "STRING",
      required: true,
    },
    {
      name: "dm",
      description: "Set whether the bot will DM you, once your suggestion has been declined or accepted.",
      type: "BOOLEAN",
      required: true,
    }
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options, guildId, member, user } = interaction;

    const suggestionsSetup = await suggestSetupDB.findOne({ GuildID: guildId });
    var suggestionsChannel;

    if(!suggestionsSetup) {
      return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`❌ This server has not setup the suggestion system.`)]})
    } else {
      suggestionsChannel = interaction.guild.channels.cache.get(suggestionsSetup.ChannelID)
    }

    const type = options.getString("type");
    const suggestion = options.getString("suggestion");
    const DM = options.getBoolean("dm")
    
    const Embed = new MessageEmbed()
      .setColor("AQUA")
      .setAuthor({name: `${user.tag}`, iconURL: `${user.displayAvatarURL({dynamic: true})}`}, )
      .setDescription(`**Suggestion:**\n${suggestion}`)
      .addFields(
        {name: "Type", value: type, inline: true},
        {name: "Status", value: "🕐 Pending", inline: true},
        {name: "Reason", value: "Pending", inline: true},
      )

    try {
      const M = await suggestionsChannel.send({embeds: [Embed]});
      
      M.react("944060472783687720");
      M.react("944060501804081182");

      await suggestDB.create({GuildID: guildId, MessageID: M.id, Details: [
        {
          MemberID: member.id,
          Type: type,
          Suggestion: suggestion,
        }],
        MemberID: member.id,
        DM: DM
      })
      interaction.reply({embeds: [new MessageEmbed().setColor("DARK_BLUE").setDescription(`✅ Your [suggestion](${M.url}) was successfully created and sent to ${suggestionsChannel}`)], ephemeral: true})
    } catch (err) {
        console.log(err);
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`❌ An error occured.`)]}) 
        
    }
  }
}