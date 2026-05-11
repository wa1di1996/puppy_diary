#!/usr/bin/env node

/**
 * 汪星日记 - 快速验证测试
 * 不需要启动浏览器，用于验证代码结构和逻辑
 *
 * 运行方式:
 *   node tests/quick-test.js
 */

const fs = require('fs');
const path = require('path');

console.log('🐕 汪星日记 - 快速验证测试\n');
console.log('=' .repeat(50));

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    testsPassed++;
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(`     错误: ${err.message}`);
    testsFailed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || '断言失败');
  }
}

// 测试目录结构
console.log('\n📁 检查目录结构:');
const requiredDirs = [
  'src/components',
  'src/hooks',
  'src/utils',
  'src/data',
  'public',
  'tests'
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  test(`${dir} 目录存在`, () => {
    assert(fs.existsSync(dirPath), `目录不存在: ${dir}`);
  });
});

// 测试必要文件
console.log('\n📄 检查必要文件:');
const requiredFiles = [
  'src/App.jsx',
  'src/App.css',
  'src/main.jsx',
  'src/index.css',
  'package.json',
  'index.html',
  'vite.config.js'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  test(`${file} 存在`, () => {
    assert(fs.existsSync(filePath), `文件不存在: ${file}`);
  });
});

// 测试组件文件
console.log('\n🧩 检查组件文件:');
const componentFiles = [
  'src/components/index.js',
  'src/components/Header.jsx',
  'src/components/MenuGrid.jsx',
  'src/components/DateSelector.jsx',
  'src/components/StatsOverview.jsx',
  'src/components/AvatarSelector.jsx',
  'src/components/PhotoUpload.jsx'
];

componentFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  test(`${file} 存在`, () => {
    assert(fs.existsSync(filePath), `文件不存在: ${file}`);
  });
});

// 测试 Hooks 文件
console.log('\n🪝 检查 Hooks 文件:');
const hookFiles = [
  'src/hooks/index.js',
  'src/hooks/useLocalStorage.js',
  'src/hooks/useDogProfile.js',
  'src/hooks/useDailyRecords.js'
];

hookFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  test(`${file} 存在`, () => {
    assert(fs.existsSync(filePath), `文件不存在: ${file}`);
  });
});

// 测试工具文件
console.log('\n🔧 检查工具文件:');
const utilFiles = [
  'src/utils/imageUtils.js'
];

utilFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  test(`${file} 存在`, () => {
    assert(fs.existsSync(filePath), `文件不存在: ${file}`);
  });
});

// 测试头像图片
console.log('\n🖼️ 检查头像图片:');
const avatarFiles = [
  'public/westie_avatar_001.jpg',
  'public/teddy_avatar_001.jpg',
  'public/golden_avatar_001.jpg',
  'public/labrador_avatar_001.jpg',
  'public/corgi_avatar_001.jpg',
  'public/shiba_avatar_001.jpg',
  'public/frenchie_avatar_001.jpg',
  'public/husky_avatar_001.jpg'
];

avatarFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  test(`${file} 存在`, () => {
    assert(fs.existsSync(filePath), `文件不存在: ${file}`);
  });
});

// 验证代码内容
console.log('\n📝 验证代码内容:');

test('App.jsx 导出 App 组件', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'src/App.jsx'), 'utf8');
  assert(content.includes('export default App'), '未找到 export default App');
});

test('App.jsx 包含页面导航', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'src/App.jsx'), 'utf8');
  assert(content.includes('PAGES.HOME'), '未找到页面导航常量');
});

test('App.jsx 包含狗狗档案页面', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'src/App.jsx'), 'utf8');
  assert(content.includes('ProfilePage'), '未找到 ProfilePage 组件');
});

test('App.jsx 包含品种信息页面', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'src/App.jsx'), 'utf8');
  assert(content.includes('BreedInfoPage'), '未找到 BreedInfoPage 组件');
});

test('App.jsx 包含每日记录页面', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'src/App.jsx'), 'utf8');
  assert(content.includes('DailyRecordPage'), '未找到 DailyRecordPage 组件');
});

test('App.jsx 包含健康管理页面', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'src/App.jsx'), 'utf8');
  assert(content.includes('HealthManagePage'), '未找到 HealthManagePage 组件');
});

test('App.jsx 包含记录列表页面', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'src/App.jsx'), 'utf8');
  assert(content.includes('RecordsListPage'), '未找到 RecordsListPage 组件');
});

test('App.jsx 包含费用计算器页面', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'src/App.jsx'), 'utf8');
  assert(content.includes('CostCalcPage'), '未找到 CostCalcPage 组件');
});

test('breeds.js 包含品种数据', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'src/data/breeds.js'), 'utf8');
  assert(content.includes('west_highland_white_terrier'), '未找到西高地品种数据');
  assert(content.includes('dogAgeToHuman'), '未找到年龄转换函数');
  assert(content.includes('calculateDailyFood'), '未找到营养计算函数');
});

test('useLocalStorage hook 正确实现', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'src/hooks/useLocalStorage.js'), 'utf8');
  assert(content.includes('useState'), '未使用 useState');
  assert(content.includes('useCallback'), '未使用 useCallback');
  assert(content.includes('localStorage'), '未使用 localStorage');
});

test('imageUtils.js 包含图片处理函数', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'src/utils/imageUtils.js'), 'utf8');
  assert(content.includes('processImage'), '未找到 processImage 函数');
  assert(content.includes('formatDate'), '未找到 formatDate 函数');
});

test('package.json 包含必要依赖', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8');
  const pkg = JSON.parse(content);
  assert(pkg.dependencies && pkg.dependencies.react, '未找到 react 依赖');
  assert(pkg.devDependencies && pkg.devDependencies.vite, '未找到 vite 依赖');
});

test('index.html 标题正确', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert(content.includes('汪星日记'), '未找到中文标题');
});

// 测试 E2E 测试文件
console.log('\n🧪 检查测试文件:');
test('E2E 测试文件存在', () => {
  const filePath = path.join(__dirname, 'e2e.test.cjs');
  assert(fs.existsSync(filePath), 'E2E 测试文件不存在');
});

// 测试报告
console.log('\n' + '='.repeat(50));
console.log('📊 测试结果总结');
console.log('='.repeat(50));
console.log(`  ✅ 通过: ${testsPassed}`);
console.log(`  ❌ 失败: ${testsFailed}`);
console.log(`  📝 总计: ${testsPassed + testsFailed}`);
console.log('='.repeat(50));

if (testsFailed === 0) {
  console.log('🎉 所有验证测试通过!');
  console.log('\n💡 下一步:');
  console.log('  1. 启动开发服务器: npm run dev');
  console.log('  2. 运行 E2E 测试: node tests/e2e.test.js');
  console.log('  3. 或安装 Playwright: npx playwright test');
} else {
  console.log('⚠️ 部分测试失败，请检查上述错误');
}

process.exit(testsFailed > 0 ? 1 : 0);
