$ErrorActionPreference = 'Stop'

$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$environmentFile = Join-Path $repositoryRoot '.env'
$applicationJar = Join-Path $PSScriptRoot 'target\sireva-backend-0.1.0-SNAPSHOT.jar'

if (-not (Test-Path -LiteralPath $environmentFile)) {
    throw "Root .env file was not found: $environmentFile"
}

if (-not (Test-Path -LiteralPath $applicationJar)) {
    throw "Backend JAR was not found: $applicationJar"
}

$databaseLine = Get-Content -LiteralPath $environmentFile |
    Where-Object { $_ -match '^\s*DATABASE_URL\s*=' } |
    Select-Object -First 1

if (-not $databaseLine) {
    throw 'DATABASE_URL was not found in the root .env file.'
}

$databaseUrl = $databaseLine -replace '^\s*DATABASE_URL\s*=\s*', ''
$databaseUrl = $databaseUrl.Trim()
if ($databaseUrl.Length -ge 2 -and
    (($databaseUrl.StartsWith('"') -and $databaseUrl.EndsWith('"')) -or
     ($databaseUrl.StartsWith("'") -and $databaseUrl.EndsWith("'")))) {
    $databaseUrl = $databaseUrl.Substring(1, $databaseUrl.Length - 2)
}

$parsedUrl = $null
if (-not [Uri]::TryCreate($databaseUrl, [UriKind]::Absolute, [ref]$parsedUrl) -or
    $parsedUrl.Scheme -notin @('postgres', 'postgresql')) {
    throw 'DATABASE_URL must be a valid postgres:// or postgresql:// URL.'
}

$credentials = $parsedUrl.UserInfo -split ':', 2
if ($credentials.Count -ne 2 -or -not $credentials[0] -or -not $credentials[1]) {
    throw 'DATABASE_URL must contain a database username and password.'
}

$databaseName = [Uri]::UnescapeDataString($parsedUrl.AbsolutePath.TrimStart('/'))
if (-not $databaseName) {
    throw 'DATABASE_URL must include a database name.'
}

$queryParameters = @($parsedUrl.Query.TrimStart('?') -split '&' | Where-Object { $_ })
if (-not ($queryParameters | Where-Object { $_ -match '^currentSchema=' })) {
    $queryParameters += 'currentSchema=sireva'
}
if (-not ($queryParameters | Where-Object { $_ -match '^sslmode=' })) {
    $queryParameters += 'sslmode=require'
}

$env:DB_URL = "jdbc:postgresql://$($parsedUrl.Host):$($parsedUrl.Port)/$databaseName`?$($queryParameters -join '&')"
$env:DB_USERNAME = [Uri]::UnescapeDataString($credentials[0])
$env:DB_PASSWORD = [Uri]::UnescapeDataString($credentials[1])
$env:SPRING_DATASOURCE_URL = $env:DB_URL
$env:SPRING_DATASOURCE_USERNAME = $env:DB_USERNAME
$env:SPRING_DATASOURCE_PASSWORD = $env:DB_PASSWORD

Write-Host "Database host: $($parsedUrl.Host):$($parsedUrl.Port); database: $databaseName"
Write-Host "Supabase pooler username detected: $($env:DB_USERNAME.StartsWith('postgres.'))"
Write-Host 'Starting SIREVA Spring Boot on port 8081. Database credentials are not displayed.'
& java -jar $applicationJar --server.port=8081