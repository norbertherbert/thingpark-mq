#!/usr/bin/env bash
export VMQ_HTTP_AUTH_URL
/vernemq/bin/vernemq start
tail -f /dev/null
