#!/bin/zsh
# usage: fetch.sh index id
i=$(printf "%02d" $1); id=$2
[ -f full/$i.mp3 ] && exit 0
yt-dlp -q --no-warnings --no-playlist -x --audio-format mp3 --audio-quality 0 --write-info-json -o "full/$i.%(ext)s" "https://www.youtube.com/watch?v=$id" 2>&1 | tail -2
