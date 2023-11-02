const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
app.use(cors())


// app.get('/', (req,res)=>{
//     res.send('Halo Ini Backend App Apotek')
// })

const bodyPs = require('body-parser');
app.use(bodyPs.urlencoded({ extended: false }));
app.use(bodyPs.json());


//import route Admin
const adminRouter = require('./routes/admin');
app.use('/api/admin', adminRouter);

//import route Jenis Obat
const jenisObatRouter = require('./routes/jenis_obat');
app.use('/api/jenisObat', jenisObatRouter);

//import route Supplier
const supplierRouter = require('./routes/supplier');
app.use('/api/supplier', supplierRouter);

//import route Data Obat
const obatRouter = require('./routes/data_obat');
app.use('/api/data_obat', obatRouter);

//import route Data Obat
const stokRouter = require('./routes/kartu_stok');
app.use('/api/kartu_stok', stokRouter);



//listen express.js kedalam port 
app.listen(port, () => {
    console.log(`aplikasi akan berjalan di http://localhost:${port}`)
})
