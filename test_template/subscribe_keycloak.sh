mosquitto_sub \
 -h localhost \
 -p 1883 \
 -u <KEYCLOAK_USER_ID> \
 -P <KEYCLOAK_PASSWD> \
 -t dc76a497-f97b-418e-a621-5ea2ecd0b74e/test \
 --id client-sub
 