<#
Renames ORF/RW2 files to yyyy-mm-dd-hhmmss based on photo timestamp.

Usage:
    .\datify.ps1
    .\datify.ps1 -r

Notes:
    - Uses EXIF DateTaken/DateTimeOriginal; skips files without it.
    - Leaves files already named yyyy-mm-dd-hhmmss or with -001 suffixes.
    - Adds -001, -002, ... for duplicates in the same folder.
    - Run in the target directory; use -r to include subfolders.
#>

param(
    [switch]$r
)

$ErrorActionPreference = 'Stop'

$rawExtensions = @('.orf', '.rw2')
$pattern = '^[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6}(-[0-9]{3})?$'

function Normalize-ExifDate([string]$value) {
    if ([string]::IsNullOrWhiteSpace($value)) {
        return $null
    }
    $trimmed = $value.Trim()

    if ($trimmed -match '^\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2}$') {
        $normalized = $trimmed -replace ':', '-', 2
        return [datetime]::ParseExact($normalized, 'yyyy-MM-dd HH:mm:ss', $null)
    }

    $parsed = $null
    if ([datetime]::TryParse($trimmed, [ref]$parsed)) {
        return $parsed
    }

    return $null
}

function Get-PhotoTakenDate([string]$path) {
    try {
        $shell = New-Object -ComObject Shell.Application
        $folder = $shell.Namespace((Split-Path -Path $path -Parent))
        $item = $folder.ParseName((Split-Path -Path $path -Leaf))
        if ($item) {
            $dateTaken = $item.ExtendedProperty('System.Photo.DateTaken')
            $normalized = Normalize-ExifDate $dateTaken
            if ($normalized) {
                return $normalized
            }
        }
    } catch {
        # Ignore COM failures and fall back
    }

    try {
        Add-Type -AssemblyName System.Drawing | Out-Null
        $img = [System.Drawing.Image]::FromFile($path)
        $datePropId = 0x9003
        $prop = $img.PropertyItems | Where-Object { $_.Id -eq $datePropId } | Select-Object -First 1
        if ($prop) {
            $raw = [System.Text.Encoding]::ASCII.GetString($prop.Value)
            $img.Dispose()
            return Normalize-ExifDate $raw
        }
        $img.Dispose()
    } catch {
        # Ignore failures, return null
    }

    return $null
}

function Get-TargetPath([string]$directory, [string]$baseName, [string]$extension) {
    $candidate = Join-Path $directory ($baseName + $extension)
    if (-not (Test-Path -LiteralPath $candidate)) {
        return $candidate
    }

    $i = 1
    while ($true) {
        $suffix = ('-{0:000}' -f $i)
        $candidate = Join-Path $directory ($baseName + $suffix + $extension)
        if (-not (Test-Path -LiteralPath $candidate)) {
            return $candidate
        }
        $i++
    }
}

$items = if ($r) {
    Get-ChildItem -File -Recurse
} else {
    Get-ChildItem -File
}

foreach ($item in $items) {
    if ($rawExtensions -notcontains $item.Extension.ToLowerInvariant()) {
        continue
    }

    $nameOnly = [System.IO.Path]::GetFileNameWithoutExtension($item.Name)
    if ($nameOnly -match $pattern) {
        continue
    }

    $taken = Get-PhotoTakenDate $item.FullName
    if (-not $taken) {
        continue
    }

    $baseName = $taken.ToString('yyyy-MM-dd-HHmmss')
    $targetPath = Get-TargetPath $item.DirectoryName $baseName $item.Extension.ToLowerInvariant()

    if ($item.FullName -ne $targetPath) {
        Rename-Item -LiteralPath $item.FullName -NewName (Split-Path -Path $targetPath -Leaf)
    }
}
