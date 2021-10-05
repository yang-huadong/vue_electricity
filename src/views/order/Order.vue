<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getOrderList"
          >
            <el-button
              @click="getOrderList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" border style="width: 100%">
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="is_send" label="是否付款"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="addressVisible = true"
            ></el-button>
            <el-button
              type="success"
              @click="showProgressBox(row.order_id)"
              icon="el-icon-location"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 修改地址的对话框 -->
      <el-dialog
        @close="addressDialogClosed"
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
      >
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <!-- options：选择数据源 -->
            <!-- v-model：当前选择的值双向绑定到哪里，必须是数组 -->
            <el-cascader
              v-model="addressForm.address1"
              :options="cityData"
              :props="{ expandTrigger: 'hover' }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 导入省市区县数据
import cityData from "./citydata.js";
export default {
  name: "Order",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      orderList: [],
      /**
       * 修改对话框
       */
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      cityData,
      // 物流信息
      progressInfo: [],
      progressVisible:false
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const res = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取订单列表失败！");
      console.log(res);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 清空表单
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    async showProgressBox(order_id) {
      console.log("物流进度" + order_id);
      // API: 1.10.5查看物流信息
    //   const res = await this.$http.get("/kuaidi/1106975712662");
    //   console.log(res);
    //   if (res.meta.status !== 200) 
    //     return this.$message.error("获取物流进度失败！");
    //   this.progressInfo = res.data;
    //   console.log(this.progressInfo);
    //   this.progressVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>