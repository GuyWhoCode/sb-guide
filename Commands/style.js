module.exports = {
    name: "style",
    execute(client, message, args) {
        const styleEmbed = {
            color: 0x4ea8de,
            title: 'Style Guidelines:',
            fields: [
                {
                    name: '1. Add Category ',
                    value: "`g!ac` to add a category first to creates a new Guide. Follow the argument helper. Shorthand: `g!ac <#Guide Channel> <Category Name>`",
                },
                {
                    name: '2. Add Section',
                    value: "`g!as` to add a section (an embed subtitle). Follow the argument helper. Shorthand: `g!as <Category-Name> <Section Name>`"
                },
                {
                    name: '3. Edit',
                    value: "`g!e` to edit a section of the guide. Follow the argument helper. Shorthand: `g!edit <Message ID> <#Channel>`"
                },
                {
                    name: 'Optional: Approve',
                    value: "`g!a` to approve a suggestion. Follow the argument helper. Shorthand: `g!a <Suggestion ID> <Category-Name> <Section-Name>`"
                },
                {
                    name: 'Additional Notes:',
                    value: "**Creating a hyperlink:** [Message](Link URL)"+ "\n" + "Ex. `[Ecosia](https://www.ecosia.org/)`" + "\n\u200b" + "**Embed Limits:**" + "\n" + "Field character limit (the text under a section) -- 1024. New lines count as `\n`" + "\n" + "Entire embed character limit is 6,000. Link a new Guide message as the last section."
                },
                ],
            footer: {
                text: 'Skyblock Guides',
                icon_url: "https://i.imgur.com/184jyne.png",
            },
        }
        message.channel.send({embed: styleEmbed})
    }
}