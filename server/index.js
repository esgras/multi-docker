const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// const mysqlClient = require('./db');
const mysqlPromise = require('./db');
// mysqlClient.query('CREATE TABLE IF NOT EXISTS vals (number INT)');


// const mysqlPromise = mysqlClient.promise();

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

app.get('/values/all', async (req, res) => {
    await mysqlPromise.execute("SELECT NOW()");
    // await mysqlPromise.query('CREATE TABLE IF NOT EXISTS vals (number INT)');
    // const [values, fields] = await mysqlPromise.query('SELECT * FROM vals');
    // res.send(values);

    res.send([]);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }
    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    // await mysqlPromise.query('INSERT INTO vals(number) VALUES(?)', [index]);
    res.send({working: true});
});


app.listen(5000, err => {
    console.log('Listening');
});
