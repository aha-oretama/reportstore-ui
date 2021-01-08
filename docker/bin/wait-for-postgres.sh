#!/bin/bash

set -e

env="$1"
if [ -n "$DATABASE_URL" ]; then
  url="$DATABASE_URL"
elif [ "$env" = "test" ]; then
  url="postgresql://postgres:testpassword@localhost:5433/testerve_test"
elif [ "$env" = "development" ]; then
  url="postgresql://postgres:devpassword@localhost:5432/testerve_dev"
fi

until psql -q "$url" -c '\l'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
