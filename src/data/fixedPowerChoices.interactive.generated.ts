import type { TimelineTurn } from "../game/schema";

export const FIXED_POWER_CHOICES = {
  "galileo-1610": [
    {
      "id": "C",
      "powerId": "locate-anything",
      "displayLabel": "追踪马可的铜版",
      "label": "我立刻定位马可昨夜偷偷取走的木星卫星连续观测日志原稿，若它仍在印刷所内就截住，若已被携出则通知伽利略去追回。",
      "intent": "突破原稿丢失的盲区，使伽利略能赶在明早开印前收回全部证据。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "集中意念感知马可·巴尔比的原稿位置",
        "target": "马可·巴尔比及木星卫星连续观测日志原稿",
        "deadline": "书商明早开印前"
      },
      "instantEcho": {
        "directResult": "你精确说出日志藏在马可卧室床板下，伽利略派人取回。",
        "unexpectedCost": "马可因此与伽利略决裂，离职并威胁散布伽利略花钱雇人的闲话。",
        "beneficiary": "伽利略",
        "payer": "马可·巴尔比"
      }
    },
    {
      "id": "C",
      "powerId": "stretch-road",
      "displayLabel": "拉长书商马车路线",
      "label": "我把从印刷所大门到书商仓库的必经小巷拉长至一百公里，使书商明早无法按时抵达仓库取货。",
      "intent": "拖延书商开印时间，为伽利略争取更多修改印版的余地。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向印刷所外的小巷发动拉伸",
        "target": "印刷所正门外通向圣马可广场的小巷",
        "deadline": "书商明早出发前"
      },
      "instantEcho": {
        "directResult": "小巷一夜之间变成无尽长路，书商马车天亮后迷路，直到午后才发现原地打转。",
        "unexpectedCost": "威尼斯城防官认定是敌军魔法，封锁印刷所调查三天。",
        "beneficiary": "伽利略",
        "payer": "印刷所全体工人"
      }
    },
    {
      "id": "C",
      "powerId": "heal-room",
      "displayLabel": "治愈老校对眼疾",
      "label": "我让印刷所校对室内的所有人伤病痊愈，尤其治好老校对安东尼奥的严重白内障，使他能通宵核对最新版印稿。",
      "intent": "解决人力不足与视力障碍，让伽利略的最终结论和日志同时准确排印。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "挥手指向校对室并默念治愈",
        "target": "印刷所东侧校对室内所有工匠",
        "deadline": "明早开印前"
      },
      "instantEcho": {
        "directResult": "安东尼奥的白内障消失，其他人头疼、咳嗽全好，通宵工作完成新样稿。",
        "unexpectedCost": "安东尼奥因视力恢复过于惊人，被家人怀疑与魔鬼交易，告到宗教法庭。",
        "beneficiary": "安东尼奥·罗西",
        "payer": "安东尼奥·罗西"
      }
    },
    {
      "id": "C",
      "powerId": "conjure-water",
      "displayLabel": "水淹托勒密派会议",
      "label": "我在托勒密派学者次日清晨的聚会地——圣马可图书馆阅览室——地面持续生成清水，淹没地板，迫使他们转移地点。",
      "intent": "打乱反对派清晨会议，使伽利略的出版消息在无人干扰的上午君临学界。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "想象圣马可图书馆阅览室的地面涌出泉水",
        "target": "圣马可图书馆阅览室",
        "deadline": "明早开印前"
      },
      "instantEcho": {
        "directResult": "清晨大会变成涉水疏散，文献泡水，会议取消。",
        "unexpectedCost": "图书馆管理员索赔维修费，伽利略因资助池水被认为蓄意破坏。",
        "beneficiary": "伽利略",
        "payer": "伽利略"
      }
    },
    {
      "id": "C",
      "powerId": "read-one-mind",
      "displayLabel": "窃听马可的叛意",
      "label": "我盯住马可·巴尔比的眼睛，持续十分钟读取他此刻的想法与回忆，得知他昨夜与耶稣会士通信并准备偷印反对册子。",
      "intent": "提前探知泄密细节并锁定叛徒，防止反对派在印刷前动手脚。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "凝视马可并集中精神进入其意识",
        "target": "马可·巴尔比",
        "deadline": "明早开印前"
      },
      "instantEcho": {
        "directResult": "你将马可计划告知伽利略，后者当场解雇他并扣下所有叛变材料。",
        "unexpectedCost": "马可反咬伽利略使用巫术，导致威尼斯总督府传唤伽利略。",
        "beneficiary": "伽利略",
        "payer": "伽利略"
      }
    },
    {
      "id": "C",
      "powerId": "blink-self",
      "displayLabel": "瞬移刻刀到印版",
      "label": "我拿起伽利略修改最终结论的刻刀，带着它瞬间移到马可惯用的铜版前，趁夜将木星卫星观测轨道数据刻入印版边缘。",
      "intent": "绕过印刷工反对，直接无损修改印版，嵌入完整日志。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "手握刻刀，眨眼间出现在铜版前",
        "target": "伽利略的修正刻刀与马可的铜版",
        "deadline": "明早开印前"
      },
      "instantEcho": {
        "directResult": "铜版边缘新增木卫轨道图，与最终结论并列。",
        "unexpectedCost": "你因瞬移被守夜学徒看见，次日传遍全城为你引来宗教审判。",
        "beneficiary": "伽利略",
        "payer": "你"
      }
    }
  ],
  "apollo-11-1969": [
    {
      "id": "C",
      "powerId": "intangible-walls",
      "displayLabel": "穿透休斯敦控制中心墙壁",
      "label": "你在燃料只够维持几十秒的期限内，让休斯敦任务控制中心的墙壁门窗围栏变得可直接穿过，使所有飞控工程师肉身涌入登月舱与阿姆斯特朗一同决策。",
      "intent": "让无法进入登月舱的飞控工程师亲自参与判断，突破遥测延迟和通信带宽瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动能力使休斯敦任务控制中心的墙壁、门窗和围栏变得可以直接穿过",
        "target": "休斯敦任务控制中心",
        "deadline": "登月舱燃料只够维持几十秒"
      },
      "instantEcho": {
        "directResult": "所有飞控工程师穿过墙壁涌入登月舱，与阿姆斯特朗面对面观察仪表和数据。",
        "unexpectedCost": "登月舱内人员过载，氧气消耗急剧增加，剩余氧气从4小时降至45分钟。",
        "beneficiary": "阿姆斯特朗",
        "payer": "登月舱内氧气供应"
      }
    },
    {
      "id": "C",
      "powerId": "reverse-cause",
      "displayLabel": "把1202警报变成中止指令的原因",
      "label": "你在燃料只够维持几十秒的期限内，把1202警报（过载结果）改成它自己成了阿姆斯特朗必须手动避开巨石的原因，而原原因（计算机过载）变成了结果。这样阿姆斯特朗因警报而手动操作，却实际上避开了巨石区。",
      "intent": "将导致中止的警报反向变成迫使阿姆斯特朗手动操作的契机，从而骗过中止逻辑。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动能力将1202警报（过载结果）改为原因，将原原因（计算机过载）改为结果",
        "target": "1202警报",
        "deadline": "登月舱燃料只够维持几十秒"
      },
      "instantEcho": {
        "directResult": "阿姆斯特朗因1202警报而手动操作，反而精确避开了巨石区，成功降落。",
        "unexpectedCost": "因果关系永久改变后，后续所有任务日志都记载1202警报是手动操作的原因，导致工程师多年误判警报机制。",
        "beneficiary": "阿姆斯特朗",
        "payer": "任务日志的历史准确性"
      }
    },
    {
      "id": "C",
      "powerId": "stop-time",
      "displayLabel": "停止时间十分钟",
      "label": "你在登月舱燃料只够维持几十秒的期限内，让除你之外的整个登月舱区域（包括阿姆斯特朗、奥尔德林、计算机、燃料消耗）完全停止十分钟，从而你有足够时间分析所有数据并告知阿姆斯特朗最佳操作。",
      "intent": "将几十秒的燃料窗口拉长至十分钟，彻底解决时间压力。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动能力使除你之外的整个登月舱区域完全停止",
        "target": "登月舱区域",
        "deadline": "登月舱燃料只够维持几十秒"
      },
      "instantEcho": {
        "directResult": "时间停止，你有十分钟无干扰地查看所有计算机数据并口头指导阿姆斯特朗。",
        "unexpectedCost": "时间恢复后，阿姆斯特朗感到意识中断和指令跳跃，产生短暂眩晕，需1秒恢复。",
        "beneficiary": "导航控制员你",
        "payer": "阿姆斯特朗的连续意识"
      }
    },
    {
      "id": "C",
      "powerId": "clone-self",
      "displayLabel": "复制一百个自己同时分析遥测",
      "label": "你在燃料只够维持几十秒的期限内，复制出一百个拥有当前记忆且听从你指令的分身，每个分身同时分析一道计算机子程序，瞬间定位1202警报的根源并给出继续下降的确认口令。",
      "intent": "用并行分析突破计算机过载问题，人海战术解决单点故障。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动能力复制出一百个拥有当前记忆且听从同一目标的分身",
        "target": "你本人",
        "deadline": "登月舱燃料只够维持几十秒"
      },
      "instantEcho": {
        "directResult": "一百个分身同时分析出1202警报是由雷达数据冲突引起，确认可继续飞行，你立即向阿姆斯特朗发出继续下降口令。",
        "unexpectedCost": "分身存在一天内，所有分身共享同一目标，但各有独立意识，在任务结束后争论功劳，导致控制中心内部分歧。",
        "beneficiary": "阿姆斯特朗",
        "payer": "任务控制中心的团结"
      }
    },
    {
      "id": "C",
      "powerId": "extinguish-fire",
      "displayLabel": "熄灭登月舱推进器火焰",
      "label": "你在燃料只够维持几十秒的期限内，让方圆十里内正在燃烧的全部火焰瞬间熄灭且无法复燃，包括登月舱下降发动机的火焰，迫使登月舱立即进入无动力降落，但同时也消除了火灾风险。",
      "intent": "强制熄灭推进器火焰，迫使阿姆斯特朗进入无动力滑翔，从而节省燃料并手动落点。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动能力使方圆十里内正在燃烧的全部火焰瞬间熄灭且无法复燃",
        "target": "方圆十里内的火焰",
        "deadline": "登月舱燃料只够维持几十秒"
      },
      "instantEcho": {
        "directResult": "登月舱下降发动机熄火，阿姆斯特朗转为无动力滑翔，利用剩余高度和动量手动避开巨石区，成功降落。",
        "unexpectedCost": "无动力降落导致登月舱结构承受额外冲击，着陆后起落架轻微变形，无法再次起飞。",
        "beneficiary": "阿姆斯特朗",
        "payer": "登月舱的结构完整性"
      }
    },
    {
      "id": "C",
      "powerId": "erase-memory",
      "displayLabel": "删除阿姆斯特朗对巨石区的记忆",
      "label": "你在燃料只够维持几十秒的期限内，永久删除阿姆斯特朗关于预定着陆区布满巨石这一具体事件的记忆，使他不再手动避障，而是信任计算机原定路径下降，从而直接落入巨石区。",
      "intent": "通过抹除关键信息迫使他按原计划行事，避免手动误操作。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动能力永久删除阿姆斯特朗关于预定着陆区布满巨石的具体记忆",
        "target": "阿姆斯特朗",
        "deadline": "登月舱燃料只够维持几十秒"
      },
      "instantEcho": {
        "directResult": "阿姆斯特朗不再意识到巨石，按计算机路径下降，登月舱直接落在巨石区，起落架断裂，任务失败。",
        "unexpectedCost": "阿姆斯特朗永久失去了那一块记忆，余生无法回忆起为何着陆失败，产生持续心理阴影。",
        "beneficiary": "任务控制中心（避免了手动操作风险）",
        "payer": "阿姆斯特朗的个人记忆和任务成功"
      }
    }
  ],
  "gutenberg-bible-1455": [
    {
      "id": "C",
      "powerId": "rewind-hour",
      "displayLabel": "倒数铅字悔版",
      "label": "你让印刷坊回到一小时前，这样就能重新校对古腾堡那页有瑕疵的版面，避免明日被债权人接管。",
      "intent": "通过倒回时间，你可以在债权人接管前修正排版错误，确保圣经顺利完成。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动倒退一小时能力，使印刷坊回到一小时前的状态",
        "target": "古腾堡印刷坊的铅活字版面",
        "deadline": "债权人将在明日接管作坊"
      },
      "instantEcho": {
        "directResult": "印刷坊的一切恢复至一小时前，古腾堡看到重新排列的铅字。",
        "unexpectedCost": "你消耗一次珍贵的时间回溯机会，且记忆中的正确排版需亲自指示。",
        "beneficiary": "古腾堡",
        "payer": "你自己"
      }
    },
    {
      "id": "C",
      "powerId": "shapeshift",
      "displayLabel": "化身金主延缓债期",
      "label": "你变成债权人的外貌和声音，亲自命令明日暂缓接管作坊，为古腾堡争取最后一日来完成圣经。",
      "intent": "利用债权人形象欺骗同行，获得额外一天时间完成印刷而不被查封。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动变身能力，变成债权人的模样，发出暂缓接管指令",
        "target": "债权人的外貌和声音",
        "deadline": "明日接管之时，但你要在今晚完成指令"
      },
      "instantEcho": {
        "directResult": "作坊所有人都认为你是债权人，他口头同意再宽限一日。",
        "unexpectedCost": "真正的债权人明日会出现揭穿谎言，矛盾加剧。",
        "beneficiary": "古腾堡",
        "payer": "你自己（承担变身后被识破的风险）"
      }
    },
    {
      "id": "C",
      "powerId": "summon-lightning",
      "displayLabel": "雷击铅版开新局",
      "label": "你召下一道雷电精确击碎那页有错字的铅版，迫使古腾堡不得不重新排版，从而规避旧版印刷的致命错误。",
      "intent": "用天灾破坏错误版型，强制古腾堡重排以避免明日交付含误圣经。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动召雷能力，让雷电击中指定的铅版",
        "target": "印刷坊内那页有错字的铅活字版",
        "deadline": "在明日债权人接管前完成破坏"
      },
      "instantEcho": {
        "directResult": "一道雷电击碎了错误铅版，金属碎片散落一地。",
        "unexpectedCost": "印刷坊部分工具受损，古腾堡需额外时间修复。",
        "beneficiary": "你（避免了错误印刷的后果）",
        "payer": "古腾堡（承担修复成本和时间）"
      }
    },
    {
      "id": "C",
      "powerId": "share-memory",
      "displayLabel": "共享古腾堡研发苦记",
      "label": "你让古腾堡和他的债权人共享你一段记忆：展示未来书籍复制速度因印刷术而剧增，证明投入值得延迟接管。",
      "intent": "用亲历记忆说服债权人，让他看到印刷术的长期价值，从而延缓接管。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动共享记忆能力，让古腾堡和债权人经历你的记忆",
        "target": "古腾堡和债权人",
        "deadline": "在明日接管前发动记忆共享以争取时间"
      },
      "instantEcho": {
        "directResult": "两人以第一视角看到未来印刷术繁荣的场景。",
        "unexpectedCost": "记忆共享让债权人意识到你拥有异常知识，引起怀疑。",
        "beneficiary": "古腾堡",
        "payer": "你自己（暴露了非时代知识）"
      }
    },
    {
      "id": "C",
      "powerId": "door-anywhere",
      "displayLabel": "开扇全城速通道",
      "label": "你在印刷坊墙上开一扇直接通往全城最稳的纸张仓库的门，瞬间取来优质纸张，连夜赶印完成最后一批书页。",
      "intent": "利用任意门快速获取原料，赶在接管前完成印刷。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动开门能力，在墙上开一道通往纸张仓库的门",
        "target": "美因茨城中优质纸张仓库",
        "deadline": "明日债权人接管之前，立即取纸"
      },
      "instantEcho": {
        "directResult": "门打开直接通向纸张堆，古腾堡的人立刻搬走所需纸张。",
        "unexpectedCost": "门存在十分钟后消失，仓库方发觉失窃将追查。",
        "beneficiary": "古腾堡",
        "payer": "纸张仓库的商人（承担损失）"
      }
    },
    {
      "id": "C",
      "powerId": "age-target",
      "displayLabel": "催老债权人使其退让",
      "label": "你让债权人瞬间老去四十年，他的身体变得虚弱且记忆仍保持年轻；他震惊于自己孱弱不堪，无力坚持明日接管，只得放弃。",
      "intent": "通过身体老化摧毁债权人的精力与威信，迫使他放弃接管计划。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动老化能力，对债权人使用使其老去四十年",
        "target": "债权人的身体",
        "deadline": "在明日他计划接管之前发动，最好立即"
      },
      "instantEcho": {
        "directResult": "债权人在你面前瞬间变成八旬老人，步履蹒跚。",
        "unexpectedCost": "美因茨城将流传老人被诅咒的谣言，印刷坊可能被怀疑。",
        "beneficiary": "古腾堡和你自己",
        "payer": "债权人（失去健康与威信）"
      }
    }
  ]
} as const satisfies Record<string, readonly TimelineTurn["choices"][2][]>;
