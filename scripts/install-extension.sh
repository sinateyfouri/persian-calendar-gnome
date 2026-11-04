#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
uuid="persian-calendar@persian-calendar-gnome.github.io"
"$project_dir/scripts/build-extension.sh" >/dev/null
gnome-extensions install --force "$project_dir/dist/$uuid.zip"
echo "افزونه نصب شد. یک‌بار از نشست خارج و وارد شوید، سپس اجرا کنید:"
echo "gnome-extensions enable $uuid"
