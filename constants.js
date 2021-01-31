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
const uAlias = ["u", "update", "UPDATE", "Update", "U"]
const restrictedCmds = ['addcategory', 'addsection', 'approve', 'delete', 'edit', 'post', 'start', 'pnda', 'ad']
const verifiedRoles = ['Verified','VIP', 'VIP+', 'MVP', 'MVP+', 'MVP++']
const cooldownCmds = ['sbsuggest', 'dsuggest', 'update', 'start']
const yesAlias = ["yes", "Yes", "YES", "y", 'Y']
const noAlias = ["no", "NO", "No", "n", "N"]
const cancelAlias = ["cancel", "Cancel", "CANCEL", "c", "C"]

module.exports = {
    suggestionSchema: suggestionSchema,
    categorySchema: categorySchema,
    sbAlias: sbAlias,
    dAlias: dAlias,
    uAlias: uAlias,
    yesAlias: yesAlias,
    noAlias: noAlias,
    cancelAlias: cancelAlias,
    restrictedCmds: restrictedCmds,
    verifiedRoles: verifiedRoles,
    cooldownCmds: cooldownCmds
}