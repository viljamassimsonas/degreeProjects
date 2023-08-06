const express = require("express");
const router = express.Router();
const { format } = require('date-fns');

/**
 * @desc redirects to reader page if / requested
 */
router.get('/', (req, res) => {
    res.redirect('/reader')
});

///////////////////////////////////////////// AUTHENTICATION ///////////////////////////////////////////

const password = 'author';

/**
 * @desc checks if the user is authenticated
 */
function authentication(req, res, next) {
    if (req.session.autheticated) {
        next();
    } else {
        res.redirect('/login');
    }
}

/**
 * @desc renders the author login page
 */
router.get('/login', (req, res) => {

    res.render(__dirname.slice(0,-6) + 'views/login.html'); 
});

/**
 * @desc handles author login form submission
 */
router.post('/login', (req, res) => {

    if (req.body.password === password) {

        req.session.autheticated = true;
        res.redirect('/author')
    } else {
        res.redirect('/login');
    }
});

///////////////////////////////////////////// AUTHOR ROUTING ///////////////////////////////////////////

/**
 * @desc renders Author Home page
 */
router.get('/author', authentication, (req, res) => {

    global.db.all("SELECT * FROM articles", function(e, result) {

        listInput = []
        for (let i = 0; i < result.length; i++) {

            selector = result[i]
            serverQuery = {
                id: selector['_id'],
                title: selector['title'],
                subtitle: selector['subtitle'],
                article: selector['article'],
                created: selector['created'],
                modified: selector['modified'],
                publishedStatus: selector['publishedStatus'],
                publishedDate: selector['publishedDate'],
                likes: selector['likes']
            }
            listInput.push(serverQuery)
        }
        global.db.get("SELECT * FROM author", function(e, result2) {

            res.render(__dirname.slice(0,-6)+ 'views/author.html', {
                data: {
                    articles: listInput,
                    author: result2
                }
            })
        })
    });
});

/**
 * @desc renders Author Settings Page
 */
router.get("/settings", authentication, function(req, res) {

    global.db.get("SELECT * FROM author", function(err, result) {

        res.render(__dirname.slice(0,-6)+ 'views/settings.html', {
            settings: result
        })
    });
})

/**
 * @desc saves Author Settings
 */
router.get("/settingsSave", authentication, function(req, res) {

    let query = "UPDATE author SET title = ?, subtitle = ?, name = ?";
    let input = [req.query.title,
        req.query.subtitle,
        req.query.name
    ];

    global.db.get(query, input, (err, result) => {

        res.redirect('back');
    });
})

/**
 * @desc creates new Article and redirects to its edit page
 */
router.get("/create", authentication, function(req, res) {
    
    let query = "INSERT INTO articles (created, publishedStatus, likes) VALUES (?,'0','0')";
    let input = [format(new Date(), 'yyyy-MM-dd HH:mm:ss')];

    global.db.get(query, input, (err, result) => {})

    let query2 = "SELECT * FROM articles ORDER BY _id DESC LIMIT 1";

    global.db.get(query2, [], (err, result) => {

        res.redirect('/editArticleCommand?ArticleChosen=' + result['_id'])
    })
})

/**
 * @desc publishes Article and timestamps when PUBLISH button pressed
 */
router.get("/publishArticleCommand", authentication, function(req, res) {
    
    let query = "UPDATE articles SET publishedStatus = '1', publishedDate = ? WHERE _id = ?";
    let input = [format(new Date(), 'yyyy-MM-dd HH:mm:ss'), req.query.ArticleChosen];
    
    global.db.get(query, input, (err, result) => {

        res.redirect('/author')
    });
})

/**
 * @desc renders Article Editing page based on Article ID provided
 */
router.get("/editArticleCommand", authentication, function(req, res) {

    let query = "SELECT * FROM articles WHERE _id = ?";
    let input = [req.query.ArticleChosen];

    global.db.get(query, input, (err, result) => {

        resultFormed = {
            id: result['_id'],
            title: result['title'],
            subtitle: result['subtitle'],
            article: result['article'],
            created: result['created'],
            modified: result['modified'],
            publishedStatus: result['publishedStatus'],
            publishedDate: result['publishedDate'],
            likes: result['likes']
        }
        res.render(__dirname.slice(0,-6)+ 'views/edit.html', {
            article: resultFormed
        })
    });
})

/**
 * @desc saves Article Edit changes received through request and timestamps MODIFIED date
 */
router.get("/editArticleSave", authentication, function(req, res) {
    //searching in the database

    let query = "UPDATE articles SET title = ?, subtitle = ?, article = ?, modified = ? WHERE _id = ?";
    let input = [req.query.title,
        req.query.subtitle,
        req.query.article,
        format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        req.query.id];

    global.db.get(query, input, (err, result) => {

        res.redirect('back');
    });
})

/**
 * @desc deletes selected Article using its ID when pressing DELETE button
 */
router.get("/deleteArticleCommand", authentication, function(req, res) {

    let query = "DELETE FROM articles WHERE _id = ?";
    let input = [req.query.ArticleChosen];

    global.db.get(query, input, (err, result) => {

        res.redirect('back')
    });
})

///////////////////////////////////////////// READER ROUTING ///////////////////////////////////////////

/**
 * @desc renders Reader page
 */
router.get('/reader', (req, res) => {

    global.db.all("SELECT * FROM articles ORDER BY publishedDate DESC", function(e, result) {

        listInput = []
        for (let i = 0; i < result.length; i++) {

            selector = result[i]
            serverQuery = {
                id: selector['_id'],
                title: selector['title'],
                subtitle: selector['subtitle'],
                article: selector['article'],
                created: selector['created'],
                modified: selector['modified'],
                publishedStatus: selector['publishedStatus'],
                publishedDate: selector['publishedDate'],
                likes: selector['likes']
            }
            listInput.push(serverQuery)
        }
        global.db.get("SELECT * FROM author", function(e, result2) {
            res.render(__dirname.slice(0,-6)+ 'views/reader.html', {
                data: {
                    articles: listInput,
                    author: result2
                }
            })
        })
    });
});

/**
 * @desc renders Article Reading page and also its comments using its ID number
 */
router.get("/read", function(req, res) {

    let query = "SELECT * FROM articles WHERE _id = ?";
    let input = [req.query.id];

    global.db.get(query, input, (err, result) => {

        resultFormed = {
                id: result['_id'],
                title: result['title'],
                subtitle: result['subtitle'],
                article: result['article'],
                created: result['created'],
                modified: result['modified'],
                publishedStatus: result['publishedStatus'],
                publishedDate: result['publishedDate'],
                likes: result['likes']
            }

        let query2 = "SELECT * FROM comments WHERE id = ? ORDER BY date DESC";
        let input2 = [req.query.id];

        global.db.all(query2, input2, (err2, result2) => {

            listInput = []
            for (let i = 0; i < result2.length; i++) {

                selector = result2[i]
                serverQuery = {
                    id: selector['id'],
                    comment: selector['comment'],
                    date: selector['date']
                }
                listInput.push(serverQuery)
            }
            res.render(__dirname.slice(0,-6)+ 'views/read.html', {
                data: {
                    article: resultFormed,
                    comments: listInput
                }
            })
        });
    })
})

/**
 * @desc adds comment and timestamp to the Article and reloads it
 */
router.get("/addComment", function(req, res) {
    
    let query = "INSERT INTO comments (id, comment, date) VALUES (?,?,?)";
    let input = [req.query.id, req.query.comment, format(new Date(), 'yyyy-MM-dd HH:mm:ss')];
    
    global.db.get(query, input, (err, result) => {

        res.redirect('back')
    })
});

/**
 * @desc adds like to the Article and reloads it
 */
router.get("/like", function(req, res) {

    let query = "UPDATE articles SET likes = ? WHERE _id = ?";
    let input = [parseInt(req.query.likes) + 1, req.query.id];

    global.db.get(query, input, (err, result) => {

        res.redirect('back');
    });
})

///////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;