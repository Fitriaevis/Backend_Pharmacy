const express = require('express');
const router = express.Router();

//import express-validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/db');

//1: Menampilkan Semua Kelola Stok
router.get('/', (req, res) => {
    connection.query(' SELECT a.kode_kartu_stok AS id, d.nama_obat, f.nama_jenis_obat, c.nama_pabrik, a.tanggal, a.stok_masuk, a.stok_keluar, a.sisa, e.expired_date '
    + ' FROM kartu_stok a JOIN supplier c ON c.id_supplier = a.id_supplier ' 
    + ' JOIN data_obat d ON d.kode_obat = a.kode_nama_obat ' 
    + ' JOIN data_obat e ON e.kode_obat = a.kode_exp_obat ' 
    + ' JOIN jenis_obat f ON f.kode_jenis_obat = a.kode_jenis_obat ' 
    + ' ORDER BY a.kode_kartu_stok ASC ', (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kelola Stok',
                data: rows,
            });
        }
    });
});

//2: Menambahkan Kelola Stok Baru
router.post('/create', [
    // Validation
    body('kode_nama_obat').notEmpty(),
    body('kode_jenis_obat').notEmpty(),
    body('id_supplier').notEmpty(),
    body('tanggal').notEmpty(),
    body('stok_masuk').notEmpty(),
    body('stok_keluar').notEmpty(),
    body('sisa').notEmpty(),
    body('kode_exp_obat').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    let data = {
        kode_nama_obat: req.body.kode_nama_obat,
        kode_jenis_obat: req.body.kode_jenis_obat,
        id_supplier: req.body.id_supplier,
        tanggal: req.body.tanggal,
        stok_masuk: req.body.stok_masuk,
        stok_keluar: req.body.stok_keluar,
        sisa: req.body.sisa,
        kode_exp_obat: req.body.kode_exp_obat
    };
    connection.query('INSERT INTO kartu_stok SET ?', data, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Data Kelola Stok Berhasil Ditambahkan',
                data: rows[0],
            });
        }
    });
});

//3: Menampilkan Kelola Stok Berdasarkan ID
router.get('/:id', (req, res) => {
    let id = req.params.id;
    connection.query('SELECT a.kode_kartu_stok AS id, d.nama_obat, f.nama_jenis_obat, c.nama_pabrik, a.tanggal, a.stok_masuk, a.stok_keluar, a.sisa, e.expired_date '
    + ' FROM kartu_stok a JOIN supplier c ON c.id_supplier = a.id_supplier ' 
    + ' JOIN data_obat d ON d.kode_obat = a.kode_nama_obat ' 
    + ' JOIN data_obat e ON e.kode_obat = a.kode_exp_obat ' 
    + ' JOIN jenis_obat f ON f.kode_jenis_obat = a.kode_jenis_obat ' 
    + ' WHERE kode_kartu_stok = ?', [id], (err, rows) => {
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
                message: 'Data Kelola Stok',
                data: rows[0],
            });
        }
    });
});

//4: Memperbarui Kelola Stok Berdasarkan ID
router.patch('/update/:id', [
    body('kode_nama_obat').notEmpty(),
    body('kode_jenis_obat').notEmpty(),
    body('id_supplier').notEmpty(),
    body('tanggal').notEmpty(),
    body('stok_masuk').notEmpty(),
    body('stok_keluar').notEmpty(),
    body('sisa').notEmpty(),
    body('kode_exp_obat').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }
    let id = req.params.id;
    let data = {
        kode_nama_obat: req.body.kode_nama_obat,
        kode_jenis_obat: req.body.kode_jenis_obat,
        id_supplier: req.body.id_supplier,
        tanggal: req.body.tanggal,
        stok_masuk: req.body.stok_masuk,
        stok_keluar: req.body.stok_keluar,
        sisa: req.body.sisa,
        kode_exp_obat: req.body.kode_exp_obat
    };
    connection.query('UPDATE kartu_stok SET ? WHERE kode_kartu_stok = ?', [data, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'Kartu Stok Tidak Ditemukan',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kelola Stok Berhasil Diperbarui',
            });
        }
    });
});

//5: Menghapus Kelola Stok Berdasarkan ID
router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM kartu_stok WHERE kode_kartu_stok = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Kelola Stok Not Found',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kelola Stok Berhasil Dihapus',
            });
        }
    });
});

module.exports = router;