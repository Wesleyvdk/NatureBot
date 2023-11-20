#!/bin/bash

# Check if the correct number of arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <filename> <foldername>"
    exit 1
fi

FILENAME=$1
FOLDERNAME=$2
TARGET_DIR="commands/$FOLDERNAME"

# Check if template.js exists
if [ ! -f template.js ]; then
    echo "template.js not found!"
    exit 1
fi

# Create the target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Create the new JS file and copy the contents of template.js into it
cp template.js "$TARGET_DIR/$FILENAME"

echo "File $FILENAME created in $TARGET_DIR with content from template.js"
