mosquitto_pub \
 -h $BROKER \
 -p 1883 \
 -u $B2B_USERNAME \
 -P $B2B_PASSWORD \
 -t "$B2B_OPERATORID|$B2B_SUBSCRIBERID/test" \
 --id client-pub \
 -m 'helo'
