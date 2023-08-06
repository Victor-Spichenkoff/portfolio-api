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
                select: {projets:true}
                // include: {projects: true}//colocar o 'c' de volta 
            })

            res.send({ projects, status:200 })
        } catch(e) {
            console.log('Erro getProjects: ' + e)
            res.send({status:500, mensage: "Can't load projects"})
        }
    }


    let vez = 0
    async function getFy(req:any, res:any) {
        const currentUserId = req.params.id

        let page = req.query.page?? 0
        let limit = 4
        try{
            const projects = await prisma.project.findMany({
                take: limit,
                skip: page * limit,
                where: {user_id: {not: currentUserId}},
                orderBy: {likes: 'desc'},
                select: { id: true, name:true, likes:true, imageUrl:true, user: {select: {id: true, name:true, contact:true}}}
                // include: { user: {name:true, contact:true} }
            })
    

            if(projects.length==0) {
                // //TESTE DE PAGINACAO
                // return res.send([
                //     { id: 'nulll',name:`nhe${vez++}page${page}`, imageUrl:'', likes: '0', link:'', user:{name:'nhe pessoa'}},
                //     { id: 'nulll',name:`nhe${vez++}page${page}`, imageUrl:'', likes: '0', link:'', user:{name:'nhe pessoa'}},
                //     { id: 'nulll',name:`nhe${vez++}page${page}`, imageUrl:'', likes: '0', link:'', user:{name:'nhe pessoa'}},
                //     { id: 'nulll',name:`nhe${vez++}page${page}`, imageUrl:'', likes: '0', link:'', user:{name:'nhe pessoa'}}
                // ])

                //NORMAL:
                return res.send([])
            }
            
            return res.send(projects)
        } catch(e) {
            res.status(500)
        }
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


    async function getFullProject(req:any, res:any) {
        const id = req.params.id

        const project = await prisma.project.findFirst({
            where: {id},
            include: { user: {select: {id: true, name:true, contact:true} } }
        })        

        if(project) {
            res.send(project)
        } else {
            res.status(500)
        }
    }


    async function update(req:any, res:any) {
        const projectId = req.params.id ?? req.body.id
        console.log(req.params.id, req.body)


        try {
            const affected = await prisma.project.update({
                where: {id:projectId},
                data: {...req.body}
            })

            
            return res.send({status:204})
        } catch(e) {
            console.log('Erro Update Projects: '+ e)
            return res.send({status:500, mensage: "Server Error"})
        }
    } 


    async function increaseLikes (req:any, res:any) {
        const id = req.body.id
        const currentLikes = req.body.currentLikes
        await prisma.project.update({
            where: {id},
            data: {
                likes: {
                    increment: 1
                }
            }
        })

        res.send({likes: currentLikes+1})
    }



    return { createProject, getProjects, getFy, remove, update, getFullProject, increaseLikes }
}
export {}

//FY
[
    {
        "id": "f16ca335-4410-4bf9-b3c2-22eeb3fbe3f8",
        "name": "Teste Yudi",
        "description": "<p>Testando em outro user&nbsp;</p><p><strong>Editado:&nbsp;</strong>Emma toma&nbsp;<br></p>",
        "link": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk0WGZM-RPg1n0ey4p_HRRIp0mR91MfitbXOHKN49f4khCXpvl4O4VZRe6mNtBxVGcVNo&usqp=CAU",
        "imageUrl": "https://encrypted-tbn0.gstatic.com/images?         q=tbn:ANd9GcQk0WGZM-RPg1n0ey4p_HRRIp0mR91MfitbXOHKN49f4khCXpvl4O4VZRe6mNtBxVGcVNo&usqp=CAU",
        "likes": 0,
        "user_id": "5b1f1fbf-9ac2-4906-aed7-b50bdfd79e84",
        "user": {
            "name": "Yudi",
            "contact": "987654322"
        }
    }
]