module.exports = (app:any) => {
    app.route('/user')
        .get(app.api.user.createUser)

    app.route('/user/:id')
        .get(app.api.user.getById)

    app.use((req:any, res:any)=> {
        res.status(404).send('Serviço não encontrado')
    })
}