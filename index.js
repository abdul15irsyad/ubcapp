const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
require('./config/mongodb')

const api = require('./api')
const { checkAuthToken } = require('./middlewares/tokenMiddleware')

app.use(cors())
app.use('/', express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'UBC App'
    })
})

app.use('/api', checkAuthToken, api)

app.listen(port, () => console.log(`server running on port ${port}`))