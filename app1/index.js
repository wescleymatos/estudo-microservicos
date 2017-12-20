const SALT_KEY = '7a81ed99121c7730e53814f7fc32ffd63a4b9459';
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({
    limit: '5mb'
}));


const generateToken = async (data) => {
    return jwt.sign(data, SALT_KEY, { expiresIn: '1d' });
};

const decodeToken = async (token) => {
    let data = await jwt.verify(token, SALT_KEY);

    return data;
};

app.get('/', async (req, res) => {
  res.send('App1 funcionando...');
});

app.post('/', async (req, res) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const data = req.body;
  const result = {data};

  try {
    const dataToken = await decodeToken(token);
    result['dataToken'] = dataToken;
  } catch (e) {
    result['error'] = e.message;
  }

  res.send({msg: 'voltou de App1', result});
});

app.listen(port, () => 'Server running on port' + port);
