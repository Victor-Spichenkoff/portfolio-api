const bodyParser = require('body-parser')
const cors = require('cors')

const corsOptions ={
    origin:'*', 
    // credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}
 

module.exports = (app:any) => {
    app.use(bodyParser.json())
    app.use(cors())
}