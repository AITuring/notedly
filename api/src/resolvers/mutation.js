const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const {
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express')
require('dotenv').config

const gravatar = require('../util/gravatar')

module.exports = {
    // 创建新笔记
    newNote: async (parent, args, { models, user})=> {
        if (!user) {
            throw new AuthenticationError('You must sign in to create a new note')
        }
        return await models.Note.create({
            content: args.content,
            // 引用作者在Mongo数据库中的id
            author: mongoose.Types.ObjectId(user.id)
        })
    },
    deleteNote: async (parent, { id }, { models, user})=> {
        if (!user) {
            throw new AuthenticationError('You must sign in to delete a note')
        }
        // 查找笔记
        const note = await models.Note.findById(id)
        // 如果笔记属主和当前用户不匹配，抛出ForbiddenError
        if (note && String(note.author)!== user.id) {
            throw new ForbiddenError("You don't have permissions to delete the note")
        }
        // 通过所有检查后删除笔记
        try {
            await note.remove()
            return true
        } catch (err) {
            return false
        }
    },
    updateNote: async (parent, { id, content }, { models, user })=> {
        if (!user) {
            throw new AuthenticationError('You must sign in to update a note')
        }
        // 查找笔记
        const note = await models.Note.findById(id)
        // 如果笔记属主和当前用户不匹配，抛出ForbiddenError
        if (note && String(note.author)!== user.id) {
            throw new ForbiddenError("You don't have permissions to update the note")
        }
        // 通过所有检查后更新数据库笔记，返回更新后的笔记
        return await models.Note.findOneAndUpdate(
            {
                _id: id
            },
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
        )
    },
    signUp: async(parent, { username, email, password }, { models }) => {
        // 规范电子邮件地址
        email = email.trim().toLowerCase();
        // 计算密码哈希值
        const hashed = await bcrypt.hash(password,10);
        // 生成gravatar URL
        const avatar = gravatar(email);
        try {
            const user = await models.User.create({
                username,
                email,
                avatar,
                password:hashed
            })
            return jwt.sign({ id: user._id}, process.env.JWT_SECRET)
        } catch (error) {
            throw new Error('Error creating account')
        }
    },
    signIn: async (parent, { username, email, password }, { models }) => {
        // 规范电子邮件地址
        if (email) {
            email = email.trim().toLowerCase();
        }
        const user = await models.User.findOne({
            $or: [{ email }, { username }]
        });

        // 如未找到用户，抛出AuthenticationError
        if (!user) {
            throw new AuthenticationError('Error signing in')
        }
        // 如果密码不匹配，抛出AuthenticationError
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            throw new AuthenticationError('Error signing in')
        }
        // 创建并返回JWT
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    }
}