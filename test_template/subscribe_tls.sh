mosquitto_sub \
 -h localhost \
 -p 8884 \
 -u <DXAPI_USERID> \
 -P <DXAPI_PASSWD> \
 -t 2167/test \
 --cafile ../vmq/certs/ca.crt \
 --id client-sub
 