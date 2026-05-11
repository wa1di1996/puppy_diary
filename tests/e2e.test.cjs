/**
 * 汪星日记 - E2E 测试脚本
 * 使用 Playwright 进行端到端测试
 *
 * 运行方式:
 *   npm install -D @playwright/test
 *   npx playwright test tests/e2e.test.js
 *   或者
 *   node tests/e2e.test.js
 */

const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';
const TEST_TIMEOUT = 30000;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('🐕 汪星日记 - 开始 E2E 测试\n');
  console.log('=' .repeat(50));

  let browser;
  let context;
  let page;
  let testsPassed = 0;
  let testsFailed = 0;

  try {
    // 启动浏览器
    console.log('\n📡 启动浏览器...');
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    page = await context.newPage();

    // 监听 console 错误
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 监听页面错误
    const pageErrors = [];
    page.on('pageerror', err => {
      pageErrors.push(err.message);
    });

    console.log('✅ 浏览器启动成功\n');

    // ========== 测试 1: 首页加载 ==========
    console.log('📋 测试 1: 首页加载');
    try {
      await page.goto(BASE_URL, { timeout: TEST_TIMEOUT });
      await page.waitForSelector('.app', { timeout: TEST_TIMEOUT });

      const title = await page.textContent('h1');
      if (title.includes('汪星日记')) {
        console.log('  ✅ 首页标题正确');
        testsPassed++;
      } else {
        throw new Error(`标题不正确: ${title}`);
      }
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 2: 无狗狗信息时显示引导 ==========
    console.log('\n📋 测试 2: 无狗狗信息时显示引导');
    try {
      const noDogText = await page.textContent('.no-dog');
      if (noDogText.includes('还没有添加你的狗狗信息')) {
        console.log('  ✅ 正确显示引导添加狗狗');
        testsPassed++;
      } else {
        throw new Error('未显示引导文字');
      }
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 3: 导航到狗狗档案页面 ==========
    console.log('\n📋 测试 3: 导航到狗狗档案页面');
    try {
      await page.click('button:has-text("狗狗档案")');
      await page.waitForSelector('.profile-page', { timeout: TEST_TIMEOUT });

      const formTitle = await page.textContent('.profile-page h2');
      if (formTitle.includes('狗狗档案')) {
        console.log('  ✅ 成功导航到狗狗档案页面');
        testsPassed++;
      } else {
        throw new Error('页面标题不正确');
      }
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 4: 填写狗狗档案表单 ==========
    console.log('\n📋 测试 4: 填写狗狗档案表单');
    try {
      await page.fill('input[placeholder="给狗狗取个名字"]', '小白');
      await page.selectOption('select', 'west_highland_white_terrier');
      await page.fill('input[type="date"]', '2024-01-15');
      await page.fill('input[type="number"][step="0.1"]', '7.5');

      console.log('  ✅ 表单填写成功');
      testsPassed++;
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 5: 选择默认头像 ==========
    console.log('\n📋 测试 5: 选择默认头像');
    try {
      const avatarButtons = await page.$$('.avatar-option');
      if (avatarButtons.length > 0) {
        await avatarButtons[0].click();
        console.log('  ✅ 默认头像选择成功');
        testsPassed++;
      } else {
        throw new Error('未找到头像选项');
      }
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 6: 保存狗狗档案 ==========
    console.log('\n📋 测试 6: 保存狗狗档案');
    try {
      await page.click('button:has-text("保存")');
      await page.waitForSelector('.home-page', { timeout: TEST_TIMEOUT });

      const dogName = await page.textContent('.dog-profile h3');
      if (dogName === '小白') {
        console.log('  ✅ 档案保存成功');
        testsPassed++;
      } else {
        throw new Error(`狗狗名字不正确: ${dogName}`);
      }
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 7: 首页显示狗狗信息 ==========
    console.log('\n📋 测试 7: 首页显示狗狗信息');
    try {
      const dogName = await page.textContent('.dog-profile h3');
      const dogAge = await page.textContent('.breed-name');

      if (dogName === '小白' && dogAge.includes('岁')) {
        console.log('  ✅ 狗狗信息显示正确');
        testsPassed++;
      } else {
        throw new Error(`信息显示不正确: ${breedName}, ${dogAge}`);
      }
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 8: 今日概览显示 ==========
    console.log('\n📋 测试 8: 今日概览显示');
    try {
      const statsOverview = await page.$('.stats-overview');
      if (statsOverview) {
        console.log('  ✅ 今日概览卡片显示');
        testsPassed++;
      } else {
        throw new Error('未显示今日概览');
      }
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 9: 导航到品种信息页 ==========
    console.log('\n📋 测试 9: 导航到品种信息页');
    try {
      await page.click('button:has-text("品种信息")');
      await page.waitForSelector('.breed-info-page', { timeout: TEST_TIMEOUT });

      const breedTitle = await page.textContent('.breed-info-page h2');
      if (breedTitle.includes('品种信息')) {
        console.log('  ✅ 成功导航到品种信息页');
        testsPassed++;
      } else {
        throw new Error('页面标题不正确');
      }
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 10: 品种信息展示 ==========
    console.log('\n📋 测试 10: 品种信息展示');
    try {
      const breedName = await page.textContent('.breed-header h3');
      const infoCards = await page.$$('.info-card');

      if (breedName.includes('西高地') && infoCards.length >= 3) {
        console.log('  ✅ 品种信息展示正确');
        testsPassed++;
      } else {
        throw new Error(`品种信息不正确: ${breedName}`);
      }
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 返回首页 ==========
    console.log('\n📋 返回首页');
    try {
      await page.click('button:has-text("首页")');
      await page.waitForSelector('.home-page', { timeout: TEST_TIMEOUT });
      console.log('  ✅ 返回首页成功');
      testsPassed++;
    } catch (err) {
      console.log(`  ❌ 返回首页失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 11: 导航到记录日常页 ==========
    console.log('\n📋 测试 11: 导航到记录日常页');
    try {
      await page.click('button:has-text("记录日常")');
      await page.waitForSelector('.daily-record-page', { timeout: TEST_TIMEOUT });

      const recordTypes = await page.$$('.record-type-selector button');
      if (recordTypes.length === 5) {
        console.log('  ✅ 成功导航到记录日常页');
        testsPassed++;
      } else {
        throw new Error('记录类型按钮数量不正确');
      }
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 12: 记录喂食 ==========
    console.log('\n📋 测试 12: 记录喂食');
    try {
      await page.fill('input[type="number"][placeholder="例如: 100"]', '150');
      await page.click('button:has-text("保存")');
      await page.waitForSelector('.home-page', { timeout: TEST_TIMEOUT });

      console.log('  ✅ 喂食记录保存成功');
      testsPassed++;
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 13: 导航到粑粑评分页 ==========
    console.log('\n📋 测试 13: 导航到粑粑评分页');
    try {
      await page.click('button:has-text("粑粑评分")');
      await page.waitForSelector('.poop-score-page', { timeout: TEST_TIMEOUT });

      const scoreOptions = await page.$$('.score-option');
      if (scoreOptions.length === 5) {
        console.log('  ✅ 成功导航到粑粑评分页');
        testsPassed++;
      } else {
        throw new Error('评分选项数量不正确');
      }
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 14: 粑粑评分 ==========
    console.log('\n📋 测试 14: 粑粑评分');
    try {
      // 选择第四个选项（很好）
      const scoreOption = await page.$('.score-option:nth-child(4)');
      await scoreOption.click();

      // 保存
      await page.click('button.primary-btn');
      await page.waitForSelector('.home-page', { timeout: TEST_TIMEOUT });

      console.log('  ✅ 粑粑评分保存成功');
      testsPassed++;
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 15: 导航到记录列表 ==========
    console.log('\n📋 测试 15: 导航到记录列表');
    try {
      await page.click('button:has-text("记录列表")');
      await page.waitForSelector('.records-list-page', { timeout: TEST_TIMEOUT });

      const records = await page.$$('.record-item');
      if (records.length >= 2) {
        console.log(`  ✅ 成功导航到记录列表 (${records.length} 条记录)`);
        testsPassed++;
      } else {
        throw new Error(`记录数量不正确: ${records.length}`);
      }
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 测试 16: 返回首页 ==========
    console.log('\n📋 测试 16: 返回首页');
    try {
      await page.click('button:has-text("首页")');
      await page.waitForSelector('.home-page', { timeout: TEST_TIMEOUT });

      // 检查最近喂食和评分是否显示
      const recentStatus = await page.$$('.recent-status');
      if (recentStatus.length >= 2) {
        console.log('  ✅ 返回首页成功');
        testsPassed++;
      } else {
        throw new Error('最近状态未显示');
      }
    } catch (err) {
      console.log(`  ❌ 测试失败: ${err.message}`);
      testsFailed++;
    }

    // ========== 检查错误 ==========
    console.log('\n' + '='.repeat(50));
    console.log('📊 控制台错误检查:');
    if (consoleErrors.length === 0 && pageErrors.length === 0) {
      console.log('  ✅ 无控制台错误');
      testsPassed++;
    } else {
      if (consoleErrors.length > 0) {
        console.log(`  ⚠️ Console Errors: ${consoleErrors.length}`);
        consoleErrors.forEach(err => console.log(`    - ${err}`));
      }
      if (pageErrors.length > 0) {
        console.log(`  ⚠️ Page Errors: ${pageErrors.length}`);
        pageErrors.forEach(err => console.log(`    - ${err}`));
      }
      testsFailed++;
    }

  } catch (err) {
    console.log(`\n❌ 测试过程出错: ${err.message}`);
    testsFailed++;
  } finally {
    if (browser) {
      await browser.close();
      console.log('\n🔒 浏览器已关闭');
    }
  }

  // ========== 测试结果总结 ==========
  console.log('\n' + '='.repeat(50));
  console.log('📊 测试结果总结');
  console.log('='.repeat(50));
  console.log(`  ✅ 通过: ${testsPassed}`);
  console.log(`  ❌ 失败: ${testsFailed}`);
  console.log(`  📝 总计: ${testsPassed + testsFailed}`);
  console.log('='.repeat(50));

  if (testsFailed === 0) {
    console.log('🎉 所有测试通过!');
  } else {
    console.log('⚠️ 部分测试失败，请检查上述错误');
  }

  process.exit(testsFailed > 0 ? 1 : 0);
}

// 导出函数供外部调用
module.exports = { runTests };

// 如果直接运行此脚本
if (require.main === module) {
  runTests().catch(err => {
    console.error('运行测试时出错:', err);
    process.exit(1);
  });
}
