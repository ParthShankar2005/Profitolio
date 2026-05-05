@echo off
setlocal

cd /d "%~dp0"

if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed.
    exit /b 1
  )
)

echo Starting development server...
call npm run dev

endlocal
