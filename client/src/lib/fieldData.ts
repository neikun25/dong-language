/**
 * 田野调查真实发音数据
 * 发音人：杨艳杰，40岁，女，9村，榕江二中
 * 数据来源：贵州榕江三宝侗寨田野调查
 * 
 * 每个词汇包含：侗语拼写、IPA音标、汉语释义、音节类型（舒/促）、真实发音CDN URL
 */

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc";

export interface FieldWord {
  id: string;
  dong: string;       // 侗语拼写
  ipa: string;        // IPA音标（含声调）
  chinese: string;    // 汉语释义
  toneCode: string;   // 声调编号（55/35/11/323/13/31/53/453/33）
  syllableType: "舒" | "促"; // 音节类型
  audioUrl: string;   // 真实发音CDN URL
}

export interface ToneGroup {
  toneCode: string;         // 声调编号
  syllableType: "舒" | "促";
  description: string;      // 声调描述
  contour: number[];        // 声调轮廓（五度标记法）
  words: FieldWord[];
}

// 声调描述
const TONE_DESCRIPTIONS: Record<string, { desc: string; contour: number[] }> = {
  "55": { desc: "高平调，音高保持在最高位置不变", contour: [5, 5] },
  "35": { desc: "中升调，从中音升到高音", contour: [3, 5] },
  "11": { desc: "低平调，音高保持在最低位置", contour: [1, 1] },
  "323": { desc: "曲折调，从中音降到低音再升回中音", contour: [3, 2, 3] },
  "13": { desc: "低升调，从低音升到中音", contour: [1, 3] },
  "31": { desc: "中降调，从中音降到低音", contour: [3, 1] },
  "53": { desc: "高降调，从高音降到中音", contour: [5, 3] },
  "453": { desc: "升降调，从中高音升到最高再降到中音", contour: [4, 5, 3] },
  "33": { desc: "中平调，音高保持在中间位置", contour: [3, 3] },
};

// 完整田野调查词汇数据（按声调分组）
export const FIELD_TONE_GROUPS: ToneGroup[] = [
  // ===== 舒声调 =====
  {
    toneCode: "55",
    syllableType: "舒",
    description: TONE_DESCRIPTIONS["55"].desc,
    contour: TONE_DESCRIPTIONS["55"].contour,
    words: [
      { id: "55s1", dong: "bal", ipa: "pa⁵⁵", chinese: "鱼", toneCode: "55", syllableType: "舒", audioUrl: `${CDN}/55舒_1_bal_48831204.wav` },
      { id: "55s2", dong: "dal", ipa: "ta⁵⁵", chinese: "眼睛；外祖父", toneCode: "55", syllableType: "舒", audioUrl: `${CDN}/55舒_2_dal_e23fe7ed.wav` },
      { id: "55s3", dong: "jenl", ipa: "ȶən⁵⁵", chinese: "别人", toneCode: "55", syllableType: "舒", audioUrl: `${CDN}/55舒_3_jenl_d8a95d91.wav` },
      { id: "55s4", dong: "beel", ipa: "pe⁵⁵", chinese: "卖", toneCode: "55", syllableType: "舒", audioUrl: `${CDN}/55舒_4_beel_d41d3372.wav` },
      { id: "55s5", dong: "gual", ipa: "kwa⁵⁵", chinese: "登记（名字）", toneCode: "55", syllableType: "舒", audioUrl: `${CDN}/55舒_5_gual_395c8b42.wav` },
    ],
  },
  {
    toneCode: "35",
    syllableType: "舒",
    description: TONE_DESCRIPTIONS["35"].desc,
    contour: TONE_DESCRIPTIONS["35"].contour,
    words: [
      { id: "35s1", dong: "taemk", ipa: "tʰɐm³⁵", chinese: "矮", toneCode: "35", syllableType: "舒", audioUrl: `${CDN}/35舒_1_taemk_03c1683e.wav` },
      { id: "35s2", dong: "kap", ipa: "kʰa³⁵", chinese: "耳朵", toneCode: "35", syllableType: "舒", audioUrl: `${CDN}/35舒_2_kap_05e2302e.wav` },
      { id: "35s3", dong: "kuap", ipa: "kʰwa³⁵", chinese: "摸一下", toneCode: "35", syllableType: "舒", audioUrl: `${CDN}/35舒_3_kuap_e8e9f039.wav` },
      { id: "35s4", dong: "kuanp", ipa: "kwan³⁵", chinese: "甜的", toneCode: "35", syllableType: "舒", audioUrl: `${CDN}/35舒_4_kuanp_1c80581b.wav` },
      { id: "35s5", dong: "piap", ipa: "pjʰa³⁵", chinese: "喂食", toneCode: "35", syllableType: "舒", audioUrl: `${CDN}/35舒_5_piap_ea83f2cd.wav` },
    ],
  },
  {
    toneCode: "11",
    syllableType: "舒",
    description: TONE_DESCRIPTIONS["11"].desc,
    contour: TONE_DESCRIPTIONS["11"].contour,
    words: [
      { id: "11s1", dong: "tang", ipa: "tɑːŋ¹¹", chinese: "糖", toneCode: "11", syllableType: "舒", audioUrl: `${CDN}/11舒_1_11_189d2843.wav` },
      { id: "11s2", dong: "jac", ipa: "ȶa¹¹", chinese: "茄子", toneCode: "11", syllableType: "舒", audioUrl: `${CDN}/11舒_2_jac_ebe70b39.wav` },
      { id: "11s3", dong: "ju", ipa: "ȶu¹¹", chinese: "姑父（父妹之夫）", toneCode: "11", syllableType: "舒", audioUrl: `${CDN}/11舒_3_11_186b7280.wav` },
      { id: "11s4", dong: "daoc", ipa: "kʰau¹¹", chinese: "酒糟", toneCode: "11", syllableType: "舒", audioUrl: `${CDN}/11舒_4_daoc_6a81e711.wav` },
      { id: "11s5", dong: "pau", ipa: "paːu¹¹", chinese: "柚子", toneCode: "11", syllableType: "舒", audioUrl: `${CDN}/11舒_5_11_53bdbc48.wav` },
    ],
  },
  {
    toneCode: "323",
    syllableType: "舒",
    description: TONE_DESCRIPTIONS["323"].desc,
    contour: TONE_DESCRIPTIONS["323"].contour,
    words: [
      { id: "323s1", dong: "gaos", ipa: "kao³²³", chinese: "头；端", toneCode: "323", syllableType: "舒", audioUrl: `${CDN}/323舒_1_gaos_8d29dcf9.wav` },
      { id: "323s2", dong: "bas", ipa: "pa³²³", chinese: "姑母", toneCode: "323", syllableType: "舒", audioUrl: `${CDN}/323舒_2_bas_a4f2240b.wav` },
      { id: "323s3", dong: "pja", ipa: "pja³²³", chinese: "雷", toneCode: "323", syllableType: "舒", audioUrl: `${CDN}/323舒_3_323_4ad91edd.wav` },
      { id: "323s4", dong: "deis", ipa: "təi³²³", chinese: "瞧，偷看", toneCode: "323", syllableType: "舒", audioUrl: `${CDN}/323舒_4_deis_7cd6384f.wav` },
      { id: "323s5", dong: "te", ipa: "te³²³", chinese: "下面", toneCode: "323", syllableType: "舒", audioUrl: `${CDN}/323舒_5_323_4814d20a.wav` },
    ],
  },
  {
    toneCode: "13",
    syllableType: "舒",
    description: TONE_DESCRIPTIONS["13"].desc,
    contour: TONE_DESCRIPTIONS["13"].contour,
    words: [
      { id: "13s1", dong: "thenl", ipa: "tʰənl¹³", chinese: "短", toneCode: "13", syllableType: "舒", audioUrl: `${CDN}/13舒_1_13_438f6f37.wav` },
      { id: "13s2", dong: "thaml", ipa: "ȶhaːml¹³", chinese: "走", toneCode: "13", syllableType: "舒", audioUrl: `${CDN}/13舒_2_13_cb4437d7.wav` },
      { id: "13s3", dong: "thal", ipa: "ȶhal¹³", chinese: "轻", toneCode: "13", syllableType: "舒", audioUrl: `${CDN}/13舒_3_13_fc8cc77a.wav` },
      { id: "13s4", dong: "won", ipa: "won¹³", chinese: "吐", toneCode: "13", syllableType: "舒", audioUrl: `${CDN}/13舒_4_13_1aac8250.wav` },
      { id: "13s5", dong: "wen", ipa: "wen¹³", chinese: "裙子", toneCode: "13", syllableType: "舒", audioUrl: `${CDN}/13舒_5_13_52eecb9d.wav` },
    ],
  },
  {
    toneCode: "31",
    syllableType: "舒",
    description: TONE_DESCRIPTIONS["31"].desc,
    contour: TONE_DESCRIPTIONS["31"].contour,
    words: [
      { id: "31s1", dong: "jaix", ipa: "ȶai³¹", chinese: "哥、姐", toneCode: "31", syllableType: "舒", audioUrl: `${CDN}/31舒_1_jaix_891d25ac.wav` },
      { id: "31s2", dong: "jaox", ipa: "ȶau³¹", chinese: "交钱", toneCode: "31", syllableType: "舒", audioUrl: `${CDN}/31舒_2_jaox_5f2b6534.wav` },
      { id: "31s3", dong: "jaenx", ipa: "ȶɐn³¹", chinese: "近", toneCode: "31", syllableType: "舒", audioUrl: `${CDN}/31舒_3_jaenx_4e82e492.wav` },
      { id: "31s4", dong: "penx", ipa: "pən³¹", chinese: "溢", toneCode: "31", syllableType: "舒", audioUrl: `${CDN}/31舒_4_31_c5a4d537.wav` },
      { id: "31s5", dong: "diux", ipa: "tiu³¹", chinese: "聪明、能干", toneCode: "31", syllableType: "舒", audioUrl: `${CDN}/31舒_5_diux_fb30b60a.wav` },
    ],
  },
  {
    toneCode: "53",
    syllableType: "舒",
    description: TONE_DESCRIPTIONS["53"].desc,
    contour: TONE_DESCRIPTIONS["53"].contour,
    words: [
      { id: "53s1", dong: "baenv", ipa: "pɐn⁵³", chinese: "扔掉", toneCode: "53", syllableType: "舒", audioUrl: `${CDN}/53舒_1_baenv_4777a303.wav` },
      { id: "53s2", dong: "ja", ipa: "ja⁵³", chinese: "水田、田", toneCode: "53", syllableType: "舒", audioUrl: `${CDN}/53舒_2_53_2a386957.wav` },
      { id: "53s3", dong: "daiv", ipa: "tai⁵³", chinese: "带着", toneCode: "53", syllableType: "舒", audioUrl: `${CDN}/53舒_3_daiv_f9976f82.wav` },
      { id: "53s4", dong: "guav", ipa: "kwa⁵³", chinese: "斥责、骂", toneCode: "53", syllableType: "舒", audioUrl: `${CDN}/53舒_4_guav_d7010bd7.wav` },
      { id: "53s5", dong: "ai", ipa: "ai⁵³", chinese: "鸡", toneCode: "53", syllableType: "舒", audioUrl: `${CDN}/53舒_5_53_3c2c3f7b.wav` },
    ],
  },
  {
    toneCode: "453",
    syllableType: "舒",
    description: TONE_DESCRIPTIONS["453"].desc,
    contour: TONE_DESCRIPTIONS["453"].contour,
    words: [
      { id: "453s1", dong: "phu", ipa: "phu⁴⁵³", chinese: "商店", toneCode: "453", syllableType: "舒", audioUrl: `${CDN}/453舒_1_453_66bdebb7.wav` },
      { id: "453s2", dong: "than", ipa: "than⁴⁵³", chinese: "炭", toneCode: "453", syllableType: "舒", audioUrl: `${CDN}/453舒_2_453_f246679b.wav` },
      { id: "453s3", dong: "pak", ipa: "pʰa⁴⁵³", chinese: "坏掉了", toneCode: "453", syllableType: "舒", audioUrl: `${CDN}/453舒_3_pak_f36f33d3.wav` },
      { id: "453s4", dong: "thing", ipa: "ȶhing⁴⁵³", chinese: "听", toneCode: "453", syllableType: "舒", audioUrl: `${CDN}/453舒_4_453_015b7ada.wav` },
      { id: "453s5", dong: "pieek", ipa: "pjʰe⁴⁵³", chinese: "送、给", toneCode: "453", syllableType: "舒", audioUrl: `${CDN}/453舒_5_pieek_ee7aa971.wav` },
    ],
  },
  {
    toneCode: "33",
    syllableType: "舒",
    description: TONE_DESCRIPTIONS["33"].desc,
    contour: TONE_DESCRIPTIONS["33"].contour,
    words: [
      { id: "33s1", dong: "jah", ipa: "ȶa³³", chinese: "代指，那儿（近指）", toneCode: "33", syllableType: "舒", audioUrl: `${CDN}/33舒_1_jah_c310750b.wav` },
      { id: "33s2", dong: "janh", ipa: "ȶan³³", chinese: "碰、撞", toneCode: "33", syllableType: "舒", audioUrl: `${CDN}/33舒_2_janh_d2040d26.wav` },
      { id: "33s3", dong: "banh", ipa: "paŋ³³", chinese: "靠", toneCode: "33", syllableType: "舒", audioUrl: `${CDN}/33舒_3_banh_434ea7e2.wav` },
      { id: "33s4", dong: "beeh", ipa: "pe³³", chinese: "打/拍", toneCode: "33", syllableType: "舒", audioUrl: `${CDN}/33舒_4_beeh_eb7e445d.wav` },
      { id: "33s5", dong: "bianh", ipa: "pjan³³", chinese: "撒，播", toneCode: "33", syllableType: "舒", audioUrl: `${CDN}/33舒_5_bianh_12d38630.wav` },
    ],
  },
  // ===== 促声调 =====
  {
    toneCode: "55",
    syllableType: "促",
    description: "高平促调，短促收尾，音高在最高位置",
    contour: [5, 5],
    words: [
      { id: "55c1", dong: "badl", ipa: "pat⁵⁵", chinese: "鸭", toneCode: "55", syllableType: "促", audioUrl: `${CDN}/55促_1_badl_40439859.wav` },
      { id: "55c2", dong: "adl", ipa: "at⁵⁵", chinese: "切割", toneCode: "55", syllableType: "促", audioUrl: `${CDN}/55促_2_adl_b5ef7427.wav` },
      { id: "55c3", dong: "dedl", ipa: "tət⁵⁵", chinese: "屁", toneCode: "55", syllableType: "促", audioUrl: `${CDN}/55促_3_dedl_82bd08bf.wav` },
      { id: "55c4", dong: "thet", ipa: "ȶət⁵⁵", chinese: "柴；小腿", toneCode: "55", syllableType: "促", audioUrl: `${CDN}/55促_4_55_fb98c66c.wav` },
      { id: "55c5", dong: "thep", ipa: "ȶəp⁵⁵", chinese: "摘；捡拾；收拾", toneCode: "55", syllableType: "促", audioUrl: `${CDN}/55促_5_55_a4b59a79.wav` },
    ],
  },
  {
    toneCode: "35",
    syllableType: "促",
    description: "中升促调，短促收尾，音高从中升高",
    contour: [3, 5],
    words: [
      { id: "35c1", dong: "piagp", ipa: "pjak³⁵", chinese: "拍打；捏", toneCode: "35", syllableType: "促", audioUrl: `${CDN}/35促_1_piagp_5f8ae4da.wav` },
      { id: "35c2", dong: "pogp", ipa: "pok³⁵", chinese: "泼", toneCode: "35", syllableType: "促", audioUrl: `${CDN}/35促_2_pogp_4b744afe.wav` },
      { id: "35c3", dong: "jak", ipa: "jak³⁵", chinese: "勤快", toneCode: "35", syllableType: "促", audioUrl: `${CDN}/35促_3_35_2a2439d5.wav` },
      { id: "35c4", dong: "sok", ipa: "sok³⁵", chinese: "狭窄", toneCode: "35", syllableType: "促", audioUrl: `${CDN}/35促_4_35_3aefdbd0.wav` },
      // 35促第5个词（kʰəp³⁵/蜈蚣）音频切割失败，跳过
    ],
  },
  {
    toneCode: "11",
    syllableType: "促",
    description: "低平促调，短促收尾，音高在最低位置",
    contour: [1, 1],
    words: [
      { id: "11c1", dong: "jogc", ipa: "ȶok¹¹", chinese: "跪", toneCode: "11", syllableType: "促", audioUrl: `${CDN}/11促_1_jogc_e6982f5a.wav` },
      { id: "11c2", dong: "bagc", ipa: "pak¹¹", chinese: "萝卜", toneCode: "11", syllableType: "促", audioUrl: `${CDN}/11促_2_bagc_e023e5ef.wav` },
      { id: "11c3", dong: "dabc", ipa: "tap¹¹", chinese: "丢；扔", toneCode: "11", syllableType: "促", audioUrl: `${CDN}/11促_3_dabc_0a859ca6.wav` },
      { id: "11c4", dong: "jagc", ipa: "ȶak¹¹", chinese: "量词：个", toneCode: "11", syllableType: "促", audioUrl: `${CDN}/11促_4_jagc_ec581bd2.wav` },
      { id: "11c5", dong: "jabc", ipa: "ȶap¹¹", chinese: "砸人", toneCode: "11", syllableType: "促", audioUrl: `${CDN}/11促_5_jabc_5eff14f3.wav` },
    ],
  },
  {
    toneCode: "323",
    syllableType: "促",
    description: "曲折促调，短促收尾，音高先降后升",
    contour: [3, 2, 3],
    words: [
      { id: "323c1", dong: "beds", ipa: "pət³²³", chinese: "八", toneCode: "323", syllableType: "促", audioUrl: `${CDN}/323促_1_beds_0e207581.wav` },
      { id: "323c2", dong: "begs", ipa: "pək³²³", chinese: "百", toneCode: "323", syllableType: "促", audioUrl: `${CDN}/323促_2_begs_f945e30b.wav` },
      { id: "323c3", dong: "biags", ipa: "pjak³²³", chinese: "额头", toneCode: "323", syllableType: "促", audioUrl: `${CDN}/323促_3_biags_05ffb916.wav` },
      { id: "323c4", dong: "thip", ipa: "ȶip³²³", chinese: "缝；补", toneCode: "323", syllableType: "促", audioUrl: `${CDN}/323促_4_323_434d3049.wav` },
      { id: "323c5", dong: "dids", ipa: "tit³²³", chinese: "用手指弹", toneCode: "323", syllableType: "促", audioUrl: `${CDN}/323促_5_dids_5c886c21.wav` },
    ],
  },
  {
    toneCode: "13",
    syllableType: "促",
    description: "低升促调，短促收尾，音高从低升中",
    contour: [1, 3],
    words: [
      { id: "13c1", dong: "pegt", ipa: "pʰək¹³", chinese: "贴，拍", toneCode: "13", syllableType: "促", audioUrl: `${CDN}/13促_1_pegt_593ce274.wav` },
      { id: "13c2", dong: "pugt", ipa: "pʰuk¹³", chinese: "灰（名词）", toneCode: "13", syllableType: "促", audioUrl: `${CDN}/13促_2_pugt_8f2fa2e5.wav` },
      { id: "13c3", dong: "piidt", ipa: "pjʰit¹³", chinese: "削", toneCode: "13", syllableType: "促", audioUrl: `${CDN}/13促_3_piidt_b3c01c8a.wav` },
      { id: "13c4", dong: "cit", ipa: "cit¹³", chinese: "踢", toneCode: "13", syllableType: "促", audioUrl: `${CDN}/13促_4_13_0f35283d.wav` },
      { id: "13c5", dong: "phadt", ipa: "phadt¹³", chinese: "血", toneCode: "13", syllableType: "促", audioUrl: `${CDN}/13促_5_13_21b20996.wav` },
    ],
  },
  {
    toneCode: "31",
    syllableType: "促",
    description: "中降促调，短促收尾，音高从中降低",
    contour: [3, 1],
    words: [
      { id: "31c1", dong: "bugx", ipa: "puk³¹", chinese: "泡沫；笨拙", toneCode: "31", syllableType: "促", audioUrl: `${CDN}/31促_1_bugx_16636311.wav` },
      { id: "31c2", dong: "biadx", ipa: "pjat³¹", chinese: "摔跤", toneCode: "31", syllableType: "促", audioUrl: `${CDN}/31促_2_biadx_b72dea6b.wav` },
      { id: "31c3", dong: "dabx", ipa: "tap³¹", chinese: "冲；踢；舂", toneCode: "31", syllableType: "促", audioUrl: `${CDN}/31促_3_dabx_166efe35.wav` },
      { id: "31c4", dong: "dibx", ipa: "tip³¹", chinese: "碟子", toneCode: "31", syllableType: "促", audioUrl: `${CDN}/31促_4_dibx_fe3367d3.wav` },
      { id: "31c5", dong: "pik", ipa: "pik³¹", chinese: "鲫鱼", toneCode: "31", syllableType: "促", audioUrl: `${CDN}/31促_5_31_a2a33e27.wav` },
    ],
  },
];

// 所有词汇的扁平列表
export const ALL_FIELD_WORDS: FieldWord[] = FIELD_TONE_GROUPS.flatMap(g => g.words);

// 按声调编号获取词汇
export function getWordsByTone(toneCode: string, syllableType?: "舒" | "促"): FieldWord[] {
  return ALL_FIELD_WORDS.filter(w =>
    w.toneCode === toneCode &&
    (syllableType === undefined || w.syllableType === syllableType)
  );
}

// 声调颜色映射
export const TONE_COLORS: Record<string, string> = {
  "55": "#e63946",  // 红色 - 高平
  "35": "#f4a261",  // 橙色 - 中升
  "11": "#457b9d",  // 蓝色 - 低平
  "323": "#a8dadc", // 青色 - 曲折
  "13": "#2a9d8f",  // 绿色 - 低升
  "31": "#6d6875",  // 紫色 - 中降
  "53": "#e9c46a",  // 黄色 - 高降
  "453": "#264653", // 深青 - 升降
  "33": "#8ecae6",  // 浅蓝 - 中平
};

// 侗语声调介绍文本
export const DONG_TONE_INTRO = {
  title: "侗语声调系统",
  subtitle: "南部侗语（贵州榕江三宝侗寨方言）",
  overview: `侗语属于汉藏语系壮侗语族，南部侗语共有9个声调（有研究者认为是16种声调变体）。声调是侗语的核心特征，同一音节不同声调可表达完全不同的意思。侗语声调分为"舒声"和"促声"两大类：舒声调音节末尾为元音或鼻音，促声调音节末尾为塞音（-p/-t/-k/-ʔ），发音短促。`,
  toneSystem: `侗语使用五度标记法描述声调高低：5为最高音，1为最低音。例如"55"表示音高从5到5（高平调），"35"表示从3升到5（中升调）。`,
  syllableTypes: `舒声（开音节）：音节以元音或鼻音结尾，发音可以延长。促声（闭音节）：音节以塞音（-p/-t/-k）结尾，发音短促有力。`,
  speakerInfo: `本页面所有发音均来自田野调查真实录音，发音人：杨艳杰，40岁，女，贵州榕江三宝侗寨9村。`,
};
