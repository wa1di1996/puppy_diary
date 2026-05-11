// 狗狗品种数据库
export const breedsData = {
  west_highland_white_terrier: {
    id: 'west_highland_white_terrier',
    name: '西高地白梗',
    nameEn: 'West Highland White Terrier',
    origin: '苏格兰',
    weight: {
      min: 6,
      max: 9, // kg
      standard: 7
    },
    height: {
      min: 23,
      max: 28 // cm
    },
    lifeSpan: {
      min: 12,
      max: 16 // 年
    },
    nutrition: {
      // 按体重计算每日需求
      caloriesPerKg: 110, // 每公斤体重每日卡路里
      protein: 18, // 蛋白质百分比
      fat: 8, // 脂肪百分比
      feedingFrequency: {
        puppy: 4, // 幼犬每日次数
        adult: 2, // 成犬每日次数
        senior: 2 // 老犬每日次数
      }
    },
    grooming: {
      bathDays: 14, // 洗澡间隔天数
      groomingDays: 42 // 美容间隔天数
    },
    characteristics: ['活泼', '友好', '勇敢', '固执'],
    exercise: {
      daily: '30-60分钟',
      intensity: '中等'
    }
  },
  teddy: {
    id: 'teddy',
    name: '泰迪（贵宾）',
    nameEn: 'Toy Poodle',
    origin: '法国',
    weight: {
      min: 3,
      max: 7,
      standard: 5
    },
    height: {
      min: 24,
      max: 28
    },
    lifeSpan: {
      min: 12,
      max: 18
    },
    nutrition: {
      caloriesPerKg: 100,
      protein: 20,
      fat: 10,
      feedingFrequency: {
        puppy: 4,
        adult: 2,
        senior: 2
      }
    },
    grooming: {
      bathDays: 14,
      groomingDays: 35
    },
    characteristics: ['聪明', '活泼', '粘人', '不掉毛'],
    exercise: {
      daily: '30-60分钟',
      intensity: '中等'
    }
  },
  golden_retriever: {
    id: 'golden_retriever',
    name: '金毛寻回犬',
    nameEn: 'Golden Retriever',
    origin: '英国',
    weight: {
      min: 25,
      max: 34,
      standard: 30
    },
    height: {
      min: 51,
      max: 61
    },
    lifeSpan: {
      min: 10,
      max: 14
    },
    nutrition: {
      caloriesPerKg: 90,
      protein: 22,
      fat: 12,
      feedingFrequency: {
        puppy: 3,
        adult: 2,
        senior: 2
      }
    },
    grooming: {
      bathDays: 30,
      groomingDays: 60
    },
    characteristics: ['友善', '忠诚', '温和', '聪明'],
    exercise: {
      daily: '60-90分钟',
      intensity: '较高'
    }
  },
  labrador: {
    id: 'labrador',
    name: '拉布拉多',
    nameEn: 'Labrador Retriever',
    origin: '加拿大',
    weight: {
      min: 25,
      max: 36,
      standard: 30
    },
    height: {
      min: 54,
      max: 62
    },
    lifeSpan: {
      min: 10,
      max: 14
    },
    nutrition: {
      caloriesPerKg: 85,
      protein: 22,
      fat: 12,
      feedingFrequency: {
        puppy: 3,
        adult: 2,
        senior: 2
      }
    },
    grooming: {
      bathDays: 30,
      groomingDays: 56
    },
    characteristics: ['友好', '活泼', '忠诚', '贪吃'],
    exercise: {
      daily: '60-90分钟',
      intensity: '较高'
    }
  },
  french_bulldog: {
    id: 'french_bulldog',
    name: '法国斗牛犬',
    nameEn: 'French Bulldog',
    origin: '法国',
    weight: {
      min: 8,
      max: 14,
      standard: 11
    },
    height: {
      min: 30,
      max: 35
    },
    lifeSpan: {
      min: 10,
      max: 14
    },
    nutrition: {
      caloriesPerKg: 95,
      protein: 20,
      fat: 10,
      feedingFrequency: {
        puppy: 3,
        adult: 2,
        senior: 2
      }
    },
    grooming: {
      bathDays: 21,
      groomingDays: 42
    },
    characteristics: ['友善', '调皮', '安静', '易胖'],
    exercise: {
      daily: '30-60分钟',
      intensity: '较低'
    }
  },
  corgi: {
    id: 'corgi',
    name: '威尔士柯基',
    nameEn: 'Welsh Corgi',
    origin: '英国',
    weight: {
      min: 10,
      max: 14,
      standard: 12
    },
    height: {
      min: 25,
      max: 30
    },
    lifeSpan: {
      min: 12,
      max: 15
    },
    nutrition: {
      caloriesPerKg: 100,
      protein: 20,
      fat: 10,
      feedingFrequency: {
        puppy: 3,
        adult: 2,
        senior: 2
      }
    },
    grooming: {
      bathDays: 21,
      groomingDays: 56
    },
    characteristics: ['活泼', '聪明', '亲人', '倔强'],
    exercise: {
      daily: '60分钟',
      intensity: '中等'
    }
  }
}

// 计算狗狗年龄对应人类年龄（简化算法）
export function dogAgeToHuman(dogAge, breedSize = 'medium') {
  // 小型犬：1岁=15岁，之后每年+4岁
  // 中型犬：1岁=15岁，之后每年+5岁
  // 大型犬：1岁=15岁，之后每年+6岁

  const multipliers = {
    small: 4,
    medium: 5,
    large: 6
  }

  if (dogAge <= 1) {
    return dogAge * 15
  }

  const multiplier = multipliers[breedSize] || 5
  return 15 + (dogAge - 1) * multiplier
}

// 计算每日喂食量
export function calculateDailyFood(dogWeight, breedId) {
  const breed = breedsData[breedId]
  if (!breed) return null

  const dailyCalories = dogWeight * breed.nutrition.caloriesPerKg
  // 假设狗粮每克4卡路里
  const dailyFoodGrams = dailyCalories / 4

  return {
    calories: Math.round(dailyCalories),
    grams: Math.round(dailyFoodGrams),
    cups: Math.round(dailyFoodGrams / 120 * 10) / 10 // 约120克=1杯
  }
}

// 获取品种体型大小
export function getBreedSize(breedId) {
  const breed = breedsData[breedId]
  if (!breed) return 'medium'

  if (breed.weight.standard < 10) return 'small'
  if (breed.weight.standard > 25) return 'large'
  return 'medium'
}
