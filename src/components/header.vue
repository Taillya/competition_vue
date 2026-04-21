<template>
  <div class="header" style="margin-bottom: 10px">
    <img style="width:90px" src="../assets/image/logo.png">
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
              @click="toPage('studentAiInnovate')"
              :class="{'active': this.$route.path === '/studentAiInnovate'}"
              class="menu-item"
      >
        人工智能创新大赛报名
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
              class="menu-item"
              style="position: relative"
      >
        DeepSeek助手
        <span class="hot-tag">hot</span>
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
      toPage(name) {
        if (name === "studentIndex") {
          this.$router.push("/studentIndex");
        } else if (name === "studentCompetition") {
          this.$router.push("/studentCompetition");
        } else if (name === "studentAiInnovate") {
          this.$router.push("/studentAiInnovate");
        } else if (name === "studentScore") {
          this.$router.push("/studentScore");
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
    height: 80px;
    margin-top: -50px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: white; /* 修改背景颜色为白色 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果，增加层次感 */
    padding: 0 20px; /* 添加内边距，使内容不紧贴边缘 */
    box-sizing: border-box;
  }

  .header1 {
    display: flex;
    color: #333; /* 修改文字颜色为深色，与白色背景形成对比 */
  }

  .active {
    color: #FEA501; /* 修改激活状态的颜色，使其与未激活状态区分明显 */
    border-bottom: 2px solid #FEA501; /* 添加底部边框，突出激活状态 */
    transition: border-bottom 0.3s ease; /* 添加过渡效果，使变化更平滑 */
  }

  .menu-item {
    font-size: 18px; /* 增大字体大小，提高可读性 */
    margin-left: 30px;
    cursor: pointer;
    transition: color 0.3s ease; /* 添加过渡效果，使颜色变化更平滑 */
  }

  .menu-item:hover {
    color: #FEA501; /* 鼠标悬停时改变颜色，增强交互性 */
  }

  .hot-tag {
    position: absolute;
    top: -5px;
    right: -27px;
    background-color: red;
    color: white;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
    transform: scale(0.8);
  }

  .header2 {
    display: flex;
    gap: 20px; /* 添加间距，使两个按钮之间有适当的间隔 */
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
    background-color: #FEA501;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    transition: background-color 0.3s ease; /* 添加过渡效果，使颜色变化更平滑 */
  }

  .header4:hover {
    background-color: #ffb429; /* 鼠标悬停时改变背景颜色，增强交互性 */
  }
</style>
