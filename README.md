# 汪星日记 (Puppy Diary)

毛孩子的专属记录 App，支持桌面端（macOS）和移动端（PWA）。

## 功能

- **狗狗档案** — 名字、品种、生日、体重、头像
- **品种信息** — 标准体重/身高/寿命、营养需求、个性化喂食建议
- **日常记录** — 喂食、遛狗、洗澡、美容（拔毛）、体重、健康（疫苗/驱虫/体检）
- **体重追踪** — 体重趋势图 + 品种标准区间对比
- **粑粑评分** — 1-5 分便便健康评估，可附带照片
- **狗粮管理** — 品牌/价格/用量记录，自动计算单价
- **美容提醒** — 根据品种自动计算洗澡/美容间隔，到期提醒
- **迷你日历** — 标注护理日期
- **数据导出/导入** — JSON 格式备份还原

## 技术栈

- React 19 + Vite 8
- Recharts（体重图表）
- Electron 41（macOS 桌面端）
- PWA（Service Worker + Web App Manifest）

## 开发

```bash
npm install
npm run dev          # 浏览器开发
npm run electron:dev # Electron 桌面开发
```

## 构建

```bash
npm run build             # Web 构建
npm run electron:dist     # macOS 安装包
```

## 在 iPhone 上使用

1. `npm run build && npm run preview`
2. iPhone Safari 打开 `http://<你的电脑IP>:4173`
3. 点击分享按钮 → 添加到主屏幕
