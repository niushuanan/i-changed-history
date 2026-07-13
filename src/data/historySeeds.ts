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
  moment("feishui-383", 383, "383年11月", "淝水之战临河退阵", "淝水西岸，今安徽寿县", "china", "苻坚中军传令官", "是否传达全军后退让晋军渡水的命令", "晋军渡河前的一刻钟", "前秦军后退时秩序崩溃，晋军趁势冲击，前秦统一南北的计划失败。", ["前秦兵力远多于东晋", "晋军请求秦军后退以便渡水决战", "前秦各部族军队指挥不一"], "战争", "war", P, S, CAUTIOUS),
  moment("sui-unification-589", 589, "589年1月", "隋军渡江灭陈", "建康石头城，今南京", "china", "隋军前锋的渡江统筹官", "是否趁陈朝庆典戒备松弛于夜间全线渡江", "距离陈军恢复城防只剩数小时", "隋军成功渡江并攻入建康，结束了近三百年的南北分裂。", ["隋已经统一北方", "陈朝长江防线过度分散", "建康正在庆贺元会"], "统一", "ancient", P, ["organization", "strategy"], BOLD),
  moment("xuanwu-gate-626", 626, "626年7月2日", "玄武门之变", "长安太极宫玄武门", "china", "尉迟敬德手下的宫门校尉", "是否在太子李建成到达前封闭玄武门并隔绝东宫援军", "距离李建成入门不到一炷香", "李世民在玄武门杀死李建成、李元吉，随后成为太子并即位为唐太宗。", ["李世民与太子集团矛盾已无法调和", "玄武门控制皇宫北面通道", "唐高祖正召三子入宫对质"], "政变", "revolution", P, ["organization", "strategy"], BOLD),
  moment("an-lushan-755", 755, "755年12月", "安禄山叛军逼近潼关", "潼关，今陕西渭南", "china", "哥舒翰帅府中的军令参议", "是否冒着违抗唐玄宗的风险坚持闭关不出战", "距离长安再次发来出战诏令只剩一日", "哥舒翰被迫出关后大败，潼关失守，唐玄宗仓皇逃离长安。", ["潼关地势利于坚守", "叛军补给线正在拉长", "朝廷怀疑哥舒翰拥兵自重"], "战争", "war", P, ["strategy", "law"], CAUTIOUS),
  moment("chen-bridge-960", 960, "960年2月3日", "陈桥兵变黄袍加身", "陈桥驿，今河南新乡", "china", "赵匡胤亲军的掌书记", "是否在将士鼓噪前唤醒赵匡胤并送出密信给后周朝廷", "距离将士拥入寝帐不到一个时辰", "赵匡胤接受黄袍，回师开封建立北宋，后周幼主退位。", ["后周皇帝年幼", "赵匡胤掌握都城主力禁军", "边境军情为出兵提供了理由"], "政变", "revolution", P, ["organization", "negotiation"], BALANCED),
  moment("chanyuan-1004", 1004, "1004年12月", "澧渊前线和议", "澧州，今河南濮阳", "china", "宋真宗身边的和谈条款起草官", "是否接受每年岁币以换取辽军撤退和边境开市", "距离辽使再次入营只剩两个时辰", "宋辽签订澧渊之盟，北宋提供岁币，两国维持了百余年总体和平。", ["辽军已深入宋境", "宋真宗亲至澧州提振士气", "辽军统帅萧挞凛刚被射杀"], "外交", "exchange", P, N, CAUTIOUS),
  moment("jingkang-1127", 1127, "1127年1月", "金军二围汴京", "汴京宣德门，今河南开封", "china", "李纲被罢后留在城内的旧部", "是否组织军民拒绝开城议和并强行接管城防", "金军要求宋帝出城议和前的最后一夜", "北宋向金军屈服，徽、钦二帝及宗室被俘，北宋灭亡。", ["汴京尚有数万军民", "主和派认为议和可保皇室", "外地勤王军未能及时协同"], "围城", "war", P, ["organization", "strategy"], BOLD),
  moment("yue-fei-1140", 1140, "1140年7月", "郾城大捷后的十二道金牌", "郾城军营，今河南漯河", "china", "岳飞中军负责接诏的机宜官", "是否暂压金牌不报，为岳家军再争取三日北进时间", "下一道班师诏书已在途中", "岳飞被迫班师，收复中原的攻势中断，次年被解除兵权并下狱。", ["岳家军刚在郾城击败金军主力", "南宋朝廷正与金议和", "连续擅留将被视为抗旨"], "军令", "war", P, ["strategy", "law"], BOLD),
  moment("diaoyu-1259", 1259, "1259年8月", "蒙哥汗死于钓鱼城下", "钓鱼城，今重庆合川", "china", "守将王坚的投石机指挥官", "是否在蒙哥汗亲自巡视前沿时集中全部投石机攻击其所在高地", "蒙古护卫将在几分钟内搭起遮蔽", "蒙哥汗在围城期间死去，蒙古西征与南宋战线调整，帝国陷入汗位争夺。", ["钓鱼城已坚守数月", "蒙军不适应山地与酷暑", "蒙哥汗亲自督战"], "围城", "war", E, T, BOLD),
  moment("yamen-1279", 1279, "1279年3月19日", "崖山海战最后一日", "崖山海面，今广东江门", "china", "张世杰舰队的解索军官", "是否违抗将令解开连环舰队，为幼帝与主力保留突围通道", "元军将在潮落后发起总攻", "宋军连环舰队被元军突破，陆秀夫负幼帝蹈海，南宋灭亡。", ["宋军将战船以绳索连成一体", "元军已封锁海湾", "数十万军民被挤压在海上"], "海战", "war", E, ["strategy", "organization"], BOLD),
  moment("poyang-1363", 1363, "1363年8月", "鄱阳湖火攻陈友谅巨舰", "鄱阳湖康郎山水域", "china", "朱元璋水军的火药船营官", "是否把火攻舟队全部投向陈友谅的中军楼船，放弃对翼侧的保护", "风向在日落前只会稳定一个时辰", "朱元璋水军以火攻破坏陈友谅巨舰，最终赢得大战，奠定建立明朝的基础。", ["陈友谅舰队规模更大", "陈军巨舰吃水深且转向慢", "朱元璋舰队更小但机动性强"], "海战", "war", E, ["technology", "strategy"], BOLD),
  moment("zheng-he-1405", 1405, "1405年7月11日", "郑和宝船从刘家港启航", "刘家港，今江苏太仓", "china", "郑和船队的总帐房与译事官", "是否在启航前把贸易计价权从宫廷使节下放给各船商人", "距离升帆只剩两个时辰", "郑和率庞大船队七下西洋，建立了明朝主导的朝贡和海上交往网络。", ["永乐帝下令远航", "船队携带大量官营货物与军人", "沿线已有成熟的民间商路"], "航海", "exchange", B, ["negotiation", "business"], BALANCED),
  moment("tumu-crisis-1449", 1449, "1449年9月1日", "土木堡之变后的北京守卫会议", "北京午门内", "china", "于谦身边的兵部主事", "是否公开反对南迁，立即拥立郕王并调全国勤王军守北京", "瓦剌可能在数日内带着被俘的皇帝抵达城下", "于谦主张坚守北京并拥立景泰帝，北京保卫战击退瓦剌军。", ["明英宗在土木堡被俘", "明军主力损失严重", "南迁会放弃北方政治与军事中心"], "国防", "war", P, ["organization", "strategy"], BOLD),
  moment("shanhai-pass-1644", 1644, "1644年5月27日", "山海关前的借兵决定", "山海关宁海城", "china", "吴三桂帅府中负责起草书信的幕僚", "是否把致多尔衮的求援信改为限时军事同盟，并拒绝清军越关占领城池", "李自成大军第二天就将进攻山海关", "吴三桂引清军入关共击李自成，清军随后进入北京并开始统一全国。", ["北京已被李自成占领", "吴三桂的关宁军独立难敌大顺军", "多尔衮主力驻扎关外"], "联盟", "revolution", P, N, CAUTIOUS),
  moment("koxinga-1661", 1661, "1661年4月30日", "郑成功横渡台湾海峡", "鹿耳门外海，台湾南部", "china", "郑成功船队中熟悉水道的领航官", "是否在荷兰人未完成封锁前带主力冒险穿越鹿耳门浅水道", "潮水将在一个时辰后回落", "郑军通过鹿耳门登陆，围攻热兰遮城，次年迫使荷兰东印度公司投降。", ["荷兰人在台湾南部经营数十年", "鹿耳门水道浅且危险", "郑军兵力远多于守军但补给受海象限制"], "海战", "war", E, ["technology", "strategy"], BOLD),
  moment("macartney-1793", 1793, "1793年9月14日", "马嘎尔尼使团觐见乾隆", "热河避暑山庄", "china", "军机处负责翻译英方国书的章京", "是否把英方开放通商口岸的请求完整译入御览本，而不按礼部要求弱化其含义", "乾隆将在上朝后立即阅读国书", "清廷拒绝扩大通商与常驻外交请求，中英贸易分歧继续扩大。", ["乾隆在热河接见马嘎尔尼", "英方希望增开口岸并改善外交关系", "清朝以朝贡体系理解使团"], "外交", "exchange", C, ["writing", "negotiation"], BALANCED),
  moment("humen-1839", 1839, "1839年6月3日", "虎门销烟前的外交通牒", "广东虎门镇口", "china", "林则徐行辕中负责外文文书的幕僚", "是否在销烟开始前公开提出中英双方可监督的合法贸易和谈机制", "销烟仪式将在一个时辰后开始", "林则徐当众销毁收缴鸦片，中英冲突持续升级，次年鸦片战争爆发。", ["广州外商已交出大量鸦片", "清廷严令禁烟", "英国商人与政府对没收强烈不满"], "贸易", "exchange", P, ["negotiation", "law"], BALANCED),

  moment("teutoburg-9", 9, "公元9年9月", "条顿堡森林伏击", "日耳曼尼亚条顿堡森林", "world", "瓦鲁斯麾下第十七军团的工程百夫长", "是否违抗行军命令，立即砍木构筑环形防御营地并停止继续进入狭谷", "第一批标枪已从林中飞出", "罗马三个军团在伏击中全军覆没，罗马此后放弃将疆界长期推进到莱茵河以东。", ["阿米尼乌斯熟悉罗马军制", "罗马队列被雨水和狭路拉长", "日耳曼各部已埋伏数日"], "伏击", "war", E, ["strategy", "organization"], CAUTIOUS),
  moment("great-fire-rome-64", 64, "64年7月19日", "罗马大火开始蔓延", "罗马大竞技场商铺区", "world", "城市水道和消防队的值夜主管", "是否下令拆除连片木屋制造防火带，即使会引发居民冲突", "风势将在半个时辰内把火推向山坡住宅", "大火延烧多日，罗马大部分城区被毁，尼禄随后重建城市并迫害基督徒。", ["商铺区存放大量易燃品", "罗马街道狭窄且木建筑密集", "夜间风势强劲"], "城市", "industry", E, ["organization", "technology"], BOLD),
  moment("edict-milan-313", 313, "313年2月", "米兰敕令谈判", "米兰帝宫", "world", "君士坦丁的法律顾问", "是否把宗教宽容写成适用于所有信仰的普遍权利，而不只恢复基督教财产", "李锡尼将在当日签署文本", "两位皇帝结束对基督徒的官方迫害并归还财产，基督教开始迅速进入帝国公共生活。", ["基督徒刚经历大迫害", "君士坦丁需要安定帝国西部", "李锡尼控制帝国东部"], "法律", "print", P, ["law", "negotiation"], BALANCED),
  moment("fall-rome-476", 476, "476年9月4日", "西罗马最后一位皇帝退位", "拉文纳皇宫", "world", "奥多亚塞军中的罗马行政官", "是否劝奥多亚塞保留罗慕路斯为共治皇帝，以维持西部帝国的法统", "皇帝将在当天被迫交出冠冕", "奥多亚塞废黜罗慕路斯，将帝国标志送往君士坦丁堡，西罗马帝国统治通常被视为至此结束。", ["西罗马皇帝已失去实权", "日耳曼雇佣军控制意大利", "东罗马仍声称帝国合法性"], "政权", "ancient", P, ["law", "negotiation"], CAUTIOUS),
  moment("tours-732", 732, "732年10月", "普瓦提埃会战前夜", "图尔与普瓦提埃之间", "world", "查理·马特的步兵方阵教官", "是否拒绝追击诱敌的骑兵，强制全军在高地继续结成密集方阵", "对方骑兵已开始佯退", "法兰克军坚守阵地并击退伍麦叶军队，查理·马特的权威大幅上升。", ["法兰克步兵占据高地", "伍麦叶军以骑兵为主", "双方已对峙数日"], "战争", "war", P, ["strategy", "organization"], CAUTIOUS),
  moment("charlemagne-800", 800, "800年12月25日", "查理曼在罗马加冕", "罗马圣伯多禄大教堂", "world", "查理曼的拉丁文书起草官", "是否在教皇戴上冠冕前提醒查理曼，要求加冕誓词明确皇权不来自教皇授予", "圣诞弥撒将在几分钟内进入加冕环节", "教皇良三世为查理曼加冕为罗马人的皇帝，西欧皇权与教权的长期关系由此重塑。", ["查理曼已统治西欧大部地区", "教皇需要世俗军事保护", "君士坦丁堡仍主张罗马帝国正统"], "加冕", "revolution", P, ["law", "writing"], BALANCED),
  moment("hastings-1066", 1066, "1066年10月14日", "黑斯廷斯战场上的假退却", "英格兰黑斯廷斯附近", "world", "哈罗德二世盾墙阵线的传令官", "是否拦住撒克逊步兵，阻止他们追击佯装溃退的诺曼骑兵", "前列已有人开始冲下山坡", "撒克逊盾墙在多次假退却中被拉开，哈罗德战死，征服者威廉成为英格兰国王。", ["撒克逊军占据山脊", "诺曼军拥有骑兵和弓箭手", "哈罗德军刚经历北方急行军"], "战役", "war", P, ["strategy", "organization"], CAUTIOUS),
  moment("clermont-1095", 1095, "1095年11月27日", "克莱蒙宗教会议的十字军号召", "法国克莱蒙城外", "world", "教皇乌尔班二世的演说起草人", "是否删去对罪孽获得全部赦免的绝对承诺，改为受教会约束的有限远征", "教皇即将登上讲台", "乌尔班二世号召西欧基督徒东征，数年后第一次十字军攻占耶路撒冷。", ["拜占庭向西欧请求军事援助", "西欧骑士内战频繁", "耶路撒冷具有巨大宗教号召力"], "宗教", "revolution", C, ["writing", "organization"], BOLD),
  moment("fourth-crusade-1204", 1204, "1204年4月12日", "第四次十字军攻君士坦丁堡", "君士坦丁堡金角湾", "world", "威尼斯总督恩里克·丹多洛的舰队契约官", "是否拒绝在最后攻城命令上盖印，并公开攻打基督教城市将违反远征誓言", "攻城舰已在升起跳板", "十字军攻占并洗劫君士坦丁堡，拜占庭帝国受到沉重打击。", ["十字军欠威尼斯巨额船费", "拜占庭宫廷内乱给了转向的借口", "教皇曾禁止攻击基督教城市"], "攻城", "war", B, ["law", "negotiation"], CAUTIOUS),
  moment("magna-carta-1215", 1215, "1215年6月15日", "兰尼米德大宪章盖印", "泰晤士河畔兰尼米德", "world", "坎特伯雷大主教史蒂芬·兰顿的法律书记", "是否把限制国王任意征税和非法监禁的条款留在最终文本中，即使约翰王可能当场翻脸", "贵族军队和王军隔河对峙", "约翰王对大宪章盖印，虽然很快否定它，其限制王权原则被后世不断重申。", ["约翰王军事失败且税负沉重", "反叛贵族已控制伦敦", "教会人士正在调停"], "法律", "print", P, ["law", "negotiation"], BALANCED),
  moment("mongol-japan-1274", 1274, "1274年11月19日", "蒙古第一次东征博多湾", "九州博多湾", "world", "幕府使者团中熟悉蒙古战法的僧人翻译", "是否说服镌仓武士放弃单骑挑战，组成密集盾阵抗击火药弹和集团射击", "蒙元军已在沙滩上整队", "蒙元军登陆九州并击退当地武士，随后因补给、伤亡和风暴撤回。", ["蒙元军使用集团战术和火药武器", "日本武士习惯个人挑战", "外海天气正在恶化"], "登陆", "war", E, ["technology", "organization"], BALANCED),
  moment("constantinople-1453", 1453, "1453年5月29日", "君士坦丁堡陷落前夜", "君士坦丁堡圣罗曼努斯门", "world", "热那亚守将朱斯蒂尼亚尼的火器军需官", "是否拆出内城仅存的火药，在奥斯曼巨炮打开的缺口前布置一次近距离爆破", "奥斯曼总攻将在黎明开始", "奥斯曼军攻破城防，君士坦丁十一世战死，拜占庭帝国灭亡。", ["奥斯曼军以巨型火炮持续轰击城墙", "城内守军人数远少于攻城军", "海路援军没有到来"], "攻城", "war", E, ["technology", "strategy"], BOLD),
  moment("columbus-1492", 1492, "1492年10月11日深夜", "哥伦布船队看见陆地火光", "大西洋西部，巴哈马群岛外海", "world", "圣玛丽亚号的领航与记录官", "是否说服哥伦布先派不携武器的小队登岸，并禁止宣告占领和捕获当地人", "船队将在日出后立即登岸", "哥伦布登陆巴哈马群岛并以西班牙名义宣布占领，随后的殖民、疾病和征服改变了美洲。", ["船队已航行两个多月", "当地泰诺人尚不知道船队意图", "哥伦布的合同将新领土与财富绑定"], "航海", "exchange", C, ["negotiation", "writing"], CAUTIOUS),
  moment("luther-1517", 1517, "1517年10月31日", "路德公开九十五条论纲", "维滕贝格城堡教堂", "world", "马丁·路德委托排印文本的印刷匠", "是否不等教会学术辩论，就连夜印刷并向德语城市大量散发论纲", "开往莱比锡的商车黎明就要出发", "论纲被迅速印刷传播，引发对赎罪券和教会权威的广泛争论，宗教改革由此扩大。", ["赎罪券在德意志地区广泛销售", "活字印刷已形成城市网络", "路德原本以拉丁文发起学术辩论"], "印刷", "print", C, ["writing", "technology"], BOLD),
  moment("tenochtitlan-1521", 1521, "1521年8月12日", "特诺奇蒂特兰最后的突围会议", "特诺奇蒂特兰，特斯科科湖", "world", "夸无特莫克的堤道防御指挥官", "是否在西班牙人封锁合拢前组织幼童和储备种子从湖上夜间撤离，而不是把全部独木舟留给军队", "科特斯的浅水舰将在天亮后封死水道", "特诺奇蒂特兰次日陷落，夸无特莫克被俘，墨西哥帝国被西班牙与其本地盟军征服。", ["城市已被围困数月", "天花与饥荒严重削弱守军", "西班牙人拥有大量本地盟军"], "围城", "war", P, ["organization", "medicine"], CAUTIOUS),
  moment("spanish-armada-1588", 1588, "1588年8月7日深夜", "格拉夫林海战前的火船", "加莱海峡锚地", "world", "英格兰舰队火船编队的装备官", "是否提前点燃全部火船冲入无敌舰队锚地，放弃保留两艘作为次日攻击备用", "潮水即将开始流向无敌舰队", "英军火船迫使西班牙舰队仓促砍断锚索、打乱阵形，次日在格拉夫林遭到攻击。", ["无敌舰队在加莱等待陆军会合", "锚地舰船密集且阵形固定", "英军舰船更灵活但火力有限"], "海战", "war", E, ["technology", "strategy"], BOLD),
  moment("sekigahara-1600", 1600, "1600年10月21日中午", "关原合战小早川秀秋按兵不动", "关原松尾山", "world", "德川家康军中负责炮击传令的使番", "是否下令向小早川阵地开炮，逼他立即选择加入东军或西军", "西军正在动摇东军中央阵线", "小早川秀秋转而攻击西军，德川家康取得决定性胜利，数年后建立江户幕府。", ["小早川曾暗中联系德川家康", "他在战场上长时间按兵不动", "其阵地可从高处攻击西军侧翼"], "战役", "war", P, ["negotiation", "strategy"], BOLD),
  moment("galileo-1610", 1610, "1610年3月", "《星空使者》印刷前夜", "威尼斯印刷所", "world", "伽利略委托制作铜版图的工匠", "是否把木星卫星的连续观测日志一并刻入印版，而不只印最终结论", "书商明早就要开印", "伽利略出版望远镜观测，包括木星卫星，强烈冲击了传统宇宙观。", ["伽利略改良了望远镜", "其他学者需要证据复现观测", "新观测与托勒密体系冲突"], "科学", "space", E, ["technology", "writing"], BALANCED),
  moment("vienna-1683", 1683, "1683年9月12日黎明", "维也纳解围决战", "维也纳卡伦堡山", "world", "波兰国王约翰三世骑兵军的地形侦察官", "是否说服联军推迟总攻，先开辟一条足以容纳翼骑兵集群冲锋的山坡通道", "奥斯曼军正在加紧爆破城墙隧道", "联军当日发起总攻，波兰翼骑兵大规模冲锋击溃奥斯曼军，解除维也纳之围。", ["维也纳已被围两个月", "城墙多处被爆破", "欧洲联军的指挥关系复杂"], "战役", "war", P, ["strategy", "organization"], BOLD),
  moment("boston-tea-1773", 1773, "1773年12月16日", "波士顿倾茶之夜", "波士顿格里芬码头", "world", "塞缪尔·亚当斯身边负责行动名单的组织者", "是否在倾倒茶叶前严禁破坏船只和其他私人财产，并为每一箱茶登记", "三艘茶船将在潮水变化后受官方控制", "参与者将三艘船上的茶叶倒入港口，英国随后通过强制法案，殖民地对抗升级。", ["茶税成为无代表权征税的象征", "波士顿民众大会拒绝卸货", "行动者准备伪装身份"], "抗议", "revolution", P, ["organization", "law"], BOLD),
  moment("declaration-1776", 1776, "1776年7月2日", "大陆会议表决独立", "费城宾夕法尼亚州议事厅", "world", "托马斯·杰斐逊的文稿校订人", "是否拒绝删除谴责奴隶贸易的段落，即使南方殖民地代表威胁否决独立", "最终文本将在两日内公布", "大陆会议通过独立决议，谴责奴隶贸易的段落被删除，独立宣言于7月4日通过。", ["殖民地正与英国交战", "独立决议需要广泛一致", "多个南方殖民地依赖奴隶制"], "建国", "print", C, ["writing", "law"], BALANCED),
  moment("bastille-1789", 1789, "1789年7月14日上午", "巴士底狱攻占前的火药争夺", "巴黎巴士底狱外", "world", "巴黎市民武装中熟悉火炮的退役士兵", "是否在人群开火前进入城堡，用两小时安全撤出火药和七名囚犯", "守军与人群的谈判正在破裂", "巴黎市民攻占巴士底狱，处死总督德劳内，事件成为法国大革命的象征。", ["巴黎民众已从荣军院取得武器", "巴士底狱储存火药", "城内对王室派军的恐惧急剧上升"], "革命", "revolution", P, ["negotiation", "organization"], BOLD),
  moment("trafalgar-1805", 1805, "1805年10月21日中午", "特拉法加海战的两路穿插", "西班牙特拉法加角外海", "world", "纳尔逊旗舰胜利号的信号官", "是否建议纳尔逊暂缓升起自己的将旗，避免胜利号成为法国狙击手的首要目标", "两支纵队即将切入联合舰队阵线", "英国舰队击溃法西联合舰队，确立长期海上优势，纳尔逊在战斗中中弹身亡。", ["纳尔逊计划以两支纵队穿透敌阵", "英国舰员训练和炮术更强", "胜利号的将旗会暴露指挥官位置"], "海战", "war", P, ["strategy", "technology"], BOLD),
  moment("waterloo-1815", 1815, "1815年6月18日下午", "滑铁卢黄昏前的近卫军", "滑铁卢拉贝尔联盟军中央阵地", "world", "拿破仑参谋部负责普鲁士军情的地图官", "是否劝拿破仑停止投入近卫军，立即组织向南撤退以保留军队主力", "普鲁士先锋已出现在右翼", "拿破仑投入近卫军仍未能击溃威灵顿，普鲁士军抵达后法军全线溃败，拿破仑再次退位。", ["雨后泥泞推迟了法军攻势", "威灵顿占据反斜面防守", "普鲁士军正从东面接近"], "战役", "war", P, ["strategy", "organization"], CAUTIOUS),
  moment("origin-species-1859", 1859, "1859年11月24日", "《物种起源》首印发行", "伦敦约翰·默雷出版社", "world", "达尔文与出版人之间的科学编辑", "是否在首印本中加入一页可验证自然选择的公开观测清单，鼓励普通读者反驳作者", "仓库将在一小时后开始装运", "《物种起源》首印当日售罄，自然选择理论引发科学界与社会广泛讨论。", ["达尔文累积了数十年观察", "华莱士独立提出了相近理论", "出版人建议以面向公众的篇幅发行"], "科学", "print", C, ["writing", "medicine"], BALANCED),
  moment("gettysburg-1863", 1863, "1863年7月2日黄昏", "葛底斯堡小圆顶高地", "宾夕法尼亚小圆顶", "world", "美军工程军官沃伦将军的地形助手", "是否不等上级回复，就强行扣下路过的缅因州团登上小圆顶", "南军将在十几分钟内抵达山脚", "北军及时占据小圆顶并击退南军，保住阵线左翼，葛底斯堡战役成为内战转折点。", ["小圆顶可俯瞰北军阵线", "高地当时几乎无人防守", "南军正从侧翼接近"], "战役", "war", E, ["strategy", "organization"], BOLD),
  moment("meiji-1868", 1868, "1868年1月3日", "王政复古大号令", "京都御所小御所", "world", "岩仓具视身边的政制起草官", "是否把将来召开公议会和吸纳旧幕臣的承诺写入御前会议决议", "萨摩、长州与幕府代表即将入会", "倒幕派宣布王政复古并剑指庆喜，随后爆发戊辰战争，明治政府逐步建立。", ["德川庆喜已宣布大政奉还", "萨长联盟掌握京都军事优势", "新政权如何吸纳旧势力尚未决定"], "改革", "revolution", P, ["law", "organization"], BALANCED),
  moment("sarajevo-1914", 1914, "1914年6月28日", "萨拉热窝刺杀", "萨拉热窝，拉丁桥附近", "world", "塞尔维亚总理大臣帕希奇的特别联络员", "是否立即拦下车队，阻止其再次驶入刚刚发生未遂爆炸的街区", "距离车队再次经过拉丁桥约 8 分钟", "车队按错误路线驶近拉丁桥，普林西普枪杀斐迪南大公夫妇，危机在一个月内演变为第一次世界大战。", ["当天早些时候车队已遭遇一次未遂炸弹袭击", "车队临时决定去医院探望伤者", "司机没有被清楚告知更改后的路线"], "暗杀", "war", P, ["negotiation", "organization"], CAUTIOUS),
  moment("wall-street-1929", 1929, "1929年10月24日开盘前", "华尔街黑色星期四", "纽约证券交易所", "world", "摩根银行紧急联盟会议的风险分析员", "是否公开主张暂停保证金追缴和股票交易，为银行联盟争取两天清算时间", "交易所将在 20 分钟后开盘", "恐慌抛售导致成交量爆表，银行家联合托市只短暂稳定市场，崩盘继续并加剧大萧条。", ["美国股市已经历多年杠杆上涨", "大量投资者以保证金买股", "早盘前卖单已大量积压"], "金融", "digital", B, ["business", "organization"], CAUTIOUS),
  moment("dunkirk-1940", 1940, "1940年5月27日", "敦刻尔克发电召集民船", "伦敦海军部地下指挥室", "world", "发电召集民用船只的海军交通官", "是否绕过常规征用流程，向全部泰晤士河和南岸小船直接广播立即出海的坐标", "德军将在一至两日内对包围圈恢复全面进攻", "动力发电行动征集大量军舰与民船，从敦刻尔克撤出三十多万盟军士兵。", ["英法盟军被包围在海岸", "港口设施受到轰炸", "浅水海滩需要小船接驳士兵"], "撤退", "war", P, ["organization", "technology"], BOLD),
  moment("cuban-missile-1962", 1962, "1962年10月27日", "古巴导弹危机黑色星期六", "华盛顿白宫战情室", "world", "肯尼迪总统特别小组的通信分析官", "是否建议肯尼迪忽略赫鲁晓夫第二封强硬来信，只回复第一封撤导弹换不入侵的条件", "美军飞机刚在古巴上空被击落，决策窗口不超过数小时", "美国选择回复较温和的第一封信，同时秘密承诺撤除土耳其导弹，苏联同意撤出古巴导弹。", ["苏联已在古巴部署核导弹", "美国对古巴实施海上封锁", "华盛顿收到两封条件不同的苏联来信"], "核危机", "war", P, ["negotiation", "strategy"], CAUTIOUS),
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
