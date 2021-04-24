export default function conexao(host, port, user, pass, name) {
    const mysql = require('serverless-mysql')({
        config: {
            host     : process.env.ENDPOINT,
            database : process.env.DATABASE,
            user     : process.env.USERNAME,
            password : process.env.PASSWORD
        }
    })
}