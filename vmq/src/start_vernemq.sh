#!/usr/bin/env bash

CONF_PATH=/opt/vernemq/etc
# CONF_PATH=./
CONF_TEMPLATE_FILE=vernemq_template.conf
CONF_FILE=vernemq.conf

# Utility functions
sedEscape() {
    echo $1 | sed -r 's/([\$\.\*\/\[\\^])/\\\1/g' | sed 's/[]]/\[]]/g'
}
sedUpdate() {
    if env | grep -q "${1}"
    then
        VALUE=${!1}
    else
        VALUE=${2}
    fi
    sed -i "s/___${1}___/$(sedEscape $VALUE)/" "${CONF_PATH}/${CONF_FILE}"
    echo "s/___${1}___/$(sedEscape $VALUE)/"
}

# Initiate a config file from template
cp "${CONF_PATH}/${CONF_TEMPLATE_FILE}" "${CONF_PATH}/${CONF_FILE}" 

# Update the config files with the actual variable values

# seedUpdate <variable name> <default value>
sedUpdate ALLOW_ANONYMOUS                            off
sedUpdate LISTENER__TCP__DEFAULT                     127.0.0.1:1883
sedUpdate LISTENER__SSL__DEFAULT                     127.0.0.1:8883
sedUpdate LISTENER__SSL__SELF_SIGNED_CA              127.0.0.1:8884
sedUpdate LISTENER__WS__DEFAULT                      127.0.0.1:800
sedUpdate LISTENER__WSS__DEFAULT                     127.0.0.1:880
sedUpdate LISTENER__VMQ__CLUSTERING                  0.0.0.0:44053
sedUpdate LISTENER__HTTP__DEFAULT                    127.0.0.1:8888
sedUpdate LISTENER__SSL__CAFILE                      /opt/vernemq/certs/ca.crt
sedUpdate LISTENER__WSS__CAFILE                      /opt/vernemq/certs/ca.crt
sedUpdate LISTENER__SSL__SELF_SIGNED_CA__CAFILE      /opt/vernemq/certs/ca.crt
sedUpdate LISTENER__SSL__CERTFILE                    /opt/vernemq/certs/localhost/server.crt
sedUpdate LISTENER__WSS__CERTFILE                    /opt/vernemq/certs/localhost/server.crt
sedUpdate LISTENER__SSL__SELF_SIGNED_CA__CERTFILE    /opt/vernemq/certs/localhost/server.crt
sedUpdate LISTENER__SSL__KEYFILE                     /opt/vernemq/certs/localhost/server.key
sedUpdate LISTENER__WSS__KEYFILE                     /opt/vernemq/certs/localhost/server.key
sedUpdate LISTENER__SSL__SELF_SIGNED_CA__KEYFILE     /opt/vernemq/certs/localhost/server.key
# sedUpdate PLUGINS__VMQ_PASSWD                        off
# sedUpdate PLUGINS__VMQ_ACL                           off
sedUpdate PLUGINS__VMQ_DIVERSITY                     off
sedUpdate PLUGINS__VMQ_WEBHOOKS                      off
sedUpdate VMQ_DIVERSITY__HTTP_AUTH__FILE             /opt/vernemq/auth_http.lua
sedUpdate VMQ_WEBHOOKS__AUTH_ON_REGISTER__HOOK       auth_on_register
sedUpdate VMQ_WEBHOOKS__AUTH_ON_SUBSCRIBE__HOOK      auth_on_subscribe
sedUpdate VMQ_WEBHOOKS__AUTH_ON_PUBLISH__HOOK        auth_on_publish
sedUpdate VMQ_WEBHOOKS__AUTH_ON_REGISTER__ENDPOINT   http://http-auth:3000/vmq/auth
sedUpdate VMQ_WEBHOOKS__AUTH_ON_SUBSCRIBE__ENDPOINT  http://http-auth:3000/vmq/sub
sedUpdate VMQ_WEBHOOKS__AUTH_ON_PUBLISH__ENDPOINT    http://http-auth:3000/vmq/pub

# start broker
export CUSTOM_VMQ_HTTP_AUTH_URL
/opt/vernemq/bin/vernemq console -noshell -noinput
