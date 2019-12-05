function DeleteFilesInFolder($url, $credentials)
{
    $listRequest = [Net.WebRequest]::Create($url)
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
        $fileUrl = ($url + "/" + $name)

        if ($type -eq "<DIR>")
        {
            Write-Host "Found folder: $name"

            DeleteFtpFolder $fileUrl $credentials

            Write-Host "Deleting folder: $name"
            $deleteRequest = [Net.WebRequest]::Create($fileUrl)
            $deleteRequest.Credentials = $credentials
            $deleteRequest.Method = [System.Net.WebRequestMethods+FTP]::RemoveDirectory
            $deleteRequest.GetResponse() | Out-Null
        }
        else 
        {
            $fileUrl = ($url + "/movies/" + $name)
            Write-Host "Deleting file: $name"
            Write-Host "Deleting url: $fileUrl"

            # $deleteRequest = [Net.WebRequest]::Create($fileUrl)
            # $deleteRequest.Credentials = $credentials
            # $deleteRequest.Method = [System.Net.WebRequestMethods+FTP]::DeleteFile
            # $deleteRequest.GetResponse() | Out-Null

            $ftprequest = [System.Net.FtpWebRequest]::create($fileUrl)
            $ftprequest.Credentials =  $credentials
            
            try {
            $ftprequest.Method = [System.Net.WebRequestMethods+Ftp]::DeleteFile
            $ftprequest.GetResponse() | Out-Null
            }
            catch
            {
                 $ex = $_.Exception;
            }





        }
    }
}