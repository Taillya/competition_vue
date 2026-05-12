<template>
  <div class="header">
    <img class="header-logo" src="../assets/image/logo.png" alt="logo">
    <div class="header1">
      <div
              @click="toPage('studentIndex')"
              :class="{'active': this.$route.path === '/studentIndex'}"
              class="menu-item"
      >
        首页
      </div>
      <div
              @click="toPage('studentCompetition')"
              :class="{'active': this.$route.path === '/studentCompetition'}"
              class="menu-item"
      >
        竞赛信息
      </div>
      <div
              @click="toAiRegistration"
              :class="{'active': this.$route.path === '/studentAiInnovate'}"
              class="menu-item"
      >
        快捷报名
      </div>
      <div
              @click="toPage('studentScore')"
              :class="{'active': this.$route.path === '/studentScore'}"
              class="menu-item"
      >
        成绩与证书
      </div>
      <div
              @click="toPage('studentNotice')"
              :class="{'active': this.$route.path === '/studentNotice'}"
              class="menu-item"
      >
        公告栏
      </div>
      <div
              @click="toPage('chat')"
              :class="{'active': this.$route.path === '/chat'}"
              class="menu-item menu-item-assistant"
              title="可询问赛程规则、报名流程与常见问题，回答仅供参考"
      >
        <span class="assistant-wrap">
          <span class="assistant-text">智能助手</span>
          <span class="hot-tag" aria-hidden="true">AI</span>
        </span>
      </div>
      <div
              @click="toPage('studentRegistrations')"
              :class="{'active': this.$route.path === '/studentRegistrations'}"
              class="menu-item"
      >
        我的报名
      </div>
    </div>
    <div class="header2">
      <div class="header3">
        <span style="margin-left: 30px;font-size: 14px">{{user.name}}，欢迎回来</span>
      </div>
      <div class="header4" @click="loginOut">
        退出登录
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        user: ''
      };
    },
    methods: {
      toAiRegistration() {
        this.$router.push({
          path: '/studentAiInnovate',
          query: { competitionId: '1', _nav: String(Date.now()) }
        }).catch(function () {});
      },
      toPage(name) {
        if (name === "studentIndex") {
          this.$router.push("/studentIndex");
        } else if (name === "studentCompetition") {
          this.$router.push("/studentCompetition");
        } else if (name === "studentAiInnovate") {
          this.$router.push("/studentAiInnovate");
        } else if (name === "studentScore") {
          this.$router.push("/studentScore");
        } else if (name === "studentRegistrations") {
          this.$router.push("/studentRegistrations");
        } else if (name === "studentNotice") {
          this.$router.push("/studentNotice");
        } else if (name === "chat") {
          this.$router.push("/chat");
        }
      },
      loginOut() {
        let _this = this;
        this.$confirm('注销登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          _this.$router.replace({path: '/login'})
        })
      }
    },
    created() {
      this.user = JSON.parse(window.localStorage.getItem('user'))
    }
  };
</script>

<style scoped>
  /* 全局样式，设置字体和背景 */
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f4f9;
  }

  .header {
    width: 100%;
    min-height: 80px;
    /* 与首页等学生页顶栏对齐，不额外下移 */
    margin-top: 0;
    margin-bottom: 10px;
    overflow: visible;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 0 2px 12px rgba(37, 99, 235, 0.08);
    /* 略增上内边距，避免「AI」角标贴顶或被外层裁切 */
    padding: 14px 20px 10px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(147, 197, 253, 0.45);
  }

  .header-logo {
    width: 90px;
    flex-shrink: 0;
    height: auto;
    display: block;
  }

  .header1 {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    /* 不可使用 overflow-x: auto：按规范会连带把 overflow-y 算成 auto，向上溢出的「AI」角标会被裁切 */
    overflow: visible;
    color: #333; /* 修改文字颜色为深色，与白色背景形成对比 */
  }

  .active {
    color: #2563eb;
    border-bottom: 2px solid #3b82f6;
    transition: border-bottom 0.3s ease, color 0.3s ease;
  }

  .menu-item {
    font-size: 18px; /* 增大字体大小，提高可读性 */
    margin-left: 30px;
    cursor: pointer;
    flex-shrink: 0;
    white-space: nowrap;
    transition: color 0.3s ease; /* 添加过渡效果，使颜色变化更平滑 */
  }

  .menu-item:hover {
    color: #1d4ed8;
  }

  .menu-item-assistant {
    color: #2563eb;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    overflow: visible;
  }

  /* 仅包住「智能助手」四字；右侧留白承载角标，避免绝对定位伸到「我的报名」上方 */
  .assistant-wrap {
    position: relative;
    display: inline-block;
    line-height: 1.25;
    padding-right: 28px;
    padding-top: 2px;
    overflow: visible;
  }

  .assistant-text {
    white-space: nowrap;
    font-size: 18px;
  }

  .menu-item-assistant:hover {
    color: #1d4ed8;
  }

  .menu-item-assistant.active {
    color: #2563eb;
  }

  .hot-tag {
    position: absolute;
    top: -6px;
    right: 0;
    z-index: 1;
    pointer-events: none;
    background: #2563eb;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 1px 5px 2px;
    border-radius: 5px;
    white-space: nowrap;
    letter-spacing: 0.02em;
    line-height: 1.15;
    box-shadow: 0 1px 3px rgba(30, 64, 175, 0.35);
  }

  .header2 {
    display: flex;
    gap: 20px; /* 添加间距，使两个按钮之间有适当的间隔 */
    flex-shrink: 0;
    align-items: center;
  }

  .header3 {
    margin-left: 30px;
    width: 130px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333; /* 修改文字颜色为深色，与背景形成对比 */
  }

  .header4 {
    width: 130px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    border-radius: 10px;
    cursor: pointer;
    color: white;
    font-weight: 500;
    transition: opacity 0.25s ease, transform 0.2s ease;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.32);
  }

  .header4:hover {
    opacity: 0.94;
    transform: translateY(-1px);
  }
</style>
