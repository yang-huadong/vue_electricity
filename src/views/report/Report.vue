<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 拷贝/合并
import _ from "lodash";
export default {
  name: "Report",
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    async drawLine() {
        console.log(this.$echarts);
      let myChart = this.$echarts.init(document.getElementById("main"));
      const res = await this.$http.get("reports/type/1");
      // 4. 指定图表的配置项options和数据res.data 的合并
      const result = _.merge(res.data, this.options);
      // 5. 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result);
    },
  },
};
</script>

<style lang="less" scoped>
</style>