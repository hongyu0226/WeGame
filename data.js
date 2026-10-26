/**
 * 禮物與測驗題目設定檔
 * 
 * 💖 男朋友小提示：
 * 你可以隨時在這裡直接修改題目、選項、正確答案與提示！
 * - correctOptionId: 正確答案的選項 ID（"A", "B", "C", 或 "D"）
 * - hint: 第一次答錯時會出現的甜蜜小提示
 * - answerExplanation: 第二次仍答錯時會公布的正確答案說明
 */

const GAME_CONFIG = {
  // 6 份禮物基本設定（固定順序與 ID）
  prizes: [
    {
      id: "kiss",
      name: "Kiss",
      difficulty: 1,
      badge: "甜蜜爆擊 ♡",
      iconSvg: `
        <svg viewBox="0 0 100 100" class="gift-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="42" fill="#FFF5F5" stroke="#3E3A39" stroke-width="3"/>
          <path d="M50 72C50 72 26 56 26 38C26 27 34 22 42 22C46.5 22 50 25.5 50 25.5C50 25.5 53.5 22 58 22C66 22 74 27 74 38C74 56 50 72 50 72Z" fill="#F2A497" stroke="#3E3A39" stroke-width="3" stroke-linejoin="round"/>
          <path d="M38 34C35 34 33 36 33 39" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
          <circle cx="68" cy="30" r="4" fill="#F6D27A" stroke="#3E3A39" stroke-width="2"/>
          <path d="M22 62L26 66M26 62L22 66" stroke="#3E3A39" stroke-width="2" stroke-linecap="round"/>
          <path d="M72 65C74 68 76 68 78 65" stroke="#3E3A39" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `
    },
    {
      id: "massage",
      name: "按摩＋洗頭髮&吹頭髮",
      difficulty: 2,
      badge: "貼心男友牌",
      iconSvg: `
        <svg viewBox="0 0 100 100" class="gift-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="42" fill="#F0F8FF" stroke="#3E3A39" stroke-width="3"/>
          <!-- 吹風機手繪 -->
          <rect x="28" y="32" width="30" height="22" rx="8" fill="#A8D3E6" stroke="#3E3A39" stroke-width="3"/>
          <path d="M58 37H68V49H58" fill="#F6D27A" stroke="#3E3A39" stroke-width="3" stroke-linejoin="round"/>
          <path d="M38 54V72C38 74 41 76 43 76H45C47 76 50 74 50 72V54" fill="#F2A497" stroke="#3E3A39" stroke-width="3"/>
          <circle cx="37" cy="43" r="3" fill="#3E3A39"/>
          <!-- 暖風波浪 -->
          <path d="M74 38C77 40 77 43 74 45" stroke="#3E3A39" stroke-width="2" stroke-linecap="round"/>
          <path d="M78 35C82 39 82 44 78 48" stroke="#3E3A39" stroke-width="2" stroke-linecap="round"/>
          <path d="M22 28C24 25 28 25 30 28" stroke="#F2A497" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `
    },
    {
      id: "display_box",
      name: "泡泡瑪特展示盒",
      difficulty: 3,
      badge: "公仔的豪宅",
      iconSvg: `
        <svg viewBox="0 0 100 100" class="gift-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="42" fill="#FFFBF0" stroke="#3E3A39" stroke-width="3"/>
          <!-- 展示盒外框 -->
          <rect x="25" y="24" width="50" height="52" rx="10" fill="#FFFFFF" stroke="#3E3A39" stroke-width="3"/>
          <rect x="28" y="27" width="44" height="42" rx="6" fill="#F4FAFD" stroke="#3E3A39" stroke-width="2" stroke-dasharray="4 2"/>
          <!-- 裡面可愛的小公仔剪影 -->
          <circle cx="50" cy="44" r="10" fill="#F6D27A" stroke="#3E3A39" stroke-width="2.5"/>
          <path d="M43 43C43 43 44 41 45 43" stroke="#3E3A39" stroke-width="2" stroke-linecap="round"/>
          <path d="M55 43C55 43 56 41 57 43" stroke="#3E3A39" stroke-width="2" stroke-linecap="round"/>
          <path d="M48 48C49 49 51 49 52 48" stroke="#3E3A39" stroke-width="2" stroke-linecap="round"/>
          <path d="M44 54C44 54 44 65 50 65C56 65 56 54 56 54H44Z" fill="#F2A497" stroke="#3E3A39" stroke-width="2.5"/>
          <rect x="20" y="74" width="60" height="7" rx="3.5" fill="#3E3A39"/>
          <!-- 星星點綴 -->
          <polygon points="78,24 80,29 85,30 81,33 82,38 78,35 74,38 75,33 71,30 76,29" fill="#F6D27A" stroke="#3E3A39" stroke-width="1.5"/>
        </svg>
      `
    },
    {
      id: "phone_case",
      name: "a-We 手機殼",
      difficulty: 3,
      badge: "天天陪著妳",
      iconSvg: `
        <svg viewBox="0 0 100 100" class="gift-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="42" fill="#F3FAF0" stroke="#3E3A39" stroke-width="3"/>
          <!-- 手機外殼 -->
          <rect x="33" y="18" width="34" height="64" rx="10" fill="#FFFFFF" stroke="#3E3A39" stroke-width="3"/>
          <!-- 鏡頭模組 -->
          <rect x="37" y="23" width="14" height="18" rx="5" fill="#E2F0D9" stroke="#3E3A39" stroke-width="2"/>
          <circle cx="44" cy="28" r="2.5" fill="#3E3A39"/>
          <circle cx="44" cy="36" r="2.5" fill="#3E3A39"/>
          <!-- a-we 可愛笑臉或愛心裝飾 -->
          <path d="M50 56C50 56 42 50 42 44C42 40 45 38 48 38C50 38 50 40 50 40C50 40 50 38 52 38C55 38 58 40 58 44C58 50 50 56 50 56Z" fill="#F2A497" stroke="#3E3A39" stroke-width="2"/>
          <text x="50" y="68" font-family="'Huninn', sans-serif" font-size="7" font-weight="bold" fill="#3E3A39" text-anchor="middle">a-we ♡</text>
        </svg>
      `
    },
    {
      id: "cash_3600",
      name: "紅包 NT$3,600",
      difficulty: 4,
      badge: "最實在的心意",
      iconSvg: `
        <svg viewBox="0 0 100 100" class="gift-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="42" fill="#FFF5F3" stroke="#3E3A39" stroke-width="3"/>
          <!-- 日系粉嫩紅包袋 -->
          <rect x="29" y="22" width="42" height="58" rx="8" fill="#F2A497" stroke="#3E3A39" stroke-width="3"/>
          <path d="M29 26L50 43L71 26" stroke="#3E3A39" stroke-width="3" stroke-linejoin="round"/>
          <circle cx="50" cy="44" r="9" fill="#F6D27A" stroke="#3E3A39" stroke-width="2.5"/>
          <text x="50" y="47.5" font-family="'Huninn', sans-serif" font-size="9" font-weight="bold" fill="#3E3A39" text-anchor="middle">福</text>
          <text x="50" y="66" font-family="'Huninn', sans-serif" font-size="7.5" font-weight="bold" fill="#FFFFFF" text-anchor="middle">$3,600</text>
          <circle cx="23" cy="35" r="3" fill="#F6D27A" stroke="#3E3A39" stroke-width="1.5"/>
          <circle cx="77" cy="65" r="2.5" fill="#B9DAA5" stroke="#3E3A39" stroke-width="1.5"/>
        </svg>
      `
    },
    {
      id: "yuqi_popmart",
      name: "雨琦泡泡瑪特",
      difficulty: 5,
      badge: "終極願望清單",
      iconSvg: `
        <svg viewBox="0 0 100 100" class="gift-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="42" fill="#FAF5FF" stroke="#3E3A39" stroke-width="3"/>
          <!-- 閃亮皇冠 -->
          <polygon points="40,24 45,29 50,22 55,29 60,24 58,33 42,33" fill="#F6D27A" stroke="#3E3A39" stroke-width="2.5"/>
          <!-- 可愛雨琦小公仔頭像 -->
          <circle cx="50" cy="46" r="16" fill="#FFE5D9" stroke="#3E3A39" stroke-width="3"/>
          <!-- 捲捲雙馬尾髮型 -->
          <path d="M34 44C30 40 24 44 26 52C28 60 35 56 35 56" fill="#D4A373" stroke="#3E3A39" stroke-width="2.5"/>
          <path d="M66 44C70 40 76 44 74 52C72 60 65 56 65 56" fill="#D4A373" stroke="#3E3A39" stroke-width="2.5"/>
          <path d="M38 38C44 33 56 33 62 38" fill="#D4A373" stroke="#3E3A39" stroke-width="2.5"/>
          <!-- 眨眼與笑臉 -->
          <path d="M43 45L47 45" stroke="#3E3A39" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="55" cy="45" r="2" fill="#3E3A39"/>
          <circle cx="41" cy="50" r="2.5" fill="#F2A497"/>
          <circle cx="59" cy="50" r="2.5" fill="#F2A497"/>
          <path d="M47 51C49 53 51 53 53 51" stroke="#3E3A39" stroke-width="2" stroke-linecap="round"/>
          <!-- 身體 -->
          <path d="M42 62C42 62 38 78 50 78C62 78 58 62 58 62" fill="#B9DAA5" stroke="#3E3A39" stroke-width="3"/>
          <!-- 星星光芒 -->
          <polygon points="76,18 78,22 82,23 79,25 80,29 76,26 73,29 74,25 71,23 75,22" fill="#F6D27A" stroke="#3E3A39" stroke-width="1.5"/>
        </svg>
      `
    }
  ],

  // 6 份禮物各自對應的測驗題目
  quizzes: [
    {
      id: "quiz_kiss",
      prizeId: "kiss",
      difficulty: 1,
      question: "寶～在我們相處的時光裡，每次約完會要分開時，哪一個小動作是絕對不能漏掉的？",
      options: [
        { id: "A", text: "互相擊掌說掰掰" },
        { id: "B", text: "抱一個加甜蜜Kiss" },
        { id: "C", text: "轉頭直接帥氣離開" },
        { id: "D", text: "互相猜拳決定誰先走" }
      ],
      correctOptionId: "B",
      hint: "提示：是充滿愛意、暖呼呼又帶有啾啾聲的甜蜜魔法喔！💋",
      answerExplanation: "正解是「抱一個加甜蜜啾啾（Kiss）」！這可是專屬我們的默契呀",
      successMessage: "答對啦！不愧是我的寶！這份甜蜜 Kiss 驚喜立即送給妳!"
    },
    {
      id: "quiz_massage",
      prizeId: "massage",
      difficulty: 2,
      question: "當妳辛苦了一整天覺得肩膀痠、又懶得洗頭髮&吹頭髮時，我最貼心的服務是什麼？",
      options: [
        { id: "A", text: "遞給妳一條毛巾" },
        { id: "B", text: "溫柔舒壓按摩 ＋ 專業專屬洗頭髮&吹頭髮" },
        { id: "C", text: "今天就不要洗頭髮了" },
        { id: "D", text: "不要啦，自己搞定" }
      ],
      correctOptionId: "B",
      hint: "提示：妳只要閉上眼睛當公主，享受暖風與手部魔力就行了～",
      answerExplanation: "正解就是「溫柔舒壓按摩 ＋ 專業專屬洗頭髮&吹頭髮」！隨時為我的公主效勞～💆‍♀️",
      successMessage: "答對啦！寶貝太聰明了！專屬按摩與洗頭髮&吹頭髮服務已解鎖！"
    },
    {
      id: "quiz_display_box",
      prizeId: "display_box",
      difficulty: 3,
      question: "還記得我們第一次約會以及告白是在哪裡嗎？",
      options: [
        { id: "A", text: "宜蘭大學的操場" },
        { id: "B", text: "清溝夜市" },
        { id: "C", text: "復興路門口" },
        { id: "D", text: "員山公園" }
      ],
      correctOptionId: "D",
      hint: "提示：夜深了，風也吹著，那裡離我以前住的地方不遠，而我們的愛情故事，就是在那裡悄悄翻開了新的一頁🌙",
      answerExplanation: "沒錯！正是「員山公園」，然後我就告白了並且就這樣在一起啦！",
      successMessage: "太厲害了！答對啦！泡泡瑪特專屬展示盒已成功解鎖✨"
    },
    {
      id: "quiz_phone_case",
      prizeId: "phone_case",
      difficulty: 3,
      question: "還記得我們去看a-We展是什麼時候嗎？",
      options: [
        { id: "A", text: "2026/09/19" },
        { id: "B", text: "2026/09/25" },
        { id: "C", text: "2026/09/17" },
        { id: "D", text: "2026/10/01" }
      ],
      correctOptionId: "A",
      hint: "提示：答案藏在九月裡🗓️ 那天我們一起去看了 a-We 展，不是月底最後一天，也不是十月才發生的事喔～仔細回想一下👀",
      answerExplanation: "就是「a-we 手機殼」！每天拿著它都能想起這些可愛的a-We小設計～",
      successMessage: "答對啦！不愧是有用心記得我們去的任何地方！a-We手機殼成功解鎖！"
    },
    {
      id: "quiz_cash_3600",
      prizeId: "cash_3600",
      difficulty: 4,
      question: "還記得我們在一起的日期是什麼時候嗎？",
      options: [
        { id: "A", text: "2022/11/23" },
        { id: "B", text: "2025/11/23" },
        { id: "C", text: "2024/11/23" },
        { id: "D", text: "2023/11/23" }
      ],
      correctOptionId: "A",
      hint: "提示：還記得我們愛情故事開始的那一年嗎？每年的 11/23 都是屬於我們的特別日子，而這段故事，已經從 2022 年開始啦！",
      answerExplanation: "沒錯！就是 2022 年 11 月 23 日！從那一天開始，我們的生活裡多了一個彼此陪伴的人。謝謝妳走進我的生命，希望未來每一年的 11/23，我們都還能牽著彼此的手，一起創造更多回憶。",
      successMessage: "恭喜答對！ 成功解鎖新台幣 3,600 元紅包！ 這是給最特別的妳的獎勵，想買什麼就去買吧！不過比起紅包，我更希望未來的每一年都能繼續陪在妳身邊❤️"
    },
    {
      id: "quiz_yuqi_popmart",
      prizeId: "yuqi_popmart",
      difficulty: 5,
      question: "壓軸大魔王！ 還記得我們從在一起的那一天到現在，在一起幾天了並且一起走過了幾次週年、又一起度過了幾次彼此的生日嗎？❤️",
      options: [
        { id: "A", text: "1445天, 4次週年, 4次生日" },
        { id: "B", text: "1450天, 4次週年, 5次生日" },
        { id: "C", text: "1440天, 3次週年, 4次生日" },
        { id: "D", text: "1450天, 5次週年, 5次生日" }
      ],
      correctOptionId: "A",
      hint: "提示：我們的故事從 2022/11/23 正式開始！先算算我們在一起幾天了，再回想每年 11/23 的紀念日，以及我們一起慶祝生日的次數。這次可不能靠猜的，要拿出對我們回憶的絕對記憶力啦！",
      answerExplanation: "答對啦！ 從我們在一起的那一天開始，每一次週年、每一次生日，都是屬於我們的珍貴回憶。謝謝妳一直陪在我身邊，希望未來還有好多好多個紀念日，能讓我們一起度過！",
      successMessage: "恭喜寶通關所有考驗！壓軸的大獎品「雨琦（Yuqi）聯名限定泡泡瑪特」正式解鎖！ 這是給最棒的妳的獎勵，願妳收到喜歡的禮物時，能夠很開心！"
    }
  ]
};

// 匯出供 app.js 使用
window.GAME_CONFIG = GAME_CONFIG;
