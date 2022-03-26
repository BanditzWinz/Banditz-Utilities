const { MessageEmbed, GuildMember } = require("discord.js");

const WelcomeSetupData = require("../../Structures/Schemas/WelcomeSetupDB");

module.exports = {
  name: "guildMemberAdd",
  /**
   *
   * @param {GuildMember} member
   */
  async execute(member) {
    const { user, guild } = member;

    const Data = await WelcomeSetupData.findOne({ GuildID: guild.id });
    if (!Data) return;

    member.roles.add(`${Data.Role}`).catch((err) => {
      console.log(err);
    });

    const WelcomeEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor({
        name: `${user.tag}`,
        iconURL: user.displayAvatarURL({
          dynamic: true,
        }),
      })
      .setThumbnail(
        user.displayAvatarURL({
          dynamic: true,
          size: 512,
        })
      )
      .setDescription(
        `
        **Welcome** ${member} to **\`${guild.name}**!\``
      )
      .addFields(
        {
          name: "General",
          value: `<#${Data.GeneralChannel}>`,
          inline: true,
        },
        {
          name: "Rules",
          value: `<#${Data.RulesChannel}>`,
          inline: true,
        }
      )
      .setFooter(
          {
              text: `${member.user.username} | ${member.user.id} | ${member.guild.memberCount}`});


    await guild.channels.cache
      .get(Data.WelcomeChannel)
      .send({ embeds: [WelcomeEmbed] });
  },
};