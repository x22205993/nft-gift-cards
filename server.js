const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Readable } = require('stream');
const multer = require('multer');
const pinataSDK = require('@pinata/sdk');
require('dotenv').config()

const app = express();
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const bufferToStream = (buffer) => {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
};


async function uploadFileToIPFS(file) {
    const options = {
        pinataMetadata: {
            name: file.originalname
        }
    };
    const result = await pinata.pinFileToIPFS(bufferToStream(file.buffer), options);
    return result.IpfsHash;
}

async function uploadJSONToIPFS(json) {
    const options = {
        pinataMetadata: {
            name: "MyJSON-1",
        }
    };
    const res = await pinata.pinJSONToIPFS(json, options);
    return res;
}

app.post('/api/upload/image', upload.single('image'), async (req, res) => {
    try {
        const ipfsId = await uploadFileToIPFS(req.file);
        res.status(200).json({ ipfsId });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error uploading image to IPFS");
    }
});

app.post('/api/upload/json', async (req, res) => {
    try {
        const jsonData = req.body;
        const ipfsId = await uploadJSONToIPFS(jsonData);
        res.status(200).json({ ipfsId });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error uploading JSON to IPFS");
    }
});

app.get('/', (req, res) => {
    res.render(process.env.NODE_ENV === 'production' ? 'index-prod' : 'index');
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
