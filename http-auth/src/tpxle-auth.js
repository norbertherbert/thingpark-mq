import { stringify } from 'querystring';
import fetch from 'node-fetch';
import httpError from 'http-errors';


const DXAPI_GRANT_TYPE = process.env.DXAPI_GRANT_TYPE || 'client_credentials';
const DXAPI_TOKEN_REQUEST_URL = process.env.DXAPI_TOKEN_REQUEST_URL || 'https://dx-api.thingpark.io/admin/latest/api/oauth/token';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'le-lab';
const KEYCLOAK_GRANT_TYPE = process.env.KEYCLOAK_GRANT_TYPE || 'password';
const KEYCLOAK_SCOPE = process.env.KEYCLOAK_SCOPE || 'openid';
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'tpx-le-nit';
const KEYCLOAK_TOKEN_REQUEST_URL = process.env.KEYCLOAK_TOKEN_REQUEST_URL || `https://le-lab.preview.thingpark.com/auth/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

export const getAccessTokenAsync = async (clientId, clientSecret, authSrvType) => {
  let url;

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  if (authSrvType === 'dx-api') {
    url = DXAPI_TOKEN_REQUEST_URL;
    options.body = stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: DXAPI_GRANT_TYPE,
    });
  } else if (authSrvType === 'keycloak') {
    options.body = stringify({
      username: clientId,
      password: clientSecret,
      grant_type: KEYCLOAK_GRANT_TYPE,
      scope: KEYCLOAK_SCOPE,
      client_id: KEYCLOAK_CLIENT_ID,
    });
    url = KEYCLOAK_TOKEN_REQUEST_URL;
  } else {
    console.log(`UL: getAccessTokenAsync: clientId: ${clientId}: Invalid authSrvType`);
    throw httpError(400, 'Invalid authSrvType.');
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
