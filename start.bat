@echo off
setlocal
title Kinly - Family Digital Wellness Platform

:: Add Node.js to PATH in case it's not in system environment
set "PATH=C:\Program Files\nodejs;%ProgramFiles%\nodejs;%PATH%"

echo ========================================================
echo        Starting Kinly Platform (Node.js + React)
echo ========================================================
echo.
echo Local PC URL:  http://localhost:5050
echo Phone Wi-Fi:   http://192.168.1.55:5050
echo ========================================================
echo.

:: Check if node exists
where node >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Program Files\nodejs\node.exe" (
        set "NODE_EXE=C:\Program Files\nodejs\node.exe"
    ) else (
        echo [ERROR] Node.js executable not found!
        echo Please ensure Node.js is installed at C:\Program Files\nodejs
        pause
        exit /b 1
    )
) else (
    set "NODE_EXE=node"
)

echo [1/1] Launching Kinly All-in-One Server...
cd /d "%~dp0backend"
start "Kinly Server" cmd /k "title Kinly Server && "%NODE_EXE%" server.js"

:: Give it a second to start
timeout /t 2 /nobreak >nul

:: Automatically open in default browser on the PC!
echo Opening browser to http://localhost:5050 ...
start http://localhost:5050

echo.
echo ========================================================
echo Kinly is now live!
echo To open on your phone, connect to Wi-Fi and open:
echo http://192.168.1.55:5050
echo ========================================================
pause
