const express = require('express');
const router = express.Router();

//import express-validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/db');

//1: Menampilkan Semua Data Admin
router.get('/', (req, res) => {
    connection.query('SELECT * FROM admin', (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Admin',
                data: rows,
            });
        }
    });
});

//2: Menambahkan Data Admin Baru
router.post('/create', [
    // Validation
    body('nama_admin').notEmpty(),
    body('telp_admin').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    let data = {
        nama_admin: req.body.nama_admin,
        telp_admin: req.body.telp_admin
    };
    connection.query('INSERT INTO admin SET ?', data, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Data Admin Berhasil Ditambahkan',
                data: rows[0],
            });
        }
    });
});

//3: Menampilkan Data Admin Berdasarkan ID
router.get('/:id', (req, res) => {
    let id = req.params.id;
    connection.query('SELECT * FROM admin WHERE id_admin = ?', [id], (err, rows) => {
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
                message: 'Data Admin',
                data: rows[0],
            });
        }
    });
});

//4: Memperbarui Data Admin Berdasarkan ID
router.patch('/update/:id', [
    body('nama_admin').notEmpty(),
    body('telp_admin').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }
    let id = req.params.id;
    let data = {
        nama_admin: req.body.nama_admin,
        telp_admin: req.body.telp_admin
    };
    connection.query('UPDATE admin SET ? WHERE id_admin = ?', [data, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'Admin Tidak Ditemukan',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Admin Berhasil Diperbarui',
            });
        }
    });
});

//5: Menghapus Data Admin Berdasarkan ID
router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM admin WHERE id_admin = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Admin Not Found',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Admin Berhasil Dihapus',
            });
        }
    });
});

module.exports = router;