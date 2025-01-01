#!/bin/bash

EMAIL="$1"
PASSWORD="$2"
IMAP_SERVER="$3"
PORT="$4"
FOLDER="$5"

# Set the SSL flag
if [ "$6" = "true" ]; then
    SSL="--ssl"
else
    SSL=""
fi

# Fetch emails from the specified folder
curl -s --url "imaps://$IMAP_SERVER:$PORT/$FOLDER" \
     --user "$EMAIL:$PASSWORD" $SSL \
     -X "SEARCH ALL" | grep -o "^[0-9]*" | while read -r id; do
    curl -s --url "imaps://$IMAP_SERVER:$PORT/$FOLDER;UID=$id" \
         --user "$EMAIL:$PASSWORD" $SSL \
         -X "FETCH BODY[HEADER.FIELDS (FROM SUBJECT DATE)]"
done
