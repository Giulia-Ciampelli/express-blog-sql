// Bonus
// Creare inoltre un filtro in querystring per tag, che ritorna in formato json tutti i post che hanno quei tag

// #region variabili d'importazione
const express = require('express');
const cors = require('cors');
const app = express();
const HOST = process.env.HOST;
const PORT = process.env.PORT;

// importazione router
const postsRouter = require('./routes/posts.js');

// importazione middleware
const notFound = require('./middlewares/notFound.js');
const logger = require('./middlewares/logger.js');
// #endregion variabili d'importazione

// elaborazione corpo richiesta
app.use(express.json());

// impostazione iniziale server
app.listen(PORT, (req,res) => {
    console.log(`Server disponibile su: ${HOST}:${PORT}`);
})

// uso di cors su tutte le rotte
app.use(cors());

// uso middleware log
app.use('/posts', logger);

// uso router
app.use('/posts', postsRouter);

// uso assets statici
app.use(express.static('public'));

// uso middleware errore
app.use(notFound);