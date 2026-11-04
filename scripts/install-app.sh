#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
data_home="${XDG_DATA_HOME:-$HOME/.local/share}"
bin_home="${XDG_BIN_HOME:-$HOME/.local/bin}"
install_dir="$data_home/persian-calendar-gnome"

mkdir -p "$install_dir" "$bin_home" "$data_home/applications" "$data_home/icons/hicolor/scalable/apps"
rm -rf "$install_dir/app" "$install_dir/shared" "$install_dir/data"
cp -r "$project_dir/app" "$project_dir/shared" "$project_dir/data" "$install_dir/"
chmod +x "$install_dir/app/launcher"
ln -sfn "$install_dir/app/launcher" "$bin_home/persian-calendar-gnome"
cp "$project_dir/app/io.github.persian_calendar_gnome.desktop" "$data_home/applications/"
cp "$project_dir/data/icons/io.github.persian_calendar_gnome.svg" "$data_home/icons/hicolor/scalable/apps/"
command -v update-desktop-database >/dev/null && update-desktop-database "$data_home/applications" || true
command -v gtk4-update-icon-cache >/dev/null && gtk4-update-icon-cache -f -t "$data_home/icons/hicolor" || true
echo "برنامه نصب شد: $bin_home/persian-calendar-gnome"
