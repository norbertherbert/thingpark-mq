# STAGE 1: BUILD VERNE MQ
FROM erlang AS builder
RUN apt-get update && \
    apt-get install -y git build-essential libsnappy-dev libssl-dev && \
    git clone https://github.com/vernemq/vernemq && \
    cd vernemq && \
    make rel

# STAGE 2: CREATE VERNE MQ IMAGE
FROM debian:buster-slim
RUN apt-get update && \
    apt-get -y install bash procps openssl iproute2 curl jq libsnappy-dev net-tools nano && \
    rm -rf /var/lib/apt/lists/* && \
    addgroup --gid 10000 vernemq && \
    adduser --uid 10000 --system --ingroup vernemq --home /opt/vernemq --disabled-password vernemq

WORKDIR /opt/vernemq

COPY --from=builder /vernemq/_build/default/rel/vernemq /opt/vernemq
COPY ./src/vernemq_template.conf /opt/vernemq/etc/vernemq_template.conf
COPY ./src/auth_http.lua /opt/vernemq/auth_http.lua
COPY ./src/start_vernemq.sh /opt/vernemq/bin/start_vernemq.sh

COPY ./certs/ca.crt /opt/vernemq/certs/ca.crt
COPY ./certs/localhost/server.key /opt/vernemq/certs/server.key
COPY ./certs/localhost/server.crt /opt/vernemq/certs/server.crt

RUN chown -R 10000:10000 /opt/vernemq && \
    chmod +x /opt/vernemq/bin/start_vernemq.sh && \
    echo 'export PATH=$PATH:/opt/vernemq/bin' >> .bashrc && \
    ln -s /opt/vernemq/etc /etc/vernemq && \
    ln -s /opt/vernemq/data /var/lib/vernemq && \
    ln -s /opt/vernemq/log /var/log/vernemq

# Ports
# 1883  MQTT
# 8883  MQTT/SSL
# 800   WS
# 880   WSS
# 44053 VerneMQ Message Distribution
# 4369  EPMD - Erlang Port Mapper Daemon
# 8888  Prometheus Metrics
# 9100 9101 9102 9103 9104 9105 9106 9107 9108 9109  Specific Distributed Erlang Port Range

# VOLUME ["/vernemq/log", "/vernemq/data", "/vernemq/etc"]

EXPOSE 1883 8883 8884 800 880 44053 4369 8888 \
       9100 9101 9102 9103 9104 9105 9106 9107 9108 9109

USER vernemq

HEALTHCHECK CMD /opt/vernemq/bin/vernemq ping | grep -q pong

CMD ["/opt/vernemq/bin/start_vernemq.sh"]
