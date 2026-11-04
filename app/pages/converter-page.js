import Adw from 'gi://Adw';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';

import {
  PERSIAN_MONTHS, PERSIAN_WEEKDAYS, isValidJalaliDate,
  jalaliToDate, toEnglishDigits, toGregorian, toJalali,
  toPersianDigits,
} from '../../shared/calendar.js';

function parseDate(text) {
  const parts = toEnglishDigits(text).trim().split(/[\/-]/).map(Number);
  return parts.length === 3 && parts.every(Number.isInteger) ? parts : null;
}

function copyText(text) {
  const clipboard = Gdk.Display.get_default().get_clipboard();
  clipboard.set(text);
}

export function createConverterPage() {
  const clamp = new Adw.Clamp({maximum_size: 620});
  const root = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, spacing: 18,
    margin_top: 24, margin_bottom: 24, margin_start: 18, margin_end: 18});
  const group = new Adw.PreferencesGroup({title: 'تبدیل دوطرفه'});
  const input = new Adw.EntryRow({title: 'تاریخ، نمونه: ۱۴۰۵/۰۶/۱۳'});
  const source = new Adw.ComboRow({title: 'مبدأ'});
  source.model = Gtk.StringList.new(['شمسی', 'میلادی']);
  const convert = new Gtk.Button({label: 'تبدیل', css_classes: ['suggested-action'], halign: Gtk.Align.END});
  const output = new Gtk.Label({wrap: true, selectable: true, xalign: 1, css_classes: ['card'],
    margin_top: 12, margin_bottom: 12, margin_start: 12, margin_end: 12});
  const copy = new Gtk.Button({label: 'کپی نتیجه', icon_name: 'edit-copy-symbolic', sensitive: false,
    halign: Gtk.Align.END});
  group.add(source);
  group.add(input);
  root.append(group);
  root.append(convert);
  root.append(output);
  root.append(copy);
  let copyValue = '';

  function showError(message) {
    output.label = message;
    output.add_css_class('error');
    copy.sensitive = false;
  }

  convert.connect('clicked', () => {
    output.remove_css_class('error');
    const parts = parseDate(input.text);
    if (!parts) {
      showError('قالب تاریخ معتبر نیست. از سال/ماه/روز استفاده کنید.');
      return;
    }
    try {
      if (source.selected === 0) {
        const [jy, jm, jd] = parts;
        if (!isValidJalaliDate(jy, jm, jd))
          throw new RangeError();
        const g = toGregorian(jy, jm, jd);
        const date = jalaliToDate(jy, jm, jd);
        copyValue = `${g.gy}/${String(g.gm).padStart(2, '0')}/${String(g.gd).padStart(2, '0')}`;
        output.label = `${PERSIAN_WEEKDAYS[date.getDay()]} ${toPersianDigits(jd)} ${PERSIAN_MONTHS[jm - 1]} ${toPersianDigits(jy)}\nمیلادی: ${copyValue}`;
      } else {
        const [gy, gm, gd] = parts;
        const j = toJalali(gy, gm, gd);
        copyValue = toPersianDigits(`${j.jy}/${String(j.jm).padStart(2, '0')}/${String(j.jd).padStart(2, '0')}`);
        output.label = `شمسی: ${copyValue}`;
      }
      copy.sensitive = true;
    } catch (_) {
      showError('این تاریخ معتبر نیست.');
    }
  });
  input.connect('entry-activated', () => convert.activate());
  copy.connect('clicked', () => {
    copyText(copyValue);
    copy.label = 'کپی شد';
  });
  clamp.child = root;
  return clamp;
}
