<template>
  <div class="statistics-page">
    <el-row :gutter="16" class="kpi-row">
      <el-col :span="6">
        <el-card class="kpi-card" shadow="hover">
          <div class="kpi-title">总报名数</div>
          <div class="kpi-value">{{ overview.total }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card" shadow="hover">
          <div class="kpi-title">通过数</div>
          <div class="kpi-value success">{{ overview.approvedCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card" shadow="hover">
          <div class="kpi-title">待审核</div>
          <div class="kpi-value warning">{{ overview.pendingCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card" shadow="hover">
          <div class="kpi-title">通过率</div>
          <div class="kpi-value primary">{{ overview.approvalRate }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="toolbar-card">
      <el-form inline>
        <el-form-item>
          <el-tag :type="selectedProvinceName ? 'success' : 'info'">
            当前筛选：{{ selectedProvinceName || "全国" }}
          </el-tag>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-refresh" @click="loadAll">刷新</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
              icon="el-icon-close"
              :disabled="!selectedProvinceName"
              @click="clearProvinceFilter">
            清除省份筛选
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row :gutter="16" class="chart-row">
      <el-col :span="24">
        <el-card class="chart-card" shadow="hover">
          <div slot="header">全国省级报名分布（地图）</div>
          <div ref="provinceMapChart" class="chart-panel map-panel"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header">省份报名分布（Top10）</div>
          <div ref="provinceChart" class="chart-panel"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header">月度报名趋势</div>
          <div ref="monthChart" class="chart-panel"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header">赛道热度 Top10</div>
          <div ref="trackChart" class="chart-panel"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header">审核状态分布</div>
          <div ref="statusChart" class="chart-panel pie-panel"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "RegistrationsStatistics",
  data() {
    return {
      overview: {
        total: 0,
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
        approvalRate: 0
      },
      provinceData: [],
      provinceMapData: [],
      monthData: [],
      trackTopData: [],
      statusData: [],
      dashboardRawData: [],
      chinaMapReady: false,
      selectedProvinceName: "",
      provinceMapChart: null,
      provinceChart: null,
      monthChart: null,
      trackChart: null,
      statusChart: null
    };
  },
  methods: {
    loadAll() {
      this.loadProvinceDistribution();
      this.loadDashboardRaw();
    },
    loadOverview() {
      const _this = this;
      axios.post("http://localhost:8181/registrations/statistics/registrationOverview", {})
          .then(function (response) {
            const payload = response.data || {};
            if (payload.code !== 200) {
              return;
            }
            const row = (payload.data && payload.data[0]) || {};
            _this.overview.total = Number(row.total) || 0;
            _this.overview.approvedCount = Number(row.approvedCount) || 0;
            _this.overview.pendingCount = Number(row.pendingCount) || 0;
            _this.overview.rejectedCount = Number(row.rejectedCount) || 0;
            _this.overview.approvalRate = Number(row.approvalRate) || 0;
          });
    },
    requestData(apiCode, onSuccess) {
      const _this = this;
      axios.post("http://localhost:8181/registrations/statistics/" + apiCode, {})
          .then(function (response) {
            const payload = response.data || {};
            if (payload.code !== 200) {
              _this.$message.error(payload.msg || "统计数据加载失败");
              return;
            }
            onSuccess(payload.data || []);
          });
    },
    loadProvinceDistribution() {
      this.requestData("registrationByProvinceMap", data => {
        this.provinceMapData = data.map(item => ({
          name: item.name,
          value: Number(item.value) || 0,
          code: item.code
        }));
        this.provinceData = [...this.provinceMapData].sort((a, b) => b.value - a.value).slice(0, 10);
        if (this.chinaMapReady) {
          this.renderProvinceMapChart();
        }
        this.renderProvinceChart();
      });
    },
    ensureChinaMap() {
      if (this.chinaMapReady) {
        return Promise.resolve();
      }
      return fetch("https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json")
          .then(response => {
            if (!response.ok) {
              throw new Error("中国地图数据加载失败");
            }
            return response.json();
          })
          .then(geoJson => {
            echarts.registerMap("china", geoJson);
            this.chinaMapReady = true;
          })
          .catch(() => {
            this.$message.error("中国地图数据加载失败，将仅展示省份Top图表");
          });
    },
    loadMonthTrend() {
      const map = {};
      this.getFilteredRows().forEach(item => {
        const key = item.month || "未知月份";
        map[key] = (map[key] || 0) + 1;
      });
      this.monthData = Object.keys(map)
          .sort()
          .map(key => ({name: key, value: map[key]}));
      this.renderMonthChart();
    },
    loadTrackTop() {
      const map = {};
      this.getFilteredRows().forEach(item => {
        const key = item.trackName || "未知赛项";
        map[key] = (map[key] || 0) + 1;
      });
      this.trackTopData = Object.keys(map)
          .map(key => ({name: key, value: map[key]}))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
      this.renderTrackChart();
    },
    loadStatusDistribution() {
      const map = {};
      this.getFilteredRows().forEach(item => {
        const key = item.status || "待审核";
        map[key] = (map[key] || 0) + 1;
      });
      this.statusData = Object.keys(map)
          .map(key => ({name: key, value: map[key]}))
          .sort((a, b) => b.value - a.value);
      this.renderStatusChart();
    },
    loadDashboardRaw() {
      this.requestData("registrationDashboardRaw", data => {
        this.dashboardRawData = data || [];
        this.refreshLinkedPanels();
      });
    },
    getFilteredRows() {
      if (!this.selectedProvinceName) {
        return this.dashboardRawData;
      }
      return this.dashboardRawData.filter(item => item.provinceName === this.selectedProvinceName);
    },
    refreshLinkedPanels() {
      this.loadOverviewByRows();
      this.loadMonthTrend();
      this.loadTrackTop();
      this.loadStatusDistribution();
    },
    loadOverviewByRows() {
      const rows = this.getFilteredRows();
      const total = rows.length;
      const approvedCount = rows.filter(item => item.status === "通过").length;
      const pendingCount = rows.filter(item => item.status === "待审核").length;
      const rejectedCount = rows.filter(item => item.status === "驳回").length;
      this.overview.total = total;
      this.overview.approvedCount = approvedCount;
      this.overview.pendingCount = pendingCount;
      this.overview.rejectedCount = rejectedCount;
      this.overview.approvalRate = total ? Number(((approvedCount / total) * 100).toFixed(2)) : 0;
    },
    renderProvinceChart() {
      const names = this.provinceData.map(item => item.name);
      const values = this.provinceData.map(item => item.value);
      if (!this.provinceChart) this.provinceChart = echarts.init(this.$refs.provinceChart);
      this.provinceChart.setOption({
        tooltip: {trigger: "axis"},
        xAxis: {type: "category", data: names},
        yAxis: {type: "value"},
        series: [{name: "报名数", type: "bar", data: values, itemStyle: {color: "#409EFF"}}]
      });
    },
    renderProvinceMapChart() {
      const maxValue = this.provinceMapData.reduce((max, item) => Math.max(max, item.value), 0);
      const mapSeriesData = this.provinceMapData.map(item => ({
        ...item,
        selected: this.selectedProvinceName === item.name
      }));
      if (!this.provinceMapChart) this.provinceMapChart = echarts.init(this.$refs.provinceMapChart);
      this.provinceMapChart.clear();
      this.provinceMapChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: params => {
            const value = Number(params.value) || 0;
            return `${params.name}<br/>报名数：${value}`;
          }
        },
        visualMap: {
          min: 0,
          max: Math.max(maxValue, 1),
          left: "left",
          bottom: 20,
          text: ["高", "低"],
          calculable: true,
          inRange: {
            color: ["#E0F3F8", "#ABD9E9", "#74ADD1", "#4575B4"]
          }
        },
        series: [
          {
            name: "报名数",
            type: "map",
            map: "china",
            selectedMode: "single",
            roam: true,
            emphasis: {
              label: {
                show: true
              }
            },
            select: {
              itemStyle: {
                areaColor: "#ffcc80"
              },
              label: {
                color: "#333"
              }
            },
            data: mapSeriesData
          }
        ]
      }, true);
      this.syncMapSelection();
      this.provinceMapChart.off("click");
      this.provinceMapChart.on("click", params => {
        this.applyProvinceFilter(params.name || "");
      });
    },
    syncMapSelection() {
      if (!this.provinceMapChart) return;
      this.provinceMapData.forEach(item => {
        this.provinceMapChart.dispatchAction({
          type: "mapUnSelect",
          seriesIndex: 0,
          name: item.name
        });
      });
      if (this.selectedProvinceName) {
        this.provinceMapChart.dispatchAction({
          type: "mapSelect",
          seriesIndex: 0,
          name: this.selectedProvinceName
        });
      }
    },
    renderMonthChart() {
      const names = this.monthData.map(item => item.name);
      const values = this.monthData.map(item => Number(item.value) || 0);
      if (!this.monthChart) this.monthChart = echarts.init(this.$refs.monthChart);
      this.monthChart.setOption({
        tooltip: {trigger: "axis"},
        xAxis: {type: "category", data: names},
        yAxis: {type: "value"},
        series: [{name: "报名数", type: "line", smooth: true, data: values, itemStyle: {color: "#67C23A"}}]
      });
    },
    renderTrackChart() {
      const names = this.trackTopData.map(item => item.name);
      const values = this.trackTopData.map(item => Number(item.value) || 0);
      if (!this.trackChart) this.trackChart = echarts.init(this.$refs.trackChart);
      this.trackChart.setOption({
        tooltip: {trigger: "axis"},
        xAxis: {type: "value"},
        yAxis: {type: "category", data: names},
        series: [{name: "报名数", type: "bar", data: values, itemStyle: {color: "#E6A23C"}}]
      });
    },
    renderStatusChart() {
      const pieData = this.statusData.map(item => ({name: item.name, value: Number(item.value) || 0}));
      if (!this.statusChart) this.statusChart = echarts.init(this.$refs.statusChart);
      this.statusChart.setOption({
        tooltip: {trigger: "item"},
        legend: {bottom: 0},
        series: [{name: "审核状态", type: "pie", radius: "60%", data: pieData}]
      });
    },
    resizeCharts() {
      if (this.provinceMapChart) this.provinceMapChart.resize();
      if (this.provinceChart) this.provinceChart.resize();
      if (this.monthChart) this.monthChart.resize();
      if (this.trackChart) this.trackChart.resize();
      if (this.statusChart) this.statusChart.resize();
    },
    clearProvinceFilter() {
      this.applyProvinceFilter("");
    },
    applyProvinceFilter(provinceName) {
      this.selectedProvinceName = provinceName || "";
      this.refreshLinkedPanels();
      this.renderProvinceMapChart();
    }
  },
  mounted() {
    this.ensureChinaMap().finally(() => {
      this.loadAll();
    });
    window.addEventListener("resize", this.resizeCharts);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
    if (this.provinceMapChart) this.provinceMapChart.dispose();
    if (this.provinceChart) this.provinceChart.dispose();
    if (this.monthChart) this.monthChart.dispose();
    if (this.trackChart) this.trackChart.dispose();
    if (this.statusChart) this.statusChart.dispose();
  }
};
</script>

<style scoped>
.statistics-page {
  margin-top: 20px;
}

.kpi-row {
  margin-bottom: 16px;
}

.kpi-card {
  min-height: 110px;
}

.kpi-title {
  color: #909399;
  font-size: 14px;
}

.kpi-value {
  margin-top: 12px;
  font-size: 30px;
  font-weight: 600;
  color: #303133;
}

.kpi-value.primary {
  color: #409EFF;
}

.kpi-value.success {
  color: #67C23A;
}

.kpi-value.warning {
  color: #E6A23C;
}

.toolbar-card {
  margin-bottom: 16px;
}

.chart-row {
  margin-bottom: 16px;
}

.chart-card {
  min-height: 350px;
}

.chart-panel {
  width: 100%;
  height: 280px;
}

.map-panel {
  height: 420px;
}

.pie-panel {
  height: 320px;
}
</style>

