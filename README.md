## Build all images
```
docker-compose build
```

## Create and start all containers
```
docker-compose up -d
```

## Stop and clean up all containers
```
docker-compose down
```

## Tests
- Make sure you have installed mosquitto_sub and mosquitto_pub client utilities
- Update the template scripts in the test folder with your credentials
- Run a subscribe test script in a terminal
- Run a publish test script in another terminal and check if you received a 'helo' message at the subscriber's side
