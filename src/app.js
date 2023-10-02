const express = require('express');
const cors = require('cors');
const authRouter = require('./router/auth.router')
const fileRouter = require('./router/file.router')


const PORT = process.env.PORT || 8080;
const app = express()
const corsOptions = { origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', optionsSuccessStatus: 204 };

app.use(cors(corsOptions));
app.use(express.json());
app.use('/', authRouter)
app.use('/file', fileRouter)


app.listen(PORT, () => {
    console.log('Started on port', PORT)
})
