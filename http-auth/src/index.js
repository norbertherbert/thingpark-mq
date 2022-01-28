import express, { json, urlencoded } from 'express';
import fetch from 'node-fetch';

import { getAccessTokenAsync } from './tpxle-auth.js';

const DXADMINAPI_URL = process.env.DXADMINAPI_URL; // || 'https://dx-api.thingpark.io/admin/latest/api';

export const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));


// This middleware is logging every client request.
// Useful for debugging
/*
app.use((req, res, next) => {
    console.log(`${req.socket.remoteAddress}:${req.socket.remotePort} ${req.method} ${req.path}`);
    return next();
});
*/


/* **********************************************************
 * This code is used for the VMQ Diversity Plugin with a LUA script.
 * This is the currently implemented method for authentication and access control.
 * ********************************************************* */

app.post('/vmq/lua', async (req, res) => {

  const headers = {
    'content-type': 'application/json',
  };
  res.header(headers);

  if (!(req.body.username && req.body.password)) {
    res.status(400).end(); 
    return;
  }

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
    // console.log(JSON.stringify(responseBody));
    res.status(200).json(responseBody);
    return;
  }

  const usernameSegments = req.body.username.split('/');
  if (usernameSegments.length !== 3) {
    res.status(400).end(); 
    return;
  }

  try {

    const accessToken = await getAccessTokenAsync(req.body.username, req.body.password);

    const accessTokenDecoded = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString(),
    );

    let pattern = '';

    let operatorId = '';
    let subscriberId = '';
    let realm = '';
    let userId = '';

    switch (usernameSegments[0]) {
      case 'B2B':
        const profileResponse = await fetch(
          `${DXADMINAPI_URL}/profiles/${usernameSegments[1]}`, 
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        if (!profileResponse.ok) {
          res.status(400).end(); 
          return;
        }
        const profileResponseJson = await profileResponse.json();
        operatorId = profileResponseJson.description;
        const subscriberIdShort = accessTokenDecoded.scope[0].split(':')[1];
        subscriberId = '1' + String(subscriberIdShort).padStart(8, 0);
        pattern = `${operatorId}|${subscriberId}/#`
        break;
      case 'B2C':
        operatorId = accessTokenDecoded.parentRealmId.substring(10);
        subscriberId = accessTokenDecoded['parentSubscriptions']['actility-sup/tpx'][0]['subscriberId'];
        realm = usernameSegments[1];
        userId = accessTokenDecoded.sub;
        pattern = `${operatorId}|${subscriberId}|${realm}|${userId}/#`;
        break;
      default:
        res.status(400).end(); 
        return;
    }

    // console.log(subscriberId);

    responseBody = {
      result: 'ok',
      publish_acl: [ { pattern } ],
      subscribe_acl: [ { pattern } ],
    };
    // console.log(JSON.stringify(responseBody));
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
