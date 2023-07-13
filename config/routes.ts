module.exports = (app:any) => {
    app.route('/user')
        .post(app.api.user.createUser)
        .get(app.api.user.getAll)

    app.route('/user/:id')
        .get(app.api.user.getById)
        .delete(app.api.user.remove)

    app.use((req:any, res:any)=> {
        res.status(404).send('Serviço não encontrado')
    })
}