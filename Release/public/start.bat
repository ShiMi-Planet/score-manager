@echo off
%1(start /min cmd.exe /c %0 :& exit )
tasklist|find /i "SanagerService.exe"
if %errorlevel%==0 (
    taskkill /IM "SanagerService.exe"
    start "" "RunHiddenConsole.exe" "SanagerService.exe"
)
else (
    start "" "RunHiddenConsole.exe" "SanagerService.exe"
)
tasklist|find /i "SanagerPages.exe"
if %errorlevel%==0 (
    taskkill /IM "SanagerPages.exe"
    start "" "RunHiddenConsole.exe" "SanagerPages.exe"
)
else (
    start "" "RunHiddenConsole.exe" "SanagerPages.exe"
)
start Client.exe
exit