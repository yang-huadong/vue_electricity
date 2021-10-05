<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
      >
      </el-alert>

      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
    </el-card>

    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button
          type="primary"
          :disabled="isBtnDisabled"
          @click="addDialogVisible = true"
          >添加参数</el-button
        >
        <el-table stripe border :data="manyTableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="{ row }">
              <el-tag
                :key="i"
                v-for="(item, i) in row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(i, row)"
              >
                {{ item }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="removeParams(scope.row.attr_id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="静态属性" name="only">
        <el-button
          type="primary"
          :disabled="isBtnDisabled"
          @click="addDialogVisible = true"
          >添加参数</el-button
        >
        <el-table stripe border :data="onlyTableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="{ row }">
              <el-tag
                :key="i"
                v-for="(item, i) in row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(i, row)"
              >
                {{ item }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="removeParams(scope.row.attr_id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      // 所有三级数据
      catelist: [],
      // 选择商品分类id
      selectedCateKeys: [],
      // 选择商品分类配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        // checkStrictly: true,
      },
      // 标识 only 或 many 来获取分类静态参数还是动态参数
      activeName: "many",
      // 动态参数数据
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],
      // 编辑按键获取到的数据
      editForm: [],
      editDialogVisible: false,
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      /**
       * 添加参数
       * */
      addDialogVisible: false,
      addForm: { attr_name: "" },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    // 获取分类id
    getCateId() {
      const len = this.selectedCateKeys.length;
      if (len === 3) {
        return this.selectedCateKeys[len - 1];
      }
      return null;
    },

    // 标题
    titleText() {
      if (this.activeName == "only") {
        return "静态参数";
      }
      return "动态参数";
    },

    // 添加参数是否禁用
    isBtnDisabled() {
      if (this.selectedCateKeys.length === 3) {
        return false;
      }
      return true;
    },
  },
  methods: {
    async getCateList() {
      const res = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败！");
      this.catelist = res.data;
    },
    // 选择框发生改变时
    async handleChange() {
      this.getParamsData();
    },
    // 获取参数列表数据
    async getParamsData() {
      const len = this.selectedCateKeys.length;
      if (len !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      const res = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      console.log(res.data);
      res.data.forEach((item, index) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputValue = "";
        item.inputVisible = false;
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取参数列表失败！");
      console.log(res);
      if (this.activeName == "only") {
        this.onlyTableData = res.data;
      } else {
        this.manyTableData = res.data;
      }
      //   console.log(this.manyTableData);
    },
    // 标签页变化时
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    },

    // 添加参数关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加参数确定按钮
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const res = await this.$http.post(
          `categories/${this.getCateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201)
          return this.$message.error("添加参数失败！");
        this.$message.success("添加参数成功！");
        this.getParamsData();
        this.addDialogVisible = false;
      });
    },
    // 编辑按钮
    async showEditDialog(attrId) {
      const res = await this.$http.get(
        `categories/${this.getCateId}/attributes/${attrId}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数信息失败！");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },

    // 编辑按钮对话框关闭时
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 编辑对话框确定按钮
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const res = await this.$http.put(
          `categories/${this.getCateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("修改参数失败！");
        this.$message.success("修改参数成功！");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    // 删除按钮
    async removeParams(attrId) {
      const confirmResult = await this.$messageBox(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      //   用户取消了删除的操作
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      const res = await this.$http.delete(
        `categories/${this.getCateId}/attributes/${attrId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败！");
      }
      this.$message.success("删除参数成功！");
      this.getParamsData();
    },

    // 操作数据库 中 的attr_vals
    async saveAttrVals(row) {
      const res = await this.$http.put(
        `categories/${this.getCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数项失败！");
      }

      this.$message.success("修改参数项成功！");
    },

    // tag删除
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row);
    },
    // tag关闭时或失去焦点时
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrVals(row);
    },
    // 显示Input框
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}
</style>