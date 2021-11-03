#!/bin/bash

find . -type f -name '*.avi' -exec sh -c '
    name="${1%.*}"
    echo "$name"
    ffmpeg -i "$1" "${name}.mp4"
    rm "$1"
' find-sh {} \;