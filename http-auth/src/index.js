import express, { json, urlencoded } from 'express';

import { getAccessTokenAsync } from './tpxle-auth.js';

const app = express();


app.use(json());
app.use(urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.socket.remoteAddress}:${req.socket.remotePort} ${req.method} ${req.path}`);
    return next();
});


/* **********************************************************
 * This code is used for the VMQ Diversity Plugin with a LUA script.
 * This is the currently implemented method for authentication and access control.
 * ********************************************************* */

app.post('/vmq/lua', async (req, res) => {

  if (!(req.body.username && req.body.password)) {
    res.status(400).end();
    return;
  }

  const headers = {
    'content-type': 'application/json',
  };
  res.header(headers);

  let responseBody;

  if (
    req.body.username === process.env.MQTT_SUPER_USER &&
    req.body.password === process.env.MQTT_SUPER_PASSWD
  ) {
    responseBody = {
      result: 'ok',
      publish_acl: [{ pattern: '#' }],
      subscribe_acl: [{ pattern: '#' }],
    };
    console.log(JSON.stringify(responseBody));
    res.status(200).json(responseBody);
    return;
  }

  const authSrvType = req.body.username.includes('/') ? 'dx-api' : 'keycloak';

  try {
    const accessToken = await getAccessTokenAsync(req.body.username, req.body.password, authSrvType);

    const accessTokenDecoded = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString(),
    );
    let subscriberId;
    if (authSrvType === 'keycloak') {
      // subscriberId = accessTokenDecoded.parentSubscriptions['actility-sup/tpx'][0].subscriberId;
      subscriberId = accessTokenDecoded.sub;
    } else {
      // eslint-disable-next-line prefer-destructuring
      subscriberId = accessTokenDecoded.scope[0].split(':')[1];
    }

    console.log(subscriberId);

    responseBody = {
      result: 'ok',
      publish_acl: [{ pattern: `${subscriberId}/#` }, { pattern: `${subscriberId}/#` }],
      subscribe_acl: [
        // { pattern: '#' },
        { pattern: `${subscriberId}/#` },
        { pattern: `${subscriberId}/#` },
      ],
    };
    console.log(JSON.stringify(responseBody));
    res.status(200).json(responseBody);
  } catch (err) {
    res.status(403).end();
  }
});


/* **********************************************************
 * This code could be used for the VMQ Webhooks Plugin.
 * It is just a template code that would accept all requests with result: ok.
 * ********************************************************* */
/*

const CACHE_AGE_IN_SECONDS = 300;

app.post('/vmq/auth', async (req, res) => {

    console.log(JSON.stringify(req.body));

    try {
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

*/


app.use((req, res, next) => {
    return res.status(404).end();
});

app.use((err, res, req, next) => {
    console.error(err);
    return res.status(500).end();
});

const server = app.listen(process.env.HTTP_AUTH_PORT, () => {
    const address = server.address();
    return console.log(`Server listening on ${address.address}:${address.port} ...`);
});
