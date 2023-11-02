const express = require('express');
const router = express.Router();

const fs = require('fs')

const multer = require('multer')
const path = require('path')

//import express-validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/db');


const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})


const fileFilter = (req, file, cb) => {
    //mengecheck jenis file yang diizinkan (misalnya, hanya gambar JPEG atau PNG)
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true); //Izinkan file
    } else {
        cb(new Error('Jenis file tidak diizinkan'), false); //Tolak file
    }
};

const upload = multer({storage: storage, fileFilter: fileFilter })


router.get('/', function (req,res){
    connection.query('SELECT * FROM data_obat', function(err, rows){
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status: true,
                message: 'Data Obat',
                data: rows
            })
        }
    })
});


router.post('/create', upload.fields([{name: 'gambar', maxCount: 1}]), [
    //validation
    body('nama_obat').notEmpty(),
    body('harga').notEmpty(),
    body('expired_date').notEmpty(),
    body('stok_masuk').notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    let Data = {
        nama_obat: req.body.nama_obat,
        harga: req.body.harga,
        expired_date: req.body.expired_date,
        stok_masuk: req.body.stok_masuk,
        gambar: req.files.gambar[0].filename
    }
    connection.query('INSERT INTO data_obat SET ?', Data, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Data Obat Berhasil Ditambahkan',
                data: rows[0]
            });
        }
    });
});



router.get('/(:id)', function (req, res){
    let id = req.params.id;
    
    connection.query(`SELECT * FROM data_obat WHERE kode_obat = ${id}`, function(err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Not Found',
            })
        }
        else{
            return res.status(200).json({
                status: true,
                message: 'Data Obat',
                data: rows[0]
            })
        }
    })
})


router.patch('/update/:id', upload.fields([{ name: 'gambar', maxCount: 1 }, { name: 'swa_foto', maxCount: 1 }]), [
    //validation
    body('nama_obat').notEmpty(),
    body('harga').notEmpty(),
    body('expired_date').notEmpty(),
    body('stok_masuk').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    let id = req.params.id;
        //lakukan check apakah ada file yang diunggah
    let gambar = req.files['gambar'] ? req.files['gambar'][0].filename : null;

    connection.query(`SELECT * FROM  data_obat WHERE kode_obat = ${id}`, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        }if (rows.length ===0) {
            return res.status(404).json({
                status: false,
                message: 'Data Obat Not Found',
            });
        }
        const gambarLama = rows[0].gambar;

        //hapus file lama jika ada
        if (gambarLama && gambar) {
            const pathGambar = path.join(__dirname, '../public/images', gambarLama);
            fs.unlinkSync(pathGambar);
        }

        let Data = {
            nama_obat: req.body.nama_obat,
            harga: req.body.harga,
            expired_date: req.body.expired_date,
            stok_masuk: req.body.stok_masuk
        };

        if (gambar){
            Data.gambar = gambar;
        }

        connection.query(`UPDATE data_obat SET ? WHERE kode_obat = ${id}`, Data, function (err, rows) {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Server Error',
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Data Obat Berhasil Diperbarui',
                });
            }
        });
    });
});


router.delete('/delete/:id', function(req, res){
    let id = req.params.id;
    connection.query(`SELECT * FROM data_obat WHERE kode_obat = ${id}`, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        }if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Obat Not Found',
            });
        }
        const gambarLama = rows[0].gambar;
        // Hapus file lama jika ada
        if (gambarLama) {
            const pathFileLama = path.join(__dirname, '../public/images', gambarLama);
                fs.unlinkSync(pathFileLama);
        }

        connection.query(`DELETE FROM data_obat WHERE kode_obat = ${id}`,  function(err, rows) {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Server Error',
                })
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Delete Success..!',
                })
            }
        })
    })
})


module.exports = router;