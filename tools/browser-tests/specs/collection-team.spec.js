'use strict';

const {test, expect} = require('@playwright/test');
const H = require('./helpers');

async function openTeam(page) {
  await H.game(page);
  const a = await H.point(page, 233, 300);
  const b = await H.point(page, 233, 110);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move(b.x, b.y, {steps: 8});
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => screen)).toBe('card');
  for (let i = 0; i < 3; i++) await H.tap(page, 350, 382);
  await H.tap(page, 233, 354);

  const root = page.locator('#tp-box-page');
  await expect(root).toBeVisible();
  await root.getByRole('button', {name: /^Teamplanung \d+ \/ 6$/}).click();
  return root;
}

async function seed(page, count) {
  return page.evaluate(async count => {
    const care = TPCollection.read().active;
    const ids = [];
    for (let i = 1; i <= count; i++) {
      await TPCollection.apply('catchWild', {
        dex: 25,
        level: 10 + i,
        nickname: 'P04-' + i,
        shiny: false,
        origin: 'wild',
        data: {
          stats: {atk: 42, def: 31, spe: 60},
          genes: null,
          training: null
        }
      }, 0);
      ids.push(TPCollection.read().nextId - 1);
    }
    return {care, ids};
  }, count);
}

async function storedTeam(page) {
  return page.evaluate(async () => {
    const raw = await new Promise((resolve, reject) => {
      const request = indexedDB.open('itamapoke', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('save', 'readonly');
        const read = tx.objectStore('save').get('state');
        let value;
        read.onsuccess = () => { value = read.result; };
        tx.oncomplete = () => {
          db.close();
          resolve(value);
        };
        tx.onabort = () => {
          const error = tx.error || Error('IndexedDB transaction aborted');
          db.close();
          reject(error);
        };
      };
    });
    const field = TPStoreTools.parseLegacy(new Uint8Array(raw))
      .values.get('f4col');
    if (!field) throw Error('Persistente Sammlung fehlt');
    return TPCollectionModel.decode(
      new TextDecoder().decode(field.value)
    ).team;
  });
}

async function expectTeam(page, expected) {
  await expect.poll(() => page.evaluate(
    () => TPCollection.read().team
  )).toEqual(expected);
  await expect.poll(() => storedTeam(page)).toEqual(expected);
  await expect.poll(() => page.evaluate(() => ({
    busy: TPCollection.busy,
    blocked: TPCollection.blocked,
    gate: tpSaveReplacing
  }))).toEqual({busy: false, blocked: false, gate: false});
}

test.beforeEach(async ({page}) => {
  await H.prepare(page);
  await H.game(page);
});

test('P04: six individual members, reorder, replace, remove and reload',
  async ({page}) => {
    const {care, ids} = await seed(page, 7);
    const root = await openTeam(page);

    await expectTeam(page, [care]);
    await root.getByRole('button', {
      name: 'Aus Teamplanung nehmen', exact: true
    }).click();
    await expectTeam(page, []);

    for (let i = 1; i <= 6; i++) {
      await root.getByRole('button', {
        name: 'Freien Teamplatz belegen', exact: true
      }).click();
      await root.getByRole('dialog').getByRole('button', {
        name: new RegExp('^P04-' + i + ' ·')
      }).click();
      await expectTeam(page, ids.slice(0, i));
    }

    await expect(root.getByRole('button', {
      name: 'Freien Teamplatz belegen', exact: true
    })).toBeDisabled();

    await root.locator('article.tp-box-card').nth(0)
      .getByRole('button', {name: 'Nach hinten', exact: true}).click();

    const reordered = [
      ids[1], ids[0], ids[2], ids[3], ids[4], ids[5]
    ];
    await expectTeam(page, reordered);

    await root.locator('article.tp-box-card').nth(2)
      .getByRole('button', {name: 'Ersetzen', exact: true}).click();

    const dialog = root.getByRole('dialog');
    for (let i = 1; i <= 6; i++) {
      await expect(dialog.getByRole('button', {
        name: new RegExp('^P04-' + i + ' ·')
      })).toHaveCount(0);
    }
    await dialog.getByRole('button', {name: /^P04-7 ·/}).click();

    const replaced = [
      ids[1], ids[0], ids[6], ids[3], ids[4], ids[5]
    ];
    await expectTeam(page, replaced);

    await root.locator('article.tp-box-card').nth(1)
      .getByRole('button', {
        name: 'Aus Teamplanung nehmen', exact: true
      }).click();

    const finalTeam = [
      ids[1], ids[6], ids[3], ids[4], ids[5]
    ];
    await expectTeam(page, finalTeam);

    expect(await page.evaluate(() => ({
      active: TPCollection.read().active,
      ids: TPCollection.read().mons.map(m => m.id).sort((a, b) => a - b),
      stored: TPCollectionModel.summary(TPCollection.read()).stored
    }))).toEqual({
      active: care,
      ids: [care, ...ids].sort((a, b) => a - b),
      stored: 7
    });

    await page.reload();
    await H.waitReady(page);
    await H.game(page);
    await expectTeam(page, finalTeam);

    const reopened = await openTeam(page);
    for (let i = 0; i < finalTeam.length; i++) {
      await expect(reopened.locator('article.tp-box-card').nth(i)
        .getByRole('button', {
          name: new RegExp('^' + (i + 1) + '\\. .*#' + finalTeam[i] + '$')
        })).toBeVisible();
    }
    expect(await page.evaluate(() => TPCollection.read().active)).toBe(care);
  }
);

test('P04: failed team write preserves memory, disk and care identity',
  async ({page}) => {
    const {care, ids} = await seed(page, 1);
    const root = await openTeam(page);
    await expectTeam(page, [care]);

    await root.getByRole('button', {
      name: 'Freien Teamplatz belegen', exact: true
    }).click();

    await page.evaluate(() => {
      window.__p04OriginalWrite = writeSave;
      writeSave = async (bytes, force = false) => {
        if (force) throw Error('P04 intentional quota failure');
        return window.__p04OriginalWrite(bytes, force);
      };
    });

    try {
      await root.getByRole('dialog').getByRole('button', {
        name: /^P04-1 ·/
      }).click();
      await expect(root.getByText(/Speichern fehlgeschlagen/)).toBeVisible();
      await expectTeam(page, [care]);
      expect(await page.evaluate(() => ({
        active: TPCollection.read().active,
        ids: TPCollection.read().mons.map(m => m.id).sort((a, b) => a - b)
      }))).toEqual({
        active: care,
        ids: [care, ...ids].sort((a, b) => a - b)
      });
    } finally {
      await page.evaluate(() => {
        writeSave = window.__p04OriginalWrite;
        delete window.__p04OriginalWrite;
      });
    }

    await root.getByRole('dialog').getByRole('button', {
      name: /^P04-1 ·/
    }).click();
    await expectTeam(page, [care, ids[0]]);

    await page.reload();
    await H.waitReady(page);
    await H.game(page);
    await expectTeam(page, [care, ids[0]]);
    expect(await page.evaluate(() => TPCollection.read().active)).toBe(care);
  }
);
