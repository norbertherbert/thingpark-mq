ENV_FILE="$1"
CMD="$2"

set -o allexport
. $ENV_FILE
set +o allexport

$CMD
