#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if ! command -v dh >/dev/null; then
  echo "debhelper نصب نیست: sudo apt install debhelper" >&2
  exit 1
fi
if [[ -e "$project_dir/debian" ]]; then
  echo "مسیر debian از قبل وجود دارد؛ برای جلوگیری از بازنویسی متوقف شد." >&2
  exit 1
fi
cp -r "$project_dir/packaging/debian" "$project_dir/debian"
trap 'rm -rf "$project_dir/debian"' EXIT
(cd "$project_dir" && dpkg-buildpackage -us -uc -b)
