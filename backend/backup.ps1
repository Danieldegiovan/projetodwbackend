$reply = ""
while ($reply -ne "5") {
    Write-Host "O que deseja fazer?"
    Write-Host "[1]: Fazer um backup"
    Write-Host "[2]: Listar os backups"
    Write-Host "[3]: Listar log"
    Write-Host "[4]: Limpar log"
    Write-Host "[5]: Sair"
    
    $reply = Read-Host ":"
    
    if ($reply -eq "1") {
        $name = Read-Host "Qual o nome do usuário onde será feito o backup?"
        $ip = Read-Host "Qual o IP da máquina de destino?"
        
        $timestamp = Get-Date -Format "dd-MMM-yy-HH-mm"
        $backupFolder = "C:\backups\$name-$ip-$timestamp"
        New-Item -ItemType Directory -Path $backupFolder | Out-Null

        $path = Read-Host "Deseja fazer backup de um (1) arquivo ou (2) diretório?"
        
        if ($path -eq "1") {
            $file = Read-Host "Digite o nome do arquivo"
            Copy-Item $file -Destination $backupFolder
        } else {
            $dir = Read-Host "Digite o nome do diretório"
            Copy-Item -Recurse $dir -Destination $backupFolder
        }

        Compress-Archive -Path $backupFolder -DestinationPath "$backupFolder.zip"
        Remove-Item -Recurse -Force $backupFolder

        Add-Content -Path "logbackup.txt" -Value "Backup realizado em $(Get-Date) | Origem: $name@$ip"
        Write-Host "Backup concluído!"
    
    } elseif ($reply -eq "2") {
        Get-ChildItem "C:\backups"
    } elseif ($reply -eq "3") {
        Get-Content "logbackup.txt"
    } elseif ($reply -eq "4") {
        Clear-Content "logbackup.txt"
    }
}
