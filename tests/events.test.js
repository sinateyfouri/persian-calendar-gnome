import test from 'node:test';
import assert from 'node:assert/strict';
import {eventsForDate, isHoliday, searchEvents} from '../shared/events.js';

test('fixed solar holiday is returned', () => {
  assert.equal(eventsForDate(1405, 1, 1)[0].title, 'آغاز نوروز');
  assert.equal(isHoliday(1405, 1, 1), true);
});

test('events can be disabled and searched', () => {
  assert.deepEqual(eventsForDate(1405, 1, 1, false), []);
  assert.ok(searchEvents('نوروز').length > 0);
});
