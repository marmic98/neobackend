const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');

router.post('/', async (req, res) => {
    const {us, psw} = req.body;
    console.log("tentato login con credenziali: "+us+" "+psw)
    if(!us || !psw){
        return res.status(400).json('username e password sono obbligatori');
    }else {
        const admin = await Admin.findOne({where: {us, psw}});
        if(!admin){
            return res.status(401).json('username o password errati');
        }
        return res.status(200).json({auth: true})
    }
    return res.status(404).json("non trovato")
    
});

module.exports = router