export interface TablerChapter {
  id: number;
  name: string;
  page: number;
  desc: string;
  icon: string;
}

export interface TablerModel {
  slug: string;
  name: string;
  chapter: number;
  icon: string;
  license: string;
}

export const TABLER_CHAPTERS: TablerChapter[] = [
  { id: 1, name: "الجهاز العصبي", page: 5, desc: "الخلية العصبية والدماغ والحبل الشوكي", icon: "brain" },
  { id: 2, name: "الجهاز الهيكلي", page: 15, desc: "العظام والمفاصل", icon: "book" },
  { id: 3, name: "الجهاز العضلي", page: 31, desc: "العضلات وأنواعها", icon: "heart" },
  { id: 4, name: "الجهاز الهضمي", page: 41, desc: "الهضم والامتصاص", icon: "book" },
  { id: 5, name: "جهاز الدوران", page: 57, desc: "القلب والدم والأوعية", icon: "heart" },
  { id: 6, name: "جهاز التنفس", page: 71, desc: "الرئتان والتبادل الغازي", icon: "heart" },
  { id: 7, name: "الجهاز البولي والإخراج", page: 81, desc: "الكليتان والإخراج", icon: "flask-2" },
  { id: 8, name: "الجهاز التناسلي", page: 93, desc: "التكاثر وأعضاء الجهاز", icon: "book" },
  { id: 9, name: "أعضاء الحس", page: 101, desc: "العين والأذن والحواس", icon: "brain" },
  { id: 10, name: "الإفراز", page: 115, desc: "الغدد والهرمونات", icon: "flask-2" },
  { id: 11, name: "المناعة والأمراض", page: 123, desc: "المناعة والدفاع عن الجسم", icon: "heart" }
];

export const TABLER_MODELS: TablerModel[] = [
  { slug: "brain", name: "الدماغ", chapter: 1, icon: "brain", license: "CC BY 4.0" },
  { slug: "spinal-cord", name: "الحبل الشوكي", chapter: 1, icon: "spinal-cord", license: "CC BY-SA 2.1 JP" },
  { slug: "skeleton", name: "الهيكل العظمي", chapter: 2, icon: "skeleton", license: "CC BY-SA 2.1 JP" },
  { slug: "muscles", name: "العضلات", chapter: 3, icon: "muscles", license: "CC BY-SA 2.1 JP" },
  { slug: "stomach", name: "المعدة", chapter: 4, icon: "stomach", license: "CC BY-SA 2.1 JP" },
  { slug: "liver", name: "الكبد", chapter: 4, icon: "liver", license: "CC BY 4.0" },
  { slug: "heart", name: "القلب", chapter: 5, icon: "heart", license: "CC BY 4.0" },
  { slug: "lungs", name: "الرئتان", chapter: 6, icon: "lungs", license: "CC BY-SA 2.1 JP" },
  { slug: "kidneys", name: "الكليتان", chapter: 7, icon: "kidneys", license: "CC BY 4.0" },
  { slug: "eye", name: "العين", chapter: 9, icon: "eye", license: "راجع مصدر المجسم" },
  { slug: "ear", name: "الأذن", chapter: 9, icon: "ear", license: "راجع مصدر المجسم" },
  { slug: "thyroid", name: "الغدة الدرقية", chapter: 10, icon: "thyroid", license: "راجع مصدر المجسم" },
  { slug: "adrenals", name: "الغدتان الكظريتان", chapter: 10, icon: "adrenals", license: "راجع مصدر المجسم" },
  { slug: "spleen", name: "الطحال", chapter: 11, icon: "spleen", license: "راجع مصدر المجسم" }
];

export const TABLER_SOURCES = [
  {
    name: "Tabler Starter",
    desc: "قالب الواجهة والبطاقات والأزرار",
    license: "MIT",
    url: "https://github.com/tabler/tabler-starter"
  },
  {
    name: "Tabler Core",
    desc: "مكونات لوحة التحكم مع دعم العربية RTL الكامل",
    license: "MIT",
    url: "https://github.com/tabler/tabler"
  },
  {
    name: "Tabler Icons",
    desc: "ملفات SVG أصلية مأخوذة مباشرة من GitHub (assets/tabler-icons.svg)",
    license: "MIT",
    url: "https://github.com/tabler/tabler-icons"
  },
  {
    name: "Google Model Viewer",
    desc: "عارض تفاعلي للمجسمات ثلاثية الأبعاد 360° مع دعم اللمس",
    license: "Apache 2.0",
    url: "https://github.com/google/model-viewer"
  },
  {
    name: "OrganUI",
    desc: "مجسمات تشريحية من مستودعات GitHub (تراخيص متنوعة لكل ملف)",
    license: "BodyParts3D, CC BY 4.0, CC BY-SA 2.1 JP",
    url: "https://github.com/organui"
  }
];
