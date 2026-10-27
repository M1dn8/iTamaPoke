 'use strict';
const {test,expect}=require('@playwright/test');
const H=require('./helpers');
const languages=[
 {index:3,menu:'Menü',backups:'Sicherungen',settings:'Einstellungen',hub:'Pokédex-Zentrale',species:'Arten-Pokédex'},
 {index:1,menu:'Menu',backups:'Backups',settings:'Settings',hub:'Pokédex hub',species:'Species Pokédex'},
 {index:0,menu:'Menú',backups:'Copias de seguridad',settings:'Ajustes',hub:'Central Pokédex',species:'Pokédex de especies'},
 {index:2,menu:'Menu',backups:'Sauvegardes',settings:'Paramètres',hub:'Centre Pokédex',species:'Pokédex des espèces'}
];
for(const language of languages)
 test('Navigation smoke: menu, all hub entries and return paths – '+language.index,async({page})=>{
  await H.prepare(page);await H.game(page);
  await page.evaluate(()=>TPCollectionGame.ensureCurrent());
  // Language is fixture setup; navigation itself always uses visible controls.
  await page.evaluate(index=>{
   Module.ccall('tp_set_language',null,['number'],[index]);TPText.refresh();
  },language.index);
  const root=page.locator('#tp-app-page');
  const identity=()=>page.evaluate(()=>({
   dex:fns.speciesId(),active:TPCollection.read().active,
   count:TPCollection.read().mons.length
  }));
  const before=await identity();
  await H.openMenu(page);
  await expect(root.getByRole('heading',{level:2})).toHaveText(language.menu);
  await expect(root.locator('.tp-app-grid button'))
   .toHaveText([language.backups,language.settings]);
  await H.openHub(page);
  await expect(root.getByRole('heading',{level:2})).toHaveText(language.hub);
  await expect(root.locator('.tp-app-grid button')).toHaveCount(5);
  await expect(root.getByRole('button',{name:language.species,exact:true})).toBeVisible();
  await H.openJournal(page);await H.backToHub(page);
  await H.openStories(page);await H.backToHub(page);
  await H.openSpeciesSearch(page);await H.closeHubModal(page);
  await H.openEggPlanning(page);await H.closeHubModal(page);
  await H.openEvolution(page);await H.closeHubModal(page);
  await H.game(page);
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
  expect(await identity()).toEqual(before);
 });
