<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="路径">
          <template slot-scope="{ row }">
            <el-tag v-if="row.level == 0">一级</el-tag>
            <el-tag v-else-if="row.level == 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      rightsList: [],
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const res = await this.$http.get("rights/list");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败！");
      //  数据保存
      this.rightsList = res.data;
      console.log(this.rightsList);
    },
  },
};
</script>

<style lang="less" scoped>
</style>