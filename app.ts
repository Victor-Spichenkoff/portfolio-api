const express = require('express')
const app= express()

// const prisma = require('./config/prisma')
// app.prisma = {...prisma}


const consign = require('consign')
consign()
    .then('./config/middlewares.ts')
    .then('./api/')
    .then('./config/')
    .then('./config/routes.ts')
    .into(app)


const port = process.env.PORT || 2006

app.listen(port, ()=>console.log('Rodando na porta: '+port))
module.exports = {}