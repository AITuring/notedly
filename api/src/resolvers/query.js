
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
        return await models.Note.find();
    },
    note: async(parent, args, { models })=> {
        return await models.Note.findById(args.id)
    }
}