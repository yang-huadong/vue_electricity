<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              @click="getUserList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <el-table stripe :data="userList" border>
        <el-table-column type="index" label="序号" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="role_name" label="角色" />
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <!-- {{ scope.row }} 当前行的信息 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :pager-count="5"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户提交弹框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @closed="addDialogClosed"
      >
        <!-- 表单 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改编辑用户提交弹框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @closed="editDialogClosed"
      >
        <!-- 表单 -->
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" @close="setRoleDialogClosed" :visible.sync="setRoleDialogVisible" width="50%">
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        分配新角色：
        <el-select v-model="selectedRoleId" placeholder="请选择角色">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
           :label="item.roleName"
          :value="item.id"></el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    const checkEmail = (rule, value, cb) => {
      // console.log(value);
      const regEmail = /^([a-zA-Z0-9_-])+@([a-z-A-Z0-9_-])+(\.[[a-zA-Z0-9_-]+)/;
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    const checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      // 请求用户列表数据
      queryInfo: {
        // 查询参数
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 2,
      },
      // 请求数据结果
      userList: [],
      // 总条数
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制编辑修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 添加用户，收集信息
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 编辑用户提交信息 通过id查询到的信息
      editForm: {},
      // 添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 修改用户表单验证规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 分配角色对话框
      setRoleDialogVisible: false,
      // 获取分配角色的用户信息
      userInfo:{},
      // 获取角色列表信息
      rolesList:[],
      // 已选中的角色id
      selectedRoleId:''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 请求用户列表数据
    async getUserList() {
      const res = await this.$http.get("users", {
        params: this.queryInfo,
      });
      //  console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userList = res.data.users;
      this.total = res.data.total;
      console.log(this.userList);
    },
    // pageSize改变时触发 每条页数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // currentPage改变时触发  当前页
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 修改用户状态
    async userStateChanged(userinfo) {
      // console.log(userinfo);
      const res = await this.$http.put(
        "users/" + userinfo.id + "/state/" + userinfo.mg_state
      );
      console.log(res);
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败！");
      }

      this.$message.success("更新用户状态成功！");
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const res = await this.$http.post("users", this.addForm);
        console.log(res);
        if (res.meta.status !== 201)
          return this.$message.error("添加用户失败！");
        this.$message.success("添加用户成功");
        // 关闭对话框
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    // 关闭添加用户对话框时重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 关闭编辑用户对话框时重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 操作修改 编辑用户提交信息 - 查询
    async showEditDialog(id) {
      const res = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) return;
      this.editForm = res.data;
      // 编辑表单对话框
      this.editDialogVisible = true;
    },
    // 操作修改确定验证表单 - 编辑修改
    async editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const res = await this.$http.put("users/" + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        });
        if (res.meta.status !== 200)
          return this.$message.error("更新用户信息失败！");

        this.editDialogVisible = false;
        this.getUserList();
        // 提示修改成功
        this.$message.success("更新用户信息成功！");
        console.log(this.editForm);
      });
    },
    // 删除用户
    async removeUserById(id) {
      const confirmResult = await this.$messageBox(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      console.log(confirmResult);
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");
      const res = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除失败！");
      this.$message.success("删除成功！");
      this.getUserList();
    },
    // 分配角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      // 获取角色列表
      const res = await this.$http.get('roles')
      if (res.meta.status !== 200) 
        return this.$message.error('获取角色列表失败！')
        this.rolesList = res.data;
        this.setRoleDialogVisible = true;
    },
    // 确定按钮分配角色
    async saveRoleInfo(){
      // 是否选择了角色
      if(!this.selectedRoleId)
         return this.$message.error('请选择要分配的角色！')
      const res = await this.$http.put(`users/${this.userInfo.id}/role`,{
        rid:this.selectedRoleId
      })
      if(res.meta.status !== 200)
        return this.$message.error('更新角色失败！' + res.meta.msg)
      this.$message.success('更新角色成功！')
        this.getUserList()
        this.setRoleDialogVisible = false;
    },
    // 分配角色对话框关闭
    setRoleDialogClosed(){
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  },
};
</script>

<style lang="less" scoped>
</style>