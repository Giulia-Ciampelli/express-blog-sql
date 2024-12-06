// importazione vero db
// const posts = require('../db/db.js');
const connection = require('../db/db.js');

// importazione modulo fs
const fs = require('fs');

// creazione index
const index = (req, res) => {

    const sql = 'SELECT * FROM posts';

    // creazione query
    connection.query(sql, (err, results) => {

        if (err) return res.status(500).json({ error: err });

        const responseData = {
            data: results,
            count: results.length
        }

        res.status(200).json(responseData);
    })
}

// creazione store C
const store = (req, res) => {

    // creazione oggetto nuovo
    const postNew = {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    }

    posts.push(postNew);

    // update db
    fs.writeFileSync('./db/db.js', `module.exports = ${JSON.stringify(posts, null, 4)}`);

    res.json({
        status: 201,
        data: posts,
        count: posts.length
    })
}

// creazione show R
const show = (req, res) => {
    const post = posts.find(post => post.slug === (req.params.slug));

    // condizioni per ritorno
    if (!post) {
        res.status(404).json({
            error: '404: post not found'
        })
    }
    res.json({
        data: post
    })
}

// creazione update U
const update = (req, res) => {

    // parametro per trovare il post
    const post = posts.find(post => post.slug === (req.params.slug));

    // res di errore
    if (!post) {
        res.status(404).json({
            error: '404: post not found'
        })
    }

    // creazione oggetto
    post.title = req.body.title;
    post.slug = req.body.slug;
    post.content = req.body.content;
    post.image = req.body.image;
    post.tags = req.body.tags;

    // aggiorna il db
    fs.writeFileSync('./db/db.js', `module.exports = ${JSON.stringify(posts, null, 4)}`);

    // rispondi col post aggiornato
    res.status(200).json({
        status: 200,
        data: posts,
        count: posts.length
    })
}

// creazione delete D
const destroy = (req, res) => {

    const id = req.params.id;
    const sql = 'DELETE FROM posts WHERE id=?';

    // creazione query
    connection.query(sql, [id], (err, results) => {

        if (err) return res.status(500).json({ error: err })
        
        // test 404
        if (results.affectedRows === 0) return res.status(404).json({
            error: `No posts found at this id: ${id}`
        })

        return res.json({
            status: 204,
            affectedRows: results.affectedRows
        })
    })
}

//esportazione totale
module.exports = {
    index,
    store,
    show,
    update,
    destroy
}