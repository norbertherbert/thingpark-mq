Before running the test scripts prepare the environment:
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
- Run the server
  ```
  npm start
  ```
