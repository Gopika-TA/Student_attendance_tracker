@echo off
title Student Attendance Tracker
echo ========================================================
echo       Student Attendance Tracker - React + Vite
echo ========================================================
echo.

set "PATH=C:\Program Files\nodejs;%PATH%"

where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting React development server with Vite...
    call npm run dev
    goto end
)

if exist "C:\Program Files\nodejs\npm.cmd" (
    echo Starting React development server with Vite...
    call "C:\Program Files\nodejs\npm.cmd" run dev
    goto end
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Python detected! Serving application on port 3000...
    start http://localhost:3000
    python -m http.server 3000
    goto end
)

echo Opening standalone application directly in web browser...
start standalone.html

:end
pause
