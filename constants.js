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
const sbAlias = ["sb", "skyblock", 'Skyblock', 'SB', 'SkyBlock', "<#772942075301068820>"]
const dAlias = ["d", "dungeons", "dung", "Dungeons", "D", "dungeon", "Dungeon", "Dung", "<#772944394542121031>"]
const uAlias = ["u", "update", "UPDATE", "Update", "U"]
const cmdAlias = ['addcategory', 'addsection', 'approve', 'delete', 'edit', 'post', 'start']

module.exports = {
    suggestionSchema: suggestionSchema,
    categorySchema: categorySchema,
    sbAlias: sbAlias,
    dAlias: dAlias,
    uAlias: uAlias,
    cmdAlias: cmdAlias
}