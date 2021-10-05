<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="~assets/img/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-row>
        <el-button type="info" @click="logout">退出</el-button>
      </el-row>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="goggleCollapse">|||</div>
        <!-- 菜单容器 -->
        <el-menu
          :default-active="activePath"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse="isCollapse"
          unique-opened
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      
      <el-main>
          <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        // id为key，对应的值为value
        125: "iconfont icon-user",
        103: "iconfont icon-showpassword",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      // 是否折叠菜单
      isCollapse: false,
      // 保存激活的链接地址
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = sessionStorage.getItem('activePath');
    // console.log(this.activePath);
  },
  methods: {
    async getMenuList() {
      const res = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      //   console.log(res);
      this.menuList = res.data;
    },
    // 退出
    logout() {
      // token清空
      // sessionStorage.removeItem('token')
      window.sessionStorage.clear();
      this.$router.replace("/login");
    },
    // 是否折叠菜单
    goggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存点击按键的状态
    saveNavState(activePath) {
      sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
      console.log(this.activePath);
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between; // 左右两边对齐
  padding-left: 0;
  align-items: center; // 按钮不要上下贴边，得纵向剧中对齐
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center; // 纵向剧中对齐
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

// 菜单折叠
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em; // 字体之间的距离
  cursor: pointer;
}
</style>