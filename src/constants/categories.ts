export interface CategoryGroup {
  label: string;
  icon: string;
  options: { label: string; value: string }[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    label: 'الرعاية الصحية',
    icon: '🩺',
    options: [
      { label: 'كل أطباء وصحة', value: 'صحة وطب' },
      { label: 'طبيب أطفال', value: 'أطفال' },
      { label: 'طبيب باطنة', value: 'باطنة' },
      { label: 'طبيب أسنان', value: 'أسنان' },
      { label: 'علاج طبيعي وتمريض', value: 'علاج طبيعي' },
    ],
  },
  {
    label: 'الهندسة والتشطيبات',
    icon: '📐',
    options: [
      { label: 'استشارات هندسية وديكور', value: 'هندسة' },
      { label: 'تصميم معماري وإنشائي', value: 'معماري' },
      { label: 'مطابخ ألومنيوم وعالي الجودة', value: 'مطابخ' },
      { label: 'نقاش وديكورات', value: 'نقاش' },
    ],
  },
  {
    label: 'الصيانة والحرف',
    icon: '🔨',
    options: [
      { label: 'سباكة وصحي', value: 'سباك' },
      { label: 'كهرباء وتأسيس', value: 'كهربائي' },
      { label: 'نجارة وأثاث', value: 'نجار' },
      { label: 'تكييف وتبريد وأجهزة منزلية', value: 'تكييف' },
    ],
  },
  {
    label: 'التعليم والتدريب',
    icon: '📚',
    options: [
      { label: 'معلمون وتأسيس لغات', value: 'تعليم' },
      { label: 'استشارات تدريبية', value: 'تدريب' },
    ],
  },
  {
    label: 'القانون والماليات',
    icon: '⚖️',
    options: [
      { label: 'محاماة واستشارات قانونية', value: 'محام' },
      { label: 'محاسبة ومراجعة قانونية', value: 'محاسب' },
    ],
  },
  {
    label: 'التقنية والإعلام',
    icon: '💻',
    options: [
      { label: 'تطوير برمجيات ومواقع', value: 'برمجة' },
      { label: 'دعاية وإعلان وتصميم جرافيك', value: 'تصميم' },
      { label: 'تصوير ومناسبات', value: 'تصوير' },
    ],
  },
  {
    label: 'النقل والخدمات',
    icon: '🚗',
    options: [
      { label: 'سفريات ومشاوير ونقل أثاث', value: 'نقل' },
    ],
  },
];

export const QUICK_CHIPS = [
  { id: 'all', label: '🌟 الكل', value: '' },
  { id: 'electric', label: '⚡ كهربائي', value: 'كهربائي' },
  { id: 'plumb', label: '🚿 سباك', value: 'سباك' },
  { id: 'carpenter', label: '🪚 نجار', value: 'نجار' },
  { id: 'paint', label: '🎨 نقاش', value: 'نقاش' },
  { id: 'ac', label: '❄️ تكييف', value: 'تكييف' },
  { id: 'aluminum', label: '🚪 مطابخ وألومنيوم', value: 'مطابخ' },
  { id: 'doc', label: '🩺 طبيب', value: 'باطنة' },
  { id: 'eng', label: '📐 مهندس', value: 'هندسة' },
  { id: 'acc', label: '📊 محاسب', value: 'محاسب' },
  { id: 'lawyer', label: '⚖️ محامي', value: 'محام' },
];
