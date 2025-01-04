const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const comicRoutes = require('./routes/comic');
const genreRoutes = require('./routes/genre');
const authorRoutes = require('./routes/author');
const userRoutes = require('./routes/login');
const emailRoutes = require('./routes/users');
const sequelize = require('./config/database');
const path = require('path');
const session = require('express-session');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: '*', // Permetti le richieste da questo dominio
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Metodi consentiti
}));

app.use(bodyParser.json());
app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}))

app.use('/login', userRoutes);
app.use('/fumetto', comicRoutes);
app.use('/generi', genreRoutes);
app.use('/author', authorRoutes);
app.use('/users', emailRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error('Unable to connect to the database:', err));
