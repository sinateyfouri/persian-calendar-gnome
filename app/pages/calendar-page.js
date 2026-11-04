import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import {
  PERSIAN_MONTHS, addJalaliMonths, dateToJalali, jalaliMonthLength,
  jalaliToDate, toPersianDigits,
} from '../../shared/calendar.js';
import {eventsForDate, isHoliday} from '../../shared/events.js';

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export function createCalendarPage() {
  const page = new Adw.Bin();
  const root = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, spacing: 12,
    margin_top: 18, margin_bottom: 18, margin_start: 18, margin_end: 18});
  const today = dateToJalali();
  let shown = {jy: today.jy, jm: today.jm};
  let selected = {...today};
  let showEvents = true;

  const header = new Gtk.Box({spacing: 6, halign: Gtk.Align.CENTER});
  const previous = new Gtk.Button({icon_name: 'go-previous-symbolic', tooltip_text: 'ماه قبل'});
  const title = new Gtk.Label({css_classes: ['title-2'], hexpand: true});
  const next = new Gtk.Button({icon_name: 'go-next-symbolic', tooltip_text: 'ماه بعد'});
  const todayButton = new Gtk.Button({label: 'امروز'});
  header.append(previous);
  header.append(title);
  header.append(next);
  header.append(todayButton);
  root.append(header);

  const grid = new Gtk.Grid({column_homogeneous: true, row_homogeneous: true,
    column_spacing: 4, row_spacing: 4, vexpand: true, hexpand: true});
  root.append(grid);
  const eventsLabel = new Gtk.Label({wrap: true, xalign: 1, selectable: true,
    css_classes: ['card'], margin_top: 8, margin_bottom: 8, margin_start: 8, margin_end: 8});
  root.append(eventsLabel);
  const eventSwitch = new Gtk.Switch({active: true, valign: Gtk.Align.CENTER});
  const eventRow = new Adw.ActionRow({title: 'نمایش مناسبت‌ها'});
  eventRow.add_suffix(eventSwitch);
  eventRow.activatable_widget = eventSwitch;
  root.append(eventRow);

  function render() {
    for (let child = grid.get_first_child(); child;)
      child = (grid.remove(child), grid.get_first_child());
    title.label = `${PERSIAN_MONTHS[shown.jm - 1]} ${toPersianDigits(shown.jy)}`;
    WEEKDAYS.forEach((day, index) => grid.attach(new Gtk.Label({label: day,
      css_classes: ['heading']}), 6 - index, 0, 1, 1));
    const first = jalaliToDate(shown.jy, shown.jm, 1);
    const offset = (first.getDay() + 1) % 7;
    for (let day = 1; day <= jalaliMonthLength(shown.jy, shown.jm); day++) {
      const index = offset + day - 1;
      const date = jalaliToDate(shown.jy, shown.jm, day);
      const button = new Gtk.Button({label: toPersianDigits(day), hexpand: true, vexpand: true});
      const classes = ['calendar-day'];
      if (isHoliday(shown.jy, shown.jm, day, date.getDay()))
        classes.push('holiday');
      if (today.jy === shown.jy && today.jm === shown.jm && today.jd === day)
        classes.push('suggested-action');
      if (selected.jy === shown.jy && selected.jm === shown.jm && selected.jd === day)
        classes.push('selected-day');
      button.set_css_classes(classes);
      button.connect('clicked', () => {
        selected = {jy: shown.jy, jm: shown.jm, jd: day};
        render();
      });
      grid.attach(button, 6 - index % 7, Math.floor(index / 7) + 1, 1, 1);
    }
    const events = eventsForDate(selected.jy, selected.jm, selected.jd, showEvents);
    eventsLabel.label = events.length
      ? `${toPersianDigits(selected.jd)} ${PERSIAN_MONTHS[selected.jm - 1]}\n${events.map(e => `• ${e.title}`).join('\n')}`
      : 'برای این روز مناسبتی ثبت نشده است.';
  }

  previous.connect('clicked', () => { shown = addJalaliMonths(shown.jy, shown.jm, -1); render(); });
  next.connect('clicked', () => { shown = addJalaliMonths(shown.jy, shown.jm, 1); render(); });
  todayButton.connect('clicked', () => { selected = {...today}; shown = {jy: today.jy, jm: today.jm}; render(); });
  eventSwitch.connect('notify::active', widget => { showEvents = widget.active; render(); });
  render();
  page.child = root;
  return page;
}
