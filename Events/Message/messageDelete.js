const { MessageEmbed, WebhookClient, Message } = require("discord.js");

module.exports = {
    name: "messageDelete",
    /**
     * @param {Message} message
     */
    execute(message) {
        if(message.author.bot) return;

        const Log = new MessageEmbed()
        .setColor("#36393f")
        .setDescription(`📕 A [message](${message.url}) by ${message.author.tag} was **deleted**.\n
        **Deleted Message:**\n ${message.content ? message.content : "None"}`.slice(0, 4096))

        if(message.attachments.size >= 1){
            Log.addField(`Attachments:`, `${message.attachments.map(a => a.urk)}`, true)
        }

        new WebhookClient({url: "https://discord.com/api/webhooks/945155056288825374/j9P0h12pct5yl9myfszwXhehxjGQv_uAlP6UWoPpVhTWPJ-QrKLXgst2gZASAjjUXzF-"}
            ).send({embeds: [Log]}).catch((err) => console.log(err))
    }
}