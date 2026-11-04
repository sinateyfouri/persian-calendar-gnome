import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import St from 'gi://St';

import {
  PERSIAN_MONTHS, addJalaliMonths, dateToJalali, jalaliMonthLength,
  jalaliToDate, toPersianDigits,
} from './shared/calendar.js';
import {isHoliday} from './shared/events.js';

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
const GREGORIAN_MONTHS = [
  'ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن',
  'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر',
];

function sameDay(first, second) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}

export const NativeDualCalendar = GObject.registerClass({
  Signals: {'selected-date-changed': {param_types: [GLib.DateTime.$gtype]}},
}, class NativeDualCalendar extends St.Widget {
  _init(settings) {
    super._init({
      style_class: 'calendar persian-native-calendar',
      layout_manager: new Clutter.GridLayout(),
      reactive: true,
    });
    this._settings = settings;
    this._selectedDate = new Date();
    this._viewDate = new Date();
    this._eventSource = null;
    this._sourceSignal = 0;
    this._render();
  }

  get mode() {
    return this._settings.get_string('calendar-mode');
  }

  setMode(mode) {
    if (mode === this.mode)
      return;
    this._settings.set_string('calendar-mode', mode);
    this._viewDate = new Date(this._selectedDate);
    this._render();
  }

  setEventSource(eventSource) {
    if (this._eventSource && this._sourceSignal) {
      try {
        this._eventSource.disconnect(this._sourceSignal);
      } catch (_) {
        // The Shell may already have disposed the previous event source.
      }
    }
    this._eventSource = eventSource;
    this._sourceSignal = eventSource.connect('changed', () => this._render());
    this.setDate(this._viewDate);
  }

  setDate(date) {
    const changed = !sameDay(date, this._selectedDate);
    this._selectedDate = new Date(date);
    this._viewDate = new Date(date);
    this._requestEvents();
    this._render();
    if (changed) {
      const datetime = GLib.DateTime.new_from_unix_local(Math.floor(date.getTime() / 1000));
      this.emit('selected-date-changed', datetime);
    }
  }

  updateTimeZone() {
    this.setDate(new Date(this._selectedDate));
  }

  _requestEvents() {
    if (!this._eventSource)
      return;
    const begin = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() - 1, 1);
    const end = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + 2, 1);
    this._eventSource.requestRange(begin, end);
  }

  _navigate(delta) {
    if (this.mode === 'solar') {
      const current = dateToJalali(this._viewDate);
      const target = addJalaliMonths(current.jy, current.jm, delta);
      const day = Math.min(current.jd, jalaliMonthLength(target.jy, target.jm));
      this._viewDate = jalaliToDate(target.jy, target.jm, day);
    } else {
      const day = this._viewDate.getDate();
      this._viewDate = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + delta, 1, 12);
      const lastDay = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + 1, 0).getDate();
      this._viewDate.setDate(Math.min(day, lastDay));
    }
    this.setDate(this._viewDate);
  }

  _attachModeSwitch(layout) {
    const box = new St.BoxLayout({style_class: 'persian-calendar-mode-switch'});
    for (const [mode, label] of [['solar', 'شمسی'], ['gregorian', 'میلادی']]) {
      const button = new St.Button({
        label,
        can_focus: true,
        style_class: `button calendar-mode-button${this.mode === mode ? ' active' : ''}`,
      });
      button.connect('clicked', () => this.setMode(mode));
      box.add_child(button);
    }
    layout.attach(box, 0, 0, 7, 1);
  }

  _attachHeader(layout, title) {
    const box = new St.BoxLayout({style_class: 'calendar-month-header'});
    const previous = new St.Button({
      icon_name: 'pan-start-symbolic', can_focus: true, accessible_name: 'ماه قبل',
      style_class: 'calendar-change-month-back pager-button',
    });
    previous.connect('clicked', () => this._navigate(-1));
    const label = new St.Label({
      text: title, x_expand: true, x_align: Clutter.ActorAlign.CENTER,
      y_align: Clutter.ActorAlign.CENTER, style_class: 'calendar-month-label',
    });
    const next = new St.Button({
      icon_name: 'pan-end-symbolic', can_focus: true, accessible_name: 'ماه بعد',
      style_class: 'calendar-change-month-forward pager-button',
    });
    next.connect('clicked', () => this._navigate(1));
    box.add_child(previous);
    box.add_child(label);
    box.add_child(next);
    layout.attach(box, 0, 1, 7, 1);
  }

  _dayStyle(date, otherMonth) {
    let style = date.getDay() === 5
      ? 'calendar-day calendar-weekend'
      : 'calendar-day calendar-weekday';
    if (sameDay(date, new Date()))
      style += ' calendar-today';
    else if (otherMonth)
      style += ' calendar-other-month';
    if (this._eventSource?.hasEvents(date))
      style += ' calendar-day-with-events';
    const j = dateToJalali(date);
    if (this.mode === 'solar' && this._settings.get_boolean('show-events')
      && isHoliday(j.jy, j.jm, j.jd, date.getDay()))
      style += ' persian-calendar-holiday';
    if (sameDay(date, this._selectedDate))
      style += ' persian-calendar-selected';
    return style;
  }

  _renderSolar(layout) {
    const shown = dateToJalali(this._viewDate);
    this._attachHeader(layout, `${PERSIAN_MONTHS[shown.jm - 1]} ${toPersianDigits(shown.jy)}`);
    WEEKDAYS.forEach((day, column) => layout.attach(new St.Label({
      text: day, style_class: 'calendar-day-heading', x_align: Clutter.ActorAlign.CENTER,
    }), 6 - column, 2, 1, 1));
    const first = jalaliToDate(shown.jy, shown.jm, 1);
    const begin = new Date(first);
    begin.setDate(begin.getDate() - (first.getDay() + 1) % 7);
    for (let index = 0; index < 42; index++) {
      const date = new Date(begin);
      date.setDate(begin.getDate() + index);
      const j = dateToJalali(date);
      this._attachDay(layout, date, toPersianDigits(j.jd), j.jm !== shown.jm, index);
    }
  }

  _renderGregorian(layout) {
    const year = this._viewDate.getFullYear();
    const month = this._viewDate.getMonth();
    this._attachHeader(layout, `${GREGORIAN_MONTHS[month]} ${toPersianDigits(year)}`);
    WEEKDAYS.forEach((day, column) => layout.attach(new St.Label({
      text: day, style_class: 'calendar-day-heading', x_align: Clutter.ActorAlign.CENTER,
    }), 6 - column, 2, 1, 1));
    const first = new Date(year, month, 1, 12);
    const begin = new Date(first);
    begin.setDate(begin.getDate() - (first.getDay() + 1) % 7);
    for (let index = 0; index < 42; index++) {
      const date = new Date(begin);
      date.setDate(begin.getDate() + index);
      this._attachDay(layout, date, toPersianDigits(date.getDate()), date.getMonth() !== month, index);
    }
  }

  _attachDay(layout, date, label, otherMonth, index) {
    const button = new St.Button({label, can_focus: true, style_class: this._dayStyle(date, otherMonth)});
    button.connect('clicked', () => this.setDate(date));
    layout.attach(button, 6 - index % 7, Math.floor(index / 7) + 3, 1, 1);
  }

  _render() {
    this.get_children().forEach(child => child.destroy());
    const layout = this.layout_manager;
    this._attachModeSwitch(layout);
    this.set_text_direction(Clutter.TextDirection.RTL);
    if (this.mode === 'solar')
      this._renderSolar(layout);
    else
      this._renderGregorian(layout);
  }

  destroy() {
    if (this._eventSource && this._sourceSignal)
      this._eventSource.disconnect(this._sourceSignal);
    this._sourceSignal = 0;
    this._eventSource = null;
    super.destroy();
  }
});
