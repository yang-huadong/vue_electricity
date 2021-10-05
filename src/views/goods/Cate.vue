<template>
  <div>
    <!-- 面包悄导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 main.js注册过的tree-table 具体看官方文档-->
      <!-- data属性：表格各行的数据 -->
      <!-- selection-type：复选框，是否为多选类型表格 -->
      <!-- expand-type：是否为展开行类型表格(为true时，需要添加名称为'$expand')的作用域插槽，它可以获取到row.rowIndex -->
      <!-- show-index：是否显示数据索引 -->
      <!-- index-text：设置索引名称(String) -->
      <!-- border：是否显示纵向边框 -->
      <!-- show-row-hover：鼠标悬停时，是否高亮当前行 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        show-row-hover
      >
        <!-- 自定义模板渲染：是否有效 -->
        <template slot="isok" slot-scope="{ row }">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="!row.cat_deleted"
          ></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>

        <!-- 自定义模板渲染：排序 -->
        <template slot="order" slot-scope="{ row }">
          <el-tag size="mini" v-if="row.cat_level == 0">一级</el-tag>
          <el-tag size="mini" v-else-if="row.cat_level == 1" type="success"
            >二级</el-tag
          >
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="{ row }">
          <el-button
            @click="queryCate(row.cat_id)"
            type="primary"
            icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button
            @click="rmoveCate(row.cat_id)"
            type="danger"
            icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑商品" :visible.sync="editDialogVisible" width="40%">
      <el-form
        :model="queryCateList"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="商品分类：" prop="cat_name">
          <el-input v-model="queryCateList.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="是否有效">
          <el-select
            style="width: 100%"
            v-model="isCate"
            :placeholder="queryCateList.cat_deleted ? '是' : '否'"
          >
            <el-option :value="true" label="是"></el-option>
            <el-option :value="false" label="否"></el-option>
          </el-select>
          <!-- <el-select v-model="queryCateList" placeholder="请选择角色"> -->
          <!-- <el-radio :value="item.id" v-model="queryCateList.cat_deleted" label="1">备选项</el-radio>
            <el-radio v-model="queryCateList.cat_deleted" label="2">备选项</el-radio> -->
          <!-- </el-select> -->
        </el-form-item>
        <!-- <el-form-item label="排序：" prop="cat_level">
          <el-input v-model="queryCateList.cat_level"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCart">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类数据
      cateList: [],
      // 总条数
      total: 0,
      //  为table指定列的定义
      columns: [
        {
          // 列标题名称
          label: "分类名称",
          // 对应列内容的属性名
          prop: "cat_name",
        },
        // 自定义模板渲染
        {
          label: "是否有效",
          // 将当前定义为模板列
          type: "template",
          // 指定使用模板名称
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          // 指定使用模板名称
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          // 指定使用模板名称
          template: "opt",
        },
      ],
      //  对话框显示与隐藏
      addCateDialogVisible: false,
      // 编辑对话框
      editDialogVisible: false,
      // 添加分类的表单的数据
      addCateForm: {
        // 将要添加的分类名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0,
      },
      // 添加表单验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 二层（父级）分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        // 具体选中的值
        value: "cat_id",
        // 用户看到的值
        label: "cat_name",
        // 指定父子嵌套用的是哪个属性
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 查询到的数据
      queryCateList: {},
      // 查询到数据的名字
      cateName: "",
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 编辑商品是否有效
      isCate: "",
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const res = await this.$http.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      //   console.log(res);
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    // 添加分类按钮
    showAddCateDialog() {
      // 添加分类前拿到二层分类
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },

    // 添加分类前拿到二层分类
    async getParentCateList() {
      const res = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败！");
      }
      this.parentCateList = res.data;
    },

    // 点击确定添加分类
    addCate() {
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return; // 校验失败
        const res = await this.$http.post("categories", this.addCateForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败！");
        }
        this.$message.success("添加分类成功！");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },

    // 选择项发生变化触发这个函数
    parentCateChange() {
      console.log(this.selectedKeys);
      // 添加的是二级或三级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid =
        this.selectedKeys[this.selectedKeys.length - 1];
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      }
      // 添加的是一级的分类
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },

    // 当添加分类对话框关闭时
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();

      this.selectedKeys = []
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      this.addCateDialogVisible = false;
    },
    // 编辑之前查询
    async queryCate(id) {
      this.editDialogVisible = true;

      const res = await this.$http.get("categories/" + id);
      if (res.meta.status !== 200) return;
      this.queryCateList = res.data;
      this.cateName = this.queryCateList.cat_name;
      console.log(this.queryCateList);
    },
    // 编辑
    async editCart() {
      if (this.cateName == this.queryCateList.cat_name)
        return this.$message.info("请输入新名字");
      const res = await this.$http.put(
        "categories/" + this.queryCateList.cat_id,
        {
          cat_name: this.queryCateList.cat_name,
        }
      );
      if (res.meta.status !== 200) return this.$message.error("编辑失败");
      this.queryCateList.cat_deleted = this.isCate;
      this.getCateList();
      this.editDialogVisible = false;
      this.queryCateList = {};
      this.$message.success("编辑成功");
    },
    // 删除
    async rmoveCate(id) {
      console.log("你删除的id是" + id);
      const confirmResult = await this.$messageBox(
        "是否删除该分类名称?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");
      const res = await this.$http.delete("categories/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.getCateList();
      this.$message.success("删除成功");
    },
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>