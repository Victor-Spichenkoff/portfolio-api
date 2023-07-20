const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

const authSecret = require('../config/keys').SECRET
console.log(authSecret)

const prisma = require('../config/prisma')

module.exports = (app:any) => {

    const login = async (req:any, res:any) => { //try{
        if(!req.body.name || !req.body.password) {
            return res.send({status: 400, mensage: 'Inform your name and password'})
        } 

        const user = await prisma.user.findFirst({
            where: {name: req.body.name}
        })
        

        if(!user) return res.send({status: 400, mensage: 'Could not find user'})
            

        const rightPassword = bcrypt.compareSync(req.body.password.toString(), user.password)

        if(!rightPassword) return res.send({status: 400, mensage: 'Invalid Password'})

        //gerar o payload e token
        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: user.id,
            name: user.name,
            contact: user.contact,
            bio: user.bio,
            iat: now,
            // exp: now + (60*60*10)//10 horas(produção)
            exp: now + (60 * 60 * 24 * 30)//(30 dias para teste)
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret),
            status: 200
        })
    // }catch(e) {
    //     res.send({status:500, mensage: 'Server error', error: e})
    // }
    }


    const validateToken = async (req:any, res:any) => {
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)//ainda valido
                } else {
                    res.send(false)
                }
            } else {
                res.send(false)
            }
        } catch(e) {
            return res.send(false)
        }
    }


    const loginGuest = (req:any, res:any) => {
        const now = Math.floor(Date.now() / 1000)

        const payload = {
            guest: true,
            iat: now,
            exp: now + (60 * 60 * 24 * 30)//3 dias(30 dias para teste)
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret),
            status: 200
        })
    }

    return { login, validateToken, loginGuest }
}
export {}