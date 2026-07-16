@echo off
cd /d "c:\Users\arshu\OneDrive\Desktop\CutnStitch"
REM Clean .next directory
for /d %%p in (".next") do rmdir /s /q "%%p" 2>nul
REM Run build
call npm.cmd run build
pause
