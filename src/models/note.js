const mongoose = require('mongoose');
// 定义笔记的数据库模式
const noteSchema = new mongoose.Schema(
    {
        content: {
            type: 'String',
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        favoriteCount: {
            type: Number,
            default: 0
        },
        favoritedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ]
    },
    {
        // 添加Date类型的createdAt和updatedAt字段
        timestamps: true
    }
);
// 通过模式定义Note模型
const Note = mongoose.model('Note', noteSchema);
// 导出模型
module.exports = Note;