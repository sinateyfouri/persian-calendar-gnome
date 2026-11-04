#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
uuid="persian-calendar@persian-calendar-gnome.github.io"
build_dir="$project_dir/build/extension/$uuid"
dist_dir="$project_dir/dist"

rm -rf "$project_dir/build/extension"
mkdir -p "$build_dir/shared" "$build_dir/data" "$build_dir/schemas" "$dist_dir"
cp "$project_dir/extension/metadata.json" "$project_dir/extension/extension.js" \
  "$project_dir/extension/prefs.js" "$project_dir/extension/native-calendar.js" \
  "$project_dir/extension/stylesheet.css" "$build_dir/"
cp "$project_dir/shared/calendar.js" "$project_dir/shared/events.js" "$build_dir/shared/"
cp "$project_dir/data/events.js" "$build_dir/data/"
cp "$project_dir/extension/schemas/"*.xml "$build_dir/schemas/"
glib-compile-schemas "$build_dir/schemas"
(cd "$build_dir" && zip -qr "$dist_dir/$uuid.zip" .)
echo "$dist_dir/$uuid.zip"
