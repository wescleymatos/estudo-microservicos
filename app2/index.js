const SALT_KEY = '7a81ed99121c7730e53814f7fc32ffd63a4b9459';
const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fetch = require('node-fetch');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const generateToken = async (data) => {
    return jwt.sign(data, SALT_KEY, { expiresIn: '1d' });
}

const decodeToken = async (token) => {
    let data = await jwt.verify(token, SALT_KEY);
    return data;
}

app.get('/', async (req, res) => {
  res.send('App2 funcionando... ');
});

app.post('/gettoken', async (req, res) => {
  const data = req.body;
  const token = await generateToken(data);

  res.send(token);
});

app.post('/saveuser', async (req, res) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const data = JSON.stringify(req.body);

  fetch('http://localhost:3000', {
    method: 'POST',
    body: data,
    headers: {
      'x-access-token': token,
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(json => res.send(json));
});

app.listen(port, () => 'Server running on port' + port);
