const {sbAlias, dAlias} = require("../constants.js")
const globalFunctions = require("../globalfunctions.js")
const aliasList = ["lc", "list", "listc", "listcategory"]

module.exports = {
	name: 'listcategories',
	alises: aliasList,
	async execute(message, args) {
		var guide = args[0]
		if (args.length == 0 || guide == undefined) return message.channel.send({embed: globalFunctions.commandHelpEmbed("List Categories", aliasList, Date.now(), "g!lc sb", "Returns all the category names for Skyblock Guides")})
		//checks if there is any bad input
		
		if (globalFunctions.checkAliases(sbAlias, guide)) {
			guide = "Skyblock"
		} else if (globalFunctions.checkAliases(dAlias, guide)) {
			guide = "Dungeons"
		} else {
			return message.channel.send('You are missing an argument! See `g!listcategories <#Guide Channel>`')
		}
		//checks if provided Guide matches alias list
		
		message.channel.send({embed: globalFunctions.tableOfContents(guide, message.guild.id)})
	},
}