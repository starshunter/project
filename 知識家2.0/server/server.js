import express from 'express'
import cors from 'cors'
import path from 'path'
import "dotenv-defaults/config.js"

import mainRoute from './routes/main.js'
import mongo from './mongo.js';

const isProduction = process.env.NODE_ENV === 'production'

// load environment variable from .env
// require('dotenv-defaults').config();

const app = express()

// init middleware
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
    if (isProduction && req.headers['x-forwarded-proto'] !== 'https')
        return res.redirect('https://' + req.headers.host + req.url)
    return next()
})

// define routes
app.use('/api', mainRoute)

const port = process.env.PORT || 4000

if (isProduction) {
    // set static folder
    const publicPath = path.join(__dirname, '..', 'build')

    app.use(express.static(publicPath))

    app.get('*', (_, res) => {
        res.sendFile(path.join(publicPath, 'index.html'))
    })
}

// connect to mongoDB
mongo.connect();

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})
