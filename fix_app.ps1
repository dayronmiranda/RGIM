$content = Get-Content assets\app.js -Raw
$content = $content -replace "getOptimizedImagePath\(p\.image 'thumbnail'\)", "getOptimizedImagePath(p.image, 'thumbnail')"
$content | Set-Content assets\app.js -NoNewline