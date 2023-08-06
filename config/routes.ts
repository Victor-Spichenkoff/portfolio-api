module.exports = (app:any) => {
    app.post('/login', app.api.auth.login)
    app.post('/user', app.api.user.createUser)
    app.post('/validateToken', app.api.auth.validateToken)
    app.post('/guest', app.api.auth.loginGuest)
    app.post('/resetPassword', app.api.user.resetPassword)

    app.get('/teste', (req:any, res:any) => res.send('Funcionando'))


    //só com autorização
    app.use(app.config.passport.authenticate())



    app.route('/user')
        // .post(app.api.user.createUser)
        .get(app.api.user.getAll)

    app.post('/user/update', app.api.user.updateUser)

    app.route('/user/:id')
        .get(app.api.user.getById)
        .delete(app.api.user.remove)

    app.get('/profile/:id', app.api.user.getProfile)

    app.route('/project')
        .post(app.api.project.createProject)
        
    app.route('/project/:id')
        .get(app.api.project.getProjects)
        .delete(app.api.project.remove)
        .post(app.api.project.update)

    app.get('/project/fy/:id', app.api.project.getFy)
    
    app.get('/project/view/:id', app.api.project.getFullProject)
    
    app.post('/like', app.api.project.increaseLikes)

    app.use((req:any, res:any)=> {
        res.status(404).send('Serviço não encontrado')
    })
}