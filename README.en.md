# Persian Calendar for GNOME

[فارسی](README.md)

An installable early release of a Jalali (Persian) calendar for Ubuntu Desktop. It includes a GNOME Shell panel extension and a standalone GTK4/Libadwaita application. It never changes the system clock or calendar and needs no root access during normal use.

## Features

- a Solar/Gregorian switch inside GNOME's native date and notification menu;
- GNOME Calendar events marked and selected on the equivalent date in either mode;
- today, selected-day and holiday styling, month navigation, and a Today button;
- configurable date format, Persian/Latin digits, events, and optional time;
- GTK calendar and bidirectional Jalali/Gregorian conversion;
- event search, clipboard copy, RTL UI, and light/dark theme support.

## Supported platforms

- Ubuntu 24.04 LTS / GNOME Shell 46: developed and smoke-tested on Ubuntu 24.04.4.
- Ubuntu 26.04 LTS / GNOME Shell 50: declared target after API review.

The extension uses modern ESM APIs. It replaces only the calendar widget in GNOME's native Date Menu through a narrow 46/50 adapter, leaving notifications and the Shell event source intact; disabling it restores the original widget. This integration uses internal Shell structure and must be smoke-tested on both targets. Relevant official references are the [GNOME 46 porting guide](https://gjs.guide/extensions/upgrading/gnome-shell-46.html), [GNOME 50 porting guide](https://gjs.guide/extensions/upgrading/gnome-shell-50.html), and [GNOME Shell source](https://gitlab.gnome.org/GNOME/gnome-shell/).

## Install

```bash
sudo apt install gjs gir1.2-gtk-4.0 gir1.2-adw-1 gnome-shell-extension-prefs zip
./scripts/install-local.sh
```

Log out and back in, then enable `persian-calendar@persian-calendar-gnome.github.io` with Extensions or `gnome-extensions enable`. Remove both components with `./scripts/uninstall-local.sh`.

## Develop and package

```bash
npm ci
make check
./scripts/run-app.sh
```

`scripts/build-extension.sh` produces the extension ZIP. `scripts/build-deb.sh` builds a Debian binary package when `debhelper` is installed. The Flatpak manifest is at `packaging/io.github.persian_calendar_gnome.yml`.

## Known limits

Static Iranian occasions are date-based only on the Jalali calendar and must be checked against Iran's official calendar before each annual release. GNOME Calendar appointments keep their underlying date and are displayed on its Jalali or Gregorian equivalent. Interactive Shell testing still requires real GNOME 46 and GNOME 50 sessions.

See [the release guide](docs/RELEASING.md) and [contribution guide](CONTRIBUTING.md). Licensed under GPL-3.0-only.
