import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitBody } from '../src/lib/recipeBody.mjs';

test('plain numbered steps have no note', () => {
  const r = splitBody('1. Mix\n\n2. Bake\n');
  assert.deepEqual(r, { steps: ['Mix', 'Bake'], note: [] });
});

test('trailing paragraphs become the note, not part of the last step', () => {
  const r = splitBody('1. Mix\n\n2. Bake until set\n\nBetter the next day.\n\nFreezes well.\n');
  assert.deepEqual(r.steps, ['Mix', 'Bake until set']);
  assert.deepEqual(r.note, ['Better the next day.', 'Freezes well.']);
});

test('a note that starts with a digit-free sentence is still split off', () => {
  const r = splitBody('1. Cook\n\nServe with rice.');
  assert.deepEqual(r, { steps: ['Cook'], note: ['Serve with rice.'] });
});

test('empty body gives empty result', () => {
  assert.deepEqual(splitBody(''), { steps: [], note: [] });
});
