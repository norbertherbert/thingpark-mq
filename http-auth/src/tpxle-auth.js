import { stringify } from 'querystring';
import fetch from 'node-fetch';
import httpError from 'http-errors';

const cfg = {
  dev1: { // used for Ecosystem_TPXLE with Ecosystem_DxAdminAPI
    TOKEN_REQUEST_URL: "https://dx-api.thingpark.io/admin/latest/api/oauth/token",
    GRANT_TYPE: "client_credentials",
  },
  'le-lab': { // used for R&D_TPXLE with R&D_Keycloak
    TOKEN_REQUEST_URL: "https://le-lab.preview.thingpark.com/auth",
    GRANT_TYPE: "password",
    SCOPE: "openid",
    CLIENT_ID: "tpx-le-nit",
  },
  rnd: { // # used for R&D_TPXLE with R&D_DxAdminAPI
    TOKEN_REQUEST_URL: "https://dx-api.preview.thingpark.com/admin/latest/api/oauth/token",
    GRANT_TYPE: "client_credentials",
  }
}

export const getAccessTokenAsync = async (clientId, clientSecret, realm) => {
  let url;

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  if (cfg[realm].GRANT_TYPE === 'client_credentials') {
    url = cfg[realm].TOKEN_REQUEST_URL;
    options.body = stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: cfg[realm].GRANT_TYPE,
    });
  } else if (cfg[realm].GRANT_TYPE === 'password') {
    options.body = stringify({
      username: clientId,
      password: clientSecret,
      grant_type: cfg[realm].GRANT_TYPE,
      scope: cfg[realm].SCOPE,
      client_id: cfg[realm].CLIENT_ID,
    });
    url = `${cfg[realm].TOKEN_REQUEST_URL}/realms/${realm}/protocol/openid-connect/token`;
  } else {
    console.log(`UL: getAccessTokenAsync: clientId: ${clientId}: Invalid realm/grant_time`);
    throw httpError(400, 'Invalid realm.');
  }

  let accessToken;

  try {
    console.log(url);
    console.log(JSON.stringify(options, null, 4));

    const dxapiTokenResponse = await fetch(url, options);
    if (!dxapiTokenResponse.ok) {
      console.log(
        `UL: getAccessTokenAsync: clientId: ${clientId}: HTTP error happened while getting access token: ${dxapiTokenResponse.status}, ${dxapiTokenResponse.statusText}`,
      );
      throw httpError(500, `HTTP Error happened while getting access token`);
    }
    const dxapiTokenResponseParsed = await dxapiTokenResponse.json();
    accessToken = dxapiTokenResponseParsed.access_token;
    if (accessToken) {
      console.log(
        `UL: getAccessTokenAsync: clientId: ${clientId}: Token received from token endpoint.`,
      );
      console.log(accessToken);
      return accessToken;
    }
    console.log(
      `UL: getAccessTokenAsync: clientId: ${clientId}: Token response does not include an 'access_token' field.`,
    );
    throw httpError(500, `Token response does not include an 'access_token' field.`);
  } catch (err) {
    if (httpError.isHttpError(err)) {
      throw err;
    } else {
      console.log(
        `UL: getAccessTokenAsync: clientId: ${clientId}: Error happened while getting access token: ${err.stack}`,
      );
      throw httpError(500, `Error happened while getting access token`);
    }
  }
};
