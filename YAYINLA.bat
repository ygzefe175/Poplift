@echo off
echo 🚀 Poplift Yayina Aliniyor...
echo ---------------------------------------
call npx vercel --prod
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Yükleme sırasında bir hata oluştu! Lütfen yukarıdaki mesajları kontrol et.
) else (
    echo.
    echo ✅ Islem Tamamlandi! Yukaridaki URL'den sitene ulasabilirsin.
)
echo ---------------------------------------
pause
