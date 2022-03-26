const { MessageEmbed, WebhookClient, Message } = require("discord.js");

module.exports = {
    name: "messageUpdate",
    /**
     * @param {Message} oldMessage
     * @param {Message} newMessage
     */
    execute(oldMessage, newMessage) {
        if(oldMessage.author.bot) return;

        if(oldMessage.content === newMessage.content) return;

        const Count = 1950;

        const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? " ..." : "");
        const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > 1950 ? " ..." : "");

        const Log = new MessageEmbed()
        .setColor("#36393f")
        .setDescription(`📘 A [message](${newMessage.url}) by ${newMessage.author} was **edited** in ${newMessage.channel}.\n
        **Original**:\n ${Original} \n**Edited**:\n ${Edited}`.slice("0", "4096"))
        .setFooter({text: `Member: ${newMessage.author.tag} | ID: ${newMessage.author.id}`});


        new WebhookClient({url: "https://discord.com/api/webhooks/945155056288825374/j9P0h12pct5yl9myfszwXhehxjGQv_uAlP6UWoPpVhTWPJ-QrKLXgst2gZASAjjUXzF-"}
            ).send({embeds: [Log]}).catch((err) => console.log(err))
    }
}