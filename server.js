const express = require('express')
const app = express()
require('dotenv').config()
require('./config/mongodb')

const api = require('./api')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'welcome to my simple rest api'
    })
})

app.use('/api', api)

app.listen(port, () => console.log(`server running on port ${port}`))