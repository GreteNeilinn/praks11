const express = require('express');
const pool = require('./database');

const app = express();

app.set('view engine', 'ejs');

app.listen(3000);

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});
app.get('/contactus', (req, res) => {
    res.render('contactus', { title: 'Contact us' });
});
app.get('/create', (req, res) => {
    res.render('create');
});

app.get('/posts', async(req, res) => {
    try {
        console.log("get posts request has arrived");
        const posts = await pool.query(
            "SELECT * FROM nodetable"
        );
        res.json(posts.rows);
    } catch (err) {
        console.error(err.message);
    }
});


app.get('/posts/:id', async(req, res) => {
    try {
        console.log("get a post request has arrived");
        const { id } = req.params;
        const posts = await pool.query(
            "SELECT * FROM nodetable WHERE id=$1", [id]
        );
        res.json(posts.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


app.post('/posts/', async(req, res) => {
    try {
        console.log("a post request has arrived");
        const post = req.body;
        const newpost = await pool.query(
            "INSERT INTO nodetable(title,body) values ($1,$2) RETURNING*", [post.title, post.body]
        );
        res.json(newpost);
    } catch (err) {
        console.error(err.message);
    }
});


app.post('/posts', async(req, res) => {
    try {
        console.log("a post request has arrived");
        const post = req.body;
        const newpost = await pool.query(
            "INSERT INTO nodetable(datetime, content, image) values ($1,$2,'') RETURNING*", [post.title, post.body]
        );
        res.json(newpost);
    } catch (err) {
        console.error(err.message);
    }
});



app.put('/posts/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const post = req.body;
        console.log("update request has arrived");
        const updatepost = await pool.query(
            "UPDATE nodetable SET (title, body) = ($2, $3) WHERE id=$1", [id, post.title, post.body]
        );
        res.json(post);
    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/posts/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const post = req.body;
        console.log("delete a post request has arrived");
        const deletepost = await pool.query(
            "DELETE FROM nodetable WHERE id = $1", [id]
        );
        res.json(post);
    } catch (err) {
        console.error(err.message);
    }
});

// We will discuss this method next week, when we speak about Middlewares
app.use(express.static("public"));
app.use((req, res) => {
    res.status(404).render('404');
});