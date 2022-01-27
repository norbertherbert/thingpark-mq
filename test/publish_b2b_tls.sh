mosquitto_pub \
 -h $BROKER \
 -p 8884 \
 -u $B2B_USERNAME \
 -P $B2B_PASSWORD \
 -t $B2B_OPERATORID|$B2B_SUBSCRIBERID/test \
 --cafile ../vmq/certs/ca.crt \
 --id client-pub \
 -m 'hello'
