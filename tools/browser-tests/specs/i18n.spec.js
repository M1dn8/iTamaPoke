const {test,expect}=require('@playwright/test');
const H=require('./helpers');

const scenarios=[
 {
  index:3,code:'de',title:'Menü',settings:'Einstellungen',
  back:'Zurück',home:'Zurück zum Pokémon',
  language:'Sprache: Deutsch',manage:'Dateien verwalten',
  files:'Dateien',graphics:'Grafiken laden (Pokemon und Leiter)',
  sprite:'Grafiken laden…',save:'Spielstand laden…'
 },
 {
  index:1,code:'en',title:'Menu',settings:'Settings',
  back:'Back',home:'Back to your Pokémon',
  language:'Language: English',manage:'Manage files',
  files:'Files',graphics:'Load graphics (Pokémon and trainers)',
  sprite:'Load sprites…',save:'Load save…'
 },
 {
  index:0,code:'es',title:'Menú',settings:'Ajustes',
  back:'Volver',home:'Volver al Pokémon',
  language:'Idioma: Español',manage:'Gestionar archivos',
  files:'Archivos',graphics:'Cargar gráficos (Pokémon y entrenadores)',
  sprite:'Cargar gráficos…',save:'Cargar partida…'
 },
 {
  index:2,code:'fr',title:'Menu',settings:'Paramètres',
  back:'Retour',home:'Retour au Pokémon',
  language:'Langue : Français',manage:'Gérer les fichiers',
  files:'Fichiers',graphics:'Charger les graphismes (Pokémon et Dresseurs)',
  sprite:'Charger les graphismes…',save:'Charger une sauvegarde…'
 },
 {
  index:7,code:'en',title:'Menu',settings:'Settings',
  back:'Back',home:'Back to your Pokémon',
  language:'Language: Korean names',manage:'Manage files',
  files:'Files',graphics:'Load graphics (Pokémon and trainers)',
  sprite:'Load sprites…',save:'Load save…'
 }
];

const root=page=>page.locator('#tp-app-page');
const languageButton=page=>root(page).getByRole('button',{
 name:/^(Sprache|Language|Idioma|Langue)\s*:/
});

async function identity(page){
 return page.evaluate(()=>({
  active:TPCollection.read().active,
  species:fns.speciesId()
 }));
}

async function observeWrites(page){
 await page.evaluate(()=>{
  window.__i18nWrites=[];
  const original=writeSave;
  writeSave=function(...args){
   const result=original.apply(this,args);
   window.__i18nWrites.push(Promise.resolve(result));
   return result;
  };
 });
}

async function chooseLanguage(page,index){
 for(let step=0;step<8;step++){
  const current=await page.evaluate(()=>fns.language());
  if(current===index)return;

  const writes=await page.evaluate(()=>window.__i18nWrites.length);
  await languageButton(page).click();

  await expect.poll(()=>page.evaluate(()=>fns.language()))
   .toBe((current+1)%8);

  // The settings handler must request a real save, not merely repaint.
  await page.waitForFunction(
   count=>window.__i18nWrites.length>count,writes
  );
  await page.evaluate(async()=>{
   await Promise.all(window.__i18nWrites);
  });
 }
 expect(await page.evaluate(()=>fns.language())).toBe(index);
}

async function checkSettings(page,s){
 await expect(root(page).getByRole('heading',{level:2}))
  .toHaveText(s.settings);
 await expect(languageButton(page)).toHaveText(s.language);
 await expect(root(page).getByRole('button',{
  name:s.manage,exact:true
 })).toBeVisible();
 await expect(root(page)).toHaveAttribute('lang',s.code);
 await expect(page.locator('html')).toHaveAttribute('lang',s.code);
 await expect(page.locator('#spriteLoad')).toHaveText(s.sprite);
 await expect(page.locator('#saveImport')).toHaveText(s.save);
}

test.beforeEach(async({page})=>{
 await H.prepare(page);
});

for(const s of scenarios){
 test('Sprachpilot: '+s.code+' / Kernmodus '+s.index+
      ' — Menü, Speicherung und Reload',async({page})=>{
  test.setTimeout(90000);
  const errors=[],external=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{
   if(/^https?:/.test(request.url())&&
      !request.url().startsWith('http://127.0.0.1:8765/')){
    external.push(request.url());
   }
  });

  const before=await identity(page);
  await observeWrites(page);
  await H.openMenu(page);
  await root(page).getByRole('button',{
   name:'Einstellungen',exact:true
  }).click();

  await chooseLanguage(page,s.index);
  await checkSettings(page,s);

  await root(page).getByRole('button',{
   name:s.manage,exact:true
  }).click();
  await expect(root(page).getByRole('heading',{level:2}))
   .toHaveText(s.files);
  await expect(root(page).getByRole('button',{
   name:s.graphics,exact:true
  })).toBeVisible();

  await root(page).getByRole('button',{
   name:s.back,exact:true
  }).click();
  await checkSettings(page,s);

  await root(page).getByRole('button',{
   name:s.back,exact:true
  }).click();
  await expect(root(page).getByRole('heading',{level:2}))
   .toHaveText(s.title);
  await root(page).getByRole('button',{
   name:s.home,exact:true
  }).click();
  await expect(root(page)).toBeHidden();
  await expect.poll(()=>page.evaluate(()=>screen)).toBe('idle');
  expect(await identity(page)).toEqual(before);

  await page.reload();
  await H.waitReady(page);
  await expect.poll(()=>page.evaluate(()=>fns.language())).toBe(s.index);
  expect(await identity(page)).toEqual(before);

  await H.openMenu(page);
  await expect(root(page).getByRole('heading',{level:2}))
   .toHaveText(s.title);
  await root(page).getByRole('button',{
   name:s.settings,exact:true
  }).click();
  await checkSettings(page,s);

  expect(errors).toEqual([]);
  expect(external).toEqual([]);
 });
}
