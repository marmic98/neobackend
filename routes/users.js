const express = require('express');
const router = express.Router();
const User = require('../models/user');
const path = require('path');
const { now } = require('sequelize/lib/utils');
const nodemailer = require('nodemailer');
const { stringify } = require('querystring');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'michelmartino98.mm@gmail.com',
        pass: 'fqtv uqnj yitb rrpy'
    }
})

router.post('/subscribe',  async (req, res) => {
    const email = req.body.email; // Ottieni email dal FormData

    try {
        // Trova il email nel database
        let userFound = await User.findOne({ where: { email } });

        if (!userFound || userFound.unsubscribeDate != null) {
            userFound = new User()
            userFound.email = email;
            userFound.subscribeDate = new Date();
            userFound.unsubscribeDate = null;
            await userFound.save();
            return res.status(200).json({ message: 'Iscrizione avvenuta con successo'});
        } else {
            return res.status(400).json({ message: 'Utente già iscritto' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.delete('/unsubscribe',  async (req, res) => {
    const email = req.body.email; // Ottieni email dal FormData

    try {
        // Trova il email nel database
        let userFound = await User.findOne({ where: { email } });

        if (userFound) {
            userFound.email = email;
            userFound.unsubscribeDate = new Date();
            await userFound.save();
            return res.status(200).json({ message: 'Disiscrizione avvenuta con successo'});
        } else {
            return res.status(400).json({ message: 'Utente non presente' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// Endpoint per ottenere tutte le email
router.get('/', async(req, res) => {
    try {
        const email = await User.findAll({ });
        console.log("elenco email ottenuto!")
        return res.status(200).json(email.filter(elem => elem.unsubscribeDate == null));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post('/sendEmail', async(req, res) => {
    const oggetto = req.body.oggetto;
    const emailText = req.body.emailText;
    const emailListPromise =  await User.findAll({ })
    const emailList  = emailListPromise.filter(elem => elem.unsubscribeDate == null).map(elem => elem.email);
    let response = await sendEmail(emailList.join(','), oggetto, emailText);
    console.log(response)
    return response ? res.status(200).json('Email inviata con successo a tutti i destinatari') : res.status(500).json('Errore nell\'invio dell\'email');
})

// Funzione per inviare l'email
async function sendEmail(to, subject, text) {
    console.log(to)
    const mailOptions = {
        from: 'michelmartino98.mm@gmail.com',   // L'email del mittente
        to: to,                        // L'email del destinatario
        subject: subject,              // Oggetto dell'email
        text: text                      // Corpo dell'email
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('error ' + error);
                reject(error); // Rejecriamo l'errore se c'è un problema
            } else {
                console.log('info ' + info);
                resolve(info); // Risolviamo la promessa con le informazioni
            }
        });
    });
}

module.exports = router;