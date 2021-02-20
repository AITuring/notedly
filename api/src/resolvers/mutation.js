module.exports = {
    // 创建新笔记
    newNote: async (parent, args, { models })=> {
        return await models.Note.create({
            content: args.content,
            author: 'lsy'
        })
    }
}