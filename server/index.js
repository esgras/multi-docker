const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const mysqlClient = require('./db');
mysqlClient.getConnection(function(err, conn) {
    conn.query('CREATE TABLE IF NOT EXISTS vals (number INT)', (err, res, fields) => {});
    mysqlClient.releaseConnection(conn);
})
const mysqlPromise = mysqlClient.promise();

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

app.get('/values/all', async (req, res) => {
    const [values, fields] = await mysqlPromise.query('SELECT * FROM vals');
    res.send(values);
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
    await mysqlPromise.query('INSERT INTO vals(number) VALUES(?)', [index]);
    res.send({working: true});
});


app.listen(5000, err => {
    console.log('Listening');
});