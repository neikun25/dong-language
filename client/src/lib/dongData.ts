/*
 * 侗族语言学习平台 - 核心数据库
 * 包含侗语词汇、分类、课程、文化知识等
 */

// ========== 词汇数据 ==========
export interface DongWord {
  id: string;
  chinese: string;
  dong: string;
  dongPinyin: string;
  mandarinPinyin: string;
  category: string;
  example?: string;
  exampleDong?: string;
  difficulty: 1 | 2 | 3; // 1=初级 2=中级 3=高级
}

export const dongDictionary: DongWord[] = [
  // 日常问候
  { id: "w001", chinese: "你好", dong: "mii laox", dongPinyin: "mi˧ lau˦", mandarinPinyin: "nǐ hǎo", category: "日常问候", example: "你好，朋友！", exampleDong: "Mii laox, bioul nyenc!", difficulty: 1 },
  { id: "w002", chinese: "谢谢", dong: "laox siik", dongPinyin: "lau˦ si:k˧", mandarinPinyin: "xiè xie", category: "日常问候", example: "谢谢你的帮助", exampleDong: "Laox siik mii bangc", difficulty: 1 },
  { id: "w003", chinese: "再见", dong: "bail laox", dongPinyin: "pai˩ lau˦", mandarinPinyin: "zài jiàn", category: "日常问候", example: "明天再见", exampleDong: "Wangl nyiedl bail laox", difficulty: 1 },
  { id: "w004", chinese: "早上好", dong: "zaol sangc laox", dongPinyin: "tsau˩ saŋ˧ lau˦", mandarinPinyin: "zǎo shang hǎo", category: "日常问候", difficulty: 1 },
  { id: "w005", chinese: "晚上好", dong: "wanl sangc laox", dongPinyin: "wan˩ saŋ˧ lau˦", mandarinPinyin: "wǎn shang hǎo", category: "日常问候", difficulty: 1 },
  { id: "w006", chinese: "对不起", dong: "duix buc qiil", dongPinyin: "tui˦ pu˧ tɕi:˩", mandarinPinyin: "duì bu qǐ", category: "日常问候", difficulty: 1 },
  { id: "w007", chinese: "没关系", dong: "meix guanl xil", dongPinyin: "mei˦ kuan˩ ɕi˩", mandarinPinyin: "méi guān xi", category: "日常问候", difficulty: 1 },

  // 家庭称谓
  { id: "w010", chinese: "父亲", dong: "bux", dongPinyin: "pu˦", mandarinPinyin: "fù qīn", category: "家庭称谓", example: "我的父亲", exampleDong: "Wul bux", difficulty: 1 },
  { id: "w011", chinese: "母亲", dong: "max", dongPinyin: "ma˦", mandarinPinyin: "mǔ qīn", category: "家庭称谓", example: "我的母亲", exampleDong: "Wul max", difficulty: 1 },
  { id: "w012", chinese: "哥哥", dong: "beix", dongPinyin: "pei˦", mandarinPinyin: "gē ge", category: "家庭称谓", difficulty: 1 },
  { id: "w013", chinese: "姐姐", dong: "jax", dongPinyin: "tɕa˦", mandarinPinyin: "jiě jie", category: "家庭称谓", difficulty: 1 },
  { id: "w014", chinese: "弟弟", dong: "nongx", dongPinyin: "noŋ˦", mandarinPinyin: "dì di", category: "家庭称谓", difficulty: 1 },
  { id: "w015", chinese: "妹妹", dong: "muix", dongPinyin: "mui˦", mandarinPinyin: "mèi mei", category: "家庭称谓", difficulty: 1 },
  { id: "w016", chinese: "爷爷", dong: "gongx", dongPinyin: "koŋ˦", mandarinPinyin: "yé ye", category: "家庭称谓", difficulty: 1 },
  { id: "w017", chinese: "奶奶", dong: "naix", dongPinyin: "nai˦", mandarinPinyin: "nǎi nai", category: "家庭称谓", difficulty: 1 },
  { id: "w018", chinese: "朋友", dong: "bioul nyenc", dongPinyin: "piou˩ ɲen˧", mandarinPinyin: "péng you", category: "家庭称谓", example: "我的好朋友", exampleDong: "Wul bioul nyenc laox", difficulty: 1 },

  // 自然万物
  { id: "w020", chinese: "山", dong: "bya", dongPinyin: "pja˩", mandarinPinyin: "shān", category: "自然万物", example: "高山", exampleDong: "Bya goux", difficulty: 1 },
  { id: "w021", chinese: "水", dong: "naml", dongPinyin: "nam˩", mandarinPinyin: "shuǐ", category: "自然万物", difficulty: 1 },
  { id: "w022", chinese: "太阳", dong: "wenc nyiedl", dongPinyin: "wen˧ ɲiet˩", mandarinPinyin: "tài yáng", category: "自然万物", difficulty: 1 },
  { id: "w023", chinese: "月亮", dong: "laox nyiedl", dongPinyin: "lau˦ ɲiet˩", mandarinPinyin: "yuè liang", category: "自然万物", difficulty: 1 },
  { id: "w024", chinese: "星星", dong: "daol", dongPinyin: "tau˩", mandarinPinyin: "xīng xing", category: "自然万物", difficulty: 1 },
  { id: "w025", chinese: "风", dong: "naemx", dongPinyin: "naem˦", mandarinPinyin: "fēng", category: "自然万物", difficulty: 1 },
  { id: "w026", chinese: "雨", dong: "naemx raemx", dongPinyin: "naem˦ ɣaem˦", mandarinPinyin: "yǔ", category: "自然万物", difficulty: 1 },
  { id: "w027", chinese: "花", dong: "bax", dongPinyin: "pa˦", mandarinPinyin: "huā", category: "自然万物", difficulty: 1 },
  { id: "w028", chinese: "树", dong: "maix", dongPinyin: "mai˦", mandarinPinyin: "shù", category: "自然万物", difficulty: 2 },
  { id: "w029", chinese: "鸟", dong: "rogl", dongPinyin: "ɣok˩", mandarinPinyin: "niǎo", category: "自然万物", difficulty: 1 },
  { id: "w030", chinese: "鱼", dong: "bax", dongPinyin: "pa˦", mandarinPinyin: "yú", category: "自然万物", difficulty: 1 },

  // 饮食
  { id: "w040", chinese: "吃饭", dong: "nyaoc jax", dongPinyin: "ɲau˧ tɕa˦", mandarinPinyin: "chī fàn", category: "饮食", example: "我们一起吃饭", exampleDong: "Jaengl nyaoc jax", difficulty: 1 },
  { id: "w041", chinese: "喝水", dong: "nyaoc naml", dongPinyin: "ɲau˧ nam˩", mandarinPinyin: "hē shuǐ", category: "饮食", difficulty: 1 },
  { id: "w042", chinese: "米饭", dong: "jax", dongPinyin: "tɕa˦", mandarinPinyin: "mǐ fàn", category: "饮食", difficulty: 1 },
  { id: "w043", chinese: "酸鱼", dong: "bax siinl", dongPinyin: "pa˦ si:n˩", mandarinPinyin: "suān yú", category: "饮食", example: "侗族酸鱼是特色美食", difficulty: 2 },
  { id: "w044", chinese: "糯米", dong: "jax nox", dongPinyin: "tɕa˦ no˦", mandarinPinyin: "nuò mǐ", category: "饮食", difficulty: 2 },
  { id: "w045", chinese: "油茶", dong: "jax sac", dongPinyin: "tɕa˦ sa˧", mandarinPinyin: "yóu chá", category: "饮食", example: "侗族油茶是待客佳品", difficulty: 2 },
  { id: "w046", chinese: "酒", dong: "laox jiul", dongPinyin: "lau˦ tɕiu˩", mandarinPinyin: "jiǔ", category: "饮食", difficulty: 1 },

  // 文化艺术
  { id: "w050", chinese: "唱歌", dong: "al gal", dongPinyin: "a˩ ka˩", mandarinPinyin: "chàng gē", category: "文化艺术", example: "侗族人爱唱歌", exampleDong: "Gaeml al gal", difficulty: 1 },
  { id: "w051", chinese: "跳舞", dong: "diux wux", dongPinyin: "tiu˦ wu˦", mandarinPinyin: "tiào wǔ", category: "文化艺术", difficulty: 1 },
  { id: "w052", chinese: "大歌", dong: "al laox", dongPinyin: "a˩ lau˦", mandarinPinyin: "dà gē", category: "文化艺术", example: "侗族大歌是世界非遗", exampleDong: "Al laox Gaeml", difficulty: 2 },
  { id: "w053", chinese: "鼓楼", dong: "gul laox", dongPinyin: "ku˩ lau˦", mandarinPinyin: "gǔ lóu", category: "文化艺术", example: "鼓楼是侗寨的标志", exampleDong: "Gul laox Gaeml", difficulty: 2 },
  { id: "w054", chinese: "风雨桥", dong: "jiul bail", dongPinyin: "tɕiu˩ pai˩", mandarinPinyin: "fēng yǔ qiáo", category: "文化艺术", difficulty: 2 },
  { id: "w055", chinese: "芦笙", dong: "lenx", dongPinyin: "len˦", mandarinPinyin: "lú shēng", category: "文化艺术", example: "芦笙是侗族传统乐器", difficulty: 2 },
  { id: "w056", chinese: "刺绣", dong: "xiul", dongPinyin: "ɕiu˩", mandarinPinyin: "cì xiù", category: "文化艺术", difficulty: 2 },
  { id: "w057", chinese: "侗布", dong: "bux Gaeml", dongPinyin: "pu˦ kaem˩", mandarinPinyin: "dòng bù", category: "文化艺术", difficulty: 3 },

  // 数字
  { id: "w060", chinese: "一", dong: "idl", dongPinyin: "it˩", mandarinPinyin: "yī", category: "数字", difficulty: 1 },
  { id: "w061", chinese: "二", dong: "nuih", dongPinyin: "nui˧˥", mandarinPinyin: "èr", category: "数字", difficulty: 1 },
  { id: "w062", chinese: "三", dong: "saml", dongPinyin: "sam˩", mandarinPinyin: "sān", category: "数字", difficulty: 1 },
  { id: "w063", chinese: "四", dong: "seix", dongPinyin: "sei˦", mandarinPinyin: "sì", category: "数字", difficulty: 1 },
  { id: "w064", chinese: "五", dong: "hac", dongPinyin: "ha˧", mandarinPinyin: "wǔ", category: "数字", difficulty: 1 },
  { id: "w065", chinese: "六", dong: "logc", dongPinyin: "lok˧", mandarinPinyin: "liù", category: "数字", difficulty: 1 },
  { id: "w066", chinese: "七", dong: "cedc", dongPinyin: "tɕet˧", mandarinPinyin: "qī", category: "数字", difficulty: 1 },
  { id: "w067", chinese: "八", dong: "betc", dongPinyin: "pet˧", mandarinPinyin: "bā", category: "数字", difficulty: 1 },
  { id: "w068", chinese: "九", dong: "jiux", dongPinyin: "tɕiu˦", mandarinPinyin: "jiǔ", category: "数字", difficulty: 1 },
  { id: "w069", chinese: "十", dong: "sibc", dongPinyin: "sip˧", mandarinPinyin: "shí", category: "数字", difficulty: 1 },

  // 身体部位
  { id: "w070", chinese: "头", dong: "hnauc", dongPinyin: "n̥au˧", mandarinPinyin: "tóu", category: "身体部位", difficulty: 1 },
  { id: "w071", chinese: "眼睛", dong: "dal", dongPinyin: "ta˩", mandarinPinyin: "yǎn jing", category: "身体部位", difficulty: 1 },
  { id: "w072", chinese: "耳朵", dong: "nyac", dongPinyin: "ɲa˧", mandarinPinyin: "ěr duo", category: "身体部位", difficulty: 1 },
  { id: "w073", chinese: "手", dong: "mux", dongPinyin: "mu˦", mandarinPinyin: "shǒu", category: "身体部位", difficulty: 1 },
  { id: "w074", chinese: "脚", dong: "dinl", dongPinyin: "tin˩", mandarinPinyin: "jiǎo", category: "身体部位", difficulty: 1 },
  { id: "w075", chinese: "心", dong: "siml", dongPinyin: "sim˩", mandarinPinyin: "xīn", category: "身体部位", difficulty: 1 },

  // 日常动作
  { id: "w080", chinese: "走", dong: "bail", dongPinyin: "pai˩", mandarinPinyin: "zǒu", category: "日常动作", difficulty: 1 },
  { id: "w081", chinese: "看", dong: "nyaengx", dongPinyin: "ɲaeŋ˦", mandarinPinyin: "kàn", category: "日常动作", difficulty: 1 },
  { id: "w082", chinese: "听", dong: "nyinc", dongPinyin: "ɲin˧", mandarinPinyin: "tīng", category: "日常动作", difficulty: 1 },
  { id: "w083", chinese: "说", dong: "gangx", dongPinyin: "kaŋ˦", mandarinPinyin: "shuō", category: "日常动作", difficulty: 1 },
  { id: "w084", chinese: "学习", dong: "xuedc sibc", dongPinyin: "ɕuet˧ sip˧", mandarinPinyin: "xué xí", category: "日常动作", difficulty: 1 },
  { id: "w085", chinese: "工作", dong: "gongx zuox", dongPinyin: "koŋ˦ tsuo˦", mandarinPinyin: "gōng zuò", category: "日常动作", difficulty: 2 },
  { id: "w086", chinese: "睡觉", dong: "ninx", dongPinyin: "nin˦", mandarinPinyin: "shuì jiào", category: "日常动作", difficulty: 1 },

  // 场所建筑
  { id: "w090", chinese: "家", dong: "yangh", dongPinyin: "jaŋ˧˥", mandarinPinyin: "jiā", category: "场所建筑", example: "回家", exampleDong: "Bail yangh", difficulty: 1 },
  { id: "w091", chinese: "学校", dong: "xuedc dangx", dongPinyin: "ɕuet˧ taŋ˦", mandarinPinyin: "xué xiào", category: "场所建筑", difficulty: 1 },
  { id: "w092", chinese: "寨子", dong: "zail", dongPinyin: "tsai˩", mandarinPinyin: "zhài zi", category: "场所建筑", difficulty: 2 },
  { id: "w093", chinese: "田", dong: "nasx", dongPinyin: "nas˦", mandarinPinyin: "tián", category: "场所建筑", difficulty: 1 },
  { id: "w094", chinese: "河", dong: "bail naml", dongPinyin: "pai˩ nam˩", mandarinPinyin: "hé", category: "场所建筑", difficulty: 1 },
];

// ========== 词汇分类 ==========
export const categories = [
  { name: "日常问候", icon: "👋", count: 7 },
  { name: "家庭称谓", icon: "👨‍👩‍👧‍👦", count: 9 },
  { name: "自然万物", icon: "🌿", count: 11 },
  { name: "饮食", icon: "🍚", count: 7 },
  { name: "文化艺术", icon: "🎵", count: 8 },
  { name: "数字", icon: "🔢", count: 10 },
  { name: "身体部位", icon: "🫀", count: 6 },
  { name: "日常动作", icon: "🏃", count: 7 },
  { name: "场所建筑", icon: "🏠", count: 5 },
];

// ========== 课程数据 ==========
export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 1 | 2 | 3;
  wordIds: string[];
  type: "vocabulary" | "sentence" | "culture";
}

export const dongLessons: Lesson[] = [
  { id: "L01", title: "第一课：基础问候", description: "学习侗语中最常用的问候语", category: "日常问候", difficulty: 1, wordIds: ["w001", "w002", "w003", "w004", "w005"], type: "vocabulary" },
  { id: "L02", title: "第二课：家人称呼", description: "学习侗语中家庭成员的称呼", category: "家庭称谓", difficulty: 1, wordIds: ["w010", "w011", "w012", "w013", "w014", "w015"], type: "vocabulary" },
  { id: "L03", title: "第三课：自然风光", description: "学习与自然相关的侗语词汇", category: "自然万物", difficulty: 1, wordIds: ["w020", "w021", "w022", "w023", "w024", "w025"], type: "vocabulary" },
  { id: "L04", title: "第四课：侗族美食", description: "学习侗族饮食文化相关词汇", category: "饮食", difficulty: 1, wordIds: ["w040", "w041", "w042", "w043", "w044", "w045"], type: "vocabulary" },
  { id: "L05", title: "第五课：数字入门", description: "学习侗语数字一到十", category: "数字", difficulty: 1, wordIds: ["w060", "w061", "w062", "w063", "w064", "w065", "w066", "w067", "w068", "w069"], type: "vocabulary" },
  { id: "L06", title: "第六课：文化瑰宝", description: "学习侗族文化艺术相关词汇", category: "文化艺术", difficulty: 2, wordIds: ["w050", "w051", "w052", "w053", "w054", "w055"], type: "vocabulary" },
  { id: "L07", title: "第七课：身体部位", description: "学习侗语中身体各部位的说法", category: "身体部位", difficulty: 1, wordIds: ["w070", "w071", "w072", "w073", "w074", "w075"], type: "vocabulary" },
  { id: "L08", title: "第八课：日常动作", description: "学习侗语中常用动词", category: "日常动作", difficulty: 1, wordIds: ["w080", "w081", "w082", "w083", "w084", "w085", "w086"], type: "vocabulary" },
  { id: "L09", title: "第九课：礼貌用语", description: "学习侗语中的礼貌表达", category: "日常问候", difficulty: 2, wordIds: ["w006", "w007", "w001", "w002"], type: "sentence" },
  { id: "L10", title: "第十课：场所与建筑", description: "学习侗语中场所建筑的说法", category: "场所建筑", difficulty: 2, wordIds: ["w090", "w091", "w092", "w093", "w094"], type: "vocabulary" },
];

// ========== 普通话学习数据 ==========
export interface MandarinLesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 1 | 2 | 3;
  items: MandarinItem[];
}

export interface MandarinItem {
  text: string;
  pinyin: string;
  tips: string[];
  type: "initials" | "finals" | "tones" | "sentence";
}

export const mandarinLessons: MandarinLesson[] = [
  {
    id: "M01", title: "声母练习", description: "练习普通话声母的正确发音", category: "声母", difficulty: 1,
    items: [
      { text: "b p m f", pinyin: "bō pō mō fō", tips: ["b是不送气音", "p是送气音", "注意唇部位置"], type: "initials" },
      { text: "d t n l", pinyin: "dē tē nē lē", tips: ["d舌尖抵住上齿龈", "n和l注意区分", "侗语母语者容易混淆n和l"], type: "initials" },
      { text: "g k h", pinyin: "gē kē hē", tips: ["g是不送气音", "k是送气音", "h是擦音"], type: "initials" },
      { text: "zh ch sh r", pinyin: "zhī chī shī rì", tips: ["翘舌音要到位", "舌尖翘起抵住硬腭前部", "侗语中没有翘舌音，需要特别练习"], type: "initials" },
      { text: "z c s", pinyin: "zī cī sī", tips: ["平舌音", "舌尖抵住上齿背", "注意与翘舌音区分"], type: "initials" },
    ],
  },
  {
    id: "M02", title: "韵母练习", description: "练习普通话韵母的正确发音", category: "韵母", difficulty: 1,
    items: [
      { text: "a o e i u ü", pinyin: "ā ō ē ī ū ǖ", tips: ["单韵母是基础", "ü发音时嘴唇圆而小"], type: "finals" },
      { text: "ai ei ao ou", pinyin: "āi ēi āo ōu", tips: ["复韵母注意滑动", "从前一个元音滑向后一个"], type: "finals" },
      { text: "an en ang eng", pinyin: "ān ēn āng ēng", tips: ["前鼻音和后鼻音要区分", "侗语母语者需特别注意"], type: "finals" },
    ],
  },
  {
    id: "M03", title: "四声练习", description: "练习普通话四个声调", category: "声调", difficulty: 1,
    items: [
      { text: "妈 麻 马 骂", pinyin: "mā má mǎ mà", tips: ["一声高平调55", "二声中升调35", "三声降升调214", "四声全降调51"], type: "tones" },
      { text: "八 拔 把 爸", pinyin: "bā bá bǎ bà", tips: ["一声保持高平", "三声要先降后升", "四声快速下降"], type: "tones" },
      { text: "天 甜 舔 殿", pinyin: "tiān tián tiǎn diàn", tips: ["注意声调的起点和终点", "三声在连读中常变为半三声"], type: "tones" },
    ],
  },
  {
    id: "M04", title: "日常会话", description: "练习日常生活中的普通话对话", category: "会话", difficulty: 2,
    items: [
      { text: "你好，请问你叫什么名字？", pinyin: "nǐ hǎo, qǐng wèn nǐ jiào shén me míng zi?", tips: ["注意'请问'的语气", "名字的'字'读轻声"], type: "sentence" },
      { text: "我是侗族人，来自贵州。", pinyin: "wǒ shì dòng zú rén, lái zì guì zhōu.", tips: ["'侗'读第四声", "'贵州'注意声调"], type: "sentence" },
      { text: "欢迎来到我们的侗寨。", pinyin: "huān yíng lái dào wǒ men de dòng zhài.", tips: ["'欢迎'要热情", "'侗寨'的'寨'读第四声"], type: "sentence" },
    ],
  },
  {
    id: "M05", title: "绕口令练习", description: "通过绕口令提高普通话发音准确度", category: "绕口令", difficulty: 3,
    items: [
      { text: "四是四，十是十，十四是十四，四十是四十。", pinyin: "sì shì sì, shí shì shí, shí sì shì shí sì, sì shí shì sì shí.", tips: ["区分平舌音s和翘舌音sh", "这是侗语母语者最需要练习的"], type: "sentence" },
      { text: "吃葡萄不吐葡萄皮，不吃葡萄倒吐葡萄皮。", pinyin: "chī pú tao bù tǔ pú tao pí, bù chī pú tao dào tǔ pú tao pí.", tips: ["注意'不'的变调", "连读时保持清晰"], type: "sentence" },
    ],
  },
];

// ========== 文化知识数据 ==========
export interface CultureArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  image: string;
}

export const cultureArticles: CultureArticle[] = [
  {
    id: "C01", title: "侗族鼓楼", category: "建筑",
    summary: "鼓楼是侗寨的标志性建筑，不用一钉一铆，全靠木榫穿合。",
    content: "侗族鼓楼是侗族建筑艺术的杰出代表，通常建在寨子中心，是侗族人民集会、议事、娱乐的重要场所。鼓楼的建造不用一钉一铆，全靠木榫穿合，造型独特，气势恢宏。鼓楼一般为多层宝塔形，底层为正方形或六角形，逐层收缩，顶部为攒尖顶。鼓楼的层数多为奇数，以示吉祥。鼓楼内部设有火塘，是寨民们冬天取暖、聊天的地方。每逢节日或重大活动，寨民们都会聚集在鼓楼前的广场上，举行歌舞等庆祝活动。",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-drum-tower_01b1add8.jpg",
  },
  {
    id: "C02", title: "侗族大歌", category: "音乐",
    summary: "侗族大歌是多声部民间歌唱形式，已列入世界非物质文化遗产。",
    content: "侗族大歌（Kam Grand Choirs）是侗族多声部民间歌唱形式，2009年被列入联合国教科文组织人类非物质文化遗产代表作名录。侗族大歌不使用指挥和伴奏，由歌队自然和声，模拟鸟叫虫鸣、高山流水等自然之音。大歌的演唱形式多为一领众和，高低声部交织，和声丰富。歌词内容涵盖历史传说、生产劳动、爱情婚姻等方面。侗族大歌不仅是一种音乐形式，更是侗族文化传承的重要载体，被誉为'清泉般闪光的音乐，掠过古梦边缘的旋律'。",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-grand-song_7810d8ed.jpg",
  },
  {
    id: "C03", title: "风雨桥", category: "建筑",
    summary: "风雨桥集桥、廊、亭于一体，是侗族建筑艺术的瑰宝。",
    content: "风雨桥又称花桥，是侗族独有的桥梁建筑形式。风雨桥横跨溪河之上，集桥、廊、亭于一体，既可通行，又可避风雨、休憩聚会。桥面铺设木板，两侧设有栏杆和长凳，桥上建有亭阁，飞檐翘角，雕梁画栋。风雨桥的建造同样不用一钉一铆，全靠木榫穿合，体现了侗族工匠的高超技艺。最著名的风雨桥是广西三江的程阳永济桥，全长77.76米，被列为全国重点文物保护单位。",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-drum-tower_01b1add8.jpg",
  },
  {
    id: "C04", title: "侗族服饰", category: "服饰",
    summary: "侗族服饰以蓝靛染布和精美银饰为主要特色。",
    content: "侗族服饰以蓝靛染布为主要特色，男女服饰各有特点。女性服饰华丽精美，以银饰为重要装饰，包括银冠、银项圈、银手镯等，工艺精湛。侗布经过反复浸染、捶打，呈现出独特的深蓝色光泽。侗族刺绣技艺精湛，图案多取材于自然界的花鸟鱼虫，色彩鲜艳，构图精美。侗族女性的盛装通常包括头饰、上衣、裙子、围裙、绑腿等，全套银饰重达数公斤，是侗族女性美丽与财富的象征。",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-costume_bc089a1a.jpg",
  },
  {
    id: "C05", title: "侗族节日", category: "节日",
    summary: "侗年、花炮节、斗牛节等是侗族最重要的传统节日。",
    content: "侗族有许多传统节日，其中侗年是最隆重的节日，通常在农历十一月举行，各寨杀猪宰牛，举行盛大的庆祝活动。花炮节以抢花炮为主要活动，场面热烈壮观，是侗族青年展示力量和勇气的舞台。斗牛节是侗族另一个重要节日，各寨精心饲养的斗牛在赛场上角逐，观众如潮。赶坳是侗族青年男女社交的重要场合，通过对歌、踩歌堂等形式增进感情，传承文化。这些节日不仅是娱乐活动，更是侗族文化传承和社会凝聚的重要纽带。",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-festival_961bc5d9.png",
  },
  {
    id: "C06", title: "侗族饮食文化", category: "饮食",
    summary: "酸鱼、油茶、糯米饭是侗族最具特色的传统美食。",
    content: "侗族饮食文化独具特色，以酸味食品最为著名。侗族有'侗不离酸'的说法，酸鱼、酸肉、酸菜是侗族餐桌上的常见菜肴。酸鱼的制作需要将鲜鱼腌制数月甚至数年，味道醇厚鲜美。油茶是侗族待客的佳品，用茶叶、花生、糯米等材料制成，香浓可口。糯米饭是侗族的主食之一，侗族人善于用糯米制作各种美食，如糍粑、粽子等。侗族的饮食文化不仅体现了侗族人民的智慧，也反映了侗族地区的自然环境和生产方式。",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-culture-hero-bXVLgdU2pfKceyYv2mwSed.webp",
  },
];

// ========== 学习进度管理 ==========
export interface LearningProgress {
  completedLessons: string[];
  learnedWords: string[];
  quizScores: Record<string, number>;
  favorites: string[];
  totalStudyTime: number; // minutes
  lastStudyDate: string;
  streak: number;
}

const DEFAULT_PROGRESS: LearningProgress = {
  completedLessons: [],
  learnedWords: [],
  quizScores: {},
  favorites: [],
  totalStudyTime: 0,
  lastStudyDate: "",
  streak: 0,
};

export function getProgress(): LearningProgress {
  try {
    const saved = localStorage.getItem("dong-learning-progress");
    if (saved) return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
  } catch {}
  return { ...DEFAULT_PROGRESS };
}

export function saveProgress(progress: LearningProgress) {
  try {
    localStorage.setItem("dong-learning-progress", JSON.stringify(progress));
  } catch {}
}

export function toggleFavorite(wordId: string): LearningProgress {
  const progress = getProgress();
  const idx = progress.favorites.indexOf(wordId);
  if (idx >= 0) {
    progress.favorites.splice(idx, 1);
  } else {
    progress.favorites.push(wordId);
  }
  saveProgress(progress);
  return progress;
}

export function markWordLearned(wordId: string): LearningProgress {
  const progress = getProgress();
  if (!progress.learnedWords.includes(wordId)) {
    progress.learnedWords.push(wordId);
  }
  saveProgress(progress);
  return progress;
}

export function markLessonComplete(lessonId: string): LearningProgress {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  const today = new Date().toISOString().slice(0, 10);
  if (progress.lastStudyDate !== today) {
    if (progress.lastStudyDate === new Date(Date.now() - 86400000).toISOString().slice(0, 10)) {
      progress.streak += 1;
    } else {
      progress.streak = 1;
    }
    progress.lastStudyDate = today;
  }
  saveProgress(progress);
  return progress;
}

export function saveQuizScore(lessonId: string, score: number): LearningProgress {
  const progress = getProgress();
  progress.quizScores[lessonId] = Math.max(progress.quizScores[lessonId] || 0, score);
  saveProgress(progress);
  return progress;
}

// ========== 工具函数 ==========

/**
 * 播放普通话发音（使用浏览器TTS）
 */
export function speakChinese(text: string, rate: number = 0.8) {
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = rate;
    speechSynthesis.speak(utterance);
    return true;
  }
  return false;
}

/**
 * 兼容旧代码的speakText（播放普通话）
 */
export function speakText(text: string, lang: string = "zh-CN", rate: number = 0.8) {
  return speakChinese(text, rate);
}

/**
 * 侗语拼音到IPA近似音节的映射
 * 侗语有独特的声调和辅音系统，这里将侗语拼音转换为
 * 可以用通用语音合成近似朗读的音节
 */
const dongSyllableMap: Record<string, string> = {
  // 常见侗语音节 -> 可朗读的近似音
  "mii": "mi", "laox": "lao", "siik": "sik",
  "bail": "bai", "zaol": "zao", "sangc": "sang",
  "wanl": "wan", "duix": "dui", "buc": "bu",
  "qiil": "qi", "meix": "mei", "guanl": "guan",
  "xil": "xi", "bux": "bu", "max": "ma",
  "beix": "bei", "jax": "ja", "nongx": "nong",
  "muix": "mui", "gongx": "gong", "naix": "nai",
  "bioul": "biou", "nyenc": "nyen", "bya": "bya",
  "naml": "nam", "wenc": "wen", "nyiedl": "nyied",
  "daol": "dao", "naemx": "naem", "raemx": "raem",
  "bax": "ba", "maix": "mai", "rogl": "rog",
  "nyaoc": "nyao", "siinl": "sin", "nox": "no",
  "sac": "sa", "jiul": "jiu", "al": "a",
  "gal": "ga", "diux": "diu", "wux": "wu",
  "gul": "gu", "lenx": "len", "xiul": "xiu",
  "idl": "id", "nuih": "nui", "saml": "sam",
  "seix": "sei", "hac": "ha", "logc": "log",
  "cedc": "jed", "betc": "bed", "jiux": "jiu",
  "sibc": "sib", "hnauc": "nao", "dal": "da",
  "nyac": "nya", "mux": "mu", "dinl": "din",
  "siml": "sim", "nyinc": "nyin", "gangx": "gang",
  "xuedc": "xued", "ninx": "nin", "zuox": "zuo",
  "yangh": "yang", "dangx": "dang", "zail": "zai",
  "nasx": "nas", "Gaeml": "gaem",
};

/**
 * 侗语发音函数
 * 通过逐音节朗读侗语拼音来近似侗语发音
 * 使用Web Audio API生成提示音 + 语音合成逐音节朗读
 */
export function speakDong(dongText: string, dongPinyin?: string): boolean {
  if (!("speechSynthesis" in window)) return false;
  speechSynthesis.cancel();

  // 查找词汇获取侗语拼音
  let pinyin = dongPinyin;
  if (!pinyin) {
    const word = dongDictionary.find(w => w.dong === dongText || w.chinese === dongText);
    if (word) pinyin = word.dongPinyin;
  }
  if (!pinyin) {
    // 如果找不到拼音，直接用侗语文字尝试朗读
    const utterance = new SpeechSynthesisUtterance(dongText);
    utterance.lang = "zh-CN";
    utterance.rate = 0.5;
    speechSynthesis.speak(utterance);
    return true;
  }

  // 将侗语拼音拆分为音节并逐个朗读
  const syllables = dongText.split(/\s+/);
  const pinyinSyllables = pinyin.split(/\s+/);
  
  let delay = 0;
  syllables.forEach((syl, i) => {
    setTimeout(() => {
      const mapped = dongSyllableMap[syl.toLowerCase()] || syl;
      const utterance = new SpeechSynthesisUtterance(mapped);
      utterance.lang = "zh-CN";
      utterance.rate = 0.45; // 慢速朗读以便学习
      utterance.pitch = getPitchFromTone(pinyinSyllables[i] || "");
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }, delay);
    delay += 800; // 每个音节间隔800ms
  });

  return true;
}

/**
 * 根据侗语声调标记调整音高
 */
function getPitchFromTone(pinyinSyl: string): number {
  if (pinyinSyl.includes("˦") || pinyinSyl.includes("55")) return 1.3; // 高平调
  if (pinyinSyl.includes("˧˥") || pinyinSyl.includes("35")) return 1.1; // 中升调
  if (pinyinSyl.includes("˧") || pinyinSyl.includes("33")) return 1.0; // 中平调
  if (pinyinSyl.includes("˩") || pinyinSyl.includes("21")) return 0.7; // 低调
  return 0.9; // 默认
}

/**
 * 播放侗语词汇发音（通过中文词汇查找）
 */
export function speakDongByChinese(chinese: string): boolean {
  const word = dongDictionary.find(w => w.chinese === chinese);
  if (word) {
    return speakDong(word.dong, word.dongPinyin);
  }
  return false;
}

export function getWordsByCategory(category: string): DongWord[] {
  return dongDictionary.filter((w) => w.category === category);
}

export function searchWords(query: string): DongWord[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return dongDictionary.filter(
    (w) =>
      w.chinese.includes(q) ||
      w.dong.toLowerCase().includes(q) ||
      w.dongPinyin.toLowerCase().includes(q) ||
      w.mandarinPinyin.toLowerCase().includes(q)
  );
}

export function getDifficultyLabel(d: 1 | 2 | 3): string {
  return d === 1 ? "初级" : d === 2 ? "中级" : "高级";
}

export function getDifficultyColor(d: 1 | 2 | 3): string {
  return d === 1 ? "text-green-600 bg-green-50" : d === 2 ? "text-yellow-600 bg-yellow-50" : "text-red-600 bg-red-50";
}
