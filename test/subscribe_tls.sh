mosquitto_sub \
 -h localhost \
 -p 8883 \
 -u community-api/norbert.herbert+cmty@actility.com \
 -P n0Rabab@1234 \
 -t dev1/2167/nsnit/ttn \
 --cafile ../vmq/certs/ca.crt \
 --id client-one
 