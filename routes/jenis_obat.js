const express = require('express');
const router = express.Router();

//import express-validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/db');

//1: Menampilkan Semua Data Jenis Obat
router.get('/', (req, res) => {
    connection.query('SELECT * FROM jenis_obat ASC', (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Jenis Obat',
                data: rows,
            });
        }
    });
});

//2: Menambahkan Data Jenis Obat Baru
router.post('/create', [
    // Validation
    body('nama_jenis_obat').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    let data = {
        nama_jenis_obat: req.body.nama_jenis_obat
    };
    connection.query('INSERT INTO jenis_obat SET ?', data, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Data Jenis Obat Berhasil Ditambahkan',
                data: rows[0],
            });
        }
    });
});

//3: Menampilkan Data Jenis Obat Berdasarkan ID
router.get('/:id', (req, res) => {
    let id = req.params.id;
    connection.query('SELECT * FROM jenis_obat WHERE kode_jenis_obat = ?', [id], (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        }
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Not Found',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Jenis Obat',
                data: rows[0],
            });
        }
    });
});

//4: Memperbarui Data Jenis Obat Berdasarkan ID
router.patch('/update/:id', [
    body('nama_jenis_obat').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }
    let id = req.params.id;
    let data = {
        nama_jenis_obat: req.body.nama_jenis_obat
    };
    connection.query('UPDATE jenis_obat SET ? WHERE kode_jenis_obat = ?', [data, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'Jenis Obat Tidak Dapat Ditemukan',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Jenis Obat Berhasil Diperbarui',
            });
        }
    });
});

//5: Menghapus Data Jenis Obat Berdasarkan ID
router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM jenis_obat WHERE kode_jenis_obat = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Jenis Obat Not Found',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Jenis Obat Berhasil Dihapus',
            });
        }
    });
});

module.exports = router;