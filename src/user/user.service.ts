// import { Request, Response, NextFunction } from 'express'
import { IUser } from '@/interface/users.interface'
import { Token, User } from '@/schemas/schemas'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

export class UserService {
  async login(username: string, password: string) {
    const user = await User.findOne({ username })
    if (!user) {
      throw new Error('user with the such username not exist')
    }
    if (await bcrypt.compare(password, <string>user.password)) {
      const accessToken = jwt.sign(
        { userId: user.id },
        <string>process.env.SECRET
      )

      return accessToken
    } else {
      throw new Error('Password not valid')
    }
  }
  async logout(refreshToken: string) {
    await User.deleteOne({ refreshToken })
  }
  refreshAccessToken(refreshToken: string, userId: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        <string>process.env.SECRET,
        async (err: any, user: any) => {
          if (err) {
            return reject(new Error('Invalid json token'))
          }
          if ((await Token.findOne({ refreshToken })) === null) {
            return reject(new Error('Not found refresh token in DB'))
          }
          const newAccessToken = jwt.sign(
            { userId },
            <string>process.env.SECRET,
            { expiresIn: '30d' }
          )
          resolve(newAccessToken)
        }
      )
    })
  }
  async activate(activationLink: string) {
    const user = await User.findOne({ activationLink })
    if (!user) {
      throw new Error('Activation link not working')
    }
    user.isEmailVerify = true
    await user.save()
  }
  async registration(username: string, email: string, password: string) {
    const candidate = await User.findOne({ email: email })
    if (candidate) {
      throw new Error('User with this email exist')
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuidv4()
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
      activationLink: activationLink,
    })
    await this.sendActivationMail(
      email,
      `http://127.0.0.1:3200/api/user/activate/${activationLink}`
    )
    const tokens = this.generateTokens({
      userId: newUser.id,
    })
    await this.saveToken(newUser.id, tokens.refreshToken)
    return {
      ...tokens,
    }
  }
  private async sendActivationMail(to: string, activationLink: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Activation http://127.0.0.1:3200/',
      text: '',
      html: `
<div>
  <h1>For activation follow by link</h1>
  <a href='${activationLink}'>${activationLink}</a>
</div>
`,
    })
  }
  private generateTokens(payload: {}) {
    const SECRET = process.env.SECRET
    if (!SECRET) {
      throw new Error('No secret key')
    }
    const accessToken = jwt.sign(payload, SECRET, {
      expiresIn: '30m',
    })
    const refreshToken = jwt.sign(payload, SECRET, {
      expiresIn: '30d',
    })
    return {
      accessToken,
      refreshToken,
    }
  }
  private async saveToken(userId: number, refreshToken: string) {
    const tokenData = await Token.findOne({ user: userId })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    const token = await Token.create({ user: userId, refreshToken })
    return token
  }
}
