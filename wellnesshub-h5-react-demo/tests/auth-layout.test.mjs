import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../src/Prototype.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/prototype.css',import.meta.url),'utf8');
test('channel region is after creation and before social divider',()=>{
 const auth=source.slice(source.indexOf('function Auth('),source.indexOf('function Register('));
 assert.ok(auth.indexOf('<AccountChannelSwitch')>auth.indexOf('className="secondary-btn"'));
 assert.ok(auth.indexOf('<AccountChannelSwitch')<auth.indexOf('className="divider"'));
 assert.ok(!auth.includes('back-email-login'));
});
test('email code exposes no channel entry and more has an accessible name',()=>{
 const channel=source.slice(source.indexOf('function AccountChannelSwitch'),source.indexOf('function Auth('));
 assert.match(channel,/if \(mode === "emailCode"\) return null/);
 assert.match(channel,/aria-label=\{T\("more"\)\}/);
});
test('forgot uses logical end; old floating switch layout is absent',()=>{
 assert.match(css,/\.assist-forgot\s*\{\s*text-align: end/);
 assert.ok(!css.includes('.login-route-row'));
});
test('logo is bundled with a safe fallback',()=>{
 assert.match(source,/import logoUrl from/);
 assert.match(source,/onError=\{\(\)=>setFailed\(true\)\}/);
});
