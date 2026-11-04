# مشارکت / Contributing

Issue و pull request خوش‌آمد است. تغییرات باید کوچک، دارای توضیح و همراه آزمون باشند.

1. Node.js 20 و وابستگی‌های runtime فهرست‌شده در README را نصب کنید.
2. `npm ci && make check` را اجرا کنید.
3. برای منطق تاریخ، موارد مرزی و رفت‌وبرگشت به `tests/` اضافه کنید.
4. دادهٔ مناسبت را فقط در `data/events.js` تغییر دهید و منبع رسمی و سال اعتبار را در PR بنویسید.
5. UI افزونه را دست‌کم روی یک نشست GNOME 46 یا 50 به‌صورت تعاملی بررسی کنید.

کد JavaScript از ESM، دو فاصله برای تورفتگی و قواعد ESLint پروژه استفاده می‌کند. commitها ترجیحاً از Conventional Commits پیروی کنند.

Please keep changes focused, add boundary tests for calendar logic, run `npm ci && make check`, and document the authoritative source and validity year for event-data updates.
