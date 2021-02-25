
module.exports = {
    // 查找指定用户名对应用户
    user: async (parent, { username }, { models })=>{
        return await models.User.findOne({ username })
    },
    // 查找所有用户
    users: async (parent, args, { models })=> {
        return await models.User.find({})
    },
    // 查找上下文中的当前用户
    me: async (parent,args, { models, user })=>{
        return await models.User.findById(user.id)
    },
    notes: async(parent, args, { models })=> {
        // 调用MongoDB的find方法
        return await models.Note.find().limit(100);
    },
    note: async(parent, args, { models })=> {
        return await models.Note.findById(args.id)
    },
    noteFeed: async(parent, { cursor }, { models })=> {
        // 硬编码限量为10
        const limit = 10
        // hasNextPage默认值设为false
        let hasNextPage = false
        // 如未传入游标，默认查询为空。就从数据库中获取最新的笔记
        let cursorQuery =  {}

        // 如果传入游标，查询对象ID小于游标的笔记
        if (cursor) {
            cursorQuery = { _id: {$lt: cursor}}
        }
        // 在数据库中查找limit+1篇笔记，从新到旧排序
        let notes = await models.Note.find(cursorQuery).sort({ _id: -1 }).limit(limit + 1)

        // 如果找到的笔记的数量大于限制数量，把hasNextPage设为true，截取结果，返回限定数量
        if (notes.length > limit) {
            hasNextPage = true
            notes = notes.slice(0, -1)
        }

        // 新游标是笔记动态流数组中最后一个元素的Mongo对象ID
        const newCursor = notes[notes.length - 1]._id

        return {
            notes,
            cursor: newCursor,
            hasNextPage
        }
    }
}