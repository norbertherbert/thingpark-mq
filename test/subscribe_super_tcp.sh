mosquitto_sub \
 -h $BROKER \
 -p 1883 \
 -u $SUPER_USERNAME \
 -P $SUPER_PASSWORD \
 -t +/test/# \
 --id client-sub
 
