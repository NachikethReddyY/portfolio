import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcileContent } from '../src/content/reconcile.ts';
test('unchanged API snapshot preserves consumer identity; actual edits and removals still update', () => {
 const current = { projects: [{slug: 'one', title: 'Original'}], articles: [] };
 assert.equal(reconcileContent(current, JSON.parse(JSON.stringify(current))), current);
 const edited = {projects: [{slug: 'one', title: 'Updated'}], articles: []};
 assert.equal(reconcileContent(current, edited), edited);
 const removed = {projects: [], articles: []};
 assert.equal(reconcileContent(current, removed), removed);
});
