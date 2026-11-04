import GLib from 'gi://GLib';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import {formatJalali, toPersianDigits} from './shared/calendar.js';
import {NativeDualCalendar} from './native-calendar.js';

function dateFromGLib(datetime) {
  return new Date(datetime.to_unix() * 1000);
}

function isToday(date) {
  const today = new Date();
  return date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate();
}

export default class PersianCalendarExtension extends Extension {
  enable() {
    this._settings = this.getSettings();
    this._dateMenu = Main.panel.statusArea.dateMenu;
    if (!this._dateMenu?._calendar || !this._dateMenu?._eventsItem)
      throw new Error('ساختار Date Menu این نسخه از GNOME Shell پشتیبانی نمی‌شود');

    const originalCalendar = this._dateMenu._calendar;
    const calendarParent = originalCalendar.get_parent();
    const columnLayout = calendarParent?.layout_manager;
    if (!calendarParent || !Array.isArray(columnLayout?._colActors))
      throw new Error('چیدمان Date Menu این نسخه از GNOME Shell پشتیبانی نمی‌شود');

    this._originalCalendar = originalCalendar;
    this._dateMenu._clockDisplay.add_style_class_name('persian-calendar-panel-label');
    this._originalEventSource = this._dateMenu._eventSource;
    this._calendarParent = calendarParent;
    this._columnLayout = columnLayout;
    this._originalColumnActors = [...this._columnLayout._colActors];
    this._calendarIndex = this._calendarParent.get_children().indexOf(this._originalCalendar);
    this._calendarParent.remove_child(this._originalCalendar);

    this._calendar = new NativeDualCalendar(this._settings);
    this._columnLayout._colActors = this._originalColumnActors
      .map(actor => actor === this._originalCalendar ? this._calendar : actor);
    this._calendarParent.insert_child_at_index(this._calendar, this._calendarIndex);
    this._dateMenu._calendar = this._calendar;
    this._dateMenu._date._calendar = this._calendar;
    if (this._dateMenu._eventSource)
      this._calendar.setEventSource(this._dateMenu._eventSource);

    this._selectedSignal = this._calendar.connect('selected-date-changed', (_calendar, datetime) => {
      const date = dateFromGLib(datetime);
      this._dateMenu._date.setDate(date);
      this._dateMenu._date.reactive = !isToday(date);
      this._dateMenu._eventsItem.setDate(date);
    });
    this._settingsSignal = this._settings.connect('changed', () => {
      this._calendar?._render();
      this._updatePanelLabel();
    });
    this._clockSignal = this._dateMenu._clock.connect('notify::clock', () => this._updatePanelLabel());
    this._updatePanelLabel();
  }

  _updatePanelLabel() {
    if (!this._dateMenu)
      return;
    if (this._settings.get_string('calendar-mode') === 'gregorian') {
      this._dateMenu._clockDisplay.text = this._dateMenu._clock.clock;
      return;
    }
    const persianDigits = this._settings.get_boolean('persian-digits');
    let text = formatJalali(new Date(), this._settings.get_string('date-format'), persianDigits);
    if (this._settings.get_boolean('show-time')) {
      const now = GLib.DateTime.new_now_local();
      let time = now.format('%H:%M');
      if (persianDigits)
        time = toPersianDigits(time);
      text += `  ${time}`;
    }
    this._dateMenu._clockDisplay.text = text;
  }

  disable() {
    if (!this._dateMenu)
      return;
    if (this._clockSignal)
      this._dateMenu._clock.disconnect(this._clockSignal);
    if (this._settingsSignal)
      this._settings.disconnect(this._settingsSignal);
    if (this._selectedSignal)
      this._calendar.disconnect(this._selectedSignal);

    this._dateMenu._calendar = this._originalCalendar;
    this._dateMenu._date._calendar = this._originalCalendar;
    this._calendarParent.remove_child(this._calendar);
    this._calendar.destroy();
    this._calendarParent.insert_child_at_index(this._originalCalendar, this._calendarIndex);
    if (this._dateMenu._eventSource !== this._originalEventSource)
      this._originalCalendar.setEventSource(this._dateMenu._eventSource);
    this._columnLayout._colActors = this._originalColumnActors;
    this._dateMenu._clockDisplay.text = this._dateMenu._clock.clock;
    this._dateMenu._clockDisplay.remove_style_class_name('persian-calendar-panel-label');

    this._calendar = null;
    this._originalCalendar = null;
    this._originalEventSource = null;
    this._originalColumnActors = null;
    this._columnLayout = null;
    this._calendarParent = null;
    this._dateMenu = null;
    this._settings = null;
  }
}
