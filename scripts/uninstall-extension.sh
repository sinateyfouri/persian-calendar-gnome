#!/usr/bin/env bash
set -euo pipefail
uuid="persian-calendar@persian-calendar-gnome.github.io"
gnome-extensions disable "$uuid" 2>/dev/null || true
gnome-extensions uninstall "$uuid"
