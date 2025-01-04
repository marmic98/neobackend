const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', async (req, res) => {
    const {us, psw} = req.body;
    console.log("tentato login con credenziali: "+us+" "+psw)
    if(!us || !psw){
        return res.status(400).json('username e password sono obbligatori');
    }else if(us === "admin" && psw === "Cutolo123!"){
        const secretKey = "pipopipo";
        const token = jwt.sign( {username: "admin"}, secretKey, {expiresIn: 86400})
        return res.status(200).json({auth: true, token})
    }else{
        return res.status(404).json("non trovato")
    }
});

module.exports = router