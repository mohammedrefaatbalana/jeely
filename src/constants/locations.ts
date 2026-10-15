export interface LocationGroup {
  label: string;
  icon: string;
  options: { label: string; value: string }[];
}

export const LOCATION_GROUPS: LocationGroup[] = [
  {
    label: 'أسوان والنوبة',
    icon: '🌴',
    options: [
      { label: 'مدينة أسوان', value: 'أسوان' },
      { label: 'نصر النوبة', value: 'نصر النوبة' },
      { label: 'غرب سهيل', value: 'غرب سهيل' },
      { label: 'بلانة', value: 'بلانة' },
      { label: 'أدندان', value: 'أدندان' },
      { label: 'قسطل', value: 'قسطل' },
      { label: 'توشكى', value: 'توشكى' },
      { label: 'دراو', value: 'دراو' },
      { label: 'كوم أمبو', value: 'كوم أمبو' },
    ],
  },
  {
    label: 'القاهرة الكبرى',
    icon: '🏛️',
    options: [
      { label: 'القاهرة', value: 'القاهرة' },
      { label: 'المعادي', value: 'المعادي' },
      { label: 'مدينة نصر', value: 'مدينة نصر' },
      { label: 'الجيزة', value: 'الجيزة' },
      { label: '6 أكتوبر والشيخ زايد', value: 'أكتوبر' },
    ],
  },
  {
    label: 'الإسكندرية والساحل',
    icon: '🌊',
    options: [
      { label: 'الإسكندرية', value: 'الإسكندرية' },
      { label: 'سموحة', value: 'سموحة' },
    ],
  },
  {
    label: 'مدن ومحافظات أخرى',
    icon: '🌾',
    options: [
      { label: 'الأقصر', value: 'الأقصر' },
      { label: 'قنا', value: 'قنا' },
      { label: 'سوهاج', value: 'سوهاج' },
    ],
  },
];

export const ALL_VILLAGES_LIST = [
  'أسوان',
  'نصر النوبة',
  'غرب سهيل',
  'بلانة',
  'أدندان',
  'قسطل',
  'توشكى',
  'دراو',
  'كوم أمبو',
  'القاهرة',
  'المعادي',
  'مدينة نصر',
  'الجيزة',
  'أكتوبر',
  'الإسكندرية',
  'سموحة',
  'الأقصر',
  'قنا',
  'سوهاج',
];
