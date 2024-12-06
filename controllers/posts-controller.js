// importazione db
const posts = require('../db/db.js');

// importazione modulo fs
const fs = require('fs');

// creazione index
const index = (req, res) => {
    res.json({
        data: posts,
        count: posts.length
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
    if(!post) {
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
    if(!post) {
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

    // parametro per trovare il post
    const post = posts.find(post => post.slug === req.params.slug);

    // res di errore
    if(!post) {
        return res.status(404).json({
            error: '404: post not found'
        })
    }

    // rimozione dal db
    const postsDestroy = posts.filter(post => post.slug !== req.params.slug);

    // secondo test
    if(postsDestroy.length === posts.length) {
        res.status(500).json({
            error: '500: no change in array'
        })
    }

    // aggiornamento db
    fs.writeFileSync('./db/db.js', `module.exports = ${JSON.stringify(postsDestroy, null, 4)}`);

    // ritorno del db aggiornato
    res.status(200).json({
        status: 200,
        data: postsDestroy,
        count: postsDestroy.length
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