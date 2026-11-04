# راهنمای انتشار

1. نسخه را در `package.json`، metadata افزونه، AppStream، changelog دبیان و `CHANGELOG.md` هماهنگ کنید.
2. دادهٔ سال جدید را با تقویم رسمی منتشرشدهٔ ایران تطبیق دهید و منبع را در یادداشت انتشار بنویسید.
3. `npm ci && make check` را اجرا و افزونه و Preferences را در نشست پاک GNOME 46 و GNOME 50 دستی آزمایش کنید.
4. نصب/حذف محلی، بستهٔ Debian و manifest فلت‌پک را آزمایش کنید.
5. tag امضاشده و GitHub Release بسازید و ZIP پوشهٔ `dist/` را پیوست کنید. هیچ workflowای در این پروژه خودکار push یا publish نمی‌کند.
6. ZIP را در extensions.gnome.org با مجوز GPL-3.0 و نشانی سورس بارگذاری کنید و منتظر بازبینی بمانید.

پیش از ارسال، [قواعد رسمی بازبینی افزونه](https://gjs.guide/extensions/review-guidelines/review-guidelines.html) را دوباره بررسی کنید.
