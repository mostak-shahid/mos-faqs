@echo off
REM Deploy script for Windows (Batch File)

REM Variables
SET PLUGIN_SLUG=mos-faqs
SET DEST_PATH=dist

echo Building assets...
call npm run build

echo Cleaning previous build...
rmdir /s /q %DEST_PATH% >nul 2>&1
mkdir %DEST_PATH%

echo Preparing exclusion list from .distignore...
SETLOCAL EnableDelayedExpansion
SET "EXCLUDES="

for /f "usebackq delims=" %%i in (".distignore") do (
    REM Skip empty lines and comments
    if not "%%i"=="" (
        if not "%%i:~0,1"=="#" (
            REM If line ends with \ treat as folder, else treat as file/pattern
            if "%%~xi"=="" (
                set "EXCLUDES=!EXCLUDES! /XD %%i"
            ) else (
                set "EXCLUDES=!EXCLUDES! /XF %%i"
            )
        )
    )
)

echo Copying files (this may take a moment)...
robocopy . %DEST_PATH% /E %EXCLUDES%

echo Creating ZIP file...
cd %DEST_PATH%
powershell -Command "Compress-Archive -Path * -DestinationPath ../%PLUGIN_SLUG%.zip -Force"
cd ..

echo Finished! ZIP created: %PLUGIN_SLUG%.zip
pause
