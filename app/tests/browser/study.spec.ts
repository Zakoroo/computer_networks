import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { Catalogue, Profile } from '../../src/types';

const catalogue = JSON.parse(readFileSync('public/content/catalogue.json', 'utf8')) as Catalogue;

async function savedScroll(page: Page, lessonId: string) {
  return page.evaluate(async id => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('network-study-v1');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      const profile = await new Promise<Profile | undefined>((resolve, reject) => {
        const request = database.transaction('profile').objectStore('profile').get('personal');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      return profile?.lessons[id]?.scroll ?? 0;
    } finally { database.close(); }
  }, lessonId);
}

test('keeps diagrams and page height stable while scrolling saves progress', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const lessonId of ['tcp-06', 'socket-api-08', 'sdn-15']) {
    // Start at a settled reading anchor, outside the one-time resume operation.
    await page.goto(`/#/lesson/${lessonId}?anchor=learning-goals`);
    const lesson = catalogue.lessons.find(item => item.id === lessonId)!;
    const count = (lesson.markdown.match(/```mermaid/g) ?? []).length;
    await expect(page.locator('.reader-card .diagram[data-status="ready"]')).toHaveCount(count);
    await page.evaluate(() => document.fonts.ready);
    await expect.poll(() => page.locator('#learning-goals').evaluate(heading => Math.round(heading.getBoundingClientRect().top))).toBe(0);
    await expect(page.locator('.save-status')).toHaveText('Saved in this browser');
    const monitor = await page.evaluateHandle(() => {
      const reader = document.querySelector('.reader-card')!;
      const figures = Array.from(reader.querySelectorAll('.diagram'));
      const svgs = figures.map(figure => figure.querySelector('.diagram-viewport svg')!);
      const originalHeight = document.documentElement.scrollHeight;
      let removals = 0;
      let loading = 0;
      const observer = new MutationObserver(records => {
        for (const record of records) {
          for (const removed of record.removedNodes) {
            if ([...figures, ...svgs].some(node => removed === node || removed.contains(node))) removals++;
          }
        }
        if (reader.querySelector('.diagram[data-status="loading"]')) loading++;
      });
      observer.observe(reader, { childList: true, attributes: true, subtree: true, attributeFilter: ['data-status'] });
      return {
        report: () => ({ removals, loading, originalHeight, height: document.documentElement.scrollHeight,
          originalsConnected: [...figures, ...svgs].every(node => node.isConnected) }),
        stop: () => observer.disconnect(),
      };
    });
    for (const position of [450, 650, 350]) {
      const target = await page.evaluate(y => {
        window.scrollTo(0, y);
        return { y: window.scrollY, fraction: window.scrollY / (document.documentElement.scrollHeight - innerHeight) };
      }, position);
      await expect.poll(() => savedScroll(page, lessonId)).toBeCloseTo(target.fraction, 3);
      await expect(page.locator('.save-status')).toHaveText('Saved in this browser');
      const report = await monitor.evaluate(state => state.report());
      expect(report, lessonId).toMatchObject({ removals: 0, loading: 0, originalsConnected: true });
      expect(report.height, lessonId).toBe(report.originalHeight);
      expect(await page.evaluate(() => window.scrollY), lessonId).toBe(target.y);
    }
    await page.getByRole('button', { name: 'Mark lesson read', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Marked read · undo' })).toBeVisible();
    await expect(page.locator('.save-status')).toHaveText('Saved in this browser');
    expect(await monitor.evaluate(state => state.report())).toMatchObject({ removals: 0, loading: 0, originalsConnected: true });
    await monitor.evaluate(state => state.stop());
    await monitor.dispose();
  }
});

test('makes correct and incorrect answers explicit and keeps review status visible', async ({ page }, testInfo) => {
  await page.goto('/#/question/dns-q001');
  const question = page.getByRole('region', { name: 'Question dns-q001', exact: true });
  const wrong = question.locator('.option').filter({ hasText: 'To prevent IP address conflicts on LANs' });
  const right = question.locator('.option').filter({ hasText: 'To map human-readable names to IP addresses' });
  await expect(question.locator('.answer-indicator')).toHaveCount(0);
  await wrong.getByRole('radio').check();
  await question.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await expect(question.getByRole('heading', { name: 'Incorrect', exact: true })).toBeVisible();
  await expect(wrong.getByText('Your answer · incorrect', { exact: true })).toBeVisible();
  await expect(wrong).toHaveCSS('background-color', 'rgb(255, 240, 237)');
  await expect(right.getByText('Correct answer', { exact: true })).toBeVisible();
  await expect(right).toHaveCSS('background-color', 'rgb(237, 247, 232)');
  await expect(question.locator('.feedback.incorrect')).toHaveCSS('background-color', 'rgb(255, 240, 237)');
  await question.screenshot({ path: testInfo.outputPath('incorrect-feedback.png') });

  await question.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(question.locator('.answer-indicator')).toHaveCount(0);
  await expect(question.locator('.feedback')).toHaveCount(0);
  await right.getByRole('radio').check();
  await question.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await expect(question.getByRole('heading', { name: 'Correct', exact: true })).toBeVisible();
  await expect(right.getByText('Your answer · correct', { exact: true })).toBeVisible();
  await expect(question.locator('.answer-incorrect')).toHaveCount(0);
  await expect(question.getByText('Supplied key', { exact: true })).toHaveCount(0);
  await question.screenshot({ path: testInfo.outputPath('correct-feedback.png') });

  await page.goto('/#/question/tcp-q007');
  const review = page.getByRole('region', { name: 'Question tcp-q007', exact: true });
  await review.getByRole('radio', { name: /The sender resets the entire window/ }).check();
  await review.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await expect(review.getByRole('heading', { name: 'Incorrect', exact: true })).toBeVisible();
  await expect(review.locator('.answer-correct')).toHaveCount(1);
  await expect(review.locator('.answer-incorrect')).toHaveCount(1);
  await expect(review.getByText('Correct answer', { exact: true })).toBeVisible();
  await expect(review.getByText('Your answer · incorrect', { exact: true })).toBeVisible();
  await expect(review.getByRole('note', { name: 'Question status' })).toContainText('Wording/key review');
  await expect(review.locator('.feedback.incorrect')).toContainText('outside the ordinary score');
  await expect(review.locator('.feedback.incorrect')).toContainText('may be ambiguous or incorrect');
  await review.getByRole('button', { name: 'Try again', exact: true }).click();
  await review.getByRole('radio', { name: /The window slides forward/ }).check();
  await review.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await expect(review.getByText('Your answer · correct', { exact: true })).toBeVisible();
  await expect(review.getByRole('heading', { name: 'Correct', exact: true })).toBeVisible();
  await expect(review.locator('.feedback.correct')).toContainText('may be ambiguous or incorrect');
  await review.screenshot({ path: testInfo.outputPath('flagged-correct-feedback.png') });
});

test('shows question status across all content flags with consistent answer feedback', async ({ page }) => {
  const notices: Record<string, string> = {
    wording_issue: 'Wording/key review:', coverage_gap: 'Coverage gap:', cross_topic: 'Cross-topic:',
    supplementary_source: 'Supplementary material:', duplicate_question: 'Duplicate question:',
  };
  for (const flag of Object.keys(notices)) {
    const source = catalogue.questions.find(question => question.flags.includes(flag))!;
    await page.goto(`/#/question/${source.question_id}`);
    const question = page.getByRole('region', { name: `Question ${source.question_id}`, exact: true });
    const status = question.getByRole('note', { name: 'Question status' });
    for (const actualFlag of source.flags) await expect(status).toContainText(notices[actualFlag]);
    await expect(status).toContainText('compares your answer with the original answer key');
    await expect(question.locator('.answer-indicator')).toHaveCount(0);
    await question.getByRole('radio').nth(source.correct_answers[0]).check();
    await question.getByRole('button', { name: 'Submit answer', exact: true }).click();
    await expect(question.getByRole('heading', { name: 'Correct', exact: true })).toBeVisible();
    await expect(question.locator('.answer-correct')).toHaveCSS('background-color', 'rgb(237, 247, 232)');
    await expect(status).toBeVisible();
    if (!source.lesson_id || source.flags.includes('wording_issue')) {
      await expect(question.locator('.feedback')).toContainText('outside the ordinary score');
    }
    await question.getByRole('button', { name: 'Try again', exact: true }).click();
    const wrongIndex = source.options.findIndex((_, index) => !source.correct_answers.includes(index));
    await question.getByRole('radio').nth(wrongIndex).check();
    await question.getByRole('button', { name: 'Submit answer', exact: true }).click();
    await expect(question.getByRole('heading', { name: 'Incorrect', exact: true })).toBeVisible();
    await expect(question.locator('.answer-incorrect')).toHaveCSS('background-color', 'rgb(255, 240, 237)');
    await expect(status).toBeVisible();
  }
});

test('read, answer, annotate, reopen, export, and restore a real study session', async ({ page, browser }, testInfo) => {
  const outsideRequests: string[] = [];
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173/')) outsideRequests.push(request.url()); });
  await page.goto('/#/lesson/dns-01');
  await expect(page.getByRole('heading', { name: /Names, URLs, and the purpose of DNS/ })).toBeVisible();
  const question = page.getByRole('region', { name: 'Question dns-q001', exact: true });
  await expect(question.locator('.feedback')).toHaveCount(0);
  await expect(question.getByText('Supplied key', { exact: true })).toHaveCount(0);
  await expect(question.getByText(/Applications communicate using network addresses/)).toHaveCount(0);
  await page.getByRole('button', { name: 'Mark lesson read', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Marked read · undo' })).toBeVisible();
  await question.getByRole('textbox', { name: 'Add question tag' }).fill('revision');
  await question.getByRole('button', { name: 'Save question tag' }).click();
  await expect(question.getByRole('button', { name: 'Remove tag revision' })).toBeVisible();
  await question.getByRole('button', { name: 'Revisit', exact: true }).click();
  await expect(question.getByRole('button', { name: 'Revisit', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await question.getByRole('radio', { name: /To map human-readable names to IP addresses/ }).check();
  await question.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await expect(question.getByRole('heading', { name: 'Correct', exact: true })).toBeVisible();
  await expect(question.getByText(/Applications communicate using network addresses/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Marked read · undo' })).toBeVisible();
  await expect(question.getByRole('button', { name: 'Remove tag revision' })).toBeVisible();
  await expect(question.getByRole('button', { name: 'Revisit', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(question.locator('.feedback')).toHaveCount(0);
  await expect(question.getByText(/Previously attempted/)).toBeVisible();

  await page.getByRole('button', { name: 'Backup & restore' }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download personal backup' }).click();
  const download = await downloadEvent;
  const path = testInfo.outputPath('personal-backup.json');
  await download.saveAs(path);
  const exported = JSON.parse(await readFile(path, 'utf8'));
  expect(exported.profile.attempts).toHaveLength(1);
  expect(exported.profile.attempts[0].correct_answers).toEqual([4]);

  await page.getByLabel('Choose backup file', { exact: true }).setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{"schema_version":99}') });
  await expect(page.getByRole('alert')).toContainText('not a valid Network Study');
  await expect(page.getByRole('button', { name: 'Replace personal data with this backup' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Close backup' }).click();
  await expect(page.getByRole('button', { name: 'Marked read · undo' })).toBeVisible();

  const restoredContext = await browser.newContext({ baseURL: 'http://127.0.0.1:4173' });
  const restored = await restoredContext.newPage();
  await restored.goto('/');
  await expect(restored.getByRole('button', { name: 'Start studying' })).toBeVisible();
  await restored.getByRole('button', { name: 'Backup & restore' }).click();
  await restored.getByLabel('Choose backup file', { exact: true }).setInputFiles(path);
  await expect(restored.locator('.restore-preview')).toContainText('1 attempts');
  await expect(restored.locator('.restore-preview')).toContainText('replace your current 0 attempts');
  await restored.getByRole('button', { name: 'Replace personal data with this backup' }).click();
  await expect(restored.getByRole('status').filter({ hasText: 'Backup restored' })).toBeVisible();
  await restored.getByRole('button', { name: 'Close backup' }).click();
  await expect(restored).toHaveURL(/#\/lesson\/dns-01$/);
  await expect(restored.getByRole('button', { name: 'Marked read · undo' })).toBeVisible();
  await expect(restored.getByRole('region', { name: 'Question dns-q001', exact: true }).getByRole('button', { name: 'Remove tag revision' })).toBeVisible();
  await restored.reload();
  await expect(restored.getByRole('region', { name: 'Question dns-q001', exact: true }).getByText(/Previously attempted/)).toBeVisible();
  await restoredContext.close();
  expect(outsideRequests).toEqual([]);
});

test('keeps reading-only lessons, cross-topic practice, and flagged keys in their proper modes', async ({ page }) => {
  const readingOnly = catalogue.lessons.find(lesson => !catalogue.questions.some(question => question.lesson_id === lesson.id))!;
  await page.goto(`/#/lesson/${readingOnly.id}`);
  await expect(page.getByRole('heading', { name: 'A reading-only lesson.' })).toBeVisible();
  await page.getByRole('button', { name: 'Mark lesson read', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Next lesson', exact: true })).toBeVisible();
  await page.goto('/#/lesson/dns-18');
  await expect(page.getByRole('region', { name: 'Question routing-q036', exact: true })).toHaveCount(1);
  await page.goto('/#/lesson/tcp-06');
  await expect(page.getByText('1 questions are hidden')).toBeVisible();
  await page.getByRole('button', { name: 'Show all assigned questions' }).click();
  const question = page.getByRole('region', { name: 'Question tcp-q007', exact: true });
  await expect(question.getByText('Review · outside score', { exact: true })).toBeVisible();
  await expect(question.locator('.feedback')).toHaveCount(0);
  await question.getByRole('radio', { name: /The window slides forward/ }).check();
  await question.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await expect(question.getByRole('heading', { name: 'Correct', exact: true })).toBeVisible();
  await expect(question.getByRole('note', { name: 'Question status' })).toContainText('Wording/key review');
  await expect(question.locator('.feedback')).toContainText('outside the ordinary score');
  await expect(question.locator('.feedback')).toContainText('duplicate ACK');
});

test('preserves feedback during a filtered session and persists add/remove tag actions', async ({ page }) => {
  await page.goto('/#/library');
  await page.getByText('Shape your practice queue', { exact: false }).click();
  await page.getByRole('combobox', { name: 'Attempt status', exact: true }).selectOption('new');
  await expect(page.getByRole('combobox', { name: 'Attempt status', exact: true })).toHaveValue('new');
  await page.goto('/#/lesson/dns-01');
  const question = page.getByRole('region', { name: 'Question dns-q001', exact: true });
  await question.getByRole('radio', { name: /To map human-readable names/ }).check();
  await question.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await expect(question.locator('.feedback')).toBeVisible();
  await question.getByRole('textbox', { name: 'Add question tag' }).fill('temporary');
  await question.getByRole('button', { name: 'Save question tag' }).click();
  await question.getByRole('button', { name: 'Remove tag temporary' }).click();
  await expect(question.getByRole('button', { name: 'Remove tag temporary' })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('region', { name: 'Question dns-q001', exact: true })).toHaveCount(0);
});

test('supports local math, code, references, diagram enlargement, and mobile navigation', async ({ page }) => {
  await page.goto('/#/lesson/tcp-07');
  await expect(page.locator('.reader-card .katex').first()).toBeVisible();
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await page.goto('/#/lesson/socket-api-08');
  await expect(page.locator('.reader-card pre code').first()).toContainText('inet_pton');
  await expect(page.locator('.reader-card .diagram[data-status="ready"]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Enlarge diagram', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Enlarged diagram', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Enlarged diagram', exact: true })).toBeHidden();
  await page.getByRole('link', { name: 'Topic glossary', exact: true }).click();
  await expect(page).toHaveURL(/#\/doc\//);
  await expect(page.locator('.reader-card h1')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.sidebar')).toBeHidden();
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await expect(page.locator('.sidebar')).toBeVisible();
  await page.locator('.sidebar').getByRole('button', { name: 'Close navigation', exact: true }).click();
  await expect(page.locator('.sidebar')).toBeHidden();
});

test('renders the complete numbered-lesson diagram set with local assets', async ({ page }, testInfo) => {
  test.setTimeout(240_000);
  const errors: string[] = [], outside: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (!url.startsWith('http://127.0.0.1:4173/')) { outside.push(url); return route.abort(); }
    return route.continue();
  });
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Your next connection.' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('roadmap-desktop.png'), fullPage: true });
  let rendered = 0;
  for (const lesson of catalogue.lessons.filter(item => item.markdown.includes('```mermaid'))) {
    const count = (lesson.markdown.match(/```mermaid/g) ?? []).length;
    await page.goto(`/#/lesson/${lesson.id}`);
    await expect(page.locator('.reader-card .diagram')).toHaveCount(count);
    await expect(page.locator('.reader-card .diagram[data-status="ready"]')).toHaveCount(count, { timeout: 30_000 });
    await expect(page.locator('.diagram[data-status="error"]')).toHaveCount(0);
    if (['tcp-06', 'socket-api-08', 'sdn-12'].includes(lesson.id)) {
      await page.screenshot({ path: testInfo.outputPath(`${lesson.id}-desktop.png`), fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: testInfo.outputPath(`${lesson.id}-mobile.png`), fullPage: true });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.setViewportSize({ width: 1440, height: 1050 });
    }
    rendered += count;
  }
  expect(rendered).toBe(81);
  expect(outside).toEqual([]);
  expect(errors).toEqual([]);
});
