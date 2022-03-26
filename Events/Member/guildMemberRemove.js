const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     * 
     * @param {GuildMember} member 
     */
    execute(member) {
        const { user, guild } = member;

        const Welcomer = new WebhookClient({
            id: "944746528394846259",
            token: "Ep5pDFTx0MtnYNhLF4qKCXDkrFKrEfYRBTLpG_WUPy_DVNTEeVISRIyvj1p6tM5AyE4U"
        });

        const Loger = new MessageEmbed()
        .setColor("RED")
        .setAuthor({ name: `${user.username}'s Avatar`, iconURL: `${user.displayAvatarURL({ dynamic: true, size: 512 })}` })
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`
        ${member} has left the community\n
        Joined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>\nLatest Member Count: **${guild.memberCount}**`)
        .setFooter({text: `${user.id}`})

        Welcomer.send({embeds: [Loger]})
    }
}