// importazione vero db
const connection = require('../db/db.js');

// importazione modulo fs
const fs = require('fs');

// creazione index
const index = (req, res) => {
    const sqlPost = 'SELECT * FROM posts';
    const sqlTags = `
    SELECT tags.*, post_tag.post_id
    FROM tags
    JOIN post_tag ON tags.id = post_tag.tag_id
    `;

    // creazione query
    connection.query(sqlPost, (err, results) => {

        // test 500
        if (err) return res.status(500).json({ error: err });

        // test 404
        if (!results.length) return res.status(404).json({
            error: 'No tags found'
        })

        // creazione query dei tag
        connection.query(sqlTags, (err, tagResults) => {

            // test 500
            if (err) return res.status(500).json({ error: err })

            // test 404
            if (!results[0]) return res.status(404).json({
                error: 'No tags found'
            })

            // map e filter dentro map (?? metodo meno orribile da trovare) per combinare post e tags
            const postTags = results.map(post => {

                const tags = tagResults
                    .filter(tag => tag.post_id === post.id)
                    .map(tag => tag.label);

                // ritorno post con tags
                return { ...post, tags };
            })

            // consegna risposta
            res.status(200).json({
                data: postTags
            });
        })
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
    const id = req.params.slug;
    const sqlPost = `SELECT * FROM posts WHERE id=?`;
    const sqlTags = `
    SELECT tags.*
    FROM tags
    JOIN post_tag ON tags.id = post_tag.tag_id
    `;

    // creazione query
    connection.query(sqlPost, [id], (err, results) => {

        // test 500
        if (err) return res.status(500).json({ error: err })

        // test 404
        if (!results[0]) return res.status(404).json({
            error: `No posts found at this id: ${id}`
        })

        // preparazione dati post
        const post = results[0];

        // creazione query dei tag
        connection.query(sqlTags, [id], (err, tagResults) => {

            // test 500
            if (err) return res.status(500).json({ error: err })

            // test 404
            if (!results[0]) return res.status(404).json({
                error: 'No tags found'
            })

            post.tags = tagResults;

            // variabile risposta
            const responseData = {
                data: post
            }

            // consegna risposta
            res.status(200).json(responseData);
        })
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

    const id = req.params.slug;
    const sql = 'DELETE FROM posts WHERE id=?';

    // creazione query
    connection.query(sql, [id], (err, results) => {

        // test 500
        if (err) return res.status(500).json({ error: err })

        // test 404
        if (results.affectedRows === 0) return res.status(404).json({
            error: `No posts found at this id: ${id}`
        })

        // consegna risposta
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