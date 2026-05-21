@echo off
echo ===================================
echo    PlaceX FEEDBACK SERVER
echo ===================================
echo.

cd /d "%~dp0server"

echo Starting simplified email server...
echo No MongoDB required - just email functionality!
echo.
echo Server will be available at http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

node server.js

pause
