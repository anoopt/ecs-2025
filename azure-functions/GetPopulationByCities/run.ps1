using namespace System.Net

# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)

# Write to the Azure Functions log stream.
Write-Host "PowerShell HTTP trigger function processed a request."

try {
    # Get the path to the JSON file
    $dataFilePath = Join-Path $PSScriptRoot "population-data.json"
    
    # Check if the file exists
    if (Test-Path $dataFilePath) {
        # Read the JSON file content
        $jsonContent = Get-Content $dataFilePath -Raw
        $populationData = $jsonContent | ConvertFrom-Json
        
        # Convert to the format expected by the SPFx ACE
        $response = @{
            series = @()
        }
        
        foreach ($city in $populationData.cities) {
            $seriesItem = @{
                name = $city.name
                data = @()
            }
              foreach ($dataPoint in $city.data) {
                $seriesItem.data += @{
                    x = $dataPoint.year
                    y = $dataPoint.population
                }
            }
            
            $response.series += $seriesItem
        }
        
        # Convert to JSON for response
        $responseBody = $response | ConvertTo-Json -Depth 4
        
        # Return successful response with population data
        Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
            StatusCode = [HttpStatusCode]::OK
            Body = $responseBody
            Headers = @{
                "Content-Type" = "application/json"
                "Access-Control-Allow-Origin" = "*"
                "Access-Control-Allow-Methods" = "GET, POST, OPTIONS"
                "Access-Control-Allow-Headers" = "Content-Type"
            }
        })
    }
    else {
        # File not found error
        $errorResponse = @{
            error = "Population data file not found"
        } | ConvertTo-Json
        
        Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
            StatusCode = [HttpStatusCode]::NotFound
            Body = $errorResponse
            Headers = @{ "Content-Type" = "application/json" }
        })
    }
}
catch {
    # Handle any errors
    Write-Host "Error occurred: $($_.Exception.Message)"
    
    $errorResponse = @{
        error = "An error occurred while processing the request"
        details = $_.Exception.Message
    } | ConvertTo-Json
    
    Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
        StatusCode = [HttpStatusCode]::InternalServerError
        Body = $errorResponse
        Headers = @{ "Content-Type" = "application/json" }
    })
}
