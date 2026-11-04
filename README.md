# تقویم فارسی برای GNOME

[English](README.en.md) · [گزارش مشکل](https://github.com/sinateyfouri/persian-calendar-gnome/issues)

یک تقویم شمسی راست‌به‌چپ برای دسکتاپ GNOME که از دو بخش مستقل تشکیل شده است:

- افزونهٔ GNOME Shell برای نمایش تاریخ شمسی در نوار بالا و افزودن تقویم شمسی/میلادی به Date Menu؛
- برنامهٔ GTK4 و Libadwaita برای مشاهدهٔ تقویم، تبدیل تاریخ و جست‌وجوی مناسبت‌ها.

این پروژه تاریخ و ساعت سیستم را تغییر نمی‌دهد، برای اجرای روزمره به دسترسی root نیاز ندارد و با تم روشن و تیرهٔ GNOME هماهنگ است.

## امکانات

- نمایش تاریخ شمسی در نوار بالای GNOME، با امکان نمایش ساعت؛
- جابه‌جایی سریع بین تقویم شمسی و میلادی در Date Menu؛
- تقویم فارسی استاندارد با شروع هفته از شنبه و مشخص‌کردن جمعه‌ها، تعطیلات، امروز و روز انتخاب‌شده؛
- نمایش رویدادهای GNOME Calendar روی روز متناظر؛
- تبدیل دقیق و دوطرفهٔ تاریخ جلالی و میلادی؛
- قالب‌های عددی، متوسط و کامل تاریخ؛
- امکان استفاده از ارقام فارسی یا انگلیسی؛
- جست‌وجوی مناسبت‌ها و کپی تاریخ در برنامهٔ مستقل؛
- فعال یا غیرفعال‌کردن نمایش مناسبت‌ها؛
- رابط کاملاً راست‌به‌چپ با پشتیبانی از فونت IRANSansX؛
- هماهنگی خودکار با ظاهر روشن و تیرهٔ سیستم.

## سازگاری

| سیستم | GNOME Shell | وضعیت |
|---|---:|---|
| Ubuntu 24.04 LTS | 46 | پشتیبانی‌شده |
| Ubuntu 26.04 LTS | 50 | پشتیبانی‌شده |

افزونه از API ماژولی GNOME 45 به بعد استفاده می‌کند، اما نسخه‌های اعلام‌شده در حال حاضر فقط 46 و 50 هستند. اتصال افزونه به Date Menu داخلی Shell وابسته است؛ بنابراین سازگاری نسخه‌های دیگر تضمین نمی‌شود.

## پیش‌نیازها

روی Ubuntu و توزیع‌های مبتنی بر Debian:

```bash
sudo apt update
sudo apt install git gjs gir1.2-gtk-4.0 gir1.2-adw-1 gnome-shell-extension-prefs zip
```

برای توسعه و اجرای آزمون‌ها، Node.js و npm نیز لازم‌اند:

```bash
sudo apt install nodejs npm
```

فونت اختیاری `IRANSansX` در مخزن قرار نگرفته است. اگر این فونت روی سیستم نصب نباشد، برنامه به‌طور خودکار از فونت sans-serif سیستم استفاده می‌کند.

## نصب

مخزن را دریافت کنید:

```bash
git clone https://github.com/sinateyfouri/persian-calendar-gnome.git
cd persian-calendar-gnome
```

برنامه و افزونه را برای کاربر جاری نصب کنید:

```bash
./scripts/install-local.sh
```

سپس یک‌بار از نشست کاربری خارج و دوباره وارد شوید و افزونه را فعال کنید:

```bash
gnome-extensions enable persian-calendar@persian-calendar-gnome.github.io
```

می‌توانید افزونه را از برنامهٔ **Extensions** نیز فعال کنید.

### نصب جداگانه

فقط برنامهٔ GTK:

```bash
./scripts/install-app.sh
```

فقط افزونهٔ GNOME Shell:

```bash
./scripts/install-extension.sh
```

## حذف

حذف کامل نسخهٔ نصب‌شده برای کاربر جاری:

```bash
./scripts/uninstall-local.sh
```

برای حذف جداگانه نیز می‌توانید از `uninstall-app.sh` و `uninstall-extension.sh` استفاده کنید.

## تنظیمات افزونه

پنجرهٔ تنظیمات را با برنامهٔ Extensions باز کنید یا دستور زیر را اجرا کنید:

```bash
gnome-extensions prefs persian-calendar@persian-calendar-gnome.github.io
```

در تنظیمات می‌توانید حالت تقویم، قالب تاریخ، نمایش ساعت، نوع ارقام و مناسبت‌ها را تغییر دهید.

## توسعه و آزمون

```bash
npm ci
npm test
npm run lint
make check
```

اجرای برنامه بدون نصب:

```bash
./scripts/run-app.sh
```

ساخت بستهٔ ZIP افزونه:

```bash
./scripts/build-extension.sh
```

خروجی در پوشهٔ `dist/` ساخته می‌شود.

## بسته‌بندی

ساخت بستهٔ Debian:

```bash
sudo apt install debhelper
./scripts/build-deb.sh
```

ساخت و نصب نسخهٔ Flatpak:

```bash
flatpak-builder --user --install --force-clean build-flatpak \
  packaging/io.github.persian_calendar_gnome.yml
```

جزئیات بیشتر در [راهنمای انتشار](docs/RELEASING.fa.md) آمده است.

## محدودیت‌های فعلی

- مناسبت‌های داخلی بر پایهٔ تاریخ شمسی هستند و باید پیش از انتشارهای سالانه با تقویم رسمی کشور تطبیق داده شوند.
- تغییر حالت تقویم فقط نحوهٔ نمایش رویدادهای GNOME Calendar را عوض می‌کند و تاریخ واقعی رویداد را تغییر نمی‌دهد.
- آزمون تعاملی افزونه باید در یک نشست واقعی GNOME 46 یا 50 انجام شود.

## مشارکت

گزارش خطا، پیشنهاد قابلیت و Pull Request خوش‌آمد است. پیش از ارسال تغییرات، لطفاً [راهنمای مشارکت](CONTRIBUTING.md) را بخوانید و `make check` را اجرا کنید.

## مجوز

این پروژه با مجوز [GPL-3.0-only](LICENSE) منتشر می‌شود.
