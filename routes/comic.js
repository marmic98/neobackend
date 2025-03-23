const express = require('express');
const router = express.Router();
const Comic = require('../models/comic');
const Author = require('../models/author');
const Genre = require('../models/genre');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { now } = require('sequelize/lib/utils');

// Configurazione di multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Cartella di destinazione per i file caricati
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rinomina il file con un timestamp
    }
});

const upload = multer({ storage: storage });

Comic.sync()

const moveFile = (source, destination) => {
    return new Promise((resolve, reject) => {
        fs.rename(source, destination, (err) => {
            if (err) {
                reject(err); // Se c'è un errore durante il movimento, rigetta la promessa
            } else {
                resolve(); // Altrimenti, risolvi la promessa con successo
            }
        });
    });
};

router.post('/addChapter', upload.array('files', 2), async (req, res) => {
    const id = req.body.id; // Ottieni l'id dal FormData

    try {
        // Trova il fumetto nel database
        let fumetto = await Comic.findOne({ where: { id } });

        if (fumetto) {
            fumetto.chapterNumber++; // Incrementa il numero di capitoli
            await fumetto.save();
            const capNum = fumetto.chapterNumber; // Numero capitolo aggiornato

            // Ottieni i nomi dei file caricati
            const fileNames = req.files.map(file => file.filename);

            // Percorsi delle cartelle di destinazione
            const capitoliFolder = path.join(__dirname, '../imgs/fumetti', id); // Cartella capitoli
            const anteprimaFolder = path.join(__dirname, '../imgs'); // Cartella anteprima

            // Assicurati che le cartelle esistano o creale
            if (!fs.existsSync(capitoliFolder)) {
                fs.mkdirSync(capitoliFolder, { recursive: true });
            }

            // Rinomina e sposta i file
            const capitoloFileName = `${capNum}cap.png`; // Nome per il capitolo
            const anteprimaFileName = `${id}ante${capNum}.png`; // Nome per l'anteprima

            // Sposta il primo file (capitolo) e il secondo file (anteprima)
            await Promise.all(fileNames.map((fileName, index) => {
                const sourcePath = path.join('uploads', fileName); // Sostituisci con il percorso effettivo
                const destinationPath = index === 0
                    ? path.join(capitoliFolder, capitoloFileName) // Primo file -> capitolo
                    : path.join(anteprimaFolder, anteprimaFileName); // Secondo file -> anteprima

                return moveFile(sourcePath, destinationPath);
            }));
            fumetto.lastUpdate = new Date();
            Comic. save(fumetto)
            res.status(200).json({ message: 'Capitoli incrementati', fileNames: [capitoloFileName, anteprimaFileName] });
        } else {
            res.status(404).json({ message: 'impossibile aggiungere capitolo' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/save/add', upload.array('imgs',4 ), async (req, res) => {
    const { title, subtitle, description, type,  genres, sceneggiatore, disegnatore, colorista } = req.body;
    const images = req.files; // Array di file caricati
    const now = new Date();
    const releaseDate = now.toISOString().slice(0, 19).replace('T', ' '); // 'YYYY-MM-DD HH:MM:SS'

    const fumettoDaSalvare = {
        title,
        description,
        subtitle,
        releaseDate,
        subtitle,
        type,
        sceneggiatore,
        disegnatore,
        colorista: colorista || null
    }
    let fumetto = new Comic;
    let id = null;
    try {
        fumetto = await Comic.create(fumettoDaSalvare);  // Crea un nuovo fumetto se non esiste
        id = await fumetto.id
    }catch(e){
        console.error("errore inserimento fumetto: "+e)
        return res.status(500).json({ message: 'Errore durante la creazione del fumetto' });
    }

    try{
        for (let genere of genres){
            genere.id = fumetto.id
            await fumetto.addGenre(genere)
        }
    }catch(e){
        console.error("errore inserimento generi: "+e)
        return res.status(500).json({ message: 'Errore durante l\'associazione dei generi al fumetto' });
    }

    try{
        // Ottieni i nomi dei file caricati
        const fileNames = images.map(file => file.filename);

        // Percorsi delle cartelle di destinazione
        const imgFolder = path.join(__dirname, '../imgs'); // Cartella imgs

        /*Assicurati che le cartelle esistano o creale
        if (!fs.existsSync(anteprimaFolder)) {
            fs.mkdirSync(ante, { recursive: true });
        }*/
        console.log(id)
        // Rinomina e sposta i file
        const newFileNames = [
            `${id}WP.png`, 
            `${id}Title.png`, 
            `${id}Banner.png`, 
            `${id}Cover.png`
        ];

        // Sposta files in ordine
        await Promise.all(fileNames.map((fileName, index) => {
            const sourcePath = path.join('uploads', fileName); // Percorso del file sorgente
            const destinationPath = path.join(imgFolder, newFileNames[index]); // Percorso di destinazione con nuovo nome

            return moveFile(sourcePath, destinationPath).catch(err => {
                console.error(err)
            }) // Sposta il file
        }));
        console.log("fumetto aggiunto!")
        res.status(200).json({ message: 'tutto ok', /*fileNames: [capitoloFileName, anteprimaFileName]*/ });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message });
    }
});



// Endpoint per ottenere tutti i fumetti
router.get('/', async (req, res) => {
    try {
        const fumetti = await Comic.findAll({order: [['releaseDate', 'ASC']],
            include: [
                {model: Genre},            
                {model: Author, as: 'Sceneggiatore'},
                {model: Author, as: 'Disegnatore'},
                {model: Author, as: 'Colorista'},
            ]
        });
        res.status(200).json(fumetti);
        console.log("fumetti trovati!")
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/image/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '../imgs', imageName); // Percorso dell'immagine

    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(err.status).end();
        }
        console.log(imageName+" ottenuta!")
    });
});

router.get('/image/fumetti/:fumettoId/:capId', async (req, res) => {
    const fumettoId = req.params.fumettoId;
    const capId = req.params.capId
    const imagePath = path.join(__dirname, '../imgs/fumetti', fumettoId+"/"+capId); // Percorso dell'immagine
    const fumetto = await Comic.findOne({where: {id: fumettoId}});
    fumetto.visuals++;
    Comic.update(fumetto);
    return res.sendFile(imagePath, (err) => {
        if (err) {
            console.error(err);
            res.status(err.status).end();
        }
    });
    
});

// Endpoint per ottenere un fumetto
router.get('/:id', async (req, res) => {
    try {
        const fumetto = await Comic.findOne({ where: { id: req.params.id }, 
            include: [
                {model: Genre},            
                {model: Author, as: 'Sceneggiatore'},
                {model: Author, as: 'Disegnatore'},
                {model: Author, as: 'Colorista'},
            ]
        });

        if (fumetto) {
            res.status(200).json(fumetto);
        } else {
            res.status(404).json({ message: 'Fumetto non trovato' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;