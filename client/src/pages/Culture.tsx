/*
 * 侗族文化展示页面（优化版）
 * 文化分类 + 民间故事 + 琵琶歌视频 + 文化知识问答
 */
import { useState } from "react";
import { X, BookOpen, Music, MapPin, Calendar, ChevronRight, Play, Pause } from "lucide-react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const cultureCategories = [
  {
    title: "侗族建筑",
    icon: MapPin,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-drum-tower_01b1add8.jpg",
    summary: "鼓楼、风雨桥——侗族建筑智慧的结晶",
    description: "侗族建筑以鼓楼和风雨桥最为著名。鼓楼是侗寨的标志性建筑，通常建在寨子中心，不用一钉一铆，全靠木榫穿合，造型独特，气势恢宏。鼓楼不仅是侗寨的地标，更是村民议事、集会、娱乐的重要场所。风雨桥横跨溪河之上，集桥、廊、亭于一体，既可通行，又可避风雨、休憩聚会。这些建筑充分体现了侗族人民的建筑智慧和艺术才华。侗族建筑多采用杉木建造，与自然环境和谐共生，体现了侗族人民'天人合一'的生态理念。",
    facts: ["鼓楼最高可达20余层", "不用一钉一铆的榫卯结构", "风雨桥可长达数百米", "建筑技艺已列入国家级非遗"],
  },
  {
    title: "侗族服饰",
    icon: Calendar,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-costume_bc089a1a.jpg",
    summary: "蓝靛染布、银饰华美——侗族服饰之美",
    description: "侗族服饰以蓝靛染布为主要特色，男女服饰各有特点。女性服饰华丽精美，以银饰为重要装饰，包括银冠、银项圈、银手镯等，工艺精湛。侗布经过反复浸染、捶打，呈现出独特的深蓝色光泽，被称为'亮布'。侗族刺绣技艺精湛，图案多取材于自然界的花鸟鱼虫，色彩鲜艳，构图精美。不同地区的侗族服饰各有特色，北侗服饰较为简朴，南侗服饰则更加华丽。侗族服饰不仅是穿着，更是民族文化和审美观念的集中体现。",
    facts: ["蓝靛染布需反复浸染数十次", "银饰重量可达数公斤", "刺绣图案有数百种之多", "侗族亮布制作技艺已列入非遗"],
  },
  {
    title: "侗族音乐",
    icon: Music,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-grand-song_7810d8ed.jpg",
    summary: "大歌、琵琶歌——侗族音乐的两颗明珠",
    description: "侗族音乐极为丰富，以侗族大歌和琵琶歌最具代表性。侗族大歌（侗语：al laox）是多声部无伴奏合唱，2009年被列入联合国教科文组织人类非物质文化遗产代表作名录，被誉为'清泉般闪光的音乐'。琵琶歌（侗语：al biil）是侗族独具特色的弹唱艺术，演唱者自弹侗族琵琶、自唱，曲调优美，内容涵盖爱情、劳动、历史传说等。此外还有侗笛、芦笙等乐器演奏形式，共同构成侗族丰富的音乐体系。",
    facts: ["侗族大歌2009年列入联合国非遗", "无指挥无伴奏的多声部合唱", "琵琶歌是弹唱一体的独特艺术", "侗族芦笙是重要的礼仪乐器"],
  },
  {
    title: "侗族节日",
    icon: Calendar,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-festival_961bc5d9.png",
    summary: "侗年、花炮节、赶坳——丰富多彩的民族节日",
    description: "侗族有许多传统节日，如侗年、花炮节、斗牛节、赶坳等。侗年（侗语：nyenc jil）是侗族最隆重的节日，各寨杀猪宰牛，举行盛大的庆祝活动，日期因地区而异，一般在农历十月或十一月。花炮节以抢花炮为主要活动，场面热烈壮观，是侗族地区最具观赏性的节日之一。赶坳是侗族青年男女社交的重要场合，通过对歌、踩歌堂等形式增进感情，传承文化。此外还有萨玛节（祭祀侗族女神萨玛）、吃新节（庆祝丰收）等节日，展现了侗族人民丰富的精神文化生活。",
    facts: ["侗年通常在农历十月或十一月", "花炮节已有数百年历史", "赶坳是青年男女对歌社交场合", "萨玛节祭祀侗族女神萨玛"],
  },
];

// ===== 民间故事数据 =====
const folkStories = [
  {
    id: "s1",
    title: "找歌的传说",
    category: "神话传说",
    summary: "从前侗家没有歌，金必等四人历经艰辛上天讨歌，歌被风吹散后又寻回，从此侗家有了踩歌堂的传统。",
    content: `从前，侗家没有踩歌堂，过节时没有歌唱，也没有舞跳，日子过得象煮菜没有放盐一样淡。

后来，有人提议：凑点钱请人到天上讨些歌来唱吧！大家赞同，很快把钱凑齐了，就公推热心替众人办事的金必去讨歌。

金必不分昼夜，长途跋涉，走了很久，才来到天上。金必见天门紧闭着，就在门外喊了一声："开门！"哪料里面没有动静，天门还是紧闭着。金必又喊了一声"开门"，顿时天门前尘土飞扬，但门仍然紧闭不开。金必又用力气喊了一声"开门"，天门才吱吱呀呀动了。

看守天门的雷母娘娘慢腾腾地走出来问道："谁在门外大喊大叫？"金必答道："是我。从地上来的。""来做什么？""来讨歌的。"

金必话音刚落，天门打开了。雷母娘娘说："你自己到歌堂去看吧！"金必走到歌堂，看见许多仙女正在唱歌跳舞。金必看呀看呀，越看越爱看，一连看了七天。

天上一日，地上一月。地上的人等了七个月还不见金必回来，又派相金、相银和古蔡三人上天寻找金必。天上的歌舞种类很多，各种歌都悦耳动听，金必样样都想学，一下子怎么学得完呢？正在这时，相金、相银和古蔡来了：金必好喜欢，就带他们一起去讨歌。

他们找到了天上的老人。一帮老人正在鼓楼里围着火塘抽烟。金必上前，恭恭敬敬地说："我们是从地上到这里来讨歌的，请给我们一些歌吧！"老人商量一番，一个白胡子老人开口了："地上的年轻人，给你们一些耶歌吧！但是，你们要付三百两银子给我们修鼓楼。"

他们把银子给了老人，用两根粗杠子把歌抬走了。歌是用藤条绑在木杠上的。他们走出鼓楼不久，藤条松了，歌从杠子上掉了下来，撒满一地。他们赶忙歇脚，把歌捡起来，又用包头巾把歌牢绑紧，继续赶路。

他们走到天门外高高的石阶时，突然卷来一阵狂风，包头巾被风刮跑了，歌也被吹得无影无踪了。他们从天上一直找到地上，到处找遍了，就是找不到。

他们见人就问，砍柴的老人、放牛的牧童、河边洗衣的妇女都摇头说没有看见。他们继续往前找，肚子饿了，摘野果吃；口渴了，捧山泉喝；困倦了，就靠在树脚打个盹睡。

找呀找呀，他们来到了一条大江边，发现就在附近龙潭里有个东西闪闪发光。金必想：莫非歌掉在这里了？四个人跑到江边细看，龙潭里的水绿幽幽的，那亮光光的歌正好夹在石缝里。

这时，一只水獭游过来。金必喊："水獭大哥，请帮我们到潭里把歌取上来。"水獭说："可以可以，只要你们答应我一件事，准我到你们田里去吃鱼。"四个人商量一阵，答道："我们田里有的是肥鲤鱼。只要你帮我们把歌扯上岸来，准你到我们田里去吃鱼。"水獭一头蹿到潭底，把歌取了上来。他们谢了水獭，捧着歌高高兴兴地回家乡去了。

四个人后来到处去传歌。金必、相金、相银是侗族人，古赞是苗族人，从此侗家有了歌，苗家也有了歌。歌是他们一起到天上去找来的，所以侗家、苗家的歌有些相近。后来，侗家人人都学会了唱歌。侗歌，就这样传下来了。侗家逢年过节都要唱歌跳舞，这就是著名的踩歌堂。

流传地区：广西龙胜平等；贵州肇兴
搜集整理：华谋`,
  },
  {
    id: "s2",
    title: "娘梅",
    category: "爱情传说",
    summary: "侗家最美的姑娘娘梅与孤儿助郎相爱，却遭财主银宜迫害。娘梅历经磨难，最终为爱人报仇，展现了侗族女性的坚贞与勇敢。",
    content: `五百里榕江，最宽最长的平坝，要数古州三宝；侗家传说里，最美最好的姑娘，要数娘梅。来到月堂找娘梅行歌坐月的后生，不知有多少，但她哪个也不中意，单单看中了助郎。娘梅家里只有母女两人，租种舅舅家几块田，犁犁耙耙都要助郎帮忙；助郎是个孤儿，从小没有父母亲，缝缝补补全靠娘梅母女俩。你帮助我，我体贴你，年龄相仿，性情相投，两人就相好上了。可是，古州城里舅家有一个表哥，硬是要"女还舅门"，要讨娘梅做老婆。

一天，娘梅找助郎到山坡上商量。他们俩在山坡上，从太阳出山一直呆到落山，立了一个心愿：生要共火塘，死要共山头。助郎从怀里掏出一枚康熙钱，抽出柴刀把它一砍两半，娘梅和助郎各拿半边，双双跪下，对天盟誓：

杨梅老树来作证，
月亮婆婆看得清，
如今我俩破钱来盟誓，
愿结夫妻一世人。
哪个中途丢钱变心意，
刀砍雷劈火烧身，
要象王素与月长相伴，
生不离来死不分……

两人破钱盟誓之后，拿定主意，离开了三宝。他们翻过无数山岭，渡过许多江河，终于来到了一个有七百户人家的大侗寨。财主银宜见娘梅长得好看，坏心眼一动，就劝助郎和娘梅两人落户，还邀请助郎入房族，与他结为兄弟。

助郎放排离家后，银宜去找娘梅。娘梅看见银宜突然闯进门来，对她花言巧语，正色道："茶花不怕霜雪欺，阳雀懒听乌鸦叫！"银宜边笑边递银元宝给娘梅，娘梅硬是不收。她板起脸来骂道："马脸长长有鬃鬣，牛脸厚厚不知羞！我告诉大嫂和乡亲，看你脸面往哪收？"

银宜一计未成，又生一计。他去找寨老出主意，设计在款会上将助郎杀害，并暴尸示众，还宣布不得把杀死助郎之事讲给娘梅知道。

娘梅得知真相后，伤心得大哭起来，但她擦了擦眼泪，径直向长剑坡跑去。到了长剑坡，面对坡上堆堆尸骨，她细心地寻找助郎不离身边的半边钱。找了东坡，未找到；找了西坡，也未找到。她找不见半边钱，便坐在坡上呜呜哭了起来。谁知，听到她的哭声，一阵风把那些分散在山坡上的助郎尸骨，吹到了她的身边，半边钱也从尸骨堆里跳将出来，铮铮闪光。娘梅急忙拾起，拿出自己的一半合对，刚好合成圆圆整整的一枚"康熙钱"。

娘梅回到贯洞，就去和大苦爷爷商量。然后来到鼓楼，击响了法鼓，对大家说："谁愿斋祭七天亲手把助郎安葬，我愿意和他白头到老。"银宜假哭着上前应承。

做过了七天道场，娘梅带着银宜上山。走了一程又一程，直到长剑坡，娘梅才叫银宜在她指定的地点动手挖坑。挖到有三尺深，累得银宜直喘气，就在他弯腰时，娘梅一锹头对着他头顶打去。藏在一边的大苦爷爷，也马上跳出来相帮，把银宜埋在他自己挖的深坑里。

等到完事，娘梅接过大苦爷爷带来的包裹，背起助郎的尸骨，便直往深山里奔去了。

流传地区：贵州榕江、从江、黎平；广西三江、融水；湖南通道
搜集整理：吴居敬、吴贵元、过伟、杨通山`,
  },
  {
    id: "s3",
    title: "刘梅",
    category: "爱情传说",
    summary: "刘梅因算命先生的谗言被哥哥推下悬崖，幸被猎人茅子所救，两人结为夫妻。哥哥们因懒惰败家，最终悔过自新。",
    content: `六百塘寨有户富裕人家，夫妻俩有两个儿子，还想再要个女儿。有一次，妻子去挑水，听见田坎里有小女孩唱歌的声音。她放下水桶，循着歌声寻去，发现那歌声是从一支糠禾的禾胎里发出来的。她弯腰细听，歌声停止了，禾胎里隐隐约约传出了婴儿的哭叫声。她摘下禾胎来细看，不料禾胎一跳，跳进了她的嘴里，跑进她的肚里了。九个月之后，她生下一个女儿，取名叫刘梅。刘梅长大成人，长得十分漂亮聪明，织布、绣花、种棉、采茶都很麻利，还天生一副金嗓子，总是由她领头踩堂，所以远近闻名。

一天早晨，刘梅到水井边挑水，有个算命先生路过井边，见刘梅长得好看，便嬉皮笑脸地纠缠她。刘梅生气地用歌回敬他：

算命先生不正经，
胡说八道专门欺骗人，
哧吃哧喝嘴皮翻上又翻下，
这样的人三世算命九世打单身！

算命先生被骂得脸干干的，恼火地自言自语："你这妹仔真气人，有机会我要整死你！"

算命先生后来来到刘家，见到刘梅的两个哥哥刘金、刘二，便信口开河，说刘梅八字太凶，在家惹兄害父，出嫁惹子害夫，如不早除，祸害无数。两兄弟没有头脑，听信了谗言，便邀妹妹上山找杨梅，趁她俯身捡果之机，猛力一推，刘梅惨叫一声，跌下悬崖去了。

崖壁上那棵古松见了，赶快把枝枢往外伸长，刚好把刘梅稳稳接住。刘梅就这样在古松上挂了七八天，靠蜜蜂送来的蜂蜜和岩鸽衔来的百草度日。

后来，猎人茅子追着鹫鹰来到难冒冲，听到岩下有姑娘的哭声，用歌传话：

放鹰抓鸟进山林，
忽闻冲底有哭声，
雁鹅离群声声啼，
妹你啼哭为哪门？

刘梅也唱歌回答，茅子连忙砍下几根青藤，结成长绳，攀藤下去，把刘梅背上崖来。两人歌声作媒，鹧鸪作证，结了同心，一起回到广西八标屯成家立业。

刘金、刘二两兄弟因听信算命先生的鬼话，好吃懒做，不到三年两载，就把田地、房屋、杉木、茶山全部卖光，只好挨家挨户去讨饭。后来他们听闻妹妹没有死，羞怯地来到妹妹家门口。刘梅骂道："谁是谁的妹妹，你妹早被老虎咬死了。刘梅哪有讨饭的哥哥！"两兄弟无地自容，说："妈妈、妹妹，都是我们做错了事！饶恕我们这一次吧。从今以后，再也不信命了，一定勤勤恳恳做好人。"刘梅和茅子就留他们吃了饭，给些钱粮衣服，打发他们回去开荒种地，重建家园。

流传地区：贵州黎平、从江、榕江；广西三江、龙胜；湖南通道
搜集整理：罗家阔`,
  },
  {
    id: "s4",
    title: "述梅",
    category: "爱情传说",
    summary: "述梅与读书郎东苏以歌定情，却遭同学福安陷害。东苏被救后，述梅用仙绸惩治了福安，两人终成眷属。",
    content: `纳安地方有对勤劳、善良的夫妻，到了晚年仙姑送给他们一条白绸，才生下一个白净净的小女孩。丈夫欢喜得弹起琵琶，妻子高兴得唱起歌。三朝那天，夫妻俩把仙姑送给的白绸，缠在女儿的腰上，给她取名叫述梅。

述梅长到十八岁，人材出众，心灵手巧，能织出一手好锦。

一天，一个名叫东苏的读书郎路过述梅家，被一阵织锦声吸引住了。东苏止步细听，那声音象琵琶密密弹，象芦笙阵阵吹。东苏听着听着，不禁唱道：

你是天上的仙女，
还是人间的凤凰？
是谁给你一双巧手，
奏出的乐曲天下无双！

述梅听见有人唱歌，放下织布，走近窗前，见是一个英俊后生。她瞟了半晌，便唱道：

山福鸟栖居小溪旁，
鹃鹃鸟落脚山岗上，
岩鹊鸟高飞云天里，
英俊的后生啊，来自哪一方？

一个在楼上，一个在楼下，就这样不知对了多少歌。天空飘起毛毛细雨，东苏头发淋湿了也没有察觉。述梅却看得清清楚楚，顾不得着答答，登登登跑下楼梯，夺过东苏包袱，将他迎进屋里。东苏又接过述梅给他的白绢，也把自己的包头巾取下来，递给述梅。于是，由火塘、三脚灶作证，白绢、包头巾作媒，述梅、东苏结成了一对情人。

后来，东苏的同学福安，趁东苏午睡时，一眼望见系在东苏腰间的那条白绸，贪心大起。他邀请东苏去河边洗凉，东苏不识水性，被福安拉到水深处，涌来一个浪头，一下子被卷进了漩涡里。福安见东苏挣扎着往下沉，急忙上岸，三脚两步来到东苏房外，翻箱倒柜，终于在箱底找到那条白绸。不料白绸的一头却牢牢粘在箱子底，福安无法可想，火气一起，把白绸割成一片片。哪知东苏箱里的白绸被撕碎后，远在家里的述梅也病倒了，软绵绵地倒在床上。

东苏卷进漩涡，下到水底，却跌倒在一块石板上。那石板碰到东苏，动弹起来，慢慢浮出水面，挨近岸边。原来是一只比水牛牯还大的乌龟，正向他点头。东苏明白过来，忙向乌龟道了谢，跌跌撞撞回家去了。他赶忙把白绸碎片一点点拾起来，装进蓝布包袱里，心急如焚地到述梅家去。他就从包袱里取出绸片来，一片一片铺在述梅身上。昏睡过去的述梅，就渐渐醒了过来。铺在述梅身上的白绸碎片，这时已一片一片合拢来，成为完完整整一条绸带，述梅也就站了起来。

那福安不知道东苏得救，肚里编织假话，一路来找述梅，厚着脸皮说："可恨那东苏，他丢了你这漂亮情妹，到龙宫做龙王女婿去了。我特地赶来告诉你，你不要难过，从今以后，你就跟我共个火塘吧！"述梅不动声色，淡淡一笑。福安以为她听信了他的话，心里高兴，又说："只要情人答应，哪怕我变成乌鸦，也心甘情愿。"

述梅进内房和东苏悄悄说了几句，拿出那条白绸带套在福安的脖子上，笑着对他说："你真的愿意变乌鸦？"福安还以为述梅喜欢他，连声说："愿意，愿意。"述梅说："你会比乌鸦更漂亮！"等她话音刚落，福安真的开始变了，身子越变越小，嘴巴越变越尖，最后变成一只"嘎哇——嘎哇——"乱叫的黑乌鸦，脖子上有一圈白毛，飞出窗外去了。

从此，东苏、述梅和两位老人一起过着太平欢乐的日子。

流传地区：广西融水、三江；贵州从江
搜集整理：梁彬`,
  },
  {
    id: "s5",
    title: "小金包",
    category: "神奇故事",
    summary: "孤儿小金包救了一条小黄狗，小黄狗竟能点金，帮助他们祖孙摆脱贫困。贪婪的财主金百万强抢宝狗，最终自食恶果。",
    content: `从前下寨地方，家家户户都很穷苦，最穷苦的要算小金包家。小金包从小就失去父母，家里只剩下瞎眼的阿萨，老少两人相依为命，艰苦过日子。

一天，金包来到河边洗凉，忽然看见上游漂来一条小黄狗，叫得很凄凉，金包赶忙把它救上岸。小黄狗上了岸，摇着小尾巴，围着小金包转，很感激他。金包很喜欢这条小黄狗，把它带到家里，送到阿萨跟前。阿萨摸着小黄狗，脸上露出慈祥的笑容，但一会儿又伤心地说："小金包，还是放了它吧。我们家连饭都吃不饱，拿什么来喂它呀？"金包不忍心放走这个小伙伴，但是当他眼看着阿萨饿得干瘦如柴时，只好把小黄狗放了。

哪料这条小黄狗不愿离开他们，赶走了又跑回来，眼泪汪汪，抽着鼻子。金包见它怪可怜的，伤心得哭起来。就这样，小黄狗在这破木楼里安下了家。每天，金包把自己的一小碗糠菜饭留一半喂它。

小黄狗长大了，有一天，它在屋里跑来跑去，尾巴一扫，扫出一堆金灿灿的东西。金包捡起来一看，全是金子！从此，小黄狗每天都能扫出金子，婆孙俩的日子越过越好，还盖起了新房。

财主金百万听到这个消息，垂涎三尺，便带着家丁来到金包家，不管三七二十一，抢走了小黄狗。金百万大摆酒席，特意叫人抬来一张八仙桌，铺上大红绒子，摆好装金盆子，把小黄狗抬上桌去。等了老半天，莫说觅金子，连屁都不放一个。金百万说："快了快了，你看它肚子一鼓一鼓的，正在炼金子呢！"话音刚落，小黄狗尾巴一竖，一大堆不稀不硬的东西快把金盆装满了。金百万怕屎跌下地去，慌忙张开双手去接。小黄狗"不"的一声，一个夹屎屁把稀稀的臭狗屎喷得金百万一脸。围着看热闹的人都捂着鼻子哄笑起来，金百万脸烧得象猴子屁股。

金百万当众丢尽面子，抢起棍子朝小黄狗打去。小黄狗转身咬他一口，家丁出来救驾，乱棍打死了小黄狗，把它丢到河边。

金包听到这个消息，伤心得大哭起来，他把小黄狗背回来，葬在屋旁桃树脚下。金百万呢，伤口总不见好，后来化脓溃烂开来，全身没有一块好肉，不多久就死了。

第二年，小金包屋旁那棵桃树，结出的桃子特别大，又格外多。有天早晨，小金包打开门，满树桃果金光闪闪的，毕毕剥剥落满地。捡起来看，全是金的。婆孙俩就把它们送给穷苦邻居，从此大家都过上好日子。

流传地区：广西三江、龙胜
搜集整理：梁志刚、肖启中`,
  },
  {
    id: "s6",
    title: "南瓜儿",
    category: "神奇故事",
    summary: "一对老夫妇种出了一个会说话的南瓜儿，南瓜儿用智慧帮助老人惩治了贪婪的国王，展现了侗族民间故事中的奇幻色彩。",
    content: `从前，山梁里有一对年老的夫妇，勤勤恳恳种瓜种豆，换米换盐过日子。

有一年，夫妇俩种了一棵南瓜。瓜藤爬满了一座小山岗，人人见了都说南瓜要大丰收了，夫妇俩非常高兴。谁知道了七八月还不见结瓜，两个老人听说瓤瓜藤可以结瓜，削了一根小竹签，刺进离泥面三寸的瓜藤里，一边割瓜藤，一边伤心地哭了起来："瓜藤呀，我们两个老人，天天挑水挑粪，你为什么不结瓜呀？我们多么指望你结瓜换米换盐呢！"夫妇俩话末讲完，瓜藤上长出一个大南瓜来。

两老高兴极了，正想去摘，却见这个南瓜长得象个人头一样，有鼻子，有眼睛，有耳朵和嘴巴。南瓜对他们说："两位老人家，请不要怕，你们年纪这样大了，还没有儿女，我愿意做个儿子。"两夫妇拿个筷笼来，南瓜说："不用抬了，我自己会走路。"夫妇俩一上路，南瓜就跟在后面滚。夫妇俩给他起名叫南瓜儿，南瓜儿也亲热地喊他们"爸爸，妈妈"。

南瓜儿代他们去种菜，叫他们只管挑菜去卖。南瓜儿在菜地里滚来滚去，把菜种得很好，早上播下的菜种，下午就可以收割，豆角有一丈多长，辣椒有水牛角一样大，白菜叶子比芭蕉叶还要宽，两个老人高兴得不得了。

南瓜儿种菜的事传遍了全寨，越传越远，传到了京城，被国王知道了。国王派三个凶神恶煞一样的差官，来抓南瓜儿到王宫为国王种菜。差官对夫妇俩说："处罚你们一百两黄金，一百两白银，限三天内交到王宫里来，要不然儿子拿去充军，两条老命也要拿去顶帐。"

南瓜儿从泥地里跳出来，安慰他们说："不要为这点小事担忧，我有办法。"他叫老头把两条鲤鱼喂给三脚狗吃了，第二天赶狗上路，一鞭一鞭抽狗，三脚狗扇一团黄黄的东西，又扇一团白白的东西。一路扇到王宫门前，那些黄的和白的东西，变成了闪光发亮的金子和银子。国王和一群大臣争抢金银，统统拿到金库去。

第二天早晨，国王闻到皇宫里有一种臭味，大臣们到处寻找，发现臭味是从金库散发出来的。国王和大臣们亲自到金库去察看，打开库门，臭味象浓烟一样涌出来，把国王和大臣一起惊死了。

流传地区：广西三江
搜集整理：吴浩`,
  },
  {
    id: "s7",
    title: "养鹅小姑娘",
    category: "神奇故事",
    summary: "养鹅小姑娘寻找走失的鹅，误入鸭变婆的洞穴，凭借机智与勇敢，用筷子和石山拖延时间，最终逃脱了妖精的追捕。",
    content: `从前，有个养鹅的小姑娘，放鹅在山脚，天将要黑了，收鹅点数少了一只。她找来找去找不见，只好先把鹅群赶回家，回到家里把鹅群关好，再回到山坡去找那只鹅。她一路找，一路听，好象山上有鹅叫，顺着叫声找去，又不见它在哪里。她找呀找呀，找到一个大山洞，看到里面有个小妹仔，正在吃生鹅肉。那小妹仔丢一只鹅腿给她，鲜血淋淋的，她不敢吃。

那小妹仔吃完鹅肉，要养鹅小姑娘陪它玩。养鹅小姑娘被它缠住，一时无法脱身，只好跟它一起玩。那小妹仔戴的手镯是竹子做的，见养鹅小姑娘的银手镯亮闪闪的，好看得多，就要跟她换手镯。她不愿意，说："我的手镯是银子的，你的是竹子的，我不跟你换。"那小妹仔说："你不换，我骂我妈妈把你吃掉。"养鹅小姑娘一听，吓了一跳："哎哟！跳进阿萨讲的鸭变婆洞里来了！吃生鹅肉的小妹仔一定是鸭变婆的女儿了！"

养鹅的小姑娘想了想，改变了主意，跟它换了手镯，又提出跟它换对襟衣、百褶裙，换了以后，养鹅小姑娘一面跟鸭变婆的女儿玩，一面随时留神注视着洞口。

鸭变婆出洞找东西吃去了，它找东找西都找不到吃的，只好饿着肚子回洞来。它发现洞里多了一个戴银手镯的姑娘，不管三七二十一，随手抓来填肚子。吃罢以后，又出洞去了。

养鹅小姑娘越想越怕，赶紧想办法逃出洞去。她把洞里的筷子全部拿走，出洞后，走了一段路就丢一根筷子。鸭变婆回到洞里，不见戴竹圈的女儿，才懂得错吃了自己的女儿，马上出洞去追赶养鹅小姑娘。

它一出洞，就看见自己的筷子丢在地上，它捡了一根送回洞里，才转来追。走一段路又发现筷子，捡了一根又送回洞里，鸭变婆虽然这样多次来回，但它走得很快。小姑娘手上的筷子丢完了，鸭变婆追到小姑娘背后了。小姑娘着急地喊："大石山快来救我呀！鸭变婆追我来了！"大石山当真崩了下来，挡住了鸭变婆。

鸭变婆虽然每次都被拖延，但它走得很快，一次次追上来。最后，养鹅小姑娘跑到河边，看见河上有一只船，船里有两个男人。小姑娘说："两位哥哥快来救我！鸭变婆追我来了！"两位男人把她藏进船舱里。

鸭变婆追到河边来了，问那两个男人："两个哥哥，看见有个小姑娘过河吗？"那两个男人说："没有看见。"鸭变婆往河里一看，看见自己的影子在水里面，以为是养鹅小姑娘，就说："水底不是有人吗？"那两个男人故意说："是呀！是呀！快点钻下去把她抓上来呀！"鸭变婆想钻下去，但它身子太轻了，怎么钻也钻不下去。那两个男人说："你去找条粗藤来，拴块大石头在颈脖上，一钻就钻下去了。"鸭变婆照这样做，钻了下去，结果死在水底了。

那两个男人在船上喊："小姑娘，出来吧！鸭变婆死在水底了。"养鹅姑娘谢过两位哥哥，高高兴兴回家去了。

流传地区：广西三江、融水、融安、龙胜
搜集整理：滚三妹、石以林、韦英`,
  },
  {
    id: "s8",
    title: "布谷鸟和金色雀",
    category: "动物故事",
    summary: "勤劳的布谷鸟被懒惰的金色雀灌醉后偷走了漂亮的衣裳。金色雀穿上偷来的衣服却被百鸟嫌弃，布谷鸟失去衣服后每年叫唤，成为侗家春耕的信号。",
    content: `布谷鸟和金色雀原来是很好的朋友。

布谷鸟很爱劳动，每天从这棵树飞到那棵树，从这边坡飞到那边坡，到处找害虫吃。它穿着一件漂亮的花衣，还有一张灵巧的嘴，会唱一口好听的歌。每到一个地方，画眉、黄莺、鹦鹉、阳雀、金鸡、竹鸡等都很喜欢它。

金色雀不爱劳动，一天到晚东跑西飞，不干活计，它穿着一件多年不洗的破旧灰衣，笨手笨脚，常常欺侮小鸟；因此，它每到一个地方，画眉、黄莺、鹦鹉、阳雀、金鸡、竹鸡等都远远地躲避它，讨厌它。

春天来到，金色雀想弄到一件时髦的衣服和一张会说会唱的嘴，它心中暗想：当我换上世界上最漂亮的衣服以后，我就是天天吃喝玩乐，它们也要热烈地欢迎我。

有一天，它想了一个办法，对布谷鸟说："我最好的布谷大哥！你是我最喜欢的人，只有你才配做我的朋友。明天，请你到我家里去做客，我一定好好地招待你。"诚实的布谷鸟，见金色雀说了一回又一回，便答应了。

到了这天，金色雀家里摆满了腌鱼和腌肉，保存了十多年的酒，蒸得香喷喷的糯米饭，还有各式各样的上等菜。布谷鸟喝着，吃着，不一会感到有了一些醉意，就推谢不吃了。但是，金色雀哪里肯放，它一边端了酒杯，一边抱住布谷鸟的头，使劲地灌，一杯又一杯，布谷鸟被灌得呼呼大醉，不省人事，就在那里睡着了。

原来，金色雀把布谷鸟灌醉以后，脱去了它那件漂亮的衣裳，偷偷地溜跑了。

金色雀得到漂亮的衣服以后，高高兴兴地穿在身上，急忙飞到百鸟群中去，趾高气扬地在大家面前走，让大家赞赏它的美丽。但是，事实却完全使它失望；它一飞到哪里，哪里的鸟就你一言我一语地说："看！它从哪里得到一件那么漂亮的新衣？""讨厌的家伙来啦！""好吃懒做的金色雀还有新衣穿？我看一定是别人的。"不一会，所有鸟都停止了歌唱，噔噔地飞走了。

从此，金色雀每到一个地方，所有的鸟都讨厌它而飞走了。这只偷了别人衣服的金色雀，就永远成了一只孤独的可怜虫。

布谷鸟失去衣服以后，天天冷得发抖，嘴也冻僵了。每年到它失去衣服的那天，就开始在古树上声声地叫唤："锢古！锢古！"（侗语：丢失衣服的意思）

人们一听到布谷鸟的叫声，个个都很同情它不幸的遭遇。每年到这时候，农民们都说："布谷叫啦！快快播种吧！多下些种子，秋收多打粮，好给布谷鸟买件漂亮的衣裳。"

直到现在，侗家山乡的布谷鸟一叫，春耕就开始了。

流传地区：黔、湘、桂侗族地区
口述：石廷章
搜集整理：华谬`,
  },
];

const categoryColors: Record<string, string> = {
  "神话传说": "bg-purple-50 text-purple-600",
  "爱情传说": "bg-rose-50 text-rose-600",
  "神奇故事": "bg-amber-50 text-amber-600",
  "动物故事": "bg-green-50 text-green-600",
};

const quizQuestions = [
  { q: "侗族大歌被列入联合国非遗名录是哪一年？", options: ["2005年", "2009年", "2012年", "2015年"], answer: 1 },
  { q: "侗族建筑中最具代表性的是？", options: ["吊脚楼", "鼓楼和风雨桥", "土楼", "碉楼"], answer: 1 },
  { q: "侗族服饰以什么颜色为主？", options: ["红色", "白色", "蓝靛色", "黄色"], answer: 2 },
  { q: "侗族大歌的演唱特点是？", options: ["独唱", "有指挥的合唱", "无伴奏多声部合唱", "器乐伴奏"], answer: 2 },
  { q: "侗年通常在农历几月？", options: ["正月", "五月", "八月", "十月或十一月"], answer: 3 },
  { q: "《找歌的传说》中，金必等人在哪里找到了失散的歌？", options: ["山顶", "龙潭石缝里", "古树下", "河边沙滩"], answer: 1 },
  { q: "《布谷鸟和金色雀》中，金色雀用什么办法偷走了布谷鸟的衣裳？", options: ["趁夜偷走", "把布谷鸟灌醉后偷走", "抢走的", "用食物换的"], answer: 1 },
];

export default function Culture() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"categories" | "stories" | "pipa" | "quiz">("categories");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const handleQuizAnswer = (idx: number) => {
    setQuizAnswer(idx);
    if (idx === quizQuestions[quizIndex].answer) {
      setQuizScore((s) => s + 1);
    }
    setTimeout(() => {
      if (quizIndex + 1 < quizQuestions.length) {
        setQuizIndex((i) => i + 1);
        setQuizAnswer(null);
      } else {
        setQuizFinished(true);
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswer(null);
    setQuizFinished(false);
  };

  const currentStory = folkStories.find(s => s.id === selectedStory);

  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />
      <Carousel />

      <section className="py-10 px-4">
        <div className="max-w-[1100px] mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-dong-indigo font-bold">侗族文化</h2>
            <p className="text-dong-light text-sm mt-2 max-w-[600px] mx-auto">
              探索侗族丰富多彩的文化遗产，了解建筑、服饰、音乐、节日等方面的独特魅力
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-white rounded-xl p-1 border border-dong-indigo/10 shadow-sm max-w-[700px] mx-auto">
            {[
              { key: "categories" as const, label: "文化分类", icon: MapPin },
              { key: "stories" as const, label: "民间故事", icon: BookOpen },
              { key: "pipa" as const, label: "琵琶歌", icon: Music },
              { key: "quiz" as const, label: "知识问答", icon: Calendar },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm transition-all ${
                  activeTab === t.key ? "bg-dong-indigo text-white shadow-sm" : "text-dong-light hover:text-dong-indigo hover:bg-dong-cream/50"
                }`}
              >
                <t.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <>
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg border border-dong-indigo/10">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-culture-hero-bXVLgdU2pfKceyYv2mwSed.webp"
                  alt="侗族文化"
                  className="w-full h-auto max-h-[400px] object-cover"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {cultureCategories.map((cat, i) => (
                  <button key={i} onClick={() => setSelectedCategory(i)} className="group text-left">
                    <div className="rounded-xl overflow-hidden shadow-md border border-dong-indigo/10 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    </div>
                    <p className="text-center text-sm font-serif text-dong-indigo font-bold mt-3 group-hover:text-dong-rose transition-colors">
                      {cat.title}
                    </p>
                    <p className="text-center text-xs text-dong-light mt-0.5 line-clamp-1">{cat.summary}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* 民间故事 Tab */}
          {activeTab === "stories" && (
            <div>
              {selectedStory === null ? (
                <>
                  <div className="bg-dong-cream/40 rounded-xl p-4 border border-dong-indigo/10 mb-6">
                    <p className="text-sm text-dong-light leading-relaxed">
                      以下故事选自《侗族民间故事选》（杨通山等编），涵盖神话传说、爱情故事、神奇故事和动物故事等类型，
                      是侗族口耳相传的珍贵文化遗产。
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {folkStories.map((story) => (
                      <div
                        key={story.id}
                        className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => setSelectedStory(story.id)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[story.category] || "bg-dong-indigo/5 text-dong-indigo"}`}>
                            {story.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-dong-indigo group-hover:text-dong-rose transition-colors mb-2 text-lg font-serif">{story.title}</h3>
                        <p className="text-sm text-dong-light leading-relaxed line-clamp-3">{story.summary}</p>
                        <div className="flex items-center justify-end mt-3">
                          <span className="text-xs text-dong-rose flex items-center gap-1">
                            阅读全文 <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div>
                  <button onClick={() => setSelectedStory(null)} className="text-sm text-dong-light hover:text-dong-indigo flex items-center gap-1 mb-4">
                    ← 返回故事列表
                  </button>
                  {currentStory && (
                    <div className="bg-white rounded-xl p-6 md:p-8 border border-dong-indigo/10 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[currentStory.category] || "bg-dong-indigo/5 text-dong-indigo"}`}>
                          {currentStory.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-serif text-dong-indigo font-bold mt-1 mb-2">{currentStory.title}</h3>
                      <p className="text-sm text-dong-rose mb-6">{currentStory.summary}</p>
                      <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed whitespace-pre-line border-t border-dong-indigo/10 pt-6">
                        {currentStory.content}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 琵琶歌 Tab */}
          {activeTab === "pipa" && (
            <div className="space-y-6">
              {/* 介绍 */}
              <div className="bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-dong-rose/10 flex items-center justify-center flex-shrink-0">
                    <Music size={20} className="text-dong-rose" />
                  </div>
                  <div>
                    <h3 className="font-serif text-dong-indigo font-bold text-lg">侗族琵琶歌</h3>
                    <p className="text-xs text-dong-light mt-0.5">侗语：al biil · 弹唱一体的独特艺术</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                  侗族琵琶歌（侗语：al biil）是侗族独具特色的弹唱艺术形式，演唱者自弹侗族琵琶、自唱，
                  曲调优美婉转，内容涵盖爱情、劳动、历史传说等。侗族琵琶与汉族琵琶形制不同，
                  侗族琵琶为四弦，音色清亮，是侗族青年男女行歌坐月时的重要伴奏乐器。
                  琵琶歌多在月堂（侗语：nyenc）中演唱，是侗族青年男女交流感情、传承文化的重要方式。
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "乐器", value: "侗族四弦琵琶" },
                    { label: "演唱方式", value: "自弹自唱" },
                    { label: "场合", value: "月堂行歌坐月" },
                    { label: "内容", value: "爱情·劳动·传说" },
                  ].map(item => (
                    <div key={item.label} className="bg-dong-cream/40 rounded-xl p-3 text-center border border-dong-indigo/10">
                      <p className="text-xs text-dong-light mb-1">{item.label}</p>
                      <p className="font-bold text-dong-indigo text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 视频播放 */}
              <div className="bg-white rounded-xl border border-dong-indigo/10 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-dong-indigo/10">
                  <div className="flex items-center gap-2">
                    <Play size={16} className="text-dong-rose" />
                    <h4 className="font-bold text-dong-indigo">琵琶歌演唱视频</h4>
                    <span className="text-xs text-dong-light ml-auto">侗族传统弹唱表演</span>
                  </div>
                </div>
                <div className="relative bg-black">
                  <video
                    className="w-full max-h-[500px] object-contain"
                    controls
                    preload="metadata"
                    onPlay={() => setVideoPlaying(true)}
                    onPause={() => setVideoPlaying(false)}
                    src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/pipa-song.mp4`}
                  >
                    您的浏览器不支持视频播放。
                  </video>
                </div>
                <div className="p-4 bg-dong-cream/20">
                  <p className="text-xs text-dong-light leading-relaxed">
                    视频展示了侗族琵琶歌的传统演唱形式。演唱者手持侗族琵琶，边弹边唱，
                    展现了侗族音乐文化的独特魅力。
                  </p>
                </div>
              </div>

              {/* 琵琶歌与大歌对比 */}
              <div className="bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm">
                <h4 className="font-bold text-dong-indigo text-sm mb-4">琵琶歌与侗族大歌的区别</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-dong-cream/40">
                        <th className="text-left px-3 py-2 text-dong-indigo font-semibold rounded-tl-lg">特征</th>
                        <th className="text-left px-3 py-2 text-dong-rose font-semibold">琵琶歌（al biil）</th>
                        <th className="text-left px-3 py-2 text-dong-indigo font-semibold rounded-tr-lg">侗族大歌（al laox）</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dong-indigo/5">
                      {[
                        ["演唱方式", "独唱/对唱，自弹自唱", "多声部合唱，无伴奏"],
                        ["乐器", "侗族四弦琵琶", "无伴奏"],
                        ["声部", "单声部", "多声部（二至四声部）"],
                        ["场合", "月堂行歌坐月", "节日庆典、迎客"],
                        ["内容", "爱情、生活、传说", "自然、伦理、历史"],
                        ["非遗地位", "省级非物质文化遗产", "联合国人类非遗（2009）"],
                      ].map(([feat, pipa, dage]) => (
                        <tr key={feat} className="hover:bg-dong-cream/20">
                          <td className="px-3 py-2.5 font-medium text-dong-indigo">{feat}</td>
                          <td className="px-3 py-2.5 text-dong-rose/80">{pipa}</td>
                          <td className="px-3 py-2.5 text-dong-light">{dage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === "quiz" && (
            <div className="max-w-[600px] mx-auto">
              {!quizFinished ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-dong-light">第 {quizIndex + 1} / {quizQuestions.length} 题</p>
                    <p className="text-sm text-dong-rose font-bold">得分: {quizScore}</p>
                  </div>
                  <div className="w-full bg-dong-cream rounded-full h-2 mb-6">
                    <div className="bg-dong-indigo h-2 rounded-full transition-all" style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }} />
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-dong-indigo/10 mb-6">
                    <p className="text-lg font-bold text-dong-indigo text-center">{quizQuestions[quizIndex].q}</p>
                  </div>

                  <div className="space-y-3">
                    {quizQuestions[quizIndex].options.map((opt, idx) => {
                      const isCorrect = idx === quizQuestions[quizIndex].answer;
                      const isSelected = quizAnswer === idx;
                      let cls = "bg-white border border-dong-indigo/15 text-dong-indigo hover:bg-dong-indigo/5";
                      if (quizAnswer !== null) {
                        if (isCorrect) cls = "bg-green-50 border-green-300 text-green-700";
                        else if (isSelected) cls = "bg-red-50 border-red-300 text-red-700";
                      }
                      return (
                        <button
                          key={idx}
                          onClick={() => quizAnswer === null && handleQuizAnswer(idx)}
                          disabled={quizAnswer !== null}
                          className={`w-full rounded-xl p-4 text-left transition-all ${cls} disabled:cursor-default`}
                        >
                          <span className="font-medium">{String.fromCharCode(65 + idx)}. {opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-dong-indigo/10 text-center">
                  <BookOpen className="w-12 h-12 text-dong-gold mx-auto mb-4" />
                  <h3 className="text-2xl font-serif text-dong-indigo font-bold mb-2">问答完成！</h3>
                  <p className="text-4xl font-bold text-dong-rose mb-2">
                    {Math.round((quizScore / quizQuestions.length) * 100)}分
                  </p>
                  <p className="text-sm text-dong-light mb-6">答对 {quizScore} / {quizQuestions.length} 题</p>
                  <Button onClick={resetQuiz} className="bg-dong-indigo hover:bg-dong-deep text-white">
                    重新答题
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedCategory !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedCategory(null)}>
          <div className="bg-white rounded-2xl max-w-[750px] w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img src={cultureCategories[selectedCategory].image} alt={cultureCategories[selectedCategory].title} className="w-full h-64 object-cover rounded-t-2xl" />
              <button onClick={() => setSelectedCategory(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white">
                <X className="w-4 h-4 text-dong-indigo" />
              </button>
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-serif text-dong-indigo font-bold mb-2">{cultureCategories[selectedCategory].title}</h3>
              <p className="text-dong-rose text-sm mb-4">{cultureCategories[selectedCategory].summary}</p>
              <p className="text-foreground/75 leading-relaxed text-sm mb-6">{cultureCategories[selectedCategory].description}</p>
              <div className="bg-dong-cream/40 rounded-xl p-4 border border-dong-indigo/10">
                <h4 className="font-bold text-dong-indigo text-sm mb-2">你知道吗？</h4>
                <ul className="text-sm text-foreground/70 space-y-1.5">
                  {cultureCategories[selectedCategory].facts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-dong-gold mt-0.5">★</span> {fact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
