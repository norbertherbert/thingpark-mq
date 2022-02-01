## Prepare the environment:
- Install the moquitto-clients package  
  On Debian-based distributions you can execute the following command
  ```
  sudo apt-get install mosquitto-clients
  ```
- Create a .env file based on the `template.env` file
  ```
  cp template.env .env
  nano .env
  ```
  Complement the `.env` file with the relevant variable values
- Activate the environment by executing the following linux commands:
  ```
  set -a
  source .env
  set +a
  ```
## Execute tests:
- Run a `subscribe_*` script in a terminal window
  ```
  ./subscribe_b2b_tcp.sh
  ```
- Run a `publish_*` script in another terminal window
  ```
  ./publish_b2b_tcp.sh
  ```
