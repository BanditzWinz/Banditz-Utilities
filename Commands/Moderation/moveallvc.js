const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "moveall",
  description: "Move members from the current voice channel to another.",
  permission: "MOVE_MEMBERS",
  options: [
    {
      name: "move-from",
      description: "Select the channel you want to move the members from.",
      type: "CHANNEL",
      channelTypes: ["GUILD_VOICE"],
      required: true,
    },
    {
      name: "move-to",
      description: "Select the channel you want to move the members to.",
      type: "CHANNEL",
      channelTypes: ["GUILD_VOICE"],
      required: true,
    }
  ],
  async execute(interaction, client) {
    const { member, guild, options } = interaction;
    const newChannel = options.getChannel("move-to");
    const voiceChannel = options.getChannel("move-from");
    
    if(newChannel === voiceChannel) return interaction.reply({content: "You can't move members to the same channel they are already in!", ephemeral: true})
    if(voiceChannel.members.size < 1) return interaction.reply({content: "There are no members in that voice channel!", ephemeral: true})

    voiceChannel.members.forEach(m => {
      m.voice.setChannel(newChannel, `Voice Moved by ${member.user.tag}`)
    })
    interaction.reply({content: `Moved all users to ${newChannel}.`, ephemeral: true})
  }
}