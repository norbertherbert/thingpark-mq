mosquitto_sub \
 -h localhost \
 -p 1883 \
 -u <SUPER_USER_ID> \
 -P <SUPER_PASSWD> \
 -t +/test \
 --id client-sub
 