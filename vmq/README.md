## Build the container image
```
docker build -t actility/vmq:v1 .
```

## Create and run the container
```
docker run -p 8888:8888 -p 1883:1883 -d --name vmq actility/vmq:v1
```

## Attach to the container
```
docker exec -it vmq bash
```