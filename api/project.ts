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
            exists(project.user_id , 'You must do the login')
       } catch(e) {
            return res.send({status:400, mensage: e})
       }

       try{
           const affected = await prisma.project.create({
               data: {...project}
           })
           
           if(affected) {
               return res.send({status:204})
           } else {
               return res.send({status:500, mensage: 'Server error'})
           }
       } catch(e) {
            return res.send({status:400, mensage: 'Link already used'})
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


    async function getFy(req:any, res:any) {
        const currentUserId = req.params.id

        let page = req.body.page
        let limit = 10

        const projects = await prisma.project.findMany({
            where: {user_id: currentUserId}
        })

        res.send(projects)
    }


    async function remove(req:any, res:any) {
        const projectId = req.params.id ?? req.body.id

        const affected = await prisma.project.delete({
            where: {id:projectId}
        })

        if(affected) {
            res.send({ status: 204 })
        } else {
            res.send({status: 500, mensage: "Can't delete"})
        }
    }


    async function update(req:any, res:any) {
        const projectId = req.params.id ?? req.body.id
        console.log(req.params.id, req.body)
        try {
            prisma.projects.update({
                where: {id:projectId},
                data: {...req.body}
            })

            return res.send({status:204})
        } catch(e) {
            console.log('Erro Update Projects: '+ e)
            return res.send({status:500, mensage: "Server Error"})
        }
    } 


    return { createProject, getProjects, getFy, remove, update }
}
export {}