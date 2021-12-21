## CA Certificates
openssl genrsa -des3 -out ca.key 2048
openssl req -new -x509 -days 3650 -extensions v3_ca -keyout ca.key -out ca.crt

## Server Certificates
openssl genrsa -out server.key 2048
openssl req -out server.csr -key server.key -new
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 3650
