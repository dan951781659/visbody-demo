import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
const source=readFileSync(new URL('../src/Prototype.tsx',import.meta.url),'utf8');
const domain=source.slice(source.indexOf('type GuestDraft ='),source.indexOf('const guestCopy:')).replaceAll('export function','function');
const {resolveGuestScan,validGuestDraft}=new Function(stripTypeScriptTypes(domain,{mode:'strip'})+';return {resolveGuestScan,validGuestDraft}')();
test('scan resolution never falls back to a sample or latest report',()=>{
 for(const [token,status] of [['','missing'],['arbitrary','invalid'],['demo-expired','expired'],['demo-missing','notFound']]) {
  const r=resolveGuestScan(token);assert.equal(r.status,status);assert.equal(r.grant,undefined);
 }
});
test('AI and training grants are independent and bound to one report',()=>{
 for(const [token,ai,training] of [['demo-both','ready','ready'],['demo-ai','ready','empty'],['demo-training','empty','ready'],['demo-none','empty','empty'],['demo-denied','denied','denied'],['demo-mixed','denied','ready']]) {
  const r=resolveGuestScan(token);assert.equal(r.status,'valid');assert.deepEqual(r.grant,{reportId:'m60-20260810',ai,training});
 }
 assert.equal(resolveGuestScan('demo-other').grant.reportId,'m60-20260806');
});
test('required demographic ranges reject missing, nonfinite and out of range input',()=>{
 const d={age:'30',gender:'female',heightCm:'170'};assert.equal(validGuestDraft(d),true);
 for(const age of ['','9','100','30.5','NaN'])assert.equal(validGuestDraft({...d,age}),false);
 for(const heightCm of ['','99','231','Infinity','NaN'])assert.equal(validGuestDraft({...d,heightCm}),false);
 for(const gender of ['','unknown'])assert.equal(validGuestDraft({...d,gender}),false);
 assert.equal(validGuestDraft({age:'10',gender:'male',heightCm:'100'}),true);
 assert.equal(validGuestDraft({age:'99',gender:'female',heightCm:'230'}),true);
});
test('guest report routes have exact scope and a submitted demographics gate',()=>{
 assert.match(source,/const allowed=eligible && state.submitted && validGuestDraft\(state.draft\)/);
 assert.match(source,/path===base \|\| path===`\$\{base\}\/ai` \|\| path===`\$\{base\}\/training`/);
 assert.match(source,/sessionStorage.removeItem\(guestKey\)/);
 const originalGuest=source.slice(source.indexOf('const guestLogin ='),source.indexOf('const logout ='));
 assert.ok(!originalGuest.includes('localStorage'));
 assert.match(originalGuest,/go\("\/guest\/login"\)/);
});
