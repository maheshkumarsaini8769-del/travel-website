param(
    [string]$BaseUrl = "http://localhost:3001",
    [string]$Password = "sunsky@2026"
)

$ErrorActionPreference = "Continue"
$results = @()

function Log {
    param([string]$msg)
    $ts = Get-Date -Format "HH:mm:ss"
    Write-Host "[$ts] $msg"
}

function Login {
    $body = '{"username":"admin","password":"' + $Password + '"}'
    try {
        $script:session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
        $res = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" -Method POST -Body $body -ContentType "application/json" -WebSession $script:session -UseBasicParsing -TimeoutSec 30
        Log "Login OK"
        return $true
    } catch {
        Log "Login FAILED: $($_.Exception.Message)"
        return $false
    }
}

function ApiGet {
    param([string]$path, [switch]$admin)
    $url = "$BaseUrl$path"
    $args = @{ UseBasicParsing = $true; TimeoutSec = 30; Uri = $url }
    if ($admin -and $script:session) { $args['WebSession'] = $script:session }
    try {
        return Invoke-WebRequest @args
    } catch {
        return $null
    }
}

function ApiPost {
    param([string]$path, [string]$json, [switch]$admin)
    $url = "$BaseUrl$path"
    $args = @{ UseBasicParsing = $true; TimeoutSec = 30; Uri = $url; Method = 'POST'; Body = $json; ContentType = 'application/json' }
    if ($admin -and $script:session) { $args['WebSession'] = $script:session }
    try {
        return Invoke-WebRequest @args
    } catch {
        return $null
    }
}

function ApiPut {
    param([string]$path, [string]$json, [switch]$admin)
    $url = "$BaseUrl$path"
    $args = @{ UseBasicParsing = $true; TimeoutSec = 30; Uri = $url; Method = 'PUT'; Body = $json; ContentType = 'application/json' }
    if ($admin -and $script:session) { $args['WebSession'] = $script:session }
    try {
        return Invoke-WebRequest @args
    } catch {
        return $null
    }
}

function ApiDelete {
    param([string]$path, [switch]$admin)
    $url = "$BaseUrl$path"
    $args = @{ UseBasicParsing = $true; TimeoutSec = 30; Uri = $url; Method = 'DELETE' }
    if ($admin -and $script:session) { $args['WebSession'] = $script:session }
    try {
        return Invoke-WebRequest @args
    } catch {
        return $null
    }
}

function Test-Result {
    param([string]$module, [string]$test, [string]$result, [string]$detail = "")
    $script:results += [PSCustomObject]@{
        Module = $module
        Test = $test
        Result = $result
        Detail = $detail
    }
    $icon = if ($result -eq "PASS") { "✓" } else { "✗" }
    Log "$icon [$module] $test - $result $detail"
}

# ---- MAIN ----
Log "Starting admin panel functional tests"
Log "Base URL: $BaseUrl"

# Check server
try {
    $r = Invoke-WebRequest -Uri "$BaseUrl" -UseBasicParsing -TimeoutSec 10
    Log "Server running (status $($r.StatusCode))"
} catch {
    Log "Server not responding! Exiting."
    exit 1
}

# Login
if (-not (Login)) {
    Log "Cannot login. Exiting."
    exit 1
}

Start-Sleep -Seconds 2

# ========================================
# MODULE 1: PACKAGES
# ========================================
Log "`n========== MODULE: PACKAGES =========="

# 1a. List existing packages
$r = ApiGet "/api/packages"
if ($r) {
    $pkgs = $r.Content | ConvertFrom-Json
    $origCount = $pkgs.Count
    Test-Result "Packages" "LIST" "PASS" "- $origCount packages found"
} else {
    $origCount = 0
    Test-Result "Packages" "LIST" "FAIL" "- API not responding"
}

Start-Sleep -Seconds 2

# 1b. ADD a test package
$testPkg = @{
    id = "test-admin-delete-me"
    name = "TEST PACKAGE - Admin Test"
    slug = "test-admin-delete-me"
    description = "This is a test package created during admin testing"
    duration = "3 Days"
    durationNights = 2
    pricePerPerson = 9999
    originalPrice = 12999
    twoWayPrice = 19998
    region = "Test"
    category = "test"
    featured = $false
    rating = 0
    reviewCount = 0
    highlights = @("Test highlight")
    includes = @("Test include")
    excludes = @("Test exclude")
    itinerary = @(@{day=1; title="Day 1"; description="Test"})
    images = @()
    gallery = @()
    departureCity = "Test City"
    maxGroupSize = 20
    minAge = 5
    physicalRating = "Easy"
    status = "active"
} | ConvertTo-Json -Depth 5

$r = ApiPost "/api/packages" $testPkg -admin
if ($r -and $r.StatusCode -eq 200) {
    Test-Result "Packages" "ADD" "PASS" "- Created test package"
} else {
    $code = if ($r) { $r.StatusCode } else { "no response" }
    Test-Result "Packages" "ADD" "FAIL" "- Status: $code"
}

Start-Sleep -Seconds 2

# 1c. VERIFY the new package exists
$r = ApiGet "/api/packages/test-admin-delete-me"
if ($r) {
    $pkg = $r.Content | ConvertFrom-Json
    if ($pkg.name -eq "TEST PACKAGE - Admin Test") {
        Test-Result "Packages" "VERIFY ADD" "PASS" "- Found with correct name"
    } else {
        Test-Result "Packages" "VERIFY ADD" "FAIL" "- Wrong data: $($pkg.name)"
    }
} else {
    Test-Result "Packages" "VERIFY ADD" "FAIL" "- Package not found"
}

Start-Sleep -Seconds 2

# 1d. EDIT the test package
$editPkg = @{
    id = "test-admin-delete-me"
    name = "TEST PACKAGE - EDITED"
    slug = "test-admin-delete-me"
    description = "This package has been EDITED during testing"
    duration = "5 Days"
    durationNights = 4
    pricePerPerson = 15999
    originalPrice = 19999
    twoWayPrice = 31998
    region = "Test Region"
    category = "test"
    featured = $true
    rating = 0
    reviewCount = 0
    highlights = @("Edited highlight 1", "Edited highlight 2")
    includes = @("Edited include")
    excludes = @("Edited exclude")
    itinerary = @(@{day=1; title="Day 1"; description="Edited day 1"})
    images = @()
    gallery = @()
    departureCity = "Edited City"
    maxGroupSize = 30
    minAge = 3
    physicalRating = "Moderate"
    status = "active"
} | ConvertTo-Json -Depth 5

$r = ApiPut "/api/packages/test-admin-delete-me" $editPkg -admin
if ($r -and $r.StatusCode -eq 200) {
    Test-Result "Packages" "EDIT" "PASS" "- Updated test package"
} else {
    $code = if ($r) { $r.StatusCode } else { "no response" }
    Test-Result "Packages" "EDIT" "FAIL" "- Status: $code"
}

Start-Sleep -Seconds 2

# 1e. VERIFY the edit persisted
$r = ApiGet "/api/packages/test-admin-delete-me"
if ($r) {
    $pkg = $r.Content | ConvertFrom-Json
    if ($pkg.name -eq "TEST PACKAGE - EDITED" -and $pkg.pricePerPerson -eq 15999) {
        Test-Result "Packages" "VERIFY EDIT" "PASS" "- Name and price updated"
    } else {
        Test-Result "Packages" "VERIFY EDIT" "FAIL" "- Data mismatch: name=$($pkg.name) price=$($pkg.pricePerPerson)"
    }
} else {
    Test-Result "Packages" "VERIFY EDIT" "FAIL" "- Package not found after edit"
}

Start-Sleep -Seconds 2

# 1f. DELETE the test package
$r = ApiDelete "/api/packages/test-admin-delete-me" -admin
if ($r -and $r.StatusCode -eq 200) {
    Test-Result "Packages" "DELETE" "PASS" "- Deleted test package"
} else {
    $code = if ($r) { $r.StatusCode } else { "no response" }
    Test-Result "Packages" "DELETE" "FAIL" "- Status: $code"
}

Start-Sleep -Seconds 2

# 1g. VERIFY deletion
$r = ApiGet "/api/packages/test-admin-delete-me"
if ($null -eq $r) {
    Test-Result "Packages" "VERIFY DELETE" "PASS" "- Package no longer exists"
} else {
    Test-Result "Packages" "VERIFY DELETE" "FAIL" "- Package still exists!"
}

Start-Sleep -Seconds 2

# 1h. VERIFY original count restored
$r = ApiGet "/api/packages"
if ($r) {
    $pkgs = $r.Content | ConvertFrom-Json
    if ($pkgs.Count -eq $origCount) {
        Test-Result "Packages" "VERIFY COUNT RESTORED" "PASS" "- Back to $origCount"
    } else {
        Test-Result "Packages" "VERIFY COUNT RESTORED" "FAIL" "- Expected $origCount got $($pkgs.Count)"
    }
}

Start-Sleep -Seconds 3

# ========================================
# MODULE 2: DESTINATIONS
# ========================================
Log "`n========== MODULE: DESTINATIONS =========="

$r = ApiGet "/api/destinations" -admin
if ($r) {
    $dests = $r.Content | ConvertFrom-Json
    $origDests = $dests.Count
    Test-Result "Destinations" "LIST" "PASS" "- $origDests destinations"
} else {
    $origDests = 0
    Test-Result "Destinations" "LIST" "FAIL" "- API not responding"
}

Start-Sleep -Seconds 2

# ADD test destination
$testDest = @{
    id = "test-dest-delete-me"
    name = "TEST DESTINATION"
    slug = "test-dest-delete-me"
    tagline = "Test Tagline"
    description = "Test destination for admin testing"
    shortDescription = "Short test description"
    category = "test"
    state = "Test State"
    country = "Test Country"
    region = "test"
    image = ""
    gallery = @()
    highlights = @("Test highlight")
    bestTimeToVisit = "Year-round"
    howToReach = "Test transport"
    localLanguage = "Test"
    currency = "Test"
    averageRating = 0
    reviewCount = 0
    featured = $false
    status = "active"
} | ConvertTo-Json -Depth 5

$r = ApiPost "/api/destinations" $testDest -admin
if ($r -and $r.StatusCode -eq 200) {
    Test-Result "Destinations" "ADD" "PASS" "- Created test destination"
} else {
    $code = if ($r) { $r.StatusCode } else { "no response" }
    Test-Result "Destinations" "ADD" "FAIL" "- Status: $code"
}

Start-Sleep -Seconds 2

# Verify
$r = ApiGet "/api/destinations/test-dest-delete-me"
if ($r) {
    $d = $r.Content | ConvertFrom-Json
    Test-Result "Destinations" "VERIFY ADD" "PASS" "- Found: $($d.name)"
} else {
    Test-Result "Destinations" "VERIFY ADD" "FAIL" "- Not found"
}

Start-Sleep -Seconds 2

# EDIT
$editDest = @{
    id = "test-dest-delete-me"
    name = "TEST DESTINATION - EDITED"
    slug = "test-dest-delete-me"
    tagline = "Edited Tagline"
    description = "Edited description"
    shortDescription = "Edited short description"
    category = "test"
    state = "Edited State"
    country = "Edited Country"
    region = "test"
    image = ""
    gallery = @()
    highlights = @("Edited highlight 1", "Edited highlight 2")
    bestTimeToVisit = "Winter"
    howToReach = "Edited transport"
    localLanguage = "Edited"
    currency = "Edited"
    averageRating = 4.5
    reviewCount = 10
    featured = $true
    status = "active"
} | ConvertTo-Json -Depth 5

$r = ApiPut "/api/destinations/test-dest-delete-me" $editDest -admin
if ($r -and $r.StatusCode -eq 200) {
    Test-Result "Destinations" "EDIT" "PASS"
} else {
    $code = if ($r) { $r.StatusCode } else { "no response" }
    Test-Result "Destinations" "EDIT" "FAIL" "- Status: $code"
}

Start-Sleep -Seconds 2

# Verify edit
$r = ApiGet "/api/destinations/test-dest-delete-me"
if ($r) {
    $d = $r.Content | ConvertFrom-Json
    if ($d.name -eq "TEST DESTINATION - EDITED") {
        Test-Result "Destinations" "VERIFY EDIT" "PASS"
    } else {
        Test-Result "Destinations" "VERIFY EDIT" "FAIL" "- name=$($d.name)"
    }
} else {
    Test-Result "Destinations" "VERIFY EDIT" "FAIL" "- Not found"
}

Start-Sleep -Seconds 2

# DELETE
$r = ApiDelete "/api/destinations/test-dest-delete-me" -admin
if ($r -and $r.StatusCode -eq 200) {
    Test-Result "Destinations" "DELETE" "PASS"
} else {
    $code = if ($r) { $r.StatusCode } else { "no response" }
    Test-Result "Destinations" "DELETE" "FAIL" "- Status: $code"
}

Start-Sleep -Seconds 2

# Verify delete
$r = ApiGet "/api/destinations/test-dest-delete-me"
if ($null -eq $r) {
    Test-Result "Destinations" "VERIFY DELETE" "PASS"
} else {
    Test-Result "Destinations" "VERIFY DELETE" "FAIL" "- Still exists!"
}

Start-Sleep -Seconds 3

# ========================================
# MODULE 3: HOTELS
# ========================================
Log "`n========== MODULE: HOTELS =========="

$r = ApiGet "/api/hotels" -admin
if ($r) {
    $hotels = $r.Content | ConvertFrom-Json
    $origHotels = $hotels.Count
    Test-Result "Hotels" "LIST" "PASS" "- $origHotels hotels"
} else {
    $origHotels = 0
    Test-Result "Hotels" "LIST" "FAIL"
}

Start-Sleep -Seconds 2

$testHotel = @{
    id = "test-hotel-delete-me"
    name = "TEST HOTEL"
    slug = "test-hotel-delete-me"
    description = "Test hotel for admin testing"
    starRating = 4
    destinationId = "jaipur"
    address = "123 Test Street"
    phone = "+91 99999 00000"
    email = "test@hotel.com"
    priceRange = "₹2000 - ₹5000"
    amenities = @("WiFi", "Pool")
    images = @()
    gallery = @()
    featured = $false
    status = "active"
} | ConvertTo-Json -Depth 5

$r = ApiPost "/api/hotels" $testHotel -admin
if ($r -and $r.StatusCode -eq 200) {
    Test-Result "Hotels" "ADD" "PASS"
} else {
    $code = if ($r) { $r.StatusCode } else { "no response" }
    Test-Result "Hotels" "ADD" "FAIL" "- Status: $code"
}

Start-Sleep -Seconds 2

$r = ApiGet "/api/hotels/test-hotel-delete-me"
if ($r) {
    $h = $r.Content | ConvertFrom-Json
    Test-Result "Hotels" "VERIFY ADD" "PASS" "- Found: $($h.name)"
} else {
    Test-Result "Hotels" "VERIFY ADD" "FAIL"
}

Start-Sleep -Seconds 2

$editHotel = @{
    id = "test-hotel-delete-me"
    name = "TEST HOTEL - EDITED"
    slug = "test-hotel-delete-me"
    description = "Edited hotel description"
    starRating = 5
    destinationId = "udaipur"
    address = "456 Edited Street"
    phone = "+91 99999 11111"
    email = "edited@hotel.com"
    priceRange = "₹5000 - ₹10000"
    amenities = @("WiFi", "Pool", "Spa")
    images = @()
    gallery = @()
    featured = $true
    status = "active"
} | ConvertTo-Json -Depth 5

$r = ApiPut "/api/hotels/test-hotel-delete-me" $editHotel -admin
if ($r -and $r.StatusCode -eq 200) {
    Test-Result "Hotels" "EDIT" "PASS"
} else {
    $code = if ($r) { $r.StatusCode } else { "no response" }
    Test-Result "Hotels" "EDIT" "FAIL" "- Status: $code"
}

Start-Sleep -Seconds 2

$r = ApiGet "/api/hotels/test-hotel-delete-me"
if ($r) {
    $h = $r.Content | ConvertFrom-Json
    if ($h.name -eq "TEST HOTEL - EDITED") { Test-Result "Hotels" "VERIFY EDIT" "PASS" }
    else { Test-Result "Hotels" "VERIFY EDIT" "FAIL" "- name=$($h.name)" }
} else {
    Test-Result "Hotels" "VERIFY EDIT" "FAIL"
}

Start-Sleep -Seconds 2

$r = ApiDelete "/api/hotels/test-hotel-delete-me" -admin
if ($r -and $r.StatusCode -eq 200) { Test-Result "Hotels" "DELETE" "PASS" }
else { $code = if ($r) { $r.StatusCode } else { "no response" }; Test-Result "Hotels" "DELETE" "FAIL" "- $code" }

Start-Sleep -Seconds 2

$r = ApiGet "/api/hotels/test-hotel-delete-me"
if ($null -eq $r) { Test-Result "Hotels" "VERIFY DELETE" "PASS" }
else { Test-Result "Hotels" "VERIFY DELETE" "FAIL" }

Start-Sleep -Seconds 3

# ========================================
# MODULE 4: VEHICLES
# ========================================
Log "`n========== MODULE: VEHICLES =========="

$r = ApiGet "/api/vehicles" -admin
if ($r) {
    $vehs = $r.Content | ConvertFrom-Json
    $origVehs = $vehs.Count
    Test-Result "Vehicles" "LIST" "PASS" "- $origVehs vehicles"
} else {
    $origVehs = 0
    Test-Result "Vehicles" "LIST" "FAIL"
}

Start-Sleep -Seconds 2

$testVeh = @{
    id = "test-vehicle-delete-me"
    name = "TEST VEHICLE"
    type = "SUV"
    capacity = 7
    pricePerDay = 2500
    pricePerKm = 12
    fuelType = "Diesel"
    AC = $true
    registrationNumber = "TEST-0001"
    description = "Test vehicle for admin testing"
    images = @()
    status = "active"
    available = $true
} | ConvertTo-Json -Depth 5

$r = ApiPost "/api/vehicles" $testVeh -admin
if ($r -and $r.StatusCode -eq 200) {
    Test-Result "Vehicles" "ADD" "PASS"
} else {
    $code = if ($r) { $r.StatusCode } else { "no response" }
    Test-Result "Vehicles" "ADD" "FAIL" "- Status: $code"
}

Start-Sleep -Seconds 2

$r = ApiGet "/api/vehicles/test-vehicle-delete-me"
if ($r) {
    $v = $r.Content | ConvertFrom-Json
    Test-Result "Vehicles" "VERIFY ADD" "PASS" "- Found: $($v.name)"
} else {
    Test-Result "Vehicles" "VERIFY ADD" "FAIL"
}

Start-Sleep -Seconds 2

$editVeh = @{
    id = "test-vehicle-delete-me"
    name = "TEST VEHICLE - EDITED"
    type = "Sedan"
    capacity = 4
    pricePerDay = 3000
    pricePerKm = 15
    fuelType = "Petrol"
    AC = $true
    registrationNumber = "TEST-0002"
    description = "Edited vehicle"
    images = @()
    status = "active"
    available = $true
} | ConvertTo-Json -Depth 5

$r = ApiPut "/api/vehicles/test-vehicle-delete-me" $editVeh -admin
if ($r -and $r.StatusCode -eq 200) { Test-Result "Vehicles" "EDIT" "PASS" }
else { $code = if ($r) { $r.StatusCode } else { "no response" }; Test-Result "Vehicles" "EDIT" "FAIL" "- $code" }

Start-Sleep -Seconds 2

$r = ApiGet "/api/vehicles/test-vehicle-delete-me"
if ($r) {
    $v = $r.Content | ConvertFrom-Json
    if ($v.name -eq "TEST VEHICLE - EDITED") { Test-Result "Vehicles" "VERIFY EDIT" "PASS" }
    else { Test-Result "Vehicles" "VERIFY EDIT" "FAIL" "- name=$($v.name)" }
} else {
    Test-Result "Vehicles" "VERIFY EDIT" "FAIL"
}

Start-Sleep -Seconds 2

$r = ApiDelete "/api/vehicles/test-vehicle-delete-me" -admin
if ($r -and $r.StatusCode -eq 200) { Test-Result "Vehicles" "DELETE" "PASS" }
else { $code = if ($r) { $r.StatusCode } else { "no response" }; Test-Result "Vehicles" "DELETE" "FAIL" "- $code" }

Start-Sleep -Seconds 2

$r = ApiGet "/api/vehicles/test-vehicle-delete-me"
if ($null -eq $r) { Test-Result "Vehicles" "VERIFY DELETE" "PASS" }
else { Test-Result "Vehicles" "VERIFY DELETE" "FAIL" }

Start-Sleep -Seconds 3

# ========================================
# MODULE 5: COUPONS
# ========================================
Log "`n========== MODULE: COUPONS =========="

$r = ApiGet "/api/coupons" -admin
if ($r) {
    $cpns = $r.Content | ConvertFrom-Json
    $origCpns = $cpns.Count
    Test-Result "Coupons" "LIST" "PASS" "- $origCpns coupons"
} else {
    $origCpns = 0
    Test-Result "Coupons" "LIST" "FAIL"
}

Start-Sleep -Seconds 2

$testCpn = @{
    code = "TESTCOUPON"
    type = "percentage"
    value = 10
    minBookingValue = 5000
    maxDiscount = 2000
    expiry = "2026-12-31"
    usageLimit = 100
    perCustomerLimit = 3
    active = $true
} | ConvertTo-Json -Depth 5

$r = ApiPost "/api/coupons" $testCpn -admin
if ($r -and $r.StatusCode -eq 200) {
    Test-Result "Coupons" "ADD" "PASS"
} else {
    $code = if ($r) { $r.StatusCode } else { "no response" }
    Test-Result "Coupons" "ADD" "FAIL" "- Status: $code"
}

Start-Sleep -Seconds 2

$editCpn = @{
    code = "TESTCOUPON"
    type = "fixed"
    value = 500
    minBookingValue = 3000
    maxDiscount = 500
    expiry = "2026-12-31"
    usageLimit = 50
    perCustomerLimit = 5
    active = $true
} | ConvertTo-Json -Depth 5

$r = ApiGet "/api/coupons" -admin
if ($r) {
    $cpns = $r.Content | ConvertFrom-Json
    $testCpnObj = $cpns | Where-Object { $_.code -eq "TESTCOUPON" } | Select-Object -First 1
    if ($testCpnObj) {
        $cpnId = $testCpnObj._id
        Test-Result "Coupons" "VERIFY ADD" "PASS" "- Found with code TESTCOUPON (id: $cpnId)"
        
        Start-Sleep -Seconds 2
        
        # EDIT
        $r = ApiPut "/api/coupons/$cpnId" $editCpn -admin
        if ($r -and $r.StatusCode -eq 200) { Test-Result "Coupons" "EDIT" "PASS" }
        else { $code = if ($r) { $r.StatusCode } else { "no response" }; Test-Result "Coupons" "EDIT" "FAIL" "- $code" }
        
        Start-Sleep -Seconds 2
        
        # Verify edit
        $r = ApiGet "/api/coupons" -admin
        if ($r) {
            $cpns = $r.Content | ConvertFrom-Json
            $edited = $cpns | Where-Object { $_.code -eq "TESTCOUPON" } | Select-Object -First 1
            if ($edited -and $edited.type -eq "fixed" -and $edited.value -eq 500) {
                Test-Result "Coupons" "VERIFY EDIT" "PASS"
            } else {
                Test-Result "Coupons" "VERIFY EDIT" "FAIL" "- type=$($edited.type) value=$($edited.value)"
            }
        }
        
        Start-Sleep -Seconds 2
        
        # DELETE
        $r = ApiDelete "/api/coupons/$cpnId" -admin
        if ($r -and $r.StatusCode -eq 200) { Test-Result "Coupons" "DELETE" "PASS" }
        else { $code = if ($r) { $r.StatusCode } else { "no response" }; Test-Result "Coupons" "DELETE" "FAIL" "- $code" }
        
        Start-Sleep -Seconds 2
        
        # Verify delete
        $r = ApiGet "/api/coupons" -admin
        if ($r) {
            $cpns = $r.Content | ConvertFrom-Json
            $deleted = $cpns | Where-Object { $_.code -eq "TESTCOUPON" }
            if (-not $deleted) { Test-Result "Coupons" "VERIFY DELETE" "PASS" }
            else { Test-Result "Coupons" "VERIFY DELETE" "FAIL" }
        }
    } else {
        Test-Result "Coupons" "VERIFY ADD" "FAIL" "- Code not found after create"
    }
} else {
    Test-Result "Coupons" "VERIFY ADD" "FAIL" "- Cannot list coupons"
}

Start-Sleep -Seconds 3

# ========================================
# MODULE 6: REVIEWS
# ========================================
Log "`n========== MODULE: REVIEWS =========="

# Submit a review (public endpoint)
$testReview = @{
    name = "Test Reviewer"
    text = "This is a test review for admin testing purposes."
    rating = 5
    phone = "9999900000"
    packageName = "Test Package"
} | ConvertTo-Json -Depth 5

$r = ApiPost "/api/reviews" $testReview
if ($r -and $r.StatusCode -eq 200) {
    Test-Result "Reviews" "ADD (public submit)" "PASS"
} else {
    $code = if ($r) { $r.StatusCode } else { "no response" }
    Test-Result "Reviews" "ADD (public submit)" "FAIL" "- Status: $code"
}

Start-Sleep -Seconds 2

# List reviews (admin)
$r = ApiGet "/api/reviews?all=1" -admin
if ($r) {
    $revs = $r.Content | ConvertFrom-Json
    Test-Result "Reviews" "LIST (admin)" "PASS" "- $($revs.Count) reviews"
    
    $testRev = $revs | Where-Object { $_.phone -eq "9999900000" } | Select-Object -First 1
    if ($testRev) {
        $revId = $testRev._id
        Test-Result "Reviews" "VERIFY ADD" "PASS" "- Found test review"
        
        Start-Sleep -Seconds 2
        
        # EDIT (approve)
        $r = ApiPut "/api/reviews/$revId" '{"approved":true,"featured":true}' -admin
        if ($r -and $r.StatusCode -eq 200) { Test-Result "Reviews" "EDIT (approve+feature)" "PASS" }
        else { $code = if ($r) { $r.StatusCode } else { "no response" }; Test-Result "Reviews" "EDIT" "FAIL" "- $code" }
        
        Start-Sleep -Seconds 2
        
        # Verify edit
        $r = ApiGet "/api/reviews?all=1" -admin
        if ($r) {
            $revs = $r.Content | ConvertFrom-Json
            $edited = $revs | Where-Object { $_._id -eq $revId }
            if ($edited -and $edited.approved -eq $true -and $edited.featured -eq $true) {
                Test-Result "Reviews" "VERIFY EDIT" "PASS"
            } else {
                Test-Result "Reviews" "VERIFY EDIT" "FAIL"
            }
        }
        
        Start-Sleep -Seconds 2
        
        # DELETE
        $r = ApiDelete "/api/reviews/$revId" -admin
        if ($r -and $r.StatusCode -eq 200) { Test-Result "Reviews" "DELETE" "PASS" }
        else { $code = if ($r) { $r.StatusCode } else { "no response" }; Test-Result "Reviews" "DELETE" "FAIL" "- $code" }
        
        Start-Sleep -Seconds 2
        
        # Verify delete
        $r = ApiGet "/api/reviews?all=1" -admin
        if ($r) {
            $revs = $r.Content | ConvertFrom-Json
            $deleted = $revs | Where-Object { $_._id -eq $revId }
            if (-not $deleted) { Test-Result "Reviews" "VERIFY DELETE" "PASS" }
            else { Test-Result "Reviews" "VERIFY DELETE" "FAIL" }
        }
    } else {
        Test-Result "Reviews" "VERIFY ADD" "FAIL" "- Test review not found"
    }
} else {
    Test-Result "Reviews" "LIST (admin)" "FAIL"
}

Start-Sleep -Seconds 3

# ========================================
# MODULE 7: SETTINGS
# ========================================
Log "`n========== MODULE: SETTINGS =========="

$r = ApiGet "/api/settings"
if ($r) {
    $settings = $r.Content | ConvertFrom-Json
    $origBizName = $settings.business.name
    $origPhone = $settings.contact.phone
    Test-Result "Settings" "GET" "PASS" "- business=$origBizName phone=$origPhone"
    
    Start-Sleep -Seconds 2
    
    # EDIT business name
    $r = ApiPut "/api/settings" (@{ key = "business"; value = @{ name = "TEST EDITED NAME"; tagline = "Test Tagline"; description = "Test desc" } } | ConvertTo-Json -Depth 5) -admin
    if ($r -and $r.StatusCode -eq 200) { Test-Result "Settings" "EDIT" "PASS" }
    else { $code = if ($r) { $r.StatusCode } else { "no response" }; Test-Result "Settings" "EDIT" "FAIL" "- $code" }
    
    Start-Sleep -Seconds 2
    
    # Verify
    $r = ApiGet "/api/settings"
    if ($r) {
        $s = $r.Content | ConvertFrom-Json
        if ($s.business.name -eq "TEST EDITED NAME") { Test-Result "Settings" "VERIFY EDIT" "PASS" }
        else { Test-Result "Settings" "VERIFY EDIT" "FAIL" "- name=$($s.business.name)" }
    }
    
    Start-Sleep -Seconds 2
    
    # Restore
    $r = ApiPut "/api/settings" (@{ key = "business"; value = @{ name = $origBizName; tagline = $settings.business.tagline; description = $settings.business.description } } | ConvertTo-Json -Depth 5) -admin
    if ($r -and $r.StatusCode -eq 200) { Test-Result "Settings" "RESTORE" "PASS" }
    else { Test-Result "Settings" "RESTORE" "FAIL" }
} else {
    Test-Result "Settings" "GET" "FAIL"
}

Start-Sleep -Seconds 3

# ========================================
# MODULE 8: COUPONS VALIDATE
# ========================================
Log "`n========== MODULE: COUPONS VALIDATE =========="

# Create a test coupon for validation
$testCpn2 = @{
    code = "VALIDATEME"
    type = "percentage"
    value = 15
    minBookingValue = 10000
    maxDiscount = 3000
    expiry = "2026-12-31"
    usageLimit = 50
    perCustomerLimit = 2
    active = $true
} | ConvertTo-Json -Depth 5

$r = ApiPost "/api/coupons" $testCpn2 -admin
Start-Sleep -Seconds 2

# Validate coupon
$validBody = @{ code = "VALIDATEME"; bookingAmount = 15000 } | ConvertTo-Json
$r = ApiPost "/api/coupons/validate" $validBody
if ($r) {
    $v = $r.Content | ConvertFrom-Json
    if ($v.valid -eq $true -and $v.discount -gt 0) {
        Test-Result "Coupons" "VALIDATE" "PASS" "- Discount: $($v.discount)"
    } else {
        Test-Result "Coupons" "VALIDATE" "FAIL" "- valid=$($v.valid) discount=$($v.discount)"
    }
} else {
    Test-Result "Coupons" "VALIDATE" "FAIL" "- API error"
}

Start-Sleep -Seconds 2

# Validate with low amount (should fail)
$validBody2 = @{ code = "VALIDATEME"; bookingAmount = 5000 } | ConvertTo-Json
$r = ApiPost "/api/coupons/validate" $validBody2
if ($r) {
    $v = $r.Content | ConvertFrom-Json
    if ($v.valid -eq $false) {
        Test-Result "Coupons" "VALIDATE (below min)" "PASS" "- Correctly rejected"
    } else {
        Test-Result "Coupons" "VALIDATE (below min)" "FAIL" "- Should be invalid"
    }
}

Start-Sleep -Seconds 2

# Cleanup
$r = ApiGet "/api/coupons" -admin
if ($r) {
    $cpns = $r.Content | ConvertFrom-Json
    $testCpn2Obj = $cpns | Where-Object { $_.code -eq "VALIDATEME" } | Select-Object -First 1
    if ($testCpn2Obj) {
        ApiDelete "/api/coupons/$($testCpn2Obj._id)" -admin
    }
}

Start-Sleep -Seconds 3

# ========================================
# MODULE 9: NOTIFICATIONS
# ========================================
Log "`n========== MODULE: NOTIFICATIONS =========="

$r = ApiGet "/api/notifications" -admin
if ($r) {
    $notifData = $r.Content | ConvertFrom-Json
    Test-Result "Notifications" "LIST" "PASS" "- $($notifData.notifications.Count) notifications, $($notifData.unreadCount) unread"
} else {
    Test-Result "Notifications" "LIST" "FAIL"
}

Start-Sleep -Seconds 2

$r = ApiPut "/api/notifications" '{}' -admin
if ($r -and $r.StatusCode -eq 200) {
    Test-Result "Notifications" "MARK ALL READ" "PASS"
} else {
    Test-Result "Notifications" "MARK ALL READ" "FAIL"
}

Start-Sleep -Seconds 3

# ========================================
# MODULE 10: DASHBOARD
# ========================================
Log "`n========== MODULE: DASHBOARD =========="

$r = ApiGet "/api/dashboard" -admin
if ($r) {
    $dash = $r.Content | ConvertFrom-Json
    Test-Result "Dashboard" "GET" "PASS" "- Keys: $($dash.PSObject.Properties.Name -join ', ')"
} else {
    Test-Result "Dashboard" "GET" "FAIL"
}

Start-Sleep -Seconds 3

# ========================================
# MODULE 11: AUDIT LOGS
# ========================================
Log "`n========== MODULE: AUDIT =========="

$r = ApiGet "/api/audit" -admin
if ($r) {
    $audit = $r.Content | ConvertFrom-Json
    Test-Result "Audit" "LIST" "PASS" "- $($audit.Count) entries"
} else {
    Test-Result "Audit" "LIST" "FAIL"
}

Start-Sleep -Seconds 3

# ========================================
# MODULE 12: ADMIN USERS
# ========================================
Log "`n========== MODULE: ADMIN USERS =========="

$r = ApiGet "/api/admin/users" -admin
if ($r) {
    $users = $r.Content | ConvertFrom-Json
    $origUsers = $users.Count
    Test-Result "Users" "LIST" "PASS" "- $origUsers users"
    
    # Create test user
    $testUser = @{
        username = "testuser_delete_me"
        password = "test123456"
        name = "Test User"
        role = "content-manager"
        permissions = @("packages.view", "destinations.view")
        active = $true
    } | ConvertTo-Json -Depth 5
    
    $r = ApiPost "/api/admin/users" $testUser -admin
    if ($r -and $r.StatusCode -eq 200) {
        Test-Result "Users" "ADD" "PASS"
    } else {
        $code = if ($r) { $r.StatusCode } else { "no response" }
        Test-Result "Users" "ADD" "FAIL" "- $code"
    }
    
    Start-Sleep -Seconds 2
    
    # Verify
    $r = ApiGet "/api/admin/users" -admin
    if ($r) {
        $users = $r.Content | ConvertFrom-Json
        $testU = $users | Where-Object { $_.username -eq "testuser_delete_me" } | Select-Object -First 1
        if ($testU) {
            $userId = $testU._id
            Test-Result "Users" "VERIFY ADD" "PASS"
            
            Start-Sleep -Seconds 2
            
            # EDIT
            $editUser = @{
                name = "Test User EDITED"
                role = "manager"
                active = $true
            } | ConvertTo-Json -Depth 5
            
            $r = ApiPut "/api/admin/users/$userId" $editUser -admin
            if ($r -and $r.StatusCode -eq 200) { Test-Result "Users" "EDIT" "PASS" }
            else { Test-Result "Users" "EDIT" "FAIL" }
            
            Start-Sleep -Seconds 2
            
            # DELETE
            $r = ApiDelete "/api/admin/users/$userId" -admin
            if ($r -and $r.StatusCode -eq 200) { Test-Result "Users" "DELETE" "PASS" }
            else { Test-Result "Users" "DELETE" "FAIL" }
        } else {
            Test-Result "Users" "VERIFY ADD" "FAIL"
        }
    }
} else {
    Test-Result "Users" "LIST" "FAIL"
}

Start-Sleep -Seconds 3

# ========================================
# MODULE 13: CUSTOMERS
# ========================================
Log "`n========== MODULE: CUSTOMERS =========="

$testCust = @{
    phone = "9999900001"
    name = "Test Customer"
    email = "test@test.com"
    source = "admin_test"
    notes = "Test customer"
} | ConvertTo-Json -Depth 5

$r = ApiPost "/api/customers" $testCust -admin
if ($r -and $r.StatusCode -eq 200) {
    Test-Result "Customers" "ADD" "PASS"
} else {
    $code = if ($r) { $r.StatusCode } else { "no response" }
    Test-Result "Customers" "ADD" "FAIL" "- $code"
}

Start-Sleep -Seconds 2

$r = ApiGet "/api/customers" -admin
if ($r) {
    $custs = $r.Content | ConvertFrom-Json
    $testC = $custs | Where-Object { $_.phone -eq "9999900001" } | Select-Object -First 1
    if ($testC) {
        $custId = $testC._id
        Test-Result "Customers" "VERIFY ADD" "PASS"
        
        Start-Sleep -Seconds 2
        
        # EDIT
        $editCust = @{ name = "Test Customer EDITED"; notes = "Edited" } | ConvertTo-Json
        $r = ApiPut "/api/customers/$custId" $editCust -admin
        if ($r -and $r.StatusCode -eq 200) { Test-Result "Customers" "EDIT" "PASS" }
        else { Test-Result "Customers" "EDIT" "FAIL" }
        
        Start-Sleep -Seconds 2
        
        # DELETE
        $r = ApiDelete "/api/customers/$custId" -admin
        if ($r -and $r.StatusCode -eq 200) { Test-Result "Customers" "DELETE" "PASS" }
        else { Test-Result "Customers" "DELETE" "FAIL" }
    } else {
        Test-Result "Customers" "VERIFY ADD" "FAIL"
    }
} else {
    Test-Result "Customers" "LIST" "FAIL"
}

Start-Sleep -Seconds 3

# ========================================
# MODULE 14: LEADS
# ========================================
Log "`n========== MODULE: LEADS =========="

$r = ApiGet "/api/leads" -admin
if ($r) {
    $leads = $r.Content | ConvertFrom-Json
    Test-Result "Leads" "LIST" "PASS" "- $($leads.Count) leads"
} else {
    Test-Result "Leads" "LIST" "FAIL"
}

Start-Sleep -Seconds 2

$testLead = @{
    name = "Test Lead"
    phone = "9999900002"
    email = "lead@test.com"
    requirement = "Test inquiry"
    destination = "Jaipur"
    travelDate = "2026-12-01"
    travellers = 4
    budget = 50000
    source = "admin_test"
} | ConvertTo-Json -Depth 5

$r = ApiPost "/api/leads" $testLead
if ($r -and $r.StatusCode -eq 200) {
    Test-Result "Leads" "ADD (public)" "PASS"
} else {
    $code = if ($r) { $r.StatusCode } else { "no response" }
    Test-Result "Leads" "ADD (public)" "FAIL" "- $code"
}

Start-Sleep -Seconds 2

$r = ApiGet "/api/leads" -admin
if ($r) {
    $leads = $r.Content | ConvertFrom-Json
    $testL = $leads | Where-Object { $_.phone -eq "9999900002" } | Select-Object -First 1
    if ($testL) {
        $leadId = $testL._id
        Test-Result "Leads" "VERIFY ADD" "PASS"
        
        Start-Sleep -Seconds 2
        
        # EDIT
        $editLead = @{ status = "contacted"; notes = "Follow up scheduled" } | ConvertTo-Json
        $r = ApiPut "/api/leads/$leadId" $editLead -admin
        if ($r -and $r.StatusCode -eq 200) { Test-Result "Leads" "EDIT" "PASS" }
        else { Test-Result "Leads" "EDIT" "FAIL" }
        
        Start-Sleep -Seconds 2
        
        # DELETE
        $r = ApiDelete "/api/leads/$leadId" -admin
        if ($r -and $r.StatusCode -eq 200) { Test-Result "Leads" "DELETE" "PASS" }
        else { Test-Result "Leads" "DELETE" "FAIL" }
    } else {
        Test-Result "Leads" "VERIFY ADD" "FAIL"
    }
} else {
    Test-Result "Leads" "VERIFY ADD" "FAIL"
}

Start-Sleep -Seconds 3

# ========================================
# MODULE 15: IMAGES
# ========================================
Log "`n========== MODULE: IMAGES =========="

$r = ApiGet "/api/images" -admin
if ($r) {
    $imgs = $r.Content | ConvertFrom-Json
    Test-Result "Images" "LIST" "PASS" "- $($imgs.Count) images"
} else {
    Test-Result "Images" "LIST" "FAIL"
}

Start-Sleep -Seconds 3

# ========================================
# MODULE 16: INVENTORY
# ========================================
Log "`n========== MODULE: INVENTORY =========="

$r = ApiGet "/api/admin/inventory" -admin
if ($r) {
    $inv = $r.Content | ConvertFrom-Json
    Test-Result "Inventory" "GET" "PASS" "- $($inv.Count) entries"
} else {
    Test-Result "Inventory" "GET" "FAIL"
}

# ========================================
# SUMMARY
# ========================================
Log "`n=========================================="
Log "           TEST RESULTS SUMMARY"
Log "=========================================="

$pass = ($script:results | Where-Object { $_.Result -eq "PASS" }).Count
$fail = ($script:results | Where-Object { $_.Result -eq "FAIL" }).Count
$total = $script:results.Count

Log "Total: $total | PASS: $pass | FAIL: $fail"
Log ""

# Group by module
$modules = $script:results | Group-Object Module
foreach ($mod in $modules) {
    $modPass = ($mod.Group | Where-Object { $_.Result -eq "PASS" }).Count
    $modFail = ($mod.Group | Where-Object { $_.Result -eq "FAIL" }).Count
    $icon = if ($modFail -eq 0) { "✓" } else { "✗" }
    Log "$icon $($mod.Name): $modPass/$($mod.Count) passed"
    if ($modFail -gt 0) {
        $mod.Group | Where-Object { $_.Result -eq "FAIL" } | ForEach-Object {
            Log "    FAIL: $($_.Test) - $($_.Detail)"
        }
    }
}

# Export results
$script:results | Export-Csv -Path "C:\Users\dell\Documents\GitHub\travel-website\.test-results.csv" -NoTypeInformation
Log "`nResults exported to .test-results.csv"
