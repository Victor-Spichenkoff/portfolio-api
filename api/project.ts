const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = (app:any) => {
    const {exists, equals} = require('./validation')

    async function createProject(req:any, res:any) {
       const project = {...req.body} 
       try{
            exists(project.name , 'Inform your project name')
            exists(project.link , 'Inform a link to acess the project')
            exists(project.description , 'Inform a description')
       } catch(e) {
            return res.send({status:400, mensage: e})
       }

        const affected = await prisma.project.create({
            data: {...project}
        })

        if(affected) {
            return res.send({status:201})
        } else {
            return res.send({status:500, mensage: 'Error in the server'})
        }
    }

    async function getProjects(req:any, res:any) {
        const userId = req.params.id || req.body.id
        try{
            const projects = await prisma.user.findFirst({
                where: {id: userId},
                include: {projets: true}
                // include: {projects: true}//colocar o 'c' de volta 
            })

            res.send({ projects, status:200 })
        } catch(e) {
            console.log('Erro getProjects: ' + e)
            res.send({status:500, mensage: "Can't load projects"})
        }

        
    }

    return { createProject, getProjects }
}
export {}