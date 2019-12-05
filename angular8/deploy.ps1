Write-Host @"

This script deploys the angular app to http://pedroliska.com/movies

"@

. ./deploy-functions.ps1


#####################


# Write-Host "Deleting the local dist folder and regenerating it."
# ng build

$secretsLocation = Join-Path -Path $PSScriptRoot -ChildPath "secrets.json"
Write-Host "loading $secretsLocation"
$secrets = Get-Content $secretsLocation | Out-String | ConvertFrom-Json

$ftp = $secrets.ftpServer
$user = $secrets.ftpUsername
$pass = $secrets.ftpPassword

$webclient = New-Object System.Net.WebClient 
$credentials = New-Object System.Net.NetworkCredential($user,$pass)
$webclient.Credentials = $credentials

DeleteFilesInFolder $ftp $credentials

$distFolder = Join-Path -Path $PSScriptRoot -ChildPath "dist"
# Write-Host "distFolder=$distFolder"
# foreach($item in (dir $distFolder "*.*")) { 
# 	Write-Host "Uploading $item..." 
#     $uri = New-Object System.Uri($ftp+$item.Name) 
#     # Write-Host "uri3 = $uri. fullname = $($item.FullName)"
# 	$webclient.UploadFile($uri, $item.FullName)
  
#   #Archive Uploaded Files By Date
# 	$date = (Get-Date).ToString('MM-dd-yyyy')
# 	$path = "C:\foo\bar\uploaded\" + $date
#   #If Today's folder doesn't exist, make one.
# 	If(!(test-path $path))
# 		{
# 		New-Item -ItemType Directory -Force -Path $path
# 		} 
#     #Move file to today's folder
# 	Move-Item $item.FullName -destination $path
# } 
     
#Beep When Finished
function b($a,$b){
    [console]::beep($a,$b)
}
b 1000 100;
b 1333 200;


