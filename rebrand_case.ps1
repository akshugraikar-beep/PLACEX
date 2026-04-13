$rootDir = "c:\Users\AKSHAY\Downloads\Placify-Smarter_Placements-Sharper_Talent-main\Placify-Smarter_Placements-Sharper_Talent-main"
$excludeDirs = @("node_modules", ".git", "dist", "build", ".next", ".vercel", "__pycache__")
$excludeExtensions = @(".png", ".jpg", ".jpeg", ".gif", ".ico", ".pdf", ".zip", ".exe", ".dll", ".pyc")

Get-ChildItem -Path $rootDir -Recurse -File | ForEach-Object {
    $file = $_
    $skip = $false
    
    foreach ($dir in $excludeDirs) {
        if ($file.FullName -like "*\$dir\*") {
            $skip = $true
            break
        }
    }
    
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
            # Use -creplace for case-sensitive replacement
            # Also need to handle "PlaceX" back to "placex" where appropriate if it was incorrectly capitalized
            $newContent = $content -creplace "Placify", "PlaceX" -creplace "placify", "placex" -creplace "PLACIFY", "PLACEX"
            
            if ($content -ne $newContent) {
                [System.IO.File]::WriteAllText($file.FullName, $newContent)
                Write-Host "Updated: $($file.FullName)"
            }
        } catch {
            Write-Warning "Failed to process $($file.FullName): $($_.Exception.Message)"
        }
    }
}
