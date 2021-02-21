const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express')
require('dotenv').config

const gravatar = require('../util/gravatar')

module.exports = {
    // 创建新笔记
    newNote: async (parent, args, { models })=> {
        return await models.Note.create({
            content: args.content,
            author: 'lsy'
        })
    },
    deleteNote: async (parent, { id }, { models })=> {
        try {
            await models.Note.findOneAndRemove({_id: id});
            return true;
        } catch (err) {
            return false;
        }
    },
    updateNote: async (parent, { id, content }, { models })=> {
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

    }
}