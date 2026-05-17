# Download and extract the Vosk English model for offline STT
# Run this script in PowerShell from the workspace root

$ErrorActionPreference = 'Stop'

# Download the model zip
Invoke-WebRequest -Uri "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip" -OutFile "vosk-model.zip"

# Extract the zip
Expand-Archive -Path "vosk-model.zip" -DestinationPath "."

# Move model files to ./model
Move-Item -Path ".\vosk-model-small-en-us-0.15\*" -Destination ".\model" -Force

# Clean up
Remove-Item -Recurse -Force ".\vosk-model.zip", ".\vosk-model-small-en-us-0.15"

Write-Host "Vosk model is ready in ./model"