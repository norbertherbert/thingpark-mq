import express, { json, urlencoded } from 'express';

import { getAccessTokenAsync } from './tpxle-auth.js';

const app = express();
const port = process.env.HTTP_AUTH_PORT;

// Only valid if usung Webhooks Plugin
const CACHE_AGE_IN_SECONDS = 300;

app.use(json());
app.use(urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.socket.remoteAddress}:${req.socket.remotePort} ${req.method} ${req.path}`);
    return next();
});



app.post('/vmq/lua', async (req, res) => {

    console.log(JSON.stringify(req.body));

    let responeBody;
    try {
        const accessToken = await getAccessTokenAsync(
          req.body.username,
          req.body.password,
          'dev1',
        );
        const subscriberId = JSON.parse(
          Buffer.from(accessToken.split('.')[1], 'base64').toString(),
        ).scope[0].split(':')[1];

        responeBody = {
            result: "ok",
            publish_acl: [
                { pattern: `+/${subscriberId}/nsnit/#` },
                { pattern: `+/${subscriberId}/nitns/#` },
            ],
            subscribe_acl: [
                // { pattern: '#' },
                { pattern: `+/${subscriberId}/nsnit/#` },
                { pattern: `+/${subscriberId}/nitns/#` },
            ],
        }

        const headers = {
            'content-type': 'application/json',
            'cache-control': `max-age=${CACHE_AGE_IN_SECONDS}`,
        }
        res.header(headers);

        console.log(JSON.stringify(responeBody));

        res.status(200).json(responeBody);

    } catch (err) {
        res.status(403).end();
    }

})

app.post('/vmq/auth', async (req, res) => {

    console.log(JSON.stringify(req.body));

    try {
        const accessToken = await getAccessTokenAsync(
          req.body.username,
          req.body.password,
          'dev1',
        );
        const responeBody = {
            result: "ok",
        }
        const headers = {
            'content-type': 'application/json',
            'cache-control': `max-age=${CACHE_AGE_IN_SECONDS}`,
        }
        res.header(headers);

        console.log(JSON.stringify(responeBody));

        res.status(200).json(responeBody);
    } catch (err) {
        res.status(403).end();
    }

})

app.post('/vmq/sub', async (req, res) => {

    console.log(JSON.stringify(req.body));

    const responeBody = {
        result: "ok",
    }

    console.log(JSON.stringify(responeBody));

    const headers = {
        'content-type': 'application/json',
        'cache-control': `max-age=${CACHE_AGE_IN_SECONDS}`,
    }
    res.header(headers);

    console.log(JSON.stringify(responeBody));

    res.status(200).json(responeBody);
})

app.post('/vmq/pub', async (req, res) => {

    console.log(JSON.stringify(req.body));

    const responeBody = {
        result: "ok",
    }

    console.log(JSON.stringify(responeBody));

    const headers = {
        'content-type': 'application/json',
        'cache-control': `max-age=${CACHE_AGE_IN_SECONDS}`,
    }
    res.header(headers);

    console.log(JSON.stringify(responeBody));

    res.status(200).json(responeBody);
})



app.use((req, res, next) => {
    return res.status(404).end();
});

app.use((err, res, req, next) => {
    console.error(err);
    return res.status(500).end();
});

const server = app.listen(3000, () => {
    const address = server.address();
    return console.log(`Server listening on ${address.address}:${address.port} ...`);
});
