#!/bin/bash

node index.js

if [ $? -eq -0 ]
then
  echo "Order complete"
  exit 0
else 
  echo "Failed"
  /bin/bash ./run.sh
fi