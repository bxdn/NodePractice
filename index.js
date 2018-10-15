const genres = require('./routes/genres')
const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(helmet());

app.use('/api/genres',genres);

app.set('view engine', 'pug');

const port = process.env.PORT || 3000;
app.listen(port,()=>{console.log(`Listening on port ${port}...`);});
