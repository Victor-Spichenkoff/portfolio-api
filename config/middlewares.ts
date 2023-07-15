const bodyParser = require('body-parser')
const cors = require('cors')


module.exports = (app:any) => {
    app.use(bodyParser.json())
    app.use(cors())
}