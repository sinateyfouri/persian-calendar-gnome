import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class PersianCalendarPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const settings = this.getSettings();
    const page = new Adw.PreferencesPage({title: 'تقویم فارسی', icon_name: 'x-office-calendar-symbolic'});
    const appearance = new Adw.PreferencesGroup({title: 'نمایش'});

    const format = new Adw.ComboRow({title: 'قالب تاریخ'});
    format.model = GtkStringList(['۱۴۰۵/۰۶/۱۳', 'پنجشنبه ۱۳ شهریور', 'پنجشنبه ۱۳ شهریور ۱۴۰۵']);
    const values = ['numeric', 'medium', 'long'];
    format.selected = Math.max(0, values.indexOf(settings.get_string('date-format')));
    format.connect('notify::selected', row => settings.set_string('date-format', values[row.selected]));
    appearance.add(format);

    for (const [key, title, subtitle] of [
      ['persian-digits', 'اعداد فارسی', 'نمایش رقم‌های ۰ تا ۹ به شکل فارسی'],
      ['show-time', 'نمایش ساعت', 'افزودن ساعت محلی کنار تاریخ'],
      ['show-events', 'نمایش مناسبت‌ها', 'نمایش مناسبت‌ها و تعطیلات در تقویم'],
    ]) {
      const row = new Adw.SwitchRow({title, subtitle});
      settings.bind(key, row, 'active', Gio.SettingsBindFlags.DEFAULT);
      appearance.add(row);
    }

    page.add(appearance);
    window.add(page);
    window.set_default_size(560, 520);
    window.set_direction(Gtk.TextDirection.RTL);
  }
}

function GtkStringList(strings) {
  const list = new Gtk.StringList();
  strings.forEach(value => list.append(value));
  return list;
}
