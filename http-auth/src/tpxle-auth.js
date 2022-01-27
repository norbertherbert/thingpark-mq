import { stringify } from 'querystring';
import fetch from 'node-fetch';
import httpError from 'http-errors';

const DXADMINAPI_GRANT_TYPE = process.env.DXADMINAPI_GRANT_TYPE; // || 'client_credentials';
const DXADMINAPI_URL = process.env.DXADMINAPI_URL; // || 'https://dx-api.thingpark.io/admin/latest/api';

const KEYCLOAK_GRANT_TYPE = process.env.KEYCLOAK_GRANT_TYPE; // || 'password';
const KEYCLOAK_SCOPE = process.env.KEYCLOAK_SCOPE; // || 'openid';
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID; // || 'tpx-le-nit';
const KEYCLOAK_AUTH_URL = process.env.KEYCLOAK_AUTH_URL; // || `https://le-lab.preview.thingpark.com/auth`;


export const getAccessTokenAsync = async (username, password) => {

  let url;

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const usernameSegments = username.split('/');

  switch (usernameSegments[0]) {
    case 'B2B':
      url = `${DXADMINAPI_URL}/oauth/token`;
      options.body = stringify({
        client_id: `${usernameSegments[1]}/${usernameSegments[2]}`,
        client_secret: password,
        grant_type: DXADMINAPI_GRANT_TYPE,
      });
      break;
    case 'B2C':
      url = `${KEYCLOAK_AUTH_URL}/realms/${usernameSegments[1]}/protocol/openid-connect/token`;
      options.body = stringify({
        username: usernameSegments[2],
        password: password,
        grant_type: KEYCLOAK_GRANT_TYPE,
        scope: KEYCLOAK_SCOPE,
        client_id: KEYCLOAK_CLIENT_ID,
      });
      break;
    default:
      console.log(`UL: getAccessTokenAsync: clientId: ${usernameSegments[2]}: Invalid authSrvType`);
      throw httpError(400, 'Invalid authSrvType.');
  }

  let accessToken;

  try {
    console.log(url);
    console.log(JSON.stringify(options, null, 4));

    const dxapiTokenResponse = await fetch(url, options);
    if (!dxapiTokenResponse.ok) {
      console.log(
        `UL: getAccessTokenAsync: username: ${usernameSegments[2]}: HTTP error happened while getting access token: ${dxapiTokenResponse.status}, ${dxapiTokenResponse.statusText}`,
      );
      throw httpError(500, `HTTP Error happened while getting access token`);
    }
    const dxapiTokenResponseParsed = await dxapiTokenResponse.json();
    accessToken = dxapiTokenResponseParsed.access_token;
    if (accessToken) {
      console.log(
        `UL: getAccessTokenAsync: username: ${usernameSegments[2]}: Token received from token endpoint.`,
      );
      console.log(accessToken);
      return accessToken;
    }
    console.log(
      `UL: getAccessTokenAsync: username: ${usernameSegments[2]}: Token response does not include an 'access_token' field.`,
    );
    throw httpError(500, `Token response does not include an 'access_token' field.`);
  } catch (err) {
    if (httpError.isHttpError(err)) {
      throw err;
    } else {
      console.log(
        `UL: getAccessTokenAsync: username: ${usernameSegments[2]}: Error happened while getting access token: ${err.stack}`,
      );
      throw httpError(500, `Error happened while getting access token`);
    }
  }
};
