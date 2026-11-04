import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import {toPersianDigits} from '../../shared/calendar.js';
import {searchEvents} from '../../shared/events.js';

export function createEventsPage() {
  const clamp = new Adw.Clamp({maximum_size: 680});
  const root = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, spacing: 12,
    margin_top: 24, margin_bottom: 24, margin_start: 18, margin_end: 18});
  const search = new Gtk.SearchEntry({placeholder_text: 'جست‌وجوی مناسبت‌ها'});
  const list = new Gtk.ListBox({selection_mode: Gtk.SelectionMode.NONE, css_classes: ['boxed-list']});
  root.append(search);
  root.append(list);

  function render() {
    for (let child = list.get_first_child(); child;)
      child = (list.remove(child), list.get_first_child());
    const results = searchEvents(search.text);
    if (!search.text.trim()) {
      list.append(new Adw.ActionRow({title: 'نام مناسبت را وارد کنید'}));
      return;
    }
    if (!results.length) {
      list.append(new Adw.ActionRow({title: 'نتیجه‌ای پیدا نشد'}));
      return;
    }
    results.forEach(event => list.append(new Adw.ActionRow({
      title: event.title,
      subtitle: `${event.calendar} — ${toPersianDigits(event.month)}/${toPersianDigits(event.day)}${event.holiday ? ' — تعطیل' : ''}`,
    })));
  }
  search.connect('search-changed', render);
  render();
  clamp.child = root;
  return clamp;
}
