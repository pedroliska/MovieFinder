Write-Host @"

This script deploys the angular app to http://pedroliska.com/movies

"@

. ./deploy-functions.ps1

Write-Host "Deleting the local dist folder and regenerating it."
ng build --base-href=/movies/

$secretsLocation = Join-Path -Path $PSScriptRoot -ChildPath "secrets.json"
Write-Host "loading $secretsLocation"
$secrets = Get-Content $secretsLocation | Out-String | ConvertFrom-Json

$ftpServer = $secrets.ftpServer
$ftpUsername = $secrets.ftpUsername
$ftpPassword = $secrets.ftpPassword

$credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)

DeleteFilesInFtpUrl $ftpServer $credentials

$distFolder = Join-Path -Path $PSScriptRoot -ChildPath "dist"
SendFolderToFtpUrl $distFolder $ftpServer $credentials

Beep
