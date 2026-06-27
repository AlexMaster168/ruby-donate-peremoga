@echo off

echo.
echo  ==========================================
echo    Peremoga - Setup
echo  ==========================================
echo.

set PATH=%PATH%;C:\Ruby34-x64\bin;C:\Ruby34-x64\msys64\ucrt64\bin;C:\Ruby34-x64\msys64\usr\bin

echo  [1/3] PostgreSQL...
"C:\Program Files\PostgreSQL\17\bin\pg_isready.exe" -h 127.0.0.1 >nul 2>&1
if %errorlevel% neq 0 (
    echo  PostgreSQL is NOT running!
    echo  Start it via pgAdmin or Services
    goto :done
)
echo  PostgreSQL OK.

echo.
echo  [2/3] Ruby...
ruby --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  Ruby not found!
    goto :done
)
ruby --version

echo.
echo  [3/3] npm install...
cd /d "%~dp0peremoga-frontend"
call npm install
if %errorlevel% neq 0 (
    echo  npm install FAILED
    goto :done
)

echo.
echo  ==========================================
echo    Setup done! Run start.bat to launch
echo  ==========================================

:done
echo.
pause
