# Purpose:      Deploy AI Tutor MVP to Cloudflare Pages via API (fixes field names)
# Inputs:       Repo WildcatPeninsula/ai-tutor-mvp, static files in tutor-mvp/
# Outputs:      GitHub repo, Cloudflare Pages project, DNS CNAME, live URL
# Failure:      Check gh repo/CF API errors; rollback: delete CF project via API
# Risk Tier:    R3
# Dependencies: gh CLI authenticated, cloudflare-credentials.json
# Author:       Kade Mercer | Built: 2026-05-13

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$creds = Get-Content "C:\AI-HUB\config\cloudflare-credentials.json" | ConvertFrom-Json
$token = $creds.api_token
$accountId = $creds.account_id
$zoneId = $creds.zones."wildcatpeninsula.com"

# ---- Step 1: Verify GitHub repo exists ----
Write-Host "=== Step 1: Verify GitHub repo ==="
$repo = gh repo view WildcatPeninsula/ai-tutor-mvp --json url 2>$null
if ($repo) {
    Write-Host "Repo exists: $(echo $repo | ConvertFrom-Json).url"
} else {
    Write-Host "Creating repo..."
    gh repo create WildcatPeninsula/ai-tutor-mvp --public --clone
}

# ---- Step 2: Push files to repo ----
Write-Host "=== Step 2: Push files to GitHub ==="
$repoUrl = gh repo view WildcatPeninsula/ai-tutor-mvp --json url -q '.url'
$remote = gh repo remote list -q 's|s|\n|' 2>$null | Select-String "WildcatPeninsula"
if (-not $remote) {
    Set-Location $root
    gh repo clone WildcatPeninsula/ai-tutor-mvp . --force 2>$null
}
Get-ChildItem $root -File -Include *.html,*.css,*.js,*.md | Copy-Item -Destination .\
git add -A
git status --short
$commitMsg = "AI Tutor MVP: 18 micro-lessons, gamification, parent dashboard, zero deps"
git commit -m $commitMsg 2>$null
git push origin main

# ---- Step 3: Create Cloudflare Pages project ----
Write-Host "=== Step 3: Create Cloudflare Pages project ==="
$projectName = "ai-tutor-mvp"
$body = @{
    "repo" = @{
        "repo_name" = "WildcatPeninsula/ai-tutor-mvp"
        "production_branch" = "main"
    }
    "name" = $projectName
    "env_vars" = @{ "NODE_VERSION" = "20" }
} | ConvertTo-Json -Depth 4

Write-Host "Creating Pages project..."
$response = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects" `
    -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } `
    -Method POST -Body $body

if (-not $response.success) {
    Write-Error "Pages project creation failed: $($response.errors | ConvertTo-Json)"
    exit 1
}
Write-Host "Pages project created: $($response.result.name)"
$subdomain = $response.result.subdomain
Write-Host "Subdomain: $subdomain"

# ---- Step 4: Add DNS CNAME ----
Write-Host "=== Step 4: Add CNAME DNS record ==="
$cnameSubdomain = "tutor"
$recordBody = @{
    "type" = "CNAME"
    "name" = $cnameSubdomain
    "content" = "$subdomain.pages.dev"
    "ttl" = 1
    "proxied" = $true
} | ConvertTo-Json -Depth 4

$dnsResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records" `
    -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } `
    -Method POST -Body $recordBody

if (-not $dnsResponse.success) {
    Write-Error "DNS CNAME failed: $($dnsResponse.errors | ConvertTo-Json)"
    Write-Host "Manual fix: Add CNAME $cnameSubdomain -> $subdomain.pages.dev in Cloudflare Dashboard"
    exit 1
}
Write-Host "CNAME added: $cnameSubdomain.wildcatpeninsula.com -> $subdomain.pages.dev"
$liveUrl = "https://$cnameSubdomain.wildcatpeninsula.com"

# ---- Step 5: Wait for deployment and verify ----
Write-Host "=== Step 5: Wait for deployment and verify ==="
Write-Host "Waiting for Cloudflare to pick up the repo and deploy..."
$deployed = $false
for ($i = 1; $i -le 15; $i++) {
    Start-Sleep -Seconds 10
    $deployments = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/$projectName/deployments" `
        -Headers @{ Authorization = "Bearer $token" }
    $latest = $deployments.result | Sort-Object created_on -Descending | Select-Object -First 1
    if ($latest -and $latest.stage -eq "success") {
        $deployed = $true
        Write-Host "Deployment succeeded after $($i * 10)s"
        break
    }
    $status = if ($latest) { $latest.stage } else { "unknown" }
    Write-Host "  ... attempt $($i): status=$status"
}

# Verify live URL
if ($deployed) {
    Write-Host "=== Verifying live URL ==="
    try {
        $verify = Invoke-WebRequest -Uri $liveUrl -UseBasicParsing -TimeoutSec 15
        if ($verify.StatusCode -eq 200) {
            Write-Host "SUCCESS! Live URL: $liveUrl"
        } else {
            Write-Host "WARNING: URL returned HTTP $($verify.StatusCode). May still be propagating."
            Write-Host "Final URL: $liveUrl"
        }
    } catch {
        Write-Host "WARNING: Could not verify live URL (may need DNS propagation time)."
        Write-Host "Final URL: $liveUrl"
    }
} else {
    Write-Host "WARNING: Deployment status unclear. Check manually."
    Write-Host "Final URL: $liveUrl"
}

Write-Host "=== DONE ==="
