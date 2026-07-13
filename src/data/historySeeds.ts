import type {
  HistoryEra,
  HistorySeed,
  TravelerOccupation,
  TravelerProfile,
  TravelerRiskStyle,
  TravelerStrength,
  VisualTone,
} from "../game/types";
import { buildTravelerProfile } from "../game/profile";

const eraFor = (year: number): HistoryEra => {
  if (year <= 600) return "ancient";
  if (year <= 1450) return "medieval";
  if (year <= 1800) return "early-modern";
  if (year <= 1914) return "industrial";
  return "modern";
};

const moment = (
  id: string,
  year: number,
  dateLabel: string,
  eventName: string,
  location: string,
  perspective: "china" | "world",
  role: string,
  decision: string,
  urgency: string,
  historicalOutcome: string,
  baselineFacts: HistorySeed["baselineFacts"],
  domain: string,
  visualTone: VisualTone,
  occupationTags: readonly TravelerOccupation[],
  strengthTags: readonly TravelerStrength[],
  riskTags: readonly TravelerRiskStyle[],
): HistorySeed => ({
  id,
  era: eraFor(year),
  year,
  dateLabel,
  eventName,
  location,
  chinaRelated: perspective === "china",
  perspective,
  role,
  decision,
  urgency,
  historicalOutcome,
  baselineFacts,
  prompt: decision,
  domain,
  visualTone,
  occupationTags,
  strengthTags,
  riskTags,
});

const P = ["product", "public-service"] as const;
const E = ["engineering", "student"] as const;
const B = ["business", "product"] as const;
const C = ["creative", "student"] as const;
const S = ["strategy", "organization"] as const;
const N = ["negotiation", "law"] as const;
const T = ["technology", "strategy"] as const;
const W = ["writing", "negotiation"] as const;
const M = ["medicine", "organization"] as const;
const CAUTIOUS = ["cautious", "balanced"] as const;
const BALANCED = ["balanced"] as const;
const BOLD = ["bold", "balanced"] as const;

export const HISTORY_SEEDS: readonly HistorySeed[] = [
  moment("red-cliffs-208", 208, "208年冬", "赤壁火攻前夜", "长江赤壁水域", "china", "周瑜帐下负责火船的军需官", "是否在风向仍不稳定时提前放出黄盖的火船", "距离曹军发现火船约半个时辰", "孙刘联军借东风火攻，曹操水军溃败，三国鼎立格局由此成形。", ["曹军舰船以铁索相连", "黄盖已定下诈降火攻", "冬季风向将决定火势"], "战争", "war", P, ["strategy", "technology"], BOLD),
  moment("dong-zhuo-lu-bu-190", 190, "190年4月9日", "董卓焚洛阳：吕布的生死", "洛阳宣阳门外", "china", "王允安插在吕布亲兵中的宫门司马", "是否趁吕布押送百官出城时发动伏击，提前除掉董卓最锋利也最危险的部将", "董卓的迁都车队将在一刻钟后穿过城门", "董卓强迫汉献帝与百姓迁往长安并焚毁洛阳；两年后，吕布与王允合谋杀死董卓。", ["关东联军正在逼近洛阳", "吕布已杀丁原并投靠董卓", "董卓准备挟持汉献帝迁都长安"], "政变", "revolution", P, ["strategy", "organization"], BOLD),
  moment("guandu-wuchao-200", 200, "200年10月", "官渡决胜：曹操夜袭乌巢", "官渡曹军中军帐，今河南中牟", "china", "曹操帐下核验许攸口供的军情参议", "是否担保刚刚叛逃的许攸所言属实，让曹操亲率精锐夜袭袁绍粮仓", "袁军下一批粮车将在天亮前进入乌巢", "曹操采纳许攸建议，亲率精锐烧毁乌巢粮仓，袁军军心崩溃，官渡之战由此逆转。", ["袁绍兵力与粮草远多于曹操", "双方已在官渡相持数月", "许攸刚从袁绍阵营叛逃"], "战争", "war", P, ["strategy", "negotiation"], BOLD),
  moment("yiling-222", 222, "222年夏", "夷陵之战：刘备连营七百里", "猇亭蜀汉前军营地，今湖北宜昌", "china", "刘备身边负责勘察水源与营垒的参军", "是否当面反对沿山林连营，要求全军退到开阔水源地等待东吴进攻", "陆逊的火攻小队将在今夜抵达上风口", "陆逊利用酷暑与连营发动火攻，蜀军大败，刘备退守白帝城并于次年病逝。", ["刘备为夺回荆州亲征东吴", "蜀军营寨沿山林分布且战线很长", "陆逊已坚守数月等待蜀军疲惫"], "战争", "war", P, ["strategy", "organization"], CAUTIOUS),
  moment("jieting-228", 228, "228年春", "马谡失街亭前夜", "街亭山口，今甘肃秦安一带", "china", "王平麾下负责标定水源的军帐校尉", "是否越级封存军令，强迫马谡放弃上山并依水据城下寨", "张郃骑兵将在天亮后封锁山下水道", "马谡违背诸葛亮部署上山扎营，被张郃断绝水道后溃败，蜀汉第一次北伐被迫撤军。", ["街亭是蜀军粮道与退路要冲", "王平反复劝马谡依水下寨", "魏将张郃正率骑兵逼近"], "军令", "war", P, ["strategy", "organization"], BOLD),
  moment("gaoping-tombs-249", 249, "249年2月5日", "高平陵之变：曹爽是否投降", "洛阳城南高平陵驿道", "china", "曹爽营中负责护送魏帝的宿卫军官", "是否扣住劝降使者，护送曹爽与皇帝曹芳转赴许昌召集外军", "司马懿控制的洛阳城门将在日落前完成换防", "曹爽接受司马懿只免官不追究的承诺，交出兵权回到洛阳，随后被以谋反罪处死，曹魏大权转入司马氏。", ["曹爽陪同魏帝离开洛阳祭陵", "司马懿已夺取武库并控制京城", "曹爽手中仍有皇帝和调兵符节"], "政变", "revolution", P, ["strategy", "law"], BOLD),
  moment("feishui-383", 383, "383年11月", "淝水之战临河退阵", "淝水西岸，今安徽寿县", "china", "苻坚中军传令官", "是否传达全军后退让晋军渡水的命令", "晋军渡河前的一刻钟", "前秦军后退时秩序崩溃，晋军趁势冲击，前秦统一南北的计划失败。", ["前秦兵力远多于东晋", "晋军请求秦军后退以便渡水决战", "前秦各部族军队指挥不一"], "战争", "war", P, S, CAUTIOUS),
  moment("sui-unification-589", 589, "589年1月", "隋军渡江灭陈", "建康石头城，今南京", "china", "隋军前锋的渡江统筹官", "是否趁陈朝庆典戒备松弛于夜间全线渡江", "距离陈军恢复城防只剩数小时", "隋军成功渡江并攻入建康，结束了近三百年的南北分裂。", ["隋已经统一北方", "陈朝长江防线过度分散", "建康正在庆贺元会"], "统一", "ancient", P, ["organization", "strategy"], BOLD),
  moment("xuanwu-gate-626", 626, "626年7月2日", "玄武门之变", "长安太极宫玄武门", "china", "尉迟敬德手下的宫门校尉", "是否在太子李建成到达前封闭玄武门并隔绝东宫援军", "距离李建成入门不到一炷香", "李世民在玄武门杀死李建成、李元吉，随后成为太子并即位为唐太宗。", ["李世民与太子集团矛盾已无法调和", "玄武门控制皇宫北面通道", "唐高祖正召三子入宫对质"], "政变", "revolution", P, ["organization", "strategy"], BOLD),
  moment("wu-zetian-690", 690, "690年10月16日", "武则天称帝前的最后一道诏书", "洛阳则天门内", "china", "负责誊录登基诏与继承条款的凤阁舍人", "是否把皇嗣李旦的法定继承顺位写进诏书正本，阻止武氏诸王日后争储", "金简将在半个时辰后送上则天门宣读", "武则天改国号为周并称帝，李旦降为皇嗣；神龙政变后李唐复辟。", ["武则天已掌握朝政多年", "群臣正在劝进改唐为周", "李氏与武氏宗族围绕继承权激烈角力"], "继承", "revolution", C, ["law", "writing"], BALANCED),
  moment("an-lushan-755", 755, "755年12月", "安禄山叛军逼近潼关", "潼关，今陕西渭南", "china", "哥舒翰帅府中的军令参议", "是否冒着违抗唐玄宗的风险坚持闭关不出战", "距离长安再次发来出战诏令只剩一日", "哥舒翰被迫出关后大败，潼关失守，唐玄宗仓皇逃离长安。", ["潼关地势利于坚守", "叛军补给线正在拉长", "朝廷怀疑哥舒翰拥兵自重"], "战争", "war", P, ["strategy", "law"], CAUTIOUS),
  moment("mawei-756", 756, "756年7月15日", "马嵬驿兵变：玄宗的选择", "马嵬驿，今陕西兴平", "china", "禁军统帅陈玄礼身边的传令军官", "是否在士兵哗变前公开处决杨国忠，并护送杨贵妃与太子分路离开驿站", "愤怒的禁军已经包围驿馆", "禁军杀死杨国忠并要求处死杨贵妃；唐玄宗被迫赐死杨贵妃，太子李亨随后北上并自行即位。", ["潼关失守后玄宗正逃往四川", "禁军把战败归咎于杨国忠", "太子与皇帝身边的政治集团已经分裂"], "兵变", "revolution", P, ["negotiation", "organization"], BOLD),
  moment("chen-bridge-960", 960, "960年2月3日", "陈桥兵变黄袍加身", "陈桥驿，今河南新乡", "china", "赵匡胤亲军的掌书记", "是否在将士鼓噪前唤醒赵匡胤并送出密信给后周朝廷", "距离将士拥入寝帐不到一个时辰", "赵匡胤接受黄袍，回师开封建立北宋，后周幼主退位。", ["后周皇帝年幼", "赵匡胤掌握都城主力禁军", "边境军情为出兵提供了理由"], "政变", "revolution", P, ["organization", "negotiation"], BALANCED),
  moment("chanyuan-1004", 1004, "1004年12月", "澶渊前线和议", "澶州，今河南濮阳", "china", "宋真宗身边的和谈条款起草官", "是否接受每年岁币以换取辽军撤退和边境开市", "距离辽使再次入营只剩两个时辰", "宋辽签订澶渊之盟，北宋提供岁币，两国维持了百余年总体和平。", ["辽军已深入宋境", "宋真宗亲至澶州提振士气", "辽军统帅萧挞凛刚被射杀"], "外交", "exchange", P, N, CAUTIOUS),
  moment("wang-anshi-1069", 1069, "1069年秋", "王安石变法：青苗法出京", "开封制置三司条例司", "china", "负责汇总地方灾情与贷款数据的检详官", "是否压下全国推行诏书，要求先在五个州试行青苗法并公开实际利息", "首批诏令将在今夜送往各路转运司", "青苗法随后在全国推行，旨在向农户提供低息贷款，但执行中也出现强制摊派与加息，引发长期党争。", ["宋神宗决心以新法富国强兵", "地方官考核与放贷数量绑定", "保守派担心官府借贷加重农民负担"], "改革", "print", P, ["business", "law"], CAUTIOUS),
  moment("jingkang-1127", 1127, "1127年1月", "金军二围汴京", "汴京宣德门，今河南开封", "china", "李纲被罢后留在城内的旧部", "是否组织军民拒绝开城议和并强行接管城防", "金军要求宋帝出城议和前的最后一夜", "北宋向金军屈服，徽、钦二帝及宗室被俘，北宋灭亡。", ["汴京尚有数万军民", "主和派认为议和可保皇室", "外地勤王军未能及时协同"], "围城", "war", P, ["organization", "strategy"], BOLD),
  moment("yue-fei-1140", 1140, "1140年7月", "郾城大捷后的十二道金牌", "郾城军营，今河南漯河", "china", "岳飞中军负责接诏的机宜官", "是否暂压金牌不报，为岳家军再争取三日北进时间", "下一道班师诏书已在途中", "岳飞被迫班师，收复中原的攻势中断，次年被解除兵权并下狱。", ["岳家军刚在郾城击败金军主力", "南宋朝廷正与金议和", "连续擅留将被视为抗旨"], "军令", "war", P, ["strategy", "law"], BOLD),
  moment("diaoyu-1259", 1259, "1259年8月", "蒙哥汗死于钓鱼城下", "钓鱼城，今重庆合川", "china", "守将王坚的投石机指挥官", "是否在蒙哥汗亲自巡视前沿时集中全部投石机攻击其所在高地", "蒙古护卫将在几分钟内搭起遮蔽", "蒙哥汗在围城期间死去，蒙古西征与南宋战线调整，帝国陷入汗位争夺。", ["钓鱼城已坚守数月", "蒙军不适应山地与酷暑", "蒙哥汗亲自督战"], "围城", "war", E, T, BOLD),
  moment("xiangyang-1273", 1273, "1273年2月", "襄阳城破前的最后补给船", "汉水襄阳城外", "china", "南宋水军中负责突围航线的统制官", "是否牺牲护航主舰撞开元军封锁，把粮药和火器送入被围六年的襄阳", "元军回回炮将在天亮后再次轰击樊城", "樊城失守后襄阳守将吕文焕投降，元军由此打开沿汉水与长江进攻南宋的通道。", ["襄阳与樊城已被围困多年", "元军切断了大部分水陆补给", "新式回回炮开始摧毁城防"], "围城", "war", E, ["strategy", "technology"], BOLD),
  moment("yamen-1279", 1279, "1279年3月19日", "崖山海战最后一日", "崖山海面，今广东江门", "china", "张世杰舰队的解索军官", "是否违抗将令解开连环舰队，为幼帝与主力保留突围通道", "元军将在潮落后发起总攻", "宋军连环舰队被元军突破，陆秀夫负幼帝蹈海，南宋灭亡。", ["宋军将战船以绳索连成一体", "元军已封锁海湾", "数十万军民被挤压在海上"], "海战", "war", E, ["strategy", "organization"], BOLD),
  moment("poyang-1363", 1363, "1363年8月", "鄱阳湖火攻陈友谅巨舰", "鄱阳湖康郎山水域", "china", "朱元璋水军的火药船营官", "是否把火攻舟队全部投向陈友谅的中军楼船，放弃对翼侧的保护", "风向在日落前只会稳定一个时辰", "朱元璋水军以火攻破坏陈友谅巨舰，最终赢得大战，奠定建立明朝的基础。", ["陈友谅舰队规模更大", "陈军巨舰吃水深且转向慢", "朱元璋舰队更小但机动性强"], "海战", "war", E, ["technology", "strategy"], BOLD),
  moment("jingnan-nanjing-1402", 1402, "1402年7月13日", "朱棣入南京：建文帝失踪", "南京金川门至皇宫地道", "china", "建文帝近侍中掌握宫城暗道的内官", "是否在金川门打开前烧毁宫殿掩护建文帝出城，并把退位诏留在奉天殿", "朱棣的燕军将在一个时辰内进入皇城", "南京城门被打开后燕军入城，宫中起火，建文帝下落成为谜团；朱棣随后即位为永乐帝。", ["靖难之役已持续近四年", "燕军逼近南京且守军动摇", "建文帝削藩政策已经失败"], "政变", "revolution", P, ["strategy", "writing"], BOLD),
  moment("zheng-he-1405", 1405, "1405年7月11日", "郑和宝船从刘家港启航", "刘家港，今江苏太仓", "china", "郑和船队的总帐房与译事官", "是否在启航前把贸易计价权从宫廷使节下放给各船商人", "距离升帆只剩两个时辰", "郑和率庞大船队七下西洋，建立了明朝主导的朝贡和海上交往网络。", ["永乐帝下令远航", "船队携带大量官营货物与军人", "沿线已有成熟的民间商路"], "航海", "exchange", B, ["negotiation", "business"], BALANCED),
  moment("tumu-crisis-1449", 1449, "1449年9月1日", "土木堡之变后的北京守卫会议", "北京午门内", "china", "于谦身边的兵部主事", "是否公开反对南迁，立即拥立郕王并调全国勤王军守北京", "瓦剌可能在数日内带着被俘的皇帝抵达城下", "于谦主张坚守北京并拥立景泰帝，北京保卫战击退瓦剌军。", ["明英宗在土木堡被俘", "明军主力损失严重", "南迁会放弃北方政治与军事中心"], "国防", "war", P, ["organization", "strategy"], BOLD),
  moment("ningyuan-1626", 1626, "1626年2月24日", "袁崇焕宁远炮击努尔哈赤", "宁远城西南城墙，今辽宁兴城", "china", "负责红夷大炮测距的葡萄牙炮术翻译", "是否等后金主力进入城下射界后再齐射，冒险放弃提前威慑", "努尔哈赤的攻城队将在几分钟内越过壕沟", "袁崇焕依托坚城与红夷大炮击退后金军，努尔哈赤在战后数月去世，宁远成为后金起兵以来少见的挫败。", ["袁崇焕拒绝撤离宁远", "城上部署了新式红夷大炮", "努尔哈赤亲率后金主力攻城"], "守城", "war", E, ["technology", "strategy"], BOLD),
  moment("shanhai-pass-1644", 1644, "1644年5月27日", "山海关前的借兵决定", "山海关宁海城", "china", "吴三桂帅府中负责起草书信的幕僚", "是否把致多尔衮的求援信改为限时军事同盟，并拒绝清军越关占领城池", "李自成大军第二天就将进攻山海关", "吴三桂引清军入关共击李自成，清军随后进入北京并开始统一全国。", ["北京已被李自成占领", "吴三桂的关宁军独立难敌大顺军", "多尔衮主力驻扎关外"], "联盟", "revolution", P, N, CAUTIOUS),
  moment("koxinga-1661", 1661, "1661年4月30日", "郑成功横渡台湾海峡", "鹿耳门外海，台湾南部", "china", "郑成功船队中熟悉水道的领航官", "是否在荷兰人未完成封锁前带主力冒险穿越鹿耳门浅水道", "潮水将在一个时辰后回落", "郑军通过鹿耳门登陆，围攻热兰遮城，次年迫使荷兰东印度公司投降。", ["荷兰人在台湾南部经营数十年", "鹿耳门水道浅且危险", "郑军兵力远多于守军但补给受海象限制"], "海战", "war", E, ["technology", "strategy"], BOLD),
  moment("kangxi-aobai-1669", 1669, "1669年6月14日", "少年康熙擒鳌拜", "北京紫禁城武英殿", "china", "训练布库少年的侍卫教头", "是否按康熙密令提前关闭殿门，让少年侍卫当场制住毫无防备的鳌拜", "鳌拜将在一炷香后独自入殿奏事", "康熙借布库少年在宫中擒获鳌拜，随后宣布其罪状并亲掌朝政。", ["鳌拜作为辅政大臣长期把持朝政", "康熙已经秘密训练一批少年侍卫", "其他辅政势力已无法公开制衡鳌拜"], "政变", "revolution", P, ["organization", "strategy"], BOLD),
  moment("macartney-1793", 1793, "1793年9月14日", "马嘎尔尼使团觐见乾隆", "热河避暑山庄", "china", "军机处负责翻译英方国书的章京", "是否把英方开放通商口岸的请求完整译入御览本，而不按礼部要求弱化其含义", "乾隆将在上朝后立即阅读国书", "清廷拒绝扩大通商与常驻外交请求，中英贸易分歧继续扩大。", ["乾隆在热河接见马嘎尔尼", "英方希望增开口岸并改善外交关系", "清朝以朝贡体系理解使团"], "外交", "exchange", C, ["writing", "negotiation"], BALANCED),
  moment("humen-1839", 1839, "1839年6月3日", "虎门销烟前的外交通牒", "广东虎门镇口", "china", "林则徐行辕中负责外文文书的幕僚", "是否在销烟开始前公开提出中英双方可监督的合法贸易和谈机制", "销烟仪式将在一个时辰后开始", "林则徐当众销毁收缴鸦片，中英冲突持续升级，次年鸦片战争爆发。", ["广州外商已交出大量鸦片", "清廷严令禁烟", "英国商人与政府对没收强烈不满"], "贸易", "exchange", P, ["negotiation", "law"], BALANCED),

  moment("great-fire-rome-64", 64, "64年7月19日", "罗马大火开始蔓延", "罗马大竞技场商铺区", "world", "城市水道和消防队的值夜主管", "是否下令拆除连片木屋制造防火带，即使会引发居民冲突", "风势将在半个时辰内把火推向山坡住宅", "大火延烧多日，罗马大部分城区被毁，尼禄随后重建城市并迫害基督徒。", ["商铺区存放大量易燃品", "罗马街道狭窄且木建筑密集", "夜间风势强劲"], "城市", "industry", E, ["organization", "technology"], BOLD),
  moment("fall-rome-476", 476, "476年9月4日", "西罗马最后一位皇帝退位", "拉文纳皇宫", "world", "奥多亚塞军中的罗马行政官", "是否劝奥多亚塞保留罗慕路斯为共治皇帝，以维持西部帝国的法统", "皇帝将在当天被迫交出冠冕", "奥多亚塞废黜罗慕路斯，将帝国标志送往君士坦丁堡，西罗马帝国统治通常被视为至此结束。", ["西罗马皇帝已失去实权", "日耳曼雇佣军控制意大利", "东罗马仍声称帝国合法性"], "政权", "ancient", P, ["law", "negotiation"], CAUTIOUS),
  moment("constantinople-1453", 1453, "1453年5月29日", "君士坦丁堡陷落前夜", "君士坦丁堡圣罗曼努斯门", "world", "热那亚守将朱斯蒂尼亚尼的火器军需官", "是否拆出内城仅存的火药，在奥斯曼巨炮打开的缺口前布置一次近距离爆破", "奥斯曼总攻将在黎明开始", "奥斯曼军攻破城防，君士坦丁十一世战死，拜占庭帝国灭亡。", ["奥斯曼军以巨型火炮持续轰击城墙", "城内守军人数远少于攻城军", "海路援军没有到来"], "攻城", "war", E, ["technology", "strategy"], BOLD),
  moment("columbus-1492", 1492, "1492年10月11日深夜", "哥伦布船队看见陆地火光", "大西洋西部，巴哈马群岛外海", "world", "圣玛丽亚号的领航与记录官", "是否说服哥伦布先派不携武器的小队登岸，并禁止宣告占领和捕获当地人", "船队将在日出后立即登岸", "哥伦布登陆巴哈马群岛并以西班牙名义宣布占领，随后的殖民、疾病和征服改变了美洲。", ["船队已航行两个多月", "当地泰诺人尚不知道船队意图", "哥伦布的合同将新领土与财富绑定"], "航海", "exchange", C, ["negotiation", "writing"], CAUTIOUS),
  moment("luther-1517", 1517, "1517年10月31日", "路德公开九十五条论纲", "维滕贝格城堡教堂", "world", "马丁·路德委托排印文本的印刷匠", "是否不等教会学术辩论，就连夜印刷并向德语城市大量散发论纲", "开往莱比锡的商车黎明就要出发", "论纲被迅速印刷传播，引发对赎罪券和教会权威的广泛争论，宗教改革由此扩大。", ["赎罪券在德意志地区广泛销售", "活字印刷已形成城市网络", "路德原本以拉丁文发起学术辩论"], "印刷", "print", C, ["writing", "technology"], BOLD),
  moment("galileo-1610", 1610, "1610年3月", "《星空使者》印刷前夜", "威尼斯印刷所", "world", "伽利略委托制作铜版图的工匠", "是否把木星卫星的连续观测日志一并刻入印版，而不只印最终结论", "书商明早就要开印", "伽利略出版望远镜观测，包括木星卫星，强烈冲击了传统宇宙观。", ["伽利略改良了望远镜", "其他学者需要证据复现观测", "新观测与托勒密体系冲突"], "科学", "space", E, ["technology", "writing"], BALANCED),
  moment("newton-principia-1687", 1687, "1687年7月5日", "牛顿《自然哲学的数学原理》出版", "伦敦皇家学会印刷所", "world", "替哈雷校对最后一批公式的排印工", "是否冒着延期出版的风险停机重排一处会改变轨道计算的符号错误", "第一批书将在两个时辰后装订", "在哈雷资助与推动下，牛顿的《自然哲学的数学原理》出版，以运动定律和万有引力统一解释天体与地面运动。", ["皇家学会无力承担全部出版费用", "哈雷承担了主要编辑与出资工作", "复杂公式依赖人工排版校对"], "科学", "print", E, ["technology", "writing"], CAUTIOUS),
  moment("bastille-1789", 1789, "1789年7月14日上午", "巴士底狱攻占前的火药争夺", "巴黎巴士底狱外", "world", "巴黎市民武装中熟悉火炮的退役士兵", "是否在人群开火前进入城堡，用两小时安全撤出火药和七名囚犯", "守军与人群的谈判正在破裂", "巴黎市民攻占巴士底狱，处死总督德劳内，事件成为法国大革命的象征。", ["巴黎民众已从荣军院取得武器", "巴士底狱储存火药", "城内对王室派军的恐惧急剧上升"], "革命", "revolution", P, ["negotiation", "organization"], BOLD),
  moment("waterloo-1815", 1815, "1815年6月18日下午", "滑铁卢黄昏前的近卫军", "滑铁卢拉贝尔联盟军中央阵地", "world", "拿破仑参谋部负责普鲁士军情的地图官", "是否劝拿破仑停止投入近卫军，立即组织向南撤退以保留军队主力", "普鲁士先锋已出现在右翼", "拿破仑投入近卫军仍未能击溃威灵顿，普鲁士军抵达后法军全线溃败，拿破仑再次退位。", ["雨后泥泞推迟了法军攻势", "威灵顿占据反斜面防守", "普鲁士军正从东面接近"], "战役", "war", P, ["strategy", "organization"], CAUTIOUS),
  moment("origin-species-1859", 1859, "1859年11月24日", "《物种起源》首印发行", "伦敦约翰·默雷出版社", "world", "达尔文与出版人之间的科学编辑", "是否在首印本中加入一页可验证自然选择的公开观测清单，鼓励普通读者反驳作者", "仓库将在一小时后开始装运", "《物种起源》首印当日售罄，自然选择理论引发科学界与社会广泛讨论。", ["达尔文累积了数十年观察", "华莱士独立提出了相近理论", "出版人建议以面向公众的篇幅发行"], "科学", "print", C, ["writing", "medicine"], BALANCED),
  moment("lincoln-emancipation-1862", 1862, "1862年9月22日", "林肯公布《解放宣言》前夜", "华盛顿白宫内阁会议室", "world", "负责把宣言送往各报社的战争部电报官", "是否按林肯命令当晚全文发报，让南方各州在一百天期限前无法封锁消息", "最后一班电报线路将在一小时后切换为军用", "林肯公布《解放宣言》初稿，宣布叛乱州若不回归，奴隶将在1863年1月1日起获得自由。", ["美国内战已持续一年多", "安提坦战役刚给北方带来战略机会", "宣言适用于仍处于叛乱状态的地区"], "解放", "print", P, ["writing", "law"], BOLD),
  moment("sarajevo-1914", 1914, "1914年6月28日", "萨拉热窝刺杀", "萨拉热窝，拉丁桥附近", "world", "塞尔维亚总理大臣帕希奇的特别联络员", "是否立即拦下车队，阻止其再次驶入刚刚发生未遂爆炸的街区", "距离车队再次经过拉丁桥约 8 分钟", "车队按错误路线驶近拉丁桥，普林西普枪杀斐迪南大公夫妇，危机在一个月内演变为第一次世界大战。", ["当天早些时候车队已遭遇一次未遂炸弹袭击", "车队临时决定去医院探望伤者", "司机没有被清楚告知更改后的路线"], "暗杀", "war", P, ["negotiation", "organization"], CAUTIOUS),
  moment("october-revolution-1917", 1917, "1917年11月7日", "列宁发动十月革命", "彼得格勒斯莫尔尼宫", "world", "革命军事委员会的电报调度员", "是否在临时政府反应前切断冬宫电话，并向全城广播起义已经开始", "克伦斯基的汽车将在半小时后离开首都求援", "布尔什维克控制彼得格勒关键设施并攻占冬宫，推翻临时政府，随后建立苏维埃政权。", ["临时政府仍决定继续参加一战", "布尔什维克已在彼得格勒苏维埃中占优", "起义部队准备夺取桥梁、电报局和车站"], "革命", "revolution", P, ["organization", "writing"], BOLD),
  moment("roosevelt-bank-holiday-1933", 1933, "1933年3月6日", "罗斯福关闭全美银行", "华盛顿财政部地下电报室", "world", "负责向各州银行监管机构发报的财政部值班官", "是否在股市开盘前向全国发布四天银行休业令，阻止挤兑继续蔓延", "纽约银行将在一小时后开门", "罗斯福宣布全国银行休业并推动紧急银行法，经过审查的银行随后分批重开，公众信心开始恢复。", ["大萧条已导致数千家银行倒闭", "储户正在大规模提取现金和黄金", "罗斯福刚刚宣誓就任总统"], "金融", "industry", B, ["business", "organization"], BOLD),
  moment("hitler-poland-1939", 1939, "1939年9月1日凌晨", "希特勒下令入侵波兰", "柏林国防军最高统帅部", "world", "负责传送白色方案最终口令的通信军官", "是否扣下已签发的进攻口令，并把德军伪造边境袭击的证据同时发给英法使馆", "首批轰炸机将在二十分钟后起飞", "德军入侵波兰，英国和法国两天后对德国宣战，第二次世界大战在欧洲全面爆发。", ["德国已秘密动员大军部署在波兰边境", "英法承诺在波兰遭入侵时提供援助", "纳粹制造了格莱维茨等边境挑衅借口"], "战争", "war", P, ["writing", "strategy"], BOLD),
  moment("stalin-moscow-1941", 1941, "1941年10月19日", "斯大林决定留守莫斯科", "莫斯科克里姆林宫地下指挥所", "world", "负责安排最高统帅部撤离专列的铁路军官", "是否取消斯大林的撤离车厢并公开他仍留在莫斯科指挥防御", "专列将在四十分钟后驶离站台", "苏联政府部分机构撤往古比雪夫，斯大林留在莫斯科；德军攻势最终受阻，苏军在12月发动反攻。", ["德军已经逼近莫斯科外围", "城市出现恐慌与抢购", "政府机关正分批向东撤离"], "战争", "war", P, ["organization", "strategy"], BOLD),
  moment("normandy-1944", 1944, "1944年6月4日晚", "艾森豪威尔决定诺曼底登陆", "英格兰南部盟军司令部", "world", "为登陆舰队汇总气象报告的参谋官", "是否建议艾森豪威尔抓住6月6日短暂天气窗口，立即放行跨海登陆", "数千艘舰船必须在半小时内收到出港命令", "艾森豪威尔批准6月6日登陆，盟军在诺曼底建立滩头阵地并由此重返西欧大陆。", ["原定6月5日的行动因恶劣天气推迟", "气象部门预测6月6日会短暂好转", "德军判断暴风雨会阻止大规模登陆"], "登陆", "war", P, ["strategy", "organization"], BOLD),
  moment("cuban-missile-1962", 1962, "1962年10月27日", "古巴导弹危机黑色星期六", "华盛顿白宫战情室", "world", "肯尼迪总统特别小组的通信分析官", "是否建议肯尼迪忽略赫鲁晓夫第二封强硬来信，只回复第一封撤导弹换不入侵的条件", "美军飞机刚在古巴上空被击落，决策窗口不超过数小时", "美国选择回复较温和的第一封信，同时秘密承诺撤除土耳其导弹，苏联同意撤出古巴导弹。", ["苏联已在古巴部署核导弹", "美国对古巴实施海上封锁", "华盛顿收到两封条件不同的苏联来信"], "核危机", "war", P, ["negotiation", "strategy"], CAUTIOUS),
  moment("apollo-11-1969", 1969, "1969年7月20日", "阿波罗11号登月前的1202警报", "休斯敦任务控制中心", "world", "登月舱制导计算机的导航控制员", "是否根据计算机仍在处理关键任务的遥测，向阿姆斯特朗发出继续下降而非中止登月的口令", "登月舱燃料只够维持几十秒", "任务控制中心判断1202警报可继续飞行，阿姆斯特朗手动避开危险区，阿波罗11号完成首次载人登月。", ["登月舱计算机连续出现1201和1202过载警报", "阿姆斯特朗发现预定着陆区布满巨石", "任何中止口令都会立即结束下降"], "航天", "space", E, ["technology", "strategy"], BALANCED),
  moment("berlin-wall-1989", 1989, "1989年11月9日晚", "柏林墙边检站第一次开闸", "东柏林鲍尔霍莫大街口岸", "world", "边检站指挥官哈拉尔德·亚格的值班参谋", "是否在联系不上上级时说服亚格主动完全开闸，而不再对护照盖无效章", "数千人已挤在闸门前，卫兵只有几分钟决定", "鲍尔霍莫大街口岸在无明确上级命令下开闸，人群穿过柏林墙，东德边境体系迅速崩解。", ["东德官员刚在记者会上误称新规立即生效", "大批民众涌向边检站", "边防军未收到可执行的处置命令"], "政治", "revolution", P, ["organization", "negotiation"], BOLD),
];

function stableHash(value: string): number {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function profileScore(profile: TravelerProfile, seed: HistorySeed): number {
  const occupation = seed.occupationTags.includes(profile.occupation) ? 3 : 0;
  const strengths = profile.strengths.reduce(
    (score, strength) => score + (seed.strengthTags.includes(strength) ? 4 : 0),
    0,
  );
  const risk = seed.riskTags.includes(profile.riskStyle) ? 2 : 0;
  return occupation + strengths + risk;
}

export function recommendHistorySeeds(
  profile: TravelerProfile,
  previousIds: readonly string[] = [],
): HistorySeed[] {
  const previous = new Set(previousIds);
  const profileKey = `${profile.name}:${profile.occupation}:${profile.strengths.join(",")}:${profile.riskStyle}`;
  const ranked = HISTORY_SEEDS
    .filter((seed) => !previous.has(seed.id))
    .map((seed) => ({
      seed,
      score: profileScore(profile, seed),
      tie: stableHash(`${profileKey}:${seed.id}`),
    }))
    .sort((left, right) => right.score - left.score || left.tie - right.tie);

  const chosen = [
    ...ranked.filter((item) => item.seed.perspective === "china").slice(0, 2),
    ...ranked.filter((item) => item.seed.perspective === "world").slice(0, 2),
  ];
  const chosenIds = new Set(chosen.map((item) => item.seed.id));
  const final = ranked.find((item) => !chosenIds.has(item.seed.id));
  if (final) chosen.push(final);
  return chosen.sort((left, right) => right.score - left.score || left.tie - right.tie)
    .map((item) => item.seed);
}

export function browseHistorySeeds(_profile?: TravelerProfile): HistorySeed[] {
  return [...HISTORY_SEEDS].sort((left, right) => left.year - right.year || left.eventName.localeCompare(right.eventName, "zh-CN"));
}

const DEFAULT_PROFILE: TravelerProfile = buildTravelerProfile({ energy: "E", perception: "N", judgment: "T", tactics: "J" });

export function dealHistorySeeds(previousIds: readonly string[] = []): HistorySeed[] {
  const candidates = recommendHistorySeeds(DEFAULT_PROFILE, previousIds);
  return candidates.length === 5 ? candidates : recommendHistorySeeds(DEFAULT_PROFILE);
}
