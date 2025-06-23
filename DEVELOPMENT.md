# Development Setup Guide

## API Konfigürasyonu

### 1. IP Adresini Belirleme

#### Bilgisayarınızın IP adresini öğrenin:

**Linux/macOS:**
```bash
hostname -I
# veya
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```cmd
ipconfig | findstr "IPv4"
```

### 2. Config Dosyasını Güncelleyin

`src/config/api.config.js` dosyasında `DEVELOPMENT_HOST` değerini kendi IP'niz ile değiştirin:

config/api.config.js içerisinde

```javascript
const DEVELOPMENT_HOST = 'YOUR_IP_HERE'; // Örn: '192.168.1.25'
```

### 3. Backend Sunucu Ayarları

Backend sunucunuzun tüm network interface'lerde dinlediğinden emin olun:

```javascript
// Express.js örneği
app.listen(5005, '0.0.0.0', () => {
  console.log('Server running on all interfaces port 5005');
});
```

### 4. Test Etme

Terminal'de test edin:
```bash
curl http://YOUR_IP:5005/api/v1
```

### 5. Güvenlik Duvarı

Eğer bağlantı sorunu yaşıyorsanız:

**Linux:**
```bash
sudo ufw allow 5005
```

**Windows:**
Windows Defender Firewall'da 5005 portunu açın.

## Çoklu Geliştirici Ortamı

### Option 1: .env Dosyası (Önerilen)
```bash
# .env.development
API_HOST=192.168.1.25
API_PORT=5005
```

### Option 2: Config Override
```javascript
// config/local.config.js (git'e eklenmez)
export const LOCAL_CONFIG = {
  DEVELOPMENT_HOST: '192.168.1.25'
};
```

### Option 3: Otomatik IP Algılama
Uygulama başlangıcında otomatik IP algılama kullanın.

## Sorun Giderme

### Network Error
1. IP adresini kontrol edin
2. Backend sunucu çalışıyor mu?
3. Firewall ayarları
4. WiFi ağı aynı mı?

### Connection Refused
1. Port 5005 açık mı?
2. Backend tüm interface'lerde dinliyor mu?
3. IP adresi doğru mu?

## Production Build

Production build'de otomatik olarak production API URL'i kullanılır:
```javascript
const PRODUCTION_API_URL = 'https://your-production-api.com/api/v1';
``` 