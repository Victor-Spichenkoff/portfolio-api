function exists(value:any, msg:string) {
    if(!value) throw msg
}

function equals(value1:unknown, value2:unknown, msg:string) {
    if(value1 === value2) ''
    else throw msg
}

module.exports = {exists, equals}