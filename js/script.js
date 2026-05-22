// ============ 科研黄历 - JavaScript ============

const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

let currentDate = new Date();
let selectedDate = new Date();
let currentView = 'month';

// 缓存设备种子，避免重复计算
let cachedDeviceSeed = null;

// ============ 科研图标 SVG ============
const scienceIcons = {
    beaker: `<svg viewBox="0 0 40 40" style="display:block;margin:auto;"><path d="M14 6L14 14L10 30C10 32.2 11.8 34 14 34H26C28.2 34 30 32.2 30 30L26 14V6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 6H28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,

    tube: `<svg viewBox="0 0 40 40" style="display:block;margin:auto;"><g transform="translate(20 20) rotate(30) translate(-20 -20)"><path d="M17 8L17 28C17 29.7 18.3 31 20 31C21.7 31 23 29.7 23 28V8" stroke="currentColor" stroke-width="2" fill="none"/><ellipse cx="20" cy="8" rx="3" ry="1.2" stroke="currentColor" stroke-width="2" fill="none"/><line x1="19" y1="14" x2="21" y2="14" stroke="currentColor" stroke-width="1.5" opacity="0.5"/><line x1="19" y1="20" x2="21" y2="20" stroke="currentColor" stroke-width="1.5" opacity="0.5"/></g></svg>`,

    computer: `<svg viewBox="0 0 40 40" style="display:block;margin:auto;"><rect x="8" y="8" width="24" height="16" rx="1.5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 20H32" stroke="currentColor" stroke-width="2"/><path d="M17 26H23V29H17V26Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 29H26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,

    atom: `<svg viewBox="0 0 40 40" style="display:block;margin:auto;"><circle cx="20" cy="20" r="3" fill="currentColor"/><ellipse cx="20" cy="20" rx="12" ry="5" stroke="currentColor" stroke-width="1.5" fill="none" transform="rotate(0 20 20)"/><ellipse cx="20" cy="20" rx="12" ry="5" stroke="currentColor" stroke-width="1.5" fill="none" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="12" ry="5" stroke="currentColor" stroke-width="1.5" fill="none" transform="rotate(120 20 20)"/></svg>`,

    dna: `<svg viewBox="0 0 40 40" style="display:block;margin:auto;"><path d="M12 10C12 10 12 18 20 18C28 18 28 26 28 26" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M28 10C28 10 28 18 20 18C12 18 12 26 12 26" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><line x1="14" y1="14" x2="26" y2="14" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><line x1="14" y1="22" x2="26" y2="22" stroke="currentColor" stroke-width="1.5" opacity="0.6"/></svg>`,

    rocket: `<svg viewBox="0 0 40 40" style="display:block;margin:auto;"><path d="M20 6C20 6 26 12 26 22C26 25 25 28 25 28H15C15 28 14 25 14 22C14 12 20 6 20 6Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><circle cx="20" cy="18" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M15 28L12 33H18L19 28" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M25 28L28 33H22L21 28" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,

    car: `<svg viewBox="0 0 40 40" style="display:block;margin:auto;"><path d="M8 26V20C8 18 9 16 11 16H14L16 12H24L26 16H29C31 16 32 18 32 20V26" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M8 22H32" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="26" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="28" cy="26" r="3" stroke="currentColor" stroke-width="2" fill="none"/></svg>`
};

const iconColors = ['#FF9A9E', '#FF6B6B', '#FFB347', '#FFD93D', '#C9B1FF', '#98D8C8', '#7EC8E3'];

// ============ 科研运势数据库（按领域分类） ============
const fieldFortunes = {
    // 化学、环境工程、材料学
    chemistry: {
        sentences: [
            "今日化学反应顺利进行，产率超出预期，适合开展合成实验！",
            "材料表征数据清晰，结构解析顺利，表征仪器状态极佳。",
            "催化剂活性稳定，反应选择性高，是优化工艺的好时机。",
            "今日适合进行环境样品采集，监测数据准确可靠。",
            "材料合成条件摸索顺利，找到了最佳配比方案。",
            "色谱分离效果出色，纯化效率大幅提升。",
            "今日适合进行材料性能测试，数据重复性良好。",
            "化学计算模拟结果与实验吻合，理论预测准确。",
            "今日适合撰写材料学论文，实验部分描述清晰。",
            "环境数据分析发现新趋势，值得深入研究！"
        ],
        templates: [
            "家人们！今日实验运直接起飞，宜{宜}，冲就完事了！",
            "化学之神降临，今日宜{宜}，忌{忌}，懂的都懂。",
            "试管在召唤，今日宜{宜}，属于是泼天的富贵轮到你了！",
            "今日实验buff叠满，宜{宜}，but忌{忌}，别粗心大意！",
            "DNA动了！今日宜{宜}，实验室天选之子就是你。",
            "化学人化学魂，今日宜{宜}，产出直接遥遥领先！",
            "今日产率狠狠拿捏，宜{宜}，忌{忌}，听劝！",
            "实验台已就位，今日宜{忌}不如宜{宜}，行动起来！",
            "今日催化剂状态绝绝子，宜{宜}，怕是要发顶刊了！",
            "听说今天{宜}的人都发Nature了，不信你试试？"
        ],
        keywords: ["做合成实验", "调试催化剂", "表征新材料", "纯化产物", "测红外光谱", "优化反应条件", "摸索配比", "解晶体结构", "采环境样品", "测材料性能"]
    },
    // 计算机、软件、人工智能
    computer: {
        sentences: [
            "今日代码运行丝般顺滑，bug退散，是编程的良辰吉日！",
            "算法优化效果显著，时间复杂度大幅降低，效率翻倍。",
            "模型训练收敛迅速，准确率创新高，调参如有神助。",
            "今日适合进行代码重构，程序结构更加清晰优雅。",
            "数据处理脚本运行流畅，批量处理事半功倍。",
            "今日适合学习新框架，文档阅读效率高，上手快。",
            "代码审查顺利通过，代码质量获得团队认可。",
            "今日适合部署上线，CI/CD流程顺畅，无意外。",
            "数据库查询优化成功，响应速度显著提升。",
            "今日适合撰写技术文档，逻辑清晰，表达准确。"
        ],
        templates: [
            "bug退散！今日宜{宜}，代码直接丝滑到飞起！",
            "家人们谁懂啊，今日代码运竟然没报错，宜{宜}冲冲冲！",
            "今日编程buff已叠满，宜{宜}，忌{忌}，别问我怎么知道的。",
            "键盘已就位，今日宜{宜}，属于是程序员的高光时刻！",
            "今日代码质量遥遥领先，宜{宜}，忌{忌}，听劝！",
            "Git status一片绿，今日宜{宜}，提交记录要上天了！",
            "今日编译0 error 0 warning，宜{宜}，这波稳了！",
            "Stack Overflow都不用查，今日宜{宜}，灵感直接溢出！",
            "今日适合{宜}，but忌{忌}，别把电脑搞炸了！",
            "听说今天{宜}的人都不加班，信不信由你！"
        ],
        keywords: ["写代码", "优化算法", "训练模型", "重构代码", "处理数据", "学新框架", "重构项目", "部署上线", "优化数据库", "写技术文档"]
    },
    // 物理、核科学、量子
    physics: {
        sentences: [
            "今日物理实验数据精准，误差控制出色，结果可靠！",
            "理论推导思路清晰，公式推导顺利，物理直觉敏锐。",
            "量子计算模拟结果稳定，量子态保真度高。",
            "今日适合进行精密测量，仪器校准准确，数据可信。",
            "核物理实验安全规范，探测器响应正常，数据采集顺利。",
            "今日适合推导理论模型，数学推导严谨无误。",
            "光学实验光路调试顺利，干涉条纹清晰可辨。",
            "今日适合进行数值模拟，计算结果收敛稳定。",
            "粒子探测效率正常，本底噪声控制良好。",
            "今日适合撰写物理论文，理论框架搭建完整。"
        ],
        templates: [
            "薛定谔的猫都说今日宜{宜}，这波稳了！",
            "物理定律站在你这边，今日宜{宜}，忌{忌}，莫要违背！",
            "量子纠缠到你了！今日宜{宜}，实验直接起飞！",
            "牛顿看了都点赞，今日宜{宜}，属于是物理人的浪漫！",
            "今日误差小到可以忽略，宜{宜}，忌{忌}，听劝！",
            "实验室仪器今日状态绝绝子，宜{宜}，数据直接可用！",
            "爱因斯坦附体，今日宜{宜}，灵感直接溢出！",
            "今日实验精度遥遥领先，宜{宜}，怕是要改写教科书！",
            "测不准原理今日失效，宜{宜}，狠狠期待住了！",
            "听说今天{宜}的人都发PRL了，你确定不试试？"
        ],
        keywords: ["做物理实验", "推导公式", "精密测量", "跑数值模拟", "建理论模型", "调光路", "采集数据", "校准仪器", "做计算物理", "操作探测器"]
    },
    // 生物、医学、基因工程
    biology: {
        sentences: [
            "今日细胞培养状态良好，生长曲线正常，实验条件稳定！",
            "基因测序数据质量高，比对率令人满意，分析顺利。",
            "蛋白表达量丰富，纯化回收率高，Western blot条带清晰。",
            "今日适合进行PCR实验，扩增效率稳定，无杂带。",
            "显微镜观察细胞形态正常，染色效果清晰，拍照顺利。",
            "今日适合进行动物实验，操作规范，数据记录完整。",
            "流式细胞仪分析顺利，分选纯度高，数据可靠。",
            "今日适合提取DNA/RNA，纯度和浓度都达标。",
            "克隆实验阳性率高，菌落生长良好，测序验证成功。",
            "今日适合撰写生物学论文，图表制作精美专业。"
        ],
        templates: [
            "细胞们今日状态满分！宜{宜}，忌{忌}，别辜负它们！",
            "DNA双螺旋都在跳舞，今日宜{宜}，冲就完事了！",
            "生物学之神降临，今日宜{宜}，实验结果直接YYDS！",
            "Western blot条带今日清晰到离谱，宜{宜}，绝绝子！",
            "今日PCR扩增效率遥遥领先，宜{宜}，忌{忌}，听劝！",
            "培养箱里的细胞说：今日宜{宜}，我们准备好了！",
            "今日测序数据质量拉满，宜{宜}，属于是生物人的狂欢！",
            "显微镜下全是惊喜，今日宜{宜}，忌{忌}，加油！",
            "今日克隆阳性率狠狠拿捏，宜{宜}，怕是要发Cell了！",
            "听说今天{宜}的人都跑出漂亮条带了，你还不冲？"
        ],
        keywords: ["养细胞", "做基因测序", "表达蛋白", "跑PCR", "用显微镜", "做动物实验", "流式分选", "提DNA/RNA", "做克隆实验", "画论文图"]
    },
    // 航天、航空、天文学
    aerospace: {
        sentences: [
            "今日轨道计算精准，预测结果与观测数据高度吻合！",
            "航天器姿态控制稳定，传感器数据正常，系统运行良好。",
            "天文观测条件极佳，大气视宁度好，成像清晰锐利。",
            "今日适合进行轨道优化，燃料消耗计算准确，方案可行。",
            "飞行器气动仿真收敛顺利，流场分析结果合理。",
            "今日适合处理卫星遥感数据，图像校正精度高。",
            "推进系统测试顺利，推力曲线平稳，性能达标。",
            "今日适合进行导航算法验证，定位精度满足要求。",
            "空间环境模拟实验顺利，热控设计验证通过。",
            "今日适合撰写航天领域论文，创新性得到认可。"
        ],
        templates: [
            "星辰大海在召唤！今日宜{宜}，忌{忌}，冲出地球！",
            "马斯克看了都沉默，今日宜{宜}，航天人直接起飞！",
            "今日轨道精度遥遥领先，宜{宜}，属于是太空级buff！",
            "火箭发动机今日状态满分，宜{宜}，冲就完事了！",
            "今日观测数据绝绝子，宜{宜}，忌{忌}，别乱搞！",
            "卫星都在为你打call，今日宜{宜}，狠狠期待住了！",
            "今日仿真收敛快到离谱，宜{宜}，这波稳上天了！",
            "航天之神降临，今日宜{宜}，怕是要发现新星球！",
            "今日测控信号拉满，宜{宜}，忌{忌}，听劝！",
            "听说今天{宜}的人都收到NASA offer了，信不信由你！"
        ],
        keywords: ["算轨道", "调姿态控制", "天文观测", "跑气动仿真", "优化轨道", "处理遥感数据", "测试推进系统", "调导航算法", "做热控验证", "写航天论文"]
    },
    // 机械、自动化、车辆工程
    mechanical: {
        sentences: [
            "今日机械加工精度达标，零件尺寸符合图纸要求！",
            "自动化控制系统运行稳定，PID参数整定完美。",
            "车辆动力学仿真结果准确，操控性能预测可靠。",
            "今日适合进行机构设计，运动学分析顺利，无干涉。",
            "传感器标定准确，数据采集同步性好，噪声低。",
            "今日适合进行有限元分析，网格划分合理，结果收敛。",
            "机械装配过程顺利，配合精度高，运转灵活。",
            "今日适合调试机器人程序，轨迹规划平滑，无抖动。",
            "液压系统压力稳定，流量控制精准，响应迅速。",
            "今日适合撰写机械设计论文，创新点突出，结构合理。"
        ],
        templates: [
            "齿轮今日转得飞起！宜{宜}，忌{忌}，机械人的福音！",
            "今日加工精度遥遥领先，宜{宜}，属于是工匠级操作！",
            "PID参数今日自动整定，宜{宜}，冲就完事了！",
            "机器人说：今日宜{宜}，我的关节已润滑！",
            "今日仿真结果绝绝子，宜{宜}，忌{忌}，别乱来！",
            "有限元分析今日收敛快到离谱，宜{宜}，这波稳了！",
            "今日装配顺利到哭，宜{宜}，属于是机械人的浪漫！",
            "液压系统今日状态满分，宜{宜}，狠狠拿捏了！",
            "传感器今日灵敏到离谱，宜{宜}，忌{忌}，听劝！",
            "听说今天{宜}的人都拿到专利了，你还不动手？"
        ],
        keywords: ["机加工零件", "调PID参数", "跑动力学仿真", "设计机构", "标定传感器", "做有限元分析", "装配机械", "调机器人", "调液压系统", "画工程图"]
    }
};

// 通用运势（当没有图标时使用）
const generalFortunes = {
    sentences: [
        "今日灵感如泉涌，科研思路清晰，适合攻克难题！",
        "文献阅读效率极高，可能会发现关键线索，多读几篇吧！",
        "今日适合与导师沟通，汇报进展会得到宝贵建议。",
        "组会汇报准备充分，表达流畅，会得到同门赞赏。",
        "数据分析得心应手，统计结果显著，值得庆祝！",
        "今日适合申请项目基金，文书写作思路清晰。",
        "实验室氛围和谐，与同事合作愉快，团队效率高。",
        "文献检索如有神助，找到多篇高相关度论文。",
        "今日适合学习新技能，研究方法、工具皆可。",
        "今日脑洞大开，创新点子频出，记下这些灵感！",
        "今日适合参加学术会议，networking会有意外收获。",
        "论文修改意见中肯，按建议修改会大幅提升质量。",
        "今日心态平和，适合处理繁琐的文献整理工作。",
        "研究设计思路清晰，方案可行性高，可以开始实施。",
        "今日适合撰写综述，知识框架搭建顺利。",
        "今日审稿意见回复顺利，逐条反驳有理有据。",
        "今日适合制作学术海报，排版美观，内容充实。",
        "文献笔记整理有序，知识体系日渐完善。",
        "今日适合进行跨学科交流，碰撞出新火花。",
        "今日答辩准备充分，回答问题胸有成竹。",
        "研究材料准备齐全，实验进程顺利推进。",
        "今日适合投稿，期刊选择恰当，命中率高。",
        "今日学术社交运佳，结识志同道合的研究伙伴。",
        "研究结果与预期吻合，假设得到验证，可喜可贺！",
        "今日适合写感谢信，表达对他人的感激之情。",
        "文献引用格式检查无误，参考文献列表完美。",
        "今日适合制定研究计划，目标明确，步骤清晰。",
        "实验安全无事故，操作规范，值得表扬！",
        "今日适合申请专利，创新点挖掘充分。",
        "数据可视化效果惊艳，图表美观专业。"
    ],
    templates: [
        "科研之神今日站在你这边，宜{宜}，忌{忌}，冲就完事了！",
        "今日buff已叠满，宜{宜}，属于是科研人的高光时刻！",
        "导师看了都点赞，今日宜{宜}，忌{忌}，听劝！",
        "今日实验运直接起飞，宜{宜}，怕是要发顶刊了！",
        "家人们谁懂啊，今日宜{宜}，科研之路一片光明！",
        "今日灵感溢出屏幕，宜{宜}，忌{忌}，别浪费！",
        "组会同门都在羡慕，今日宜{宜}，狠狠期待住了！",
        "今日数据漂亮到哭，宜{宜}，这波稳了！",
        "文献都在为你打call，今日宜{宜}，忌{忌}，懂的都懂！",
        "今日科研状态绝绝子，宜{宜}，直接遥遥领先！",
        "Nature编辑在线等稿，今日宜{宜}，冲冲冲！",
        "今日实验台已就位，宜{宜}，忌{忌}，别摸鱼！",
        "科研buff今日拉满，宜{宜}，属于是泼天的富贵！",
        "今日灵感DNA动了，宜{宜}，怕是要改写教科书！",
        "听说今天{宜}的人都中基金了，你确定不试试？"
    ],
    keywords: ["头脑风暴", "读文献", "找导师汇报", "写论文", "理研究思路", "找人合作", "整理实验台", "想新点子", "分析数据", "准备答辩", "投稿", "学新方法", "整理文献", "开组会", "做安全培训", "验证假设", "做探索性实验", "做数据可视化", "写综述", "跨学科学习", "参加学术会议", "审稿", "申请专利", "写基金本子"]
};

const fortuneKeywordsBad = [
    "摸鱼", "催实验结果", "同时开多台仪器", "不备份数据", "通宵做实验",
    "和审稿人吵架", "跳过对照组", "写长代码不注释", "刷学术八卦", "乱花科研经费"
];

// 图标类型到领域的映射
const iconToField = {
    beaker: 'chemistry',    // 烧杯 → 化学
    tube: 'chemistry',      // 试管 → 化学
    computer: 'computer',   // 计算机 → 计算机
    atom: 'physics',        // 原子 → 物理
    dna: 'biology',         // DNA → 生物
    rocket: 'aerospace',    // 火箭 → 航天
    car: 'mechanical'       // 汽车 → 机械
};

// ============ 简化的随机数生成器 ============
function getDeviceSeed() {
    if (cachedDeviceSeed !== null) {
        return cachedDeviceSeed;
    }
    // 简化的设备指纹
    const fingerprint = navigator.userAgent + screen.width + screen.height;
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
        hash = ((hash << 5) - hash) + fingerprint.charCodeAt(i);
        hash = hash & hash;
    }
    cachedDeviceSeed = Math.abs(hash) % 1000000;
    return cachedDeviceSeed;
}

function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function getRandomForDate(year, month, day, offset = 0) {
    const seed = getDeviceSeed() + year * 10000 + month * 100 + day + offset;
    return seededRandom(seed);
}

// ============ 图标生成逻辑 ============
function shouldShowIcon(year, month, day) {
    return getRandomForDate(year, month, day) < 0.35;
}

function getDateIcon(year, month, day) {
    const iconKeys = Object.keys(scienceIcons);
    const iconIndex = Math.floor(getRandomForDate(year, month, day, 100) * iconKeys.length);
    const colorIndex = Math.floor(getRandomForDate(year, month, day, 200) * iconColors.length);
    
    return {
        type: iconKeys[iconIndex],
        color: iconColors[colorIndex]
    };
}

function createIconElement(iconInfo) {
    const div = document.createElement('div');
    div.className = 'icon-on-date';
    div.innerHTML = scienceIcons[iconInfo.type];
    div.style.color = iconInfo.color;
    return div;
}

// ============ 运势生成逻辑 ============
function generateFortune(date, hasIcon = false, iconType = null) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // 确定使用哪个领域的运势
    let fortuneData;
    if (hasIcon && iconType && iconToField[iconType]) {
        const field = iconToField[iconType];
        fortuneData = fieldFortunes[field];
    } else {
        fortuneData = generalFortunes;
    }

    // 先选择关键词
    const goodCount = 3 + Math.floor(getRandomForDate(year, month, day, 600) * 2);
    const goodKeywords = [];
    let randOffset = 0;
    for (let i = 0; i < goodCount; i++) {
        const idx = Math.floor(getRandomForDate(year, month, day, 700 + randOffset) * fortuneData.keywords.length);
        if (!goodKeywords.includes(fortuneData.keywords[idx])) {
            goodKeywords.push(fortuneData.keywords[idx]);
        } else {
            goodKeywords.push(fortuneData.keywords[(idx + 1) % fortuneData.keywords.length]);
        }
        randOffset += 10;
    }

    const badKeywords = [];
    if (!hasIcon) {
        const badCount = 1 + Math.floor(getRandomForDate(year, month, day, 800) * 2);
        randOffset = 0;
        for (let i = 0; i < badCount; i++) {
            const idx = Math.floor(getRandomForDate(year, month, day, 900 + randOffset) * fortuneKeywordsBad.length);
            if (!badKeywords.includes(fortuneKeywordsBad[idx])) {
                badKeywords.push(fortuneKeywordsBad[idx]);
            } else {
                badKeywords.push(fortuneKeywordsBad[(idx + 1) % fortuneKeywordsBad.length]);
            }
            randOffset += 10;
        }
    }

    // 决定使用原版sentence还是template（50%概率）
    const useTemplate = getRandomForDate(year, month, day, 400) < 0.5 && fortuneData.templates;
    
    let sentence;
    if (useTemplate) {
        const templateIndex = Math.floor(getRandomForDate(year, month, day, 450) * fortuneData.templates.length);
        sentence = fortuneData.templates[templateIndex];
        // 替换占位符
        sentence = sentence.replace(/\{宜\}/g, goodKeywords[0] || '搞科研');
        sentence = sentence.replace(/\{忌\}/g, badKeywords[0] || '摸鱼');
    } else {
        const sentenceIndex = Math.floor(getRandomForDate(year, month, day, 500) * fortuneData.sentences.length);
        sentence = fortuneData.sentences[sentenceIndex];
    }

    return {
        sentence: sentence,
        good: goodKeywords,
        bad: badKeywords
    };
}

function displayFortune(date, hasIcon = false, iconType = null) {
    const fortuneText = document.getElementById('fortuneText');
    const fortuneTags = document.getElementById('fortuneTags');

    if (!fortuneText || !fortuneTags) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (checkDate > today) {
        fortuneText.textContent = '这一天尚未到来，"天机"不可泄露...';
        fortuneTags.innerHTML = '';
    } else {
        const fortune = generateFortune(date, hasIcon, iconType);
        fortuneText.textContent = fortune.sentence;

        // 使用 innerHTML 一次性设置，减少 DOM 操作
        const tagsHtml = [
            ...fortune.good.map(keyword => `<span class="fortune-tag 宜">宜${keyword}</span>`),
            ...fortune.bad.map(keyword => `<span class="fortune-tag 忌">忌${keyword}</span>`)
        ].join('');
        fortuneTags.innerHTML = tagsHtml;
    }
}

// ============ 日历渲染 ============
function renderCalendar() {
    const fortuneContainer = document.getElementById('fortuneContainer');
    
    if (currentView === 'month') {
        renderMonthView();
        if (fortuneContainer) fortuneContainer.style.display = 'block';
    } else {
        renderYearView();
        if (fortuneContainer) fortuneContainer.style.display = 'none';
    }
}

function renderMonthView() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthYearEl = document.getElementById('monthYear');
    const weekdaysHeaderEl = document.getElementById('weekdaysHeader');
    const daysGridEl = document.getElementById('daysGrid');
    const calendarContentEl = document.getElementById('calendarContent');
    
    if (monthYearEl) monthYearEl.textContent = `${year}年 ${monthNames[month]}`;
    if (weekdaysHeaderEl) weekdaysHeaderEl.style.display = 'grid';
    if (!daysGridEl) return;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    daysGridEl.innerHTML = '';
    daysGridEl.className = 'days-grid';
    
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // 使用 DocumentFragment 批量添加元素
    const fragment = document.createDocumentFragment();
    
    // 上个月的日期
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const cell = createDayCell(day, true);
        cell.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        fragment.appendChild(cell);
    }
    
    // 当月日期
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = createDayCell(day, false, year, month);
        
        // 今天标记
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            cell.classList.add('today');
        }
        
        // 选中标记
        if (selectedDate && year === selectedDate.getFullYear() && month === selectedDate.getMonth() && day === selectedDate.getDate()) {
            cell.classList.add('selected');
        }
        
        // 添加图标（今天及之前的日期）
        const currentDayDate = new Date(year, month, day);
        const hasIcon = currentDayDate <= todayStart && shouldShowIcon(year, month, day);
        let iconType = null;
        if (hasIcon) {
            const iconInfo = getDateIcon(year, month, day);
            iconType = iconInfo.type;
            cell._numberElement.classList.add('with-icon');
            cell._numberElement.appendChild(createIconElement(iconInfo));
        }

        // 点击事件
        cell.addEventListener('click', () => {
            document.querySelectorAll('.day-cell.selected').forEach(c => c.classList.remove('selected'));
            cell.classList.add('selected');
            selectedDate = new Date(year, month, day);
            displayFortune(selectedDate, hasIcon, iconType);
        });
        
        fragment.appendChild(cell);
    }
    
    // 下个月的日期
    const totalCells = firstDay + daysInMonth;
    const remainingCells = (Math.ceil(totalCells / 7) * 7) - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const cell = createDayCell(day, true);
        cell.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
        fragment.appendChild(cell);
    }
    
    daysGridEl.appendChild(fragment);
    
    // 调整行数样式
    if (calendarContentEl) {
        const rowCount = Math.ceil((firstDay + daysInMonth + remainingCells) / 7);
        calendarContentEl.classList.remove('four-rows', 'five-rows', 'six-rows');
        if (rowCount === 4) {
            calendarContentEl.classList.add('four-rows');
        } else if (rowCount === 5) {
            calendarContentEl.classList.add('five-rows');
        } else {
            calendarContentEl.classList.add('six-rows');
        }
    }
}

function renderYearView() {
    const year = currentDate.getFullYear();
    
    const monthYearEl = document.getElementById('monthYear');
    const weekdaysHeaderEl = document.getElementById('weekdaysHeader');
    const daysGridEl = document.getElementById('daysGrid');
    
    if (monthYearEl) monthYearEl.textContent = `${year}年`;
    if (weekdaysHeaderEl) weekdaysHeaderEl.style.display = 'none';
    if (!daysGridEl) return;

    daysGridEl.innerHTML = '';
    daysGridEl.className = 'year-grid';

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const fragment = document.createDocumentFragment();

    for (let month = 0; month < 12; month++) {
        const monthCell = document.createElement('div');
        monthCell.className = 'year-month-cell';
        if (year === today.getFullYear() && month === today.getMonth()) {
            monthCell.classList.add('current-month');
        }

        const monthName = document.createElement('div');
        monthName.className = 'year-month-name';
        monthName.textContent = monthNames[month];
        monthCell.appendChild(monthName);

        const monthDaysGrid = document.createElement('div');
        monthDaysGrid.className = 'year-days-grid';

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // 上月
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const cell = createYearDayCell(day, true);
            monthDaysGrid.appendChild(cell);
        }

        // 当月
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = createYearDayCell(day, false);
            const currentDayDate = new Date(year, month, day);
            const isPastOrToday = currentDayDate <= today;

            if (isPastOrToday && shouldShowIcon(year, month, day)) {
                const iconInfo = getDateIcon(year, month, day);
                const square = document.createElement('div');
                square.className = 'icon-square';
                square.style.background = iconInfo.color;
                cell.appendChild(square);
            } else if (isPastOrToday) {
                const square = document.createElement('div');
                square.className = 'icon-square gray';
                cell.appendChild(square);
            } else {
                // 未来日期显示白色格子
                const square = document.createElement('div');
                square.className = 'icon-square white';
                cell.appendChild(square);
            }

            monthDaysGrid.appendChild(cell);
        }

        // 下月
        const totalCells = firstDay + daysInMonth;
        const remainingCells = (Math.ceil(totalCells / 7) * 7) - totalCells;
        for (let day = 1; day <= remainingCells; day++) {
            const cell = createYearDayCell(day, true);
            monthDaysGrid.appendChild(cell);
        }

        monthCell.appendChild(monthDaysGrid);
        monthCell.addEventListener('click', () => {
            currentDate = new Date(year, month, 1);
            currentView = 'month';
            renderCalendar();
        });

        fragment.appendChild(monthCell);
    }

    daysGridEl.appendChild(fragment);
}

function createDayCell(day, isOtherMonth) {
    const cell = document.createElement('div');
    cell.className = 'day-cell' + (isOtherMonth ? ' other-month' : '');
    
    const number = document.createElement('div');
    number.className = 'day-number';
    number.textContent = day;
    cell.appendChild(number);
    
    cell._numberElement = number;
    return cell;
}

function createYearDayCell(day, isOtherMonth) {
    const cell = document.createElement('div');
    cell.className = 'year-day-cell' + (isOtherMonth ? ' other-month' : '');
    return cell;
}

// ============ 初始化 ============
function initCalendar() {
    const datePrevBtn = document.getElementById('datePrevBtn');
    const dateNextBtn = document.getElementById('dateNextBtn');
    const todayBtn = document.getElementById('todayBtn');
    const calendarIcon = document.getElementById('calendarIcon');
    const viewPopup = document.getElementById('viewPopup');
    const viewOptions = document.querySelectorAll('.view-option');
    const calendarContent = document.getElementById('calendarContent');
    const monthYear = document.getElementById('monthYear');

    // 上一月/上一年
    if (datePrevBtn) {
        datePrevBtn.addEventListener('click', () => {
            if (currentView === 'month') {
                currentDate.setMonth(currentDate.getMonth() - 1);
            } else {
                currentDate.setFullYear(currentDate.getFullYear() - 1);
            }
            renderCalendar();
        });
    }

    // 下一月/下一年
    if (dateNextBtn) {
        dateNextBtn.addEventListener('click', () => {
            if (currentView === 'month') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else {
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            }
            renderCalendar();
        });
    }

    // 今天按钮
    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            currentDate = new Date();
            selectedDate = new Date();
            currentView = 'month';
            renderCalendar();
            displayFortune(selectedDate);
        });
    }

    // 视图切换
    if (calendarIcon && viewPopup) {
        calendarIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            viewPopup.classList.toggle('show');
            updateViewOptions();
        });

        document.addEventListener('click', (e) => {
            if (!calendarIcon.contains(e.target) && !viewPopup.contains(e.target)) {
                viewPopup.classList.remove('show');
            }
        });
    }

    viewOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const view = option.dataset.view;
            if (view && view !== currentView) {
                currentView = view;
                renderCalendar();
            }
            viewPopup.classList.remove('show');
        });
    });

    // 点击月份切换年视图
    if (monthYear) {
        monthYear.addEventListener('click', () => {
            currentView = currentView === 'month' ? 'year' : 'month';
            renderCalendar();
        });
    }

    // 触摸滑动
    if (calendarContent) {
        let touchStartX = 0;
        calendarContent.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        calendarContent.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    // 初始化
    displayFortune(selectedDate);
    renderCalendar();
}

function updateViewOptions() {
    const viewOptions = document.querySelectorAll('.view-option');
    viewOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.view === currentView);
    });
}

function handleSwipe(touchStartX, touchEndX) {
    if (currentView !== 'month') return;
    
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else {
            currentDate.setMonth(currentDate.getMonth() - 1);
        }
        renderCalendar();
    }
}

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', initCalendar);
