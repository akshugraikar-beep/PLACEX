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
            $newContent = $content
            
            # Fix package names and URLs/emails that should be lowercase
            # We look for "PlaceX" in context
            
            # 1. Fix email domains
            $newContent = $newContent -creplace "@PlaceX\.com", "@placex.com"
            
            # 2. Fix package names (starts with "PlaceX-" at the beginning of a string or after a quote)
            $newContent = $newContent -creplace '"name": "PlaceX-', '"name": "placex-'
            
            # 3. Fix MongoDB URI and other URLs
            $newContent = $newContent -creplace "mongodb://localhost:27017/PlaceX", "mongodb://localhost:27017/placex"
            $newContent = $newContent -creplace "http://localhost:5000/PlaceX", "http://localhost:5000/placex"
            
            # 4. Fix localStorage keys (often lowercase)
            $newContent = $newContent -creplace "PlaceX_", "placex_"
            
            if ($content -ne $newContent) {
                [System.IO.File]::WriteAllText($file.FullName, $newContent)
                Write-Host "Fixed casing in: $($file.FullName)"
            }
        } catch {
            Write-Warning "Failed to process $($file.FullName): $($_.Exception.Message)"
        }
    }
}
