#!/usr/bin/env bash

CONFIG_FILE=/opt/vernemq/etc/conf.d/custom.conf
# CONFIG_FILE=./custom.conf

if [[ -f "$CONFIG_FILE" ]]; then
    rm "$CONFIG_FILE"
fi
env | grep VMQ_CONF___ | while IFS= read -r line || [[ -n $line ]]; do
    name=$(echo $line | sed -e 's/VMQ_CONF___//' | sed -e 's/=.*//' | sed -e 's/\(.*\)/\L\1/' | sed -e 's/__/./g')
    value=$(echo $line | sed -e 's/.*=//')
    echo "$name = $value" >> $CONFIG_FILE
done

# start broker
export VMQ_HTTP_AUTH_URL
/opt/vernemq/bin/vernemq console -noshell -noinput
