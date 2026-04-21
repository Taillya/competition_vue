<template>
  <div>
    <div class="bottom">
      <div class="bottom1">
        <div class="bottom2" @click="toPage('studentIndex')">
          <i class="el-icon-house"></i><span style="margin-left:10px">首页</span>
        </div>
        <div class="bottom3" @click="toPage('studentCompetition')">
          <i class="el-icon-monitor"></i><span style="margin-left:10px">竞赛信息</span>
        </div>
        <div class="bottom2" @click="toPage('studentAiInnovate')">
          <i class="el-icon-position"></i><span style="margin-left:10px">人工智能创新大赛报名</span>
        </div>
        <div class="bottom3" @click="toPage('studentScore')">
          <i class="el-icon-postcard"></i><span style="margin-left:10px">成绩与证书</span>
        </div>
        <div class="bottom3" @click="toPage('studentNotice')">
          <i class="el-icon-data-line"></i><span style="margin-left:10px">公告栏</span>
        </div>
      </div>
    </div>
    <div class="bottom11">
      © College Student Competition Management System
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 这里可以定义其他数据，如果有的话
      };
    },
    methods: {
      toPage(name) {
        if (name === "studentIndex") {
          this.$router.push("/studentIndex");
          location.reload();
        } else if (name === "studentCompetition") {
          this.$router.push("/studentCompetition");
        } else if (name === "studentAiInnovate") {
          this.$router.push("/studentAiInnovate");
        } else if (name === "studentScore") {
          this.$router.push("/studentScore");
        } else if (name === "studentNotice") {
          this.$router.push("/studentNotice");
        } else if (name === "qx") {
          this.$router.push("/qx");
        }
      }
    }
  };
</script>

<style scoped>
  .bottom {
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    background-color: #33ffff; /* 浅蓝色背景 */
    align-items: center;
    font-family: '黑体';
    border-radius: 10px;
    margin-top: 20px;
  }
  .bottom1 {
    width: 80%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
  }
  .bottom2 {
    width: 30%;
    height: 80px;
    background-color: #fff9c4; /* 浅黄色背景 */
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 20px;
    color: #333; /* 深色文字 */
  }
  .bottom3 {
    width: 30%;
    height: 80px;
    background-color: #c8e6c9; /* 浅绿色背景 */
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 20px;
    color: #333; /* 深色文字 */
  }
  .bottom11 {
    margin-top: 30px;
    height: 40px;
    text-align: center;
    font-size: 20px;
    color: #333; /* 深色文字 */
  }
</style>
