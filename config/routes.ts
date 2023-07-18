module.exports = (app:any) => {
    app.post('/login', app.api.auth.login)
    app.post('/user', app.api.user.createUser)
    app.post('/validateToken', app.api.auth.validateToken)
    app.post('/guest', app.api.auth.loginGuest)


    //só com autorização
    app.use(app.config.passport.authenticate())



    app.route('/user')
        // .post(app.api.user.createUser)
        .get(app.api.user.getAll)

    app.route('/user/:id')
        .get(app.api.user.getById)
        .delete(app.api.user.remove)

    app.route('/project')
        .post(app.api.project.createProject)
        
    app.route('/project/:id')
        .get(app.api.project.getProjects)

    app.get('/project/fy/:id', app.api.project.getFy)
    
    app.use((req:any, res:any)=> {
        res.status(404).send('Serviço não encontrado')
    })
}