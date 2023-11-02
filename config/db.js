let mysql = require('mysql');

// varaiable connection
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pharmacy'
});

// kondisi untuk melihat apakah koneksi apakah sudah berjalan
connection.connect(function (error){
    if(!!error){
        console.log(error)
    }else{
        console.log('koneksi dengan database berhasil!');
    }
})

//export modul connection
module.exports = connection;