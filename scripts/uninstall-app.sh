#!/usr/bin/env bash
set -euo pipefail

data_home="${XDG_DATA_HOME:-$HOME/.local/share}"
bin_home="${XDG_BIN_HOME:-$HOME/.local/bin}"
rm -rf "$data_home/persian-calendar-gnome"
rm -f "$bin_home/persian-calendar-gnome"
rm -f "$data_home/applications/io.github.persian_calendar_gnome.desktop"
rm -f "$data_home/icons/hicolor/scalable/apps/io.github.persian_calendar_gnome.svg"
command -v update-desktop-database >/dev/null && update-desktop-database "$data_home/applications" || true
echo "برنامهٔ تقویم فارسی حذف شد."
