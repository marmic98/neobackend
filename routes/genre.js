const express = require('express');
const router = express.Router();
const Comic = require('../models/comic');
const Author = require('../models/author');
const Genre = require('../models/genre');
const path = require('path');
const multer = require('multer');
const fs = require('fs')

router.get('/', async (req, res) => {
    try{
        const generi = await Genre.findAll({order: [['name', 'ASC']]})
        res.status(200).json(generi)
    }catch(e){
        res.status(500)
    }
});

module.exports = router