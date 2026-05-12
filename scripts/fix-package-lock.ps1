# For some reason npm install does not install these 2 packages when you do it on windows.
# This causes a package and package-lock misalignment when you do ci on docker linux.
# powershell -ExecutionPolicy Bypass -File scripts/fix-package-lock.ps1

$packages = @(
    "Service/AuthService",
    "Service/ListingService",
    "App/Admin",
    "App/seller/backend",
    "App/seller/frontend",
    "App/shopper/backend",
    "App/shopper/frontend"
)

foreach ($dir in $packages) {
    Write-Host "Installing @emnapi deps in $dir"

    Push-Location $dir

    npm install --save-dev `
        @emnapi/core@1.10.0 `
        @emnapi/runtime@1.10.0

    Pop-Location
}

Write-Host "Done."