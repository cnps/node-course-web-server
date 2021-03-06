const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
const maintenanceMode = false;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    
    console.log(log);
    
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    
    next();
});

app.use((req, res, next) => {
    
    if (maintenanceMode) {
        res.render('maintenance');
    } else {
        next();
    }
});

app.use(express.static(__dirname + '/public'));


hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//loads start page
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home page',
        welcomeMessage: 'Welcome to home title'
    });
});

//loads about page
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About page',
    });
});

//loads projects page
app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects page'
    })
})

//loads profile page
app.get('/profile', (req, res) => {
    res.send('<h1>This is profile</h1><div><p>My name is Christian</p></div>');
});

app.get('/help', (req, res) => {
    res.sendFile('../public/help.html');
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'error handling request'
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    
});