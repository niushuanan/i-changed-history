import type { TimelineTurn } from "../game/schema";

export const FIXED_POWER_CHOICES = {
  "red-cliffs-208": [
    {
      "id": "C",
      "powerId": "blink-self",
      "displayLabel": "带铁索瞬移至曹营后方",
      "label": "你带着一条曹军舰船上的铁索瞬移至曹操旗舰后方，使铁索缠绕住舵叶，令其失去转向能力。",
      "intent": "通过破坏曹操旗舰的机动性，打乱其指挥链，为火船进攻创造窗口。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "瞬移并缠绕铁索",
        "target": "曹操旗舰舵叶",
        "deadline": "距离曹军发现火船约半个时辰"
      },
      "instantEcho": {
        "directResult": "曹操旗舰舵叶被铁索缠死，无法转向。",
        "unexpectedCost": "你瞬移时被曹军士兵发现，遭箭矢射中左肩。",
        "beneficiary": "黄盖的火船编队",
        "payer": "你肩膀的箭伤"
      }
    },
    {
      "id": "C",
      "powerId": "summon-future-self",
      "displayLabel": "召十年后的自己预警风向",
      "label": "你召来十年后的自己，他告诉你赤壁之战真实气象数据：当晚子时东风骤起，若提前放船必被西风吹回。",
      "intent": "利用未来知识精确确定最佳火攻时机，避免过早放船导致失败。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤未来自己并获取信息",
        "target": "周瑜的火攻决策",
        "deadline": "距离曹军发现火船约半个时辰"
      },
      "instantEcho": {
        "directResult": "周瑜按你提供的时间推迟放船，子时东风起，火船顺风袭击曹营。",
        "unexpectedCost": "十年后的你因泄露天机，被时空法则反噬，消失一年。",
        "beneficiary": "孙刘联军整体",
        "payer": "未来的你失去一年存在"
      }
    },
    {
      "id": "C",
      "powerId": "invisibility",
      "displayLabel": "隐身登上黄盖火船",
      "label": "你隐身携带火油登上黄盖旗舰，在船头安装定向爆破火油罐，确保爆炸方向对准曹军连船。",
      "intent": "保证火船爆炸威力集中摧毁铁索连环的曹军舰队核心区域。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "安装定向火油罐",
        "target": "黄盖旗舰船头",
        "deadline": "距离曹军发现火船约半个时辰"
      },
      "instantEcho": {
        "directResult": "火船撞击曹军时，爆炸将铁索切断，曹军船只四散燃烧。",
        "unexpectedCost": "你安装时火油溅到衣服，隐身失效，被曹军弓箭手发现并射伤。",
        "beneficiary": "周瑜火攻计划",
        "payer": "你右臂中箭"
      }
    },
    {
      "id": "C",
      "powerId": "split-river",
      "displayLabel": "分开长江阻断曹军退路",
      "label": "你命令长江在乌林段从中间分开，露出干燥河床，使曹操溃败的残军无法沿江南逃。",
      "intent": "封锁曹操陆上撤退路线，迫使曹军主力在火攻中覆灭。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让长江分开",
        "target": "乌林段长江水面",
        "deadline": "距离曹军发现火船约半个时辰"
      },
      "instantEcho": {
        "directResult": "长江乌林段河床裸露，曹操溃军无路可逃，被大火吞没。",
        "unexpectedCost": "河床裸露导致大量河鱼搁浅，当地渔民损失惨重。",
        "beneficiary": "孙刘联军",
        "payer": "乌林渔民失去生计"
      }
    },
    {
      "id": "C",
      "powerId": "speak-any-distance",
      "displayLabel": "与曹操通话谎报军情",
      "label": "你与曹操实时通话，假扮黄盖亲兵，说火船因东风改向西行，请曹军准备迎接。",
      "intent": "使曹操放松警惕，不派出侦察船，确保火船突袭的突然性。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "通话欺骗",
        "target": "曹操本人",
        "deadline": "距离曹军发现火船约半个时辰"
      },
      "instantEcho": {
        "directResult": "曹操下令水军暂不戒备，火船顺利逼近。",
        "unexpectedCost": "曹操事后通过声音特征认出你，对你全家悬赏通缉。",
        "beneficiary": "黄盖诈降计划",
        "payer": "你全家的安全"
      }
    },
    {
      "id": "C",
      "powerId": "duplicate-place",
      "displayLabel": "复制周瑜帐中火攻地图",
      "label": "你在附近空地复制一份周瑜大帐，内含火攻地图和调兵令牌，让曹军斥候误以为是真指挥部而发起偷袭。",
      "intent": "调虎离山，使曹操分兵攻击假营，减轻主攻方向压力。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制周瑜大帐",
        "target": "周瑜存放火攻地图的帐幕",
        "deadline": "距离曹军发现火船约半个时辰"
      },
      "instantEcho": {
        "directResult": "曹军精锐偷袭假营，中伏被歼，火攻方向曹军兵力空虚。",
        "unexpectedCost": "复制品消耗了你的部分生命力，事后连续三日高烧不退。",
        "beneficiary": "周瑜主力部队",
        "payer": "你的健康"
      }
    }
  ],
  "dong-zhuo-lu-bu-190": [
    {
      "id": "C",
      "powerId": "walk-through-walls",
      "displayLabel": "穿墙截停吕布",
      "label": "你命令吕布放弃押送百官，随你从宣阳门东侧城墙穿墙而出，直奔小平津渡口，脱离董卓视线。一刻钟内必须行动。",
      "intent": "利用穿墙能力避开城门守卫，让吕布脱离董卓的控制，提前清除董卓的臂膀。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "拉住吕布的手腕，从宣阳门东侧城墙穿墙而出",
        "target": "吕布",
        "deadline": "一刻钟后董卓的车队穿过城门之时"
      },
      "instantEcho": {
        "directResult": "你和吕布瞬间穿过城墙，出现在城墙外的荒地上，吕布惊愕地松开你的手。",
        "unexpectedCost": "你的右臂衣袖在穿过城墙时熔化了一半，手臂皮肤留下焦痕。",
        "beneficiary": "吕布",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "immortal-day",
      "displayLabel": "赐吕布一日不死",
      "label": "你将自己的精血滴在吕布额头，赐予他二十四小时不死之身。命令他继续护送百官出城，但承诺明日此时必与他里应外合除掉董卓。",
      "intent": "让吕布在接下来的冲突中无法被杀死，确保他能在关键时刻反水。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "咬破指尖，将血涂在吕布额头上，同时口述命令",
        "target": "吕布",
        "deadline": "即刻生效，持续二十四小时"
      },
      "instantEcho": {
        "directResult": "吕布额头泛起金光，他感到体内涌起一股不可伤害的力量。他点头应允。",
        "unexpectedCost": "你的指尖伤口无法止血，三天后才结痂。",
        "beneficiary": "吕布",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "transmute-material",
      "displayLabel": "铁锁变腐木",
      "label": "你将宣阳门城门的铁制门闩瞬间变成朽木。命令吕布推倒城门，让关东联军骑兵直接冲入城内，迫使董卓放弃迁都。",
      "intent": "改变门闩材质，使城门失守，打乱董卓的迁都计划。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "手指指向宣阳门铁门闩，说一声“化木”，同时命令吕布推门",
        "target": "宣阳门铁门闩",
        "deadline": "一刻钟内"
      },
      "instantEcho": {
        "directResult": "铁门闩在瞬间变成腐朽的松木，吕布一脚踹断门闩，城门大开。",
        "unexpectedCost": "你周围的空气温度骤降，冻伤了旁边两名亲兵的耳朵。",
        "beneficiary": "关东联军先锋",
        "payer": "两名受伤的亲兵"
      }
    },
    {
      "id": "C",
      "powerId": "broadcast-thought",
      "displayLabel": "万人齐听诛董令",
      "label": "你让洛阳城内方圆十里的所有人——包括献帝、百官、董卓的西凉军——在脑中同时听见你说：“董卓焚城，天下共诛之。吕布为王允所使，立斩董贼！”",
      "intent": "利用思想广播公开董卓罪行，并暗示吕布已反，瓦解西凉军士气。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "集中意念，将这句话送进所有人脑中",
        "target": "洛阳城内所有军民",
        "deadline": "即刻生效"
      },
      "instantEcho": {
        "directResult": "全城瞬间寂静，随即西凉军营内传来骚动，有人高喊“吕布反了”。",
        "unexpectedCost": "你因精神过度集中而晕厥倒地，醒来后头痛欲裂。",
        "beneficiary": "王允",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "teleport-crowd",
      "displayLabel": "迁百官入长安",
      "label": "你命令在场所有准备随董卓西迁的百官及其家属共九十三人，瞬间传送至长安城中的未央宫前殿。同时你留在洛阳，制造百官已经逃脱的假象。",
      "intent": "将百官从董卓的控制下解救出来，让董卓失去人质。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "高举双手，口中念出长安未央宫前殿的坐标，下令传送",
        "target": "在场所有准备上车的百官及其家属",
        "deadline": "董卓车队出城前"
      },
      "instantEcho": {
        "directResult": "九十三人瞬间消失，只剩空车；长安方向传来惊呼声。",
        "unexpectedCost": "你的身体因承受大量空间转移而内出血，七窍流血但未死。",
        "beneficiary": "汉献帝",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "borrow-tomorrow-memory",
      "displayLabel": "借明日记忆识忠奸",
      "label": "你快速回忆明日此刻的记忆——在记忆片段中，你看见吕布背叛董卓并亲手将其斩杀，而王允在长安暗杀名单上名列第二。你即刻警告王允提防吕布。",
      "intent": "通过未来记忆验证王允和吕布的忠诚度，提前做出防范。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "闭目回忆明日此刻的记忆，然后对王允耳语",
        "target": "王允",
        "deadline": "即刻，在董卓车队通过前"
      },
      "instantEcho": {
        "directResult": "王允脸色铁青，将你给的密信塞入袖中，低声说“我自有分寸”。",
        "unexpectedCost": "你因记忆干扰而暂时混淆今日与明日，差点对吕布喊出“恭喜”。",
        "beneficiary": "王允",
        "payer": "你"
      }
    }
  ],
  "guandu-wuchao-200": [
    {
      "id": "C",
      "powerId": "age-target",
      "displayLabel": "衰败许攸四十年",
      "label": "你让许攸身体瞬老四十年，他在对质前咳喘告老，无法指证乌巢虚实。",
      "intent": "废除许攸口供的权威性，逼自己从其他渠道确认粮仓位置。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "抬手指向许攸，瞬间催老其形骸",
        "target": "许攸",
        "deadline": "天亮前下一批袁军粮车进入乌巢"
      },
      "instantEcho": {
        "directResult": "许攸当场弯腰咳血，发白齿落，无法再清晰陈述乌巢情报。",
        "unexpectedCost": "你因疑似借妖法干扰军务被曹操拔剑质问，必须在三息内解释。",
        "beneficiary": "曹操，因不冒险轻信叛将而减少被伏风险。",
        "payer": "许攸，身心俱废且再无人举荐，永失效力曹操的机会。"
      }
    },
    {
      "id": "C",
      "powerId": "universal-language",
      "displayLabel": "破译袁军调度",
      "label": "你听懂帐外抓获的袁军斥候用鲜卑暗语报告的“淳于琼卯时换防”，指出乌巢空虚。",
      "intent": "不依赖许攸，用敌军自己的暗语证实乌巢防御薄弱。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "对俘虏说出其暗语原话并逐句翻译",
        "target": "袁军斥候",
        "deadline": "天亮前粮车入巢"
      },
      "instantEcho": {
        "directResult": "曹操立刻相信乌巢凌晨换防有空隙，决定夜袭。",
        "unexpectedCost": "俘虏在招供后被曹军灭口，你无法再从他口中获取更多袁军部署。",
        "beneficiary": "曹军夜袭队，精准掌握换防窗口。",
        "payer": "袁军斥候，泄密后被杀。"
      }
    },
    {
      "id": "C",
      "powerId": "intangible-walls",
      "displayLabel": "瓦解乌巢围墙",
      "label": "你对百里外乌巢粮仓下令，其所有墙壁、门窗一小时内可无阻穿行，曹军火把与硫磺直抵粮垛。",
      "intent": "消除夜袭最怕的城墙障碍，让焚烧直接有效。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "默念命令目标，随即乌巢壁垒透明化",
        "target": "乌巢粮仓",
        "deadline": "天亮前袁军援兵抵达"
      },
      "instantEcho": {
        "directResult": "曹军先锋直接冲过墙壁将火把扔上粮垛，大火提前一个时辰腾起。",
        "unexpectedCost": "乌巢南侧粮库因过火太快烧到内厩，三十匹战马被烧死，损失了可缴获的军马。",
        "beneficiary": "曹军纵火队，零伤亡完成核心目标。",
        "payer": "袁绍方，失去战马且粮草全焚。"
      }
    },
    {
      "id": "C",
      "powerId": "reverse-cause",
      "displayLabel": "颠倒袁绍败因",
      "label": "你使许攸叛逃原因逆转：原结果“许攸献计不受而叛”变为原因，原原因“袁绍逼迫”变为结果。",
      "intent": "让许攸成为袁绍败局的起点而非结果，使曹操确信乌巢为空。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将许攸叛逃前因后果在脑中颠倒，现实瞬间改写",
        "target": "许攸叛逃事件",
        "deadline": "天亮前粮车入巢"
      },
      "instantEcho": {
        "directResult": "许攸嘴角流血倒地，记忆混乱中喊出“乌巢无备”，曹操再无怀疑。",
        "unexpectedCost": "颠倒因果后，许攸部分相关记忆消失，无法指证袁绍其他弱点。",
        "beneficiary": "曹操，获得铁证。",
        "payer": "许攸，精神错乱，日后沦为废人。"
      }
    },
    {
      "id": "C",
      "powerId": "stop-time",
      "displayLabel": "定场审乌巢图",
      "label": "你停下帐内时间，独自翻开许攸衣内藏的乌巢布防图，确认淳于琼守军仅500人。",
      "intent": "静默获取独立情报，不干扰军议进程。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在时停中搜出并阅读许攸怀中布防图",
        "target": "许攸",
        "deadline": "天亮前粮车入巢"
      },
      "instantEcho": {
        "directResult": "你确知乌巢守备空虚，时停结束立即禀报。",
        "unexpectedCost": "时停期间曹操保持姿势，重新移动时闪到腰筋，整夜剧痛无法亲征。",
        "beneficiary": "曹军参谋部，得到准确情报。",
        "payer": "曹操，身体不适，错失前线指挥荣耀。"
      }
    },
    {
      "id": "C",
      "powerId": "clone-self",
      "displayLabel": "百影验乌巢路",
      "label": "你化出一百个自己，命他们分头沿所有小径连夜奔往乌巢，确认哪条路无伏兵。",
      "intent": "同时探索多条路线，快速安全找出夜袭捷径。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "你分裂出一百个自己，遍布中军帐",
        "target": "乌巢",
        "deadline": "天亮前粮车入巢"
      },
      "instantEcho": {
        "directResult": "一个分身回报乌巢西南岗哨是盲区，曹军可绕行突袭。",
        "unexpectedCost": "九十九个分身在田埂上留下密集脚印，袁军斥候发现异常提高了警惕。",
        "beneficiary": "曹操，获得安全路线。",
        "payer": "你，因过度消耗精神，战后昏睡三日。"
      }
    }
  ],
  "yiling-222": [
    {
      "id": "C",
      "powerId": "copy-skill",
      "displayLabel": "复制陆逊的火攻推演",
      "label": "你复制陆逊对风向、干燥度与连营易燃点的全部推演知识，然后当刘备面画出陆逊的火攻计划图，要求立即拔营。",
      "intent": "凭对手的推演说服刘备取消连营。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制并画出陆逊的火攻推演图",
        "target": "刘备",
        "deadline": "陆逊的火攻小队将在今夜抵达上风口"
      },
      "instantEcho": {
        "directResult": "刘备看到火攻图后震惊，下令紧急拔营。",
        "unexpectedCost": "陆逊得知计划泄露后提前发动火攻，蜀军撤退时仍被烧毁部分辎重。",
        "beneficiary": "刘备",
        "payer": "负责断后的冯习"
      }
    },
    {
      "id": "C",
      "powerId": "control-weather",
      "displayLabel": "改写夷陵上空为大雨天气",
      "label": "你指定方圆百公里未来二十四小时倾盆大雨，浇透山林连营，使火攻无法实施，并迫使陆逊放弃伏击。",
      "intent": "用降雨彻底瓦解火攻条件。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "改变天气为大雨",
        "target": "猇亭及连营区域",
        "deadline": "陆逊的火攻小队将在今夜抵达上风口"
      },
      "instantEcho": {
        "directResult": "大雨突降，火攻无法实施，刘备扎营稳固。",
        "unexpectedCost": "大雨导致山洪，部分低洼营寨被淹，损失粮草。",
        "beneficiary": "刘备",
        "payer": "驻守山谷的吴班"
      }
    },
    {
      "id": "C",
      "powerId": "see-hidden-writing",
      "displayLabel": "看见陆逊密令与火攻计划",
      "label": "你读到陆逊烧毁的密令、加密信件和未写下的火攻指令，当场向刘备念出今晚火攻细节。",
      "intent": "获取绝对情报证据说服刘备。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "读出陆逊的隐藏密令",
        "target": "陆逊的密令与火攻计划",
        "deadline": "陆逊的火攻小队将在今夜抵达上风口"
      },
      "instantEcho": {
        "directResult": "刘备立即下令分兵防火并后退五里。",
        "unexpectedCost": "陆逊发现密令泄露，提前发动总攻，蜀军仓促应战伤亡增加。",
        "beneficiary": "刘备",
        "payer": "传递情报的细作"
      }
    },
    {
      "id": "C",
      "powerId": "pocket-building",
      "displayLabel": "收走蜀军连营入随身口袋",
      "label": "你发动能力把蜀军全部连营连同内部将士收入口袋，瞬间消失于林中，只留开阔地。",
      "intent": "用消失营寨避开火攻。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "收走连营",
        "target": "蜀军连营",
        "deadline": "陆逊的火攻小队将在今夜抵达上风口"
      },
      "instantEcho": {
        "directResult": "蜀军连营及人员全部消失，陆逊火攻失去目标。",
        "unexpectedCost": "收回时营寨内物资潮湿，部分火器失效。",
        "beneficiary": "蜀军全体将士",
        "payer": "你本人耗费体力需休息三日"
      }
    },
    {
      "id": "C",
      "powerId": "restore-youth",
      "displayLabel": "让刘备年轻四十岁回归壮年",
      "label": "你让六十二岁的刘备身体回到二十二岁巅峰状态，使他能亲率精锐突击陆逊中军，打乱火攻部署。",
      "intent": "用刘备个人武力扭转战局。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让刘备年轻四十岁",
        "target": "刘备",
        "deadline": "陆逊的火攻小队将在今夜抵达上风口"
      },
      "instantEcho": {
        "directResult": "刘备变年轻，体力充沛，率亲卫突击陆逊大营。",
        "unexpectedCost": "刘备性格仍急躁，在追击中脱离主力，遭东吴围困。",
        "beneficiary": "刘备",
        "payer": "护卫刘备的赵云"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-money",
      "displayLabel": "用金币买通东吴将领停火",
      "label": "你取出无法辨伪的三国时期金币，派快马送给陆逊部下马忠、淳于丹等将领，要求他们延迟火攻并撤退。",
      "intent": "用巨贿瓦解东吴进攻意志。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用无限钱财买通东吴将领",
        "target": "马忠、淳于丹等东吴将领",
        "deadline": "陆逊的火攻小队将在今夜抵达上风口"
      },
      "instantEcho": {
        "directResult": "马忠等人收钱后按兵不动，火攻未按时发起。",
        "unexpectedCost": "陆逊发现军心不稳，斩杀马忠等将，整肃后仍发动火攻，但推迟至次日。",
        "beneficiary": "刘备",
        "payer": "被斩的马忠等将"
      }
    }
  ],
  "jieting-228": [
    {
      "id": "C",
      "powerId": "conjure-water",
      "displayLabel": "在山脚涌出泉水",
      "label": "你在张郃骑兵封锁水源前，令山脚涌出足以供全营饮用的清泉，迫使马谡放弃上山扎营而据水道下寨。",
      "intent": "用持续供水置换马谡的立营决策，避免高地断水溃败。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在街亭山脚指定位置开启持续涌出的清泉",
        "target": "马谡的营寨选址决策",
        "deadline": "张郃骑兵天亮到来前"
      },
      "instantEcho": {
        "directResult": "山脚出现稳定溪流，王平借机力劝马谡依水立寨。",
        "unexpectedCost": "泉水涌出冲毁部分粮道，需紧急抢修。",
        "beneficiary": "王平及其劝谏立场",
        "payer": "负责粮道的辎重兵"
      }
    },
    {
      "id": "C",
      "powerId": "read-one-mind",
      "displayLabel": "窥听马谡的谋划",
      "label": "你要潜入马谡帐中，用读心术探得他坚持上山扎营的真实念头，并在军议时当众复述，促使众将否决其计划。",
      "intent": "通过暴露马谡内心的战略破绽，扭转决定。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "进入马谡营帐并对其使用读心术",
        "target": "马谡",
        "deadline": "张郃骑兵逼近前一刻钟"
      },
      "instantEcho": {
        "directResult": "你发现马谡正在回忆诸葛亮南征旧事，幻想凭高地再现奇功。",
        "unexpectedCost": "马谡察觉被窥视，日后可能追查报复。",
        "beneficiary": "蜀汉北伐全局",
        "payer": "你个人安全"
      }
    },
    {
      "id": "C",
      "powerId": "blink-self",
      "displayLabel": "瞬移取回山道军令",
      "label": "你要利用瞬移，在张郃骑兵合围前将诸葛亮交付的立寨密令直接送到马谡手中，以其字迹强迫他放弃上山部署。",
      "intent": "用绝对权威的物理证据压制马谡的违命行为。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "瞬移到诸葛亮帐中取来密令，再回到马谡面前",
        "target": "诸葛亮的手令文书",
        "deadline": "张郃骑兵封锁山道前"
      },
      "instantEcho": {
        "directResult": "马谡看到诸葛亮亲笔密令后大惊，但仍犹豫不决。",
        "unexpectedCost": "你因瞬移劳累晕厥，被亲兵抬走。",
        "beneficiary": "王平和蜀军部署",
        "payer": "你的体力"
      }
    },
    {
      "id": "C",
      "powerId": "summon-future-self",
      "displayLabel": "召来十年后的你",
      "label": "你要召来十年后已亲历街亭败局的自己，让他用一句惨痛教训当面喝醒马谡，使其服从王平的建议。",
      "intent": "用未来事实的恐惧逼迫马谡改变决定。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤十年后的自己并让其对马谡开口",
        "target": "马谡",
        "deadline": "张郃骑兵天亮抵达山脚前"
      },
      "instantEcho": {
        "directResult": "未来你字字血泪描述断水之惨，马谡面色苍白，开始动摇。",
        "unexpectedCost": "未来你消失后，你的现状记忆出现模糊。",
        "beneficiary": "王平的劝谏",
        "payer": "你的精神认知"
      }
    },
    {
      "id": "C",
      "powerId": "invisibility",
      "displayLabel": "隐身夺取将旗调度",
      "label": "你要在深夜隐身潜入马谡帐中，取走他作为主将的令旗与调兵令牌，迫使王平暂代指挥并紧急改营。",
      "intent": "通过夺权转移指挥权，强行执行正确部署。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "隐身进入马谡营帐偷走令旗与令牌",
        "target": "马谡的令旗与调兵令牌",
        "deadline": "张郃骑兵发动进攻前"
      },
      "instantEcho": {
        "directResult": "马谡发现失物后惊慌失措，王平借机接管指挥，下令依水下寨。",
        "unexpectedCost": "马谡疑心王平所为，事后可能弹劾王平。",
        "beneficiary": "王平",
        "payer": "王平的名声"
      }
    },
    {
      "id": "C",
      "powerId": "split-river",
      "displayLabel": "分开漳水改道阻碍",
      "label": "你要在张郃骑兵逼近河道时，将漳水中央分开，露出河床阻挡骑兵突进，并引导蜀军从干涸河床直取魏军后方辎重。",
      "intent": "用地理改造制造缓冲，逼马谡放弃高地，主动出击。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在街亭侧翼河流漳水处发动分水",
        "target": "漳水河道",
        "deadline": "张郃骑兵到达河岸前"
      },
      "instantEcho": {
        "directResult": "漳水分开，张郃前锋坠入河床，蜀军士气大振，马谡被迫下山接战。",
        "unexpectedCost": "分水导致下游农田被淹，引发魏国百姓怨恨。",
        "beneficiary": "蜀汉大军",
        "payer": "魏国百姓"
      }
    }
  ],
  "gaoping-tombs-249": [
    {
      "id": "C",
      "powerId": "rust-weapons",
      "displayLabel": "锈毁洛阳城门铁器",
      "label": "你在日落前发动锈蚀所有武器的能力，将洛阳城门内司马懿部队的刀剑、矛头、铠甲铁片全部锈毁，让他们无法完成武装换防。",
      "intent": "阻止司马懿部队完成武装换防，为曹爽争取入城或突围的时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动锈蚀所有武器的能力",
        "target": "洛阳城门内司马懿部队的刀剑、矛头、铠甲铁片",
        "deadline": "日落前完成换防"
      },
      "instantEcho": {
        "directResult": "洛阳城门内所有铁制武器瞬间锈蚀成废铁，司马懿士兵无法持械换防。",
        "unexpectedCost": "你也发觉自己随身的佩剑和符节上的铁环同样锈毁，无法再证明身份。",
        "beneficiary": "曹爽和皇帝曹芳",
        "payer": "你本人"
      }
    },
    {
      "id": "C",
      "powerId": "guarantee-action",
      "displayLabel": "确保曹爽抵达许昌",
      "label": "你指定护送曹爽和皇帝曹芳安全抵达许昌城内的行动必定成功，无人能阻止。",
      "intent": "确保曹爽能带着皇帝和调兵符节成功抵达许昌，避开司马懿的拦截。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定下一项行动必定成功",
        "target": "护送曹爽和皇帝曹芳安全抵达许昌城内的行动",
        "deadline": "日落前洛阳换防完成之前"
      },
      "instantEcho": {
        "directResult": "车队一路畅通无阻，任何拦截都莫名失效，曹爽和曹芳准时进入许昌城门。",
        "unexpectedCost": "你本人因为过度透支体力，在抵达后昏迷三日，无法参与后续谋划。",
        "beneficiary": "曹爽和皇帝曹芳",
        "payer": "你本人"
      }
    },
    {
      "id": "C",
      "powerId": "walk-through-walls",
      "displayLabel": "穿墙带曹爽入武库",
      "label": "你触碰曹爽的肩膀，带他穿过洛阳城墙和宫墙，直接进入被司马懿控制的武库内部。",
      "intent": "绕过司马懿控制的城门和街道，直接进入武库夺取武器和物资。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触碰曹爽并带他穿过墙壁",
        "target": "洛阳城墙和宫墙以进入武库",
        "deadline": "在日落前换防完成之前"
      },
      "instantEcho": {
        "directResult": "你和曹爽轻易穿过城墙和宫墙，出现在武库内部，守军目瞪口呆。",
        "unexpectedCost": "你穿过墙壁时右臂被墙体卡住片刻，造成骨折，后续行动受限。",
        "beneficiary": "曹爽",
        "payer": "你本人"
      }
    },
    {
      "id": "C",
      "powerId": "immortal-day",
      "displayLabel": "赐曹爽一日不死",
      "label": "你赐予曹爽一日不死，让他在二十四小时内无法死亡或失去意识，确保他能坚定拒绝投降。",
      "intent": "防止曹爽在决策过程中被暗杀、毒杀或受惊昏厥，让他能坚定地拒绝投降。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "赐予一日不死能力",
        "target": "曹爽",
        "deadline": "二十四小时内"
      },
      "instantEcho": {
        "directResult": "曹爽立刻感到精神一振，所有疲惫和恐惧消失，并且之后二十四小时任何伤害都无法让他死亡或昏迷。",
        "unexpectedCost": "你本人失去求生欲，在后续冲突中轻易被俘。",
        "beneficiary": "曹爽",
        "payer": "你本人"
      }
    },
    {
      "id": "C",
      "powerId": "transmute-material",
      "displayLabel": "变符节铜为朽木",
      "label": "你将曹爽手中的调兵符节从铜质永久变为腐朽的木质，让司马懿无法伪造调兵令。",
      "intent": "摧毁司马懿伪造调兵令的凭据，确保只有皇帝和曹爽手中的真实符节有效。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "改变材料",
        "target": "曹爽手中的调兵符节（铜质）",
        "deadline": "在日落前换防完成之前"
      },
      "instantEcho": {
        "directResult": "铜质符节瞬间变为腐朽的木质，重量和纹理都不同了，但合法性未知。",
        "unexpectedCost": "你因为触碰符节，手指皮肤变成木头，无法再握剑和书写命令。",
        "beneficiary": "曹爽",
        "payer": "你本人"
      }
    },
    {
      "id": "C",
      "powerId": "broadcast-thought",
      "displayLabel": "暗诏全城抗司马",
      "label": "你在黄昏时分向洛阳城内所有人脑中传送一句话：“司马懿已控制武库，但皇帝和曹爽将军已安全抵达许昌，号令天下兵马勤王。”",
      "intent": "瓦解司马懿的舆论控制，让全城军民知晓皇帝不在他手中，引发混乱或倒戈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "把一句话送进万人脑中",
        "target": "洛阳城内所有军民",
        "deadline": "黄昏时分"
      },
      "instantEcho": {
        "directResult": "全洛阳十万军民在同一瞬间脑中响起你的声音，一片哗然，许多人开始怀疑司马懿的权威。",
        "unexpectedCost": "你因为精神力过度消耗，失声三天，无法再下达口头命令。",
        "beneficiary": "曹爽和皇帝曹芳",
        "payer": "你本人"
      }
    }
  ],
  "feishui-383": [
    {
      "id": "C",
      "powerId": "share-memory",
      "displayLabel": "共享慕容垂叛乱记忆",
      "label": "你在晋军渡水前一刻钟，让苻坚、朱序、张蚝和慕容垂一起体验慕容垂在淝水之战五年后举兵叛秦的记忆，持续一分钟。",
      "intent": "让苻坚亲眼看到慕容垂的背叛，从而临时撤换后军统帅，避免后退时军心崩溃。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让在场的苻坚、朱序、张蚝和慕容垂共享一段记忆",
        "target": "苻坚、朱序、张蚝和慕容垂",
        "deadline": "晋军渡水前的一刻钟"
      },
      "instantEcho": {
        "directResult": "苻坚、朱序、张蚝和慕容垂同时目睹了慕容垂在384年举兵称燕王的场景。",
        "unexpectedCost": "慕容垂立即察觉自己已被识破，当场挥刀砍伤张蚝，试图夺马南逃。",
        "beneficiary": "晋军谢玄，因前秦后军失去统帅而无法组织撤退。",
        "payer": "苻坚的亲信张蚝被砍伤，前秦后军陷入混乱。"
      }
    },
    {
      "id": "C",
      "powerId": "door-anywhere",
      "displayLabel": "开门直送朱序回建康",
      "label": "你在晋军渡水前一刻钟，在朱序背后打开一扇通往建康皇宫议政殿的门，并告诉他秦军退阵是计，让他速去报信。",
      "intent": "利用朱序的东晋间谍身份，通过任意门让他瞬间返回东晋通报秦军真实意图，使晋军放弃渡水。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在朱序背后打开一扇通往建康皇宫的门",
        "target": "朱序",
        "deadline": "晋军渡水前的一刻钟"
      },
      "instantEcho": {
        "directResult": "朱序跨入门中，瞬间出现在建康议政殿，向司马曜和谢安转述苻坚的退阵计划。",
        "unexpectedCost": "谢安接报后怀疑朱序降秦，下令将其关押，错失利用情报的时机。",
        "beneficiary": "苻坚，门消失前目睹朱序被捕，决定暂缓退阵。",
        "payer": "朱序因擅离战场被东晋囚禁，前秦和东晋对峙持续。"
      }
    },
    {
      "id": "C",
      "powerId": "age-target",
      "displayLabel": "衰老慕容垂四十岁",
      "label": "你在晋军渡水前一刻钟，对后军统帅慕容垂使用能力，使其身体瞬间衰老四十年，失去指挥能力。",
      "intent": "瘫痪后军指挥系统，使前秦退阵时有族裔矛盾的部队得不到有效约束。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "对慕容垂使用衰老能力",
        "target": "慕容垂",
        "deadline": "晋军渡水前的一刻钟"
      },
      "instantEcho": {
        "directResult": "慕容垂从一个58岁的老将变成98岁的垂死老者，无法骑马发令。",
        "unexpectedCost": "后军鲜卑族士兵误以为汉人谋害慕容垂，当场哗变攻击前秦中军。",
        "beneficiary": "晋军谢玄，趁前秦内乱渡水突击。",
        "payer": "慕容垂的亲兵疯狂报复，苻坚不得不调兵镇压，自相残杀。"
      }
    },
    {
      "id": "C",
      "powerId": "universal-language",
      "displayLabel": "听懂并翻译部族暗语",
      "label": "你在晋军渡水前一刻钟，走到苻坚身边，用流利的鲜卑语、羌语、氐语逐一转述各部落将领私下传达的撤退信号，让苻坚明白后军实际已在叛变边缘。",
      "intent": "让苻坚通过听懂部族暗语，得知后军各将领计划在退阵时倒戈，从而取消退阵命令。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用各种部族语言翻译并传达后军将领的暗语给苻坚",
        "target": "苻坚",
        "deadline": "晋军渡水前的一刻钟"
      },
      "instantEcho": {
        "directResult": "苻坚听到朱序用汉语向晋军喊话的内容，以及慕容垂用鲜卑语下令“待退阵便倒戈”。",
        "unexpectedCost": "苻坚因过度惊恐，当场拔剑杀死一名送水的羌族小校，引发小规模骚动。",
        "beneficiary": "苻坚自己，因及时下令坚守河岸，避免了后退。",
        "payer": "羌族小校无辜被杀，其部族士兵心怀怨恨。"
      }
    },
    {
      "id": "C",
      "powerId": "intangible-walls",
      "displayLabel": "穿透淝水营垒围栏",
      "label": "你在晋军渡水前一刻钟，让淝水西岸前秦军的全部营垒围栏、拒马、栅栏变得可被无形穿过，持续一小时。",
      "intent": "消除前秦军防御工事，使晋军渡水后可直接冲击军营，迫使苻坚不敢后退。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让淝水西岸前秦营垒的墙壁、围栏、拒马失去实体",
        "target": "淝水西岸前秦军的营垒围栏",
        "deadline": "晋军渡水前的一刻钟"
      },
      "instantEcho": {
        "directResult": "前秦营地的木栅栏与拒马变得如同空气，晋军探马轻松穿透侦察。",
        "unexpectedCost": "前秦传令兵无法依托栅栏防御，被晋军斥候砍伤数人。",
        "beneficiary": "晋军谢玄，获得完整的前秦营防布局。",
        "payer": "苻坚失去防御纵深，必须立即部署骑兵，却导致阵型更乱。"
      }
    },
    {
      "id": "C",
      "powerId": "reverse-cause",
      "displayLabel": "颠倒朱序呼喊与退阵",
      "label": "你在晋军渡水前一刻钟，将“朱序大喊败了导致秦军崩溃”这一结果，变成“秦军崩溃导致朱序大喊败了”，从而使朱序的呼喊失效，秦军并未真的崩溃。",
      "intent": "消除朱序的虚假败讯对军心的打击，使前秦退阵过程保持秩序。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将朱序大喊败了与秦军崩溃的因果颠倒",
        "target": "朱序的呼喊与秦军实际崩溃的因果关系",
        "deadline": "晋军渡水前的一刻钟"
      },
      "instantEcho": {
        "directResult": "原本的历史改变：秦军退阵时并未因朱序呼喊而溃散，相反，朱序看到秦军后退才尖叫败了，但无人理睬。",
        "unexpectedCost": "苻坚因未听到败讯，继续下令后退，结果后军鲜卑部队仍按计划倒戈，但前军因不知崩溃而从容迎敌。",
        "beneficiary": "苻坚前秦军，因未发生连锁溃败，能够在淝水西岸重新列阵。",
        "payer": "朱序身份暴露，被秦军乱箭射死。"
      }
    }
  ],
  "sui-unification-589": [
    {
      "id": "C",
      "powerId": "sentence-becomes-true",
      "displayLabel": "建康江东军皆降",
      "label": "你在589年1月建康石头城外，趁陈朝元会庆典，写下‘陈朝江东水军全部倒戈隋军’并使其成真，立即瓦解长江防线。",
      "intent": "用一句话让陈朝水军倒戈，突破渡江时敌军水面力量阻拦的瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "写下一句不超过二十字的陈述并让其成为客观事实",
        "target": "陈朝江东水军",
        "deadline": "距离陈军恢复城防只剩数小时"
      },
      "instantEcho": {
        "directResult": "陈朝江东水军旗帜换成隋军旗，调转船头迎接隋军渡江。",
        "unexpectedCost": "部分陈朝水军将领当场自杀以表忠诚，导致俘虏减少。",
        "beneficiary": "隋军前锋渡江统筹官（你）",
        "payer": "陈朝江东水军忠臣"
      }
    },
    {
      "id": "C",
      "powerId": "jump-tomorrow",
      "displayLabel": "陈叔宝跳至明日",
      "label": "你在589年1月建康宫中，选择陈后主陈叔宝跳过二十四小时，直接抵达明日正月元会庆典结束后的时刻，使陈军失去最高指挥。",
      "intent": "让陈叔宝时间跳跃，消除其元会期间发布防御命令的可能。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让指定的人跳过接下来的二十四小时",
        "target": "陈后主陈叔宝",
        "deadline": "距离陈军恢复城防只剩数小时"
      },
      "instantEcho": {
        "directResult": "陈叔宝瞬间消失，皇宫混乱，无人指挥长江防线。",
        "unexpectedCost": "陈叔宝跳回后得知城破，精神崩溃，增加后续安抚难度。",
        "beneficiary": "隋军前锋渡江统筹官（你）",
        "payer": "陈后主陈叔宝"
      }
    },
    {
      "id": "C",
      "powerId": "copy-skill",
      "displayLabel": "复制贺若弼渡江技",
      "label": "你在589年1月建康城外，复制隋将贺若弼的渡江指挥技能，获得其经验，精准调度隋军渡江时机和路线。",
      "intent": "获得贺若弼的实战技能，优化渡江策略，突破时机把握和兵力调度瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制现场一人的一项知识或技能并达到同等水平",
        "target": "隋将贺若弼",
        "deadline": "距离陈军恢复城防只剩数小时"
      },
      "instantEcho": {
        "directResult": "你瞬间精通渡江指挥，立即下令全线夜渡，避开陈军防线弱点。",
        "unexpectedCost": "你因复制技能导致头痛一天，影响后续陆战指挥。",
        "beneficiary": "你（隋军前锋渡江统筹官）",
        "payer": "你（承受头痛）"
      }
    },
    {
      "id": "C",
      "powerId": "control-weather",
      "displayLabel": "雾锁大江蔽隋军",
      "label": "你在589年1月建康江边，指定未来二十四小时长江江面起浓雾，风速减弱，掩护隋军渡江。",
      "intent": "用浓雾隐藏隋军渡江行动，突破敌观察和拦截瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定方圆百公里未来二十四小时的风、雨、雪、雾与气温",
        "target": "长江江面方圆百公里",
        "deadline": "距离陈军恢复城防只剩数小时"
      },
      "instantEcho": {
        "directResult": "江面浓雾弥漫，陈朝水军视线受阻，隋军顺利渡江。",
        "unexpectedCost": "雾浓导致隋军部分船只碰撞，损失五艘小船。",
        "beneficiary": "隋军前锋渡江统筹官（你）",
        "payer": "隋军落水士兵"
      }
    },
    {
      "id": "C",
      "powerId": "see-hidden-writing",
      "displayLabel": "阅陈朝密令防反击",
      "label": "你在589年1月建康石头城，看见陈朝宫中所有隐藏文字，包括被烧毁的调兵密令和未发出的撤退计划，获得陈军布防情报。",
      "intent": "获取陈朝真实军事部署，突破情报不明瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "看见现场被擦除、烧毁、加密、遮盖或尚未写下的文字",
        "target": "建康石头城陈朝宫中的隐藏文字",
        "deadline": "距离陈军恢复城防只剩数小时"
      },
      "instantEcho": {
        "directResult": "你看到陈朝调兵密令表明其兵力分散，决定集中攻击某段江防。",
        "unexpectedCost": "你因过度解读隐藏信息，浪费半小时分析假情报。",
        "beneficiary": "你（隋军前锋渡江统筹官）",
        "payer": "你（时间浪费）"
      }
    },
    {
      "id": "C",
      "powerId": "pocket-building",
      "displayLabel": "收走建康城门楼",
      "label": "你在589年1月建康城前，将建康城主要城门楼收入口袋，使陈军无法关闭城门，隋军直接攻入。",
      "intent": "移除城门防御，突破攻城物理瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "把一座建筑连同内部全部人和物收入随身口袋",
        "target": "建康城城门楼",
        "deadline": "距离陈军恢复城防只剩数小时"
      },
      "instantEcho": {
        "directResult": "城门楼消失，隋军从缺口涌入，迅速控制建康。",
        "unexpectedCost": "口袋中的城门楼重量影响你移动，被迫弃置。",
        "beneficiary": "隋军前锋渡江统筹官（你）",
        "payer": "你（失去口袋）"
      }
    }
  ],
  "xuanwu-gate-626": [
    {
      "id": "C",
      "powerId": "stretch-road",
      "displayLabel": "拉长东宫军必经道路",
      "label": "你在李建成到达前，将东宫至玄武门的甬道拉长一百公里，使冯立、薛万彻的援军一炷香内无法抵达。",
      "intent": "拖延东宫援军，为李世民争取足够时间刺杀李建成。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "拉伸通往玄武门的东宫甬道",
        "target": "东宫至玄武门的甬道",
        "deadline": "一炷香内"
      },
      "instantEcho": {
        "directResult": "冯立等人明明看到玄武门就在前方，却狂奔一炷香仍无法接近，只能眼睁睁看着城门关闭。",
        "unexpectedCost": "城门关闭后，你发现自己也被困在城外，无法返回尉迟敬德身边报信。",
        "beneficiary": "李世民",
        "payer": "你，宫门校尉"
      }
    },
    {
      "id": "C",
      "powerId": "heal-room",
      "displayLabel": "治愈玄武门内全部伤兵",
      "label": "你在宫门激战一触即发前，让玄武门内所有带伤的将士——包括李世民身旁的尉迟敬德等——瞬间痊愈，恢复战力。",
      "intent": "确保李世民一方以最强战力迎战，弥补因内应密谋可能造成的损失。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动治愈之力",
        "target": "玄武门内所有伤病将士",
        "deadline": "激战开始前"
      },
      "instantEcho": {
        "directResult": "尉迟敬德身上多处箭伤瞬间愈合，他惊讶地握紧长槊，大喊“天助我也”。",
        "unexpectedCost": "李建成一方因无人受伤，反而更加凶猛地冲锋，战斗惨烈程度加倍。",
        "beneficiary": "秦王李世民阵营",
        "payer": "你被当作妖异，战后被高祖问罪软禁"
      }
    },
    {
      "id": "C",
      "powerId": "conjure-water",
      "displayLabel": "在玄武门内生成清泉阻断东宫援军",
      "label": "你在李建成被杀后，于东宫援军冲来的必经之门后生成一道白练瀑布，水流湍急迫使冯立、薛万彻暂时绕道。",
      "intent": "利用清水阻碍援军，为李世民控制宫城和安抚高祖赢取时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在玄武门内侧召唤清泉",
        "target": "玄武门内侧通道",
        "deadline": "李建成死后、东宫军进攻前"
      },
      "instantEcho": {
        "directResult": "一股巨大的水流从门内涌出，将冯立的先锋队冲得七零八落，不得不后退绕路。",
        "unexpectedCost": "水流也漫进了太极宫内，淹了部分议事厅，高祖大怒。",
        "beneficiary": "李世民",
        "payer": "你因毁坏宫室被降职为火头军"
      }
    },
    {
      "id": "C",
      "powerId": "read-one-mind",
      "displayLabel": "读太子建成心中谋划",
      "label": "你在李建成骑马入玄武门前一刻，探听到他脑海中所有部署——包括他其实已暗中联络了冯立三路伏兵，以及他打算入宫后直接逼宫。",
      "intent": "破解李建成的腹案，让李世民提前调整伏击位置。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "读取李建成的思想",
        "target": "太子李建成",
        "deadline": "他入门前一刹那"
      },
      "instantEcho": {
        "directResult": "你当即对李世民喊出“太子已知伏兵，东宫军正在城墙外合围”，李世民急令尉迟敬德改变阵型。",
        "unexpectedCost": "李建成察觉到你对他施术，厉声高呼“校尉是妖人”，导致部分禁军倒戈。",
        "beneficiary": "李世民",
        "payer": "你被李建成的侍卫射中左臂"
      }
    },
    {
      "id": "C",
      "powerId": "blink-self",
      "displayLabel": "带秦王瞬移至城楼",
      "label": "你带李世民瞬移到玄武门城楼之上，使他避开李元吉从后方射来的冷箭，并能居高临下指挥全局。",
      "intent": "将秦王转移到安全且视野制高点，摆脱暗箭风险。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "带秦王瞬移",
        "target": "李世民及他所持的弓箭",
        "deadline": "李元吉冷箭射出前"
      },
      "instantEcho": {
        "directResult": "你和秦王瞬间出现在城楼，李元吉的箭射空，穿透了原位置一名禁军。",
        "unexpectedCost": "你因过度消耗体力而昏厥，无法继续指挥门卫。",
        "beneficiary": "李世民",
        "payer": "你，体力透支昏迷"
      }
    },
    {
      "id": "C",
      "powerId": "summon-future-self",
      "displayLabel": "召未来宿卫老将助阵",
      "label": "你从贞观六年召来已经成为宫中宿卫将领的自己，他熟知玄武门之变后续一切细节，直接指出李建成在东宫地窖还藏有一百死士。",
      "intent": "利用未来经验揭露李建成最后的隐藏兵力，确保李世民彻底控制局势。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤十年后的自己",
        "target": "十年后你所处的同一地点",
        "deadline": "李建成死后、搜查东宫之前"
      },
      "instantEcho": {
        "directResult": "未来你突然现身，告知众人东宫地窖死士埋伏，尉迟敬德抢先围剿，避免了一场暗杀。",
        "unexpectedCost": "当前你因与未来自己相遇而意识重叠，战后记忆错乱，无法完整交代未来之事。",
        "beneficiary": "秦王势力",
        "payer": "你精神分裂，被高祖视为疯卒遣回乡里"
      }
    }
  ],
  "wu-zetian-690": [
    {
      "id": "C",
      "powerId": "repeat-minute",
      "displayLabel": "重写登基诏的分钟",
      "label": "你反复重历当前分钟，每次变换继承条款措辞，直到写出既能讨武后欢心又为李旦保留一丝法理希望的版本。",
      "intent": "用无限试错找到平衡两派的精准表述。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "重写誊录中的继承条款",
        "target": "登基诏正本中皇嗣李旦的法定继承顺位",
        "deadline": "金简送上则天门之前"
      },
      "instantEcho": {
        "directResult": "诏书里李旦的继承顺位被保留为模糊暗示。",
        "unexpectedCost": "武则天发现你涂改过多，对你起了疑心。",
        "beneficiary": "李旦",
        "payer": "你自己的仕途安全"
      }
    },
    {
      "id": "C",
      "powerId": "command-animals",
      "displayLabel": "令洛阳鸟雀齐鸣则天门",
      "label": "你向方圆十里内所有鸟类下令：在金简宣读瞬间齐声鸣叫，掩盖武氏宗族事先安排的任何异议。",
      "intent": "用自然之声压制朝堂上的反对声浪。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "向鸟类下达鸣叫的命令",
        "target": "则天门周围所有飞禽",
        "deadline": "金简宣读之时"
      },
      "instantEcho": {
        "directResult": "鸟鸣震天，任何反对呼声都无法被听到。",
        "unexpectedCost": "部分官员受惊，认为这是天变之兆。",
        "beneficiary": "武则天",
        "payer": "朝堂秩序"
      }
    },
    {
      "id": "C",
      "powerId": "rust-weapons",
      "displayLabel": "锈蚀禁军刀剑",
      "label": "你让则天门下所有金属武器瞬间锈毁，使现场无法以武力胁迫你更改诏书内容。",
      "intent": "解除武力威胁，保证你只按心中真相书写。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "启动锈蚀能力",
        "target": "则天门方圆一公里内所有金属武器",
        "deadline": "金简宣读前一刻"
      },
      "instantEcho": {
        "directResult": "禁军佩刀脱落为锈块。",
        "unexpectedCost": "部分军官认为这是妖术，开始搜捕术士。",
        "beneficiary": "你自己（书写自由）",
        "payer": "禁军装备"
      }
    },
    {
      "id": "C",
      "powerId": "guarantee-action",
      "displayLabel": "确保诏书依原样刻碑",
      "label": "你指定你亲手誊录的登基诏全文（包含李旦继承顺位）必定被刻成石碑立于太庙并无人能删改。",
      "intent": "用不可逆的碑文锁定李旦的法定继承权。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定刻碑行动必定成功",
        "target": "登基诏全文石碑",
        "deadline": "金简宣读之后"
      },
      "instantEcho": {
        "directResult": "石碑伫立太庙，文字凿凿。",
        "unexpectedCost": "武则天震怒，将你流放岭南。",
        "beneficiary": "李旦及日后李唐复辟",
        "payer": "你自己的余生"
      }
    },
    {
      "id": "C",
      "powerId": "walk-through-walls",
      "displayLabel": "穿墙送入密信给李旦",
      "label": "你穿过多道宫墙，在半小时内将一份备份诏书副本亲手交给软禁中的皇嗣李旦，让他知道自己仍有法理身份。",
      "intent": "直接给予李旦心理与法理支撑。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "穿越宫墙送信",
        "target": "李旦的寝宫",
        "deadline": "金简宣读后半个时辰内"
      },
      "instantEcho": {
        "directResult": "李旦收到了诏书副本，坚定了日后复辟的信心。",
        "unexpectedCost": "你被发现擅闯宫禁，被下狱，但未被搜出副本。",
        "beneficiary": "李旦",
        "payer": "你的自由"
      }
    },
    {
      "id": "C",
      "powerId": "immortal-day",
      "displayLabel": "赐李旦一日不死之身",
      "label": "你指定皇嗣李旦在二十四小时内无法死亡，以此阻止武氏宗族在登基当夜暗杀他。",
      "intent": "用绝对保护破除政变的暗杀环节。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定李旦为不死目标",
        "target": "皇嗣李旦",
        "deadline": "登基大典当夜"
      },
      "instantEcho": {
        "directResult": "暗杀者无论用毒、刃、火，李旦都毫发无伤。",
        "unexpectedCost": "武后认为李旦真有天命庇护，转而加速将他幽禁更深。",
        "beneficiary": "李旦",
        "payer": "李旦更严密的囚禁"
      }
    }
  ],
  "an-lushan-755": [
    {
      "id": "C",
      "powerId": "shapeshift",
      "displayLabel": "变成传旨太监",
      "label": "你变成传旨太监，在送诏驿路上掉包诏书为‘哥舒稳守潼关’，使唐玄宗催战令永远送不到。",
      "intent": "用假冒身份拦截具体诏令，避免哥舒翰被迫出战。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "变成传旨太监杨道明，在童关驿道截住信使，以蜡封私印掉换朱批诏书。",
        "target": "唐玄宗催战诏书暨传旨太监杨道明",
        "deadline": "距离长安再次发来出战诏令只剩一日"
      },
      "instantEcho": {
        "directResult": "驿卒将假诏送进帅府，哥舒翰当众宣读‘据险勿战’，三军呼声震天。",
        "unexpectedCost": "真太监杨道明次日醒来发现脸上多了道无法消除的刀疤，被同僚怀疑通敌。",
        "beneficiary": "哥舒翰",
        "payer": "传旨太监杨道明"
      }
    },
    {
      "id": "C",
      "powerId": "summon-lightning",
      "displayLabel": "雷劈催战令",
      "label": "你召下一道雷电，劈碎长安送来的第三道催战令木匣，并让火星溅到哥舒翰案上。",
      "intent": "物理销毁具体命令，使出战指令无法执行。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向帅案上檀木诏匣，引天雷正中木匣，雷火将诏书焚成灰烬。",
        "target": "唐玄宗第三道催战令木匣（位于哥舒翰帅案）",
        "deadline": "距离长安再次发来出战诏令只剩一日"
      },
      "instantEcho": {
        "directResult": "木匣炸裂，诏书成灰，火星溅到哥舒翰右袖，烧出三寸焦洞。",
        "unexpectedCost": "潼关守军误以为天罚，半数士兵跪地祈祷，夜间巡逻减员三成。",
        "beneficiary": "哥舒翰",
        "payer": "潼关守军"
      }
    },
    {
      "id": "C",
      "powerId": "share-memory",
      "displayLabel": "共享长安沦陷记忆",
      "label": "你让哥舒翰、火拔归仁、李光弼等人共享一段你亲历的‘长安失陷后玄宗在入蜀栈道上的狼狈一天’。",
      "intent": "用具体记忆使哥舒翰确信出战必亡，坚定坚守决心。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "拉住哥舒翰左手与火拔归仁右手，发动记忆共享，让军议堂内三十七人同时经历长安沦陷后玄宗与杨贵妃在马嵬驿的全程。",
        "target": "哥舒翰、火拔归仁、李光弼等三十七人",
        "deadline": "距离长安再次发来出战诏令只剩一日"
      },
      "instantEcho": {
        "directResult": "哥舒翰浑身冷汗，当众撕碎‘出战’议案；火拔归仁瘫坐不语。",
        "unexpectedCost": "记忆结束后，哥舒翰连续三天梦魇，错把亲兵当作安禄山叛军。",
        "beneficiary": "哥舒翰",
        "payer": "哥舒翰本人"
      }
    },
    {
      "id": "C",
      "powerId": "door-anywhere",
      "displayLabel": "开门直通长安御书房",
      "label": "你在帅府东墙上开一扇直通玄宗御书房的门，让哥舒翰亲自对玄宗陈述闭关理由。",
      "intent": "建立即时直接沟通通道，消除猜忌。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "以手掌按在东墙砖缝，念出咒语，墙面汽化三息，露出十步外玄宗批奏折的背影。",
        "target": "东墙（帅府议事厅）与唐玄宗御书房之间的空间",
        "deadline": "距离长安再次发来出战诏令只剩一日"
      },
      "instantEcho": {
        "directResult": "哥舒翰跨过门槛，跪在玄宗案前禀报潼关实情；玄宗搁笔听完，收回成命。",
        "unexpectedCost": "门关闭时夹碎了杨国忠递出的一封密信，碎片被风吹出窗外，三日后被御史拾获。",
        "beneficiary": "哥舒翰",
        "payer": "杨国忠"
      }
    },
    {
      "id": "C",
      "powerId": "age-target",
      "displayLabel": "老去安禄山",
      "label": "你让潜行在潼关外高岗上的安禄山瞬间老去四十年，使他无法骑马督战，叛军攻势自溃。",
      "intent": "直接摧毁敌军领袖的体能，使其无法指挥。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "瞄准潼关外五里高岗上穿金甲的安禄山，发动能力，使其身体老化四十年。",
        "target": "安禄山（潼关外高岗瞭阵者，金甲白马）",
        "deadline": "距离长安再次发来出战诏令只剩一日"
      },
      "instantEcho": {
        "directResult": "安禄山须发瞬间雪白，从马背跌落，叛军阵脚大乱，先锋崔乾佑被迫撤兵十里。",
        "unexpectedCost": "安禄山老身后记忆清晰但浑身剧痛，迁怒军医，当场斩首三人，叛军内部离心。",
        "beneficiary": "哥舒翰守军",
        "payer": "安禄山军中军医"
      }
    },
    {
      "id": "C",
      "powerId": "universal-language",
      "displayLabel": "通译契丹密语",
      "label": "你用通晓所有语言的能力，当场破译抓获的契丹斥候用突厥语加密的口供，证实叛军补给线已断。",
      "intent": "提供关键情报证据，支持不可出战。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "走向被绑的契丹斥候，以突厥语与他流利对话，再当众翻译出其供词中关于叛军粮草三日告罄的情报。",
        "target": "被俘契丹斥候（名叫阿赤蛮，从范阳押至潼关）",
        "deadline": "距离长安再次发来出战诏令只剩一日"
      },
      "instantEcho": {
        "directResult": "哥舒翰令书记官记下供词，当即向长安疾报‘贼粮罄可守’；长安暂缓出战。",
        "unexpectedCost": "契丹斥候因泄密被同伙报复，三日后在狱中被人用靴带勒死。",
        "beneficiary": "哥舒翰",
        "payer": "契丹斥候阿赤蛮"
      }
    }
  ],
  "mawei-756": [
    {
      "id": "C",
      "powerId": "infinite-grain",
      "displayLabel": "用粮食填满驿馆仓库",
      "label": "你在禁军哗变前，命令士兵将马嵬驿粮仓打开，发动无限粮食能力，让仓中容器不断涌出粟米，堆满整个仓库，以稳定军心。",
      "intent": "用充足粮食平息禁军对补给短缺的愤怒，拖延时间让玄宗护送贵妃分路离开。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "命令士兵打开驿馆粮仓，将手按在粮袋上，让它们不断涌出粟米。",
        "target": "马嵬驿粮仓",
        "deadline": "禁军冲入驿馆前"
      },
      "instantEcho": {
        "directResult": "粮仓粟米溢出，禁军士兵停止前进，争相取粮。",
        "unexpectedCost": "涌出的粟米压垮仓门，埋住三名守兵。",
        "beneficiary": "唐玄宗和杨贵妃",
        "payer": "被埋的守兵"
      }
    },
    {
      "id": "C",
      "powerId": "enlarge-object",
      "displayLabel": "放大驿馆大门挡住禁军",
      "label": "你在禁军包围驿馆时，发动放大能力，将驿馆大门等比例放大一百倍，使其结构坚固无法撞开，争取时间让玄宗与贵妃从后门撤离。",
      "intent": "用巨型大门物理阻挡禁军冲击，制造机会完成分路逃亡。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "手指驿馆大门，发动放大能力使其瞬间膨胀百倍。",
        "target": "马嵬驿大门",
        "deadline": "禁军撞门前一刻"
      },
      "instantEcho": {
        "directResult": "大门变成巨墙，禁军撞击失效。",
        "unexpectedCost": "门轴断裂，巨门倒塌压垮驿馆前廊。",
        "beneficiary": "玄宗、贵妃及随行宦官",
        "payer": "前廊下的三名士兵"
      }
    },
    {
      "id": "C",
      "powerId": "sentence-becomes-true",
      "displayLabel": "写下杨国忠谋反证据实锤",
      "label": "你在士兵哗变前，写下‘杨国忠通敌安禄山书信已查获’十二字，让它成为事实，随即取出事先伪造的信件当众宣读，引导禁军矛头指向杨国忠一人。",
      "intent": "用绝对事实塑造杨国忠为罪魁祸首，避免禁军株连杨贵妃。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在帛书上写下十二字，并高喊查获证据。",
        "target": "杨国忠",
        "deadline": "禁军拔刀前"
      },
      "instantEcho": {
        "directResult": "禁军相信杨国忠通敌，转而围攻杨国忠。",
        "unexpectedCost": "杨国忠被乱刀砍死，血溅诏书。",
        "beneficiary": "唐玄宗、杨贵妃及太子李亨",
        "payer": "杨国忠及随从"
      }
    },
    {
      "id": "C",
      "powerId": "jump-tomorrow",
      "displayLabel": "让杨贵妃跳过兵变二十四小时",
      "label": "你在禁军要求处死杨贵妃时，发动跳跃能力，指定杨贵妃跳过接下来的二十四小时，使她瞬间消失于现场，明日才出现，避开兵变风暴。",
      "intent": "让贵妃暂时消失，避免被处死，待明日局势变化再作安排。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "手指杨贵妃，发动能力让她跳跃至明日。",
        "target": "杨贵妃本人",
        "deadline": "禁军冲入驿馆逼宫时"
      },
      "instantEcho": {
        "directResult": "杨贵妃原地消失，禁军惊愕，搜索无果。",
        "unexpectedCost": "高力士因看管不力被玄宗斥责，自请处分。",
        "beneficiary": "杨贵妃",
        "payer": "高力士"
      }
    },
    {
      "id": "C",
      "powerId": "copy-skill",
      "displayLabel": "复制陈玄礼的统兵威望",
      "label": "你在禁军骚动之际，发动复制能力，完整复制陈玄礼的统兵技能与威望，然后亲自出面训话，以同样的权威命令士兵归队。",
      "intent": "快速获得禁军统帅的威信，直接控制军队，稳定兵变。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "凝视陈玄礼，复制其统兵技能与威望，随后站上台阶训话。",
        "target": "陈玄礼本人",
        "deadline": "士兵冲入驿馆前"
      },
      "instantEcho": {
        "directResult": "禁军士兵因你的命令迟疑，暂时后退。",
        "unexpectedCost": "陈玄礼感到威望被冒犯，事后与你产生嫌隙。",
        "beneficiary": "唐玄宗及随行亲信",
        "payer": "陈玄礼与你的长官关系"
      }
    },
    {
      "id": "C",
      "powerId": "control-weather",
      "displayLabel": "用大雾掩护玄宗分路",
      "label": "你在禁军围驿馆时，发动控制天气能力，让方圆百里降下浓雾，能见度不足三尺，随即掩护玄宗、贵妃及太子分三路离开，使禁军无法追踪。",
      "intent": "利用浓雾造成混乱，实现分路逃亡，避免自相残杀。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "双手合拢，指定大雾笼罩马嵬驿方圆百公里。",
        "target": "马嵬驿及周边道路",
        "deadline": "禁军完成包围前一炷香"
      },
      "instantEcho": {
        "directResult": "浓雾弥散，三人各自逃离。",
        "unexpectedCost": "部分士兵在雾中相撞受伤，引发小规模踩踏。",
        "beneficiary": "玄宗、贵妃、太子",
        "payer": "受伤的禁军士兵"
      }
    }
  ],
  "chen-bridge-960": [
    {
      "id": "C",
      "powerId": "move-mountain",
      "displayLabel": "移山阻截赵匡胤回师",
      "label": "你调用超能力，将陈桥驿西南方的黑石山整体移动到开封北郊御道正中，阻止赵匡胤黄袍加身后回师开封，确保后周朝廷安全。",
      "intent": "移山能力直接阻断赵匡胤回师路线，为后周朝廷争取时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "移动一座山到开封北郊御道正中",
        "target": "黑石山",
        "deadline": "在将士拥入寝帐不到一个时辰"
      },
      "instantEcho": {
        "directResult": "黑石山轰然出现在开封御道上，赵匡胤的军队无法通行。",
        "unexpectedCost": "山地突然移动导致附近陈桥驿房屋倒塌，数名百姓被压伤。",
        "beneficiary": "后周朝廷",
        "payer": "陈桥驿百姓"
      }
    },
    {
      "id": "C",
      "powerId": "locate-anything",
      "displayLabel": "定位赵匡胤密信",
      "label": "你立即使用超能力，定位后周幼主命人秘密送往赵匡胤的勤王诏书所在位置，以便拦截或替换。",
      "intent": "定位能力让你找到关键文件，防止赵匡胤借诏书合法化兵变。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "定位勤王诏书的位置",
        "target": "勤王诏书",
        "deadline": "在将士拥入寝帐不到一个时辰"
      },
      "instantEcho": {
        "directResult": "你看到诏书正由一名宦官骑马往陈桥驿赶来，距离还有十里。",
        "unexpectedCost": "你分神定位，没有及时劝阻赵匡胤身边激进派将领的行动。",
        "beneficiary": "后周朝廷",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "stretch-road",
      "displayLabel": "拉长陈桥驿至开封的路",
      "label": "你发动超能力，将陈桥驿通往开封的十里官道拉长成一百公里，且外界无法绕行，阻止赵匡胤部队前往开封城。",
      "intent": "拉长道路直接延缓赵匡胤回师速度，为后周朝廷部署防御争取时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "拉长陈桥驿至开封的道路",
        "target": "陈桥驿至开封官道",
        "deadline": "在将士拥入寝帐不到一个时辰"
      },
      "instantEcho": {
        "directResult": "官道瞬间变成长达一百公里的漫漫长路，赵匡胤的军队行进缓慢。",
        "unexpectedCost": "道路异常引起军中传言，说这是天意不让赵匡胤回师，反而加速了黄袍加身。",
        "beneficiary": "后周朝廷",
        "payer": "你（策略失误）"
      }
    },
    {
      "id": "C",
      "powerId": "heal-room",
      "displayLabel": "治愈寝帐内伤病将士",
      "label": "你立刻进入赵匡胤所在的寝帐，发动超能力，让帐内所有伤病将士当场痊愈，以此赢得他们的信任并拖延鼓噪行动。",
      "intent": "治愈能力制造神迹，稳定军心并争取时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "进入寝帐并发动治愈能力",
        "target": "赵匡胤寝帐内的伤病将士",
        "deadline": "在将士拥入寝帐不到一个时辰"
      },
      "instantEcho": {
        "directResult": "寝帐内五名伤病士兵伤口愈合，高烧退去，众人惊异。",
        "unexpectedCost": "赵匡胤觉得你妖言惑众，下令将你拿下。",
        "beneficiary": "伤病将士",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "conjure-water",
      "displayLabel": "在陈桥驿造清泉稳住军心",
      "label": "你在陈桥驿中心凭空生成一口持续涌出清水的泉眼，足够全军饮用一天，以此安抚因缺水而躁动的将士，延缓鼓噪。",
      "intent": "清水能力缓解军队燃眉之急，降低拥立赵匡胤的迫切性。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在陈桥驿中心生成清水泉眼",
        "target": "陈桥驿中心",
        "deadline": "在将士拥入寝帐不到一个时辰"
      },
      "instantEcho": {
        "directResult": "清泉涌出，将士们纷纷取水，暂时安静下来。",
        "unexpectedCost": "泉眼位置正好在赵匡胤寝帐门口，水流淹没了帐内地面，导致赵匡胤被迫移帐。",
        "beneficiary": "全体军队",
        "payer": "赵匡胤"
      }
    },
    {
      "id": "C",
      "powerId": "read-one-mind",
      "displayLabel": "读取赵匡胤真实想法",
      "label": "你当面看着赵匡胤的眼睛发动超能力，持续十分钟读取他此刻全部真实想法与回忆画面，看清他是否真的愿意被黄袍加身。",
      "intent": "读心能力让你掌握赵匡胤真实意图，决定下一步行动。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "读取赵匡胤的思想",
        "target": "赵匡胤",
        "deadline": "在将士拥入寝帐不到一个时辰"
      },
      "instantEcho": {
        "directResult": "你看到赵匡胤心中并不想谋反，而是被激进将领裹挟，他回忆着与后周世宗的约定。",
        "unexpectedCost": "你因极度震惊而失态，被赵匡胤察觉，他决定抢先控制局势。",
        "beneficiary": "你（获得情报）",
        "payer": "你（暴露自己）"
      }
    }
  ],
  "chanyuan-1004": [
    {
      "id": "C",
      "powerId": "erase-memory",
      "displayLabel": "删除萧挞凛战死记忆",
      "label": "我在辽使入营前删除辽军统帅萧挞凛被射杀的全部记忆，让辽使以为主帅尚在督战。",
      "intent": "通过删除辽方核心记忆，瓦解其因主帅阵亡而产生的速战意图，为和谈争取主动权。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "永久删除",
        "target": "辽使关于萧挞凛被射杀的全部记忆",
        "deadline": "距离辽使再次入营只剩两个时辰"
      },
      "instantEcho": {
        "directResult": "辽使入营后神情镇定，只按原议要求岁币数额，未提任何报复性条件。",
        "unexpectedCost": "你因过度专注而精神恍惚，被真宗察觉异样但未深究。",
        "beneficiary": "宋真宗",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "swap-two-people",
      "displayLabel": "交换辽使和宋间谍位置",
      "label": "我在谈判席前瞬间交换辽使与一名潜伏辽营的宋间谍位置，把间谍送入辽营核心。",
      "intent": "利用位置交换将己方间谍植入敌营，在谈判同时获取辽方底线情报。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "交换位置和随身物品",
        "target": "辽使与潜伏在澶州城内的宋间谍张成",
        "deadline": "辽使踏入营帐前一瞬间"
      },
      "instantEcho": {
        "directResult": "辽使突然出现在城内密室，而张成带着辽使信物走进辽营，无人怀疑。",
        "unexpectedCost": "辽使在密室大声呼救，引来守军盘查，你需临时编造理由。",
        "beneficiary": "张成",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "repeat-minute",
      "displayLabel": "重复宣读条款一分钟",
      "label": "我在辽使面前宣读‘岁币三十万、开榷场’这一条款时，反复重复这一分钟直到辽使主动改口同意。",
      "intent": "通过时间循环制造心理压迫，迫使辽使在重复中降低要求。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "反复重复宣读条款的一分钟",
        "target": "辽使与谈判现场",
        "deadline": "真宗示意停议前"
      },
      "instantEcho": {
        "directResult": "辽使在第七十七次重复时突然拍案喊停，同意原条款，但要求额外加一千匹绢。",
        "unexpectedCost": "真宗因你重复宣读而头晕，命令你退下休息片刻。",
        "beneficiary": "宋真宗",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "command-animals",
      "displayLabel": "令澶州鼠群啃食辽军粮草",
      "label": "我向澶州方圆十公里内所有老鼠下令，让它们集体啃咬辽军储存在城外大营的粮草麻袋。",
      "intent": "通过动物破坏后勤，削弱辽军补给能力，迫使其在谈判中提前让步。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "号令所有老鼠",
        "target": "辽军城外大营的粮草",
        "deadline": "次日清晨辽军开饭前"
      },
      "instantEcho": {
        "directResult": "黎明时辽军发现半数粮袋被咬破，米麦撒了一地，士气受挫。",
        "unexpectedCost": "鼠群也啃坏了澶州城内几处官仓，造成部分损失。",
        "beneficiary": "宋前线将士",
        "payer": "澶州仓曹"
      }
    },
    {
      "id": "C",
      "powerId": "rust-weapons",
      "displayLabel": "锈毁辽军刀剑与箭头",
      "label": "我在辽使进帐前夕锈毁方圆一公里内所有辽军配备的金属武器与弓箭箭头，使其武装失效。",
      "intent": "通过解除敌军武装，在谈判前形成绝对威慑，使辽方不敢轻启战端。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "锈毁所有金属武器",
        "target": "辽军在澶州城外的刀、剑、枪头、箭头",
        "deadline": "辽使入营谈判前一刻"
      },
      "instantEcho": {
        "directResult": "辽军哨兵发现刀身布满锈迹，箭镞一折即断，大营出现骚动。",
        "unexpectedCost": "你随身携带的官印铜钮也同步锈蚀，无法当场钤印。",
        "beneficiary": "宋真宗",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "guarantee-action",
      "displayLabel": "保证盖章生效不被阻挠",
      "label": "我保证自己亲手在盟约上钤印的举动必定成功，且真宗、辽使、百官均无法阻止。",
      "intent": "通过绝对担保跨越所有签字环节的人为障碍，直接促成盟约法律生效。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "亲手在盟约文书上钤盖宋朝国玺",
        "target": "澶渊之盟最终条款卷轴",
        "deadline": "真宗尚未加盖玉玺前"
      },
      "instantEcho": {
        "directResult": "玉玺落在绢帛上，印文清晰，辽使当场确认盟约成立，再无反悔余地。",
        "unexpectedCost": "你因用力过猛，左手腕脱臼，后续数日无法执笔。",
        "beneficiary": "宋真宗与辽圣宗",
        "payer": "你"
      }
    }
  ],
  "wang-anshi-1069": [
    {
      "id": "C",
      "powerId": "transfer-cost",
      "displayLabel": "吕惠卿承担试错代价",
      "label": "你把首批青苗法试行失败的全部后果转移给吕惠卿，包括御史弹劾与神宗降罪。",
      "intent": "让支持全面推行的吕惠卿承受风险，迫使他在决策时更审慎。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指认吕惠卿为代价承担者并发动转移",
        "target": "吕惠卿",
        "deadline": "首批诏令将在今夜送往各路转运司"
      },
      "instantEcho": {
        "directResult": "青苗法试行失败时，吕惠卿被降职查办，而非你受罚。",
        "unexpectedCost": "吕惠卿从此与你结仇，日后在朝堂上处处阻挠你。",
        "beneficiary": "你",
        "payer": "吕惠卿"
      }
    },
    {
      "id": "C",
      "powerId": "rewind-hour",
      "displayLabel": "重审开封府尹的奏章",
      "label": "退回诏令签发前一小时",
      "intent": "争取时间修改诏书中的强制条款。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "启动时间倒流回到一小时前的制置三司条例司",
        "target": "制置三司条例司",
        "deadline": "首批诏令将在今夜送往各路转运司"
      },
      "instantEcho": {
        "directResult": "诏书未发，你有了一小时重新审议。",
        "unexpectedCost": "你因擅改时间遭到枢密院调查。",
        "beneficiary": "你",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "shapeshift",
      "displayLabel": "变作曾布签批缓行令",
      "label": "你变成曾布的模样，用他的笔迹和印章签发缓行文书，阻止全面推行。",
      "intent": "以副使身份合法拖延诏令，避免正面冲突。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "变作曾布并签批缓行令",
        "target": "曾布",
        "deadline": "首批诏令将在今夜送往各路转运司"
      },
      "instantEcho": {
        "directResult": "诏令被暂缓，各地转运司收到缓行通知。",
        "unexpectedCost": "曾布发现后弹劾你伪造官文书。",
        "beneficiary": "你以及五个试点州的百姓",
        "payer": "你因伪造文书被降职"
      }
    },
    {
      "id": "C",
      "powerId": "summon-lightning",
      "displayLabel": "雷击开封府门前木桩",
      "label": "你召唤雷电击中开封府门前竖立的新法告示木桩，将其化为焦炭。",
      "intent": "用天象威慑守旧派，营造天意反对全面推行的氛围。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤雷电击毁告示木桩",
        "target": "开封府门前的告示木桩",
        "deadline": "首批诏令将在今夜送往各路转运司"
      },
      "instantEcho": {
        "directResult": "木桩焚毁，坊间传言天怒。",
        "unexpectedCost": "神宗召你质问是否利用妖术干政。",
        "beneficiary": "反对全面推行的保守派",
        "payer": "你被神宗怀疑，失去部分信任"
      }
    },
    {
      "id": "C",
      "powerId": "share-memory",
      "displayLabel": "共享青苗贷款纠纷记忆",
      "label": "你让制置三司条例司全体官员第一视角体验你去年在河北目睹的强制摊派惨状。",
      "intent": "用真实记忆说服同僚试行而非全面推行。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "分享记忆给全体在场官员",
        "target": "制置三司条例司全体官员",
        "deadline": "首批诏令将在今夜送往各路转运司"
      },
      "instantEcho": {
        "directResult": "多数官员面露震惊，支持先试行。",
        "unexpectedCost": "吕惠卿斥责你散布危言。",
        "beneficiary": "受强制摊派之苦的农民",
        "payer": "你被吕惠卿一派记恨"
      }
    },
    {
      "id": "C",
      "powerId": "door-anywhere",
      "displayLabel": "开一扇通往神宗寝宫的门",
      "label": "你在制置三司条例司墙上开一扇直通神宗寝宫的门，持奏章当面陈情。",
      "intent": "打破官僚层级，直接说服皇帝先行试点。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "打开通往神宗寝宫的门",
        "target": "神宗寝宫",
        "deadline": "首批诏令将在今夜送往各路转运司"
      },
      "instantEcho": {
        "directResult": "你直接面圣，神宗同意先试行五州。",
        "unexpectedCost": "你因擅闯禁宫被侍卫扣押，虽然后来获释。",
        "beneficiary": "五个试点州的农户",
        "payer": "你承受宫规惩罚"
      }
    }
  ],
  "jingkang-1127": [
    {
      "id": "C",
      "powerId": "duplicate-place",
      "displayLabel": "复制宣德门城楼",
      "label": "你在汴京宣德门前空地复制一座完全相同的城楼，包括其砖石、城门及库存兵器，并命令旧部迅速占据它作为假指挥所，诱使金军斥候误判防御重点。",
      "intent": "用假城楼迷惑金军，拖延其攻城决策，为城内组织抵抗争取时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在宣德门前空地激活复制，生产第二座城楼",
        "target": "宣德门城楼",
        "deadline": "金军要求宋帝出城议和前的最后一夜"
      },
      "instantEcho": {
        "directResult": "一座与宣德门完全相同的城楼在不足百步外陡然拔地而起，顶部旗帜猎猎。",
        "unexpectedCost": "复制时地面剧烈震动，惊动了附近巡逻的金军小队，导致他们提前举火查探。",
        "beneficiary": "李纲旧部",
        "payer": "宣德门外的平民住宅区因地面沉降出现裂缝"
      }
    },
    {
      "id": "C",
      "powerId": "revive-dead",
      "displayLabel": "复活种师道",
      "label": "你在旧将范琼面前复活了已故西北名将种师道，让他以生前的威严与经验，在宣德门广场当众宣布金军不可信、主和派误国，并要求军民立即接管城防。",
      "intent": "用种师道的威望扭转主和派气势，激发军民死守意志。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在范琼面前召唤已故的种师道复活",
        "target": "种师道",
        "deadline": "金军要求宋帝出城议和前的最后一夜"
      },
      "instantEcho": {
        "directResult": "种师道从一片蓝光中现身，盔甲完整，目光如电，当即令范琼等人跪拜。",
        "unexpectedCost": "种师道复活的消息被主和派间谍快马送出城外，金军加紧强攻西水门。",
        "beneficiary": "城内主战军民",
        "payer": "种师道本人——他深知自己只有一小时，被迫以极限速度调度"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-grain",
      "displayLabel": "注满汴京粮仓",
      "label": "你冲进开封府后院的官仓，将手按在唯一一只空米斛上，下令它不断涌出粟米，并命令守仓吏员立即开仓放粮，让全城军民每人领走三斗口粮，以示守城绝不缺粮。",
      "intent": "用无限粮食消除城内因缺粮可能引发的哗变和投降情绪。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "按在空米斛上，激活无限粮食生成",
        "target": "开封府后院的官用米斛",
        "deadline": "金军要求宋帝出城议和前的最后一夜"
      },
      "instantEcho": {
        "directResult": "米斛口喷出滚滚粟米，瞬间填满周围十袋麻袋，甚至溢到地上。",
        "unexpectedCost": "粟米涌出时产生大量粉尘，引发邻近粮仓老鼠暴动，啃坏了十张弓弦。",
        "beneficiary": "全城数万军民",
        "payer": "开封府粮仓的鼠患大增，后续需要额外灭鼠"
      }
    },
    {
      "id": "C",
      "powerId": "enlarge-object",
      "displayLabel": "放大砲具一百倍",
      "label": "你找到城头一门废弃的铁制九牛砲，亲自将手按在砲身上，使其瞬间放大百倍，成为一座高达十丈的巨型投石机，并命令砲手向金军大营抛射火油罐。",
      "intent": "用巨型砲具摧毁金军攻城器械和士气，制造战场转折点。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "按在废弃九牛砲上，启动放大",
        "target": "城南墙角的废弃九牛砲",
        "deadline": "金军要求宋帝出城议和前的最后一夜"
      },
      "instantEcho": {
        "directResult": "九牛砲膨胀百倍，砲身铮亮如新，一砲将百斤火油罐抛入金军前营。",
        "unexpectedCost": "放大时砲身压垮了城堞，一段城墙出现裂缝，需连夜填补。",
        "beneficiary": "城头砲手和守军",
        "payer": "被压塌城堞的守城士兵，三人轻伤"
      }
    },
    {
      "id": "C",
      "powerId": "sentence-becomes-true",
      "displayLabel": "写下议和者死",
      "label": "你在皇榜上写下‘凡今日提议开城议和者，其家族三代不得为官’，并命人张贴于宣德门外，使这句咒文立刻成为大宋律令，让所有主和派大臣闭嘴。",
      "intent": "用不可撤销的咒文消除主和派的政治可能性。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在空白皇榜上写下指定文字并张贴",
        "target": "宣德门外告示栏上的空白皇榜",
        "deadline": "金军要求宋帝出城议和前的最后一夜"
      },
      "instantEcho": {
        "directResult": "皇榜上的朱字自行发光，宰相李邦彦的奏章在半空自焚。",
        "unexpectedCost": "咒文效力也波及了此前曾建议割地的武将，导致三名中级军官夜间出逃投金。",
        "beneficiary": "主战派官员",
        "payer": "曾主张议和的耿南仲，其子次日考试资格被取消"
      }
    },
    {
      "id": "C",
      "powerId": "jump-tomorrow",
      "displayLabel": "令李纲明日复活",
      "label": "你找到李纲被贬前的副将陈淬，抓住他的手臂发动跳跃，让他瞬间抵达明天此时，亲眼看到城破人亡的结局，再让他返回今夜报告，以此粉碎所有幻想。",
      "intent": "用未来证据说服犹豫不决的守军和百姓死战到底。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "抓住陈淬的手臂发动时间跳跃",
        "target": "陈淬",
        "deadline": "金军要求宋帝出城议和前的最后一夜"
      },
      "instantEcho": {
        "directResult": "陈淬消失片刻后返回，浑身发抖，高喊‘我们输定了，除非现在就反击！’",
        "unexpectedCost": "跳跃消耗了陈淬的阳气，他咳嗽血来，但仍在传话。",
        "beneficiary": "陈淬及听其传话的士兵",
        "payer": "陈淬本人——寿命折损数月，脸色蜡黄"
      }
    }
  ],
  "yue-fei-1140": [
    {
      "id": "C",
      "powerId": "borrow-tomorrow-memory",
      "displayLabel": "借明日记忆确认班师结局",
      "label": "你发动借来明日记忆，提前看到自己明天此刻正在被迫宣读班师诏书，岳家军士气崩溃。你立即决定暂压金牌，并伪造一份敌军调动情报争取时间。",
      "intent": "通过预知未来规避十二道金牌的致命后果，为岳飞争取三天北进时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动借来明日记忆，观看明天此刻的记忆",
        "target": "岳飞与郾城军营全体将校",
        "deadline": "下一道班师诏书抵达前"
      },
      "instantEcho": {
        "directResult": "你看到明天全班师场景，立即伪造金牌延误令，岳家军继续北进。",
        "unexpectedCost": "你因抗旨被朝廷密探记录在案，三日后被捕。",
        "beneficiary": "岳飞与岳家军",
        "payer": "你本人"
      }
    },
    {
      "id": "C",
      "powerId": "summon-giant-beast",
      "displayLabel": "召巨兽摧毁金牌驿站",
      "label": "你对郾城东二十里的金牌驿站发动召唤一只百米高巨兽，命令它踏平驿站并吞没所有诏书和马匹，阻止班师令送达。",
      "intent": "用怪力截断朝廷与前线的通信，为岳飞争取战略时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤一只百米高巨兽并下命令",
        "target": "郾城东二十里的金牌驿站",
        "deadline": "下一道班师诏书送达前"
      },
      "instantEcho": {
        "directResult": "巨兽瞬间踏平驿站，所有金牌和诏书被毁。",
        "unexpectedCost": "巨兽失控，踩死周边三个村庄的百姓，民怨沸腾。",
        "beneficiary": "岳家军将领岳飞",
        "payer": "无辜平民"
      }
    },
    {
      "id": "C",
      "powerId": "move-mountain",
      "displayLabel": "移山堵塞黄河渡口",
      "label": "你发动移动一座山，将嵩山北麓一座千米高峰整体移至黄河孟津渡口，堵塞金军可能的撤离路线，迫使金军回援，朝廷议和中断。",
      "intent": "用地理巨变改变宋金战局，使班师令失去意义。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "移动视野内一座山至指定位置",
        "target": "黄河孟津渡口",
        "deadline": "朝廷议和条款签署前"
      },
      "instantEcho": {
        "directResult": "大山横亘渡口，金军主力无法北撤，郾城大捷转为歼灭战。",
        "unexpectedCost": "山体崩落砸毁沿岸农田，数万民众流离失所。",
        "beneficiary": "岳家军与宋高宗",
        "payer": "黄河沿岸百姓"
      }
    },
    {
      "id": "C",
      "powerId": "locate-anything",
      "displayLabel": "定位秦桧密信藏匿处",
      "label": "你发动定位任何人或物，立即得知秦桧与金兀术秘密和谈的亲笔信就藏在临安相府西厢房暗格中。你连夜派人盗取，以此要挟朝廷停止班师。",
      "intent": "用物证揭露议和阴谋，迫使朝廷收回班师令。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "定位秦桧与金兀术秘密和谈的亲笔信",
        "target": "秦桧的密信",
        "deadline": "下一道班师诏书抵达前"
      },
      "instantEcho": {
        "directResult": "你获得密信内容，派兵送抵临安，秦桧被迫暂缓班师。",
        "unexpectedCost": "岳飞因牵连谋反被提前下狱。",
        "beneficiary": "抗金前线将士",
        "payer": "岳飞"
      }
    },
    {
      "id": "C",
      "powerId": "stretch-road",
      "displayLabel": "拉长临安至郾城驿道",
      "label": "你对郾城通往临安的驿道发动拉长一段道路，将最后一百里驿道拉长至一百公里，且外界无法绕行。朝廷信使多花三天才能抵达，为岳家军争取北进时间。",
      "intent": "物理延迟班师诏书的传递速度，制造战略窗口。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "拉长驿道最后一百里至一百公里",
        "target": "郾城通往临安的驿道",
        "deadline": "下一道班师诏书送达前"
      },
      "instantEcho": {
        "directResult": "驿道变长，信使需三日才能到达，岳家军趁机北进收复两城。",
        "unexpectedCost": "沿途百姓迷失，大量商旅失踪。",
        "beneficiary": "岳家军先锋部队",
        "payer": "沿途驿站人员和百姓"
      }
    },
    {
      "id": "C",
      "powerId": "heal-room",
      "displayLabel": "治愈病床上的张宪",
      "label": "你发动治愈全场伤病，立即治好了因瘟疫卧床的副将张宪及军营中所有病号。张宪康复后亲率五千精骑夜袭金营，取得郾城第二捷。",
      "intent": "恢复岳家军核心战力，以胜局迫使朝廷放弃议和。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "治愈中军大帐内所有伤病员",
        "target": "副将张宪及岳家军病号",
        "deadline": "下一道班师诏书抵达前"
      },
      "instantEcho": {
        "directResult": "张宪等全部康复，夜袭金营大胜，金兀术退守开封。",
        "unexpectedCost": "痊愈后的士兵因急于求战，不听岳飞节制，擅自追击导致小挫。",
        "beneficiary": "张宪与岳家军主力",
        "payer": "被擅自追击打乱部署的斥候队"
      }
    }
  ],
  "diaoyu-1259": [
    {
      "id": "C",
      "powerId": "clone-self",
      "displayLabel": "百个王坚分身投石",
      "label": "你复制出一百个自己，每个都拥有你的投石记忆，命令他们同时拉动机索，将巨石抛向蒙哥所在高地。",
      "intent": "用分身同时操作投石机，瞬间形成密集打击，突破蒙军遮蔽的时效窗口。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制一百个自己并命令他们拉动机索发射巨石",
        "target": "蒙哥汗所在的高地",
        "deadline": "蒙古护卫搭起遮蔽之前"
      },
      "instantEcho": {
        "directResult": "一百块巨石同时飞向高地，蒙哥汗被击中当场身亡。",
        "unexpectedCost": "你的真身因过度劳累昏迷一日，分身消失后投石机无人操作。",
        "beneficiary": "守将王坚",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "extinguish-fire",
      "displayLabel": "熄灭蒙古营火十里",
      "label": "你熄灭钓鱼城方圆十里内所有火焰，包括蒙军炊火、篝火、火把，令其陷入黑暗与混乱。",
      "intent": "剥夺蒙军照明与信号，使其无法在夜间组织对高地的遮蔽掩护。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动能力熄灭方圆十里内所有火焰",
        "target": "钓鱼城周围蒙古军营的所有火源",
        "deadline": "蒙哥汗巡视前沿的几分钟内"
      },
      "instantEcho": {
        "directResult": "蒙古营地一片漆黑，蒙哥汗的护卫无法快速搭建遮蔽，其位置暴露。",
        "unexpectedCost": "城内也陷入黑暗，守军短暂混乱，你被误认为奸细遭扣押半日。",
        "beneficiary": "王坚的投石机部队",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "erase-memory",
      "displayLabel": "删除蒙哥撤退命令",
      "label": "你永久删除蒙哥汗关于‘立即撤退’的记忆，使他坚持留在高地观察前线。",
      "intent": "阻止蒙哥因危险而撤离，确保其停留在投石机射程内。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "删除蒙哥汗对‘立即撤退’命令的记忆",
        "target": "蒙哥汗",
        "deadline": "蒙古护卫搭起遮蔽之前"
      },
      "instantEcho": {
        "directResult": "蒙哥汗忘记撤退打算，继续在高地指挥，被投石机命中。",
        "unexpectedCost": "你因精神透支头晕目眩，数日内无法清晰思考。",
        "beneficiary": "王坚",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "swap-two-people",
      "displayLabel": "交换蒙哥与护卫位置",
      "label": "你在一瞬间将蒙哥汗与其贴身护卫的位置互换，使护卫暴露而蒙哥落入你的投石机射程。",
      "intent": "将蒙哥从有遮蔽的高地直接交换到无遮蔽的开阔地，实现精准打击。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "交换蒙哥汗与一名护卫的位置",
        "target": "蒙哥汗和其贴身护卫",
        "deadline": "当前瞬间"
      },
      "instantEcho": {
        "directResult": "蒙哥汗出现在开阔地，你的投石机立即将其击杀。",
        "unexpectedCost": "护卫被换到高地，愤怒的蒙古人随即处决该护卫。",
        "beneficiary": "钓鱼城守军",
        "payer": "那名护卫"
      }
    },
    {
      "id": "C",
      "powerId": "repeat-minute",
      "displayLabel": "重覆蒙哥巡视那分钟",
      "label": "你让蒙哥汗亲自巡视前沿的这一分钟反复发生，直到你成功调整投石机角度击中其所在位置。",
      "intent": "通过时间重复获得无限瞄准机会，克服一次性的精度不足。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "重复当前时间直到投石机命中蒙哥",
        "target": "蒙哥汗巡视的这一分钟",
        "deadline": "第六次重复后"
      },
      "instantEcho": {
        "directResult": "第三次重覆时你校准角度，巨石击中蒙哥汗。",
        "unexpectedCost": "重复期间你的身体迅速老化，发须全白。",
        "beneficiary": "王坚",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "command-animals",
      "displayLabel": "号令山鹰啄瞎蒙哥",
      "label": "你号令钓鱼城方圆十公里内所有山鹰，命令它们扑向蒙哥汗啄瞎其双目，使其丧失指挥能力。",
      "intent": "用动物攻击制造混乱，阻止蒙哥观察并下令搭起遮蔽。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "命令所有山鹰攻击蒙哥汗的眼睛",
        "target": "蒙哥汗",
        "deadline": "蒙哥汗下令搭起遮蔽之前"
      },
      "instantEcho": {
        "directResult": "千百只山鹰俯冲啄瞎蒙哥汗双眼，蒙军大乱。",
        "unexpectedCost": "山鹰随后攻击城内守军，造成十余人受伤。",
        "beneficiary": "投石机部队",
        "payer": "受伤的守军"
      }
    }
  ],
  "xiangyang-1273": [
    {
      "id": "C",
      "powerId": "infinite-money",
      "displayLabel": "犒赏元军水师都统张弘范",
      "label": "你登上旗舰取出无限金银，向张弘范船队抛洒，令其水兵争抢财宝而放弃封锁航线，然后你的运粮船趁机冲入襄阳。",
      "intent": "用金钱腐蚀元军封锁线的指挥官，暂时瓦解其拦截意志。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "登上旗舰，取出无限金银向张弘范船队抛洒",
        "target": "元军水师都统张弘范及其船队",
        "deadline": "元军回回炮将在天亮后再次轰击樊城"
      },
      "instantEcho": {
        "directResult": "元军水兵争抢财宝，封锁线出现缺口，你的运粮船成功冲入襄阳。",
        "unexpectedCost": "张弘范事后以惑乱军心为由处决了数名争抢的金兵，并加强了后续封锁。",
        "beneficiary": "襄阳守军与城中百姓",
        "payer": "被处决的元军金兵"
      }
    },
    {
      "id": "C",
      "powerId": "shrink-object",
      "displayLabel": "缩小回回炮巨石为卵石",
      "label": "你趁夜潜入元军回回炮阵地，将堆放在炮位的巨石缩小为卵石，使其无法杀伤城防，从而为襄阳争取一夜喘息。",
      "intent": "让元军主力攻城武器失效，阻断破城进程。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "潜入元军回回炮阵地，将巨石缩小为卵石",
        "target": "元军回回炮位的巨石堆",
        "deadline": "元军回回炮将在天亮后再次轰击樊城"
      },
      "instantEcho": {
        "directResult": "元军天亮后用回回炮发射卵石，仅对城墙造成轻微损伤。",
        "unexpectedCost": "一名负责搬运巨石的元军士兵因石头突然变轻而摔倒，被指挥官以失职罪斩首。",
        "beneficiary": "襄阳城防与城内将士",
        "payer": "那名被斩首的元军士兵"
      }
    },
    {
      "id": "C",
      "powerId": "transfer-cost",
      "displayLabel": "将沉船代价转给吕文焕",
      "label": "你决定牺牲主舰撞开元军封锁，并将沉没的代价转移给襄阳守将吕文焕，让他承担船只和物资的损耗，而你的舰队完好无损。",
      "intent": "无偿使用主力舰完成自毁式撞击，不减损己方实力。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "下令主舰撞击元军封锁舰，同时将沉没代价转移给吕文焕",
        "target": "己方主舰与元军封锁舰",
        "deadline": "元军回回炮将在天亮后再次轰击樊城"
      },
      "instantEcho": {
        "directResult": "主舰成功撞开封锁舰，补给船队冲入襄阳，而你的舰队未损失任何船只。",
        "unexpectedCost": "吕文焕发现自己名下莫名其妙少了物资，怀疑你中饱私囊，战后对你心生怨恨。",
        "beneficiary": "你的突围船队与襄阳守军",
        "payer": "襄阳守将吕文焕"
      }
    },
    {
      "id": "C",
      "powerId": "rewind-hour",
      "displayLabel": "倒回一小时前重发撤军令",
      "label": "你发现元军回回炮已瞄准你的补给船队，于是发动能力将时间倒回一小时，你重新下令船队改变航线，避开炮击区域。",
      "intent": "逆转一次致命的伏击，让船队安全入城。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动时间倒回，重新下令船队改变航线",
        "target": "己方补给船队与元军回回炮阵地",
        "deadline": "元军回回炮将在天亮后再次轰击樊城"
      },
      "instantEcho": {
        "directResult": "倒回后，船队按新航线避开回回炮轰击，安全进入襄阳。",
        "unexpectedCost": "你保留记忆，但其他船兵感到莫名疑惑，士气略有下降。",
        "beneficiary": "你本人及补给船队",
        "payer": "船队士兵的心理稳定"
      }
    },
    {
      "id": "C",
      "powerId": "shapeshift",
      "displayLabel": "变成吕文德伪传撤防令",
      "label": "你变成吕文德（吕文焕之兄）的样貌，潜入元军大营向张弘范伪传临安密令：要求元军暂缓攻势三天，从而为襄阳争取时间修复城防。",
      "intent": "利用敌方信任的宋将身份下达虚假命令，延缓进攻。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "变作吕文德潜入元营，伪传临安密令",
        "target": "元军水师都统张弘范",
        "deadline": "元军回回炮将在天亮后再次轰击樊城"
      },
      "instantEcho": {
        "directResult": "张弘范相信了密令，下令暂停进攻三天，襄阳获得喘息。",
        "unexpectedCost": "三天后元军发现被骗，张弘范将怒火发泄在吕文德身上，率军突袭吕文德驻地。",
        "beneficiary": "襄阳守军与吕文焕",
        "payer": "吕文德及其驻地军队"
      }
    },
    {
      "id": "C",
      "powerId": "summon-lightning",
      "displayLabel": "雷击烧毁元军回回炮",
      "label": "你指向元军回回炮阵地，召唤一道雷电精确击中炮架，瞬间引燃火药和木制结构，摧毁了元军的主力攻城器械。",
      "intent": "直接消灭威胁最大的攻城武器，扭转城防劣势。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤雷电击中回回炮阵地",
        "target": "元军回回炮及操作士兵",
        "deadline": "元军回回炮将在天亮后再次轰击樊城"
      },
      "instantEcho": {
        "directResult": "回回炮被雷电击中，引发大火并爆炸，阵地化为废墟。",
        "unexpectedCost": "爆炸波及附近营帐，导致元军数十人伤亡，也引发了敌军搜捕奸细的行动。",
        "beneficiary": "襄阳城墙与守军",
        "payer": "被波及的元军士兵"
      }
    }
  ],
  "yamen-1279": [
    {
      "id": "C",
      "powerId": "split-river",
      "displayLabel": "分开崖山海面为陆秀夫开道",
      "label": "你必须在元军总攻前，亲自跳入海中发动能力，让崖山海面从正中分开，露出干燥海床，使幼帝赵昺的船队能从海床直接逃向外海。",
      "intent": "用海床通道直接破解元军封锁，为幼帝争取唯一生路。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "跳入海中，双手向两侧推开海水",
        "target": "崖山海面，张世杰舰队与陆秀夫船只之间的海域",
        "deadline": "元军潮落总攻前"
      },
      "instantEcho": {
        "directResult": "海面裂开一道宽五十丈、直通外海的通道，海水如墙般立在两侧。",
        "unexpectedCost": "元军趁势从两侧缺口放箭，你右肩中矢，血流不止。",
        "beneficiary": "幼帝赵昺的坐船",
        "payer": "你（张世杰的解索军官）"
      }
    },
    {
      "id": "C",
      "powerId": "speak-any-distance",
      "displayLabel": "喝令张世杰立刻解索分散舰队",
      "label": "你必须在元军总攻前，亲自对舰队统帅张世杰发动能力，让他清楚听见你的声音，并当众厉声下令：“解索！各船分散突围！”",
      "intent": "用直接通话绕过层层指挥链，让张世杰亲口改变固守阵型。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "对准张世杰的方向，深吸一口气，用全力喊出命令",
        "target": "张世杰（宋朝舰队统帅）",
        "deadline": "元军潮落总攻前"
      },
      "instantEcho": {
        "directResult": "张世杰在旗舰上猛然回头，立即传令各船斩断绳索，舰队开始分散。",
        "unexpectedCost": "元军主帅张弘范意识到有人越权指挥，下令神箭手持强弩瞄准你所在船只。",
        "beneficiary": "全部三十万宋军将士",
        "payer": "你（越级喊话的军官）"
      }
    },
    {
      "id": "C",
      "powerId": "duplicate-place",
      "displayLabel": "复制都统船上印信文书殿",
      "label": "你必须在潮涨前，登上张世杰的都统船，发动能力复制一间装满所有舰队号令印信、航行海图的船舱，并将原件抛入海中让元军误判。",
      "intent": "用假命令舱诱使元军追错方向，为主力突围制造混乱。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将都统船上的号令舱木板划伤标记，然后双手按住舱壁发动复制",
        "target": "张世杰都统船上的号令舱（内有印信、海图与将令）",
        "deadline": "潮涨前"
      },
      "instantEcho": {
        "directResult": "旁边空船表面浮现出一模一样的号令舱，所有文书印信清晰可见。",
        "unexpectedCost": "原件抛出时被浪卷到张世杰脚下，他发现了你的计策，将你认定为叛徒。",
        "beneficiary": "宋军分散后的小船队",
        "payer": "你（被统帅怀疑的军官）"
      }
    },
    {
      "id": "C",
      "powerId": "revive-dead",
      "displayLabel": "复活战死的陈文龙督战",
      "label": "你必须在元军总攻前，找到三日前战死的另一位统制陈文龙的尸体，发动能力让他复活，并令他代替张世杰指挥舰队。",
      "intent": "用已在军民心中威望极高的死者取而代之，安抚军心并破解张世杰的固守死令。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "跪在陈文龙尸身前，将右手放在他额上，唤其名",
        "target": "陈文龙（三日前在崖山前哨战中阵亡的统制）",
        "deadline": "元军潮落总攻前"
      },
      "instantEcho": {
        "directResult": "陈文龙猛然睁开眼，坐起，接过你的刀喝令全军解索。",
        "unexpectedCost": "张世杰认定你使用妖法，下令亲兵乱箭射向陈文龙。",
        "beneficiary": "幼帝赵昺和恐慌的军民",
        "payer": "陈文龙（第二次死去）"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-grain",
      "displayLabel": "让粮船米缸涌出粮食赈济饥军",
      "label": "你必须在元军总攻前，亲自搬出三只空米缸放在旗舰甲板上，发动能力让它们不断涌出热腾腾的熟米饭，同时大喊“上天赐粮，人人有份”。",
      "intent": "用无尽粮食稳定饥饿崩溃的军心，争取时间重新编队突围。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将三只空米缸并排摆在旗舰主桅下，双手放在缸沿",
        "target": "三只空米缸",
        "deadline": "元军潮落总攻前"
      },
      "instantEcho": {
        "directResult": "三只缸口同时涌出热腾腾的白米饭，瞬间堆满甲板，饿了三天的将士疯抢。",
        "unexpectedCost": "元军看见烟雾，判断宋军正在大规模炊事，提前发动火攻船阵。",
        "beneficiary": "旗舰及附近二十艘船上两万名饥兵",
        "payer": "你（因炊烟引来元军火攻）"
      }
    },
    {
      "id": "C",
      "powerId": "enlarge-object",
      "displayLabel": "放大幼帝座船为不沉方舟",
      "label": "你必须在元军总攻前，亲自游到幼帝赵昺的龙船旁，双手按在船帮发动能力，将整艘船等比例放大一百倍，成为长三百丈、宽五十丈的巨大方舟。",
      "intent": "用不可摧毁的巨型船体成为海上堡垒，吸附元军火力，掩护其他船只分散突围。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "游到龙船外侧，双手紧贴湿冷的船板",
        "target": "幼帝赵昺所乘的龙船",
        "deadline": "元军潮落总攻前"
      },
      "instantEcho": {
        "directResult": "龙船在巨响中膨胀百倍，船底厚达三丈，元军投石机砸出白痕。",
        "unexpectedCost": "巨船吃水过深，搁浅在崖山礁石上，无法移动，成为元军围攻的标靶。",
        "beneficiary": "幼帝赵昺与陆秀夫（暂得安全）",
        "payer": "你（被困在礁石间无法脱身）"
      }
    }
  ],
  "poyang-1363": [
    {
      "id": "C",
      "powerId": "broadcast-thought",
      "displayLabel": "火攻令入船众心",
      "label": "你将‘各船集中火攻陈友谅中军楼船’送入两军脑中，迫使双方同时改变队形。",
      "intent": "用全军强制同步突破陈友谅兵力信息优势的瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "送出脑中指令",
        "target": "方圆十公里内所有船众，包括朱元璋和陈友谅",
        "deadline": "风向稳定期内"
      },
      "instantEcho": {
        "directResult": "所有水军同时听到命令，部分船开始转向中军楼船。",
        "unexpectedCost": "陈友谅提前下令左右翼包抄，导致你方侧翼暴露。",
        "beneficiary": "朱元璋",
        "payer": "你方侧翼船队"
      }
    },
    {
      "id": "C",
      "powerId": "teleport-crowd",
      "displayLabel": "百人跃上敌楼船",
      "label": "你将你手下最精锐的一百名火攻营士兵连同你自己传送到陈友谅的中军楼船甲板上，亲自带领突击。",
      "intent": "跨越舰船距离瓶颈，直接摧毁敌军指挥中枢。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "传送百人",
        "target": "陈友谅中军楼船甲板",
        "deadline": "日落前一个时辰内"
      },
      "instantEcho": {
        "directResult": "百人出现在敌舰甲板，展开近战。",
        "unexpectedCost": "你方火攻船失去指挥官，部分船队混乱。",
        "beneficiary": "朱元璋",
        "payer": "你方火攻船队"
      }
    },
    {
      "id": "C",
      "powerId": "borrow-tomorrow-memory",
      "displayLabel": "今忆明日火攻果",
      "label": "你借用明天此刻的记忆，得知今日火攻的最优时机和风向变化，以及陈友谅的防御弱点。",
      "intent": "用未来信息突破风向不确定性的瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "获取记忆",
        "target": "明天此刻的你",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "你立刻知道最佳火攻时刻和敌军弱点。",
        "unexpectedCost": "记忆冲击导致你短暂失神，错失部分指挥时机。",
        "beneficiary": "朱元璋水军",
        "payer": "你个人"
      }
    },
    {
      "id": "C",
      "powerId": "summon-giant-beast",
      "displayLabel": "召巨兽撞碎楼船",
      "label": "你在陈友谅中军楼船前方水域召唤一只百米高的水兽，命令它用躯体撞击楼船，将其撞翻。",
      "intent": "用巨兽的绝对力量突破楼船坚不可摧的瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤巨兽并命令撞击",
        "target": "陈友谅中军楼船",
        "deadline": "巨兽存在的一小时内"
      },
      "instantEcho": {
        "directResult": "巨兽撞翻中军楼船，陈友谅落水。",
        "unexpectedCost": "巨兽掀起的巨浪吞噬了你方数艘小船。",
        "beneficiary": "朱元璋水军",
        "payer": "你方小船队"
      }
    },
    {
      "id": "C",
      "powerId": "move-mountain",
      "displayLabel": "移康郎山堵水道",
      "label": "你将视野内的康郎山移动到鄱阳湖通向北方的唯一水道口，阻挡陈友谅舰队退路。",
      "intent": "用地形封锁突破陈友谅舰队机动性优势的瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "移动康郎山",
        "target": "鄱阳湖北方水道口",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "山体堵住水道，陈友谅舰队无法北逃。",
        "unexpectedCost": "山体移动引发湖啸，导致你方部分船只搁浅。",
        "beneficiary": "朱元璋水军",
        "payer": "你方搁浅船只"
      }
    },
    {
      "id": "C",
      "powerId": "locate-anything",
      "displayLabel": "定陈友谅座舰位",
      "label": "你立即得知陈友谅此刻所在的确切位置，发现他不在中军楼船，而在后方一艘伪装船中。",
      "intent": "用精确定位突破敌情不明的瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "定位陈友谅位置",
        "target": "陈友谅本人",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "你知晓陈友谅在后方伪装船。",
        "unexpectedCost": "信息仅你一人知晓，传达慢了导致部分火攻浪费在假目标上。",
        "beneficiary": "朱元璋",
        "payer": "你方火攻资源"
      }
    }
  ],
  "jingnan-nanjing-1402": [
    {
      "id": "C",
      "powerId": "reverse-cause",
      "displayLabel": "颠倒火因与遗址",
      "label": "把你放火烧宫的结果变成原因，让建文帝已从地道出城的结果变成其出城的原因，再将退位诏放在奉天殿改写成奉天殿里本无退位诏，是朱棣伪造了它。",
      "intent": "将朱棣入宫后火起的结果扭曲成火是朱棣放的，从而证明建文帝并非自焚，而是成功逃脱。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将宫中起火的结果改为原因，将建文帝出城的结果改为原因，将奉天殿出现退位诏的结果改为原因",
        "target": "建文帝失踪、宫中起火、退位诏出现",
        "deadline": "朱棣的燕军将在一个时辰内进入皇城"
      },
      "instantEcho": {
        "directResult": "朱棣抵达奉天殿时，发现火势是从殿内向外蔓延，而退位诏上墨迹未干，倒映出朱棣自己的指纹。",
        "unexpectedCost": "你自身因果线被搅乱，你的过去出现了一封朱棣写给你、要求你配合伪造退位诏的密信。",
        "beneficiary": "建文帝的逃遁路线彻底保真",
        "payer": "你成了朱棣篡位史书中‘关键内应’的书写对象"
      }
    },
    {
      "id": "C",
      "powerId": "stop-time",
      "displayLabel": "定住燕军前锋营",
      "label": "你在金川门即将被打开的瞬间，让除你之外整个南京金川门至皇宫地段完全停止十分钟，然后独自穿过停滞的燕军队列，亲手将‘朕已逊国’诏书塞入即将入城的朱棣袖中。",
      "intent": "在城门开启的最后一刻制造时间窗口，将假诏书嵌入朱棣亲自接收的位置，打消他屠城的借口。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "停下时间，将退位诏书塞入朱棣袖中",
        "target": "朱棣",
        "deadline": "朱棣的燕军将在一个时辰内进入皇城"
      },
      "instantEcho": {
        "directResult": "时间恢复后朱棣发现袖中有诏书，以为是建文帝派人提前送出，公开宣诏停止追击。",
        "unexpectedCost": "你体力耗尽昏倒在城门口，被燕军误认为是报信内侍而囚禁。",
        "beneficiary": "南京城免于被屠三日",
        "payer": "你被押入诏狱，此后无人相信你曾停过时间"
      }
    },
    {
      "id": "C",
      "powerId": "clone-self",
      "displayLabel": "百影分守各宫门",
      "label": "你复制出一百个拥有你记忆的自身，每人指定一个方向：三十人从不同宫门同时冲出，伪装成建文帝逃亡的诱饵；四十人各持一把火炬直奔燕军马厩；三十人假扮成太监散布‘建文帝已至太平门’的传言。",
      "intent": "利用分身制造视觉和情报混乱，让朱棣在入城后一刻钟内被上百个‘你’引向错误方向，为建文帝争取逃遁时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制一百个自己，分别执行诱饵、纵火、散布传言",
        "target": "燕军前锋、马厩、各宫门",
        "deadline": "朱棣的燕军将在一个时辰内进入皇城"
      },
      "instantEcho": {
        "directResult": "朱棣亲率精兵直扑太平门，却发现是死路；马厩火起后燕军半数骑兵失去战马。",
        "unexpectedCost": "所有分身消失后，你被燕军斥候认出是同一个人的分身记录，朱棣下令在全国范围内格杀‘擅分身者’。",
        "beneficiary": "建文帝从应天府南门乘船逃往浙东",
        "payer": "你成为明代第一道‘妖术通缉令’的对象"
      }
    },
    {
      "id": "C",
      "powerId": "extinguish-fire",
      "displayLabel": "压灭宫中冲天烈焰",
      "label": "你在奉天殿、乾清宫、文华殿等七处已燃起的火焰上瞬间熄灭十里内所有可燃之物，火势在十秒内彻底消失，包括朱棣入城时点燃的金川门火把也随之熄灭。",
      "intent": "阻止朱棣‘宫中起火，建文帝自焚’的借口成立，保留完整的宫殿和可能存在的建文帝踪迹证据。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "熄灭方圆十里内所有正在燃烧的火焰",
        "target": "南京皇城所有火场",
        "deadline": "朱棣的燕军将在一个时辰内进入皇城"
      },
      "instantEcho": {
        "directResult": "朱棣率军进入无人皇宫后，见到宫室完好、无烟无火，顿时面色铁青，无法宣布‘帝焚于火’。",
        "unexpectedCost": "燕军士兵怀疑是上天护佑建文帝，纷纷跪地叩拜，朱棣因此下令清洗原建文朝内官一百二十人。",
        "beneficiary": "建文帝消失的真相被悬置，朱棣无法完成篡位叙事",
        "payer": "你和全部未逃内侍被朱棣以‘妖术乱宫’罪名处斩"
      }
    },
    {
      "id": "C",
      "powerId": "erase-memory",
      "displayLabel": "抹除朱棣靖难记忆",
      "label": "你永久删除朱棣关于‘靖难之役’和‘建文帝削藩’的全部记忆，让他从入金川门那一刻起只记得自己是奉太祖遗诏前来南京祭陵。",
      "intent": "让朱棣忘记自己起兵的理由和目的，从根本上瓦解其夺权的心理基础。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "删除朱棣关于靖难之役和建文帝削藩的全部记忆",
        "target": "朱棣",
        "deadline": "朱棣的燕军将在一个时辰内进入皇城"
      },
      "instantEcho": {
        "directResult": "朱棣在马上突然勒住缰绳，问左右‘吾何故在此？’众将面面相觑，士气崩溃。",
        "unexpectedCost": "你删除记忆时触动了朱棣深层人格，他潜意识里将莫名仇恨投射到你身上，即便忘了靖难仍下令将你腰斩。",
        "beneficiary": "建文帝获得至少三天安全逃亡期",
        "payer": "你在临刑前咽气，无人知道朱棣其实已不记得为何而来"
      }
    },
    {
      "id": "C",
      "powerId": "swap-two-people",
      "displayLabel": "互换炮灰与君王",
      "label": "你在朱棣即将跨入奉天殿的刹那，将朱棣与一名被俘的建文朝小太监瞬间交换位置和随身物品，使朱棣穿着太监服出现在殿外偏房，而小太监穿着朱棣的盔甲出现在百官面前。",
      "intent": "让朱棣本人丧失王权在场性，由替身承受朝拜，迫使朱棣不得不自行暴露或暂时失去指挥权。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将朱棣与一名被俘小太监交换位置和所有随身物品",
        "target": "朱棣、小太监",
        "deadline": "朱棣的燕军将在一个时辰内进入皇城"
      },
      "instantEcho": {
        "directResult": "小太监在奉天殿接受‘百官劝进’，而朱棣在偏房大喊无人理睬，卫兵把他当作逃奴羁押。",
        "unexpectedCost": "小太监得到短暂皇权后精神崩溃，胡乱下令‘诛杀燕王’，导致燕军内部火并。",
        "beneficiary": "建文帝趁乱从地道消失，无人追查",
        "payer": "事后真正的朱棣被当作冒充者关入囚车，经历三天虐待后恢复身份，但精神受创"
      }
    }
  ],
  "zheng-he-1405": [
    {
      "id": "C",
      "powerId": "pocket-building",
      "displayLabel": "收走刘家港衙署",
      "label": "你在升帆前亲自发动收走建筑的能力，将刘家港内存放贸易账册和垄断敕令的市舶司衙门收入口袋，碎片下放计价权给各船商人。",
      "intent": "收走宫廷使节的权力中心，迫使其无法干扰你下放计价权。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "伸手触碰衙署外墙，将其缩小并收入口袋",
        "target": "刘家港市舶司衙门",
        "deadline": "1405年7月11日巳时末（两个时辰内）"
      },
      "instantEcho": {
        "directResult": "市舶司建筑连同内部的使节和账册消失，码头上只剩下商人、水手和你。",
        "unexpectedCost": "船队失去了官印和正式的文书凭证，后续朝贡记录需重新伪造。",
        "beneficiary": "各船商人代表，如马欢、费信等。",
        "payer": "宫廷使节杨敏（被困在口袋内）"
      }
    },
    {
      "id": "C",
      "powerId": "restore-youth",
      "displayLabel": "使郑和年轻四十岁",
      "label": "你亲自对郑和发动能力，让他身体瞬间回到十九岁时的状态，而保留全部航海经验和记忆，以应对船队内部对下放计价权的激烈反对。",
      "intent": "让郑和以年轻体力亲自震慑反对派，强行推行你的决策。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用手轻触郑和肩膀，注入年轻之力",
        "target": "郑和（马和）",
        "deadline": "距离升帆还剩一个时辰"
      },
      "instantEcho": {
        "directResult": "郑和脸上的皱纹消失，白发变乌，筋骨有力，众人惊呼。",
        "unexpectedCost": "郑和的心智中残留了对童年阉割的恐惧，导致他在年轻身体中情绪波动。",
        "beneficiary": "郑和本人",
        "payer": "郑和的寿命（无额外代价）"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-money",
      "displayLabel": "取出三箱永乐通宝",
      "label": "你在启航前亲自发动无限钱财能力，取出三箱无法辨伪的永乐通宝分给各船商人，作为他们自行贸易的启动资本，以换取他们支持下放计价权。",
      "intent": "用无限货币直接收买商人，瓦解宫廷使节的经济垄断。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "从随身口袋中连续取出三大箱铜钱",
        "target": "各船商人：王景弘、马欢、费信等",
        "deadline": "启航前剩余的两个时辰"
      },
      "instantEcho": {
        "directResult": "商人领到巨额钱币，欢呼雀跃，计价权顺利移交。",
        "unexpectedCost": "大量铜钱涌入导致船队负重增加，吃水过深。",
        "beneficiary": "各船商人",
        "payer": "永乐帝名义的国库（但钱币无法辨伪）"
      }
    },
    {
      "id": "C",
      "powerId": "shrink-object",
      "displayLabel": "缩小宝船指挥令旗",
      "label": "你亲自缩小郑和宝船上那面象征宫廷权威的七丈帅旗至手掌大小，使其无法在升帆时升起，从而无法阻止你下放贸易计价权。",
      "intent": "通过无法升旗制造混乱，迫使使节同意你的方案。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用指尖触碰帅旗，将其缩小",
        "target": "郑和宝船主桅上的帅旗",
        "deadline": "升帆前一刻"
      },
      "instantEcho": {
        "directResult": "帅旗变成巴掌大，无法挂出；船队失去旗舰标识，信号码混乱。",
        "unexpectedCost": "郑和怒斥你，认为此举触犯国体；你被罚俸。",
        "beneficiary": "你本人（获得谈判筹码）",
        "payer": "郑和的权威（受损）"
      }
    },
    {
      "id": "C",
      "powerId": "transfer-cost",
      "displayLabel": "转移宫廷干预代价",
      "label": "你在下放计价权的命令发出后，把原本将由你承担的杀头代价转移给下令阻止你的宫廷使节杨敏，让他承担全部后果。",
      "intent": "既免除自身风险，又让反对者自食其果。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "口念转移诀，食指指向杨敏",
        "target": "杨敏（宫廷副使）",
        "deadline": "使节下令抓捕你之前"
      },
      "instantEcho": {
        "directResult": "杨敏突然七窍流血，倒地抽搐，你毫发无伤。",
        "unexpectedCost": "转移后杨敏的部下怀疑是你下毒，对你严加防范。",
        "beneficiary": "你本人",
        "payer": "杨敏（承担死亡代价）"
      }
    },
    {
      "id": "C",
      "powerId": "rewind-hour",
      "displayLabel": "倒回半个时辰前",
      "label": "你在宫廷使节强行收走贸易账册的一刹那发动能力，让整个刘家港回到半个时辰前的状态，账册完好无损，你得到第二次机会抢先下放计价权。",
      "intent": "重置时间避开使节的干预窗口。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "闭目默念倒转，双手合十",
        "target": "刘家港码头及全舰队",
        "deadline": "使节撕毁账册的瞬间"
      },
      "instantEcho": {
        "directResult": "一切倒回半个时辰前，账册仍在，使节茫然不知。",
        "unexpectedCost": "你因保持记忆而剧烈头痛，且体力消耗巨大。",
        "beneficiary": "你本人和商人团体",
        "payer": "你的精力（整体虚弱）"
      }
    }
  ],
  "tumu-crisis-1449": [
    {
      "id": "C",
      "powerId": "summon-future-self",
      "displayLabel": "召十载后于谦来驳南迁",
      "label": "你召来十年后的兵部尚书于谦，让他在午门廷议上详细陈述坚守北京的具体方略，于是郕王当场否决南迁并下令调兵。",
      "intent": "以未来的实战经验彻底打消朝臣南迁念头。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动召来未来的自己",
        "target": "十年后的于谦",
        "deadline": "在瓦剌抵达前完成廷议"
      },
      "instantEcho": {
        "directResult": "未来的于谦出现在午门，详细陈述北京保卫战的兵力部署与后勤方案。",
        "unexpectedCost": "未来的于谦在陈述后消失，但你的真实身份被部分朝臣怀疑。",
        "beneficiary": "郕王朱祁钰",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "invisibility",
      "displayLabel": "隐身潜入夺权防南逃",
      "label": "你隐身进入徐有贞府邸偷走其南迁奏疏，并趁夜将此物置于郕王寝宫，令郕王怒斥南迁派。",
      "intent": "切断南迁派首脑的阴谋工具。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动全局隐身",
        "target": "徐有贞的南迁奏疏",
        "deadline": "在次日朝会前完成"
      },
      "instantEcho": {
        "directResult": "徐有贞发现奏疏失踪，次日朝会百口莫辩。",
        "unexpectedCost": "隐身期间你碰倒烛台引发小火，烧毁了几卷无关的案牍。",
        "beneficiary": "郕王",
        "payer": "徐有贞"
      }
    },
    {
      "id": "C",
      "powerId": "split-river",
      "displayLabel": "分护城河阻瓦剌速攻",
      "label": "你让北京护城河水分开，露出干涸河床，迫使瓦剌骑兵改道德胜门落入明军预设阵地。",
      "intent": "改变瓦剌的攻城路线，将战争主动权夺回明军之手。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动让江河分开",
        "target": "北京护城河",
        "deadline": "在瓦剌先锋到达前三刻完成"
      },
      "instantEcho": {
        "directResult": "护城河河水向两侧退去，露出泥泞河床。",
        "unexpectedCost": "河床淤泥导致数名明军陷入，一人被瓦剌箭矢射伤。",
        "beneficiary": "于谦的京城守军",
        "payer": "护城河周边的渔民"
      }
    },
    {
      "id": "C",
      "powerId": "speak-any-distance",
      "displayLabel": "远唤石亨率兵入卫",
      "label": "你直接与在宣府的石亨通话，命令他无视朝廷之前不信任的密令，携带所有可用骑兵三天内赶到北京支援。",
      "intent": "紧急回调被边缘化的悍将，补足北京守军的兵力缺口。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动跨越距离通话",
        "target": "宣府总兵石亨",
        "deadline": "在通话结束前十分钟内发出清晰指令"
      },
      "instantEcho": {
        "directResult": "石亨即刻动身，率两万骑兵三日后入京。",
        "unexpectedCost": "石亨怀疑你的身份，但鉴于军情紧急仍选择相信。随后他因擅自离防被言官弹劾。",
        "beneficiary": "于谦",
        "payer": "石亨本人"
      }
    },
    {
      "id": "C",
      "powerId": "duplicate-place",
      "displayLabel": "复制午门假议稳朝局",
      "label": "你在皇城东侧空地复制一座午门及全套朝会陈设，将徐有贞等南迁派引入其中，使其在两时辰内无法干预真实廷议。",
      "intent": "调虎离山，让主战派在真实午门顺利拥立郕王。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动复制一个地点",
        "target": "午门及朝会物品",
        "deadline": "在廷议开始前完成复制"
      },
      "instantEcho": {
        "directResult": "徐有贞等五人进入复制午门，与虚拟朝臣争论南迁，直到两个时辰后才发现被骗。",
        "unexpectedCost": "复制耗尽了你的体力，你昏迷了近一个时辰。",
        "beneficiary": "郕王朱祁钰",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "revive-dead",
      "displayLabel": "复活杨洪授守城机宜",
      "label": "你复活已故的昌平侯杨洪，让他短暂出现，在兵部当众口述北京九门的防守薄弱环节与补救方案。",
      "intent": "借逝去的名将经验完善城防，避免重现土木之败。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动复活一位死者",
        "target": "昌平侯杨洪",
        "deadline": "在廷议或军事会议结束前"
      },
      "instantEcho": {
        "directResult": "杨洪的灵魂形象清晰陈述了德胜门防务漏洞，于谦当即调整部署。",
        "unexpectedCost": "杨洪复活时提到“英宗已降”，引发部分朝臣恐慌。",
        "beneficiary": "于谦",
        "payer": "杨洪的家属（目睹复活后的惊恐）"
      }
    }
  ],
  "ningyuan-1626": [
    {
      "id": "C",
      "powerId": "immortal-day",
      "displayLabel": "赐袁崇焕一日不死",
      "label": "你在努尔哈赤亲率后金主力攻城前，对袁崇焕发动能力，让他在二十四小时内无法死亡或失去意识，确保宁远城指挥不崩。",
      "intent": "确保袁崇焕在城头督战时不被流弹或刺杀中断指挥，避免士气崩溃。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向城头督战的袁崇焕，默念能力指令",
        "target": "袁崇焕",
        "deadline": "后金攻城队越过壕沟前"
      },
      "instantEcho": {
        "directResult": "袁崇焕身边一枚炮弹碎片擦过他的头盔，但他毫无损伤，继续下令开炮。",
        "unexpectedCost": "你因分心被后金流矢擦伤左臂。",
        "beneficiary": "袁崇焕",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "transmute-material",
      "displayLabel": "城砖变铁板",
      "label": "你在努尔哈赤的攻城锤撞向宁远城门的瞬间，将城门的一段木材永久变为铸铁，使敌军无法撞开。",
      "intent": "弥补宁远城门相对薄弱的缺陷，阻止后金破门而入。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触摸城门内侧，将木料转变为铸铁",
        "target": "宁远城东门的一段门闩",
        "deadline": "后金攻城锤撞击前"
      },
      "instantEcho": {
        "directResult": "攻城锤撞上铸铁门闩后断裂，后金士兵后退。",
        "unexpectedCost": "变出的铸铁门闩过热，烫伤了一名靠得太近的明军士兵的手。",
        "beneficiary": "宁远守军",
        "payer": "被烫伤的明军士兵"
      }
    },
    {
      "id": "C",
      "powerId": "broadcast-thought",
      "displayLabel": "传语后金阵中“大汗已死”",
      "label": "你在后金军准备云梯登城时，将“努尔哈赤已被红夷大炮击中”这句话送入方圆十里所有后金将士脑中。",
      "intent": "制造后金军内部的恐慌和指挥混乱，延缓其攻城节奏。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "集中意念向城外后金阵列发送思维广播",
        "target": "所有后金攻城部队",
        "deadline": "后金云梯竖立前"
      },
      "instantEcho": {
        "directResult": "后金阵中多处骚动，部分士兵停止前进，回头张望。",
        "unexpectedCost": "你脑中反噬一阵剧痛，鼻血直流。",
        "beneficiary": "宁远守军",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "teleport-crowd",
      "displayLabel": "迁后金前锋百人至辽东雪原",
      "label": "你在后金前锋精锐冲过壕沟、逼近城墙时，将这一百人瞬间传送到你曾到过的辽东无人雪原。",
      "intent": "直接消灭敌军精锐前锋，瓦解其第一波攻势。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "手指城下后金前锋，发动传送",
        "target": "后金前锋部队约一百人",
        "deadline": "他们抵达城墙根前"
      },
      "instantEcho": {
        "directResult": "那百名士兵凭空消失，后金攻城队形出现缺口。",
        "unexpectedCost": "传送完成后你短暂眩晕，摔倒在地。",
        "beneficiary": "宁远城头炮手",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "borrow-tomorrow-memory",
      "displayLabel": "预知宁远炮击落点",
      "label": "你在下达齐射命令前，借用明日此刻的记忆，得知今日齐射的准确落点数据，从而调整火炮角度。",
      "intent": "提高红夷大炮命中率，避免浪费弹药。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "闭眼获取明日此刻记忆，读取炮击结果",
        "target": "你自己（作为炮术翻译）",
        "deadline": "红夷大炮齐射前"
      },
      "instantEcho": {
        "directResult": "你准确报出密位修正量，齐射命中后金指挥车附近。",
        "unexpectedCost": "明日记忆显示努尔哈赤并未当场死亡，你犹豫是否继续开炮。",
        "beneficiary": "袁崇焕及炮队",
        "payer": "你（心理压力）"
      }
    },
    {
      "id": "C",
      "powerId": "summon-giant-beast",
      "displayLabel": "召巨兽踏平后金云梯队",
      "label": "你在后金云梯队竖起、士兵攀爬时，在宁远城外指定一只百米高的巨兽，命令它踩碎所有云梯。",
      "intent": "以绝对物理优势摧毁攻城器械，迫使后金撤退。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向城下云梯区域，召唤巨兽",
        "target": "后金云梯队和云梯",
        "deadline": "后金士兵登上城墙前"
      },
      "instantEcho": {
        "directResult": "一只形如巨猿的巨兽出现在城外，一脚踩碎五架云梯，后金军惊慌逃散。",
        "unexpectedCost": "巨兽行动时震落城墙上的几块砖石，砸伤两名明军。",
        "beneficiary": "宁远守军",
        "payer": "被砸伤的明军"
      }
    }
  ],
  "shanhai-pass-1644": [
    {
      "id": "C",
      "powerId": "universal-language",
      "displayLabel": "用满语宣读时限盟约",
      "label": "你以满语向多尔衮宣读你起草的盟约，规定清军只能助战，不得越关占领城池，并将交还北京于明朝，限他一日内答复。",
      "intent": "让语言壁垒消失，直接以对方母语传达关键条款，消除误解，迫使多尔衮在读者面前无法拖延或假装不懂。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用满语一字一句宣读盟约条款",
        "target": "多尔衮",
        "deadline": "李自成大军次日进攻前"
      },
      "instantEcho": {
        "directResult": "多尔衮当场听懂每一条款，帐内满洲将领无人能再以语言不通为借口曲解。",
        "unexpectedCost": "你通晓满语的能力引起多尔衮警觉，他怀疑你与关外有长期私通，暗中加强对你的监视。",
        "beneficiary": "吴三桂",
        "payer": "你本人"
      }
    },
    {
      "id": "C",
      "powerId": "intangible-walls",
      "displayLabel": "穿墙送关宁军令牌",
      "label": "你穿过宁海城的石墙，直接进入已投靠大顺的守将陈才的密室，在他与李自成信使交谈时，将一枚“暂不开关”的令牌塞入他怀中。",
      "intent": "无视物理壁垒，直接干预敌方内部决策，让陈才在关键时刻按吴三桂意图行动。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "穿过墙壁进入密室并放置令牌",
        "target": "陈才",
        "deadline": "李自成大军进攻之前"
      },
      "instantEcho": {
        "directResult": "陈才与信使突然发现令牌，误以为是李自成暗中变卦，密议暂停开关，多争取了半天谈判时间。",
        "unexpectedCost": "你穿墙时被一名夜巡士兵瞥见残影，军中开始流传幕僚有妖术，部分将领对你产生恐惧与排斥。",
        "beneficiary": "吴三桂",
        "payer": "你的声望"
      }
    },
    {
      "id": "C",
      "powerId": "reverse-cause",
      "displayLabel": "让吴三桂反成借兵原因",
      "label": "你颠倒因果，让“吴三桂决心引清军入关”这一临时想法变成他早有计划的结果，而“李自成占领北京”反成为他执行计划的诱因。",
      "intent": "扭转历史连锁，使吴三桂的借兵显得非临时背叛，而是多年布局，迫使大顺重新评估他的动机。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在吴三桂面前颠倒因果",
        "target": "吴三桂的决策史",
        "deadline": "书信送出之前"
      },
      "instantEcho": {
        "directResult": "吴三桂突然坚信自己早年驻守宁远时已与多尔衮密约，此刻只是执行计划，于是毫不犹豫改信为联盟。",
        "unexpectedCost": "颠倒因果抹去了吴三桂原先的犹豫与悲痛记忆，他变得冷酷无情，事后处决了两名劝他降李的亲信。",
        "beneficiary": "多尔衮",
        "payer": "被处决的亲信"
      }
    },
    {
      "id": "C",
      "powerId": "stop-time",
      "displayLabel": "定格辩论改写书信",
      "label": "你在帅府争辩正酣时停止时间十分钟，单独改动吴三桂案上的求援信，将“乞师”改为“约盟”，并抹去“愿献关外之地”一句。",
      "intent": "在无人察觉的凝固时间里直接修改关键文书，避免任何反对意见干扰。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "停止时间并修改书信",
        "target": "吴三桂案上的求援信",
        "deadline": "时间恢复前完成修改"
      },
      "instantEcho": {
        "directResult": "时间恢复后，吴三桂拿起信发现已是联盟版本，虽疑惑但认为乃自己笔误，直接签名用印。",
        "unexpectedCost": "你停止时间时，一名传令兵恰好跌倒，时间恢复后他因姿态突变而骨折，无法传递紧急军情。",
        "beneficiary": "吴三桂",
        "payer": "骨折的传令兵"
      }
    },
    {
      "id": "C",
      "powerId": "clone-self",
      "displayLabel": "百身连夜策反各营",
      "label": "你复制一百个自己，各自持不同类型盟书，分别潜入关宁军、大顺哨兵、关外清军前哨，同时向辽东总兵白广恩、唐通部将、多尔衮斥候队长发出改写后的约盟条款。",
      "intent": "同时多点散发联盟版本，制造广泛既成事实，让吴三桂和各方都相信“大家都已同意”。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制分身并分头送出盟书",
        "target": "白广恩、唐通部将、多尔衮斥候队长",
        "deadline": "李自成大军抵达前一夜"
      },
      "instantEcho": {
        "directResult": "一夜之间，三方都收到内容一致的联盟条款，吴三桂次日接到回报以为众心所向，正式宣布与清军联盟。",
        "unexpectedCost": "部分分身被识破后传言幕僚有妖术，多尔衮因此要求吴三桂处死“妖人”以示诚意，你被迫假死隐匿。",
        "beneficiary": "吴三桂",
        "payer": "你本人（假死）"
      }
    },
    {
      "id": "C",
      "powerId": "extinguish-fire",
      "displayLabel": "灭烽火阻隔李自成信号",
      "label": "你熄灭山海关外李自成军营及周边十里的所有篝火、灯笼、火把，使夜空坠入黑暗，大顺军无法点燃烽火传递进攻信号，各营之间失去联络。",
      "intent": "消除火攻与通讯手段，瘫痪大顺军的协调能力，为吴三桂争取战术优势。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "熄灭所有明火",
        "target": "李自成军营及关外十里",
        "deadline": "李自成预定进攻时刻之前"
      },
      "instantEcho": {
        "directResult": "大顺军信号中断，进攻延迟半日，吴三桂趁机完成关城布防并与清军完成阵型对接。",
        "unexpectedCost": "火灭后，一支原本计划夜袭清军的大顺精骑因失明相撞混乱，但其中一股误入吴三桂粮仓纵火，烧毁半月存粮。",
        "beneficiary": "多尔衮",
        "payer": "吴三桂的粮储"
      }
    }
  ],
  "koxinga-1661": [
    {
      "id": "C",
      "powerId": "control-weather",
      "displayLabel": "借浓雾掩护郑成功舰队抢渡鹿耳门",
      "label": "你在鹿耳门外海升起一场浓雾，遮蔽荷兰人视线，使舰队在潮水回落前安全通过浅水道。",
      "intent": "用天气掩护舰队突破荷兰封锁，解决潮汐窗口短促的问题。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "升起一场浓雾",
        "target": "鹿耳门水道",
        "deadline": "潮水回落前"
      },
      "instantEcho": {
        "directResult": "郑军舰队在迷雾中成功通过鹿耳门，进入台江内海。",
        "unexpectedCost": "后续能见度降低，导致部分船只搁浅在沙洲。",
        "beneficiary": "郑成功船队",
        "payer": "领航官的声誉"
      }
    },
    {
      "id": "C",
      "powerId": "see-hidden-writing",
      "displayLabel": "识破热兰遮城荷兰人密信内容",
      "label": "你在鹿耳门船上看见一封尚未寄出的荷兰人密信，信中提到防御弱点，立即告知郑成功。",
      "intent": "提前获取敌方情报，破解荷兰人防御计划。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "阅读一封尚未寄出的密信",
        "target": "热兰遮城荷兰指挥官",
        "deadline": "本幕结束前"
      },
      "instantEcho": {
        "directResult": "郑成功得知热兰遮城西北角防御薄弱，调整登陆点。",
        "unexpectedCost": "荷兰人发现泄密后更换密码，后续情报更难获取。",
        "beneficiary": "郑成功",
        "payer": "荷兰东印度公司的情报安全"
      }
    },
    {
      "id": "C",
      "powerId": "pocket-building",
      "displayLabel": "收走鹿耳门炮台阻碍荷兰火力",
      "label": "你在鹿耳门水道边将荷兰人修建的炮台收入口袋，使舰队不受侧翼炮击。",
      "intent": "消除荷兰沿岸防御工事，确保登陆安全。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "收走炮台",
        "target": "鹿耳门荷兰炮台",
        "deadline": "潮水回落前"
      },
      "instantEcho": {
        "directResult": "炮台连同荷兰守军消失，郑军登陆无阻碍。",
        "unexpectedCost": "炮台收回后，荷兰人迅速重建更坚固的堡垒。",
        "beneficiary": "郑成功先遣队",
        "payer": "荷兰守军士气"
      }
    },
    {
      "id": "C",
      "powerId": "restore-youth",
      "displayLabel": "使郑成功恢复十七岁精力指挥作战",
      "label": "你让郑成功身体年轻四十年，他瞬间获得充沛精力，亲自指挥前锋抢滩。",
      "intent": "提升主将体力以应对高强度作战指挥。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让郑成功年轻四十岁",
        "target": "郑成功",
        "deadline": "本幕结束前"
      },
      "instantEcho": {
        "directResult": "郑成功精力充沛，亲自督战，登陆效率大增。",
        "unexpectedCost": "年轻的身体使他忽视疲劳，后续指挥中过度劳累。",
        "beneficiary": "郑成功",
        "payer": "郑成功长期健康"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-money",
      "displayLabel": "用无限白银向当地渔民购买情报",
      "label": "你在鹿耳门外海用无限白银贿赂渔民，获取鹿耳门最佳航道时机。",
      "intent": "解决情报不足和当地人合作意愿低的问题。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "支付白银购买情报",
        "target": "当地渔民",
        "deadline": "潮水回落前"
      },
      "instantEcho": {
        "directResult": "渔民提供精确潮汐和暗礁分布，舰队安全通过。",
        "unexpectedCost": "大量白银流入市场，导致当地物价短期波动。",
        "beneficiary": "郑成功船队",
        "payer": "渔民长期生计"
      }
    },
    {
      "id": "C",
      "powerId": "shrink-object",
      "displayLabel": "缩小郑成功座舰通过狭窄水道",
      "label": "你缩小郑成功的旗舰，使其吃水深度变浅，顺利通过鹿耳门最浅处。",
      "intent": "解决大船无法通过浅水区的物理限制。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "缩小郑成功座舰",
        "target": "郑成功的旗舰",
        "deadline": "潮水回落前"
      },
      "instantEcho": {
        "directResult": "旗舰缩小后通过浅滩，郑成功率先登陆。",
        "unexpectedCost": "缩小的船承载力下降，需后续换船。",
        "beneficiary": "郑成功旗舰船员",
        "payer": "旗舰的原木料"
      }
    }
  ],
  "kangxi-aobai-1669": [
    {
      "id": "C",
      "powerId": "read-one-mind",
      "displayLabel": "听鳌拜此刻心思",
      "label": "你闭眼读取鳌拜的真实想法与回忆，一炷香内把所见画面告诉给康熙。",
      "intent": "提前知晓鳌拜是否察觉陷阱，确保计划万无一失。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "闭眼读取",
        "target": "鳌拜",
        "deadline": "鳌拜将在一炷香后独自入殿奏事"
      },
      "instantEcho": {
        "directResult": "你看到了鳌拜正在回忆昨日与遏必隆密谈的内容，他对布库少年毫无防范。",
        "unexpectedCost": "你因精神力消耗过度，接下来三天无法入睡。",
        "beneficiary": "康熙",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "blink-self",
      "displayLabel": "瞬移殿门插销",
      "label": "你抓起殿门铁插销，瞬间移动到武英殿门口，在鳌拜入殿前将门从外闩死。",
      "intent": "确保殿门在关键时刻无法从内打开，阻断鳌拜退路。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "抓起并瞬移",
        "target": "武英殿铁插销",
        "deadline": "鳌拜将在一炷香后独自入殿奏事"
      },
      "instantEcho": {
        "directResult": "殿门被从外闩死，鳌拜入殿后无法立刻逃出。",
        "unexpectedCost": "你手中的铁插销因瞬移过热，烫伤你的掌心。",
        "beneficiary": "康熙及布库少年",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "summon-future-self",
      "displayLabel": "召来十年后你",
      "label": "你召来1679年的自己，让他假扮传旨太监引开鳌拜随从，确保殿内只有鳌拜一人。",
      "intent": "制造鳌拜孤立无援的局面，降低擒拿风险。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召来并命令",
        "target": "十年后的你",
        "deadline": "鳌拜将在一炷香后独自入殿奏事"
      },
      "instantEcho": {
        "directResult": "未来你成功骗走鳌拜的两名亲兵，鳌拜独自入殿。",
        "unexpectedCost": "未来你返回后，你的记忆出现一年空白。",
        "beneficiary": "康熙",
        "payer": "未来的你"
      }
    },
    {
      "id": "C",
      "powerId": "invisibility",
      "displayLabel": "隐身藏于殿梁",
      "label": "你让自己和随身匕首完全隐身，提前藏身武英殿梁上，在鳌拜被制住时补上一刀。",
      "intent": "在布库少年失手时提供最后保险。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "隐身并藏身",
        "target": "武英殿梁上",
        "deadline": "鳌拜将在一炷香后独自入殿奏事"
      },
      "instantEcho": {
        "directResult": "你成功隐身潜伏，当一名少年被鳌拜甩开时，你刺中鳌拜右肩。",
        "unexpectedCost": "你的隐身被鳌拜临死前的鲜血破解，众目睽睽之下现形。",
        "beneficiary": "布库少年",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "split-river",
      "displayLabel": "劈开金水河",
      "label": "你让紫禁城外的金水河从中分开，露出河床，同时指挥布库少年将鳌拜从殿内拖入河床，让他无法被救走。",
      "intent": "将鳌拜转移至无人能援的孤立地点。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "分开金水河并指挥拖人",
        "target": "金水河",
        "deadline": "鳌拜将在一炷香后独自入殿奏事"
      },
      "instantEcho": {
        "directResult": "金水河河床裸露，鳌拜被拖入其中，宫内外无人能接近。",
        "unexpectedCost": "河水倒灌淹没附近三个库房，损失一批丝绸。",
        "beneficiary": "康熙",
        "payer": "内务府"
      }
    },
    {
      "id": "C",
      "powerId": "speak-any-distance",
      "displayLabel": "遥唤孝庄太后",
      "label": "你立即与正在慈宁宫的孝庄太后实时通话，请她下懿旨让九门提督封锁城门，防止鳌拜党羽反扑。",
      "intent": "动用最高权威确保兵变后城防稳定。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "通话并请求",
        "target": "孝庄太后",
        "deadline": "鳌拜将在一炷香后独自入殿奏事"
      },
      "instantEcho": {
        "directResult": "孝庄太后立即下旨，九门提督吴六一封锁九门，鳌拜亲信无法入城。",
        "unexpectedCost": "通话耗尽了你的声带，此后七天无法说话。",
        "beneficiary": "康熙及朝廷",
        "payer": "你"
      }
    }
  ],
  "macartney-1793": [
    {
      "id": "C",
      "powerId": "guarantee-action",
      "displayLabel": "保证译书成功入御览",
      "label": "你向乾隆发誓英方国书译文完整准确，并保证礼部无法篡改或弱化，以此行动必定成功且无人能阻止。",
      "intent": "确保英方开放通商口岸的请求原文呈递乾隆，打破礼部弱化意图。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将完整译文放入御览本并盖印封缄",
        "target": "英方国书译文",
        "deadline": "乾隆上朝前"
      },
      "instantEcho": {
        "directResult": "乾隆读到完整通商请求，勃然大怒但照单全收。",
        "unexpectedCost": "你因越权被罚俸三月，但译文未被改动。",
        "beneficiary": "马嘎尔尼使团",
        "payer": "你自己"
      }
    },
    {
      "id": "C",
      "powerId": "walk-through-walls",
      "displayLabel": "穿墙送书入御前",
      "label": "你穿过避暑山庄所有宫墙，直接闯入乾隆寝宫，将英方国书原稿置于其案头。",
      "intent": "绕过礼部拦截，使乾隆直接见到未经弱化的国书。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "穿墙进入乾隆寝宫并放下国书原稿",
        "target": "乾隆寝宫案头",
        "deadline": "乾隆上朝前"
      },
      "instantEcho": {
        "directResult": "乾隆惊醒，见到国书原稿，急召军机问罪。",
        "unexpectedCost": "你被侍卫当作刺客重伤，但任务完成。",
        "beneficiary": "马嘎尔尼使团",
        "payer": "你本人"
      }
    },
    {
      "id": "C",
      "powerId": "immortal-day",
      "displayLabel": "护马嘎尔尼一日不死",
      "label": "你赐予马嘎尔尼二十四小时不死之身，使其在乾隆震怒后的暗杀毒害中安然无恙。",
      "intent": "保护英使免因上呈完整国书而遭灭口，维持外交对话可能。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触碰马嘎尔尼并赋予不死状态",
        "target": "马嘎尔尼",
        "deadline": "二十四小时内"
      },
      "instantEcho": {
        "directResult": "马嘎尔尼饮下毒酒却无恙，和坤大惊。",
        "unexpectedCost": "你因擅施妖术被囚入大牢。",
        "beneficiary": "马嘎尔尼",
        "payer": "你自己"
      }
    },
    {
      "id": "C",
      "powerId": "transmute-material",
      "displayLabel": "国书纸化琉璃",
      "label": "你将英方国书的纸张永久变成透明琉璃，使礼部无法替换或销毁，乾隆一目了然。",
      "intent": "使国书内容无法被遮掩或篡改，直接暴露于乾隆眼前。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触摸国书并念咒将其材质转为琉璃",
        "target": "英方国书",
        "deadline": "递交御前前"
      },
      "instantEcho": {
        "directResult": "国书化为琉璃板，文字清晰可见，礼部无法替换。",
        "unexpectedCost": "琉璃国书易碎，乾隆摔碎一角，但内容已存。",
        "beneficiary": "马嘎尔尼使团",
        "payer": "国书物理完整性"
      }
    },
    {
      "id": "C",
      "powerId": "broadcast-thought",
      "displayLabel": "万人脑中译真意",
      "label": "你让避暑山庄所有人同时听见你用英文和满文念出英方国书核心请求：“开放沿海口岸，建立常驻使节”。",
      "intent": "使开放通商请求成为公开事实，迫使乾隆无法隐瞒或扭曲。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "集中意念将国书核心句送入万人脑中",
        "target": "避暑山庄所有人",
        "deadline": "乾隆上朝时"
      },
      "instantEcho": {
        "directResult": "山庄内人人议论“开港口”，乾隆不得不当朝回应。",
        "unexpectedCost": "你因妖言惑众被立即处斩，但信息已传。",
        "beneficiary": "英方诉求",
        "payer": "你性命"
      }
    },
    {
      "id": "C",
      "powerId": "teleport-crowd",
      "displayLabel": "传送使团至御前",
      "label": "你将马嘎尔尼使团百人瞬间传送到乾隆上朝的澹泊敬诚殿内，直接对质通商请求。",
      "intent": "规避层层转译与礼部阻挠，让乾隆与英使面对面直接交涉。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "伸手一指，将使团全体传送至澹泊敬诚殿",
        "target": "马嘎尔尼及使团全体",
        "deadline": "乾隆上朝时"
      },
      "instantEcho": {
        "directResult": "使团突然出现在殿内，乾隆惊怒，但被迫当面听取请求。",
        "unexpectedCost": "你因擅闯御殿凌迟处死，但外交对质已发生。",
        "beneficiary": "马嘎尔尼使团",
        "payer": "你本人"
      }
    }
  ],
  "humen-1839": [
    {
      "id": "C",
      "powerId": "door-anywhere",
      "displayLabel": "开一门直通广州商馆",
      "label": "你在销烟开始前在镇口海滩的临时棚屋墙上开一扇任意门，门通往广州十三行英国商馆的谈判大厅，让林则徐自己走进门与义律直接对话。",
      "intent": "任意门跨越地理封锁，让禁烟派与外商领袖面对面，打破信息迟滞与中间人歪曲。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在一面实体墙上推开一扇发光的门，门那头是广州商馆",
        "target": "广州十三行英国商馆的谈判大厅里的义律",
        "deadline": "一个时辰之内必须完成"
      },
      "instantEcho": {
        "directResult": "林则徐走进门后立即与义律四目相对，义律还没完全反应过来。",
        "unexpectedCost": "门关闭后，留在镇口的清军官兵看到林则徐消失，引发一阵恐慌与谣言，说总督被洋人用妖术抓走。",
        "beneficiary": "林则徐",
        "payer": "你的幕僚同僚，他们必须安抚惊愕的清军兵丁"
      }
    },
    {
      "id": "C",
      "powerId": "age-target",
      "displayLabel": "让林则徐老去四十年",
      "label": "你在行辕密室中指向林则徐，让他的身体瞬间老去四十年，变成白发老翁，但思维与意志不变，迫使他以垂暮之身面对即将开始的销烟。",
      "intent": "让林则徐提前体验衰老与无力，迫使其放弃刚烈剿杀，转而选择怀柔谈判以保存实力。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用手指向林则徐并低语，他的皮肤即起皱、头发变白",
        "target": "林则徐",
        "deadline": "销烟仪式开始前必须发动"
      },
      "instantEcho": {
        "directResult": "林则徐在一瞬间变成八旬老翁，所有人都惊恐后退，他本人因骨骼脆化而站立不稳。",
        "unexpectedCost": "林则徐的保皇派政敌借机弹劾他’妖术乱国’，加速他被革职的进程。",
        "beneficiary": "英国鸦片商人，他们看到钦差大臣突然衰老，认为天意护佑外商",
        "payer": "林则徐本人，他从此失去年轻武将的体魄与威仪"
      }
    },
    {
      "id": "C",
      "powerId": "universal-language",
      "displayLabel": "听懂所有外文密函",
      "label": "你在看完最后一批外商文书后施展能力，瞬间听懂并流利说出粤语、英语、葡萄牙语和波斯语，当场翻译出义律藏在贸易清单背面的一封要求英舰炮击虎门的密信。",
      "intent": "语言读懂能力直接揭露外商的真实军事意图，使谈判不再是蒙眼猜谜。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "快速扫过义律的贸易清单背面，然后流利朗读出那封用隐形墨水写的密信内容",
        "target": "义律藏在广州商馆回函中的密信",
        "deadline": "销烟开始前一个时辰的文书审阅时间"
      },
      "instantEcho": {
        "directResult": "你当众读出密信’派康沃利斯号炮轰虎门炮台’，全场文官惊呆，林则徐立刻下令加强海防。",
        "unexpectedCost": "英国商人在场耳目听到了你的翻译，他们连夜派人乘快船通知英舰提前行动，炮击比原计划早了两天。",
        "beneficiary": "清军水师，他们提前有了防备",
        "payer": "你，之后被义律列为’首要妖言者’，悬赏擒拿"
      }
    },
    {
      "id": "C",
      "powerId": "intangible-walls",
      "displayLabel": "让虎门炮台围墙透明化",
      "label": "你在虎门炮台的后勤仓库发动能力，让所有墙壁、门窗和围栏变得可以自由穿过，使藏在仓库夹层中的数百箱未上缴鸦片暴露在阳光下，直接堆放在销烟池旁边。",
      "intent": "壁垒虚化使藏匿的鸦片直接现身，拆穿外商’已全部缴清’的谎言，为谈判提供铁证。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "双手按在虎门炮台仓库后墙，低语后墙壁变得像空气一样可穿过",
        "target": "虎门炮台后勤仓库的实心砖墙",
        "deadline": "销烟仪式正式开始前半个时辰"
      },
      "instantEcho": {
        "directResult": "数百箱标有‘怡和洋行’、‘宝顺洋行’的鸦片从夹层跌落，砸在地面，部分木箱破裂烟土横流。",
        "unexpectedCost": "外商品行立刻声明这些鸦片系被海盗劫掠后藏匿，并非他们缴纳之物，反而指责清方栽赃。",
        "beneficiary": "林则徐，获得额外物证用以驳斥外商",
        "payer": "镇口本地渔民，因鸦片散发气味被征调清理，耽误当日出海"
      }
    },
    {
      "id": "C",
      "powerId": "reverse-cause",
      "displayLabel": "颠倒鸦片没收与销烟的因果",
      "label": "你在林则徐走向销烟池的时刻发动能力，将结果‘鸦片被销毁’改成其原因，而原因‘英国商人自愿交出鸦片’变成结果，于是历史改写为：是先有销烟仪式，才迫使外商在仪式后集体交出鸦片。",
      "intent": "颠倒因果让林则徐能以‘已经示范销毁’逼迫外商在事后补交，避免冲突升级。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在林则徐下令点火时，你悄声念出颠倒语，现实如胶片倒转，销烟的火光先出现，再倒流回鸦片原本被商人藏匿的状态",
        "target": "虎门销烟这个事件的整体因果链",
        "deadline": "林则徐喊出‘点火’的一瞬间"
      },
      "instantEcho": {
        "directResult": "所有在场者看到：林则徐提前点燃销烟池，但池中尚无鸦片；紧接着义律带领商人从仓库中拖着鸦片赶来，一边喊‘快交，免得再被烧’。",
        "unexpectedCost": "林则徐的记忆也随因果颠倒，他坚信自己早就下令销烟，而外商迟交，盛怒之下反而加重了对英商的经济限制。",
        "beneficiary": "义律，他得到了‘自愿交出’的面子，但实际失去鸦片控制权",
        "payer": "林则徐，他在逻辑混乱中被下属视为’健忘总督’，威信略降"
      }
    },
    {
      "id": "C",
      "powerId": "stop-time",
      "displayLabel": "停时十刻密会义律",
      "label": "你在钦差行辕客厅面对所有幕僚与外商代表时，停止时间，现场除你之外的一切完全静止十分钟，你利用这段时间走到义律身边，从他怀中取出一封伦敦来函，读完后再放回，然后退回原位让时间恢复。",
      "intent": "时间暂停让你不惊动任何人获取关键密信，在谈判桌上引爆准确情报。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "打一个清脆的响指，时间凝固，你穿过静止的人群走到义律身边搜出密信",
        "target": "义律怀中的伦敦外交部密函",
        "deadline": "谈判破裂前，即销烟仪式前最后一次会面期间"
      },
      "instantEcho": {
        "directResult": "时间恢复后你朗声引用伦敦来函说：‘巴麦尊子爵授权义律必要时使用武力’——义律脸色惨白。",
        "unexpectedCost": "你的响指声被义律的仆从听到，对方认定是你用了巫术，之后唆使广州民众对你进行人身攻击。",
        "beneficiary": "林则徐，他提前得知英国可能开战，立即加急奏报朝廷备战",
        "payer": "你，从此被义律及其随从日夜盯梢，随时有暗杀风险"
      }
    }
  ],
  "great-fire-rome-64": [
    {
      "id": "C",
      "powerId": "jump-tomorrow",
      "displayLabel": "跳到明天再拆屋",
      "label": "你让商铺区内三间堆满亚麻和油桶的木屋跳过未来二十四小时，直接抵达明天中午，从而避开此刻拆除引发的冲突，但火势仍蔓延进一步。",
      "intent": "跳过当下拆除矛盾，但火势会绕过跳跃区域继续蔓延，未能根本解决问题。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定三间特定木屋",
        "target": "商铺区内三间堆满亚麻和油桶的木屋",
        "deadline": "半个时辰内"
      },
      "instantEcho": {
        "directResult": "那三间木屋从原地消失，火势从两侧绕过跳跃区域继续蔓延。",
        "unexpectedCost": "居民的恐慌加剧，因为木屋失踪被视为神罚。",
        "beneficiary": "你暂时避免了与居民的冲突",
        "payer": "周围未跳跃的木屋被更快烧毁"
      }
    },
    {
      "id": "C",
      "powerId": "copy-skill",
      "displayLabel": "复制消防队长的疏导术",
      "label": "你复制了在场消防队长卢修斯二十年积累的火灾疏导技能，立刻用他的手势和吼声命令居民撤退到空场，成功组织起一条人链传递水桶。",
      "intent": "用专业权威瞬间赢得信任，突破消防队人少无法同时拆屋与疏导的瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制后立刻挥舞手势并吼出命令",
        "target": "消防队长卢修斯",
        "deadline": "半个时辰内"
      },
      "instantEcho": {
        "directResult": "居民自动退后，水桶传送线在两分钟内形成。",
        "unexpectedCost": "卢修斯本人因技能被复制而感到尊严受损，拒绝再服从你的指挥。",
        "beneficiary": "你能同时指挥拆屋与救火",
        "payer": "你与卢修斯的关系破裂"
      }
    },
    {
      "id": "C",
      "powerId": "control-weather",
      "displayLabel": "招来东风骤雨",
      "label": "你指定大竞技场上空未来二十四小时转为东南风，风速三级，并伴有中雨，淋湿了商铺区的木屋顶，减缓火势向山坡住宅推进。",
      "intent": "改变风向和湿度，阻止火势蔓延并降低木屋可燃度，争取拆屋时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "双手向天空张开，命令风向转为东南，风速三级，并降下中雨",
        "target": "大竞技场上空方圆百公里",
        "deadline": "半个时辰内"
      },
      "instantEcho": {
        "directResult": "雨落在起火区，火焰高度降低，火头转向南面空地。",
        "unexpectedCost": "雨水使街道泥泞，消防车和运水马车陷入泥中。",
        "beneficiary": "山坡住宅区的贵族",
        "payer": "消防队需要额外劳力推车"
      }
    },
    {
      "id": "C",
      "powerId": "see-hidden-writing",
      "displayLabel": "看见水利署的防火令",
      "label": "你看见市政官萨图尔尼努斯三年前签署的防火令被埋在档案室灰烬下，其中规定“任何主管可先拆屋后补令”，你立刻举起这行字向居民展示。",
      "intent": "发现隐藏的书面授权，强行解除拆除阻力。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "注视被烧焦的档案室遗址，读出隐藏文字",
        "target": "市政官萨图尔尼努斯签署的防火令",
        "deadline": "半个时辰内"
      },
      "instantEcho": {
        "directResult": "你高声念出“可先拆屋后补令”，居民安静并让步。",
        "unexpectedCost": "萨图尔尼努斯赶来后否认该令，要求你支付罚款。",
        "beneficiary": "你获得了法律依据",
        "payer": "你的个人声誉面临伪令争议"
      }
    },
    {
      "id": "C",
      "powerId": "pocket-building",
      "displayLabel": "收走林立的木屋",
      "label": "你把商铺区中心十三座相连的木屋收入随身口袋，原地露出一片空白防火带，火势被阻断。",
      "intent": "物理清除火源和可燃物，一次性解决防火带问题。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "伸手触碰第一座木屋的门框，十三座木屋瞬间消失",
        "target": "商铺区中心十三座相连的木屋",
        "deadline": "半个时辰内"
      },
      "instantEcho": {
        "directResult": "防火带形成，火势无法越过空白区域。",
        "unexpectedCost": "木屋中的一家七口和三名商人一同被收入口袋，引发失踪恐慌。",
        "beneficiary": "山坡住宅免遭火灾",
        "payer": "失踪者的亲属控告你施行巫术"
      }
    },
    {
      "id": "C",
      "powerId": "restore-youth",
      "displayLabel": "让老消防员重返壮年",
      "label": "你让筋疲力尽的老消防员马库斯年轻四十年，他瞬间恢复三十岁体力，独自扛起木梁撞开障碍，并带领小分队连拆五栋屋。",
      "intent": "用体力突破老人乏力拆不动的瓶颈，直接扩大防火带。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向马库斯并说出年轻化词句",
        "target": "老消防员马库斯",
        "deadline": "半个时辰内"
      },
      "instantEcho": {
        "directResult": "马库斯变得精悍有力，连续撞开障碍，拆屋速度翻倍。",
        "unexpectedCost": "马库斯因身体骤变而眩晕，记不清新力气的使用方法。",
        "beneficiary": "消防队获得一个超级劳力",
        "payer": "马库斯本人年老的家人在消防队外感到惊愕"
      }
    }
  ],
  "fall-rome-476": [
    {
      "id": "C",
      "powerId": "heal-room",
      "displayLabel": "治愈拉文纳全宫伤病",
      "label": "你带药箱走进皇宫大厅，在罗慕路斯交出冠冕前，让他以及所有受病痛折磨的元老、士兵、侍从当场痊愈，并为奥多亚塞的卫队医好一个发炎的伤口。",
      "intent": "用治愈获取人心，争取暂缓废黜",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "走进大厅，命令所有伤病患者聚集，双手施展治愈能力",
        "target": "罗慕路斯·奥古斯都、奥多亚塞、在场伤兵",
        "deadline": "皇帝交出冠冕前"
      },
      "instantEcho": {
        "directResult": "罗慕路斯的大腿脓肿消退，老元老久病的咳嗽停止，三名奥多亚塞的士兵的刀伤愈合",
        "unexpectedCost": "你因过度消耗当场晕厥，被卫兵抬出",
        "beneficiary": "罗慕路斯、受伤士兵、元老院成员",
        "payer": "你自己"
      }
    },
    {
      "id": "C",
      "powerId": "conjure-water",
      "displayLabel": "为拉文纳掘出活泉",
      "label": "你在皇宫广场中央念出咒语，地面裂开涌出清泉，供所有市民、士兵、战马饮用；并直接端一瓢献给奥多亚塞，说这是上帝赐给西罗马最后一位皇帝的神迹。",
      "intent": "用神迹迫使奥多亚塞不敢废黜受神庇佑的皇帝",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在广场地面用力跺脚，引导泉水喷出",
        "target": "广场地面、在场市民、奥多亚塞",
        "deadline": "当天日落前"
      },
      "instantEcho": {
        "directResult": "一股清泉自石板缝涌出，人群惊呼为神迹，奥多亚塞愣住",
        "unexpectedCost": "泉水泛滥淹没了皇宫底层档案室，所有土地契约被毁",
        "beneficiary": "拉文纳市民、罗慕路斯",
        "payer": "后世法务官"
      }
    },
    {
      "id": "C",
      "powerId": "read-one-mind",
      "displayLabel": "窥探奥多亚塞真意",
      "label": "你借口呈递文书，走近奥多亚塞，凝视他的眼睛，在十秒内听见他内心所有真实想法：他是否怕东罗马报复，是否愿意留罗慕路斯当傀儡，以及他昨晚梦见什么。",
      "intent": "精准掌握对方底牌，以便提出他无法拒绝的条件",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "借呈递书记录靠近奥多亚塞，目光对视，启动读心",
        "target": "奥多亚塞",
        "deadline": "廷议结束前"
      },
      "instantEcho": {
        "directResult": "你‘听’见奥多亚塞真正担忧的是东罗马皇帝芝诺会派兵，他打算把皇冠送走以保平安，以及他非常喜欢罗慕路斯的妹妹",
        "unexpectedCost": "你因头脑过载鼻血直流，被卫兵怀疑是巫术",
        "beneficiary": "你自己",
        "payer": "你自己的健康"
      }
    },
    {
      "id": "C",
      "powerId": "blink-self",
      "displayLabel": "瞬移夺走皇冠",
      "label": "在奥多亚塞伸手要接过皇冠的瞬间，你带着手中一块旧布瞬移到皇冠旁边，抢先抓起皇冠，然后瞬移到广场高处，向所有人展示西罗马皇冠还在，你们仍有一个皇帝。",
      "intent": "直接物理阻止退位仪式",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "当奥多亚塞的手靠近皇冠时，你瞬移到宝座前抓起皇冠",
        "target": "西罗马皇冠",
        "deadline": "奥多亚塞碰触皇冠之前"
      },
      "instantEcho": {
        "directResult": "你一手持冠站在广场雕像上，人群骚动，士兵举弓指向你",
        "unexpectedCost": "你的瞬移引发小范围空气爆裂，震碎了附近三扇玻璃窗，碎片划伤一名元老的脸",
        "beneficiary": "罗慕路斯",
        "payer": "受伤的元老"
      }
    },
    {
      "id": "C",
      "powerId": "summon-future-self",
      "displayLabel": "召唤十年后的行政官",
      "label": "你从未来召来十年后已经经历此事的自己。那时的你已知道奥多亚塞最终选择、东罗马的反应、以及罗慕路斯的结局。你们两人共同向奥多亚塞展示一段未来片段，说服他保留共治皇室。",
      "intent": "用预知未来的证据动摇奥多亚塞的决策",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用匕首划破手指滴血，召唤未来自己；未来你凭空出现并开口说话",
        "target": "奥多亚塞、罗慕路斯",
        "deadline": "未来你只能停留一小时，必须在黄昏前说服"
      },
      "instantEcho": {
        "directResult": "未来你详细描述了奥多亚塞统治十三年后在拉文纳被暗杀的细节，奥多亚塞脸色惨白",
        "unexpectedCost": "未来你消失时带走了房间里的一副铠甲，导致你被指控参与盗窃",
        "beneficiary": "罗慕路斯、奥多亚塞（得知命运）",
        "payer": "你自己（被怀疑）"
      }
    },
    {
      "id": "C",
      "powerId": "invisibility",
      "displayLabel": "隐身盗走退位诏书",
      "label": "你隐身潜入奥多亚塞的书房，将已备好的那封‘致元老院宣布废黜’的诏书偷走，换上一封你事先写好的‘保留罗慕路斯为共治皇帝’的草案，然后现身将假诏书当众宣读。",
      "intent": "用文书替换直接变更历史记录",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "隐身进入书房，替换羊皮纸诏书",
        "target": "奥多亚塞的退位诏书",
        "deadline": "退位仪式开始前"
      },
      "instantEcho": {
        "directResult": "你在大殿上展开假诏书宣读，奥多亚塞愣住，罗慕路斯被宣布为共治皇帝",
        "unexpectedCost": "隐身期间你撞倒一盏油灯，引发小火，烧掉了半张东罗马使节送来的地图",
        "beneficiary": "罗慕路斯",
        "payer": "东罗马使节（地图被毁）"
      }
    }
  ],
  "constantinople-1453": [
    {
      "id": "C",
      "powerId": "command-animals",
      "displayLabel": "号令信鸽撞灭引信",
      "label": "你命令全城信鸽扑向奥斯曼巨炮的火绳，用身体撞灭引信，为黎明前破裂的城墙争取最后三刻钟的寂静。",
      "intent": "用密集的活体扑杀阻断敌军最致命的火炮开火，让城墙修补成为可能。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "向方圆十公里内所有信鸽下达共同命令",
        "target": "奥斯曼巨炮的火绳与引信",
        "deadline": "1453年5月29日黎明前"
      },
      "instantEcho": {
        "directResult": "数千只信鸽从圣罗曼努斯门飞扑向奥斯曼炮阵，巨炮火绳被撞灭，火炮无法发射。",
        "unexpectedCost": "信鸽全部撞死，城内从此失去与外界通信的鸟类。",
        "beneficiary": "圣罗曼努斯门守军（包括朱斯蒂尼亚尼）",
        "payer": "城内所有信鸽"
      }
    },
    {
      "id": "C",
      "powerId": "rust-weapons",
      "displayLabel": "锈蚀奥斯曼填壕铲",
      "label": "你让苏丹亲兵手中的铲镐瞬间锈毁，使他们无法在黎明前填平护城壕沟，云梯无法搭到城墙根。",
      "intent": "废除敌军攻城器械的辅助工具，拖延填壕进度，让城墙缺口相对安全。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让方圆一公里内所有金属铲镐同时锈毁",
        "target": "奥斯曼亲兵手中的填壕铲和镐",
        "deadline": "1453年5月29日黎明前"
      },
      "instantEcho": {
        "directResult": "奥斯曼工兵阵中所有金属铲镐锈成废铁，无法继续挖掘。",
        "unexpectedCost": "锈蚀波误伤城内守军备用兵器，部分刀剑也轻微锈损。",
        "beneficiary": "圣罗曼努斯门守军",
        "payer": "城内守军少数生锈兵器"
      }
    },
    {
      "id": "C",
      "powerId": "guarantee-action",
      "displayLabel": "确保火药线必引燃",
      "label": "你发誓自己下一步点燃火药线的动作绝对成功且无人能阻，奥斯曼巨炮缺口前的爆破将准时推进。",
      "intent": "确保唯一一次反攻尝试不会因火药受潮或敌方干预而失败，强行改变城墙崩塌的节奏。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "承诺自己下一次点燃火药线的动作必然成功",
        "target": "圣罗曼努斯门缺口前埋设的火药引信",
        "deadline": "1453年5月29日黎明前"
      },
      "instantEcho": {
        "directResult": "你亲手点燃的火药线一路燃烧，引爆了缺口下方炸药，炸飞了前沿奥斯曼士兵。",
        "unexpectedCost": "爆破震塌了部分城墙，使缺口反而扩大，紧急修补材料耗尽。",
        "beneficiary": "缺口前的守军突击队",
        "payer": "城墙结构本身"
      }
    },
    {
      "id": "C",
      "powerId": "walk-through-walls",
      "displayLabel": "穿城墙送出求援信",
      "label": "你带着一封密信直接穿过圣罗曼努斯门城墙，抵达城外海路，向迟迟不来的威尼斯舰队求救。",
      "intent": "突破奥斯曼陆海军双重封锁，将求援信送到城外航海势力，尝试改变援军不来的历史。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "带着求援信穿过城墙与城门",
        "target": "圣罗曼努斯门城墙之外的威尼斯舰队方向",
        "deadline": "1453年5月29日黎明前"
      },
      "instantEcho": {
        "directResult": "你穿墙而出，躲过奥斯曼哨兵，将密信投入海中用浮瓶向金角湾方向传递。",
        "unexpectedCost": "穿墙技能只能持续一小时，你返回时城墙已经部分坍塌，你被巨石压住腿部。",
        "beneficiary": "城中原求援迷惘者（包括朱斯蒂尼亚尼）",
        "payer": "你本人腿部受伤"
      }
    },
    {
      "id": "C",
      "powerId": "immortal-day",
      "displayLabel": "赐皇帝一日不死",
      "label": "你对皇帝君士坦丁十一世施以不死赐福，使他在二十四小时内无法死亡或失去意识，即使重伤也不会陨落。",
      "intent": "保护拜占庭最高统帅在激战中不倒下，维持守军士气与指挥链，避免皇帝战死引发的溃散。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定皇帝君士坦丁十一世为不死者",
        "target": "君士坦丁十一世·帕里奥洛格斯",
        "deadline": "1453年5月29日黎明至24小时后"
      },
      "instantEcho": {
        "directResult": "皇帝在缺口混战中连中数剑却依旧站立指挥，守军士气大振。",
        "unexpectedCost": "不死效果仅作用于本人，其部下仍然伤亡惨重，粮草弹药照常耗尽。",
        "beneficiary": "君士坦丁十一世",
        "payer": "皇帝周围战死的亲兵"
      }
    },
    {
      "id": "C",
      "powerId": "transmute-material",
      "displayLabel": "变缺口砖石为青金石",
      "label": "你触摸城墙缺口处一块砖石，将它永久变成坚不可摧的青金石，使奥斯曼巨炮再也无法扩大缺口。",
      "intent": "直接改造城墙缺口材料为更坚固的矿物，物理上堵住唯一的突破点。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定缺口处一块砖石改变其材料",
        "target": "圣罗曼努斯门城墙缺口最脆弱的一块砖石",
        "deadline": "1453年5月29日黎明前"
      },
      "instantEcho": {
        "directResult": "那块砖石闪耀着蓝色光芒，变成青金石，火炮射中后只崩出碎屑，缺口被短暂堵住。",
        "unexpectedCost": "青金石过于珍贵，招致奥斯曼士兵对那片区域疯狂集火，周围木制掩体起火。",
        "beneficiary": "缺口后方的守军士兵",
        "payer": "被大火波及的附近木质民居"
      }
    }
  ],
  "columbus-1492": [
    {
      "id": "C",
      "powerId": "summon-lightning",
      "displayLabel": "雷电击中圣玛丽亚号船钟",
      "label": "你召下一道雷电，精准劈中圣玛丽亚号桅杆顶端的铜钟，钟声炸裂后碎片如雨落下，震醒了所有船员，也让哥伦布惊愕抬头，正好错过了船头方向泰诺人点燃的火把信号。",
      "intent": "用巨响和混乱打断哥伦布清晨登陆命令下达前的平静，迫使他在日出前重新判断局势。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "朝圣玛丽亚号桅杆顶端铜钟伸手，一道闪电斜劈而下，钟身炸裂。",
        "target": "圣玛丽亚号船钟",
        "deadline": "日出前，哥伦布召集船长议事之时"
      },
      "instantEcho": {
        "directResult": "铜钟炸碎，碎片坠落砸伤两名水手，全船陷入恐慌，哥伦布中止了甲板上的登陆装备准备。",
        "unexpectedCost": "突如其来的碎裂声导致值班舵手短暂失控，船体偏离航线小半海里。",
        "beneficiary": "泰诺人在岸上的观察哨",
        "payer": "圣玛丽亚号上的两名轻伤水手"
      }
    },
    {
      "id": "C",
      "powerId": "share-memory",
      "displayLabel": "共享泰诺村庄被屠记忆",
      "label": "你让哥伦布、船长及全体骨干船员在一分钟内亲眼目睹一段真实记忆：十年后另一批西班牙人登岛，用火绳枪扫射赤手空拳的泰诺村民，老人和儿童倒在血泊中，空气里满是茅草燃烧的焦味。",
      "intent": "让决策者提前烙下殖民暴行的画面，使‘宣告占领并捕获当地人’的命令在他们心中先于行动被定罪。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将手放在哥伦布和两名船长的额头，同时闭眼，在所有人的意识中播出那段记忆影像。",
        "target": "哥伦布、平塔号船长平松及尼尼亚号船长，以及随船神父、军士长共七人",
        "deadline": "日出前最后商议时刻"
      },
      "instantEcho": {
        "directResult": "七人同时脸色苍白，有人干呕，哥伦布抓住栏杆的手指关节发白，沉默片刻后低声命令‘暂缓登陆’。",
        "unexpectedCost": "记忆冲击过强，三名下级军官在接下来两小时内无法有效指挥，士气低落。",
        "beneficiary": "即将靠岸的泰诺人第一支交涉小队",
        "payer": "被强制观看记忆的七名决策者"
      }
    },
    {
      "id": "C",
      "powerId": "door-anywhere",
      "displayLabel": "开一扇通往西班牙王宫的门",
      "label": "你在圣玛丽亚号船舱的木墙上凭空打开一扇门，另一边赫然是西班牙王宫的内廷，空气里带着宫殿的香料气息，你一步跨过门槛，直面向伊莎贝拉女王和费迪南国王禀报此处有一个尚不知欧洲存在的和平民族。",
      "intent": "让殖民决策跳出远洋船长权限，直接暴露给王权终极仲裁者，迫使哥伦布失去单方面宣告占领的机会。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "把手按在船舱内壁的木板上，默念王宫方位，木板裂开一道发光的门缝并迅速扩大为一扇可容人过的门。",
        "target": "西班牙卡斯蒂利亚王国王宫议事厅地板上的十字花纹处",
        "deadline": "日落前（但门仅存十分钟，你必须在第一批人通过前完成面陈）"
      },
      "instantEcho": {
        "directResult": "你直接见到女王和国王，用西班牙语简要报告新大陆和原住民社群，女王当场下达密旨‘未经王庭特许不得对岸民行征服之礼’。",
        "unexpectedCost": "门消失前有两只海鸟飞入王宫，引致一名侍从受惊摔倒；哥伦布在船上看到你从没出现的门返回，信念动摇，后续数日产生怀疑。",
        "beneficiary": "泰诺人的卡西克（酋长）瓜卡纳加里克斯",
        "payer": "你本人——女王要求你留在王宫详述见闻，但你选择返回船上，此后被哥伦布视为不可靠记录官"
      }
    },
    {
      "id": "C",
      "powerId": "age-target",
      "displayLabel": "让哥伦布老去四十年",
      "label": "你凝视着正在甲板上远眺火光的哥伦布，发动能力——他的脊背瞬间佝偻，花白胡须垂到胸前，皮肤干枯如老橡树皮，只剩下记忆中的地理知识和野心，却失去了强行登陆的体力，连握剑的手指都在颤抖。",
      "intent": "让征服行动因指挥者体能崩溃而自动延期，给和平接触留出窗口。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "盯着哥伦布的背影，双手十指交叉，低声说出‘未来四十年’，随即他身体急剧衰老。",
        "target": "哥伦布",
        "deadline": "日出前，他正要下令放下登岸小艇时"
      },
      "instantEcho": {
        "directResult": "哥伦布当场倒地，无法站立，军医检查后认为‘至少六十岁，不宜劳累’，登陆指挥权暂时转移给平松船长。",
        "unexpectedCost": "哥伦布衰老后心智仍然清醒，他愤怒地指控你使用巫术，你和你的家族将面临宗教法庭追查。",
        "beneficiary": "平松与泰诺人达成临时协议，三天后带少量货物交换补给而无需武力",
        "payer": "你本人——被全船视为‘弄臣施咒者’隔离监视"
      }
    },
    {
      "id": "C",
      "powerId": "universal-language",
      "displayLabel": "听懂泰诺语并现学现翻",
      "label": "你突然听懂了远处岸上传来的泰诺人对话，他们正担忧‘巨大漂浮房屋’是否带有邪灵；你立即走到船头，用刚学会的泰诺语大声喊出‘我们是凡人，只来探寻香料，不会伤害你们’，并用手势比划交换物品。",
      "intent": "在哥伦布下达正式命令前建立跨语言沟通，使宣告占领变得荒谬——因为你已经用对方的语言给出了和平承诺。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "凝神倾听岸风送来的音节，摊开双手向火光方向用泰诺语喊出完整句子。",
        "target": "泰诺人的沿岸哨兵及卡西克派出的独木舟使者",
        "deadline": "哥伦布准备把国王书信放入铅筒供奉的仪式之前"
      },
      "instantEcho": {
        "directResult": "独木舟上的人听到后停止划桨，一人用泰诺语回复‘你们是天上来的吗？’—双方交换了几个词，确立了第二天互赠礼物的约定。",
        "unexpectedCost": "你用泰诺语说话时，船员和哥伦布震惊甚至恐惧，怀疑你被当地神灵附身，船医要为你进行驱魔祷告。",
        "beneficiary": "泰诺人首领及其族人",
        "payer": "你——此后船上的宗教氛围恶化，你被要求每日祈祷检验信仰"
      }
    },
    {
      "id": "C",
      "powerId": "intangible-walls",
      "displayLabel": "让船舱的武器库失去墙壁",
      "label": "你把手按在装载火绳枪、剑和盔甲的舱室舱壁上，默念能力——船壁木板和舱门瞬间变得如空气般可通过，所有武器哗啦啦掉落在甲板上，你站在散落的枪械中说‘这些铁器一旦上岸，会让我们永远背罪’。",
      "intent": "用武器物理不可锁存的方式，迫使哥伦布无法隐藏登陆武力，船上所有人眼睁睁看到军备散落，任何‘不携带武器’的承诺都不再可信。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "走到武器舱门外，双手同时插入木板，用力向两侧推开，板壁像薄纱一样撕裂开。",
        "target": "圣玛丽亚号下层武器库的木制隔舱和门扇",
        "deadline": "哥伦布清晨宣布‘只带外交信物和礼器登岸’前"
      },
      "instantEcho": {
        "directResult": "火枪、长剑、钢盾乒乒乓乓滚落甲板，多名船员跑来捡拾，哥伦布暴怒却无法否认船上确有武装，全体船员都清楚‘这次登岸不可能不带武器’。",
        "unexpectedCost": "一把火绳枪走火击中上舱水桶，水桶破裂淹了一部分饼干储备。",
        "beneficiary": "泰诺人的侦察独木舟——他们在远处看到武器闪光并立即撤回报告",
        "payer": "圣玛丽亚号的饼干库存减少三分之一"
      }
    }
  ],
  "luther-1517": [
    {
      "id": "C",
      "powerId": "enlarge-object",
      "displayLabel": "放大印刷机整版排字",
      "label": "你趁商车未发，将维滕贝格城堡教堂内满载论纲的印刷机排字盘放大一百倍，使其压印速度骤增，一夜印出百万份德语传单。",
      "intent": "放大排字盘突破印刷产能瓶颈，使论纲在黎明前即可装车。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触碰到排字盘并发动放大",
        "target": "路德委托的印刷机上的排字盘",
        "deadline": "开往莱比锡的商车黎明出发前"
      },
      "instantEcho": {
        "directResult": "排字盘瞬间膨胀百倍，印刷机一次压印即可产出相当于原机百倍的页码。",
        "unexpectedCost": "排字盘膨胀撕裂了印刷机房的门框和屋顶，部分铅字散落弹出。",
        "beneficiary": "路德和即将上车的商车车夫",
        "payer": "你当下的工作环境"
      }
    },
    {
      "id": "C",
      "powerId": "sentence-becomes-true",
      "displayLabel": "使路德论纲成为城内法",
      "label": "你写下一句‘维滕贝格城内禁止出售赎罪券’，并贴于教堂大门，黎明起该城赎罪券销售将被实际禁止。",
      "intent": "直接取消赎罪券销售来验证论纲第一条，加速宗教辩论爆发。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用鹅毛笔蘸墨写下该句并贴于教堂大门",
        "target": "城堡教堂大门上的公示板",
        "deadline": "黎明前商车出发的时刻"
      },
      "instantEcho": {
        "directResult": "字句金光闪过，所有教士和商人发现赎罪券匣自动锁死，无法打开或销售。",
        "unexpectedCost": "教会税收官当即记录违命事件，路德将面临更早的传唤与处罚。",
        "beneficiary": "被推销赎罪券的平民",
        "payer": "路德本人"
      }
    },
    {
      "id": "C",
      "powerId": "jump-tomorrow",
      "displayLabel": "让论纲直接送到莱比锡",
      "label": "你抓起一捆论纲，对其发动跳跃，让它跳过今晚的商车行程，直接出现在明天莱比锡市政厅门前。",
      "intent": "跳过运输时间，即刻引发莱比锡辩论，避免论纲在途中被扣押。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "抓起一捆印好的论纲并低语让其跳跃",
        "target": "一捆印好的德语论纲",
        "deadline": "商车尚未装货前"
      },
      "instantEcho": {
        "directResult": "论纲原地消失，下一秒出现在莱比锡市政厅台阶上，被晨起的面包师发现并高声朗读。",
        "unexpectedCost": "该捆论纲附带的运输记录和收信人地址丢失，需要路德重新手写说明。",
        "beneficiary": "莱比锡大学神学系学生",
        "payer": "你此刻的印刷交付记录"
      }
    },
    {
      "id": "C",
      "powerId": "copy-skill",
      "displayLabel": "复制路德修辞学绝技",
      "label": "你复制路德的拉丁文论辩修辞与神学知识，亲自执笔将论纲从学术拉丁语重构为通俗德语短句，一晚完成百份译稿。",
      "intent": "复制路德的修辞技巧以快速完成德语版本，突破翻译人手短缺的瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "凝视路德在烛光下修改段落，窃取其实力",
        "target": "路德正在修改的拉丁文底稿",
        "deadline": "黎明前最后一趟校对"
      },
      "instantEcho": {
        "directResult": "你瞬间通晓路德全部论辩结构和拉丁文句法，连夜译出九十五条并直接交付排版。",
        "unexpectedCost": "你随后连续头痛一日，因为大脑超负荷存储了太多神学术语。",
        "beneficiary": "路德和他雇用的印刷工",
        "payer": "你的身体健康"
      }
    },
    {
      "id": "C",
      "powerId": "control-weather",
      "displayLabel": "唤来大雾掩护装车",
      "label": "你呼叫一场浓雾，笼罩维滕贝格一整日，让教会巡查人员看不清印刷工坊的夜间作业。",
      "intent": "用天气掩盖印刷和装车行为，防止教会当局提前干预。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "向空中举手唤起水汽",
        "target": "维滕贝格上空方圆十里的天气",
        "deadline": "天色全黑，商车预计装货前"
      },
      "instantEcho": {
        "directResult": "浓雾瞬时包裹城市，街灯变成黄圈，巡夜人因视线不佳绕过印刷坊。",
        "unexpectedCost": "大雾持续到次日午后，导致原本从维滕贝格送出的其他信件也延迟半天。",
        "beneficiary": "路德和所有秘密印刷工",
        "payer": "城里其他需要外寄信件的居民"
      }
    },
    {
      "id": "C",
      "powerId": "see-hidden-writing",
      "displayLabel": "看见教会销毁的禁令",
      "label": "你凝视教堂内被石灰覆盖的墙字，发现美因茨大主教已签署一封秘密信令：只要发现路德传播异端，格杀勿论。",
      "intent": "提前获知教会秘密镇压计划，让路德调整措辞避免直接叛逆。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用手轻触教堂内壁的灰泥表层",
        "target": "教堂门厅内一面刚粉刷过的墙壁下压着旧信笺",
        "deadline": "商车出发前最后一小时"
      },
      "instantEcho": {
        "directResult": "你眼前浮现出被石灰掩盖的拉丁文信件全文，日期是1517年10月28日，落款为大主教阿尔布雷希特。",
        "unexpectedCost": "你读后惊恐尖叫，引来两名修士盘问，不得不用运纸谎话支开他们。",
        "beneficiary": "路德和车夫（可根据线索选择推迟发货）",
        "payer": "你的短暂暴露风险"
      }
    }
  ],
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
  "newton-principia-1687": [
    {
      "id": "C",
      "powerId": "swap-two-people",
      "displayLabel": "交换哈雷与排版工",
      "label": "你与哈雷瞬间交换位置和随身物品，让他直面错位公式的排印架，你则坐在他的资助桌前。",
      "intent": "利用身份交换让哈雷立即发现符号错误并亲自决策，绕过冗长的审批环节。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "与哈雷交换位置和随身物品",
        "target": "哈雷",
        "deadline": "两个时辰后装订"
      },
      "instantEcho": {
        "directResult": "哈雷出现在排印架前，手指按在出错公式上，命令停机重排。",
        "unexpectedCost": "你的旧靴子掉在哈雷桌下，被他妻子误当作垃圾扔掉。",
        "beneficiary": "牛顿的理论准确度",
        "payer": "你失去一双靴子"
      }
    },
    {
      "id": "C",
      "powerId": "repeat-minute",
      "displayLabel": "重排出错的那个分钟",
      "label": "你让校对发现符号错误的那一刻反复重来九十九次，直到你找到最快重排方案且无后续冲突。",
      "intent": "通过时间循环试错找到最佳停机重排时机，避免延期与印刷冲突。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "重复发现错误的同一分钟",
        "target": "排印车间的钟表",
        "deadline": "两个时辰后装订"
      },
      "instantEcho": {
        "directResult": "第九十九次循环后，你精准喊出重排指令，铅字在半小时内更换完毕。",
        "unexpectedCost": "你因过度紧张咬破嘴唇，鲜血滴在废弃样稿上。",
        "beneficiary": "装订工完成了首批数量",
        "payer": "你的口腔溃疡"
      }
    },
    {
      "id": "C",
      "powerId": "command-animals",
      "displayLabel": "号令皇家学会的老鼠",
      "label": "你命令方圆十里所有老鼠同时咬断印刷厂内所有版本中出错公式对应的铅字模。",
      "intent": "用老鼠精确破坏错误铅字，迫使工人们必须重排正确版本。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "下达命令让老鼠咬断特定铅字",
        "target": "印刷厂的铅字架",
        "deadline": "两个时辰后装订"
      },
      "instantEcho": {
        "directResult": "三十二枚错误铅字被啮断，工头怒吼着重排正确公式。",
        "unexpectedCost": "三只老鼠掉进油墨缸，黑色油墨溅到牛顿序言页上，需重印。",
        "beneficiary": "哈雷避免了错误传播",
        "payer": "印刷工清理油墨且损失序言页"
      }
    },
    {
      "id": "C",
      "powerId": "rust-weapons",
      "displayLabel": "锈蚀克莱尔的手枪",
      "label": "你让印刷厂外克莱尔勋爵腰间手枪瞬间锈毁，他无法威胁哈雷撤回资助。",
      "intent": "消除外部武力胁迫，确保哈雷不因人身安全撤回出版经费。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "锈蚀克莱尔勋爵的手枪",
        "target": "克莱尔勋爵",
        "deadline": "两个时辰后装订"
      },
      "instantEcho": {
        "directResult": "克莱尔拔枪时枪管碎裂成锈片，他惊愕地空手挥舞。",
        "unexpectedCost": "仓库中铁钉、铰链同步锈蚀，一个书架倒塌砸坏十页校样。",
        "beneficiary": "哈雷的资助决策自由",
        "payer": "印刷厂赔偿损坏校样"
      }
    },
    {
      "id": "C",
      "powerId": "guarantee-action",
      "displayLabel": "保证重排版一次成功",
      "label": "你指定自己接下来将错误公式重新排印件放入正确版面的动作必定成功且无人干扰。",
      "intent": "确保唯一的重排操作零误差完成，彻底消除校对漏洞。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将正确铅字插入错误位置",
        "target": "第十二章第三节的公式行",
        "deadline": "两个时辰后装订"
      },
      "instantEcho": {
        "directResult": "你的镊子夹住正确铅字精准落入行内，无手指抖误，无人撞到你。",
        "unexpectedCost": "你的右手因过度用力痉挛，之后三天无法握笔签字。",
        "beneficiary": "最后一摞印张内容正确",
        "payer": "你右手暂时残疾"
      }
    },
    {
      "id": "C",
      "powerId": "walk-through-walls",
      "displayLabel": "穿过皇家学会档案室墙壁",
      "label": "你与哈雷穿过封闭的档案室墙壁，取出牛顿亲笔手稿中正确的公式进行对照。",
      "intent": "突破物理封锁，直接获取权威底稿作为重排依据，避免争议。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "带哈雷穿墙进入档案室",
        "target": "皇家学会档案室墙壁",
        "deadline": "两个时辰后装订"
      },
      "instantEcho": {
        "directResult": "你和哈雷穿墙而入，他径直抽出牛顿1665年手稿，公式与目前重排版一致。",
        "unexpectedCost": "穿墙过程顶翻煤油灯，燃起小火，哈雷手臂被灼伤。",
        "beneficiary": "印刷工不必再猜度正确版本",
        "payer": "哈雷左臂轻度烫伤"
      }
    }
  ],
  "bastille-1789": [
    {
      "id": "C",
      "powerId": "rewind-hour",
      "displayLabel": "回退到荣军院夺枪后",
      "label": "发动倒退能力，让巴士底狱广场和城堡内部回到一小时前，那时守军尚未警戒，你刚随众人从荣军院取得武器，你可以独自潜入，在两小时内安全撤出火药和七名囚犯。",
      "intent": "回到警戒升级前，避免正面冲突，利用时间差夺取火药。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动回退能力，将巴士底狱广场及城堡状态重置到9时",
        "target": "巴士底狱及其守军总督德劳内",
        "deadline": "谈判破裂前瞬间"
      },
      "instantEcho": {
        "directResult": "你和七名囚犯带着全部火药出现在巴士底狱外，城堡大门紧闭。",
        "unexpectedCost": "你的身体因时间回溯出现剧烈头痛，数小时内无法清晰思考。",
        "beneficiary": "巴黎市民武装和七名囚犯",
        "payer": "你本人"
      }
    },
    {
      "id": "C",
      "powerId": "shapeshift",
      "displayLabel": "变成德劳内贴身卫兵",
      "label": "变成德劳内最信任的卫兵，走进城堡命令守军打开火药库门，让你在两小时内将火药和囚犯转移出狱。",
      "intent": "利用易容伪造上级命令，避免交火。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "变形成德劳内的一名贴身卫兵，进入城堡下达转移命令",
        "target": "巴士底狱守军和总督德劳内",
        "deadline": "守军与人群谈判破裂前"
      },
      "instantEcho": {
        "directResult": "守军打开火药库，你指挥搬出火药和囚犯，人群欢呼。",
        "unexpectedCost": "真正的卫兵发现后报告德劳内，德劳内开始怀疑内部有叛徒，加强戒严。",
        "beneficiary": "巴黎市民武装和囚犯",
        "payer": "被冒名顶替的卫兵"
      }
    },
    {
      "id": "C",
      "powerId": "summon-lightning",
      "displayLabel": "雷击炸开城门铁锁",
      "label": "召唤一道雷电精确击中巴士底狱主城门铁锁，铁锁熔断、城门洞开，人群在两小时内涌入城堡夺取火药和释放囚犯。",
      "intent": "瞬间摧毁城门，避免谈判破裂后的巷战。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向巴士底狱正门铁锁，召唤雷电击中",
        "target": "巴士底狱城门铁锁",
        "deadline": "谈判破裂前一刻"
      },
      "instantEcho": {
        "directResult": "城门轰然倒下，人群冲入，火药和囚犯得到控制。",
        "unexpectedCost": "雷电击中了附近一名市民，造成烧伤，引发部分人群恐慌。",
        "beneficiary": "巴黎市民武装",
        "payer": "被误伤的市民"
      }
    },
    {
      "id": "C",
      "powerId": "share-memory",
      "displayLabel": "共享凡尔赛宫密令记忆",
      "label": "让巴士底狱内外所有人同时体验你三天前在凡尔赛宫亲眼所见：路易十六签署密令，要求守军一旦人群靠近就开炮镇压，不留活口。",
      "intent": "用真实记忆激发人群恐惧和愤怒，迫使守军投降。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "向巴士底狱广场所有人共享你三天前在凡尔赛宫的记忆",
        "target": "守军和巴黎市民全体在场人员",
        "deadline": "谈判破裂前的最后时刻"
      },
      "instantEcho": {
        "directResult": "守军观看记忆后士气崩溃，放下武器打开火药库，囚犯被释放。",
        "unexpectedCost": "记忆体验让一名老年市民心脏病发作倒地，需要紧急救治。",
        "beneficiary": "巴黎市民武装和七名囚犯",
        "payer": "受到惊吓的老年市民"
      }
    },
    {
      "id": "C",
      "powerId": "door-anywhere",
      "displayLabel": "墙上开门直通市政厅武器库",
      "label": "在巴士底狱外墙上打开一扇通往巴黎市政厅武器库的门，人群在两小时内将火药和囚犯转移到市政厅，避免被守军包围。",
      "intent": "瞬间开辟通道绕过城门，实现快速转移。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在巴士底狱外墙上开一扇门，连接巴黎市政厅武器库",
        "target": "巴士底狱外墙和巴黎市政厅",
        "deadline": "谈判破裂前"
      },
      "instantEcho": {
        "directResult": "人群通过门将火药和囚犯运至市政厅，巴士底狱失去威胁。",
        "unexpectedCost": "门存在十分钟后有市民涌入市政厅，引发市政厅内部混乱，一名职员被踩伤。",
        "beneficiary": "巴黎市民武装和囚犯",
        "payer": "市政厅职员"
      }
    },
    {
      "id": "C",
      "powerId": "age-target",
      "displayLabel": "让总督德劳内衰老四十年",
      "label": "让巴士底狱总督德劳内的身体瞬间衰老四十年，白发、气喘、手抖，他在两小时内无力指挥守军，无法下令开火，你趁机带人进入城堡撤出火药和囚犯。",
      "intent": "瘫痪指挥官，使其无法执行镇压命令。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向巴士底狱城楼上的总督德劳内，触发衰老",
        "target": "总督德劳内",
        "deadline": "谈判破裂前一刻"
      },
      "instantEcho": {
        "directResult": "德劳内跌坐在地，守军陷入混乱，人群打开城门进入，释放囚犯并控制火药。",
        "unexpectedCost": "德劳内因突然衰老引发心脏病，数日内死亡，导致日后历史记录中他的死亡方式有争议。",
        "beneficiary": "巴黎市民武装和囚犯",
        "payer": "德劳内本人"
      }
    }
  ],
  "waterloo-1815": [
    {
      "id": "C",
      "powerId": "revive-dead",
      "displayLabel": "复活拉马克伯爵",
      "label": "你让滑铁卢战死的拉马克将军复活，他立刻率部冲击威灵顿左翼，迫使英军抽调预备队，为近卫军突破创造窗口。",
      "intent": "突破威灵顿反斜面防线需要新锐指挥和兵力，复活的拉马克能立即投入战斗。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复活",
        "target": "昨日在四臂村战死的拉马克将军",
        "deadline": "普鲁士先锋已出现在右翼"
      },
      "instantEcho": {
        "directResult": "拉马克将军携带生前部下突然出现在英军左翼后方，威灵顿被迫抽调一个旅应对。",
        "unexpectedCost": "你耗尽心力无法再分析普鲁士军动向，格鲁希元帅的援军何时到来成为谜题。",
        "beneficiary": "拿破仑的中央突破计划",
        "payer": "你的参谋视野"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-grain",
      "displayLabel": "涌出燕麦填饱法军",
      "label": "你命令后勤官将大炮弹药箱清空，箱内不断涌出新鲜燕麦，法军士兵饱餐后士气高涨，冲锋速度加快。",
      "intent": "破解法军因雨后泥泞和长时间作战导致的体力透支，用即时补给恢复冲击力。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "命令后勤官清空弹药箱并让箱子涌出燕麦",
        "target": "拿破仑近卫军炮兵阵地的弹药箱",
        "deadline": "普鲁士先锋已出现在右翼"
      },
      "instantEcho": {
        "directResult": "近卫军士兵吃饱后精神抖擞，冲锋时速度提升，威灵顿防线出现动摇迹象。",
        "unexpectedCost": "燕麦涌出过多，部分被英军捡获补给，他们同样恢复体力，普鲁士军也分走一队马匹。",
        "beneficiary": "法军近卫军士兵",
        "payer": "敌军也间接受益"
      }
    },
    {
      "id": "C",
      "powerId": "enlarge-object",
      "displayLabel": "放大拿破仑行军望远镜",
      "label": "你将拿破仑手中的黄铜望远镜放大百倍，横跨战场，他立刻看到英军防线后方预备队空虚，决定更改进攻方向。",
      "intent": "突破反斜面遮蔽的侦察盲区，让拿破仑看清威灵顿的真实兵力部署。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "放大",
        "target": "拿破仑手中的黄铜望远镜",
        "deadline": "普鲁士先锋已出现在右翼"
      },
      "instantEcho": {
        "directResult": "望远镜变成一座高塔，拿破仑攀爬上去看到威灵顿后方只有一个预备旅，决定集中近卫军冲击中央。",
        "unexpectedCost": "放大后的望远镜过于巨大，吸引了英军炮兵注意，法军阵地遭到更猛烈炮击，损失部分参谋军官。",
        "beneficiary": "拿破仑的决策准确性",
        "payer": "法军高级参谋伤亡"
      }
    },
    {
      "id": "C",
      "powerId": "sentence-becomes-true",
      "displayLabel": "写下格鲁希援军已到",
      "label": "你写下“格鲁希元帅率五万兵从东面抵达滑铁卢”，此成为现实，普军被夹击，威灵顿下令全面后撤。",
      "intent": "直接逆转普鲁士军到来的威胁，使战场态势变为法军优势。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "写下并宣告",
        "target": "格鲁希元帅与他的五万军队",
        "deadline": "普鲁士先锋已出现在右翼"
      },
      "instantEcho": {
        "directResult": "格鲁希的部队突然出现在普军后方开炮，布吕歇尔侧翼遭到攻击，法军士气大振。",
        "unexpectedCost": "此事实违背了格鲁希自己的判断，他困惑不已，导致拿破仑不得不分心指挥，延误了追击。",
        "beneficiary": "拿破仑的战场优势",
        "payer": "格鲁希的指挥主动性"
      }
    },
    {
      "id": "C",
      "powerId": "jump-tomorrow",
      "displayLabel": "将普鲁士先锋跳至明天",
      "label": "你对右翼的普鲁士先锋军施展跳跃，他们瞬间消失，将于明天同一时刻出现，为拿破仑赢得24小时歼灭威灵顿。",
      "intent": "彻底剥离普鲁士援军的威胁，让法军专心击破威灵顿。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "施展跳跃",
        "target": "右翼逼近的普鲁士先锋军（约四个旅）",
        "deadline": "普鲁士先锋已出现在右翼"
      },
      "instantEcho": {
        "directResult": "普鲁士先锋部队连同旗帜战鼓凭空消失，英军右翼暴露，威灵顿脸色惨白。",
        "unexpectedCost": "跳跃消耗你的生命精力，你当场昏迷，拿破仑失去关键参谋，后续追击计划混乱。",
        "beneficiary": "法军近卫军突击",
        "payer": "你的清醒与参谋职责"
      }
    },
    {
      "id": "C",
      "powerId": "copy-skill",
      "displayLabel": "复制威灵顿的兵力调配术",
      "label": "你吸纳威灵顿的兵力调配能力，立刻向拿破仑建议将剩余近卫军分成两路佯攻，同时命令右翼骑兵阻隔普军迟滞一小时。",
      "intent": "用敌方统帅的战术智慧弥补法军指挥失误，优化兵力使用。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "吸纳并运用",
        "target": "威灵顿公爵的兵力调配技能",
        "deadline": "普鲁士先锋已出现在右翼"
      },
      "instantEcho": {
        "directResult": "拿破仑采纳了你的分兵佯攻方案，近卫军突破乌古蒙一线，英军中央出现缺口。",
        "unexpectedCost": "你过于专注战术，未能及时提醒拿破仑普军主力已从侧翼迂回，导致法军后背被击。",
        "beneficiary": "法军的突破成功",
        "payer": "后方警戒的疏忽"
      }
    }
  ],
  "origin-species-1859": [
    {
      "id": "C",
      "powerId": "summon-giant-beast",
      "displayLabel": "召巨兽威吓出版社",
      "label": "你在仓库装运前一小时，召来百米巨兽围住伦敦约翰·默雷出版社，命令它静立不动，迫使出版人同意在首印本中加入观测清单。",
      "intent": "用绝对武力压制出版人，强制其接受你的编辑意见。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤并命令巨兽围住出版社",
        "target": "伦敦约翰·默雷出版社",
        "deadline": "仓库将在一小时后开始装运"
      },
      "instantEcho": {
        "directResult": "出版人约翰·默雷惊恐中同意加入一页观测清单。",
        "unexpectedCost": "巨兽引发全城恐慌，伦敦警方介入调查。",
        "beneficiary": "达尔文",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "move-mountain",
      "displayLabel": "移山阻断华莱士信件",
      "label": "你移动一座山，堵住华莱士从马来群岛寄往伦敦的邮路，确保《物种起源》首印本先于华莱士的论文抵达，独占优先权。",
      "intent": "阻止华莱士的理论提前到来，避免达尔文被抢先。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "移动一座山到华莱士信件必经的航线上",
        "target": "华莱士",
        "deadline": "仓库将在一小时后开始装运"
      },
      "instantEcho": {
        "directResult": "华莱士的论文延误数日，《物种起源》首印独占舆论。",
        "unexpectedCost": "山体移动导致附近村庄被掩埋，数十人伤亡。",
        "beneficiary": "达尔文",
        "payer": "村民"
      }
    },
    {
      "id": "C",
      "powerId": "locate-anything",
      "displayLabel": "定位达尔文丢失笔记",
      "label": "你在装运前定位达尔文丢失的十年观测笔记，发现被其仆人藏在出版社地下室，及时取出用于充实观测清单。",
      "intent": "找出关键证据，让达尔文的观测站得住脚。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "定位达尔文丢失的观测笔记",
        "target": "达尔文",
        "deadline": "仓库将在一小时后开始装运"
      },
      "instantEcho": {
        "directResult": "笔记在出版社地下室被发现，直接用于印刷清单。",
        "unexpectedCost": "仆人因盗窃罪被起诉，达尔文家庭内部出现裂痕。",
        "beneficiary": "达尔文",
        "payer": "仆人"
      }
    },
    {
      "id": "C",
      "powerId": "stretch-road",
      "displayLabel": "拉长牛津至伦敦路",
      "label": "你把牛津通往伦敦的一百米道路拉长成一百公里，拖延赫胥黎和威尔伯福斯主教前来参加次日辩论，为首印本创造一天无干扰窗口。",
      "intent": "推迟反对声浪，让《物种起源》先平稳发行。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "拉长牛津到伦敦的道路",
        "target": "赫胥黎",
        "deadline": "仓库将在一小时后开始装运"
      },
      "instantEcho": {
        "directResult": "赫胥黎与主教行程延误，首印当日无激烈反驳。",
        "unexpectedCost": "拉长的道路导致多名赶路人迷路，触发救援行动。",
        "beneficiary": "达尔文",
        "payer": "无辜旅人"
      }
    },
    {
      "id": "C",
      "powerId": "heal-room",
      "displayLabel": "治愈达尔文疾病",
      "label": "你在出版社办公室内，让长期卧病的达尔文立即痊愈，使他能亲自出席首印仪式并签署观测清单。",
      "intent": "让达尔文本人到场，增加观测清单的公信力。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "治愈达尔文",
        "target": "达尔文",
        "deadline": "仓库将在一小时后开始装运"
      },
      "instantEcho": {
        "directResult": "达尔文痊愈并亲自到出版社，签名确认清单。",
        "unexpectedCost": "达尔文因突然健康引来医学界关注，被要求接受检查。",
        "beneficiary": "达尔文",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "conjure-water",
      "displayLabel": "生清水救火灾险情",
      "label": "你在出版社仓库持续生成大量清水，扑灭因工人操作失误而起的火灾，保住首印本和观测清单。",
      "intent": "用奇观避免损失，确保首印能按时发行。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在仓库生成清水灭火",
        "target": "出版社仓库",
        "deadline": "仓库将在一小时后开始装运"
      },
      "instantEcho": {
        "directResult": "火灾被扑灭，首印本完好无损。",
        "unexpectedCost": "大量清水淹没了地下室，部分货物受损。",
        "beneficiary": "达尔文",
        "payer": "出版社"
      }
    }
  ],
  "lincoln-emancipation-1862": [
    {
      "id": "C",
      "powerId": "extinguish-fire",
      "displayLabel": "熄灭电报室煤灯",
      "label": "你按林肯命令发报前，先熄灭了白宫电报室方圆十里内所有火焰——包括煤气灯、壁炉和南方间谍等待的暗号蜡烛——确保宣言内容在最后一班电报线路切换为军用前不被任何火光信号提前泄露。",
      "intent": "在发报前消除所有可能被南方利用的火光信号，防止宣言内容被提前拦截。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动熄灭十里烈火能力，熄灭所有正在燃烧的火焰",
        "target": "白宫电报室方圆十里内的所有火源",
        "deadline": "最后一班电报线路将在一小时后切换为军用"
      },
      "instantEcho": {
        "directResult": "电报室陷入黑暗，但发报设备未受损；南方间谍的暗号蜡烛熄灭。",
        "unexpectedCost": "林肯手边的煤油灯也熄灭，他不得不摸黑签署最后一份宣言副本。",
        "beneficiary": "战争部电报线路的保密性",
        "payer": "林肯本人"
      }
    },
    {
      "id": "C",
      "powerId": "erase-memory",
      "displayLabel": "删除内阁秘书记忆",
      "label": "你走到内阁秘书乔治·哈灵顿面前，删除了他关于今晚你看到林肯在宣言上签署的完整记忆——因为他是南方同情者，若在最后一班电报线路切换为军用前走漏风声，宣言将被提前封锁。",
      "intent": "消除内阁中南方同情者的记忆，防止宣言内容在发报前泄露。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动删除记忆能力，删除哈灵顿的具体记忆",
        "target": "乔治·哈灵顿（战争部书记官）",
        "deadline": "最后一班电报线路将在一小时后切换为军用"
      },
      "instantEcho": {
        "directResult": "哈灵顿困惑地放下钢笔，不再询问宣言细节。",
        "unexpectedCost": "你同时误删了他对今天午餐食谱的记忆，他晚饭时抱怨不饿。",
        "beneficiary": "电报发报的保密性",
        "payer": "哈灵顿的日常记忆"
      }
    },
    {
      "id": "C",
      "powerId": "swap-two-people",
      "displayLabel": "交换自身与邮差位置",
      "label": "你在最后一班电报线路切换为军用前的一瞬间，与南方邮差交换了位置和随身物品——你带着他的假发和密信出现在边境小镇，而他在白宫电报室里面对林肯。宣言全文得以从敌方控制区直接发出。",
      "intent": "利用交换位置直接进入敌方电报站，从源头发送宣言。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动交换两人位置能力，与南方邮差交换位置和随身物品",
        "target": "南方邮差（在电报室外的潜伏间谍）",
        "deadline": "最后一班电报线路将在一小时后切换为军用"
      },
      "instantEcho": {
        "directResult": "你出现在边境电报站，宣言电文立即发出。",
        "unexpectedCost": "林肯认不出你，命令卫兵把穿邮差服的你当成间谍关押。",
        "beneficiary": "北方军队",
        "payer": "你本人（暂时被关押）"
      }
    },
    {
      "id": "C",
      "powerId": "repeat-minute",
      "displayLabel": "重复宣言抄写的一分钟",
      "label": "你在最后一班电报线路切换为军用前，连续重复同一分钟：让林肯在签署时笔尖停顿、墨水瓶打翻、副官递上干布——你反复检查每一个字，直到确认宣言无误后才接受结果，使文本在截止前准确到达所有报社。",
      "intent": "反复检查宣言文本细节，确保无错漏后再发送。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动重复一分钟能力，重复林肯签署宣言的那一分钟",
        "target": "林肯在宣言上的签署动作",
        "deadline": "最后一班电报线路将在一小时后切换为军用"
      },
      "instantEcho": {
        "directResult": "宣言文本无一字错误地发往各报社。",
        "unexpectedCost": "林肯抱怨钢笔墨水反复弄脏袖口，但只能怪自己手抖。",
        "beneficiary": "战争部电报员（你）",
        "payer": "林肯的耐心"
      }
    },
    {
      "id": "C",
      "powerId": "command-animals",
      "displayLabel": "号令南方信鸽回笼",
      "label": "你在最后一班电报线路切换为军用前，号令方圆十公里内所有信鸽、驿马和猎犬返回各自笼中——南方间谍用来传递宣言泄露消息的信鸽群在半空突然转向，使南方军队无法在期限内获取情报。",
      "intent": "切断敌方动物通信渠道，防止宣言内容提前被南方封锁。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动号令所有动物能力，命令所有信鸽、驿马、猎犬返回笼中",
        "target": "华盛顿方圆十公里内所有被用于通信的动物",
        "deadline": "最后一班电报线路将在一小时后切换为军用"
      },
      "instantEcho": {
        "directResult": "电报线路畅通，宣言全文正常发出。",
        "unexpectedCost": "林肯的马也受命令影响，挣脱缰绳跑回了马厩，导致他第二天的演讲迟到。",
        "beneficiary": "北方军队",
        "payer": "林肯的行程计划"
      }
    },
    {
      "id": "C",
      "powerId": "rust-weapons",
      "displayLabel": "锈蚀白宫卫队步枪",
      "label": "你在最后一班电报线路切换为军用前，锈蚀了电报室外方圆一公里内所有武器——卫兵的步枪、南方间谍的手枪、甚至林肯桌上装饰用的古董佩剑，以此防止任何人在发报过程中用武力阻止宣言发出。",
      "intent": "消除武力威胁，确保发报过程不被打断。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动锈蚀所有武器能力，锈蚀方圆一公里内所有金属武器",
        "target": "电报室外方圆一公里内的所有步枪、手枪、剑等武器",
        "deadline": "最后一班电报线路将在一小时后切换为军用"
      },
      "instantEcho": {
        "directResult": "白宫卫兵发现步枪锈斑密布，无法射击；发报顺利完成。",
        "unexpectedCost": "林肯的书桌抽屉拉手锈死，他无法取出雪茄。",
        "beneficiary": "电报员（你）",
        "payer": "白宫卫兵的装备维护"
      }
    }
  ],
  "sarajevo-1914": [
    {
      "id": "C",
      "powerId": "shrink-object",
      "displayLabel": "缩小波斯尼亚硬币",
      "label": "你将车队司机口袋里的波斯尼亚硬币缩小为指甲大小，使其无法在途中付费买报纸或问路，从而迫使他继续按原计划路线行驶。",
      "intent": "消除司机因买报纸而偏离路线的可能，避免车队再次经过拉丁桥。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "缩小了司机口袋里的硬币",
        "target": "车队司机",
        "deadline": "距离车队再次经过拉丁桥约8分钟"
      },
      "instantEcho": {
        "directResult": "司机摸口袋发现硬币变小，无法使用，只好继续驾驶前行。",
        "unexpectedCost": "车队因此未去医院探望伤者，引发斐迪南大公的不满。",
        "beneficiary": "塞尔维亚总理大臣帕希奇",
        "payer": "车队司机"
      }
    },
    {
      "id": "C",
      "powerId": "transfer-cost",
      "displayLabel": "转移爆炸损失给宪兵队长",
      "label": "你将第一次未遂炸弹袭击造成的伤亡和恐慌直接转移给当地宪兵队长，使他立即下令封锁拉丁桥区域，阻止车队二次通过。",
      "intent": "让宪兵队长承担爆炸后果，促使他封锁拉丁桥，防止斐迪南大公暴露在枪口下。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "转移了第一次爆炸的全部损失",
        "target": "宪兵队长",
        "deadline": "距离车队再次经过拉丁桥约8分钟"
      },
      "instantEcho": {
        "directResult": "宪兵队长突然感到头痛并下令封锁拉丁桥。",
        "unexpectedCost": "宪兵队长因此被上级调查，但封锁令确实生效。",
        "beneficiary": "斐迪南大公夫妇",
        "payer": "宪兵队长"
      }
    },
    {
      "id": "C",
      "powerId": "rewind-hour",
      "displayLabel": "回溯一小时前路线安排",
      "label": "你发动能力让萨拉热窝市区回到一小时前的状态，此时车队尚未出发，你可以重新命令司机明确路线：不去医院，必须沿原路返回。",
      "intent": "撤销糟糕的路线变更决定，让车队避开拉丁桥。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将时间倒退一小时，然后直接向司机下达新的命令",
        "target": "车队司机和斐迪南大公",
        "deadline": "距离车队再次经过拉丁桥约8分钟（时间倒回后重新计时）"
      },
      "instantEcho": {
        "directResult": "司机和宪兵都听到了你清晰的命令，路线更改被取消。",
        "unexpectedCost": "斐迪南大公因未去医院探视而迁怒于你，但安全得以保证。",
        "beneficiary": "塞尔维亚",
        "payer": "斐迪南大公的个人意愿"
      }
    },
    {
      "id": "C",
      "powerId": "shapeshift",
      "displayLabel": "变成副驾驶模样换位",
      "label": "你变成斐迪南大公座驾的副驾驶，在车队启动前挤入座位，引导司机走最安全的河滨大道，远离拉丁桥。",
      "intent": "亲自控制司机路线，彻底避开普林西普的埋伏。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "变成了副驾驶并坐在位子上指挥司机",
        "target": "斐迪南大公的司机",
        "deadline": "距离车队再次经过拉丁桥约8分钟"
      },
      "instantEcho": {
        "directResult": "司机服从你的手势拐入河滨大道，拉丁桥被绕开。",
        "unexpectedCost": "斐迪南大公发现副驾驶陌生人，但在短暂解释后接受。",
        "beneficiary": "帕希奇政府",
        "payer": "你与斐迪南大公的个人信任"
      }
    },
    {
      "id": "C",
      "powerId": "summon-lightning",
      "displayLabel": "雷击普林西普手枪",
      "label": "你召唤一道雷电在大公车队的上空，精确击中普林西普的手枪，使其瞬间灼热脱手。",
      "intent": "阻止普林西普开枪，打断刺杀关键时刻。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤雷电击中了普林西普的手枪",
        "target": "普林西普",
        "deadline": "距离车队再次经过拉丁桥约8分钟"
      },
      "instantEcho": {
        "directResult": "普林西普惨叫一声扔下滚烫的手枪，未能开枪射杀。",
        "unexpectedCost": "雷电也惊吓了马匹，导致现场混乱和轻微踩踏。",
        "beneficiary": "斐迪南大公夫妇",
        "payer": "普林西普及其同伙"
      }
    },
    {
      "id": "C",
      "powerId": "share-memory",
      "displayLabel": "分享未来世界大战记忆",
      "label": "你让斐迪南大公、奥匈帝国皇帝和塞尔维亚国王同时经历一段真实记忆：1914—1918年的残酷堑壕战、数百万伤亡和奥匈帝国解体。",
      "intent": "让关键决策者看到战争后果，放弃敌对行动，从根源上避免危机升级。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "分享了1914-1918年第一次世界大战的记忆",
        "target": "斐迪南大公、奥匈皇帝、塞尔维亚国王",
        "deadline": "距离车队再次经过拉丁桥约8分钟"
      },
      "instantEcho": {
        "directResult": "三人震惊并立即决定取消刺杀调查，呼吁和平。",
        "unexpectedCost": "斐迪南大公因此精神受创，决定退隐。",
        "beneficiary": "全欧洲",
        "payer": "斐迪南大公的个人意志"
      }
    }
  ],
  "october-revolution-1917": [
    {
      "id": "C",
      "powerId": "speak-any-distance",
      "displayLabel": "致电克伦斯基劝阻求援",
      "label": "接通克伦斯基汽车里的电话，以沙皇间谍的名义警告他前方路口已被布尔什维克机枪封锁，让他掉头回冬宫抓捕列宁，拖延他离开首都的时间。",
      "intent": "用假冒情报阻止克伦斯基离开，让临时政府失去外援从而更快崩溃。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "接通克伦斯基汽车里的电话并提出警告",
        "target": "克伦斯基的汽车",
        "deadline": "克伦斯基的汽车将在半小时后离开首都求援"
      },
      "instantEcho": {
        "directResult": "克伦斯基命令司机掉头返回冬宫，起义部队随后包围了冬宫。",
        "unexpectedCost": "克伦斯基识破你的声音并下令追查起义指挥部的位置，导致斯莫尔尼宫一度暴露在炮火威胁下。",
        "beneficiary": "布尔什维克起义部队",
        "payer": "你作为电报调度员暴露在敌人侦察范围"
      }
    },
    {
      "id": "C",
      "powerId": "duplicate-place",
      "displayLabel": "复制冬宫阻截援军",
      "label": "在通往冬宫的主干道上复制出一座一模一样的冬宫，将城门紧闭并安排起义士兵假扮卫兵，吸引临时政府援军进入假冬宫缴械。",
      "intent": "用虚假宫殿误导前来增援的士官生，使真实冬宫的防御空虚。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在主干道复制冬宫并布置假卫兵",
        "target": "冬宫",
        "deadline": "克伦斯基的汽车将在半小时后离开首都求援"
      },
      "instantEcho": {
        "directResult": "临时政府的援军进入假冬宫后被包围缴械，真实冬宫几乎没有抵抗就被攻陷。",
        "unexpectedCost": "复制品使用了过多电能，导致斯莫尔尼宫通讯线路因供电不足中断五分钟。",
        "beneficiary": "攻打冬宫的赤卫队",
        "payer": "斯莫尔尼宫的通讯系统短暂瘫痪"
      }
    },
    {
      "id": "C",
      "powerId": "revive-dead",
      "displayLabel": "复活马克思激励士兵",
      "label": "复活1917年已故的卡尔·马克思到斯莫尔尼宫的讲台上，让他向起义士兵发表五分钟演说，号召工人士兵彻底推翻资产阶级临时政府。",
      "intent": "用马克思的权威立即凝聚犹豫不决的士兵，确保起义顺利推进。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复活马克思到斯莫尔尼宫讲台并讲话",
        "target": "卡尔·马克思",
        "deadline": "克伦斯基的汽车将在半小时后离开首都求援"
      },
      "instantEcho": {
        "directResult": "士兵们深受鼓舞，迅速冲向冬宫并夺下每一道防线。",
        "unexpectedCost": "马克思复活一小时的消息传遍欧洲，各国政府加大了对本国社会主义运动的镇压。",
        "beneficiary": "布尔什维克起义士兵",
        "payer": "欧洲社会主义运动遭受更大打压"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-grain",
      "displayLabel": "粮仓涌粮安抚饥民",
      "label": "让斯莫尔尼宫地下储藏室不断涌出黑麦面包，由你组织分配给彼得格勒的饥民，换取他们支持起义并协助占领桥梁。",
      "intent": "用粮食收买民心，防止临时政府用面包收买工人破坏起义。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在地下室生成无限黑麦面包并组织分配",
        "target": "斯莫尔尼宫地下储藏室",
        "deadline": "克伦斯基的汽车将在半小时后离开首都求援"
      },
      "instantEcho": {
        "directResult": "饥民领到面包后主动帮助起义部队占领了三座主要桥梁。",
        "unexpectedCost": "面包过多引来投机商抢购，分配现场一度发生踩踏，造成数人受伤。",
        "beneficiary": "彼得格勒饥民",
        "payer": "受伤的民众以及秩序维护成本"
      }
    },
    {
      "id": "C",
      "powerId": "enlarge-object",
      "displayLabel": "放大电报机传令全军",
      "label": "将斯莫尔尼宫主电报机放大一百倍，利用巨大的扬声器直接向全城广播起义开始，同时手动接收来自各部队的响应信号。",
      "intent": "用放大电报机代替故障的电话线路，瞬间完成全城动员。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "放大电报机并利用它广播和接收信号",
        "target": "斯莫尔尼宫主电报机",
        "deadline": "克伦斯基的汽车将在半小时后离开首都求援"
      },
      "instantEcho": {
        "directResult": "全城部队听到广播后立即行动，临时政府抵抗被瞬间瓦解。",
        "unexpectedCost": "巨大的广播声暴露了斯莫尔尼宫为起义总部，招致临时政府残余炮兵的一轮轰击，外墙受损。",
        "beneficiary": "起义部队各分队",
        "payer": "斯莫尔尼宫建筑结构出现裂缝"
      }
    },
    {
      "id": "C",
      "powerId": "sentence-becomes-true",
      "displayLabel": "立字使冬宫防线崩塌",
      "label": "写下「冬宫所有电话被切断且门窗已遭查封」，使这句话成为现实，彻底隔绝临时政府与外界的联系，为进攻扫清障碍。",
      "intent": "不费一兵一卒瘫痪临时政府指挥系统，让起义部队轻松攻占冬宫。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "写下并令其成真的句子",
        "target": "冬宫的所有电话及门窗",
        "deadline": "克伦斯基的汽车将在半小时后离开首都求援"
      },
      "instantEcho": {
        "directResult": "冬宫与外界的联络中断，门窗被查封，士官生无法突围也无法求助，起义部队随即破门而入。",
        "unexpectedCost": "查封包括通气的窗户，导致冬宫内部分区域缺氧，数名囚禁的士兵窒息昏迷。",
        "beneficiary": "布尔什维克进攻部队",
        "payer": "冬宫内被囚禁的士兵"
      }
    }
  ],
  "roosevelt-bank-holiday-1933": [
    {
      "id": "C",
      "powerId": "teleport-crowd",
      "displayLabel": "传送挤兑储户到华盛顿",
      "label": "你把财政部大楼外的上千名恐慌储户瞬间传送到华盛顿纪念碑下的草坪上，让他们亲眼看见胡佛与罗斯福刚刚完成权力交接的广场，以此阻断他们对纽约银行的重压。",
      "intent": "用空间错位瞬间解除挤兑对纽约银行的直接威胁，让恐慌群众离开现场。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动传送，将财政部外聚集的约80名挤兑储户传送到华盛顿纪念碑草坪",
        "target": "财政部外聚集的储户",
        "deadline": "纽约银行开门前一小时"
      },
      "instantEcho": {
        "directResult": "那80人凭空消失，再出现在华盛顿纪念碑下，引发新的恐慌；纽约银行门前挤兑人群暂时减少。",
        "unexpectedCost": "华盛顿纪念碑附近出现新的混乱，警察误以为发生暴动，导致两名路人受伤。",
        "beneficiary": "纽约银行",
        "payer": "华盛顿纪念碑附近的游客和警察"
      }
    },
    {
      "id": "C",
      "powerId": "borrow-tomorrow-memory",
      "displayLabel": "借来明日记忆知晓演讲内容",
      "label": "你立即获取自己1933年3月7日此刻的完整记忆，包括罗斯福在广播中宣布紧急银行法细节及银行分批重开方案，从而提前知道哪些银行会被审查通过、哪些会被关闭。",
      "intent": "用未来信息指导当前休业令的具体措辞和银行名单，避免错误关闭稳健银行或漏掉问题机构。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动借来明日记忆，提前看到明天此刻的完整记忆",
        "target": "你自己明天的记忆",
        "deadline": "电报发出前"
      },
      "instantEcho": {
        "directResult": "你瞬间得知明天罗斯福将宣布的审查后重开银行名单，以及当天股市反而大涨。",
        "unexpectedCost": "因为提前知道部分银行会倒闭，你在今日电报中泄露了消息，导致那几家银行的高管提前逃跑。",
        "beneficiary": "财政部决策层",
        "payer": "被提前放弃的几家银行高管"
      }
    },
    {
      "id": "C",
      "powerId": "summon-giant-beast",
      "displayLabel": "召唤巨兽摧毁银行金库",
      "label": "你在纽约联邦储备银行金库外召来一头百米高的巨兽，命令它一脚踩碎金库大门，让内部黄金暴露，从而打破民众对黄金被偷运的猜疑，展示黄金仍在。",
      "intent": "用夸张视觉奇观证明黄金储备充足，从根源上瓦解挤兑心理。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤一头百米高巨兽出现在纽约联储金库外，并命令它踩碎大门",
        "target": "纽约联邦储备银行金库大门",
        "deadline": "纽约银行开门前半小时"
      },
      "instantEcho": {
        "directResult": "巨兽一脚踩碎金库大门，内部黄金条块洒落出来，数万民众亲眼目睹黄金完好，挤兑潮瞬间缓解。",
        "unexpectedCost": "金库建筑严重受损，一名守卫被飞溅的石块击中昏迷。",
        "beneficiary": "纽约联储及全体储户",
        "payer": "受伤的守卫"
      }
    },
    {
      "id": "C",
      "powerId": "move-mountain",
      "displayLabel": "移动山脉延长办公时间",
      "label": "你移动视野内一座阿巴拉契亚山脉的小山峰，在华盛顿上空形成一个巨大日晷阴影，使财政部电报室区域日照延长两小时，从而推迟下班时间，让你有更多时间协调银行休业令。",
      "intent": "用地质规模操作增加操作窗口，避免因天黑下班而导致休业令延迟。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "移动视野内阿巴拉契亚山脉一座山峰到华盛顿特区东南方向十公里处",
        "target": "一座阿巴拉契亚山脉山峰",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "山峰移动到新位置，在电报室投下延长日照的阴影，成功让日落后仍有两小时可见光。",
        "unexpectedCost": "山峰移动造成华盛顿郊区轻度地震，几栋老建筑窗户破裂。",
        "beneficiary": "财政部电报室全体职员",
        "payer": "郊区居民与建筑业主"
      }
    },
    {
      "id": "C",
      "powerId": "locate-anything",
      "displayLabel": "定位前总统胡佛私藏黄金地点",
      "label": "你立即知道前总统赫伯特·胡佛在1933年3月5日秘密转移到马里兰州某农场的地窖中的黄金储备清单，并获知其准确位置，从而能以此为证据迫使胡佛公开黄金流向，稳定金融市场。",
      "intent": "找到被隐藏的黄金，用事实揭露谣言源头，重建对银行系统的信任。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动定位，指定人物为赫伯特·胡佛，物品为胡佛私藏的黄金清单",
        "target": "赫伯特·胡佛及其私藏的黄金清单",
        "deadline": "纽约银行开门前"
      },
      "instantEcho": {
        "directResult": "你的脑中浮现胡佛在马里兰州农场地窖内存放黄金的准确坐标和清单，证明前政府确实大量囤积黄金。",
        "unexpectedCost": "胡佛获悉你拥有此信息后，立即通过律师申请禁制令试图封口。",
        "beneficiary": "罗斯福政府和公众",
        "payer": "胡佛本人及他的政治遗产"
      }
    },
    {
      "id": "C",
      "powerId": "stretch-road",
      "displayLabel": "拉长华尔街路段阻止挤兑人流",
      "label": "你将纽约证券交易所通往联储银行的100米道路拉长成100公里，且外界无法绕行，使得那些拥向银行提取黄金的储户无法在短时间内到达，从而为罗斯福签署紧急银行法争取时间。",
      "intent": "用物理距离延缓恐慌人群的移动速度，避免开门瞬间遭遇挤兑洪峰。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动拉长道路，指定华尔街从百老汇到联储银行门口这一段100米道路",
        "target": "华尔街从百老汇到纽约联储银行门口的一段道路",
        "deadline": "纽约银行开门前10分钟"
      },
      "instantEcho": {
        "directResult": "该段道路突然变成无尽的长路，试图步行前往银行的储户走了半小时仍看不到尽头。",
        "unexpectedCost": "一辆正在该路段的救护车被困，无法到达医院，导致患者延误治疗。",
        "beneficiary": "联邦储备银行",
        "payer": "被困的救护车患者及其家属"
      }
    }
  ],
  "hitler-poland-1939": [
    {
      "id": "C",
      "powerId": "stop-time",
      "displayLabel": "冻结统帅部十分钟",
      "label": "你让柏林国防军最高统帅部所有人员（包括希特勒、凯特尔、约德尔）停止运动十分钟，独自走向保险柜取出白色方案原件，用火柴点燃它。",
      "intent": "时间停止让通信军官能在他人无法干预时销毁进攻命令，直接解除二十分钟后的轰炸。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动停止时间能力，让统帅部内所有人静止，然后步行十米到保险柜，取出白色方案文件并点燃",
        "target": "白色方案原件和希特勒、凯特尔、约德尔",
        "deadline": "首批轰炸机二十分钟后起飞"
      },
      "instantEcho": {
        "directResult": "白色方案原件化为灰烬，希特勒等人恢复运动后大喊“谁干的？”，进攻暂时瘫痪",
        "unexpectedCost": "你被盖世太保当场逮捕，因为只有你手腕有烧痕",
        "beneficiary": "波兰平民和英法外交官",
        "payer": "你自己成为替罪羊"
      }
    },
    {
      "id": "C",
      "powerId": "clone-self",
      "displayLabel": "百身截断进攻令",
      "label": "你复制出一百个自己，命令九十九个分身同时冲进统帅部各办公室、电报室和电话总机，拔掉所有通信插头并撕毁已签发的进攻命令纸页。",
      "intent": "一百个分身能同时瘫痪纳粹指挥链，使白色方案无法按时传达。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制出一百个自己，率领分身冲入各办公室拔插头、撕毁文件",
        "target": "统帅部内所有通信设备及白色方案文件",
        "deadline": "首批轰炸机二十分钟后起飞"
      },
      "instantEcho": {
        "directResult": "统帅部陷入混乱，电报线全部中断，希特勒暴怒下令枪决所有可疑人员",
        "unexpectedCost": "所有分身被卫兵开枪击毙，本体暴露身份遭逮捕",
        "beneficiary": "波兰边境部队",
        "payer": "你及九十九个分身"
      }
    },
    {
      "id": "C",
      "powerId": "extinguish-fire",
      "displayLabel": "熄圣火灭备战灯",
      "label": "你发动能力熄灭方圆十里内所有火焰——包括统帅部壁炉、食堂灶火、门口火炬以及德波边境伪装袭击的纵火点，让格莱维茨电台攻击失去火光证据。",
      "intent": "熄灭边境伪造袭击的火焰，使纳粹失去入侵借口，同时打乱统帅部气氛。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动熄灭火焰能力，覆盖方圆十里所有燃火点",
        "target": "柏林统帅部和格莱维茨等边境纵火点",
        "deadline": "首批轰炸机二十分钟后起飞"
      },
      "instantEcho": {
        "directResult": "边境袭击的火焰全部消失，德国广播无法报道“波兰进攻”，英法使馆收到疑点报告",
        "unexpectedCost": "统帅部因壁炉熄灭导致寒冷，希特勒下令彻查，你被疑为波兰间谍",
        "beneficiary": "英法情报机构",
        "payer": "你被投入盖世太保监狱"
      }
    },
    {
      "id": "C",
      "powerId": "erase-memory",
      "displayLabel": "抹元首整晚决议",
      "label": "你走到希特勒面前（无人阻拦），删除他关于“入侵波兰计划”及“白色方案”的全部记忆，让他忘记今晚为何来到统帅部。",
      "intent": "删除希特勒对入侵计划的记忆，使其无法下达明确命令，甚至怀疑自己在哪。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动删除记忆能力，作用于希特勒，删除他关于入侵波兰和白色方案的全部记忆",
        "target": "阿道夫·希特勒",
        "deadline": "首批轰炸机二十分钟后起飞"
      },
      "instantEcho": {
        "directResult": "希特勒茫然地问“我为何在此？”，凯特尔等人试图提醒，但他持续困惑，进攻命令无法确认",
        "unexpectedCost": "希特勒因记忆缺失引发偏头痛，下令处决所有“知情不报者”，多名参谋被杀",
        "beneficiary": "波兰和欧洲和平",
        "payer": "统帅部多名无辜军官"
      }
    },
    {
      "id": "C",
      "powerId": "swap-two-people",
      "displayLabel": "换位使节停战令",
      "label": "你将站在地图前的希特勒与英国驻柏林大使内维尔·亨德森瞬间交换位置，使亨德森身披希特勒大衣站在统帅部中央，而希特勒出现在英国大使馆。",
      "intent": "让希特勒身陷英使馆，迫使英国直接质问，使入侵计划因最高领导人失踪而暂停。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动交换位置能力，交换希特勒和英国大使亨德森的位置及衣物",
        "target": "阿道夫·希特勒与英国大使内维尔·亨德森",
        "deadline": "首批轰炸机二十分钟后起飞"
      },
      "instantEcho": {
        "directResult": "亨德森在统帅部惊愕地被包围，英国使馆发现希特勒出现在客厅并大喊“这是阴谋”",
        "unexpectedCost": "英国误以为希特勒是刺客将其击毙，德国以元首被杀为由立即全面入侵波兰和法国",
        "beneficiary": "英国情报机构",
        "payer": "希特勒本人和英德外交人员"
      }
    },
    {
      "id": "C",
      "powerId": "repeat-minute",
      "displayLabel": "百遍重来毁诏书",
      "label": "你反复重演“凌晨4:00整”这一分钟，共尝试五十次，每次冲进办公室抢在希特勒签字前撕毁白色方案，直到第五十一次成功地让钢笔滑落，文件被墨渍污染无法签署。",
      "intent": "通过无数次重试找到唯一路径阻止希特勒签署最终进攻令。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动重复一分钟能力，反复回到4:00整，并每次冲入办公室撕毁或污染白色方案",
        "target": "白色方案文件以及希特勒手中的钢笔",
        "deadline": "首批轰炸机二十分钟后起飞"
      },
      "instantEcho": {
        "directResult": "第五十一次成功让墨水瓶倾倒，文件无法使用，希特勒推迟进攻令重印，轰炸机延后起飞",
        "unexpectedCost": "你因反复出现引起卫兵怀疑，最后一次成功后立即被捕，但文件已毁",
        "beneficiary": "波兰平民",
        "payer": "你被送上军事法庭"
      }
    }
  ],
  "stalin-moscow-1941": [
    {
      "id": "C",
      "powerId": "restore-youth",
      "displayLabel": "让莫洛托夫年轻四十岁",
      "label": "你对莫洛托夫发动能力，让他瞬间回到1901年的身体状态，使他精力充沛地留守莫斯科协助斯大林，防止撤离动议扩散。",
      "intent": "用年轻的副手稳定最高统帅部内部，取消专列撤离计划。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触碰莫洛托夫的手臂并发动能力",
        "target": "莫洛托夫",
        "deadline": "四十分钟内"
      },
      "instantEcho": {
        "directResult": "莫洛托夫皱纹消失、脊背挺直，精神抖擞地走出地下指挥所。",
        "unexpectedCost": "斯大林对莫洛托夫突然的年轻感到困惑，短暂影响信任。",
        "beneficiary": "莫洛托夫",
        "payer": "莫洛托夫本人（失去老年经验带来的沉稳）"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-money",
      "displayLabel": "用无限卢布安抚抢购市民",
      "label": "你拿出无限量的1941年卢布，通过NKVD特工在莫斯科商店发放，要求店主按战时价格售货，缓解恐慌性抢购。",
      "intent": "用无限资金稳定莫斯科物资供应，消除市民对斯大林撤离的猜疑。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "从口袋中不断取出成捆卢布",
        "target": "莫斯科各商店及NKVD特工",
        "deadline": "四十分钟内"
      },
      "instantEcho": {
        "directResult": "商店门前秩序恢复，物资价格回落。",
        "unexpectedCost": "大量卢布涌入黑市，导致后续通货膨胀。",
        "beneficiary": "莫斯科市民",
        "payer": "苏联中央银行后续承担通胀压力"
      }
    },
    {
      "id": "C",
      "powerId": "shrink-object",
      "displayLabel": "缩小撤离专列模型",
      "label": "你将站台上斯大林专列缩小到掌心大小，然后藏在军大衣口袋里，使专列无法按时发车，迫使斯大林公开留守决定。",
      "intent": "物理上阻止撤离车辆出发，消除撤离选项。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触摸火车头并将整列专列缩小",
        "target": "斯大林撤离专列（车头和车厢）",
        "deadline": "专列发车前"
      },
      "instantEcho": {
        "directResult": "站台上的专列消失，站台人员发现巨大模型。",
        "unexpectedCost": "斯大林警卫怀疑你破坏撤离，短暂扣留你调查。",
        "beneficiary": "斯大林（作为留守莫斯科的象征）",
        "payer": "你本人（被调查的压力）"
      }
    },
    {
      "id": "C",
      "powerId": "transfer-cost",
      "displayLabel": "将撤离动荡代价转给希特勒",
      "label": "你决定让专列撤离方案带来的莫斯科恐慌代价转向希特勒，使德军统帅部出现混乱，分散逼进攻势。",
      "intent": "将内乱转化为外敌危机，迫使斯大林以强硬姿态留守。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在内心指定希特勒为代价承担者",
        "target": "斯大林专列撤离方案的直接社会代价",
        "deadline": "专列发车后一小时内"
      },
      "instantEcho": {
        "directResult": "德军前线指挥部收到混乱命令，进攻暂停两小时。",
        "unexpectedCost": "希特勒怀疑东线将领集体叛变，处决两名军官。",
        "beneficiary": "斯大林和苏联最高统帅部",
        "payer": "希特勒和德军高级军官"
      }
    },
    {
      "id": "C",
      "powerId": "rewind-hour",
      "displayLabel": "退回一小时重写撤离计划",
      "label": "你将克里姆林宫内时间倒转回一小时前，利用记忆优势说服斯大林提前广播留守声明，使撤离计划自动取消。",
      "intent": "用时间重置消除专列发车的事实基础。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "集中意志发动时间倒流",
        "target": "克里姆林宫地下指挥所区域",
        "deadline": "即刻"
      },
      "instantEcho": {
        "directResult": "时钟倒转，斯大林听到你预言德军攻击方向后采纳留守方案。",
        "unexpectedCost": "倒流导致部分文件丢失，情报官重新整理三小时。",
        "beneficiary": "斯大林本人",
        "payer": "情报部门额外工作负担"
      }
    },
    {
      "id": "C",
      "powerId": "shapeshift",
      "displayLabel": "变成贝利亚改变撤离命令",
      "label": "你变成拉夫连季·贝利亚的外貌，直接走进指挥所伪造内务部命令取消专列，借口斯大林已决定留下。",
      "intent": "用最高惩治机构权威强行撤销撤离准备。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "变身成贝利亚后签署新命令",
        "target": "克里姆林宫指挥所内的撤离专列负责人",
        "deadline": "四十分钟内"
      },
      "instantEcho": {
        "directResult": "专列调度员接到命令后停止发车准备。",
        "unexpectedCost": "真正的贝利亚后来追查伪造命令，发现可疑痕迹。",
        "beneficiary": "斯大林（免于撤离压力）",
        "payer": "真正的贝利亚（名誉被冒用）"
      }
    }
  ],
  "normandy-1944": [
    {
      "id": "C",
      "powerId": "invisibility",
      "displayLabel": "隐身修改出港令",
      "label": "你隐身进入司令部，将艾森豪威尔桌上的出港决断令从‘延迟’改为‘立即’，让舰队在半小时内收到出港命令。",
      "intent": "突破德军气象误判造成的决策犹豫，强制把握天气窗口。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "隐身进入司令部并使用钢笔修改艾森豪威尔桌上的决断令",
        "target": "艾森豪威尔的出港决断令",
        "deadline": "半小时内"
      },
      "instantEcho": {
        "directResult": "舰队在半小时内收到出港命令，开始驶向诺曼底。",
        "unexpectedCost": "你的隐身能力结束前，一名参谋发现墨迹未干，产生了短暂的混乱。",
        "beneficiary": "艾森豪威尔和盟军舰队",
        "payer": "你承受了被发现的风险和短暂混乱中的心理压力"
      }
    },
    {
      "id": "C",
      "powerId": "split-river",
      "displayLabel": "分开英吉利海峡",
      "label": "你在港口施展能力让英吉利海峡的海水从中间分开，露出干燥海底，使数千艘舰船不用等待天气窗口即可直接驶向诺曼底。",
      "intent": "绕过气象条件对海况的限制，使登陆无需等待天气好转。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在朴茨茅斯港施展能力使英吉利海峡海水分开",
        "target": "英吉利海峡",
        "deadline": "半小时内"
      },
      "instantEcho": {
        "directResult": "数千艘舰船从干涸的海床直接驶向诺曼底，德军完全未预料到。",
        "unexpectedCost": "海峡两侧的潮汐紊乱导致部分小型船只搁浅在海底。",
        "beneficiary": "盟军登陆部队",
        "payer": "你因过度消耗体力而晕厥"
      }
    },
    {
      "id": "C",
      "powerId": "speak-any-distance",
      "displayLabel": "与隆美尔通话拖延",
      "label": "你立即与德军B集团军群司令隆美尔通话，假称‘登陆将在加来，诺曼底是佯攻’，使他坚信暴风雨阻止不了登陆。",
      "intent": "直接利用德军指挥官的误判，确保德军不在诺曼底增防。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "使用能力与隆美尔建立实时通话，假传情报",
        "target": "德国元帅隆美尔",
        "deadline": "十分钟内"
      },
      "instantEcho": {
        "directResult": "隆美尔确信加来是主攻方向，未加强诺曼底防御。",
        "unexpectedCost": "隆美尔敏锐地要求你提供身份验证，你被迫编造了一个假名，可能暴露。",
        "beneficiary": "盟军诺曼底登陆部队",
        "payer": "你承受了暴露风险和个人诚信代价"
      }
    },
    {
      "id": "C",
      "powerId": "duplicate-place",
      "displayLabel": "复制多佛尔城堡",
      "label": "你在诺曼底附近空地复制多佛尔城堡及内部物资，使德军雷达误判英军主力仍在多佛尔，从而忽略诺曼底。",
      "intent": "误导德军雷达侦察，使其相信盟军主攻方向仍是加来。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在诺曼底附近空地使用能力复制多佛尔城堡",
        "target": "多佛尔城堡",
        "deadline": "半小时内"
      },
      "instantEcho": {
        "directResult": "德军雷达发现‘多佛尔城堡’出现在诺曼底附近，误判英军主力仍在多佛尔。",
        "unexpectedCost": "复制地点消耗了你大量精力，你后续行动能力下降。",
        "beneficiary": "艾森豪威尔的欺骗计划",
        "payer": "你因精神力透支而虚弱"
      }
    },
    {
      "id": "C",
      "powerId": "revive-dead",
      "displayLabel": "复活纳尔逊督战",
      "label": "你让已故海军上将纳尔逊复活一小时，他亲临旗舰指挥舰队，激励士气并确保舰队按时出港。",
      "intent": "利用历史名将的权威和声望，克服官兵对恶劣天气的恐惧，果断执行登陆命令。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在旗舰指挥舱使用能力复活纳尔逊",
        "target": "海军上将霍雷肖·纳尔逊",
        "deadline": "半小时内"
      },
      "instantEcho": {
        "directResult": "纳尔逊复活后立即下令舰队出发，官兵士气高涨，舰队准时出港。",
        "unexpectedCost": "纳尔逊复活导致舰队通信系统中出现‘特拉法加海战’的混乱信号。",
        "beneficiary": "盟军登陆舰队",
        "payer": "你承受了历史人物短暂干扰现代指挥系统的代价"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-grain",
      "displayLabel": "无限面包供给舰队",
      "label": "你在舰队补给船上施展能力，使船上的粮仓不断涌出新鲜面包，确保所有士兵在登陆前吃饱，克服了因天气推迟导致的食物短缺。",
      "intent": "解决因天气推迟造成的后勤补给缺口，维持士兵体力。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在补给船上对粮仓施展能力使其涌出面包",
        "target": "补给船上的粮仓",
        "deadline": "半小时内"
      },
      "instantEcho": {
        "directResult": "所有舰船士兵在登陆前吃饱，士气高昂。",
        "unexpectedCost": "面包持续涌出导致部分粮仓结构损坏。",
        "beneficiary": "参与登陆的所有盟军士兵",
        "payer": "你因持续操作能力而疲惫，但未受伤"
      }
    }
  ],
  "cuban-missile-1962": [
    {
      "id": "C",
      "powerId": "transmute-material",
      "displayLabel": "将U-2残骸变为钛块",
      "label": "你立即把被击落的U-2残骸永久变成钛合金，使美军无法分析坠毁原因，延缓报复决策。",
      "intent": "阻止美军因U-2被击落而立即反击，为外交争取时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "永久改变材料",
        "target": "被击落的U-2侦察机残骸",
        "deadline": "数小时内"
      },
      "instantEcho": {
        "directResult": "U-2残骸变成钛合金块，美军技术分析失效。",
        "unexpectedCost": "钛合金残骸引发苏联怀疑，以为美国隐藏秘密。",
        "beneficiary": "肯尼迪总统",
        "payer": "你（被怀疑破坏证据）"
      }
    },
    {
      "id": "C",
      "powerId": "broadcast-thought",
      "displayLabel": "向白宫官员广播第二封信",
      "label": "你瞬间将赫鲁晓夫第二封密信（要求撤土耳其导弹）广播到方圆十公里内所有官员脑中，迫使肯尼迪无法隐瞒。",
      "intent": "强制公开第二封信，防止肯尼迪只回复第一封导致信息不对称。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "广播一句密信内容",
        "target": "华盛顿白宫方圆十公里内所有官员",
        "deadline": "立即"
      },
      "instantEcho": {
        "directResult": "所有官员同时知晓第二封信内容，决策层被迫讨论撤土耳其导弹。",
        "unexpectedCost": "部分官员精神受冲击，出现短暂混乱。",
        "beneficiary": "赫鲁晓夫（其要求被公开）",
        "payer": "你（被指责泄露机密）"
      }
    },
    {
      "id": "C",
      "powerId": "teleport-crowd",
      "displayLabel": "传送肯尼迪到莫斯科红场",
      "label": "你瞬间把肯尼迪、罗伯特·肯尼迪、麦克纳马拉等最多一百人传送到你曾到过的莫斯科红场，迫使他们当面与赫鲁晓夫谈判。",
      "intent": "强制面对面谈判，消除通信误判。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "传送",
        "target": "肯尼迪总统及核心幕僚",
        "deadline": "立即"
      },
      "instantEcho": {
        "directResult": "肯尼迪等人突然出现在莫斯科红场，克格勃立即包围。",
        "unexpectedCost": "华盛顿失去领导核心，指挥链中断。",
        "beneficiary": "赫鲁晓夫（获得谈判主场）",
        "payer": "美国国家安全团队"
      }
    },
    {
      "id": "C",
      "powerId": "borrow-tomorrow-memory",
      "displayLabel": "借来明日和平解决方案记忆",
      "label": "你提前获得1962年10月28日此刻的记忆，其中包含美国秘密承诺撤土耳其导弹、苏联撤走古巴导弹的解决方案。",
      "intent": "直接知道和平方案，立即建议肯尼迪采纳。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "借取明天此刻自己的记忆",
        "target": "你自己明天此刻的记忆",
        "deadline": "数小时内"
      },
      "instantEcho": {
        "directResult": "你知道了秘密交易细节，立即向肯尼迪报告。",
        "unexpectedCost": "你的记忆与历史稍有偏差（土耳其导弹撤除时间），导致后续紧张。",
        "beneficiary": "肯尼迪总统",
        "payer": "你（承受信息混乱）"
      }
    },
    {
      "id": "C",
      "powerId": "summon-giant-beast",
      "displayLabel": "召唤百米巨兽踏平古巴导弹阵地",
      "label": "你在古巴导弹阵地上空召唤一只百米高的巨兽，它服从你一句命令：摧毁所有导弹发射架。",
      "intent": "物理消灭导弹威胁，避免核战争。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤巨兽并下令摧毁导弹发射架",
        "target": "古巴导弹阵地",
        "deadline": "一小时内"
      },
      "instantEcho": {
        "directResult": "巨兽踩踏导弹阵地，苏联导弹全部被毁。",
        "unexpectedCost": "巨兽也摧毁了部分古巴设施，引发国际谴责。",
        "beneficiary": "美国（消除直接威胁）",
        "payer": "古巴平民（伤亡）"
      }
    },
    {
      "id": "C",
      "powerId": "move-mountain",
      "displayLabel": "移开古巴埃尔·利布里塔山",
      "label": "你把视野内古巴的埃尔·利布里塔山整体移动到佛罗里达海峡，露出可能藏有导弹的地下设施。",
      "intent": "暴露苏联秘密导弹基地，迫使苏联承认。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "移动山体到指定位置",
        "target": "埃尔·利布里塔山",
        "deadline": "数小时内"
      },
      "instantEcho": {
        "directResult": "山体移到海峡，古巴露出导弹发射井，全球媒体拍摄。",
        "unexpectedCost": "山体移动引发海啸，淹没部分海岸。",
        "beneficiary": "美国情报机构",
        "payer": "沿海居民"
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
  "berlin-wall-1989": [
    {
      "id": "C",
      "powerId": "see-hidden-writing",
      "displayLabel": "读出盖世太保销毁的旧指令",
      "label": "你在挤满人群的闸门前命令卫兵暂停，用能力读出被烧毁的旧文件残片上的命令：1989年11月9日17时指令——若遇大规模聚集，可开放所有通道。",
      "intent": "用消失的书面证据打破亚格对上级命令的顾虑。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "读出被烧毁的旧文件残片上的文字",
        "target": "1989年11月9日17时的旧指令",
        "deadline": "卫兵举枪前"
      },
      "instantEcho": {
        "directResult": "亚格看到你口中念出的残存文字，认定开闸有据可依。",
        "unexpectedCost": "你因长时间凝视灰烬导致短暂失明。",
        "beneficiary": "亚格",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "pocket-building",
      "displayLabel": "收走检查站的证件室",
      "label": "你趁卫兵分神，将边检站证件室楼房连同里面的档案和三名盖章员收入口袋，迫使亚格无法再依赖护照盖章流程。",
      "intent": "物理消除拖延手段，逼指挥官做决定。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "收走边检站证件室",
        "target": "东柏林鲍尔霍莫大街口岸证件室",
        "deadline": "盖章员取出印章前"
      },
      "instantEcho": {
        "directResult": "证件室消失，亚格和卫兵面面相觑。",
        "unexpectedCost": "口袋内三人因缺氧昏迷。",
        "beneficiary": "挤在闸门前的数千人",
        "payer": "三名盖章员"
      }
    },
    {
      "id": "C",
      "powerId": "restore-youth",
      "displayLabel": "让亚格倒退回1950年身体",
      "label": "你碰了一下哈拉尔德·亚格的肩膀，他的身体瞬间回到40年前的20岁体能状态。他愣住后，腰杆挺直，以年轻人冲动下令开闸。",
      "intent": "使指挥官以体力冲动替代谨慎官僚决策。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触碰亚格肩膀",
        "target": "哈拉尔德·亚格",
        "deadline": "他下达不开闸命令前"
      },
      "instantEcho": {
        "directResult": "亚格变年轻并激动下令开闸。",
        "unexpectedCost": "他的记忆不再可靠，事后总觉自己才20岁。",
        "beneficiary": "挤入闸门的东德民众",
        "payer": "亚格的历史认知"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-money",
      "displayLabel": "用马克买通卫兵队长",
      "label": "你从口袋中取出当前面额的无限量东德马克，一把塞给边防军卫兵队长，说这是新规里补偿金，他数也不数就挥手放行。",
      "intent": "贿赂瓦解执行层对命令的服从。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "取出大量东德马克",
        "target": "边防军卫兵队长",
        "deadline": "人群冲撞铁门之前"
      },
      "instantEcho": {
        "directResult": "卫兵队长收钱后命令部下后退。",
        "unexpectedCost": "货币流通冲击东德经济，面值短期崩溃。",
        "beneficiary": "卫兵队长",
        "payer": "东德国家银行"
      }
    },
    {
      "id": "C",
      "powerId": "shrink-object",
      "displayLabel": "缩小闸门铁锁",
      "label": "你趁卫兵与人群对峙，碰了一下铁锁，闸门铁锁缩小到掌心大小掉落在地，人群推开门涌入。",
      "intent": "物理突破闸门，制造不可逆事实。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "缩小闸门铁锁",
        "target": "东柏林鲍尔霍莫大街口岸闸门铁锁",
        "deadline": "卫兵开火前"
      },
      "instantEcho": {
        "directResult": "铁锁缩小脱落，人群推开闸门。",
        "unexpectedCost": "铁锁缩小后重量仍在，你手指骨折。",
        "beneficiary": "最先推门的几个人",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "transfer-cost",
      "displayLabel": "转移开闸责任给误报记者",
      "label": "你大声对亚格说：将开闸的一切行政代价转移给几小时前误称新规生效的东德发言人冈特·沙博夫斯基。亚格犹豫后默许。",
      "intent": "消除指挥官担责恐惧，加速决断。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "转移开闸决策代价",
        "target": "东德新闻发言人冈特·沙博夫斯基",
        "deadline": "亚格拿起电话前"
      },
      "instantEcho": {
        "directResult": "亚格感觉责任已转移，下令开闸。",
        "unexpectedCost": "沙博夫斯基次日被迫辞职并心脏病发。",
        "beneficiary": "亚格",
        "payer": "沙博夫斯基"
      }
    }
  ],
  "east-zhou-770bc": [
    {
      "id": "C",
      "powerId": "blink-self",
      "displayLabel": "带鼎瞬移洛邑东门",
      "label": "你手按王室传国鼎，眨眼间连同它出现在洛邑东门外诸侯接应阵前，让犬戎无法劫走宗庙重器。",
      "intent": "在犬戎逼近前，用瞬移把传国鼎安全送到东迁目的地，消除迁都无法携带重器的死结。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "手握传国鼎，发动带物瞬移",
        "target": "传国鼎",
        "deadline": "犬戎游骑将在日落前逼近镐京"
      },
      "instantEcho": {
        "directResult": "传国鼎出现在洛邑东门，诸侯瞠目结舌。",
        "unexpectedCost": "你瞬移后鼎身烫得无法触摸，镐京驿道上的车驾令竹简在瞬移中被扯裂。",
        "beneficiary": "周平王",
        "payer": "你左手的烫伤与车驾令的损毁"
      }
    },
    {
      "id": "C",
      "powerId": "summon-future-self",
      "displayLabel": "召唤十年后司马决断",
      "label": "你在镐京东门驿道召来十年后已平定洛邑的自身，他夺过毛笔签下车驾令并勒令你封存宗庙重器，然后消失。",
      "intent": "用未来的权威经验瞬间打破当前对是否签发车驾令的犹豫，确保东迁启动。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤十年后的自己来签署命令",
        "target": "车驾令与宗庙重器",
        "deadline": "犬戎游骑将在日落前逼近镐京"
      },
      "instantEcho": {
        "directResult": "车驾令已签，重器封箱完毕。",
        "unexpectedCost": "十年后的你留下了一句'洛邑内乱将起'，让你心中不安。",
        "beneficiary": "周平王",
        "payer": "你未来的记忆被短暂清空"
      }
    },
    {
      "id": "C",
      "powerId": "invisibility",
      "displayLabel": "隐身护送平王穿越犬戎防线",
      "label": "你让自己和整辆王车隐形，在犬戎游骑眼皮下策马通过镐京东门驿道直抵洛邑。",
      "intent": "用完全隐身骗过已经逼近的犬戎游骑，让平王车驾安全离开镐京。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动隐身覆盖自己和周平王的马车",
        "target": "周平王的车驾",
        "deadline": "犬戎游骑将在日落前逼近镐京"
      },
      "instantEcho": {
        "directResult": "犬戎游骑困惑地在驿道上来回寻找，但平王车驾已平安抵达洛邑。",
        "unexpectedCost": "隐身结束后，你发现车驾令被风吹走，需重写。",
        "beneficiary": "周平王",
        "payer": "你因消耗过大头晕三天"
      }
    },
    {
      "id": "C",
      "powerId": "split-river",
      "displayLabel": "分开渭水阻断犬戎追兵",
      "label": "你命令渭河在镐京东门驿道段分开，河水倒灌形成泥沼，犬戎游骑无法渡河追赶。",
      "intent": "利用分江之力制造天然障碍，拖延犬戎追击，为平王东迁争取时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让渭河分开阻断驿道",
        "target": "渭河",
        "deadline": "犬戎游骑将在日落前逼近镐京"
      },
      "instantEcho": {
        "directResult": "渭河裂开，泥浆吞没了犬戎先头部队。",
        "unexpectedCost": "镐京东门驿道被淹，你用的车驾令竹简被水冲走。",
        "beneficiary": "周平王与东迁车队",
        "payer": "你失去车驾令原件，需快马报洛邑重发"
      }
    },
    {
      "id": "C",
      "powerId": "speak-any-distance",
      "displayLabel": "对话洛邑诸侯调兵接应",
      "label": "你站在原地直接与洛邑诸侯统领通话，命令他立即派五百兵士提前至镐京以东五十里接应平王。",
      "intent": "在犬戎逼近的绝境下实时协调洛邑兵力，确保接应及时到位。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "实时通话命令洛邑诸侯出兵",
        "target": "洛邑诸侯统领",
        "deadline": "犬戎游骑将在日落前逼近镐京"
      },
      "instantEcho": {
        "directResult": "洛邑五百精兵提前出动，平王车队顺利会师。",
        "unexpectedCost": "通话耗尽精力，你昏迷倒地。",
        "beneficiary": "周平王",
        "payer": "你后续决策权暂时旁落"
      }
    },
    {
      "id": "C",
      "powerId": "duplicate-place",
      "displayLabel": "复制镐京东门诱骗犬戎",
      "label": "你在驿道旁复制一座镐京东门及全套仪仗，犬戎游骑被吸引去劫掠假门，真车队向东安全撤离。",
      "intent": "用复制出来的假镐京东门吸引犬戎注意力，让平王车驾趁机脱身。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在空地复制镐京东门",
        "target": "镐京东门",
        "deadline": "犬戎游骑将在日落前逼近镐京"
      },
      "instantEcho": {
        "directResult": "犬戎游骑冲击复制的东门，真车队安全东行。",
        "unexpectedCost": "复制物在一天后消失时，犬戎将怒火转向真正的镐京百姓。",
        "beneficiary": "周平王与东迁车队",
        "payer": "留京的镐京百姓承受犬戎报复"
      }
    }
  ],
  "shang-yang-356bc": [
    {
      "id": "C",
      "powerId": "walk-through-walls",
      "displayLabel": "带商鞅穿墙出宫",
      "label": "你在群臣反对声中拉住商鞅，穿墙离开栎阳宫墙，直接走进南门外的县吏署，避开一切阻挠提前颁行新法。",
      "intent": "绕过朝堂辩论和贵族阻拦，直接送达法令。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触碰商鞅并与他一起穿过宫墙",
        "target": "商鞅",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "你和商鞅出现在县吏署内，商鞅直接向各县吏出示盖印新法文书。",
        "unexpectedCost": "宫墙守卫报告‘商鞅失踪’，引发短暂混乱。",
        "beneficiary": "商鞅",
        "payer": "你（冒擅闯宫禁之名）"
      }
    },
    {
      "id": "C",
      "powerId": "immortal-day",
      "displayLabel": "令秦孝公今日不死",
      "label": "你看到旧贵族密谋在午时宴饮中毒杀秦孝公，于是赐他一日不死，使其在二十四小时内无法死亡或失去意识，安然盖印颁法。",
      "intent": "消除孝公遭暗杀风险，确保变法首脑存活。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触碰秦孝公并发动不死赐予",
        "target": "秦孝公",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "秦孝公喝下毒酒却毫无异状，继续主持朝会。",
        "unexpectedCost": "毒酒被查出但无法追责，旧贵族更怨恨你。",
        "beneficiary": "秦孝公",
        "payer": "你（被贵族视为威胁）"
      }
    },
    {
      "id": "C",
      "powerId": "transmute-material",
      "displayLabel": "将竹简变青铜诏令",
      "label": "你把第一份新法竹简的材料永久变成青铜，使其不可篡改、不可烧毁，在栎阳宫门前当众宣读后悬挂示众。",
      "intent": "防止贵族事后篡改或毁坏法令文本。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触摸竹简并说出将材料变为青铜",
        "target": "商鞅拟定的第一份新法竹简",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "竹简变成青铜牌，文字清晰刻于其上，无法刮削。",
        "unexpectedCost": "青铜牌重达百斤，悬挂需额外绳索与木架。",
        "beneficiary": "秦国法令",
        "payer": "你（搬运青铜牌劳累）"
      }
    },
    {
      "id": "C",
      "powerId": "broadcast-thought",
      "displayLabel": "向栎阳全城广播新法要旨",
      "label": "你站在宫门前，让方圆十公里内所有人脑中同时听见你的话：‘什伍连坐，军功授爵，新法即刻生效。’",
      "intent": "绕过吏员传达的延误与扭曲，让所有百姓同时知法。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "集中意念发送一句话",
        "target": "栎阳城内所有百姓与官员",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "全城人同时愣住，随后议论纷纷，无人不知新法。",
        "unexpectedCost": "部分百姓惊恐以为是妖术，引发短暂骚动。",
        "beneficiary": "秦国基层",
        "payer": "你（被怀疑为方士）"
      }
    },
    {
      "id": "C",
      "powerId": "teleport-crowd",
      "displayLabel": "将反对贵族传送至边塞军营",
      "label": "你把朝堂上带头反对军功授爵的甘龙、杜挚等八十名旧贵族连同他们的侍从，瞬间传送到西河前线秦军大营，令其亲眼目睹秦兵因军功晋爵的实况。",
      "intent": "用实证击破‘军功授爵不可行’的论调。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向反对贵族群体并发动传送",
        "target": "甘龙、杜挚及其随从共八十人",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "这群贵族突然出现在秦军大营，目睹士兵因斩首立功获得爵位田地。",
        "unexpectedCost": "军营警戒升级，部分传送者晕眩呕吐。",
        "beneficiary": "秦孝公与商鞅",
        "payer": "甘龙等贵族（受惊且失颜面）"
      }
    },
    {
      "id": "C",
      "powerId": "borrow-tomorrow-memory",
      "displayLabel": "借明日记忆预知变法成败",
      "label": "你提前获得明天此刻的记忆，得知新法已顺利在各乡里执行，但明日午后栎阳城郊有因连坐引发的民变苗头；你立即建议商鞅增派宣法吏安抚。",
      "intent": "预知变法的具体阻力和后续结果，提前弥补漏洞。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "主动启用记忆借取",
        "target": "你自己明天的记忆",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "你获得明天此刻的记忆，看到法令张贴后民众反应。",
        "unexpectedCost": "今日剩余时间你不断闪回未来片段，难以专注。",
        "beneficiary": "商鞅（获知民情动向）",
        "payer": "你（精神负担）"
      }
    }
  ],
  "changping-260bc": [
    {
      "id": "C",
      "powerId": "age-target",
      "displayLabel": "让赵王老去四十年",
      "label": "你指着地图上邯郸的方向，让赵王丹的身体瞬间老去四十年，使他无法再决策朝政——廉颇将重新获得信任。",
      "intent": "消除赵王对赵括的信任，阻止出击命令",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向邯郸方向，发动老化能力",
        "target": "赵王丹",
        "deadline": "半个时辰内"
      },
      "instantEcho": {
        "directResult": "赵王丹瞬间老去四十年，行动迟缓，无法签署出垒诏书。",
        "unexpectedCost": "赵括仍掌握军权，可能强行突围，且廉颇年事已高，难以立刻重返战场。",
        "beneficiary": "廉颇旧部",
        "payer": "赵王丹"
      }
    },
    {
      "id": "C",
      "powerId": "universal-language",
      "displayLabel": "听懂秦军号令",
      "label": "你竖起耳朵，瞬间听懂秦军阵中所有语言——发现白起正在用暗语指挥合围，于是你向赵括报告。",
      "intent": "获取白起的战术部署，避免中伏",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动语言能力倾听秦军对话",
        "target": "白起的暗语命令",
        "deadline": "半个时辰内"
      },
      "instantEcho": {
        "directResult": "你听到白起命令骑兵切断粮道，并准备夹击。",
        "unexpectedCost": "赵括因你身份低微而怀疑情报的真实性，可能仍选择出击。",
        "beneficiary": "赵括",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "intangible-walls",
      "displayLabel": "让秦军壁垒虚化",
      "label": "你冲上寨墙，发动能力让秦军新建的包围壁垒变得可以穿过——赵军骑兵能直捣白起中军。",
      "intent": "打破秦军的包围圈，使赵军能反攻",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触摸秦军壁垒并发动虚化能力",
        "target": "秦军包围壁垒",
        "deadline": "半个时辰内"
      },
      "instantEcho": {
        "directResult": "秦军壁垒变得透明可穿越，赵军骑兵冲出。",
        "unexpectedCost": "虚化只持续一小时，秦军步兵仍可能封锁缺口。",
        "beneficiary": "赵括的先锋骑兵",
        "payer": "秦军工匠"
      }
    },
    {
      "id": "C",
      "powerId": "reverse-cause",
      "displayLabel": "颠倒赵括出击的结果",
      "label": "你指向赵括，发动逆转——让“赵括被围”这个结果变成原因，而原因“赵军固守”变成结果。于是赵括从未出击。",
      "intent": "避免赵括出击，维持防守态势",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向赵括并发动因果颠倒",
        "target": "赵括即将出击的命令",
        "deadline": "半个时辰内"
      },
      "instantEcho": {
        "directResult": "赵括发现自己仍在壁垒中，出击命令从未存在。",
        "unexpectedCost": "粮道已被切断，防守也难持久，秦军可能改用水攻。",
        "beneficiary": "廉颇旧部",
        "payer": "时间线"
      }
    },
    {
      "id": "C",
      "powerId": "stop-time",
      "displayLabel": "暂停时间十分钟",
      "label": "你大吼一声，让时间暂停——除你之外，整个战场凝固。你趁机砍断秦军伏兵的旗帜，并改变传令兵的口信。",
      "intent": "在合围完成前破坏秦军的指挥协调",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动时间停止，然后行动",
        "target": "秦军伏兵旗帜和传令兵口信",
        "deadline": "仅十分钟"
      },
      "instantEcho": {
        "directResult": "秦军旗帜倒地，传令兵收到假命令。",
        "unexpectedCost": "时间恢复后，白起发现异常，可能加速合围。",
        "beneficiary": "赵括",
        "payer": "你（承受时间紊乱头晕）"
      }
    },
    {
      "id": "C",
      "powerId": "clone-self",
      "displayLabel": "复制一百个自己传令",
      "label": "你一拍手，一百个你同时出现。你们分头奔向各营，向廉颇旧部传达“守住粮道，不得出击”的严令。",
      "intent": "阻止赵括出击，并让廉颇旧部接管防务",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动复制能力并指挥分身",
        "target": "廉颇旧部营垒",
        "deadline": "半个时辰内"
      },
      "instantEcho": {
        "directResult": "一百个你同时传令，廉颇旧部开始封堵出垒通道。",
        "unexpectedCost": "赵括认为你哗变，下令逮捕你；分身存在一天，可能引发混乱。",
        "beneficiary": "廉颇旧部",
        "payer": "你（被赵括通缉）"
      }
    }
  ],
  "qin-unification-221bc": [
    {
      "id": "C",
      "powerId": "copy-skill",
      "displayLabel": "复制蒙恬的军令效率",
      "label": "你复制蒙恬传递捷报时使用的加密军令技能，在齐国降表呈入前重新起草统一度量衡诏书，确保丞相王绾无法用旧令阻挠新制推行。",
      "intent": "用蒙恬的军令效率快速签发诏书，消除因官僚延误导致的制度真空。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制蒙恬的军令加密与传递技能",
        "target": "王绾手中待签的旧度量衡诏书",
        "deadline": "一个时辰内齐国降表呈入前"
      },
      "instantEcho": {
        "directResult": "你当着赢政的面改签了统一度量衡诏令，蒙恬的军令标记让文件以最快速度下发各郡。",
        "unexpectedCost": "王绾从此视你为政敌，暗中联合李斯削弱你的御史职权。",
        "beneficiary": "亲政的始皇帝赢政",
        "payer": "支持分封制的王绾集团"
      }
    },
    {
      "id": "C",
      "powerId": "control-weather",
      "displayLabel": "咸阳降雪阻迟旧族集会",
      "label": "你在齐国降表入宫时让咸阳突降暴雪，使聚集在章台宫外反对统一的六国旧贵族无法按时递交请愿书。",
      "intent": "用极端天气阻断六国旧贵族在统一时刻的集中抗议，稳控舆论。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定咸阳突降暴雪",
        "target": "聚集在章台宫外的六国旧贵族",
        "deadline": "齐国降表呈入宫内的那一刻"
      },
      "instantEcho": {
        "directResult": "暴雪让旧贵族们寸步难行，准备好的请愿书被雪水浸湿作废。",
        "unexpectedCost": "赢政怀疑你有沟通天地之能，命令廷尉以妖言罪秘密监视你。",
        "beneficiary": "担心旧势力阻断新政的始皇帝",
        "payer": "韩、赵、魏、楚、燕、齐六国旧臣"
      }
    },
    {
      "id": "C",
      "powerId": "see-hidden-writing",
      "displayLabel": "照见王绾烧毁的分封草案",
      "label": "你让章台宫所有被擦除或烧毁的奏疏文字显现，当场读出王绾烧掉的三十六份劝谏分封的密奏。",
      "intent": "暴露反对统一度量衡的官僚暗线，用铁证消除制度推行阻力。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让王绾已烧毁的密奏文字在空中显形",
        "target": "王绾",
        "deadline": "胜忠降表呈入前的一刻钟"
      },
      "instantEcho": {
        "directResult": "王绾及三十多名官员合谋阻挠统一度量衡的罪证被公开。",
        "unexpectedCost": "赢政下令彻查所有参与官员，造成朝堂短期瘫痪。",
        "beneficiary": "主张帝国集权的李斯与廷尉",
        "payer": "王绾及其背后六国贵族残余势力"
      }
    },
    {
      "id": "C",
      "powerId": "pocket-building",
      "displayLabel": "收走齐王建所在行宫",
      "label": "你将齐王建及其随从所在的章台宫侧殿收入随身口袋，确保降表无法按时呈入，迫使齐王改签全面交权条件。",
      "intent": "通过直接物理隔离，阻断齐国降表传递，争取重新谈判统一条件的时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "收走齐王建所在的章台宫侧殿",
        "target": "齐王建及其随从、降表",
        "deadline": "降表原定呈入宫内的时辰"
      },
      "instantEcho": {
        "directResult": "齐王建发现自己在秦国宫殿中凭空消失，惊吓之下同意签署全面交接军权、图籍的条款。",
        "unexpectedCost": "你驾驭神力的传闻引发赢政恐慌，他命令郎中令日夜看守你的官署。",
        "beneficiary": "获全面实权的秦廷统一计划",
        "payer": "齐国宗室最后一块封地"
      }
    },
    {
      "id": "C",
      "powerId": "restore-youth",
      "displayLabel": "活化李斯为始皇帝献策",
      "label": "你让已老态龙钟的廷尉李斯身体年轻四十年，恢复其三十岁时的精力与机敏，以便在齐国降表进宫前协助你压服分封派。",
      "intent": "通过恢复关键改革者的年轻状态，打破官僚精力限制，获取最有战斗力的盟友。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让廷尉李斯年轻四十年",
        "target": "廷尉李斯",
        "deadline": "齐国降表入宫前一刻"
      },
      "instantEcho": {
        "directResult": "李斯恢复鼎盛状态，当场撰写统一度量衡的峻法条款，言辞犀利折服王绾。",
        "unexpectedCost": "李斯因年轻而野心膨胀，此后开始排挤你，并将你视作威胁。",
        "beneficiary": "急需强力大臣推行新政的赢政",
        "payer": "本应退休、现却持续掌权的老年官僚体系"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-money",
      "displayLabel": "秦半两收买齐国降使",
      "label": "你在齐国降表入宫前，取出无穷无尽的崭新秦半两，当堂赏赐所有持观望态度的齐国使团成员，收买他们支持统一条件。",
      "intent": "用无法拒绝的财富瞬间瓦解敌对阵营，确保统一进程中无暗桩。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "取出堆积如山的全新秦半两",
        "target": "齐国降使及随行官员",
        "deadline": "齐国降表呈入前的最后一刻"
      },
      "instantEcho": {
        "directResult": "齐国使团全员倒戈，不仅支持统一度量衡诏书，更主动交出齐国六玺。",
        "unexpectedCost": "突然涌入的巨量秦半两导致咸阳物价波动，庶民遭遇短暂通胀。",
        "beneficiary": "正为财政发愁的内史腾",
        "payer": "依靠旧币囤积居奇的秦国大商贾"
      }
    }
  ],
  "daze-uprising-209bc": [
    {
      "id": "C",
      "powerId": "conjure-water",
      "displayLabel": "蓄满营地水缸等秦吏到来",
      "label": "你在秦吏清点前，于营地中央连续生成清水，蓄满所有空缸，声称这是上天赐予起义的甘露，让戍卒们相信天意助我。",
      "intent": "解决暴雨后缺水问题，让戍卒相信天意，团结人心。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "持续生成清水灌满营地所有空缸",
        "target": "大泽乡戍卒营的水缸",
        "deadline": "天亮前秦吏清点人员时"
      },
      "instantEcho": {
        "directResult": "所有水缸满溢，戍卒们震惊跪拜，认为天降祥瑞。",
        "unexpectedCost": "吴广担心此举暴露超自然力量，引起秦吏警惕。",
        "beneficiary": "陈胜和吴广",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "read-one-mind",
      "displayLabel": "窥探吴广心底的起义决心",
      "label": "你决定在起义前夕读取吴广的真实想法，看他是否真的愿意拼死起兵，还是心存犹豫，以此决定是否全力支持他。",
      "intent": "确认核心盟友的真实决心，避免内部动摇。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "集中意念读取吴广思想",
        "target": "吴广",
        "deadline": "天亮前必须行动"
      },
      "instantEcho": {
        "directResult": "你清楚看到吴广脑海中陈胜鼓动他的画面，以及他对‘王侯将相宁有种乎’的深信不疑。",
        "unexpectedCost": "吴广突然感到一阵头痛，怀疑是鬼神作祟。",
        "beneficiary": "你",
        "payer": "吴广"
      }
    },
    {
      "id": "C",
      "powerId": "blink-self",
      "displayLabel": "瞬移取来军旗立于营门",
      "label": "你带着营中一面陈旧军旗，瞬间移动到营门高处插旗，旗帜无风自展，戍卒视为起义号令。",
      "intent": "以视觉奇观打破戍卒对秦法的恐惧。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "抓住旗帜瞬移至营门并插旗",
        "target": "大泽乡戍卒营门",
        "deadline": "天亮前"
      },
      "instantEcho": {
        "directResult": "军旗飘扬，戍卒们惊呼神迹，士气大振。",
        "unexpectedCost": "陈胜质问你怎么做到的，你必须解释。",
        "beneficiary": "陈胜和吴广",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "summon-future-self",
      "displayLabel": "召来十年后已从军的自己",
      "label": "你召来十年后已成为起义军老兵的你，让他现身说法，讲述张楚政权建立、秦朝灭亡的胜利故事，激励戍卒起义。",
      "intent": "用未来的胜利逆转当下的犹豫。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "施展能力召来未来的你",
        "target": "未来十年的你",
        "deadline": "天亮前"
      },
      "instantEcho": {
        "directResult": "未来的你出现，描述了后期攻入咸阳的细节，众人信服。",
        "unexpectedCost": "未来的你透露了起义军内部日后分裂的消息。",
        "beneficiary": "陈胜和吴广",
        "payer": "未来的你"
      }
    },
    {
      "id": "C",
      "powerId": "invisibility",
      "displayLabel": "隐身偷取秦吏的兵符",
      "label": "你隐身潜入秦吏营帐，盗取兵符后返回，公开宣称秦吏已无权威，戍卒不受其制。",
      "intent": "通过偷取权威象征，彻底瓦解秦吏的指挥权。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "隐身进入秦吏营帐盗取兵符",
        "target": "秦吏营帐内的兵符",
        "deadline": "天亮前"
      },
      "instantEcho": {
        "directResult": "兵符到手，秦吏发现失窃后惊慌失措。",
        "unexpectedCost": "秦吏怀疑内鬼，开始搜查营地，增加了起义的紧迫性。",
        "beneficiary": "戍卒全体",
        "payer": "秦吏"
      }
    },
    {
      "id": "C",
      "powerId": "split-river",
      "displayLabel": "分开淮河支流彰显天意",
      "label": "你在大泽乡附近的河岸边命令河水分开，露出干涸河床，声称这是上天为起义军开辟的道路，鼓舞人心。",
      "intent": "制造神迹巩固戍卒的信仰，使起义不可逆转。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "对着河水施展分河能力",
        "target": "大泽乡附近的河流",
        "deadline": "天亮前"
      },
      "instantEcho": {
        "directResult": "河水向两侧分开，河床裸露，鱼虾跳蹦，戍卒跪拜。",
        "unexpectedCost": "河水回流后可能淹没部分营地。",
        "beneficiary": "陈胜和吴广",
        "payer": "你"
      }
    }
  ],
  "han-founded-202bc": [
    {
      "id": "C",
      "powerId": "rust-weapons",
      "displayLabel": "锈断诸侯佩剑",
      "label": "你在诸侯登坛前举袖拂过所有佩剑剑身，使楚王韩信、梁王彭越、淮南王英布等人的青铜剑刃瞬间锈蚀剥落，无法在劝进行列中作势威胁。",
      "intent": "用武器锈毁消除诸侯最后可能的武装威慑，迫使劝进只能以纯粹臣服姿态完成。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "举袖拂过所有诸侯佩剑剑身",
        "target": "楚王韩信、梁王彭越、淮南王英布等人的青铜剑",
        "deadline": "午时列阵前"
      },
      "instantEcho": {
        "directResult": "诸侯腰悬剑鞘，剑柄完好但拔出时只剩锈渣。",
        "unexpectedCost": "你自己腰间赤霄剑亦在范围之内一同锈毁，身侧监礼御史惊疑，但不敢当场质问。",
        "beneficiary": "刘邦",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "guarantee-action",
      "displayLabel": "保宣诏一字不差",
      "label": "你望着手中竹简诏书，在迈步登坛前低语：此宣读必无失误、无人可阻。随后你高声念诵诸侯劝进表与皇帝即位诏，声贯全坛，诸侯每闻一句便伏地叩首。",
      "intent": "消除宣诏失误或被人打断的风险，使即位程序等同于不可逆事实。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "低声指定接下来的宣读行动必然成功",
        "target": "手中竹简上的劝进表与即位诏全文",
        "deadline": "即刻登坛宣读"
      },
      "instantEcho": {
        "directResult": "你诵完最后一个字时，诸侯已齐声高呼万岁，无人质疑格式或封国条款。",
        "unexpectedCost": "你声带在读完诏书后彻底失声，此后三日无法言语。",
        "beneficiary": "刘邦",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "walk-through-walls",
      "displayLabel": "穿坛入室独见韩信",
      "label": "你趁众人列阵间隙，拉住楚王韩信的手穿过后台帷帐与木墙，进到一座临时苫帐内。帐外诸侯只见帷动不见人影，你低声对他说：陛下登基后首个诏令将是定都关中，而非分封近地。",
      "intent": "在登基前私下探查韩信对将来迁都的真实态度，避免封国争议当场爆发。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "拉住韩信的手穿过后台帷帐与木墙",
        "target": "楚王韩信",
        "deadline": "午时诸侯列阵前"
      },
      "instantEcho": {
        "directResult": "韩信与你瞬间出现在四面漏风的后帐，他捏了捏你手腕证明非幻觉。",
        "unexpectedCost": "你穿墙后左臂衣物与部分皮肉留在了木墙中，血渍洇染了韩信衣袖。",
        "beneficiary": "你（获得情报）",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "immortal-day",
      "displayLabel": "护樊哙一日不死",
      "label": "你见樊哙按剑站在刘邦身侧，眼底充血——他刚获知吕后可能被诸侯质子恫吓。你在他肩头一拍，低声说：今日你绝死不了。随后他冲撞张良时被侍卫刺穿胸腹，伤口瞬间止血愈合，只留下一道银疤。",
      "intent": "阻止登基典礼上因樊哙之死触发吕后与诸侯的公开冲突，维持劝进程序一次性通过。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在樊哙肩头一拍并说出承诺",
        "target": "舞阳侯樊哙",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "樊哙遭刺后伤口迅速弥合，仍在叫骂但体力如常。",
        "unexpectedCost": "你原本有三十七岁寿命，此刻折损七年，鬓边立现白发。",
        "beneficiary": "刘邦、吕后",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "transmute-material",
      "displayLabel": "变竹简为金板玉册",
      "label": "你捧起那卷诸侯劝进表，轻抚竹片，低声念：化为青金石版。竹简在众目睽睽之下变为三片连缀的深蓝金纹玉板，字体浮凸，光润如镜。诸侯见天降祥瑞，跪拜愈发虔诚。",
      "intent": "用神迹化劝进表为不可磨灭之器，消除日后诸侯抵赖怀质疑的可能。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "抚摸竹简并念出材料转换指令",
        "target": "诸侯联名劝进竹简",
        "deadline": "宣读劝进表前一刻"
      },
      "instantEcho": {
        "directResult": "诸侯亲眼看到简牍化为玉版，上面文字清晰，无法涂改。",
        "unexpectedCost": "你右手五根指尖变为青金石质地，永久失去触觉且无法持物。",
        "beneficiary": "汉朝正统性",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "broadcast-thought",
      "displayLabel": "传谕诸侯退兵归国",
      "label": "你在刘邦接过皇帝玺绶的瞬间，闭目低吼：诸王率其兵众各归封国，来时道路即为新定疆界。方圆十里内所有人脑中同时响起这句话，诸侯身体僵住，随即纷纷下令撤去列阵甲士。",
      "intent": "用不可违抗的脑内指令在登基同时完成战后军队解散，避免临时兵变。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "闭目低吼发出脑内广播",
        "target": "定陶汜水北岸方圆十里内所有诸侯及其部卒",
        "deadline": "皇帝玺绶交接瞬间"
      },
      "instantEcho": {
        "directResult": "诸侯按剑的手放下，传令兵开始挥舞撤军旗帜。",
        "unexpectedCost": "你大脑承受过度负载，此后永久失去记住新面孔的能力。",
        "beneficiary": "刘邦（急需的和平撤军）",
        "payer": "你"
      }
    }
  ],
  "zhang-qian-138bc": [
    {
      "id": "C",
      "powerId": "share-memory",
      "displayLabel": "让张骞看到十年后的长安",
      "label": "你握住张骞的手，将你自己亲历的十年后长安西市胡商云集的记忆共享给他，让他以第一视角目睹未来西域之路带来的繁荣。",
      "intent": "用未来景象坚定张骞出使的决心，消除他对未知道路的恐惧。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "握住张骞的手并共享记忆",
        "target": "张骞",
        "deadline": "使团将在城门关闭前启程"
      },
      "instantEcho": {
        "directResult": "张骞眼前浮现出十年后长安西市胡商云集、丝绸香料交易的景象。",
        "unexpectedCost": "张骞因震惊而短暂失神，需你搀扶才能站稳。",
        "beneficiary": "张骞",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "door-anywhere",
      "displayLabel": "在未央宫墙上开一扇通往大月氏的门",
      "label": "你走到未央宫西阙的宫墙前，用指尖在墙上画一个门框，墙壁随即变成一道通往大月氏王庭的光门。",
      "intent": "让张骞使团瞬间穿越匈奴控制区直达目的地，避免被匈奴扣留的风险。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用手指在墙上画门框",
        "target": "未央宫西阙宫墙",
        "deadline": "使团将在城门关闭前启程"
      },
      "instantEcho": {
        "directResult": "宫墙上出现一道发光门框，门外可看见大月氏的王庭帐篷和草原。",
        "unexpectedCost": "门出现时释放的强光灼伤了你的视网膜，你暂时失明十分钟。",
        "beneficiary": "张骞使团",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "age-target",
      "displayLabel": "让张骞的老仆老去四十年",
      "label": "你指向张骞身后那位年迈的老仆，令他身体瞬间老去四十年，变成一位无法行动、需要人照料的老者。",
      "intent": "让张骞意识到路上衰老和死亡的风险，从而坚持带上更多护卫和医官。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向老仆并发动能力",
        "target": "张骞身后的老仆",
        "deadline": "使团将在城门关闭前启程"
      },
      "instantEcho": {
        "directResult": "老仆脊背佝偻、皮肤干瘪，坐倒在地无法站立。",
        "unexpectedCost": "老仆急速衰老的痛苦哀嚎引来禁军盘问，使团被额外滞留一刻钟进行解释。",
        "beneficiary": "张骞使团",
        "payer": "老仆"
      }
    },
    {
      "id": "C",
      "powerId": "universal-language",
      "displayLabel": "向张骞下达一通胡语指令",
      "label": "你流利地以匈奴语向张骞喊道：“若遇匈奴，就说你是匈奴王派往大月氏的密使。”张骞惊讶于你能说胡语，但听懂了每一个字。",
      "intent": "为张骞提供一套过关的伪身份说辞，降低他被匈奴扣留的风险。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "以匈奴语喊出指令",
        "target": "张骞",
        "deadline": "使团将在城门关闭前启程"
      },
      "instantEcho": {
        "directResult": "张骞将你的话复述一遍，并记录在竹简上准备携带。",
        "unexpectedCost": "旁边一位宦官因怀疑你通敌而向汉武帝密报，你日后将被调离郎官职位。",
        "beneficiary": "张骞",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "intangible-walls",
      "displayLabel": "让未央宫宫墙变得可穿越",
      "label": "你张开双臂对准未央宫宫墙，宫墙变得如薄雾般可以穿行，使团人员和马匹可直接通过。",
      "intent": "让使团不经城门直接出发，避免被城门守军查验或阻挠。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "张开双臂对准宫墙",
        "target": "未央宫宫墙",
        "deadline": "使团将在城门关闭前启程"
      },
      "instantEcho": {
        "directResult": "宫墙变得透明可穿，使团众人目瞪口呆。",
        "unexpectedCost": "穿透宫墙时，你自身撞上一根隐藏的木柱，额头受伤流血。",
        "beneficiary": "张骞使团",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "reverse-cause",
      "displayLabel": "让张骞被扣结果变为他出发的原因",
      "label": "你指着汉武帝的诏书说：“张骞被匈奴扣留十年不是结果，而是他获得西域地图的原因。”因果改写：张骞被扣因为已怀揣西域地图（原被扣结果变为原因）。",
      "intent": "让张骞在出发前已拥有西域地图，从而规划安全路线避免被扣留。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指汉武帝诏书并出言改写因果",
        "target": "汉武帝诏书中‘出使大月氏’的命令",
        "deadline": "使团将在城门关闭前启程"
      },
      "instantEcho": {
        "directResult": "张骞从怀中掏出了一份从未见过的大月氏及沿途地形图。",
        "unexpectedCost": "因果改写让汉武帝的诏书内容变为‘找到地图后出使’，张骞需先解释地图来源，耗费半个时辰。",
        "beneficiary": "张骞使团",
        "payer": "你"
      }
    }
  ],
  "mobei-119bc": [
    {
      "id": "C",
      "powerId": "sentence-becomes-true",
      "displayLabel": "决断定襄水源",
      "label": "你写下‘定襄大营三里内发现新的清泉’并使其成为事实，确保拔营前全军充足饮水。",
      "intent": "解决沙漠中水源短缺的致命瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "写下一句不超过二十字的陈述并让它立即成为客观事实",
        "target": "定襄大营",
        "deadline": "大军必须在沙尘升起前拔营"
      },
      "instantEcho": {
        "directResult": "定襄大营三里外突然涌出清泉，全军欢呼。",
        "unexpectedCost": "新泉水引来大量野兽，惊扰营地。",
        "beneficiary": "卫青和汉军全体",
        "payer": "负责警戒的巡营士兵"
      }
    },
    {
      "id": "C",
      "powerId": "jump-tomorrow",
      "displayLabel": "单于坐骑延至明日",
      "label": "你让匈奴单于的战马跳过今天直接抵达明天，令其无法在今日追击汉军斥候。",
      "intent": "延迟单于的机动能力，为汉军争取侦察时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让指定的人或物跳过接下来的二十四小时直接抵达明天",
        "target": "匈奴单于的战马",
        "deadline": "大军必须在沙尘升起前拔营"
      },
      "instantEcho": {
        "directResult": "单于战马瞬间消失，次日才出现，匈奴骑兵失去指挥。",
        "unexpectedCost": "战马消失引发匈奴营地混乱，反而加速了其调整。",
        "beneficiary": "汉军斥候",
        "payer": "匈奴单于"
      }
    },
    {
      "id": "C",
      "powerId": "copy-skill",
      "displayLabel": "复制赵破奴识途术",
      "label": "你复制赵破奴的沙漠识途技能，直接辨别俘虏口供真伪。",
      "intent": "破解向导短缺与真假情报的困局。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "完整复制现场一人的一项知识或技能并达到同等水平",
        "target": "赵破奴",
        "deadline": "大军必须在沙尘升起前拔营"
      },
      "instantEcho": {
        "directResult": "你瞬间掌握赵破奴十年沙漠经验，一眼看出俘虏口供是诱敌之计。",
        "unexpectedCost": "赵破奴因此暂时丧失该技能，需要一天恢复。",
        "beneficiary": "卫青",
        "payer": "赵破奴"
      }
    },
    {
      "id": "C",
      "powerId": "control-weather",
      "displayLabel": "定襄沙暴平息",
      "label": "你指定定襄汉军大营方圆百里未来二十四小时晴朗无风，确保拔营顺利。",
      "intent": "消除沙尘对拔营和行军的阻碍。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定方圆百公里未来二十四小时的风、雨、雪、雾与气温",
        "target": "定襄汉军大营",
        "deadline": "大军必须在沙尘升起前拔营"
      },
      "instantEcho": {
        "directResult": "天空瞬间放晴，沙尘消散，顺利拔营。",
        "unexpectedCost": "晴朗天气使得匈奴斥候更容易发现汉军动向。",
        "beneficiary": "卫青和汉军",
        "payer": "汉军斥候"
      }
    },
    {
      "id": "C",
      "powerId": "see-hidden-writing",
      "displayLabel": "破译俘虏密信",
      "label": "你看见俘虏羊皮卷上被血渍覆盖的真正进军路线。",
      "intent": "直接获取匈奴真实意图，避免情报误判。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "看见现场被擦除、烧毁、加密、遮盖或尚未写下的文字",
        "target": "俘虏身上的羊皮卷",
        "deadline": "大军必须在沙尘升起前拔营"
      },
      "instantEcho": {
        "directResult": "你看到羊皮卷上原本的迷路标记下隐藏着真正的单于巢穴坐标。",
        "unexpectedCost": "羊皮卷上的显影液体灼伤了你的手指。",
        "beneficiary": "卫青",
        "payer": "你的手"
      }
    },
    {
      "id": "C",
      "powerId": "pocket-building",
      "displayLabel": "收走匈奴粮仓",
      "label": "你将匈奴前锋营的粮库收入口袋，使其失去三日补给。",
      "intent": "切断匈奴补给，迫使其改变计划。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "把一座建筑连同内部全部人和物收入随身口袋",
        "target": "匈奴前锋营的粮库",
        "deadline": "大军必须在沙尘升起前拔营"
      },
      "instantEcho": {
        "directResult": "匈奴粮库连同守卫瞬间消失，营中粮荒爆发。",
        "unexpectedCost": "口袋太重，你无法行走，需由两名士兵抬着你。",
        "beneficiary": "卫青大军",
        "payer": "你的双腿"
      }
    }
  ],
  "wang-mang-9": [
    {
      "id": "C",
      "powerId": "stretch-road",
      "displayLabel": "拉长安御道阻百官",
      "label": "你在未央宫前殿与宣平门之间拉长御道至一百公里，使王莽与朝贺百官无法按时抵达，争取时间巩固汉室或另作他图。",
      "intent": "通过延迟朝贺时间，阻止王莽在既定时刻完成建新仪式，为反对势力争取反制窗口。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动拉长道路能力，将未央宫前殿与宣平门之间的御道拉伸至一百公里",
        "target": "未央宫前殿与宣平门之间的御道",
        "deadline": "一刻钟内"
      },
      "instantEcho": {
        "directResult": "御道瞬间延伸，百官与王莽被困在漫长的道路上无法在朝贺时限内抵达未央宫前殿。",
        "unexpectedCost": "刘姓宗室与部分反对王莽的大臣也被困在路上，无法参与后续行动。",
        "beneficiary": "你及可能反对王莽的势力",
        "payer": "被困在路上的所有朝臣，包括潜在盟友"
      }
    },
    {
      "id": "C",
      "powerId": "heal-room",
      "displayLabel": "愈孺子婴病弱之躯",
      "label": "你利用治愈能力瞬间治愈在场所有伤病，包括因长期惊惧而体弱的孺子婴，使其能以健康状态面对禅让场景，增加王莽的舆论风险。",
      "intent": "消除王莽以孺子婴病弱无法理政为借口的合法性，使禅让诏书在外表正常的幼主面前显得更不公正。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动治愈全场伤病能力，覆盖未央宫前殿内所有人员",
        "target": "未央宫前殿内的孺子婴及所有在场伤病者",
        "deadline": "一刻钟内"
      },
      "instantEcho": {
        "directResult": "孺子婴面色红润、眼神明亮，先前因恐惧导致的虚弱消失，王莽无法再用他健康理由加速禅让。",
        "unexpectedCost": "王莽怀疑你用了巫术，立即下令侍卫控制你，并将你隔离审问。",
        "beneficiary": "孺子婴",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "conjure-water",
      "displayLabel": "生甘泉灌未央宫室",
      "label": "你在未央宫前殿正中央凭空生成大量清水，水流迅速浸湿地面、冲散典礼布置，迫使王莽和群臣暂停或延期建新仪式。",
      "intent": "以洪水般的突发事件打乱禅让仪式进程，制造混乱，争取时间或使百官心生疑虑。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动生成清水能力，在未央宫前殿中央持续生成足够一座城市饮用的清水",
        "target": "未央宫前殿",
        "deadline": "一刻钟内"
      },
      "instantEcho": {
        "directResult": "殿内迅速积水数尺，奏案漂浮，冕旒、玉玺等礼器浸水移位，典礼无法正常进行。",
        "unexpectedCost": "大量文书档案（包括可能对刘氏有利的诏令）被水浸泡毁损。",
        "beneficiary": "你及可能希望推迟仪式的人",
        "payer": "典藏官员和稚子婴（个人物品受损）"
      }
    },
    {
      "id": "C",
      "powerId": "read-one-mind",
      "displayLabel": "窥王莽心中虚实",
      "label": "你直接读取王莽此刻全部真实想法与回忆画面，了解他对于禅让的真正意图、担忧和底牌，以便决定是否盖玺或采取其他行动。",
      "intent": "获取关键决策情报，确认王莽是否打算事后杀害孺子婴或有哪些潜在反对派，从而精确应对。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动读取思想能力，指定王莽为目标",
        "target": "王莽",
        "deadline": "持续十分钟内"
      },
      "instantEcho": {
        "directResult": "你清楚地听到王莽心中盘算如何安抚刘氏子弟、清除异己，以及他对符命真实性的怀疑。",
        "unexpectedCost": "你因集中精力读取而脸色苍白、站立不稳，引起王莽身边的侍卫注意。",
        "beneficiary": "你",
        "payer": "你（可能暴露异常状态）"
      }
    },
    {
      "id": "C",
      "powerId": "blink-self",
      "displayLabel": "瞬移传国玺于孺子婴",
      "label": "你带着手中的传国玺瞬间瞬移到孺子婴面前，将玉玺交还给他，使他得以拒绝或延迟盖玺，阻止禅让诏生效。",
      "intent": "直接阻止王莽获取传国玺这一法理核心，使禅让诏无法完成盖玺程序。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动带物瞬移能力，携带传国玺瞬间移动到孺子婴面前并交到他手中",
        "target": "传国玺和孺子婴",
        "deadline": "瞬间发动"
      },
      "instantEcho": {
        "directResult": "传国玺突然出现在孺子婴怀中，王莽大惊失色，百官哗然。",
        "unexpectedCost": "你因瞬移暴露异常能力，被王莽的侍卫当场拿下。",
        "beneficiary": "孺子婴",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "summon-future-self",
      "displayLabel": "召十年后尚书郎谏莽",
      "label": "你召来十年后已亲历新朝崩溃的自己，让他当面警告王莽禅让将导致天下大乱，劝其缓行或修改诏令，利用未来事实动摇王莽决心。",
      "intent": "以来自未来的亲身经历说服王莽放弃或推迟建新，避免改革引发的后续动荡。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动召唤未来自己能力，直接呼唤十年后的自己出现在未央宫前殿",
        "target": "未来十年的你",
        "deadline": "停留一小时"
      },
      "instantEcho": {
        "directResult": "一个更沧桑的你凭空出现，王莽和百官惊愕。未来的你直接指出王莽改制将引发赤眉绿林之乱、新朝迅速覆灭的结局。",
        "unexpectedCost": "未来的你出现后，观众认为你使用了妖术，王莽下令逮捕两人。当前时间的你陷入极大危险。",
        "beneficiary": "孺子婴及汉室",
        "payer": "你（面临被捕或处决风险）"
      }
    }
  ],
  "kunyang-25": [
    {
      "id": "C",
      "powerId": "repeat-minute",
      "displayLabel": "重演王邑中军账内那一分钟",
      "label": "你独自立于南门内，连续重演王邑下令禁止各营自行应战的那一分钟，直至找到他口令中的破绽，再用其中一次结果作为真实行动。",
      "intent": "通过反复观察对手命令细节，突破新军主将的指挥禁令。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "重演王邑下达禁止各营自行应战命令的那一分钟",
        "target": "王邑在昆阳外围中军账内的命令",
        "deadline": "王邑大军将在日出后发动总攻"
      },
      "instantEcho": {
        "directResult": "你听清王邑口令中三个关键停顿，确认了各营援军最快半时辰后到达。",
        "unexpectedCost": "你因反复经历同一步兵集结声，右耳暂时失聪。",
        "beneficiary": "刘秀突击队先锋校尉臧宫",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "command-animals",
      "displayLabel": "令新军战马群冲向本阵",
      "label": "你站在南门城楼上，向方圆十里内所有战马下达命令：冲散新军中军帐篷，踩踏粮草堆。",
      "intent": "利用动物直接瘫痪敌军后勤与指挥中枢。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "向方圆十里内所有战马下达冲散中军帐篷的命令",
        "target": "新军围城马群中的三千匹战马",
        "deadline": "王邑大军将在日出后发动总攻"
      },
      "instantEcho": {
        "directResult": "新军战马突然挣脱缰绳，撞翻中军营帐，粮草堆着火。",
        "unexpectedCost": "汉军马厩里的四十匹战马也服从命令冲了出去，被新军弓弩手射杀。",
        "beneficiary": "刘秀突击队骑兵校尉朱祜",
        "payer": "汉军骑兵队"
      }
    },
    {
      "id": "C",
      "powerId": "rust-weapons",
      "displayLabel": "锈毁昆阳外围新军刀矛",
      "label": "你骑在马上高举佩剑，发动能力让方圆一里内所有新军手中的刀、矛、剑、戟瞬间锈成废铁。",
      "intent": "解除敌军近战武装，使三千敢死队冲锋时对手无力抵抗。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "锈蚀方圆一里内所有武器",
        "target": "昆阳南门外新军阵地上的刀、矛、剑、戟",
        "deadline": "王邑大军将在日出后发动总攻"
      },
      "instantEcho": {
        "directResult": "南门外五千新军士卒手中的武器化为红锈碎块。",
        "unexpectedCost": "城内汉军城门附近的三百把备用手刀也被锈毁。",
        "beneficiary": "刘秀突击队三百刀盾手",
        "payer": "昆阳武库守将冯异"
      }
    },
    {
      "id": "C",
      "powerId": "guarantee-action",
      "displayLabel": "确保南门千斤闸准时升起",
      "label": "你指定接下来要完成的行动：在日出前一刻亲手转动绞盘，让南门千斤闸完全升起，并保证无人能阻止这一动作。",
      "intent": "消除城门开启环节可能出现的机械故障或敌军破坏。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "转动南门绞盘升起千斤闸",
        "target": "昆阳城南门千斤闸",
        "deadline": "日出前一刻"
      },
      "instantEcho": {
        "directResult": "千斤闸在日出前一刻平稳升起，未被新军投石机砸坏。",
        "unexpectedCost": "绞盘链条因全力使用断裂，南门无法再关闭。",
        "beneficiary": "刘秀突击队三千敢死队",
        "payer": "昆阳守门吏李通"
      }
    },
    {
      "id": "C",
      "powerId": "walk-through-walls",
      "displayLabel": "穿墙送密信给城中岑彭",
      "label": "你拉着信使的手穿过南门内墙与城门石板，直接走到延岑营帐，将刘秀突击计划交给他。",
      "intent": "突破新军对昆阳的围困通信封锁，实现内外协同。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "拉着信使穿过南门内墙与城门石板",
        "target": "延岑在昆阳城内的营帐",
        "deadline": "王邑大军将在日出后发动总攻"
      },
      "instantEcho": {
        "directResult": "信使将刘秀的手令送达延岑手中，延岑同意子时出东门佯攻。",
        "unexpectedCost": "你穿过墙体时佩剑卡在砖缝中，丢失了刘秀颁发的骑都尉印信。",
        "beneficiary": "延岑守军",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "immortal-day",
      "displayLabel": "赐刘秀一日不死冲锋",
      "label": "你面对刘秀，指定他在接下来二十四小时内无法死亡或失去意识，然后他翻身上马冲向新军中军。",
      "intent": "确保主将刘秀在强度最高的斩首行动中存活，维持指挥链。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定刘秀在二十四小时内无法死亡或失去意识",
        "target": "刘秀",
        "deadline": "王邑大军将在日出后发动总攻"
      },
      "instantEcho": {
        "directResult": "刘秀身中三箭仍冲入中军，挥剑砍断王邑帅旗。",
        "unexpectedCost": "你因意念集中过度，次日清晨咳血。",
        "beneficiary": "刘秀",
        "payer": "你"
      }
    }
  ],
  "yellow-turban-184": [
    {
      "id": "C",
      "powerId": "shapeshift",
      "displayLabel": "变成唐周夜返坛场",
      "label": "你变成告密者唐周的外貌，连夜返回巨鹿坛场，对搜捕官军谎称太平道已取消起兵，拖延至天亮前再报。",
      "intent": "变成告密者本人，直接误导官军延缓搜捕，为提前传令争取时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "变成唐周外貌返回坛场向官军谎称情报有误",
        "target": "唐周",
        "deadline": "天亮前搜捕抵达坛场"
      },
      "instantEcho": {
        "directResult": "官军误信唐周折返，坛场暂缓搜捕。",
        "unexpectedCost": "真唐周在洛阳闻讯后向官府揭发你的伪装，朝廷加速通缉。",
        "beneficiary": "张角及坛场信众",
        "payer": "你被朝廷列为首要逃犯"
      }
    },
    {
      "id": "C",
      "powerId": "summon-lightning",
      "displayLabel": "雷击唐周阻杀灭口",
      "label": "你对洛阳内应被捕处召下一道雷电，精确击中已被逮捕的唐周，灭口以阻止官府得到更多口供。",
      "intent": "击杀告密者，防止起义计划进一步泄露。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召雷击中囚牢中的唐周",
        "target": "洛阳内应监狱中的唐周",
        "deadline": "天亮前官府审讯唐周之前"
      },
      "instantEcho": {
        "directResult": "唐周当场毙命，官府失去关键证人。",
        "unexpectedCost": "朝廷判定雷击为天谴，更坚信太平道妖术，加大剿杀力度。",
        "beneficiary": "张角及各州渠帅",
        "payer": "东汉朝廷以‘妖贼’罪名全力镇压"
      }
    },
    {
      "id": "C",
      "powerId": "share-memory",
      "displayLabel": "共享张角亲传密信",
      "label": "你让坛场所有渠帅信使以张角第一视角经历他审定起义军规和联络暗号的记忆，确保各州起兵法度统一。",
      "intent": "快速统一分散在各地的渠帅对起义计划的理解，避免传令偏差。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "对在场所有渠帅信使发动共享记忆",
        "target": "张角的亲传密信记忆",
        "deadline": "天亮前传令起兵前"
      },
      "instantEcho": {
        "directResult": "所有渠帅信使瞬间理解起兵全部细节。",
        "unexpectedCost": "部分渠帅因直接目睹张角内心而心生畏惧，怀疑你窃取天机。",
        "beneficiary": "各州渠帅信使",
        "payer": "张角私密记忆被公开"
      }
    },
    {
      "id": "C",
      "powerId": "door-anywhere",
      "displayLabel": "开坛场直通洛阳狱门",
      "label": "你在坛场墙上开一扇门，连接洛阳内应被捕处的牢房，让张角亲自入狱劫走或灭口内应。",
      "intent": "直接干预洛阳审讯，消除起义最后隐患。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在坛场墙上开一扇通往洛阳监狱的门",
        "target": "洛阳内应被捕处的牢房",
        "deadline": "天亮前囚犯被提审前"
      },
      "instantEcho": {
        "directResult": "张角通过门进入洛阳监狱，劫走内应并纵火。",
        "unexpectedCost": "门的存在被狱卒目睹，洛阳震动，朝廷加快部署。",
        "beneficiary": "张角及被救内应",
        "payer": "洛阳守军加强戒备"
      }
    },
    {
      "id": "C",
      "powerId": "age-target",
      "displayLabel": "令张角老去四十年",
      "label": "你对张角发动能力，让他身体瞬间老去四十年，从而以垂暮之相平息官府‘妖人’猜疑，换得传令时间。",
      "intent": "通过衰老改变张角形象，让搜捕官军误认其为普通老者，避免立即被捕。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "对张角施放衰老四十年",
        "target": "张角",
        "deadline": "天亮前搜捕队到达坛场前"
      },
      "instantEcho": {
        "directResult": "张角瞬间变为八旬老者，搜捕队经过时未认出。",
        "unexpectedCost": "张角体力衰退，无法亲自领导起义，需由你代行指挥。",
        "beneficiary": "坛场信众",
        "payer": "张角失去领导能力"
      }
    },
    {
      "id": "C",
      "powerId": "universal-language",
      "displayLabel": "听懂各方方言暗语",
      "label": "你启用全天语言能力，读懂各地渠帅用不同方言和符号写成的密信，并按各自语言统一回复起义时间。",
      "intent": "克服方言和暗号障碍，迅速准确向各州下达提前起兵的命令。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "阅读并翻译所有方言密信，用对应语言回令",
        "target": "各州渠帅的密信",
        "deadline": "天亮前传令完毕"
      },
      "instantEcho": {
        "directResult": "所有密信被准确理解并回复，各州同时起兵。",
        "unexpectedCost": "你因同时处理大量信息精神疲惫，战后失忆。",
        "beneficiary": "太平道各州渠帅",
        "payer": "你的短期记忆"
      }
    }
  ],
  "shu-fall-263": [
    {
      "id": "C",
      "powerId": "infinite-grain",
      "displayLabel": "仓廪涌粮召百姓",
      "label": "你令成都粮仓涌出无限蜀地稻米，召集城中百姓运粮备战，要求邓艾前锋抵达前完成分发。",
      "intent": "用无限粮食消除守城最大弱点，激励军民坚持一月等待姜维回援。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "把手掌贴住成都皇城北门粮仓大门，令其涌出无限稻米",
        "target": "成都粮仓及城中饥民",
        "deadline": "邓艾前锋抵达前一个时辰"
      },
      "instantEcho": {
        "directResult": "粮仓大门被撑破，稻谷如瀑布般倾泻到街道上，百姓惊呼着蜂拥而来装运。",
        "unexpectedCost": "粮仓地基被涨裂，邻近房屋倒塌三间，压伤两名老人。",
        "beneficiary": "城中守军和百姓",
        "payer": "粮仓附近的住户"
      }
    },
    {
      "id": "C",
      "powerId": "enlarge-object",
      "displayLabel": "巨弓封门阻邓艾",
      "label": "你取出皇城北门铁门栓，放大100倍后横在城门通道，封死城门，时限至邓艾军停止冲击。",
      "intent": "用巨型障碍物堵死城门，拖延邓艾前锋进攻，为姜维回援争取时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "举起皇城北门的铁门栓，默念放大咒，将其横放在城门内",
        "target": "成都皇城北门",
        "deadline": "邓艾前锋抵达即时"
      },
      "instantEcho": {
        "directResult": "铁门栓瞬间变成一根长十丈、粗五尺的巨梁，牢牢卡住城门，邓艾先锋撞门无效。",
        "unexpectedCost": "巨梁落地时震裂下方青石板，阻塞了内侧守军调动通道。",
        "beneficiary": "守门士兵",
        "payer": "被堵在内侧的巡逻队"
      }
    },
    {
      "id": "C",
      "powerId": "sentence-becomes-true",
      "displayLabel": "写诏定姜维已至",
      "label": "你写下一句‘姜维亲率五万精骑一个时辰内抵达成都北门外’，并令此成真，即刻生效。",
      "intent": "用姜维回援的假消息稳定军心，并让事实成真，迫使邓艾退兵。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在降诏背面写下‘姜维亲率五万精骑一个时辰内抵达成都北门外’，并念出这句话",
        "target": "降诏背面的文字",
        "deadline": "立即生效，一个时辰内实现"
      },
      "instantEcho": {
        "directResult": "北门外传来震天马蹄声，尘土飞扬，姜维旗帜出现，邓艾前锋惊惧后退。",
        "unexpectedCost": "刘禅目睹后昏厥，认为你假传圣旨，命侍卫将你拿下。",
        "beneficiary": "成都军民",
        "payer": "你本人（被关押）"
      }
    },
    {
      "id": "C",
      "powerId": "jump-tomorrow",
      "displayLabel": "令邓艾跳过今日",
      "label": "你指向城外邓艾本阵，使其跳过接下来的二十四小时，阵中所有人与物瞬间抵达明天此时的位置与状态。",
      "intent": "将邓艾主力送入未知的时间点，瓦解其当前的进攻阵型与部署。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "手指射出一道白光，笼罩城外邓艾军营，使其整体消失",
        "target": "邓艾及其营中全体魏军",
        "deadline": "即刻发动，持续二十四小时"
      },
      "instantEcho": {
        "directResult": "邓艾军营连同所有魏军凭空消失，留下一片空地。成都北门压力骤减。",
        "unexpectedCost": "你因力量反噬呕吐不止，且明日此时邓艾军将原样出现，可能更靠近城门。",
        "beneficiary": "成都守军",
        "payer": "你本人（虚弱一日）"
      }
    },
    {
      "id": "C",
      "powerId": "copy-skill",
      "displayLabel": "复制姜维将才",
      "label": "你复制姜维的军事指挥技能，在邓艾前锋抵达前，亲自登上城楼调度布防。",
      "intent": "用姜维的战术指挥守城，弥补刘禅无将才的缺陷，组织有效抵抗。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "闭目凝神，将远处姜维的将帅之能复制到自己脑海",
        "target": "姜维（远在剑阁）”",
        "deadline": "邓艾前锋抵达前完成复制"
      },
      "instantEcho": {
        "directResult": "你瞬间通晓所有兵法与阵型，登上城楼喝令调整弩炮位置，部署拒马。",
        "unexpectedCost": "姜维在剑阁突然头晕目眩，指挥中断片刻，被魏军抢攻一阵。",
        "beneficiary": "成都城墙上的守军",
        "payer": "姜维（短暂失神）"
      }
    },
    {
      "id": "C",
      "powerId": "control-weather",
      "displayLabel": "骤降暴雪阻魏军",
      "label": "你令成都方圆百里骤降暴雪，气温降至零下十度，积雪深三尺，持续二十四小时。",
      "intent": "利用极端天气阻挡邓艾前锋行军，拖延其抵达时间，破坏其攻城器械。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "双手向天挥舞，念动咒语召来乌云与寒风",
        "target": "成都方圆百里的天空",
        "deadline": "即刻生效，持续二十四小时"
      },
      "instantEcho": {
        "directResult": "黑云压城，暴雪瞬间淹没视线，邓艾前锋冻毙数百人，行军停止。",
        "unexpectedCost": "成都城内也有贫民冻死数十人，粮道因积雪中断。",
        "beneficiary": "守城部队",
        "payer": "城中无御寒衣物的贫民"
      }
    }
  ],
  "jin-unification-280": [
    {
      "id": "C",
      "powerId": "move-mountain",
      "displayLabel": "移钟山堵孙皓水路",
      "label": "你在午时前将钟山移至石头城水门外，断绝孙皓乘舟出逃之路，迫其即刻献降表并封存府库。",
      "intent": "用物理屏障彻底堵死东吴最后的水路退路，使孙皓无路可逃，加速投降。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动移山能力，将钟山整体移动到石头城水门外河道中央",
        "target": "钟山",
        "deadline": "午时"
      },
      "instantEcho": {
        "directResult": "钟山瞬间横亘于水门河道，巨石堵塞水道，吴军舰船无法通行。",
        "unexpectedCost": "山体挤压水门城墙，导致部分墙段坍塌，两名晋军士卒被落石擦伤。",
        "beneficiary": "王濬舰队",
        "payer": "孙皓宫廷"
      }
    },
    {
      "id": "C",
      "powerId": "locate-anything",
      "displayLabel": "定位孙皓藏玉玺暗格",
      "label": "你在受降前对孙皓发动定位，立即知悉其藏匿传国玉玺的准确位置，确保降表时玉玺现呈。",
      "intent": "防止孙皓假意投降但私藏玉玺，为日后留后路。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动定位能力，指定寻找孙皓藏匿的传国玉玺",
        "target": "孙皓藏匿传国玉玺的位置",
        "deadline": "午时"
      },
      "instantEcho": {
        "directResult": "玉玺位于孙皓寝殿地板暗格内，以蜡封裹。",
        "unexpectedCost": "孙皓察觉你施法，惊愕之下试图咬舌自尽，被左右拦住。",
        "beneficiary": "晋军文书登记",
        "payer": "东吴降臣当众受辱"
      }
    },
    {
      "id": "C",
      "powerId": "stretch-road",
      "displayLabel": "拉长建业西官道阻陆抗",
      "label": "你在午时前将建业西门外官道拉长百公里，使上游陆抗援军无法按时抵达，确保孙皓孤立无援。",
      "intent": "阻断东吴最后可能的援军，为平稳受降创造安全窗口。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动拉长道路能力，作用于建业西门外官道",
        "target": "建业西门外官道",
        "deadline": "午时"
      },
      "instantEcho": {
        "directResult": "官道瞬间延伸为百公里，陆抗部队在远处目视建业却始终无法接近。",
        "unexpectedCost": "官道两侧农田被空间扭曲撕裂，引发农夫哭嚎。",
        "beneficiary": "王濬舰队",
        "payer": "建业西郊农户"
      }
    },
    {
      "id": "C",
      "powerId": "heal-room",
      "displayLabel": "治愈甲板晋军伤病员",
      "label": "你在楼船舱内发动能力，让同一甲板上的所有伤病晋军士兵即刻痊愈，保证受降时战力完整。",
      "intent": "消除晋军内部健康隐患，保持强大武力威慑。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在甲板上发动治愈能力，覆盖所有伤病士兵",
        "target": "王濬舰队甲板",
        "deadline": "午时"
      },
      "instantEcho": {
        "directResult": "三十余名士兵伤口愈合，高烧退去，重新列队。",
        "unexpectedCost": "治愈能量干扰了周围文书，部分墨迹模糊。",
        "beneficiary": "晋军士兵",
        "payer": "你（文书官）需重抄文书"
      }
    },
    {
      "id": "C",
      "powerId": "conjure-water",
      "displayLabel": "生清水淹建业逼孙皓",
      "label": "你在午时前于建业城中生泉涌水，淹没街巷，孙皓不开城则全城遭淹，迫其速降。",
      "intent": "用非致命水势施压，避免巷战，使孙皓就范。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动生水能力，在城内指定地点生成持续清水",
        "target": "建业城中",
        "deadline": "午时"
      },
      "instantEcho": {
        "directResult": "水柱自小校场喷出，半时辰内漫过西市，百姓登房避难。",
        "unexpectedCost": "水流冲毁粮仓，导致后续数月粮荒。",
        "beneficiary": "晋军不需强攻",
        "payer": "建业平民"
      }
    },
    {
      "id": "C",
      "powerId": "read-one-mind",
      "displayLabel": "读孙皓心辨降表真伪",
      "label": "你在受降前对孙皓发动读心，听见其真实想法与回忆，若察觉诈降则当场中止仪式。",
      "intent": "辨明降表诚意，杜绝诈降风险。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动读心能力，锁定孙皓并持续聆听其内心",
        "target": "孙皓",
        "deadline": "午时"
      },
      "instantEcho": {
        "directResult": "你清晰听见孙皓正回忆昔日残害忠良，并盘算降后伺机逃跑。",
        "unexpectedCost": "读心导致你头痛欲裂，暂时无法书写。",
        "beneficiary": "晋军指挥层",
        "payer": "你（文书官）需休养"
      }
    }
  ],
  "northern-wei-439": [
    {
      "id": "C",
      "powerId": "erase-memory",
      "displayLabel": "删除沮渠牧犍的投降记忆",
      "label": "你在日落前发动删除能力，指定沮渠牧犍，永久删除他对于“北凉粮草断绝”的记忆，使他误以为尚有援军而拒绝开城，从而撕毁降表。",
      "intent": "让投降无法发生，以战功打破北魏内部和谈派企图。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定沮渠牧犍并删除其关于粮草断绝的记忆",
        "target": "沮渠牧犍",
        "deadline": "日落前攻城器械就位前"
      },
      "instantEcho": {
        "directResult": "沮渠牧犍突然拒绝开城，声称还有援军即将到来。",
        "unexpectedCost": "你暴露了主簿身份中的通敌嫌疑，被同僚暗中监视。",
        "beneficiary": "主战派将领拓跋焘",
        "payer": "你与沮渠牧犍"
      }
    },
    {
      "id": "C",
      "powerId": "swap-two-people",
      "displayLabel": "交换沮渠牧犍与北凉百姓",
      "label": "你在日落前发动交换能力，将沮渠牧犍和城内一名赤手空拳的百姓瞬间交换位置，使开城命令失效并制造混乱。",
      "intent": "阻止投降，延缓日落，等待攻城布置完成。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动交换，将沮渠牧犍与一名北凉百姓交换位置和随身物品",
        "target": "沮渠牧犍与北凉东街头一个平民",
        "deadline": "日落前攻城器械就位时"
      },
      "instantEcho": {
        "directResult": "沮渠牧犍瞬间出现在街头，而平民出现在城门楼；士兵误以为他潜逃，停止开城。",
        "unexpectedCost": "平民的随身物品中有一封你与北凉私通的信件，被搜出。",
        "beneficiary": "北魏监军",
        "payer": "你与平民"
      }
    },
    {
      "id": "C",
      "powerId": "repeat-minute",
      "displayLabel": "重复沮渠牧犍开城门那一分钟",
      "label": "你在日落前发动重复能力，让沮渠牧犍下令开城门的那一分钟反复发生，直到他亲笔写下承诺保全城民的文书才接受结果。",
      "intent": "逼迫沮渠牧犍在保全百姓的文书上签字。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将时间锁定在沮渠牧犍下令开城门的那一分钟，反复逼迫其签署保全文书",
        "target": "沮渠牧犍与开城命令",
        "deadline": "日落前攻城器械将就位（重复最多一百次后结束）"
      },
      "instantEcho": {
        "directResult": "多次重复后，沮渠牧犍被迫签署了保全城民的文书，然后城门打开。",
        "unexpectedCost": "你在重复中暴露了自己通过主簿职位修改过文案，被责令自证清白。",
        "beneficiary": "姑臧城民",
        "payer": "你与沮渠牧犍"
      }
    },
    {
      "id": "C",
      "powerId": "command-animals",
      "displayLabel": "号令姑臧城内所有老鼠啃坏粮仓",
      "label": "你在日落前发动号令动物能力，命令方圆十公里内所有老鼠共同啃坏北凉粮仓的支柱，使存粮倒塌暴露，证实粮草断绝。",
      "intent": "证明城内粮草已断，迫使沮渠牧犍立刻投降。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "命令姑臧城内及周边所有老鼠啃咬北凉粮仓木柱，使其倒塌",
        "target": "北凉粮仓内的老鼠",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "粮仓支柱被咬断，存粮塌陷，露出空仓；沮渠牧犍在众人面前承认粮绝，立即开城。",
        "unexpectedCost": "老鼠大量涌入军营，导致部分兵器被咬坏，延期作战。",
        "beneficiary": "北魏全军",
        "payer": "你与守仓的北凉士兵"
      }
    },
    {
      "id": "C",
      "powerId": "rust-weapons",
      "displayLabel": "锈蚀北凉城头所有箭矢",
      "label": "你在日落前发动锈蚀能力，让姑臧城头所有金属兵器立时锈毁，北凉守军失去抵抗能力，只能投降。",
      "intent": "迫使北凉在无兵器可用的状态下提前投降。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动锈蚀，使方圆一公里内所有金属武器瞬间锈毁",
        "target": "姑臧城头及城内的北凉兵器",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "北凉士兵发现手中兵器变成锈渣，沮渠牧犍立即宣布投降。",
        "unexpectedCost": "你的文书竹简也连带锈毁，导致重要军令记录缺失，被追究责任。",
        "beneficiary": "北魏攻城部队",
        "payer": "你与北凉工匠"
      }
    },
    {
      "id": "C",
      "powerId": "guarantee-action",
      "displayLabel": "保证保全城民的承诺被接受",
      "label": "你在日落前发动保证能力，指定下一项行动：你亲口承诺保全姑臧城民，使沮渠牧犍相信并开城，且无人能阻止这一承诺的效力。",
      "intent": "确保投降条件得到承诺，让攻城变成受降。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "向沮渠牧犍承诺保全城民，并保证这一承诺必定被接受且无人能阻止",
        "target": "沮渠牧犍与姑臧城民",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "沮渠牧犍当即相信你的承诺，打开城门；北魏军未发生屠杀。",
        "unexpectedCost": "你因代主帅许诺，事后被拓跋焘怀疑有私心，受到审查。",
        "beneficiary": "姑臧城六万百姓",
        "payer": "你与北魏信义"
      }
    }
  ],
  "xiaowen-luoyang-494": [
    {
      "id": "C",
      "powerId": "transfer-cost",
      "displayLabel": "转移反贵族于元宏",
      "label": "你当众将鲜卑贵族的全部反对代价转移给孝文帝元宏，让他独自承担骂名与暴怒，而你自己从这场政治风暴中全身而退。",
      "intent": "让元宏替自己承受宣读诏书的直接政治后果，突破贵族当场发作的瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在元宏面前用手指向贵族，将反对浪潮的代价转移给他",
        "target": "孝文帝元宏",
        "deadline": "午后贵族集结前"
      },
      "instantEcho": {
        "directResult": "贵族们立即把矛头转向元宏，怒斥他背弃祖宗",
        "unexpectedCost": "元宏从此对你心存芥蒂，不再完全信任",
        "beneficiary": "你自身",
        "payer": "孝文帝元宏"
      }
    },
    {
      "id": "C",
      "powerId": "rewind-hour",
      "displayLabel": "倒回平城宫前劝谏",
      "label": "你发动倒退一小时，回到你尚未宣读诏书的时刻，并记住所有贵族未来的反应，修改措辞安抚鲜卑旧部。",
      "intent": "通过预知未来规避贵族反对，重新设计更稳妥的出台方式。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "闭眼发动能力，时间倒流至一小时前",
        "target": "平城南郊行宫",
        "deadline": "午后贵族集结前"
      },
      "instantEcho": {
        "directResult": "行宫恢复一小时前，贵族们还未聚集",
        "unexpectedCost": "你因为体力消耗头晕目眩，后续行动迟缓",
        "beneficiary": "你自身",
        "payer": "你的体力"
      }
    },
    {
      "id": "C",
      "powerId": "shapeshift",
      "displayLabel": "变成元宏宣读诏书",
      "label": "你变成孝文帝元宏的模样，亲自走到宫门口对鲜卑贵族宣读迁都洛阳和汉化礼制的诏书，把所有人的怒火引向这个假元宏。",
      "intent": "让贵族误以为元宏本人强行推行政策，从而保护真元宏的安全。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "变成元宏外貌，拿起诏书走出宫门",
        "target": "鲜卑贵族",
        "deadline": "午后贵族集结时"
      },
      "instantEcho": {
        "directResult": "贵族们对假元宏愤怒围攻，但真元宏在幕后安全",
        "unexpectedCost": "你的伪装被近侍识破，他们开始怀疑你有异能",
        "beneficiary": "孝文帝元宏",
        "payer": "你的信用"
      }
    },
    {
      "id": "C",
      "powerId": "summon-lightning",
      "displayLabel": "雷击誓碑示警鲜卑",
      "label": "你召下一道雷电精准击中平城南郊行宫前的鲜卑誓碑，将其炸裂，在贵族们震惊时趁机宣读诏书，借天象震慑反对者。",
      "intent": "用超自然天象制造威压，压制贵族当场反抗。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向誓碑召唤雷电",
        "target": "鲜卑誓碑",
        "deadline": "午后贵族集结前"
      },
      "instantEcho": {
        "directResult": "誓碑碎裂，火光四溅，贵族们恐惧跪拜",
        "unexpectedCost": "天象被解读为不祥之兆，部分贵族更加顽固反对迁都",
        "beneficiary": "孝文帝元宏",
        "payer": "你的天命解释权"
      }
    },
    {
      "id": "C",
      "powerId": "share-memory",
      "displayLabel": "共享草原迁徙艰辛",
      "label": "你让现场所有鲜卑贵族以第一视角体验一段真实记忆：十年前一场暴雪中，你们部落损失大半牲畜、老人冻死路边的惨状，以此说明固守平城亦非乐土。",
      "intent": "用共同苦难说服贵族接受迁都，突破情绪屏障。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "举起双手，将记忆投射到贵族脑中",
        "target": "所有在场的鲜卑贵族",
        "deadline": "午后贵族集结时"
      },
      "instantEcho": {
        "directResult": "贵族们泪流满面，沉默不语，部分人开始动摇",
        "unexpectedCost": "少数贵族因痛苦记忆失常，迁怒于你操控人心",
        "beneficiary": "孝文帝元宏",
        "payer": "贵族心中的稳定感"
      }
    },
    {
      "id": "C",
      "powerId": "door-anywhere",
      "displayLabel": "开门直抵洛阳宫殿",
      "label": "你在行宫墙上开一扇门，门后直接连通洛阳太极殿，邀请贵族亲眼看看新都的气派，以此打消他们对洛阳荒芜的顾虑。",
      "intent": "用视觉事实推翻贵族对洛阳的负面想象，加速迁都决议。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在宫墙上划出一扇门，推开门展示洛阳情景",
        "target": "洛阳太极殿",
        "deadline": "午后贵族集结前"
      },
      "instantEcho": {
        "directResult": "贵族们看到洛阳宏大宫殿，部分人惊叹并改变态度",
        "unexpectedCost": "门维持十分钟，期间有士兵误入洛阳引起混乱",
        "beneficiary": "孝文帝元宏",
        "payer": "洛阳守军的警戒"
      }
    }
  ],
  "grand-canal-605": [
    {
      "id": "C",
      "powerId": "duplicate-place",
      "displayLabel": "复制漕渠闸口分流河工",
      "label": "你立即在洛阳城东空地复制一处完全相同的漕渠闸口，将原闸口文书、工具、粮草搬入复制品，然后签发开挖令，要求两处闸口同时开工，各郡交工日期减半。",
      "intent": "通过复制工地，将单点容纳量翻倍，避免数万河工窝工。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制漕渠闸口及全部非生命物品",
        "target": "洛阳东城漕渠闸口",
        "deadline": "明晨河工抵达前"
      },
      "instantEcho": {
        "directResult": "两处闸口同时开工，运河开挖速度翻倍。",
        "unexpectedCost": "复制品占用城东农田，数百农户被迫迁移。",
        "beneficiary": "明日抵达的数万河工",
        "payer": "城东农田所有者"
      }
    },
    {
      "id": "C",
      "powerId": "revive-dead",
      "displayLabel": "复活宇文恺重定工期",
      "label": "你找到已故前朝水利老臣宇文恺的墓碑，发动能力让他复活一小时。你立即让他以工部顾问身份审阅开挖令，并当众宣布通济渠首段可在三个月内完工，各郡交工日期改为五个月后。",
      "intent": "借用历史人物技能和威信，说服各方接受现实工期，避免抢工导致质量崩溃。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复活并咨询",
        "target": "宇文恺",
        "deadline": "明晨河工抵达前"
      },
      "instantEcho": {
        "directResult": "宇文恺提出合理工期，郡官们同意放宽期限。",
        "unexpectedCost": "复活惊动朝中保守派，有人弹劾你妖言惑众。",
        "beneficiary": "你及所有郡官",
        "payer": "你（面临政治风险）"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-grain",
      "displayLabel": "闸口粮仓涌出无尽粟米",
      "label": "你走到漕渠闸口的官仓前，指定其中一座粮仓为容器，发动能力让该仓源源不断涌出新鲜粟米。随后你宣布今日到达的河工每人额外领一斗粟米作为安家粮，并签令以粮食抵扣部分徭役。",
      "intent": "用无限粮食收买民心，缓解徭役引发的民怨和逃亡。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让指定粮仓涌出无限粟米",
        "target": "漕渠闸口的官仓",
        "deadline": "明晨河工抵达前"
      },
      "instantEcho": {
        "directResult": "河工领到额外粮食，士气稳定，无人逃亡。",
        "unexpectedCost": "无限粮食引来洛阳百姓哄抢，秩序混乱。",
        "beneficiary": "明日抵达的数万河工",
        "payer": "洛阳地方治安"
      }
    },
    {
      "id": "C",
      "powerId": "enlarge-object",
      "displayLabel": "放大皇帝诏书刻石",
      "label": "你将隋炀帝早已写好、尚未露出的开凿诏书刻石，等比例放大一百倍，矗立在闸口中央。上面朱红大字写明‘逾期不交工者，郡守以下皆斩’。然后你签发开挖令，并大声宣读放大的诏书。",
      "intent": "用视觉冲击强化命令权威，杜绝各郡阳奉阴违。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "放大诏书刻石",
        "target": "隋炀帝的开凿诏书刻石",
        "deadline": "明晨河工抵达前"
      },
      "instantEcho": {
        "directResult": "各郡官员见到巨大诏书，无人敢异议，立即接令。",
        "unexpectedCost": "巨型刻石压坏闸口地面，需额外三日修复。",
        "beneficiary": "你（命令被无条件执行）",
        "payer": "闸口地面修复工"
      }
    },
    {
      "id": "C",
      "powerId": "sentence-becomes-true",
      "displayLabel": "写下事实：三月内完工",
      "label": "你取过一份空白公文，写下一句话：‘通济渠首段于大业元年六月十五日全线贯通。’随后你将其钤印，当众宣读。该陈述立即成为客观事实，所有后续工程必须在这个新现实下推进。",
      "intent": "强行确立完工日期，根除所有工期不确定性。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "写下并宣读事实",
        "target": "通济渠首段完工日期",
        "deadline": "明晨河工抵达前"
      },
      "instantEcho": {
        "directResult": "所有人事先确认运河会在三个月后贯通，计划立即调整。",
        "unexpectedCost": "部分郡官员记忆混乱，认为工程本应更晚。",
        "beneficiary": "你及整个工程团队",
        "payer": "记忆混乱的郡官"
      }
    },
    {
      "id": "C",
      "powerId": "jump-tomorrow",
      "displayLabel": "让河工跳过今晚直接劳作",
      "label": "你走到营帐中正休息的河工代表面前，指定他们全部跳过接下来的二十四小时。瞬间这些河工精神饱满地出现在明日清晨，而你已事先布置好工具和图纸。他们直接开工，省去整夜等待。",
      "intent": "消除明晨到达的河工与今早签发令之间的时间空耗，让工程提前一天启动。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让首批河工跳过二十四小时",
        "target": "首批数万河工",
        "deadline": "明晨（现在即刻发动）"
      },
      "instantEcho": {
        "directResult": "河工直接进入工作状态，第一天工程量提前完成。",
        "unexpectedCost": "被跳过的二十四小时中，原本调运的补给滞后一天，工人午饭短缺。",
        "beneficiary": "你及工程进度",
        "payer": "后勤补给官"
      }
    }
  ],
  "tang-founded-618": [
    {
      "id": "C",
      "powerId": "borrow-tomorrow-memory",
      "displayLabel": "回忆明日禅让过程",
      "label": "你提前回忆起明天此刻的记忆，发现李渊将在午时接受禅让，但期间有突厥使者突至要求割地，你立即向李渊报告此事，让他提前准备对策。",
      "intent": "利用明日记忆预知并化解突厥干扰，确保禅让按时完成。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动借来明日记忆能力，回忆明天此刻自己的记忆，预见到突厥使者干涉禅让的具体细节。",
        "target": "李渊和突厥使者",
        "deadline": "午时交付禅位册书前"
      },
      "instantEcho": {
        "directResult": "你详细描述了突厥使者的到来时间和要求，李渊得以提前布置卫兵拦截使者，禅让仪式按原计划进行。",
        "unexpectedCost": "你因过早泄露未来记忆，被李渊怀疑是间谍，事后被调离礼部。",
        "beneficiary": "李渊",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "summon-giant-beast",
      "displayLabel": "召巨兽威慑群臣",
      "label": "你召唤一只百米高巨兽出现在太极殿前，巨兽按你的命令对群臣咆哮，迫使所有反对禅让的大臣闭嘴，李渊趁机迅速完成即位仪式。",
      "intent": "用不可抗拒的巨兽威慑消除朝堂反对声浪，强行推进禅让。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动召唤巨兽能力，在太极殿前指定地点召来巨兽，并命令它咆哮威慑。",
        "target": "太极殿内群臣",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "巨兽出现，群臣惊恐，无人再敢反对，李渊顺利接受禅让。",
        "unexpectedCost": "巨兽的咆哮震碎了太极殿屋顶瓦片，砸伤几名官员，引发后续修缮纠纷。",
        "beneficiary": "李渊",
        "payer": "受伤的官员"
      }
    },
    {
      "id": "C",
      "powerId": "move-mountain",
      "displayLabel": "移山堵住长安西门",
      "label": "你看到一队隋朝忠臣正率兵从西面赶来阻止禅让，立即将远处一座山移至长安西门之外，彻底堵住援军道路，为李渊赢得时间。",
      "intent": "用移山手段物理隔绝外部军事干预，确保禅让不受干扰。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动移山能力，将长安西面视野内的一座山移动到西门外的官道上。",
        "target": "长安西门外的隋朝援军",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "山瞬间堵住西门，援军无法前进，禅让顺利完成。",
        "unexpectedCost": "山移动时压毁了西门附近数十户民居，造成平民伤亡。",
        "beneficiary": "李渊",
        "payer": "西门附近居民"
      }
    },
    {
      "id": "C",
      "powerId": "locate-anything",
      "displayLabel": "定位玉玺下落",
      "label": "你发现禅让所需的传国玉玺不翼而飞，立即使用定位能力得知玉玺被隋恭帝的宦官藏在御花园枯井中，你迅速取回，保证禅让如期举行。",
      "intent": "定位关键器物玉玺，解决禅让仪式中断的危机。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动定位能力，指定传国玉玺，立即得知其准确位置。",
        "target": "传国玉玺",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "你从御花园枯井中找到玉玺，并交到李渊手中，禅让得以继续。",
        "unexpectedCost": "宦官发现你取走玉玺后，向隋恭帝告密，你被记恨，日后遭到报复。",
        "beneficiary": "李渊",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "stretch-road",
      "displayLabel": "拉长皇宫通道拖延时间",
      "label": "你发现禅位册书尚未写完，而午时将至，你立即将太极殿到宫门的道路拉长成一百公里，迫使前来催促的隋朝使者无法及时到达，为你争取到完成册书的时间。",
      "intent": "用拉长道路物理拖延时间，防止外部催促打断仪式准备。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动拉长道路能力，将太极殿到宫门的百米道路拉长。",
        "target": "从太极殿到宫门的道路",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "道路变长，隋朝使者走了许久才到，册书已按时完成，禅让顺利。",
        "unexpectedCost": "道路拉长后，宫内大量侍卫和宫女迷路，秩序混乱达数小时。",
        "beneficiary": "你（完成册书的礼部官员）",
        "payer": "宫内的侍卫和宫女"
      }
    },
    {
      "id": "C",
      "powerId": "heal-room",
      "displayLabel": "治愈李渊旧伤振士气",
      "label": "李渊因旧伤复发疼痛难忍，无法主持禅让，你发动能力治愈太极殿内所有人包括李渊的伤病，李渊立刻精神抖擞，顺利接受禅让。",
      "intent": "治愈李渊伤病，确保禅让主持者身体健康。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动治愈全场伤病能力，指定太极殿为房间。",
        "target": "太极殿内所有人，包括李渊",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "李渊伤痛消失，精神焕发，禅让仪式按时举行。",
        "unexpectedCost": "治愈能量也治好了殿内一名潜伏刺客的旧伤，使其体力恢复，事后成功刺杀了一名官员。",
        "beneficiary": "李渊",
        "payer": "被刺杀官员的家属"
      }
    }
  ],
  "tang-fall-907": [
    {
      "id": "C",
      "powerId": "clone-self",
      "displayLabel": "百身草诏逼百官",
      "label": "你在三日内复制一百个自己，同时赶往洛阳各处、开封节堂及百官私邸，每人手持一份加盖玉玺的禅位诏书，勒令百官今日内改服易帜。",
      "intent": "用分身同步压服所有首鼠两端的官员，避免独自身陷节堂被质疑矫诏。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动复制能力，让一百个分身各自携带禅位诏书出发",
        "target": "开封、洛阳的所有官员以及节堂内的朱温",
        "deadline": "受禅仪式前三日"
      },
      "instantEcho": {
        "directResult": "一百个你同时出现在各地，百官惊骇，半数当场跪拜接诏。",
        "unexpectedCost": "朱温震怒于你先斩后奏，日后可能猜忌你擅权。",
        "beneficiary": "急于完成禅让的朱温",
        "payer": "未来可能被清算的你"
      }
    },
    {
      "id": "C",
      "powerId": "extinguish-fire",
      "displayLabel": "熄尽洛城逼宫火",
      "label": "你在朱温下令焚烧洛阳宫城胁哀帝时，熄灭方圆十里内所有火焰，包括宫烛、火盆与城外燎原烽燧，迫使朱温无法再用火势逼迫哀帝。",
      "intent": "直接废掉朱温纵火逼宫的预案，逼他只能走合法禅让程序。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动灭火能力，熄灭洛阳城内外的全部火焰",
        "target": "洛阳宫城、百官宅邸及城郊火堆",
        "deadline": "受禅仪式前三日"
      },
      "instantEcho": {
        "directResult": "洛阳全城陷入黑暗与寒冷，火攻逼宫计划破产。",
        "unexpectedCost": "你自己被冻得发抖，且需另寻照明写诏。",
        "beneficiary": "哀帝李柷",
        "payer": "被冻伤且熬夜的你"
      }
    },
    {
      "id": "C",
      "powerId": "erase-memory",
      "displayLabel": "抹去哀帝禅位忆",
      "label": "你永久删除唐哀帝脑海中关于朱温勒令禅位、百官逼迫、自己写诏的全部记忆，让他只记得自己主动退位让贤。",
      "intent": "让哀帝心理上不再抵触，避免他在仪式上哭诉或自尽导致禅让崩盘。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动删除记忆能力，抹掉哀帝对禅位胁迫的记忆",
        "target": "唐哀帝李柷",
        "deadline": "受禅仪式前三日"
      },
      "instantEcho": {
        "directResult": "哀帝变得平静，认为退位是自身圣意，主动配合拟旨。",
        "unexpectedCost": "朱温怀疑你对哀帝施咒，开始防范你。",
        "beneficiary": "希望顺利禅让的朱温",
        "payer": "失去哀帝信任的你"
      }
    },
    {
      "id": "C",
      "powerId": "swap-two-people",
      "displayLabel": "调换朱温与哀帝",
      "label": "你在受禅仪式彩排时，瞬间交换朱温和唐哀帝的位置及衣物配饰，让朱温身着龙袍坐在御座、哀帝身着臣服立于阶下，引发朝臣哗然。",
      "intent": "用荒诞场景暴露朱温篡位野心，迫使他在舆论压力下推迟或改革仪式。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动交换能力，让朱温与哀帝互换位置",
        "target": "朱温与唐哀帝",
        "deadline": "受禅仪式前三日"
      },
      "instantEcho": {
        "directResult": "众目睽睽下朱温坐于御座哀帝站立，百官失声。",
        "unexpectedCost": "朱温大怒，立即追查妖术来源，你首当其冲。",
        "beneficiary": "受辱的朱温（暂时）",
        "payer": "被怀疑的你"
      }
    },
    {
      "id": "C",
      "powerId": "repeat-minute",
      "displayLabel": "反复诏书送达刻",
      "label": "你让派往洛阳送禅位诏书的使者在小吏将诏书递交哀帝的那一分钟反复发生，直到你确认诏书被妥善接受、无人篡改为止。",
      "intent": "确保诏书安全送达且无伪造，防止节外生枝。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动重复时间能力，锁定使者递交诏书的一分钟不断循环",
        "target": "从开封出发前往洛阳的送诏使者",
        "deadline": "受禅仪式前三日"
      },
      "instantEcho": {
        "directResult": "使者最终将诏书亲手交到哀帝手中，无任何意外。",
        "unexpectedCost": "循环中消耗了你大量心力，事后头痛欲裂。",
        "beneficiary": "确保禅位合法的你",
        "payer": "精神疲惫的你"
      }
    },
    {
      "id": "C",
      "powerId": "command-animals",
      "displayLabel": "号令百鸟阻清路",
      "label": "你号令开封、洛阳方圆十公里所有鸟类群集于百官上朝必经之路，啄食他们手中的笏板、诏书和官服，阻止他们前往受禅现场。",
      "intent": "通过动物干扰制造混乱，为哀帝争取时间或改变局面。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动号令动物能力，命令鸟类攻击百官仪仗",
        "target": "开封、洛阳城内的所有鸟类",
        "deadline": "受禅仪式前三日"
      },
      "instantEcho": {
        "directResult": "百官被鸟群袭击，朝服破损，奏章散落，仪式被迫暂停。",
        "unexpectedCost": "朱温派弓箭手射杀鸟类，你被怀疑有妖术。",
        "beneficiary": "不想禅让的哀帝",
        "payer": "被惊鸟弄脏的你"
      }
    }
  ],
  "jin-founded-1115": [
    {
      "id": "C",
      "powerId": "infinite-money",
      "displayLabel": "用银币买通辽使",
      "label": "你从怀中取出无限银币，堆在即将到达的辽使面前，换取他延迟递交讨伐令，让阿骨打完成称帝仪式，而后你销毁全部银币。",
      "intent": "无限金钱可以买通辽朝使者，赢得关键时间，突破日落前辽使抵达的时限瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "取出一袋银币，递给辽使斜封官，要求他推迟递交讨伐令，并承诺事后销毁。",
        "target": "辽使斜封官",
        "deadline": "日落前一刻钟"
      },
      "instantEcho": {
        "directResult": "辽使收下银币，同意待到次日天亮再递交讨伐令。",
        "unexpectedCost": "新铸银币被辽使发现并非辽国官铸，引起怀疑。",
        "beneficiary": "完颜阿骨打",
        "payer": "你浪费了一袋银币，但仍保有无限资金。"
      }
    },
    {
      "id": "C",
      "powerId": "shrink-object",
      "displayLabel": "缩小辽使带来的诏书",
      "label": "缩小辽国讨伐诏书",
      "intent": "缩小辽使的诏书使其失效，无法宣读征讨令，突破辽使必须宣读文书的障碍。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "你走近辽使囊中诏书，伸手触碰，将其缩小为指甲大小。",
        "target": "辽使随身携带的牛皮诏书",
        "deadline": "辽使掏出诏书宣读之前"
      },
      "instantEcho": {
        "directResult": "辽使摸出袖中诏书，发现变成玩具大小，字迹模糊无法宣读。",
        "unexpectedCost": "辽使大怒，怀疑女真人施妖术，直接拔刀相向。",
        "beneficiary": "完颜阿骨打",
        "payer": "你面临辽使的攻击危险。"
      }
    },
    {
      "id": "C",
      "powerId": "transfer-cost",
      "displayLabel": "将杀戮转移给辽帝",
      "label": "你宣布若阿骨打称帝后辽军屠城，其全部罪孽将转移至辽主耶律延禧一人身上，并用血书钉于按出虎水畔木桩。",
      "intent": "转移代价可以威慑辽方不进行报复屠城，削减其军事报复的民意基础。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "你当众宣读血书，将若屠城则罪孽转移至辽帝身上的规则公之于众。",
        "target": "辽帝耶律延禧",
        "deadline": "辽使抵达会宁府前"
      },
      "instantEcho": {
        "directResult": "女真与辽军下辖的部族军听见血书，部分畏惧天道，阵前动摇。",
        "unexpectedCost": "转移代价的能力只对一项行动生效，后续辽军仍可能屠城。",
        "beneficiary": "完颜阿骨打及女真百姓",
        "payer": "辽帝耶律延禧承担象征性罪名，但实际未受损失。"
      }
    },
    {
      "id": "C",
      "powerId": "rewind-hour",
      "displayLabel": "倒退时辰拖延辽使",
      "label": "你阻止阿骨打宣读称帝誓词，发动倒退一小时，让辽使来使时间重置，趁机完成统一号令。",
      "intent": "倒退时间可以完全消除辽使即将抵达的局面，获得额外一小时准备。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "你高喊“时辰未到”，发动能力让会宁府及周围区域时间倒退至辽使尚在半路的一小时前。",
        "target": "会宁府及辽使行军路线区域",
        "deadline": "日落前最后一刻"
      },
      "instantEcho": {
        "directResult": "辽使退回一小时前的位置，女真各部获得重整间隙。",
        "unexpectedCost": "倒退时间导致部分女真战士记忆保留，产生疑惑和混乱。",
        "beneficiary": "完颜阿骨打",
        "payer": "你消耗了唯一一次倒退能力，且无法再次使用。"
      }
    },
    {
      "id": "C",
      "powerId": "shapeshift",
      "displayLabel": "变作辽使欺骗诸部",
      "label": "你变成辽使模样，在按出虎水畔当众宣布辽帝已准许女真建国，并假传圣旨赐予阿骨打金印。",
      "intent": "变成辽使可以假传旨意，消除各部对辽报复的恐惧，加速统一。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "你扮作辽使，进入盟誓会场，朗诵伪造的辽帝敕书。",
        "target": "女真各部首领",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "各部首领信以为真，当场宣誓效忠阿骨打。",
        "unexpectedCost": "真的辽使恰好同时抵达，两相对质，谎言败露。",
        "beneficiary": "完颜阿骨打",
        "payer": "你陷入欺骗诸部的信任危机。"
      }
    },
    {
      "id": "C",
      "powerId": "summon-lightning",
      "displayLabel": "天雷击断辽旗震慑",
      "label": "你召雷电劈断辽使迎风展开的军旗，并劈碎其马前泥土，当着诸部面预示辽朝气数已尽。",
      "intent": "雷电可瞬间制造天兆，让女真各部相信辽朝受天罚，愿意追随阿骨打。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "你手指辽旗，呼雷将其劈断，并让雷击显现在辽使前方地面。",
        "target": "辽使携带的军旗及座前土地",
        "deadline": "辽使宣读讨伐令之前"
      },
      "instantEcho": {
        "directResult": "辽旗断落，女真各部高呼天助，阿骨打顺势称帝。",
        "unexpectedCost": "雷电引燃附近草料，烧毁部分围栏和粮草。",
        "beneficiary": "完颜阿骨打",
        "payer": "你承担了草料损失的部分责难。"
      }
    }
  ],
  "yuan-name-1271": [
    {
      "id": "C",
      "powerId": "split-river",
      "displayLabel": "开辟大河直通驿路",
      "label": "你在大明殿前，让殿前的御河从中分开，露出干燥河床，命驿骑踏河床疾驰，抢在午时前将诏书送达各行省。",
      "intent": "用分开江河让驿骑走捷径，突破驿路绕远的时间瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "分开御河",
        "target": "大都大明殿前的御河",
        "deadline": "午时分"
      },
      "instantEcho": {
        "directResult": "御河河水分开，露出干燥河床，驿骑沿河床疾驰而去。",
        "unexpectedCost": "河床两侧淤泥使后续行人难以通行。",
        "beneficiary": "忽必烈",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "speak-any-distance",
      "displayLabel": "远跨千里面谕阿里不哥",
      "label": "你通过能力直接与正在漠北的阿里不哥实时对话，命他即刻承认忽必烈的汗位和大元国号，否则午时后大军压境。",
      "intent": "跨越距离直接威慑阿里不哥，消除其对国号正统的潜在挑战。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "直接与阿里不哥对话",
        "target": "阿里不哥",
        "deadline": "午时分"
      },
      "instantEcho": {
        "directResult": "阿里不哥听到你的声音，震惊沉默，随后表示同意。",
        "unexpectedCost": "你的嗓音变得嘶哑，暂时无法正常发声。",
        "beneficiary": "忽必烈",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "duplicate-place",
      "displayLabel": "复制大明殿昭告四方",
      "label": "你在附近空地复制一座完整的大明殿，安排另一组官员同时誊录建号诏书，并行发往不同方向，确保午时前覆盖所有行省。",
      "intent": "复制大殿及文书抄写环境，突破一人一处誊录的速度瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制大明殿",
        "target": "大都大明殿",
        "deadline": "午时分"
      },
      "instantEcho": {
        "directResult": "附近空地出现一座一模一样的大明殿，官员们开始工作。",
        "unexpectedCost": "原殿部分梁柱出现细微裂缝。",
        "beneficiary": "忽必烈",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "revive-dead",
      "displayLabel": "复活耶律楚材见证新朝",
      "label": "你复活已故的耶律楚材，让他出现在大明殿，向忽必烈及满朝文武解析“大元”国号的易经深意，为颂诏增加权威。",
      "intent": "复活已故重臣加持国号，突破官员畏怯或异议的瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复活耶律楚材",
        "target": "耶律楚材",
        "deadline": "午时分"
      },
      "instantEcho": {
        "directResult": "耶律楚材从棺中走出，现身大殿阐述。",
        "unexpectedCost": "耶律楚材复活后虚弱，一小时后将再次逝去。",
        "beneficiary": "忽必烈",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-grain",
      "displayLabel": "涌放大都粮仓稳民心",
      "label": "你让大都府库的一个粮瓮不断涌出小米，下令开仓放粮，并宣称这是新国号“大元”带来的祥瑞，免除百姓疑虑。",
      "intent": "用无限粮食稳住民心，突破百姓对改朝换代的恐慌瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让粮瓮涌出小米",
        "target": "大都府库的粮瓮",
        "deadline": "午时分"
      },
      "instantEcho": {
        "directResult": "粮瓮持续涌出小米，百姓欢欣领取。",
        "unexpectedCost": "粮瓮附近的粮仓地基下陷。",
        "beneficiary": "大都居民",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "enlarge-object",
      "displayLabel": "放大玉玺盖印天下",
      "label": "你将传国玉玺放大百倍，在巨幅黄绢上盖下“大元”国号大印，命人悬挂于大明殿外，让全城仰望信服。",
      "intent": "放大玉玺印章，突破象征权威不足的瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "放大传国玉玺",
        "target": "传国玉玺",
        "deadline": "午时分"
      },
      "instantEcho": {
        "directResult": "玉玺变成百倍大小，盖下巨幅印记。",
        "unexpectedCost": "玉玺木质部分出现裂纹，但足以完成。",
        "beneficiary": "忽必烈",
        "payer": "你"
      }
    }
  ],
  "ming-founded-1368": [
    {
      "id": "C",
      "powerId": "broadcast-thought",
      "displayLabel": "命百官改元洪武",
      "label": "你在登基钟鼓响起前，将‘改元洪武，北伐大都’送入南京所有人脑中，确保无人敢违逆新朝法统。",
      "intent": "用集体通感压制动摇派，强行统一人心。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动广播，将一句话送入方圆十里所有人脑中",
        "target": "南京城内所有官员与百姓",
        "deadline": "登基钟鼓将在一刻钟后响起"
      },
      "instantEcho": {
        "directResult": "全城百姓与官员同时听到‘改元洪武，北伐大都’，纷纷跪拜。",
        "unexpectedCost": "部分忠于元朝的旧臣被震聋，引发短暂混乱。",
        "beneficiary": "朱元璋",
        "payer": "被震聋的元朝遗民"
      }
    },
    {
      "id": "C",
      "powerId": "teleport-crowd",
      "displayLabel": "迁徐达等百将至大都",
      "label": "你在祭告天地前，将徐达、常遇春等百员北伐将领从南京郊天坛直接传送到元大都城门外，抢在元廷反应前发起总攻。",
      "intent": "用超距投送突破北伐军进军缓慢的瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动百人迁跃，将现场指定的一百人传送至目标地点",
        "target": "徐达、常遇春等百员北伐将领",
        "deadline": "登基钟鼓将在一刻钟后响起"
      },
      "instantEcho": {
        "directResult": "徐达等百名将领瞬间出现在大都城外，明军士气大振。",
        "unexpectedCost": "传送消耗了你大量体力，你当场昏厥。",
        "beneficiary": "北伐明军",
        "payer": "你（仪制官）"
      }
    },
    {
      "id": "C",
      "powerId": "borrow-tomorrow-memory",
      "displayLabel": "预知明日登基礼仪错误",
      "label": "你在登基钟鼓响起前，使用能力获取明天此刻的记忆，发现朱元璋会在宣读诏书时误读年号，提前更正了文书。",
      "intent": "利用未来记忆避免礼制失误。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动借来明日记忆，获取明天此刻的记忆",
        "target": "你自己明天的记忆",
        "deadline": "登基钟鼓将在一刻钟后响起"
      },
      "instantEcho": {
        "directResult": "你提前修改了诏书中的年号，登基仪式顺利。",
        "unexpectedCost": "未来记忆告诉你明日你将被降职，你陷入焦虑。",
        "beneficiary": "朱元璋",
        "payer": "你（仪制官）"
      }
    },
    {
      "id": "C",
      "powerId": "summon-giant-beast",
      "displayLabel": "召麒麟震慑南京众臣",
      "label": "你在登基钟鼓前，于郊天坛召来一只百米高的麒麟，命令它匍匐在朱元璋面前，以示天命所归。",
      "intent": "用神兽威压震慑质疑朱元璋合法性的人。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动召唤巨兽，在指定地点召来巨兽并下达命令",
        "target": "郊天坛前的空地",
        "deadline": "登基钟鼓将在一刻钟后响起"
      },
      "instantEcho": {
        "directResult": "麒麟现世，百官惊惧，无人再敢质疑。",
        "unexpectedCost": "麒麟尾巴扫毁了祭坛一角，需紧急修复。",
        "beneficiary": "朱元璋",
        "payer": "礼部工匠"
      }
    },
    {
      "id": "C",
      "powerId": "move-mountain",
      "displayLabel": "移钟山堵北平城门",
      "label": "你在祭告天地后，将视野中的钟山移动到北平（元大都）城门外，堵死元顺帝逃往漠北的路线。",
      "intent": "用山封路，彻底断绝元廷退路。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动移动山体，把钟山移至北平城门",
        "target": "钟山",
        "deadline": "登基钟鼓将在一刻钟后响起"
      },
      "instantEcho": {
        "directResult": "钟山凭空出现在北平城门外，元顺帝出逃路线被堵。",
        "unexpectedCost": "南京失去钟山，风水受损，引发民间恐慌。",
        "beneficiary": "北伐明军",
        "payer": "南京百姓"
      }
    },
    {
      "id": "C",
      "powerId": "locate-anything",
      "displayLabel": "寻元顺帝于应昌府",
      "label": "你在登基钟鼓前，发动能力定位元顺帝，得知他正在应昌府（元上都）整军，你即刻将此密报呈给朱元璋。",
      "intent": "用精准定位打破敌军行踪不明的瓶颈。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动定位能力，指定人物为元顺帝",
        "target": "元顺帝",
        "deadline": "登基钟鼓将在一刻钟后响起"
      },
      "instantEcho": {
        "directResult": "你准确说出元顺帝在应昌府的行宫位置。",
        "unexpectedCost": "你因泄露天机遭天谴，失明三日。",
        "beneficiary": "朱元璋",
        "payer": "你（仪制官）"
      }
    }
  ],
  "beijing-capital-1421": [
    {
      "id": "C",
      "powerId": "reverse-cause",
      "displayLabel": "用迁都后果倒逼朱棣下诏",
      "label": "你在百官入殿前，将‘北京已建成新宫’这一结果改为原因，使朱棣的迁都诏书变成因宫殿建成而被迫发布，而非主动决策。",
      "intent": "把朱棣的主动决策变成被动响应，破除他可能收回成命的可能。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用手指向奉天殿藻井，默念逆转因果",
        "target": "朱棣尚未宣读的迁都诏书与已完工的北京宫殿",
        "deadline": "辰时百官进入奉天殿前"
      },
      "instantEcho": {
        "directResult": "朱棣手捧诏书，神色从犹豫变为理所当然，宣读时语气坚定。",
        "unexpectedCost": "南京六部文书系统瞬间断裂，南方漕运账目出现三日混乱。",
        "beneficiary": "朱棣",
        "payer": "南京留守官员"
      }
    },
    {
      "id": "C",
      "powerId": "stop-time",
      "displayLabel": "止时偷换百官冠服",
      "label": "你停止时间十分钟，迅速将每位官员朝服上的补子改为象征北京京师的麒麟补，替换原有禽兽补。",
      "intent": "通过统一服饰制造既成事实，让反对迁都者无法开口。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "摊开手掌，低语‘定’",
        "target": "奉天殿内包括六部尚书、侍郎在内的全体文武官员",
        "deadline": "辰时百官入殿后的瞬间"
      },
      "instantEcho": {
        "directResult": "时间恢复后，百官低头发现冠服已变，面面相觑却无人敢质疑。",
        "unexpectedCost": "你本人的鸿胪寺官袍因时间错位撕裂一道口子，需全程遮掩。",
        "beneficiary": "鸿胪寺卿",
        "payer": "你自己"
      }
    },
    {
      "id": "C",
      "powerId": "clone-self",
      "displayLabel": "百身拦截南部奏疏",
      "label": "你复制一百个自己，分守九个城门及通州运河码头，拦截所有从南京发出的反对迁都奏疏，当场焚毁。",
      "intent": "消除朝堂上可能出现的反对声浪，确保诏书顺利施行。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "撕下一片衣角，抛向空中化为百身",
        "target": "从南京经由运河和驿道送达北京的奏疏车队",
        "deadline": "辰时百官入殿前一刻钟"
      },
      "instantEcho": {
        "directResult": "所有反对疏被烧成灰烬，朝堂无人提及南京异议。",
        "unexpectedCost": "百个分身消耗你一半体力，典礼中你面色苍白险些晕厥。",
        "beneficiary": "户部尚书夏原吉",
        "payer": "你本人"
      }
    },
    {
      "id": "C",
      "powerId": "extinguish-fire",
      "displayLabel": "灭尽永定门告天火坛",
      "label": "你熄灭永定门外方圆十里内所有火把、香炉、燎炉之火，包括朱棣告天所用的燔柴炉。",
      "intent": "让迁都盛典失去‘天意’象征，迫使朱棣用诏书而非天火来确立合法性。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "向永定门方向吹出一口气",
        "target": "永定门外皇帝祭天的燔柴炉及周边所有火源",
        "deadline": "辰时朱棣出殿告天之前"
      },
      "instantEcho": {
        "directResult": "所有火焰同时熄灭，司礼监太监惊呼‘天象异常’。",
        "unexpectedCost": "奉天殿内取暖炭盆也熄灭，百官在二月严寒中瑟瑟发抖。",
        "beneficiary": "钦天监监正",
        "payer": "所有殿内官员"
      }
    },
    {
      "id": "C",
      "powerId": "erase-memory",
      "displayLabel": "抹除夏原吉的省钱谏言",
      "label": "你删除户部尚书夏原吉关于‘迁都耗费过大，南京可省百万石漕粮’的完整记忆，让他想不起任何反对数据。",
      "intent": "消除朝堂上最有力的经济反对论据。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用手指轻触夏原吉的后颈",
        "target": "户部尚书夏原吉脑中关于迁都耗费的所有记忆",
        "deadline": "辰时百官站定后、朱棣开口前"
      },
      "instantEcho": {
        "directResult": "夏原吉本欲出列，却茫然停步，张口无言。",
        "unexpectedCost": "他同时忘记了今日是迁都大典，典礼中问身旁官员‘今日何事’。",
        "beneficiary": "工部尚书宋礼",
        "payer": "夏原吉本人"
      }
    },
    {
      "id": "C",
      "powerId": "swap-two-people",
      "displayLabel": "对调太监与阁臣站位",
      "label": "你让司礼监掌印太监和文渊阁首辅在丹陛上瞬间互换位置，使太监手持诏书站到阁臣队列，阁臣跌入内侍行列。",
      "intent": "打破内外朝秩序，让朱棣在混乱中快速宣读诏书以恢复场面。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "左右手互击一次",
        "target": "司礼监掌印太监王振与文渊阁首辅杨士奇",
        "deadline": "辰时朱棣抬手示意宣读的瞬间"
      },
      "instantEcho": {
        "directResult": "两人错位引起骚动，朱棣怒喝‘肃静’，随即亲口宣诏以镇场。",
        "unexpectedCost": "王振摔倒时玉玺脱手，砸碎一块丹陛石砖。",
        "beneficiary": "朱棣",
        "payer": "司礼监与文渊阁双方"
      }
    }
  ],
  "longqing-trade-1567": [
    {
      "id": "C",
      "powerId": "pocket-building",
      "displayLabel": "收走海防馆永绝后患",
      "label": "你趁林参将不备，将整座月港海防馆连人带公文都收入随身口袋，迫使所有审批环节终止，自己独占开闸权。",
      "intent": "收走核发文引的官方建筑，直接扫除官僚阻力，让商船出海只需你一人点头。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将月港海防馆整座建筑连同内部全部人和物收入随身口袋",
        "target": "林参将及海防馆内所有官吏文书",
        "deadline": "涨潮前一刻"
      },
      "instantEcho": {
        "directResult": "月港海边突然空出一块地基，所有官吏和公文消失无踪。",
        "unexpectedCost": "海防馆消失引发周边民宅地基震动，数栋房屋出现裂痕。",
        "beneficiary": "你作为唯一开启审批的人",
        "payer": "林参将及其下属完全失去办公场所"
      }
    },
    {
      "id": "C",
      "powerId": "restore-youth",
      "displayLabel": "让老御史恢复壮年精力",
      "label": "你找到告老还乡但暗中支持开关的御史徐某，让他身体年轻四十年，重焕当年弹劾海禁的锐气，此刻跑去月港码头对商船喊话壮胆。",
      "intent": "用恢复青春的方式激活一位有声望的故老官员，让他以当年之勇当众推动开闸。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触碰御史徐某的身体，使其瞬间年轻四十年",
        "target": "御史徐某",
        "deadline": "涨潮前一刻"
      },
      "instantEcho": {
        "directResult": "老御史皱纹消退、腰背挺直，声音洪亮地走到码头，对商船喊道：“朝廷旨意在此，开闸！”",
        "unexpectedCost": "徐某的子孙认不出他，以为家中来了冒充先人的妖人，当场报官。",
        "beneficiary": "御史徐某本人获得壮年体魄",
        "payer": "徐某家族陷入混乱，需你后续解释"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-money",
      "displayLabel": "用无尽白银买通所有关节",
      "label": "你从袖中不断取出成色十足的白银元宝，当场贿赂月港税监、巡检和每艘商船的船主，把合法文引的费用全部垫付并每人多给百两。",
      "intent": "直接以无限财力消除所有利益相关方的犹疑，让开闸变成人人受益的共识。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "连续取出白银元宝分发给在场税监、巡检和船主",
        "target": "月港税监崔某、巡检赵某及陈、吴、林等七位船主",
        "deadline": "涨潮前一刻"
      },
      "instantEcho": {
        "directResult": "税监当场盖章放行，巡检撤走哨船，七艘商船同时升起风帆。",
        "unexpectedCost": "白银来源不明，引发沿岸百姓哄抢掉落碎银，踩伤数人。",
        "beneficiary": "七位船主获得合法出海执照并多得白银",
        "payer": "税监崔某、巡检赵某因收受巨额贿赂后续被查"
      }
    },
    {
      "id": "C",
      "powerId": "shrink-object",
      "displayLabel": "缩小闸门钥匙随身带走",
      "label": "你指着月港海口的那道铁制闸门，将其缩小为掌心大小并握在手中，没有你的钥匙，任何船都无法硬闯出海。",
      "intent": "物理控制出海口闸门，让船队必须等待你亲自开启，从而将决定权完全握在手中。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向月港海口铁闸门并将其缩小到掌心尺寸",
        "target": "月港海口铁闸门",
        "deadline": "涨潮前一刻"
      },
      "instantEcho": {
        "directResult": "铁质闸门化作微缩模型落入你掌中，原本关闭的入海口豁然敞开，海水涌入，但船队因无钥匙不敢动。",
        "unexpectedCost": "闸门缩小导致海堤固定结构松动，出现一条裂缝渗水。",
        "beneficiary": "你成为唯一控制出海的人",
        "payer": "月港工匠需紧急修补海堤裂缝"
      }
    },
    {
      "id": "C",
      "powerId": "transfer-cost",
      "displayLabel": "将走私罪名转给海禁派首领",
      "label": "你当众宣布若放船出海，一切违禁罪名由你自己承担，同时暗中将这项“开海”的直接代价——即朝廷追究的罪名与罚银——全部转移给反对开关的巡抚陈某，让他替所有船主背锅。",
      "intent": "消除船主对将来以走私被惩的恐惧，用转移代价让反对者承受政治风险，从而使开闸没有后顾之忧。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "大声宣告负责所有开海后果，同时将罪名与罚银转移给巡抚陈某",
        "target": "巡抚陈某",
        "deadline": "涨潮前一刻"
      },
      "instantEcho": {
        "directResult": "船主们见你肯担责，放心升帆；巡抚陈某突然接到京城急报，称他私自开海，降职罚俸。",
        "unexpectedCost": "陈某暴怒，当晚派家丁袭击你的住所。",
        "beneficiary": "七位船主无需承担任何罪名",
        "payer": "巡抚陈某承担降职与罚俸"
      }
    },
    {
      "id": "C",
      "powerId": "rewind-hour",
      "displayLabel": "倒退回开闸前重新布局",
      "label": "你眼看第一批商船已强行冲闸，立刻发动能力让月港完全回到一小时前的状态，所有文书复原、官吏归位、船退回港内，你获得第二次机会从容安排。",
      "intent": "在开闸失败或局势失控时重置局面，让自己带着记忆重新设计更稳妥的放行方案。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动能力让月港回到一小时前",
        "target": "月港全境包括海防馆、码头、商船",
        "deadline": "涨潮前一刻"
      },
      "instantEcho": {
        "directResult": "海面上退潮逆流，船只倒回港内，官吏坐回原位，文引空白如初。",
        "unexpectedCost": "你本人头痛欲裂，记忆却完整保留，而其他人完全不知发生了什么。",
        "beneficiary": "你获得第二次决策机会",
        "payer": "你承受剧烈头痛"
      }
    }
  ],
  "tiangong-kaiwu-1637": [
    {
      "id": "C",
      "powerId": "summon-future-self",
      "displayLabel": "召未来自己取走错版铜板",
      "label": "你在书坊刻印房召来十年后的自己，让他取走刻错的水排铜板并交付准确的新版，从而不停版直接重印。",
      "intent": "用未来的精确刻版替换错误版，避免延误装订。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤十年后的自己并命其取走水排铜板",
        "target": "水排铜板",
        "deadline": "两个时辰后装订前"
      },
      "instantEcho": {
        "directResult": "水排铜板被未来的你取走，同时书坊多出一块准确的新版。",
        "unexpectedCost": "未来的你在十年后的今天发现铜板再次丢失。",
        "beneficiary": "宋应星",
        "payer": "未来的你"
      }
    },
    {
      "id": "C",
      "powerId": "invisibility",
      "displayLabel": "隐身偷换刻印房铜板",
      "label": "你隐身潜入刻印房，将刻错的水排铜板替换为事先准备好的准确版，无人察觉。",
      "intent": "秘密修正错误，不停版也不惊动他人。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "隐身进入刻印房并替换铜板",
        "target": "水排铜板",
        "deadline": "两个时辰后装订前"
      },
      "instantEcho": {
        "directResult": "错版铜板被替换，印版恢复正确。",
        "unexpectedCost": "你被发现时无法解释铜板来源。",
        "beneficiary": "宋应星",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "split-river",
      "displayLabel": "分开赣江淹毁错版书页",
      "label": "你让书坊旁的赣江分开，洪水倒灌刻印房，冲走所有即将装订的错误书页，迫使重印。",
      "intent": "用物理手段消除所有错误书页，为修正争取时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "分开赣江使洪水灌入刻印房",
        "target": "刻印房内的错误书页",
        "deadline": "两个时辰后装订前"
      },
      "instantEcho": {
        "directResult": "错误书页全毁，但铜版未损。",
        "unexpectedCost": "书坊整套刻版被泡坏，需重新制作。",
        "beneficiary": "宋应星",
        "payer": "南昌书坊"
      }
    },
    {
      "id": "C",
      "powerId": "speak-any-distance",
      "displayLabel": "远程通话令停版修正",
      "label": "你与远在分宜的宋应星通话，命令他立即下令书坊停版并亲自送来正确的水排图纸。",
      "intent": "获得原作者的直接指令，强制执行修正。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "与宋应星通话并命令他停版",
        "target": "宋应星",
        "deadline": "两个时辰后装订前"
      },
      "instantEcho": {
        "directResult": "宋应星惊讶但仍听从，书坊停版。",
        "unexpectedCost": "宋应星产生疑虑，书坊延误且成本增加。",
        "beneficiary": "你",
        "payer": "宋应星"
      }
    },
    {
      "id": "C",
      "powerId": "duplicate-place",
      "displayLabel": "复制刻印房另造新版",
      "label": "你在书坊空地复制一个完全相同的刻印房，复制品中所有铜版都是正确的，然后取回正确铜版替换原件。",
      "intent": "生成一个无错误的副本，从中获得正确刻版。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制刻印房并取回正确铜版",
        "target": "刻印房",
        "deadline": "两个时辰后装订前"
      },
      "instantEcho": {
        "directResult": "复制刻印房出现，铜版正确。",
        "unexpectedCost": "复制品一天后消失，铜版也消失。",
        "beneficiary": "你",
        "payer": "时间线"
      }
    },
    {
      "id": "C",
      "powerId": "revive-dead",
      "displayLabel": "复活老刻工修正铜版",
      "label": "你复活去年去世的南昌老刻工刘师傅，他亲手修刻水排图铜板，赶在装订前完成。",
      "intent": "用已故专家的手艺直接修正错误。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复活刘师傅并让他修正铜版",
        "target": "刘师傅",
        "deadline": "两个时辰后装订前"
      },
      "instantEcho": {
        "directResult": "刘师傅复活并修好铜版。",
        "unexpectedCost": "一小时后刘师傅再次离世，引发混乱。",
        "beneficiary": "宋应星",
        "payer": "刘师傅"
      }
    }
  ],
  "nerchinsk-1689": [
    {
      "id": "C",
      "powerId": "immortal-day",
      "displayLabel": "赐索额图一日不死",
      "label": "你在日落前对索额图发动不死赐予，确保他在拉丁文校核过程中不被任何毒杀或急病击倒，直至条约签押完成。",
      "intent": "防止索额图在关键时刻死亡导致谈判中断",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向索额图并默念赐死",
        "target": "索额图",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "索额图体表浮现淡金微光，精神抖擞完成校核",
        "unexpectedCost": "你因消耗过度三日无法入眠",
        "beneficiary": "索额图",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "transmute-material",
      "displayLabel": "拉丁文绒纸变羊皮",
      "label": "你在日落前将谈判桌上唯一一份拉丁文条约草稿从绒纸永久变为羊皮，使其更耐久且不易被墨迹浸染模糊。",
      "intent": "确保拉丁文文本不会因纸张破损而引发边界争议",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触碰草稿并低语‘羊皮’",
        "target": "拉丁文条约草稿",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "草稿瞬间变成羊皮，俄方使节瞪目结舌",
        "unexpectedCost": "俄方怀疑清朝作弊，额外要求逐字核对耗时至次日",
        "beneficiary": "清朝使团",
        "payer": "俄方使团的时间"
      }
    },
    {
      "id": "C",
      "powerId": "broadcast-thought",
      "displayLabel": "脑内强音催签押",
      "label": "你在日落前对全场所有人（包括清俄使节和随从）脑中同时送出‘边界已定，速签勿误’，迫使俄方放弃拖延。",
      "intent": "直接消除俄方可能借故拖延校核的时间战术",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "闭目集中意念发送指令",
        "target": "谈判营帐内所有人",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "所有人同时愣住，俄方首席戈洛文捂住额头后同意签押",
        "unexpectedCost": "两名清军译员因脑内巨响短暂失聪",
        "beneficiary": "清朝使团",
        "payer": "两名清军译员"
      }
    },
    {
      "id": "C",
      "powerId": "teleport-crowd",
      "displayLabel": "迁百人至雅克萨城",
      "label": "你在日落前将清俄双方谈判人员共87人瞬间传送到雅克萨旧城废墟，让双方亲见战争伤痕从而加速合约。",
      "intent": "用视觉震撼促使双方放弃纠缠细节",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "挥手并低语‘雅克萨’",
        "target": "清俄双方谈判人员87人",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "众人突现废墟，惊愕后戈洛文主动让步",
        "unexpectedCost": "你自身滞留原地未能同行，后续信任度下降",
        "beneficiary": "清朝使团",
        "payer": "你自己的威信"
      }
    },
    {
      "id": "C",
      "powerId": "borrow-tomorrow-memory",
      "displayLabel": "记明日签押结果",
      "label": "你在日落前提前获得自己明日此刻的记忆，看到条约已签，因此果断向索额图报告文本无误。",
      "intent": "消除对校核错误的恐惧，直接推动签押",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "闭目默想‘明日此时’",
        "target": "你自己的未来记忆",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "你脑中闪过签押完成的画面，随即坚定告知索额图无误",
        "unexpectedCost": "你因预见未来而提前焦虑，签押后两日精神恍惚",
        "beneficiary": "索额图",
        "payer": "你自己的精神状态"
      }
    },
    {
      "id": "C",
      "powerId": "summon-giant-beast",
      "displayLabel": "巨兽现世慑俄方",
      "label": "你在日落前于尼布楚城外空旷处召来百米高巨兽，命令它静立不动，迫使俄方因恐惧而放弃拖延立刻签押。",
      "intent": "用绝对武力威慑打破谈判僵局",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "向天空挥手低吼‘现’",
        "target": "尼布楚城外空地",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "巨兽降临，俄方使节哆嗦着签下条约",
        "unexpectedCost": "巨兽踩毁城外粮草堆，清军补给受损",
        "beneficiary": "清朝使团",
        "payer": "清军后勤兵"
      }
    }
  ],
  "hundred-days-1898": [
    {
      "id": "C",
      "powerId": "universal-language",
      "displayLabel": "听懂翁同龢的密语",
      "label": "你利用听懂所有语言的能力，在毓庆宫窃听帝师翁同龢与张荫桓关于变法诏书措辞的私下争论，确认他们是否支持军队调动条款。",
      "intent": "绕过语言隔阂，获取守旧派真实意图，避免诏书被曲解。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "运用听懂所有语言的能力，偷听帝师翁同龢与户部左侍郎张荫桓在毓庆宫西配殿用江淮官话和广东官话私下争论诏书中关于北洋军队的条款。",
        "target": "毓庆宫内翁同龢、张荫桓",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "你当场听出翁同龢暗示：“荣禄的北洋军不可动，否则太后不满。” 张荫桓则反对：“不动军，变法即空。”",
        "unexpectedCost": "你因凝神窃听，误了抄写一份普通上谕，被军机大臣刚毅训斥，遭到同僚疑心。",
        "beneficiary": "刚毅（因你耽误得以检查其他诏书）",
        "payer": "你（受训斥且被怀疑忠诚）"
      }
    },
    {
      "id": "C",
      "powerId": "intangible-walls",
      "displayLabel": "穿墙送入明定国是诏",
      "label": "你在午时前三刻，让毓庆宫通往乾清宫南书房之间的墙壁失去实体，亲自手持已用玺的诏书直接穿过墙进入南书房，赶在保守派拦截前将诏书交给值班太监发往各省。",
      "intent": "无视保守派封锁，保证变法第一份诏书顺利下达。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让毓庆宫与乾清宫南书房之间的宫墙、窗棂和门扇失去实体，手持已用御玺的明定国是诏书直接穿过墙进入南书房，交予正直太监发送。",
        "target": "毓庆宫与乾清宫之间的宫墙及南书房",
        "deadline": "午时前一刻"
      },
      "instantEcho": {
        "directResult": "你在无人察觉的情况下将诏书送达南书房，太监立即钤印发出，各省在午时收到上谕。",
        "unexpectedCost": "因墙变成虚体，一名奔跑的宫女迎面摔进院子，撞倒了礼部尚书怀塔布，引发一场小混乱，怀塔布大怒要查办宫女。",
        "beneficiary": "光绪帝（诏书准时发出）",
        "payer": "宫女（被摔伤并面临责罚）"
      }
    },
    {
      "id": "C",
      "powerId": "reverse-cause",
      "displayLabel": "解散保守派上谕延迟",
      "label": "你颠倒因果，把“各省上谕晚到”重新成为原因，而“保守派先得到消息并组织抵抗”变成结果。你成功制造出各省在同一天先收到号召改革的上谕，六天后保守派才知情的局面。",
      "intent": "打乱保守派预谋，使变法诏书先于反动部署到达各省。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "当场用笔在奏折上颠倒因果：将原逻辑（保守派先获情报 → 上谕延迟）改为各省上谕延迟（原因） → 保守派先得到消息（结果），并使其永久生效。",
        "target": "军机处案上那份阻拦上谕的奏折及因果链条",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "六天后，荣禄才发现上谕已送达各省，其策划的拦截行动全部失效，各地提前开始议论新政。",
        "unexpectedCost": "一名不知情的驿卒因“延迟”原因被军机处责打五十大板，成为临时替罪羊。",
        "beneficiary": "光绪帝和康有为（变法得到宝贵时间窗口）",
        "payer": "驿卒（无辜受罚）"
      }
    },
    {
      "id": "C",
      "powerId": "stop-time",
      "displayLabel": "暂停时间暗查政变密旨",
      "label": "你利用时间停止的十分钟内，翻遍毓庆宫军机处所有已拟未发的谕旨，发现慈禧太后写好的三份训政密旨，并改动其中发往直隶总督荣禄的份。",
      "intent": "提前发现并干扰政变部署，争取光绪帝主动。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动停止时间能力，在毓庆宫军机处满屋文书秒停的十分钟内，快速翻阅所有谕旨，找出慈禧太后亲笔密旨三份，并改动其中发给直隶总督荣禄的那份。",
        "target": "毓庆宫军机处案上的所有上谕草稿和密旨",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "时间恢复后，那封密旨被改为要求荣禄“按兵不动，听候朝命”而非带兵进京，但军机大臣刚毅在恢复瞬间发现毛笔移位，对他产生警觉。",
        "unexpectedCost": "刚毅注意到文房四宝的位置异常，报告给慈禧太后，慈禧开始秘密更换身边侍卫。",
        "beneficiary": "光绪帝（政变延迟数日）",
        "payer": "你（成为刚毅重点怀疑对象）"
      }
    },
    {
      "id": "C",
      "powerId": "clone-self",
      "displayLabel": "百身分送诏书到六部",
      "label": "你复制一百个自己，每人持一份明定国是诏副本，同时出发分赴吏、户、礼、兵、刑、工六部及都察院，赶在午时前同时撞击六部大门，迫使各个衙门当场接收并公告。",
      "intent": "避免诏书被单一渠道扣留，以同时行动迫使保守派官僚无法选择性忽视。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动复制能力，产生九十九个自己，每人分配一份明定国是诏副本（用黄绫包裹），命令所有分身在同一时刻冲击六部及都察院正门，高呼“皇帝诏书到，即刻公告”。",
        "target": "六部堂官及都察院左都御史徐桐",
        "deadline": "午时正"
      },
      "instantEcho": {
        "directResult": "六个部门在同一瞬间收到诏书，多数官员来不及商议便当众宣读，各省官报立即刊发，变法消息闪电传开。",
        "unexpectedCost": "九十九个分身被九门提督手下持刀驱散，但分身互撞导致十七人轻伤，你本人因疲劳过度在当天傍晚昏倒。",
        "beneficiary": "光绪帝和京中维新派（诏书迅速普及）",
        "payer": "你（劳累至昏倒）、九十七个无辜百姓误认为党徒遭受轻微皮外伤"
      }
    },
    {
      "id": "C",
      "powerId": "extinguish-fire",
      "displayLabel": "灭火阻断保守派传信烟",
      "label": "你利用熄灭十里的能力，在午时前瞬间熄灭京城东西南北九个城门守兵正在焚烧的变法令草稿堆，以及各旗营用以传讯的两座烽火台火焰，阻止保守派通过烟火联络和焚毁证据。",
      "intent": "切断保守派利用烟火传递紧急军令和销毁不利文书的手段。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动熄灭能力，指向九门提督府内正在焚烧的废令草稿堆、正阳门等地传讯烽火台，以及神机营营房外校场上正烧的文牍火盆。",
        "target": "京城九门及神机营内所有明火，包括烽火台、火盆、墙下焚烧堆",
        "deadline": "午时前一刻"
      },
      "instantEcho": {
        "directResult": "九门提督府和神机营的火瞬间全灭，损毁的文书得以残存，但荣禄派出骑快马改用口传命令，反而比原计划更快传至天津。",
        "unexpectedCost": "慈禧太后原本安排的口传信使因火灭失去掩护，被御史杨深秀发现行踪并记录下来。",
        "beneficiary": "御史杨深秀（获得罪证）",
        "payer": "两名旗丁因在烽火台附近打瞌睡被鞭打（荣禄为泄愤）"
      }
    }
  ],
  "wuchang-1911": [
    {
      "id": "C",
      "powerId": "control-weather",
      "displayLabel": "呼风唤雨阻清军",
      "label": "你立刻让武昌城狂风大作暴雨倾盆，阻断巡防队通往营门的道路，使清军半小时内无法封锁营门。",
      "intent": "用恶劣天气延迟清军封锁，为起义争取时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "你站在楚望台军械库门口，抬手向天呼出风雨命令。",
        "target": "武昌城方圆百里的天空",
        "deadline": "半小时内"
      },
      "instantEcho": {
        "directResult": "武昌城突降暴雨，狂风卷走清军巡防队的灯笼和旗帜。",
        "unexpectedCost": "起义士兵的火药引信受潮，需要重新干燥。",
        "beneficiary": "湖北新军工程营起义士兵",
        "payer": "工程营的火药管理员"
      }
    },
    {
      "id": "C",
      "powerId": "see-hidden-writing",
      "displayLabel": "破译暗语识名单",
      "label": "你看见军械库墙上被石灰水覆盖的革命党人联络暗号和未烧尽的名单，直接指出谁是内应。",
      "intent": "找出潜伏在清军中的革命党，避免起义因身份不明而失败。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "你用手擦拭军械库东墙上的石灰层，顿时浮现出被遮掩的字迹。",
        "target": "楚望台军械库东墙上的隐藏文字",
        "deadline": "半小时内"
      },
      "instantEcho": {
        "directResult": "墙上显现出三十七名革命党人的代号和约会地点。",
        "unexpectedCost": "石灰粉呛入喉咙导致你剧烈咳嗽，引来守卫注意。",
        "beneficiary": "革命党人熊秉坤",
        "payer": "你本人"
      }
    },
    {
      "id": "C",
      "powerId": "pocket-building",
      "displayLabel": "收走军械库断粮草",
      "label": "你立即将整座楚望台军械库收入口袋，使清军无法取用弹药，而起义士兵已预先取出所需武装。",
      "intent": "彻底断绝清军的武器补给，确保起义军独占军火。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "你抬手对着军械库虚抓，整座建筑瞬间消失在原地。",
        "target": "楚望台军械库",
        "deadline": "半小时内"
      },
      "instantEcho": {
        "directResult": "军械库消失，原地只留下地基坑洞。",
        "unexpectedCost": "口袋里枪支弹药互相碰撞走火，震伤你腿部。",
        "beneficiary": "已领取武器的起义士兵",
        "payer": "你本人"
      }
    },
    {
      "id": "C",
      "powerId": "restore-youth",
      "displayLabel": "返老军官助起义",
      "label": "你让湖广总督瑞澂的幕僚张彪（实际年龄五十二岁）年轻四十年变成十二岁少年，使其无法有效指挥清军。",
      "intent": "瘫痪清军指挥系统，使其在关键时刻缺位。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "你指向总督署方向默念“返老还童”，一道绿光飞去。",
        "target": "张彪",
        "deadline": "半小时内"
      },
      "instantEcho": {
        "directResult": "张彪突然缩小成十二岁少年，军服脱落，士兵哗然。",
        "unexpectedCost": "瑞澂怀疑是革命党妖术，下令炮轰武昌城全境。",
        "beneficiary": "起义军突击队",
        "payer": "武昌城中无辜平民"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-money",
      "displayLabel": "撒银收买守门兵",
      "label": "你从口袋里掏出大把银元和金条，分发给营门守卫，使他们放弃抵抗放起义军通过。",
      "intent": "用金钱快速瓦解清军基层防线，避免正面交火损失。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "你双手捧出银元，走到营门守卫面前逐一塞入他们怀中。",
        "target": "营门守卫",
        "deadline": "半小时内"
      },
      "instantEcho": {
        "directResult": "守卫纷纷收起银元，打开营门并交出弹药箱。",
        "unexpectedCost": "银元来源被瑞澂探知，他悬赏五千两抓你。",
        "beneficiary": "起义士兵",
        "payer": "你本人"
      }
    },
    {
      "id": "C",
      "powerId": "shrink-object",
      "displayLabel": "缩炮为丸破总督",
      "label": "你将总督署门口的克虏伯火炮缩小为弹丸大小，起义军轻易搬走，无法对进攻路线构成威胁。",
      "intent": "移除清军重火力，保证起义军冲锋道路畅通。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "你瞄准总督署门前那门炮，伸手一握，它迅速缩小落入你掌心。",
        "target": "湖广总督署门前的克虏伯火炮",
        "deadline": "半小时内"
      },
      "instantEcho": {
        "directResult": "火炮缩小成核桃大小，被你放入口袋。",
        "unexpectedCost": "缩小的火炮因高温涨破口袋，烫伤你皮肤。",
        "beneficiary": "起义军攻城部队",
        "payer": "你本人"
      }
    }
  ],
  "may-fourth-1919": [
    {
      "id": "C",
      "powerId": "read-one-mind",
      "displayLabel": "刺探罗家伦心念",
      "label": "你伸手轻触罗家伦太阳穴，读到他脑中正在飞速回忆昨晚他起草《北京学界全体宣言》时那句“中国的土地可以征服而不可以断送”以及此刻他担忧人手不足的焦虑——你立即在印刷室白纸上写下他未说出的分段印刷计划。",
      "intent": "迅速获知宣言全文的分段方案，直接用于排版。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触摸并读取罗家伦思想",
        "target": "罗家伦",
        "deadline": "学生队伍将在一个时辰后于天安门集结"
      },
      "instantEcho": {
        "directResult": "你获得《北京学界全体宣言》准确分段内容及罗家伦对印刷数量的计算。",
        "unexpectedCost": "罗家伦因你的触摸短暂分神，手中的墨水瓶被打翻，弄脏了另一摞信纸。",
        "beneficiary": "北京大学学生联合会",
        "payer": "罗家伦"
      }
    },
    {
      "id": "C",
      "powerId": "blink-self",
      "displayLabel": "瞬移传单至红楼前",
      "label": "你抱起刚印好的五百张传单，凝视自己看得见的红楼前院石板路中央，瞬间连人带传单从印刷室消失并出现在那里；然后立即跑回印刷室继续搬运。",
      "intent": "将第一批传单直接送达红楼前院集结点，节省搬运时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "携带传单瞬移到红楼前院",
        "target": "印刷室中的传单",
        "deadline": "学生队伍将在一个时辰后于天安门集结"
      },
      "instantEcho": {
        "directResult": "五百张传单出现在红楼前院石板上，附近学生开始分发。",
        "unexpectedCost": "你瞬移时带起的风将印刷室窗户震裂，玻璃碎了一地。",
        "beneficiary": "北大学生游行队伍",
        "payer": "你（被玻璃碎片划伤手背）"
      }
    },
    {
      "id": "C",
      "powerId": "summon-future-self",
      "displayLabel": "召来十年后你",
      "label": "你召唤出十年后已担任外文系教授的自己，他带来了包着山东问题卷宗的公文包。你让他立即在印刷室黑板上画出1920年华盛顿会议前的舆论图景，并警告当前口号“内惩国贼”可能扩大为打砸。",
      "intent": "利用未来知识预判运动走向，提前调整口号避免暴力升级。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤未来的你并用其所知绘制舆论图",
        "target": "黑板与未来自己",
        "deadline": "学生队伍将在一个时辰后于天安门集结"
      },
      "instantEcho": {
        "directResult": "黑板出现未来两年山东问题的三条可能发展路径。",
        "unexpectedCost": "未来你的出现惊吓了在场学生，其中一人撞翻了油墨桶。",
        "beneficiary": "学生联合会决策层",
        "payer": "未来你的时间线（因此改变而出现记忆偏差）"
      }
    },
    {
      "id": "C",
      "powerId": "invisibility",
      "displayLabel": "隐身潜入教育部",
      "label": "你全身连同宣言传单一同消失，快步走出红楼前往东城教育部。你直接推开部长办公室门，将一份传单放在桌上并留下便条“此乃民心所向”。返回时你在校内解除隐身。",
      "intent": "越过警察警戒线，直接对教育部长施加心理压力。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "隐身前往教育部放置传单",
        "target": "教育部长办公室",
        "deadline": "学生队伍将在一个时辰后于天安门集结"
      },
      "instantEcho": {
        "directResult": "传单出现在部长桌上，部长随后取消了对游行的口头压制命令。",
        "unexpectedCost": "你离开教育部时被门卫无意撞到，手中的另一张传单掉落在地，被门卫捡起。",
        "beneficiary": "全体游行学生",
        "payer": "你（暴露了一张传单给当局）"
      }
    },
    {
      "id": "C",
      "powerId": "split-river",
      "displayLabel": "分开昆明湖以行",
      "label": "你带领二十名学生从红楼步行至颐和园昆明湖，右手向湖面一指，湖水从中分开露出干涸湖底。你命令学生快速穿过湖底至对岸玉泉山，避开城内军警拦截，绕道前往天安门。",
      "intent": "开辟一条避开军警的新路线确保准时到达集合点。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "分开昆明湖湖水",
        "target": "昆明湖",
        "deadline": "学生队伍将在一个时辰后于天安门集结"
      },
      "instantEcho": {
        "directResult": "昆明湖底显现一条宽五米直通对岸的通道，学生队伍顺利通过。",
        "unexpectedCost": "湖水分开时形成巨大轰鸣声，惊动了附近警察，他们随即向湖面赶来。",
        "beneficiary": "经此路线前往天安门的学生队伍",
        "payer": "昆明湖中的鱼群（大量搁浅）"
      }
    },
    {
      "id": "C",
      "powerId": "speak-any-distance",
      "displayLabel": "致电巴黎顾维钧",
      "label": "你拿起印刷室壁炉边的手摇电话，轻声呼叫“巴黎中国代表团顾维钧先生”。电话那头传来对方声音，你立刻说：“顾代表，国内五万学生今日将上街游行，请务必拒绝签章，否则国人将视你为叛贼。”",
      "intent": "直接在条约签字前施加来自国内民意的压力。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "与顾维钧实时通话",
        "target": "顾维钧",
        "deadline": "学生队伍将在一个时辰后于天安门集结"
      },
      "instantEcho": {
        "directResult": "顾维钧在电话中沉默五秒后回答：“我明白，请转告同学，维钧定不负所托。”",
        "unexpectedCost": "电话线路因超距负载过载，印刷室电话机瞬间烧毁，冒出一股焦味。",
        "beneficiary": "中国外交代表团（获得后方决心）",
        "payer": "你（被迫用剩下时间手动印刷，延误了十分钟）"
      }
    }
  ],
  "suez-nationalization-1956": [
    {
      "id": "C",
      "powerId": "guarantee-action",
      "displayLabel": "确保纳赛尔广播时同步接管",
      "label": "你在纳赛尔开口前，通过电话线对运河公司每一处等待中的埃及接管员发出密令：‘按下操作杆，接管立刻生效。’ 这条密令不可撤销，英法资本将毫无还手之力。",
      "intent": "只用一次行动突破英法资本封锁运河的瓶颈",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发出密令",
        "target": "运河公司所有埃及接管员",
        "deadline": "纳赛尔开口前"
      },
      "instantEcho": {
        "directResult": "所有埃及官员同时按下接管操作杆，苏伊士运河公司各办公室被同步占领。",
        "unexpectedCost": "纳赛尔不得不当场修改演讲稿，把‘你’的名字列为国家英雄，但你从此无法隐匿在幕后。",
        "beneficiary": "埃及接管员与纳赛尔",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "walk-through-walls",
      "displayLabel": "穿过金库墙取股权证书",
      "label": "你拉着接头人阿卜杜拉，在英法守卫眼皮下穿过塞得港运河公司总部的密封金库墙壁，取出英法股东名册与股权证书，塞进随身的公文袋里。",
      "intent": "用穿墙能力快速取得英法资本控股证据，从法理上固化国有化",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "穿过金库墙壁取出股权证书",
        "target": "塞得港运河公司总部金库内的英法股东名册与股权证书",
        "deadline": "纳赛尔广播结束前"
      },
      "instantEcho": {
        "directResult": "你与阿卜杜拉携证书直接走出金库大门，无人察觉。",
        "unexpectedCost": "金库的震动警报触发，整个大楼进入封锁状态，你们二人被困在了办公楼二层，只能用窗户跳下。",
        "beneficiary": "埃及法律团队",
        "payer": "阿卜杜拉与你的膝盖"
      }
    },
    {
      "id": "C",
      "powerId": "immortal-day",
      "displayLabel": "赐予纳赛尔一日不死",
      "label": "你在纳赛尔走上广播台前，把手掌按在他肩头，低声说：‘在这二十四小时内，子弹、毒药、暗杀都不能夺走你的意识或生命。’ 然后你退到控制室玻璃后。",
      "intent": "用不死能力确保纳赛尔能完成宣布国有化的全场广播，防止英法提前暗杀",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "把手掌按在纳赛尔肩头并赋予不死",
        "target": "纳赛尔",
        "deadline": "纳赛尔走上广播台之前"
      },
      "instantEcho": {
        "directResult": "纳赛尔完整广播了国有化声明，期间一枚从对街射来的狙击步枪子弹在他胸前被弹开，落入话筒。",
        "unexpectedCost": "纳赛尔从此对你产生迷信般的依赖，每次决策都要求你在场，你丧失了调离岗位的自由。",
        "beneficiary": "纳赛尔本人",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "transmute-material",
      "displayLabel": "把金库钢门变成石膏",
      "label": "你走到运河公司金库前，用指尖碰触那扇三英寸厚的防爆钢门，低声说道：‘变成石膏。’ 在守卫目瞪口呆中，整扇门化为灰白色石膏，手指一推就碎。",
      "intent": "改变金库材料以无痕进入，避免引爆警报或破坏文件",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "碰触并转化金库钢门为石膏",
        "target": "运河公司金库的防爆钢门",
        "deadline": "在英法保安换岗的30秒间隙内完成"
      },
      "instantEcho": {
        "directResult": "金库门变成石膏，你轻松推开门进去取出了所有文件。",
        "unexpectedCost": "石膏粉尘弥漫，触发了大楼的烟雾报警器，消防队10分钟后赶到，你们必须提前撤离。",
        "beneficiary": "埃及情报人员",
        "payer": "你与消防队的冲突"
      }
    },
    {
      "id": "C",
      "powerId": "broadcast-thought",
      "displayLabel": "送接管命令进万人脑中",
      "label": "你站在亚历山大广播电台屋顶，面向全城，心中默念：‘所有运河公司职员、所有码头工人、所有国营职工——立刻停止等待，从现在起你们只服从埃及总统令。接管开始！’ 此指令同时灌入方圆十公里内每个人脑海。",
      "intent": "用心灵广播突破通讯延迟，让所有埃及员工瞬间统一行动，防止英法指挥干预",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "心中发出接管广播命令",
        "target": "方圆十公里内所有埃及人",
        "deadline": "纳赛尔广播稿念出‘公司’二字的一瞬间"
      },
      "instantEcho": {
        "directResult": "数以千计的职员同时走向运河公司各办公室，接管同步完成，英法经理被请出。",
        "unexpectedCost": "部分非埃及籍人士（含英美记者）也听到了指令，导致他们提前报道了计划，外交抗议提前爆发。",
        "beneficiary": "埃及全体国有化执行团队",
        "payer": "你的身份暴露给国际媒体"
      }
    },
    {
      "id": "C",
      "powerId": "teleport-crowd",
      "displayLabel": "百人迁入运河公司总部",
      "label": "你召集原本分散在亚历山大各办公室的87名行动组成员，集中在广播联络室地下车库。你闭上眼，回忆塞得港运河公司总部大厅的样子，说出‘地点’二字。87人连同你自己凭空出现在大厅内，直接面对英法董事会。",
      "intent": "用群体传送突破物理距离，让百名接管人员在英法守卫集结前一次性占据总部",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "集体传送87人",
        "target": "自己与87名组员",
        "deadline": "纳赛尔广播开始后30秒内"
      },
      "instantEcho": {
        "directResult": "87人突然出现在运河公司董事会会议室，完全控制了局面。",
        "unexpectedCost": "传送引发的空间扭曲导致大厅所有电子设备烧毁（包括电话、录音机），你无法立即与总统府确认结果。",
        "beneficiary": "87名行动组员与埃及政府",
        "payer": "你的坐标暴露在英法卫星侦察下"
      }
    }
  ],
  "web-public-domain-1993": [
    {
      "id": "C",
      "powerId": "door-anywhere",
      "displayLabel": "开门让伯纳斯-李速取放弃文件",
      "label": "你用法务墙开一扇门直通伯纳斯-李办公室，让他亲手取回未签字的放弃声明，赶在今日发布前交到你手中。",
      "intent": "绕过CERN内部审批链条，直接获得同意发布的关键文件。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在法务办公室墙壁上打开一扇门",
        "target": "伯纳斯-李在CERN的办公室",
        "deadline": "1993年4月30日结束前"
      },
      "instantEcho": {
        "directResult": "伯纳斯-李通过门递出签好字的开放声明文件。",
        "unexpectedCost": "门消失后，法务墙出现一道无法修复的裂纹。",
        "beneficiary": "伯纳斯-李",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "age-target",
      "displayLabel": "令反对开放的老法务官瞬间衰老",
      "label": "你在签署会议前，对一直阻挠开放的CERN老法务官彼得发动能力，让他身体瞬间老去四十年，无法参与今日决策。",
      "intent": "清除最后一位关键反对者，加速签署进程。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定老法务官彼得为目标发动衰老",
        "target": "CERN法务官彼得",
        "deadline": "1993年4月30日结束前"
      },
      "instantEcho": {
        "directResult": "彼得头发花白、行动迟缓，无法再辩论。",
        "unexpectedCost": "彼得因惊吓过度而心脏病发作入院。",
        "beneficiary": "你",
        "payer": "彼得"
      }
    },
    {
      "id": "C",
      "powerId": "universal-language",
      "displayLabel": "听懂每一位同事的私下反对",
      "label": "你用法务语言翻译能力，在走廊里偷听到所有同事以不同语言对开放条款的终极顾虑，并逐一用他们的母语说服。",
      "intent": "预判并化解所有隐蔽反对意见，确保上午会议前形成共识。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "使用翻译能力窃听并回应同事",
        "target": "CERN法务办公室的同事",
        "deadline": "1993年4月30日结束前"
      },
      "instantEcho": {
        "directResult": "所有同事均表示支持开放声明。",
        "unexpectedCost": "你因使用能力过度疲劳而嗓子嘶哑。",
        "beneficiary": "伯纳斯-李和全球用户",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "intangible-walls",
      "displayLabel": "让法务办公室墙壁化为无形",
      "label": "你让整个CERN法务办公室的墙壁、门窗可穿透，迫使所有员工在恐慌中签字同意，免得文件被风吹走。",
      "intent": "用物理混乱压迫反对者在中午前签字。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让法务办公室墙壁失去实体",
        "target": "CERN法务办公室",
        "deadline": "1993年4月30日结束前"
      },
      "instantEcho": {
        "directResult": "文件被风吹乱，但所有人急于稳定局面而签字。",
        "unexpectedCost": "几份未锁的重要文件被风刮走，永久丢失。",
        "beneficiary": "你",
        "payer": "整个法务部"
      }
    },
    {
      "id": "C",
      "powerId": "reverse-cause",
      "displayLabel": "颠倒签字延迟为立即发布",
      "label": "你将“开放声明未能发布”这个结果颠倒为原因，强迫“拒绝签署”现在必须变成结果——于是所有签记者立即同意发布。",
      "intent": "直接逆转僵局，让拒绝行为本身成为延迟的原因而非结果。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "颠倒开放声明未发布的结果为原因",
        "target": "今日内开放声明未能发布的局面",
        "deadline": "1993年4月30日结束前"
      },
      "instantEcho": {
        "directResult": "所有主任当场签字并声明立即发布。",
        "unexpectedCost": "世界逻辑混乱，三小时后自动修复但部分记忆错乱。",
        "beneficiary": "伯纳斯-李",
        "payer": "全体CERN员工（短暂困惑）"
      }
    },
    {
      "id": "C",
      "powerId": "stop-time",
      "displayLabel": "暂停时间独自替换拒绝文件",
      "label": "你在法务办公室停止时间十分钟，悄悄从公文包中取出被拒绝的旧草案，换上已签字的开放声明。",
      "intent": "在无人知晓的情况下完成文件替换，避免任何口头反对。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "停止时间后替换文件",
        "target": "放在主任桌上的待签文件堆",
        "deadline": "1993年4月30日结束前"
      },
      "instantEcho": {
        "directResult": "时间恢复后，主任看到的已是签字的开放声明。",
        "unexpectedCost": "你的一只手表在时间停止期间永久卡住。",
        "beneficiary": "全球互联网用户",
        "payer": "你"
      }
    }
  ],
  "marathon-490bc": [
    {
      "id": "C",
      "powerId": "jump-tomorrow",
      "displayLabel": "送波斯骑兵抵达明天",
      "label": "你按响号角，让那支离开战场的波斯骑兵连人带马跳过二十四小时，直接出现在明天此时的海面上。",
      "intent": "使波斯骑兵无法在时限内返回战场，我方趁机冲锋。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "吹响号角并指定目标",
        "target": "那支离开战场的波斯骑兵",
        "deadline": "波斯舰队将在一个时辰后重新调动骑兵"
      },
      "instantEcho": {
        "directResult": "波斯骑兵瞬间消失，战场上只剩波斯步兵。",
        "unexpectedCost": "号角声惊动了波斯步兵，他们提前列阵防御。",
        "beneficiary": "米太亚得的雅典重装步兵",
        "payer": "你——被波斯弓箭手重点瞄准"
      }
    },
    {
      "id": "C",
      "powerId": "copy-skill",
      "displayLabel": "复制波斯指挥官战术",
      "label": "你盯着阿塔佛涅斯，复制他对波斯骑兵调度战术的全部知识，然后在号角声中向米太亚得大喊破敌之策。",
      "intent": "获得敌方指挥策略，弥补雅典兵力劣势。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制技能并向米太亚得献策",
        "target": "阿塔佛涅斯",
        "deadline": "波斯舰队将在一个时辰后重新调动骑兵"
      },
      "instantEcho": {
        "directResult": "米太亚得采纳你的建议，调整了方阵侧翼。",
        "unexpectedCost": "阿塔佛涅斯察觉异常，加强了警戒。",
        "beneficiary": "米太亚得",
        "payer": "你——因泄密被波斯间谍盯上"
      }
    },
    {
      "id": "C",
      "powerId": "control-weather",
      "displayLabel": "召海风阻断波斯援军",
      "label": "你举起号角向天空发出信号，召唤强风从海面吹向波斯舰队，使其无法在一个时辰内靠岸放下骑兵。",
      "intent": "延长波斯骑兵缺席时间，确保决战优势。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用号角召唤强风",
        "target": "波斯舰队所在的海面",
        "deadline": "波斯舰队将在一个时辰后重新调动骑兵"
      },
      "instantEcho": {
        "directResult": "狂风骤起，波斯船只颠簸，无法靠岸。",
        "unexpectedCost": "强风也吹乱了雅典方阵的旗帜，造成短暂混乱。",
        "beneficiary": "前线的雅典重装步兵",
        "payer": "你——因使用非人力量被米太亚得怀疑"
      }
    },
    {
      "id": "C",
      "powerId": "see-hidden-writing",
      "displayLabel": "看见波斯密令蜡板",
      "label": "你盯着波斯统帅达提斯腰间的蜡板，看到被刮去的文字：“骑兵撤离是诱饵，待雅典冲锋后包抄”。你立即向米太亚得揭露。",
      "intent": "识破波斯诱敌计谋，避免中计。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "阅读隐藏文字并报告",
        "target": "达提斯腰间的蜡板",
        "deadline": "波斯舰队将在一个时辰后重新调动骑兵"
      },
      "instantEcho": {
        "directResult": "米太亚得放弃原定冲锋计划，改为诱敌深入。",
        "unexpectedCost": "达提斯发现你注视蜡板，命令波斯射手集火你。",
        "beneficiary": "米太亚得与全军",
        "payer": "你——被达提斯标记为优先击杀目标"
      }
    },
    {
      "id": "C",
      "powerId": "pocket-building",
      "displayLabel": "收走波斯军帐",
      "label": "你冲向波斯主营，伸手触碰主将大帐，整座帐篷连同内部地图、信使和补给全部消失进口袋。",
      "intent": "瘫痪波斯指挥系统，使其无法调动骑兵。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触碰并收走大帐",
        "target": "波斯主将大帐",
        "deadline": "波斯舰队将在一个时辰后重新调动骑兵"
      },
      "instantEcho": {
        "directResult": "波斯主营乱成一团，失去指挥。",
        "unexpectedCost": "你被波斯卫兵包围，身上多处受伤。",
        "beneficiary": "雅典方阵",
        "payer": "你——独自陷入敌阵"
      }
    },
    {
      "id": "C",
      "powerId": "restore-youth",
      "displayLabel": "让米太亚得重返壮年",
      "label": "你把手按在米太亚得肩上，让六十四岁的他瞬间回到二十四岁，肌肉、视力和反应俱佳。",
      "intent": "以最强将领指挥决战，扭转兵力劣势。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "按手在米太亚得肩上发动能力",
        "target": "米太亚得",
        "deadline": "波斯舰队将在一个时辰后重新调动骑兵"
      },
      "instantEcho": {
        "directResult": "米太亚得变得年轻强壮，亲自率队冲锋，士气大振。",
        "unexpectedCost": "雅典十将军中有人质疑你使用了巫术，战后可能审判你。",
        "beneficiary": "米太亚得本人及雅典全军",
        "payer": "你——被指控施行巫术"
      }
    }
  ],
  "alexander-gaugamela-331bc": [
    {
      "id": "C",
      "powerId": "heal-room",
      "displayLabel": "治愈右翼方阵伤兵",
      "label": "你发动能力，瞬间治愈右翼方阵ALL伤痛，使他们能重新举起盾牌抵挡波斯战车。",
      "intent": "消除方阵减员的弱点，确保他们能按计划拖延波斯军阵。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动治愈全场伤病能力，覆盖右翼方阵全体伤兵",
        "target": "右翼方阵伤兵们",
        "deadline": "波斯镰刀战车将在几分钟内逼近"
      },
      "instantEcho": {
        "directResult": "右翼方阵伤兵伤口愈合，重新列阵迎战。",
        "unexpectedCost": "你因体力透支而短暂眩晕，无法立即挥旗。",
        "beneficiary": "马其顿右翼方阵",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "conjure-water",
      "displayLabel": "在高加米拉生成巨量清水",
      "label": "你在大流士战车前进路线上凭空生成巨量清水，瞬间形成泥沼，陷住战车车轮。",
      "intent": "利用泥沼阻挡波斯战车的冲击势头，为冲锋创造空隙。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动凭空生成清水能力，在波斯战车前方持续涌出清水",
        "target": "高加米拉战场波斯战车前方区域",
        "deadline": "波斯镰刀战车将在几分钟内逼近"
      },
      "instantEcho": {
        "directResult": "波斯战车陷入泥沼，速度骤降。",
        "unexpectedCost": "泥沼也扩散至部分马其顿方阵前沿，需要他们稍作调整。",
        "beneficiary": "马其顿右翼和冲锋骑兵",
        "payer": "波斯战车手和马其顿方阵前沿"
      }
    },
    {
      "id": "C",
      "powerId": "read-one-mind",
      "displayLabel": "读取大流士此刻想法",
      "label": "你发动能力，读取大流士三世此刻的真实想法：他误以为右翼是主攻，正打算调动中军预备队向左。",
      "intent": "洞悉敌人意图，确保亚历山大冲锋时中军空虚。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动读取思想能力，锁定大流士三世",
        "target": "大流士三世",
        "deadline": "波斯镰刀战车将在几分钟内逼近"
      },
      "instantEcho": {
        "directResult": "你清晰听见大流士关于调动中军预备队的计划。",
        "unexpectedCost": "大流士隐约感到被窥视，但未确认来源，下令加快战车冲锋。",
        "beneficiary": "亚历山大和你的骑兵旗队",
        "payer": "大流士三世"
      }
    },
    {
      "id": "C",
      "powerId": "blink-self",
      "displayLabel": "瞬移至亚历山大身边传旗",
      "label": "你带着旗令瞬移至亚历山大前方，亲自将攻击旗帜交到他手中，缩短指挥距离。",
      "intent": "避免旗令在传令途中延误，确保抓住稍纵即逝的缺口。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动带物瞬移，携带旗令旗到亚历山大附近",
        "target": "亚历山大三世",
        "deadline": "波斯镰刀战车将在几分钟内逼近"
      },
      "instantEcho": {
        "directResult": "你瞬间出现在亚历山大马前，将旗令递交。",
        "unexpectedCost": "你的原位置陷入混乱，附近的骑兵需要重新确认指挥。",
        "beneficiary": "亚历山大",
        "payer": "你原位置的友军"
      }
    },
    {
      "id": "C",
      "powerId": "summon-future-self",
      "displayLabel": "召来十年后的你指挥冲锋",
      "label": "你召来十年后已身经百战的你自己，他立刻接过旗令，指挥近卫骑兵直冲大流士战车。",
      "intent": "利用未来经验弥补当前决策的不确定性，确保冲锋战术成功。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动召来未来自己的能力，召唤十年后的你",
        "target": "高加米拉战场，你当前所在位置",
        "deadline": "波斯镰刀战车将在几分钟内逼近"
      },
      "instantEcho": {
        "directResult": "未来的你现身，果断下令全旗突击。",
        "unexpectedCost": "未来的你消失后，你失去一小时内的记忆。",
        "beneficiary": "近卫骑兵和亚历山大",
        "payer": "你（失去记忆）"
      }
    },
    {
      "id": "C",
      "powerId": "invisibility",
      "displayLabel": "隐身侦查中军缺口",
      "label": "你隐身潜入波斯中军，精准标注缺口位置并返回，为亚历山大提供实时情报。",
      "intent": "在不惊动敌人的情况下获取缺口准确信息，避免盲目冲入陷阱。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动隐身能力，潜入波斯中军阵线",
        "target": "波斯中军阵线",
        "deadline": "波斯镰刀战车将在几分钟内逼近"
      },
      "instantEcho": {
        "directResult": "你成功标记缺口位置并安全返回，向亚历山大比划手势。",
        "unexpectedCost": "你隐身期间，原旗令位置无人接替，左翼传令延迟。",
        "beneficiary": "亚历山大和骑兵冲锋部队",
        "payer": "左翼接令部队"
      }
    }
  ],
  "caesar-rubicon-49bc": [
    {
      "id": "C",
      "powerId": "command-animals",
      "displayLabel": "号令庞培战马四散",
      "label": "我在卢比孔河畔命令方圆十公里内所有动物：庞培军团的战马必须当即挣脱缰绳、向南狂奔，不载任何骑手。庞培的骑兵在没有马的情况下只能步行，无法在明晨前完成拦截。",
      "intent": "消除庞培骑兵的机动威胁，为凯撒争取渡河后的安全空间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "面朝南向庞培军营方向发出命令",
        "target": "庞培军团的战马",
        "deadline": "元老院使者将在黎明前抵达"
      },
      "instantEcho": {
        "directResult": "庞培营地内数千匹战马挣脱缰绳，嘶鸣着向南狂奔，骑兵一片混乱。",
        "unexpectedCost": "凯撒本军的几匹运输马也被波及，冲向河岸，导致部分辎重掉落卢比孔河中。",
        "beneficiary": "凯撒第十三军团",
        "payer": "凯撒军团辎重队"
      }
    },
    {
      "id": "C",
      "powerId": "rust-weapons",
      "displayLabel": "锈毁元老院使团佩剑",
      "label": "我发动能力使方圆一公里内所有金属武器瞬间锈毁——包括元老院使者以及其护卫的剑、盾牌边刃和铠甲金属铆钉。他们抵达营地后，只能空手宣读解散令，毫无武力威慑。",
      "intent": "削弱元老院使者的武力威压，使凯撒有更多底气无视其命令。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "举起军旗指向元老院使者前来的方向",
        "target": "元老院使者及其护卫的所有金属武器",
        "deadline": "元老院使者将在黎明前抵达"
      },
      "instantEcho": {
        "directResult": "使者及护卫的剑、盾、铠甲铆钉全部锈成碎渣，掉落一地。",
        "unexpectedCost": "营地内凯撒军团的部分备用武器也因范围覆盖而锈毁，攻击力暂时下降。",
        "beneficiary": "凯撒（减少心理压力）",
        "payer": "第十三军团军械库"
      }
    },
    {
      "id": "C",
      "powerId": "guarantee-action",
      "displayLabel": "保证鹰旗渡河成功",
      "label": "我指定下一项行动：扛起第十三军团鹰旗，独自从桥头走到对岸卢比孔河北岸。能力保证此举必定成功，且无人能阻止。元老院使者即使提前赶到，也无法阻拦我踏足北岸。",
      "intent": "以不可阻拦的个人行动为全军团树立渡河先例，打破元老院禁令的束缚。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "双手举起军团鹰旗，迈步走向桥梁",
        "target": "卢比孔河上的军用桥",
        "deadline": "元老院使者将在黎明前抵达"
      },
      "instantEcho": {
        "directResult": "你扛着鹰旗安然走过桥梁，无人能阻，军团士兵见状纷纷跟随。",
        "unexpectedCost": "因能力只能指向行动成功，后续凯撒的指挥系统出现短暂失效。",
        "beneficiary": "凯撒（获得启程信号）",
        "payer": "军团传令官（混乱中找不到指挥序列）"
      }
    },
    {
      "id": "C",
      "powerId": "walk-through-walls",
      "displayLabel": "带凯撒穿墙突围",
      "label": "我触碰凯撒的手，给他一小时内穿过所有墙壁、城门和密封舱壁的能力。我们直接穿过营地木栅、穿过庞培的边境哨所墙体，绕过所有盘查，直达罗马城外的台伯河岸。",
      "intent": "绕过元老院使者和边境守卫，让凯撒以无人能料的方式直接逼近罗马，争取时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "握住凯撒的手腕",
        "target": "凯撒",
        "deadline": "元老院使者将在黎明前抵达"
      },
      "instantEcho": {
        "directResult": "你与凯撒穿墙而过，从营帐直穿到哨所外墙之外，身后无人察觉。",
        "unexpectedCost": "凯撒因穿墙过程违背物理认知，出现短暂晕眩，失去两小时意识。",
        "beneficiary": "凯撒（避开正面冲突）",
        "payer": "凯撒本人（精神冲击）"
      }
    },
    {
      "id": "C",
      "powerId": "immortal-day",
      "displayLabel": "赐凯撒一日不死身",
      "label": "我指定凯撒为对象，给予他二十四小时内无法死亡或失去意识的能力。即便庞培的刺客在渡河后动手，或元老院派兵当场处决，他都无法被杀死或昏迷。",
      "intent": "确保凯撒在渡河后与庞培的第一场接触中不受暗杀或战伤影响，稳住军心。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将手掌按在凯撒的护心镜上",
        "target": "凯撒",
        "deadline": "元老院使者将在黎明前抵达"
      },
      "instantEcho": {
        "directResult": "凯撒身周显现一层淡金色光晕（肉眼可见），随后消失，他本人并无异感。",
        "unexpectedCost": "能力消耗你全部体力，你随即晕倒，无法参与后续行军。",
        "beneficiary": "凯撒",
        "payer": "你（昏迷一天）"
      }
    },
    {
      "id": "C",
      "powerId": "transmute-material",
      "displayLabel": "把卢比孔河水变成坚冰",
      "label": "我指着桥下的卢比孔河，将河水永久变成坚冰。不仅桥梁可用，整个河面都变成冰原，军团步兵、骑兵和辎重可以瞬间从任意位置通过，而不必走桥或被哨兵拦截。",
      "intent": "将河流从天然屏障变为通途，为全军提供多条渡河路线，避免桥头拥堵被元老院军队打击。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "俯身触碰卢比孔河水面并说出‘冰’",
        "target": "卢比孔河水",
        "deadline": "元老院使者将在黎明前抵达"
      },
      "instantEcho": {
        "directResult": "整条卢比孔河肉眼可见地凝结成厚度超过半米的冰层，表面平整。",
        "unexpectedCost": "冰层导致下游若干村庄的冬季水源断绝，引发平民抗议。",
        "beneficiary": "第十三军团整个部队",
        "payer": "卢比孔河下游农户"
      }
    }
  ],
  "edict-milan-313": [
    {
      "id": "C",
      "powerId": "summon-lightning",
      "displayLabel": "雷电击碎米兰敕令",
      "label": "你在午时前召下一道雷电，精确击中君士坦丁面前的敕令羊皮卷，将其化为灰烬，阻止盖印。",
      "intent": "直接毁掉敕令本身，使君士坦丁无法按时盖章。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤雷电击碎君士坦丁面前的敕令羊皮卷",
        "target": "君士坦丁面前的米兰敕令羊皮卷",
        "deadline": "午时"
      },
      "instantEcho": {
        "directResult": "敕令化为灰烬，君士坦丁目瞪口呆。",
        "unexpectedCost": "李锡尼怀疑你与反对势力合谋。",
        "beneficiary": "基督徒继续受迫害的现状",
        "payer": "君士坦丁的权威"
      }
    },
    {
      "id": "C",
      "powerId": "share-memory",
      "displayLabel": "共享米尔维安大桥记忆",
      "label": "你让君士坦丁、李锡尼及在场官员共同经历你亲眼所见的米尔维安大桥战役实况，展示君士坦丁的胜利并非神助。",
      "intent": "用真实记忆动摇君士坦丁的宗教宣称，使敕令失去道德基础。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "启动记忆共享，让所有人经历你在大桥战役的亲历记忆",
        "target": "君士坦丁、李锡尼及在场官员",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "大家看到了战役中实际是君士坦丁的骑兵战术获胜，并非神迹。",
        "unexpectedCost": "君士坦丁对你产生敌意，命人记录你的记忆。",
        "beneficiary": "李锡尼对敕令的怀疑者",
        "payer": "你自身的安全"
      }
    },
    {
      "id": "C",
      "powerId": "door-anywhere",
      "displayLabel": "开门通往被占教堂",
      "label": "你在书房墙壁上打开一扇门，直接通往罗马城被占用的基督教堂，展示教产未被归还的现状。",
      "intent": "用物理证据证明敕令中归还教产的内容不实，揭穿谎言。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在墙上开一扇通往被占教堂的门",
        "target": "书房墙壁，通往罗马某被占教堂",
        "deadline": "午时"
      },
      "instantEcho": {
        "directResult": "门后显现教堂内异教徒正在聚会。",
        "unexpectedCost": "门打开后引来卫兵，你被怀疑使用巫术。",
        "beneficiary": "希望阻止敕令的元老院保守派",
        "payer": "你的自由"
      }
    },
    {
      "id": "C",
      "powerId": "age-target",
      "displayLabel": "让李锡尼老去四十岁",
      "label": "你让李锡尼瞬间苍老四十年，使其虚弱不堪，无法在午时前与君士坦丁共同签署敕令。",
      "intent": "消除联署人，使敕令因缺少李锡尼签名而失效。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定李锡尼，让他身体老去四十年",
        "target": "李锡尼",
        "deadline": "午时"
      },
      "instantEcho": {
        "directResult": "李锡尼变得白发苍苍，无法握笔。",
        "unexpectedCost": "君士坦丁意识到有人作祟，加强戒备。",
        "beneficiary": "反对敕令的异教祭司",
        "payer": "李锡尼的健康"
      }
    },
    {
      "id": "C",
      "powerId": "universal-language",
      "displayLabel": "听懂拉丁语敕令条款",
      "label": "你突然能够听懂并流利说出拉丁语，当众朗读敕令中的细节，指出其中关于教产归还的条款含糊其辞。",
      "intent": "用语言能力揭示敕令的不公之处，动摇在场者的支持。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用流利拉丁语朗读并分析敕令条款",
        "target": "敕令文本",
        "deadline": "午时前"
      },
      "instantEcho": {
        "directResult": "在场官员听到敕令中教产归还条款模糊，议论纷纷。",
        "unexpectedCost": "君士坦丁认为你窃取机密，下令搜查你。",
        "beneficiary": "受迫害的基督徒代表",
        "payer": "你的信誉"
      }
    },
    {
      "id": "C",
      "powerId": "intangible-walls",
      "displayLabel": "让书房墙壁形同虚设",
      "label": "你使米兰皇宫御前书房的墙壁变得可穿过，让外面聚集的基督徒民众涌入，当面要求归还教产。",
      "intent": "引入公众压力，迫使君士坦丁不敢在群情激愤下签署不公敕令。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让书房的墙壁变得可穿过",
        "target": "米兰皇宫御前书房的墙壁",
        "deadline": "午时"
      },
      "instantEcho": {
        "directResult": "民众涌入，高呼归还教产，君士坦丁被迫暂停签署。",
        "unexpectedCost": "混乱中有人试图刺杀君士坦丁，你受牵连。",
        "beneficiary": "基督徒民众",
        "payer": "宫廷秩序"
      }
    }
  ],
  "charlemagne-800": [
    {
      "id": "C",
      "powerId": "enlarge-object",
      "displayLabel": "放大皇冠罩住查理曼",
      "label": "你瞬间将祭坛上的皇冠放大一百倍，铁箍和宝石等比例膨胀，在查理曼跪下的刹那从高空罩落，将他整个头颅和肩膀锁入巨大的金冠中，迫使教皇无法举冠加冕。",
      "intent": "直接物理阻隔加冕动作，让查理曼无法接受教皇的加冕手势。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "双手伸向祭坛上的皇冠，凝聚意念使其瞬间膨胀百倍",
        "target": "查理曼",
        "deadline": "查理曼将在一刻钟后跪到祭坛前"
      },
      "instantEcho": {
        "directResult": "皇冠膨胀为直径六米的铁环，将查理曼整个人罩在祭坛前，他动弹不得。",
        "unexpectedCost": "巨大的金冠砸穿了圣彼得大教堂的层叠拱顶，碎落的石块将旁边的利奥三世砸伤左臂。",
        "beneficiary": "你想维护的教皇独立加冕传统",
        "payer": "查理曼本人被压制在地砖上"
      }
    },
    {
      "id": "C",
      "powerId": "sentence-becomes-true",
      "displayLabel": "写下：查理曼拒绝加冕",
      "label": "你趁弥撒间隙，用羽毛笔在羊皮纸上写下‘查理曼拒绝加冕’七个字，纸张立即燃烧化作灰烬，新现实随之诞生——查理曼在祭坛前突然站起身来，对利奥三世摇头拒绝加冕。",
      "intent": "直接抹消查理曼愿意加冕的事实，让加冕对话无果而终。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在弥撒经本边缘写下七个字",
        "target": "查理曼的加冕意愿",
        "deadline": "查理曼将在一刻钟后跪到祭坛前"
      },
      "instantEcho": {
        "directResult": "查理曼当众宣布‘我不配戴这顶皇冠’，转身离开祭坛。",
        "unexpectedCost": "利奥三世因骤失法兰克支持，被在场反对派贵族当场软禁。",
        "beneficiary": "拜占庭帝国在罗马的帝号权威",
        "payer": "教皇利奥三世失去军事保护"
      }
    },
    {
      "id": "C",
      "powerId": "jump-tomorrow",
      "displayLabel": "让查理曼跳到明天",
      "label": "你指向查理曼，发动跳跃——他瞬间从跪姿中消失，整个人连同盔甲和佩剑被抛入十二月二十六日的阳光里，祭坛前只剩空洞的蒲团和目瞪口呆的众人。",
      "intent": "将查理曼直接挪出加冕时刻，令今天不可能有加冕行为。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "伸出手指向查理曼并默念跳跃指令",
        "target": "查理曼",
        "deadline": "查理曼将在一刻钟后跪到祭坛前"
      },
      "instantEcho": {
        "directResult": "查理曼凭空消失，加冕仪式中断。",
        "unexpectedCost": "他跳跃时撕破了身旁侍从的礼服，并把祭坛上的圣杯带到了明天。",
        "beneficiary": "拜占庭使节得以在罗马宣扬帝号唯一性",
        "payer": "教皇利奥三世必须解释皇帝去向"
      }
    },
    {
      "id": "C",
      "powerId": "copy-skill",
      "displayLabel": "复制利奥三世的辩论术",
      "label": "你凝视教皇利奥三世，瞬间复制了他贿赂权贵、左右逢源的雄辩才能，随后在众人面前开口：‘各位，上帝今日显灵，皇冠应暂存祭坛，待天使降谕再议。’——你的话术完美复刻了教皇本人的辩才。",
      "intent": "用教皇自己的说服力来反对加冕，使反对意见具有与教皇同等的权威。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "双眼注视利奥三世三秒，默念复制技能",
        "target": "利奥三世的演说才能",
        "deadline": "查理曼将在一刻钟后跪到祭坛前"
      },
      "instantEcho": {
        "directResult": "你的发言让半数法兰克贵族犹豫，加冕推迟。",
        "unexpectedCost": "利奥三世察觉后勃然大怒，命令卫兵将你拖出教堂。",
        "beneficiary": "反加冕的罗马元老派",
        "payer": "你本人被教皇卫队逮捕"
      }
    },
    {
      "id": "C",
      "powerId": "control-weather",
      "displayLabel": "冬至寒雾笼罩罗马",
      "label": "你抬头望天，意念搅动云层——圣诞日的晴空瞬间被铅色浓雾吞噬，狂风暴雪击穿圣彼得大教堂的破窗，烛火全灭，温度骤降至零下十度，弥撒被迫中止，加冕礼无法进行。",
      "intent": "用恶劣物理环境直接中断户外与半开放的典礼流程。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "向穹顶张开双臂，命令天气改变",
        "target": "罗马方圆百里的天气",
        "deadline": "查理曼将在一刻钟后跪到祭坛前"
      },
      "instantEcho": {
        "directResult": "暴风雪瞬间将圣彼得大教堂变成冰窖，所有人躲避风雪，加冕停顿。",
        "unexpectedCost": "教堂外贫民区三十人冻死，城中秩序混乱。",
        "beneficiary": "想要拖延时间的拜占庭密使",
        "payer": "罗马平民"
      }
    },
    {
      "id": "C",
      "powerId": "see-hidden-writing",
      "displayLabel": "看见加冕协议上的暗语",
      "label": "你激活能力，眼睛透过羊皮纸和墨迹，看到利奥三世与查理曼预先签署的加冕协议边缘，藏着一行用柠檬汁写的密文：‘若今日不成，明日处死执事。’——你当即大声读出这行字，全场哗然。",
      "intent": "揭露加冕背后的阴谋，使双方互信崩塌，仪式无法继续。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "眯起眼睛透视祭坛上摊开的协议卷轴",
        "target": "利奥三世与查理曼的密约文本",
        "deadline": "查理曼将在一刻钟后跪到祭坛前"
      },
      "instantEcho": {
        "directResult": "密文内容被公开，查理曼暴怒，质疑教皇诚意，加冕中断。",
        "unexpectedCost": "利奥三世指使你为伪造者，命令当场将你刺瞎。",
        "beneficiary": "在场的法兰克将领看清教皇真面目",
        "payer": "你失去双眼"
      }
    }
  ],
  "magna-carta-1215": [
    {
      "id": "C",
      "powerId": "locate-anything",
      "displayLabel": "定位反叛男爵军械库",
      "label": "你在日落前定位反叛男爵藏匿在伦敦城的军械库精确位置，迫使男爵们因武器暴露而让步。",
      "intent": "用情报优势打破男爵的军事实力威慑。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定目标并询问其位置",
        "target": "反叛男爵的军械库",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "你立即说出军械库在伦敦圣保罗大教堂地下密室。",
        "unexpectedCost": "男爵们得知后连夜转移武器，但谈判立场松动。",
        "beneficiary": "英王约翰",
        "payer": "你作为保管官承受了男爵的憎恨"
      }
    },
    {
      "id": "C",
      "powerId": "stretch-road",
      "displayLabel": "拉伸兰尼米德至伦敦道路",
      "label": "你在男爵们返回伦敦的必经之路上拉伸一百米为一百公里，阻止他们日落前返回集结。",
      "intent": "用空间隔离切断男爵的后援与退路。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向兰尼米德通往伦敦的道路并拉伸",
        "target": "兰尼米德至伦敦的道路",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "道路突然变为遥不可及的长路，马匹奔跑半天仍不见尽头。",
        "unexpectedCost": "信使也无法通行，你与伦敦彻底失联。",
        "beneficiary": "英王约翰",
        "payer": "你被男爵们怀疑使用妖术"
      }
    },
    {
      "id": "C",
      "powerId": "heal-room",
      "displayLabel": "治愈王帐内所有伤病",
      "label": "你让王帐内包括约翰国王痛风发作、男爵伤口感染在内的所有伤病立即痊愈，消除谈判中的生理痛苦干扰。",
      "intent": "用健康状态消除弱势方的生理劣势。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "举起双臂对帐篷内所有人施展治愈",
        "target": "王帐内的所有人（英王约翰及男爵们）",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "约翰国王的脚趾红肿消退，男爵们的伤口瞬间愈合。",
        "unexpectedCost": "你因过度消耗而晕厥，谈判缺席。",
        "beneficiary": "英王约翰与所有伤病者",
        "payer": "你本人"
      }
    },
    {
      "id": "C",
      "powerId": "conjure-water",
      "displayLabel": "在泰晤士河源头造淡水",
      "label": "你在泰晤士河上游持续生成清水，确保兰尼米德营地供水充足，避免男爵以断水为由撤退。",
      "intent": "用资源保障稳定谈判环境。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向泰晤士河源头并召唤清水",
        "target": "泰晤士河源头",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "河水流量增加，营地水桶很快满溢。",
        "unexpectedCost": "下游伦敦部分区域水位上涨，引起短暂恐慌。",
        "beneficiary": "全体谈判人员",
        "payer": "伦敦市民（轻微水患）"
      }
    },
    {
      "id": "C",
      "powerId": "read-one-mind",
      "displayLabel": "读取反叛领袖思想",
      "label": "你指定反叛男爵领袖罗伯特·菲茨沃尔特，读取他此刻全部真实想法与回忆，洞悉其底线。",
      "intent": "用读心术获取对方的谈判底牌。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "凝视罗伯特·菲茨沃尔特并施展读心",
        "target": "反叛男爵领袖罗伯特·菲茨沃尔特",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "你听到他心中最在意的是收回约翰王强征的税收，而非废除王权。",
        "unexpectedCost": "你因窥视秘密眼神异常，被男爵们察觉而不信任。",
        "beneficiary": "英王约翰",
        "payer": "你本人（信誉受损）"
      }
    },
    {
      "id": "C",
      "powerId": "blink-self",
      "displayLabel": "瞬移王玺至谈判桌",
      "label": "你带着王玺瞬移到谈判桌中央，让男爵们立即看到封印就位，加速签署进程。",
      "intent": "用物理突现消除签署的障碍与延迟。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "手捧王玺，从王帐角落瞬移到谈判桌中央",
        "target": "王玺",
        "deadline": "日落前"
      },
      "instantEcho": {
        "directResult": "你与王玺突然出现在桌面上，男爵们愕然，随后迅速完成封印。",
        "unexpectedCost": "你因瞬移冲击而短暂失明，但几分钟后恢复。",
        "beneficiary": "双方谈判代表",
        "payer": "你本人"
      }
    }
  ],
  "black-death-1347": [
    {
      "id": "C",
      "powerId": "swap-two-people",
      "displayLabel": "交换船长与染病水手",
      "label": "你立即将站在跳板前的商船船长与船上已死亡的一名水手互换位置与随身物品，让船长突然出现在死者位置，而死者出现在跳板前被众人看见。",
      "intent": "以直观的死亡案例吓阻所有人靠近船只，从而争取封闭栈桥的时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将船长和一名已经死亡的染病水手瞬间交换位置与随身物品",
        "target": "墨西拿港主码头跳板前，商船船长和一名船上已死亡的染病水手",
        "deadline": "第一批船员已在跳板前等待下船"
      },
      "instantEcho": {
        "directResult": "商船船长突然消失，出现在船上死者队列中；一名死人出现在跳板前，众人惊恐后退。",
        "unexpectedCost": "商船船长被误认为瘟疫死者，他的家人和船员永远不会相信你。",
        "beneficiary": "墨西拿市民，尤其是码头工人和卸货商",
        "payer": "商船船长及其家属"
      }
    },
    {
      "id": "C",
      "powerId": "repeat-minute",
      "displayLabel": "反复部署隔离命令",
      "label": "你将当前一分钟反复发生一百次，每次利用倒计时向不同官员下达具体命令：第一次命令宪兵封锁栈桥，第二次命令医生设置隔离区，第三次命令商人不得卸货，直到你满意为止。",
      "intent": "通过无限尝试，让所有关键人物在同一分钟完成不可能的多线部署。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将当前一分钟反复重播，每次向不同的官员下达隔离命令",
        "target": "墨西拿港主码头现场的宪兵队长、首席医生和粮食商会代表",
        "deadline": "第一批船员已在跳板前等待下船"
      },
      "instantEcho": {
        "directResult": "在你主动接受的最后一次结果中，栈桥已被封锁，隔离区建立，商人同意暂不卸货。",
        "unexpectedCost": "反复尝试导致你精神极度疲劳，随后三天无法做出任何决定。",
        "beneficiary": "墨西拿城卫生管理当局",
        "payer": "你个人的决策能力"
      }
    },
    {
      "id": "C",
      "powerId": "command-animals",
      "displayLabel": "驱使老鼠封住船舱",
      "label": "你向方圆十公里内所有老鼠下达命令：立即从墨西拿港下水，爬上黑海商船，用身体塞满所有货舱间的缝隙与舱口，阻止任何人卸货或下船。",
      "intent": "利用老鼠作为天然路障，物理阻断商船与岸边的接触，避免瘟疫上岸。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "向方圆十公里内所有老鼠下达命令，让它们爬上商船封住所有货舱缝隙",
        "target": "墨西拿港内及城区的所有老鼠，以及停泊在码头的黑海商船",
        "deadline": "第一批船员已在跳板前等待下船"
      },
      "instantEcho": {
        "directResult": "成千上万只老鼠从下水道和海岸涌出，迅速爬上商船，用身体堵住所有舱门和缝隙，船员无法进入货舱。",
        "unexpectedCost": "老鼠聚集可能引入其他鼠传疾病，且船上的粮食被老鼠大量啃食。",
        "beneficiary": "港口的检疫官和宪兵",
        "payer": "船上的货物所有者（粮食商人）"
      }
    },
    {
      "id": "C",
      "powerId": "rust-weapons",
      "displayLabel": "锈蚀商船刀剑与铁链",
      "label": "你锈蚀方圆一公里内所有金属武器，包括商船上水手的弯刀、货舱铁链、栈桥的铁锚和锁具，以及宪兵队的长剑，瞬间化为锈粉。",
      "intent": "消除武力冲突的可能，迫使各方只能通过谈判接受隔离。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "瞬间锈蚀方圆一公里内所有金属武器和锁具",
        "target": "黑海商船上的弯刀、货舱铁链、码头铁锚以及墨西拿宪兵队的长剑",
        "deadline": "第一批船员已在跳板前等待下船"
      },
      "instantEcho": {
        "directResult": "所有武器和金属锁具化为锈粉，商船无法下锚锁链，宪兵失去压制能力。",
        "unexpectedCost": "码头基础设施如铁制起重机零件也被锈毁，港口贸易整体瘫痪数月。",
        "beneficiary": "主张温和隔离的市政官员",
        "payer": "港口商业公司及码头工人"
      }
    },
    {
      "id": "C",
      "powerId": "guarantee-action",
      "displayLabel": "命令商船驶回黑海",
      "label": "你转身面向商船，用不可违背的声音命令商船全员升帆掉头，驶出墨西拿海峡返回黑海起点——这项行动必定成功，且没人能阻止船只离开。",
      "intent": "彻底剔除瘟疫源头，将染病船只驱离港口，杜绝接触。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "命令商船立即升帆掉头驶回黑海",
        "target": "墨西拿港主码头的黑海商船及其所有船员",
        "deadline": "第一批船员已在跳板前等待下船"
      },
      "instantEcho": {
        "directResult": "商船全员立即服从命令，升帆起锚，掉头驶向海峡出口，无人能阻挡。",
        "unexpectedCost": "船上若无船员染疫则永久失踪；若有幸存者，他们永远不会原谅你。",
        "beneficiary": "墨西拿全城居民",
        "payer": "被驱逐出港的商船船员和他们的家属"
      }
    },
    {
      "id": "C",
      "powerId": "walk-through-walls",
      "displayLabel": "带关键人物穿舱检查",
      "label": "你触碰墨西拿港首席医生与粮食商会代表，带领他们直接穿过商船密封舱壁进入货舱，亲眼查看死者遗体与货物状况，再穿墙返回岸上汇报。",
      "intent": "在不打开舱门的情况下完成权威检查，证明船上已有人死亡并存在瘟疫，从而支持隔离。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "带领首席医生和粮食商会代表穿过商船舱壁进入货舱",
        "target": "墨西拿港首席医生、粮食商会代表以及黑海商船的密封货舱",
        "deadline": "第一批船员已在跳板前等待下船"
      },
      "instantEcho": {
        "directResult": "三人直接穿越舱壁，看到了船上多具尸体和染疫病人，返回后向市政会报告，封锁令得以通过。",
        "unexpectedCost": "医生和商会代表在穿行后出现轻微精神异常，数周内无法工作。",
        "beneficiary": "墨西拿市政决策层",
        "payer": "首席医生与粮食商会代表的短期健康"
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
  ],
  "circumnavigation-1522": [
    {
      "id": "C",
      "powerId": "revive-dead",
      "displayLabel": "复活麦哲伦指挥抛货",
      "label": "你在麦哲伦尸体旁发动能力，使其复活一小时，命令他亲自判别哪些香料箱必须抛弃以减轻吃水，抢在退潮前进港。",
      "intent": "用已故指挥官的经验确保抛货决策精准，避免因领航员犹豫而错过潮汐。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定麦哲伦的尸体并发动复活能力",
        "target": "麦哲伦",
        "deadline": "一个时辰内"
      },
      "instantEcho": {
        "directResult": "麦哲伦清醒过来，立即命令丢弃三等舱的肉桂和丁香，船体迅速上浮。",
        "unexpectedCost": "一小时后麦哲伦再次死亡，船员目睹二次离世，士气受挫。",
        "beneficiary": "维多利亚号全体十八名船员",
        "payer": "麦哲伦"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-grain",
      "displayLabel": "让货舱涌出木薯粉",
      "label": "你指定一个空香料桶发动无限粮食能力，让桶内不断涌出新鲜木薯粉，供船员饱食并腾出空间。",
      "intent": "用无限粮食替代部分香料货舱，降低吃水同时解决饥饿问题。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定一个空香料桶发动无限粮食能力",
        "target": "空香料桶",
        "deadline": "一个时辰内"
      },
      "instantEcho": {
        "directResult": "木薯粉不断涌出，船员搬出十袋香料腾出空间，吃水减少。",
        "unexpectedCost": "桶内木薯粉持续涌出导致甲板堆积，需要额外人力清理。",
        "beneficiary": "维多利亚号全体船员",
        "payer": "你（监督清理额外工作）"
      }
    },
    {
      "id": "C",
      "powerId": "enlarge-object",
      "displayLabel": "放大船锚腾出航道",
      "label": "你发动放大能力，将维多利亚号的船锚放大一百倍，使其插入淤泥深部并抬高船头，减轻吃水。",
      "intent": "通过放大船锚改变船体姿态，临时增加浮力以通过浅水区。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定船锚并发动放大能力",
        "target": "维多利亚号的船锚",
        "deadline": "一个时辰内"
      },
      "instantEcho": {
        "directResult": "船锚瞬间变大，船头被抬高半米，吃水深度显著降低。",
        "unexpectedCost": "巨锚难以收回，最终只能砍断锚链丢弃。",
        "beneficiary": "维多利亚号",
        "payer": "你（失去船锚）"
      }
    },
    {
      "id": "C",
      "powerId": "sentence-becomes-true",
      "displayLabel": "写下航道积水变深",
      "label": "你写下‘桑卢卡尔港浅水航道此时水深暴涨三米’并发动能力，使航道瞬时变深。",
      "intent": "永久改变航道深度，直接消除吃水限制，无需抛货。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "写下一句不超过二十字的陈述并发动能力",
        "target": "桑卢卡尔港浅水航道",
        "deadline": "一个时辰内"
      },
      "instantEcho": {
        "directResult": "航道水深暴涨三米，维多利亚号顺利进港。",
        "unexpectedCost": "潮汐规律永久改变，后续船只需重新测深。",
        "beneficiary": "维多利亚号及未来所有入港船只",
        "payer": "当地领航员（需更新海图）"
      }
    },
    {
      "id": "C",
      "powerId": "jump-tomorrow",
      "displayLabel": "让维多利亚号跳到明天",
      "label": "你发动跳跃能力，让维多利亚号直接跳过接下来二十四小时，避开退潮浅滩，出现在明天涨潮时的港内。",
      "intent": "瞬间穿越到未来涨潮时刻，彻底规避当前吃水与潮汐矛盾。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定维多利亚号并发动跳跃能力",
        "target": "维多利亚号",
        "deadline": "瞬间发动"
      },
      "instantEcho": {
        "directResult": "维多利亚号突然出现在港内平静水面，船员惊愕但安全。",
        "unexpectedCost": "船上一日时光凭空消失，日志出现二十四小时空白。",
        "beneficiary": "维多利亚号全体船员",
        "payer": "你（需解释日志缺失）"
      }
    },
    {
      "id": "C",
      "powerId": "copy-skill",
      "displayLabel": "复制水手长操船绝技",
      "label": "你指定经验丰富的水手长埃尔·卡诺，复制其操船绝技，瞬间达到同等水平，亲自操控维多利亚号在浅水中以最佳航线进港。",
      "intent": "直接获得最高水平操船技能，自力解决进港难题。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定水手长埃尔·卡诺并发动复制能力",
        "target": "水手长埃尔·卡诺",
        "deadline": "一个时辰内"
      },
      "instantEcho": {
        "directResult": "你获得埃尔·卡诺的全部操船知识，完美指挥船只避开浅滩进港。",
        "unexpectedCost": "埃尔·卡诺暂时失去技能，无法协助，且一天后技能返还时你失去能力。",
        "beneficiary": "你（领航员）",
        "payer": "水手长埃尔·卡诺（短暂遗忘）"
      }
    }
  ],
  "watt-patent-1769": [
    {
      "id": "C",
      "powerId": "summon-giant-beast",
      "displayLabel": "召巨兽踏平伦敦",
      "label": "你在午前召来百米巨兽，命令它将伦敦专利局与所有存档踏为齑粉，确保瓦特无法登记专利。",
      "intent": "直接物理毁灭专利文件，让瓦特专利无法注册。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在专利局门口召出百米巨兽，命令它踏平整栋建筑",
        "target": "伦敦专利局及内部存档",
        "deadline": "专利委员会午后封存前"
      },
      "instantEcho": {
        "directResult": "砖石崩塌，所有图纸掩埋，委员逃散。",
        "unexpectedCost": "巨兽踩塌相邻街道的居民区，引发平民伤亡。",
        "beneficiary": "纽科门蒸汽机持有者",
        "payer": "东区贫民窟住户"
      }
    },
    {
      "id": "C",
      "powerId": "move-mountain",
      "displayLabel": "移山阻断泰晤士河",
      "label": "你在午前将专利局旁一座山移至泰晤士河下游，河道截断造成航运瘫痪，委员会必须优先救灾无法封存专利。",
      "intent": "制造不可抗力的灾难，迫使委员会延期封存。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将视野内的伦敦城北山丘整体移到泰晤士河下游河道",
        "target": "泰晤士河",
        "deadline": "专利委员会午后封存前"
      },
      "instantEcho": {
        "directResult": "河水倒灌，商船搁浅，全城救灾。",
        "unexpectedCost": "山体砸毁下游数座码头，引发潮水漫入沼泽。",
        "beneficiary": "所有依赖内河运输的商行",
        "payer": "泰晤士河沿岸船主"
      }
    },
    {
      "id": "C",
      "powerId": "locate-anything",
      "displayLabel": "定位瓦特独处所在",
      "label": "你在午前精确找到詹姆斯·瓦特此刻所在房间，以便绑架他阻止其提交图纸。",
      "intent": "获知瓦特位置便于物理控制。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动能力定位詹姆斯·瓦特",
        "target": "詹姆斯·瓦特",
        "deadline": "专利委员会午后封存前"
      },
      "instantEcho": {
        "directResult": "脑中浮现瓦特此刻正在伦敦一间咖啡馆与律师会面。",
        "unexpectedCost": "定位消耗了你全部专注力，你眩晕倒地片刻。",
        "beneficiary": "你本人",
        "payer": "你本人（短暂失能）"
      }
    },
    {
      "id": "C",
      "powerId": "stretch-road",
      "displayLabel": "拉长专利局前路",
      "label": "你在午前将专利局门口百米道路拉成一百公里，延迟瓦特送达图纸的时间，错过封存期限。",
      "intent": "物理延迟瓦特进局登记。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将专利局门前街道拉伸至一百公里",
        "target": "专利局门前道路",
        "deadline": "专利委员会午后封存前"
      },
      "instantEcho": {
        "directResult": "道路延伸入云，瓦特步行无法抵达。",
        "unexpectedCost": "拉伸撕裂了地下管道，周边建筑地基不稳。",
        "beneficiary": "你本人",
        "payer": "专利局周边商户"
      }
    },
    {
      "id": "C",
      "powerId": "heal-room",
      "displayLabel": "治愈委员集体疫病",
      "label": "你在午前让专利委员会全体成员因伤寒卧床后，发动能力瞬间治愈他们，使他们因体力恢复而早早结束审查午前便封存档案，瓦特专利因文件不全被拒。",
      "intent": "让委员会提前停止审查，拒绝瓦特的待补件。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在委员会会议室施展治愈能力",
        "target": "专利委员会全体成员",
        "deadline": "专利委员会午后封存前"
      },
      "instantEcho": {
        "directResult": "委员们痊愈并立即宣布午后封存提前到午前，瓦特图纸未递齐被拒。",
        "unexpectedCost": "你过度消耗体力昏迷三天。",
        "beneficiary": "纽科门蒸汽机利益方",
        "payer": "你本人（昏迷）"
      }
    },
    {
      "id": "C",
      "powerId": "conjure-water",
      "displayLabel": "水淹专利局档案室",
      "label": "你在午前于专利局档案室凭空生成清水，淹没所有未归档图纸，使瓦特专利证书无法签发。",
      "intent": "物理毁坏专利图纸原件。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在专利局内部档案室持续生成清水直至淹没所有图纸",
        "target": "专利局档案室",
        "deadline": "专利委员会午后封存前"
      },
      "instantEcho": {
        "directResult": "水流冲毁所有待审图纸，瓦特的专利申请消失。",
        "unexpectedCost": "水流渗入地下室火药库引发爆炸，建筑部分坍塌。",
        "beneficiary": "你本人",
        "payer": "专利局值班员（受伤）"
      }
    }
  ],
  "declaration-1776": [
    {
      "id": "C",
      "powerId": "extinguish-fire",
      "displayLabel": "熄灭费城会议厅壁炉",
      "label": "你在代表们争论杰斐逊文本时，让宾夕法尼亚州议会厅内及周边十里内所有火焰瞬间熄灭且十二小时内无法复燃，迫使会议在寒冷中加速辩论。",
      "intent": "用寒冷迫使焦灼的修改争论缩短，直接促成下午表决。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动能力熄灭所有火源",
        "target": "宾夕法尼亚州议会厅及其方圆十里的火焰",
        "deadline": "午后代表们投票前"
      },
      "instantEcho": {
        "directResult": "壁炉、蜡烛、厨房灶火全部熄灭，室内温度骤降，代表们发抖裹紧外套。",
        "unexpectedCost": "墨水凝固导致誊写中断片刻，杰斐逊握笔的手指冻僵。",
        "beneficiary": "急于表决的激进派代表约翰·亚当斯",
        "payer": "负责誊清的秘书你"
      }
    },
    {
      "id": "C",
      "powerId": "erase-memory",
      "displayLabel": "删除杰斐逊关于黑人条款记忆",
      "label": "你对杰斐逊发动能力，永久删除他记忆中关于谴责奴隶制条款被删除一事，使他只管宣读剩余文本并敦促投票。",
      "intent": "消除杰斐逊对已删条款的执着，避免他强烈抗辩导致表决延迟。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "删除记忆",
        "target": "杰斐逊关于谴责奴隶制条款被删除的记忆",
        "deadline": "午后表决前"
      },
      "instantEcho": {
        "directResult": "杰斐逊眼神茫然一瞬，然后平静地继续讨论剩余文字。",
        "unexpectedCost": "你从此无法向杰斐逊提及那段条款，否则他会困惑。",
        "beneficiary": "赞成删除的南卡罗来纳代表爱德华·拉特利奇",
        "payer": "发明这一条款理念的杰斐逊"
      }
    },
    {
      "id": "C",
      "powerId": "swap-two-people",
      "displayLabel": "交换亚当斯与迪金森位置",
      "label": "你在约翰·迪金森正要宣布反对决议时，将他和约翰·亚当斯瞬间交换位置与随身物品，使反对者被孤立在座位另一侧。",
      "intent": "通过位置置换打乱反对派阵脚，让迪金森的发言权被意外打断。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "瞬间交换两人位置和随身物品",
        "target": "约翰·亚当斯和约翰·迪金森",
        "deadline": "午后逐州投票开始前"
      },
      "instantEcho": {
        "directResult": "迪金森突然站在亚当斯的位置，人群哗然；亚当斯发现自己手中有迪金森的反对演讲草稿。",
        "unexpectedCost": "迪金森跌倒撞翻墨水瓶，泼污了杰斐逊的草稿边缘。",
        "beneficiary": "支持独立的亚当斯",
        "payer": "反对独立的迪金森"
      }
    },
    {
      "id": "C",
      "powerId": "repeat-minute",
      "displayLabel": "重复杰斐逊宣读最后一分钟",
      "label": "你让杰斐逊宣读独立宣言最后一段那一分钟反复发生，每次他读到『我们相互保证』时都卡住，直到你满意结果。",
      "intent": "让你有最多一百次机会微调投票前的氛围，确保投票顺利。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "重复一分钟",
        "target": "杰斐逊宣读独立宣言最后一段的时刻",
        "deadline": "午后正式投票"
      },
      "instantEcho": {
        "directResult": "杰斐逊反复宣读『我们相互保证生命、财产和神圣荣誉』，代表们逐渐陷入疲劳和顺从。",
        "unexpectedCost": "每次循环你的手腕都因誊写而酸麻加重。",
        "beneficiary": "会议主席约翰·汉考克",
        "payer": "被卷入时间循环的杰斐逊"
      }
    },
    {
      "id": "C",
      "powerId": "command-animals",
      "displayLabel": "号令马群包围议会厅",
      "label": "你向费城方圆十里内所有马匹下令：立即聚集到宾夕法尼亚州议会厅门前，嘶鸣并跺踢直到代表们决定投票。",
      "intent": "用马群噪音和混乱逼迫代表们尽快结束争论进行表决。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "号令马匹",
        "target": "费城方圆十里内所有马匹",
        "deadline": "午后投票前"
      },
      "instantEcho": {
        "directResult": "数百匹马狂奔而来，议会厅外嘶鸣震天，门窗被马身撞击摇晃。",
        "unexpectedCost": "两匹马失控撞倒路灯，一匹踩碎了门口的招牌。",
        "beneficiary": "希望快速推进的激进派代表本杰明·富兰克林",
        "payer": "费城马匹的主人"
      }
    },
    {
      "id": "C",
      "powerId": "rust-weapons",
      "displayLabel": "锈毁议会厅内所有佩剑",
      "label": "你在代表们午后入座时，让方圆一公里内所有金属武器——包括迪金森等人的佩剑和大陆军军官佩剑——瞬间锈蚀成废铁。",
      "intent": "消除反对派代表可能携带武器的威慑力，防止表决时出现武装冲突。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "锈蚀武器",
        "target": "费城宾夕法尼亚州议会厅方圆一公里内所有金属武器",
        "deadline": "午后表决开始"
      },
      "instantEcho": {
        "directResult": "代表们腰间佩剑纷纷崩落成红褐色铁屑，发出刺耳声响。",
        "unexpectedCost": "议会厅门锁和窗栓也同步锈毁，门窗难以关闭。",
        "beneficiary": "没有佩剑的文职代表杰斐逊",
        "payer": "佩剑彻底损毁的弗吉尼亚军事代表乔治·华盛顿（虽不在场但远程受害）"
      }
    }
  ],
  "jenner-vaccine-1796": [
    {
      "id": "C",
      "powerId": "shrink-object",
      "displayLabel": "缩小詹纳的牛痘材料罐",
      "label": "在日落前，你当着詹纳面将装有牛痘材料的陶瓷罐缩小到指甲盖大小，迫使他只用伍德维尔的接种针蘸取微量材料给男孩接种。",
      "intent": "通过缩小材料容器限制用量，既确保材料不浪费，又迫使詹纳更精确记录微量接种的反应。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "对装满牛痘材料的陶瓷罐施加缩小，使其变为掌心大小且重量同步减轻",
        "target": "詹纳桌上装有牛痘材料的陶瓷罐",
        "deadline": "牛痘材料将在日落后失效"
      },
      "instantEcho": {
        "directResult": "陶瓷罐缩小后，詹纳惊讶地拿起它，只用针尖蘸取极少量材料给男孩詹姆斯·菲普斯接种。",
        "unexpectedCost": "材料罐缩得太小，詹纳手指被边缘划破一道小口。",
        "beneficiary": "男孩詹姆斯·菲普斯（接种量更安全）",
        "payer": "詹纳（手指受伤）"
      }
    },
    {
      "id": "C",
      "powerId": "transfer-cost",
      "displayLabel": "转移牛痘接种的风险给伍德维尔",
      "label": "在日落前，你决定让伍德维尔承担接种可能带来的发烧、昏厥或感染等全部直接代价，而男孩只享受免疫收益。",
      "intent": "将实验风险转移给反对牛痘的医生伍德维尔，从而打消詹纳的顾虑，让他按愿计划接种。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定男孩詹姆斯·菲普斯接种牛痘后的全部直接代价由伍德维尔承担",
        "target": "伍德维尔医生（全名亨利·伍德维尔）",
        "deadline": "牛痘材料日落失效前"
      },
      "instantEcho": {
        "directResult": "男孩接种后一切正常，而伍德维尔突然发烧昏厥。",
        "unexpectedCost": "伍德维尔的医疗费用由当地诊所承担，詹纳被要求为此负责。",
        "beneficiary": "男孩詹姆斯·菲普斯",
        "payer": "伍德维尔（承担病痛）及诊所（承担医疗费）"
      }
    },
    {
      "id": "C",
      "powerId": "rewind-hour",
      "displayLabel": "倒退一小时重制接种记录",
      "label": "在男孩接种后出现意外发烧时，你让整个诊室回到一小时前，并凭借记忆向詹纳提出调整剂量的建议，从而避免危险的发热反应。",
      "intent": "利用倒带机会修正剂量错误，确保接种顺利且记录完整。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动时间倒流，使诊室回到一小时前，自己保留所有记忆",
        "target": "伯克利乡间诊室（包括詹纳、男孩詹姆斯·菲普斯和伍德维尔）",
        "deadline": "牛痘材料日落失效前"
      },
      "instantEcho": {
        "directResult": "时间倒退后，你及时建议詹纳减少接种剂量，男孩只出现轻微不适。",
        "unexpectedCost": "你的手表因时间倒流而停止走动。",
        "beneficiary": "男孩詹姆斯·菲普斯（避免高烧）",
        "payer": "你自己（手表损坏）"
      }
    },
    {
      "id": "C",
      "powerId": "shapeshift",
      "displayLabel": "变成伍德维尔否决接种",
      "label": "在詹纳准备接种前一分钟，你变成亨利·伍德维尔冲进诊室，以皇家学会成员身份严厉禁止实验，从而迫使詹纳改用自己儿子作为试验对象。",
      "intent": "冒充反对者制造冲突，迫使詹纳将风险转给自己的家人，从而打破僵局。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "变化为亨利·伍德维尔的外貌、声音和指纹",
        "target": "詹纳和男孩詹姆斯·菲普斯",
        "deadline": "牛痘材料日落失效前"
      },
      "instantEcho": {
        "directResult": "詹纳被假伍德维尔喝止后，改为给自己长子爱德华接种。",
        "unexpectedCost": "真正的伍德维尔两小时后到来，发现有人冒充，导致詹纳声誉受损。",
        "beneficiary": "詹姆斯·菲普斯（未被冒风险）",
        "payer": "詹纳长子爱德华（承担接种风险）及詹纳声誉"
      }
    },
    {
      "id": "C",
      "powerId": "summon-lightning",
      "displayLabel": "引雷击毁牛痘材料",
      "label": "在詹纳即将提取材料前，你召唤一道雷电精准劈中存放牛痘脓液的玻璃瓶，迫使詹纳不得不改用当天早上从另一挤奶女工手臂采集的新鲜材料。",
      "intent": "用天灾破坏旧材料，让詹纳只得使用活性更好的新鲜材料，提高实验成功率。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "召唤雷电击中诊室中装有牛痘脓液的玻璃瓶",
        "target": "玻璃瓶（内含牛痘材料）",
        "deadline": "牛痘材料日落失效前"
      },
      "instantEcho": {
        "directResult": "玻璃瓶碎裂，材料蒸发；詹纳立即派助手去萨拉·内尔姆斯家取新脓液。",
        "unexpectedCost": "诊室屋顶被雷击出破洞，大雨淋湿部分记录。",
        "beneficiary": "詹纳（获得活性更高的材料）",
        "payer": "所在诊室（屋顶修复费用）"
      }
    },
    {
      "id": "C",
      "powerId": "share-memory",
      "displayLabel": "共享挤奶女工的免疫记忆",
      "label": "在詹纳犹豫是否接种时，你让诊室内所有人（詹纳、伍德维尔、男孩及你）同时经历一段你记忆中关于挤奶女工萨拉·内尔姆斯从未患天花的日常场景，持续一分钟。",
      "intent": "用真实记忆说服所有人相信牛痘的保护力，消除伍德维尔的反对。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "分享你亲历的萨拉·内尔姆斯挤奶并谈论自己从未得天花的一幕",
        "target": "诊室内所有人：詹纳、伍德维尔、男孩詹姆斯·菲普斯及你自己",
        "deadline": "牛痘材料日落失效前"
      },
      "instantEcho": {
        "directResult": "伍德维尔看到记忆后沉默，詹纳信心大增，立即为男孩接种。",
        "unexpectedCost": "男孩詹姆斯·菲普斯因记忆过度刺激而轻微晕眩。",
        "beneficiary": "詹纳（获得支持）",
        "payer": "男孩詹姆斯·菲普斯（短暂不适）"
      }
    }
  ],
  "meiji-1868": [
    {
      "id": "C",
      "powerId": "speak-any-distance",
      "displayLabel": "跨越距离劝岩仓具视",
      "label": "你与身在东京的岩仓具视实时通话，劝说他在即将到来的会议上支持立即公布条约草案，以避免列强猜疑。",
      "intent": "打破空间障碍，让决策关键人物提前知晓并推动开放国策。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "与东京的岩仓具视通话并劝说他支持公布条约草案",
        "target": "岩仓具视",
        "deadline": "仪式开始前一刻钟"
      },
      "instantEcho": {
        "directResult": "岩仓具视在京都御所外通过密使传话，同意支持公开条约。",
        "unexpectedCost": "通话内容被部分藩士窃听，引发对泄露机密的疑虑。",
        "beneficiary": "新政府中的开明派",
        "payer": "岩仓具视"
      }
    },
    {
      "id": "C",
      "powerId": "duplicate-place",
      "displayLabel": "复制紫宸殿备用",
      "label": "你在紫宸殿旁复制出一座完全相同的空殿，将所有誓文抄本和印玺移入，以应对突发事件。",
      "intent": "用物理备份消除单一地点的不可逆风险。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "在紫宸殿旁复制出一座空殿并移入抄本和印玺",
        "target": "紫宸殿",
        "deadline": "仪式开始前"
      },
      "instantEcho": {
        "directResult": "原殿因意外火灾焚毁，典礼在复制殿按时举行。",
        "unexpectedCost": "复制殿仅存一天，翌日史料记载出现混乱。",
        "beneficiary": "新政府",
        "payer": "书记官（你）"
      }
    },
    {
      "id": "C",
      "powerId": "revive-dead",
      "displayLabel": "复活维新志士坂本龙马",
      "label": "你复活了已被暗杀的坂本龙马，并让他作为见证者参与誓文发布，借助其威望整合各藩。",
      "intent": "用已死英杰的声望弥合当前政府与诸藩之间的信任鸿沟。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复活坂本龙马并安排其出席辟雍殿典礼",
        "target": "坂本龙马",
        "deadline": "一刻钟内"
      },
      "instantEcho": {
        "directResult": "龙马在誓文宣读后发表演说，诸藩代表当场表态支持。",
        "unexpectedCost": "龙马复活仅一小时，其突然消失引发新的猜疑。",
        "beneficiary": "明治天皇与开明派",
        "payer": "坂本龙马（再度消逝）"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-grain",
      "displayLabel": "充实京都粮仓备饥荒",
      "label": "你让京都御所粮仓不断涌出大米，以应对因改革可能引发的物价动荡。",
      "intent": "用无限粮食缓冲制度变革期的社会不稳定因素。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "让御所粮仓持续涌出大米",
        "target": "京都御所粮仓",
        "deadline": "仪式结束前"
      },
      "instantEcho": {
        "directResult": "粮仓满溢，城下町米价应声回落。",
        "unexpectedCost": "过量粮食导致仓储压力，部分米袋霉变。",
        "beneficiary": "京都百姓",
        "payer": "新政府财政"
      }
    },
    {
      "id": "C",
      "powerId": "enlarge-object",
      "displayLabel": "放大五条誓文木牌",
      "label": "你将书写五条誓文的木板放大百倍，立于紫宸殿前，使全体列席者清晰阅读。",
      "intent": "用视觉震撼强化誓文的权威性与传播力，避免解读分歧。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将书写誓文的木板放大百倍并树立于殿前",
        "target": "五条誓文木牌",
        "deadline": "宣读开始前"
      },
      "instantEcho": {
        "directResult": "诸侯与公卿清晰看到文句，无人质疑篡改。",
        "unexpectedCost": "巨木牌在仪式后因重心不稳倒塌，压毁部分仪仗。",
        "beneficiary": "参会诸侯",
        "payer": "新政府礼仪官"
      }
    },
    {
      "id": "C",
      "powerId": "sentence-becomes-true",
      "displayLabel": "写下士农平等法令",
      "label": "你写下\"自今日起，士农工商四民平等\"的字条，使其成为新法事实。",
      "intent": "以永久性事实突破改革决策的拖延和阻力。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "写下\"自今日起，士农工商四民平等\"并使其为真",
        "target": "五条誓文框架",
        "deadline": "读完誓文后立即"
      },
      "instantEcho": {
        "directResult": "全国户籍制度即时废除身份歧视。",
        "unexpectedCost": "武士阶层剧烈反弹，导致西南战争提前爆发。",
        "beneficiary": "平民与商贾",
        "payer": "武士阶级"
      }
    }
  ],
  "wright-flight-1903": [
    {
      "id": "C",
      "powerId": "teleport-crowd",
      "displayLabel": "迁走强风观测员",
      "label": "你必须在下一阵强风到来前将基蒂霍克山顶的气象观测员卢克传送到你去年冬天待过的代顿市自行车工坊，无人帮助鲁特兄弟判断风力。",
      "intent": "移除关键的测风人员，阻止起飞判断。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "抓住卢克的肩膀用意念传送",
        "target": "气象观测员卢克",
        "deadline": "下一阵强风超过安全范围前"
      },
      "instantEcho": {
        "directResult": "卢克消失在帐篷里，代顿工坊传来惊叫。",
        "unexpectedCost": "你因精神聚焦鼻血滴到风速计上。",
        "beneficiary": "莱特兄弟中的奥维尔",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "borrow-tomorrow-memory",
      "displayLabel": "预览明日坠毁录影",
      "label": "你必须在威尔伯问‘现在风够好吗？’之前获取明天此刻的记忆，看到飞行者一号撞地破碎的细节。",
      "intent": "用已知失败结局劝阻起飞。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "闭眼读取明天的记忆",
        "target": "威尔伯·莱特",
        "deadline": "威尔伯问风状态之前"
      },
      "instantEcho": {
        "directResult": "你脑中闪过机翼断裂的清晰影像。",
        "unexpectedCost": "你偏头痛发作，无法同时记录风速。",
        "beneficiary": "莱特兄弟",
        "payer": "你的健康"
      }
    },
    {
      "id": "C",
      "powerId": "summon-giant-beast",
      "displayLabel": "引巨鹰掀翻飞行器",
      "label": "你必须在强风间隙对沙丘东面喊一句‘来’，召来一只百米高的鹰翅巨兽，用气流掀翻飞行者一号。",
      "intent": "直接摧毁飞机阻止起飞。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "对东方沙丘喊出命令‘来’",
        "target": "飞行者一号",
        "deadline": "强风间隙结束前"
      },
      "instantEcho": {
        "directResult": "巨兽翅膀扇出的暴风把飞机侧翻到沙里。",
        "unexpectedCost": "巨兽脚爪踩碎了备用螺旋桨。",
        "beneficiary": "历史没有发生",
        "payer": "制造飞机的木料"
      }
    },
    {
      "id": "C",
      "powerId": "move-mountain",
      "displayLabel": "搬来沙丘阻断跑道",
      "label": "你必须在莱特兄弟推飞机上轨道之前把西边那座基蒂霍克山移动到发射轨道正前方一百米处。",
      "intent": "物理阻挡起飞滑跑。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "眼神锁定西山，用意念移动",
        "target": "基蒂霍克山",
        "deadline": "飞机被推上轨道前"
      },
      "instantEcho": {
        "directResult": "整座山轰然落在轨道尽头，沙尘遮蔽视线。",
        "unexpectedCost": "地面震动导致你打翻了油灯引燃草堆。",
        "beneficiary": "反对飞行的人",
        "payer": "当地生态"
      }
    },
    {
      "id": "C",
      "powerId": "locate-anything",
      "displayLabel": "找出隐藏的致命螺丝",
      "label": "你必须在发动机启动前立即知道飞行者一号右翼第七根翼肋上那颗松动螺丝的准确位置。",
      "intent": "以检修理由拖延起飞。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "闭眼在心中锁定‘飞行者一号右翼故障点’",
        "target": "飞行者一号右翼",
        "deadline": "发动机启动之前"
      },
      "instantEcho": {
        "directResult": "你看见螺丝卡在翼肋缝隙中反光。",
        "unexpectedCost": "你因过度专注错过了记录风速的时刻。",
        "beneficiary": "莱特兄弟的安全",
        "payer": "你的职业身份"
      }
    },
    {
      "id": "C",
      "powerId": "stretch-road",
      "displayLabel": "拉长沙丘滑道",
      "label": "你必须在莱特兄弟放下刹车块之前把机库到发射轨那百米沙路拉长成一百公里，并在两端设置无形墙。",
      "intent": "让推飞机的人永远走不到发射点。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "手指沿着沙路划出延长线",
        "target": "机库到发射轨的道路",
        "deadline": "刹车块被放下之前"
      },
      "instantEcho": {
        "directResult": "道路无限延伸，推飞机的众人陷入海市蜃楼般的沙漠。",
        "unexpectedCost": "你在沙路上摔了一跤，相机摔坏。",
        "beneficiary": "时间本身",
        "payer": "你的记录设备"
      }
    }
  ],
  "un-charter-1945": [
    {
      "id": "C",
      "powerId": "stop-time",
      "displayLabel": "暂停签字大厅时间",
      "label": "你在五十国代表即将签字前发动停止时间，让除你之外的整个大厅暂停十分钟，独自走到顾维钧面前，抽出他手中的钢笔，将否决权条款的宪章草案临时替换为一份修改稿。",
      "intent": "暂停时间让你在无干扰下与顾维钧进行秘密沟通，改变他的决策。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "停止时间后，走到中国首席代表顾维钧面前，抽出他手中的钢笔，将安理会否决权条款的草案替换为修改稿",
        "target": "顾维钧和签字台上的宪章草案",
        "deadline": "十分钟结束前"
      },
      "instantEcho": {
        "directResult": "时间恢复后，顾维钧发现钢笔已被换，他拿起修改稿阅读，面露惊讶。",
        "unexpectedCost": "你因时间暂停期间移动，恢复后轻微眩晕，但无人注意。",
        "beneficiary": "顾维钧",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "clone-self",
      "displayLabel": "复制百身劝代表",
      "label": "你在签字前一小时复制出一百个自己，命令每个分身分别找到一位与会代表，其中最主要的任务是让十个分身包围顾维钧，每人手持一份你提前写好的反对否决权的说辞，以不同角度说服他。",
      "intent": "复制自己以量变引发质变，多人围攻说服顾维钧一人。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制出一百个自己，命令十个分身包围并同时说服顾维钧，其余分身游说其他代表",
        "target": "顾维钧和旧金山退伍军人纪念馆内的代表们",
        "deadline": "签字前一小时"
      },
      "instantEcho": {
        "directResult": "顾维钧被十个你包围，分身们依次发言，他皱眉思考，其他代表也注意到混乱。",
        "unexpectedCost": "分身太多引起场馆安保注意，一名真我被短暂盘问。",
        "beneficiary": "顾维钧",
        "payer": "你（真身）"
      }
    },
    {
      "id": "C",
      "powerId": "extinguish-fire",
      "displayLabel": "熄灭签字厅火警",
      "label": "你在签字前半小时，突然发现某代表雪茄引燃窗帘，但实际这暗示一场可能的意外中断。你发动能力，让方圆十里内所有火焰瞬间熄灭，包括所有雪茄和烟斗的明火，导致一些代表措手不及。",
      "intent": "灭火能力虽不直接针对否决权，但制造意外事件打乱签字节奏，为重新谈判争取时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动灭火能力，瞬间熄灭包括窗帘火苗、所有雪茄烟斗明火在内的所有火焰",
        "target": "旧金山退伍军人纪念馆方圆十里内一切燃烧的火焰",
        "deadline": "签字前半小时当场发动"
      },
      "instantEcho": {
        "directResult": "窗帘火苗消失，但全场烟斗、雪茄同时熄灭，代表们惊讶，局面一度混乱。",
        "unexpectedCost": "一位代表因雪茄突然熄灭而呛咳，指责是破坏行为。",
        "beneficiary": "你（获得重新发言的机会）",
        "payer": "抽烟代表们"
      }
    },
    {
      "id": "C",
      "powerId": "erase-memory",
      "displayLabel": "删除顾维钧雅尔塔记忆",
      "label": "你在签字前十分钟，走到顾维钧身边，假装与他握手，同时发动能力，删除他关于雅尔塔会议上罗斯福、丘吉尔与斯大林商定否决权条款的全部记忆。",
      "intent": "删除顾维钧对否决权来源的记忆，使他不受原有约束，可能重新评估是否签署。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "与顾维钧握手时发动记忆删除，永久删除他对雅尔塔商定否决权条款事件的记忆",
        "target": "顾维钧",
        "deadline": "签字前十分钟"
      },
      "instantEcho": {
        "directResult": "顾维钧眼神恍惚了一下，然后看向宪章草案时显得困惑，仿佛对否决权条款感到陌生。",
        "unexpectedCost": "顾维钧随后对你表现出不寻常的依赖，要求你解释条款，耽误了时间。",
        "beneficiary": "顾维钧",
        "payer": "顾维钧（失去部分判断依据）"
      }
    },
    {
      "id": "C",
      "powerId": "swap-two-people",
      "displayLabel": "交换顾维钧与苏联代表",
      "label": "你在签字前一刻，让顾维钧与苏联代表葛罗米柯瞬间交换位置和随身物品，使顾维钧出现在苏联代表的位置，而葛罗米柯站在中国代表的位置，引发混乱。",
      "intent": "交换两人位置让顾维钧暂时脱离中国代表团位置，打乱签字流程。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定顾维钧和葛罗米柯，发动交换位置和随身物品",
        "target": "顾维钧与苏联代表葛罗米柯",
        "deadline": "签字前一刻"
      },
      "instantEcho": {
        "directResult": "两人瞬间互换位置，顾维钧出现在苏联席位，葛罗米柯在中国席位，全场哗然。",
        "unexpectedCost": "两人因物品交换而争执，警卫介入，签字推迟。",
        "beneficiary": "你",
        "payer": "顾维钧和葛罗米柯"
      }
    },
    {
      "id": "C",
      "powerId": "repeat-minute",
      "displayLabel": "重复签字前的一分钟",
      "label": "你在顾维钧即将落笔签字的一分钟开始时发动重复一分钟，让这一分钟反复发生。在重复中，你每次跑到顾维钧耳边低语新的反对理由，直到第八十次重复时，他停下笔。",
      "intent": "重复一分钟让你多次劝说顾维钧，直到他改变主意。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "启动重复一分钟，每次重复时跑到顾维钧耳边低语反对否决权的理由",
        "target": "顾维钧和签字笔",
        "deadline": "一分钟结束前（重复一百次内）"
      },
      "instantEcho": {
        "directResult": "第八十次重复时，顾维钧放下笔，抬头看向你。重复停止，他未签字。",
        "unexpectedCost": "经历八十次重复的你身心俱疲，几乎虚脱。",
        "beneficiary": "顾维钧",
        "payer": "你（精力）"
      }
    }
  ],
  "india-independence-1947": [
    {
      "id": "C",
      "powerId": "restore-youth",
      "displayLabel": "让蒙巴顿年轻四十岁",
      "label": "在午夜钟声敲响前，你让英国总督蒙巴顿的身体瞬间年轻四十年，使他精力充沛地完成权力移交，无法再以疲惫为由拖延。",
      "intent": "确保蒙巴顿精神饱满地完成移交仪式，避免因疲劳引发中断。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "默念能力并指向蒙巴顿",
        "target": "蒙巴顿",
        "deadline": "午夜钟声前"
      },
      "instantEcho": {
        "directResult": "蒙巴顿的皱纹消失，白发转黑，站姿笔直，全场哗然。",
        "unexpectedCost": "年轻的身体让蒙巴顿更强势，反而坚持将分治方案细节当场宣读，引发更大骚动。",
        "beneficiary": "蒙巴顿",
        "payer": "你——成为被怀疑的对象"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-money",
      "displayLabel": "分发卢比安抚难民",
      "label": "在午夜钟声即将敲响时，你取出数袋1947年印度卢比，分发给新德里街头恐慌的难民，缓解因分治引发的骚乱。",
      "intent": "用金钱平息因边界划分导致的社区恐慌，维持仪式现场秩序。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "取出大额卢比并分发给难民",
        "target": "新德里街头流离失所的难民",
        "deadline": "午夜钟声前"
      },
      "instantEcho": {
        "directResult": "难民拿到卢比后暂时平静，部分人开始购买食物和水。",
        "unexpectedCost": "大量货币涌入导致当地物价瞬间上涨，引发新的争议。",
        "beneficiary": "新德里的部分难民",
        "payer": "你——被怀疑伪造货币"
      }
    },
    {
      "id": "C",
      "powerId": "shrink-object",
      "displayLabel": "缩小蒙巴顿权杖",
      "label": "在总督准备移交权力时，你将蒙巴顿手中的代表英国王权的权杖缩小到掌心大小，使其无法正常宣读移交文件，迫使他改用口头宣布。",
      "intent": "打破象征性仪式，迫使蒙巴顿直接宣布印度独立，避免程序拖延。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向权杖并发动能力",
        "target": "蒙巴顿手中的权杖",
        "deadline": "午夜钟声敲响瞬间"
      },
      "instantEcho": {
        "directResult": "权杖瞬间缩小，蒙巴顿措手不及，掉落在桌面。他只得口头宣布印度自治领成立。",
        "unexpectedCost": "权杖突然缩小被疑为印度教神迹，加剧了穆斯林代表的疑虑，导致分治冲突提前爆发。",
        "beneficiary": "印度独立进程加速",
        "payer": "你——被怀疑使用了巫术"
      }
    },
    {
      "id": "C",
      "powerId": "transfer-cost",
      "displayLabel": "转移尼赫鲁的代价",
      "label": "在尼赫鲁即将致辞承诺保障难民安全时，你将他将因边境暴力而承担的政府公信力损失转移给贾纳克，使贾纳克成为公众不满的焦点。",
      "intent": "保护尼赫鲁的政治声望，确保独立宣言顺利通过。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "默念转移指令",
        "target": "尼赫鲁即将做出的难民安全承诺的代价",
        "deadline": "尼赫鲁致辞前"
      },
      "instantEcho": {
        "directResult": "尼赫鲁讲话后，民众对其反应平稳，而对贾纳克的指责声四起。",
        "unexpectedCost": "贾纳克被迫辞职，引发其派系不满，导致短期政治动荡。",
        "beneficiary": "尼赫鲁",
        "payer": "贾纳克"
      }
    },
    {
      "id": "C",
      "powerId": "rewind-hour",
      "displayLabel": "倒回一小时化解冲突",
      "label": "在午夜钟声后，因分治消息引发议会大厅外暴力冲突，你立即将整个新德里制宪会议大厅区域回退到一小时前的状态，使冲突未发生，但保留记忆。",
      "intent": "阻止分治消息引发的立即暴力事件，给各方重新协商的时间。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "集中意志发动时间倒退",
        "target": "新德里制宪会议大厅及周边区域",
        "deadline": "暴力冲突发生后一秒内"
      },
      "instantEcho": {
        "directResult": "大厅恢复平静，冲突痕迹消失，所有人退回到一小时前状态。",
        "unexpectedCost": "部分人保留记忆片段，开始质疑现实，引发猜疑链。",
        "beneficiary": "制宪会议大厅内所有人员",
        "payer": "你——消耗了一次珍贵的机会"
      }
    },
    {
      "id": "C",
      "powerId": "shapeshift",
      "displayLabel": "变成蒙巴顿替代移交",
      "label": "在午夜钟声前，你变成蒙巴顿的外貌与声音，走进议会大厅，代替真蒙巴顿宣读印度独立文件，避免其临时变卦。",
      "intent": "确保权力移交按计划进行，防止蒙巴顿受英国压力反悔。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动能力变成蒙巴顿",
        "target": "蒙巴顿本人（替换形象）",
        "deadline": "午夜钟声前"
      },
      "instantEcho": {
        "directResult": "你以蒙巴顿形象完成宣读，尼赫鲁等印度领袖接受移交，印度独立正式生效。",
        "unexpectedCost": "真蒙巴顿被警卫发现，引发短暂混乱，你的身份最终暴露，被英方追责。",
        "beneficiary": "印度独立运动",
        "payer": "你——被英国当局通缉"
      }
    }
  ],
  "sputnik-1957": [
    {
      "id": "C",
      "powerId": "invisibility",
      "displayLabel": "隐身篡改R-7关机指令",
      "label": "你利用完全隐身潜入控制台，将末级发动机的预定关机计时器拨慢3秒，使卫星获得额外速度。",
      "intent": "在无人知晓的情况下修改火箭参数，弥补速度不足。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "拨慢计时器",
        "target": "R-7火箭末级关机定时器",
        "deadline": "末级发动机预定关机前1秒"
      },
      "instantEcho": {
        "directResult": "R-7末级多燃烧3秒，卫星速度达标并成功入轨。",
        "unexpectedCost": "你的隐身时间仅剩59分钟。",
        "beneficiary": "谢尔盖·科罗廖夫",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "split-river",
      "displayLabel": "分开锡尔河转移火箭残骸",
      "label": "你让附近的锡尔河河床干涸露出，将坠落的R-7助推器残骸搬入河床，以掩盖技术缺陷。",
      "intent": "隐藏火箭设计漏洞，避免美国通过残骸分析获取情报。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "分开河水并搬运残骸",
        "target": "锡尔河河段及R-7助推器残骸",
        "deadline": "美国侦察机到达前10分钟"
      },
      "instantEcho": {
        "directResult": "残骸被藏入干河床，河水恢复后完全淹没。",
        "unexpectedCost": "河水恢复时淹没了一名当地牧羊人的羊群。",
        "beneficiary": "苏联国家安全委员会",
        "payer": "牧羊人"
      }
    },
    {
      "id": "C",
      "powerId": "speak-any-distance",
      "displayLabel": "与科罗廖夫通话命令延长燃烧",
      "label": "你直接联系总设计师谢尔盖·科罗廖夫，告诉他‘命令末级额外燃烧5秒’，并将你看到的遥测数据描述给他。",
      "intent": "绕过指挥链，直接让决策者下达延长指令。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "实时通话",
        "target": "拜科努尔指挥掩体内的谢尔盖·科罗廖夫",
        "deadline": "末级发动机预定关机前5秒"
      },
      "instantEcho": {
        "directResult": "科罗廖夫相信了你的数据，下令延长燃烧。",
        "unexpectedCost": "通话结束后科罗廖夫因察觉到异常而命令克格勃追查你。",
        "beneficiary": "谢尔盖·科罗廖夫",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "duplicate-place",
      "displayLabel": "复制发射控制掩体制造假命令",
      "label": "你在控制掩体旁复制一个完全相同的掩体，然后进入复制体，通过复制控制台发出错误的关机信号，使主火箭继续燃烧。",
      "intent": "用假控制室骗过原系统，实则保留真火箭的推进。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制并操作假控制台",
        "target": "拜科努尔发射场控制掩体",
        "deadline": "末级发动机预定关机前10秒"
      },
      "instantEcho": {
        "directResult": "假控制室发出关机指令被主火箭忽略，真人因收到假关机信号而停止操作。",
        "unexpectedCost": "复制体一天后才消失，导致真实控制人员困惑并延误后续发射。",
        "beneficiary": "拜科努尔发射场总指挥",
        "payer": "真实控制人员"
      }
    },
    {
      "id": "C",
      "powerId": "revive-dead",
      "displayLabel": "复活火箭科学家弗里德里希·詹德",
      "label": "你复活了苏联已故火箭先驱弗里德里希·詹德，他现场指出R-7燃料泵的一个调校错误，使末级推力提升。",
      "intent": "借助逝者的专业知识解决当前速度不足的技术问题。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复活并要求帮助",
        "target": "弗里德里希·詹德（1933年去世）",
        "deadline": "末级发动机预定关机前30秒"
      },
      "instantEcho": {
        "directResult": "詹德调整了燃料泵，末级推力增加，卫星入轨。",
        "unexpectedCost": "一小时后詹德再次死去，他的复活被克格勃记录并引起调查。",
        "beneficiary": "苏联航天计划",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-grain",
      "displayLabel": "用粮食收买发射场警卫加速操作",
      "label": "你让发射场食堂粮仓涌出无数黑麦，以此说服警卫允许你进入发射塔手动延长燃烧。",
      "intent": "通过物资收买控制警卫，从而物理干预火箭。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "生成粮食并贿赂警卫",
        "target": "拜科努尔发射塔警戒哨警卫",
        "deadline": "末级发动机预定关机前60秒"
      },
      "instantEcho": {
        "directResult": "警卫放你进入，你手动拨动开关延长燃烧。",
        "unexpectedCost": "粮食堆压垮食堂地板，造成非致命事故。",
        "beneficiary": "你",
        "payer": "拜科努尔后勤部门"
      }
    }
  ],
  "oil-crisis-1973": [
    {
      "id": "C",
      "powerId": "transmute-material",
      "displayLabel": "把油管变成水",
      "label": "你在阿拉伯石油部长会议厅内，趁部长们讨论时，将连接油井的金属输油管材料永久变为纯水，使原油无法流出管道。",
      "intent": "物理上阻止减产执行，让决议失去意义。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用手触摸一根连接油井的金属输油管，并将其材料变为纯水。",
        "target": "科威特会议厅外的输油管",
        "deadline": "各国部长表决前一小时"
      },
      "instantEcho": {
        "directResult": "该段油管内部变成水，原油全部泄漏，减产无法实施。",
        "unexpectedCost": "科威特油田被迫紧急关闭一周，损失数百万吨产量。",
        "beneficiary": "西方石油消费国",
        "payer": "科威特石油公司"
      }
    },
    {
      "id": "C",
      "powerId": "broadcast-thought",
      "displayLabel": "向十公里内所有人脑中喊话",
      "label": "你在部长表决前，对所有在科威特城十公里内的人脑中喊道：“沙特已秘密同意增产，减产是骗局！”使各国代表相互猜疑。",
      "intent": "制造信任危机，破坏减产共识。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "集中意念，将一句话传入方圆十公里内所有人脑中。",
        "target": "科威特城所有人类",
        "deadline": "立即发动，在表决前"
      },
      "instantEcho": {
        "directResult": "各国部长听到后要求沙特澄清，沙特代表否认，会议中断两小时。",
        "unexpectedCost": "沙特立即宣布暂停一切私下协商，会议气氛极度敌对，决议流产。",
        "beneficiary": "以色列及其支持者",
        "payer": "沙特阿拉伯的诚信和减产联盟"
      }
    },
    {
      "id": "C",
      "powerId": "teleport-crowd",
      "displayLabel": "把全体部长传送到华盛顿白宫",
      "label": "你在表决前一分钟，将会议厅内全部17位阿拉伯石油部长及63名随行人员传送至你曾到过的华盛顿白宫草坪。",
      "intent": "把决策者暴露在敌方中心，迫使谈判或放弃行动。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "瞄准现场所有部长和随行人员，发动传送。",
        "target": "科威特会议厅内全部80人",
        "deadline": "表决前一分钟"
      },
      "instantEcho": {
        "directResult": "部长们突然出现在白宫草坪，美国特勤局立即包围，随后被请入室内讨论。",
        "unexpectedCost": "美国借此扣押他们作为人质，要求阿拉伯国家取消减产。",
        "beneficiary": "美国",
        "payer": "被传送的阿拉伯部长们"
      }
    },
    {
      "id": "C",
      "powerId": "borrow-tomorrow-memory",
      "displayLabel": "借来会议结束后的记忆",
      "label": "你使用能力，获得明天此刻的完整记忆，提前知道部长们是否通过减产决议以及各国的最终投票。",
      "intent": "用确定信息指导当下行动。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "默念并获取明日记忆。",
        "target": "你自己",
        "deadline": "表决前一小时"
      },
      "instantEcho": {
        "directResult": "你得知决议以11:6通过，但沙特投了反对票。",
        "unexpectedCost": "由于预知未来，你无法改变最终结果，且被记忆束缚导致积极行动瘫痪。",
        "beneficiary": "你个人（获得信息）",
        "payer": "你自己的决策自由度"
      }
    },
    {
      "id": "C",
      "powerId": "summon-giant-beast",
      "displayLabel": "召唤百米巨兽闯入科威特城",
      "label": "你在部长会议厅外召唤一只百米高的巨兽，命令它踩踏毁坏科威特最大的石油港口和储油设施。",
      "intent": "摧毁石油基础设施，使减产和禁运失去物质基础。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指向科威特港口方向，召唤巨兽并下达指令。",
        "target": "科威特艾哈迈迪港",
        "deadline": "立即发动，持续一小时"
      },
      "instantEcho": {
        "directResult": "巨兽一脚踩毁港口，油库燃起大火，科威特原油出口瘫痪。",
        "unexpectedCost": "巨兽还踩死了上百名石油工人，并引发国际生态灾难。",
        "beneficiary": "以色列和支持它的西方",
        "payer": "科威特石油工人和环境"
      }
    },
    {
      "id": "C",
      "powerId": "move-mountain",
      "displayLabel": "将法奥山移到科威特湾",
      "label": "你调集视线，将远处伊拉克境内的法奥山（海拔2300米）整体移动到科威特湾中央，堵塞所有油轮进出航道。",
      "intent": "物理封锁石油出口，使任何决议都失去意义。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "望向法奥山，将其移动至科威特湾。",
        "target": "法奥山",
        "deadline": "立即发动"
      },
      "instantEcho": {
        "directResult": "山峰瞬间插入海湾，海水涌起淹没沿岸设施，所有油轮无法通行。",
        "unexpectedCost": "科威特城部分区域被海啸淹没，数百人伤亡，国际救援介入。",
        "beneficiary": "全球石油消费国（短期油轮转向其他港口）",
        "payer": "科威特沿海居民"
      }
    }
  ],
  "chernobyl-1986": [
    {
      "id": "C",
      "powerId": "intangible-walls",
      "displayLabel": "让控制室墙壁失去实体",
      "label": "你在反应堆参数越过安全极限前，让四号机组控制室的墙壁、门窗和围栏变得可以直接穿过，以便直接看到并干预反应堆核心状态。",
      "intent": "通过穿透物理障碍，让你能直接观察和手动干预反应堆内部，而不必依赖不可靠的仪表和控制杆。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动能力使墙壁、门窗和围栏失去实体",
        "target": "切尔诺贝利核电站四号机组控制室的墙壁、门窗和围栏",
        "deadline": "反应堆参数在数秒内越过安全极限之前"
      },
      "instantEcho": {
        "directResult": "控制室四周的墙壁、门窗和围栏瞬间变得透明且可穿过，你看到了反应堆堆芯的实际情况。",
        "unexpectedCost": "控制室失去防护屏蔽，辐射直接暴露于全体操作人员。",
        "beneficiary": "你（反应堆工程师）",
        "payer": "全体控制室操作人员"
      }
    },
    {
      "id": "C",
      "powerId": "reverse-cause",
      "displayLabel": "颠倒反应堆失控与停堆命令的因果",
      "label": "在反应堆功率异常波动且保护系统被停用的危急时刻，你颠倒因果：将‘反应堆即将爆炸’这一结果改作原因，而原原因‘未按下紧急停堆’变成结果——于是爆炸被逆转。",
      "intent": "通过因果倒置，将已经发生的异常波动转化为因，而触发紧急停堆成为果，从而避免爆炸。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "颠倒现场中‘反应堆功率异常波动’（结果）与‘未按下紧急停堆’（原因）的因果顺序",
        "target": "切尔诺贝利核电站四号机组的反应堆功率异常波动事件与紧急停堆命令",
        "deadline": "反应堆参数将在数秒内越过安全极限之前"
      },
      "instantEcho": {
        "directResult": "反应堆功率异常波动立即消失，而紧急停堆命令被自动执行，反应堆安全关闭。",
        "unexpectedCost": "因果颠倒导致部分历史记录出现矛盾，但事故本身被阻止。",
        "beneficiary": "控制室内所有人员及周边居民",
        "payer": "你（反应堆工程师）承担了因果扭曲的精神代价"
      }
    },
    {
      "id": "C",
      "powerId": "stop-time",
      "displayLabel": "停住时间十秒以手动干预",
      "label": "在反应堆功率越过安全极限前，你让整个现场（包括四号机组控制室及反应堆核心）完全停止十分钟，只有你能活动，以便手动操作控制杆降功率。",
      "intent": "通过暂停时间，获得十分钟的绝对静止窗口，手动完成紧急降功率操作，避免爆炸。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动时间停止能力，使除自己外的整个现场完全停止",
        "target": "切尔诺贝利核电站四号机组控制室及反应堆核心",
        "deadline": "反应堆参数将在数秒内越过安全极限之前"
      },
      "instantEcho": {
        "directResult": "时间停止，你独自移动并手动将控制杆推到最低功率位置，功率恢复正常。",
        "unexpectedCost": "时间恢复后，其他人员感觉一瞬间错过了关键操作，产生混乱。",
        "beneficiary": "你（反应堆工程师）以及全体人员",
        "payer": "其他操作人员（心理冲击）"
      }
    },
    {
      "id": "C",
      "powerId": "clone-self",
      "displayLabel": "复制一百个自己同时操作",
      "label": "在反应堆参数即将失控时，你复制出一百个拥有当前记忆且听从你指挥的自己，让他们同步检查仪表、测试安全系统并准备疏散流程。",
      "intent": "通过分身获得近乎无限的并行操作能力，在数秒内完成所有安全检查和手动干预。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "复制出一百个自己，下达指令让他们同时进行安全检查和手动操作",
        "target": "切尔诺贝利核电站四号机组控制室内的仪表、控制杆和疏散警报系统",
        "deadline": "反应堆参数将在数秒内越过安全极限之前"
      },
      "instantEcho": {
        "directResult": "一百个你同时工作，在数秒内确认所有异常并手动拉下紧急停堆杆，同时拉响疏散警报。",
        "unexpectedCost": "控制室因人员爆满而拥挤不堪，部分分身互相干扰。",
        "beneficiary": "你（反应堆工程师）与核电站全体人员",
        "payer": "你（精神分裂般的负担）"
      }
    },
    {
      "id": "C",
      "powerId": "extinguish-fire",
      "displayLabel": "熄灭反应堆内所有火焰",
      "label": "在反应堆爆炸前，你预见到石墨会燃烧，于是发动能力瞬间熄灭十里内所有火焰，包括反应堆内部可能已起的火苗和电气火灾。",
      "intent": "通过熄灭所有火源，从根本上阻止爆炸后的火灾蔓延，降低核污染扩散。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "发动能力熄灭方圆十里内所有正在燃烧的火焰",
        "target": "切尔诺贝利核电站四号机组反应堆内部及四周的所有火源",
        "deadline": "反应堆参数将在数秒内越过安全极限之前"
      },
      "instantEcho": {
        "directResult": "所有火焰瞬间熄灭，包括反应堆内可能存在的热点，爆炸后无火灾发生。",
        "unexpectedCost": "灭火后，部分仪表因无火而无法自动触发应急响应。",
        "beneficiary": "核电站现场人员及周边环境",
        "payer": "你（反应堆工程师）承担了使用超能力的未知后遗症"
      }
    },
    {
      "id": "C",
      "powerId": "erase-memory",
      "displayLabel": "删除操作员关于停用保护系统的记忆",
      "label": "在安全试验开始前，你永久删除值班主管关于‘为了试验停用多项保护系统’这一决策的全部记忆，使他下令重新启用保护系统。",
      "intent": "通过删除关键记忆，使安全系统重新上线，避免因人为疏忽导致的功率失控。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "永久删除值班主管关于停用保护系统事件的记忆",
        "target": "切尔诺贝利核电站值班主管",
        "deadline": "反应堆参数将在数秒内越过安全极限之前"
      },
      "instantEcho": {
        "directResult": "值班主管忘记曾下令停用保护系统，立即命令恢复所有保护，反应堆在保护下安全运行。",
        "unexpectedCost": "主管因记忆缺失而困惑，事后可能引发调查。",
        "beneficiary": "你（反应堆工程师）以及核电站全体人员",
        "payer": "值班主管（记忆丧失）"
      }
    }
  ],
  "soviet-dissolution-1991": [
    {
      "id": "C",
      "powerId": "see-hidden-writing",
      "displayLabel": "看清擦除的核密码",
      "label": "你在直播前读出了核公文包内已被擦除的密码数字，迫使你必须在五秒内决定是否修改辞职稿中的核移交条款。",
      "intent": "用看穿隐藏文字的能力找到可能已改写的核移交协议，防止失控移交。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用能力阅读公文包内被擦除的核密码数字",
        "target": "核公文包内被擦除的密码数字",
        "deadline": "全国电视直播将在五分钟后开始"
      },
      "instantEcho": {
        "directResult": "你高声念出了被擦除的三组密码，谢瓦尔德纳泽当场从口袋掏出录音笔记录。",
        "unexpectedCost": "克里姆林宫安全系统自动启动，你被两名特勤人员从房间强行架到走廊。",
        "beneficiary": "谢瓦尔德纳泽",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "pocket-building",
      "displayLabel": "收走整个克里姆林宫",
      "label": "你在直播前把克里姆林宫总统办公室连同所有文件和人员收入口袋，阻止了核指挥权交接。",
      "intent": "用收走建筑的能力把交接现场整个封锁，不让核武权落入任何独联体国家。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "将克里姆林宫总统办公室收进口袋",
        "target": "克里姆林宫总统办公室及内部全部人和物",
        "deadline": "全国电视直播将在五分钟后开始"
      },
      "instantEcho": {
        "directResult": "整栋办公区瞬间消失，你口袋鼓出一块立方体，窗外只剩空地基。",
        "unexpectedCost": "戈尔巴乔夫因被收入口袋而窒息昏迷，需要你立刻放回才能苏醒。",
        "beneficiary": "你",
        "payer": "戈尔巴乔夫"
      }
    },
    {
      "id": "C",
      "powerId": "restore-youth",
      "displayLabel": "让叶利钦变回23岁",
      "label": "你用手触碰叶利钦，令他的身体瞬间年轻四十年，迫使他在交接仪式上失去权威外貌。",
      "intent": "用恢复青春能力改变叶利钦的老年姿态，削弱他在独联体内部的威望，延缓接管。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "用手触碰叶利钦，发动恢复青春能力",
        "target": "叶利钦",
        "deadline": "全国电视直播将在五分钟后开始"
      },
      "instantEcho": {
        "directResult": "叶利钦的皱纹与白发瞬间消失，他踉跄后退，撞翻了身后的书架。",
        "unexpectedCost": "戈尔巴乔夫因为震惊而心脏病发作，需要优先抢救。",
        "beneficiary": "你",
        "payer": "戈尔巴乔夫"
      }
    },
    {
      "id": "C",
      "powerId": "infinite-money",
      "displayLabel": "无限卢布堆满直播台",
      "label": "你在直播前取出一亿新卢布现金堆在辞职稿旁，要求各加盟共和国用这笔钱直接赎买苏联债务。",
      "intent": "用无限钱财为苏联债务提供立即兑付方案，瓦解独联体急于分家的经济理由。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "从衣袋中不断取出新卢布现金",
        "target": "辞职稿旁的桌面以及各加盟共和国代表",
        "deadline": "全国电视直播将在五分钟后开始"
      },
      "instantEcho": {
        "directResult": "现金堆到天花板的瞬间，乌克兰代表克列夫丘克打电话要求基辅重新审议独立决定。",
        "unexpectedCost": "卢布现金过于厚重，压碎了红木办公桌，辞职稿被桌角划破。",
        "beneficiary": "各加盟共和国财政部长",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "shrink-object",
      "displayLabel": "缩小核公文包",
      "label": "你把戈尔巴乔夫要移交的核公文包缩成戒指大小戴在自己小指上，阻止了核指挥权的交接。",
      "intent": "用缩小物体能力将核公文包变为不可移交的随身物品，使核按钮无法传给叶利钦。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "触碰核公文包并缩小至戒指尺寸",
        "target": "核公文包",
        "deadline": "全国电视直播将在五分钟后开始"
      },
      "instantEcho": {
        "directResult": "公文包骤然缩小掉落在你掌心，你顺势套入左手小指，核按钮与发射代码尽在你掌握。",
        "unexpectedCost": "缩小的公文包发出高温，烫伤你的手指皮肤，冒出青烟。",
        "beneficiary": "你",
        "payer": "你"
      }
    },
    {
      "id": "C",
      "powerId": "transfer-cost",
      "displayLabel": "把解体代价转给斯大林",
      "label": "你把苏联解体这场行动的全部直接代价——领土丧失、核削弱、国际地位崩塌——转移到斯大林身上，让历史责任改由已故者承担。",
      "intent": "用转移代价能力把解体的直接后果追责到斯大林，从而在直播中为戈尔巴乔夫洗脱罪责，逆转辞职。",
      "deviationClass": "rupture",
      "usesModernKnowledge": false,
      "actionSpec": {
        "actor": "你",
        "action": "指定苏联解体行动的所有直接代价转移给斯大林",
        "target": "苏联解体这一行动的全部直接代价",
        "deadline": "全国电视直播将在五分钟后开始"
      },
      "instantEcho": {
        "directResult": "克里姆林宫墙壁上斯大林的画像突然滴下红色液体，直播摄像机自动对准画像。",
        "unexpectedCost": "代价转移触发克格勃档案系统自燃，大量斯大林时期文件化为灰烬。",
        "beneficiary": "戈尔巴乔夫",
        "payer": "斯大林（已故）及其历史评价"
      }
    }
  ]
} as const satisfies Record<string, readonly TimelineTurn["choices"][2][]>;
