@echo off
xcopy L:\Doc\SVN\Work\FlShar\trunk\src\FlShar\app\src\main L:\Doc\Git\AppInvFlShar\app\src\main\ /S
xcopy L:\Doc\SVN\Work\FlShar\trunk\src\FlShar\app\libs L:\Doc\Git\AppInvFlShar\app\libs\ /S
copy L:\Doc\SVN\Work\FlShar\trunk\src\FlShar\app\build.gradle L:\Doc\Git\AppInvFlShar\app
pause
