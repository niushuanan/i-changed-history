import type { TimelineTurn } from "../game/schema";

export type FixedOpeningChoiceEntry = Readonly<{
  trajectory: Readonly<{ historicalPath: string; preservedResult: string; decisiveFork: string }>;
  choices: readonly [TimelineTurn["choices"][0], TimelineTurn["choices"][1]];
  rollChoices: readonly [TimelineTurn["rollChoices"][0], TimelineTurn["rollChoices"][1]];
}>;

export const FIXED_OPENING_CHOICES = {
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
  }
} as const satisfies Record<string, FixedOpeningChoiceEntry>;
