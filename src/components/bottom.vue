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
  /* 与顶栏主色一致（AI 助手标题同款蓝），按钮区整体居中 */
  .bottom {
    width: 100%;
    min-height: 220px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #2563eb;
    font-family: '黑体', 'Microsoft YaHei', sans-serif;
    border-radius: 12px;
    margin-top: 20px;
    padding: 28px 16px;
    box-sizing: border-box;
    box-shadow: 0 10px 28px rgba(37, 99, 235, 0.28);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .bottom1 {
    width: 100%;
    max-width: 920px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    align-items: stretch;
    gap: 14px 16px;
  }

  .bottom2 {
    flex: 1 1 240px;
    max-width: 280px;
    min-height: 80px;
    background-color: rgba(255, 255, 255, 0.96);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 18px;
    color: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.35);
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .bottom3 {
    flex: 1 1 240px;
    max-width: 280px;
    min-height: 80px;
    background-color: rgba(255, 255, 255, 0.96);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 18px;
    color: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.35);
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .bottom2:hover,
  .bottom3:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(15, 23, 42, 0.16);
  }

  .bottom11 {
    margin-top: 24px;
    min-height: 40px;
    text-align: center;
    font-size: 15px;
    color: #64748b;
  }
</style>
