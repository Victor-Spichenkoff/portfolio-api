const authSecret = require('../config/keys').SECRET
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } =  passportJwt

const prisma = require('../config/prisma')

module.exports = (app:any) => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()//pega a senha
    }

    const strategy = new Strategy(params, async (payload:any, done:any) => {
        try{
            const user = await prisma.user.findFirst({
                where: {id: payload.id}
            }).then((user:any) => done(null, user ? { ...payload } : false))
        } catch(e) {
            done(e, false)
        }
    })

    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }

}

export {}