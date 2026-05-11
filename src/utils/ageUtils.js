// 工具函数：计算年龄
export function calculateAge(birthday) {
  if (!birthday) return 0
  const birth = new Date(birthday)
  const now = new Date()
  const totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())

  if (totalMonths < 0) {
    return Math.max(0, (totalMonths - 12) / 12)
  }

  let ageInYears = totalMonths / 12
  if (now.getDate() < birth.getDate()) {
    ageInYears -= 1/12/2
  }

  return Math.max(0, Math.round(ageInYears * 10) / 10)
}
