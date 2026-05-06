<template>
  <div class="register-container">
    <h1 class="beautified-title">E通天下-高校竞赛管理系统</h1>
    <div class="register-wrapper">
      <el-form
          ref="registerForm"
          :model="registerForm"
          :rules="rules"
          label-position="top"
          class="register-page">
        <h3 class="title">学生注册</h3>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="registerForm.name" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password/>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="registerForm.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
            <el-radio label="未知">未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="registerForm.age" placeholder="请输入年龄"/>
        </el-form-item>
        <el-form-item label="学校名称" prop="address">
          <el-input v-model="registerForm.address" placeholder="请输入学校名称"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="registering" @click="submitRegister">注册</el-button>
          <el-button @click="$router.push('/login')">返回登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    const confirmPasswordValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请确认密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      registering: false,
      registerForm: {
        name: "",
        username: "",
        password: "",
        confirmPassword: "",
        gender: "未知",
        age: "",
        address: ""
      },
      rules: {
        name: [{required: true, message: "请输入姓名", trigger: "blur"}],
        username: [{required: true, message: "请输入用户名", trigger: "blur"}],
        password: [{required: true, message: "请输入密码", trigger: "blur"}],
        confirmPassword: [{validator: confirmPasswordValidator, trigger: "blur"}],
        address: [{required: true, message: "请输入学校名称", trigger: "blur"}]
      }
    };
  },
  methods: {
    submitRegister() {
      this.$refs.registerForm.validate(valid => {
        if (!valid) return;
        this.registering = true;
        const payload = {
          name: this.registerForm.name,
          username: this.registerForm.username,
          password: this.registerForm.password,
          gender: this.registerForm.gender,
          age: this.registerForm.age,
          address: this.registerForm.address
        };
        axios.post("http://localhost:8181/student/register", payload)
            .then(response => {
              const res = response.data || {};
              if (res.code === 0) {
                localStorage.setItem("prefillStudentUsername", this.registerForm.username);
                this.$message.success("注册成功，请登录");
                this.$router.push({path: "/login"});
                return;
              }
              this.$message.error(res.msg || "注册失败");
            })
            .finally(() => {
              this.registering = false;
            });
      });
    }
  }
};
</script>

<style scoped>
.register-container {
  width: 100%;
  min-height: 100vh;
  background-image: url('../assets/image/background.png');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
}

.beautified-title {
  font-size: 40px;
  color: #f0f0f0;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
}

.register-wrapper {
  width: 460px;
  background-color: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  padding: 24px 28px;
}

.title {
  text-align: center;
  margin-bottom: 16px;
}

.register-page .el-button {
  margin-right: 10px;
}
</style>
