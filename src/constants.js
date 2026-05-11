export const PAGES = {
  HOME: 'home',
  PROFILE: 'profile',
  BREED_INFO: 'breed_info',
  DAILY_RECORD: 'daily_record',
  HEALTH_MANAGE: 'health_manage',
  RECORDS_LIST: 'records_list',
  DOG_FOOD: 'dog_food',
  COST_CALC: 'cost_calc',
}

export const STORAGE_KEYS = {
  PROFILE: 'puppy_diary_dog_profile',
  RECORDS: 'puppy_diary_daily_records',
  FOODS: 'puppy_diary_dog_food',
}

// 日常记录类型（记录一下 → 4种）
export const DAILY_TYPES = {
  feeding:  { label: '喂食',  unit: 'g',    placeholder: '例如: 100',  hasAmount: true,  step: '1',    showQuickDates: true },
  walking:  { label: '遛狗',  unit: '分钟',  placeholder: '例如: 30',   hasAmount: true,  step: '1',    showQuickDates: true },
  poop:     { label: '便便',  unit: '分',    placeholder: '',           hasAmount: false, step: '1',    showQuickDates: true },
  supplement: { label: '营养品', unit: '',   placeholder: '',           hasAmount: false, step: '1',    showQuickDates: true },
}

// 健康管理类型
export const HEALTH_TYPES = {
  bath:     { label: '洗澡',  unit: '',      placeholder: '',           hasAmount: false, step: '1',    showQuickDates: true },
  grooming: { label: '美容',  unit: '',      placeholder: '',           hasAmount: false, step: '1',    showQuickDates: true },
  weight:   { label: '体重',  unit: 'kg',    placeholder: '例如: 7.5',  hasAmount: true,  step: '0.1',  showQuickDates: false },
  health:   { label: '健康',  unit: '',      placeholder: '',           hasAmount: false, step: '1',    showQuickDates: false },
}

// 兼容旧引用
export const RECORD_TYPES = { ...DAILY_TYPES, ...HEALTH_TYPES, measurement: { label: '尺寸', unit: 'cm', placeholder: '', hasAmount: false, step: '1', showQuickDates: false } }

export const HEALTH_SUBTYPES = [
  { value: 'vaccine', label: '疫苗', fields: [{ key: 'vaccineName', label: '疫苗名称', placeholder: '例如: 狂犬疫苗' }, { key: 'nextDate', label: '下次接种日期', type: 'date' }] },
  { value: 'deworm_internal', label: '体内驱虫', fields: [{ key: 'drugName', label: '药品名称', placeholder: '例如: 拜耳' }, { key: 'nextDate', label: '下次驱虫日期', type: 'date' }] },
  { value: 'deworm_external', label: '体外驱虫', fields: [{ key: 'drugName', label: '药品名称', placeholder: '例如: 福来恩' }, { key: 'nextDate', label: '下次驱虫日期', type: 'date' }] },
  { value: 'checkup', label: '体检', fields: [{ key: 'checkItem', label: '体检项目', placeholder: '例如: 血常规' }, { key: 'checkResult', label: '检查结果', placeholder: '各项指标正常' }] },
]
