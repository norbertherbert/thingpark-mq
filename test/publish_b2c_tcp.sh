mosquitto_pub \
 -h $BROKER \
 -p 1883 \
 -u $B2C_USERNAME \
 -P $B2C_PASSWORD \
 -t $B2C_OPERATORID|$B2C_SUBSCRIBERID|$B2C_REALM|$B2C_USERID/test \
 --id client-pub \
 -m 'hello'
