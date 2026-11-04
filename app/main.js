#!/usr/bin/env -S gjs -m

import Adw from 'gi://Adw?version=1';
import Gdk from 'gi://Gdk?version=4.0';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk?version=4.0';

import {createCalendarPage} from './pages/calendar-page.js';
import {createConverterPage} from './pages/converter-page.js';
import {createEventsPage} from './pages/events-page.js';

function loadStyles() {
  const provider = new Gtk.CssProvider();
  const modulePath = GLib.filename_from_uri(import.meta.url)[0];
  const cssPath = GLib.build_filenamev([GLib.path_get_dirname(modulePath), 'style.css']);
  provider.load_from_file(Gio.File.new_for_path(cssPath));
  Gtk.StyleContext.add_provider_for_display(Gdk.Display.get_default(), provider,
    Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);
}

const Application = GObject.registerClass(
class Application extends Adw.Application {
  constructor() {
    super({application_id: 'io.github.persian_calendar_gnome', flags: Gio.ApplicationFlags.DEFAULT_FLAGS});
  }

  vfunc_activate() {
    loadStyles();
    let window = this.active_window;
    if (!window) {
      window = new Adw.ApplicationWindow({
        application: this,
        title: 'تقویم فارسی',
        width_request: 360,
        height_request: 420,
      });
      window.set_default_size(760, 620);
      window.set_direction(Gtk.TextDirection.RTL);

      const toolbar = new Adw.ToolbarView();
      const header = new Adw.HeaderBar();
      const stack = new Adw.ViewStack({vexpand: true});
      stack.add_titled_with_icon(createCalendarPage(), 'calendar', 'تقویم', 'x-office-calendar-symbolic');
      stack.add_titled_with_icon(createConverterPage(), 'converter', 'تبدیل تاریخ', 'view-refresh-symbolic');
      stack.add_titled_with_icon(createEventsPage(), 'events', 'مناسبت‌ها', 'system-search-symbolic');
      header.set_title_widget(new Adw.ViewSwitcher({stack, policy: Adw.ViewSwitcherPolicy.WIDE}));
      toolbar.add_top_bar(header);
      toolbar.set_content(stack);

      const breakpoint = new Adw.Breakpoint(Adw.BreakpointCondition.parse('max-width: 550px'));
      const switcherBar = new Adw.ViewSwitcherBar({stack});
      toolbar.add_bottom_bar(switcherBar);
      breakpoint.add_setter(switcherBar, 'reveal', true);
      window.add_breakpoint(breakpoint);
      window.set_content(toolbar);
    }
    window.present();
  }
});

const app = new Application();
app.run(ARGV);
