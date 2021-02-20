
module.exports = {
    notes: async(parent, args, { models })=> {
        // 调用MongoDB的find方法
        return await models.Note.find();
    },
    note: async(parent, args, { models })=> {
        return await models.Note.findById(args.id)
    }
}