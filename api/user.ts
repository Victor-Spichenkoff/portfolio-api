const bcrypt = require('bcrypt-nodejs')
const prisma = require('../config/prisma')
// const { PrismaClient } = require('@prisma/client')
// const prisma = new PrismaClient()

const encryptPassword = (password:string) => {
    const salt =  bcrypt.genSaltSync(10)

    return bcrypt.hashSync(password, salt)
}

module.exports = (app:any) => {
    const {exists, equals} = require('./validation')
    const createUser = async (req:any, res:any) => {

        const user = {...req.body}
        const newUser = !user.id

        console.log(user)

        try{
            exists(user.name, 'Nome não informado')
            exists(user.password, 'Senha não informada')
            exists(user.contact, 'Contact não informado')
            if(newUser) equals(user.password, user.confirmPassword, 'Confirmação de senha inválida')
        } catch(e) {
            return res.status(401).send(e)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        // console.log(user)

        if(newUser) {
    
            const affected = await prisma.user.create({
                data: {...user}
            })

            if(affected<1) res.status(500).send('Não foi possível salvar')
            else res.status(200).send('sucesso')
            return
        } else if(!newUser) {
            
        }
         
    }




    const getById =async (req:any, res:any) => {
        const user = {...req.params} || {...req.body}

        const userDB = await prisma.user.findFirst({
            where: {id: user.id}
        })

        res.send(userDB)
    }
    

    const r = (req:any, res:any) => {

    }


    return { createUser, getById } 

    module.exports = {}
}

