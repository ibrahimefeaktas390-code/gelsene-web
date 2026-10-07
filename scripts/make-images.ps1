# Uygulamanın ikonundan (gelsene/assets/images/icon.png) sitenin logo, favicon ve og:image
# görsellerini üretir. Çıktılar public/ altına yazılır ve repoya commit'lenir; bu script yalnızca
# logo değiştiğinde Windows'ta elle çalıştırılır:
#   powershell -ExecutionPolicy Bypass -File scripts/make-images.ps1
param(
  [string]$AppDir = (Join-Path $PSScriptRoot '..\..\gelsene')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$public = Join-Path $root 'public'
New-Item -ItemType Directory -Force $public | Out-Null
$iconPath = Resolve-Path (Join-Path $AppDir 'assets\images\icon.png')
$icon = [System.Drawing.Image]::FromFile($iconPath)

function New-Canvas([int]$w, [int]$h) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.PixelOffsetMode = 'HighQuality'
  $g.TextRenderingHint = 'AntiAliasGridFit'
  return @($bmp, $g)
}

function Save-Square([int]$size, [string]$name) {
  $bmp, $g = New-Canvas $size $size
  $g.Clear([System.Drawing.Color]::White)
  $g.DrawImage($icon, 0, 0, $size, $size)
  $bmp.Save((Join-Path $public $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

Save-Square 512 'logo-512.png'
Save-Square 192 'logo-192.png'
Save-Square 192 'favicon.png'
Save-Square 180 'apple-touch-icon.png'

# favicon.ico: tek 32x32 PNG içeren ICO.
$bmp, $g = New-Canvas 32 32
$g.Clear([System.Drawing.Color]::White)
$g.DrawImage($icon, 0, 0, 32, 32)
$ms = New-Object System.IO.MemoryStream
$bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
$png = $ms.ToArray()
$g.Dispose(); $bmp.Dispose()
$ico = New-Object System.IO.MemoryStream
$w = New-Object System.IO.BinaryWriter $ico
$w.Write([UInt16]0); $w.Write([UInt16]1); $w.Write([UInt16]1)
$w.Write([byte]32); $w.Write([byte]32); $w.Write([byte]0); $w.Write([byte]0)
$w.Write([UInt16]1); $w.Write([UInt16]32); $w.Write([UInt32]$png.Length); $w.Write([UInt32]22)
$w.Write($png)
[System.IO.File]::WriteAllBytes((Join-Path $public 'favicon.ico'), $ico.ToArray())

# og-image.png (1200x630)
$bmp, $g = New-Canvas 1200 630
$g.Clear([System.Drawing.ColorTranslator]::FromHtml('#FFF8F3'))
$brand = [System.Drawing.ColorTranslator]::FromHtml('#FF6B35')
$g.FillRectangle((New-Object System.Drawing.SolidBrush $brand), 0, 0, 1200, 16)
$g.FillRectangle((New-Object System.Drawing.SolidBrush $brand), 0, 614, 1200, 16)
$g.FillEllipse((New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#FFE8D9'))), 60, 135, 360, 360)
$g.FillEllipse([System.Drawing.Brushes]::White, 90, 165, 300, 300)
$clip = New-Object System.Drawing.Drawing2D.GraphicsPath
$clip.AddEllipse(90, 165, 300, 300)
$g.SetClip($clip)
$g.DrawImage($icon, 90, 165, 300, 300)
$g.ResetClip()

$ink = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#1A1A1A'))
$muted = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#5F5953'))
$link = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#9A4A24'))
$titleFont = New-Object System.Drawing.Font 'Segoe UI', 92, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$tagFont = New-Object System.Drawing.Font 'Segoe UI', 42, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
$urlFont = New-Object System.Drawing.Font 'Segoe UI', 34, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString('Gelsene', $titleFont, $ink, 470, 150)
$g.DrawString("Yapmak istediğin aktiviteye`neşlik edecek insanları bul.", $tagFont, $muted, (New-Object System.Drawing.RectangleF 474, 285, 700, 140))
$g.DrawString('gelseneapp.com', $urlFont, $link, 474, 440)
$bmp.Save((Join-Path $public 'og-image.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose(); $icon.Dispose()

Write-Output 'Görseller public/ altına yazıldı.'
