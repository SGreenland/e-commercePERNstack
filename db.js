const Pool = require('pg').Pool;


// const pool = new Pool({
//     user: "postgres",
//     password: "postgres",
//     host: "localhost",
//     port: 5432,
//     database: "e_commerce_db"
// });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    user: "typlaqdiwgybpu",
    password: "5bb82b6174f23151328fcd8602377bc06f9c7a6c041b726d8f6d53cee09237ed",
    host: "ec2-54-155-61-133.eu-west-1.compute.amazonaws.com",
    port: 5432,
    database: "d9fqjg6nvd8bj5"
});

module.exports = pool;