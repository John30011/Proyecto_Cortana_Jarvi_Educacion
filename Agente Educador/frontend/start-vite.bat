@echo off
start http://localhost:3001
call node "node_modules/vite/bin/vite.js" --port 3001
