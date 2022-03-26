const { 
    CommandInteraction, 
    MessageEmbed
} = require("discord.js")

module.exports = {
    name: "role",
    description: "Manage a user's roles.",
    permission: "MANAGE_ROLES",
    options: [
        {
            name: "type",
            description: "Whether to remove or add a role.",
            required: true,
            type: "STRING",
            choices: [
                {
                    name: "add",
                    value: "add"
                },
                {
                    name: "remove",
                    value: "remove"
                },
            ]
        },
        {
            name: "role",
            description: "Provide a role to add or remove.",
            type: "ROLE",
            required: true
        },
        {
            name: "target",
            description: "Provide a user to manage.",
            type: "USER",
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options } = interaction;
        const type = options.getString("type");
        const role = options.getRole("role");
        const target = options.getMember("target")
        
        const error = new MessageEmbed()
            .setColor("RED")
            .setTitle("🙂 Role Management 🙂")
            .setDescription("❗ There was an error.")

        const success = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("🙂 Role Management 🙂")
            .setDescription("✅ Successful")

        switch(type) {
            case "add" : {
                if(target.roles.cache.has(role.id)) {
                    error.addField("Error:", `${target} already has the ${role} role!`);
                    error.addField("Reason:", "You cannot add the role to a user when they already have it.")
                    interaction.reply({embeds: [error]});
                } else {
                    target.roles.add(role);
                    success.addField("Result:", `Added the ${role} role to ${target}.`)
                    interaction.reply({embeds: [success]})
                }
            }
            break;
            case "remove" : {
                if(!target.roles.cache.has(role.id)) {
                    error.addField("Error:", `${target} does not have the ${role} role!`);
                    error.addField("Reason:", "You cannot remove a role from a user when they do not have it.")
                    interaction.reply({embeds: [error]})
                } else {
                    target.roles.remove(role);
                    success.addField("Result:", `Removed the ${role} role from ${target}.`)
                    interaction.reply({embeds: [success]})
                }
            }
            break;
        }
    }
}