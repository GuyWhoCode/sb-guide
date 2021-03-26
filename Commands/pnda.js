const aliases = ["panda", "henry"]
module.exports = {
    name: "pnda",
    alises: aliases,
    execute(message, args) {
        message.channel.send({embed: commandHelpEmbed("Pnda", aliases, Date.now(), "g!pnda", "Returns a ping for stoopid pnda")}) 
        // message.channel.send("<@317751950441447435> stoopid pnda")
    }
}