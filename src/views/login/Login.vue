<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="~assets/img/1.jpg" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form :rules="loginFormRules" :model="loginForm" ref="LoginFormRef" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="account">
          <el-input v-model="loginForm.account" placeholder="请输入内容" prefix-icon="iconfont icon-user">
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入内容" prefix-icon="iconfont icon-3702mima" type="password">
          </el-input>
        </el-form-item>
        <!-- 登录/重置按钮 -->
        <el-form-item>
          <el-row class="btns">
            <el-button @click="login" type="primary">登录</el-button>
            <el-button @click="resetLoginForm" type="info">重置</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {
  },
  data () {
    return {
      loginForm: {
        account: 'admin',
        password: '123456',
      },
      // 表单验证
      loginFormRules: {
        account: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    // 表单登录
    // 1 校验信息
    login () {
      this.$refs.LoginFormRef.validate(async (valid) => {
        if (!valid) return
        const res = await this.$http.post('login', this.loginForm)
        console.log(res);
        // if (res.meta.status !== 200) return this.$message.error('登录失败')

        // // 保存token
        // sessionStorage.setItem('token', res.data.token);
        // this.$message.success('登录成功');
        // this.$router.replace('/home')
      })
    },
    // 表单重置
    resetLoginForm () {
      this.$refs.LoginFormRef.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;

    .btns {
      display: flex;
      // 右对齐
      justify-content: flex-end;
    }
  }
}
</style>
