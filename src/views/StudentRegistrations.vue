<template>
  <div class="main">
    <headers></headers>
    <el-card class="panel" shadow="hover">
      <div slot="header" class="clearfix">
        <span>我的报名记录</span>
        <el-button style="float: right;" type="primary" size="mini" @click="loadData">刷新</el-button>
      </div>
      <el-alert
          title="这里展示你提交过的报名项目与审核状态"
          type="info"
          :closable="false"
          style="margin-bottom: 16px;">
      </el-alert>
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="编号" width="90"/>
        <el-table-column prop="trackName" label="赛道" width="160"/>
        <el-table-column prop="teamName" label="团队" width="160"/>
        <el-table-column prop="name" label="姓名" width="100"/>
        <el-table-column prop="idCard" label="队长身份证号" width="190"/>
        <el-table-column prop="provinceName" label="省份" width="120"/>
        <el-table-column label="审核状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="statusTagType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="报名时间"/>
        <el-table-column label="成员" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="showMembers(scope.row)">查看成员</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="小组成员信息" :visible.sync="memberDialogVisible" width="520px">
      <el-table :data="memberTableData" border size="mini">
        <el-table-column prop="memberName" label="姓名"/>
        <el-table-column prop="memberIdCard" label="身份证号"/>
      </el-table>
    </el-dialog>
    <bottoms></bottoms>
  </div>
</template>

<script>
import headers from '/src/components/header.vue'
import bottoms from '/src/components/bottom.vue'

export default {
  name: "StudentRegistrations",
  components: {headers, bottoms},
  data() {
    return {
      tableData: [],
      submitterUserId: "",
      memberDialogVisible: false,
      memberTableData: []
    }
  },
  methods: {
    statusTagType(status) {
      if (status === "通过") return "success";
      if (status === "驳回") return "danger";
      return "warning";
    },
    loadData() {
      if (!this.submitterUserId) {
        this.$message.warning("未找到登录账号信息，请重新登录");
        return;
      }
      axios.get("http://localhost:8181/registrations/my?submitterUserId=" + encodeURIComponent(this.submitterUserId))
          .then(response => {
            const res = response.data || {};
            if (res.code === 200) {
              this.tableData = res.data || [];
            } else {
              this.$message.error(res.msg || "加载失败");
            }
          });
    },
    showMembers(row) {
      axios.get("http://localhost:8181/registrations/members/" + row.id)
          .then(response => {
            const res = response.data || {};
            if (res.code === 200) {
              this.memberTableData = res.data || [];
              this.memberDialogVisible = true;
            } else {
              this.$message.error(res.msg || "成员加载失败");
            }
          });
    }
  },
  created() {
    const user = JSON.parse(window.localStorage.getItem("user") || "{}");
    this.submitterUserId = user.username || "";
    this.loadData();
  }
}
</script>

<style scoped>
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.panel {
  margin-top: 20px;
}
</style>
