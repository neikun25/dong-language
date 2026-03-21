/**
 * 侗语声调词汇数据
 * 发音人：杨艳杰，40岁，女，9村，榕江二中
 * 数据来源：贵州榕江三宝侗寨田野调查
 *
 * 每个词汇对应独立音频文件（从田野调查录音中精确拆分）
 * 音频文件位于 /audio/ 目录下
 */

export interface ToneWord {
  id: string;
  dong: string;       // 侗语拼写
  ipa: string;        // IPA音标（含声调）
  chinese: string;    // 汉语释义
  toneCode: string;   // 声调编号（55/35/11/323/13/31/53/453/33）
  syllableType: "舒" | "促"; // 音节类型
  audioPath: string;  // 本地音频路径（相对于 public/）
}

export interface ToneGroup {
  toneCode: string;
  syllableType: "舒" | "促";
  name: string;       // 声调名称
  description: string;
  contour: number[];  // 五度标记法
  color: string;
  words: ToneWord[];
}

// 声调颜色映射
export const TONE_COLORS: Record<string, string> = {
  "55": "#e63946",
  "35": "#f4a261",
  "11": "#457b9d",
  "323": "#a8dadc",
  "13": "#2a9d8f",
  "31": "#6d6875",
  "53": "#e9c46a",
  "453": "#264653",
  "33": "#8ecae6",
};

// 声调名称映射
export const TONE_NAMES: Record<string, string> = {
  "55": "高平调",
  "35": "中升调",
  "11": "低平调",
  "323": "曲折调",
  "13": "低升调",
  "31": "中降调",
  "53": "高降调",
  "453": "升降调",
  "33": "中平调",
};

export const DONG_TONE_GROUPS: ToneGroup[] = [
  // ===== 舒声调 =====
  {
    toneCode: "55",
    syllableType: "舒",
    name: "高平调",
    description: "音高保持在最高位置不变，发音高而平稳",
    contour: [5, 5],
    color: TONE_COLORS["55"],
    words: [
      { id: "55s1", dong: "bal", ipa: "pa⁵⁵", chinese: "鱼", toneCode: "55", syllableType: "舒", audioPath: "/audio/55s_1_bal.wav" },
      { id: "55s2", dong: "dal", ipa: "ta⁵⁵", chinese: "眼睛；外祖父", toneCode: "55", syllableType: "舒", audioPath: "/audio/55s_2_dal.wav" },
      { id: "55s3", dong: "jenl", ipa: "ȶən⁵⁵", chinese: "别人", toneCode: "55", syllableType: "舒", audioPath: "/audio/55s_3_jenl.wav" },
      { id: "55s4", dong: "beel", ipa: "pe⁵⁵", chinese: "卖", toneCode: "55", syllableType: "舒", audioPath: "/audio/55s_4_beel.wav" },
      { id: "55s5", dong: "gual", ipa: "kwa⁵⁵", chinese: "登记（名字）", toneCode: "55", syllableType: "舒", audioPath: "/audio/55s_5_gual.wav" },
    ],
  },
  {
    toneCode: "35",
    syllableType: "舒",
    name: "中升调",
    description: "从中音位置上升到高音，音调呈上升趋势",
    contour: [3, 5],
    color: TONE_COLORS["35"],
    words: [
      { id: "35s1", dong: "taemk", ipa: "tʰɐm³⁵", chinese: "矮", toneCode: "35", syllableType: "舒", audioPath: "/audio/35s_1_taemk.wav" },
      { id: "35s2", dong: "kap", ipa: "kʰa³⁵", chinese: "耳朵", toneCode: "35", syllableType: "舒", audioPath: "/audio/35s_2_kap.wav" },
      { id: "35s3", dong: "kuap", ipa: "kʰwa³⁵", chinese: "摸一下", toneCode: "35", syllableType: "舒", audioPath: "/audio/35s_3_kuap.wav" },
      { id: "35s4", dong: "kuanp", ipa: "kwan³⁵", chinese: "甜的", toneCode: "35", syllableType: "舒", audioPath: "/audio/35s_4_kuanp.wav" },
      { id: "35s5", dong: "piap", ipa: "pjʰa³⁵", chinese: "喂食", toneCode: "35", syllableType: "舒", audioPath: "/audio/35s_5_piap.wav" },
    ],
  },
  {
    toneCode: "11",
    syllableType: "舒",
    name: "低平调",
    description: "音高保持在最低位置，发音低沉平稳",
    contour: [1, 1],
    color: TONE_COLORS["11"],
    words: [
      { id: "11s1", dong: "tang", ipa: "tɑːŋ¹¹", chinese: "糖", toneCode: "11", syllableType: "舒", audioPath: "/audio/11s_1_tang.wav" },
      { id: "11s2", dong: "jac", ipa: "ȶa¹¹", chinese: "茄子", toneCode: "11", syllableType: "舒", audioPath: "/audio/11s_2_jac.wav" },
      { id: "11s3", dong: "ju", ipa: "ȶu¹¹", chinese: "姑父（父妹之夫）", toneCode: "11", syllableType: "舒", audioPath: "/audio/11s_3_ju.wav" },
      { id: "11s4", dong: "daoc", ipa: "kʰau¹¹", chinese: "酒糟", toneCode: "11", syllableType: "舒", audioPath: "/audio/11s_4_daoc.wav" },
      { id: "11s5", dong: "pau", ipa: "paːu¹¹", chinese: "柚子", toneCode: "11", syllableType: "舒", audioPath: "/audio/11s_5_pau.wav" },
    ],
  },
  {
    toneCode: "323",
    syllableType: "舒",
    name: "曲折调",
    description: "从中音降到低音再升回中音，音调呈曲折形",
    contour: [3, 2, 3],
    color: TONE_COLORS["323"],
    words: [
      { id: "323s1", dong: "gaos", ipa: "kao³²³", chinese: "头；端", toneCode: "323", syllableType: "舒", audioPath: "/audio/323s_1_gaos.wav" },
      { id: "323s2", dong: "bas", ipa: "pa³²³", chinese: "姑母", toneCode: "323", syllableType: "舒", audioPath: "/audio/323s_2_bas.wav" },
      { id: "323s3", dong: "pja", ipa: "pja³²³", chinese: "雷", toneCode: "323", syllableType: "舒", audioPath: "/audio/323s_3_pja.wav" },
      { id: "323s4", dong: "deis", ipa: "təi³²³", chinese: "瞧，偷看", toneCode: "323", syllableType: "舒", audioPath: "/audio/323s_4_deis.wav" },
      { id: "323s5", dong: "te", ipa: "te³²³", chinese: "下面", toneCode: "323", syllableType: "舒", audioPath: "/audio/323s_5_te.wav" },
    ],
  },
  {
    toneCode: "13",
    syllableType: "舒",
    name: "低升调",
    description: "从低音位置上升到中音，音调由低渐升",
    contour: [1, 3],
    color: TONE_COLORS["13"],
    words: [
      { id: "13s1", dong: "thenl", ipa: "tʰənl¹³", chinese: "短", toneCode: "13", syllableType: "舒", audioPath: "/audio/13s_1_thenl.wav" },
      { id: "13s2", dong: "thaml", ipa: "ȶhaːml¹³", chinese: "走", toneCode: "13", syllableType: "舒", audioPath: "/audio/13s_2_thaml.wav" },
      { id: "13s3", dong: "thal", ipa: "ȶhal¹³", chinese: "轻", toneCode: "13", syllableType: "舒", audioPath: "/audio/13s_3_thal.wav" },
      { id: "13s4", dong: "won", ipa: "won¹³", chinese: "吐", toneCode: "13", syllableType: "舒", audioPath: "/audio/13s_4_won.wav" },
      { id: "13s5", dong: "wen", ipa: "wen¹³", chinese: "裙子", toneCode: "13", syllableType: "舒", audioPath: "/audio/13s_5_wen.wav" },
    ],
  },
  {
    toneCode: "31",
    syllableType: "舒",
    name: "中降调",
    description: "从中音位置下降到低音，音调由中渐降",
    contour: [3, 1],
    color: TONE_COLORS["31"],
    words: [
      { id: "31s1", dong: "jaix", ipa: "ȶai³¹", chinese: "哥、姐", toneCode: "31", syllableType: "舒", audioPath: "/audio/31s_1_jaix.wav" },
      { id: "31s2", dong: "jaox", ipa: "ȶau³¹", chinese: "交钱", toneCode: "31", syllableType: "舒", audioPath: "/audio/31s_2_jaox.wav" },
      { id: "31s3", dong: "jaenx", ipa: "ȶɐn³¹", chinese: "近", toneCode: "31", syllableType: "舒", audioPath: "/audio/31s_3_jaenx.wav" },
      { id: "31s4", dong: "penx", ipa: "pən³¹", chinese: "溢", toneCode: "31", syllableType: "舒", audioPath: "/audio/31s_4_penx.wav" },
      { id: "31s5", dong: "diux", ipa: "tiu³¹", chinese: "聪明、能干", toneCode: "31", syllableType: "舒", audioPath: "/audio/31s_5_diux.wav" },
    ],
  },
  {
    toneCode: "53",
    syllableType: "舒",
    name: "高降调",
    description: "从高音位置快速下降到中音，音调高而下降",
    contour: [5, 3],
    color: TONE_COLORS["53"],
    words: [
      { id: "53s1", dong: "baenv", ipa: "pɐn⁵³", chinese: "扔掉", toneCode: "53", syllableType: "舒", audioPath: "/audio/53s_1_baenv.wav" },
      { id: "53s2", dong: "ja", ipa: "ja⁵³", chinese: "水田、田", toneCode: "53", syllableType: "舒", audioPath: "/audio/53s_2_ja.wav" },
      { id: "53s3", dong: "daiv", ipa: "tai⁵³", chinese: "带着", toneCode: "53", syllableType: "舒", audioPath: "/audio/53s_3_daiv.wav" },
      { id: "53s4", dong: "guav", ipa: "kwa⁵³", chinese: "斥责、骂", toneCode: "53", syllableType: "舒", audioPath: "/audio/53s_4_guav.wav" },
      { id: "53s5", dong: "ai", ipa: "ai⁵³", chinese: "鸡", toneCode: "53", syllableType: "舒", audioPath: "/audio/53s_5_ai.wav" },
    ],
  },
  {
    toneCode: "453",
    syllableType: "舒",
    name: "升降调",
    description: "从中高音升到最高再降到中音，音调先升后降",
    contour: [4, 5, 3],
    color: TONE_COLORS["453"],
    words: [
      { id: "453s1", dong: "phu", ipa: "phu⁴⁵³", chinese: "商店", toneCode: "453", syllableType: "舒", audioPath: "/audio/453s_1_phu.wav" },
      { id: "453s2", dong: "than", ipa: "than⁴⁵³", chinese: "炭", toneCode: "453", syllableType: "舒", audioPath: "/audio/453s_2_than.wav" },
      { id: "453s3", dong: "pak", ipa: "pʰa⁴⁵³", chinese: "坏掉了", toneCode: "453", syllableType: "舒", audioPath: "/audio/453s_3_pak.wav" },
      { id: "453s4", dong: "thing", ipa: "ȶhing⁴⁵³", chinese: "听", toneCode: "453", syllableType: "舒", audioPath: "/audio/453s_4_thing.wav" },
      { id: "453s5", dong: "pieek", ipa: "pjʰe⁴⁵³", chinese: "送、给", toneCode: "453", syllableType: "舒", audioPath: "/audio/453s_5_pieek.wav" },
    ],
  },
  {
    toneCode: "33",
    syllableType: "舒",
    name: "中平调",
    description: "音高保持在中间位置，发音平稳不高不低",
    contour: [3, 3],
    color: TONE_COLORS["33"],
    words: [
      { id: "33s1", dong: "jah", ipa: "ȶa³³", chinese: "代指，那儿（近指）", toneCode: "33", syllableType: "舒", audioPath: "/audio/33s_1_jah.wav" },
      { id: "33s2", dong: "janh", ipa: "ȶan³³", chinese: "碰、撞", toneCode: "33", syllableType: "舒", audioPath: "/audio/33s_2_janh.wav" },
      { id: "33s3", dong: "banh", ipa: "paŋ³³", chinese: "靠", toneCode: "33", syllableType: "舒", audioPath: "/audio/33s_3_banh.wav" },
      { id: "33s4", dong: "beeh", ipa: "pe³³", chinese: "打/拍", toneCode: "33", syllableType: "舒", audioPath: "/audio/33s_4_beeh.wav" },
      { id: "33s5", dong: "bianh", ipa: "pjan³³", chinese: "撒，播", toneCode: "33", syllableType: "舒", audioPath: "/audio/33s_5_bianh.wav" },
    ],
  },
  // ===== 促声调 =====
  {
    toneCode: "55",
    syllableType: "促",
    name: "高平促调",
    description: "音高在最高位置，音节末尾有塞音收尾，发音短促",
    contour: [5, 5],
    color: TONE_COLORS["55"],
    words: [
      { id: "55c1", dong: "badl", ipa: "pat⁵⁵", chinese: "鸭", toneCode: "55", syllableType: "促", audioPath: "/audio/55c_1_badl.wav" },
      { id: "55c2", dong: "adl", ipa: "at⁵⁵", chinese: "切割", toneCode: "55", syllableType: "促", audioPath: "/audio/55c_2_adl.wav" },
      { id: "55c3", dong: "dedl", ipa: "tət⁵⁵", chinese: "屁", toneCode: "55", syllableType: "促", audioPath: "/audio/55c_3_dedl.wav" },
      { id: "55c4", dong: "thet", ipa: "ȶət⁵⁵", chinese: "柴；小腿", toneCode: "55", syllableType: "促", audioPath: "/audio/55c_4_thet.wav" },
      { id: "55c5", dong: "thep", ipa: "ȶəp⁵⁵", chinese: "摘；捡拾；收拾", toneCode: "55", syllableType: "促", audioPath: "/audio/55c_5_thep.wav" },
    ],
  },
  {
    toneCode: "35",
    syllableType: "促",
    name: "中升促调",
    description: "音调从中升高，音节末尾有塞音收尾，发音短促",
    contour: [3, 5],
    color: TONE_COLORS["35"],
    words: [
      { id: "35c1", dong: "piagp", ipa: "pjak³⁵", chinese: "拍打；捏", toneCode: "35", syllableType: "促", audioPath: "/audio/35c_1_piagp.wav" },
      { id: "35c2", dong: "pogp", ipa: "pok³⁵", chinese: "泼", toneCode: "35", syllableType: "促", audioPath: "/audio/35c_2_pogp.wav" },
      { id: "35c3", dong: "jak", ipa: "jak³⁵", chinese: "勤快", toneCode: "35", syllableType: "促", audioPath: "/audio/35c_3_jak.wav" },
      { id: "35c4", dong: "sok", ipa: "sok³⁵", chinese: "狭窄", toneCode: "35", syllableType: "促", audioPath: "/audio/35c_4_sok.wav" },
      { id: "35c5", dong: "phep", ipa: "pʰəp³⁵", chinese: "蜈蚣", toneCode: "35", syllableType: "促", audioPath: "/audio/35c_5_phep.wav" },
    ],
  },
  {
    toneCode: "11",
    syllableType: "促",
    name: "低平促调",
    description: "音高在最低位置，音节末尾有塞音收尾，发音短促",
    contour: [1, 1],
    color: TONE_COLORS["11"],
    words: [
      { id: "11c1", dong: "jogc", ipa: "ȶok¹¹", chinese: "跪", toneCode: "11", syllableType: "促", audioPath: "/audio/11c_1_jogc.wav" },
      { id: "11c2", dong: "bagc", ipa: "pak¹¹", chinese: "萝卜", toneCode: "11", syllableType: "促", audioPath: "/audio/11c_2_bagc.wav" },
      { id: "11c3", dong: "dabc", ipa: "tap¹¹", chinese: "丢；扔", toneCode: "11", syllableType: "促", audioPath: "/audio/11c_3_dabc.wav" },
      { id: "11c4", dong: "jagc", ipa: "ȶak¹¹", chinese: "量词：个", toneCode: "11", syllableType: "促", audioPath: "/audio/11c_4_jagc.wav" },
      { id: "11c5", dong: "jabc", ipa: "ȶap¹¹", chinese: "砸人", toneCode: "11", syllableType: "促", audioPath: "/audio/11c_5_jabc.wav" },
    ],
  },
  {
    toneCode: "323",
    syllableType: "促",
    name: "曲折促调",
    description: "音调先降后升，音节末尾有塞音收尾，发音短促",
    contour: [3, 2, 3],
    color: TONE_COLORS["323"],
    words: [
      { id: "323c1", dong: "beds", ipa: "pət³²³", chinese: "八", toneCode: "323", syllableType: "促", audioPath: "/audio/323c_1_beds.wav" },
      { id: "323c2", dong: "begs", ipa: "pək³²³", chinese: "百", toneCode: "323", syllableType: "促", audioPath: "/audio/323c_2_begs.wav" },
      { id: "323c3", dong: "biags", ipa: "pjak³²³", chinese: "额头", toneCode: "323", syllableType: "促", audioPath: "/audio/323c_3_biags.wav" },
      { id: "323c4", dong: "thip", ipa: "ȶip³²³", chinese: "缝；补", toneCode: "323", syllableType: "促", audioPath: "/audio/323c_4_thip.wav" },
      { id: "323c5", dong: "dids", ipa: "tit³²³", chinese: "用手指弹", toneCode: "323", syllableType: "促", audioPath: "/audio/323c_5_dids.wav" },
    ],
  },
  {
    toneCode: "13",
    syllableType: "促",
    name: "低升促调",
    description: "音调从低升中，音节末尾有塞音收尾，发音短促",
    contour: [1, 3],
    color: TONE_COLORS["13"],
    words: [
      { id: "13c1", dong: "pegt", ipa: "pʰək¹³", chinese: "贴，拍", toneCode: "13", syllableType: "促", audioPath: "/audio/13c_1_pegt.wav" },
      { id: "13c2", dong: "pugt", ipa: "pʰuk¹³", chinese: "灰（名词）", toneCode: "13", syllableType: "促", audioPath: "/audio/13c_2_pugt.wav" },
      { id: "13c3", dong: "piidt", ipa: "pjʰit¹³", chinese: "削", toneCode: "13", syllableType: "促", audioPath: "/audio/13c_3_piidt.wav" },
      { id: "13c4", dong: "cit", ipa: "cit¹³", chinese: "踢", toneCode: "13", syllableType: "促", audioPath: "/audio/13c_4_cit.wav" },
      { id: "13c5", dong: "phadt", ipa: "phadt¹³", chinese: "血", toneCode: "13", syllableType: "促", audioPath: "/audio/13c_5_phadt.wav" },
    ],
  },
  {
    toneCode: "31",
    syllableType: "促",
    name: "中降促调",
    description: "音调从中降低，音节末尾有塞音收尾，发音短促",
    contour: [3, 1],
    color: TONE_COLORS["31"],
    words: [
      { id: "31c1", dong: "bugx", ipa: "puk³¹", chinese: "泡沫；笨拙", toneCode: "31", syllableType: "促", audioPath: "/audio/31c_1_bugx.wav" },
      { id: "31c2", dong: "biadx", ipa: "pjat³¹", chinese: "摔跤", toneCode: "31", syllableType: "促", audioPath: "/audio/31c_2_biadx.wav" },
      { id: "31c3", dong: "dabx", ipa: "tap³¹", chinese: "冲；踢；舂", toneCode: "31", syllableType: "促", audioPath: "/audio/31c_3_dabx.wav" },
      { id: "31c4", dong: "dibx", ipa: "tip³¹", chinese: "碟子", toneCode: "31", syllableType: "促", audioPath: "/audio/31c_4_dibx.wav" },
      { id: "31c5", dong: "pik", ipa: "pik³¹", chinese: "鲫鱼", toneCode: "31", syllableType: "促", audioPath: "/audio/31c_5_pik.wav" },
    ],
  },
];

// 所有词汇的扁平列表
export const ALL_TONE_WORDS: ToneWord[] = DONG_TONE_GROUPS.flatMap(g => g.words);

// 按声调编号获取词汇
export function getToneWords(toneCode: string, syllableType?: "舒" | "促"): ToneWord[] {
  return ALL_TONE_WORDS.filter(w =>
    w.toneCode === toneCode &&
    (syllableType === undefined || w.syllableType === syllableType)
  );
}

// 播放音频
let currentAudio: HTMLAudioElement | null = null;

export function playToneWord(audioPath: string, onEnd?: () => void): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.onended = null;
    currentAudio = null;
  }
  const audio = new Audio(audioPath);
  currentAudio = audio;
  audio.play().catch(() => {});
  if (onEnd) {
    audio.onended = onEnd;
    audio.onerror = onEnd;
  }
}

export function stopCurrentAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.onended = null;
    currentAudio = null;
  }
}
