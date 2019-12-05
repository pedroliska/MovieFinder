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
        $fileUrl = ($ftpUrl + "/" + $name)

        if ($type -eq "<DIR>")
        {
            Write-Host "Found folder: $fileUrl"

            DeleteFilesInFtpUrl $fileUrl $credentials $fileUrl

            Write-Host "Deleting folder: $fileUrl"

            $ftprequest = [System.Net.FtpWebRequest]::create($fileUrl)
            $ftprequest.Credentials =  $credentials
            $ftprequest.Method = [System.Net.WebRequestMethods+Ftp]::RemoveDirectory
            $ftprequest.GetResponse() | Out-Null
        }
        else 
        {
            Write-Host "Deleting file: $fileUrl"

            $ftprequest = [System.Net.FtpWebRequest]::create($fileUrl)
            $ftprequest.Credentials =  $credentials
            $ftprequest.Method = [System.Net.WebRequestMethods+Ftp]::DeleteFile
            $ftprequest.GetResponse() | Out-Null
        }
    }
}

function CreateFtpFolder ($subFtpUrl, $credentials) {
    $ftprequest = [System.Net.FtpWebRequest]::create($subFtpUrl)
    $ftprequest.Credentials =  $credentials
    $ftprequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
    $ftprequest.GetResponse() | Out-Null
}

function SendFolderToFtpUrl($folderTosend, $ftpUrl, $credentials) {

    Write-Host "Sending $folderTosend to $ftpUrl"

    $webclient = New-Object System.Net.WebClient 
    $webclient.Credentials = $credentials

    foreach($item in (Get-ChildItem $folderTosend "*.*")) { 
        
        if ($item.PSIsContainer) {
            Write-Host "Found subfolder: $item"
            $subFolder = Join-Path -Path $folderTosend -ChildPath $item
            $subFtpUrl = $ftpUrl + "/$item"

            CreateFtpFolder $subFtpUrl $credentials
            SendFolderToFtpUrl $subFolder  $subFtpUrl  $credentials
        } else {
            Write-Host "Uploading $($item.FullName)" 
            $uri = New-Object System.Uri($ftpUrl + "/" + $item.Name) 
            $webclient.UploadFile($uri, $item.FullName)    
        }
    } 
}

function Beep () {
    function b($a,$b){
        [console]::beep($a,$b)
    }
    b 1000 100;
    b 1333 200;
}