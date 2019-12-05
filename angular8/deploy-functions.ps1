function DeleteFilesInFtpUrl($ftpUrl, $credentials)
{
    Write-Host "Deleting files in $ftpUrl"

    $listRequest = [Net.WebRequest]::Create($ftpUrl)
    $listRequest.Method = [System.Net.WebRequestMethods+FTP]::ListDirectoryDetails
    $listRequest.Credentials = $credentials

    $lines = New-Object System.Collections.ArrayList

    $listResponse = $listRequest.GetResponse()
    $listStream = $listResponse.GetResponseStream()
    $listReader = New-Object System.IO.StreamReader($listStream)

    while (!$listReader.EndOfStream)
    {
        $line = $listReader.ReadLine()
        $lines.Add($line) | Out-Null
    }

    $listReader.Dispose()
    $listStream.Dispose()
    $listResponse.Dispose()

    foreach ($line in $lines)
    {
        $tokens = $line.Split(" ", 5, [System.StringSplitOptions]::RemoveEmptyEntries)

        $type = $tokens[2]
        $name = $tokens[3]
        $fileDeleteUrl = ($ftpUrl + "/" + $name)

        if ($type -eq "<DIR>")
        {
            Write-Host "Found folder: $name"

            DeleteFilesInFtpUrl ($ftpUrl + "/" + $name) $credentials $fileDeleteUrl

            Write-Host "Deleting folder: $name"

            $ftprequest = [System.Net.FtpWebRequest]::create($fileDeleteUrl)
            $ftprequest.Credentials =  $credentials
            $ftprequest.Method = [System.Net.WebRequestMethods+Ftp]::RemoveDirectory
            $ftprequest.GetResponse() | Out-Null
        }
        else 
        {
            Write-Host "Deleting file: $fileDeleteUrl"

            $ftprequest = [System.Net.FtpWebRequest]::create($fileDeleteUrl)
            $ftprequest.Credentials =  $credentials
            $ftprequest.Method = [System.Net.WebRequestMethods+Ftp]::DeleteFile
            $ftprequest.GetResponse() | Out-Null
        }
    }
}

function SendFilesToFtpUrl($ftpUrl, $credentials) {

    $distFolder = Join-Path -Path $PSScriptRoot -ChildPath "dist"
    Write-Host "Sending files in $distFolder to $ftpUrl"

    $webclient = New-Object System.Net.WebClient 
    $webclient.Credentials = $credentials

    foreach($item in (Get-ChildItem $distFolder "*.*")) { 
        Write-Host "Uploading $item..." 
        $uri = New-Object System.Uri($ftpUrl + "/" + $item.Name) 
        $webclient.UploadFile($uri, $item.FullName)    
    } 
}

function Beep () {
    function b($a,$b){
        [console]::beep($a,$b)
    }
    b 1000 100;
    b 1333 200;
}