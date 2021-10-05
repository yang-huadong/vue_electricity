<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="添加商品信息"
        :closable="false"
        type="info"
        center
        show-icon
      >
      </el-alert>

      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :before-leave="beforeTabLeave"
          tab-position="left"
          v-model="activeIndex"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="用户管理" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!--  -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action ：表示图片要上传到的后台api地址 -->
            <!-- on-preview：点击图片触发的事件(预览) -->
            <!-- on-remove：单击关闭按钮的时候触发事件 -->
            <!-- list-type：指定当前预览组件的呈现方式 -->
            <!-- headers属性	设置上传的请求头部	object -->
            <!-- on-success：上传文件成功调用 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
        <el-button type="primary" class="btnAdd" @click="add"
          >添加商品</el-button
        >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <el-image :src="previewPath" :preview-src-list="addForm.pics"> </el-image>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "Add",
  data() {
    return {
      // 标识进度
      activeIndex: "0",
      addForm: {
        // 商品名称
        goods_name: "",
        // 商品价格
        goods_price: 0,
        // 商品重量
        goods_weight: 0,
        // 商品数量
        goods_number: 0,
        // 商品分类
        goods_cat: [],
        // 图片数组  要放大预览的图片
        pics: [],
        attrs: [],
        // 富文本绑定内容
        goods_introduce: "",
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
      },
      // 商品分类数据
      catelist: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 动态参数
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 预览
      previewPath: "",
      // 预览隐藏对话框
      previewVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    getCateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      // API: 1.6.1商品分类数据列表
      const res = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败！");
      }
      this.catelist = res.data;
      //   console.log(this.catelist);
    },
    // 级联选择框发生改变时
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 标签页被切换之前
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('即将离开的标签页名字是' + oldActiveName);
      // console.log('即将进入的标签页名字是' + activeName);
      if (oldActiveName == "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
    },
    // 切换标签页应有获取数据
    async tabClicked() {
      if (this.activeIndex == "1") {
        const res = await this.$http.get(
          "categories/" + this.getCateId + "/attributes",
          {
            params: { sel: "many" },
          }
        );
        console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("获取动态参数列表失败！");
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length !== 0 ? item.attr_vals.split(" ") : [];
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex == "2") {
        const res = await this.$http.get(
          `categories/${this.getCateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性列表失败！");
        }
        console.log(res.data);
        this.onlyTableData = res.data;
      }
    },
    // 点击图片触发 点击图片触发的事件(预览)
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 处理移除图片的操作
    // file：将要被移除的那张图片信息
    handleRemove(file) {
      console.log(file);
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((item) => item.pic === filePath);
      console.log(i);
      if (i !== -1) {
        this.$message.success("移除成功");
        this.addForm.pics.splice(i, 1);
        this.previewPath = "";
      }
      // console.log(this.addForm);
    },
    // 图片文件上传成功时的回调
    handleSuccess(response) {
      console.log(response);
      if (response.meta.status !== 200)
        return this.$message.error("文件上传失败");
      const picInfo = {
        pic: response.data.tmp_path,
      };
      this.addForm.pics.push(picInfo);
      // console.log(this.addForm);
    },
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写必要的表单项");

        // 报错
        console.log(this.addForm.goods_cat);
        this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        console.log(this.addForm.goods_cat);

        // 深度克隆
        // const form = JSON.parse(JSON.stringify(this.addForm));
        // const form = _.cloneDeep(this.addForm);
        // const form = this.addForm
        // form.goods_cat = form.goods_cat.join(",");
        // form.a = "test";
        // console.log(form);
        // console.log(this.addForm);
        // this.manyTableData.forEach((item) => {
        //   const newInfo = {
        //     attr_id: item.attr_id,
        //     attr_value: item.attr_vals.join(" "),
        //   };
        //   this.attrs.push(newInfo);
        // });
        // this.onlyTableData.forEach((item) => {
        //   const newInfo = {
        //     attr_id: item.attr_id,
        //     attr_value: item.attr_vals,
        //   };
        //   this.attrs.push(newInfo);
        // });
        // form.attrs = this.addForm.attrs;
        // const res = await this.$http.post("goods", form);
        // if (res.meta.status !== 201) {
        //   console.log(res);
        //   return this.$message.error("添加商品失败！");
        // }
        // this.$message.success("添加商品成功！");
        // // 跳转到商品列表
        // this.$router.push("/goods");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.btnAdd {
  margin-top: 15px;
}
</style>