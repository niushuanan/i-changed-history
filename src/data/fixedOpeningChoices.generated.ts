import type { TimelineTurn } from "../game/schema";

export type FixedOpeningChoiceEntry = Readonly<{
  trajectory: Readonly<{ historicalPath: string; preservedResult: string; decisiveFork: string }>;
  choices: readonly [TimelineTurn["choices"][0], TimelineTurn["choices"][1]];
  rollChoices: readonly [TimelineTurn["rollChoices"][0], TimelineTurn["rollChoices"][1]];
}>;

export const FIXED_OPENING_CHOICES = {
  "red-cliffs-208": {
    "trajectory": {
      "historicalPath": "在距曹军发现火船约半个时辰内，以军需官身份命令黄盖部将张昭将火船队提前起锚，从乌林浅滩向江北曹船阵直线推进。",
      "preservedResult": "孙刘联军借东风火攻，曹操水军溃败，三国鼎立格局由此成形。",
      "decisiveFork": "改变火攻方式：从燃烧转为撞击，打破铁索连船，使曹操水军提前溃散但无大面积火海。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "提前点燃火船组",
        "label": "在距曹军发现火船约半个时辰内，亲自登上黄盖旗舰，命令其部将张昭率首批六艘火船提前起锚，沿乌林浅滩直冲曹军铁索连船阵，确保火攻在东风未起时仍能点燃曹船。",
        "intent": "保留黄盖诈降、火船冲击、铁索燃烧的真实行动链，仅由军需官直接加速执行节点。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "登上黄盖旗舰，口头命令张昭提前起锚火船",
          "target": "张昭部首批六艘火船，黄盖旗舰，乌林浅滩，江北曹船阵",
          "deadline": "距曹军发现火船约半个时辰"
        },
        "instantEcho": {
          "directResult": "六艘火船提前冲向曹阵，由于风向未稳，三艘在途中自燃偏离，但三艘成功撞上曹船，引发局部火势，曹军开始混乱。",
          "unexpectedCost": "张昭在命令执行后被黄盖责备越权，军需官被暂时调离火船调配岗位，权限流失。",
          "beneficiary": "孙刘联军前锋队获得准备时间，黄盖引信提前生效",
          "payer": "军需官本人承担越权处分，黄盖部将张昭承担部分调度失误"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣押火船油布",
        "label": "在距曹军发现火船约半个时辰内，以军需官身份紧急下令将火船上的浸油麻布全部转移至自己直属仓库，禁止黄盖部未审即用，改由自己亲自调配沙船代替火船冲击曹阵，迫使火攻转为撞击破锁链。",
        "intent": "改变火攻方式：从燃烧转为撞击，打破铁索连船，使曹操水军提前溃散但无大面积火海。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令转移火船油布至直属仓库，调配沙船替代火船",
          "target": "火船上的浸油麻布，直属仓库，沙船队，黄盖部，曹军铁索阵",
          "deadline": "距曹军发现火船约半个时辰"
        },
        "instantEcho": {
          "directResult": "沙船撞击曹船阵，铁索崩断，曹船失去连锁，部分歪斜但未着火，曹操立即下令撤除铁索，水军阵型大乱。",
          "unexpectedCost": "油布转移中发生小火灾，烧毁后备粮草百担，军需官被周瑜以‘擅改军令’之由杖责三十，后由鲁肃担保留用。",
          "beneficiary": "曹军获得灭火灾难更小的损失，曹操得以率溃军北撤（但丧失统一机会）",
          "payer": "军需官承受杖责和名誉折损，孙刘联军失去赤壁大火象征意义"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "传令加快火船速度",
        "label": "在距曹军发现火船约半个时辰内，通过传令兵向黄盖旗舰传递军令，要求其剩余火船全部加挂侧帆并增加划手速率，务必在曹军侦察船返回前完成火攻阵列，确保火船按时抵达曹船阵。",
        "intent": "保留火船攻击路线、黄盖指挥权，仅由军需官通过传令加速进度，保持火攻结局。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "向黄盖旗舰传递书面军令，要求加挂侧帆、增加划手速率",
          "target": "黄盖旗舰，剩余火船，传令兵，曹军侦察船",
          "deadline": "距曹军发现火船约半个时辰"
        },
        "instantEcho": {
          "directResult": "火船全部提速，在曹军侦察船回禀前即已突入船阵，东风恰好转向，火势迅速蔓延，曹军惨败。",
          "unexpectedCost": "加挂侧帆过快导致两艘火船在转弯时倾覆，损失12名划手，军需官被追究‘操之过急’责任，罚俸半年。",
          "beneficiary": "孙刘联军主帅周瑜获得完整战役胜利，黄盖因功劳被记大功",
          "payer": "军需官承担罚俸和小部伤亡责任"
        }
      },
      {
        "id": "B",
        "displayLabel": "改火攻为投石",
        "label": "在距曹军发现火船约半个时辰内，以军需官身份紧急下令暂停所有火船出港，并将火船装载的硫磺、火油全部改用于自己直属的岸基投石机阵地，命令所部陈武组织向曹军船阵投掷火弹，使火攻从船载变为岸袭。",
        "intent": "改变火攻载体：从黄盖火船改为岸基投石机，打破东吴水军主力与火攻的绑定，使曹操误判攻击来源。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令暂停火船出港，将硫磺火油转运至岸基投石机阵地，命令陈武组织投掷火弹",
          "target": "火船，硫磺火油库存，岸基投石机阵地，陈武部，曹军船阵",
          "deadline": "距曹军发现火船约半个时辰"
        },
        "instantEcho": {
          "directResult": "投石机发射火弹，命中率极低，仅三成落入曹阵，但引发零星小火；曹军立即调整阵型，利用风向反扑，东吴水师后续登陆计划受挫。",
          "unexpectedCost": "火油搬运中发生爆炸，炸毁两台投石机，伤二十人；周瑜当众斥责军需官，将其贬为杂帛校尉，失去军需管理权。",
          "beneficiary": "曹操获得喘息，成功收拢主力北撤至乌林西岸，保留近半水军",
          "payer": "军需官遭受降职处分，东吴水师因失败转向保守战略"
        }
      }
    ]
  },
  "dong-zhuo-lu-bu-190": {
    "trajectory": {
      "historicalPath": "董卓命令吕布护送百官与献帝出洛阳东门，关东联军尚远，董卓下令焚城。吕布执行董卓命令，未生变故。两年后，吕布与王允合谋杀死董卓。",
      "preservedResult": "董卓强迫汉献帝与百姓迁往长安并焚毁洛阳；两年后，吕布与王允合谋杀死董卓。",
      "decisiveFork": "吕布是否继续执行董卓的命令，护送百官出城并放任焚城。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "保全董卓焚城令",
        "label": "你快步走到传令兵前，大声宣布：‘奉董太师令，火速传令各门守军：即刻点燃城内所有可燃之物，不得延误！吕布将军负责护送圣驾与百官，任何阻挠者格杀勿论！’并亲手将火把掷入附近民宅。",
        "intent": "确保火势迅速蔓延，全城陷入火海。吕布护送献帝与百官从东门出城，毫无阻碍",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "传令并掷火把",
          "target": "传令兵与民宅",
          "deadline": "一刻钟内"
        },
        "instantEcho": {
          "directResult": "火势迅速蔓延，全城陷入火海。吕布护送献帝与百官从东门出城，毫无阻碍。",
          "unexpectedCost": "你被一名门吏认出是王允旧部，但未当场发作。",
          "beneficiary": "董卓",
          "payer": "洛阳百姓"
        }
      },
      {
        "id": "B",
        "displayLabel": "当众揭露董卓毒计",
        "label": "你跃上马车顶部，向百官大喊：‘董卓要焚烧洛阳，并命吕布将献帝与百官骗至长安后全部屠杀！王司徒已备好勤王之师，吕布将军，你还要助纣为虐吗？’同时将王允的手令抛向吕布。",
        "intent": "改变吕布与董卓的命令关系，煽动吕布当场反水，阻止焚城和迁都。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "大喊并抛手令",
          "target": "百官与吕布",
          "deadline": "一刻钟内"
        },
        "instantEcho": {
          "directResult": "吕布接令后犹豫，董卓卫队立即放箭。你中箭倒地，但吕布最终下令反攻董卓车驾，焚城令中止。",
          "unexpectedCost": "董卓在护卫下逃往未央宫，吕布控制东门，但城中开始失控。你左肩中箭，血流不止。",
          "beneficiary": "吕布",
          "payer": "你"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "伪造联军急报",
        "label": "你伪造一份关东联军急报，声称袁绍已率五万精兵隐蔽渡河，即将突袭洛阳南门。你将此信故意遗落在董卓帐前，促使董卓加速焚城并命令吕布提前出发。",
        "intent": "利用联军情报促使董卓更快行动，确保焚城和吕布护送如期进行。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "遗落伪造军报",
          "target": "董卓帐前",
          "deadline": "一刻钟内"
        },
        "instantEcho": {
          "directResult": "董卓怒撕军报，下令即刻点火并催促吕布出城。城门已封，迁都队伍准时出发。",
          "unexpectedCost": "你的伪造行动被一名书吏察觉，但未及告发。",
          "beneficiary": "董卓",
          "payer": "书吏"
        }
      },
      {
        "id": "B",
        "displayLabel": "劫持玉玺促吕布倒戈",
        "label": "你趁乱潜入献帝车驾，偷出传国玉玺，然后对吕布说：‘玉玺在此，奉陛下密诏：吕布将军即日起为大汉讨逆大将军，诛杀董贼！’并高举玉玺。",
        "intent": "利用玉玺的象征意义，改变吕布的效忠对象，阻止其护送董卓计划。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "偷玉玺并传诏",
          "target": "传国玉玺与吕布",
          "deadline": "一刻钟内"
        },
        "instantEcho": {
          "directResult": "吕布见状下拜，随即率亲兵包围董卓车驾。董卓被迫退入城中，焚城失败，迁都中止。",
          "unexpectedCost": "董卓残部追杀你，你身中两箭，跳入洛水逃脱，玉玺在混乱中落入水中。",
          "beneficiary": "吕布与献帝",
          "payer": "你"
        }
      }
    ]
  },
  "guandu-wuchao-200": {
    "trajectory": {
      "historicalPath": "军情参议在曹操面前力证许攸可信，并敦促曹操立即亲率精锐夜袭乌巢，在袁绍援军抵达前烧毁其粮仓。",
      "preservedResult": "曹操采纳许攸建议，亲率精锐烧毁乌巢粮仓，袁军军心崩溃，官渡之战由此逆转。",
      "decisiveFork": "曹操是否在袁绍援军到达乌巢前亲率精锐出发烧粮。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "持许攸信物请曹操亲征",
        "label": "你取出许攸带来的袁绍亲笔调粮令和佩玉，在曹操面前跪呈并高声说：‘此令正发往乌巢，三更前烧粮必破袁军。’",
        "intent": "通过呈交许攸叛逃证据，推动曹操立即执行夜袭乌巢的史实行动。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "跪呈许攸带来的调粮令与佩玉，请求曹操即刻亲率精兵火攻乌巢粮仓",
          "target": "曹操",
          "deadline": "袁军下一批粮车进入乌巢之前"
        },
        "instantEcho": {
          "directResult": "曹操接过信物，立即下令徐晃、史涣率步骑五千人夜袭乌巢，火起时袁军大乱。",
          "unexpectedCost": "许攸因献计匆忙，未及核对袁军口令细节，导致曹军前锋在乌巢寨外遭伏击损失三百人。",
          "beneficiary": "曹操",
          "payer": "曹军前锋营士卒"
        }
      },
      {
        "id": "B",
        "displayLabel": "命曹仁护粮队堵乌巢道口",
        "label": "你拦住曹操：‘乌巢存粮不足袁军三日，若烧其粮，袁绍必派张郃夺回；不如命曹仁率虎豹骑抢先占据乌巢南道，专截袁军粮道，逼其退兵。’",
        "intent": "改变曹操亲烧乌巢的行动链，改为占据粮道断粮的围点打援策略。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "出兵占据乌巢南道，专截袁绍后续粮队而不烧现粮",
          "target": "曹仁",
          "deadline": "袁绍得知乌巢被袭前"
        },
        "instantEcho": {
          "directResult": "曹仁占据道口后劫获袁军两批粮车，袁绍派张郃、高览反攻却被曹军夹击，袁军阵脚动摇。",
          "unexpectedCost": "乌巢内原粮仓未被烧毁，袁绍分兵夜袭曹军大营，曹洪险些失守。",
          "beneficiary": "曹操（保存精锐主力）",
          "payer": "曹洪守营部队"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "令荀攸调霹雳车助攻乌巢",
        "label": "你向曹操建议：‘许攸可信，但乌巢寨墙坚固，请命荀攸连夜将霹雳车推至乌巢东侧，配合火攻破墙。’",
        "intent": "用霹雳车强化而非改变曹操亲烧乌巢的史实结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令将霹雳车调往乌巢东侧，轰击寨墙配合火攻",
          "target": "荀攸",
          "deadline": "曹军前锋抵达乌巢前"
        },
        "instantEcho": {
          "directResult": "霹雳车砸开乌巢寨墙多处，火势延烧更快，袁军护粮官淳于琼被擒。",
          "unexpectedCost": "霹雳车移动声响惊动袁绍斥候，导致袁军早半刻派援兵，曹军殿后部队被冲散。",
          "beneficiary": "曹操（更快攻破乌巢）",
          "payer": "曹军殿后队伍"
        }
      },
      {
        "id": "B",
        "displayLabel": "遣使联络袁绍部将蒋奇倒戈",
        "label": "你密见曹操：‘烧粮虽可破局，若遣人持许攸书信任命蒋奇为豫州刺史，诱其阵前倒戈，可免我军精锐损耗。’",
        "intent": "通过策反袁绍部将从内部瓦解，改变强攻乌巢的战术方向。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "派遣亲信携带许攸的劝降信与豫州刺史印绶，秘密联络蒋奇",
          "target": "蒋奇",
          "deadline": "袁军下一批粮车进入乌巢前"
        },
        "instantEcho": {
          "directResult": "蒋奇阵前反水，率本部两千人攻入袁绍中军，袁绍仓皇北逃，官渡之战提前结束。",
          "unexpectedCost": "蒋奇部属中仍有袁绍死忠引发内斗，导致曹军在追击时错射中许攸左臂。",
          "beneficiary": "曹操（以较小代价速胜）",
          "payer": "许攸（受伤）"
        }
      }
    ]
  },
  "yiling-222": {
    "trajectory": {
      "historicalPath": "刘备采纳连营建议，蜀军沿山林扎营七百里；陆逊利用炎热和连营发动火攻。",
      "preservedResult": "陆逊利用酷暑与连营发动火攻，蜀军大败，刘备退守白帝城并于次年病逝。",
      "decisiveFork": "是否坚持连营部署的决定点"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "呈报连营水源图",
        "label": "你作为参军，向刘备呈报连日勘察的水源分布图，并称山林间溪流充足，建议沿山势连营以利取水。刘备采纳，下令全军按此部署，不得移动。",
        "intent": "保留刘备连营的真实决策链，推动火攻条件成熟。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "呈报水源图并建议沿山势连营",
          "target": "刘备",
          "deadline": "今夜火攻到达前"
        },
        "instantEcho": {
          "directResult": "刘备下令全军沿山林连营，陆逊火攻条件实现。",
          "unexpectedCost": "你在火攻中被烧伤，但未丧命。",
          "beneficiary": "陆逊",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "强谏撤营回平地",
        "label": "你当着众将的面，拼命拉住刘备的马缰，大声反对连营，要求立即撤到开阔平地待敌。刘备虽犹豫，但最终采纳，蜀军连夜拔营后撤。",
        "intent": "改变刘备坚持连营的命令，避免火攻惨败。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "拉住马缰当众强谏撤营",
          "target": "刘备",
          "deadline": "今夜火攻到达前"
        },
        "instantEcho": {
          "directResult": "蜀军撤至平地，陆逊火攻扑空，两军对峙。",
          "unexpectedCost": "刘备当众斥责你扰乱军心，命你戴罪立功。",
          "beneficiary": "蜀汉全军",
          "payer": "你"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "斩杀逃兵立威",
        "label": "你发现三名士兵散布撤军谣言，为稳定军心，你当场下令将他们斩首，并提头向刘备报告。刘备赞你果断，连营部署不变。",
        "intent": "用严酷手段维护连营秩序，确保真实历史中蜀军无大规模哗变。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令斩杀三名逃兵",
          "target": "三名蜀军士兵",
          "deadline": "今夜火攻到达前"
        },
        "instantEcho": {
          "directResult": "军心暂稳，连营未变，陆逊火攻照常。",
          "unexpectedCost": "士兵亲属怨恨你，战后欲报复。",
          "beneficiary": "刘备",
          "payer": "你及三名逃兵"
        }
      },
      {
        "id": "B",
        "displayLabel": "烧毁连营军旗",
        "label": "你趁夜潜入堆放旗帜的营帐，放火烧毁所有蜀军军旗，造成混乱。刘备误以为吴军夜袭，下令各部向高地处集结，连营秩序大乱。",
        "intent": "通过制造混乱迫使刘备放弃连营，改变部署。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "放火烧毁军旗",
          "target": "蜀军军旗存放处",
          "deadline": "今夜火攻到达前"
        },
        "instantEcho": {
          "directResult": "蜀军混乱中撤出连营，陆逊火攻只烧到空营。",
          "unexpectedCost": "你被火势烧伤，被军法队怀疑纵火，刘备下令调查。",
          "beneficiary": "蜀汉主力",
          "payer": "你"
        }
      }
    ]
  },
  "jieting-228": {
    "trajectory": {
      "historicalPath": "在deadline前，你必须亲自将水源图交予马谡并确认他下令上山扎营，促成蜀军上山、被断水溃败。",
      "preservedResult": "马谡违背诸葛亮部署上山扎营，被张郃断绝水道后溃败，蜀汉第一次北伐被迫撤军。",
      "decisiveFork": "改变控制权：由你而非马谡决定扎营地点，强行执行王平主张的依水下寨，使蜀军不被断水。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "呈图确认上山令",
        "label": "你必须在今夜将水源图标定于山上扎营处，当面交予马谡并确认他下令全军上山扎营，确保张郃封锁水道后蜀军无水而溃。",
        "intent": "保留马谡上山扎营、王平劝阻无效、水道断绝的完整行动链，使actualHistory按时发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "亲持水源图面呈马谡，并口头确认其下令全军上山扎营",
          "target": "马谡",
          "deadline": "张郃骑兵封锁山下水道前（拂晓前）"
        },
        "instantEcho": {
          "directResult": "马谡接过水源图，随即下令全军按图上标记上山立寨。王平最后一次劝谏被驳回。",
          "unexpectedCost": "你因越级呈图被王平手下记恨，但命令已执行。",
          "beneficiary": "张郃",
          "payer": "马谡"
        }
      },
      {
        "id": "B",
        "displayLabel": "焚图夺令依水下寨",
        "label": "你必须在今夜烧毁已发出的水源图，并假传王平口令扣住上山调令，强制部队在城下有水源处立寨，直接改变马谡上山决定。",
        "intent": "改变控制权：由你而非马谡决定扎营地点，强行执行王平主张的依水下寨，结果上使蜀军不被断水。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "烧毁已发的水源图，并假传王平军令扣住上山调令，指挥前哨部队在城下水源处立寨",
          "target": "水源图、上山调令、前哨部队",
          "deadline": "张郃骑兵封锁山下水道前（拂晓前）"
        },
        "instantEcho": {
          "directResult": "前哨部队开始依水立寨，马谡闻讯大怒，派亲兵来抓你，但木已成舟。",
          "unexpectedCost": "你被马谡下令收押，面临军法处置。",
          "beneficiary": "王平",
          "payer": "你"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "换水源图上山立寨",
        "label": "你必须在今夜用另一份假水源图替换真图，图上标出山上仍有水源，诱使马谡坚持上山扎营，张郃断水道后蜀军溃败仍按时发生。",
        "intent": "使用同一行动链（马谡上山、断水溃败），但以换图代替呈图，杠杆不同。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "调换水源图，将山上假水源标记呈报马谡",
          "target": "水源图原件、马谡",
          "deadline": "张郃骑兵封锁山下水道前（拂晓前）"
        },
        "instantEcho": {
          "directResult": "马谡依假图上山，认为山上有水，张郃切断山下水源后蜀军无水可饮，溃败。",
          "unexpectedCost": "事后你被查出换图，虽未当场暴露，但后续诸葛亮追责时你被处斩。",
          "beneficiary": "张郃",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "假传王平令抢水道",
        "label": "你必须在今夜假传王平口令，派小队趁夜抢占山下水道关键位置，迫使马谡只能依水下寨，改变被断水的结果。",
        "intent": "改变命令方向：以抢占水道替代依水立寨，同样实现水源安全，但动作不同。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "假传王平口令，派出亲信小队连夜抢占山下水道制高点",
          "target": "王平口令、小队、山下水道制高点",
          "deadline": "张郃骑兵封锁山下水道前（拂晓前）"
        },
        "instantEcho": {
          "directResult": "小队控制水道，马谡见状只得改变命令依水下寨。张郃到达时无法断水。",
          "unexpectedCost": "你假传军令暴露，被王平杖责并革职，但水道已控。",
          "beneficiary": "王平、蜀军",
          "payer": "你"
        }
      }
    ]
  },
  "gaoping-tombs-249": {
    "trajectory": {
      "historicalPath": "曹爽陪同魏帝曹芳出城祭陵，司马懿发动政变控制洛阳，遣使送劝降信。曹爽在驿道犹豫后接受承诺，交出兵权返回洛阳，被处死。",
      "preservedResult": "曹爽接受司马懿只免官不追究的承诺，交出兵权回到洛阳，随后被以谋反罪处死，曹魏大权转入司马氏。",
      "decisiveFork": "劝降使者到达时，是否让曹爽收到劝降信并动摇其抵抗意志。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "递交劝降信",
        "label": "你在驿道旁亲手将司马懿的劝降信递交给曹爽，并陈述司马懿只免官不追究的承诺。",
        "intent": "确保曹爽收到劝降信并考虑投降，使历史按原轨发展。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "递交劝降信",
          "target": "曹爽",
          "deadline": "日落前"
        },
        "instantEcho": {
          "directResult": "曹爽阅读劝降信后陷入犹豫，召集亲信商议投降事宜。",
          "unexpectedCost": "你被曹爽亲信怀疑与司马懿有私交。",
          "beneficiary": "司马懿",
          "payer": "你和你的家族"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣留使者劝赴许昌",
        "label": "你扣留劝降使者，向曹爽力陈立即带皇帝转赴许昌，以天子诏令召集外军。",
        "intent": "改成曹爽犹豫不决，但同意暂不投降，命令部队准备向东移动",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "扣留使者并力劝转赴许昌",
          "target": "曹爽",
          "deadline": "日落前"
        },
        "instantEcho": {
          "directResult": "曹爽犹豫不决，但同意暂不投降，命令部队准备向东移动。",
          "unexpectedCost": "部分将领暗中派人向司马懿通风报信。",
          "beneficiary": "曹爽",
          "payer": "你及支持此计的同僚"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "宣读劝降信内容",
        "label": "你在曹爽面前大声宣读劝降信中关于免官保命的承诺，并建议接受以保全家族。",
        "intent": "通过公开宣读制造投降舆论，促使曹爽投降。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "宣读劝降信内容",
          "target": "曹爽及其亲信将领",
          "deadline": "日落前"
        },
        "instantEcho": {
          "directResult": "军中普遍认为投降可保平安，曹爽倾向投降。",
          "unexpectedCost": "你被主战派将领记恨。",
          "beneficiary": "司马懿",
          "payer": "主战派将领"
        }
      },
      {
        "id": "B",
        "displayLabel": "夺取符节矫诏调兵",
        "label": "你趁曹爽犹豫时，突然夺走其腰间的调兵符节，以天子名义下令部队向许昌进发。",
        "intent": "改成部队开始向许昌移动，但曹爽下令停止并收回符节",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "夺取符节并矫诏调兵",
          "target": "曹爽及其部队",
          "deadline": "日落前"
        },
        "instantEcho": {
          "directResult": "部队开始向许昌移动，但曹爽下令停止并收回符节。",
          "unexpectedCost": "曹爽以谋反罪名下令逮捕你。",
          "beneficiary": "曹爽的政敌",
          "payer": "你"
        }
      }
    ]
  },
  "feishui-383": {
    "trajectory": {
      "historicalPath": "保留真实历史中传令官执行后退命令的行动链，导致前秦军秩序崩溃。",
      "preservedResult": "前秦军后退时秩序崩溃，晋军趁势冲击，前秦统一南北的计划失败。",
      "decisiveFork": "改变命令方向：阻止后退命令下达，改为原地固守待晋军半渡而击，改变真实历史结果。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "传达后退，任由崩溃",
        "label": "在淝水西岸中军旗下，向朱序和各营传令兵大声重复苻坚命令：‘全军后退，让晋军渡水！’然后站立原地，不采取任何稳定军心的行动。",
        "intent": "保留真实历史中传令官执行后退命令的行动链，导致前秦军秩序崩溃。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "向朱序和各营传令兵传达苻坚‘全军后退，让晋军渡水’的口头命令，并保持不动。",
          "target": "朱序（前秦将领，负责传令）及各部传令兵",
          "deadline": "晋军渡河前的一刻钟"
        },
        "instantEcho": {
          "directResult": "朱序立即策马向各营传令，前秦军开始后退，但各部落军队自行其是，阵型混乱。晋军趁机渡水冲击，前秦军溃败。",
          "unexpectedCost": "你在乱军中失去苻坚信任，事后被追究‘传令不明’之责，被贬为马夫。",
          "beneficiary": "东晋谢玄、谢石等将领",
          "payer": "你（失去职位和名誉）"
        }
      },
      {
        "id": "B",
        "displayLabel": "拒绝传令，就地固守",
        "label": "在淝水西岸中军旗下，向苻坚单膝跪地高喊：‘陛下不可！我军势大，先登强弩，待晋军半渡而击，必获全胜！’随后拒绝向全军传达后退命令，并拔剑指向东晋军阵方向，高呼‘前秦将士，准备迎战！’",
        "intent": "改变命令方向：阻止后退命令下达，改为原地固守待晋军半渡而击，改变真实历史结果。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "向苻坚进谏并拒绝传达后退命令，拔剑指示将士准备迎敌。",
          "target": "苻坚（前秦皇帝）及全军将士",
          "deadline": "晋军渡河前的一刻钟"
        },
        "instantEcho": {
          "directResult": "苻坚犹豫片刻后采纳建议，取消后退命令。前秦军稳住阵脚，待晋军半渡时万箭齐发、铁骑冲阵，东晋前锋被歼，淝水之战前秦胜。",
          "unexpectedCost": "你在军中威信大增，但苻坚疑你‘越权擅令’，战后将你调离亲兵卫队，发配到偏远州郡任闲职。",
          "beneficiary": "苻坚和前秦统一计划",
          "payer": "你（失去皇帝信任，远离权力中心）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "军鼓传令，加速溃败",
        "label": "在淝水西岸中军旗下，你命鼓手以三通急鼓为号，向全军传达‘后退’指令，同时命朱序督阵，严令各部依次后退，但故意不约束军纪，导致后退时机和速度失控。",
        "intent": "使用军鼓和朱序执行同一陷入混乱的后退行动链，确保崩溃结果不变。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命鼓手击鼓传令后退，并指令朱序督阵。",
          "target": "鼓手和朱序",
          "deadline": "晋军渡河前的一刻钟"
        },
        "instantEcho": {
          "directResult": "鼓声响起，前秦军开始后撤，但各部族军队争先恐后，阵型大乱。晋军渡河冲击，前秦溃败，伤亡惨重。",
          "unexpectedCost": "你因‘鼓令不当’被苻坚当众斥责，罚俸三年，但保留原职。",
          "beneficiary": "东晋军队",
          "payer": "你（经济损失和颜面尽失）"
        }
      },
      {
        "id": "B",
        "displayLabel": "斩使夺旗，擅改战令",
        "label": "在淝水西岸中军旗下，你突然拔刀斩杀东晋派来的劝降使者，夺其旌旗，对苻坚喊道：‘陛下请看，晋军已陷入恐慌！臣请率五千精骑偷渡上游，绕至敌后夹击！’随后自行率领本部兵马向上游移动。",
        "intent": "斩杀使者改变外交状态，自行率军袭击改变正面战场控制关系，改变真实历史结果。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "斩杀东晋使者并夺取旗帜，率本部五千骑兵向上游移动。",
          "target": "东晋使者、苻坚、你本部五千骑兵",
          "deadline": "晋军渡河前的一刻钟"
        },
        "instantEcho": {
          "directResult": "苻坚被你行动鼓舞，率主力正面佯攻牵制晋军。你率骑兵从上游渡河，突袭晋军侧翼，晋军阵脚大乱，前秦军全线反击，东晋大败。",
          "unexpectedCost": "你因擅自杀使破坏和谈可能，被慕容垂等鲜卑贵族记恨，日后遭暗算重伤。",
          "beneficiary": "苻坚和前秦军",
          "payer": "你（受伤，并结下仇敌）"
        }
      }
    ]
  },
  "sui-unification-589": {
    "trajectory": {
      "historicalPath": "在陈朝元会庆典当晚，你作为渡江统筹官，必须下令让隋军前锋船只从隐蔽江湾全部出动，趁陈军戒备松懈沿采石矶至京口段全线抢渡，并在天明前攻占石头城外围阵地。",
      "preservedResult": "隋军成功渡江并攻入建康，结束了近三百年的南北分裂。",
      "decisiveFork": "改变陈朝采石矶守备系统的命令方向，制造江防空隙，使隋军渡江阻力大减。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "下令全线渡江突袭",
        "label": "你直接向各船队旗舰发出明码信号：'鼓角齐鸣，全线渡江'。你本人乘指挥船率先离岸，不容任何迟疑。",
        "intent": "保留隋军趁元会渡江的真实行动链，由你以统筹官身份亲自下达不可撤销的启动命令。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "发出全线渡江的明码号令，并率先乘船渡江",
          "target": "隋军前锋各船队旗舰",
          "deadline": "589年1月元会当夜，陈军恢复城防前数小时"
        },
        "instantEcho": {
          "directResult": "隋军船队全线出动，陈朝沿江烽火台因元会庆典缺乏值守，未能及时示警。你的指挥船率先在采石矶登陆。",
          "unexpectedCost": "登陆时你的左脚被暗礁划伤，血流不止，短期影响行动。",
          "beneficiary": "隋军前锋部队",
          "payer": "你本人（轻伤）"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣押陈朝采石矶镇将",
        "label": "你利用提前策反的内应，在渡江前夜秘密潜入采石矶镇将赵彦深的府邸，以刀胁迫他写下手令：'今夜江防无事，守军可休'，并扣留他直到登陆完成。",
        "intent": "改变陈朝采石矶守备系统的命令方向，制造江防空隙，使隋军渡江阻力大减。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "挟持陈朝采石矶镇将赵彦深，迫使其写下夜间江防撤销的手令",
          "target": "陈朝采石矶镇将赵彦深",
          "deadline": "589年1月元会当夜，陈军恢复城防前数小时"
        },
        "instantEcho": {
          "directResult": "陈朝采石矶守军收到镇将亲笔手令后解除战备，隋军从采石矶渡江时未遇任何抵抗，登陆速度加快一倍。",
          "unexpectedCost": "赵彦深被扣押期间意外咬断自己舌头，无法再为陈朝效力，引发陈朝内部对他是否通敌的猜疑。",
          "beneficiary": "隋军渡江部队",
          "payer": "赵彦深（重伤，失去官职）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "点燃江面信号火炬",
        "label": "你命亲兵在江北岸按预定序列点燃三堆信号火炬，通知上游的贺若弼部趁夜启动渡江，同时命令下游韩擒虎部以火箭为号同步行动。",
        "intent": "使用信号火炬这一器物触发隋军各部的真实历史渡江行动链，由你以统筹官身份执行触发程序。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "点燃三堆信号火炬并发出火箭信号",
          "target": "贺若弼部与韩擒虎部",
          "deadline": "589年1月元会当夜，陈军恢复城防前数小时"
        },
        "instantEcho": {
          "directResult": "贺若弼部见火号后立即起锚，韩擒虎部以火箭回应，两路隋军几乎同时渡江，形成钳形攻势。",
          "unexpectedCost": "第三堆火炬因江风过大引燃旁边草料堆，火势蔓延烧毁了你所在指挥帐的备用船桨，后续渡河物资需临时调配。",
          "beneficiary": "贺若弼、韩擒虎两部",
          "payer": "你（物资损失）"
        }
      },
      {
        "id": "B",
        "displayLabel": "调换陈朝烽火令箭",
        "label": "你趁夜色潜入陈朝在江北岸的烽火台，用事先仿造的令箭替换其'遇警举火'的烽火令，改为'今夜元会，举火庆祝'，导致陈朝沿江烽火台在隋军渡江时误发庆典信号。",
        "intent": "改变陈朝烽火通信系统的命令链，使其传递错误信息，为隋军渡江创造隐蔽条件。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "仿造并替换陈朝烽火台的令箭，篡改信号含义",
          "target": "陈朝江北沿江烽火台",
          "deadline": "589年1月元会当夜，陈军恢复城防前数小时"
        },
        "instantEcho": {
          "directResult": "隋军渡江时，陈朝烽火台纷纷点燃'庆祝'信号，都城建康以为边境平安，直到隋军兵临城下才惊觉。",
          "unexpectedCost": "你替换令箭时不慎遗落自己的一枚隋军腰牌，被巡夜士兵捡到，次日陈朝展开搜捕，迫使你提前暴露身份转入地下。",
          "beneficiary": "隋军渡江部队",
          "payer": "你（身份暴露，被迫潜逃）"
        }
      }
    ]
  },
  "xuanwu-gate-626": {
    "trajectory": {
      "historicalPath": "你在李建成到达前拉下玄武门千斤闸，下令守军向任何靠近的东宫或齐王府人员射箭，使东宫援军无法进入，确保李世民伏击成功。",
      "preservedResult": "李世民在玄武门杀死李建成、李元吉，随后成为太子并即位为唐太宗。",
      "decisiveFork": "改变宫门启闭，使东宫兵力得以冲入并改变伏击结果。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "紧闭宫门阻援",
        "label": "你亲手拉下玄武门千斤闸，持槊喝令守军：凡靠近宫门者，无论何人，一律射杀。东宫将领冯立率兵赶到，被箭雨逼退，李建成、李元吉孤立无援，被李世民伏兵杀死。",
        "intent": "通过关闭宫门并武力拒止，使东宫援军无法介入，确保李世民伏击成功。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "拉下千斤闸并下令射杀任何靠近者",
          "target": "玄武门千斤闸及守军",
          "deadline": "李建成到达门前的一炷香内"
        },
        "instantEcho": {
          "directResult": "玄武门紧闭，东宫援军被挡在门外，李建成、李元吉被李世民及伏兵杀死。",
          "unexpectedCost": "事后被尉迟敬德责问未提前请示，虽未受罚但被调离禁军，降为队正。",
          "beneficiary": "李世民",
          "payer": "你（宫门校尉，被降职）"
        }
      },
      {
        "id": "B",
        "displayLabel": "开门纵敌冲阵",
        "label": "你悄悄打开玄武门侧门，放东宫将领冯立率五十精骑冲入，并指向李世民所在。冯立挥刀直取李世民，李建成乘乱逃脱，李世民阵脚大乱，未能杀死李建成，政变失败。",
        "intent": "改变援军方向，使东宫兵力直接冲击李世民阵线，挽救李建成。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "打开侧门并引导冯立骑兵冲击李世民",
          "target": "玄武门侧门及东宫将领冯立",
          "deadline": "李建成被杀前一刻"
        },
        "instantEcho": {
          "directResult": "冯立骑兵冲入，李世民阵脚大乱，李建成本人逃出重围，政变失败。",
          "unexpectedCost": "你被尉迟敬德发现，左臂中箭，但趁乱逃脱，被列为叛军，流亡河北。",
          "beneficiary": "李建成",
          "payer": "你（受伤流亡）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "假传军令滞留",
        "label": "你手持尉迟敬德令牌，骑马赶到东宫援军必经之路，假传命令说太子已入宫，令冯立原地待命。冯立迟疑间，玄武门事变结束，李建成、李元吉被杀。",
        "intent": "通过假传命令拖延东宫援军，确保历史结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "持令牌拦截冯立并命令他原地待命",
          "target": "东宫将领冯立及其亲兵",
          "deadline": "冯立率军抵达玄武门前"
        },
        "instantEcho": {
          "directResult": "冯立军滞留原地，李建成、李元吉孤立无援被杀。",
          "unexpectedCost": "你被冯立手下怀疑，射伤左腿，但成功拖到事变结束。",
          "beneficiary": "李世民",
          "payer": "你（受伤）"
        }
      },
      {
        "id": "B",
        "displayLabel": "暗告太子走密道",
        "label": "你提前派心腹向李建成密报玄武门有伏兵，并指明一条宫墙内密道。李建成得信后改变行程，从密道逃出长安，李世民伏击落空，太子集结兵力反攻，李世民被擒。",
        "intent": "改变结果使李建成存活，政变失败。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "派人密报李建成并指明逃生密道",
          "target": "李建成及密道入口",
          "deadline": "李世民伏击发动前"
        },
        "instantEcho": {
          "directResult": "李建成得信后改变行程，从密道逃出长安，李世民伏击落空，太子集结兵力反攻，李世民被擒。",
          "unexpectedCost": "你被尉迟敬德搜出密信证据，但趁乱逃出长安，被列为叛军，流亡河北。",
          "beneficiary": "李建成",
          "payer": "你（流亡）"
        }
      }
    ]
  },
  "wu-zetian-690": {
    "trajectory": {
      "historicalPath": "武则天授意凤阁舍人起草登基诏，明确不含李旦继承权，按时宣读，武周建立，李旦降为皇嗣。",
      "preservedResult": "武则天改国号为周并称帝，李旦降为皇嗣；神龙政变后李唐复辟。",
      "decisiveFork": "是否在诏书正本中加入李旦的继承权条款，在则天门宣读前一刻决定宗法传承方向。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "按武则天意录诏",
        "label": "你在誊录登基诏时，采用武则天口授的‘立武氏为嗣’措辞，不提及李旦，将正本封存待宣，确保武则天称帝按时实行。",
        "intent": "让武则天称帝、李旦降为皇嗣的历史结果按时发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "在诏书正本上书写‘立武氏为嗣’，不写入李旦，并加盖凤阁印信，封存于金盒。",
          "target": "登基诏书正本、武则天、李旦",
          "deadline": "半个时辰后金简送则天门宣读前"
        },
        "instantEcho": {
          "directResult": "诏书按时宣读，武则天即皇帝位，改唐为周，李旦降为皇嗣。",
          "unexpectedCost": "武氏亲信暗示你不可多言，你在凤阁内被孤立。",
          "beneficiary": "武则天、武三思等武氏宗亲",
          "payer": "李旦及其身边侍从"
        }
      },
      {
        "id": "B",
        "displayLabel": "私录李旦为储君",
        "label": "你在誊录登基诏时，另写一份副本，明确加入‘皇嗣李旦为储君’条款，并趁无人注意将副本塞入则天门金简筒内，使宣读时出现两份矛盾文本。",
        "intent": "改变继承权安排，迫使公开争斗，阻止武氏诸王日后自然得势。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "秘密书写一份含‘皇嗣李旦为储君’的副本，藏入则天门金简筒。",
          "target": "金简筒、则天门、武则天、李旦",
          "deadline": "半个时辰后金简送则天门宣读前"
        },
        "instantEcho": {
          "directResult": "宣读时两份文本冲突，朝臣哗然，武则天被迫当场宣布李旦为皇位法定继承人，压制武氏诸王。",
          "unexpectedCost": "你被侍卫拿下，投入大理寺狱，但未及定罪即因武李冲突升级而被忽略。",
          "beneficiary": "李旦、李唐宗室",
          "payer": "你、武三思等武氏诸王"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "用旧印模糊继承",
        "label": "你取出前朝‘同凤阁鸾台平章事’旧印，在诏书上补盖一道‘兼知嗣君事’模糊印文，使诏书仍按武则天原意通过，但暗示继承问题留待后议。",
        "intent": "保留武则天称帝和李旦降为皇嗣的真实结果，仅增加一个无法执行的模糊声明。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "在诏书边角加盖‘兼知嗣君事’旧印，不改变正文。",
          "target": "登基诏书、武则天、李旦",
          "deadline": "半个时辰后金简送则天门宣读前"
        },
        "instantEcho": {
          "directResult": "诏书仍按时宣读，武则天称帝，李旦为皇嗣；旧印被李旦党视为未来希望，但无实际效力。",
          "unexpectedCost": "你因擅用旧印被罚俸一年，但未影响升迁。",
          "beneficiary": "武则天、李旦（象征性）",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "改赐姓武以乱储",
        "label": "你在誊录诏书时，将‘皇嗣李旦’改为‘皇嗣武旦’，暗示李旦改姓武，使武氏诸王无法以‘非武姓’质疑继承权，反而确立李旦为武周合法继承人。",
        "intent": "改变继承权，使李旦以武周宗室身份成为储君，破坏武氏诸王以改姓自立的基础。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "在诏书正本中将‘李旦’涂改为‘武旦’，并新盖凤阁印章。",
          "target": "登基诏书正本、武则天、李旦",
          "deadline": "半个时辰后金简送则天门宣读前"
        },
        "instantEcho": {
          "directResult": "诏书宣读后，李旦改姓武入嗣武周，被立为太子，武氏诸王争储失败，武则天虽怒但已宣告。",
          "unexpectedCost": "你被武氏党羽反扑，遭到御史弹劾，贬为外州司马。",
          "beneficiary": "李旦（现武旦）、武则天（周朝延续）",
          "payer": "你、武三思、武承嗣等武氏王"
        }
      }
    ]
  },
  "an-lushan-755": {
    "trajectory": {
      "historicalPath": "保留哥舒翰被迫出战的实际行动链，通过伪造情报推动相同结果。",
      "preservedResult": "哥舒翰被迫出关后大败，潼关失守，唐玄宗仓皇逃离长安。",
      "decisiveFork": "改变朝廷命令与哥舒翰防御策略的实际方向，让潼关得以坚守。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "伪造密报诱其出关",
        "label": "你连夜伪造一份朝廷密报，声称郭子仪已率军从井陉出发，三日内可抵潼关，请哥舒翰出关接应。你亲自将密报递入帅帐。",
        "intent": "保留哥舒翰被迫出战的实际行动链，通过伪造情报推动相同结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "伪造并递交朝廷密报",
          "target": "哥舒翰",
          "deadline": "次日拂晓前"
        },
        "instantEcho": {
          "directResult": "哥舒翰相信密报，下令次日天明全军出关迎敌。潼关守军倾巢而出。",
          "unexpectedCost": "负责传递的斥候察觉异常，但未声张，事后可能被调查。",
          "beneficiary": "安禄山叛军",
          "payer": "潼关守军及哥舒翰"
        }
      },
      {
        "id": "B",
        "displayLabel": "斩杀使臣拒不出战",
        "label": "你假传哥舒翰军令，在潼关城头斩杀朝廷派来催促出战的使臣，并宣告‘再言出战者斩’，以断绝对外联系，迫使哥舒翰闭关坚守。",
        "intent": "改变朝廷命令与哥舒翰防御策略的实际方向，让潼关得以坚守。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "斩杀朝廷使臣并宣布军令",
          "target": "朝廷使臣及潼关守军",
          "deadline": "当日午时前"
        },
        "instantEcho": {
          "directResult": "使臣被斩，潼关与长安通信中断。哥舒翰被迫承担抗旨罪名，但坚守不出。叛军无法突破潼关，战线僵持。",
          "unexpectedCost": "你因违抗朝廷律法被哥舒翰逮捕，将押送长安问罪。",
          "beneficiary": "唐玄宗朝廷（暂时安全）",
          "payer": "军令参议（你）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "烧毁粮草迫其速战",
        "label": "你暗中点燃潼关东门外的粮草囤积处，制造叛军断我粮道的假象，使哥舒翰认为坚守已无意义，必须出关夺粮，从而在当日黄昏前下达出战令。",
        "intent": "使用另一逻辑（粮草被焚）迫使哥舒翰出战，保留潼关失守的历史结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "纵火烧毁自家粮草",
          "target": "潼关东门外粮囤",
          "deadline": "当日申时前"
        },
        "instantEcho": {
          "directResult": "粮草焚烧引发恐慌。哥舒翰认为后路已断，被迫于次日黎明出关决战。潼关空虚，叛军趁势攻占。",
          "unexpectedCost": "火势蔓延烧毁少量民房，你被军法处杖责二十。",
          "beneficiary": "安禄山叛军",
          "payer": "哥舒翰及潼关百姓"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣押圣旨以避出战",
        "label": "你趁夜色潜入使臣宿处，盗窃并销毁已送达的催战圣旨，同时伪造一份令哥舒翰‘据险固守、不得出战’的圣旨，替换入公文袋，使哥舒翰名正言顺坚守不出。",
        "intent": "改变朝廷指令内容，使固守命令替代出战命令，逆转历史结果。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "盗窃并替换催战圣旨",
          "target": "朝廷使臣携带的圣旨",
          "deadline": "当日亥时前"
        },
        "instantEcho": {
          "directResult": "哥舒翰见到新圣旨，立即撤销出关准备，固守潼关。叛军久攻不下，补给耗尽后撤。",
          "unexpectedCost": "你的盗窃行为被使臣随从发现，你被追杀，右臂中箭，不得不流亡。",
          "beneficiary": "长安朝廷及哥舒翰",
          "payer": "军令参议（你）"
        }
      }
    ]
  },
  "mawei-756": {
    "trajectory": {
      "historicalPath": "保留实际历史中禁军杀死杨国忠的行动链。",
      "preservedResult": "禁军杀死杨国忠并要求处死杨贵妃；唐玄宗被迫赐死杨贵妃，太子李亨随后北上并自行即位。",
      "decisiveFork": "改变真实历史中贵妃被赐死、太子暗中北上的结果。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "公开处决杨国忠",
        "label": "你在哗变士兵面前高喊杨国忠祸国，举刀亲手斩下其首级，并命令禁军将首级悬挂于旗杆之上。",
        "intent": "保留实际历史中禁军杀死杨国忠的行动链。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "公开处决杨国忠",
          "target": "杨国忠",
          "deadline": "愤怒的禁军已经包围驿馆，在士兵动手前"
        },
        "instantEcho": {
          "directResult": "杨国忠被斩首，禁军暂时停止冲击驿馆，要求处死杨贵妃。玄宗被迫赐死贵妃，太子李亨随后北上即皇帝位。",
          "unexpectedCost": "你被杨国忠亲信记恨，未来可能遭其党羽报复。",
          "beneficiary": "禁军士兵、唐玄宗（暂时平息哗变）、太子李亨",
          "payer": "杨国忠、杨贵妃"
        }
      },
      {
        "id": "B",
        "displayLabel": "护送贵妃太子分路",
        "label": "你在杨国忠被杀后，以传令军官身份假传圣旨，命令一队禁军护送杨贵妃向南入蜀，另一队护送太子李亨向东北上，并宣称皇帝将随后分路。",
        "intent": "改变真实历史中贵妃被赐死、太子暗中北上的结果。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "假传圣旨分路护送贵妃和太子",
          "target": "杨贵妃、太子李亨",
          "deadline": "在禁军要求处死贵妃且玄宗犹豫之际"
        },
        "instantEcho": {
          "directResult": "杨贵妃秘密被送往蜀中，太子李亨公开率军北上。玄宗虽怒但无法收回成命。禁军部分士兵追随太子，长安最终陷落，但太子提前在灵武宣布即位。",
          "unexpectedCost": "你因假传圣旨被玄宗下令追捕，成为逃犯。",
          "beneficiary": "杨贵妃（存活）、太子李亨（提前独立）",
          "payer": "你（被追捕）、唐玄宗（失去控制）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "伪造太子调兵令",
        "label": "你在哗变中秘密伪造太子李亨的手令，声称太子命令处决杨国忠并接管禁军，然后当众宣读，促使士兵立即动手。",
        "intent": "使用另一手段（伪造文书）实现真实历史中禁军杀杨国忠的结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "伪造并宣读太子调兵令",
          "target": "禁军将士、杨国忠",
          "deadline": "禁军包围驿馆、尚未动手杀人时"
        },
        "instantEcho": {
          "directResult": "禁军相信太子授意，杀死杨国忠并要求处死杨贵妃。玄宗被迫同意，贵妃被缢死于佛堂。太子李亨借势北上即位。",
          "unexpectedCost": "伪造手令之事被太子亲信察觉，你被太子视为潜在威胁。",
          "beneficiary": "太子李亨（获得合法性）、禁军",
          "payer": "杨国忠、杨贵妃、你（被太子猜忌）"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣押贵妃胁逼玄宗",
        "label": "你在禁军哗变中亲自带人冲入驿馆，将杨贵妃强行带至另一房间看押，然后向玄宗喊话：若不宣布太子监国并分兵北上，贵妃性命不保。",
        "intent": "改变真实历史中唐玄宗单独赐死贵妃、太子自行北上的结果。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "扣押杨贵妃并胁迫玄宗",
          "target": "杨贵妃、唐玄宗",
          "deadline": "在玄宗做出赐死决定之前"
        },
        "instantEcho": {
          "directResult": "玄宗被迫宣布太子李亨为天下兵马大元帅，北上抗敌。杨贵妃被释放并随玄宗继续入蜀。太子在灵武即位后，尊玄宗为太上皇。",
          "unexpectedCost": "你因胁逼君王被玄宗心腹记恨，未来可能被清算。",
          "beneficiary": "杨贵妃（存活并保持地位）、太子李亨（合法上位）",
          "payer": "唐玄宗（被迫分权）、你（被记恨）"
        }
      }
    ]
  },
  "chen-bridge-960": {
    "trajectory": {
      "historicalPath": "为了让actualHistory发生，掌书记必须在将士鼓噪唤醒赵匡胤之前，将一封伪造的边境告急文书送达后周朝廷，并确保赵匡胤在寝帐内静待将士拥入，从而接受黄袍。",
      "preservedResult": "赵匡胤接受黄袍，回师开封建立北宋，后周幼主退位。",
      "decisiveFork": "改变原先赵匡胤被动接受黄袍的轨道，改为主动脱离军营试图阻止政变结果。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "伪造军情送朝廷",
        "label": "你在将士鼓噪前，将事先写好的匈奴犯边告急文书加盖都指挥使印，派亲兵持令牌纵马连夜送往开封户部，并亲手将寝帐门帘垂下以阻隔喧哗。",
        "intent": "保留后周朝廷因虚假军情而信任赵匡胤率军出征的实际行动链，并确保将士拥入时赵匡胤仍在帐内。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "差遣亲兵持加盖印信的紧急奏报前往开封并放下帐帘",
          "target": "都指挥使印、后周朝廷、寝帐门帘",
          "deadline": "距离将士拥入寝帐不到一个时辰（即约两小时）"
        },
        "instantEcho": {
          "directResult": "朝廷收到边境告急后，立即下诏催促赵匡胤早日发兵，而寝帐内赵匡胤佯装醉酒未醒，至将士鼓噪而入。",
          "unexpectedCost": "你因私自调用都指挥使印，遭到军校王彦升当面质问，虽搪塞过去但已埋下不信任。",
          "beneficiary": "赵匡胤",
          "payer": "你（掌书记）"
        }
      },
      {
        "id": "B",
        "displayLabel": "提前唤醒送密信",
        "label": "你在将士鼓噪前，掏开寝帐后侧，摇晃赵匡胤肩膀使其惊醒，并将一封请求朝廷加急回防开封的密信塞入其怀，催促其赶在将士拥入前独自逃往东京。",
        "intent": "改变原先赵匡胤被动接受黄袍的轨道，改为主动脱离军营试图阻止政变结果。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "唤醒赵匡胤并递送密信劝其独自逃回开封",
          "target": "赵匡胤本人",
          "deadline": "距离将士拥入寝帐不到一个时辰（即约两小时）"
        },
        "instantEcho": {
          "directResult": "赵匡胤错愕中接过密信，刚起身披甲，副将张永德已率十余名亲兵掀帘而入，喝令‘请点检登基’。",
          "unexpectedCost": "赵匡胤当场将密信塞入炉火销毁，并当众怒斥你‘动摇军心’，将你锁在帐外马桩上。",
          "beneficiary": "张永德（因率先控制赵匡胤而成为新朝辅臣）",
          "payer": "你（遭囚禁，后续可能被清算）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "以符彦卿印发急报",
        "label": "你在将士鼓噪前，取用值夜副帅符彦卿的随身私印，以符宅名义向开封留守府发出‘北军哗变’密信，并安排火头军提前烧掉寝帐附近所有灯笼以延迟发现。",
        "intent": "使用不同的人物（符彦卿）和器物（私印、灯笼）来执行同一事实轨道：制造朝廷对赵匡胤军事实力的依赖，并保证赵匡胤寝帐被围时的被动状态。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "动用符彦卿私印写密信并烧掉灯笼",
          "target": "符彦卿私印、开封留守府、寝帐周边灯笼",
          "deadline": "距离将士拥入寝帐不到一个时辰（即约两小时）"
        },
        "instantEcho": {
          "directResult": "开封留守收到‘哗变’警报后，连夜派三百铁骑至陈桥驿外围待命，而寝帐因无灯火，将士摸黑拥入，赵匡胤被披上黄袍时仍睡眼惺忪。",
          "unexpectedCost": "符彦卿次日发现私印被动用，虽未声张，但日后刻意排挤你至边镇监军。",
          "beneficiary": "赵匡胤",
          "payer": "你（被符彦卿记恨）"
        }
      },
      {
        "id": "B",
        "displayLabel": "伪造帝诏令诛赵匡胤",
        "label": "你在将士鼓噪前，用携带的御赐空白轴卷自拟一份后周天子密诏，曰‘点检赵匡胤谋逆，就地诛杀’，加盖早年私刻的仿制御玺，策反殿前司副使李重进手书，并命心腹在将士鼓噪时高喊‘奉诏讨逆’。",
        "intent": "改变方向：以皇帝名义下令诛杀赵匡胤，试图阻断其黄袍加身的结局，并让李重进成为执行者。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "自拟并散布诛赵匡胤密诏",
          "target": "后周朝廷的空白轴卷、仿制御玺、李重进、心腹士卒",
          "deadline": "距离将士拥入寝帐不到一个时辰（即约两小时）"
        },
        "instantEcho": {
          "directResult": "李重进看到‘密诏’后率本部二十名弓箭手围住寝帐，引弓待发；但赵匡胤谋士赵普当众指出御玺印泥颜色不对，李重进迟疑间，张永德部已上前夺弓。",
          "unexpectedCost": "赵普喝令将你拿下，李重进因擅自动兵被当场削职，而赵匡胤为平息混乱立刻接受黄袍登基。",
          "beneficiary": "赵普（因挫败刺杀而获信任，成为首席幕僚）",
          "payer": "你（被押入囚车，不久后处决）"
        }
      }
    ]
  },
  "chanyuan-1004": {
    "trajectory": {
      "historicalPath": "你必须在辽使再次入营前，确保岁币誓书由冯拯起草、御宝封缄并交付曹利用带往辽营，使辽军如期撤退、盟约签订。",
      "preservedResult": "宋辽签订澶渊之盟，北宋提供岁币，两国维持了百余年总体和平。",
      "decisiveFork": "曹利用持誓书出发前，誓书内容是否为‘每岁银10万两、绢20万匹’且加盖御宝；若替换成其他版本或空白，则结果改变。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "授意冯拯草拟岁币誓书",
        "label": "你授意参知政事冯拯即刻在真宗御前按‘每岁银10万两、绢20万匹’起草誓书，并命入内内侍省都知周文质亲自持黄纸誊录、用御宝。",
        "intent": "保留实际历史中‘岁币条款由冯拯执笔、御宝封缄’的步骤，让誓书按时交付曹利用，启动和议。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "授意并监督冯拯起草誓书，命令周文质用御宝誊录",
          "target": "参知政事冯拯、入内内侍省都知周文质",
          "deadline": "辽使再次入营前两个时辰内"
        },
        "instantEcho": {
          "directResult": "冯拯在真宗面前铺纸挥毫，誓书半个时辰内草成；周文质取来天子印玺加盖完毕，装匣待发。辽使曹利用于期限前拿到国书文本。",
          "unexpectedCost": "你因越级调度内侍省，遭枢密副使王钦若冷眼，他在朝会上公开指责你‘以文臣夺枢密事权’。",
          "beneficiary": "宰相毕士安、参知政事冯拯、入内内侍省都知周文质",
          "payer": "你本人（遭枢密副使王钦若记恨）"
        }
      },
      {
        "id": "B",
        "displayLabel": "私嘱曹利用拒绝岁币条款",
        "label": "你在曹利用入辽营前一刻，将冯拯所拟岁币誓书扣下，换入一封空白誓书，密令他声称‘大宋天子只许和亲、绝不输币’。",
        "intent": "改成曹利用在辽帐展开空白誓书，辽圣宗当场震怒，和谈破裂，辽军重新部署攻城器械。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "扣下岁币誓书，换上空白誓书，密令曹利用拒绝岁币",
          "target": "曹利用（枢密院阁门祇候，和谈使者）",
          "deadline": "曹利用上马入辽营之前一炷香内"
        },
        "instantEcho": {
          "directResult": "曹利用在辽帐展开空白誓书，辽圣宗当场震怒，叱骂宋廷无诚意；辽将萧达凛余部拔刀欲斩来使，被韩德让拦住。和谈破裂，辽军重新部署攻城器械。",
          "unexpectedCost": "空白誓书事件激怒真宗，你被当殿褫夺官服，押送开封府狱待审；曹利用因临阵易书亦被下狱。",
          "beneficiary": "枢密副使王钦若（他得以推行迁都金陵的旧议）",
          "payer": "你本人（革职下狱）、曹利用（下狱，使节生涯中断）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "命殿帅高琼歃血立约",
        "label": "你直接骑马到澶州北城，传真宗口谕命殿前都指挥使高琼在阵前与辽军射雕手互写‘停战血书’，以将士歃血代替岁币文书。",
        "intent": "使用高琼—辽射雕手的军事盟誓程序，代替文官起草的岁币誓书，但仍实现辽军撤退、宋辽和平的结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "骑马到澶州北城，口头传达真宗授权，命令高琼与辽射雕手互写血书立停战约",
          "target": "殿前都指挥使高琼、辽军射雕手（信使）",
          "deadline": "辽使再次入营前一个时辰内"
        },
        "instantEcho": {
          "directResult": "高琼割破手腕，在旗布上写下‘宋辽互不犯界，即日退兵’；辽射雕手同样刺血画押。双方各取一份旗布，辽军当晚开始拔寨北撤。",
          "unexpectedCost": "血书无岁币数额，辽圣宗撤军后派使者质问‘血书是否加银绢’；真宗须额外遣使解释，你因擅传口谕被罚一年俸禄。",
          "beneficiary": "殿前都指挥使高琼（声望大涨，被士兵称为‘血旗将军’）",
          "payer": "你本人（罚俸一年、禁绝朝会三个月）"
        }
      },
      {
        "id": "B",
        "displayLabel": "焚毁和议案牍绝岁币",
        "label": "你密召入内内侍省都知周文质，命他趁真宗午睡时，将中书房内所有‘岁币’‘关市’条陈、曹利用往来信函以及辽使国书全部投入行宫炭炉烧毁。",
        "intent": "通过销毁所有和议文件，彻底阻断‘岁币换和平’的历史道路，迫使真宗在无案可查时只能选择战或另议。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "密令周文质焚烧中书房全部岁币谈判文件",
          "target": "入内内侍省都知周文质、中书房收藏的岁币草案与辽使国书",
          "deadline": "真宗午睡结束、下午朝会开始前"
        },
        "instantEcho": {
          "directResult": "周文质将炭火盆踢翻引燃帘幕，行宫北厢起火；救火后发现所有和议草稿已成灰烬。真宗大惊，辽使见烟火逼营以为宋军纵火偷袭，辽圣宗急令全营拔寨后退五里。后续无和议文件可议，辽军误判后退后士气低落，月余自行撤兵，边境维持无约状态。",
          "unexpectedCost": "火势蔓延烧毁半座行宫，总管太监自尽谢罪；你因‘指使内侍纵火’罪名被流放崖州（今海南三亚）。",
          "beneficiary": "辽圣宗（因误判撤退，保留军事体面）、真宗（免去岁币负担）",
          "payer": "你本人（流放崖州）、周文质（因纵火处斩）、总管太监（自尽）"
        }
      }
    ]
  },
  "wang-anshi-1069": {
    "trajectory": {
      "historicalPath": "让青苗法全国推行诏令实际发出，形成真实历史中全国推行的开端。",
      "preservedResult": "青苗法随后在全国推行，旨在向农户提供低息贷款，但执行中也出现强制摊派与加息，引发长期党争。",
      "decisiveFork": "改变真实历史中立即全国推行的路线，改为五州或一府试点并公开利息。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "加盖省符发出诏令",
        "label": "你在今夜前，亲手将已签署的青苗法全国推行诏令盖上制置三司条例司省符，交给枢密院递送各路转运司，确保诏令按时发出。",
        "intent": "让青苗法全国推行诏令实际发出，形成真实历史中全国推行的开端。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "加盖省符并交付枢密院",
          "target": "青苗法全国推行诏令",
          "deadline": "今夜首批诏令送往各路转运司之前"
        },
        "instantEcho": {
          "directResult": "诏令立即由枢密院发出，即将在各路转运司张贴，青苗法正式进入全国推行阶段。",
          "unexpectedCost": "保守派知悉后，明日朝堂将出现激烈反对奏疏。",
          "beneficiary": "王安石及支持新法的官员",
          "payer": "你被卷入两派冲突，未来可能在升迁中受阻"
        }
      },
      {
        "id": "B",
        "displayLabel": "改为五州先行试点",
        "label": "你在今夜前，扣下全国推行诏令，改命开封府、应天府、大名府、真定府、京兆府五府先行试行青苗法，并令转运司将利息条款张贴于州县门墙。",
        "intent": "改变真实历史中立即全国推行的路线，改为在五州试点并公开利息。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "扣留原诏令，改发五府试行密令",
          "target": "青苗法全国推行诏令及五府转运司",
          "deadline": "今夜首批诏令送往各路转运司之前"
        },
        "instantEcho": {
          "directResult": "五府接到密令开始准备试点，利息数据将先行公开；其他各路暂未收到诏令。",
          "unexpectedCost": "神宗闻讯震怒，王安石指责你抗命，保守派则趁机攻讦条例司乱政。",
          "beneficiary": "保守派官员及农民（因利息透明）",
          "payer": "你遭神宗训斥，王安石将你外调的奏疏已草就"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "用新铸印信发出诏令",
        "label": "你在今夜前，取用条例司新铸的青苗法专用印信，代替原省符加盖于全国推行诏令，并亲自押送枢密院，确保诏令按时发出。",
        "intent": "使用不同器物（新铸印信）完成同一历史路径，让青苗法全国推行诏令实际发出。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "用新铸印信加盖并亲自押送枢密院",
          "target": "青苗法全国推行诏令及新铸印信",
          "deadline": "今夜首批诏令送往各路转运司之前"
        },
        "instantEcho": {
          "directResult": "诏令带着新印信发出，青苗法全国推行正式启动。",
          "unexpectedCost": "新印信的使用被保守派视为王安石擅权，引发朝议弹劾。",
          "beneficiary": "王安石及新法推行者",
          "payer": "你因擅用新印信被言官参奏，遭罚铜半年"
        }
      },
      {
        "id": "B",
        "displayLabel": "公开利息试推行",
        "label": "你在今夜前，扣下全国推行诏令，改命开封府界提点司在开封府辖下所有县份先行推行青苗法，并令各县将年息百分之二十的条款刻碑立于县衙门前。",
        "intent": "改变真实历史中利息不透明的问题，改用开封一府试点并公开利息。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "扣留原诏令，改发开封府界提点司密令",
          "target": "青苗法全国推行诏令及开封府界提点司",
          "deadline": "今夜首批诏令送往各路转运司之前"
        },
        "instantEcho": {
          "directResult": "开封府各县接到密令，开始准备刻碑公示利息并试点放贷。",
          "unexpectedCost": "神宗认为你擅自改变圣意，将你交由御史台勘问。",
          "beneficiary": "开封府百姓及保守派（因利息透明、范围受限）",
          "payer": "你被停职候审，王安石虽设法营救但已失信于神宗"
        }
      }
    ]
  },
  "jingkang-1127": {
    "trajectory": {
      "historicalPath": "你作为李纲旧部，在最后一夜协助主和派将领范琼确保宣德门按时开启，金军入城，二帝被俘。",
      "preservedResult": "北宋向金军屈服，徽、钦二帝及宗室被俘，北宋灭亡。",
      "decisiveFork": "是否在最后一夜阻止范琼开城，或自行接管城门防御。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "协助范琼开城门",
        "label": "你在最后一夜找到范琼，向他表示支持，并帮其清除宣德门内阻碍，确保次日凌晨城门开启，金军直接入城。",
        "intent": "保留范琼开城的行动链，使金军按时入城，二帝被俘。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "找到范琼，表示支持，清除宣德门内阻碍",
          "target": "范琼",
          "deadline": "金军要求宋帝出城议和前的最后一夜"
        },
        "instantEcho": {
          "directResult": "范琼开启宣德门，金军涌入，二帝被俘，北宋灭亡。",
          "unexpectedCost": "你被后世史书列为叛国者，遭赵构政权追捕，流亡南方。",
          "beneficiary": "金军统帅完颜宗翰",
          "payer": "你（被追捕流亡）"
        }
      },
      {
        "id": "B",
        "displayLabel": "杀范琼夺门抗金",
        "label": "你在最后一夜密会主战官兵，突袭宣德门东角楼，亲手斩杀范琼，夺下城防印信，下令全军死守、拒绝议和。",
        "intent": "改变范琼开城的命令方向，由投降转为抵抗，阻止金军入城。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "密会主战官兵，突袭宣德门东角楼，斩杀范琼，夺下城防印信，下令死守",
          "target": "范琼",
          "deadline": "金军要求宋帝出城议和前的最后一夜"
        },
        "instantEcho": {
          "directResult": "宣德门紧闭，军民准备抵抗，金军暂缓攻城，但城内主和派联合郭京等势力反扑。",
          "unexpectedCost": "你被主和派设计围捕，受伤后被迫逃离汴京，流亡途中遭金军追捕。",
          "beneficiary": "守城军民（暂时避免被俘）",
          "payer": "你（重伤流亡）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "假传圣旨开城门",
        "label": "你利用留在城内的文书空白，伪造一道皇帝口谕，命宣德门守将张叔夜开城纳贡，守将迟疑后依令开启城门。",
        "intent": "使用伪造皇帝口谕的方式，确保投降结果按时发生，二帝被俘。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "伪造皇帝口谕，命张叔夜开城纳贡",
          "target": "宣德门守将张叔夜",
          "deadline": "金军要求宋帝出城议和前的最后一夜"
        },
        "instantEcho": {
          "directResult": "张叔夜依令开城，金军入城俘获二帝。",
          "unexpectedCost": "你被李纲旧部识破伪造，遭其追杀，被迫逃离汴京。",
          "beneficiary": "金军",
          "payer": "你（被追杀）"
        }
      },
      {
        "id": "B",
        "displayLabel": "焚尽粮草逼决战",
        "label": "你在最后一夜带人焚烧城内太仓和草料场，并破坏水门绞盘，制造无法守城的绝境，迫使主和派与军民一道出城与金军决战。",
        "intent": "改成城内生存资源断绝，主和派失势，军民被迫出城与金军激战，二帝未出城。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "带人焚烧太仓和草料场，破坏水门绞盘",
          "target": "城内太仓、草料场、水门绞盘",
          "deadline": "金军要求宋帝出城议和前的最后一夜"
        },
        "instantEcho": {
          "directResult": "城内恐慌，主和派失势，军民被迫出城与金军激战，二帝未出城。",
          "unexpectedCost": "你因纵火和破坏被部分军民憎恨，遭汴京府尹通缉，且金军攻破外城后屠城报复。",
          "beneficiary": "被迫出战的军民（避免了被俘命运）",
          "payer": "你（被通缉）"
        }
      }
    ]
  },
  "yue-fei-1140": {
    "trajectory": {
      "historicalPath": "岳飞于1140年7月郾城大捷后，接连收到金牌班师诏，被迫下令撤军，北伐功亏一篑。",
      "preservedResult": "岳飞被迫班师，收复中原的攻势中断，次年被解除兵权并下狱。",
      "decisiveFork": "机宜官是否在金牌到达后立即执行班师命令，还是设法推迟或改变该命令的执行。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "跪接金牌哭令班师",
        "label": "你跪接金牌，当众哭告‘十年之力废于一旦’，并下令全军整装南撤，班师诏书即刻生效。",
        "intent": "执行实际历史中岳飞接诏后被迫班师的行动链，保留金牌、哭声、班师命令，使actualHistory按时发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "跪接金牌，当众哭告并下令班师",
          "target": "金牌诏书、郾城众将",
          "deadline": "下一道班师诏书到达前"
        },
        "instantEcho": {
          "directResult": "全军得知金牌严令，士气瓦解，开始拔营南撤。",
          "unexpectedCost": "你因哭告泄露军机，被监军弹劾‘惑乱军心’。",
          "beneficiary": "南宋朝廷主和派秦桧",
          "payer": "岳家军全体将士"
        }
      },
      {
        "id": "B",
        "displayLabel": "截扣金牌下令北进",
        "label": "你在营外截住金牌使臣，以‘军务繁忙’为由暂扣金牌，并传令三军‘明日寅时拔营北进’。",
        "intent": "改成岳家军连夜整军，次日寅时拔营北进，直指朱仙镇",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "截住金牌使臣，私扣金牌，下令北进",
          "target": "金牌使臣、金牌诏书、郾城三军",
          "deadline": "下一道班师诏书到达前"
        },
        "instantEcho": {
          "directResult": "岳家军连夜整军，次日寅时拔营北进，直指朱仙镇。",
          "unexpectedCost": "金牌使臣逃脱，私扣金牌之事被快马报往临安。",
          "beneficiary": "岳飞及主张北伐的将领",
          "payer": "你作为抗旨首犯"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "摔碎金杯泣血班师",
        "label": "你取出御赐‘精忠报国’金杯，当众摔碎，怒斥‘此杯误国’，随后取出帅印泣血下达班师令。",
        "intent": "使用不同器物执行同一历史轨道，让班师发生，但以激烈方式强化被迫感。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "摔碎金杯，怒斥，取出帅印下达班师令",
          "target": "金杯、帅印、郾城众将",
          "deadline": "下一道班师诏书到达前"
        },
        "instantEcho": {
          "directResult": "众将震惊，有人痛哭，但仍遵令班师，队伍次日南撤。",
          "unexpectedCost": "摔碎御赐金杯，被朝廷视为‘怨望’，事后追责。",
          "beneficiary": "南宋主和派",
          "payer": "你及摔杯事件中被牵连的侍卫"
        }
      },
      {
        "id": "B",
        "displayLabel": "伪造捷报暂缓班师",
        "label": "你模仿岳飞笔迹，伪造一份‘郾城大捷斩首万级’的急递，命亲兵星夜送交临安枢密院，同时建议岳飞‘以捷报在途为由，暂不拆封金牌’。",
        "intent": "改成岳飞采纳建议，金牌暂不拆封，军队继续北进至朱仙镇",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "伪造捷报，模仿笔迹，命亲兵送枢密院，建议岳飞暂缓拆封金牌",
          "target": "捷报文书、亲兵、岳飞、枢密院",
          "deadline": "下一道班师诏书到达前"
        },
        "instantEcho": {
          "directResult": "岳飞采纳建议，金牌暂不拆封，军队继续北进至朱仙镇。",
          "unexpectedCost": "伪造笔迹被岳飞幕僚识破，你被囚禁于军中。",
          "beneficiary": "岳飞及北伐军",
          "payer": "你被视作‘矫诏’嫌疑犯"
        }
      }
    ]
  },
  "diaoyu-1259": {
    "trajectory": {
      "historicalPath": "王坚的投石机指挥官遵照命令，用投石机击中蒙哥汗所在高地，致其死亡。",
      "preservedResult": "蒙哥汗在围城期间死去，蒙古西征与南宋战线调整，帝国陷入汗位争夺。",
      "decisiveFork": "是否在蒙哥汗亲自巡视前沿时集中全部投石机攻击其所在高地"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "石弹如雹落山顶",
        "label": "在蒙哥汗所处高地未及遮蔽前，下令全部投石机发射石弹，击毙蒙哥汗及其护卫。",
        "intent": "保留历史结果：蒙哥汗被击毙，蒙古西征终止，汗位争夺开始。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令所有投石机向蒙哥汗所在高地齐射石弹",
          "target": "蒙哥汗及其高地前沿",
          "deadline": "蒙古护卫搭起遮蔽前（数分钟内）"
        },
        "instantEcho": {
          "directResult": "石弹击中高地，蒙哥汗与多名护卫当场死亡。",
          "unexpectedCost": "投石机位置暴露，遭蒙古回回炮反击，损失三台投石机及半数操作手。",
          "beneficiary": "南宋朝廷",
          "payer": "投石机部队"
        }
      },
      {
        "id": "B",
        "displayLabel": "石弹偏左留汗命",
        "label": "在蒙哥汗所处高地未及遮蔽前，下令投石机全部射向左前方假目标，使蒙哥汗安全撤离。",
        "intent": "改成石弹落空，蒙哥汗迅速后撤至安全处，未受伤",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令投石机全部向左前方无人高地齐射石弹",
          "target": "左前方假目标高地",
          "deadline": "蒙古护卫搭起遮蔽前（数分钟内）"
        },
        "instantEcho": {
          "directResult": "石弹落空，蒙哥汗迅速后撤至安全处，未受伤。",
          "unexpectedCost": "王坚派人责问你为何射偏，你被记过一次，投石机暂时交由副手指挥。",
          "beneficiary": "蒙古帝国（蒙哥汗）",
          "payer": "你（失去部分指挥权）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "火箭引燃粮草堆",
        "label": "在蒙哥汗所处高地未及遮蔽前，命令弓弩手向该高地发射火箭，引发火灾，烧死蒙哥汗。",
        "intent": "使用不同于砸击的武器（火箭）实现同一历史结果：蒙哥汗死亡。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令弓弩手向蒙哥汗所在高地发射火箭",
          "target": "蒙哥汗及其高地前沿",
          "deadline": "蒙古护卫搭起遮蔽前（数分钟内）"
        },
        "instantEcho": {
          "directResult": "火箭引燃高地草木，蒙哥汗被大火吞噬死亡。",
          "unexpectedCost": "大火引发山火，烧毁部分城外树林，蒙古军暂时后撤，但你也因擅自指挥弓弩手被王坚责骂。",
          "beneficiary": "南宋朝廷",
          "payer": "你（受责骂，但未撤职）"
        }
      },
      {
        "id": "B",
        "displayLabel": "石弹射向蒙古旗",
        "label": "在蒙哥汗所处高地未及遮蔽前，下令投石机全部射向蒙哥汗所在高地，但提前调低仰角，使石弹越过蒙哥汗落在其后，震慑而不杀死。",
        "intent": "改成石弹落在蒙哥汗身后十步，震伤数名护卫，蒙哥汗受惊但未伤",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令投石机调低仰角，石弹越过蒙哥汗落在其后区域",
          "target": "蒙哥汗后方区域",
          "deadline": "蒙古护卫搭起遮蔽前（数分钟内）"
        },
        "instantEcho": {
          "directResult": "石弹落在蒙哥汗身后十步，震伤数名护卫，蒙哥汗受惊但未伤。",
          "unexpectedCost": "你的抗命行为被王坚发现，立刻被撤职关押，投石机指挥权移交他人。",
          "beneficiary": "蒙古帝国（蒙哥汗存活）",
          "payer": "你（被关押，失去自由）"
        }
      }
    ]
  },
  "xiangyang-1273": {
    "trajectory": {
      "historicalPath": "你在吕文焕命令下率水军突围，遭遇元军回回炮轰击，船队溃散，物资沉没，你落水获救。",
      "preservedResult": "樊城失守后襄阳守将吕文焕投降，元军由此打开沿汉水与长江进攻南宋的通道。",
      "decisiveFork": "是否在突围中改变主舰航向或命令，影响后续战局。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "燃舰撞索送粮入城",
        "label": "你下令将旗舰“威捷号”和两艘千料大船装满干柴火油，点燃船首，全速冲向元军横江铁索，同时命令其余船只紧随其后。你亲自在“威捷号”上掌舵，撞断铁索后，将燃烧的船只抵在元军水寨旁，掩护补给船冲入襄阳水门。",
        "intent": "保留历史中的突围失败，但通过牺牲主舰完成物资输送，使吕文焕仍有决策空间。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令点燃旗舰“威捷号”和两艘千料大船，全速撞击元军横江铁索，并亲自掌舵撞断铁索，用燃烧船体掩护补给船冲入襄阳水门。",
          "target": "旗舰“威捷号”、两艘千料大船、元军横江铁索、襄阳水门",
          "deadline": "元军回回炮将在天亮后再次轰击樊城"
        },
        "instantEcho": {
          "directResult": "你撞断铁索，燃烧的船只阻挡了元军水寨，两艘补给船成功突入襄阳，但“威捷号”和千料大船全部焚毁，多数水军阵亡。回回炮随后轰击樊城，城墙出现缺口。",
          "unexpectedCost": "你被爆炸气浪抛入江中，获救后面部和手臂烧伤严重，短期内无法指挥。水军主力损失大半。",
          "beneficiary": "襄阳守将吕文焕获得粮药和火器补给",
          "payer": "你本人及麾下参与突击的水军将士"
        }
      },
      {
        "id": "B",
        "displayLabel": "劫持物资投献元营",
        "label": "你趁夜将运往襄阳的“顺济号”等五艘补给船上的押送官击杀，改航向驶入元军水寨，面见元将阿里海牙，献上全部物资、襄阳水文图以及吕文焕日常布防口令，并谎称吕文焕已决定不日投降，请元军暂缓攻城以安其心。",
        "intent": "改变突围行动为叛变，使元军获得补给与情报，加速襄阳投降进程。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "击杀押送官，改航向驶入元军水寨，向阿里海牙献上物资、水文图和布防口令，并谎称吕文焕即将投降。",
          "target": "“顺济号”等五艘船、押送官、元军水寨、阿里海牙、吕文焕布防口令",
          "deadline": "元军回回炮将在天亮后再次轰击樊城"
        },
        "instantEcho": {
          "directResult": "阿里海牙获得全部补给和情报，立即调整部署，次日一早用回回炮精准摧毁樊城与襄阳间浮桥，并派使者勒令吕文焕投降。",
          "unexpectedCost": "元军仍怀疑你，将你软禁在营中；吕文焕得知后愤怒下令全城戒严，内部出现猜忌。",
          "beneficiary": "元军元帅阿里海牙及其攻城部队",
          "payer": "你本人（被软禁）及南宋水军剩余部众（群龙无首）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "凿船沉江堵锁链",
        "label": "你命令部下凿沉“广济号”等三艘老旧船只于横江铁索上游，形成水下障碍，然后点燃船上的火器，利用爆炸使铁索松动。同时你率领轻舟分队携带火油，趁乱接近铁索，以斧头砍断关键连接点，让后续船队通过。",
        "intent": "使用不同工具（老旧船只沉没+火器爆炸+人力砍断）实现同样的输送物资结果，保留历史轨道。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令凿沉三艘老旧船只于铁索上游，点燃火器引发爆炸，随后率轻舟分队用火油和斧头砍断铁索。",
          "target": "“广济号”三艘船、横江铁索、元军水寨、轻舟分队",
          "deadline": "元军回回炮将在天亮后再次轰击樊城"
        },
        "instantEcho": {
          "directResult": "铁索被炸断并砍断，轻舟队掩护数艘补给船冲入襄阳，但老旧船只沉没造成航道变浅，后续大型船只无法通行。回回炮随后轰击樊城。",
          "unexpectedCost": "轻舟分队损失过半，你被元军箭矢射中左肩，虽获救但失血较多，需休养。",
          "beneficiary": "襄阳守将吕文焕获得部分补给",
          "payer": "你本人（受伤）及轻舟分队阵亡将士"
        }
      },
      {
        "id": "B",
        "displayLabel": "放火焚船嫁祸友军",
        "label": "你派亲信在友军“张氏水寨”的船底凿洞并纵火，造成张氏试图私通元军或叛逃的假象。你随即以“平叛”名义接管其船只，将其中精良者编入你的船队，然后公开宣布张氏船队已秘密投降元军，你将他们“处决”后，率船队北投元营，献上缴获的物资和张氏的投诚文书（你伪造的）。",
        "intent": "改变真实历史中的突围行动为借剿叛之名行叛变之实，使元军获得更多物资并加深南宋内部猜忌。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "派亲信凿沉友军船只并纵火，栽赃其叛变，随后以平叛为名接管其船队，率船北投元军，献上物资和伪造的投诚文书。",
          "target": "友军张氏水寨及其船只、张氏投诚文书（伪造）、元军水寨",
          "deadline": "元军回回炮将在天亮后再次轰击樊城"
        },
        "instantEcho": {
          "directResult": "元军获得更多船只和物资，阿里海牙赞赏你的计谋，但要求你交出张氏船队剩余水手。次日回回炮摧毁樊城浮桥，吕文焕得知后下令逮捕所有与张氏有关的将领，水军内部哗然。",
          "unexpectedCost": "张氏部下部分逃脱并投奔吕文焕，揭露你的阴谋，吕文焕发布对你的悬赏令。你被元军严格看管，失去行动自由。",
          "beneficiary": "元军元帅阿里海牙",
          "payer": "你本人（被元军怀疑和限制自由）及张氏水寨无辜将士"
        }
      }
    ]
  },
  "yamen-1279": {
    "trajectory": {
      "historicalPath": "你在元军总攻前不砍断连接幼帝座船的缆绳，并下令各船禁止解缆，确保舰队保持连环阵型，使元军突破后陆秀夫负幼帝蹈海。",
      "preservedResult": "宋军连环舰队被元军突破，陆秀夫负幼帝蹈海，南宋灭亡。",
      "decisiveFork": "是否在元军总攻前砍断连接幼帝座船的缆绳以保留突围通道"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "传令禁解缆，保连环阵",
        "label": "在元军总攻前，你朝着传令兵厉声喊道：‘传我将令：任何船只不得砍断缆绳，违令者斩！’随后你亲手将砍缆刀投入海中，转身站回指挥位置。",
        "intent": "通过下达禁砍令并销毁工具，确保连环阵型不被破坏，使得元军突破后陆秀夫负帝蹈海发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令禁止砍断缆绳并丢弃砍缆刀",
          "target": "传令兵及周围士兵",
          "deadline": "元军总攻前"
        },
        "instantEcho": {
          "directResult": "缆绳未被砍断，舰队保持连环阵型。元军总攻后突破防线，陆秀夫负幼帝蹈海，南宋灭亡。",
          "unexpectedCost": "你因执行命令而被张世杰记功，但随后在混战中落水失踪。",
          "beneficiary": "元军统帅张弘范",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "抗命断缆，留突围路",
        "label": "在元军总攻前，你拔出腰刀，奋力砍断连接旗舰与幼帝座船的缆绳，同时对周围士兵大吼：‘解开各船缆绳，准备从北面突围！’",
        "intent": "通过砍断关键缆绳改变连环阵型，为幼帝保留突围通道，防止蹈海结局。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "砍断连接旗舰与幼帝座船的缆绳",
          "target": "连接旗舰与幼帝座船的缆绳",
          "deadline": "元军总攻前"
        },
        "instantEcho": {
          "directResult": "缆绳断开，幼帝座船脱离连环阵型，但元军箭矢如雨，座船被击中起火，开始下沉。",
          "unexpectedCost": "张世杰发现后怒令亲兵射杀你，你身中三箭落海。",
          "beneficiary": "幼帝赵昺（暂时脱离连环阵）",
          "payer": "你"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "拖延传令，纵敌突破",
        "label": "在元军总攻前，张世杰亲兵传令‘各船保持连环，不得解缆’时，你接过令旗却故意绕路，先到船尾假装检查缆绳，等元军总攻开始后才将令旗举起示意。",
        "intent": "通过故意延误传令，但最终命令仍被执行，维持连环阵型，使得元军突破导致陆秀夫负帝蹈海。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "故意绕路拖延传令直到元军总攻开始",
          "target": "张世杰的传令令旗",
          "deadline": "元军总攻前"
        },
        "instantEcho": {
          "directResult": "命令传抵时元军已突破，各船仍连环未解，陆秀夫负帝蹈海。",
          "unexpectedCost": "张世杰战后追查传令延误，你被按军法处鞭刑三十，逐出舰队。",
          "beneficiary": "元军将士",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "煽动抢舵，变阵北逃",
        "label": "在元军总攻前，你冲向舵手，夺过舵轮，向右猛打使旗舰偏离航线，同时大喊：‘大家跟我往北冲！连环阵是死路！’",
        "intent": "通过抢夺舵轮改变旗舰航向，破坏连环阵型，为幼帝创造不同的逃生方向。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "抢夺舵轮改变旗舰航向",
          "target": "旗舰舵轮",
          "deadline": "元军总攻前"
        },
        "instantEcho": {
          "directResult": "旗舰突然转向，扯断连接幼帝座船的缆绳，连环阵出现缺口。元军趁机猛攻，混乱中幼帝座船被火箭击中，陆秀夫抱帝投海。",
          "unexpectedCost": "张世杰拔剑刺伤你肩膀，你被士兵制伏，投入海中。",
          "beneficiary": "元军（提前达成总攻目标）",
          "payer": "你"
        }
      }
    ]
  },
  "poyang-1363": {
    "trajectory": {
      "historicalPath": "朱元璋水军以火攻舟集中攻击陈友谅中军楼船，将其焚毁，陈友谅战死，舰队溃散。",
      "preservedResult": "朱元璋水军以火攻破坏陈友谅巨舰，最终赢得大战，奠定建立明朝的基础。",
      "decisiveFork": "是否将全部火攻舟投向陈友谅中军楼船，放弃翼侧保护。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "集中火攻中军楼船",
        "label": "你作为火药船营官，在风向稳定的一时辰内，命令全部火攻舟集中冲向陈友谅中军楼船，点火后弃船，放弃翼侧防护。",
        "intent": "保留实际历史中火攻集中于中军楼船的行动链，确保其被焚毁。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令全部火攻舟集中攻击陈友谅中军楼船",
          "target": "陈友谅中军楼船",
          "deadline": "日落前风向稳定的一个时辰内"
        },
        "instantEcho": {
          "directResult": "陈友谅中军楼船被火攻舟焚毁，陈友谅重伤，舰队指挥中断。",
          "unexpectedCost": "因放弃翼侧，陈军副舰突袭焚毁朱元璋两艘补给船。",
          "beneficiary": "朱元璋水军主力",
          "payer": "两艘补给船及部分火攻舟船员"
        }
      },
      {
        "id": "B",
        "displayLabel": "分兵火攻翼侧与中军",
        "label": "你作为火药船营官，在风向稳定的一时辰内，改变命令，将半数火攻舟调往左翼攻击陈军副舰，只留半数攻击中军楼船。",
        "intent": "改变实际历史中集中攻击中军的行动链，分兵翼侧，改变战局控制关系。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "将火攻舟分兵一半攻击左翼陈军副舰，一半攻击中军楼船",
          "target": "陈友谅左翼副舰及中军楼船",
          "deadline": "日落前风向稳定的一个时辰内"
        },
        "instantEcho": {
          "directResult": "左翼副舰被焚毁，但中军楼船仅轻伤，陈友谅继续指挥，战局胶着。",
          "unexpectedCost": "朱元璋因你违令震怒，战后撤职查办。",
          "beneficiary": "陈友谅中军舰队",
          "payer": "你本人"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "火器协同火攻舟集中射击",
        "label": "你作为火药船营官，在风向稳定的一时辰内，命令火器队集中弹药射击陈友谅中军楼船，同时火攻舟继续冲向该船，双重打击。",
        "intent": "通过火器队加强火攻效果，保留实际历史中中军楼船被毁的结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令火器队集中射击陈友谅中军楼船，协同火攻舟进攻",
          "target": "陈友谅中军楼船及火器队",
          "deadline": "日落前风向稳定的一个时辰内"
        },
        "instantEcho": {
          "directResult": "中军楼船被彻底摧毁，陈友谅阵亡。",
          "unexpectedCost": "火器队因暴露于弓箭手损失近半。",
          "beneficiary": "朱元璋水军",
          "payer": "火器队士兵"
        }
      },
      {
        "id": "B",
        "displayLabel": "火攻舟转攻陈军粮船",
        "label": "你作为火药船营官，在风向稳定的一时辰内，下令火攻舟队放弃中军楼船，转而攻击陈军后方粮船舰队。",
        "intent": "改变实际历史中攻击中军旗舰的行动链，改为破坏后勤，改变战役走向。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令火攻舟队绕过中军楼船，直扑陈军后方粮船舰队并纵火",
          "target": "陈友谅后方粮船舰队",
          "deadline": "日落前风向稳定的一个时辰内"
        },
        "instantEcho": {
          "directResult": "陈军粮船多艘被焚毁，补给中断，陈友谅被迫撤退，中军楼船完好。",
          "unexpectedCost": "你因违抗命令，战后被朱元璋以抗命罪名处斩。",
          "beneficiary": "朱元璋水军",
          "payer": "你本人"
        }
      }
    ]
  },
  "jingnan-nanjing-1402": {
    "trajectory": {
      "historicalPath": "让 actualHistory 中宫中起火、建文帝失踪、退位诏被发现的结果按时发生。",
      "preservedResult": "南京城门被打开后燕军入城，宫中起火，建文帝下落成为谜团；朱棣随后即位为永乐帝。",
      "decisiveFork": "改变真实历史中金川门先开、建文帝可能被俘的结果，让建文帝活着离开，同时制造皇帝已焚死的假象。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "烧殿开地道放诏",
        "label": "你亲自点燃奉天殿帷帐，命令六名内侍同时点燃后宫东西六宫，然后打开宫城北门地道入口，向建文帝指示地道方向，并将写好的退位诏书端正放在奉天殿御案中央。",
        "intent": "让 actualHistory 中宫中起火、建文帝失踪、退位诏被发现的结果按时发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "点火烧殿、打开地道、放置退位诏",
          "target": "奉天殿、后宫、宫城北门地道、建文帝、退位诏书",
          "deadline": "燕军进入金川门之前一个时辰内"
        },
        "instantEcho": {
          "directResult": "奉天殿与后宫火起，浓烟冲天；建文帝从宫城北门地道出城；燕军进城后扑灭余火，在奉天殿发现退位诏书。",
          "unexpectedCost": "你被浓烟呛伤，脸上留下轻微烧伤，但能继续行动。",
          "beneficiary": "朱棣",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "闭宫门藏主假焚",
        "label": "你命令内侍关闭所有宫门，自己带领十名心腹携带事先备好的皇帝衣冠，从宫城西门地道护送建文帝出城，同时将一名身形相近的太监尸体穿上龙袍投入火中，并放火焚烧奉天殿及后宫。",
        "intent": "改变真实历史中金川门先开、建文帝可能被俘的结果，让建文帝活着离开，同时制造皇帝已焚死的假象。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "关闭宫门、护送建文帝出城、布置假死现场",
          "target": "建文帝、宫门、西门地道、太监尸体、奉天殿、后宫",
          "deadline": "燕军进入金川门之前一个时辰内"
        },
        "instantEcho": {
          "directResult": "建文帝从西门地道离开南京城，不知去向；宫中被烧的太监尸体被误认为建文帝；退位诏书未被放置，朱棣入城后恼怒火势，即位后下令追查建文帝下落。",
          "unexpectedCost": "你因关闭宫门被部分守门官兵视为叛逆，受伤被捕；但建文帝成功逃脱。",
          "beneficiary": "建文帝",
          "payer": "你"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "传令纵火并撤梯",
        "label": "你手写密令交给心腹内侍王忠，命他带着火把和桐油，从东华门绕至奉天殿后檐放火，并自己跑到宫城北门，命守门侍卫撤走地道口的梯子，以确保建文帝无法回头，再由王忠将退位诏书压于奉天殿香炉下。",
        "intent": "利用不同内侍和程序，让actualHistory中起火、失踪、退位诏被发现的结果按时发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "传令纵火并撤梯",
          "target": "王忠、东华门、奉天殿、北门地道、梯子、退位诏书",
          "deadline": "燕军进入金川门之前一个时辰内"
        },
        "instantEcho": {
          "directResult": "王忠点火成功，奉天殿起火；北门地道口梯子被撤，建文帝无法返回；退位诏书被压在香炉下；燕军入城后发现。",
          "unexpectedCost": "建文帝出地道后因无梯子被困于护城河边，被燕军巡逻队发现后逃走，但下落不明；你因传令动作被一名侍卫看见，日后被朱棣怀疑。",
          "beneficiary": "朱棣",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "假扮倭寇劫主走",
        "label": "你换上商贾衣服，从内库取出倭刀和黑色斗篷，带领五名同样装扮的心腹，在宫城西门附近假扮倭寇劫持建文帝，趁乱将他从西门地道拖出，并命令一名内侍在奉天殿前自焚并呼喊“皇帝在此”，制造混乱。",
        "intent": "改成建文帝被假倭寇从西门劫走，出城后不知所踪；奉天殿前自焚的内侍被误认为建文帝；朱棣入城后下令严查倭寇，建文帝下落成为悬案",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "假扮倭寇劫持建文帝并制造假死",
          "target": "建文帝、宫城西门、地道、倭刀、内侍",
          "deadline": "燕军进入金川门之前一个时辰内"
        },
        "instantEcho": {
          "directResult": "建文帝被假倭寇从西门劫走，出城后不知所踪；奉天殿前自焚的内侍被误认为建文帝；朱棣入城后下令严查倭寇，建文帝下落成为悬案。",
          "unexpectedCost": "你被守城官兵射中左肩，受伤后逃脱；建文帝因受惊吓，精神恍惚。",
          "beneficiary": "建文帝",
          "payer": "你"
        }
      }
    ]
  },
  "zheng-he-1405": {
    "trajectory": {
      "historicalPath": "必须在升帆前将各船商人上交的贸易账簿统一交给宫廷使节，确保船队贸易计价权归朝廷所有。",
      "preservedResult": "郑和率庞大船队七下西洋，建立了明朝主导的朝贡和海上交往网络。",
      "decisiveFork": "改变真实历史中朝廷控制贸易的结果，将定价权下放给商人。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "封存商人账簿",
        "label": "你在升帆前将所有船舶商人的贸易账簿收集并密封交予随船宦官王景弘，宣布所有交易计价由宫廷使节统一核算，商人不得私自议价。",
        "intent": "保留真实历史中郑和船队贸易由朝廷控制的关键控制关系。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "收集并密封商人账簿交予宦官王景弘",
          "target": "各船商人与宦官王景弘",
          "deadline": "距离升帆只剩两个时辰"
        },
        "instantEcho": {
          "directResult": "王景弘接管所有商贸账簿，商人默认服从，船队升帆启航，朝廷掌握贸易计价权。",
          "unexpectedCost": "商人团体失去自主议价机会，暗中抱怨，未来可能影响与沿途港口的私下交易。",
          "beneficiary": "王景弘（宫廷使节）",
          "payer": "各船商人"
        }
      },
      {
        "id": "B",
        "displayLabel": "下放贸易权给商人",
        "label": "你在升帆前当众撕毁原定由宫廷使节统一计价的命令，宣布各船商人可自主与沿途港口议价，只需返航后按比例上缴利润。",
        "intent": "改变真实历史中朝廷控制贸易的结果，将定价权下放给商人。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "撕毁命令并宣布商人自主议价",
          "target": "船队全体商人及随船宦官",
          "deadline": "距离升帆只剩两个时辰"
        },
        "instantEcho": {
          "directResult": "商人欢呼雀跃，船队升帆启航后，各船开始自行与沿途港口洽谈交易，贸易方式从朝贡转向民间交换。",
          "unexpectedCost": "宦官王景弘认为你公然违抗圣意，立即派快船密报永乐帝，半途截获后你可能面临叛国指控。",
          "beneficiary": "各船商人",
          "payer": "你（受到王景弘弹劾）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "移交账房钥匙",
        "label": "你在升帆前将总账房所有钥匙交给火长（领航员）保管，并指示他锁住一切商人账本，使得使节无法临时更改记录。以物理方式锁定朝廷控制。",
        "intent": "使用钥匙这一器物执行同一历史轨道（朝廷控制计价权），但通过火长而非直接交予使节。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "将总账房钥匙交给火长保管并指示锁定账本",
          "target": "火长及账房钥匙",
          "deadline": "距离升帆只剩两个时辰"
        },
        "instantEcho": {
          "directResult": "账房被锁，商人和使节都无法改动账本，船队启航后朝廷通过已有账本控制计价权，但火长暂时保管钥匙引发权威争议。",
          "unexpectedCost": "火长因掌握钥匙而被其他船员质疑权限，发生短暂争执影响船舶调度。",
          "beneficiary": "火长（获得临时权威）",
          "payer": "其他船员（因争执影响效率）"
        }
      },
      {
        "id": "B",
        "displayLabel": "开放私人议价",
        "label": "你在升帆前公开宣布，允许各船商人携带自用货物而非官方货物，并可直接与港口商人交换私货。此举绕开朝廷货物控制，使贸易利润落入私囊。",
        "intent": "改变真实历史中官货垄断的结果，通过开放私人议价让商人直接获益。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "宣布允许商人携带自用货物并直接交换私货",
          "target": "船队所有商人及港口商人",
          "deadline": "距离升帆只剩两个时辰"
        },
        "instantEcho": {
          "directResult": "商人迅速将官货码放一边，私货装船，船队启航后沿途港口出现大量民间交换，朝廷官方朝贡贸易量锐减。",
          "unexpectedCost": "随船军官发现官货被冷落，请求扣留涉案商人，你被军官指责破坏远航使命。",
          "beneficiary": "各船商人",
          "payer": "你（遭受军官指责和潜在的圣旨问责）"
        }
      }
    ]
  },
  "tumu-crisis-1449": {
    "trajectory": {
      "historicalPath": "在午门朝会上，当徐有贞提议南迁时，于谦厉声反对，并联合群臣请求孙太后立郕王为监国，随后下令调集土木堡溃散兵力和附近卫所勤王",
      "preservedResult": "于谦主张坚守北京并拥立景泰帝，北京保卫战击退瓦剌军。",
      "decisiveFork": "朝会当场决定反对南迁、拥立郕王并调兵的关键时刻"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "公开斥南迁立郕王",
        "label": "在午门朝会上，你抢在徐有贞话音未落时拍案而起，厉声斥责南迁为亡国之论，并转身向于谦拱手高呼：'兵部侍郎于谦，请即请郕王监国，传檄各卫所勤王！'",
        "intent": "保留于谦主导的反对南迁、拥立郕王和调兵勤王的历史路径，确保结果按时发生",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "拍案斥责南迁并当众请求于谦拥立郕王",
          "target": "徐有贞、于谦、郕王朱祁钰",
          "deadline": "当天午门朝会结束前"
        },
        "instantEcho": {
          "directResult": "于谦接过话头，立即厉声支持，群臣随之附和，孙太后当日即下旨立郕王为监国，调兵文书随即发出",
          "unexpectedCost": "你因此被徐有贞及其同党忌恨，日后或遭报复",
          "beneficiary": "于谦、郕王朱祁钰",
          "payer": "你（兵部主事）"
        }
      },
      {
        "id": "B",
        "displayLabel": "代于谦锁城发檄",
        "label": "你趁于谦与徐有贞争论之际，一步跨到御案前夺过空白敕书，加盖兵部印信，向殿外高喊：'奉郕王令，九门即刻落闸，通州粮仓改归兵部接管，违者以通敌论！'",
        "intent": "改变命令发布环节：由你越级以郕王名义直接下令锁城征粮，跳过朝议程序，使抵抗措施不可逆",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "越级以郕王名义下令关闭九门、接管通州粮仓",
          "target": "九门守将、通州粮仓官吏、郕王（名义）",
          "deadline": "当天午门朝会结束前"
        },
        "instantEcho": {
          "directResult": "九门轰然关闭，通州粮仓被接管，徐有贞等人惊愕无言，但于谦因权威受侵而怒视于你",
          "unexpectedCost": "你因越权被于谦当场训斥，事后可能受罚；部分大臣弹劾你僭越",
          "beneficiary": "郕王朱祁钰",
          "payer": "你（兵部主事）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "发十万火急调兵令",
        "label": "朝会散后，你直奔兵部值房，以'兵部主事奉于谦命'名义草拟调兵令，派八百里加急分别送往宣府、大同、辽东、蓟州四镇，命其'尽起精锐，星夜赴京，后续粮草由通州仓拨付'",
        "intent": "使用调兵文书这一器物，实际执行调兵勤王的历史路径，替代言语动作",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "草拟并发出调兵令给北方四镇",
          "target": "宣府、大同、辽东、蓟州镇守总兵",
          "deadline": "当天午门朝会后一个时辰内"
        },
        "instantEcho": {
          "directResult": "四镇于次日陆续收到命令，开始集结南下；北京城防信心大增",
          "unexpectedCost": "调兵令未经于谦亲笔签名，部分镇将怀疑真伪，需于谦后续补签确认",
          "beneficiary": "于谦、郕王朱祁钰",
          "payer": "你（兵部主事）"
        }
      },
      {
        "id": "B",
        "displayLabel": "改监国为即帝位",
        "label": "你当朝提议：'郕王不应只监国，瓦剌以皇兄要挟，唯有即皇帝位方能绝其念。请太后懿旨，今日登基！'并率先向郕王行三跪九叩之礼。",
        "intent": "改变真实历史中先监国后登基的顺序，直接称帝，加速政权稳定",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "当朝提议郕王立即登基并率先叩拜",
          "target": "郕王朱祁钰、孙太后、于谦、群臣",
          "deadline": "当天午门朝会结束前"
        },
        "instantEcho": {
          "directResult": "部分大臣附议，于谦权衡后支持，孙太后当日下诏立郕王为帝；瓦剌闻讯后士气受挫，但可能提前攻城",
          "unexpectedCost": "你被指责操之过急，且英宗生母孙太后心怀不满",
          "beneficiary": "朱祁钰（新帝）",
          "payer": "你（兵部主事）"
        }
      }
    ]
  },
  "ningyuan-1626": {
    "trajectory": {
      "historicalPath": "袁崇焕下令红夷大炮开火，炮弹击中后金前锋并造成大量伤亡，迫使努尔哈赤退兵。",
      "preservedResult": "袁崇焕依托坚城与红夷大炮击退后金军，努尔哈赤在战后数月去世，宁远成为后金起兵以来少见的挫败。",
      "decisiveFork": "红夷大炮是否等后金主力进入近距射程后再齐射。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "等敌近距后挥旗齐射",
        "label": "你握紧旗绳，等到后金前锋越过壕沟边缘才挥旗下令开炮，红夷大炮齐射打散冲锋队形，努尔哈赤被迫后撤。",
        "intent": "保留袁崇焕依赖大炮破敌、努尔哈赤退兵的轨道，但将开炮时机推迟至最近距离，确保杀伤力。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "挥旗延迟齐射信号",
          "target": "城上红夷大炮炮组",
          "deadline": "后金前锋越过壕沟后数秒内"
        },
        "instantEcho": {
          "directResult": "数门红夷大炮同时开火，弹丸穿透后金前锋队列，造成重大伤亡。",
          "unexpectedCost": "你因违令延迟开炮被袁崇焕的亲兵当场杖责二十。",
          "beneficiary": "袁崇焕麾下炮队及守城明军",
          "payer": "葡萄牙炮术翻译（你本人）"
        }
      },
      {
        "id": "B",
        "displayLabel": "提前三炮齐射示警",
        "label": "你命令城头三炮提前齐射，炮弹飞过后金阵前，迫使努尔哈赤暂停进军并调整阵型，后金军改道攻击城墙薄弱处。",
        "intent": "改变袁崇焕‘等敌近再打’的指挥方向，让后金避开最强炮火，转而攻击南城薄弱段。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令城头三炮提前齐射",
          "target": "宁远城西南城墙上的三组红夷大炮",
          "deadline": "后金主力尚未展开，约距城一里时"
        },
        "instantEcho": {
          "directResult": "后金主力暂停并改道，攻击南城墙体，当日损毁一处垛口。",
          "unexpectedCost": "袁崇焕事后追究你擅自更改炮令，将你逐出炮队，降为辎重杂役。",
          "beneficiary": "后金方面避开正面炮火；南城守军获得实战经验",
          "payer": "你本人（失去炮术翻译职位及信誉）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "口译射表调整炮仰",
        "label": "你大声将袁崇焕‘打近处’的命令口译为炮组调整仰角的术语，使炮弹落点恰好命中后金前锋密集队形，造成大量杀伤。",
        "intent": "通过口译这一不同动作，同样使红夷大炮发挥威力并击退后金，保留实际历史结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "口译射表命令调整炮仰",
          "target": "城上红夷大炮炮组中的葡萄牙炮手",
          "deadline": "后金前锋已展开，约半分钟内必须开炮"
        },
        "instantEcho": {
          "directResult": "炮弹准确命中并粉碎后金前锋队形，后金军混乱退却。",
          "unexpectedCost": "翻译过快导致一门火炮装填顺序出错，炮组遭袁崇焕训斥。",
          "beneficiary": "袁崇焕及守城明军",
          "payer": "你本人（作为翻译承受指挥层压力）"
        }
      },
      {
        "id": "B",
        "displayLabel": "谎报超距令炮放空",
        "label": "你谎报后金主力距离超出有效射程，劝说袁崇焕命令红夷大炮向远处放空炮威慑，导致后金军从容接近并重点攻击城墙根部，炸开一处缺口。",
        "intent": "通过谎报射击参数，改变袁崇焕实弹痛击的命令方向，让后金军获得优势。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "向袁崇焕谎报距离并劝说放空炮",
          "target": "袁崇焕本人",
          "deadline": "后金主力距城约一里半，进入通常射程前"
        },
        "instantEcho": {
          "directResult": "红夷大炮向远处空射，后金军顺利接近城墙根部，并在午后炸开一处缺口。",
          "unexpectedCost": "你因谎报军情被袁崇焕察觉，战后被下狱审讯。",
          "beneficiary": "后金前锋及攻城部队",
          "payer": "你本人（面临军法审判）"
        }
      }
    ]
  },
  "shanhai-pass-1644": {
    "trajectory": {
      "historicalPath": "在第二天李自成大军进攻前，以吴三桂幕僚身份起草并发出致多尔衮书信，请求清军入关共同击溃李自成，同意清军越关占领城池并后续入主中原。",
      "preservedResult": "吴三桂引清军入关共击李自成，清军随后进入北京并开始统一全国。",
      "decisiveFork": "改变真实历史中的控制关系，拒绝清军占领城池，将借兵改为限时同盟。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "起草求援书信",
        "label": "你作为吴三桂幕僚，在宁海城帅府内起草致多尔衮的书信，写明请清军入关共击李自成，并同意清军越关占领山海关城池，快马送出。",
        "intent": "保留真实历史中的借兵决定，确保书信内容与吴三桂真实行为一致，清军如期入关。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "起草并发出致多尔衮书信，请求清军入关共击李自成，同意清军越关占领山海关城池",
          "target": "吴三桂帅府、致多尔衮书信、山海关",
          "deadline": "第二天李自成大军进攻前"
        },
        "instantEcho": {
          "directResult": "书信发出后，多尔衮次日率清军抵达山海关，吴三桂开关迎清军入关，双方联合击溃李自成大顺军。",
          "unexpectedCost": "清军入关后直接控制山海关，吴三桂失去独立指挥权，部分关宁军将领不满。",
          "beneficiary": "多尔衮和清军",
          "payer": "吴三桂和关宁军"
        }
      },
      {
        "id": "B",
        "displayLabel": "限时同盟拒入城",
        "label": "你作为吴三桂幕僚，在宁海城帅府内起草致多尔衮书信，提出只限时三天军事同盟共击李自成，但坚决拒绝清军越关或进入山海关城池，明确要求清军退驻关外，完成后快马送出。",
        "intent": "改变真实历史中的控制关系，拒绝清军占领城池，将借兵改为限时同盟。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "起草并发出致多尔衮书信，提出限时三天军事同盟，拒绝清军越关和进入山海关城池",
          "target": "吴三桂帅府、致多尔衮书信、山海关城池",
          "deadline": "第二天李自成大军进攻前"
        },
        "instantEcho": {
          "directResult": "书信发出后，多尔衮次日率清军抵达但被拒关外，李自成大军猛攻山海关，吴三桂关宁军独立抗击，大顺军攻破外城。",
          "unexpectedCost": "山海关外城部分失守，吴三桂部伤亡惨重，清军观望未参战。",
          "beneficiary": "李自成大顺军",
          "payer": "吴三桂和关宁军"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "伪造密令调兵",
        "label": "你假借吴三桂口吻，伪造一道调兵令牌，命令关宁军一部连夜出关向清军靠拢，同时派人散布谣言说清军已同意入关，迫使吴三桂实际引清军入关。",
        "intent": "以不同杠杆（伪造令牌和谣言）确保清军入关发生，保留真实历史结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "伪造吴三桂调兵令牌，命令关宁军出关靠拢清军，并散布清军同意入关的谣言",
          "target": "关宁军、调兵令牌、山海关外清军营地",
          "deadline": "第二天李自成大军进攻前"
        },
        "instantEcho": {
          "directResult": "关宁军一部出关，清军顺势入关，吴三桂被迫接受既成事实，联军击溃李自成。",
          "unexpectedCost": "吴三桂事后追查伪造者，你被怀疑并遭到排挤，部分关宁军不信任你。",
          "beneficiary": "多尔衮和清军",
          "payer": "伪造令牌的幕僚本人"
        }
      },
      {
        "id": "B",
        "displayLabel": "暗杀信使阻盟",
        "label": "你暗中刺杀吴三桂派往清军的信使，并伪造一封回信称多尔衮拒绝领军入关，反而建议吴三桂投降李自成，同时破坏山海关城门防御，为李自成攻城创造机会。",
        "intent": "以暗杀和破坏防御改变结果，防止清军入关，使李自成攻占山海关。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "暗杀吴三桂派往清军的信使，伪造多尔衮拒绝入关的回信，并破坏山海关城门防御",
          "target": "信使、伪造回信、山海关城门",
          "deadline": "第二天李自成大军进攻前"
        },
        "instantEcho": {
          "directResult": "信使被杀，回信伪造，李自成大军进攻时城门防御薄弱，大顺军攻入山海关，吴三桂兵败被俘。",
          "unexpectedCost": "清军因未接到请求而一直驻扎关外，李自成控制山海关后你的身份暴露，被迫逃亡。",
          "beneficiary": "李自成大顺军",
          "payer": "吴三桂和山海关守军"
        }
      }
    ]
  },
  "koxinga-1661": {
    "trajectory": {
      "historicalPath": "郑成功舰队在领航官引导下于1661年4月30日利用涨潮通过鹿耳门浅水道，登陆台湾本岛，随后围攻热兰遮城。",
      "preservedResult": "郑军通过鹿耳门登陆，围攻热兰遮城，次年迫使荷兰东印度公司投降。",
      "decisiveFork": "是否在潮水回落前冒险通过鹿耳门水道"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "带头穿越鹿耳门水道",
        "label": "你必须亲自驾驶领航小艇，以旗语和喇叭指挥郑成功主力舰队跟随，在潮水涨满之际强行通过鹿耳门浅滩，确保船队在荷兰炮台开火前全部进入内海。",
        "intent": "保留郑军通过鹿耳门登陆的真实行动链，让主力舰队按时切入热兰遮城侧后。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "驾驶领航小艇在前方引路，以旗语和喇叭指挥主力舰队跟随，通过鹿耳门水道。",
          "target": "郑成功旗舰及全部主力舰队",
          "deadline": "潮水一个时辰内回落前"
        },
        "instantEcho": {
          "directResult": "舰队在荷兰炮台完成射击前全部通过鹿耳门，成功登陆台湾本岛，包围热兰遮城。",
          "unexpectedCost": "三艘小型战舰在浅滩搁浅，损失少量弹药和淡水。",
          "beneficiary": "郑成功及登陆部队",
          "payer": "搁浅舰只上的水手和丢失的物资"
        }
      },
      {
        "id": "B",
        "displayLabel": "诱使荷兰炮台调转方向",
        "label": "你必须派亲信向荷兰台湾长官揆一送一封伪造的郑成功命令，声称主力将在北线尾登陆，诱使荷兰人将热兰遮城主力炮台转向北面，而你则引导舰队从南面绕过炮台区。",
        "intent": "改变荷兰炮台对鹿耳门水道的控制关系，使郑军无法正面突破时改道侧袭。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "派亲信向揆一递送伪造的郑成功命令，内容为‘主力将于北线尾登陆’。",
          "target": "荷兰台湾长官揆一及热兰遮城炮台指挥官",
          "deadline": "潮水一个时辰内回落前"
        },
        "instantEcho": {
          "directResult": "荷兰人调动主力炮台向北布防，郑军主力从南侧顺利登陆，但未能包围热兰遮城。",
          "unexpectedCost": "假情报被部分荷兰军官识破，两名派出的亲信被捕并处决。",
          "beneficiary": "郑成功（获得更安全登陆点）",
          "payer": "被捕间谍及郑军失去突袭包围战果"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "改道北线尾涉水登陆",
        "label": "你必须向郑成功进言，称‘鹿耳门水道过于危险，建议改在北线尾沙洲涉水登陆’，并亲自驾驶小艇探明涉水路线，带领部队涉水上岸。",
        "intent": "使用另一地点（北线尾）和另一程序（涉水）实现郑军在台湾本岛登陆的真实结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "向郑成功建议改道北线尾涉水，并带头涉水探路。",
          "target": "郑成功及其旗舰幕僚",
          "deadline": "潮水一个时辰内回落前"
        },
        "instantEcho": {
          "directResult": "郑军主力在北线尾涉水登陆成功，随后从陆路逼近热兰遮城。",
          "unexpectedCost": "涉水导致大量火药受潮，火炮无法立即使用。",
          "beneficiary": "郑成功（成功登陆）",
          "payer": "受潮的火药和后续攻城延缓"
        }
      },
      {
        "id": "B",
        "displayLabel": "策动福建水师叛变",
        "label": "你必须秘密联络荷兰人，将福建水师将领黄廷对郑成功的怨隙告知揆一，并安排黄廷在登陆关键时刻下令麾下舰船倒戈攻击郑成功旗舰。",
        "intent": "改变郑成功对福建水师的指挥权，使一部分舰队反向控制，阻止郑成功登陆。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "向热兰遮城递送密信，约定黄廷倒戈信号，并指示其炮击郑成功旗舰。",
          "target": "荷兰台湾长官揆一和黄廷",
          "deadline": "潮水一个时辰内回落前"
        },
        "instantEcho": {
          "directResult": "黄廷在郑军登陆时临阵倒戈，炮击郑成功旗舰，郑军陷入混乱，登陆失败。",
          "unexpectedCost": "黄廷的叛变被郑成功亲卫队拼死扑灭，你作为内应身份暴露。",
          "beneficiary": "荷兰东印度公司",
          "payer": "郑成功（失去部分舰队和控制权）"
        }
      }
    ]
  },
  "kangxi-aobai-1669": {
    "trajectory": {
      "historicalPath": "你按康熙密令，在鳌拜入殿时高喊布库开场，少年侍卫闻声关门并扑倒鳌拜，捆绑后押送天牢。",
      "preservedResult": "康熙借布库少年在宫中擒获鳌拜，随后宣布其罪状并亲掌朝政。",
      "decisiveFork": "你何时下令关闭殿门——在鳌拜完全踏入殿内后立即关门，使其无法逃脱和求援。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "关门擒鳌拜",
        "label": "你以布库开场为号，令两侧少年侍卫立即关闭武英殿大门，同时冲向鳌拜并合力将其按倒，捆绑双手。",
        "intent": "执行康熙密令，确保少年侍卫在封闭空间内迅速制服鳌拜，无外部干预。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "挥动令旗并高喊‘开场’，指挥少年侍卫关殿门并擒拿鳌拜。",
          "target": "武英殿大门、殿内十六名布库少年、鳌拜本人",
          "deadline": "鳌拜刚踏入殿内、尚未站稳的一瞬间"
        },
        "instantEcho": {
          "directResult": "殿门紧闭，十六名少年迅捷扑倒鳌拜，用绳索捆住其手脚，鳌拜无法反抗。",
          "unexpectedCost": "关门时，一名太监从侧门溜出，向鳌拜府邸报信，你需立即派人拦截。",
          "beneficiary": "康熙帝",
          "payer": "你（教头）因太监走漏风声而承担追捕压力"
        }
      },
      {
        "id": "B",
        "displayLabel": "延门放鳌拜",
        "label": "你以武英殿内有火情为由，命令侍卫暂不开中门，并亲自引导鳌拜从西角门绕道出宫，使其避开擒拿。",
        "intent": "改成鳌拜跟随你和亲兵从西角门出宫，返回府邸后立即召集家将准备次日上朝发难",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "拦住中门，宣称‘殿内烛台翻倒，暂不能进’，并转身对鳌拜说‘大人请随我从西角门绕行’。",
          "target": "武英殿中门、西角门、鳌拜、你的心腹亲兵",
          "deadline": "鳌拜已走到殿前台阶，正等待侍卫开门的时刻"
        },
        "instantEcho": {
          "directResult": "鳌拜跟随你和亲兵从西角门出宫，返回府邸后立即召集家将准备次日上朝发难。",
          "unexpectedCost": "你的亲兵在引路时被鳌拜侍卫认出，你作为主谋暴露，成为鳌拜复仇目标。",
          "beneficiary": "鳌拜及其家族、党羽",
          "payer": "你（教头）面临鳌拜报复"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "摔杯擒鳌拜",
        "label": "你以少年侍卫布库演示为名，命侍卫在殿内摆放暗格，待鳌拜入座后摔杯为号，暗格中跳出侍卫将其制服。",
        "intent": "使用不同器物（暗格）和号令（摔杯）执行同一历史结果：在殿内擒获鳌拜。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "在鳌拜落座后，将手中茶杯掷碎于地，暗格中四名侍卫跃出扑倒鳌拜。",
          "target": "武英殿内预设暗格、四名少年侍卫、鳌拜",
          "deadline": "鳌拜已端坐，等待奏事的瞬间"
        },
        "instantEcho": {
          "directResult": "侍卫从暗格跳出，瞬间制服鳌拜并绑缚，鳌拜怒骂但已被控制。",
          "unexpectedCost": "摔杯声惊动殿外侍卫，一名鳌拜亲信拔刀闯入，造成短暂混乱，但终被拿下。",
          "beneficiary": "康熙帝",
          "payer": "你（教头）因安排暗格而需额外处理木工痕迹，但无大碍"
        }
      },
      {
        "id": "B",
        "displayLabel": "开殿纵鳌拜",
        "label": "你以鳌拜素有腰伤为由，命侍卫先行打开北门并用软轿送其出宫，使其避免进入伏击圈。",
        "intent": "改成鳌拜将信将疑，但看到软轿后便上轿从北门出宫，回府后联络其他辅政大臣准备弹劾康熙",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "走到鳌拜面前低语‘皇上知大人腰疾，特命备轿从北门出宫’，随即令侍卫开启北门并抬来软轿。",
          "target": "武英殿北门、软轿、鳌拜、侍卫",
          "deadline": "鳌拜刚进武英殿院门，尚未进入正殿的时刻"
        },
        "instantEcho": {
          "directResult": "鳌拜将信将疑，但看到软轿后便上轿从北门出宫，回府后联络其他辅政大臣准备弹劾康熙。",
          "unexpectedCost": "你的命令被一名忠于康熙的侍卫听到，他立即跑去密报康熙，你将被康熙列为叛徒。",
          "beneficiary": "鳌拜",
          "payer": "你（教头）因侍卫告密而成为康熙清算对象"
        }
      }
    ]
  },
  "macartney-1793": {
    "trajectory": {
      "historicalPath": "在乾隆上朝前，将英方国书原样译出并放入御览本，使礼部无法弱化请求。",
      "preservedResult": "清廷拒绝扩大通商与常驻外交请求，中英贸易分歧继续扩大。",
      "decisiveFork": "是否将英方增开口岸和常驻外交的请求完整译出，而非按礼部要求以模糊措辞替代。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "据实全译英方国书",
        "label": "你在乾隆上朝前，将英方国书原文中增开口岸和常驻外交的请求逐句译为满文，不加删改，直接放入御览本，并签注‘此系英王原意’六字。",
        "intent": "保留历史中清廷拒绝扩张通商的行动链：乾隆读到完整请求后必然拒绝。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "全文翻译英方国书并放入御览本，签注原意",
          "target": "乾隆皇帝御览本",
          "deadline": "乾隆上朝前立即"
        },
        "instantEcho": {
          "directResult": "乾隆上朝翻阅御览本，看到英方明确要求增开口岸和常驻外交，当即批示‘天朝物产丰盈，无所不有，原不藉外夷货物’，拒绝所有请求。",
          "unexpectedCost": "礼部侍郎因未弱化奏报而被乾隆训斥，你被记过，日后升迁受阻。",
          "beneficiary": "礼部侍郎（因坚持朝贡礼制而获乾隆赞赏）",
          "payer": "你（军机处章京）"
        }
      },
      {
        "id": "B",
        "displayLabel": "删改国书替为朝贡表",
        "label": "你在乾隆上朝前，将英方国书原文销毁，重新拟写一份仿照朝鲜朝贡格式的表文，称英王‘仰慕天朝，愿效藩属’，并将原请求改为‘恳请加恩’。",
        "intent": "改成乾隆看到朝贡表文后龙颜大悦，同意‘加恩’准许英商在宁波贸易，但拒绝常驻外交。礼部发现伪造后弹劾你",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "销毁原国书，伪造朝贡表文代替",
          "target": "乾隆皇帝御览本",
          "deadline": "乾隆上朝前立即"
        },
        "instantEcho": {
          "directResult": "乾隆看到朝贡表文后龙颜大悦，同意‘加恩’准许英商在宁波贸易，但拒绝常驻外交。礼部发现伪造后弹劾你。",
          "unexpectedCost": "你因伪造国书被革职查办，流放伊犁。",
          "beneficiary": "浙江宁波地方官员和英商（因贸易开放获得收益）",
          "payer": "你（流放）、礼部（颜面受损）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "面奏高宗原书全文",
        "label": "你在乾隆上朝前，以口奏方式直接向乾隆背诵英方国书全文，并强调‘英人再三恳请，非礼部所奏之模糊’。",
        "intent": "保留历史中清廷拒绝扩张通商的结果：用口头汇报确保乾隆知晓原文。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "口头向乾隆汇报英方国书全文，指出礼部删改之处",
          "target": "乾隆皇帝",
          "deadline": "乾隆上朝前"
        },
        "instantEcho": {
          "directResult": "乾隆震怒于礼部隐瞒，亲自调取原国书核对，最终仍拒绝请求，但下旨严斥礼部。",
          "unexpectedCost": "礼部因欺君被整肃，你因越级上奏被罚俸半年。",
          "beneficiary": "乾隆（获得完整信息）、英方（请求被准确记录）",
          "payer": "礼部尚书（被斥责）、你（罚俸）"
        }
      },
      {
        "id": "B",
        "displayLabel": "暗中递送英方原件",
        "label": "你在乾隆上朝前，暗中将英方国书原件通过御前太监递交给乾隆，并附纸条‘请圣上亲览，勿经部臣’。",
        "intent": "改成乾隆看到原件后，对英方请求产生兴趣，上朝时询问群臣意见，和珅奏请‘可稍示怀柔’，乾隆决定准宁波开放通商，但要求英使行跪拜礼",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "私自将英方国书原件交给御前太监，递送乾隆",
          "target": "乾隆皇帝",
          "deadline": "乾隆上朝前"
        },
        "instantEcho": {
          "directResult": "乾隆看到原件后，对英方请求产生兴趣，上朝时询问群臣意见，和珅奏请‘可稍示怀柔’，乾隆决定准宁波开放通商，但要求英使行跪拜礼。",
          "unexpectedCost": "你因私递文书被军机处除名，但被和珅收入门下。",
          "beneficiary": "和珅（获得亲信）、浙江商人（贸易机会）",
          "payer": "你（被贬为和珅门客，失去清流名声）"
        }
      }
    ]
  },
  "humen-1839": {
    "trajectory": {
      "historicalPath": "林则徐命令在虎门当众销毁收缴鸦片；关天培指挥水师搬运鸦片至销烟池，投放石灰和盐卤，使鸦片尽数销毁。",
      "preservedResult": "林则徐当众销毁收缴鸦片，中英冲突持续升级，次年鸦片战争爆发。",
      "decisiveFork": "本人能否在销烟开始前公开提出中英双方可监督的合法贸易和谈机制，从而改变冲突升级的路线。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "传令关天培按时销烟",
        "label": "我持钦差行辕文书，向广东水师提督关天培面呈林则徐手令：即刻按原定名单顺序，在虎门海滩销毁全部收缴鸦片，不得延误；外交通牒事宜留待明日再议。",
        "intent": "保留林则徐下令销烟、关天培执行、当日销毁全部收缴鸦片的关键行动链。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "面呈手令并口头催促执行",
          "target": "广东水师提督关天培",
          "deadline": "一个时辰内"
        },
        "instantEcho": {
          "directResult": "关天培即刻调兵，首批鸦片投入销烟池，开始销毁。",
          "unexpectedCost": "行辕主事记录我擅自催令，次日将我调离禁烟事务。",
          "beneficiary": "林则徐",
          "payer": "我"
        }
      },
      {
        "id": "B",
        "displayLabel": "遣使向义律递和谈书",
        "label": "我私用行辕空白文书，缮写一份《中英贸易和谈提议》并加盖私仿印记，派亲信送往澳门英国商务监督义律处，提议暂停销烟两天，在澳门举行为期三日的合法贸易谈判，鸦片作为条件之一。",
        "intent": "改变‘拒绝谈判、直接销烟’的真实命令方向，将决策权部分移交英方代表的谈判桌。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "缮写并送出私仿文书",
          "target": "澳门英国商务监督义律",
          "deadline": "半个时辰内"
        },
        "instantEcho": {
          "directResult": "义律收到信，暂缓撤离并召集商船主讨论，消息传回行辕，林则徐下令追回却已错过时机。",
          "unexpectedCost": "我被以‘私通外夷、伪造文书’罪名被当场逮捕，押入广州府大牢。",
          "beneficiary": "义律",
          "payer": "我"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "扣令领港官封船",
        "label": "我持腰牌赶赴虎门码头，命令领港官‘即刻扣留所有港内引水船及民船，禁止任何外商船只离港，等候销烟完成后方可放行’。",
        "intent": "保留‘阻止外商私运鸦片离港’的实际控制，以封锁港口确保所有鸦片在囤积待毁。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令扣留港内船只",
          "target": "虎门码头领港官及引水船队",
          "deadline": "半个时辰内"
        },
        "instantEcho": {
          "directResult": "领港官执行命令，所有船只停航，外商集船抗议，但鸦片被悉数搬回岸上等待销毁。",
          "unexpectedCost": "外商联名申诉至两广总督，我被记大过一次。",
          "beneficiary": "林则徐",
          "payer": "我"
        }
      },
      {
        "id": "B",
        "displayLabel": "开库兑付英商银票",
        "label": "我擅用行辕账房银库钥匙，命令库官‘即刻按义律提供的清单，以库银兑换外商已上缴鸦片的等值银票，当场交与英商代表，作为未来谈判的抵押’。",
        "intent": "改变‘不赔偿、直接没收’的命令方向，用银钱兑现将鸦片控制权转为金融关系。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令银库兑换银票并交付英商代表",
          "target": "行辕账房库官和英国商人代表",
          "deadline": "一个时辰内"
        },
        "instantEcho": {
          "directResult": "英商代表收到银票后，同意暂停撤离并等待谈判，但义律尚未正式确认；行辕账册被涂改，林则徐闻讯后追缴银票但已发出数张。",
          "unexpectedCost": "我被以‘盗用库银’罪名收押，并判赔全部银两，家产被抄没。",
          "beneficiary": "英国商人",
          "payer": "我"
        }
      }
    ]
  },
  "great-fire-rome-64": {
    "trajectory": {
      "historicalPath": "值夜主管拒绝或未能有效拆除木屋，居民阻挠导致拆除中断，大火借风势蔓延全城",
      "preservedResult": "大火延烧多日，罗马大部分城区被毁，尼禄随后重建城市并迫害基督徒。",
      "decisiveFork": "是否在居民阻挠时使用强制手段完成拆除"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "下令拆除但被居民阻挠中断",
        "label": "我作为值夜主管，在午夜风势加剧前，亲自命令消防队和征兵队拆除竞技场至山坡沿线的连片木屋。居民群起反抗，投掷陶罐火把，导致拆除中断，防火带未形成。大火借风势蔓延，如真实历史般烧毁全城。",
        "intent": "保留真实历史中因居民阻挠导致拆除失败、大火蔓延的行动链。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令消防队和征兵队强行拆除连片木屋，但在居民反抗下中断",
          "target": "竞技场商铺区木屋、店主、租户",
          "deadline": "半个时辰内"
        },
        "instantEcho": {
          "directResult": "拆除开始后，店主和租户群起反抗，投掷陶罐与火把，造成消防队员伤亡，拆除中断。风将火星吹向山坡木屋，火势蔓延全城。",
          "unexpectedCost": "我因引发流血冲突被元老院问责，降职调离消防队。",
          "beneficiary": "尼禄（获得重建城市的借口和迫害基督徒的时机）",
          "payer": "我（承担失职和冲突的代价）"
        }
      },
      {
        "id": "B",
        "displayLabel": "下令拆除并射杀带头阻挠者",
        "label": "我作为值夜主管，在午夜风势加剧前，亲自命令消防队与近卫军士兵拆除竞技场至山坡沿线的连片木屋，并当场射杀三名带头阻挠的店主，震慑居民，防火带半小时内贯通。大火仅烧毁竞技场商铺区，山坡住宅区幸免。",
        "intent": "改变真实历史中因居民反抗导致拆除中断的关键点，以武力镇压完成防火带，改变火灾结果。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令近卫军射杀阻挠居民，强行拆除木屋形成防火带",
          "target": "竞技场商铺区木屋、三名带头阻挠的店主",
          "deadline": "半个时辰内"
        },
        "instantEcho": {
          "directResult": "防火带成型，大火被阻隔于竞技场区域，山坡住宅区幸免。火势次日清晨自行熄灭，罗马城损失远小于真实历史。",
          "unexpectedCost": "我因擅用近卫军、造成平民死亡，遭元老院起诉，流放西西里。",
          "beneficiary": "山坡住宅区的罗马贵族与平民（免于火灾），尼禄（失去大规模重建和迫害基督徒的充分理由）",
          "payer": "我（流放）、三位被射杀店主的家族（丧亲）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "拒绝拆除，改令清理易燃品",
        "label": "当值夜队长请求我下令拆除木屋时，我拒绝，改命消防队和居民逐户搬出油料、布料等易燃品。居民抵制搬迁，混乱中火星引燃堆积物，防火带未形成，大火如真实历史般蔓延全城。",
        "intent": "保留真实历史中未形成有效防火带的行动链，以相反命令（不拆屋而清理易燃品）促成同样的火灾结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "拒绝拆除令，改为逐户清理易燃品命令",
          "target": "消防队、竞技场商铺区居民",
          "deadline": "半个时辰内"
        },
        "instantEcho": {
          "directResult": "易燃品清理因居民抵制进展缓慢，一油罐被火星点燃，引燃旁边木屋，火势迅速失控，最终演变成全城大火。",
          "unexpectedCost": "我被元老院判定为指挥失当，罚款后解除职务。",
          "beneficiary": "尼禄（获得重建和迫害借口）",
          "payer": "我（罚款丢职）、居民（财产被烧）"
        }
      },
      {
        "id": "B",
        "displayLabel": "下令拆除并逮捕所有阻挠者",
        "label": "我作为值夜主管，在午夜风势加剧前，亲自命令消防队和近卫军士兵拆除木屋，并当场逮捕所有阻挠店主和平民，押往军营。防火带顺利建成，大火仅烧毁竞技场商铺区。",
        "intent": "改变真实历史中拆除行动因居民反抗中断的关键点，以大规模逮捕消除反抗，成功控制火势。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令近卫军逮捕所有阻挠者，完成拆除",
          "target": "消防队、近卫军、竞技场商铺区阻挠居民",
          "deadline": "半个时辰内"
        },
        "instantEcho": {
          "directResult": "防火带建成，大火被阻挡在竞技场区域。被捕居民暴满军营，引发全城抗议。次日元老院迫于压力将我革职流放。",
          "unexpectedCost": "我被流放至撒丁岛；被捕居民中多名贵族亲属被释放后散布谣言。",
          "beneficiary": "山坡住宅区居民（免于火灾）",
          "payer": "我（流放）、被捕居民及家属（自由受损）"
        }
      }
    ]
  },
  "fall-rome-476": {
    "trajectory": {
      "historicalPath": "你作为奥多亚塞军中的罗马行政官，必须将罗慕路斯皇帝冠冕和帝国纹章在9月4日当天送到奥多亚塞手中，由他当众毁弃或移交东罗马使者。",
      "preservedResult": "奥多亚塞废黜罗慕路斯，将帝国标志送往君士坦丁堡，西罗马帝国统治通常被视为至此结束。",
      "decisiveFork": "在皇帝交出冠冕前，你是否通过行政渠道阻止元老院通过任何保留共治皇帝的决议。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "移交冠冕与印章",
        "label": "你在9月4日清晨直接进入皇宫，从罗慕路斯手中收取冠冕和帝国纹章，并亲手交给奥多亚塞的侍卫长，命令元老院文书停止所有法律程序。",
        "intent": "保留真实历史中奥多亚塞获得帝国象征并废黜皇帝的行动链。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "收取冠冕和帝国纹章，交给奥多亚塞侍卫长，并命令元老院文书停止法律程序",
          "target": "罗慕路斯·奥古斯都（皇帝）、奥多亚塞侍卫长、元老院文书",
          "deadline": "9月4日当天日落前"
        },
        "instantEcho": {
          "directResult": "奥多亚塞得到冠冕和纹章，于正午召开军营大会，宣布废黜罗慕路斯，并派人将标志装箱送往君士坦丁堡。",
          "unexpectedCost": "你因擅闯皇宫和威胁文书被元老院除名，动产被没收。",
          "beneficiary": "奥多亚塞",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "劝罗慕路斯共治",
        "label": "你在9月4日凌晨告知罗慕路斯：东罗马皇帝芝诺已同意保留西罗马帝位，只要他接受奥多亚塞为共治皇帝；你私自起草了共治诏书并逼罗慕路斯用印。",
        "intent": "改成罗慕路斯签署共治诏书，奥多亚塞接受共治，西罗马帝国名义上继续存在，但实权归奥多亚塞",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "告知罗慕路斯东罗马同意共治，逼迫他用印共治诏书",
          "target": "罗慕路斯·奥古斯都（皇帝）、奥多亚塞（共治皇帝）",
          "deadline": "9月4日正午前"
        },
        "instantEcho": {
          "directResult": "罗慕路斯签署共治诏书，奥多亚塞接受共治，西罗马帝国名义上继续存在，但实权归奥多亚塞。",
          "unexpectedCost": "东罗马皇帝芝诺派使者公开否认共治协议，宣布西罗马帝位非法，你被奥多亚塞以伪造圣旨罪名鞭笞并流放。",
          "beneficiary": "罗慕路斯·奥古斯都",
          "payer": "你"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "公开宣读废黜令",
        "label": "你于9月4日上午在拉文纳广场公开宣读元老院准备好的废黜令，并当众将罗慕路斯肖像上的皇冠摘下，交给奥多亚塞的士兵。",
        "intent": "保留真实历史结果，通过公开仪式推动废黜。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "宣读废黜令，摘下皇帝肖像皇冠交给奥多亚塞士兵",
          "target": "拉文纳广场民众、罗慕路斯皇帝肖像、奥多亚塞士兵",
          "deadline": "9月4日正午"
        },
        "instantEcho": {
          "directResult": "民众欢呼，奥多亚塞的士兵接管皇宫，罗慕路斯被软禁，皇冠送往君士坦丁堡。",
          "unexpectedCost": "激进的罗马元老指责你叛国，策划暗杀你，你不得不在当晚逃离拉文纳。",
          "beneficiary": "奥多亚塞",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "让罗慕路斯逃亡",
        "label": "你于9月3日夜私自放走罗慕路斯，并用伪造的车队将他送到拉文纳城外东罗马领土，宣布他在那里继续行使皇帝权力，形成两个罗马帝国并存的局面。",
        "intent": "改变结果：西罗马皇帝逃脱，与东罗马形成对等政权。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "利用伪造的出行令将罗慕路斯带出皇宫，用你的马车送他至东罗马边境",
          "target": "罗慕路斯·奥古斯都（皇帝）、你的马车、东罗马边境守军",
          "deadline": "9月4日黎明前"
        },
        "instantEcho": {
          "directResult": "罗慕路斯抵达拉文纳以东的东罗马城市，宣布继续执政；奥多亚塞扑空后宣布你为公敌，悬赏你的头颅。",
          "unexpectedCost": "东罗马皇帝芝诺拒绝承认罗慕路斯，派兵逮捕了他并囚禁到死；你被奥多亚塞和元老院联合追捕，父母被投入监狱。",
          "beneficiary": "罗慕路斯·奥古斯都",
          "payer": "你和你的父母"
        }
      }
    ]
  },
  "constantinople-1453": {
    "trajectory": {
      "historicalPath": "为了让actualHistory发生，你在黎明前的最后两小时内将仅存火药全数供给圣罗曼努斯门缺口处的炮组，由朱斯蒂尼亚尼亲自指挥轰击奥斯曼先锋。",
      "preservedResult": "奥斯曼军攻破城防，君士坦丁十一世战死，拜占庭帝国灭亡。",
      "decisiveFork": "改变actualHistory中火药集中用于炮击的行动链，改用埋设火药实施定向爆破，改变战场控制权。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "全数火药急运缺口",
        "label": "你下令将内城火药库剩余全部火药装车，由六名火器兵押送，在拂晓前运抵圣罗曼努斯门炮组，交由朱斯蒂尼亚尼亲自调配装填，对准奥斯曼巨炮缺口齐射。",
        "intent": "保留actualHistory中守军将火药集中至缺口炮组的行动链，但由你作为军需官直接发出调运指令并监督执行，而非等待上级命令。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令运出内城全部火药并亲自押运至圣罗曼努斯门炮组",
          "target": "内城火药库、六名火器兵、朱斯蒂尼亚尼、圣罗曼努斯门炮组",
          "deadline": "1453年5月29日拂晓前"
        },
        "instantEcho": {
          "directResult": "火药运抵炮组并装填完毕，在奥斯曼总攻开始时，朱斯蒂尼亚尼指挥炮组齐射，暂时压制了缺口处的奥斯曼步兵突入，但火炮因过热炸膛，炮组伤亡过半，缺口仍未封堵。",
          "unexpectedCost": "炸膛导致你左臂被碎片划伤，无法继续参与后续战斗。",
          "beneficiary": "朱斯蒂尼亚尼（获得弹药完成一次有效轰击）",
          "payer": "六名火器兵（三人死亡，两人重伤）"
        }
      },
      {
        "id": "B",
        "displayLabel": "私拨火药爆破外墙",
        "label": "你秘密截留一半火药，私自指挥六名亲信在圣罗曼努斯门内侧城墙根挖掘坑道，将火药埋设于奥斯曼巨炮轰击点的正下方，待奥斯曼先锋冲入时引爆，意图炸塌缺口两侧墙垣，将敌我双方一并掩埋，从而堵塞通道。",
        "intent": "改变actualHistory中火药集中用于炮击的行动链，改用埋设火药实施定向爆破，改变战场控制权。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "截留一半火药并指挥亲信在城门内侧埋设炸药",
          "target": "圣罗曼努斯门内侧城墙坑道、六名亲信、火药",
          "deadline": "1453年5月29日拂晓前三更（约凌晨三点）"
        },
        "instantEcho": {
          "directResult": "炸药引爆后，缺口两侧城墙坍塌，将冲入的约三百名奥斯曼精兵与部分守军一同掩埋，城门通道被巨石彻底堵死，奥斯曼后续部队无法从此处突入，但城墙薄弱处出现新裂口，城内守军也因爆炸死伤五十余人。",
          "unexpectedCost": "爆炸震动引发邻近城墙裂缝扩大，你被飞石击中头部，当场昏迷，后被部下抬离战场，失去指挥权。",
          "beneficiary": "城内守军（暂时阻挡了圣罗曼努斯门方向的突破）",
          "payer": "六名亲信（全部被掩埋死亡），你本人重伤昏迷"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "动员市民推炮上城",
        "label": "你下令征用圣罗曼努斯门附近民宅的所有牲畜和壮丁，将存放在码头的一门备用重型射石炮（原计划装船撤往热那亚殖民地）强行拖运至城墙内侧，利用坡道推上城墙平台，对准奥斯曼军队的进攻路线，在黎明前完成装填。",
        "intent": "使用备用射石炮而不是火药库，保留actualHistory中用重炮轰击奥斯曼军队的行动链，但由你直接征用市民完成部署。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令征用牲畜和壮丁，将码头备用射石炮拖运至城墙平台并装填",
          "target": "码头备用射石炮、圣罗曼努斯门附近市民及牲畜、城墙平台",
          "deadline": "1453年5月29日黎明前"
        },
        "instantEcho": {
          "directResult": "射石炮被成功推上城墙，在奥斯曼总攻开始后发射了一枚石弹，击中敌军密集处，造成约五十人伤亡，但火炮后坐力导致城墙平台局部塌陷，火炮坠下城墙，砸死两名市民。",
          "unexpectedCost": "塌陷段城墙暴露，奥斯曼弓箭手趁机射杀城上守军，你被流矢射中右肩，失去行动能力。",
          "beneficiary": "守军（获得一次有效远程打击）",
          "payer": "两名市民被砸死，你受伤"
        }
      },
      {
        "id": "B",
        "displayLabel": "点燃油料火墙阻敌",
        "label": "你下令将内城储备的橄榄油和沥青全部搬运至圣罗曼努斯门缺口的城墙外沿，在奥斯曼军队接近时点燃，形成一道火墙阻止其突入，同时命令火器兵在火墙后布置铁蒺藜和拒马，改变防御方式。",
        "intent": "改变actualHistory中主要依靠火药和火炮的防御行动链，改为使用燃烧材料制造火墙，以物理方式改变战场态势。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令将橄榄油和沥青运至缺口外沿并点燃，同时在后方布置铁蒺藜",
          "target": "内城油库、沥青仓库、圣罗曼努斯门缺口外沿、火器兵",
          "deadline": "1453年5月29日黎明后，奥斯曼军队第一次冲击时"
        },
        "instantEcho": {
          "directResult": "火墙成功点燃，奥斯曼先锋部队约两百人被烧伤或被迫后退，但风向突变，火焰倒卷向城墙，引燃了城上木制防栅，守军被迫后撤救火，缺口处防御空虚，奥斯曼后续部队架梯从两侧攀上城墙。",
          "unexpectedCost": "你被火焰呛伤肺部，后被部下拖离，无法继续指挥；城墙防栅烧毁，守军伤亡三十余人。",
          "beneficiary": "奥斯曼军队（利用火墙造成的混乱趁虚登城）",
          "payer": "你重伤，守军失去城墙防栅，伤亡三十余人"
        }
      }
    ]
  },
  "columbus-1492": {
    "trajectory": {
      "historicalPath": "哥伦布在10月12日清晨亲自乘小艇登岸，升西班牙国旗，宣布占领，并接见泰诺人。",
      "preservedResult": "哥伦布登陆巴哈马群岛并以西班牙名义宣布占领，随后的殖民、疾病和征服改变了美洲。",
      "decisiveFork": "登岸前夜是否给哥伦布提供修正登岸计划的建议"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "呈递海图助哥伦布决策",
        "label": "你必须在日出前将绘有经纬度及暗礁的精确海图呈给哥伦布，并请求他明早亲自登岸定坐标，确保他按时主持占领仪式。",
        "intent": "保留哥伦布亲自登岸并宣布主权的历史链条。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "呈递精确海图并请求哥伦布亲自登岸定坐标",
          "target": "哥伦布与圣玛丽亚号海图桌",
          "deadline": "日出前"
        },
        "instantEcho": {
          "directResult": "哥伦布采纳海图，明日清晨亲自登岸，随即升起西班牙旗帜并宣告占领。",
          "unexpectedCost": "泰诺人误以为船队是神灵，后续接触中因哥伦布的命令导致一名泰诺首领被扣押为人质。",
          "beneficiary": "西班牙王室与哥伦布",
          "payer": "被扣押的泰诺首领及其部落"
        }
      },
      {
        "id": "B",
        "displayLabel": "建议以探险队换登岸队",
        "label": "你必须在日出前向哥伦布强烈建议：明早改派由你率领的十人探险队先登岸，哥伦布自己在母舰观望，待确认安全后才登陆。",
        "intent": "改变登岸队伍的最高指挥权，由你而非哥伦布率先踏足，从而改变占领命令的发出者。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "向哥伦布建议改派你率领探险队先登岸",
          "target": "哥伦布与旗舰指挥舱",
          "deadline": "日出前"
        },
        "instantEcho": {
          "directResult": "哥伦布勉强同意，明早你带领十人乘小艇登陆，踏上沙滩后你未作任何主权宣告，泰诺人友好地送来食物和水。",
          "unexpectedCost": "哥伦布在母舰上看到你和泰诺人欢谈，愤怒于你未宣誓占领，当天下午强行登岸并亲自升旗，但泰诺人已撤回内陆。",
          "beneficiary": "泰诺人获得短暂的不受干扰的接触时间",
          "payer": "你被哥伦布剥夺领航职务，成为船上杂役"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "传送陆地坐标给哥伦布",
        "label": "你把精确的陆地火光方位作为紧急信号呈报给哥伦布，并敦促他明早必须第一个登岸以确认航线，否则我们将错失新大陆。",
        "intent": "确保哥伦布仍然最先登岸并宣布占领。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "通过敲钟和旗语将陆地方位上报给哥伦布，并当面请求他优先登岸",
          "target": "哥伦布与船队旗语系统",
          "deadline": "日出前"
        },
        "instantEcho": {
          "directResult": "哥伦布确认信号后，下令凌晨组织登岸小队，由他亲率，顺利宣布占领。",
          "unexpectedCost": "暗中觊觎指挥权的马丁·平松对哥伦布抢先不满，埋下了日后分裂的隐患。",
          "beneficiary": "哥伦布获取首次发现者的全部荣誉",
          "payer": "马丁·平松的忠诚度受损"
        }
      },
      {
        "id": "B",
        "displayLabel": "以测水深为由延迟登岸",
        "label": "你以夜间测水深度数据异常为由，请求哥伦布推迟登岸至中午，以便你有更好时间绘制登岸区浅滩图，避免触礁。",
        "intent": "推迟登岸时间，使哥伦布无法在清晨黄金时刻宣告占领。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "向哥伦布提供一份伪造的夜间测深数据，并请求推迟登岸",
          "target": "哥伦布与海图舱",
          "deadline": "日出前"
        },
        "instantEcho": {
          "directResult": "哥伦布推迟登岸至正午，但另两名船长（平松与亚涅斯）私下商议后率各自船先在清晨登陆，升起卡斯蒂利亚旗帜。",
          "unexpectedCost": "哥伦布得知后怒不可遏，当众以失职和欺诈为由将你锁入舱中，并召回先锋，命令午后重新由他正式登陆。",
          "beneficiary": "马丁·平松获得抢先登岸的声望",
          "payer": "你被禁闭，并永远失去了记录官的信用"
        }
      }
    ]
  },
  "luther-1517": {
    "trajectory": {
      "historicalPath": "路德将拉丁文手稿交给维滕贝格印刷所，印刷匠连夜排印，商车将论纲运往莱比锡等地，论纲在德意志大学和教会人士中流传，引发争论并最终扩大为宗教改革。",
      "preservedResult": "论纲被迅速印刷传播，引发对赎罪券和教会权威的广泛争论，宗教改革由此扩大。",
      "decisiveFork": "印刷匠在商车出发前是否将手稿排印并装载上车，以及是否加上致主教们的公开信而加速传播。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "连夜排印拉丁文论纲并装车",
        "label": "你在开往莱比锡的商车黎明出发前，将路德交予的拉丁文九十五条论纲手稿连夜排印200份，附上致德意志主教的公开信，装入货箱，命车夫按原路线出发。",
        "intent": "保留历史：使用拉丁文、通过学术渠道传播，让教会权威和神学家先接触，引发程序性辩论，实际历史由此展开。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "连夜排印拉丁文九十五条论纲200份，附致德意志主教的公开信，装入开往莱比锡的商车货箱，命车夫按时出发",
          "target": "路德的拉丁文手稿、维滕贝格印刷所、开往莱比锡的商车",
          "deadline": "开往莱比锡的商车黎明出发前"
        },
        "instantEcho": {
          "directResult": "论纲在德意志各大学和教会人士中迅速流传，引发神学辩论，美因茨大主教向教廷报告，路德被要求收回；宗教改革由此扩大。",
          "unexpectedCost": "你彻夜未眠，一名学徒因劳累过度晕倒，你支付了双倍工钱并让他休息一日，无永久伤害。",
          "beneficiary": "马丁·路德，反对赎罪券的信众，以及后来支持宗教改革的诸侯",
          "payer": "你，印刷匠，承担了额外工钱并暂时损失一名劳力"
        }
      },
      {
        "id": "B",
        "displayLabel": "连夜排印德文论纲并广发市民",
        "label": "你在开往莱比锡的商车黎明出发前，将路德的拉丁文手稿连夜翻译成德语并排印500份，张贴于维滕贝格教堂、市政厅和集市，并让进城农民和市民免费取走，同时各发一份给莱比锡商车和开往其他方向的马车。",
        "intent": "改成维滕贝格居民清晨聚集阅读，愤怒情绪爆发，部分人冲向赎罪券贩卖点；莱比锡、埃尔福特等地随后也出现德语传单，导致社会动荡，教会谴责路德挑起骚乱，路德被迫提前与教会决裂",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "连夜将拉丁文手稿译成德语，排印500份，一部分张贴于公共场所，一部分分发给城内市民和路过的农民，并让莱比锡商车和其他方向马车各带走一叠",
          "target": "路德的拉丁文手稿、维滕贝格街道、商车、市民和农民",
          "deadline": "开往莱比锡的商车黎明出发前"
        },
        "instantEcho": {
          "directResult": "维滕贝格居民清晨聚集阅读，愤怒情绪爆发，部分人冲向赎罪券贩卖点；莱比锡、埃尔福特等地随后也出现德语传单，导致社会动荡，教会谴责路德挑起骚乱，路德被迫提前与教会决裂。",
          "unexpectedCost": "你因私自翻译和张贴冒犯教会的文书，被当地主教警告；一名伙计被教会卫兵短暂扣押，经你支付赎金后才释放。",
          "beneficiary": "德意志普通民众和反对赎罪券的激进派",
          "payer": "你，印刷匠，承受罚款和赎金损失，并和地方教会关系紧张"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "次日加印论纲并发送大学",
        "label": "在商车出发后，你于11月1日白天加印500份拉丁文论纲，附上路德写给阿尔布雷希特主教的解释信，通过驿站快速发往埃尔福特、科隆、莱比锡和海德堡的大学及主教府，确保教会内部辩论全面展开。",
        "intent": "保留历史：通过加印并定向发送给学术机构和教会高层，进一步巩固拉丁文论纲的学术传播路径，促使教廷启动正式程序，实际历史结果相同。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "白天加印500份拉丁文论纲，附上路德写给阿尔布雷希特主教的信，通过驿站快马发送到埃尔福特、科隆、莱比锡、海德堡的大学和主教府",
          "target": "拉丁文论纲、路德的信、大学和主教机构、驿站快马",
          "deadline": "1517年11月1日白天（实际历史中商车后后续传播）"
        },
        "instantEcho": {
          "directResult": "各大学神学院收到后展开辩论，科隆和埃尔福特大学要求路德前来答辩；美因茨主教正式向教廷控告，宗教改革按真实历史扩大。",
          "unexpectedCost": "你因加印耗尽了库存纸张，后续需要高价采购，损失了部分利润。",
          "beneficiary": "马丁·路德，教会改革派学者",
          "payer": "你，印刷匠，承担纸张成本和额外运费"
        }
      },
      {
        "id": "B",
        "displayLabel": "将论纲改写为讽刺画并市井散发",
        "label": "你于11月1日白天将论纲中的主要论点改写成通俗的讽刺诗，并配上一幅描绘赎罪券贩子被魔鬼拉扯的木刻画，印刷300份，在维滕贝格集市和附近村庄的教堂门口散发，同时委托进城卖农产品的农民带往其他市镇。",
        "intent": "改成当日傍晚，愤怒的民众袭击了赎罪券推销商台彻尔的住所，砸碎窗户并哄抢银箱；台彻尔连夜逃离维滕贝格，地方领主出兵弹压，造成数人受伤。路德虽公开谴责暴力，但局面失控，教会直接宣布路德为异端",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "白天将论纲改写为讽刺诗并刻木刻画印刷300份，在维滕贝格集市和附近教堂门口散发，并给进城的农民每人一份带回村庄",
          "target": "维滕贝格集市、教堂门口、农民、木刻画",
          "deadline": "1517年11月1日白天"
        },
        "instantEcho": {
          "directResult": "当日傍晚，愤怒的民众袭击了赎罪券推销商台彻尔的住所，砸碎窗户并哄抢银箱；台彻尔连夜逃离维滕贝格，地方领主出兵弹压，造成数人受伤。路德虽公开谴责暴力，但局面失控，教会直接宣布路德为异端。",
          "unexpectedCost": "你因煽动暴力被领主传讯，罚款并没收了部分印刷工具；一名徒弟在骚乱中被打伤手臂，你不得不停止经营数日。",
          "beneficiary": "极端改革派和反教会民众（短期受益，长期遭镇压）",
          "payer": "你，印刷匠，罚款、工具损失和徒弟的伤"
        }
      }
    ]
  },
  "galileo-1610": {
    "trajectory": {
      "historicalPath": "为了让 actualHistory 发生，作为伽利略委托制作铜版图的工匠，我在明早书商开印前，必须将伽利略提供的木星卫星最终结论图样雕刻成铜版，交付印刷所。",
      "preservedResult": "伽利略出版望远镜观测，包括木星卫星，强烈冲击了传统宇宙观。",
      "decisiveFork": "改变实际历史中只印最终结论的行动链，令出版内容包含完整观测日志，迫使学界面对更多原始证据。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "镌刻结论图版",
        "label": "今晚在印刷所，用刻刀将伽利略亲笔签名的最终结论星图精确刻入铜版，完成后立即交给排版工乔瓦尼。",
        "intent": "完整保留实际历史中只印最终结论的行动链，让木星卫星位置图以印刷品形式传播。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "用刻刀将伽利略亲笔签名的最终结论星图刻入铜版，并交付排版工乔瓦尼",
          "target": "伽利略亲笔签名的最终结论星图铜版",
          "deadline": "明早书商开印前"
        },
        "instantEcho": {
          "directResult": "铜版完成，印刷机开始印制附有木星卫星图的《星空使者》。",
          "unexpectedCost": "我手腕因长时间刻版酸痛，需休息数日。",
          "beneficiary": "伽利略及支持日心说的学者",
          "payer": "我"
        }
      },
      {
        "id": "B",
        "displayLabel": "改刻连续观测日志",
        "label": "今晚在印刷所，用刻刀将伽利略手稿中关于木星卫星连续一个月的观测日志（含位置记录）替代最终结论刻入铜版，故意偏离伽利略的指令，并威胁排版工乔瓦尼不得声张。",
        "intent": "改变实际历史中只印最终结论的行动链，令出版内容包含完整观测日志，迫使学界面对更多原始证据。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "用刻刀将伽利略手稿中的连续观测日志刻入铜版替代最终结论，并威胁排版工乔瓦尼保密",
          "target": "伽利略手稿中关于木星卫星的连续观测日志",
          "deadline": "明早书商开印前"
        },
        "instantEcho": {
          "directResult": "印刷出来的《星空使者》包含大量日志数据，伽利略发现后大怒，但书已开始发行。",
          "unexpectedCost": "伽利略与我断绝关系，罗马教廷立即引用日志中的日期矛盾质疑观测可靠性，引发更激烈争论。",
          "beneficiary": "维护托勒密体系的学者",
          "payer": "我"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "监督制版流程",
        "label": "明早开印前，我在印刷所强制排版工乔瓦尼只使用伽利略批准的最终结论版，并亲自锁存含观测日志的全部手稿，确保只有结论版付印。",
        "intent": "通过控制排版流程和手稿存档，确保实际历史中只印结论的结果不可逆转。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "强制排版工乔瓦尼只使用最终结论版，并锁存观测日志手稿",
          "target": "排版工乔瓦尼及观测日志手稿",
          "deadline": "明早书商开印前"
        },
        "instantEcho": {
          "directResult": "印刷只采用结论版，观测日志手稿被我锁入工作室箱子。",
          "unexpectedCost": "乔瓦尼事后向伽利略告状，我失去信任。",
          "beneficiary": "伽利略",
          "payer": "我"
        }
      },
      {
        "id": "B",
        "displayLabel": "删除观测日志页",
        "label": "明早开印前，我在印刷所趁人不备，从伽利略手稿中撕毁包含一个月连续观测日志的页码，只留下结论草图，并否认手稿存在过。",
        "intent": "通过销毁原始观测日志，迫使读者只能依赖印刷结论，改变了实际历史中原本存在手稿且可能被后来学者查阅的事实。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "从伽利略手稿中撕毁连续观测日志页码并丢弃",
          "target": "伽利略手稿中连续观测日志页",
          "deadline": "明早书商开印前"
        },
        "instantEcho": {
          "directResult": "日志页被销毁，伽利略发现后指控我破坏证据，但印刷品已无法更改。",
          "unexpectedCost": "伽利略向威尼斯当局举报，我面临盗窃和破坏指控。",
          "beneficiary": "托勒密体系支持者",
          "payer": "我"
        }
      }
    ]
  },
  "newton-principia-1687": {
    "trajectory": {
      "historicalPath": "保留手稿中实际使用的横线符号，以确保公式按牛顿原样出版，同时避免哈雷因延期或重排而承担额外费用。",
      "preservedResult": "在哈雷资助与推动下，牛顿的《自然哲学的数学原理》出版，以运动定律和万有引力统一解释天体与地面运动。",
      "decisiveFork": "改变实际历史中留下的圆点符号，使牛顿的公式在首次印刷即完全准确，但可能延误装订。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "默许符号照排装订",
        "label": "你在末页第3栏第7行发现排好的圆点符号与手稿的横线有出入，但决定不报告、不改动，通知排字主管‘照此付印’。",
        "intent": "保留手稿中实际使用的横线符号，以确保公式按牛顿原样出版，同时避免哈雷因延期或重排而承担额外费用。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "默许排好的圆点符号不改为横线，通知排字主管照此付印",
          "target": "排字主管和末页模板",
          "deadline": "第一批书装订前两个时辰"
        },
        "instantEcho": {
          "directResult": "末页原位保留圆点符号（实际应为横线），但书籍按时装订出版，哈雷和皇家学会收到第一批书。",
          "unexpectedCost": "哈雷事后发现符号错误，公开责备校对不精，你失去后续校对委托。",
          "beneficiary": "哈雷（按期出版，无需追加资金）",
          "payer": "你（声誉受损，失掉兼职收入）"
        }
      },
      {
        "id": "B",
        "displayLabel": "停机强行改回横线",
        "label": "你喝令排字工停机，亲手用刻刀将末页第3栏第7行的圆点改成横线，并锁闭模板半小时直至新版校对完成。",
        "intent": "改变实际历史中留下的圆点符号，使牛顿的公式在首次印刷即完全准确，但可能延误装订。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "喝令排字工停机，亲手用刻刀将末页第3栏第7行的圆点改成横线，并锁闭模板半小时",
          "target": "排字工和末页模板",
          "deadline": "第一批书装订前一个半时辰"
        },
        "instantEcho": {
          "directResult": "末页符号被改为横线，但与牛顿手稿原貌一致；书籍因此推迟半个时辰装订，部分订单未能赶上当日邮车。",
          "unexpectedCost": "哈雷因延迟支付了额外加班费，并对你擅专愤怒；印刷所把你解雇。",
          "beneficiary": "牛顿（首印版完全准确）",
          "payer": "你（被解雇，且哈雷不再推荐）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "催促秘书按原样签发",
        "label": "你代替哈雷的秘书，将校对单上的‘末页符号待定’直接划掉，并盖章‘照原稿付印’，让学徒立即送回印刷车间。",
        "intent": "绕过排印工，利用秘书授权使原稿符号（横线）被忽略，出版时实际保留圆点，确保历史上首版‘符号错误’结果不变。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "在秘书已批注‘待定’的校对单上划掉该批注，重新盖章‘照原稿付印’并让学徒送回车间的动作",
          "target": "哈雷的校对单与印刷车间",
          "deadline": "第一批书装订前两时辰"
        },
        "instantEcho": {
          "directResult": "车间按原付印通知完成装订，首版书流入市场，符号保持圆点（历史真实）。",
          "unexpectedCost": "哈雷发现秘书批复被篡改后，把你调离校对岗位，罚扣当月薪金。",
          "beneficiary": "印刷所（无延期成本）",
          "payer": "你（调岗降薪）"
        }
      },
      {
        "id": "B",
        "displayLabel": "截留首本样本重印",
        "label": "你抢在装订工封存之前，偷走已装订好的第一本成品书，用藏匿的铅字重新排版末页三行，并在二更前放回。",
        "intent": "实际改变首版书的内容，使首本成品出现修正版，为历史留下一个纠正错误的孤本。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "偷走装订好的第一本成品书，拆开末页三行并重新排入横线符号，再放回成品堆",
          "target": "印刷车间已装订的首本样本",
          "deadline": "第一批书装订前一时辰"
        },
        "instantEcho": {
          "directResult": "首本样本出现和其余批不同的末页符号；其余批仍按错误符号出版。",
          "unexpectedCost": "装订工发现首本异常，告发于主管；你被指控破坏公物并被印刷所开除。",
          "beneficiary": "未来收藏者（拥有唯一纠正版）",
          "payer": "你（彻底失去职务）"
        }
      }
    ]
  },
  "bastille-1789": {
    "trajectory": {
      "historicalPath": "保留真实历史中市民攻占巴士底狱、夺取火药、释放囚犯、处死总督的关键结果，通过提前炮击加速占领，但未改变事件本质。",
      "preservedResult": "巴黎市民攻占巴士底狱，处死总督德劳内，事件成为法国大革命的象征。",
      "decisiveFork": "改变真实历史中正面强攻的路径，通过爆破突袭实现相同结果（夺取火药、释放囚犯、处死总督），但控制了占领进程。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "轰开城门夺火药",
        "label": "你在谈判破裂前，指挥从荣军院缴获的四门火炮对准巴士底狱主大门发射三枚实心弹，轰开城门，市民蜂拥而入，夺取火药库并释放七名囚犯，总督德劳内在混战中被杀。",
        "intent": "保留真实历史中市民攻占巴士底狱、夺取火药、释放囚犯、处死总督的关键结果，通过提前炮击加速占领，但未改变事件本质。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "指挥四门火炮轰击巴士底狱主大门",
          "target": "巴士底狱主大门及守军",
          "deadline": "守军与人群谈判破裂前"
        },
        "instantEcho": {
          "directResult": "城门被轰开，市民涌入，火药被夺，囚犯释放，德劳内被处死。",
          "unexpectedCost": "一名炮手因火炮爆炸死亡，你被追究指挥失职，被迫离开巴黎市民武装，流亡外省。",
          "beneficiary": "巴黎市民武装（获得火药和囚犯）",
          "payer": "总督德劳内（被处死）、一名炮手（死亡）"
        }
      },
      {
        "id": "B",
        "displayLabel": "爆破侧门夺火药",
        "label": "你在谈判破裂前，用从荣军院取来的火药自制爆破包，炸开巴士底狱厨房侧门，带领三十名武装市民沿楼梯直冲火药库，解除少量守卫武装后搬出全部火药，并打开囚室释放七名囚犯，总督德劳内在城墙上被市民抓获处死。",
        "intent": "改变真实历史中正面强攻的路径，通过爆破突袭实现相同结果（夺取火药、释放囚犯、处死总督），但控制了占领进程。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "自制火药包炸开侧门，带队突入夺取火药库并释放囚犯",
          "target": "巴士底狱侧门、火药库、七名囚犯",
          "deadline": "守军与人群谈判破裂前"
        },
        "instantEcho": {
          "directResult": "爆炸巨响引发混乱，市民迅速涌入，火药被搬出，囚犯释放，德劳内被处死。",
          "unexpectedCost": "爆炸波及两名市民轻伤，你被要求公开道歉并离开巴黎，流亡外省。",
          "beneficiary": "巴黎市民武装（快速获胜）、囚犯（获释）",
          "payer": "总督德劳内（被处死）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "策反军官开内门",
        "label": "你在谈判破裂前，利用退役炮兵身份与守军中一名炮兵军官私下接触，承诺支付三百里弗尔并保证其人身安全，换取他打开通往火药库的侧门。该军官在关键时刻依计开门，市民武装无声控制火药库，释放囚犯，德劳内发觉后试图抵抗，被手下绑送市民处死。",
        "intent": "保留真实历史中夺取火药、释放囚犯、处死总督的结果，但通过内部策反实现，未使用正面强攻。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "私下策反炮兵军官打开内部侧门",
          "target": "巴士底狱炮兵军官",
          "deadline": "守军与人群谈判破裂前"
        },
        "instantEcho": {
          "directResult": "侧门打开，市民武装迅速控制火药库和囚犯，德劳内被抓获处死。",
          "unexpectedCost": "策反事后泄露，部分市民指责你收买叛徒，你被迫流亡外省。",
          "beneficiary": "巴黎市民武装、被策反军官（获金钱和安全）",
          "payer": "总督德劳内（被处死）"
        }
      },
      {
        "id": "B",
        "displayLabel": "发信号引总攻",
        "label": "你在谈判破裂前，从巴士底狱外一处制高点使用三色旗向市民武装发出总攻信号，同时命令火炮手瞄准城门连射五发。守军在其炮火掩护下仓促回击，市民在混乱中用攻城锤撞开大门，蜂拥而入，夺取火药和囚犯，德劳内被处死。",
        "intent": "改变真实历史中无统一信号的自发强攻，通过信号引导和集中火力加速攻占，但保留关键事件。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "用三色旗发出总攻信号并指挥火炮集中轰击",
          "target": "市民武装和巴士底狱大门",
          "deadline": "守军与人群谈判破裂前"
        },
        "instantEcho": {
          "directResult": "总攻信号发出，火炮齐射压制守军，城门被撞开，市民涌入，火药和囚犯被夺，德劳内被处死。",
          "unexpectedCost": "由于信号过早，部分市民准备不足出现伤亡，你被指责指挥鲁莽，被迫离开巴黎流亡。",
          "beneficiary": "巴黎市民武装（高效攻占）、囚犯（获释）",
          "payer": "总督德劳内（被处死）"
        }
      }
    ]
  },
  "waterloo-1815": {
    "trajectory": {
      "historicalPath": "拿破仑命令内伊率近卫军向拉贝尔联盟中央阵地发起最后冲击，同时格鲁希元帅未回援，普鲁士军从东面抵达战场。",
      "preservedResult": "拿破仑投入近卫军仍未能击溃威灵顿，普鲁士军抵达后法军全线溃败，拿破仑再次退位。",
      "decisiveFork": "地图官是否在普鲁士先锋出现时向拿破仑指明敌军番号和数量，促使他放弃投入近卫军、改令戴尔隆军团就地掩护撤退。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "报告普鲁士军逼近",
        "label": "你在deadline前来到拿破仑面前，指着东面烟尘说：‘陛下，那是比洛的第四军，已不到三公里。’然后退后等待命令。",
        "intent": "保留真实历史中拿破仑得知普军抵达后仍决定投入近卫军的行动链，使该信息被传达但未改变决定。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "报告普鲁士军逼近的具体番号和位置",
          "target": "拿破仑",
          "deadline": "普鲁士先锋已出现在右翼"
        },
        "instantEcho": {
          "directResult": "拿破仑听到报告后依然命令近卫军前进，近卫军冲击失败，法军溃败。",
          "unexpectedCost": "报告被拿破仑斥责为‘动摇军心’，你被记恨但未遭处罚。",
          "beneficiary": "威灵顿同盟军",
          "payer": "你本人失去拿破仑信任"
        }
      },
      {
        "id": "B",
        "displayLabel": "谎报普鲁士军为友军",
        "label": "你在deadline前冲到拉贝杜瓦耶面前篡改传令：告诉内伊元帅‘东面来的是格鲁希的援军’，使近卫军推迟出动，法军转向迎击布吕歇尔。",
        "intent": "改变真实历史中近卫军正面冲击的关键结果，使法军转而侧击普鲁士军，但威灵顿趁机反攻。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "篡改传令，谎称普鲁士军是格鲁希部",
          "target": "拉贝杜瓦耶（传令官）",
          "deadline": "普鲁士先锋已出现在右翼"
        },
        "instantEcho": {
          "directResult": "近卫军未向威灵顿阵地冲击，而是掉头向东；普鲁士军先头被击退，但威灵顿趁机发动总攻，法军仍败。",
          "unexpectedCost": "你因篡改命令被宪兵当场逮捕，战后被以叛国罪审判。",
          "beneficiary": "拿破仑暂时保存了近卫军部分兵力",
          "payer": "你本人面临军事法庭审判"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "递交普军抵达军报",
        "label": "你在deadline前让侍从官将截获的普军书信直接呈送拿破仑，信上写明布吕歇尔将在一小时内合围。",
        "intent": "使用不同程序（书面情报而非口头报告）实现与A1相同的保留历史结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "递交截获的普军书信",
          "target": "拿破仑",
          "deadline": "普鲁士先锋已出现在右翼"
        },
        "instantEcho": {
          "directResult": "拿破仑看后沉默片刻，仍下令近卫军进攻，战局不变。",
          "unexpectedCost": "书信被参谋长贝蒂埃扣留了十分钟才呈上，导致近卫军出击稍晚，但最终结果一样。",
          "beneficiary": "威灵顿同盟军",
          "payer": "你因未亲自呈送而被贝蒂埃斥责越级"
        }
      },
      {
        "id": "B",
        "displayLabel": "调转炮兵轰击普鲁士军",
        "label": "你在deadline前命令近卫军炮队指挥官德武将12磅炮转向东面，对着普鲁士先锋齐射三发，迫使布吕歇尔暂停前进。",
        "intent": "使用炮兵火力直接改变普鲁士军抵达的时间窗口，使近卫军得以集中攻击威灵顿，但最终仍因兵力分散而败。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令近卫军炮队转向东射击",
          "target": "德武（近卫军炮队指挥官）",
          "deadline": "普鲁士先锋已出现在右翼"
        },
        "instantEcho": {
          "directResult": "普鲁士先头部队遭炮击停滞，近卫军主力冲击威灵顿阵地；威灵顿负伤但防线未破，法军弹药耗尽，最终仍溃败。",
          "unexpectedCost": "你因越权指挥炮兵被拿破仑当场撤职，且炮击暴露了法军右翼弱点，普鲁士军从侧后迂回成功。",
          "beneficiary": "威灵顿同盟军（因法军过早耗尽炮弹）",
          "payer": "你被剥夺军职，战后流亡"
        }
      }
    ]
  },
  "origin-species-1859": {
    "trajectory": {
      "historicalPath": "保留实际历史中首印版无观测清单的状态。",
      "preservedResult": "《物种起源》首印当日售罄，自然选择理论引发科学界与社会广泛讨论。",
      "decisiveFork": "改变出版内容，使首印本包含可反驳的自然选择验证项。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "锁存清单",
        "label": "你从编辑桌取出达尔文手写的“可验证观测清单”，锁入出版社保险柜，并告知约翰·默雷清单已移除，第1版按现有样式装运。",
        "intent": "保留实际历史中首印版无观测清单的状态。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "锁入保险柜并告知",
          "target": "达尔文的观测清单和约翰·默雷",
          "deadline": "装运开始前一小时"
        },
        "instantEcho": {
          "directResult": "第1版准时装运，无观测清单。",
          "unexpectedCost": "托马斯·赫胥黎私下批评你过于谨慎。",
          "beneficiary": "约翰·默雷",
          "payer": "你（职场声誉）"
        }
      },
      {
        "id": "B",
        "displayLabel": "替换清单",
        "label": "你拿出一份自己编写的“公众验证清单”（含10条可查证的动植物变异例），替换达尔文的原稿最后一页，并命令印刷工紧急重印最后4页装订入封底。",
        "intent": "改变出版内容，使首印本包含可反驳的自然选择验证项。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "替换并命令重印",
          "target": "第1版最后4页和印刷工团队",
          "deadline": "装运开始前一小时"
        },
        "instantEcho": {
          "directResult": "首批500本中的10本包含你的观测清单（因印刷错误仅有部分装订完成）。",
          "unexpectedCost": "约翰·默雷当场训斥你擅自修改书籍。",
          "beneficiary": "华莱士（他的理论获得提前验证关注）",
          "payer": "你（与出版人的信任受损）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "烧毁底稿",
        "label": "你直接拿过达尔文手写的观测清单，在壁炉中烧尽，并吩咐排版工按原版样稿印刷，不得提及此事。",
        "intent": "用销毁手段确保无观测清单出现在任何印本中。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "烧毁并吩咐",
          "target": "达尔文手写底稿和排版工",
          "deadline": "装运开始前一小时"
        },
        "instantEcho": {
          "directResult": "底稿灰烬被清扫，印刷完全按原计划进行。",
          "unexpectedCost": "达尔文事后得知原稿被毁，感到不快。",
          "beneficiary": "约翰·默雷（发行不受干扰）",
          "payer": "你（与达尔文的关系紧张）"
        }
      },
      {
        "id": "B",
        "displayLabel": "散布清单",
        "label": "你拿着观测清单的副本冲出出版社，在门口分发给十位等候的报馆记者，声称这是达尔文给公众的公开发难。",
        "intent": "通过提前传播观测清单，改变自然选择争议的起点。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "分发并声称",
          "target": "观测清单和十位报馆记者",
          "deadline": "装运开始前一小时"
        },
        "instantEcho": {
          "directResult": "次日多家报纸刊登清单，引发比真实历史更早的公众验证浪潮。",
          "unexpectedCost": "达尔文通过信件严厉质疑你越权发布未经核实的材料。",
          "beneficiary": "报社编辑们（获得独家新闻）",
          "payer": "你和达尔文之间的合作关系"
        }
      }
    ]
  },
  "lincoln-emancipation-1862": {
    "trajectory": {
      "historicalPath": "为了让actualHistory发生，战争部电报官必须在今夜（1862年9月22日）最后一班电报线路切换为军用之前，将林肯总统签署的《解放宣言》初稿全文发往所有主要报社，确保南方各州在100天期限前通过报纸知晓宣言内容。",
      "preservedResult": "林肯公布《解放宣言》初稿，宣布叛乱州若不回归，奴隶将在1863年1月1日起获得自由。",
      "decisiveFork": "改变宣言发布的行动链，通过扣押和伪造指令，使宣言无法在当晚送达报社，从而改变实际历史结果。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "立即全文发报宣言",
        "label": "你在白宫电报室以战争部电报官身份，抢在最后一班电报线路切换为军用前一小时，将林肯签署的《解放宣言》初稿全文发往《纽约论坛报》《华盛顿晚报》等六家报社，并亲自确认电报发送成功。",
        "intent": "保留真实历史中林肯下令发布宣言的行动链，确保宣言按时送达报社，使南方各州在100天期限内知晓。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "全文发报《解放宣言》初稿至六家主要报社，并确认收到回执",
          "target": "林肯总统签署的《解放宣言》初稿、六家报社（《纽约论坛报》《华盛顿晚报》《波士顿日报》《费城公报》《巴尔的摩太阳报》《辛辛那提纪事报》）",
          "deadline": "最后一班电报线路切换为军用前一小时（即1862年9月22日当晚）"
        },
        "instantEcho": {
          "directResult": "六家报社在一小时内收到宣言全文，次日清晨各报头版刊登《解放宣言》初稿，南方各州通过报纸获悉宣言内容。",
          "unexpectedCost": "由于你未按常规流程先呈报战争部长审核，引发部长埃德温·斯坦顿的强烈不满，他口头警告你越级操作。",
          "beneficiary": "林肯总统、废奴派议员",
          "payer": "电报官本人（战争部长斯坦顿的不满）"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣押宣言推迟发布",
        "label": "你以电报官身份，在收到林肯签署的宣言后，没有立即发报，而是以“线路故障”为由将宣言原文扣留在电报室，并伪造一份“需战争部长签字”的退回便条送回白宫，阻止宣言当夜发出。",
        "intent": "改变宣言发布的行动链，通过扣押和伪造指令，使宣言无法在当晚送达报社，从而改变实际历史结果。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "将宣言原文扣留于电报室保险柜，并伪造战争部长退文便条，派人送回白宫",
          "target": "林肯总统签署的《解放宣言》初稿、战争部长埃德温·斯坦顿、白宫信使",
          "deadline": "最后一班电报线路切换为军用前一小时（即1862年9月22日当晚）"
        },
        "instantEcho": {
          "directResult": "宣言当夜未发出，次日白宫收到伪造退条，林肯怀疑战争部长拖延，两人陷入短暂争执；南方各州未在第一时间获得宣言全文。",
          "unexpectedCost": "由于你伪造文件，战争部秘书处有一名办事员认出便条笔迹异常，向斯坦顿报告，引起内部调查。",
          "beneficiary": "民主党保守派、蓄奴州利益代言人",
          "payer": "电报官本人（面临调查风险）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "通过军人电报网发送",
        "label": "你以战争部电报官身份，在白宫内阁厅未被授权直接使用军用电报线的情况下，闯入隔壁军用电报室，将宣言全文通过军用电报线路加密发送给前线五位主要指挥官，要求他们在驻地印刷并转发地方报纸。",
        "intent": "使用军用电报线路这一不同器物，实现宣言传播的真实历史轨道，确保南方各州通过多渠道在100天期限内获知宣言。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "使用军用电报线路，将宣言全文加密发送给前线五位指挥官（麦克莱伦、伯恩赛德、胡克、格兰特、巴特勒），并命令他们印刷转发",
          "target": "军用电报设备、五位联邦主要将领",
          "deadline": "最后一班电报线路切换为军用前一小时（即1862年9月22日当晚）"
        },
        "instantEcho": {
          "directResult": "前线指挥官收到宣言，格兰特在辖区连夜印刷，次日清晨分发；南方各州通过战区和报纸两种渠道获知宣言。",
          "unexpectedCost": "你擅闯军用电报室被卫兵发现，当场逮捕并以间谍嫌疑扣押12小时。",
          "beneficiary": "林肯总统、联邦军队内部废奴派",
          "payer": "电报官本人（被扣押）"
        }
      },
      {
        "id": "B",
        "displayLabel": "篡改宣言核心条款",
        "label": "你以电报官身份，在发报时将宣言中“叛乱州奴隶将在1863年1月1日起获得自由”修改为“叛乱州奴隶将在1863年7月1日后逐步获得自由”，并附加“需经各州议会批准”，然后发给所有报社。",
        "intent": "改变宣言命令方向，通过篡改核心条款，使实际结果发生变化：南方奴隶获得自由的时间推迟且附加条件。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "将宣言原文中关于自由生效的日期和条件进行篡改，并将篡改后的文本发往六家报社",
          "target": "林肯总统签署的《解放宣言》初稿、六家报社、电报设备",
          "deadline": "最后一班电报线路切换为军用前一小时（即1862年9月22日当晚）"
        },
        "instantEcho": {
          "directResult": "次日各报刊登的宣言为篡改版本，林肯发现后震怒，下令收回所有报纸并重新发布正确版本；南方各州获得错误信息，部分奴隶主推迟释放奴隶计划。",
          "unexpectedCost": "由于篡改文件是联邦重罪，战争部立即启动调查，你被列为首要嫌疑人，开始逃亡。",
          "beneficiary": "南方奴隶主、联邦保守派",
          "payer": "电报官本人（被通缉追捕）"
        }
      }
    ]
  },
  "sarajevo-1914": {
    "trajectory": {
      "historicalPath": "司机因未被告知更改路线，沿原定路线经过拉丁桥，普林西普在此开枪。",
      "preservedResult": "车队按错误路线驶近拉丁桥，普林西普枪杀斐迪南大公夫妇，危机在一个月内演变为第一次世界大战。",
      "decisiveFork": "司机在市政厅出发后是否知晓更改路线"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "拦截路线变更通知",
        "label": "你在市政厅门前拦住奥地利副官冯·维斯纳，以紧急公务为由拖延其向司机传达路线变更指令，直到车队出发，确保司机沿原错误路线行驶，8分钟后经过拉丁桥。",
        "intent": "保留历史中路线错误导致刺杀成功的行动链。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "拦截奥匈副官冯·维斯纳，拖延其传达路线变更指令",
          "target": "奥匈副官冯·维斯纳",
          "deadline": "距车队出发前即刻"
        },
        "instantEcho": {
          "directResult": "司机未获知改道，车队按原路线驶入拉丁桥，普林西普开枪，斐迪南大公夫妇身亡。",
          "unexpectedCost": "奥匈情报人员注意到你的拦截行为，事件后塞尔维亚政府被迫与你切割，你被撤职流放。",
          "beneficiary": "普林西普（刺杀成功）",
          "payer": "斐迪南大公夫妇（生命）"
        }
      },
      {
        "id": "B",
        "displayLabel": "强行纠正车队路线",
        "label": "你在市政厅门前从冯·维斯纳手中接过路线变更命令，以塞尔维亚联络员身份亲自向司机扬科维奇确认新路线，命令车队直接驶往医院并绕开拉丁桥，确保安全。",
        "intent": "改成斐迪南大公夫妇安全返回行宫，普林西普未开枪。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "从冯·维斯纳手中取过命令并亲自向司机扬科维奇宣读新路线",
          "target": "司机扬科维奇",
          "deadline": "距车队出发前即刻"
        },
        "instantEcho": {
          "directResult": "车队避开拉丁桥，斐迪南大公夫妇安全返回行宫，普林西普未开枪。",
          "unexpectedCost": "奥匈帝国质疑塞尔维亚政府干预警卫安排，立即发出强硬照会，塞尔维亚政府面临外交危机。",
          "beneficiary": "斐迪南大公夫妇（生命保全）",
          "payer": "普林西普及其组织（行动失败）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "延迟警方警戒指令",
        "label": "你利用联络员身份，要求萨拉热窝警察总局值班员暂缓向拉丁桥路段发送‘加强警戒’的无线电报4分钟，令该区域警察在车队经过时仍保持未加强状态，使普林西普能在无人干涉条件下开枪。",
        "intent": "保留历史中现场警戒不足导致刺杀成功的条件。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "要求警察总局值班员暂缓发送‘加强警戒’无线电报4分钟",
          "target": "萨拉热窝警察总局值班员科瓦奇",
          "deadline": "距车队抵达拉丁桥前5分钟"
        },
        "instantEcho": {
          "directResult": "拉丁桥区域警察未及时加强警戒，普林西普顺利开枪击中斐迪南大公夫妇。",
          "unexpectedCost": "你通过电话下达的命令被警方记录，事后奥匈帝国以此作为塞尔维亚政府参与刺杀的证据，塞尔维亚政府被迫公开否认并与你划清界限。",
          "beneficiary": "普林西普（刺杀成功）",
          "payer": "斐迪南大公夫妇（生命）"
        }
      },
      {
        "id": "B",
        "displayLabel": "建议更换防弹车辆",
        "label": "你以塞尔维亚总理府名义紧急致函奥地利侍从官卡尔·冯·图恩，建议将斐迪南大公夫妇换乘封闭防弹汽车，并绕开拉丁桥直驶火车站，取消市区停留，使车队完全避开普林西普的伏击点。",
        "intent": "改成斐迪南大公夫妇乘坐防弹车直达火车站，当天离开萨拉热窝，普林西普未得手。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "书面建议奥地利侍从官换乘防弹车并直驶火车站",
          "target": "奥地利侍从官卡尔·冯·图恩",
          "deadline": "距车队从市政厅出发前10分钟"
        },
        "instantEcho": {
          "directResult": "斐迪南大公夫妇换乘防弹车直达火车站，当天返回维也纳，普林西普未能开枪。",
          "unexpectedCost": "奥匈帝国指责塞尔维亚政府‘过度干涉内政’，外交关系急剧恶化，塞尔维亚面临最后通牒。",
          "beneficiary": "斐迪南大公夫妇（生命保全）",
          "payer": "普林西普及其组织（行动失败）"
        }
      }
    ]
  },
  "october-revolution-1917": {
    "trajectory": {
      "historicalPath": "列宁在斯莫尔尼宫指示起义部队夺取电报局、广播站和桥梁，你作为电报调度员需要确保命令传达至各分队并切断冬宫对外联络。",
      "preservedResult": "布尔什维克控制彼得格勒关键设施并攻占冬宫，推翻临时政府，随后建立苏维埃政权。",
      "decisiveFork": "是否在临时政府反应前切断冬宫电话，并向全城广播起义已经开始"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "切断冬宫电话",
        "label": "你在斯莫尔尼宫下令中央电报局值班员立即切断冬宫全部电话线路，并通过广播线路向全城播报‘起义已经开始，临时政府已被包围’。",
        "intent": "保留真实历史中布尔什维克切断临时政府对外通讯的行动链，确保冬宫无法向外求援。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "口头命令电报局值班员切断冬宫所有电话线路，并亲自通过广播设备播报起义消息。",
          "target": "彼得格勒中央电报局值班员和冬宫电话线路",
          "deadline": "克伦斯基的汽车离开首都求援前半小时"
        },
        "instantEcho": {
          "directResult": "冬宫电话线路中断，临时政府无法联系外部援军；起义广播传遍全城，工人和士兵纷纷响应。",
          "unexpectedCost": "部分布尔什维克联络线路因误操作短暂中断，但几分钟后恢复。",
          "beneficiary": "布尔什维克起义部队",
          "payer": "临时政府（失去通讯和舆论控制）"
        }
      },
      {
        "id": "B",
        "displayLabel": "调装甲车堵路",
        "label": "你以革命军事委员会名义，命令原本进攻冬宫的装甲车分队指挥官改变路线，立即封锁涅瓦大街和通往郊区的桥梁，阻止克伦斯基的汽车离开。",
        "intent": "改变真实历史中克伦斯基成功逃离彼得格勒的结果，将其截获或逼迫其隐藏，从而削弱临时政府的指挥能力。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "口头命令装甲车分队指挥官改变原定进攻冬宫的路线，转为封锁涅瓦大街和通往郊区的桥梁。",
          "target": "装甲车分队指挥官（真实人物）及涅瓦大街、通往郊区桥梁",
          "deadline": "克伦斯基的汽车出发前"
        },
        "instantEcho": {
          "directResult": "装甲车封锁了主要道路，克伦斯基的汽车无法通过，被迫返回冬宫附近躲藏。",
          "unexpectedCost": "冬宫正面防线因缺少装甲车支援，起义部队进攻时遭遇更猛烈抵抗，伤亡增加。",
          "beneficiary": "布尔什维克（抓获克伦斯基的可能性提高）",
          "payer": "进攻冬宫的步兵部队（伤亡加重）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "抢占广播站",
        "label": "你亲自带领三名赤卫队员冲进彼得格勒广播站，用枪迫使站长立即将麦克风交给你，并向全城宣布‘临时政府已垮台，起义胜利’。",
        "intent": "使用武装夺取广播站的方式，替代通过电话命令执行同一历史轨道，确保起义消息迅速扩散。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "带领三名赤卫队员冲进广播站，持枪命令站长交出麦克风，亲自播报起义胜利消息。",
          "target": "彼得格勒广播站站长及广播设备",
          "deadline": "克伦斯基的汽车离开首都求援前半小时"
        },
        "instantEcho": {
          "directResult": "广播站被占领，起义消息传遍全城；临时政府试图通过电话反驳但线路已被切断。",
          "unexpectedCost": "广播站外有临时政府支持者试图夺回，发生短暂枪战，一名赤卫队员轻伤。",
          "beneficiary": "布尔什维克起义部队",
          "payer": "临时政府（失去舆论阵地）"
        }
      },
      {
        "id": "B",
        "displayLabel": "伏击克伦斯基汽车",
        "label": "你以革命军事委员会名义，命令一支原本攻打冬宫的小分队携带两挺机枪，隐蔽在冬宫后门附近的街角，准备在克伦斯基的汽车驶出时开火拦截。",
        "intent": "改变真实历史中克伦斯基成功逃离的结果，通过直接武力拦截使其无法离开彼得格勒。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "口头命令小分队队长带机枪埋伏在冬宫后门街角，拦截克伦斯基的汽车。",
          "target": "小分队队长及机枪手，冬宫后门街角",
          "deadline": "克伦斯基的汽车出发前"
        },
        "instantEcho": {
          "directResult": "克伦斯基的汽车驶出后门时遭到机枪射击，司机受伤，汽车撞向街角，克伦斯基弃车徒步逃向附近美国大使馆。",
          "unexpectedCost": "枪战导致附近民居窗户破碎和一名行人受伤，引发部分市民恐慌；小分队有两名士兵被汽车残骸碎片划伤。",
          "beneficiary": "布尔什维克（延迟了克伦斯基求援）",
          "payer": "附近居民和进攻冬宫的部队（因小分队抽走导致冬宫正面进攻延缓）"
        }
      }
    ]
  },
  "roosevelt-bank-holiday-1933": {
    "trajectory": {
      "historicalPath": "实际执行罗斯福总统的关键行动链，确保所有人按时收到命令，真实历史结果发生。",
      "preservedResult": "罗斯福宣布全国银行休业并推动紧急银行法，经过审查的银行随后分批重开，公众信心开始恢复。",
      "decisiveFork": "改成东部银行部分未及时关门，发生大规模挤兑，至少20家银行当天倒闭；全国休业令最终于午间才生效"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "向全美发报休业令",
        "label": "你命令所有报务员同时向48个州银行监管机构发送总统全国银行休业令电文，要求立即关闭所有银行四天，不得延迟或确认。",
        "intent": "实际执行罗斯福总统的关键行动链，确保所有人按时收到命令，真实历史结果发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令六名报务员同时发送银行休业令电文",
          "target": "各州银行监管机构",
          "deadline": "纽约银行开门前"
        },
        "instantEcho": {
          "directResult": "所有银行在纽约股市开盘前同步关门，挤兑立即停止，公众恐慌缓解。",
          "unexpectedCost": "你因绕过财政部部长直接发令，事后被警告，三个月内不得晋升。",
          "beneficiary": "罗斯福总统、美国银行系统、储户",
          "payer": "你本人（职业生涯受挫）"
        }
      },
      {
        "id": "B",
        "displayLabel": "只发东部十二州休业令",
        "label": "你命令报务员仅向东部12个州发送休业令，并附加“生效时间推迟至午间，重开日期待定”的模糊措辞，其他州不发送。",
        "intent": "改成东部银行部分未及时关门，发生大规模挤兑，至少20家银行当天倒闭；全国休业令最终于午间才生效",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令报务员仅向东部州发送休业令并附加模糊措辞",
          "target": "东部12个州银行监管机构",
          "deadline": "纽约银行开门前"
        },
        "instantEcho": {
          "directResult": "东部银行部分未及时关门，发生大规模挤兑，至少20家银行当天倒闭；全国休业令最终于午间才生效。",
          "unexpectedCost": "你因违抗总统命令导致银行倒闭，当天被联邦调查局逮捕审问。",
          "beneficiary": "持有现金的投机者和地下钱庄",
          "payer": "倒闭银行的储户（损失存款）及你本人（被拘留）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "通过广播宣告休业令",
        "label": "你直接使用财政部广播电台，向全美广播总统的银行休业令，并同步通过电话线向各州银行监管机构紧急传达命令，确保人人知晓。",
        "intent": "使用不同杠杆（广播加电话）执行同一历史路径，强制所有银行按时关门，最终落地实际历史结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "通过广播和电话线同时宣告休业令",
          "target": "全国公众及各州银行监管机构",
          "deadline": "纽约银行开门前"
        },
        "instantEcho": {
          "directResult": "休业令通过广播传遍全国，挤兑在开盘前停止；总统公开表扬你。",
          "unexpectedCost": "你因未经授权使用广播设备，被财政部部长停职两周，后复职。",
          "beneficiary": "罗斯福总统、全国银行系统、你本人",
          "payer": "财政部部长（权威受损）"
        }
      },
      {
        "id": "B",
        "displayLabel": "发送伪造的延期营业令",
        "label": "你逮捕电报室主管，接管所有电报权，然后向全国银行发送伪造命令：“银行假日期间照常营业，营业时间延长至下午6点”，意图引发混乱。",
        "intent": "彻底改变命令内容和方向，导致银行系统分裂，全国性挤兑爆发，结果完全偏离实际历史。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "逮捕主管，接管电报权，发送伪造命令",
          "target": "全国银行及各州银行监管机构",
          "deadline": "纽约银行开门前"
        },
        "instantEcho": {
          "directResult": "全国银行半数照常开门，发生更严重挤兑，三日内有超过200家银行倒闭；紧急法延期一周。",
          "unexpectedCost": "你因叛国罪指控被特勤局逮捕，面临终身监禁。",
          "beneficiary": "外国投资者和黑市金融商",
          "payer": "全美储户（存款蒸发）及你本人（重罪指控）"
        }
      }
    ]
  },
  "hitler-poland-1939": {
    "trajectory": {
      "historicalPath": "通信军官你拿起红色电话，向各集团军司令部复诵希特勒签署的白色方案最终口令，确保全线按时进攻。",
      "preservedResult": "德军入侵波兰，英国和法国两天后对德国宣战，第二次世界大战在欧洲全面爆发。",
      "decisiveFork": "你手中的电话是唯一能撤销或延误进攻命令的节点，但作为通信军官你必须完成传送任务。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "传送白色方案口令",
        "label": "你拿起红色电话，向龙德施泰特和博克的司令部逐字复诵希特勒签署的白色方案最终口令，确认所有部队在二十分钟内开火。",
        "intent": "保留希特勒对全军下达进攻命令的具体行动链，确保真实历史按时发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "通过红色电话复诵并传达白色方案最终口令",
          "target": "各集团军司令部（龙德施泰特的南方集团军群、博克的北方集团军群）",
          "deadline": "首批轰炸机起飞前（二十分钟内）"
        },
        "instantEcho": {
          "directResult": "德军全线按计划于9月1日凌晨4时45分入侵波兰，英法两天后对德宣战，二战全面爆发。",
          "unexpectedCost": "你因全程监听并传达绝密指令，被盖世太保记录为‘知情者’，日后受监控。",
          "beneficiary": "希特勒、纳粹政权",
          "payer": "波兰军民（首当其冲），以及你个人（被列入监控名单）"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣口令发证据给盟国",
        "label": "你扣下进攻口令，用另一部电话匿名将格莱维茨袭击真相和进攻时间表电告英法使馆；同时向各集团军谎称‘口令待核’。",
        "intent": "改变命令传达链，阻止希特勒直接进攻，并让英法提前获得证据以干预。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "扣留口令并匿名发送真相电报",
          "target": "原进攻口令（白色方案）、英法使馆",
          "deadline": "首批轰炸机起飞前（二十分钟内）"
        },
        "instantEcho": {
          "directResult": "英法使馆收到证据后紧急照会德国，各国舆论哗然；空军因未接到口令，在最后时刻紧急取消起飞，德军前线混乱。",
          "unexpectedCost": "德国高层立即封锁指挥部，你被怀疑并抓捕，但盟国已获先手。",
          "beneficiary": "波兰、英法（争得48小时政治准备时间）",
          "payer": "你（被逮捕审讯），希特勒（突袭计划被暴露）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "用摩斯电码确认口令",
        "label": "你通过国防军电报线路，用预设密表将白色方案最终口令以摩斯电码发往各集团军通讯处，并电话确认收悉。",
        "intent": "使用另一通信渠道（电报而非电话）执行相同的命令传送链，确保真实历史按时发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "通过摩斯电码发送白色方案口令并确认",
          "target": "各集团军通讯处（龙德施泰特、博克等）",
          "deadline": "首批轰炸机起飞前（二十分钟内）"
        },
        "instantEcho": {
          "directResult": "各集团军在黎明前收到加密命令并按时发动进攻，波兰边境全线交火，英法随后宣战。",
          "unexpectedCost": "电报记录被党卫军截获备份，你因使用非标准流程而受到审查。",
          "beneficiary": "希特勒、国防军高层",
          "payer": "波兰边境守军，以及你（被要求说明为何改用摩斯电码）"
        }
      },
      {
        "id": "B",
        "displayLabel": "换口令推迟并通知波兰",
        "label": "你篡改口令中进攻时间代码，改为六小时后，并匿名将德军完整部署电报发给波兰陆军总司令部。",
        "intent": "改变进攻时间并让波兰提前获知，打破突袭效果。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "篡改口令时间代码并发送密电给波兰",
          "target": "白色方案口令文件、波兰陆军总司令部",
          "deadline": "首批轰炸机起飞前（二十分钟内）"
        },
        "instantEcho": {
          "directResult": "波兰在黎明前进入紧急防御，英法随即宣布动员；德国空军因时间错乱在六小时后才起飞，失去突然性，德军遭到顽强抵抗。",
          "unexpectedCost": "德国通讯部门发现异常，你被隔离审查；盖世太保介入调查。",
          "beneficiary": "波兰、英法（获得战略预警和动员时间）",
          "payer": "你（被逮捕并面临叛国指控），希特勒（突袭破产）"
        }
      }
    ]
  },
  "stalin-moscow-1941": {
    "trajectory": {
      "historicalPath": "你命令专列按照原时刻表挂空车厢发往古比雪夫，同时通过克里姆林宫通讯部发布斯大林仍在莫斯科指挥的公告。",
      "preservedResult": "苏联政府部分机构撤往古比雪夫，斯大林留在莫斯科；德军攻势最终受阻，苏军在12月发动反攻。",
      "decisiveFork": "调度专列的最终决定权在你手中，你可以选择让它空车发车或彻底改变其用途。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "空车发往古比雪夫",
        "label": "你在40分钟内命令专列工作人员挂上空车厢，按原时刻表发往古比雪夫，同时授权克里姆林宫通讯部广播斯大林仍在莫斯科指挥防御。",
        "intent": "保留专列发车和斯大林留守的轨道，维持真实历史结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令专列挂上空车厢并按时刻表发车，同时授权通讯部发布斯大林留守公告。",
          "target": "斯大林专列、莫斯科-古比雪夫铁路线、克里姆林宫通讯部",
          "deadline": "40分钟后，即1941年10月19日18:00"
        },
        "instantEcho": {
          "directResult": "专列空车驶出莫斯科站台，广播宣布斯大林在克里姆林宫指挥，城防部队士气稳定。",
          "unexpectedCost": "贝利亚的部下怀疑你隐瞒了斯大林真实位置，开始秘密监视你。",
          "beneficiary": "斯大林（政治形象）、莫斯科守军（士气）",
          "payer": "你（被秘密警察怀疑）"
        }
      },
      {
        "id": "B",
        "displayLabel": "征用专列运送弹药",
        "label": "你在40分钟内下令将专列车厢卸下，改为装载弹药和补给，由近卫步兵第3师接管，并命令该列车立即开往莫扎伊斯克防线。",
        "intent": "改变列车用途和方向，破坏撤离命令，将资源直接投入前线。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令拆卸专列车厢改为货运，装载弹药后由近卫步兵第3师押运，发往莫扎伊斯克。",
          "target": "斯大林专列、近卫步兵第3师、莫扎伊斯克弹药库",
          "deadline": "40分钟后，即1941年10月19日18:00"
        },
        "instantEcho": {
          "directResult": "一列满载弹药的军列驶向莫扎伊斯克，斯大林专列标识被涂掉；莫洛托夫得知后紧急报告斯大林。",
          "unexpectedCost": "你被内务人民委员部当场逮捕，罪名是擅改最高统帅部命令。",
          "beneficiary": "莫扎伊斯克防线守军（获得弹药）",
          "payer": "你（被逮捕）、斯大林（失去撤离选项）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "发布虚假列车时刻表",
        "label": "你在40分钟内命令车站调度员伪造一份专列延误通知，同时用另一列普通客车挂上空车厢发往古比雪夫，并让通讯部播报斯大林在红场阅兵的预录消息。",
        "intent": "使用虚假延误和替换车厢的方式，保留真实历史中斯大林未撤离且公开露面的结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "伪造专列延误通知，安排普通客车挂空车厢代替专列发车，并授权通讯部播放预录阅兵消息。",
          "target": "莫斯科火车站、普通客车车厢、通讯部",
          "deadline": "40分钟后，即1941年10月19日18:00"
        },
        "instantEcho": {
          "directResult": "空客车驶离，谣言称斯大林已在红场阅兵，市民恐慌缓解；但朱可夫来电质问专列去向。",
          "unexpectedCost": "你因伪造命令被铁路局内部调查，但朱可夫干预后暂停。",
          "beneficiary": "莫斯科市民（得到虚假安心）",
          "payer": "你（被调查）"
        }
      },
      {
        "id": "B",
        "displayLabel": "炸毁专列铁轨",
        "label": "你在40分钟内下令铁道工兵炸毁莫斯科站以北第7道岔的轨道，同时将专列调度到备用线，并命令通讯部广播斯大林将亲自在车站发表讲话，实际上他本人仍在克里姆林宫。",
        "intent": "通过破坏轨道阻止任何列车驶离，同时制造斯大林将公开露面的假象，彻底改变撤离路线。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令炸毁第7道岔轨道，调度专列到备用线，并授权通讯部广播斯大林将到车站讲话。",
          "target": "莫斯科站第7道岔、备用线、通讯部",
          "deadline": "40分钟后，即1941年10月19日18:00"
        },
        "instantEcho": {
          "directResult": "爆炸声在车站响起，专列无法出发；斯大林听闻后命令你立即汇报，并取消所有撤离计划。",
          "unexpectedCost": "你因破坏军事设施被当场扣留，但斯大林得知真实原因后并未处决你，而是将你调往后方。",
          "beneficiary": "斯大林（彻底留在莫斯科）、莫斯科守军（无退路）",
          "payer": "你（被调离前线）"
        }
      }
    ]
  },
  "normandy-1944": {
    "trajectory": {
      "historicalPath": "作为汇总气象报告的参谋官，必须在半小时内将气象预报的口头摘要和书面概要同时递交给艾森豪威尔将军，并当面说明6月6日天气窗口的短暂性与风险，确保他能够依据这一信息做出放行决定。",
      "preservedResult": "艾森豪威尔批准6月6日登陆，盟军在诺曼底建立滩头阵地并由此重返西欧大陆。",
      "decisiveFork": "本幕能够改变结果的具体控制点是艾森豪威尔依据气象信息做出是否于6月6日放行的决定；循史牌保留此决定，破局牌改变此决定。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "当面汇报并递交摘要",
        "label": "你拿起气象简报，跨步进入艾森豪威尔的办公室，直视他眼睛说：“将军，6月6日有一个短暂的天气窗口，风力预计降到4级，云层将出现间歇性钻出，持续约36小时。”随即将一页综合摘要放在他桌面右侧。",
        "intent": "保留艾森豪威尔根据参谋官气象信息做出6月6日放行决定的行动链，确保真实历史结果（6月6日登陆）按时发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "当面口头汇报并递交一页书面气象摘要",
          "target": "艾森豪威尔将军本人及他桌面的决策文件",
          "deadline": "倒计时30分钟内必须让艾森豪威尔看到摘要"
        },
        "instantEcho": {
          "directResult": "艾森豪威尔听到并读完摘要后，转向蒙哥马利说：“我们走。”随后签署了Neptune行动启动令。舰队在15分钟后收到出港信号。",
          "unexpectedCost": "在你转身退出时，一位海军上校低声抱怨你越级直接冲到了总司令面前。",
          "beneficiary": "艾森豪威尔（获得果断决策依据），盟军远征军",
          "payer": "你（承受同僚暂时的冷淡）"
        }
      },
      {
        "id": "B",
        "displayLabel": "建议推迟至6月8日",
        "label": "你在简报结尾停下，用笔尖戳着地图上英吉利海峡6月8日的预报气压图说：“将军，6月6日的海湾由风暴尾扫过，6月8日反而有一个更稳定的高压脊，是否考虑多等两天？”",
        "intent": "改变艾森豪威尔对6月6日窗口的信任，引导他推迟登陆，从而改变真实历史中6月6日登陆的结果。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "建议推迟登陆日期至6月8日",
          "target": "艾森豪威尔对气象窗口的选择",
          "deadline": "当场在简报会结束前说出（约剩余25分钟）"
        },
        "instantEcho": {
          "directResult": "艾森豪威尔迟疑后采纳，命令舰队等待至6月8日。6日风暴持续，德军由隆美尔下令加强海滩障碍；8日天气虽好，但奥马哈滩头遭更猛烈的火力覆盖，首日伤亡增加20%。",
          "unexpectedCost": "盟军首日伤亡从预期10,000人升至12,000人，但后续仍于6月底巩固了滩头。",
          "beneficiary": "德军第七集团军（获得两天加固时间）",
          "payer": "盟军登陆部队（承担更高伤亡）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "电话传令舰队备航",
        "label": "你直接从气象室拿起红色安全电话，拨通波特兰港舰队作战中心，对接线员说：“我是SHAEF气象处，风暴间隙已确认。请拉姆齐上将的旗舰在半小时内升火，等待最终命令。”",
        "intent": "提前激活舰队动作以加快命令链，但保留艾森豪威尔最终签字放行的历史进程，使6月6日登陆如期发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "电话通知舰队升火待命",
          "target": "波特兰港舰队司令部及拉姆齐海军上将的旗舰",
          "deadline": "在艾森豪威尔下令前25分钟内完成电话接通"
        },
        "instantEcho": {
          "directResult": "拉姆齐上将命令各舰锅炉升火，当艾森豪威尔的正式命令到达时，舰队已提前完成备航，第一波登陆艇准时于6日0130时出发。",
          "unexpectedCost": "事后艾森豪威尔认为你越权，要求你书面检讨。",
          "beneficiary": "盟国海军（抢出30分钟备航时间）",
          "payer": "你（承受书面处分记录）"
        }
      },
      {
        "id": "B",
        "displayLabel": "伪造德军西调情报",
        "label": "你将一张伪造的Ultra破译纸条夹在气象文件中，上面写着：“B集团军群司令部指令：第21装甲师于6月5日夜向加来铁路机动。”并将此文件呈给艾森豪威尔。",
        "intent": "改成艾森豪威尔看后下令将原定在加来空降的第82空降师转而用于攻击加来滩头，而诺曼底只保留两个师；6日诺曼底登陆虽成功但兵力薄弱，滩头被德军反冲击压缩了2公里；加来方面盟军空降损失惨重",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "伪造一封Ultra情报纸条并夹在气象文件中呈交",
          "target": "艾森豪威尔阅读气象文件时的情报判断",
          "deadline": "在递交气象文件的同一时刻呈交（不超过30秒）"
        },
        "instantEcho": {
          "directResult": "艾森豪威尔看后下令将原定在加来空降的第82空降师转而用于攻击加来滩头，而诺曼底只保留两个师；6日诺曼底登陆虽成功但兵力薄弱，滩头被德军反冲击压缩了2公里；加来方面盟军空降损失惨重。",
          "unexpectedCost": "盟军在加来和诺曼底两方向均受挫，后续通过增援才稳住阵线；你的伪造行为被MI5发现，你被遣返回国接受调查。",
          "beneficiary": "德军西线司令部（额外守住了加来）",
          "payer": "你（因伪造军事情报被撤职并接受审讯）"
        }
      }
    ]
  },
  "cuban-missile-1962": {
    "trajectory": {
      "historicalPath": "通信分析官必须在deadline前向肯尼迪总统口头确认：第一封赫鲁晓夫来信（撤导弹换不入侵古巴）是苏联官方立场，第二封强硬信件可能来自不同派系，建议回复第一封并秘密承诺撤除土耳其导弹。",
      "preservedResult": "美国选择回复较温和的第一封信，同时秘密承诺撤除土耳其导弹，苏联同意撤出古巴导弹。",
      "decisiveFork": "肯尼迪总统是否回复第一封信而非第二封信"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "口头建议回复第一封信",
        "label": "在战情室当面向肯尼迪总统报告：赫鲁晓夫第一封信是有效和解信号，第二封信可能并非其本意，建议立即回复第一封信并承诺不入侵古巴。",
        "intent": "按真实历史轨道，推动总统回复第一封信。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "口头报告并建议",
          "target": "肯尼迪总统",
          "deadline": "美军飞机被击落后数小时内"
        },
        "instantEcho": {
          "directResult": "肯尼迪采纳建议，指示起草回复第一封信，同时秘密承诺撤除土耳其导弹。",
          "unexpectedCost": "白宫内部强硬派指责分析官过于软弱，建议被记录后可能影响其职业晋升。",
          "beneficiary": "赫鲁晓夫与苏联外交部门",
          "payer": "通信分析官个人职业声誉"
        }
      },
      {
        "id": "B",
        "displayLabel": "建议忽视第一封信直接强硬回复",
        "label": "在战情室向肯尼迪总统主张：第二封强硬来信才是苏联真实态度，第一封信是诡计；建议立即直接回复第二封信，要求苏联无条件撤除导弹，并拒绝任何交易。",
        "intent": "改成肯尼迪倾向强硬路线，指示回复第二封强硬来信，拒绝不入侵承诺，战争准备升级",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "口头主张并建议",
          "target": "肯尼迪总统",
          "deadline": "美军飞机被击落后数小时内"
        },
        "instantEcho": {
          "directResult": "肯尼迪倾向强硬路线，指示回复第二封强硬来信，拒绝不入侵承诺，战争准备升级。",
          "unexpectedCost": "苏联收到强硬回复后，在古巴导弹基地提高战备等级，美军侦察机遭更多拦截。",
          "beneficiary": "美国国防部强硬派与中央情报局",
          "payer": "世界和平与双方士兵生命"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "书面分析确认第一封信有效性",
        "label": "在战情室将第一封与第二封来信的语言学与逻辑分析写成简报，当面递交国家安全顾问邦迪，并强调第一封信的措辞更符合赫鲁晓夫个人风格，第二封可能受军方压力。",
        "intent": "提供书面证据支持回复第一封信的决策，强化真实历史轨道。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "撰写并递交分析简报",
          "target": "国家安全顾问麦克乔治·邦迪",
          "deadline": "美军飞机被击落后数小时内"
        },
        "instantEcho": {
          "directResult": "邦迪认可分析，将简报转交肯尼迪，进一步巩固了回复第一封信的决策。",
          "unexpectedCost": "简报内容被强硬派获悉后，分析官被贴上“亲苏”标签，后续被调离核心岗位。",
          "beneficiary": "国务卿腊斯克等温和派",
          "payer": "通信分析官的职业生涯"
        }
      },
      {
        "id": "B",
        "displayLabel": "截留第一封信延迟传递",
        "label": "在通信室执行：将刚收到的第一封赫鲁晓夫来信原件暂时扣留，谎称译电延迟，只将第二封强硬来信立即呈送总统，迫使总统基于单一强硬信息决策。",
        "intent": "改变信息流，引导总统走向强硬路线。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "截留并延迟传递第一封信",
          "target": "赫鲁晓夫第一封来信原件",
          "deadline": "信件接收后立即执行，数分钟内"
        },
        "instantEcho": {
          "directResult": "总统只见到第二封强硬来信，认为苏联无意和解，下令加强封锁并准备空袭古巴。",
          "unexpectedCost": "次日第一封信被其他官员发现，分析官因擅自截留通信被军事法庭审判，但战争已不可避免。",
          "beneficiary": "美军参谋长联席会议主席泰勒",
          "payer": "通信分析官本人及全球局势"
        }
      }
    ]
  },
  "apollo-11-1969": {
    "trajectory": {
      "historicalPath": "保留实际历史中导航控制员确认计算机状态并支持继续下降的行动链。",
      "preservedResult": "任务控制中心判断1202警报可继续飞行，阿姆斯特朗手动避开危险区，阿波罗11号完成首次载人登月。",
      "decisiveFork": "改变控制关系：地面接管登月舱计算机控制权，代替阿姆斯特朗手动操控。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "判定警报可飞继续下降",
        "label": "你向飞行控制主任克兰兹明确报告：1202警报不影响制导导航，必须指令阿姆斯特朗继续下降，不可中止。",
        "intent": "保留实际历史中导航控制员确认计算机状态并支持继续下降的行动链。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "报告并指令继续下降",
          "target": "飞行控制主任克兰兹",
          "deadline": "燃料耗尽前30秒"
        },
        "instantEcho": {
          "directResult": "克兰兹采纳建议，阿姆斯特朗手动避开巨石区，登月舱成功着陆。",
          "unexpectedCost": "事后审查委员会质询你确认警报的逻辑，你承受部分责任压力。",
          "beneficiary": "阿姆斯特朗、奥尔德林、美国宇航局",
          "payer": "你（导航控制员）"
        }
      },
      {
        "id": "B",
        "displayLabel": "地面遥控接管自动着陆",
        "label": "你绕过飞行控制主任，通过备用遥控链路向登月舱计算机发送强制着陆指令，直接锁定自动着陆程序，将下降控制权从阿姆斯特朗手中转移到地面。",
        "intent": "改变控制关系：地面接管登月舱计算机控制权，代替阿姆斯特朗手动操控。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "发送强制着陆指令锁定自动程序",
          "target": "登月舱计算机",
          "deadline": "燃料耗尽前15秒"
        },
        "instantEcho": {
          "directResult": "自动着陆系统启动，但校准偏差使着陆点偏移预定区200米，任务成功但后续考察需调整。",
          "unexpectedCost": "你因未经授权接管控制被永久取消任务资格；阿姆斯特朗报告手动控制被覆盖。",
          "beneficiary": "任务控制中心（成功着陆）",
          "payer": "你（职业生涯终结）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "语音引导阿姆斯特朗下降",
        "label": "你通过通信回路直接向阿姆斯特朗喊话：'根据计算机缓存数据，下降路径安全，按计划手动下降。'代替克兰兹的中转。",
        "intent": "保留实际历史中确认数据并支持下降的行动链，但改用直接语音通信。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "直接语音引导继续下降",
          "target": "阿姆斯特朗（登月舱内）",
          "deadline": "燃料耗尽前25秒"
        },
        "instantEcho": {
          "directResult": "阿姆斯特朗依数据避开巨石，成功着陆。",
          "unexpectedCost": "内线占用导致奥尔德林同步监视器延迟，任务后检查发现部分数据未记录。",
          "beneficiary": "阿姆斯特朗、任务控制中心",
          "payer": "你（导航控制员，事后被调职）"
        }
      },
      {
        "id": "B",
        "displayLabel": "强制计算机优先处理雷达",
        "label": "你通过辅助控制台向登月舱计算机发送直接指令：'立即忽略1202警报，优先处理着陆雷达数据。'改变计算机任务优先级。",
        "intent": "改变控制关系：以硬件指令替代人工建议，改变计算机任务优先级。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "发送强制指令调整计算机优先级",
          "target": "登月舱计算机（通过辅助控制台）",
          "deadline": "燃料耗尽前20秒"
        },
        "instantEcho": {
          "directResult": "计算机停止警报，开始处理雷达数据；但雷达锁定延迟导致阿姆斯特朗无法及时找到安全着陆点，登月舱被迫在碎石区硬着陆，任务成功但硬件受损。",
          "unexpectedCost": "你因违规操作当场被警卫带走讯问；阿姆斯特朗在着陆后汇报计算机异常。",
          "beneficiary": "阿姆斯特朗、奥尔德林（成功着陆）",
          "payer": "你（导航控制员，面临处分）"
        }
      }
    ]
  },
  "berlin-wall-1989": {
    "trajectory": {
      "historicalPath": "保留真实历史中边检站无上级命令自行开闸的行动链",
      "preservedResult": "鲍尔霍莫大街口岸在无明确上级命令下开闸，人群穿过柏林墙，东德边境体系迅速崩解。",
      "decisiveFork": "改变控制关系——由你取代亚格的决策权，并加速开闸进程"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "开闸放行人群",
        "label": "你命令卫兵班长费舍尔打开鲍尔霍莫大街口岸全部闸门，并通知他不得对任何人检查或盖章。",
        "intent": "保留真实历史中边检站无上级命令自行开闸的行动链",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令卫兵班长费舍尔开闸",
          "target": "鲍尔霍莫大街口岸闸门与卫兵班长费舍尔",
          "deadline": "数千人挤在闸门前，几分钟内必须决定"
        },
        "instantEcho": {
          "directResult": "闸门开启，人群涌入西柏林，东德边境体系开始溃散。",
          "unexpectedCost": "上级指挥官哈拉尔德·亚格被军法审判，你也被撤职调查。",
          "beneficiary": "东柏林平民",
          "payer": "哈拉尔德·亚格、值班参谋"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣押上级，独自开闸",
        "label": "你命卫兵收缴指挥官亚格的手枪，将其关进办公室，然后以代理指挥官身份命令全体卫兵撤除路障、打开闸门。",
        "intent": "改变控制关系——由你取代亚格的决策权，并加速开闸进程",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "扣押指挥官亚格并代理指挥，命令撤除路障开闸",
          "target": "指挥官哈拉尔德·亚格、全体卫兵、闸门与路障",
          "deadline": "数千人挤在闸门前，几分钟内必须决定"
        },
        "instantEcho": {
          "directResult": "闸门开启，路障移除，人群无阻碍通过；亚格被扣押激起边防军内部混乱，但开闸已成事实。",
          "unexpectedCost": "你因兵变被全国通缉，亚格的政治生涯结束。",
          "beneficiary": "东柏林平民、西德媒体",
          "payer": "值班参谋（被通缉）、亚格（失势）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "命令广播站传令开闸",
        "label": "你用边检站内线电话接通东柏林广播网络，命令播音员向全体边防军播报：'所有人立即无条件放行，禁止检查和盖章。'",
        "intent": "保留真实历史中人潮涌入的结果，但通过广播系统传递命令，扩大开闸指令的覆盖范围",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令东柏林广播网络播音员播报开闸指令",
          "target": "东柏林广播网络、播音员、边防军",
          "deadline": "数千人挤在闸门前，几分钟内必须决定"
        },
        "instantEcho": {
          "directResult": "全城边防军同时开闸，柏林墙各口岸在几分钟内全部失守。",
          "unexpectedCost": "东德政府迅速下令逮捕所有参与广播命令的人员，包括你。",
          "beneficiary": "全体东德边境民众",
          "payer": "播音员、值班参谋"
        }
      },
      {
        "id": "B",
        "displayLabel": "调转探照灯，掩护冲关",
        "label": "你命令边防军将口岸所有探照灯转向西柏林方向，制造强光干扰，同时指挥推土机撞倒部分围墙，引导人群从缺口涌入西柏林。",
        "intent": "改变边境设施的控制方式和方向——用物理手段突破关口，加速且不可逆",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令边防军调转探照灯并指挥推土机推倒围墙",
          "target": "探照灯操控士兵、推土机驾驶员、鲍尔霍莫大街口岸围墙",
          "deadline": "数千人挤在闸门前，几分钟内必须决定"
        },
        "instantEcho": {
          "directResult": "围墙倒塌形成新通道，人群从缺口涌入，西柏林警察措手不及。",
          "unexpectedCost": "你因毁坏边境设施和擅自使用重型机械被东德军事法庭缺席判处死刑。",
          "beneficiary": "从新缺口涌入的民众",
          "payer": "值班参谋（被判处死刑、流亡）"
        }
      }
    ]
  },
  "east-zhou-770bc": {
    "trajectory": {
      "historicalPath": "你亲手从周平王手中接过东迁诏书，对驭手厉声下令“起驾”，并命虎贲士将九鼎、册书装车，随后亲自策马领队出东门，沿驿道向洛邑行进。",
      "preservedResult": "周平王东迁洛邑，西周结束，东周由此开始。",
      "decisiveFork": "你下令起驾的瞬间，决定了九鼎与册书随平王东去，还是滞留镐京被犬戎劫掠。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "签发车驾令封存宗庙重器",
        "label": "你在东门驿道当面接过周平王手诏，当众签发车驾令，并令虎贲郎中封存九鼎与册书于重车，即刻起驾东行。",
        "intent": "真实历史行动链：平王东迁由司马签发车驾令并护送宗庙重器离开镐京。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "签发车驾令并封存宗庙重器",
          "target": "周平王车驾、九鼎、册书",
          "deadline": "犬戎游骑日落前逼近镐京"
        },
        "instantEcho": {
          "directResult": "车驾准时起行，九鼎与册书随队东迁，镐京宫室在日落前被犬戎焚掠。",
          "unexpectedCost": "你因封存重器时未留备份，丢失了部分王室档案副本。",
          "beneficiary": "周平王、洛邑接应诸侯",
          "payer": "你（王室司马）"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣留车驾转交虢公翰统率",
        "label": "你在东门驿道当众宣布：车驾令暂缓，将九鼎与册书移交虢公翰，由其决定是否东迁。虢公翰随即接替指挥权。",
        "intent": "改变控制关系：司马将东迁决定权交给虢公翰，导致车驾最终未东迁，犬戎控制镐京。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "扣留车驾转交虢公翰统率",
          "target": "周平王车驾、虢公翰",
          "deadline": "犬戎游骑日落前逼近镐京"
        },
        "instantEcho": {
          "directResult": "虢公翰接管指挥，车驾滞留，犬戎主力入城，镐京沦陷，平王被囚。",
          "unexpectedCost": "你因违命被虢公翰部下软禁，失去自由。",
          "beneficiary": "虢公翰、犬戎",
          "payer": "周平王、你"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "以太史令传檄诸侯接应",
        "label": "你以太史令身份，在驿道旁火速起草檄文，以平王玺印命郑伯、卫侯率兵至洛邑接应，并安排轻车先运册书。",
        "intent": "使用另一人物（太史令）和程序（传檄）执行同一历史轨道：东迁并护送册书。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "以太史令传檄诸侯接应",
          "target": "郑伯、卫侯等诸侯",
          "deadline": "犬戎游骑日落前逼近镐京"
        },
        "instantEcho": {
          "directResult": "檄文发出，诸侯出兵洛邑接应，册书车先到，平王车驾随后抵达，东周开始。",
          "unexpectedCost": "你因未经司马擅自用玺，事后被追究擅权之罪，遭贬黜。",
          "beneficiary": "周平王、诸侯",
          "payer": "你（太史令）"
        }
      },
      {
        "id": "B",
        "displayLabel": "毁桥堆薪阻犬戎改道西行",
        "label": "你命令士卒砍断渭桥并堆积薪柴点燃，阻隔犬戎追兵，同时将平王车驾改道向虢县而非洛邑，并与犬戎前锋谈判割地。",
        "intent": "改变结果：阻断犬戎追兵后改道西行，平王与犬戎议和割地，东迁未发生。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "毁桥堆薪阻犬戎改道西行",
          "target": "渭桥、平王车驾、犬戎前锋",
          "deadline": "犬戎游骑日落前逼近镐京"
        },
        "instantEcho": {
          "directResult": "渭桥焚毁，犬戎停步，车驾西行至虢县，平王与犬戎签订割地协议，东周未建立。",
          "unexpectedCost": "你因临阵改道被司马部将射伤，被迫流亡。",
          "beneficiary": "犬戎、你（获得赏金）",
          "payer": "周平王（失地）、诸侯（失望）"
        }
      }
    ]
  },
  "shang-yang-356bc": {
    "trajectory": {
      "historicalPath": "秦孝公决意变法→商鞅拟定新法→朝堂争议→孝公支持盖印→法令颁行",
      "preservedResult": "秦孝公任用商鞅推行第一次变法，以什伍连坐、奖励耕战和军功授爵重塑秦国。",
      "decisiveFork": "秦孝公是否在午时前盖印颁行新法"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "呈简请玺颁行新法",
        "label": "你在朝堂上将商鞅所拟的什伍连坐与军功授爵竹简高高举起，朗声诵读核心条款，随即跪伏于秦孝公案前，双手捧上玉玺，恳请孝公即刻盖印，使法令于午时前传往各乡里。",
        "intent": "保留秦孝公盖印颁行新法的行动链，使法令按时下达。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "跪请秦孝公盖印颁行法令",
          "target": "商鞅所拟的什伍连坐与军功授爵竹简及玉玺",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "秦孝公拿起玉玺，在新法竹简上盖下玺印，宣布变法即时生效。",
          "unexpectedCost": "盖印时，旧贵族甘龙愤然离席，当众指斥你为佞臣。",
          "beneficiary": "渴望军功的普通秦人",
          "payer": "失去世袭特权的旧贵族"
        }
      },
      {
        "id": "B",
        "displayLabel": "焚毁军功爵竹简",
        "label": "你趁朝堂争论时，假意上前为商鞅添灯油，却将油泼向堆积的军功授爵竹简，引燃大火，竹简顷刻焚毁，无法按时传令。",
        "intent": "改变军功授爵条款的颁布结果，使其无法在午时传往各乡里。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "纵火焚毁军功授爵竹简",
          "target": "商鞅所拟的军功授爵法令竹简",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "军功授爵竹简被烧毁，秦孝公命商鞅重拟，变法推迟至次日。",
          "unexpectedCost": "你被当场拿下，杖责二十并罚俸半年，驱逐出宫。",
          "beneficiary": "反对军功授爵的旧贵族甘龙等人",
          "payer": "急切盼望军功的普通秦人"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "击鼓聚众宣读新法",
        "label": "你见孝公迟疑，转身冲出朝堂，夺过侍卫手中的鼓槌，猛击宫门前的军鼓，召集宫外等候的百官吏卒，高声宣布孝公已颁行新法，命全部人等即刻回衙门抄录传发。",
        "intent": "利用鼓声和公开宣布，迫使法令在午时前实际传发，保留历史结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "击鼓聚众并宣布新法已颁行，命令立即传发",
          "target": "宫门军鼓及宫外等候的百官吏卒",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "臣工惊愕，纷纷返回官署抄写新法，法令传往各乡里。",
          "unexpectedCost": "孝公认为你僭越，事后将你贬为最低等小吏。",
          "beneficiary": "立即得知新法的民众",
          "payer": "你本人（官职与尊严）"
        }
      },
      {
        "id": "B",
        "displayLabel": "篡改连坐条款示众",
        "label": "你快速取来另一空白竹简，模仿商鞅笔迹写上'什伍连坐改为仅罚金，不连坐'，在朝堂上展示，声称是商鞅新订，请孝公盖印。",
        "intent": "改变连坐条款的具体内容，使连坐惩罚从严苛变为轻微。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "伪造并展示篡改后的连坐条款，请求盖印",
          "target": "空白竹简和孝公案上的玉玺",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "商鞅怒斥你伪造文书，孝公命将你收押，但连坐条款产生争议，颁行推迟。",
          "unexpectedCost": "你因伪造文书被收监，日后可能重罚。",
          "beneficiary": "可能被连坐的百姓",
          "payer": "你本人（自由与安全）"
        }
      }
    ]
  },
  "changping-260bc": {
    "trajectory": {
      "historicalPath": "你必须在赵括面前呈上秦军粮草被劫的假情报，并亲自率领中军亲卫率先出垒，使得赵括下令全军出击，半时辰后秦军伏兵从两翼截断退路，赵军陷入包围圈。",
      "preservedResult": "赵括率军出击后被秦军包围，赵军大败，数十万降卒被处置。",
      "decisiveFork": "改为赵括出垒沿途未遇抵抗，两翼伏兵突然杀出，退路被断。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "献假情报诱赵括出垒",
        "label": "你必须在赵括面前呈上秦军粮草被劫的假情报，并主动请缨率中军亲卫出垒追击，使得赵括下令全军出击，半时辰后秦军伏兵合围，赵军覆没。",
        "intent": "保留真实历史中赵括被诱出击、全军覆没的行动链。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "呈上假情报并率中军亲卫出垒",
          "target": "赵括",
          "deadline": "半个时辰内"
        },
        "instantEcho": {
          "directResult": "赵括采纳情报，下令全军出垒追击，秦军伏兵从两翼截断退路，赵军陷入包围。",
          "unexpectedCost": "你被赵括嘉奖，但突围时左臂中箭。",
          "beneficiary": "秦军主将白起",
          "payer": "你（校尉）"
        }
      },
      {
        "id": "B",
        "displayLabel": "假传军令守粮道隘口",
        "label": "你必须假传赵括军令，命廉颇旧部率三千人死守粮道隘口不得支援出击，同时你率亲兵接管东垒门阻止赵括回撤，使得粮道被秦军骑兵突袭切断、出击部队无法回垒而改变结果：赵军出击部队被围但主力未全失。",
        "intent": "改变真实历史中赵军全军出击无后援的结果。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "假传军令命廉颇旧部守粮道隘口并接管东垒门",
          "target": "廉颇旧部及东垒门",
          "deadline": "半个时辰内"
        },
        "instantEcho": {
          "directResult": "粮道隘口被秦军骑兵攻破，三千守军溃败，粮道断绝；赵括出击部队无法回垒，在野外被包围，但壁垒内部队未动。",
          "unexpectedCost": "你因假传军令被赵括亲兵发现，被迫逃亡。",
          "beneficiary": "秦军裨将王龁",
          "payer": "你（校尉）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "杀哨兵断回垒吊桥",
        "label": "你必须亲手斩杀壁垒东门哨兵，并砍断吊桥绳索，使得回垒通道中断，赵括只能率全军向前追击，半时辰后落入伏击圈。",
        "intent": "使用破坏性动作强制实现真实历史中的出击结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "斩杀哨兵并砍断东门吊桥绳索",
          "target": "壁垒东门哨兵与吊桥",
          "deadline": "半个时辰内"
        },
        "instantEcho": {
          "directResult": "东门吊桥断裂，赵括只能率全军向前追击，秦军伏兵杀出，赵军陷入包围。",
          "unexpectedCost": "你因斩杀哨兵被廉颇旧部记恨。",
          "beneficiary": "秦军骑兵部队",
          "payer": "你（校尉）"
        }
      },
      {
        "id": "B",
        "displayLabel": "换箭令射倒帅旗",
        "label": "你必须用自己保管的令箭替换赵括中军令箭，并亲自放箭射倒赵军帅旗，使前线部队以为赵括阵亡而停止前进，部分部队退回壁垒，改变结果：赵军出击部队被分割而非全灭。",
        "intent": "通过破坏指挥系统改变真实历史中赵军全军出击的结果。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "用令箭射倒赵军帅旗",
          "target": "赵军中军帅旗",
          "deadline": "半个时辰内"
        },
        "instantEcho": {
          "directResult": "帅旗倒下，前线赵军停滞，部分部队回撤壁垒；但秦军突入缺口，赵括被俘。",
          "unexpectedCost": "你因私换令箭被赵括亲卫追杀，跳崖摔断右腿。",
          "beneficiary": "赵国后方",
          "payer": "你（校尉）"
        }
      }
    ]
  },
  "qin-unification-221bc": {
    "trajectory": {
      "historicalPath": "你作为御史向李斯提交统一度量衡诏书草案，李斯呈报嬴政批准后，由你加盖御史印信传发全国。",
      "preservedResult": "秦灭齐完成统一，嬴政称始皇帝并推行郡县制与统一制度。",
      "decisiveFork": "是否在齐降表入宫前将统一度量衡诏书加盖印信发出。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "加盖印信发统一诏",
        "label": "你在齐国降表呈入前，亲手从木匣中取出御史印信，在统一度量衡的诏书末端加盖朱印，并命谒者即刻持诏出宫传发全国。",
        "intent": "保留真实历史中统一度量衡的决策与执行链条，使秦制标准按时推行。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "加盖御史印信于统一度量衡诏书并命谒者传发",
          "target": "统一度量衡诏书、御史印信、谒者",
          "deadline": "齐国降表呈入前的一个时辰内"
        },
        "instantEcho": {
          "directResult": "诏书发出，各地驿道开始改造车轨，度量衡器具依秦制重铸。",
          "unexpectedCost": "李斯认为你越权直接发诏，在嬴政面前参你专擅，你被罚俸半年。",
          "beneficiary": "秦始皇（统一行政效率提升）",
          "payer": "你（御史，被罚俸）"
        }
      },
      {
        "id": "B",
        "displayLabel": "改诏推行齐国旧制",
        "label": "你在齐国降表呈入前，将案上统一度量衡的诏书草案中‘以秦制为准’改为‘暂依齐制’，并加盖御史印信发出。",
        "intent": "改变真实历史中以秦制统一的决策，转而采纳被灭国的齐制，使齐国文化暂时延续。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "修改诏书内容并加盖印信发出",
          "target": "统一度量衡诏书草案、御史印信",
          "deadline": "齐国降表呈入前的一个时辰内"
        },
        "instantEcho": {
          "directResult": "诏令发布，全国暂用齐制，齐地百姓额手称庆，旧贵族暗中集会。",
          "unexpectedCost": "李斯发现诏书被改，立即报告嬴政，你被以‘矫诏’之罪逮捕，廷尉审讯后判流放三千里。",
          "beneficiary": "齐国旧贵族及齐地商贾",
          "payer": "你（御史，被流放）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "用齐王降印发同文诏",
        "label": "你在齐国降表呈入后，取出齐王田建所交降印，沾朱红印泥加盖于事先备好的‘书同文’诏书上，并宣布此诏以齐王名义颁行天下。",
        "intent": "使用齐王降印这一具体器物完成统一文字的执行，保留真实历史中统一制度的结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "用齐王降印加盖‘书同文’诏书并宣布颁行",
          "target": "齐王田建之降印、‘书同文’诏书",
          "deadline": "齐国降表呈入后即刻执行"
        },
        "instantEcho": {
          "directResult": "诏书以齐王名义下发，齐地士人不再抗拒秦篆，文字统一进程顺利。",
          "unexpectedCost": "秦始皇闻讯大怒，认为你擅用降印有损秦威，将你从御史贬为咸阳狱史。",
          "beneficiary": "秦始皇（降低齐地文化抵触）",
          "payer": "你（被贬官）"
        }
      },
      {
        "id": "B",
        "displayLabel": "焚秦告示颁齐律令",
        "label": "你在齐国降表呈入后，从廊下取过预先张贴的秦制统一告示数卷，投入铜炉中焚毁，然后取出齐王降印发布‘各守旧俗、暂不统一’的临时律令。",
        "intent": "彻底改变统一制度的命令方向，焚毁秦制告示并发布维持旧俗的律令，使六国体制暂时复苏。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "焚毁秦制统一告示并发齐王降印律令",
          "target": "秦制统一告示、齐王降印",
          "deadline": "齐国降表呈入后即刻执行"
        },
        "instantEcho": {
          "directResult": "齐地及各地旧贵族纷纷响应，六国旧制复活，中央权威遭受严重削弱。",
          "unexpectedCost": "嬴政得知后震怒，命王翦率军镇压，你被以叛国罪逮捕，受拶刑后流放岭南。",
          "beneficiary": "齐王田建（名义获益）及六国旧贵族",
          "payer": "你（御史，受刑后流放）"
        }
      }
    ]
  },
  "daze-uprising-209bc": {
    "trajectory": {
      "historicalPath": "保留实际历史中陈胜吴广斩杀将尉、誓师起义的完整行动链，你作为执行者之一。",
      "preservedResult": "陈胜吴广发动起义并建立张楚政权，秦末反抗迅速席卷各地。",
      "decisiveFork": "改变真实历史：陈胜被出卖处决，戍卒被强令继续前进，起义未爆发。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "斩将尉举义旗",
        "label": "你趁夜与陈胜吴广合计，次日清晨以误期为由鼓动戍卒，乘两名秦尉官不备，你亲手夺过剑鞘击倒其中一人，陈胜拔剑杀死另一人，吴广割下两人首级，你登台宣布：‘公等遇雨，皆已失期，失期当斩。藉第令毋斩，而戍死者固十六七。且壮士不死即已，死即举大名耳，王侯将相宁有种乎！’随即与陈胜吴广一道率众斩木为兵，攻占大泽乡。",
        "intent": "保留实际历史中陈胜吴广斩杀将尉、誓师起义的完整行动链，你作为执行者之一。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "亲手击倒一名秦尉官，并登台宣布起义誓词，率众斩木为兵攻占大泽乡",
          "target": "两名秦尉官和九百戍卒",
          "deadline": "秦吏天亮清点前"
        },
        "instantEcho": {
          "directResult": "戍卒被鼓动，起义爆发，你与陈胜吴广共同攻占大泽乡，陈胜自立为将军，吴广为都尉，打出‘张楚’旗号。",
          "unexpectedCost": "起义初期因你英勇，陈胜开始猜忌，将你调离核心指挥层，只让你负责后勤。",
          "beneficiary": "陈胜",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "缚陈胜投秦营",
        "label": "你趁陈胜独自如厕时，用麻绳勒住其脖颈拖至暗处，与两名亲信将其捆缚，嘴塞布条，连夜押送至十里外秦军营寨，对秦吏说：‘此人聚众谋反，首犯已擒，愿率部众返回渔阳。’秦吏确认身份后当即将陈胜枭首，并命你天亮前带回戍卒继续前行，否则诛连九族。",
        "intent": "改变真实历史：陈胜被出卖处决，戍卒被强令继续前进，起义未爆发。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "勒晕并捆绑陈胜，将其送往秦军营寨，并请求秦吏放回戍卒",
          "target": "陈胜",
          "deadline": "秦吏天亮清点前"
        },
        "instantEcho": {
          "directResult": "陈胜被斩首，首级悬于营门；戍卒因恐惧而解散，吴广逃亡，大泽乡起义未发生。",
          "unexpectedCost": "秦吏为防你泄密，将你及两名亲信编入‘刑徒军’押往南方前线，沦为苦役。",
          "beneficiary": "秦朝官府",
          "payer": "你"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "鱼腹丹书立威",
        "label": "你连夜捕得一条大鲤鱼，剖腹塞入帛书‘陈胜王’，次日清晨当众让伙夫烹鱼，戍卒剖鱼发现帛书，惊呼天意；你又与吴广潜入附近祠庙，点燃篝火，学狐狸嚎叫：‘大楚兴，陈胜王’。戍卒纷纷跪拜，认定陈胜受命于天，起义决心不可动摇。",
        "intent": "保留实际历史中陈胜吴广制造舆论、坚定戍卒决心的行动链，你作为主要策划者。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "制作鱼腹帛书并假借狐鸣制造天意现象",
          "target": "全部戍卒",
          "deadline": "秦吏天亮清点前"
        },
        "instantEcho": {
          "directResult": "戍卒深信陈胜受命于天，士气高涨；当夜陈胜吴广便斩杀将尉，起义顺利发动并攻占大泽乡。",
          "unexpectedCost": "吴广嫉妒你之智谋，在起义军北上途中设局让你负伤，你掉队后只得潜逃。",
          "beneficiary": "陈胜",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "毒酒杀吴广降秦",
        "label": "你以犒赏为名，在酒中下毒，劝吴广饮下，吴广中毒后倒地身亡；你随即集拢亲信戍卒，宣称‘吴广已被天谴，陈胜亦将获罪，降秦可免死’，并押送陈胜至秦营，要求秦吏接受投降，许诺率众返回渔阳。",
        "intent": "改变真实历史：吴广被毒杀，陈胜被押送秦营，起义被瓦解，戍卒投降。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "用毒酒杀死吴广，并押送陈胜至秦营投降",
          "target": "吴广",
          "deadline": "秦吏天亮清点前"
        },
        "instantEcho": {
          "directResult": "吴广死，陈胜被秦吏处决，戍卒全部投降，起义被扑灭。",
          "unexpectedCost": "秦吏认为你留之必为后患，以‘助逆’罪名将你及亲信一并坑杀。",
          "beneficiary": "秦朝官府",
          "payer": "你"
        }
      }
    ]
  },
  "han-founded-202bc": {
    "trajectory": {
      "historicalPath": "谒者宣读诸侯劝进表 → 刘邦接受 → 诸侯上尊号 → 刘邦即皇帝位 → 定都长安",
      "preservedResult": "刘邦称帝建立汉朝，随后定都长安并重建统一秩序。",
      "decisiveFork": "午时前是否按诸侯劝进表立即宣读皇帝即位诏"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "宣读即位诏",
        "label": "你双手展开竹简，对列阵诸侯高唱‘汉王刘邦顺天应人，即皇帝位’，并将诏书呈交刘邦御览，示意诸侯跪拜。",
        "intent": "通过宣读诏书启动登基仪式，保留刘邦称帝的结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "宣读即位诏并指示诸侯行礼",
          "target": "诸侯王、刘邦、即位诏书",
          "deadline": "午时列阵完成前"
        },
        "instantEcho": {
          "directResult": "诸侯王跪拜高呼万岁，刘邦正式称帝，汉朝建立。",
          "unexpectedCost": "刘邦立即命卫将军收缴诸侯兵符，引发楚王韩信、梁王彭越私下联络。",
          "beneficiary": "刘邦",
          "payer": "韩信、彭越等异姓诸侯王"
        }
      },
      {
        "id": "B",
        "displayLabel": "压下奏表",
        "label": "你当着诸侯面将劝进表掷于案上，厉声说‘汉王谦让，不可逼迫’，并命令殿内侍卫没收所有劝进文书。",
        "intent": "阻止称帝仪式，推迟汉朝建立，改变刘邦与诸侯的权力格局。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "扔下劝进表并下令没收",
          "target": "劝进表、诸侯王、侍卫",
          "deadline": "午时正"
        },
        "instantEcho": {
          "directResult": "诸侯哗然，刘邦面色铁青，典礼中断，称帝推迟。",
          "unexpectedCost": "刘邦怒斥你‘妄议朝仪’，命卫士将你押入大牢。",
          "beneficiary": "反对刘邦称帝的诸侯王（韩信、彭越等）",
          "payer": "你（谒者）与刘邦的威严"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "引导上尊号",
        "label": "你未宣诏，而是高声唱礼，引导诸侯王依次向刘邦三跪九叩，齐呼‘上皇帝尊号’，待刘邦颔首后再宣读即位诏。",
        "intent": "用先尊号后宣诏的仪式顺序完成同一历史结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "引导诸侯先上尊号，再宣读即位诏",
          "target": "诸侯王、刘邦、即位诏书",
          "deadline": "午时正"
        },
        "instantEcho": {
          "directResult": "诸侯上尊号后刘邦接受，宣诏称帝，汉朝建立。",
          "unexpectedCost": "因先上尊号，诸侯视刘邦为‘推举’而非天命，中央权威稍弱。",
          "beneficiary": "刘邦",
          "payer": "刘邦的君权神圣性"
        }
      },
      {
        "id": "B",
        "displayLabel": "迁都洛阳",
        "label": "你俯首进言：‘陛下，定陶非久安之地，臣请即日迁都洛阳，以镇东方诸侯。’同时阻止宣读长安相关诏书。",
        "intent": "改变定都地点，脱离‘定都长安’的历史轨道。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "进言迁都洛阳并扣下长安定都诏",
          "target": "刘邦、诸侯王、定都文书",
          "deadline": "午时正"
        },
        "instantEcho": {
          "directResult": "刘邦采纳迁都洛阳之议，长安定都取消，汉朝定都洛阳，政治中心东移。",
          "unexpectedCost": "你被刘邦斥责‘越职言事’，贬为庶民，逐出朝廷。",
          "beneficiary": "东方诸侯（如韩信、彭越）",
          "payer": "你（谒者）、刘邦的统一战略"
        }
      }
    ]
  },
  "zhang-qian-138bc": {
    "trajectory": {
      "historicalPath": "郎官核验符节后，将符节交给张骞，放行使团出长安西门。张骞一行经陇西进入匈奴控制区被扣留，十余年后逃脱，最终到达大月氏。",
      "preservedResult": "张骞奉命出使西域，虽遭匈奴扣留，归来后仍带回重要的西域信息。",
      "decisiveFork": "是否将符节交给张骞并放行使团出城"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "签发符节放行使团",
        "label": "你在城门关闭前，从腰间解下铜虎符，仔细比对张骞递上的使节文书，确认无误后，将符节交到他手中，并命令守门军士打开西门放行使团出城。",
        "intent": "保留实际历史中的核验和放行行动链，使张骞得以出使。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "将铜虎符交到张骞手中，并命令守门军士开西门放行",
          "target": "张骞",
          "deadline": "使团将在城门关闭前启程"
        },
        "instantEcho": {
          "directResult": "张骞接过符节，率使团从西门出城，沿着河西走廊方向远去。",
          "unexpectedCost": "匈奴细作在暗处看到使团出发方向，飞马报告单于，使团在陇西被匈奴骑兵拦截扣押。",
          "beneficiary": "汉武帝得到西域的情报可能",
          "payer": "张骞及其使团被匈奴扣留十余年"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣留符节拒绝放行",
        "label": "你在城门关闭前，当张骞递上使节文书时，将文书掷于地上，声称发现文书有伪造嫌疑，拒绝签发符节并命军士将张骞一行押入廷尉府候审。",
        "intent": "改变控制权：阻止张骞出使，使匈奴封锁西域信息更长时间。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "拒绝签发符节并命军士扣押张骞",
          "target": "张骞",
          "deadline": "使团将在城门关闭前启程"
        },
        "instantEcho": {
          "directResult": "张骞被押走，使团解散，未能出使。",
          "unexpectedCost": "汉武帝震怒，认为你渎职，下旨将你削职为庶民，并流放陇西边塞。",
          "beneficiary": "匈奴暂时免于被汉朝与大月氏夹击的风险",
          "payer": "你（被流放）；张骞（未完成使命）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "授权副使代发符节",
        "label": "你在城门关闭前，将符节和核验文书交给副使张骞的助手陈辉，命他代你核验并签发，自己躲在廊柱后观察。",
        "intent": "保留实际历史中的放行结果，但使用另一人物执行。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "将符节授权给副使陈辉，让他代行核验并放行",
          "target": "陈辉（张骞副使）",
          "deadline": "使团将在城门关闭前启程"
        },
        "instantEcho": {
          "directResult": "陈辉核验文书合格，将符节交给张骞，使团按时出城。",
          "unexpectedCost": "你的行为被御史记录为‘委任不当’，事后被罚俸一年。",
          "beneficiary": "张骞按计划出使",
          "payer": "你（被罚俸）；张骞仍被匈奴扣留"
        }
      },
      {
        "id": "B",
        "displayLabel": "调换符节路线改道",
        "label": "你在城门关闭前，故意将符节交给张骞，但暗中指示守门军士将西门关闭，改开北门，并告知张骞‘北门有匈奴细作需绕行’，实际使其进入匈奴伏击圈。",
        "intent": "改变结果：使张骞立即被匈奴俘虏，无法完成出使任务。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "指示军士开北门而非西门，误导张骞进入匈奴伏击区",
          "target": "张骞",
          "deadline": "使团将在城门关闭前启程"
        },
        "instantEcho": {
          "directResult": "张骞一行从北门出城，不出十里即被匈奴骑兵俘获。",
          "unexpectedCost": "你的行为被随行御史记下，汉武帝以‘通敌’嫌疑将你下狱，后虽未处死但终身监禁。",
          "beneficiary": "匈奴获得人质并提前获知汉朝意图",
          "payer": "你（终身监禁）；张骞（被俘）"
        }
      }
    ]
  },
  "mobei-119bc": {
    "trajectory": {
      "historicalPath": "卫青必须在沙尘升起前拔营，分两路深入漠北，重创匈奴主力。",
      "preservedResult": "卫青霍去病远征漠北重创匈奴主力，汉匈力量格局发生重大变化。",
      "decisiveFork": "改变进军方向，使汉军主力追击单于而非按原路，打破诱敌计划。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "令赵信部按原路进发",
        "label": "你在中军帐内对骑都尉赵信下达命令：率本部五千骑沿既定路线向漠北深处挺进，接应前军斥候，勿改路径。",
        "intent": "保留卫青决策链，使大军按历史既定方向前进，匈奴主力得以诱敌远离补给线。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下达书面行军令并加盖军侯印，命赵信部沿原定路线即日拔营，不得延误。",
          "target": "骑都尉赵信",
          "deadline": "大军必须在沙尘升起前拔营"
        },
        "instantEcho": {
          "directResult": "赵信部按时出发，汉军两路分进，匈奴单于主力按计划后撤诱敌。",
          "unexpectedCost": "向导队因抽调赵信部而减少，后续迷路风险增加。",
          "beneficiary": "匈奴单于",
          "payer": "赵信部及后续迷路汉军"
        }
      },
      {
        "id": "B",
        "displayLabel": "改道追击俘虏所指方向",
        "label": "你在中军帐内对卫青直陈：根据俘虏口供，单于主力在东北方向，应即刻改道追击，并自请率本部粮秣队充当前导。",
        "intent": "改变进军方向，使汉军主力追击单于而非按原路，打破诱敌计划。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "当众向卫青献上俘虏口供并请求改道，同时下令自己掌管的辎重队转向东北。",
          "target": "卫青及中军帐诸将",
          "deadline": "大军必须在沙尘升起前拔营"
        },
        "instantEcho": {
          "directResult": "卫青下令全军改道东北，汉军追向单于主力，匈奴诱敌计划破产。",
          "unexpectedCost": "后勤线拉长，部分粮草车陷于沙地。",
          "beneficiary": "汉军及卫青",
          "payer": "后队辎重兵"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "督促霍去病部按期出发",
        "label": "你亲自带向导旗奔赴霍去病营地，向其传达卫青军令：立即按预定路线出塞，不得等候中路。",
        "intent": "通过另一人（霍去病）执行同一历史轨道，确保分路进攻按历史发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "骑快马至霍去病营，口头传达卫青拔营令，并留下两名向导。",
          "target": "霍去病",
          "deadline": "大军必须在沙尘升起前拔营"
        },
        "instantEcho": {
          "directResult": "霍去病随即拔营，汉军两路按历史方向出击。",
          "unexpectedCost": "你本人脱离中军营帐，沙尘中返回时迷路半日。",
          "beneficiary": "霍去病及东路汉军",
          "payer": "你（军侯）的体力与时间"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣留向导队迫使卫青就粮",
        "label": "你假传军令，命向导队停止前进，并扣押地图与水源标识，迫使卫青无法按原路进军，只能改道就粮。",
        "intent": "改变控制权，通过扣留关键资源迫使卫青改变方向，使汉军就粮而非追击。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "以军侯印信下令向导队扎营待命，并收起所有水源标记图。",
          "target": "向导队全体及水源标识图",
          "deadline": "大军必须在沙尘升起前拔营"
        },
        "instantEcho": {
          "directResult": "卫青无向导可用，被迫改道向南就粮，汉军未与匈奴主力决战。",
          "unexpectedCost": "你因假传军令被卫青事后查处，以军法论处。",
          "beneficiary": "匈奴单于",
          "payer": "你（军侯）及卫青的威信"
        }
      }
    ]
  },
  "wang-mang-9": {
    "trajectory": {
      "historicalPath": "尚书郎在百官入殿前加盖传国玺、宣读禅让诏，王莽即天子位。",
      "preservedResult": "王莽接受禅让建立新朝，随后推行一系列制度改革。",
      "decisiveFork": "是否在盖玺宣读诏书的那一刻执行，决定了禅让程序能否顺利完成。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "盖玺宣读新国号",
        "label": "你必须在百官入殿朝贺前，将传国玺盖在孺子婴退位诏书上，并向王莽及在场官员高声宣读“新”国号。",
        "intent": "保留历史中尚书郎执行禅让诏书盖章宣读的行动链，使新朝建立按时发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "加盖传国玺并宣读诏书",
          "target": "传国玺、孺子婴退位诏书、王莽、百官",
          "deadline": "百官入殿前一刻钟内"
        },
        "instantEcho": {
          "directResult": "诏书生效，王莽即天子位，百官朝贺。",
          "unexpectedCost": "你因亲手终结汉祚，内心痛苦但表面镇定。",
          "beneficiary": "王莽",
          "payer": "汉室宗亲与旧臣"
        }
      },
      {
        "id": "B",
        "displayLabel": "拒绝盖玺并质问天命",
        "label": "你必须在百官入殿朝贺前，拒绝将传国玺盖在退位诏书上，并当众质问王莽：“孺子婴何罪？天命岂可伪造？”",
        "intent": "改成在场官员哗然，王莽震怒，命令卫士逮捕你。诏书暂未生效，朝贺推迟",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "拒绝盖玺并质问",
          "target": "传国玺、孺子婴退位诏书、王莽",
          "deadline": "百官入殿前一刻钟内"
        },
        "instantEcho": {
          "directResult": "在场官员哗然，王莽震怒，命令卫士逮捕你。诏书暂未生效，朝贺推迟。",
          "unexpectedCost": "你立即被投入大牢，面临处决风险。",
          "beneficiary": "汉室支持者（短暂喘息）",
          "payer": "你自身"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "递玺让刘歆代宣",
        "label": "你必须在百官入殿前，将传国玺与退位诏书直接交给王莽心腹刘歆，由其代为宣读并宣布新朝建立。",
        "intent": "使用不同人物（刘歆）完成同一历史行动链，保留新朝建立结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "递玺给刘歆",
          "target": "传国玺、退位诏书、刘歆",
          "deadline": "百官入殿前一刻钟内"
        },
        "instantEcho": {
          "directResult": "刘歆宣读诏书，王莽登基，百官朝贺如常。",
          "unexpectedCost": "你因未亲自宣读，事后被王莽猜忌，失去信任。",
          "beneficiary": "王莽、刘歆",
          "payer": "你（仕途受损）"
        }
      },
      {
        "id": "B",
        "displayLabel": "摔玺斥莽称新为逆",
        "label": "你必须在百官入殿前，将传国玺猛摔在地，指着王莽说：“窃国大盗，新朝乃伪朝！”",
        "intent": "改成玉玺碎裂，王莽大怒，命卫士将你痛打后囚禁。禅让仪式无法正常进行，朝贺中断",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "摔玺并斥责",
          "target": "传国玺、王莽",
          "deadline": "百官入殿前一刻钟内"
        },
        "instantEcho": {
          "directResult": "玉玺碎裂，王莽大怒，命卫士将你痛打后囚禁。禅让仪式无法正常进行，朝贺中断。",
          "unexpectedCost": "你重伤被囚，王莽下令追查你的家族。",
          "beneficiary": "汉室残余势力（暂时延缓新朝合法性）",
          "payer": "你及家人"
        }
      }
    ]
  },
  "kunyang-25": {
    "trajectory": {
      "historicalPath": "为了让 actualHistory 发生，你必须在死线前向刘秀交出名册并发信号兵，由刘秀亲率三千敢死队开南门突击王邑中军；你本人留在南门楼待命，不得自行率队出击。",
      "preservedResult": "刘秀率突击队击破新军中枢，昆阳守军出击，新军大败。",
      "decisiveFork": "改成你率队突入中军斩杀副将，但刘秀因无名册而滞留城内；新军由王邑亲自指挥反攻，你部被围，最终战败被俘，昆阳守军因失去突击主力而士气崩溃，城破在即"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "交名册助刘秀出击",
        "label": "你在日出鼓响前将三千敢死队名册亲手交到刘秀手中，并命城头信号兵点燃三堆烽火；刘秀见信后率队推开南门，直冲王邑中军帐，斩杀副将，新军指挥瘫痪，昆阳守军趁势出击，大获全胜。",
        "intent": "你作为骑都尉完成名册交接和信号传递的核心职责，确保刘秀按历史真实路径率突击队出击并击破新军中军。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "亲手递交三千敢死队名册给刘秀，并令信号兵点燃烽火",
          "target": "刘秀、南门信号兵",
          "deadline": "日出前王邑发动总攻之时"
        },
        "instantEcho": {
          "directResult": "刘秀接过名册，下令开门，三千敢死队鱼贯而出；刘秀一马当先突入新军大营，王邑令旗被夺，新军大乱；昆阳守军全线出击，新军溃败。",
          "unexpectedCost": "你在传递名册时被掉落城砖砸伤左脚踝，此后行走微跛，但不妨碍骑马。",
          "beneficiary": "刘秀、昆阳守军",
          "payer": "你（轻伤跛行）"
        }
      },
      {
        "id": "B",
        "displayLabel": "开南门独冲中军",
        "label": "你扣下名册不交刘秀，反而自行召集三千敢死队，命心腹将南门打开，你亲自率队直扑王邑大营，斩首王邑副将，但刘秀因无名册无法调度后续部队，新军反扑，你部被困，刘秀被迫放弃救援，你最终力战被俘。",
        "intent": "改成你率队突入中军斩杀副将，但刘秀因无名册而滞留城内；新军由王邑亲自指挥反攻，你部被围，最终战败被俘，昆阳守军因失去突击主力而士气崩溃，城破在即",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "擅自打开南门，亲率三千敢死队冲击王邑中军",
          "target": "王邑中军帐、刘秀指挥体系",
          "deadline": "日出前王邑发动总攻之时"
        },
        "instantEcho": {
          "directResult": "你率队突入中军斩杀副将，但刘秀因无名册而滞留城内；新军由王邑亲自指挥反攻，你部被围，最终战败被俘，昆阳守军因失去突击主力而士气崩溃，城破在即。",
          "unexpectedCost": "你被俘后遭受鞭刑，但刘秀在城破前派亲信将你赎回，未死。",
          "beneficiary": "新军、王邑",
          "payer": "你（被俘受刑）、刘秀（失去突击队）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "密报刘秀避埋伏",
        "label": "你在黎明前通过心腹传话刘秀：“南门外三里处新军设有绊马索和陷坑，请绕行东侧小路直逼中军侧翼。”刘秀采纳建议，率队从东侧绕行，避过陷阱，突入中军打乱敌阵，王邑仓皇撤退，昆阳守军出击获胜。",
        "intent": "通过提供关键情报保留刘秀突击成功的真实历史结果，但改变具体路线。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "派心腹传话刘秀，建议绕行东侧小路避开埋伏",
          "target": "刘秀、南门外新军陷阱",
          "deadline": "日出前王邑发动总攻之时"
        },
        "instantEcho": {
          "directResult": "刘秀率队绕行东侧，果然避开陷阱，突入中军斩将夺旗；新军失去指挥，昆阳守军掩杀，大获全胜。",
          "unexpectedCost": "你的心腹在传话途中被流矢射死，你因此遭到刘秀麾下怀疑，被调离骑都尉职位但未受刑。",
          "beneficiary": "刘秀、昆阳守军",
          "payer": "你（失职被调离）"
        }
      },
      {
        "id": "B",
        "displayLabel": "假传调令散新军",
        "label": "你伪造一份由王邑副将签发的调令，命传令兵在黎明前奔赴新军各营：“主将令，各营即刻撤至颍川，不得延误。”新军各营信以为真，拔营撤退；王邑发觉后镇压无效，刘秀趁机出城追击，大破新军。",
        "intent": "通过伪造调令改变王邑对军团的直接控制权和进攻命令，使新军不战自溃，逆转历史中刘秀亲自突击的结果。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "伪造副将调令并派传令兵在各营宣读",
          "target": "新军各营、王邑指挥权",
          "deadline": "日出前王邑发动总攻之时"
        },
        "instantEcho": {
          "directResult": "新军各营争相撤退，王邑杀数人仍无法阻止，刘秀率三千骑出城追击，斩杀新军数千，缴获辎重无数；昆阳守军出城配合，新军溃败。",
          "unexpectedCost": "刘秀战后查明调令系伪造，为防军中效仿，将你杖责二十并逐出军营，你流落民间，但未死。",
          "beneficiary": "刘秀、昆阳守军",
          "payer": "你（杖责、逐出）"
        }
      }
    ]
  },
  "yellow-turban-184": {
    "trajectory": {
      "historicalPath": "张角在计划泄露后，紧急派遣弟子传令各州渠帅提前起义，起义按时爆发。",
      "preservedResult": "张角提前发动黄巾起义，东汉调集各地军队镇压，地方武装由此坐大。",
      "decisiveFork": "你作为信使主管，决定是否将张角的提前起义命令发出，或阻止命令发出。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "急令八州渠帅提前起兵",
        "label": "你作为张角身边掌管各方渠帅密信的弟子，在官府天亮搜捕前，亲手将盖有道坛密印的‘提前举事’令交给八名信使，命他们分赴八州渠帅处，即刻发动起义。",
        "intent": "保留真实历史中张角紧急传令提前起义的行动链，确保actualHistory按原样发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "亲手将写有具体起兵日期和暗号的急令交给八名信使，命令他们立刻出发传信。",
          "target": "八名信使（张角亲传弟子，负责联系各州渠帅）",
          "deadline": "天亮前"
        },
        "instantEcho": {
          "directResult": "急令发出，各州渠帅陆续收到提前起义的命令，黄巾起义在预定日之前爆发。",
          "unexpectedCost": "你因遣使匆忙，未及销毁坛场内部分告密者名单，导致后来官府查获相关线索。",
          "beneficiary": "张角与太平道信众",
          "payer": "你本人（背上了泄密嫌疑，但并未死亡或被囚）"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣留急令改传按兵暗号",
        "label": "你在官府天亮搜捕前，扣下张角发出的‘提前举事’急令，转而以张角名义向各州渠帅传送‘暗号未到，切勿妄动’的密信，使各州未能同时起兵。",
        "intent": "改变提前起义的命令方向，使各州失去统一行动，官府得以逐个击破部分渠帅。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "将原急令藏匿，另写一封假命令并加盖仿制道坛密印，由同一批信使送出。",
          "target": "八名信使与各州渠帅",
          "deadline": "天亮前"
        },
        "instantEcho": {
          "directResult": "各州渠帅按兵不动，仅个别因提前走漏风声被迫起事，东汉轻松镇压早期起义。",
          "unexpectedCost": "张角发现命令被篡改后，立刻怀疑身边有内奸，你被逐出道坛并被张角追杀。",
          "beneficiary": "东汉朝廷与地方豪强",
          "payer": "你（被逐出太平道，遭到追捕，但未死）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "伪造洛阳内应急信催促起事",
        "label": "你模仿洛阳内应马元义的笔迹，写一封急信声称‘官府已发觉，速起’，并让一名不识字的新进弟子连夜呈交张角，促使他下决心提前起义。",
        "intent": "使用不同人物和物证推动同一历史结果，即张角提前发动起义。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "以马元义名义伪造密信，并交给新进弟子送予张角。",
          "target": "张角（太平道首领）",
          "deadline": "天亮前"
        },
        "instantEcho": {
          "directResult": "张角见信后深信不疑，当即决定提前起义。",
          "unexpectedCost": "真马元义事后发现有人冒用其名，对你产生猜忌，派人追查你。",
          "beneficiary": "张角与太平道",
          "payer": "你（遭到马元义势力追查，但未死亡）"
        }
      },
      {
        "id": "B",
        "displayLabel": "假传渠帅供词导致张角放弃起义",
        "label": "你捏造一封某渠帅的‘自白信’，声称他已供出全部计划，并故意让张角在坛场搜到，使张角误以为起义已彻底暴露，从而下令各州解散，起义流产。",
        "intent": "改变起义结果，使黄巾起义未能如期全面爆发。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "伪造一封渠帅投降信，并悄悄放置在张角经卷下。",
          "target": "张角（太平道首领）",
          "deadline": "天亮前"
        },
        "instantEcho": {
          "directResult": "张角误信起义已败露，急忙下令各州停止行动，导致起义未起。",
          "unexpectedCost": "张角事后发现信件为假，认定你为叛徒，发出追杀令。",
          "beneficiary": "东汉朝廷",
          "payer": "你（被张角追杀，被迫逃亡）"
        }
      }
    ]
  },
  "shu-fall-263": {
    "trajectory": {
      "historicalPath": "侍中在刘禅面前接过降诏，捧至北门城楼，待邓艾前锋抵城时宣诏投降，命守军放下武器打开城门。",
      "preservedResult": "邓艾偷渡阴平逼近成都，刘禅选择投降，蜀汉灭亡。",
      "decisiveFork": "降诏是否传到城门并被执行"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "捧诏宣降开门纳敌",
        "label": "你在刘禅面前接过降诏，捧至北门城楼，待邓艾前锋抵城时宣诏投降，命守军放下武器打开城门。",
        "intent": "执行刘禅投降命令的实际传递，保留降诏、城门、邓艾军等关键要素。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "捧着降诏登上北门城楼，在邓艾前锋到达时宣读降诏，命令守军开城投降",
          "target": "刘禅降诏、成都北门守军、邓艾前锋部队",
          "deadline": "邓艾前锋抵达城门之时"
        },
        "instantEcho": {
          "directResult": "北门打开，邓艾军进入成都，蜀汉灭亡成为事实。",
          "unexpectedCost": "你被后世史书记为投降派代表，遭受文人口诛笔伐。",
          "beneficiary": "邓艾、曹魏朝廷",
          "payer": "刘禅及蜀汉宗室、文武官员"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣诏拒城急召姜维",
        "label": "你在内殿截下刘禅递给你的降诏，将其藏入袖中，喝令北门守军关闭城门、布置防御，并遣亲信持密令驰往剑阁召姜维回援。",
        "intent": "改变降诏传递与城门开闭的控制关系，阻止投降命令生效，改命等待援军。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "扣押降诏，下令关闭北门，派亲信前往剑阁向姜维求救",
          "target": "刘禅降诏、成都北门、姜维",
          "deadline": "邓艾前锋抵达前的一个时辰内"
        },
        "instantEcho": {
          "directResult": "城门紧闭，守军布防，邓艾前锋受阻于城外。",
          "unexpectedCost": "刘禅察觉后大怒，宣布你为叛逆，城内部分官员倒向曹魏。",
          "beneficiary": "姜维、成都城内抵抗派将士",
          "payer": "你（被刘禅通缉）、可能被邓艾攻破后遭屠戮的抵抗军民"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "遣使献玺递送降表",
        "label": "你以侍中身份草拟降表，并命尚书郎携带蜀汉玉玺和户籍册出城，向邓艾正式献降。",
        "intent": "使用递送降表玉玺的不同程序执行同一投降轨道。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "草拟降表，命尚书郎持玉玺和户籍册出城递交邓艾",
          "target": "降表、玉玺、户籍册、邓艾",
          "deadline": "邓艾前锋抵达城门前一刻"
        },
        "instantEcho": {
          "directResult": "邓艾确认投降，率军入城，蜀汉灭亡。",
          "unexpectedCost": "尚书郎被邓艾军士惊吓而坠马受伤。",
          "beneficiary": "邓艾、曹魏朝廷",
          "payer": "刘禅、蜀汉君臣"
        }
      },
      {
        "id": "B",
        "displayLabel": "传伪诏诱邓艾入伏",
        "label": "你伪造一份刘禅的诏书，宣称蜀汉已调集十万大军回援，邀邓艾单骑入城谈判，同时命北门守军准备伏击。",
        "intent": "用伪诏改变邓艾的动向，设伏擒拿，扭转成都战局。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "伪造诏书，派使者出城交予邓艾，同时布置伏兵于北门内侧",
          "target": "刘备旧诏纸笔、邓艾、北门守军",
          "deadline": "邓艾前锋抵达前一刻"
        },
        "instantEcho": {
          "directResult": "邓艾心存疑虑，仅派副将入城，副将被擒，城外魏军暂缓进攻。",
          "unexpectedCost": "刘禅发现你伪造诏书，将你收押，抵抗计划暴露。",
          "beneficiary": "抵抗派将士",
          "payer": "你（被囚禁）、可能提前激怒邓艾导致强攻"
        }
      }
    ]
  },
  "jin-unification-280": {
    "trajectory": {
      "historicalPath": "王濬舰队抵达石头城，孙皓备亡国之礼，素车白马，面缚舆榇，至晋军营门投降。王濬受降，解缚焚榇，收降表玉玺，然后遣人封存吴国府库。",
      "preservedResult": "孙皓向晋军投降，西晋灭吴并短暂统一全国。",
      "decisiveFork": "受降仪式是否由你主持？府库由你下令封存还是由王濬亲自处理？"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "接玺封库守王命",
        "label": "你在石头城水门，待孙皓一行人到达后，展开王濬亲授的受降文书，宣读受降条款，亲手从孙皓手中接过降表与玉玺，并高声传令：‘王将军有令，即刻封存东吴武库、粮库、钱库、锦库，任何人不得擅动。’你签署封库令，命二十名军士分五组持令前往各库，将所有库门贴上王濬军令封条，并将钥匙锁入随身铜匣。",
        "intent": "完整执行受降、收玺、封库的历史行动链，使降表正式送达、府库被晋军控制，保留孙皓投降、西晋统一的结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "宣读受降条款、接过降表玉玺、签署封库令、监督封库、锁钥匙入铜匣",
          "target": "孙皓、降表、玉玺、东吴武库粮库钱库锦库、二十名军士",
          "deadline": "晋军楼船午时进入建业前完成受降仪式，并在午时前完成封库"
        },
        "instantEcho": {
          "directResult": "孙皓投降仪式完成，降表誊抄件已送王濬并快马送洛阳，东吴所有府库被贴上晋军封条，钥匙被集中锁在你手中。",
          "unexpectedCost": "你因持有所有钥匙，成为各路人马索要的目标，有人试图贿赂或抢夺钥匙。",
          "beneficiary": "晋廷（王濬代表）、洛阳中央政府",
          "payer": "你（承受压力与安全风险）"
        }
      },
      {
        "id": "B",
        "displayLabel": "私开粮库散军心",
        "label": "你在受降后，趁王濬登楼船巡视，命亲信书吏伪造王濬手令：‘为安军心，先开粮库分发三月军粮、钱库按头支饷。’你持假令至粮库钱库，令守军撕去封条，将粮钱发给登陆晋军先头部队，并宣布：‘王将军有令，先登者双饷。’同时你故意延迟封存武库、锦库，使其暂归军队自行支配。",
        "intent": "改变府库封存待中央处置的轨道，由军队立即控制并消耗资源，使晋军获得实际利益而中央失去对府库的及时控制。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "伪造王濬手令、命令打开粮库钱库、分发物资给登陆晋军、宣布双饷令、延迟封存其他库",
          "target": "亲信书吏、王濬手令、守库晋军、登陆先头部队、东吴粮库钱库",
          "deadline": "受降仪式结束后、王濬巡视楼船返回之前（约一个时辰内）"
        },
        "instantEcho": {
          "directResult": "东吴粮库和钱库被打开，粮钱大量发放，晋军士气高昂迅速占领建业，但府库物资被私分。",
          "unexpectedCost": "伪造手令之事很快败露，你被王濬下令逮捕，但物资已分发无法追回。",
          "beneficiary": "晋军先头部队（获得双饷和粮食）",
          "payer": "你（被逮捕、可能被处决或流放）、洛阳中央（失去对府库物资的控制）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "押玺赴洛定乾坤",
        "label": "你在受降仪式后，亲自携带孙皓降表与玉玺，率十名亲兵乘坐快马小船，沿运河北上直趋洛阳，务必在三日之内将降表与玉玺当面交到司马炎手中，途中不停任何驿站，不假他人之手。",
        "intent": "使用亲自押送降表玉玺的不同动作，确保降表玉玺及时送达洛阳，保留西晋统一的关键证据。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "亲自携带降表玉玺、率亲兵乘快马小船、沿运河北上、直达洛阳、当面呈交司马炎",
          "target": "孙皓降表、玉玺、司马炎、十名亲兵",
          "deadline": "三日内送达洛阳"
        },
        "instantEcho": {
          "directResult": "降表与玉玺在第一时间安全抵达洛阳，司马炎亲自接收，西晋统一的法律程序迅速完成。",
          "unexpectedCost": "你离开建业后，王濬因缺少文书官，府库封存出现混乱，部分物资被留守军官私吞。",
          "beneficiary": "司马炎和洛阳朝廷（获得统一象征）",
          "payer": "你（旅途劳顿、可能在途中遇险）、王濬舰队（因你的离开出现管理空缺）"
        }
      },
      {
        "id": "B",
        "displayLabel": "私拆诏令改封赏",
        "label": "你在受降仪式前，趁王濬尚未登岸，私自从传递快马中截获一份洛阳发来的密诏（内容为‘诸军封赏待朝廷定夺’），你模仿笔迹改写为‘先登者赏千金、封侯爵，府库物资听王濬便宜处置’，并重新封好交予传令兵。",
        "intent": "改变朝廷对封赏和府库处置的权威决定，由军队自行决定赏罚和物资分配，削弱中央控制。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "截获密诏、模仿笔迹改写、重新封好交予传令兵",
          "target": "洛阳密诏、传令兵、王濬、晋军将士",
          "deadline": "受降仪式开始前、王濬登岸前"
        },
        "instantEcho": {
          "directResult": "晋军将士受赏赐激励，攻城更加勇猛，王濬据诏令自行分配府库物资，军队迅速控制建业。",
          "unexpectedCost": "事后洛阳发现诏令被篡改，派使者调查，你被指为嫌疑对象，被迫逃亡。",
          "beneficiary": "王濬及晋军将士（获得丰厚赏赐和物资）",
          "payer": "你（被追捕、流亡）、洛阳朝廷（权威受损）"
        }
      }
    ]
  },
  "northern-wei-439": {
    "trajectory": {
      "historicalPath": "必须亲自向北凉降使宣读北魏诏书，命令沮渠牧犍即刻开城投降，并宣布全军入城后不得劫掠平民，以换取北凉政权和平交接。",
      "preservedResult": "北魏攻灭北凉，结束十六国割据并统一中国北方。",
      "decisiveFork": "改成沮渠牧犍接到密信后，决定继续抵抗，关闭城门，并在城头射杀北魏信使"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "宣读诏书促降",
        "label": "你作为主簿，在姑臧城东门当着北凉降使和北魏将领的面，高声宣读北魏太武帝拓跋焘的纳降诏书，命令沮渠牧犍立即开城投降，并承诺保全城内士民生命财产。",
        "intent": "让沮渠牧犍按历史真实在日落前开城投降，北魏军队和平占领姑臧。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "宣读诏书并命令沮渠牧犍即刻开城投降",
          "target": "沮渠牧犍与北凉降使",
          "deadline": "攻城器械就位前"
        },
        "instantEcho": {
          "directResult": "沮渠牧犍听到诏书后，下令打开城门，北魏军列队入城，姑臧城未遭战火摧残。",
          "unexpectedCost": "你在宣读时因紧张而口误，被副将崔浩当众批评，声望轻微受损。",
          "beneficiary": "北魏太武帝拓跋焘获得完整姑臧城及北凉国库。",
          "payer": "你因口误被同僚嘲笑。"
        }
      },
      {
        "id": "B",
        "displayLabel": "密信劝降据城",
        "label": "你暗中写一封密信，派亲兵绑在箭上射入城中，信中承诺若沮渠牧犍坚守不降，你将说服魏帝保留其王爵并赐地自封，诱使他拒绝投降、继续抵抗。",
        "intent": "改成沮渠牧犍接到密信后，决定继续抵抗，关闭城门，并在城头射杀北魏信使",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "射密信入城，许诺保留王爵诱使沮渠牧犍坚守",
          "target": "沮渠牧犍",
          "deadline": "攻城器械就位前"
        },
        "instantEcho": {
          "directResult": "沮渠牧犍接到密信后，决定继续抵抗，关闭城门，并在城头射杀北魏信使。",
          "unexpectedCost": "你的密信被北魏将军截获，你被指控通敌，立即被解职押送平城受审。",
          "beneficiary": "沮渠牧犍获得短暂喘息与抵抗意志。",
          "payer": "你失去官职并被押送质询。"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "分发粮草安民",
        "label": "你命令辎重官立即开仓放粮，将北魏军粮分发给姑臧城内饥民，并要求北凉官员配合登记户籍，以稳定民心、防止暴动，为和平接收创造条件。",
        "intent": "通过安抚民众确保北凉投降后社会秩序，辅助历史真实中的和平统一。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令开仓放粮并登记户籍",
          "target": "辎重官与北凉官员",
          "deadline": "日落前"
        },
        "instantEcho": {
          "directResult": "饥民领到粮食后欢呼雀跃，城内秩序稳定，北凉官员积极配合。",
          "unexpectedCost": "部分军粮被哄抢，导致北魏军队后续补给短缺。",
          "beneficiary": "姑臧城平民及北凉降官。",
          "payer": "北魏军士因补给不足而略有怨言。"
        }
      },
      {
        "id": "B",
        "displayLabel": "策反部将火并",
        "label": "你暗中联络沮渠牧犍的弟弟沮渠安周，许诺若他刺杀其兄并献城，魏帝将封他为北凉王。你提供毒药与内应路线，促成北凉内部夺权。",
        "intent": "改成沮渠安周毒杀其兄后开城投降，但城中北凉贵族因政变而分裂，部分人秘密反抗",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "密会沮渠安周并提供毒药与内应路线，策划刺杀沮渠牧犍",
          "target": "沮渠安周",
          "deadline": "攻城器械就位前"
        },
        "instantEcho": {
          "directResult": "沮渠安周毒杀其兄后开城投降，但城中北凉贵族因政变而分裂，部分人秘密反抗。",
          "unexpectedCost": "你的密谋被一名侍卫揭露，北魏高层质疑你的忠诚，将你调离主簿职位。",
          "beneficiary": "沮渠安周获得北凉王位（虚封）。",
          "payer": "你失去信任与职位。"
        }
      }
    ]
  },
  "xiaowen-luoyang-494": {
    "trajectory": {
      "historicalPath": "孝文帝以南征为名，率文武百官及鲜卑贵族离开平城，抵达洛阳市郊，正式公布迁都诏书。",
      "preservedResult": "北魏孝文帝迁都洛阳并推进汉化改革，深刻改变北方政治文化。",
      "decisiveFork": "行宫内，在午时前当众宣读迁都洛阳并推行汉化礼制的诏书，以公开命令形式迫使贵族接受迁都事实。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "当众宣读迁都诏书",
        "label": "你站在行宫台阶上，面对集结的鲜卑贵族，展开加盖玉玺的诏书，高声宣读‘迁都洛阳，改易汉俗’的全部条款。",
        "intent": "完成孝文帝亲授的诏书宣读，推动迁都决策进入公开命令阶段。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "当众宣读迁都洛阳并推行汉化礼制的诏书",
          "target": "庭前集结的鲜卑贵族全体",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "鲜卑贵族被迫听取诏书，迁都令公开，部分贵族愤然但未当场抗命。",
          "unexpectedCost": "你被宗室元老当面斥责为‘背祖弃宗’，未来数月可能遭到敌对。",
          "beneficiary": "孝文帝拓跋宏",
          "payer": "你（中书舍人）"
        }
      },
      {
        "id": "B",
        "displayLabel": "焚毁驻守平城密令",
        "label": "你乘乱将尚书省拟定的‘率精兵驻守平城、拒不发兵南征’的密令投入火盆烧毁，并高声宣布：‘陛下有旨，全军即刻南征！’",
        "intent": "阻断保守派以驻守名义阻挠迁都的密令，迫使鲜卑军队随行南迁。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "烧毁驻守密令并假传圣旨宣布南征",
          "target": "尚书省密令原件及庭前将领",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "驻守命令失效，军队整装南行，保守派领袖元澄暴怒但无法收回成命。",
          "unexpectedCost": "你因假传圣旨被保守派记恨，事后可能被追责。",
          "beneficiary": "孝文帝（获得军队南迁既成事实）",
          "payer": "你（承担假传圣旨罪名）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "移交玉玺加盖诏书",
        "label": "你将准备好的汉化改革条例亲手呈递孝文帝，请其用传国玉玺在每一道诏书上加盖朱印，然后立即交由驿使分赴六镇。",
        "intent": "使用玉玺和驿使系统加速汉化诏令的批量颁布，确保制度性落地。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "亲手请孝文帝加盖玉玺并交驿使发出",
          "target": "孝文帝及传国玉玺、驿使系统",
          "deadline": "午后贵族再次集结前"
        },
        "instantEcho": {
          "directResult": "六镇同时收到改官制、禁胡服等汉化诏令，改革进度大幅推进。",
          "unexpectedCost": "驿使泄露，鲜卑旧部提前知悉并在当地引发小规模骚乱。",
          "beneficiary": "孝文帝改革派",
          "payer": "镇守六镇的鲜卑将领（须维稳治安）"
        }
      },
      {
        "id": "B",
        "displayLabel": "截断反对派粮草车",
        "label": "你以‘南征先锋需粮’为名，下令将原本留给留守平城贵族的粮草车队转道送往洛阳前线，并锁闭平城粮仓。",
        "intent": "剥夺反对派借粮草拖延南迁的物质基础，迫使他们随军南下。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令转拨留守粮草并锁闭粮仓",
          "target": "平城粮仓、粮草车队及留守贵族",
          "deadline": "午后留守会议召开前"
        },
        "instantEcho": {
          "directResult": "留守贵族无粮可依，只得仓促加入南迁队伍；洛阳方面提前获得补给。",
          "unexpectedCost": "平城粮仓锁闭导致城中部分贫民短时缺粮，引发不满，你被指责‘苛政’。",
          "beneficiary": "孝文帝南迁集团（获得粮草和人力的双重优势）",
          "payer": "平城留守贵族及城中贫民（承担缺粮后果）"
        }
      }
    ]
  },
  "grand-canal-605": {
    "trajectory": {
      "historicalPath": "你签发通济渠首段开挖令，限定各郡于正月底前交工，并命令宇文恺即刻召集河工，确保明晨首批河工抵达后立即开工。",
      "preservedResult": "隋炀帝下令开凿通济渠，逐步形成连接南北的大运河体系。",
      "decisiveFork": "你手中的开挖令是否签发，以及命令宇文恺召集河工的具体方式与期限。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "签发通济渠开挖令",
        "label": "你在洛阳东城漕渠闸口当面将加盖工部大印的通济渠首段开挖令交给督造官宇文恺，明确要求各郡于开皇七年正月底前完成指定段落，并命令宇文恺两日内从洛阳周边征集三千河工，明晨首批抵达后即刻开工。",
        "intent": "保留炀帝下令、宇文恺督造、正月底交工的历史行动链，使大规模徭役立即启动。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "当面将开挖令交给宇文恺并口头命令其征集河工",
          "target": "督造官宇文恺及所辖闸口官吏",
          "deadline": "明天清晨首批河工抵达前"
        },
        "instantEcho": {
          "directResult": "宇文恺接过令箭，即刻命传令兵飞马各郡；闸口处已有数百民夫开始搬运工具，首段开挖在今日黄昏前启动。",
          "unexpectedCost": "河北道三郡因春旱本已缺粮，现又需出工，乡绅联名上书暂停，此事由你承担平息压力之责。",
          "beneficiary": "隋炀帝与工部尚书杨素",
          "payer": "河北道三郡百姓及你个人官声"
        }
      },
      {
        "id": "B",
        "displayLabel": "移交开挖令予内史省",
        "label": "你以工部权力有限为由，将已签发的开挖令原件及河工名册当面移交内史省侍郎裴矩，并附口信建议改征役为雇佣，由洛阳富商分段承包，同时通知宇文恺暂停征召，等候内史省新令。",
        "intent": "改变控制权：从工部独断转为内史省与商人共治，对抗炀帝与杨素的命令方向，阻止大规模征役。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "将开挖令与名册移交裴矩，并口头命令宇文恺暂停征召",
          "target": "内史省侍郎裴矩与督造官宇文恺",
          "deadline": "明天清晨首批河工抵达前"
        },
        "instantEcho": {
          "directResult": "裴矩接到文书后大笑，随即召见洛阳商会会长张季珣，当日午后即发布招标榜文；原本定于下午的征役鼓声未响，河工聚集点人数锐减三成。",
          "unexpectedCost": "杨素闻讯大怒，以你越权移交为由，上书炀帝请求贬你为河西郡丞；你将在三日内收到调令。",
          "beneficiary": "洛阳商会与免于徭役的河工家属",
          "payer": "你本人（贬官）及杨素派系的政治摩擦"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "调拨洛阳粮仓充工食",
        "label": "你以工部名义签发调拨令，命洛阳含嘉仓监令沈旷即刻开仓，拨粟米五千石作为首批河工口粮，并令漕渠闸口监工赵文将于明日卯时前搭好二十口大灶，确保河工到即开饭。",
        "intent": "保留征发河工后朝廷提供粮食的历史事实，确保徭役不被饥荒中断，让实际历史继续。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "签发调拨令并亲往含嘉仓监督装车",
          "target": "含嘉仓监令沈旷与闸口监工赵文将",
          "deadline": "今天酉时关闭仓门前"
        },
        "instantEcho": {
          "directResult": "沈旷令仓丁启锁，五十辆牛车满载粟米驶向闸口，赵文将率民夫连夜支灶，明天黎明河工可吃上首顿热粥。",
          "unexpectedCost": "含嘉仓原本备作洛阳赈灾的存粮因此少了五千石，倘若今夏黄河决堤，救灾粮将短缺三日。",
          "beneficiary": "首批抵达的数万河工",
          "payer": "今夏可能受灾的洛阳周边百姓"
        }
      },
      {
        "id": "B",
        "displayLabel": "伪造兵调令溃散河工",
        "label": "你趁夜色密嘱闸口书记官王绪伪造一份兵部调令，称突厥犯边需调河工从军，并派心腹小吏在河工聚集区散布‘逃至荥阳可免役’的消息，同时写密信通知荥阳县尉郑文表接应逃散者，安排船只渡河。",
        "intent": "改变命令方向：用兵部名义瓦解征役，使河工从洛阳逃往荥阳，彻底对抗历史正面的大规模开挖。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "向王绪口授伪造调令内容，并亲书密信交小吏送荥阳县尉",
          "target": "闸口书记官王绪、河工聚集区与荥阳县尉郑文表",
          "deadline": "明天拂晓首次点卯前"
        },
        "instantEcho": {
          "directResult": "当夜三百余河工潜逃，次日点卯时只剩不足千人；宇文恺急报杨素，杨素下令追查，你与王绪被连夜逮捕关入大理寺。",
          "unexpectedCost": "你因伪造公函被褫夺官身，流放三千里至岭南；王绪被杖毙。",
          "beneficiary": "逃往荥阳的三百余河工及其家属",
          "payer": "你本人（流放）与王绪（死亡）"
        }
      }
    ]
  },
  "tang-founded-618": {
    "trajectory": {
      "historicalPath": "作为掌管禅让册书的礼部官，在午时前必须将隋恭帝的禅让册书正式交付李渊，并协助完成登基大典，宣告唐朝建立。",
      "preservedResult": "李渊称帝建立唐朝，随后逐步统一全国。",
      "decisiveFork": "改变行动链：册书焚毁 → 李渊无法合法称帝，唐朝建立被推迟或受阻。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "呈上禅位册书",
        "label": "你在太极殿前，将隋恭帝的禅让册书双手呈递给李渊，并高声宣读册文，请求李渊即皇帝位。",
        "intent": "执行禅让程序，使李渊正式接受帝位，保留行动链：禅让册书交付 → 李渊称帝。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "呈递并宣读禅让册书",
          "target": "李渊",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "李渊接过册书，随即在太极殿登基称帝，唐朝宣告建立。",
          "unexpectedCost": "你因宣读禅位册书而被旧隋遗臣记恨，夜间府邸遭人投石警告。",
          "beneficiary": "李渊",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "焚毁禅位册书",
        "label": "你在太极殿偏殿，趁无人注意，将隋恭帝的禅让册书投入炭火盆中烧毁，并声称册书遗失，拒绝承认禅让。",
        "intent": "改变行动链：册书焚毁 → 李渊无法合法称帝，唐朝建立被推迟或受阻。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "焚毁禅让册书",
          "target": "禅让册书",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "李渊闻讯大怒，下令搜捕你，同时紧急命人重拟册书，但当天登基被迫取消。",
          "unexpectedCost": "你在逃跑中被侍卫砍伤左臂，被通缉追捕。",
          "beneficiary": "隋恭帝（暂保帝位）",
          "payer": "你"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "摔杯为号立新君",
        "label": "你在登基礼仪中，按约定摔碎手中玉杯，示意武士上前拥戴李渊登基，同时自己率先跪拜高呼万岁。",
        "intent": "使用另一器物（玉杯）执行同一真实历史轨道：武士拥立 → 李渊称帝。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "摔碎玉杯并发令拥立",
          "target": "李渊",
          "deadline": "午时整"
        },
        "instantEcho": {
          "directResult": "武士应声而动，李渊在众臣簇拥下登基，唐朝建立。",
          "unexpectedCost": "你摔杯的碎片划伤手掌，血流不止。",
          "beneficiary": "李渊",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "假传圣旨废禅让",
        "label": "你伪造一份隋恭帝的密旨，称禅让非其本意，当众宣读并宣布禅让无效，命人逮捕李渊。",
        "intent": "改变行动链：假旨宣读 → 禅让被废 → 李渊被囚，唐朝建立被逆转。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "宣读假密旨并下令逮捕李渊",
          "target": "隋恭帝的密旨、李渊",
          "deadline": "午时前一刻"
        },
        "instantEcho": {
          "directResult": "殿内大乱，李渊被侍卫当场拿下，但李渊部将随即反扑，你被乱兵砍伤，逃亡出城。",
          "unexpectedCost": "你被李渊部将追击，左腿中箭，落下了终身残疾。",
          "beneficiary": "隋恭帝（短暂恢复权威）",
          "payer": "你"
        }
      }
    ]
  },
  "tang-fall-907": {
    "trajectory": {
      "historicalPath": "朱温命掌书记将禅位诏送往洛阳，唐哀帝盖玺，百官改服，三日后受禅，后梁建立。",
      "preservedResult": "朱温迫使唐哀帝禅位，建立后梁，唐朝灭亡并进入五代十国时期。",
      "decisiveFork": "掌书记是否执行送诏传令动作，控制禅位程序启动节点。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "亲送诏书赴洛阳",
        "label": "你亲自携带禅位诏与玉玺，连夜疾驰至洛阳，将诏书呈交唐哀帝，并据朱温之命监督其盖玺，同时传令在京百官准备三日后的改服受禅仪式。",
        "intent": "循史：完成朱温迫使唐哀帝禅位的实际环节，确保禅位程序按时推进。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "亲自送诏并监督唐哀帝盖玺，传令百官改服",
          "target": "唐哀帝、洛阳朝廷百官",
          "deadline": "三日后受禅仪式"
        },
        "instantEcho": {
          "directResult": "唐哀帝在诏书盖玺，百官知悉改服指令，禅位如期进行。",
          "unexpectedCost": "你消耗体力，途中可能遭遇小股劫匪风险但未受阻。",
          "beneficiary": "朱温（获得合法禅位）",
          "payer": "唐哀帝（被迫禅位）"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣诏拖延拒传令",
        "label": "你当堂扣下禅位诏与玉玺，拒绝即刻执行，并声称需先让唐哀帝亲自宣诏以显诚意，拖延三日，同时密告李克用等藩镇准备勤王，试图改变受禅结果的权力转移。",
        "intent": "改革：改变禅位诏下达的时间线和控制权，破坏朱温顺利受禅的节点。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "扣留禅位诏与玉玺，拒绝传令，密告李克用",
          "target": "朱温、唐哀帝、李克用",
          "deadline": "三日后受禅仪式"
        },
        "instantEcho": {
          "directResult": "朱温大怒但尚未发作，李克用收到密信可能起兵，受禅仪式可能延宕或生变。",
          "unexpectedCost": "你被朱温当场拘押候审，失去自由但暂无性命之忧。",
          "beneficiary": "李克用（获得勤王机会）",
          "payer": "朱温（受禅受阻）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "派亲信送诏兼传令",
        "label": "你指派心腹书吏持诏书与玉玺疾驰洛阳，并授予其朱温手令以监督唐哀帝盖玺，同时另派两名军校分头传令百官改服，确保禅位流程按真实历史推进。",
        "intent": "循史：通过不同执行人完成同一真实历史程序。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "指派心腹书吏送诏并监督盖玺，另派军校传令",
          "target": "心腹书吏、两名军校、唐哀帝、百官",
          "deadline": "三日后受禅仪式"
        },
        "instantEcho": {
          "directResult": "诏书按时送达并盖玺，百官接令准备改服，禅位顺利推进。",
          "unexpectedCost": "心腹书吏途中遇盗，诏书轻微受损但文字可辨，你需向朱温解释用印瑕疵。",
          "beneficiary": "朱温（受禅如期）",
          "payer": "你（担责补印）"
        }
      },
      {
        "id": "B",
        "displayLabel": "暗中替换禅位诏书",
        "label": "你利用掌书记职务之便，在送往洛阳前暗中将禅位诏内容替换为‘唐帝令诸道勤王，赐朱温死’，并盖选玉玺仿印，意图直接改变朱温与唐哀帝的控制关系。",
        "intent": "改革：替换诏书内容以颠覆朱温与朝廷的权力方向。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "偷换禅位诏为勤王诛朱温诏，并盖仿制玉玺",
          "target": "禅位诏书、玉玺、唐哀帝、朱温",
          "deadline": "三日后受禅仪式"
        },
        "instantEcho": {
          "directResult": "朱温收到假诏后震怒，怀疑唐哀帝反悔，立即率兵围困洛阳，受禅仪式骤停，局面失控。",
          "unexpectedCost": "朱温彻查内奸，你因笔迹比对暴露，被朱温当场逮捕并施以酷刑，但未致死。",
          "beneficiary": "唐哀帝（禅位暂停，重获一线生机）",
          "payer": "你（被用刑囚禁）"
        }
      }
    ]
  },
  "jin-founded-1115": {
    "trajectory": {
      "historicalPath": "完颜阿骨打称帝建国，以完颜部为核心统一女真诸部，设立勃极烈制度，国号大金。",
      "preservedResult": "完颜阿骨打建立金朝，女真势力迅速崛起并最终灭辽。",
      "decisiveFork": "盟誓大典上阿骨打是否公开称帝并颁布国号，以及辽使招降书是否被拒绝。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "译书官记录称帝",
        "label": "你在盟誓大典上当众将阿骨打称帝的誓词译为汉字和契丹字，刻于木质符牌，传示诸部，正式宣告金朝建国。",
        "intent": "确保阿骨打称帝建国的历史事实按时发生，保留称帝与颁国号的关键行动链。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "当场将阿骨打称帝誓词译为汉字、契丹字，刻于木质符牌，并悬挂于盟誓高台。",
          "target": "完颜阿骨打、女真诸部首领、木质符牌",
          "deadline": "辽军讨伐使者抵达前"
        },
        "instantEcho": {
          "directResult": "阿骨打正式称帝，国号大金确立，诸部歃血盟誓，臣服金朝。",
          "unexpectedCost": "刻字时木刺扎入手指，血流不止，手伤影响后续书写。",
          "beneficiary": "完颜阿骨打",
          "payer": "译书官"
        }
      },
      {
        "id": "B",
        "displayLabel": "焚毁辽使招降书",
        "label": "当辽使在帐前宣读招降书时，你上前夺过文书，投入火盆，并高呼女真只奉金朝号令。",
        "intent": "改变辽朝招降女真的外交路径，彻底断绝和谈可能，加速女真独立。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "从辽使手中夺过招降书，投入火盆焚烧，并当众宣布女真只认金朝。",
          "target": "辽朝讨伐使者、招降文书",
          "deadline": "辽使宣读招降书结束前"
        },
        "instantEcho": {
          "directResult": "招降书被焚，辽使被逐，女真与辽和谈通道彻底关闭。",
          "unexpectedCost": "辽使随从推搡中你额头撞到木柱，流血受伤。",
          "beneficiary": "完颜阿骨打",
          "payer": "译书官、辽使"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "铜印钤盖国书",
        "label": "你使用阿骨打新赐的铜印，在写有国号、年号的国书上加盖玺印，并交付诸部首领传阅。",
        "intent": "以不同器物（铜印）完成建国程序，强化金朝合法性。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "取出铜印，蘸取朱砂，在国书上钤盖金朝玺印，并命令侍从传示诸部。",
          "target": "铜印、国书、诸部首领",
          "deadline": "辽军前锋抵达前"
        },
        "instantEcho": {
          "directResult": "国号以玺印确认，诸部信服，金朝建立仪式完成。",
          "unexpectedCost": "施印时用力过猛，铜印把手脱落砸伤脚背。",
          "beneficiary": "完颜阿骨打",
          "payer": "译书官"
        }
      },
      {
        "id": "B",
        "displayLabel": "调换辽使回程马匹",
        "label": "你暗中命令马夫将辽使回程的坐骑换成羸弱老马，并喂食泻药，延缓其回报。",
        "intent": "改变辽朝获得情报的速度，为女真备战争取时间。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "指使马夫将辽使的骏马替换为瘦马，并在草料中混入泻药。",
          "target": "辽使的马匹、马夫",
          "deadline": "辽使出发前"
        },
        "instantEcho": {
          "directResult": "辽使途中马匹病倒，回报延迟三日。",
          "unexpectedCost": "马夫被辽使卫士发现并鞭打，你被迫支付医药费。",
          "beneficiary": "完颜阿骨打",
          "payer": "译书官"
        }
      }
    ]
  },
  "yuan-name-1271": {
    "trajectory": {
      "historicalPath": "12月18日晨，忽必烈于大都大明殿御览翰林院拟定的建号诏书草案，钦定以《易经》'大哉乾元'之义定国号大元，命你作为中书省负责誊录的官员，在午时前抄录正本并加盖中书省印信，交付驿骑发往各行省。",
      "preservedResult": "忽必烈颁诏定国号为大元，蒙古政权的中原王朝制度进一步确立。",
      "decisiveFork": "在午时限前，你作为誊录官员有权决定诏书文本是否准确抄录、印信是否完整、驿骑是否按时出发，从而影响国号诏令能否按实际历史统一发布。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "誊录并密封建号诏书",
        "label": "你在午时前将忽必烈钦定以“大哉乾元”为核心的建号诏书全文誊录至黄绢正本，用楷体工整书写，加盖中书省印信后，以火漆密封交付驿骑，并当面清点三匹快马，确保三路并行发往各行省。",
        "intent": "严格执行忽必烈的颁诏指令，使国号大元在午时前如期发出，保留汉法改革的关键象征。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "誊录诏书全文，加盖印信，密封后交付驿骑，清点快马三匹，确保依期限出发。",
          "target": "忽必烈的建号诏书正本、中书省印信、驿骑三路",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "驿骑准时出发，各行省在十日内接诏，改称大元，actualHistory 按时发生。",
          "unexpectedCost": "你因持续伏案书写，左眼暂时性充血，视线模糊，此后三天无法正常视物。",
          "beneficiary": "忽必烈及汉法派官员，如刘秉忠、许衡",
          "payer": "你个人的眼疲劳与健康代价"
        }
      },
      {
        "id": "B",
        "displayLabel": "改诏国号为大蒙古",
        "label": "你在午时前用裁纸刀小心刮去诏书正本中'大元'二字，以浑墨水改写为'大蒙古'，并在砚台底部刻下'长生天'记号，随后将诏书密封交付驿骑，同时遣心腹小吏将原稿碎片扔进许衡府邸后院，诱其查证。",
        "intent": "直接改变国号名称，颠覆忽必烈汉化象征，迫使汉臣与蒙古王公公开冲突，阻挠 actualHistory。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "刮改诏书关键文字，改写为“大蒙古”，并故意将修改痕迹和原稿碎片引向许衡。",
          "target": "忽必烈诏书正本、中书省印信、驿骑、许衡",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "驿骑发出改版诏书，许衡发现碎片后向忽必烈告发，忽必烈大怒追回诏书，但已有两路驿骑脱离控制，导致部分行省先宣布'大蒙古'，京兆等地出现混乱。",
          "unexpectedCost": "你被同僚王磐当场指认砚台记号，遭下狱审讯，虽未处死，但被黜为吏员，流放真定。",
          "beneficiary": "反对汉制的蒙古贵族，如阿合马、安童（暂获话语权）",
          "payer": "你本人及许衡一系汉臣的仕途风险"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "当众宣读并交替驿骑",
        "label": "你在午时前于大明殿百官面前，从袖中取出忽必烈御笔亲批的诏书原件，高声宣读'大哉乾元……国号曰大元'，随后亲自将诏书交予两名驿骑，令其分南北两路疾驰，并命殿前卫士拉满弓弦以示加急。",
        "intent": "以公开宣读和军事威慑强化颁诏仪式，确保国号大元无人质疑地按时发出。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "在朝会上宣读诏书原件，然后亲手交给驿骑，并命卫士施压保证出发速度。",
          "target": "忽必烈御笔诏书原件、百官、驿骑、殿前卫士",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "诏书被当众确认，百官无异，两路驿骑在午时正出发，actionsHistory 完全保留。",
          "unexpectedCost": "因宣读细节，你被蒙古怯薛长质疑僭越礼仪，虽未受罚，但此后在中书省遭冷遇。",
          "beneficiary": "汉法派官员及忽必烈",
          "payer": "你个人的人际关系和晋升机会"
        }
      },
      {
        "id": "B",
        "displayLabel": "换诏为国号大朝并改期",
        "label": "你在午时前利用掌管文档柜的便利，将忽必烈批阅的诏书原件藏入自己袍内，另取一卷空白黄绢，模仿笔迹写下'大朝'二字，并加盖私刻的假印，随后将两份诏书混合，声称原件被茶水污损，要求延至次日重拟。",
        "intent": "彻底替换国号内容，并迫使颁诏推迟，破坏 actualHistory 中的时间和名称双重关键要素。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "藏匿真诏书，制作假诏书改国号为大朝，并以污损为由要求延期，引发审查。",
          "target": "忽必烈诏书原件、空白黄绢、假印、中书省档案柜",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "假诏书被识破，忽必烈震怒下令彻查，你被捕入诏狱，但真诏书被搜出后仍于当日傍晚发出，actualHistory 只是延迟半日。",
          "unexpectedCost": "你遭廷杖三十，左臂骨折，被罢官流放辽阳，永不叙用。",
          "beneficiary": "太后察必及蒙古保守势力（借机质疑汉法）",
          "payer": "你以及替你私刻印章的那个匠人"
        }
      }
    ]
  },
  "ming-founded-1368": {
    "trajectory": {
      "historicalPath": "祭天坛上，我向朱元璋跪呈玉玺和诏书匣，由他亲手取出洪武登基诏并交宦官宣读。",
      "preservedResult": "朱元璋在南京称帝建立明朝，同年明军攻入元大都。",
      "decisiveFork": "宣读的诏书中是否包含即刻北伐的元大都攻取令"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "跪呈诏书匣并请开启宣读",
        "label": "我在登基钟鼓响起前，跪于朱元璋案前，双手举起紫檀诏书匣，朗声奏请：'陛下，请启匣宣诏，以定天下神器。'",
        "intent": "保留actionSpec：呈上玉玺与诏书匣，让朱元璋亲手取出并宣读，确保洪武登基即刻实现。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "跪呈玉玺与诏书匣，请朱元璋亲手取出并宣读",
          "target": "朱元璋、玉玺、紫檀诏书匣",
          "deadline": "登基钟鼓即将响起的一刻"
        },
        "instantEcho": {
          "directResult": "朱元璋取出洪武登基诏，交给宦官当众宣读，大明建国宣告天下。",
          "unexpectedCost": "我在举匣时袖角拂落祭桌上的香炉，金炉灰撒于我朝服之上。",
          "beneficiary": "朱元璋获得天下法统",
          "payer": "我因衣冠不整须事后领罚"
        }
      },
      {
        "id": "B",
        "displayLabel": "挟持宦官夺诏自拟宣读",
        "label": "我侧步闪至传旨宦官身后，以袖中短刃抵其后腰，低喝：'诏书有误，换我拟旨。'旋即从匣内抽空白黄绫提笔疾书。",
        "intent": "改动actionSpec：从呈匣变为劫持控制宣读环节，改变诏书内容以篡改北伐命令。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "挟持宦官并夺取宣读权，自拟另一份诏书",
          "target": "传旨宦官、空白黄绫、朱元璋御案",
          "deadline": "登基钟鼓即将响起的一刻"
        },
        "instantEcho": {
          "directResult": "我高声宣读自拟诏书，其中省略了北伐元大都的即时命令，改为'待时北定'。朱元璋面色骤变。",
          "unexpectedCost": "锦衣卫当场将我按住，诏书被撕毁。",
          "beneficiary": "元大都获得喘息",
          "payer": "我被锦衣卫押下，刑部议罪"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "击磬三响示意宣诏",
        "label": "我走向祭坛东侧巨大编钟，取木槌连击三下，以古礼信号告知百官静候；随即退至御前，低声示意宦官：'磬音过，可宣册文。'",
        "intent": "保留actionSpec：用磬音唤醒百官庄重，确保宦官按礼准时宣读洪武诏书。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "击磬三响以礼制推动宣诏仪式",
          "target": "编钟、朱元璋、传旨宦官",
          "deadline": "登基钟鼓即将响起的一刻"
        },
        "instantEcho": {
          "directResult": "百官肃静，宦官展开洪武诏书高声宣读，南京城钟鼓齐鸣。",
          "unexpectedCost": "我因未持香烛入列，被御史台记为失仪。",
          "beneficiary": "朱元璋登基典礼圆满",
          "payer": "我日后考绩受损"
        }
      },
      {
        "id": "B",
        "displayLabel": "摔碎玉玺阻宣北伐诏",
        "label": "我佯装跪呈时失手，将传国玉玺摔在祭坛石阶上，一角崩缺。众人惊愕间，我高呼：'玉缺则神怒，请缓北伐册文，择日再祭！'",
        "intent": "改动actionSpec：从呈玺变为摔玉，用‘天意’阻挠北伐命令的宣读。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "摔碎玉玺并借故阻止北伐册文宣读",
          "target": "传国玉玺、朱元璋、祭坛",
          "deadline": "登基钟鼓即将响起的一刻"
        },
        "instantEcho": {
          "directResult": "百官哗然，朱元璋令暂收北伐诏书，改宣称帝告天册文。北伐推迟。",
          "unexpectedCost": "我被押入诏狱，玉玺送往匠人处修改。",
          "beneficiary": "元大都暂免立即攻伐",
          "payer": "我作为直接责任人下狱待审"
        }
      }
    ]
  },
  "beijing-capital-1421": {
    "trajectory": {
      "historicalPath": "保留明成祖迁都北京的真实行动链，通过正式宣读诏书使迁都成为法定事实。",
      "preservedResult": "明成祖正式迁都北京，南京仍保留陪都地位。",
      "decisiveFork": "改变宣读诏书这一关键行动，使迁都不被正式宣布，导致改朝格局变化。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "宣读迁都北京诏",
        "label": "你在辰时百官入殿前，登上奉天殿丹陛，展开黄绫诏书，高声宣读‘以北京为京师’的迁都诏令。",
        "intent": "保留明成祖迁都北京的真实行动链，通过正式宣读诏书使迁都成为法定事实。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "宣读迁都诏书",
          "target": "奉天殿丹陛及入殿百官",
          "deadline": "辰时百官进入奉天殿前"
        },
        "instantEcho": {
          "directResult": "百官在奉天殿内听到诏书，北京正式成为明朝京师，南京保留陪都地位。",
          "unexpectedCost": "你因宣读诏书后紧张，在丹陛上轻微失声，被同僚注意到。",
          "beneficiary": "明成祖朱棣",
          "payer": "你本人"
        }
      },
      {
        "id": "B",
        "displayLabel": "押后诏书不宣读",
        "label": "你在辰时百官入殿前，将迁都诏书藏于袖中，借口‘时辰未到’推迟宣读，并暗示礼部尚书暂缓仪式。",
        "intent": "改变宣读诏书这一关键行动，使迁都不被正式宣布，导致改朝格局变化。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "藏匿诏书并推迟宣读",
          "target": "迁都诏书与礼部尚书",
          "deadline": "辰时百官进入奉天殿前"
        },
        "instantEcho": {
          "directResult": "百官入殿后未听到迁都诏，北京城仍被视为行在，南京继续行使京师职能。",
          "unexpectedCost": "你被锦衣卫当场查问，因‘延误公务’被押入诏狱审问。",
          "beneficiary": "反对迁都的朝臣（如杨荣）",
          "payer": "你本人"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "请礼部尚书宣读诏",
        "label": "你在辰时前将黄绫诏书亲手交给礼部尚书吕震，请他代替你宣读，确保诏令按时生效。",
        "intent": "使用另一人物执行同一真实历史轨道，保留迁都结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "委托礼部尚书宣读诏书",
          "target": "礼部尚书吕震",
          "deadline": "辰时百官进入奉天殿前"
        },
        "instantEcho": {
          "directResult": "吕震在辰时宣读迁都诏，北京正式成为京师，南京保留陪都。",
          "unexpectedCost": "你因私自转交诏书被记过，但无实质处罚。",
          "beneficiary": "明成祖朱棣",
          "payer": "你本人（轻微官声损失）"
        }
      },
      {
        "id": "B",
        "displayLabel": "调金吾卫阻百官入殿",
        "label": "你在辰时前以‘城防演练’为由，命金吾卫将领王贵关闭奉天门，阻止百官按时入殿。",
        "intent": "使用另一杠杆（调动驻军）改变真实历史结果，使迁都诏无法按时宣读。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "调金吾卫关闭奉天门",
          "target": "金吾卫将领王贵",
          "deadline": "辰时百官进入奉天殿前"
        },
        "instantEcho": {
          "directResult": "百官被阻门外，迁都仪式无法进行，北京暂失京师名分。",
          "unexpectedCost": "你被锦衣卫以‘矫诏调兵’罪逮捕，流放三千里。",
          "beneficiary": "反对迁都的朝臣（如夏原吉）",
          "payer": "你本人（流放）"
        }
      }
    ]
  },
  "longqing-trade-1567": {
    "trajectory": {
      "historicalPath": "你作为海防同知，在1567年福建月港涨潮前，为商船船主陈振龙签发首批出海文引，命令闸吏开闸放行，使第一批商船准时离港",
      "preservedResult": "明廷开放月港民间海外贸易，白银与海上商品流通随之扩大。",
      "decisiveFork": "是否在涨潮前签发合法文引并命令开闸"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "签发文引开闸放行",
        "label": "你在涨潮前用海防同知关防给船主陈振龙签发首张月港出海文引，并命令闸吏陈狗立即开闸放船出港",
        "intent": "让陈振龙船队准时出海，直接实现月港开放，推动白银流通",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "签发文引并命令开闸",
          "target": "船主陈振龙、闸吏陈狗、月港水闸",
          "deadline": "涨潮后一刻前"
        },
        "instantEcho": {
          "directResult": "陈振龙船队出海，月港贸易启动，实际历史发生",
          "unexpectedCost": "你被海禁派御史李植记恨，后续可能被弹劾",
          "beneficiary": "陈振龙及沿海商民",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣船封闸羁押船主",
        "label": "你在涨潮前下令闸吏陈狗关闭水闸、不得放行，指挥巡检张海扣押陈振龙船队，并将陈振龙收监候审",
        "intent": "阻止合法出海，延续海禁，改变白银流通结果",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令扣船封闸并收监",
          "target": "陈振龙船队、月港水闸、陈振龙本人、巡检张海",
          "deadline": "涨潮前"
        },
        "instantEcho": {
          "directResult": "陈振龙被捕，船队不能出海，月港开关失败",
          "unexpectedCost": "商民哗变，福建巡抚许孚远急令制止，你面临渎职审判",
          "beneficiary": "海禁派官员李植",
          "payer": "你"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "用船捐票据代文引",
        "label": "你在涨潮前利用手中空白船捐票据，当场填写陈振龙船队应缴船捐额，盖上海防同知印，作为临时出海凭证，并命令闸吏陈狗凭票放行",
        "intent": "通过船捐票据变通实现合法出海，确保实际历史结果",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "签发船捐票据并命令放行",
          "target": "陈振龙船队、闸吏陈狗、船捐票据",
          "deadline": "涨潮后一刻前"
        },
        "instantEcho": {
          "directResult": "陈振龙船队凭票据出海，月港贸易启动，实际历史发生",
          "unexpectedCost": "船捐票据被李植参奏为擅改制度，你被罚俸一年",
          "beneficiary": "陈振龙及沿海商民",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "勒令船主改走私港",
        "label": "你在涨潮前命令闸吏陈狗不开闸，转而指引陈振龙船队改走附近私港浯屿，由你安排向导连夜出海",
        "intent": "改变出海地点和合法性，使月港开关落空，但允许走私贸易",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令改走私港并安排向导",
          "target": "陈振龙船队、闸吏陈狗、私港浯屿",
          "deadline": "涨潮后一刻前"
        },
        "instantEcho": {
          "directResult": "陈振龙船队改从浯屿出海，月港未开放，但走私贸易增加",
          "unexpectedCost": "福建巡抚许孚远查知后以通倭罪名追捕你，你被迫逃亡",
          "beneficiary": "走私商贩",
          "payer": "你"
        }
      }
    ]
  },
  "tiangong-kaiwu-1637": {
    "trajectory": {
      "historicalPath": "宋应星委托刻书匠校勘工艺图，刻书匠修正冶铁水排图木版后交付印刷，两个时辰后首批书页装订完成。",
      "preservedResult": "宋应星刊行《天工开物》，系统记录农业与手工业生产技术。",
      "decisiveFork": "冶铁水排图木版在装订前是否被修正及修正方式"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "修正水排图刻版",
        "label": "你作为校勘工艺图的刻书匠，在首批书页装订前的两个时辰内，用刻刀修正冶铁水排图木版上鼓风箱连杆与活塞的连接线，然后将修正版交还给雕版师傅付印。",
        "intent": "保留实际历史中《天工开物》插图准确性的关键行动链，让刻版修正动作按时完成。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "用刻刀修正冶铁水排图木版上鼓风箱连杆与活塞的连接线",
          "target": "冶铁水排图木版",
          "deadline": "两个时辰内"
        },
        "instantEcho": {
          "directResult": "修正后的木版重新进入印刷流程，首批书页按原计划装订。",
          "unexpectedCost": "你右手食指被刻刀划伤，流血但可继续工作。",
          "beneficiary": "宋应星，其著作插图得以准确传播。",
          "payer": "你，皮肉之伤"
        }
      },
      {
        "id": "B",
        "displayLabel": "换用私刻水排版",
        "label": "你以校勘匠身份命令学徒将冶铁水排图木版从印刷架上取下，换上你私下雕刻的传动结构不同的新图版，然后让印工在首批书页中使用新图版。",
        "intent": "改变《天工开物》中冶铁水排图的传动原理，使实际刊印插图与宋应星原设计不同。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令学徒换上你私刻的图版",
          "target": "学徒和雕版师傅",
          "deadline": "两个时辰内"
        },
        "instantEcho": {
          "directResult": "首批书页装订时使用了你替换的水排图，宋应星巡坊时发现图误，当场要求撕毁已装订的五十本书。",
          "unexpectedCost": "你被宋应星查出更换图版，被逐出刻坊并扣发全年工钱。",
          "beneficiary": "宋应星，维护了插图的准确性。",
          "payer": "你，失业并损失工钱，但未被处死"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "调铸新墨保印刷",
        "label": "你作为刻书匠，在装订前两个时辰内，见印墨即将用尽，便命令印工使用你连夜调制的松烟墨（含桐油）代替原有墨料印刷水排图页。",
        "intent": "保留实际历史中书籍按时刊行的结果，但通过改变墨料成分直接促成印刷完成。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令印工使用新调制的松烟墨代替原有墨料",
          "target": "印工",
          "deadline": "两个时辰内"
        },
        "instantEcho": {
          "directResult": "水排图页墨色浓郁，按时交付装订，宋应星对印刷质量满意。",
          "unexpectedCost": "新墨因桐油比例略高，书页干燥后略卷边。",
          "beneficiary": "宋应星，《天工开物》得以顺利刊行。",
          "payer": "你，因擅自更换墨料被书坊主训斥，但未受重罚"
        }
      },
      {
        "id": "B",
        "displayLabel": "砸碎原版换私刻",
        "label": "你趁雕版师傅午休时，用铁锤砸碎冶铁水排图木版，然后对书坊主说木版已朽烂无法修复，必须改用你早先私刻的不同构图的新版重新开印。",
        "intent": "改变真实历史中水排图原版的使用，迫使书坊采用你私刻的替代图版。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "用铁锤砸碎冶铁水排图木版",
          "target": "冶铁水排图木版",
          "deadline": "两个时辰内"
        },
        "instantEcho": {
          "directResult": "原版被毁，书坊主接受你的新版，首批书页需延后一日装订，但最终刊印的水排图采用了你的设计。",
          "unexpectedCost": "书坊主怀疑你故意破坏，将你告到县衙，你被拘留三日并罚银。",
          "beneficiary": "你，你的版本取代了宋应星的设计。",
          "payer": "你，被拘留三日并损失罚银，但未失去行动能力"
        }
      }
    ]
  },
  "nerchinsk-1689": {
    "trajectory": {
      "historicalPath": "实际执行核对和签押动作链，确保索额图在deadline前完成签押，让actualHistory中清俄签订条约的结果按时发生。",
      "preservedResult": "清俄签订尼布楚条约，以拉丁文等文本确定边界并建立交涉框架。",
      "decisiveFork": "改变核对动作链，拒绝确认文本正确，阻止索额图在deadline前签押，使条约无法按时签订。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "亲笔签押拉丁文本",
        "label": "你在日落前当着俄方使节的面，从索额图案上拿起鹅毛笔，在拉丁文本末尾空白处签上自己的名字和日期，然后双手将文本呈给索额图，请他加盖钦差关防。",
        "intent": "实际执行核对和签押动作链，确保索额图在deadline前完成签押，让actualHistory中清俄签订条约的结果按时发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "拿起鹅毛笔在拉丁文本末尾签名并呈给索额图",
          "target": "索额图",
          "deadline": "日落前"
        },
        "instantEcho": {
          "directResult": "索额图接过文本，扫视后取出钦差关防，在拉丁文本上郑重盖印。俄方使节确认后，双方互致贺意，条约正式签订。",
          "unexpectedCost": "你因抢在索额图之前签名，虽未受责，但被索额图随从记下，事后被训诫“僭越”。",
          "beneficiary": "索额图，因完成使命获嘉奖。",
          "payer": "你，因僭越而被训诫。"
        }
      },
      {
        "id": "B",
        "displayLabel": "指认误译拒绝签押",
        "label": "你在俄方撤回最终文本前一刻，突然指着拉丁文本中一处条款大声说：“此处‘excludere’意为‘驱逐’而非‘失去’，若按此译，清朝将承担驱逐所有越界居民的义务而非放弃主权。”你随即拒绝确认文本，并请求索额图中止签押。",
        "intent": "改变核对动作链，拒绝确认文本正确，阻止索额图在deadline前签押，使条约无法按时签订。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "公开指认拉丁文本关键误译并拒绝确认",
          "target": "拉丁文本中的‘excludere’条款",
          "deadline": "日落前"
        },
        "instantEcho": {
          "directResult": "俄方译员争辩说‘excludere’意为‘放弃’，但索额图犹豫，暂停签押。日落后俄方收回文本，表示需报莫斯科，谈判陷入僵局。",
          "unexpectedCost": "你被俄方指控故意破坏和谈，索额图命侍卫将你押至偏帐看管，等候问罪。",
          "beneficiary": "尚未出场的萨布素将军，获得时间向朝廷奏报重新审视边情。",
          "payer": "你，因指认误译而被拘押，面临审讯风险。"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "缮写满文副本助签押",
        "label": "你在日落前将拉丁文本的关键条款用满文缮写一份，递给索额图的随从笔帖式，说：“请将此满文译本与拉丁文对照，确认无误后即可请大人盖印。”笔帖式将满文译本呈给索额图，索额图对照后确认无误，随即在条约上签押。",
        "intent": "使用另一杠杆（提供满文译本）执行同一真实历史轨道，确保条约按时签订。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "缮写满文文本并递给索额图的随从笔帖式",
          "target": "索额图的随从笔帖式",
          "deadline": "日落前"
        },
        "instantEcho": {
          "directResult": "索额图对照满文译本后确认无误，随即在条约上签押。俄方使节也收下满文副本，双方完成条约签订。",
          "unexpectedCost": "你因临时缮写满文字迹略草，被笔帖式嘀咕，但未影响大局。",
          "beneficiary": "索额图，因条约顺利签订而巩固地位。",
          "payer": "该笔帖式，因嘀咕被主管训诫。"
        }
      },
      {
        "id": "B",
        "displayLabel": "借烛火拖延至日落后",
        "label": "你在日落前借口拉丁文本中有一处字母模糊，需借烛火细辨，故意将文本移至帐角烛台下核对，直到日落一刻钟后才将文本交还俄方。俄方使节以“日内无法完成签押”为由，收回文本，宣布谈判延期。",
        "intent": "使用另一杠杆（拖延时间）改变真实历史结果，使条约不能在当天签订。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "以字体模糊为由拖延核对至日落后",
          "target": "拉丁文本",
          "deadline": "日落前"
        },
        "instantEcho": {
          "directResult": "俄方使节在日落时收回文本，拒绝在次日之前重开谈判。索额图大怒，但已无法挽回。尼布楚条约未能按计划在1689年9月7日签订。",
          "unexpectedCost": "你被索额图当场喝令拿下，以“延误国事”罪名囚禁于营帐中，次日将被押送往京城交理藩院议罪。",
          "beneficiary": "主战派将领，获得重新推动军事行动的机会。",
          "payer": "你，因故意拖延而被囚禁，面临重罚。"
        }
      }
    ]
  },
  "hundred-days-1898": {
    "trajectory": {
      "historicalPath": "军机章京将诏书交礼部堂官，由礼部发各省督抚；本幕中章京可直接交兵部驿传或扣留。",
      "preservedResult": "光绪帝颁布明定国是诏启动变法，百日后慈禧太后发动政变终止改革。",
      "decisiveFork": "午时前诏书是否发出；若发出则循史，若扣留则改变结果。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "径交兵部驿传",
        "label": "你在光绪帝朱批后，不等礼部堂官到场，自行加盖军机处印信，直接交兵部加急驿传发往各省督抚，确保午时前上谕发出。",
        "intent": "保留actualHistory中变法上谕发出的行动链，以章京身份直接执行传递。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "直接交兵部驿发明定国是诏",
          "target": "明定国是诏和兵部",
          "deadline": "1898年6月11日午时"
        },
        "instantEcho": {
          "directResult": "各省督抚在午前接到明定国是诏，变法正式开始。",
          "unexpectedCost": "礼部堂官以越权为由弹劾你，但军机大臣翁同龢保你，仅罚俸三月。",
          "beneficiary": "光绪帝、康有为等维新派",
          "payer": "礼部保守派官员"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣诏通报荣禄",
        "label": "你在午时前扣留明定国是诏于军机处，并即刻派亲信太监通报慈禧太后与荣禄，声称光绪帝病重、康有为谋乱，请太后即刻训政。",
        "intent": "改变actualHistory中变法启动，由保守派掌控军机处阻止上谕发出。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "扣留诏书并通报荣禄与慈禧",
          "target": "明定国是诏、慈禧太后、荣禄",
          "deadline": "1898年6月11日午时"
        },
        "instantEcho": {
          "directResult": "明定国是诏未发，慈禧与荣禄立即部署政变，于当日午后宣布训政并围捕康有为。",
          "unexpectedCost": "光绪帝闻讯震怒，下令将你押送刑部，但荣禄派兵半路截下你至天津保护。",
          "beneficiary": "慈禧太后、荣禄等保守派",
          "payer": "光绪帝、维新派"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "用总理衙门催发",
        "label": "你在明定国是诏正常发出后，假传军机大臣旨意，命令总理衙门即刻誊写并加速分发后续变法上谕（如《定国是诏》附片），但仍确保明定国是诏最终如期生效。",
        "intent": "使用总理衙门这一不同机构加速变法文件传递，保留历史轨道。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "假传旨意命令总理衙门加速誊发上谕",
          "target": "总理衙门大臣张荫桓等",
          "deadline": "1898年6月11日午时后"
        },
        "instantEcho": {
          "directResult": "总理衙门迅速发出多份变法上谕，光绪帝改革声势更盛。",
          "unexpectedCost": "你假传旨意被同僚王文韶告发，但翁同龢以军机处机密为由为你开脱。",
          "beneficiary": "光绪帝、康有为",
          "payer": "军机处内部告发者王文韶"
        }
      },
      {
        "id": "B",
        "displayLabel": "密造伪诏激化政变",
        "label": "你伪造一份措辞更激进的明定国是诏（内含罢黜荣禄、裁撤六部等语），并于午时前派人设法让慈禧太后先睹，促使她提前发动政变废除光绪帝。",
        "intent": "通过伪造诏书改变实际历史中政变时间点，由保守派提前夺权。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "伪造并泄露激进版明定国是诏给慈禧",
          "target": "慈禧太后、明定国是诏原本",
          "deadline": "1898年6月11日午时"
        },
        "instantEcho": {
          "directResult": "慈禧太后看到伪诏后大怒，立即下令逮捕康有为并于当日下午宣布训政，囚禁光绪帝。",
          "unexpectedCost": "伪造行为败露，你被判处斩监候，但慈禧念你告密之功，改为流放新疆。",
          "beneficiary": "慈禧太后、荣禄",
          "payer": "光绪帝、维新派"
        }
      }
    ]
  },
  "wuchang-1911": {
    "trajectory": {
      "historicalPath": "你在清军巡防队封锁营门前，下令打开楚望台军械库，向起义士兵分发枪支弹药，并带头向湖广总督署发起进攻。",
      "preservedResult": "湖北新军发动武昌起义，各省相继响应，清朝统治迅速瓦解。",
      "decisiveFork": "是否打开军械库武装起义士兵并进攻湖广总督署"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "下令开库武装起义",
        "label": "你在清军巡防队封锁营门之前，对守库老兵李鸣山下令：'打开库门，武装兄弟，随我攻打总督署！'并亲手递给步枪。",
        "intent": "保留历史中打开军械库武装起义并进攻总督署的行动链。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令打开军械库，分发枪支弹药，并带头进攻湖广总督署",
          "target": "守库老兵李鸣山、起义士兵、楚望台军械库",
          "deadline": "清军巡防队将在半小时后封锁营门"
        },
        "instantEcho": {
          "directResult": "军械库门打开，士兵武装后迅速攻占总督署，起义成功。",
          "unexpectedCost": "你因指挥起义被清廷通缉，不得不流亡外地。",
          "beneficiary": "起义新军士兵",
          "payer": "你本人"
        }
      },
      {
        "id": "B",
        "displayLabel": "下令毁库阻止起义",
        "label": "你在清军巡防队封锁营门之前，对守库老兵李鸣山下令：'引爆炸药库，阻止士兵武装，以待巡防队！'并亲手点燃导火索。",
        "intent": "改成军械库爆炸，起义士兵失去武装，巡防队抵达后逮捕起义者，起义失败",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令引爆军械库并阻止武装",
          "target": "守库老兵李鸣山、楚望台军械库炸药",
          "deadline": "清军巡防队将在半小时后封锁营门"
        },
        "instantEcho": {
          "directResult": "军械库爆炸，起义士兵失去武装，巡防队抵达后逮捕起义者，起义失败。",
          "unexpectedCost": "爆炸波及邻近居民区，造成平民伤亡，你被清廷嘉奖但遭民间怨恨。",
          "beneficiary": "湖广总督瑞澂及清廷",
          "payer": "起义新军士兵及附近居民"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "下令砸锁分发弹药",
        "label": "你在清军巡防队封锁营门之前，对军械库值班长赵德胜下令：'砸开紧急弹药库，武装兄弟，随我进攻总督署！'并带头砸锁。",
        "intent": "保留历史中武装进攻的行动链，但使用不同人物和程序（砸锁而非开门）。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令砸开紧急弹药库并分发弹药",
          "target": "军械库值班长赵德胜、紧急弹药库",
          "deadline": "清军巡防队将在半小时后封锁营门"
        },
        "instantEcho": {
          "directResult": "弹药库砸开，士兵获得弹药，攻占总督署，起义成功。",
          "unexpectedCost": "你因参与起义被清廷追捕，家人受到牵连。",
          "beneficiary": "起义新军士兵",
          "payer": "你及家人"
        }
      },
      {
        "id": "B",
        "displayLabel": "下令销毁武器投降",
        "label": "你在清军巡防队封锁营门之前，对军械库值班长赵德胜下令：'砸毁全部武器，向巡防队投降保命！'并亲手砸碎第一支枪。",
        "intent": "改成武器被毁，起义士兵无法抵抗，巡防队缴械逮捕起义者，起义失败",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令砸毁武器并向巡防队投降",
          "target": "军械库值班长赵德胜、库存武器",
          "deadline": "清军巡防队将在半小时后封锁营门"
        },
        "instantEcho": {
          "directResult": "武器被毁，起义士兵无法抵抗，巡防队缴械逮捕起义者，起义失败。",
          "unexpectedCost": "你因职务行为免于重罚，但被革命党人视为叛徒，日后遭暗杀身亡。",
          "beneficiary": "湖广总督瑞澂及清廷",
          "payer": "起义新军士兵及你本人（性命）"
        }
      }
    ]
  },
  "may-fourth-1919": {
    "trajectory": {
      "historicalPath": "你作为学生联合会负责誊印宣言的干事，必须在队伍出发前用北大红楼印刷室内的油印机，印制至少500份《北京学生界宣言》传单，并交给纠察队长李国威运往天安门分发，确保学生集会按时拥有宣传材料。",
      "preservedResult": "北京学生举行示威，运动迅速扩展到工人商人并推动中国代表拒签和约。",
      "decisiveFork": "印刷机是否在今晨被校监刘仁锐锁入办公室，且钥匙在你手中；你需决定是否撬锁使用，从而控制传单能否按时到达集会现场。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "撬锁印制五百份宣言",
        "label": "你使用保管的钥匙打开校监刘仁锐办公室，取回油印机，立即在北大红楼印刷室赶印500份《北京学生界宣言》传单，并在半小时内亲手交付纠察队长李国威，嘱咐其跑步送往天安门队伍集结点。",
        "intent": "保留真实历史中宣言及时传播的行动链，使学生集会按时拥有宣传材料，推动运动按历史轨迹爆发。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "撬锁取出油印机并完成印刷交付",
          "target": "纠察队长李国威",
          "deadline": "一个时辰内"
        },
        "instantEcho": {
          "directResult": "李国威携带传单与纠察队员跑步抵达天安门，学生代表按时分发，五千余学生准时出发游行，并沿街散发传单，吸引市民注目。",
          "unexpectedCost": "你因擅闯办公室被校监记大过，手指被油墨严重污染，三日内无法洗净；但传单已按历史路径成功传播。",
          "beneficiary": "北京学生联合会（按时获得宣传物资）",
          "payer": "你（行政处分与轻微身体代价）"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣下印刷机改发加急电报",
        "label": "你握紧钥匙打开办公室，取出油印机但并未使用；反而将机器锁入废纸篓，并以学生联合会干事名义，发两封加密电报：一电致上海《民国日报》编辑邵力子请求转载宣言全文，二电致天津学生联合会联络员马千里请其同步行动；电报通过邮政局专差发出，使消息绕开北京警察封锁提前扩散至全国。",
        "intent": "改变传播控制权：从北京街头集会转向媒体远程联动，使运动影响力在24小时内波及沪津，但导致北京本地集会因缺乏纸质传单规模缩减。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "锁藏印刷机并发出加密电报",
          "target": "上海《民国日报》编辑部与天津学生联合会联络站",
          "deadline": "一个时辰内"
        },
        "instantEcho": {
          "directResult": "次日上海、天津媒体即刊登宣言摘要，全国学生响应提前48小时；但北京集会因缺乏传单到场人数不足千人，警察强行驱散致数十人被捕，运动中心临时转至上海。",
          "unexpectedCost": "你因藏匿学校设备被校方开除学籍，并在电报局被侦缉队短暂扣留，遭掌掴后释放，但需立即离京。",
          "beneficiary": "上海报馆与天津学生联合会（获得独家信息与动员先机）",
          "payer": "你（开除、拘押与流亡风险）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "动员同学手抄宣言上街",
        "label": "你见印刷机被锁且钥匙不在手，立刻召集红楼一层各教室中散坐的20名同学，每人分发纸笔，命令他们把《北京学生界宣言》全文手抄十份，半小时内收齐200份，交给文学系代表罗家伦带往天安门。",
        "intent": "以人工抄写替代印刷，保留历史传单的实体传播链条，确保学生集会按时获得宣传材料。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "组织手抄并交付宣言",
          "target": "文学系代表罗家伦",
          "deadline": "一个时辰内"
        },
        "instantEcho": {
          "directResult": "罗家伦携200份手抄宣言按时到达天安门，学生得以在街头散发，游行如期进行，但手抄版本因字迹不一，部分行人辨识困难。",
          "unexpectedCost": "你因占用教室影响上课被教务处通报批评，且手抄200份导致右手肌腱劳损，一周内无法正常握笔。",
          "beneficiary": "文学系代表罗家伦（获得宣传物资的替代方案）",
          "payer": "你（轻微身体伤害与教务处分）"
        }
      },
      {
        "id": "B",
        "displayLabel": "劫邮车直发全国传单",
        "label": "你携带预先写好的宣言底稿，冲到红楼门口拦住邮差，以学联名义强制征用其自行车与邮包，将底稿绑入邮包，命令他直接骑往京奉铁路车站，交给即将南下的火车乘务长，使其随车运往天津、上海、济南各站分发给当地学联。",
        "intent": "改变传播路径：从北京学生现场散发转为利用铁路邮政系统向全国辐射，使运动在4小时内绕过北京当局封锁扩至天津、上海。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "强制征用邮车并命令投递",
          "target": "邮差及其邮包、京奉铁路火车乘务长",
          "deadline": "一个时辰内"
        },
        "instantEcho": {
          "directResult": "次日凌晨天津站即有学生接到传单，中午上海站亦有响应，津沪提前48小时同步示威；但北京邮局因邮差告发而拒绝再为本校收发信件，北京集会现场因缺乏本地传单仅数百人参加，运动重心南移。",
          "unexpectedCost": "你因抢劫邮政车辆被邮政总局列入黑名单，且遭京师警察厅通缉，需立即逃离北京。",
          "beneficiary": "天津、上海学生联合会（获得外地动员先机）",
          "payer": "你（通缉流亡）"
        }
      }
    ]
  },
  "suez-nationalization-1956": {
    "trajectory": {
      "historicalPath": "作为总统府与运河管理方之间的行动联络官，在纳赛尔广播的几分钟内，你必须让在运河公司各关键岗位待命的埃及接管人员开始行动，以确保 actualHistory 中“埃及官员同步接管公司机构”按时发生。",
      "preservedResult": "纳赛尔在亚历山大广播宣布苏伊士运河公司立即国有化，埃及官员同步接管公司机构；英国、法国和以色列随后发动军事行动。",
      "decisiveFork": "在纳赛尔广播的同一刻，你作为联络官是否发出接管密令——若发出则实际历史发生；若不发出或改变命令，则接管延迟或演变为对抗。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "发出接管密令",
        "label": "你立即拨通加密电话，向运河公司总部、伊斯梅利亚港、塞得港和苏伊士港的四个接管小组组长发出预定密码短语“法老苏醒”，命令他们即刻接管控制室、财务档案和船舶调度系统。",
        "intent": "保留历史中“埃及官员同步接管公司机构”的行动链，由你作为联络官实际发出已准备好的命令。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "发出密码短语“法老苏醒”命令",
          "target": "四个接管小组组长",
          "deadline": "在纳赛尔广播结束前"
        },
        "instantEcho": {
          "directResult": "纳赛尔广播话音刚落，各接管小组同步控制运河公司关键设施；英法资本代表被当场告知国有化生效。",
          "unexpectedCost": "你因高频联络被英法情报人员追踪到通话记录，两天后住所遭匿名电话威胁。",
          "beneficiary": "纳赛尔总统和埃及政府",
          "payer": "你承担被盯上的风险"
        }
      },
      {
        "id": "B",
        "displayLabel": "对英法商船最后通牒",
        "label": "你直接联系正在运河航行的英国“北爱尔兰号”和法国“让·巴特号”商船，以埃及主权名义宣布国有化，命令他们立即在指定锚地停船接受领航员更换，否则承担一切后果。",
        "intent": "改变命令方向：原本接管仅针对陆上机构，你改为直接与过境船对抗，将控制权争夺提前到水上。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "发出更换领航员并停船的最后通牒",
          "target": "英国“北爱尔兰号”和法国“让·巴特号”商船",
          "deadline": "在纳赛尔广播结束后一分钟内"
        },
        "instantEcho": {
          "directResult": "两艘商船拒不服从并加速通过，英法随即宣布埃及行动非法，提前启动军事集结，运河危机比历史提早两天进入公开对抗。",
          "unexpectedCost": "你因越级联系外国船只，被总统府训诫并调离联络岗位，三天后遭秘密警察短暂拘留审问。",
          "beneficiary": "英法政府获得更早的军事干预口实",
          "payer": "你个人职业生涯受损"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "广播现场接管指令",
        "label": "你通过联络室连接到运河公司内部广播系统，以阿拉伯语重复纳赛尔的国有化宣言，并现场下达“所有埃及员工立即接管各自岗位”的口头命令。",
        "intent": "使用广播系统这一不同器物执行同一历史轨道——确保内陆接管同步发生，但方式从加密电话改为公开广播。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "通过广播系统下达口头接管命令",
          "target": "运河公司内部所有埃及员工",
          "deadline": "在纳赛尔广播结束前"
        },
        "instantEcho": {
          "directResult": "埃及员工迅速接管岗位，但广播信号被英法监听站截获，英法政府提前两小时获得国有化确凿证据。",
          "unexpectedCost": "广播室技术人员因擅自接入系统被逮捕审查，你受到内部警告。",
          "beneficiary": "埃及民众士气大振",
          "payer": "广播室技术人员和你"
        }
      },
      {
        "id": "B",
        "displayLabel": "逮捕英法籍雇员",
        "label": "你命令运河公司警卫队立刻逮捕五名涉嫌破坏的英法籍雇员，扣押在管理局大楼地下室，以此作为人质迫使英法商船停船接受换旗。",
        "intent": "改变实际历史中未立即逮捕外籍雇员的做法，将控制权争夺从设施转向人员。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令警卫队逮捕五名英法籍雇员并扣押",
          "target": "运河公司内的英法籍雇员",
          "deadline": "在纳赛尔广播后一小时内"
        },
        "instantEcho": {
          "directResult": "英法商船被迫停船交涉，但英国认定埃及违反国际法，联合法国实施海上封锁，运河冲突升级为全面危机。",
          "unexpectedCost": "你因未经批准下令逮捕外籍人员，被解除联络官职务并移交军事法庭，六周后判处五年监禁。",
          "beneficiary": "英法获得制裁埃及的合法借口",
          "payer": "你和被逮捕的英法雇员"
        }
      }
    ]
  },
  "web-public-domain-1993": {
    "trajectory": {
      "historicalPath": "你作为CERN授权主管，必须在1993年4月30日下班前，签署万维网免费开放声明，并命令秘书将声明传真至两位主任办公室，完成当日发布。",
      "preservedResult": "CERN于1993年4月30日将万维网软件置于公有领域并免费开放，推动开放网络迅速传播。",
      "decisiveFork": "你签署并发送声明，使软件成为公有领域，而非附加限制。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "签署并传真声明",
        "label": "你在1993年4月30日16:30，亲自签署万维网免费开放声明，并命令秘书在17:00前将声明传真至两位主任办公室，要求当日发布。",
        "intent": "保留伯纳斯-李的开放倡议和CERN的决策链，使软件进入公有领域。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "签署并命令秘书传真万维网免费开放声明",
          "target": "万维网免费开放声明文件及两位主任办公室",
          "deadline": "1993年4月30日17:00"
        },
        "instantEcho": {
          "directResult": "声明被传真至两位主任，主任当即批准，软件于当日成为公有领域。",
          "unexpectedCost": "你因未提前协商而受内部程序批评，但声明仍有效。",
          "beneficiary": "伯纳斯-李和全球网络用户",
          "payer": "你的行政声誉"
        }
      },
      {
        "id": "B",
        "displayLabel": "附加机构许可条款",
        "label": "你在1993年4月30日16:30，修改开放声明，要求外部机构使用前需获得CERN书面许可，并命令法务部在17:00前将此版本传真至两位主任办公室。",
        "intent": "改变结果：将公有领域改为需许可，延迟开放网络传播。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "修改开放声明并命令法务部传真修改版",
          "target": "CERN法务部及两位主任办公室",
          "deadline": "1993年4月30日17:00"
        },
        "instantEcho": {
          "directResult": "声明被修改并传真，主任签署了限制版，万维网软件未能当日免费开放。",
          "unexpectedCost": "伯纳斯-李公开抗议，CERN内部产生分歧。",
          "beneficiary": "CERN法务部和潜在收费方",
          "payer": "伯纳斯-李和早期采用者"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "公开宣读并发布",
        "label": "你在1993年4月30日16:45，召集CERN法务办公室全体人员，公开宣读开放声明，并命令IT主管在17:00前将声明上传至CERN公共服务器。",
        "intent": "使用不同程序（公开宣读+IT主管上传）实现软件进入公有领域。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "公开宣读开放声明并命令IT主管上传",
          "target": "CERN法务办公室全体人员及IT主管",
          "deadline": "1993年4月30日17:00"
        },
        "instantEcho": {
          "directResult": "声明被宣读并上传至公共服务器，软件当日免费开放。",
          "unexpectedCost": "IT主管因未事先备份数据导致短暂服务中断。",
          "beneficiary": "伯纳斯-李和全球网络用户",
          "payer": "IT主管的绩效"
        }
      },
      {
        "id": "B",
        "displayLabel": "更换主任签署顺序",
        "label": "你在1993年4月30日16:45，先向副主任提交开放声明，获得签字后，再命令秘书将签字版传真至主任办公室，要求主任在17:00前签署并发布。",
        "intent": "改变控制关系：先经副主任批准再经主任，改变正常决策顺序，导致主任因时间不足而拒绝签署。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "先求副主任签署再命令秘书传真至主任办公室，要求主任17:00前签署",
          "target": "副主任及主任办公室",
          "deadline": "1993年4月30日17:00"
        },
        "instantEcho": {
          "directResult": "副主任签署，但主任因时间不足拒绝签署，声明未能发布。",
          "unexpectedCost": "副主任因越权行为受到调查。",
          "beneficiary": "反对开放的法务部成员",
          "payer": "副主任和你的职务"
        }
      }
    ]
  },
  "marathon-490bc": {
    "trajectory": {
      "historicalPath": "米太亚得下令全线冲锋，号手吹响号角，雅典重装步兵发起冲击，击败波斯军。",
      "preservedResult": "雅典重装步兵在马拉松击败波斯军，阻止了此次入侵。",
      "decisiveFork": "在波斯骑兵离开阵地的时刻，是否吹响冲锋号令步兵发起总攻。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "吹响冲锋号角",
        "label": "你在波斯骑兵离开阵地的瞬间，吹响号角，命令雅典重装步兵全线冲锋。",
        "intent": "保留真实历史中在骑兵离阵时冲锋的行动链，确保雅典胜利。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "吹响号角",
          "target": "雅典重装步兵",
          "deadline": "波斯舰队将在一个时辰后重新调动骑兵"
        },
        "instantEcho": {
          "directResult": "雅典重装步兵全线出击，击溃波斯军左翼，波斯舰队仓皇撤退。",
          "unexpectedCost": "你的左臂在混战中被流矢射中，暂时无法持盾。",
          "beneficiary": "雅典城邦与米太亚得将军",
          "payer": "波斯远征军统帅达提斯（承担战败责任）"
        }
      },
      {
        "id": "B",
        "displayLabel": "禁止吹号待命",
        "label": "你在波斯骑兵离开阵地时，命令号手不得吹号，并让全军原地待命。",
        "intent": "改变真实历史中的冲锋时机，使波斯骑兵回援，改变战局。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "禁止号手吹号并命令全军待命",
          "target": "号手与雅典重装步兵",
          "deadline": "波斯舰队将在一个时辰后重新调动骑兵"
        },
        "instantEcho": {
          "directResult": "雅典军未按原计划冲锋，波斯骑兵在半个时辰后回援，雅典军陷入两线作战，最终惨胜。",
          "unexpectedCost": "米太亚得因你违令而暴怒，当众斥责你，你被降职为普通士兵。",
          "beneficiary": "波斯帝国（获得战术优势）",
          "payer": "雅典重装步兵（伤亡人数增加三成）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "击鼓传令冲锋",
        "label": "你在波斯骑兵离阵时，命令鼓手击打冲锋鼓点，指挥各营队长率部突击。",
        "intent": "使用另一种通信方式（鼓声）执行同一历史轨道，确保冲锋命令传达。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令鼓手击打冲锋鼓点",
          "target": "鼓手及各营队长",
          "deadline": "波斯舰队将在一个时辰后重新调动骑兵"
        },
        "instantEcho": {
          "directResult": "各营队长听见鼓声立即冲锋，雅典军大胜，波斯军溃败。",
          "unexpectedCost": "鼓手因紧张打错节拍，导致右翼冲锋稍慢，但未影响胜局。",
          "beneficiary": "雅典城邦与米太亚得将军",
          "payer": "波斯左翼指挥官（战死沙场）"
        }
      },
      {
        "id": "B",
        "displayLabel": "假传撤退信号",
        "label": "你在波斯骑兵离阵时，假传米太亚得命令，让旗手挥舞撤退旗帜，指示全军向海边后撤。",
        "intent": "改变真实历史中的进攻方向，导致雅典军失去战机。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "假传命令让旗手挥舞撤退旗",
          "target": "旗手与雅典全军",
          "deadline": "波斯舰队将在一个时辰后重新调动骑兵"
        },
        "instantEcho": {
          "directResult": "雅典军看到撤退旗向后撤，波斯骑兵回援并追击，雅典军大败，马拉松失守。",
          "unexpectedCost": "米太亚得发现被出卖，下令逮捕你，你被迫逃亡波斯阵营。",
          "beneficiary": "波斯帝国与大流士一世",
          "payer": "雅典阵亡士兵与米太亚得（战败被追责）"
        }
      }
    ]
  },
  "alexander-gaugamela-331bc": {
    "trajectory": {
      "historicalPath": "保留亚历山大利用波斯中军缺口冲击大流士战车阵的行动链，旗令官以旗语加速并引导该冲击。",
      "preservedResult": "亚历山大在高加米拉击败大流士三世，阿契美尼德帝国走向覆亡。",
      "decisiveFork": "改变行动链：不冲缺口而迂回左翼，攻击辎重，迫使大流士分兵，变相改变战场控制权。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "举旗直冲中军缺口",
        "label": "你举起近卫骑兵军旗，策马向波斯中军因战车调动出现的空隙全速冲锋，旗尖直指大流士战车方位，引导后方骑兵纵队同步切入，同时向左侧方阵发出卷击信号。",
        "intent": "保留亚历山大利用波斯中军缺口冲击大流士战车阵的行动链，旗令官以旗语加速并引导该冲击。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "举起军旗，策马冲入波斯中军缺口，旗尖指向大流士战车方位",
          "target": "波斯中军缺口、亚历山大近卫骑兵纵队、大流士三世战车",
          "deadline": "波斯镰刀战车逼近前10秒内"
        },
        "instantEcho": {
          "directResult": "近卫骑兵随旗方向成功切入缺口，三分钟内大流士三世战车被迫后退，马其顿方阵正面压力缓解。",
          "unexpectedCost": "你右臂被流矢擦伤，暂时无法持旗，但旗已传递到位。",
          "beneficiary": "亚历山大及近卫骑兵",
          "payer": "你（轻伤）"
        }
      },
      {
        "id": "B",
        "displayLabel": "挥旗引兵左转迂回",
        "label": "你反方向挥舞军旗，示意右翼骑兵向左斜插至波斯军阵侧面，放弃中央缺口，转而攻击波斯左翼后方的骆驼辎重队，同时命旗手向亚历山大传信“缺口是陷阱，左翼可破”。",
        "intent": "改变行动链：不冲缺口而迂回左翼，攻击辎重，迫使大流士分兵，变相改变战场控制权。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "反方向挥舞军旗，示意骑兵左转迂回，并传信给亚历山大",
          "target": "右翼骑兵、波斯左翼后方、骆驼辎重队、亚历山大",
          "deadline": "波斯镰刀战车逼近前15秒内"
        },
        "instantEcho": {
          "directResult": "骑兵转向左侧，成功冲击波斯辎重，引发混乱；波斯左翼部分部队回援，中央缺口暂时扩大但波斯方阵未溃散。大流士继续留在战场，战斗延长两小时。",
          "unexpectedCost": "你因擅自改变信号被副将质疑，亚历山大战后对你冷淡，暂时剥夺旗令官职务。",
          "beneficiary": "波斯左翼受袭部队的临时喘息",
          "payer": "你（失去职务与亚历山大信任）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "吹号令方阵佯退",
        "label": "你吹响号角（作为旗令官备用的号角），向中央方阵发出短促两长一短的“佯退”信号，诱导波斯军阵前移，同时保持右翼骑兵待命，待波斯阵型拉长后由亚历山大发起真实冲锋。",
        "intent": "保留亚历山大通过骑兵冲击大流士战车的过程，但改用号角信号配合，利用佯退制造更佳缺口时机。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "吹响号角发出佯退信号",
          "target": "中央方阵、波斯军阵、亚历山大",
          "deadline": "波斯镰刀战车冲击方阵前10秒内"
        },
        "instantEcho": {
          "directResult": "方阵佯退，波斯步兵前压，波斯阵型拉长，中央出现更大缺口。亚历山大率骑兵直冲大流士，大流士战车开始后撤。",
          "unexpectedCost": "佯退时左翼多个百人队因误解信号真退，失去与方阵接触，造成局部伤亡30人。",
          "beneficiary": "亚历山大与近卫骑兵",
          "payer": "左翼步兵（伤亡）"
        }
      },
      {
        "id": "B",
        "displayLabel": "斩断马缰阻挡战车",
        "label": "你抽剑斩断身边三匹备用战马的缰绳，驱赶它们冲向逼近的波斯镰刀战车群，造成战车绊倒和混乱；同时高呼“敌军战车主帅已死”，动摇波斯士气。",
        "intent": "改变战斗结果：打乱战车冲锋，使其无法有效冲击马其顿方阵，为步兵巩固阵线争取时间，削弱大流士的攻击势头。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "斩断缰绳，驱马冲击战车，并高呼假情报",
          "target": "备用战马、波斯镰刀战车群",
          "deadline": "波斯镰刀战车冲击前5秒内"
        },
        "instantEcho": {
          "directResult": "几匹战马冲入战车阵，三辆战车倾覆，后续战车被迫减速绕行，但仍有部分战车切入方阵。亚历山大未能及时利用缺口，战斗更胶着，但马其顿左翼未溃散。",
          "unexpectedCost": "你因擅自离岗和损失备用马匹被军需官记录，战后受鞭刑并降为普通骑兵。",
          "beneficiary": "马其顿左翼方阵",
          "payer": "你（受刑与降职）"
        }
      }
    ]
  },
  "caesar-rubicon-49bc": {
    "trajectory": {
      "historicalPath": "保留凯撒持旗渡河的真实行动链，确保实际历史按时发生。",
      "preservedResult": "凯撒率军渡过卢比孔河，罗马内战随即爆发。",
      "decisiveFork": "改变凯撒渡河的行动链，阻止内战爆发。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "举起鹰旗渡河",
        "label": "你在元老院使者到达前，亲自抓起军团鹰旗，下令全军立即渡河。",
        "intent": "保留凯撒持旗渡河的真实行动链，确保实际历史按时发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "举起鹰旗并下令渡河",
          "target": "第十三军团鹰旗",
          "deadline": "黎明前"
        },
        "instantEcho": {
          "directResult": "军团士兵跟随你渡过卢比孔河，罗马内战爆发。",
          "unexpectedCost": "凯撒的政敌庞培获得更多借口动员军队。",
          "beneficiary": "凯撒",
          "payer": "罗马共和国"
        }
      },
      {
        "id": "B",
        "displayLabel": "折断鹰旗拒绝渡河",
        "label": "你在元老院使者到达前，用剑折断军团鹰旗，宣布停止进军，并自行向元老院投案。",
        "intent": "改变凯撒渡河的行动链，阻止内战爆发。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "折断鹰旗并下令停止渡河",
          "target": "第十三军团鹰旗",
          "deadline": "黎明前"
        },
        "instantEcho": {
          "directResult": "军团士兵哗然，凯撒失去权威，元老院使者抵达，凯撒被逮捕。",
          "unexpectedCost": "你被指控破坏军旗被处决。",
          "beneficiary": "庞培",
          "payer": "你"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "传达渡河军令",
        "label": "你在元老院使者到达前，作为传令官向各营传达凯撒的渡河命令，确保全军行动。",
        "intent": "使用传令官身份执行渡河命令，保留真实历史结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "传达凯撒的渡河命令",
          "target": "第十三军团各营",
          "deadline": "黎明前"
        },
        "instantEcho": {
          "directResult": "全军遵令渡河，罗马内战爆发。",
          "unexpectedCost": "凯撒因你的严格传达而无法留下借口回旋。",
          "beneficiary": "凯撒",
          "payer": "军团士兵"
        }
      },
      {
        "id": "B",
        "displayLabel": "假传凯撒撤军令",
        "label": "你在元老院使者到达前，伪造凯撒命令，宣布撤回军营等待元老院谈判。",
        "intent": "改变渡河行动链，阻止内战。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "伪造并传达凯撒的撤军命令",
          "target": "第十三军团各营",
          "deadline": "黎明前"
        },
        "instantEcho": {
          "directResult": "军团撤回营地，凯撒大怒并逮捕你。庞培获得时间巩固防线。",
          "unexpectedCost": "你被凯撒以叛国罪处决。",
          "beneficiary": "庞培",
          "payer": "你"
        }
      }
    ]
  },
  "edict-milan-313": {
    "trajectory": {
      "historicalPath": "保留真实历史中双帝协同发布敕令的行动链，确保副本按时发出。",
      "preservedResult": "君士坦丁与李锡尼发布米兰敕令，基督教等信仰获得合法宽容。",
      "decisiveFork": "改变命令方向：人为造成双帝印信不全，使敕令无法当天完整发布，实际历史结果被推迟或扭曲。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "草诏双印速发各行省",
        "label": "你立刻将君士坦丁口授的宽容敕令誊录为正式副本，从御案取出黄金印匣，将君士坦丁鹰徽印与李锡尼狮徽印分别压于羊皮卷下方，命令传令官在午时前携十二份副本奔出皇宫。",
        "intent": "保留真实历史中双帝协同发布敕令的行动链，确保副本按时发出。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "誊录并加盖双印，命令传令官发出",
          "target": "君士坦丁与李锡尼的印玺及十二份敕令副本",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "传令官携敕令副本奔出皇宫，逐省传递，各宗教公开礼拜得以恢复，教产开始归还。",
          "unexpectedCost": "你因独自操作印玺而未按惯例由两位皇帝亲随监印，事后被君士坦丁内务总管训斥，罚俸半年。",
          "beneficiary": "帝国境内所有基督徒及异教徒群体",
          "payer": "你个人承担失仪责任，俸禄受损"
        }
      },
      {
        "id": "B",
        "displayLabel": "只盖一印扣押副本",
        "label": "你抄录敕令后只盖上君士坦丁的鹰徽印，将李锡尼狮徽印藏入袖中，对传令官说“李锡尼印需待皇帝本人补盖，今日暂缓发往东方行省”，将十二份副本全部锁入书房铁柜。",
        "intent": "改变命令方向：人为造成双帝印信不全，使敕令无法当天完整发布，实际历史结果被推迟或扭曲。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "藏起李锡尼印，扣押全部副本",
          "target": "李锡尼狮徽印及十二份敕令副本",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "午时无敕令发出，行省总督未接到宽容法令，基督徒继续受迫害；李锡尼听闻后疑心君士坦丁独断，两人信任出现裂痕。",
          "unexpectedCost": "君士坦丁内务总管发现你扣押文件，当场将你逮捕，你因僭越被投入皇宫地牢。",
          "beneficiary": "仍希望压制基督教的罗马元老院保守派",
          "payer": "你个人承担监禁代价，且帝国东西部宗教政策出现分裂风险"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "启金匣亲盖双帝玺",
        "label": "你从君士坦丁腰间解下鹰徽金印，又从随侍的李锡尼亲信手中接过狮徽银印，亲手将两印同时压入融化的紫漆中，命令十二名传令官各持一份副本立即上马出发，要求每省总督在收到后一天内宣读。",
        "intent": "使用不同来源的印玺（直接向皇帝本人索取）执行同一真实历史轨道。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "向两位皇帝亲取印玺并盖印发出",
          "target": "君士坦丁的鹰徽金印、李锡尼的狮徽银印及十二名传令官",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "敕令按时发出，全帝国宗教宽容的法律当天生效。",
          "unexpectedCost": "你的越级举动引起宫廷文书长不满，他被冷落而怀恨在心，开始暗中搜集你的把柄。",
          "beneficiary": "基督教团体及帝国司法体系",
          "payer": "你个人承受文书长的敌意"
        }
      },
      {
        "id": "B",
        "displayLabel": "换诏书只允基督法",
        "label": "你从夹层中取出另一份早已拟好的诏书，其内容仅承认基督教为合法宗教、禁止其他教派公开活动，趁君士坦丁与李锡尼谈话间隙以迅雷不及掩耳之势换上此卷，压上双印，令传令官即刻发出。",
        "intent": "改变关键结果：使宽容令变为排他性基督教特许令，偏离米兰敕令的普适宽容原则。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "偷换诏书内容并加盖双印发出",
          "target": "预制的排他性基督教诏书及君士坦丁、李锡尼印玺",
          "deadline": "午时前"
        },
        "instantEcho": {
          "directResult": "传令官发出诏书后，帝国各地开始禁止异教祈祷，异教徒财产被强制移交教会，引发多地骚乱；君士坦丁与李锡尼得知内容后震怒，双方相互指责伪造文书。",
          "unexpectedCost": "传令官出发后你被发现手上有墨迹与夹层羊皮残余，当场被禁军制服，以叛国罪押入大牢。",
          "beneficiary": "基督教教会领袖立即获得全面优势",
          "payer": "你个人面临死刑审判，且帝国宗教统一进程被暴力路线替代"
        }
      }
    ]
  },
  "charlemagne-800": {
    "trajectory": {
      "historicalPath": "教皇利奥三世在弥撒高潮时从执事手中接过皇冠，为跪在祭坛前的查理曼加冕，全场欢呼。",
      "preservedResult": "教皇为查理曼加冕为皇帝，西欧帝国权威得到新的政治表达。",
      "decisiveFork": "执事在查理曼跪下时将皇冠交给教皇（或绕过教皇直接交给查理曼/掷出皇冠）"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "托冠交付教皇加冕",
        "label": "你在查理曼跪在祭坛前的那刻，双手托起金冠稳步走向教皇利奥三世，俯身将皇冠递入他手中，确保他亲手为查理曼戴上。",
        "intent": "保留教皇为查理曼加冕的行动链，由你作为执事完成传递皇冠的关键动作。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "双手托起金冠，走近教皇利奥三世，俯身将皇冠递入他手中。",
          "target": "教皇利奥三世",
          "deadline": "查理曼跪下后的一刻钟内"
        },
        "instantEcho": {
          "directResult": "教皇接过皇冠，为查理曼加冕，全场高呼；加冕完成。",
          "unexpectedCost": "袍袖被烛台引燃，烫伤右臂，但皇冠已交付。",
          "beneficiary": "教皇利奥三世",
          "payer": "你（右臂烫伤）"
        }
      },
      {
        "id": "B",
        "displayLabel": "径置金冠于查理曼膝",
        "label": "你在查理曼跪下的那刻，绕过教皇利奥三世，直接走到查理曼面前，将金冠放在他双膝上，使他自行取冠加冕。",
        "intent": "改变交付对象和路径，让查理曼自行获取皇冠，剥夺教皇的加冕权。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "绕过教皇利奥三世，直接走到查理曼面前，将金冠放在他双膝上。",
          "target": "查理曼大帝",
          "deadline": "查理曼跪下后的一刻钟内"
        },
        "instantEcho": {
          "directResult": "查理曼愣住后自取皇冠戴上，教皇脸色铁青未敢阻拦。",
          "unexpectedCost": "被教皇卫队当场拿下，拖出教堂，剥去职司，流放罗马城外。",
          "beneficiary": "查理曼",
          "payer": "教皇利奥三世（权威受损）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "举圣油瓶示意涂油",
        "label": "你在查理曼跪下的那刻，从祭坛侧举起玛瑙圣油瓶过头顶，向全场示意加冕时刻已到，然后递给教皇利奥三世为查理曼涂油。",
        "intent": "用油瓶替代皇冠作为信号，确保教皇完成涂油加冕礼。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "从祭坛侧举起玛瑙圣油瓶过头顶，向全场示意，然后递给教皇利奥三世。",
          "target": "教皇利奥三世",
          "deadline": "查理曼跪下后的一刻钟内"
        },
        "instantEcho": {
          "directResult": "教皇接过油瓶为查理曼涂油，副执事递来皇冠完成加冕。",
          "unexpectedCost": "分神举瓶，脚下绊倒摔伤膝盖，被扶出休息。",
          "beneficiary": "教皇利奥三世",
          "payer": "你（膝盖受伤）"
        }
      },
      {
        "id": "B",
        "displayLabel": "掷金冠出窗落台伯河",
        "label": "你在查理曼跪下的那刻，从捧垫上抓起金冠，转身用尽全力将其从圣彼得大教堂侧窗掷出窗外，金冠滚落台伯河。",
        "intent": "破坏加冕仪式中的皇冠，迫使查理曼使用其他象征物加冕，改变教皇交付的动作。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "抓起金冠，转身用力掷出侧窗，金冠落入台伯河。",
          "target": "金冠（查理曼加冕器物）",
          "deadline": "查理曼跪下后的一刻钟内"
        },
        "instantEcho": {
          "directResult": "全场哗然，查理曼震怒，教皇急令卫士未果；查理曼拿起副祭手中铁冠自戴，称铁冕皇帝。",
          "unexpectedCost": "被控亵渎圣物，押入梵蒂冈地牢，次日将受审。",
          "beneficiary": "查理曼（以铁冠加冕，强化军事形象）",
          "payer": "教皇利奥三世（仪式失败，权威受损）"
        }
      }
    ]
  },
  "magna-carta-1215": {
    "trajectory": {
      "historicalPath": "为了让actualHistory发生，你作为王玺保管官必须在日落前将国王大印压在大宪章文本上，使男爵们确认条款生效并结束谈判。",
      "preservedResult": "英王约翰在兰尼米德接受大宪章，王权受到成文条款约束。",
      "decisiveFork": "改变大宪章被接受的结果，使王权不受约束，谈判破裂。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "取出国印盖宪章",
        "label": "你在兰尼米德王帐内，当着坎特伯雷大主教斯蒂芬·朗顿和男爵代表的面，从天鹅绒匣中取出国王大印，用力压在羊皮纸底端，确保印蜡完整粘附。",
        "intent": "保留约翰王接受大宪章的行动链，使王权受约束成为既定事实。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "取出国王大印并压盖大宪章文本",
          "target": "大宪章羊皮纸及国王大印",
          "deadline": "日落前"
        },
        "instantEcho": {
          "directResult": "大宪章被正式盖印，男爵们欢呼并开始散去，一小时后宪章副本将被分发至全国。",
          "unexpectedCost": "右手因用力过度而烫伤，但印章完整。",
          "beneficiary": "反叛男爵（获得成文权利保障）",
          "payer": "你（王玺保管官，轻微烫伤）"
        }
      },
      {
        "id": "B",
        "displayLabel": "摔印拒盖宪章",
        "label": "你在王帐内，当英王约翰示意你盖印时，你抓起大印猛掷于地，高喊‘这印必不落在束缚王权的纸上’，使印章蜡块碎裂。",
        "intent": "改变大宪章被接受的结果，使王权不受约束，谈判破裂。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "摔碎国王大印并拒绝盖印",
          "target": "国王大印及大宪章文本",
          "deadline": "日落前"
        },
        "instantEcho": {
          "directResult": "男爵们大怒，拔出长剑，帐外叛军吹响号角，谈判终止，内战立即爆发。",
          "unexpectedCost": "你被两名骑士按倒，右手脱臼，但未被杀。",
          "beneficiary": "英王约翰（暂时避免王权受限）",
          "payer": "你（王玺保管官，右手受伤被俘）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "副玺代印盖宪章",
        "label": "你在王帐外，发现国王大印已被B1摔碎，但你有副玺（用于日常文书），你立即取出副玺，在男爵们哗变前用力压盖在另一份誊写好的宪章副本上，高呼‘此印同样有效，王命已定’",
        "intent": "用副玺替代国印完成盖印，保留大宪章被接受的真实结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "取出副玺并压盖宪章副本",
          "target": "副玺及宪章副本",
          "deadline": "日落前"
        },
        "instantEcho": {
          "directResult": "男爵们短暂迟疑后接受副玺，宪章生效，约翰王被迫承认。",
          "unexpectedCost": "副玺在压力下出现裂缝，但未碎裂，日后需重铸。",
          "beneficiary": "反叛男爵（获得权利保障）",
          "payer": "你（王玺保管官，副玺受损）"
        }
      },
      {
        "id": "B",
        "displayLabel": "割袍断印毁宪章",
        "label": "你在王帐外，听到帐内争执，你抽出匕首割断系印的丝绦，将大印抛入河中，然后撕毁桌上唯一一份宪章，大喊‘无印无章，王权永固’。",
        "intent": "彻底毁掉盖印可能，使大宪章无法生效，王权不受限制。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "毁坏国王大印并撕毁宪章",
          "target": "国王大印及唯一宪章正本",
          "deadline": "日落前"
        },
        "instantEcho": {
          "directResult": "男爵们绝望暴怒，冲出帐外召集全军，内战全面爆发，约翰王逃往温莎。",
          "unexpectedCost": "你被男爵亲卫抓获，左手小指被切下作为警告，但未丧命。",
          "beneficiary": "英王约翰（暂时避免王权受限）",
          "payer": "你（王玺保管官，失去小指并被囚禁）"
        }
      }
    ]
  },
  "black-death-1347": {
    "trajectory": {
      "historicalPath": "你——墨西拿城中负责码头秩序的市政执事——在第一批船员已在跳板前等待下船时，执行了驱逐染病船只的动作。你命令码头卫兵用长矛阻拦船员下船，强制黑海商船起锚离港，并派税吏用木板钉死栈桥入口，加盖执事印禁止一切货物上岸。但是老鼠已经通过缆绳溜上码头，三天后墨西拿出现首例肺鼠疫，瘟疫进入城市，随后席卷欧洲并造成巨大人口损失。",
      "preservedResult": "墨西拿当局很快驱逐染病船只，但瘟疫已经进入城市，随后席卷欧洲并造成巨大人口损失。",
      "decisiveFork": "在第一批船员已在跳板前等待下船时，你可以选择是否允许船员上岸。如果允许，瘟疫传播加速；若驱逐，仍通过老鼠传播。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "钉死栈桥驱逐商船",
        "label": "你命令码头卫兵用长矛阻挡船员下船，强制黑海商船起锚离港，并命税吏用木板钉死栈桥入口，加盖执事印禁止一切货物上岸。第一批船员在跳板前被逼退。",
        "intent": "执行历史中驱逐染病船只的行动链，由你亲自下令卫兵、税吏执行，结果瘟疫仍通过老鼠进入城市。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令码头卫兵用长矛阻挡船员下船，强制黑海商船起锚离港；命税吏用木板钉死栈桥入口，在告示上盖执事印，禁止一切货物上岸。",
          "target": "黑海商船、船员、码头卫兵、税吏、栈桥、执事印",
          "deadline": "第一批船员已在跳板前等待下船"
        },
        "instantEcho": {
          "directResult": "商船被迫离港，栈桥封闭；但老鼠通过缆绳溜上码头，三天后墨西拿出现首例肺鼠疫，瘟疫如史入侵。",
          "unexpectedCost": "因擅自封闭皇家栈桥被港口商会起诉，市民不满粮食短缺，发生小规模骚乱。",
          "beneficiary": "瘟疫比历史晚三天爆发，城内未立即恐慌",
          "payer": "你个人，被商会起诉，骚乱中府邸被投石"
        }
      },
      {
        "id": "B",
        "displayLabel": "开放码头收容船员",
        "label": "你下令撤走码头卫兵，允许黑海船员自由下船，并临时开放圣阿加塔修道院作为收容所，同时命令码头工人将货物直接卸入公共粮仓。第一批船员在跳板前涌上岸。",
        "intent": "改成船员涌入，瘟疫在一周内传遍全城，死亡率超过历史水平；贵族趁机低价收购死者房产，粮商囤积粮食涨价",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "下令撤走码头卫兵，允许黑海船员自由下船，开放圣阿加塔修道院收容船员，并命令码头工人将船上货物直接卸入公共粮仓。",
          "target": "卫兵、黑海船员、圣阿加塔修道院、码头工人、公共粮仓",
          "deadline": "第一批船员已在跳板前等待下船"
        },
        "instantEcho": {
          "directResult": "船员涌入，瘟疫在一周内传遍全城，死亡率超过历史水平；贵族趁机低价收购死者房产，粮商囤积粮食涨价。",
          "unexpectedCost": "你因违反检疫条例被主教逐出教会，市民怀疑你故意传播瘟疫，你被迫逃亡乡下。",
          "beneficiary": "贵族（低价收购房产）、粮商（囤积获利）",
          "payer": "你，被逐出教会并逃亡；城内低收入居民因粮价暴涨受害"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "铁钩毁跳板火烧缆绳",
        "label": "你命码头装卸工用铁钩将跳板拖入海中，亲自用火把烧断商船缆绳，同时让市政书记员在市政厅门前宣读手令：任何靠近码头者以叛国罪论处。第一批船员在跳板前被阻止。",
        "intent": "用不同物理动作（铁钩毁跳板、火烧缆绳、宣读手令）实现同一驱逐结果，保留历史轨道。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令装卸工用铁钩将跳板拖入海中，亲手用火把烧断商船缆绳，命市政书记员在市政厅门前宣读手令，宣布任何靠近码头者以叛国罪论处。",
          "target": "装卸工、铁钩、跳板、火把、缆绳、市政书记员、手令",
          "deadline": "第一批船员已在跳板前等待下船"
        },
        "instantEcho": {
          "directResult": "商船失去跳板和缆绳，漂流离港；瘟疫仍通过提前上岸的老鼠侵入，一个月内传遍西西里。",
          "unexpectedCost": "你因纵火罪被港务法庭罚款，烧毁缆绳的火势蔓延烧毁附近一个货棚。",
          "beneficiary": "码头秩序维持，但实际益处微小",
          "payer": "你（罚款），货棚主（火灾损失）"
        }
      },
      {
        "id": "B",
        "displayLabel": "征用商船海上隔离",
        "label": "你命令所有船员留在船上，指派私人医生登船诊治，并让船主将货物卸到离码头两海里的备用驳船上，以隔离为由要求贵族与商人共同出资为船员购买补给。第一批船员在跳板前被命令返回船上。",
        "intent": "改成船员被隔离但驳船驶入内陆河道，带病老鼠随货物上岸，两个月后瘟疫流行全岛；你因越权征用船只被国王特使逮捕",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令所有船员留在船上，指派私人医生登船诊治，要求船主将货物卸到离码头两海里的备用驳船上，并出具书面令让贵族与商人共同出资为船员购买补给。",
          "target": "船员、私人医生、船主、备用驳船、书面令、贵族、商人",
          "deadline": "第一批船员已在跳板前等待下船"
        },
        "instantEcho": {
          "directResult": "船员被隔离但驳船驶入内陆河道，带病老鼠随货物上岸，两个月后瘟疫流行全岛；你因越权征用船只被国王特使逮捕。",
          "unexpectedCost": "私人医生感染死亡，驳船船主船只被烧毁防止传染。",
          "beneficiary": "码头区域暂时安全，贵族因出资获得更多行政权限",
          "payer": "你（被逮捕），私人医生（死亡），驳船船主（财产损失）"
        }
      }
    ]
  },
  "gutenberg-bible-1455": {
    "trajectory": {
      "historicalPath": "古腾堡与排印师在截止日前完成最后一页排版、印刷及装订，圣经顺利完工。",
      "preservedResult": "古腾堡印制的圣经成为欧洲活字印刷早期里程碑，书籍复制速度大幅提高。",
      "decisiveFork": "在最后一页上机印刷前，是否干预印刷动作或铅字内容。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "亲自开动印刷机完成圣经",
        "label": "你确认最后一页铅活字无误，将纸张放入印刷机，亲自压印出最终页，让整部圣经在债权人接管前完工。",
        "intent": "保留圣经完成的行动链，由你亲自执行最终印刷。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "将纸张放入印刷机并压印出最后一页",
          "target": "古腾堡印刷机及最后一页铅活字版",
          "deadline": "债权人明日接管前"
        },
        "instantEcho": {
          "directResult": "最后一页印刷完成，整部圣经装订成册，古腾堡在接管前留下了完整作品。",
          "unexpectedCost": "印刷过程中你的右手被机器夹伤，短期内无法排版。",
          "beneficiary": "古腾堡",
          "payer": "排印师（你）"
        }
      },
      {
        "id": "B",
        "displayLabel": "破坏最后一页版块改变结果",
        "label": "你趁古腾堡离开时，用钳子夹走最后一页版块中的三个关键铅字，导致印出的最后一页缺字，圣经内容不完整。",
        "intent": "改变圣经的完整性结果，但保留古腾堡的工艺存在。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "用钳子夹走最后一页版块中的三个字母铅字",
          "target": "最后一页铅活字版块",
          "deadline": "债权人明日接管前"
        },
        "instantEcho": {
          "directResult": "最后一页印刷后出现明显缺字，圣经无法作为完整版本出售，古腾堡的债务问题恶化。",
          "unexpectedCost": "古腾堡当场发现你破坏版块，他愤怒地将你辞退，并指控你破坏，你面临被逐出师傅会的风险。",
          "beneficiary": "古腾堡的债权人",
          "payer": "你（排印师）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "命令学徒完成最后印刷",
        "label": "你确认最后一页无误后，命令学徒汉斯操作印刷机完成印刷，你在旁监督，确保结果精确。",
        "intent": "保留圣经完成的行动链，但由学徒执行，你承担指导责任。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令学徒汉斯操作印刷机完成最后一页的压印",
          "target": "学徒汉斯",
          "deadline": "债权人明日接管前"
        },
        "instantEcho": {
          "directResult": "学徒成功印出最后一页，圣经完整，古腾堡在接管前获得成品。",
          "unexpectedCost": "学徒操作失误导致油墨不均，最后一页品质略低于前页，但依然可装订。古腾堡事后对你要求学徒操作表示不满，削减你当月工钱。",
          "beneficiary": "古腾堡",
          "payer": "你（排印师，被罚工钱）"
        }
      },
      {
        "id": "B",
        "displayLabel": "藏匿版块并故意排错",
        "label": "你将最后一页铅活字版块从印刷机中取出，藏入废料堆，然后伪称版块遗失，自己提出用备用铅字重排，但故意排错顺序，导致印出内容混乱。",
        "intent": "改变圣经最终内容，使其无法作为标准版本流通，但保留古腾堡的工艺存在。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "将最后一页铅活字版块藏入废料堆并以重排之名故意排错顺序",
          "target": "最后一页铅活字版块及备用铅字",
          "deadline": "债权人明日接管前"
        },
        "instantEcho": {
          "directResult": "印出的最后一页文句错乱，圣经无法作为完整版本，古腾堡在接管前没能拿出合格成品，被债权人宣布违约。",
          "unexpectedCost": "你的藏匿行为被另一学徒目睹并告知古腾堡，古腾堡向作坊公会控告你破坏，你可能面临长期监禁或流放。",
          "beneficiary": "债权人",
          "payer": "你（排印师）"
        }
      }
    ]
  },
  "circumnavigation-1522": {
    "trajectory": {
      "historicalPath": "领航员根据吃水读数提醒船长，船长命令保持全部香料货物并相应调整帆向以增加速度，最终在退潮前驶入桑卢卡尔港。",
      "preservedResult": "维多利亚号载着十八名完成全程的船员返回西班牙，完成有记录的首次环球航行。",
      "decisiveFork": "是否抛弃部分珍贵香料货舱减轻吃水，带十八名幸存者抢在退潮前进港"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "砍桅杆保香料",
        "label": "你命令水手用斧头砍断主桅杆中段以上的所有帆桁和绳索，将桅杆顶段连同索具抛入海中，以减轻上层重量，降低船体吃水，同时保留全部香料货舱不变。",
        "intent": "通过减轻上层重量降低吃水，保留香料货物，使历史结果中香料得以保存。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令水手砍断主桅杆中段以上的所有帆桁和绳索，抛入海中",
          "target": "维多利亚号的主桅杆上部结构",
          "deadline": "退潮封住浅水航道之前"
        },
        "instantEcho": {
          "directResult": "上层桅杆和帆桁落入水中，船体上部重量明显减轻，船身微微上浮，吃水线下降约半腕尺。",
          "unexpectedCost": "船只失去大部分帆装，后续只能靠剩余低帆和桨划行，航速大幅降低但足以完成进港。",
          "beneficiary": "船长胡安·塞巴斯蒂安·埃尔卡诺及全体十八名幸存船员",
          "payer": "维多利亚号的帆装系统"
        }
      },
      {
        "id": "B",
        "displayLabel": "弃香料减吃水",
        "label": "你命令水手打开货舱舱口，将全部香料桶逐一滚出舷外，抛入海中，直到吃水降至安全线以下，然后全速驶向港口。",
        "intent": "改变保留香料的关键决策，通过抛弃香料解除吃水危机，使历史结果不再包含香料货物。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令水手将全部香料货舱的香料桶抛入海中",
          "target": "维多利亚号货舱内的全部香料",
          "deadline": "退潮封住浅水航道之前"
        },
        "instantEcho": {
          "directResult": "数百个香料桶被推出船舷，海面漂浮丁香、肉桂和肉豆蔻，船体吃水急剧下降，船头抬起，船速增加。",
          "unexpectedCost": "失去了所有能够证明航行经济价值的香料货物，国王的预期收益化为乌有。",
          "beneficiary": "维多利亚号船体（减轻负载）及全体船员",
          "payer": "船长埃尔卡诺（失去香料货物）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "移桶压舱配平",
        "label": "你下到货舱，指挥水手将香料桶从船尾向船头方向重新紧密码放，并用绳索固定，使船体整体配平，将船尾吃水部分转移到船首，同时命令舵手向左微调航向，利用涨潮余流从沙洲南侧深槽滑过。",
        "intent": "用另一种物理配平和水流利用方式实现保留香料并进港的历史轨道。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "指挥水手将香料桶从船尾移向船头并命令舵手调整航向利用余流",
          "target": "维多利亚号货舱内的香料桶及舵手",
          "deadline": "退潮封住浅水航道之前"
        },
        "instantEcho": {
          "directResult": "香料桶被移向船头，船体配平改善，船尾吃水减少约一腕尺；舵手按新航向驶入深槽，船底轻轻擦过沙洲边缘后进入深水。",
          "unexpectedCost": "船首因额外重量吃水增加，船头龙骨轻微触底刮擦，但无结构性损伤。",
          "beneficiary": "船长埃尔卡诺和全部香料货物",
          "payer": "船首龙骨（轻微刮擦）"
        }
      },
      {
        "id": "B",
        "displayLabel": "断锚链弃锚冲滩",
        "label": "你命令水手用铁锤和凿子砍断锚链，将四只铁锚和所有备用缆绳、备用锚链抛入海中以减轻重量，同时命令舵手对准浅滩最窄处全速前进，利用船底刮擦沙洲的冲力越过浅水区。",
        "intent": "改成铁锚和缆绳沉入海底，船重减轻；船全速冲向浅滩，船底剧烈刮擦沙洲发出尖利声响，船体震动后冲入深水区",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令水手砍断锚链抛弃铁锚和备用缆绳，并命令舵手全速冲滩",
          "target": "维多利亚号的铁锚、锚链、备用缆绳和舵手",
          "deadline": "退潮封住浅水航道之前"
        },
        "instantEcho": {
          "directResult": "铁锚和缆绳沉入海底，船重减轻；船全速冲向浅滩，船底剧烈刮擦沙洲发出尖利声响，船体震动后冲入深水区。",
          "unexpectedCost": "所有铁锚和备用缆绳损失，船底多处刮伤，开始少量进水，但进港成功且无人伤亡。",
          "beneficiary": "全体十八名船员（快速脱离险境）",
          "payer": "维多利亚号的船底结构和锚泊能力"
        }
      }
    ]
  },
  "watt-patent-1769": {
    "trajectory": {
      "historicalPath": "你核验瓦特的独立冷凝器图纸，确认其新颖性，当场登记并签发专利证书，专利在午后封存前生效。",
      "preservedResult": "詹姆斯·瓦特获得独立冷凝器专利，蒸汽机效率的提升推动工业应用。",
      "decisiveFork": "你必须在午前完成核验并签发证书，确保专利在封存前生效。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "核验签发专利证书",
        "label": "你仔细核对了瓦特的独立冷凝器图纸，确认设计新颖且与纽科门蒸汽机有本质区别，于是签署专利证书，当场交给瓦特。",
        "intent": "确保瓦特在午前获得了专利证书，独立冷凝器设计正式受保护",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "核验图纸并签署专利证书",
          "target": "詹姆斯·瓦特的独立冷凝器专利申请",
          "deadline": "午后封存前"
        },
        "instantEcho": {
          "directResult": "瓦特在午前获得了专利证书，独立冷凝器设计正式受保护。",
          "unexpectedCost": "你因核验速度过快，被上级书记长批评手续不够规范，但专利仍有效。",
          "beneficiary": "詹姆斯·瓦特",
          "payer": "你（职业声誉受轻微影响）"
        }
      },
      {
        "id": "B",
        "displayLabel": "阻挠专利即时注册",
        "label": "你以图纸中冷凝器尺寸标注不清为由，要求瓦特当场修改，并拒绝在午后封存前完成核验。",
        "intent": "改成瓦特当日未获专利，申请被推迟至下一周委员会会议",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "以标注不清为由要求修改，推迟核验",
          "target": "瓦特的专利申请图纸",
          "deadline": "午后封存前"
        },
        "instantEcho": {
          "directResult": "瓦特当日未获专利，申请被推迟至下一周委员会会议。",
          "unexpectedCost": "瓦特当场与你争执，引来其他官员围观；你被主管警告，但整体事态仍可控制。",
          "beneficiary": "纽科门蒸汽机的主要制造商（如约翰·斯米顿）暂时受益",
          "payer": "瓦特（延迟专利保护）和你（承受主管警告）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "提前开封补注册",
        "label": "你在午后封存后，利用职务之便提前开封封存箱，取出瓦特的申请文件，补签日期并注册，确保专利当日生效。",
        "intent": "以不同动作（违规操作）实现同一历史结果：瓦特获得专利。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "违规开封箱并补签注册",
          "target": "封存箱内瓦特的申请文件",
          "deadline": "委员会封存后一小时内"
        },
        "instantEcho": {
          "directResult": "瓦特的专利在当日注册成功，日期仍为1月5日。",
          "unexpectedCost": "你被书记长当场发现违规操作，遭到记过处分，但专利有效。",
          "beneficiary": "詹姆斯·瓦特",
          "payer": "你（职场前途受损）"
        }
      },
      {
        "id": "B",
        "displayLabel": "拒绝受理并退回申请",
        "label": "你以图纸格式不符合专利局最新规定为由，拒绝受理瓦特的专利申请，当场将图纸和申请书退还给瓦特。",
        "intent": "以不同动作改变结果，阻止专利授予。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "以格式不符为由拒绝受理并退回申请",
          "target": "瓦特提交的图纸和申请书",
          "deadline": "午后封存前"
        },
        "instantEcho": {
          "directResult": "瓦特当日未能提交申请，专利获得延迟数周。",
          "unexpectedCost": "瓦特愤怒抗议，你因滥用职权被停职调查，但未丧失行动能力。",
          "beneficiary": "竞争对手（如约翰·斯米顿）受益",
          "payer": "瓦特（延迟专利）和你（停职调查）"
        }
      }
    ]
  },
  "declaration-1776": {
    "trajectory": {
      "historicalPath": "秘书在7月4日凌晨将杰斐逊经逐句修改后的宣言草稿誊清为正式羊皮纸版本，于午前提交给大陆会议主席约翰·汉考克。汉考克随即在午后组织各州代表按原定程序逐州投票，最终一致通过独立决议，十三殖民地正式宣布脱离英国。",
      "preservedResult": "大陆会议通过《独立宣言》，十三殖民地宣布脱离英国。",
      "decisiveFork": "午前提交的誊清稿是否为杰斐逊最终修改版，且汉考克是否将其付诸投票。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "誊清宣言提交主席",
        "label": "你必须在午前将杰斐逊最终修改、富兰克林校对的宣言草稿誊清为正式羊皮纸副本，并附上独立决议，递交大陆会议主席约翰·汉考克，确保提交的文本与杰斐逊底稿逐字一致，且投票前每位代表都能拿到印刷版。",
        "intent": "保留杰斐逊起草、富兰克林校对、富兰克林-亚当斯推动的行动链，按历史程序交付表决，使实际历史结果发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "誊清并递交独立决议及宣言最终稿",
          "target": "大陆会议主席约翰·汉考克",
          "deadline": "1776年7月4日午前"
        },
        "instantEcho": {
          "directResult": "汉考克收到正式文本，午后各州逐州投票，最终一致通过《独立宣言》。",
          "unexpectedCost": "你因连续誊写数小时致右手严重痉挛，无法继续担任下午的记录工作。",
          "beneficiary": "大陆会议全体代表",
          "payer": "你（秘书本人）"
        }
      },
      {
        "id": "B",
        "displayLabel": "销毁草稿提交和解案",
        "label": "你必须在午前从杰斐逊桌面抽走正在修改的宣言草稿，将其投入壁炉烧毁，然后从废纸篮取出一份由宾夕法尼亚保守派先前起草的和解提案，作为“最终文本”递交汉考克，并声称这是杰斐逊委托你提交的最新版本。",
        "intent": "改成汉考克收到和解文本，代表们震惊，废除独立决议，派遣新使团赴英谈判",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "销毁杰斐逊宣言草稿并递交和解提案",
          "target": "杰斐逊的宣言草稿及大陆会议主席汉考克",
          "deadline": "1776年7月4日午前"
        },
        "instantEcho": {
          "directResult": "汉考克收到和解文本，代表们震惊，废除独立决议，派遣新使团赴英谈判。",
          "unexpectedCost": "杰斐逊返回发现草稿失踪，当众指控你背叛；你被大陆会议警卫逮捕并关押。",
          "beneficiary": "英王乔治三世",
          "payer": "你（秘书本人）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "命令印刷工加急排印",
        "label": "你必须在午前命令印刷工约翰·邓拉普，让他跳过常规校对流程，直接按杰斐逊最终修改的底稿排印200份宣言，并立即分发给每位代表，确保午后的投票程序不受文本分发延迟影响。",
        "intent": "保留历史行动链，但通过印刷厂加急操作，加快文本分发速度，确保投票程序按历史轨道进行。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令印刷工加急排印并分发宣言文本",
          "target": "印刷工约翰·邓拉普及大陆会议代表",
          "deadline": "1776年7月4日午后投票前"
        },
        "instantEcho": {
          "directResult": "邓拉普在投票前将印刷版宣言送至每位代表手中，代表们按历史结果一致通过独立。",
          "unexpectedCost": "因加急排印，有3份印刷品字迹模糊，部分代表抱怨阅读困难。",
          "beneficiary": "约翰·汉考克（主席顺利推动表决）",
          "payer": "约翰·邓拉普（印刷工承担额外成本）"
        }
      },
      {
        "id": "B",
        "displayLabel": "调换决议案文措辞",
        "label": "你必须在午前趁杰斐逊暂时离开办公室，用蘸水笔将宣言第一句中的“独立”一词划去，改为“自治”，并立即通知汉考克：杰斐逊本人要求修改决议措辞，独立暂缓宣布。",
        "intent": "通过直接修改关键词，改变投票内容，使独立变成自治，从而导致不同历史结果。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "擅自修改宣言关键措辞并通知汉考克",
          "target": "杰斐逊的宣言手稿及大陆会议主席汉考克",
          "deadline": "1776年7月4日午前"
        },
        "instantEcho": {
          "directResult": "汉考克宣布文本异常，表决推迟，大陆会议陷入争论，最终通过“自治”决议。",
          "unexpectedCost": "杰斐逊返回发现笔迹不同，当场指认你篡改，你被剥夺秘书职务并驱逐出会场。",
          "beneficiary": "宾夕法尼亚保守派代表约翰·迪金森",
          "payer": "你（秘书本人）"
        }
      }
    ]
  },
  "jenner-vaccine-1796": {
    "trajectory": {
      "historicalPath": "詹纳从挤奶女工莎拉·内尔姆斯手上牛痘脓疱中抽取材料，在男孩詹姆斯·菲普斯手臂上划出两道切口并涂抹牛痘材料，之后每日观察记录症状。",
      "preservedResult": "詹纳开展牛痘接种实验，为后来推广天花疫苗奠定基础。",
      "decisiveFork": "是否立即为男孩詹姆斯·菲普斯接种牛痘材料，并连续记录身体反应"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "接种牛痘并持续记录",
        "label": "在詹纳的指令下，你立即将新鲜牛痘材料涂抹在詹姆斯·菲普斯双臂的切口中，并承诺每日记录体温、脓疱变化和精神状态，直到材料失效日落前完成首次记录。",
        "intent": "保留真实历史中詹纳为菲普斯接种牛痘并记录的直接行动链。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "执行牛痘接种，将材料涂抹于男孩切口，并开始每日记录",
          "target": "詹姆斯·菲普斯",
          "deadline": "日落前完成接种并开始记录"
        },
        "instantEcho": {
          "directResult": "詹姆斯·菲普斯手臂出现局部脓疱，你记录下首次体温数据；詹纳确认接种成功。",
          "unexpectedCost": "你因专注记录而忽略了另一名预约病人的简单问诊，导致病人不满离开。",
          "beneficiary": "詹纳获得可靠实验数据",
          "payer": "你承受了同事的责备"
        }
      },
      {
        "id": "B",
        "displayLabel": "改用挤奶女工材料接种",
        "label": "在詹纳犹豫时，你主张直接从莎拉·内尔姆斯手上未愈合的牛痘脓疱中抽取材料，由你亲自划开詹姆斯·菲普斯的皮肤并涂抹，迫使詹纳同意改变材料来源顺序，将原本计划的牛痘材料替换为莎拉·内尔姆斯的脓疱液。",
        "intent": "改变控制关系：由你主导材料来源选择，改变命令方向：直接使用人传人脓疱液。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "从莎拉·内尔姆斯手上直接取脓疱液并接种给詹姆斯·菲普斯",
          "target": "詹姆斯·菲普斯、莎拉·内尔姆斯",
          "deadline": "日落前必须完成接种"
        },
        "instantEcho": {
          "directResult": "詹姆斯·菲普斯接种后出现更强局部反应，三天后发热；詹纳担忧但未阻止。",
          "unexpectedCost": "莎拉·内尔姆斯的脓疱被取走后感染加重，不得不休息两周。",
          "beneficiary": "你获得实验控制权",
          "payer": "莎拉·内尔姆斯承担感染代价"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "协助詹纳双重记录",
        "label": "詹纳指示你准备两份记录纸，一份记录詹姆斯·菲普斯的反应，另一份同步记录同一批牛痘材料接种于你手臂上的反应（你自愿作为第二受试者），日落前完成两次接种和初始记录。",
        "intent": "使用第二受试者（你自己）和新的记录工具（两份记录纸）执行同一真实历史轨道——接种和记录。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "在自己手臂上接种同一牛痘材料，并记录两份反应日志",
          "target": "你自己、詹姆斯·菲普斯",
          "deadline": "日落前完成接种和初始记录"
        },
        "instantEcho": {
          "directResult": "你和詹姆斯·菲普斯都出现脓疱；詹纳获得两份对比数据，加快了对牛痘效果的评价。",
          "unexpectedCost": "你手臂留下永久性小疤痕，且未来数日无法正常工作。",
          "beneficiary": "医学界获得更强证据",
          "payer": "你承受身体疤痕和额外工作量"
        }
      },
      {
        "id": "B",
        "displayLabel": "要求将接种延期至明日",
        "label": "你以材料新鲜度可能不足、需要更多准备为由，要求詹纳将接种推迟至次日清晨再采集材料，但詹纳坚持日落前必须行动，你最终妥协并改为同时使用两种材料（莎拉·内尔姆斯和原牛痘材料）分别接种于男孩双臂，由你选择哪一侧使用何种材料。",
        "intent": "改变命令方向：你决定接种时间窗口（虽未成功）和材料分配方式，改变了原定只使用一种材料的程序。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "要求延期，失败后改为将两种材料分别接种于男孩双臂",
          "target": "詹姆斯·菲普斯（双臂分别处理）",
          "deadline": "日落前完成接种（原期限）"
        },
        "instantEcho": {
          "directResult": "男孩左臂接种原牛痘材料，右臂接种莎拉·内尔姆斯脓疱液；两种都产生反应，詹纳记录混乱但最终承认双接种事实。",
          "unexpectedCost": "男孩出现双重局部反应，恢复期延长一周。",
          "beneficiary": "你获得了实验设计的话语权",
          "payer": "詹姆斯·菲普斯承担了额外痛苦"
        }
      }
    ]
  },
  "meiji-1868": {
    "trajectory": {
      "historicalPath": "明治亲笔批准五条誓文 → 书记官誊写 → 天皇在紫宸殿诸侯前宣读 → 颁布全国",
      "preservedResult": "明治天皇发布五条誓文，新政府推动政治社会与经济制度改革。",
      "decisiveFork": "书记官是否有权在递交前修改誓文字句或替换内容"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "呈上玉玺加盖誓文",
        "label": "在刻有龙纹的檀木匣中取出明治天皇的玉玺，蘸取朱砂印泥，于书写好的五条誓文末尾的日期旁庄重加盖御玺，随后将誓文双手捧至侍从长手中的漆盘上，由侍从长呈递天皇御览并在诸侯面前宣读。",
        "intent": "确保五条誓文以天皇名义正式发布，保留实际历史中的盖章、宣读流程，使誓文成为新政府施政纲领。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "呈上玉玺加盖誓文",
          "target": "明治天皇御玺与五条誓文",
          "deadline": "仪式将在一刻钟后开始"
        },
        "instantEcho": {
          "directResult": "誓文加盖玉玺，侍从长接过转呈天皇，天皇在诸侯面前宣读五条誓文，维新改革正式启动。",
          "unexpectedCost": "因盖印匆忙，一枚朱砂滴落染红了誓文的‘广兴会议’四字旁的白纸，虽未损正文，但招来老儒皱眉。",
          "beneficiary": "新政府核心官员（三条实美、岩仓具视）",
          "payer": "你被临时调离誊写岗位，改由副手接替后续记录工作"
        }
      },
      {
        "id": "B",
        "displayLabel": "掉包誓文擅自宣读",
        "label": "趁众人注视天皇入场时，快速将预先藏于袖中的另一张写着‘广兴会议，万机须由诸侯公论；求知世界，先取长崎港贸易权’的纸卷替换掉写有‘求知识于世界’的原誓文，并在宣读环节抢在侍从长前一步大声念出。",
        "intent": "改变五条誓文中‘求知识于世界’的原文，增加‘先取长崎港贸易权’的具体扩张指令，使改革方向更激进，直接从列强手中夺取控制权。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "掉包誓文擅自宣读",
          "target": "五条誓文原件及宣读程序",
          "deadline": "仪式将在一刻钟后开始"
        },
        "instantEcho": {
          "directResult": "你念出的替代誓文引发诸侯哗然，天皇惊愕但未当场制止，现场秩序大乱，原定秩序被迫中断。",
          "unexpectedCost": "你被两名武士当场按倒，因冒犯天皇被剥夺官职并收押。",
          "beneficiary": "主张武力开国的萨摩藩激进派（如西乡隆盛部属）",
          "payer": "你被押入京都町奉行所牢房"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "点燃蜡烛照亮誓文",
        "label": "点起御前青铜烛台上的三支蜜蜡蜡烛，移至案前，使诸侯能清晰看见誓文字迹，待侍从长宣读时，你手持烛台稳定光源直至宣读完毕。",
        "intent": "以辅助照明动作确保誓文被清晰看到和宣读，用非书写方式推动同一历史结果——五条誓文被充分展示和接受。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "点燃蜡烛照亮誓文",
          "target": "御前青铜烛台与誓文书面",
          "deadline": "仪式将在一刻钟后开始"
        },
        "instantEcho": {
          "directResult": "烛光明亮，誓文每一字都被与会诸侯看清，宣读顺利，维新理念深入人心。",
          "unexpectedCost": "你手中的烛台倾斜，一滴蜡油滴在一位藩主的名牌上，导致该藩主在记录中被遗漏。",
          "beneficiary": "新政府公议所",
          "payer": "被滴蜡的藩主（肥后藩主细川护久）对你产生不满"
        }
      },
      {
        "id": "B",
        "displayLabel": "藏起誓文另立约章",
        "label": "在仪式前整理文书时，将正式誓文卷轴藏入自己的衣襟，同时从怀中取出一份事先写好的‘暂约五章’（包括‘即日废藩置县’、‘土地归公’等内容）放在案上，并高声宣告此为天皇最新旨意。",
        "intent": "改成现场陷入混乱，多数藩主拒绝承认新约章，萨摩藩士拔刀，你被当场抓捕",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "藏起誓文另立约章",
          "target": "五条誓文原件与仪式流程",
          "deadline": "仪式将在一刻钟后开始"
        },
        "instantEcho": {
          "directResult": "现场陷入混乱，多数藩主拒绝承认新约章，萨摩藩士拔刀，你被当场抓捕。",
          "unexpectedCost": "你在扭打中被刀背击中头部，造成轻微脑震荡，随后被投入监狱。",
          "beneficiary": "长州藩激进派（如木户孝允）",
          "payer": "你被判处流放，当天即被押送离京"
        }
      }
    ]
  },
  "wright-flight-1903": {
    "trajectory": {
      "historicalPath": "保留奥维尔·莱特执行起飞动作，威尔伯·莱特跑步辅助平衡，威廉·H·米勒拍摄照片的真实行动链。",
      "preservedResult": "莱特飞行者一号完成持续受控的动力飞行，航空时代由此开启。",
      "decisiveFork": "改变起飞指挥权（从奥维尔转移给你），改变摄影记录结果（中断），改变着陆控制（威尔伯接管）。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "强风间隙发出起飞信号",
        "label": "你在1903年12月17日北卡罗来纳州基蒂霍克沙丘的强风间隙中，对莱特兄弟中的奥维尔·莱特说出“现在起飞”，并扳动摄影记录机开关，激活威廉·H·米勒的相机开始记录，确保飞行者一号在10点35分离地起飞并持续飞行12秒，完成持续受控动力飞行的真实历史结果。",
        "intent": "保留奥维尔·莱特执行起飞动作，威尔伯·莱特跑步辅助平衡，威廉·H·米勒拍摄照片的真实行动链。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "说出“现在起飞”并扳动摄影记录机开关，激活相机",
          "target": "奥维尔·莱特（飞行员）、飞行者一号、威廉·H·米勒的相机",
          "deadline": "下一阵风将在几分钟后超过安全范围，必须在10点35分前完成"
        },
        "instantEcho": {
          "directResult": "奥维尔·莱特听到信号后按计划启动发动机，飞行者一号在10点35分离地，持续飞行12秒，照片被记录，真实历史发生。",
          "unexpectedCost": "你被螺旋桨掀起的沙粒击中面部，轻微擦伤。",
          "beneficiary": "莱特兄弟（获得首次动力飞行的历史记录）",
          "payer": "你（机械助手，面部擦伤）"
        }
      },
      {
        "id": "B",
        "displayLabel": "抢先发出起飞信号",
        "label": "你在1903年12月17日北卡罗来纳州基蒂霍克沙丘的强风间隙中，对奥维尔·莱特说“再等一阵”，然后自行爬上飞行者一号的驾驶位，拉动操纵杆并推进油门，在奥维尔阻止之前使飞机在10点35分离地，完成持续动力飞行，但将洛林·莱特原本负责的供电线接线断开，使摄影记录中断，并将着陆控制权移交给威尔伯·莱特（在滑道上奔跑跟随）。",
        "intent": "改变起飞指挥权（从奥维尔转移给你），改变摄影记录结果（中断），改变着陆控制（威尔伯接管）。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "说出“再等一阵”并爬上驾驶位，拉动操纵杆推进油门，断开供电线接线",
          "target": "奥维尔·莱特、飞行者一号、洛林·莱特的供电线",
          "deadline": "下一阵风将在几分钟后超过安全范围，必须在10点35分前完成"
        },
        "instantEcho": {
          "directResult": "飞行者一号在10点35分离地，但照片未被记录；着陆时威尔伯配合使飞机平稳降落在沙丘上。",
          "unexpectedCost": "你的手被螺旋桨刮伤，流血。",
          "beneficiary": "威尔伯·莱特（获得着陆控制权，避免了无记录的首飞争议）",
          "payer": "你（失去记录，手受伤）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "用信号旗指挥起飞进程",
        "label": "你在1903年12月17日北卡罗来纳州基蒂霍克沙丘的强风间隙中，用红色信号旗向奥维尔·莱特发出“立即起飞”旗语，同时用左手指向飞行者一号的螺旋桨方向，按预定流程指挥起飞，使得奥维尔在10点35分启动发动机并离地，完成持续12秒的受控动力飞行，保持真实历史。",
        "intent": "使用信号旗（另一器物）指挥奥维尔执行起飞，保留奥维尔作为飞行员、威尔伯滑跑辅助、米勒拍照的真实行动链。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "挥动红色信号旗并指向螺旋桨方向，发出起飞指令",
          "target": "奥维尔·莱特、飞行者一号、威廉·H·米勒的相机",
          "deadline": "下一阵风将在几分钟后超过安全范围，必须在10点35分前完成"
        },
        "instantEcho": {
          "directResult": "奥维尔看到旗语后开始起飞程序，飞机在10点35分离地，飞行12秒，照片被记录。",
          "unexpectedCost": "你因紧张而扭伤脚踝。",
          "beneficiary": "莱特兄弟（获得完整历史记录）",
          "payer": "你（扭伤脚踝）"
        }
      },
      {
        "id": "B",
        "displayLabel": "强制奥维尔手动机内调整",
        "label": "你在1903年12月17日北卡罗来纳州基蒂霍克沙丘的强风间隙中，以机械助手身份强行将奥维尔·莱特推离驾驶位，自己坐上座位并操纵飞行者一号起飞，但起飞后因着陆经验不足而摔断着陆滑橇的支撑木，使着陆显得残缺；同时将风速计读数故意调低并报告给威尔伯·莱特，使他认为风力不适合进行下一次飞行，从而单次飞行即结束当日试验。",
        "intent": "改变起飞执行人（从奥维尔变为你），改变着陆结果（损坏滑橇），改变当日续飞计划（威尔伯误信风速数据而终止）。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "推离奥维尔，自己坐入驾驶位操纵起飞，着陆时故意使滑橇受损，并调低风速计读数报告给威尔伯",
          "target": "奥维尔·莱特、飞行者一号、风速计、威尔伯·莱特",
          "deadline": "下一阵风将在几分钟后超过安全范围，必须在10点35分前完成"
        },
        "instantEcho": {
          "directResult": "飞行者一号在10点35分离地，飞行约10秒后着陆，滑橇损坏；威尔伯基于错误风速报告决定当日不再试飞，试验终止。",
          "unexpectedCost": "你在着陆时的冲击中扭伤腰部，数月无法重体力劳动。",
          "beneficiary": "威尔伯·莱特（获得当日决策权威，避免后续竞争性试飞冲突）",
          "payer": "你（腰部扭伤，滑橇损坏需维修）"
        }
      }
    ]
  },
  "un-charter-1945": {
    "trajectory": {
      "historicalPath": "你作为中国代表团法律顾问，在签字仪式前向顾维钧解释安理会表决程序的合法性，并确保代表团按时签署《联合国宪章》。",
      "preservedResult": "五十国代表签署《联合国宪章》，接受包括安理会常任理事国否决权在内的制度安排，联合国随后成立。",
      "decisiveFork": "改变中国代表团对否决权条款的接受，导致签字延迟或宪章修改。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "解释条款促签字",
        "label": "你在签字前向顾维钧口头解释《联合国宪章》第二十七条的表决程序符合国际法，并明确表示否决权是雅尔塔方案的核心条款，建议代表团按时签署。",
        "intent": "保持顾维钧接受雅尔塔方案的行动链，使联合国宪章按时签署。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "向顾维钧口头解释并建议代表团按时签署宪章",
          "target": "顾维钧",
          "deadline": "一小时后签字开始前"
        },
        "instantEcho": {
          "directResult": "顾维钧及中国代表团在签字仪式上签署《联合国宪章》，中国成为安理会常任理事国。",
          "unexpectedCost": "你被部分中小国家代表指责为大国霸权辩护，职业声誉在同行中下降。",
          "beneficiary": "中国代表团、顾维钧",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "质询条款阻签字",
        "label": "你在签字前向顾维钧提交一份法律备忘录，指出联合国宪章中否决权条款违反《大西洋宪章》的“无扩张”精神，并以此为由建议中国代表团暂缓签字，要求修改条款。",
        "intent": "改变中国代表团对否决权条款的接受，导致签字延迟或宪章修改。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "向顾维钧提交法律备忘录并建议暂缓签字",
          "target": "顾维钧",
          "deadline": "一小时后签字开始前"
        },
        "instantEcho": {
          "directResult": "顾维钧采纳建议，中国代表团未在当日签字，联合国宪章签字仪式中断，引发外交危机。",
          "unexpectedCost": "你因违抗国内接受雅尔塔方案的指令，被国民党政府撤职并列入黑名单，面临逮捕风险。",
          "beneficiary": "部分中小国家代表",
          "payer": "你、顾维钧"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "协调签字顺序",
        "label": "你在中国代表团签字前，协调各国代表团的签字顺序，确保按照国名字母顺序进行，并亲自将宪章文本翻到中国签字页，让顾维钧在指定位置签字。",
        "intent": "保留中国代表团签署宪章的事实，通过程序性动作维持历史轨道。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "协调签字顺序并引导顾维钧在指定位置签字",
          "target": "中国代表团签字仪式",
          "deadline": "一小时后签字开始"
        },
        "instantEcho": {
          "directResult": "中国代表团在宪章上签字，联合国成立。",
          "unexpectedCost": "你因紧张操作失误，将中国签字页折角，被礼仪官轻微责备。",
          "beneficiary": "中国代表团全体",
          "payer": "你"
        }
      },
      {
        "id": "B",
        "displayLabel": "联合发起紧急动议",
        "label": "你在签字前五分钟，联合智利、荷兰等国代表，向会议主席提交一份紧急动议，要求对否决权条款进行重新表决，并将动议散发给所有代表团。",
        "intent": "改变雅尔塔方案中否决权条款的通过，削弱大国特权。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "联合智利、荷兰代表提交紧急动议要求重新表决否决权条款",
          "target": "会议主席及所有代表团",
          "deadline": "一小时后签字开始前"
        },
        "instantEcho": {
          "directResult": "紧急动议被会议主席以“已过时效”拒绝，签字按时进行，宪章未改。",
          "unexpectedCost": "你因带头挑战大国特权，被美国国务院列为不受欢迎人物，失去外交豁免权。",
          "beneficiary": "智利、荷兰等国代表",
          "payer": "你"
        }
      }
    ]
  },
  "india-independence-1947": {
    "trajectory": {
      "historicalPath": "保留宣读法案和移交文件的行动链，使印度独立按历史发生。",
      "preservedResult": "印度结束英国殖民统治并独立，分治同时引发大规模迁徙与冲突。",
      "decisiveFork": "改变移交文件被签署的结果，阻止印度独立。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "宣读独立法案",
        "label": "在午夜钟声敲响后，你登上讲台，用英语和印地语宣读《印度独立法案》全文，然后将法案与权力移交文件一并递交给蒙巴顿总督签字。",
        "intent": "保留宣读法案和移交文件的行动链，使印度独立按历史发生。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "宣读法案并递交文件",
          "target": "制宪会议全体代表及蒙巴顿总督",
          "deadline": "1947年8月15日午夜钟声后立即"
        },
        "instantEcho": {
          "directResult": "全场欢呼，蒙巴顿签字，印度自治领正式成立，分治随之开始。",
          "unexpectedCost": "你因宣读成为分治暴力的象征，次日收到死亡恐吓信。",
          "beneficiary": "印度国民大会党及总理尼赫鲁",
          "payer": "你本人（承担个人安全风险）"
        }
      },
      {
        "id": "B",
        "displayLabel": "撕毁移交文件",
        "label": "在午夜钟声敲响后，你从公文包中抽出《印度独立法案》和权力移交文件，当众撕成两半，并宣称印度将继续受英国统治。",
        "intent": "改变移交文件被签署的结果，阻止印度独立。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "撕毁文件并宣布继续英国统治",
          "target": "印度独立法案及权力移交文件",
          "deadline": "1947年8月15日午夜钟声后立即"
        },
        "instantEcho": {
          "directResult": "全场哗然，蒙巴顿下令逮捕你，独立仪式暂停，英军重新控制会场。",
          "unexpectedCost": "你被当场逮捕，但分治已无法逆转——穆斯林联盟代表宣布在拉合尔单方面成立巴基斯坦。",
          "beneficiary": "英国殖民当局及蒙巴顿总督",
          "payer": "你本人（被逮捕并面临叛国罪指控）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "交给尼赫鲁宣读",
        "label": "在午夜钟声敲响后，你将法案文本递给尼赫鲁，示意由他代表印度人民宣读独立法案，然后你接过宣读后的法案转交蒙巴顿签字。",
        "intent": "保留独立结果，但让尼赫鲁宣读以增强其合法性。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "将法案递给尼赫鲁宣读并转交蒙巴顿",
          "target": "尼赫鲁及蒙巴顿总督",
          "deadline": "1947年8月15日午夜钟声后立即"
        },
        "instantEcho": {
          "directResult": "尼赫鲁宣读法案，全场掌声，蒙巴顿签字，印度独立成立。",
          "unexpectedCost": "你因让出宣读机会被英方指责失职，次日被调离职位。",
          "beneficiary": "尼赫鲁（个人声望提升）",
          "payer": "你本人（失去秘书职位）"
        }
      },
      {
        "id": "B",
        "displayLabel": "宣布分治延期",
        "label": "在午夜钟声敲响后，你推开独立文件，宣布根据蒙巴顿总督的最新指令，分治将延期三个月，以便完善边界划分。",
        "intent": "改变分治立即生效的结果，推迟分治以减缓冲突。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "宣布分治延期三个月",
          "target": "制宪会议全体代表及蒙巴顿总督",
          "deadline": "1947年8月15日午夜钟声后立即"
        },
        "instantEcho": {
          "directResult": "蒙巴顿否认有此指令，穆斯林联盟代表离场，真纳在卡拉奇宣布巴基斯坦独立并开始迁徙。",
          "unexpectedCost": "你因假传指令被当场解职并逮捕，分治虽未正式生效，但实际已开始。",
          "beneficiary": "英国殖民当局（推迟了法律程序）",
          "payer": "你本人（被逮捕并判刑）"
        }
      }
    ]
  },
  "sputnik-1957": {
    "trajectory": {
      "historicalPath": "R-7火箭末级发动机关机前，制导工程师在控制台手动延长燃烧指令，使卫星达到入轨速度。",
      "preservedResult": "苏联发射斯普特尼克一号，成为首颗进入地球轨道的人造卫星。",
      "decisiveFork": "末级发动机关机前数秒，制导工程师是否延长燃烧或改变推力方向"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "手动延长末级燃烧",
        "label": "你必须在末级发动机关机前，在制导控制台输入手动延长燃烧指令，使R-7末级多工作2.3秒，将卫星加速至入轨速度。",
        "intent": "保留真实历史中制导工程师手动修正速度不足的操作，确保卫星进入轨道。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "在制导控制台输入手动延长燃烧指令",
          "target": "R-7火箭末级发动机",
          "deadline": "末级发动机预定关机前（约剩余5秒）"
        },
        "instantEcho": {
          "directResult": "末级发动机多燃烧2.3秒，卫星速度达到8020米/秒，成功入轨。",
          "unexpectedCost": "你因违规操作受到上级训斥，但未影响职业生涯。",
          "beneficiary": "苏联航天计划",
          "payer": "美方"
        }
      },
      {
        "id": "B",
        "displayLabel": "紧急制动使卫星坠毁",
        "label": "你必须在末级发动机关机前，通过紧急通讯向发射指挥官报告遥测速度足够，但故意谎称卫星异常，建议立刻关机以中止任务，使卫星坠毁。",
        "intent": "改变真实历史：由延长变为提前关机，卫星未能入轨。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "通过紧急通讯谎报卫星异常并建议立刻关机",
          "target": "发射指挥官（拜科努尔发射场）",
          "deadline": "末级发动机关机前（约剩余10秒）"
        },
        "instantEcho": {
          "directResult": "指挥官命令提前关机，卫星未入轨，坠入太平洋。",
          "unexpectedCost": "你因谎报被同事孤立，但未受正式处分。",
          "beneficiary": "美方",
          "payer": "苏联航天计划"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "手动调整陀螺仪姿态角",
        "label": "你必须在末级发动机关机前，调整制导系统陀螺仪偏角，使火箭飞行轨迹上仰，等效获得额外速度增量，确保卫星入轨。",
        "intent": "使用不同杠杆（陀螺仪调整）保留同一真实历史结果。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "手动调整制导系统陀螺仪偏角参数",
          "target": "R-7火箭制导系统陀螺仪",
          "deadline": "末级发动机预定关机前（约剩余5秒）"
        },
        "instantEcho": {
          "directResult": "火箭上仰，末级关机时卫星速度达到8020米/秒，成功入轨。",
          "unexpectedCost": "你因操作违规被警告，但卫星成功入轨。",
          "beneficiary": "苏联航天计划",
          "payer": "美方"
        }
      },
      {
        "id": "B",
        "displayLabel": "伪造燃料耗尽指令关机",
        "label": "你必须在末级发动机关机前，向发射指挥官谎报遥测燃料异常消耗，要求立即关机，使卫星无法入轨。",
        "intent": "通过虚假信息改变关机决定，使卫星坠毁。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "向发射指挥官谎报燃料异常消耗并建议关机",
          "target": "发射指挥官（拜科努尔发射场）",
          "deadline": "末级发动机关机前（约剩余8秒）"
        },
        "instantEcho": {
          "directResult": "指挥官命令提前关机，卫星未达到入轨速度，坠入大气层。",
          "unexpectedCost": "事后调查发现谎报，你被调离岗位，但未受刑事处罚。",
          "beneficiary": "美方",
          "payer": "你（承担失势代价）"
        }
      }
    ]
  },
  "oil-crisis-1973": {
    "trajectory": {
      "historicalPath": "你作为起草员，在1973年10月17日科威特会议上提交一份决议草案，规定所有阿拉伯石油输出国组织成员国自当日起每月减产5%，直至以色列撤出占领领土，该草案被部长会议采纳并表决通过。",
      "preservedResult": "阿拉伯产油国10月17日决定减产，部分成员随后对美国等支持以色列的国家实施禁运，国际油价暴涨并冲击全球经济。",
      "decisiveFork": "你能够在决议草案提交阶段修改条款内容，或在会议后改变决议的执行或传达方式。"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "起草并提交减产决议",
        "label": "你在部长会议表决前一小时，将亲手起草的决议草案提交给会议主席沙特石油大臣亚马尼，草案规定‘各成员国自10月17日起每日减产5%，此后每月再减产5%直至以色列撤出占领区’，并请求主席将其列为唯一正式草案。",
        "intent": "保留真实历史中减产决议的起草和提交流程，确保决议被正式审议。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "起草并提交包含逐月减产5%条文的决议草案给亚马尼",
          "target": "沙特石油大臣亚马尼（部长会议主席）",
          "deadline": "部长会议表决前一小时（即1973年10月17日会议进行中）"
        },
        "instantEcho": {
          "directResult": "亚马尼接过草案并宣布将其作为唯一正式草案讨论，各国部长开始辩论，真实历史中的减产决议将在表决中通过。",
          "unexpectedCost": "伊拉克代表阿卜杜勒-阿米尔·安巴里当场质疑草案未包含伊拉克额外产量配额，你被要求会后提交技术说明。",
          "beneficiary": "阿拉伯石油输出国组织（减产推高油价，增加产油国收入）",
          "payer": "你（需额外准备技术说明，但无损于主要行动）"
        }
      },
      {
        "id": "B",
        "displayLabel": "改写决议移交产量控制",
        "label": "你在亚马尼即将宣布表决前，冲上讲台夺过草案，用钢笔划掉所有减产数字，改写成‘各成员国立即将本国产油设施经营权移交阿拉伯联合工业总局（新设机构），由该局按反以需求统一分配产量’，并高声要求部长们就此表决。",
        "intent": "改变真实历史中各国自主减产的模式，将产量决策权集中至新的超国家机构。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "抢夺草案并用钢笔改写，将减产决策权转移至阿拉伯联合工业总局",
          "target": "沙特石油大臣亚马尼（部长会议主席）及阿拉伯联合工业总局（你临时创设）",
          "deadline": "部长会议表决开始前（即1973年10月17日会议进行中）"
        },
        "instantEcho": {
          "directResult": "会场哗然，亚马尼敲锤否决修改稿，但伊拉克、阿尔及利亚代表起立支持你。已散发的改写稿引发激烈争论，原减产决议当天未能投票，会议延至次日。",
          "unexpectedCost": "沙特警卫将你带离会议厅，随后你被OPEC秘书处解职，并被要求立即离开科威特。",
          "beneficiary": "伊拉克和阿尔及利亚（获得挑战沙特主导地位的机会）",
          "payer": "你（被解职并面临驱逐）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "发送减产通知电报",
        "label": "你在部长会议结束后，冒充科威特电讯员，用阿拉伯石油输出国组织秘书长的名义向各成员国石油公司及壳牌、标致等西方企业拍发密电，电文为‘减产决议即日生效：各国自10月17日起每日减产5%，此后每月再减5%，立即执行’，并附上亚马尼签字影印件。",
        "intent": "替代原电讯员，确保减产决议被迅速传达和执行。",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "以秘书长名义拍发减产决议电报",
          "target": "各成员国石油公司与壳牌、标致等西方企业",
          "deadline": "当日下午5时（部长会议结束后立即传达）"
        },
        "instantEcho": {
          "directResult": "电报发出后半小时，沙特阿美通知美国客户次日将减产5%，国际油价开始飙升，禁运链条启动。",
          "unexpectedCost": "科威特电讯局局长发现你越权操作，向OPEC秘书处投诉，你被书面警告。",
          "beneficiary": "阿拉伯石油输出国组织（减产决议被迅速执行）",
          "payer": "你（受投诉但无实质处罚）"
        }
      },
      {
        "id": "B",
        "displayLabel": "披露产能数据揭弊",
        "label": "你在会议结束后潜入记录室，复印沙特、伊朗、伊拉克三国实际产能档案，并用会议厅电话匿名告知亚马尼助手：‘经核对，沙特实际可减产量比申报值低三成，伊拉克高报两成，按原比率无法公平减产，请重算配额。’",
        "intent": "通过揭露数据不实，破坏原减产决议的执行基础，迫使重新协商。",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "复印三国产能档案并匿名电话告知亚马尼助手数据不实",
          "target": "亚马尼的助手（姓名不详，但能直接联系）",
          "deadline": "当天深夜（记录室无人时）"
        },
        "instantEcho": {
          "directResult": "亚马尼助手次日将情况报告，亚马尼要求紧急会议重审决议，原减产方案暂缓执行，各国互相指责隐瞒数据。",
          "unexpectedCost": "记录室监控拍到你的行动，科威特警方次日发布通缉令，你被迫逃往黎巴嫩。",
          "beneficiary": "伊朗（其多报产能未被揭露，短暂受益于决议停滞）",
          "payer": "你（被通缉并永久流亡）"
        }
      }
    ]
  },
  "chernobyl-1986": {
    "trajectory": {
      "historicalPath": "在反应堆功率异常波动时，手动启动紧急停堆系统并通知控制室主任疏散警报。",
      "preservedResult": "四号反应堆爆炸并释放大量放射性物质，事故造成长期人员与环境影响。",
      "decisiveFork": "改变控制关系（违抗上级命令并反向指挥），改变命令方向（不按程序停堆而直接断电），改变结果（不发生爆炸）"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "按下紧急停堆",
        "label": "你在功率异常时，在控制台前按下AZ-5按钮，手动启动紧急停堆系统，并向控制室主任弗拉基米尔·布里卡诺夫报告参数，要求按程序发布疏散警报。",
        "intent": "保留真实历史中紧急停堆按钮被按下但功率骤增导致爆炸的行动链",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "按下AZ-5按钮",
          "target": "四号机组控制台紧急停堆按钮",
          "deadline": "反应堆功率越过安全极限前"
        },
        "instantEcho": {
          "directResult": "反应堆功率在数秒内急剧上升，达到爆炸临界点，四号反应堆发生爆炸，放射性物质大量释放，与actualHistory一致。",
          "unexpectedCost": "你受到爆炸冲击波和辐射，被送往普里皮亚季医院。",
          "beneficiary": "历史进程（真实结果按时发生）",
          "payer": "你（受伤）"
        }
      },
      {
        "id": "B",
        "displayLabel": "拒绝按下紧急停堆",
        "label": "你在功率异常时，拒绝执行副首席反应堆工程师阿纳托利·迪亚特洛夫的停堆命令，同时命令操作员切断控制棒供电，并自行通过广播发布全厂疏散警报，要求所有人员立即撤离至安全区。",
        "intent": "改变控制关系（违抗上级命令并反向指挥），改变命令方向（不按程序停堆而直接断电），改变结果（不发生爆炸）",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "拒绝迪亚特洛夫的停堆命令，命令操作员切断控制棒供电，并广播发布疏散警报",
          "target": "控制室人员及全厂广播系统",
          "deadline": "反应堆功率越过安全极限前"
        },
        "instantEcho": {
          "directResult": "控制棒因断电无法插入，但反应堆功率因手动控制降低而稳定；全厂人员开始按警报疏散，避免大规模辐射释放。",
          "unexpectedCost": "你因抗命被当场逮捕，随后被送往莫斯科接受军事审判。",
          "beneficiary": "全厂人员和周边居民（避免灾难）",
          "payer": "你（失势并被追捕）"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "强行推入控制棒",
        "label": "你在功率异常且自动保护失效时，与操作员列昂尼德·托普图诺夫一同，在控制室手动强行推入备用控制棒（未按规程先请求授权），并命令值班工程师通知厂长维克托·布留哈诺夫发布疏散警报。",
        "intent": "使用另一人物（托普图诺夫）和器物（备用控制棒）执行同一真实历史轨道（爆炸发生）",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "与托普图诺夫手动推入备用控制棒，并命令值班工程师通知布留哈诺夫发布疏散警报",
          "target": "四号机组备用控制棒及值班工程师",
          "deadline": "反应堆功率越过安全极限前"
        },
        "instantEcho": {
          "directResult": "备用控制棒推入后未能有效减速，反应堆功率失控，爆炸发生放射性物质释放，与actualHistory一致。",
          "unexpectedCost": "你和托普图诺夫受到严重辐射，后送医不治。",
          "beneficiary": "历史进程（真实结果按时发生）",
          "payer": "你和托普图诺夫（死亡）"
        }
      },
      {
        "id": "B",
        "displayLabel": "启动注水系统",
        "label": "你在功率异常时，不执行常规停堆程序，而是直接绕过迪亚特洛夫，命令现场工程师打开应急给水阀门，向堆芯注入大量硼水，同时指令控制室操作员切断所有保护系统电源，并亲自通过厂内电话要求疏散。",
        "intent": "改变命令方向（不停堆而注水），改变控制关系（绕过上级直接指挥），改变结果（堆芯冷却稳定）",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "命令现场工程师打开应急给水阀门注入硼水，指令操作员切断保护系统电源，并电话要求疏散",
          "target": "现场工程师、控制室操作员、厂内电话系统",
          "deadline": "反应堆功率越过安全极限前"
        },
        "instantEcho": {
          "directResult": "硼水注入后反应堆功率下降，堆芯温度稳定，未发生爆炸，但部分设备因断电受损。疏散开始，部分人员受低剂量辐射。",
          "unexpectedCost": "你因擅自更改流程且损坏设备，被送往莫斯科接受调查。",
          "beneficiary": "全厂人员和周边居民（避免灾难）",
          "payer": "你（失势并被追捕）"
        }
      }
    ]
  },
  "soviet-dissolution-1991": {
    "trajectory": {
      "historicalPath": "戈尔巴乔夫签署辞职令→移交核武指挥权→发表电视讲话→降旗→苏联解体",
      "preservedResult": "戈尔巴乔夫宣布辞去苏联总统职务，苏联国旗降下，国家正式走向解体。",
      "decisiveFork": "电视直播前五分钟内，是否完成辞职稿交付与核武指挥权移交"
    },
    "choices": [
      {
        "id": "A",
        "displayLabel": "递交辞职讲话稿",
        "label": "你在直播开始前将打印好的辞职讲话稿递到戈尔巴乔夫手中，同时把核武指挥权移交确认书放在他桌上并指给他签名处，确保他签署后交叶利钦代表。",
        "intent": "保留真实历史中戈尔巴乔夫辞职与核武指挥权移交的行动链",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "将辞职讲话稿递给戈尔巴乔夫，并将核武指挥权移交确认书置于他面前，指示他在签名处签字后交给叶利钦代表布尔布利斯",
          "target": "戈尔巴乔夫、辞职讲话稿、核武指挥权移交确认书、布尔布利斯",
          "deadline": "全国电视直播前五分钟"
        },
        "instantEcho": {
          "directResult": "戈尔巴乔夫按稿宣读辞职声明，苏联国旗从克里姆林宫降下，核武指挥权移交叶利钦",
          "unexpectedCost": "克格勃记录你为移交协助者，后续对你进行审查，你失去秘书职位",
          "beneficiary": "叶利钦与俄罗斯联邦",
          "payer": "你个人"
        }
      },
      {
        "id": "B",
        "displayLabel": "销毁核武移交指令",
        "label": "你在直播开始前从戈尔巴乔夫桌上取走核武指挥权移交书面指令并当场撕毁，同时命令通信室切断安德烈耶夫线路，阻止核武指挥权传递。",
        "intent": "更改核武控制权的移交方向，阻止叶利钦即时获得指挥权",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "从戈尔巴乔夫桌上拿起核武指挥权移交指令撕毁，并对通信室值班员下令关闭安德烈耶夫加密线路",
          "target": "核武指挥权移交指令、安德烈耶夫通信线路、通信室值班员",
          "deadline": "全国电视直播前五分钟"
        },
        "instantEcho": {
          "directResult": "核武指挥权未移交叶利钦，电视直播照常但核武控制陷入争议，乌克兰和哈萨克斯坦提出分享主张",
          "unexpectedCost": "通信室值班员报告你的行为，你被安全人员当场带离审讯",
          "beneficiary": "乌克兰与哈萨克斯坦获得核武谈判窗口",
          "payer": "你个人失去自由与职位"
        }
      }
    ],
    "rollChoices": [
      {
        "id": "A",
        "displayLabel": "移交核武控制钥匙",
        "label": "你在直播开始前从保险柜取出核武控制钥匙实物，当面交给叶利钦驻克里姆林宫代表布尔布利斯，并请他签署接收函，完成移交程序。",
        "intent": "通过另一程序——实物钥匙移交——确保核武指挥权按时传递到叶利钦手中",
        "deviationClass": "nudge",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "从保险柜中取出核武控制钥匙，走到布尔布利斯面前交给他，同时递上接收函请他签字",
          "target": "核武控制钥匙、叶利钦代表布尔布利斯、接收函",
          "deadline": "全国电视直播开始时"
        },
        "instantEcho": {
          "directResult": "叶利钦即时获得核武控制钥匙，苏联解体进程按历史完成，核武指挥权顺利移交",
          "unexpectedCost": "钥匙交接过程被布尔布利斯随从录影，你成为解体象征性人物，此后无法在政界立足",
          "beneficiary": "叶利钦与俄罗斯联邦",
          "payer": "你个人政治生涯"
        }
      },
      {
        "id": "B",
        "displayLabel": "扣押辞职讲话底稿",
        "label": "你在直播开始前将戈尔巴乔夫辞职讲话的唯一正式底稿锁入办公室保险柜，并口头告知他导弹部队已接到指令只服从国防部长沙波什尼科夫，而非他的辞职命令。",
        "intent": "阻止戈尔巴乔夫照稿宣读辞职声明，并改变军队效忠对象",
        "deviationClass": "reform",
        "usesModernKnowledge": false,
        "actionSpec": {
          "actor": "你",
          "action": "将戈尔巴乔夫桌上的辞职讲话底稿收起锁入保险柜，然后对他说：“部长会议已通知导弹部队，他们只听从沙波什尼科夫的命令，而不是您的辞职。”",
          "target": "辞职讲话底稿、保险柜、戈尔巴乔夫、导弹部队指挥链",
          "deadline": "全国电视直播开始前三分钟"
        },
        "instantEcho": {
          "directResult": "直播推迟，戈尔巴乔夫未辞职，宪法秩序争议持续，但各共和国加速独立进程",
          "unexpectedCost": "沙波什尼科夫随即公开否认你的说法，你被指控伪造命令并逮捕，面临长期监禁",
          "beneficiary": "苏联强硬派与军队高层暂时维持指挥链",
          "payer": "你个人自由与未来"
        }
      }
    ]
  }
} as const satisfies Record<string, FixedOpeningChoiceEntry>;
