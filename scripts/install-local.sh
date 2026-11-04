#!/usr/bin/env bash
set -euo pipefail
project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
"$project_dir/scripts/install-app.sh"
"$project_dir/scripts/install-extension.sh"
