import type { HistoryEra, HistorySeed } from "../game/types";

const seed = (
  id: string,
  era: HistoryEra,
  year: number,
  location: string,
  chinaRelated: boolean,
  baselineFacts: HistorySeed["baselineFacts"],
  prompt: string,
  domain: string,
  visualTone: HistorySeed["visualTone"]
): HistorySeed => ({
  id,
  era,
  year,
  location,
  chinaRelated,
  baselineFacts,
  prompt,
  domain,
  visualTone,
});

export const HISTORY_SEEDS: readonly HistorySeed[] = [
  seed("uruk-writing", "ancient", -3200, "乌鲁克，今伊拉克", false, ["乌鲁克发展出早期城市管理", "泥板文字首先服务于记账", "城邦依靠灌溉农业供养人口"], "如果乌鲁克的文字被更早用于公开法律", "城市与文字", "ancient"),
  seed("old-kingdom-egypt", "ancient", -2600, "孟斐斯，古埃及", false, ["古王国政府集中调配劳力", "尼罗河泛滥塑造农业周期", "大型墓葬工程显示王权能力"], "如果尼罗河水位记录催生了独立的公共档案", "国家治理", "ancient"),
  seed("indus-cities", "ancient", -2500, "摩亨佐-达罗，今巴基斯坦", false, ["印度河流域拥有规划街道", "许多住宅连接排水系统", "其文字至今尚未被可靠释读"], "如果印度河文字被邻近文明共同采用", "城市与交流", "ancient"),
  seed("qin-unification", "ancient", -221, "咸阳，中国", true, ["秦国统一了战国诸侯", "郡县制加强中央控制", "度量衡和文字被推行标准化"], "如果秦统一后保留更强的地方议政制度", "国家治理", "ancient"),
  seed("maurya-ashoka", "ancient", -260, "华氏城，今印度", false, ["孔雀王朝控制广阔领土", "阿育王在石柱和岩壁刻写诏令", "佛教在南亚和更远地区传播"], "如果阿育王的诏令成为跨邦共同法", "帝国与宗教", "ancient"),
  seed("athenian-democracy", "ancient", -462, "雅典，希腊", false, ["雅典公民大会参与城邦决策", "公民资格排除了妇女和奴隶", "海上贸易支撑城邦财富"], "如果雅典更早扩大公民资格", "政治制度", "ancient"),
  seed("achaemenid-road", "ancient", -500, "苏萨，波斯帝国", false, ["阿契美尼德帝国连接多种语言与地区", "王家大道服务于行政和通信", "地方总督向中央纳贡"], "如果王家大道发展出公开的商旅网络", "交通与帝国", "exchange"),
  seed("rome-republic", "ancient", -287, "罗马，意大利", false, ["罗马共和国由多种官职共同运作", "平民长期争取政治权利", "罗马法逐渐形成书面传统"], "如果平民会议获得稳定的立法主导权", "法律与政治", "ancient"),
  seed("maya-classic", "ancient", 250, "蒂卡尔，今危地马拉", false, ["玛雅城邦发展历法和文字", "王权与仪式中心紧密相连", "低地城市依赖复杂农业和水利"], "如果玛雅城邦建立长期的跨城邦议会", "城市与知识", "ancient"),
  seed("aksum-red-sea", "ancient", 330, "阿克苏姆，今埃塞俄比亚", false, ["阿克苏姆连接红海贸易路线", "王国铸造自己的货币", "其统治者在四世纪接受基督教"], "如果阿克苏姆长期主导红海航运规则", "贸易与宗教", "exchange"),

  seed("baghdad-foundation", "medieval", 762, "巴格达，今伊拉克", false, ["阿拔斯王朝将首都建在底格里斯河畔", "巴格达连接欧亚非贸易", "学者在此翻译和研究多种知识传统"], "如果巴格达建立面向各地学者的开放学院联盟", "知识与城市", "print"),
  seed("byzantine-schism", "medieval", 1054, "君士坦丁堡，今土耳其", false, ["东罗马帝国延续罗马行政传统", "东西教会的关系长期紧张", "地中海贸易仍是帝国财政要点"], "如果东西教会在1054年达成持久和解", "宗教与外交", "exchange"),
  seed("song-movable-type", "medieval", 1040, "汴京，中国", true, ["北宋城市商业活跃", "毕昇试验活字印刷", "纸张和刻版印刷已被广泛使用"], "如果活字印刷得到国家长期资助并普及", "印刷与教育", "print"),
  seed("vikings-vinland", "medieval", 1000, "纽芬兰，今加拿大", false, ["北欧航海者抵达北大西洋西岸", "他们的定居点规模有限", "北大西洋航线受气候和补给制约"], "如果北欧人在文兰建立持续的贸易港", "航海与交流", "exchange"),
  seed("angkor-water", "medieval", 1200, "吴哥，今柬埔寨", false, ["吴哥拥有庞大的寺庙和城市网络", "水利系统支持稻作与人口", "王权依赖劳役与区域控制"], "如果吴哥水利维护成为跨社区的公共制度", "水利与城市", "ancient"),
  seed("mongol-unification", "medieval", 1206, "斡难河流域，今蒙古国", false, ["铁木真被推举为成吉思汗", "蒙古诸部被重新组织", "草原交通推动欧亚联系扩大"], "如果蒙古帝国更早建立稳定的地方自治规则", "帝国与交通", "exchange"),
  seed("venice-fourth-crusade", "medieval", 1204, "君士坦丁堡，今土耳其", false, ["第四次十字军攻占君士坦丁堡", "威尼斯商人从中扩大贸易利益", "拜占庭政治力量受到严重削弱"], "如果威尼斯拒绝将远征改向君士坦丁堡", "贸易与战争", "war"),
  seed("mali-pilgrimage", "medieval", 1324, "开罗，今埃及", false, ["马里帝国控制西非部分黄金贸易", "曼萨穆萨前往麦加朝觐", "撒哈拉商路连接西非与北非"], "如果马里建立常设的撒哈拉商贸学院", "贸易与知识", "exchange"),
  seed("tenochtitlan-founding", "medieval", 1325, "特诺奇蒂特兰，今墨西哥", false, ["墨西加人在湖中岛屿建城", "人工岛农业支持人口增长", "城市后来成为三方联盟核心"], "如果特诺奇蒂特兰更早与邻邦建立平等联盟", "城市与外交", "ancient"),
  seed("kilwa-trade", "medieval", 1350, "基尔瓦，今坦桑尼亚", false, ["斯瓦希里海岸城邦参与印度洋贸易", "基尔瓦出口黄金等商品", "阿拉伯语和班图语文化在当地交融"], "如果基尔瓦建立沿岸城市的共同海事法", "海洋贸易", "exchange"),

  seed("ottoman-egypt", "early-modern", 1517, "开罗，今埃及", false, ["奥斯曼帝国击败马穆鲁克政权", "埃及被纳入奥斯曼行政体系", "红海和地中海贸易仍具有战略意义"], "如果埃及保留更强的地方代议机构", "帝国与行政", "revolution"),
  seed("mexica-contact", "early-modern", 1519, "墨西哥谷地，今墨西哥", false, ["西班牙远征队抵达墨西哥海岸", "中部美洲存在复杂政治联盟", "疾病和战争改变了人口与权力格局"], "如果墨西哥谷地各城邦及时结成防御联盟", "接触与外交", "war"),
  seed("mughal-founding", "early-modern", 1526, "帕尼帕特，今印度", false, ["巴布尔在第一次帕尼帕特战役获胜", "莫卧儿王朝逐步扩张", "南亚拥有多样的语言和宗教社群"], "如果莫卧儿早期建立跨宗教的地方议会", "帝国与社会", "revolution"),
  seed("reformation-print", "early-modern", 1517, "维滕贝格，今德国", false, ["欧洲印刷网络迅速扩张", "宗教批评引发广泛争论", "诸侯与城市在改革中扮演重要角色"], "如果印刷商联合制定跨境言论保护规则", "印刷与宗教", "print"),
  seed("tokugawa-shogunate", "early-modern", 1603, "江户，今日本", false, ["德川家康获得征夷大将军称号", "幕府重组大名与土地关系", "日本城市和商业持续发展"], "如果幕府为各地商人设立全国代表会议", "政治与商业", "revolution"),
  seed("dutch-voc", "early-modern", 1602, "阿姆斯特丹，荷兰", false, ["荷兰东印度公司获得特许", "股份和海外贸易联系更紧密", "公司在亚洲贸易中拥有武装力量"], "如果投资者被要求公开监督海外公司的行为", "金融与贸易", "exchange"),
  seed("galileo-telescope", "early-modern", 1610, "帕多瓦，今意大利", false, ["望远镜观测挑战传统天文学", "欧洲学者通过书信交流发现", "宗教机构与学术争论相互交织"], "如果天文学观测资料被公开共享", "科学与传播", "space"),
  seed("west-african-gold", "early-modern", 1660, "阿散蒂，今加纳", false, ["阿散蒂地区的黄金贸易扩大", "地方政权通过联盟和战争整合", "大西洋贸易影响西非政治经济"], "如果阿散蒂建立限制奴隶贸易的区域同盟", "贸易与政治", "revolution"),
  seed("haitian-revolution", "early-modern", 1791, "圣多明各，今海地", false, ["法属圣多明各拥有高产种植园", "被奴役者发动大规模起义", "法国革命引发权利与主权争论"], "如果加勒比各岛更早承认废奴与公民权", "革命与自由", "revolution"),
  seed("american-independence", "early-modern", 1776, "费城，今美国", false, ["北美十三殖民地宣布独立", "独立战争仍在进行", "新政体的权利范围存在明显限制"], "如果独立宣言同时确立更广泛的公民权", "革命与政治", "revolution"),

  seed("haiti-independence", "industrial", 1804, "戈纳伊夫，海地", false, ["海地宣布摆脱法国统治", "革命源于长期的奴役制度", "新国家面对外交与贸易孤立"], "如果各国立即承认海地的独立地位", "独立与外交", "revolution"),
  seed("stockton-darlington", "industrial", 1825, "达灵顿，英国", false, ["蒸汽铁路开始运送货物和乘客", "煤炭推动英国工业化", "铁路建设改变了时间和距离感"], "如果铁路公司从一开始采用公共票价监管", "交通与工业", "industry"),
  seed("india-railway", "industrial", 1853, "孟买，今印度", false, ["印度第一条客运铁路开通", "铁路服务殖民行政与贸易", "南亚社会对线路扩张产生不同影响"], "如果铁路建设优先由地方社群共同规划", "交通与殖民", "industry"),
  seed("telegraph-line", "industrial", 1844, "华盛顿至巴尔的摩，美国", false, ["电报首次在长距离线路上稳定传讯", "通信速度不再受马车和船只限制", "新闻和金融开始依赖快速信息"], "如果电报网络被组织为公共通信服务", "通信与社会", "digital"),
  seed("meiji-restoration", "industrial", 1868, "江户，今日本", false, ["德川幕府结束统治", "明治政府推动制度改革", "日本面对西方列强压力"], "如果明治改革建立更强的地方协商机制", "改革与国家", "revolution"),
  seed("berlin-conference", "industrial", 1884, "柏林，德国", false, ["欧洲列强讨论非洲殖民规则", "非洲社会没有平等代表席位", "会议加速了殖民竞争"], "如果非洲代表参与并拥有否决权", "殖民与外交", "war"),
  seed("electric-light", "industrial", 1879, "门洛帕克，美国", false, ["白炽灯系统进入商业试验", "发电与配电需要新的基础设施", "城市夜间生活开始改变"], "如果城市优先建设公共所有的电网", "能源与城市", "industry"),
  seed("first-flight", "industrial", 1903, "基蒂霍克，美国", false, ["莱特兄弟完成受控动力飞行", "航空技术仍处于早期阶段", "军事和商业机构很快关注飞行"], "如果航空先由国际民用组织共同管理", "航空与规则", "space"),
  seed("panama-canal", "industrial", 1904, "巴拿马地峡，巴拿马", false, ["美国接手巴拿马运河工程", "工程依赖大量跨国劳工", "运河将缩短两大洋间航程"], "如果运河由国际托管机构共同运营", "工程与贸易", "industry"),
  seed("mexican-revolution", "industrial", 1910, "墨西哥城，墨西哥", false, ["墨西哥革命反对长期集权统治", "土地问题是重要诉求", "不同派别对改革目标并不相同"], "如果革命各派先达成土地改革的共同方案", "革命与土地", "revolution"),

  seed("world-war-one", "modern", 1914, "萨拉热窝，今波斯尼亚和黑塞哥维那", false, ["欧洲联盟体系使危机迅速扩大", "大战动员了全球殖民地与资源", "战壕战造成长期消耗"], "如果列强接受国际调停而非全面动员", "战争与外交", "war"),
  seed("russian-revolution", "modern", 1917, "彼得格勒，今俄罗斯", false, ["俄国在战争和粮食危机中动荡", "二月革命推翻了沙皇", "新的政治力量争夺国家方向"], "如果临时政府迅速实现土地与和平承诺", "革命与政治", "revolution"),
  seed("india-partition", "modern", 1947, "德里，今印度", false, ["英属印度结束殖民统治", "印巴分治伴随大规模迁移", "社群暴力造成严重伤亡"], "如果独立谈判预留更长的地方协商期", "独立与社群", "war"),
  seed("nato-founding", "modern", 1949, "华盛顿，美国", false, ["北约在冷战初期成立", "成员国承诺集体防御", "欧洲安全格局被重新组织"], "如果欧洲建立更广泛的非军事安全框架", "安全与外交", "war"),
  seed("ghana-independence", "modern", 1957, "阿克拉，加纳", false, ["加纳成为撒哈拉以南首个摆脱殖民统治的英属国家", "独立鼓舞了非洲多地民族运动", "新国家需要建立经济与行政能力"], "如果西非国家更早建立共同发展联盟", "独立与区域合作", "revolution"),
  seed("moon-landing", "modern", 1969, "休斯敦，美国", false, ["阿波罗11号完成首次载人登月", "太空竞赛由冷战推动", "航天计划依赖庞大公共投入"], "如果登月后成立共享技术的国际月球计划", "太空与合作", "space"),
  seed("oil-crisis", "modern", 1973, "维也纳，奥地利", false, ["石油输出国组织影响全球油价", "石油危机冲击多国经济", "能源依赖成为公共议题"], "如果主要经济体当时共同投资可再生能源", "能源与经济", "industry"),
  seed("world-wide-web", "modern", 1989, "日内瓦，瑞士", false, ["万维网方案在欧洲核子研究中心提出", "互联网已连接部分研究网络", "开放标准有助于信息共享"], "如果万维网从一开始就由全球公共机构维护", "网络与知识", "digital"),
  seed("south-africa-election", "modern", 1994, "比勒陀利亚，南非", false, ["南非举行首次不分种族的大选", "种族隔离制度走向终结", "和解与不平等问题同时存在"], "如果转型初期建立更广泛的财富再分配协商", "民主与和解", "revolution"),
  seed("euro-currency", "modern", 2002, "法兰克福，德国", false, ["欧元纸币和硬币开始流通", "欧洲货币联盟共享货币政策", "成员国财政政策仍由各国决定"], "如果欧元区同步建立更强的共同财政机制", "经济与联盟", "digital"),
];

function indexFrom(random: () => number, length: number) {
  return Math.max(0, Math.min(length - 1, Math.floor(random() * length)));
}

export function dealHistorySeeds(
  previousIds: readonly string[] = [],
  random: () => number = Math.random
): HistorySeed[] {
  const priorIds = new Set(previousIds);
  const eras: readonly HistoryEra[] = ["ancient", "medieval", "early-modern", "industrial", "modern"];
  const dealt = eras.map((era) => {
    const candidates = HISTORY_SEEDS.filter((seed) => seed.era === era);
    const freshCandidates = candidates.filter((seed) => !priorIds.has(seed.id));
    const pool = freshCandidates.length > 0 ? freshCandidates : candidates;

    return pool[indexFrom(random, pool.length)];
  });

  for (let index = dealt.length - 1; index > 0; index -= 1) {
    const swapIndex = indexFrom(random, index + 1);
    [dealt[index], dealt[swapIndex]] = [dealt[swapIndex], dealt[index]];
  }

  return dealt;
}
