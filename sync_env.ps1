$vars = @{
    "NEXT_PUBLIC_FIREBASE_API_KEY" = "AIzaSyB6kHYXssB79SguyeyaXNglZYo-K3elJsU"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" = "woodmaster-saas-001.firebaseapp.com"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID" = "woodmaster-saas-001"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" = "woodmaster-saas-001.firebasestorage.app"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" = "354776744552"
    "NEXT_PUBLIC_FIREBASE_APP_ID" = "1:354776744552:web:672b29c2135bc6684ff1dd"
}

foreach ($key in $vars.Keys) {
    $val = $vars[$key]
    Write-Host "Syncing $key..."
    Write-Output $val | npx -y vercel env add $key production
    Write-Output $val | npx -y vercel env add $key preview
    Write-Output $val | npx -y vercel env add $key development
}
