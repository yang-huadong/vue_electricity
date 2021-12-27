<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true">添加菜单</el-button>
        </el-col>
      </el-row>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="authName" label="名称"></el-table-column>
        <el-table-column label="级别">
          <template slot-scope="{ row }">
            <el-tag v-if="row.level == 0">一级</el-tag>
            <el-tag v-else-if="row.level == 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="path" label="描述"></el-table-column>
        <el-table-column prop="addresqs" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">删除</el-button>
            <!-- <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false"> -->
            <!-- <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data () {
    return {
      rightsList: [],
    };
  },
  created () {
    this.getRightList();
  },
  methods: {
    async getRightList () {
      const res = await this.$http.get("rights/list");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败！");
      //  数据保存
      this.rightsList = res.data;
      console.log(this.rightsList);
    },
    showEditDialog () {

    },
    removeUserById () {

    }
  },
};
</script>

<style lang="less" scoped>
</style>