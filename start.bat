@echo off

echo.
echo  ==========================================
echo    Peremoga - Start Dev Servers
echo  ==========================================
echo.

set PATH=%PATH%;C:\Ruby34-x64\bin;C:\Ruby34-x64\msys64\ucrt64\bin;C:\Ruby34-x64\msys64\usr\bin;C:\Program Files\PostgreSQL\17\bin
set RI_DEVKIT=C:\Ruby34-x64\msys64
set MSYSTEM=UCRT64

echo  Killing stale processes...
taskkill /F /IM ruby.exe >nul 2>&1
taskkill /F /IM puma.exe >nul 2>&1
del "%~dp0tmp\pids\server.pid" >nul 2>&1
timeout /t 1 /nobreak >nul

ruby --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  Ruby NOT found!
    goto :done
)

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  Node.js NOT found!
    goto :done
)

echo  Starting Rails backend on port 3000...
cd /d "%~dp0"
start "Rails" cmd /k "set PATH=%PATH%;C:\Ruby34-x64\bin;C:\Ruby34-x64\msys64\ucrt64\bin;C:\Ruby34-x64\msys64\usr\bin && set RI_DEVKIT=C:\Ruby34-x64\msys64 && set MSYSTEM=UCRT64 && cd /d C:\Projects\ruby-donate && rails server -b 127.0.0.1 -p 3000"

echo  Starting Angular frontend on port 4200...
cd /d "%~dp0peremoga-frontend"
start "Angular" cmd /k "cd /d C:\Projects\ruby-donate\peremoga-frontend && npx ng serve --open"

echo.
echo  ==========================================
echo    Servers are running!
echo.
echo    Backend:   http://localhost:3000
echo    Frontend:  http://localhost:4200
echo  ==========================================

:done
echo.
pause
