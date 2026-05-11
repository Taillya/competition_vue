<template>
    <div class="login-container">
        <h1 class="beautified-title">e赛云 - 高校竞赛管理系统</h1>
        <div class="login-wrapper">
            <el-form :model="ruleForm" :rules="rules"
                     status-icon
                     ref="ruleForm"
                     label-position="left"
                     label-width="0px"
                     class="demo-ruleForm login-page">
                <h3 class="title">系统登录</h3>
                <el-form-item prop="username">
                    <el-input type="text"
                              v-model="ruleForm.username"
                              auto-complete="off"
                              placeholder="用户名"
                              :prefix-icon="usernameIcon"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password"
                              v-model="ruleForm.password"
                              auto-complete="off"
                              placeholder="密码"
                              :prefix-icon="passwordIcon"
                    ></el-input>
                </el-form-item>

                <el-form-item class="login-role-row">
                    <el-radio v-model="ruleForm.type" label="admin" border>管理员</el-radio>
                    <el-radio v-model="ruleForm.type" label="student" border>学生</el-radio>
                </el-form-item>

                <el-form-item class="login-submit-wrap">
                    <el-button type="primary" class="login-submit-btn" @click="handleSubmit" :loading="logining">登录</el-button>
                </el-form-item>
                <el-form-item class="register-link-wrap">
                    <span class="register-line">
                        <span class="register-hint">没有账号？</span>
                        <router-link to="/register" class="register-link">学生注册</router-link>
                    </span>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                ruleForm: {
                    username: 'admin1',
                    password: '123123',
                    type: 'admin'
                },
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}]
                },
                logining: false,
                usernameIcon: 'el-icon-user',
                passwordIcon: 'el-icon-lock'
            }
        },
        methods: {
            handleSubmit() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.logining = true
                        let _this = this
                        axios.get('http://localhost:8181/login', {params: _this.ruleForm}).then(function (response) {
                            _this.logining = false
                            if (response.data.code == -1) {
                                _this.$alert(response.data.msg, '提示', {
                                    confirmButtonText: '确定'
                                })
                            } else {
                                const payload = response.data.data;
                                const token = payload.token;
                                const user = payload.user;
                                if (!token || !user) {
                                    _this.$alert('登录返回数据异常', '提示', { confirmButtonText: '确定' });
                                    return;
                                }
                                localStorage.setItem('token', token);
                                localStorage.setItem('user', JSON.stringify(user));
                                if (_this.ruleForm.type == 'admin') {
                                    _this.$router.replace({path: '/adminIndex'})
                                } else {
                                    _this.$router.replace({path: '/studentIndex'})
                                }
                            }
                        })
                    } else {
                        console.log('error submit!');
                        return false;
                    }
                })
            }
        },
        mounted() {
            const guardMsg = sessionStorage.getItem('AUTH_GUARD_MESSAGE')
            if (guardMsg) {
                sessionStorage.removeItem('AUTH_GUARD_MESSAGE')
                this.$alert(guardMsg, '访问提示', {
                    confirmButtonText: '我知道了',
                    type: 'warning'
                })
            }
            const prefillUsername = localStorage.getItem('prefillStudentUsername')
            if (prefillUsername) {
                this.ruleForm.username = prefillUsername
                this.ruleForm.password = ''
                this.ruleForm.type = 'student'
                localStorage.removeItem('prefillStudentUsername')
            }
        }
    }
</script>

<style scoped>
    /* 引入 Google Fonts 中的特殊字体 */
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

    .beautified-title {
        /* 使用引入的字体 */
        font-family: 'Playfair Display', serif;
        /* 定义字体大小 */
        font-size: 58px;
        /* 字体颜色改为白色系 */
        color: #f0f0f0;
        /* 添加文本阴影 */
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        /* 添加过渡效果 */
        transition: all 0.3s ease;
        /* 添加居中对齐 */
        text-align: center;
        /* 添加内边距 */
        padding: 20px;
        /* 添加动画效果 */
        animation: fadeInUp 1s ease both;
        margin-top: 0;
    }

    /* 定义鼠标悬停效果 */
    .beautified-title:hover {
        transform: scale(1.1);
    }

    /* 定义动画 */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .login-container {
        box-sizing: border-box;
        width: 100%;
        min-height: 100vh;
        background-image: url('../assets/image/background.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 24px 16px;
    }

    .login-wrapper {
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 15px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        padding: 30px;
    }

    .login-page {
        width: 350px;
        padding: 35px 35px 15px;
    }

    .title {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-bottom: 30px;
        text-align: center;
    }

    .el-form-item {
        margin-bottom: 20px;
    }

    .el-input {
        border-radius: 8px;
        border: 1px solid #dcdfe6;
        height: 40px;
        font-size: 14px;
    }

    .el-input__prefix {
        color: #999;
        font-size: 16px;
    }

    .login-role-row ::v-deep .el-form-item__content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        margin-left: 0 !important;
    }

    .login-role-row ::v-deep .el-radio {
        margin-right: 0;
        font-size: 14px;
    }

    .login-submit-wrap {
        text-align: center;
        margin-bottom: 8px;
    }

    .login-submit-btn {
        width: 80%;
        height: 40px;
        border-radius: 8px;
        font-size: 16px;
    }

    .register-link-wrap {
        margin-top: 0;
        margin-bottom: 0;
        text-align: center;
    }

    .register-line {
        display: inline-block;
        font-size: 13px;
        line-height: 1.5;
    }

    .register-hint {
        color: #909399;
    }

    .register-link {
        display: inline-block;
        font-size: 13px;
        color: #409eff;
        text-decoration: none;
        line-height: 1.5;
    }

    .register-link:hover {
        color: #66b1ff;
        text-decoration: underline;
    }
</style>
