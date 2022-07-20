#!/bin/sh

sudo service mongod stop

gnome-terminal -- bash -c "cd ./database/mongodb/; sudo ./start.sh; exec bash"
gnome-terminal -- bash -c "cd ./backend/; npm start; exec bash"
gnome-terminal -- bash -c "cd ./frontend/; npm start; exec bash"

