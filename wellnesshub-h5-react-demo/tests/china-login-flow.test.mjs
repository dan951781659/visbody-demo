import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../src/Prototype.tsx',import.meta.url),'utf8');

test('domestic and overseas flows use an external simulator switch',()=>{
  assert.match(source,/function FlowSimulator/);
  assert.match(source,/>海外<\/button>/);
  assert.match(source,/>国内<\/button>/);
  assert.match(source,/location\.hash="\/cn\/scan\/new"/);
});

test('new WeChat user follows, opens a notice, authorizes, binds a phone, then enters the standard report',()=>{
  for(const route of ['/cn/scan/new','/cn/messages/new','/cn/oauth/report','/cn/bind-phone/report']) {
    assert.ok(source.includes(route),`missing ${route}`);
  }
  assert.match(source,/体检报告生成通知/);
  assert.match(source,/绑定并查看报告/);
  assert.match(source,/location\.hash=target==="report"\?`\/reports\/\$\{report\.id\}`:"\/home"/);
});

test('existing WeChat users scan directly into the report while notification remains an independent return path',()=>{
  assert.ok(source.includes('/cn/scan/existing-ready'));
  assert.ok(source.includes('/cn/scan/existing-processing'));
  assert.ok(source.includes('/cn/messages/existing'));
  assert.ok(source.includes('if(path==="/cn/scan/existing-ready" && inWechat) { setPendingReport(); const timer=window.setTimeout(()=>finish("report"),850);'));
  assert.ok(source.includes('isNew?go("/cn/oauth/report"):finish("report")'));
  assert.ok(!source.includes('/cn/silent/report'));
  assert.match(source,/扫码直达报告 ＋ 公众号通知回看/);
  assert.match(source,/报告正在生成/);
});

test('domestic report links degrade safely outside WeChat and notification delivery never blocks scan access',()=>{
  assert.match(source,/请在微信内打开/);
  assert.match(source,/requiresWechat/);
  assert.match(source,/公众号通知暂未送达，不影响已绑定用户通过扫码查看本次报告/);
  assert.match(source,/cn\/error\/notice/);
  assert.match(source,/已关注公众号/);
  assert.match(source,/cn\/follow\/wait/);
});

test('fixed entry uses the shared login anatomy and domestic routes merge into the standard app',()=>{
  assert.ok(source.includes('/cn/fixed'));
  assert.match(source,/function ChinaLogin/);
  assert.match(source,/手机号登录/);
  assert.match(source,/使用微信登录/);
  assert.match(source,/hash\.startsWith\("#\/cn\/"\) \? <WeChatPrototype/);
  assert.match(source,/sessionStorage\.removeItem\(guestKey\)/);
  const domestic=source.slice(source.indexOf('function WeChatPrototype'),source.indexOf('export default function Prototype'));
  assert.doesNotMatch(domestic,/<M60Report/);
  assert.doesNotMatch(domestic,/guestOnly/);
});

test('report context is carried before authentication and cleared when the standard session opens',()=>{
  assert.match(source,/chinaPendingReportKey/);
  assert.match(source,/sessionStorage\.setItem\(chinaPendingReportKey,report\.id\)/);
  assert.match(source,/sessionStorage\.removeItem\(chinaPendingReportKey\)/);
});
