$rootDir = "c:\Users\AKSHAY\Downloads\PlaceX-Smarter_Placements-Sharper_Talent-main\PlaceX-Smarter_Placements-Sharper_Talent-main"
$excludeDirs = @("node_modules", ".git", "dist", "build", ".next", ".vercel", "__pycache__")
$excludeExtensions = @(".png", ".jpg", ".jpeg", ".gif", ".ico", ".pdf", ".zip", ".exe", ".dll", ".pyc")

Get-ChildItem -Path $rootDir -Recurse -File | ForEach-Object {
    $file = $_
    $skip = $false
    
    # Check if file is in excluded directory
    foreach ($dir in $excludeDirs) {
        if ($file.FullName -like "*\$dir\*") {
            $skip = $true
            break
        }
    }
    
    # Check if file has excluded extension
    if (!$skip) {
        foreach ($ext in $excludeExtensions) {
            if ($file.Extension -eq $ext) {
                $skip = $true
                break
            }
        }
    }
    
    if (!$skip) {
        try {
            $content = [System.IO.File]::ReadAllText($file.FullName)
            $newContent = $content -replace "PlaceX", "PlaceX" -replace "PlaceX", "placex" -replace "PlaceX", "PLACEX"
            
            if ($content -ne $newContent) {
                [System.IO.File]::WriteAllText($file.FullName, $newContent)
                Write-Host "Updated: $($file.FullName)"
            }
        } catch {
            Write-Warning "Failed to process $($file.FullName): $($_.Exception.Message)"
        }
    }
}
