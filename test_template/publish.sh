mosquitto_pub \
 -h localhost \
 -p 1883 \
 -u <DXAPI_USERID> \
 -P <DXAPI_PASSWD> \
 -t 2167/test \
 --id client-pub \
 -m 'hello'