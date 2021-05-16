const suggestionSchema = {
    "section": "placeholder",
    "description": "placeholder",
    "messageID": "placeholder",
    "user": "placeholder"
} 
const categorySchema = {
    "embedMessage": {},
    "categoryTitle": "placeholder",
    "messageID": "placeholder",
    "category": "placeholder"
}
const sbAlias = ["<#772942075301068820>", "sb", "skyblock", 'Skyblock', 'SB', 'SkyBlock']
const dAlias = ["<#772944394542121031>","d", "dungeons", "dung", "Dungeons", "D", "dungeon", "Dungeon", "Dung"]
const restrictedCmds = ['addcategory', 'addsection', 'approve', 'delete', 'edit', 'start', 'pnda', 'ad']
const verifiedRoles = ['Verified','VIP', 'VIP+', 'MVP', 'MVP+', 'MVP++']
const cooldownCmds = ['sbsuggest', 'dsuggest', 'update', 'start']
const yesAlias = ["yes", "Yes", "YES", "y", 'Y']
const noAlias = ["no", "NO", "No", "n", "N"]
const cancelAlias = ["cancel", "Cancel", "CANCEL", "c", "C"]
const nonSkycommCmds = ["help", "config", "listcategories", "search"]
const skycommAffliates = ["591143899335229450", "450878205294018560", "594851373229670422", "606681165524369408"]
const skycommPartners = ["652148034448261150", "571031549550788618", "727426780381577291"]
const adEmbed = {
	color: 0x4ea8de,
	title: 'SkyBlock Guides',
	fields: [
		{
			name: 'Want to help improve the guide?',
			value: "Join the [Skyblock Community](https://discord.gg/8tYAVEU)",
        },
        {
            name: 'Using Bot:',
            value: "To see the list of all commands, do `g!help`"
        },
        ],
	footer: {
		text: 'Skyblock Guides',
		icon_url: "https://i.imgur.com/184jyne.png",
	},
}

module.exports = {
    suggestionSchema: suggestionSchema,
    categorySchema: categorySchema,
    sbAlias: sbAlias,
    dAlias: dAlias,
    yesAlias: yesAlias,
    noAlias: noAlias,
    cancelAlias: cancelAlias,
    restrictedCmds: restrictedCmds,
    verifiedRoles: verifiedRoles,
    cooldownCmds: cooldownCmds,
    nonSkycommCmds: nonSkycommCmds,
    adEmbed: adEmbed,
    skycommAffliates: skycommAffliates,
    skycommPartners: skycommPartners,
}