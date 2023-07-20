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
            exists(user.name, 'Inform the Name')
            exists(user.password, 'Inform the Password')
            exists(user.contact, 'Inform the Contact')
            if(newUser) equals(user.password, user.confirmPassword, 'Invalid password confirmation')
        } catch(e) {
            return res.send({status: 400, mensage: e})
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword


        if(newUser) {
            try{
                const affected = await prisma.user.create({
                    data: {...user}
                })
                console.log(user)
                if(affected<1) return res.status(400).send('Name or Contact already used')
                else res.status(204)
            } catch(e) {
                // return res.status(500).send('Name or Contact already used')
                return res.send({status: 400, mensage: 'Name or Contact already used'})
            }
        } else if(!newUser) {
            return res.status(204).send('success')
        }

        return res.status(204).send('success')
    }


    //só para testes
    const getAll =async (req:any, res:any) => {
        const userDB = await prisma.user.findMany({})
        res.status(200).send(userDB)
    }


    const getById =async (req:any, res:any) => {
        const user = {...req.params}
        console.log(user)
        let userDB
        if(user.public) {//só para mostrar no projeto
            userDB = await prisma.user.findFirst({
                where: {id: user.id},
            })
        } else {//todas as infos
            userDB = await prisma.user.findFirst({
                where: {id: user.id}
            })
        }

        //resposta
        if(userDB) {
            res.status(202).send(userDB)
        } else {
            res.status(500).send('Usário não encontrado')
        }
    }
    

    const remove = async (req:any, res:any) => {
        const userId = req.params.id
        try{
            const affected = await prisma.user.delete({
                where: {id: userId}
            })

            if(affected) {
                res.send('sucesso')
            } else {
                res.status(500).send('Não foi possível excluir')
            }
        } catch(e) {
            res.status(500)
        }
    }



    const r = (req:any, res:any) => {

    }




    return { createUser, getById, getAll, remove } 

    module.exports = {}
}

//PARA TESTES
// {
//     "id": "8e232930-4da0-4197-a376-058ed697fa6c",
//     "name": "Victor",
//     "contact": "987654321",
//     "bio": null,
//     "iat": 1689792684,
//     "exp": 1692384684,
//     "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjhlMjMyOTMwLTRkYTAtNDE5Ny1hMzc2LTA1OGVkNjk3ZmE2YyIsIm5hbWUiOiJWaWN0b3IiLCJjb250YWN0IjoiOTg3NjU0MzIxIiwiYmlvIjpudWxsLCJpYXQiOjE2ODk3OTI2ODQsImV4cCI6MTY5MjM4NDY4NH0.g9zitJRCa2Fowlgz6dogX3keHEqVS9XO4ueK-97ZG9E",
//     "status": 200
// }