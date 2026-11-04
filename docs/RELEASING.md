# Release guide

1. Update the version in `package.json`, extension metadata, AppStream metadata, Debian changelog, and `CHANGELOG.md`.
2. Verify annual event data against Iran's authoritative published calendar. Record the source in the release notes.
3. Run `npm ci && make check`, then manually test the extension and preferences on clean GNOME 46 and GNOME 50 sessions.
4. Test `scripts/install-local.sh`, `scripts/uninstall-local.sh`, the Debian package, and the Flatpak manifest.
5. Create a signed Git tag and a GitHub release; attach the ZIP from `dist/`. This repository does not push or publish automatically.
6. For extensions.gnome.org, upload the ZIP, choose GPL-3.0, include the source URL, and wait for review. Do not include generated files except the compiled schema required inside the submitted ZIP.

Check the current [GNOME extension review guidelines](https://gjs.guide/extensions/review-guidelines/review-guidelines.html) before every submission.
