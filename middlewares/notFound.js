// middleware personalizzato per dare errore in caso di pagina non trovata
const notFound = (req,res) => {
    res.status(404).send('404: page not found')
}

module.exports = notFound;