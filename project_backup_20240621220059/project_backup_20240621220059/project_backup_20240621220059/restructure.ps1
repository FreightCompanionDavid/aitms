# restructure.ps1

# Configuration file
$configFile = "restructure_config.json"
if (Test-Path $configFile) {
    $config = Get-Content $configFile | ConvertFrom-Json
    $newStructure = $config.newStructure
    $specificMoves = $config.specificMoves
} else {
    Write-Host "Configuration file not found. Using default structure." -ForegroundColor Yellow
    # Define the default structure here
    $newStructure = @{
        "src/client" = @("App.js", "index.js")
        "src/server" = @("index.js")
        "src/components" = @("Dashboard.js", "TeamPlanner.js", "FreightForms.js", "APITester.js", "LudicrousMode.js")
        "src/utils" = @()
        "src/styles" = @()
        "config" = @("webpack.config.js", "jest.config.js")
    }
    $specificMoves = @{}
}

# Parse command line arguments
param(
    [switch]$DryRun = $false,
    [switch]$Verbose = $false,
    [switch]$Force = $false
)

# Logging function
function Log-Message {
    param (
        [string]$Message,
        [string]$Color = "White"
    )
    if ($Verbose -or $Color -eq "Red") {
        Write-Host $Message -ForegroundColor $Color
    }
}

# Progress bar function
function Show-Progress {
    param (
        [int]$PercentComplete,
        [string]$Status
    )
    Write-Progress -Activity "Restructuring Project" -Status $Status -PercentComplete $PercentComplete
}

# Validation function
function Validate-Structure {
    param (
        [hashtable]$Structure
    )
    # Check if all required directories are present
    $requiredDirs = @("src/client", "src/server", "src/components", "src/utils", "src/styles", "config")
    foreach ($dir in $requiredDirs) {
        if (-not $Structure.ContainsKey($dir)) {
            throw "Invalid structure: Missing required directory '$dir'"
        }
    }
    # Add more validation checks as needed
    Log-Message "Structure validation passed" "Green"
}

# Backup the project
$backupDir = "project_backup_$(Get-Date -Format 'yyyyMMddHHmmss')"
Copy-Item -Path . -Destination $backupDir -Recurse
Log-Message "Project backed up to $backupDir" "Green"

# Validate the new structure
try {
    Validate-Structure -Structure $newStructure
} catch {
    Log-Message "Validation failed: $_" "Red"
    exit 1
}

# Create directories
$totalOperations = ($newStructure.Keys).Count + ($newStructure.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum + ($specificMoves.Keys).Count
$currentOperation = 0

foreach ($dir in $newStructure.Keys) {
    if (-not $DryRun) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    Log-Message "Created directory: $dir" "Green"
    $currentOperation++
    Show-Progress -PercentComplete (($currentOperation / $totalOperations) * 100) -Status "Creating directories"
}

# Move files
foreach ($dir in $newStructure.Keys) {
    foreach ($file in $newStructure[$dir]) {
        $source = Get-ChildItem -Path . -Recurse -File | Where-Object { $_.Name -eq $file } | Select-Object -First 1
        if ($source) {
            $destination = Join-Path $dir $file
            if (-not $DryRun) {
                Move-Item -Path $source.FullName -Destination $destination -Force
            }
            Log-Message "Moved $($source.Name) to $destination" "Yellow"
        } else {
            Log-Message "File not found: $file" "Red"
        }
        $currentOperation++
        Show-Progress -PercentComplete (($currentOperation / $totalOperations) * 100) -Status "Moving files"
    }
}

# Move specific files
foreach ($file in $specificMoves.Keys) {
    $source = Get-ChildItem -Path . -Recurse -File | Where-Object { $_.Name -eq $file } | Select-Object -First 1
    if ($source) {
        $destination = Join-Path $specificMoves[$file] $file
        if (-not $DryRun) {
            Move-Item -Path $source.FullName -Destination $destination -Force
        }
        Log-Message "Moved $file to $($specificMoves[$file])" "Yellow"
    } else {
        Log-Message "File not found: $file" "Red"
    }
    $currentOperation++
    Show-Progress -PercentComplete (($currentOperation / $totalOperations) * 100) -Status "Moving specific files"
}

# Clean up empty directories
if (-not $DryRun) {
    Get-ChildItem -Path . -Recurse -Directory | Where-Object { (Get-ChildItem -Path $_.FullName -Recurse -File) -eq $null } | Remove-Item -Force -Recurse
}
Log-Message "Removed empty directories" "Cyan"

# Update import statements
$files = Get-ChildItem -Path . -Recurse -Include *.js, *.jsx, *.ts, *.tsx
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $updated = $false

    # Update relative imports
    $newContent = $content -replace '(?<=from\s[''"])\.\.?\/(?!\.\.)', '../../'
    if ($newContent -ne $content) {
        $updated = $true
        $content = $newContent
        Log-Message "Updated relative imports in $($file.FullName)" "Magenta"
    }

    # Update absolute imports
    $newContent = $content -replace '(?<=from\s[''"])src/', '../'
    if ($newContent -ne $content) {
        $updated = $true
        $content = $newContent
        Log-Message "Updated absolute imports in $($file.FullName)" "Magenta"
    }

    # Update specific component imports
    $componentImports = @("Dashboard", "TeamPlanner", "FreightForms", "APITester", "LudicrousMode")
    foreach ($component in $componentImports) {
        $newContent = $content -replace "(?<=from\s['""])./$component", "./components/$component"
        if ($newContent -ne $content) {
            $updated = $true
            $content = $newContent
            Log-Message "Updated $component import in $($file.FullName)" "Magenta"
        }
    }

    if ($updated -and -not $DryRun) {
        Set-Content -Path $file.FullName -Value $content
    }
}

Log-Message "Project restructuring complete!" "Cyan"

# Additional steps for creating essential files
$essentialFiles = @(
    "src/client/App.js",
    "src/client/index.js",
    "src/server/index.js",
    ".env.example",
    "config/webpack.config.js",
    "config/jest.config.js"
)

foreach ($file in $essentialFiles) {
    if (!(Test-Path $file) -and -not $DryRun) {
        New-Item -ItemType File -Force -Path $file
        Log-Message "Created essential file: $file" "Green"
    } else {
        Log-Message "Essential file already exists: $file" "Yellow"
    }
}

Log-Message "Created essential files" "Green"

# Update package.json
$packageJsonPath = "./package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    $packageJson.scripts.start = "node src/server/index.js"
    $packageJson.scripts.dev = "nodemon src/server/index.js"
    if (-not $DryRun) {
        $packageJson | ConvertTo-Json -Depth 100 | Set-Content $packageJsonPath
    }
    Log-Message "Updated package.json scripts" "Green"
} else {
    Log-Message "package.json not found. Please update it manually." "Yellow"
}

# Create .env files
$envFiles = @(".env", ".env.development", ".env.production")
foreach ($file in $envFiles) {
    if (!(Test-Path $file) -and -not $DryRun) {
        if (Test-Path ".env.example") {
            Copy-Item .env.example $file
            Log-Message "Created $file from .env.example" "Green"
        } else {
            New-Item -ItemType File -Force -Path $file
            Log-Message "Created empty $file" "Yellow"
        }
    } else {
        Log-Message "$file already exists" "Yellow"
    }
}

# Git operations
if (-not $DryRun) {
    try {
        git checkout -b project-restructure
        git add .
        git commit -m "Project restructure"
        Log-Message "Created 'project-restructure' branch and committed changes" "Green"
    } catch {
        Log-Message "Error during Git operations: $_" "Red"
    }
}

# Rollback function
function Rollback {
    param(
        [string]$Reason
    )
    Log-Message "Error occurred: $Reason. Rolling back changes..." "Red"
    if (-not $DryRun) {
        Remove-Item -Path * -Recurse -Force
        Copy-Item -Path $backupDir -Destination . -Recurse
        Remove-Item -Path $backupDir -Recurse -Force
        Log-Message "Rollback complete. Project restored from backup." "Green"
    } else {
        Log-Message "Dry run: Rollback simulation complete." "Yellow"
    }
}

# Error handling
try {
    # Main script logic here
    # Note: The main logic is already implemented above, this try-catch block is for any additional operations
} catch {
    if ($Force) {
        Log-Message "Error occurred, but continuing due to Force flag: $_" "Yellow"
    } else {
        Rollback -Reason $_
        exit 1
    }
}

# Reminder for manual steps
Log-Message "Next steps:" "Cyan"
Log-Message "1. Review the new structure and make sure all files are in the correct locations." "Cyan"
Log-Message "2. Update the src/client/App.js and src/client/index.js files to reflect the new structure." "Cyan"
Log-Message "3. Update the webpack configuration to handle the new file structure." "Cyan"
Log-Message "4. Test the application to ensure everything is working correctly after the restructure." "Cyan"
Log-Message "5. Review and merge the 'project-restructure' branch if everything looks good." "Cyan"

# Final check
if ($DryRun) {
    Log-Message "This was a dry run. No actual changes were made." "Yellow"
} else {
    Log-Message "Restructuring complete. Please review the changes and test thoroughly." "Green"
}