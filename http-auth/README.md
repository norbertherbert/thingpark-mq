## Build the container image
docker build -t actility/vmq-http-auth:v1 .

## Create and run the container
docker run -p 3000:3000 -d --name vmq-http-auth actility/vmq-http-auth:v1

## Attach to the container
docker exec -it vmq-http-auth sh
