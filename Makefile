.PHONY: test lint check extension app install uninstall clean

test:
	npm test

lint:
	npm run lint

check: test lint extension
	glib-compile-schemas --strict --dry-run extension/schemas
	desktop-file-validate app/io.github.persian_calendar_gnome.desktop
	appstreamcli validate --no-net app/io.github.persian_calendar_gnome.metainfo.xml

extension:
	./scripts/build-extension.sh

app:
	./scripts/run-app.sh

install:
	./scripts/install-local.sh

uninstall:
	./scripts/uninstall-local.sh

clean:
	rm -rf build dist
