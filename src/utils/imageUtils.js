// 图片处理工具函数

export function processImage(file, maxSize = 300) {
  return new Promise((resolve, reject) => {
    // 检查文件大小
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('图片大小不能超过10MB'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // 计算裁剪区域（正方形，取中心）
        const size = Math.min(img.width, img.height)
        const x = (img.width - size) / 2
        const y = (img.height - size) / 2

        // 创建canvas进行裁剪和缩放
        const canvas = document.createElement('canvas')
        canvas.width = maxSize
        canvas.height = maxSize
        const ctx = canvas.getContext('2d')

        // 绘制裁剪后的图片
        ctx.drawImage(img, x, y, size, size, 0, 0, maxSize, maxSize)

        // 转换为 base64（使用 JPEG 格式压缩到 60%）
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6)

        // 检查 base64 大小（localStorage 限制约 5MB）
        const base64Size = dataUrl.length * 0.75
        if (base64Size > 4 * 1024 * 1024) {
          reject(new Error('处理后的图片仍然太大，请选择更小的图片'))
          return
        }

        resolve(dataUrl)
      }
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

// 格式化日期
export function formatDate(dateStr, options = {}) {
  const date = new Date(dateStr)
  const defaultOptions = {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }
  return date.toLocaleDateString('zh-CN', { ...defaultOptions, ...options })
}

// 获取今天的日期字符串
export function getTodayStr() {
  return new Date().toISOString().split('T')[0]
}

// 获取相对日期
export function getRelativeDate(daysAgo = 0) {
  const date = new Date(Date.now() - daysAgo * 86400000)
  return date.toISOString().split('T')[0]
}

// 将 YYYY-MM-DD 字符串解析为 Date 对象
export function parseDateString(dateStr) {
  const [year, month, day] = dateStr.split('-')
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}
