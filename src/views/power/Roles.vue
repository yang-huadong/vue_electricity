<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-row
              :class="['bottom', i1 === 0 ? 'top' : '', 'vcenter']"
              v-for="(item1, i1) in row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'top', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="date" label="操作">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeSetRightDialog(row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <!-- 树形控件 show-checkbox：可选择的选择框-->
    <!-- node-key	每个树节点用来作为唯一标识的属性，整棵树应该是唯一的	String -->
    <!-- default-expand-all	是否默认展开所有节点	boolean -->
    <!-- default-checked-keys	默认勾选的节点的 key 的数组	array -->
    <!-- default-expanded-keys 设置默认展开的节点（id) -->
    <el-dialog
      @close="setRightDialogClosed"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <el-tree
        :data="rightsList"
        :props="greeProps"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%">
      <el-form
        :model="addRolesList"
        :rules="addRolesRules"
        ref="addRolesRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleValidate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 角色列表数据
      roleList: [],
      // 所有权限数据
      rightsList: [],
      // 添加角色数据
      addRolesList: {
        roleName: "",
        roleDesc: "",
      },
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 添加角色对话框
      addRoleDialogVisible: false,
      // 树形控件的属性绑定对象
      greeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中节点的id值
      defkeys: [],
      // 当前即将分配权限的id
      roleId: "",
      // 添加角色规则
      addRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    goodsInfo2(row, rowIndex) {
      console.log(row, rowIndex);
      if (row.columnIndex == 1) {
        return "goodsInfo";
      }
    },
    // 角色列表数据
    async getRoleList() {
      const res = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败！");
      this.roleList = res.data;
    },
    // 所有权限数据
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const res = await this.$http.get(`rights/tree`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败！");
      }
      this.rightsList = res.data;
      console.log(res.data);
      // 获取所有三级权限节点id
      this.getLeafKeys(role, this.defkeys);
      this.setRightDialogVisible = true;
    },
    // 获取所有三级权限数据id
    // 参数：节点，数组（保存）
    getLeafKeys(node, arr) {
      // 判断是否是三级id
      if (!node.children) {
        // 三级id
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    // 确定提交
    async allotRights() {
      const keys = [
        // 已选中的
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      // console.log(keys);
      // 以逗号进行分隔
      const iDStr = keys.join(",");
      const res = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: iDStr,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败！");
      }
      this.$message.success("分配权限成功！");
      this.getRoleList();
      this.setRightDialogVisible = false;
    },
    // 添加角色表单验证
    addRoleValidate() {
      this.$refs.addRolesRef.validate(async (vail) => {
        if (!vail) return;
        const res = await this.$http.post("roles", this.addRolesList);
        if (res.meta.status !== 201) return this.$message.error("添加角色失败");
        this.addRoleDialogVisible = false;
        this.getRoleList();
        this.$message.success("添加角色成功");
      });
    },
    // 删除角色
    async removeSetRightDialog(id) {
      const confirmResult = await this.$messageBox("是否删除该角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");
      const res = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除角色失败");
      this.getRoleList();
      this.$message.success("删除角色成功");
    },
    // 删除角色指定权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const res = await this.$http.delete(`roles/${role.id}/${rightId}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }
      // 返回的data, 是当前角色下最新的权限数据
      role.children = res.data;
    },
    setRightDialogClosed() {
      this.defkeys = [];
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.top {
  border-top: 1px solid rgb(53, 240, 230);
}
.bottom {
  border-bottom: 1px solid rgb(53, 240, 230);
}

.vcenter {
  display: flex;
  align-items: center;
}

.goodsInfo2 {
  padding: 60px !important;
}
</style>

<style lang="less">
.goodsInfo2 {
  padding: 60px !important;
}

.el-table__expanded-cell {
  padding: 20px 50px !important;
}
</style>