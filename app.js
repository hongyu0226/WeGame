/**
 * 女友專屬互動小遊戲｜給寶貝的禮物大作戰
 * 應用程式核心邏輯 (app.js)
 */

(function () {
  "use strict";

  const STORAGE_KEY = "wegame_gift_quest_state_v1";
  const SOUND_KEY = "wegame_sound_enabled";
  const BGM_KEY = "wegame_bgm_enabled";

  // 男友專屬心意兌換券保證條款（Feature 1）
  const VOUCHER_PLEDGES = {
    kiss: "憑此券可隨時隨地向男友索取深情親吻一次，無使用期限，不得推託♡",
    massage: "享有頂級私人沙龍：男友親自溫柔洗頭、吹整頭髮加全套肩頸放鬆按摩 30 分鐘，隨傳隨到！",
    display_box: "專屬泡泡瑪特公仔豪宅已備妥，男友負責組裝擦拭，永遠擺放妳最愛的娃！",
    phone_case: "專屬 a-We 防摔手機殼，保護手機更保護妳，每天拿著手機都要想念我！",
    cash_3600: "好運發財金 NT$3,600 元整已備妥，買妳想買的任何東西，男友全額買單！",
    yuqi_popmart: "雨琦專屬 Pop Mart 盲盒大獎，抽到本命、開箱滿滿好運與甜蜜！"
  };

  // 音效與背景音樂合成器（使用 Web Audio API 內建八音盒旋律，同時支援自訂 bgm.mp3）
  class SoundPlayer {
    constructor() {
      this.audioCtx = null;
      this.enabled = localStorage.getItem(SOUND_KEY) !== "false";
      this.bgmEnabled = localStorage.getItem(BGM_KEY) !== "false";
      this.bgmPlaying = false;
      this.hasCustomBgm = false;
      this.bgmAudioEl = document.getElementById("bgm-audio");
      this.bgmTimer = null;
      this.bgmFilter = null;
      this.bgmMasterGain = null;
      this.isAudioElementPlaying = false;
      this.onBgmStatusChange = null;

      // 日系溫馨八音盒旋律（C - Em - Am - G - F - Em - Dm - G，循環長度 12.8 秒）
      this.bgmLoopDuration = 12.8;
      this.bgmNotes = [
        // 第 1 小節: Cmaj7
        { t: 0.0, f: 130.81, dur: 1.5, type: "bass" },
        { t: 0.0, f: 261.63, dur: 0.8 },
        { t: 0.4, f: 329.63, dur: 0.8 },
        { t: 0.8, f: 392.00, dur: 0.8 },
        { t: 1.2, f: 523.25, dur: 1.0 },
        // 第 2 小節: Em7
        { t: 1.6, f: 123.47, dur: 1.5, type: "bass" },
        { t: 1.6, f: 293.66, dur: 0.8 },
        { t: 2.0, f: 329.63, dur: 0.8 },
        { t: 2.4, f: 392.00, dur: 0.8 },
        { t: 2.8, f: 587.33, dur: 1.0 },
        // 第 3 小節: Am7
        { t: 3.2, f: 110.00, dur: 1.5, type: "bass" },
        { t: 3.2, f: 261.63, dur: 0.8 },
        { t: 3.6, f: 329.63, dur: 0.8 },
        { t: 4.0, f: 440.00, dur: 0.8 },
        { t: 4.4, f: 523.25, dur: 1.0 },
        // 第 4 小節: G7
        { t: 4.8, f: 98.00, dur: 1.5, type: "bass" },
        { t: 4.8, f: 246.94, dur: 0.8 },
        { t: 5.2, f: 293.66, dur: 0.8 },
        { t: 5.6, f: 392.00, dur: 0.8 },
        { t: 6.0, f: 493.88, dur: 1.0 },
        // 第 5 小節: Fmaj7
        { t: 6.4, f: 87.31, dur: 1.5, type: "bass" },
        { t: 6.4, f: 261.63, dur: 0.8 },
        { t: 6.8, f: 349.23, dur: 0.8 },
        { t: 7.2, f: 440.00, dur: 0.8 },
        { t: 7.6, f: 659.25, dur: 1.0 },
        // 第 6 小節: Em7
        { t: 8.0, f: 82.41, dur: 1.5, type: "bass" },
        { t: 8.0, f: 246.94, dur: 0.8 },
        { t: 8.4, f: 329.63, dur: 0.8 },
        { t: 8.8, f: 392.00, dur: 0.8 },
        { t: 9.2, f: 523.25, dur: 1.0 },
        // 第 7 小節: Dm7
        { t: 9.6, f: 73.42, dur: 1.5, type: "bass" },
        { t: 9.6, f: 220.00, dur: 0.8 },
        { t: 10.0, f: 293.66, dur: 0.8 },
        { t: 10.4, f: 349.23, dur: 0.8 },
        { t: 10.8, f: 440.00, dur: 1.0 },
        // 第 8 小節: G7sus4 -> G
        { t: 11.2, f: 98.00, dur: 1.5, type: "bass" },
        { t: 11.2, f: 246.94, dur: 0.8 },
        { t: 11.6, f: 293.66, dur: 0.8 },
        { t: 12.0, f: 392.00, dur: 0.8 },
        { t: 12.4, f: 493.88, dur: 1.0 }
      ];
    }

    init() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();

          // 背景音樂低通濾波器（呈現溫潤木質八音盒質感，消除刺耳高頻）
          this.bgmFilter = this.audioCtx.createBiquadFilter();
          this.bgmFilter.type = "lowpass";
          this.bgmFilter.frequency.setValueAtTime(2400, this.audioCtx.currentTime);

          // 背景音樂專用總音量（提升至溫潤清晰的 0.08）
          this.bgmMasterGain = this.audioCtx.createGain();
          this.bgmMasterGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);

          this.bgmFilter.connect(this.bgmMasterGain);
          this.bgmMasterGain.connect(this.audioCtx.destination);
        }
      }
      if (this.audioCtx && this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      if (!this.bgmAudioEl) {
        this.bgmAudioEl = document.getElementById("bgm-audio");
        if (this.bgmAudioEl) {
          this.bgmAudioEl.addEventListener("canplaythrough", () => {
            this.hasCustomBgm = true;
          });
          this.bgmAudioEl.addEventListener("error", () => {
            this.hasCustomBgm = false;
          });
        }
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem(SOUND_KEY, this.enabled);
      return this.enabled;
    }

    // 啟動背景音樂（零延遲）
    startBGM() {
      if (!this.bgmEnabled || this.bgmPlaying) return;
      this.init();

      // 若有成功載入的自訂音檔則播放自訂音檔；否則零延遲立即啟動純程式 Web Audio 八音盒
      if (this.hasCustomBgm && this.bgmAudioEl) {
        this.bgmAudioEl.volume = 0.35;
        const playPromise = this.bgmAudioEl.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isAudioElementPlaying = true;
              this.bgmPlaying = true;
              if (this.onBgmStatusChange) this.onBgmStatusChange(true);
            })
            .catch(() => {
              this.startProceduralBgm();
            });
          return;
        }
      }

      // 預設直接秒播純程式合成八音盒（0 毫秒延遲，無需等待任何網路與音檔逾時）
      this.startProceduralBgm();
    }

    startProceduralBgm() {
      if (this.bgmPlaying) return;
      this.init();
      if (!this.audioCtx) return;

      this.bgmPlaying = true;
      if (this.onBgmStatusChange) this.onBgmStatusChange(true);

      const now = this.audioCtx.currentTime;
      this.bgmCycleStart = now;

      if (this.bgmTimer) {
        clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }

      // 重設所有音符的排程標記，確保第一顆音符瞬間發聲
      this.bgmNotes.forEach((n) => {
        n._scheduledAt = null;
      });

      const scheduleLoop = () => {
        if (!this.bgmPlaying || !this.audioCtx) return;
        const currentAudioTime = this.audioCtx.currentTime;
        const lookAhead = 0.6; // 預讀 600ms

        const elapsed = currentAudioTime - this.bgmCycleStart;
        const currentCycle = Math.floor(elapsed / this.bgmLoopDuration);

        [currentCycle, currentCycle + 1].forEach((cycle) => {
          const cycleBaseTime = this.bgmCycleStart + cycle * this.bgmLoopDuration;
          this.bgmNotes.forEach((n) => {
            const noteTime = cycleBaseTime + n.t;
            if (noteTime >= currentAudioTime - 0.05 && noteTime < currentAudioTime + lookAhead) {
              if (!n._scheduledAt || Math.abs(n._scheduledAt - noteTime) > 0.05) {
                n._scheduledAt = noteTime;
                this.scheduleBgmNote(n, noteTime);
              }
            }
          });
        });
      };

      // 關鍵：在主線程中立即同步排程一次，第 0 秒的第一顆音符瞬間發聲！
      scheduleLoop();

      // 其餘後續音符由高頻定時器平滑排程
      this.bgmTimer = setInterval(scheduleLoop, 100);
    }

    scheduleBgmNote(note, time) {
      if (!this.audioCtx || !this.bgmFilter) return;
      try {
        const safeTime = Math.max(time, this.audioCtx.currentTime + 0.005);
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        const isBass = note.type === "bass";
        osc.type = isBass ? "triangle" : "sine";
        osc.frequency.setValueAtTime(note.f, safeTime);

        // 溫暖八音盒包絡線
        const peak = isBass ? 0.35 : 0.45;
        gain.gain.setValueAtTime(0.0001, safeTime);
        gain.gain.linearRampToValueAtTime(peak, safeTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, safeTime + note.dur);

        osc.connect(gain);
        gain.connect(this.bgmFilter);

        osc.start(safeTime);
        osc.stop(safeTime + note.dur + 0.05);

        // 晶亮泛音
        if (!isBass) {
          const overtone = this.audioCtx.createOscillator();
          const overGain = this.audioCtx.createGain();
          overtone.type = "sine";
          overtone.frequency.setValueAtTime(note.f * 2, safeTime);

          overGain.gain.setValueAtTime(0.0001, safeTime);
          overGain.gain.linearRampToValueAtTime(peak * 0.22, safeTime + 0.003);
          overGain.gain.exponentialRampToValueAtTime(0.0001, safeTime + note.dur * 0.38);

          overtone.connect(overGain);
          overGain.connect(this.bgmFilter);

          overtone.start(safeTime);
          overtone.stop(safeTime + note.dur * 0.38 + 0.05);
        }
      } catch (e) {
        // 忽略排程錯誤
      }
    }

    stopBGM() {
      this.bgmPlaying = false;
      if (this.bgmTimer) {
        clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }
      if (this.bgmAudioEl && this.isAudioElementPlaying) {
        this.bgmAudioEl.pause();
        this.isAudioElementPlaying = false;
      }
      if (this.onBgmStatusChange) this.onBgmStatusChange(false);
    }

    toggleBGM() {
      // 根據目前「是否正在播放」來即時反轉狀態，點擊立刻發聲
      if (this.bgmPlaying) {
        this.stopBGM();
        this.bgmEnabled = false;
      } else {
        this.bgmEnabled = true;
        this.startBGM();
      }
      localStorage.setItem(BGM_KEY, this.bgmEnabled);
      return this.bgmPlaying;
    }

    // 避讓音效（答對或全破時稍微壓低背景音樂，讓慶祝音效更立體）
    duckBGM() {
      if (this.bgmMasterGain && this.audioCtx) {
        this.bgmMasterGain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
      }
      if (this.bgmAudioEl && this.isAudioElementPlaying) {
        this.bgmAudioEl.volume = 0.1;
      }
    }

    unduckBGM() {
      if (this.bgmMasterGain && this.audioCtx) {
        this.bgmMasterGain.gain.linearRampToValueAtTime(0.08, this.audioCtx.currentTime + 0.8);
      }
      if (this.bgmAudioEl && this.isAudioElementPlaying) {
        this.bgmAudioEl.volume = 0.35;
      }
    }

    playTone(freq, type, duration, startTime = 0) {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + startTime);

        gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(this.audioCtx.currentTime + startTime);
        osc.stop(this.audioCtx.currentTime + startTime + duration);
      } catch (e) {
        // 音效失敗時靜音忽略
      }
    }

    playClick() {
      this.playTone(520, "sine", 0.08);
    }

    playCorrect() {
      this.duckBGM();
      // 歡樂上升音階 (C5, E5, G5, C6)
      const now = 0;
      this.playTone(523.25, "sine", 0.12, now);
      this.playTone(659.25, "sine", 0.12, now + 0.1);
      this.playTone(783.99, "sine", 0.14, now + 0.2);
      this.playTone(1046.5, "triangle", 0.35, now + 0.3);
      setTimeout(() => this.unduckBGM(), 1200);
    }

    playWrong() {
      // 溫柔安慰短音
      const now = 0;
      this.playTone(392.00, "sine", 0.15, now);
      this.playTone(329.63, "sine", 0.25, now + 0.12);
    }

    playFanfare() {
      this.duckBGM();
      // 慶祝大合奏
      const notes = [523, 659, 783, 1046, 783, 1046, 1318];
      notes.forEach((f, idx) => {
        this.playTone(f, "triangle", 0.25, idx * 0.12);
      });
      setTimeout(() => this.unduckBGM(), 2000);
    }

    // 可愛戳戳樂啵啵彈跳音效 (Feature 3)
    playPop() {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const now = this.audioCtx.currentTime;

        osc.type = "sine";
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.08);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.13);
      } catch (e) {
        // 忽略音效錯誤
      }
    }

    // 火漆封蠟拆開封印的夢幻音效 (Feature 4)
    playLetterOpen() {
      this.duckBGM();
      // 夢幻微風水晶弦樂琶音 (C5, E5, G5, B5, C6, E6)
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];
      notes.forEach((f, idx) => {
        this.playTone(f, "sine", 0.38, idx * 0.08);
      });
      setTimeout(() => this.unduckBGM(), 1800);
    }
  }

  // 彩花動態特效
  class ConfettiEffect {
    constructor() {
      this.canvas = document.getElementById("confetti-canvas");
      this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
      this.particles = [];
      this.animId = null;
      this.resize();
      window.addEventListener("resize", () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    burst() {
      if (!this.canvas || !this.ctx) return;
      this.resize();
      const colors = ["#F2A497", "#F6D27A", "#A8D3E6", "#B9DAA5", "#E86A82", "#FFDF79"];
      const count = 70;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: window.innerWidth / 2,
          y: window.innerHeight * 0.45,
          vx: (Math.random() - 0.5) * 16,
          vy: (Math.random() - 0.8) * 18,
          size: Math.random() * 9 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          gravity: 0.38,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.01
        });
      }
      if (!this.animId) {
        this.render();
      }
    }

    render() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.strokeStyle = "#3E3A39";
        this.ctx.lineWidth = 1.5;

        // 隨機繪製可愛方塊或圓形彩紙
        if (i % 2 === 0) {
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          this.ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.stroke();
        }
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.render());
      } else {
        this.animId = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  // 遊戲主狀態管理器
  class GameManager {
    constructor() {
      this.sound = new SoundPlayer();
      this.confetti = new ConfettiEffect();
      this.currentGiftId = null;
      this.state = this.loadState();

      this.cacheDom();
      this.bindEvents();
      this.initView();
    }

    // 建立初始預設狀態
    getDefaultState() {
      const giftStates = {};
      GAME_CONFIG.prizes.forEach((prize) => {
        giftStates[prize.id] = {
          status: "available", // "available" | "in_progress" | "unlocked" | "failed"
          attemptsUsed: 0,     // 0, 1, or 2
          lastAnswer: null,
          unlockedAt: null,
          completedAt: null
        };
      });
      return {
        hasSeenIntro: false,
        hasPoppedSecretLetter: false,
        gifts: giftStates
      };
    }

    // 從 localStorage 載入進度（規格書 F-16 重新整理恢復進度）
    loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // 確保每份禮物都有完整結構
          const base = this.getDefaultState();
          if (typeof parsed.hasPoppedSecretLetter === "undefined") {
            parsed.hasPoppedSecretLetter = false;
          }
          GAME_CONFIG.prizes.forEach((p) => {
            if (!parsed.gifts || !parsed.gifts[p.id]) {
              parsed.gifts[p.id] = base.gifts[p.id];
            }
          });
          return parsed;
        }
      } catch (e) {
        console.error("載入進度錯誤，已重設預設狀態", e);
      }
      return this.getDefaultState();
    }

    // 儲存狀態至 localStorage
    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.error("儲存失敗", e);
      }
    }

    // 重設全部進度（管理者/測試用，規格書 12.7）
    resetAllProgress(force = false) {
      if (force || confirm("💖 確定要重置所有遊戲進度嗎？這將會清除目前的挑戰與解鎖狀態！")) {
        this.state = this.getDefaultState();
        this.state.hasPoppedSecretLetter = false;
        this.saveState();
        this.currentGiftId = null;
        this.showScreen("screen-intro");
        this.renderCollection();
        this.sound.playClick();
        console.log("✅ 遊戲進度已成功重置為初始狀態！");
      }
    }

    // 快取所有畫面 DOM 節點
    cacheDom() {
      // 畫面元素
      this.screens = {
        intro: document.getElementById("screen-intro"),
        collection: document.getElementById("screen-collection"),
        quiz: document.getElementById("screen-quiz"),
        hint: document.getElementById("screen-hint"),
        unlock: document.getElementById("screen-unlock"),
        failed: document.getElementById("screen-failed")
      };

      // 總覽畫面節點
      this.unlockedCountEl = document.getElementById("stat-unlocked-count");
      this.completedCountEl = document.getElementById("stat-completed-count");
      this.giftsGridEl = document.getElementById("gifts-grid");
      this.celebrationBannerEl = document.getElementById("celebration-banner");

      // 測驗畫面節點
      this.quizMiniIconEl = document.getElementById("quiz-mini-icon");
      this.quizTargetNameEl = document.getElementById("quiz-target-name");
      this.quizAttemptsBadgeEl = document.getElementById("quiz-attempts-badge");
      this.questionTagEl = document.getElementById("question-tag");
      this.questionTextEl = document.getElementById("question-text");
      this.optionsGridEl = document.getElementById("options-grid");

      // 提示畫面節點
      this.hintTargetNameEl = document.getElementById("hint-target-name");
      this.hintTextEl = document.getElementById("hint-text");

      // 解鎖畫面節點
      this.unlockTitleEl = document.getElementById("unlock-title");
      this.unlockMessageEl = document.getElementById("unlock-message");
      this.unlockGiftIconEl = document.getElementById("unlock-gift-icon");
      this.unlockGiftNameEl = document.getElementById("unlock-gift-name");

      // 失敗公布答案畫面節點
      this.failedTargetNameEl = document.getElementById("failed-target-name");
      this.failedAnswerExplanationEl = document.getElementById("failed-answer-explanation");

      // 按鈕
      this.btnStartHunt = document.getElementById("btn-start-hunt");
      this.btnBackToCollectionFromQuiz = document.getElementById("btn-back-to-collection-quiz");
      this.btnRetryQuizFromHint = document.getElementById("btn-retry-quiz");
      this.btnBackFromHint = document.getElementById("btn-back-from-hint");
      this.btnBackFromUnlock = document.getElementById("btn-back-from-unlock");
      this.btnBackFromFailed = document.getElementById("btn-back-from-failed");
      this.btnRetryFromFailed = document.getElementById("btn-retry-from-failed");
      this.btnResetProgress = document.getElementById("btn-reset-progress");
      this.btnToggleSound = document.getElementById("btn-toggle-sound");
      this.soundIconEl = document.getElementById("sound-icon");
      this.btnMusicToggle = document.getElementById("btn-music-toggle");
      this.btnBackToIntro = document.getElementById("btn-back-to-intro");

      // 全螢幕點擊冒愛心/星星粒子 (Feature 2)
      this.tapParticleContainer = document.getElementById("tap-particle-container");

      // 首頁禮物盒戳戳樂彩蛋 (Feature 3)
      this.introGiftBoxWrap = document.getElementById("intro-gift-box-wrap");
      this.introBoxSvg = document.getElementById("intro-box-svg");
      this.giftSpeechBubble = document.getElementById("gift-speech-bubble");
      this.bubbleTimer = null;
      this.giftBoxQuotes = [
        "別一直戳我嘛～快去尋寶看看妳拿到什麼大獎！😆",
        "偷偷告訴妳一個秘密：男友超級超級愛妳！♡",
        "今天也是愛妳的第 1,445 天，天天都像第一天！❤️",
        "刮刮樂刮好了沒呀？快點下面的『開始尋寶』！✨",
        "嘿嘿，每份禮物都是男友精心挑選準備的喔！🎁",
        "戳一下加一分愛意，現在愛意已經爆表了啦～💕",
        "員山公園的微風，到現在都還記得那一刻的心動呢～🌸",
        "好啦好啦～再戳等等就直接親妳一下喔！😘"
      ];
      this.quoteIdx = 0;

      // 男友專屬心意兌換券彈窗 (Feature 1)
      this.modalVoucher = document.getElementById("modal-voucher");
      this.btnCloseVoucher = document.getElementById("btn-close-voucher");
      this.btnDoneVoucher = document.getElementById("btn-done-voucher");
      this.btnViewVoucher = document.getElementById("btn-view-voucher");
      this.voucherGiftIcon = document.getElementById("voucher-gift-icon");
      this.voucherGiftName = document.getElementById("voucher-gift-name");
      this.voucherPledgeText = document.getElementById("voucher-pledge-text");
      this.voucherSerial = document.getElementById("voucher-serial");

      // 壓軸秘密情書彈窗 (Feature 4)
      this.modalSecretLetter = document.getElementById("modal-secret-letter");
      this.btnOpenSecretLetter = document.getElementById("btn-open-secret-letter");
      this.btnCloseSecretLetter = document.getElementById("btn-close-secret-letter");
      this.btnFinishLetter = document.getElementById("btn-finish-letter");
      this.waxSealButton = document.getElementById("wax-seal-button");
      this.envelopeSealedView = document.getElementById("envelope-sealed-view");
      this.parchmentLetterView = document.getElementById("parchment-letter-view");
    }

    // 綁定事件監聽
    bindEvents() {
      // 全螢幕點擊冒愛心與星星觸控微動態 (Feature 2)
      document.addEventListener("pointerdown", (e) => {
        this.createTapParticles(e.clientX, e.clientY);
      });

      // 首頁禮物盒戳戳樂彩蛋 (Feature 3)
      if (this.introGiftBoxWrap) {
        this.introGiftBoxWrap.addEventListener("click", () => {
          this.triggerGiftBoxEasterEgg();
        });
      }

      // 男友心意兌換券 (Feature 1)
      if (this.btnViewVoucher) {
        this.btnViewVoucher.addEventListener("click", () => {
          if (this.currentGiftId) {
            this.openVoucherModal(this.currentGiftId);
          }
        });
      }
      const closeVoucher = () => {
        this.sound.playClick();
        if (this.modalVoucher) this.modalVoucher.classList.remove("active");
      };
      if (this.btnCloseVoucher) this.btnCloseVoucher.addEventListener("click", closeVoucher);
      if (this.btnDoneVoucher) this.btnDoneVoucher.addEventListener("click", closeVoucher);

      // 壓軸秘密情書 (Feature 4)
      if (this.btnOpenSecretLetter) {
        this.btnOpenSecretLetter.addEventListener("click", () => {
          this.sound.playClick();
          this.openSecretLetterModal();
        });
      }
      if (this.waxSealButton) {
        this.waxSealButton.addEventListener("click", () => {
          this.breakWaxSeal();
        });
      }
      const closeSecretLetter = () => {
        this.sound.playClick();
        if (this.modalSecretLetter) this.modalSecretLetter.classList.remove("active");
      };
      if (this.btnCloseSecretLetter) this.btnCloseSecretLetter.addEventListener("click", closeSecretLetter);
      if (this.btnFinishLetter) this.btnFinishLetter.addEventListener("click", closeSecretLetter);

      // 懸浮背景音樂開關
      if (this.btnMusicToggle) {
        this.btnMusicToggle.addEventListener("click", (e) => {
          e.stopPropagation();
          const isNowOn = this.sound.toggleBGM();
          this.updateBgmButtonUI(isNowOn);
        });
      }

      // 瀏覽器音訊政策：首次點擊或觸控頁面任何位置時，自動喚醒音訊並播放背景音樂
      const autoStartBgmOnGesture = () => {
        this.sound.init();
        if (this.sound.bgmEnabled && !this.sound.bgmPlaying) {
          this.sound.startBGM();
        }
      };
      document.addEventListener("click", autoStartBgmOnGesture, { once: true });
      document.addEventListener("touchstart", autoStartBgmOnGesture, { once: true });

      // 從總覽回到開場遊戲說明（畫面 A）
      if (this.btnBackToIntro) {
        this.btnBackToIntro.addEventListener("click", () => {
          this.sound.playClick();
          this.showScreen("screen-intro");
        });
      }

      // 開場按鈕
      if (this.btnStartHunt) {
        this.btnStartHunt.addEventListener("click", () => {
          this.sound.playClick();
          this.state.hasSeenIntro = true;
          this.saveState();
          this.showScreen("screen-collection");
        });
      }

      // 測驗返回總覽
      if (this.btnBackToCollectionFromQuiz) {
        this.btnBackToCollectionFromQuiz.addEventListener("click", () => {
          this.sound.playClick();
          this.showScreen("screen-collection");
        });
      }

      // 提示畫面：再試一次
      if (this.btnRetryQuizFromHint) {
        this.btnRetryQuizFromHint.addEventListener("click", () => {
          this.sound.playClick();
          if (this.currentGiftId) {
            this.startQuiz(this.currentGiftId);
          } else {
            this.showScreen("screen-collection");
          }
        });
      }

      // 提示畫面：先回清單
      if (this.btnBackFromHint) {
        this.btnBackFromHint.addEventListener("click", () => {
          this.sound.playClick();
          this.showScreen("screen-collection");
        });
      }

      // 解鎖畫面：回到清單
      if (this.btnBackFromUnlock) {
        this.btnBackFromUnlock.addEventListener("click", () => {
          this.sound.playClick();
          this.showScreen("screen-collection");
        });
      }

      // 失敗畫面：再測驗一次（重置該禮物狀態後直接進入測驗）
      if (this.btnRetryFromFailed) {
        this.btnRetryFromFailed.addEventListener("click", () => {
          this.sound.playClick();
          const prizeId = this.currentGiftId;
          if (prizeId && this.state.gifts[prizeId]) {
            // 重置該禮物的作答狀態，讓玩家可以重新挑戰
            this.state.gifts[prizeId].status = "available";
            this.state.gifts[prizeId].attemptsUsed = 0;
            this.state.gifts[prizeId].lastAnswer = null;
            this.saveState();
            this.startQuiz(prizeId);
          } else {
            this.showScreen("screen-collection");
          }
        });
      }

      // 失敗畫面：回到清單
      if (this.btnBackFromFailed) {
        this.btnBackFromFailed.addEventListener("click", () => {
          this.sound.playClick();
          this.showScreen("screen-collection");
        });
      }

      // 音效開關切換 (相容舊頂部列若存在)
      if (this.btnToggleSound) {
        this.btnToggleSound.addEventListener("click", () => {
          const isNowOn = this.sound.toggle();
          this.updateSoundButtonUI(isNowOn);
        });
      }

      // 重設按鈕 (相容頁尾若存在)
      if (this.btnResetProgress) {
        this.btnResetProgress.addEventListener("click", () => {
          this.resetAllProgress();
        });
      }
    }

    // 更新背景音樂按鈕視覺樣式
    updateBgmButtonUI(isPlaying) {
      if (!this.btnMusicToggle) return;
      if (isPlaying) {
        this.btnMusicToggle.classList.add("playing");
        this.btnMusicToggle.classList.remove("muted");
        this.btnMusicToggle.title = "背景音樂播放中（點擊暫停）";
        const icon = this.btnMusicToggle.querySelector(".music-note-icon");
        if (icon) icon.textContent = "🎵";
      } else {
        this.btnMusicToggle.classList.remove("playing");
        this.btnMusicToggle.classList.add("muted");
        this.btnMusicToggle.title = "背景音樂已暫停（點擊播放）";
        const icon = this.btnMusicToggle.querySelector(".music-note-icon");
        if (icon) icon.textContent = "🔇";
      }
    }

    updateSoundButtonUI(isOn) {
      if (this.soundIconEl && this.btnToggleSound) {
        this.soundIconEl.textContent = isOn ? "🔔" : "🔕";
        this.btnToggleSound.title = isOn ? "點擊關閉音效" : "點擊開啟音效";
      }
    }

    // 切換指定畫面
    showScreen(screenId) {
      Object.values(this.screens).forEach((scr) => {
        if (scr) scr.classList.remove("active");
      });

      const target = document.getElementById(screenId);
      if (target) {
        target.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // 如果切換回總覽畫面，刷新狀態與進度
      if (screenId === "screen-collection") {
        this.renderCollection();
      }
    }

    // 初始化檢視
    initView() {
      // 註冊背景音樂狀態監聽
      this.sound.onBgmStatusChange = (isPlaying) => {
        this.updateBgmButtonUI(isPlaying);
      };
      this.updateBgmButtonUI(this.sound.bgmEnabled && this.sound.bgmPlaying);
      this.updateSoundButtonUI(this.sound.enabled);
      this.renderCollection();

      // 每次開啟遊戲或重新整理網頁時，預設展示開場與遊戲說明（畫面 A）
      this.showScreen("screen-intro");
    }

    // 渲染六份禮物卡片與統計狀態（規格書第 4.2、5、11.4 章）
    renderCollection() {
      let unlockedCount = 0;
      let completedCount = 0;

      GAME_CONFIG.prizes.forEach((prize) => {
        const giftState = this.state.gifts[prize.id] || { status: "available", attemptsUsed: 0 };
        if (giftState.status === "unlocked") {
          unlockedCount++;
          completedCount++;
        } else if (giftState.status === "failed") {
          completedCount++;
        }
      });

      if (this.unlockedCountEl) {
        this.unlockedCountEl.textContent = `${unlockedCount} / 6`;
      }
      if (this.completedCountEl) {
        this.completedCountEl.textContent = `${completedCount} / 6`;
      }

      // 1. 先完整渲染六張禮物卡片，確保所有卡片狀態（包含剛答對的第 6 份禮物）立即正常更新為「已解鎖」與專屬印章
      if (this.giftsGridEl) {
        this.giftsGridEl.innerHTML = "";
        GAME_CONFIG.prizes.forEach((prize, index) => {
          const giftState = this.state.gifts[prize.id] || { status: "available", attemptsUsed: 0 };
          const card = document.createElement("div");
          card.className = `gift-card status-${giftState.status}`;
          card.id = `gift-card-${prize.id}`;
          card.setAttribute("role", "button");
          card.setAttribute("tabindex", "0");

          let statusBtnText = "開始挑戰";
          let statusBtnClass = "";
          let stampHtml = "";

          if (giftState.status === "unlocked") {
            statusBtnText = "已解鎖（查看心意券）";
            stampHtml = `<div class="unlock-stamp">已解鎖</div>`;
          } else if (giftState.status === "failed") {
            statusBtnText = "查看正解・再次挑戰";
          } else if (giftState.attemptsUsed === 1) {
            statusBtnText = "繼續挑戰（剩 1 次）";
          }

          // 星星難度
          let starsHtml = "";
          for (let s = 1; s <= 5; s++) {
            starsHtml += `<span class="${s <= prize.difficulty ? "star-filled" : "star-empty"}">★</span>`;
          }

          card.innerHTML = `
            ${stampHtml}
            <div class="gift-card-header">
              <span class="gift-order">No.${index + 1}</span>
              <span class="gift-badge">${prize.badge}</span>
            </div>
            <div class="gift-icon-wrapper">
              ${prize.iconSvg}
            </div>
            <div class="gift-name">${prize.name}</div>
            <div class="gift-difficulty" title="難度 ${prize.difficulty}/5">
              難度：${starsHtml}
            </div>
            <div class="gift-status-btn ${statusBtnClass}">
              ${statusBtnText}
            </div>
          `;

          // 點擊事件：依規格書 12.1 進行判斷
          const handleCardClick = () => {
            this.sound.playClick();
            this.handleGiftCardSelection(prize.id);
          };

          card.addEventListener("click", handleCardClick);
          card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCardClick();
            }
          });

          this.giftsGridEl.appendChild(card);
        });
      }

      // 2. 依使用者需求：只有當「已成功解鎖」跟「已完成挑戰」都達到 6 次之後才會跳出信封
      const isAllSixUnlocked = (unlockedCount === 6 && completedCount === 6);

      if (isAllSixUnlocked) {
        if (this.celebrationBannerEl) {
          this.celebrationBannerEl.classList.add("active");
          const titleEl = this.celebrationBannerEl.querySelector(".banner-title");
          const descEl = this.celebrationBannerEl.querySelector(".banner-desc");
          if (titleEl) titleEl.textContent = "🎉 天啊！妳把六份禮物全部解鎖了！";
          if (descEl) descEl.textContent = "太厲害啦！快來找我領取專屬獎品吧！";
        }
        if (this.btnOpenSecretLetter) {
          this.btnOpenSecretLetter.style.display = "inline-flex";
          this.btnOpenSecretLetter.textContent = "💌 拆開男友的壓軸秘密情書";
        }

        // 自動跳出情書信封彈窗
        if (!this.state.hasPoppedSecretLetter) {
          this.state.hasPoppedSecretLetter = true;
          this.saveState();
          this.confetti.burst();
          setTimeout(() => {
            this.openSecretLetterModal();
          }, 600);
        }
      } else {
        if (this.celebrationBannerEl) {
          this.celebrationBannerEl.classList.remove("active");
        }
      }
    }

    // 處理點選禮物卡片
    handleGiftCardSelection(prizeId) {
      const giftState = this.state.gifts[prizeId];
      this.currentGiftId = prizeId;

      if (giftState.status === "unlocked") {
        // 已解鎖：直接進入解鎖卡片查看獎品，不重複作答
        this.showUnlockSuccessScreen(prizeId, false);
      } else if (giftState.status === "failed") {
        // 挑戰失敗：顯示已揭曉的正確答案與說明
        this.showFailedScreen(prizeId);
      } else {
        // 尚未挑戰或正在進行：進入測驗
        this.startQuiz(prizeId);
      }
    }

    // 開始指定禮物的測驗（畫面 C）
    startQuiz(prizeId) {
      this.currentGiftId = prizeId;
      const prize = GAME_CONFIG.prizes.find((p) => p.id === prizeId);
      const quiz = GAME_CONFIG.quizzes.find((q) => q.prizeId === prizeId);
      const giftState = this.state.gifts[prizeId];

      if (!prize || !quiz) {
        alert("題目載入錯誤，請重新整理！");
        return;
      }

      // 更新測驗畫面元件
      this.quizMiniIconEl.innerHTML = prize.iconSvg;
      this.quizTargetNameEl.textContent = prize.name;

      // 作答機會標籤
      const remainingAttempts = 2 - giftState.attemptsUsed;
      if (giftState.attemptsUsed === 1) {
        this.quizAttemptsBadgeEl.innerHTML = `⚠️ 剩餘最後 <b>1</b> 次機會`;
        this.quizAttemptsBadgeEl.style.backgroundColor = "#FFF3D6";
      } else {
        this.quizAttemptsBadgeEl.innerHTML = `🎯 共有 <b>2</b> 次作答機會`;
        this.quizAttemptsBadgeEl.style.backgroundColor = "#F6D27A";
      }

      this.questionTagEl.textContent = `專屬測驗・第 ${prize.difficulty} 級考驗`;
      this.questionTextEl.textContent = quiz.question;

      // 渲染四個選項
      this.optionsGridEl.innerHTML = "";
      quiz.options.forEach((opt) => {
        const optBtn = document.createElement("button");
        optBtn.className = "option-btn";
        optBtn.type = "button";
        optBtn.innerHTML = `
          <div class="option-id">${opt.id}</div>
          <div class="option-text">${opt.text}</div>
        `;

        optBtn.addEventListener("click", () => {
          this.submitAnswer(prizeId, quiz, opt.id, optBtn);
        });

        this.optionsGridEl.appendChild(optBtn);
      });

      this.showScreen("screen-quiz");
    }

    // 作答判定核心邏輯（規格書第 12.2、12.3、12.4 章）
    submitAnswer(prizeId, quiz, selectedOptionId, clickedBtn) {
      const giftState = this.state.gifts[prizeId];

      // 防止已解鎖或已失敗重複觸發
      if (giftState.status === "unlocked" || giftState.status === "failed") {
        return;
      }

      // 停用所有選項按鈕防止重複點擊
      const allOptionBtns = this.optionsGridEl.querySelectorAll(".option-btn");
      allOptionBtns.forEach((btn) => (btn.disabled = true));
      clickedBtn.classList.add("selected");

      giftState.lastAnswer = selectedOptionId;
      const isCorrect = selectedOptionId === quiz.correctOptionId;

      if (isCorrect) {
        // ------------------------------------------------------------------
        // 答對了（第一次或第二次答對皆同）：立即解鎖！
        // ------------------------------------------------------------------
        this.sound.playCorrect();
        this.confetti.burst();

        giftState.status = "unlocked";
        giftState.unlockedAt = new Date().toISOString();
        giftState.completedAt = new Date().toISOString();
        this.saveState();

        setTimeout(() => {
          this.showUnlockSuccessScreen(prizeId, true);
        }, 350);
      } else {
        // ------------------------------------------------------------------
        // 答錯了
        // ------------------------------------------------------------------
        this.sound.playWrong();
        clickedBtn.classList.add("wrong-shake");

        giftState.attemptsUsed += 1;

        if (giftState.attemptsUsed === 1) {
          // 第一次答錯：給予提示，保留最後一次作答機會
          this.saveState();
          setTimeout(() => {
            this.showHintScreen(prizeId, quiz);
          }, 600);
        } else {
          // 第二次答錯：公布答案，該禮物鎖定失敗
          giftState.status = "failed";
          giftState.completedAt = new Date().toISOString();
          this.saveState();

          setTimeout(() => {
            this.showFailedScreen(prizeId);
          }, 600);
        }
      }
    }

    // 顯示第一次答錯與提示畫面（畫面 D）
    showHintScreen(prizeId, quiz) {
      const prize = GAME_CONFIG.prizes.find((p) => p.id === prizeId);
      if (this.hintTargetNameEl) {
        this.hintTargetNameEl.textContent = prize ? `（${prize.name}）` : "";
      }
      if (this.hintTextEl) {
        this.hintTextEl.textContent = quiz ? quiz.hint : "";
      }

      this.showScreen("screen-hint");
    }

    // 顯示答對並解鎖畫面（畫面 E）
    showUnlockSuccessScreen(prizeId, isNewUnlock = true) {
      this.currentGiftId = prizeId;
      const prize = GAME_CONFIG.prizes.find((p) => p.id === prizeId);
      const quiz = GAME_CONFIG.quizzes.find((q) => q.prizeId === prizeId);

      if (this.unlockGiftIconEl && prize) {
        this.unlockGiftIconEl.innerHTML = prize.iconSvg;
      }
      if (this.unlockGiftNameEl && prize) {
        this.unlockGiftNameEl.textContent = prize.name;
      }

      // 計算目前已成功解鎖的禮物數量
      let unlockedCount = 0;
      GAME_CONFIG.prizes.forEach((p) => {
        if (this.state.gifts[p.id] && this.state.gifts[p.id].status === "unlocked") {
          unlockedCount++;
        }
      });

      if (this.unlockTitleEl) {
        if (unlockedCount === 6) {
          this.unlockTitleEl.textContent = "🎉 恭喜！六份禮物全部成功解鎖！";
        } else {
          this.unlockTitleEl.textContent = isNewUnlock ? "🎉 答對啦！成功解鎖禮物！" : "這份禮物已經成功解鎖囉💖";
        }
      }
      if (this.unlockMessageEl) {
        if (unlockedCount === 6) {
          this.unlockMessageEl.textContent = "太厲害啦！點擊下方回到清單，壓軸驚喜信封即將登場！";
        } else {
          this.unlockMessageEl.textContent = isNewUnlock
            ? (quiz ? quiz.successMessage : "不愧是我的寶！這份禮物是屬於妳的！")
            : "快找我兌現專屬禮物吧！";
        }
      }

      if (this.btnBackFromUnlock) {
        if (unlockedCount === 6) {
          this.btnBackFromUnlock.textContent = "回到禮物清單（領取壓軸秘密信封 💌）";
        } else {
          this.btnBackFromUnlock.textContent = "回到禮物清單";
        }
      }

      if (isNewUnlock) {
        this.confetti.burst();
      }

      this.showScreen("screen-unlock");
    }

    // 顯示第二次答錯畫面（畫面 F）
    showFailedScreen(prizeId) {
      this.currentGiftId = prizeId;
      const prize = GAME_CONFIG.prizes.find((p) => p.id === prizeId);
      const quiz = GAME_CONFIG.quizzes.find((q) => q.prizeId === prizeId);

      if (this.failedTargetNameEl) {
        this.failedTargetNameEl.textContent = prize ? `（${prize.name}）` : "";
      }
      if (this.failedAnswerExplanationEl) {
        this.failedAnswerExplanationEl.textContent = quiz
          ? quiz.answerExplanation
          : "別灰心，可以繼續挑戰其它禮物喔！";
      }

      this.showScreen("screen-failed");
    }

    // ------------------------------------------------------------------------
    // Feature 2: 全螢幕點擊冒愛心與星星觸控微動態
    // ------------------------------------------------------------------------
    createTapParticles(x, y) {
      if (!this.tapParticleContainer || !x || !y) return;
      const symbols = ["♡", "♥", "✨", "⭐", "🌸", "💕", "🌷", "🎀"];
      const colors = ["#F2A497", "#F6D27A", "#A8D3E6", "#B9DAA5", "#FF8096", "#E08577"];
      const count = 3 + Math.floor(Math.random() * 2);

      for (let i = 0; i < count; i++) {
        const span = document.createElement("span");
        span.className = "tap-particle";
        span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        span.style.color = colors[Math.floor(Math.random() * colors.length)];
        span.style.left = `${x}px`;
        span.style.top = `${y}px`;

        const dx = (Math.random() - 0.5) * 60;
        const dy = (Math.random() - 0.5) * 30;
        const rot = (Math.random() - 0.5) * 60;
        const size = 18 + Math.floor(Math.random() * 10);

        span.style.fontSize = `${size}px`;
        span.style.setProperty("--dx", `${dx}px`);
        span.style.setProperty("--dy", `${dy}px`);
        span.style.setProperty("--rot", `${rot}deg`);

        this.tapParticleContainer.appendChild(span);
        setTimeout(() => {
          if (span.parentNode) span.remove();
        }, 900);
      }
    }

    // ------------------------------------------------------------------------
    // Feature 3: 首頁禮物盒戳戳樂彩蛋
    // ------------------------------------------------------------------------
    triggerGiftBoxEasterEgg() {
      this.sound.playPop();

      // Q 彈縮放微動態
      if (this.introBoxSvg) {
        this.introBoxSvg.classList.remove("squish");
        // 強制重繪以重啟 CSS 關鍵影格動畫
        void this.introBoxSvg.offsetWidth;
        this.introBoxSvg.classList.add("squish");
      }

      // 甜蜜語錄氣泡輪播
      if (this.giftSpeechBubble) {
        const quote = this.giftBoxQuotes[this.quoteIdx % this.giftBoxQuotes.length];
        this.quoteIdx++;
        this.giftSpeechBubble.textContent = quote;
        this.giftSpeechBubble.classList.add("active");

        if (this.bubbleTimer) clearTimeout(this.bubbleTimer);
        this.bubbleTimer = setTimeout(() => {
          this.giftSpeechBubble.classList.remove("active");
        }, 3200);
      }
    }

    // ------------------------------------------------------------------------
    // Feature 1: 男友心意兌換券彈窗
    // ------------------------------------------------------------------------
    openVoucherModal(prizeId) {
      const prize = GAME_CONFIG.prizes.find((p) => p.id === prizeId);
      if (!prize) return;

      this.sound.playPop();

      if (this.voucherGiftIcon) this.voucherGiftIcon.innerHTML = prize.iconSvg;
      if (this.voucherGiftName) this.voucherGiftName.textContent = prize.name;
      if (this.voucherPledgeText) {
        this.voucherPledgeText.textContent = VOUCHER_PLEDGES[prizeId] || "憑此券可隨時隨地向男友兌現此專屬禮物！";
      }
      if (this.voucherSerial) {
        this.voucherSerial.textContent = `NO. 20261123-${prizeId.toUpperCase()}-520`;
      }

      if (this.modalVoucher) {
        this.modalVoucher.classList.add("active");
      }
    }

    // ------------------------------------------------------------------------
    // Feature 4: 壓軸秘密情書彈窗
    // ------------------------------------------------------------------------
    openSecretLetterModal() {
      // 重設至封蠟未拆封狀態
      if (this.envelopeSealedView) this.envelopeSealedView.style.display = "block";
      if (this.parchmentLetterView) this.parchmentLetterView.style.display = "none";

      if (this.modalSecretLetter) {
        this.modalSecretLetter.classList.add("active");
      }
    }

    breakWaxSeal() {
      this.sound.playLetterOpen();
      this.confetti.burst();

      // 封蠟破開轉為展開信紙
      if (this.envelopeSealedView) {
        this.envelopeSealedView.style.display = "none";
      }
      if (this.parchmentLetterView) {
        this.parchmentLetterView.style.display = "flex";
      }
    }
  }

  // 網頁載入完成後啟動遊戲
  document.addEventListener("DOMContentLoaded", () => {
    window.gameApp = new GameManager();

    // 測試專用：提供全域快捷重置函式，開發者可在 F12 控制台直接輸入 resetGame()
    window.resetGame = (force = true) => {
      if (window.gameApp) {
        window.gameApp.resetAllProgress(force);
      }
    };

    // 測試專用：一鍵全部解鎖（方便預覽全解鎖慶祝橫幅與壓軸秘密情書）
    window.unlockAll = () => {
      if (window.gameApp) {
        GAME_CONFIG.prizes.forEach((p) => {
          window.gameApp.state.gifts[p.id] = {
            status: "unlocked",
            attemptsUsed: 1,
            unlockedAt: new Date().toISOString(),
            completedAt: new Date().toISOString()
          };
        });
        window.gameApp.state.hasPoppedSecretLetter = false;
        window.gameApp.saveState();
        window.gameApp.renderCollection();
        window.gameApp.showScreen("screen-collection");
        window.gameApp.confetti.burst();
        console.log("🎉 已一鍵全部解鎖 6 份禮物！快點擊橫幅的秘密情書吧！");
      }
    };

    // 測試專用：快速打開指定禮物的專屬兌換券
    window.openVoucher = (prizeId = "kiss") => {
      if (window.gameApp) {
        window.gameApp.openVoucherModal(prizeId);
      }
    };

    // 測試專用：快速打開壓軸秘密情書
    window.openSecretLetter = () => {
      if (window.gameApp) {
        window.gameApp.openSecretLetterModal();
      }
    };
  });
})();
