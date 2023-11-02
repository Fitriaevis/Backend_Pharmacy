const express = require('express');
const router = express.Router();

//import express-validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/db');

//1: Menampilkan Semua Data Supplier
router.get('/', (req, res) => {
    connection.query('SELECT * FROM supplier', (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Supplier',
                data: rows,
            });
        }
    });
});

//2: Menambahkan Data Supplier Baru
router.post('/create', [
    // Validation
    body('nama_pabrik').notEmpty(),
    body('nama_pegawai').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    let data = {
        nama_pabrik: req.body.nama_pabrik,
        nama_pegawai: req.body.nama_pegawai
    };
    connection.query('INSERT INTO supplier SET ?', data, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Data Supplier Berhasil Ditambahkan',
                data: rows[0],
            });
        }
    });
});

//3: Menampilkan Data Supplier Berdasarkan ID
router.get('/:id', (req, res) => {
    let id = req.params.id;
    connection.query('SELECT * FROM supplier WHERE id_supplier = ?', [id], (err, rows) => {
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
                message: 'Data Supplier',
                data: rows[0],
            });
        }
    });
});

//4: Memperbarui Data Supplier Berdasarkan ID
router.patch('/update/:id', [
    body('nama_pabrik').notEmpty(),
    body('nama_pegawai').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }
    let id = req.params.id;
    let data = {
        nama_pabrik: req.body.nama_pabrik,
        nama_pegawai: req.body.nama_pegawai
    };
    connection.query('UPDATE supplier SET ? WHERE id_supplier = ?', [data, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'supplier Tidak Ditemukan',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Supplier Berhasil Diperbarui',
            });
        }
    });
});

//5: Menghapus Data Supplier Berdasarkan ID
router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM supplier WHERE id_supplier = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Supplier Not Found',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Supplier Berhasil Dihapus',
            });
        }
    });
});

module.exports = router;