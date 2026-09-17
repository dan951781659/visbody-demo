import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';

// Exercise the exact app-owned domain functions, not a second implementation.
const source = readFileSync(new URL('../src/Prototype.tsx', import.meta.url), 'utf8');
const domain = source.split('// HOME_DOMAIN_START')[1].split('// HOME_DOMAIN_END')[0];
const run = code => new Function('return ' + stripTypeScriptTypes('(function(){' + code + '\n})()', { mode: 'strip' }))();
const { buildHomeOverview, homeMetricValue, homeServiceSummary, isHomeServiceResult, homeModelAsset, previewServiceTypes } = run(domain + '\nreturn { buildHomeOverview, homeMetricValue, homeServiceSummary, isHomeServiceResult, homeModelAsset, previewServiceTypes };');
const reports = run(source.slice(source.indexOf('const modules: ReportModule[]'), source.indexOf('const highlights =')) + '\nreturn seed;');
const localized = value => Object.fromEntries(['zh','en','de','ar'].map(locale=>[locale,structuredClone(value)]));
const ai = (reportId=reports[0].id) => ({ id:'ai-'+reportId, type:'ai', reportId, generatedAt:'2026-08-10 17:00', summary:localized('Linked fixture'), ai:localized({summary:'Fixture',risks:[],strengths:[],actions:[]}) });
const training = (reportId=reports[0].id) => ({ id:'training-'+reportId, type:'training', reportId, generatedAt:'2026-08-10 17:00', summary:localized('Linked fixture'), training:localized({title:'Fixture',heroDesc:'Fixture',dietHeroTitle:'Fixture',dietHeroDesc:'Fixture',execIntro:'Fixture',metrics:[],goals:[],phases:[],weeks:[],days:[],exercises:[],meals:[],nutrients:[],strategyTags:[]}) });
test('uses measurement time, not array order, without mutating records',()=>{
  const input=[reports[2],reports[0],reports[1]]; const overview=buildHomeOverview(input);
  assert.equal(overview.latest.id,reports[0].id); assert.equal(input[0].id,reports[2].id);
});
test('trend nodes come from the three reports, never the old seven-day series',()=>{
  const o=buildHomeOverview(reports);
  assert.deepEqual(o.trends.score.map(p=>p.value),[76,79,82]);
  assert.deepEqual(o.trends.score.map(p=>p.measuredAt),reports.slice().reverse().map(r=>r.date));
  assert.deepEqual(o.trends.fat.map(p=>p.value),[42.1,42.1,42.1]);
  assert.equal(o.trends.weight.at(-1).value,72.8);
});
test('empty and deleted reports do not fall back to seed data',()=>{
  const o=buildHomeOverview([]); assert.equal(o.latest,undefined); assert.deepEqual(o.trends.score,[]); assert.deepEqual(o.concerns,[]);
  assert.equal(buildHomeOverview(reports.slice(1)).latest.id,reports[1].id);
});
test('single-report trends contain exactly one observation',()=>assert.equal(buildHomeOverview([reports[0]]).trends.score.length,1));
test('unavailable metrics are absent, not zero',()=>{
  const r={...reports[0],modules:[]}; assert.equal(homeMetricValue(r,'fat'),undefined); assert.deepEqual(buildHomeOverview([r]).trends.fat,[]);
});
test('zero is valid, incompatible units are not parsed as kg',()=>{
  assert.equal(homeMetricValue({...reports[0],score:0},'score'),0);
  const r=structuredClone(reports[0]); r.modules[0].metrics.find(m=>m.label==='体重').value='160.5 lb'; assert.equal(homeMetricValue(r,'weight'),undefined);
});
test('device and metric-definition changes are not connected',()=>{
  const changed={...reports[1],device:'VISBODY M30'};
  const algorithm={...reports[2],comparisonKey:'new-definition'};
  assert.equal(buildHomeOverview([reports[0],changed,algorithm]).trends.score.length,1);
});
test('invalid dates are ignored',()=>assert.equal(buildHomeOverview([{...reports[0],date:'invalid'}]).latest,undefined));
test('top three priorities come from measured statuses in stable order',()=>assert.deepEqual(buildHomeOverview(reports).concerns.map(m=>m.id),['composition','neck','spine']));
test('model belongs to the known measurement and supports missing model',()=>{
  assert.ok(homeModelAsset(reports[0])); assert.equal(homeModelAsset(reports[1]),undefined);
  assert.equal(homeModelAsset({...reports[0],modelAsset:null}),undefined);
  assert.equal(homeModelAsset({...reports[0],modelAsset:'https://untrusted.invalid/model.obj'}),undefined);
});
test('no inferred service from a global outline or report presence',()=>{
  const o=buildHomeOverview(reports); assert.equal(homeServiceSummary('ai',o,[]).state,'empty'); assert.equal(homeServiceSummary('training',o,[]).state,'empty');
});
test('AI-only and training-only states are independent',()=>{
  const o=buildHomeOverview(reports);
  assert.equal(homeServiceSummary('ai',o,[ai()]).state,'available'); assert.equal(homeServiceSummary('training',o,[ai()]).state,'empty');
  assert.equal(homeServiceSummary('training',o,[training()]).state,'available'); assert.equal(homeServiceSummary('ai',o,[training()]).state,'empty');
});
test('both services may exist without sharing one entitlement flag',()=>{
  const o=buildHomeOverview(reports), results=[ai(),training()];
  for (const type of ['ai','training']) assert.equal(homeServiceSummary(type,o,results).state,'available');
});
test('four preview scenarios expose only their declared service results',()=>{
  assert.deepEqual(previewServiceTypes('none'),[]);
  assert.deepEqual(previewServiceTypes('ai'),['ai']);
  assert.deepEqual(previewServiceTypes('training'),['training']);
  assert.deepEqual(previewServiceTypes('both'),['ai','training']);
});
test('historical services preserve their source report',()=>{
  const result=ai(reports[1].id), summary=homeServiceSummary('ai',buildHomeOverview(reports),[result]);
  assert.equal(summary.state,'historical'); assert.equal(summary.report.id,reports[1].id);
});
test('current report service wins over a later-generated historical result',()=>{
  const old={...ai(reports[1].id),generatedAt:'2026-09-01 09:00'};
  assert.equal(homeServiceSummary('ai',buildHomeOverview(reports),[old,ai()]).result.reportId,reports[0].id);
});
test('unlinked, deleted and incomplete service results do not become personal results',()=>{
  const o=buildHomeOverview(reports);
  assert.equal(homeServiceSummary('ai',o,[ai('someone-else')]).state,'empty');
  assert.equal(homeServiceSummary('ai',buildHomeOverview(reports.slice(1)),[ai()]).state,'empty');
  assert.equal(isHomeServiceResult({...ai(),ai:undefined}),false);
  assert.equal(isHomeServiceResult({...training(),training:localized({title:'Only a heading'})}),false);
});
test('preview shell does not access personal report, profile, service or session storage',()=>{
  const preview=source.slice(source.indexOf('function PreviewPrototype()'),source.indexOf('function BodyModel('));
  for (const forbidden of ['K.reports','K.profile','K.session','homeServicesKey','localStorage.setItem','localStorage.removeItem']) assert.equal(preview.includes(forbidden),false,forbidden);
  assert.match(preview,/K\.locale/); assert.match(preview,/K\.theme/);
});
test('all four documented preview routes are represented by isolated scenarios',()=>{
  for (const scenario of ['none','ai','training','both']) assert.match(source,new RegExp('scenario === "'+scenario+'"|"'+scenario+'" \\|\\|'));
  assert.match(source,/previewMissing/);
});
