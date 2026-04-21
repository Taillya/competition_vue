<template>
    <div class="registration-container index">
        <headers />
        <!-- 竞赛基本信息 -->
        <div class="competition-header" :style="headerStyle">
            <div class="overlay"></div>
            <h1 class="title">全国大学生人工智能创新大赛</h1>
            <div class="meta-info">
                <el-tag type="warning" effect="dark">
                    <i class="el-icon el-icon-time"></i>
                    2025-03-15 ~ 2025-06-20
                </el-tag>
                <el-tag type="success" effect="light">
                    报名进行中
                </el-tag>
            </div>
        </div>

        <!-- 报名流程步骤 -->
        <el-steps :active="currentStep" align-center class="progress-steps">
            <el-step
                    v-for="(step, index) in steps"
                    :key="index"
                    :title="step.title"
                    :icon="step.icon"
                    :status="stepStatus(index)"
            />
        </el-steps>

        <!-- 步骤内容 -->
        <transition name="fade-slide" mode="out-in">
            <div :key="currentStep" class="step-content">
                <!-- 选择赛道 -->
                <div v-if="currentStep === 0" class="track-selection">
                    <div
                            v-for="track in tracks"
                            :key="track.id"
                            class="track-card"
                            :class="{ active: formData.trackId === track.id }"
                            @click="selectTrack(track.id,track.name)"
                    >
                        <i class="track-icon" style="margin-left: -276px" :class="track.icon"></i>
                        <h3 style="text-align: left;">{{ track.name }}</h3>
                        <p class="description">{{ track.description }}</p>
                        <div class="badges">
                            <el-tag
                                    v-for="(tag, idx) in track.tags"
                                    :key="idx"
                                    size="small"
                                    :type="tagTypes[idx % tagTypes.length]"
                            >
                                {{ tag }}
                            </el-tag>
                        </div>
                    </div>
                </div>

                <!-- 填写信息 -->
                <el-form
                        v-if="currentStep === 1"
                        ref="formData"
                        :model="formData"
                        class="info-form"
                        :rules="formRules"
                        label-width="auto"
                >
                    <el-form-item label="团队名称" prop="teamName">
                        <el-input v-model="formData.teamName" placeholder="请输入团队名称" clearable/>
                    </el-form-item>

                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="formData.name" placeholder="请输入姓名" clearable/>
                    </el-form-item>

                    <el-form-item label="学号" prop="studentId">
                        <el-input v-model="formData.studentId" placeholder="请输入学号" clearable/>
                    </el-form-item>

                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="formData.phone" placeholder="请输入联系电话" clearable/>
                    </el-form-item>

                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="formData.email" placeholder="请输入邮箱" clearable/>
                    </el-form-item>

                    <el-form-item label="电子签名" prop="signature">
                        <el-input v-model="formData.signature" placeholder="请输入电子签名" clearable/>
                    </el-form-item>

                    <el-form-item label="参赛声明" prop="agreed">
                        <el-scrollbar class="declaration-box">
                            <div>
                                <p>1. 参赛作品必须为原创，禁止抄袭...</p>
                                <p>2. 同意组委会对作品的非商业使用...</p>
                            </div>
                        </el-scrollbar>
                        <el-checkbox v-model="formData.agreed">
                            我已阅读并同意以上条款
                        </el-checkbox>
                    </el-form-item>
                </el-form>

                <!-- 确认提交 -->
                <div v-if="currentStep === 2" class="confirmation">
                    <el-descriptions title="报名信息概览" border>
                        <el-descriptions-item label="参赛赛道">
                            {{ formData.trackName }}
                        </el-descriptions-item>
                        <el-descriptions-item label="团队名称">
                            {{ formData.teamName }}
                        </el-descriptions-item>
                        <el-descriptions-item label="姓名">
                            {{ formData.name }}
                        </el-descriptions-item>
                        <el-descriptions-item label="学号">
                            {{ formData.studentId }}
                        </el-descriptions-item>
                        <el-descriptions-item label="联系电话">
                            {{ formData.phone }}
                        </el-descriptions-item>
                        <el-descriptions-item label="邮箱">
                            {{ formData.email }}
                        </el-descriptions-item>
                        <el-descriptions-item label="电子签名">
                            {{ formData.signature }}
                        </el-descriptions-item>
                    </el-descriptions>

                    <div class="signature">
                        <i class="sign-icon el-icon-s-check"></i>
                        <span>电子签名：{{ formData.signature }}</span>
                    </div>
                </div>
            </div>
        </transition>

        <!-- 操作按钮 -->
        <div class="action-buttons">
            <el-button :disabled="currentStep === 0" @click="prevStep">
                <i class="el-icon el-icon-arrow-left"></i>
                上一步
            </el-button>

            <el-button v-if="currentStep < steps.length - 1" type="primary" @click="nextStep">
                <i class="el-icon el-icon-arrow-right"></i>
                下一步
            </el-button>

            <el-button v-else type="success" :loading="submitting" @click="submitRegistration">
                <i class="el-icon el-icon-check"></i>
                确认提交
            </el-button>
        </div>
        <bottoms></bottoms>
    </div>
</template>

<script>
    import headers from '/src/components/header.vue'
    import bottoms from '/src/components/bottom.vue'

    export default {
        components: {
            headers,
            bottoms
        },
        data() {
            return {
                tracks: '',
                currentStep: 0,
                steps: [
                    { title: '选择赛道', icon: 'el-icon-date' },
                    { title: '填写信息', icon: 'el-icon-edit-outline' },
                    { title: '确认提交', icon: 'el-icon-folder-checked' }
                ],
                formData: {
                    trackId:'',
                    trackName:'',
                    agreed: '',
                    teamName: '',
                    name: '',
                    studentId: '',
                    phone: '',
                    email: '',
                    signature: ''
                },
                submitting: false,
                formRules: {
                    agreed: [{ required: true, message: '请阅读并同意声明'}],
                    teamName: [{ required: true, message: '请输入团队名称' }],
                    name: [{ required: true, message: '请输入姓名' }],
                    studentId: [{ required: true, message: '请输入学号' }],
                    phone: [{ required: true, message: '请输入联系电话' }],
                    email: [
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入正确的邮箱地址' }
                    ],
                    signature: [{ required: true, message: '请输入电子签名' }]
                },
                headerStyle: {
                    backgroundImage: `linear-gradient(45deg, #409EFF, #36a1f8)`
                },
                tagTypes: ['', 'success', 'warning', 'danger', 'info']
            }
        },
        methods: {
            stepStatus(index) {
                if (index < this.currentStep) return 'finish'
                return index === this.currentStep? 'process' : 'wait'
            },
            selectTrack(trackId,trackName) {
                this.formData.trackId = trackId
                this.formData.trackName = trackName
            },
            prevStep() {
                if (this.currentStep > 0) this.currentStep--
            },
            nextStep() {
                if (this.currentStep < this.steps.length - 1) {
                    if (this.currentStep === 0) {
                        if (!this.formData.trackId) {
                            this.$alert('请选择参赛赛道！', '', {
                                confirmButtonText: '确定'
                            });
                        } else {
                            this.currentStep++
                        }
                    } else if (this.currentStep === 1) {
                        this.$refs['formData'].validate((valid) => {
                            if (valid) {
                                this.currentStep++
                            }
                        });
                    }
                }
            },
            submitRegistration() {
                this.submitting = true
                const _this = this
                axios.post('http://localhost:8181/registrations/add', this.formData).then(response => {
                    _this.submitting = false
                    if (response.data == true) {
                        _this.$alert('提交成功！', '', {
                            confirmButtonText: '确定',
                            callback: action => {
                                location.reload()
                            }
                        });
                    } else {
                        _this.$alert('提交失败，请稍后重试！', '', {
                            confirmButtonText: '确定'
                        });
                    }
                })
            }
        },
        created() {
            const _this = this
            axios.get('http://localhost:8181/track/list').then(function (resp) {
                _this.tracks = resp.data
            })
        }
    }
</script>

<style scoped>
    /* 去除 SCSS 变量，直接使用值 */
    .registration-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .registration-container .competition-header {
        border-radius: 15px;
        padding: 2rem;
        margin-bottom: 2rem;
        position: relative;
        overflow: hidden;
        color: white;
    }

    .registration-container .competition-header .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
    }

    .registration-container .competition-header .title {
        position: relative;
        font-size: 2.2rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        text-align: left;
    }

    .registration-container .competition-header .meta-info {
        position: relative;
        margin-top: 1rem;
        display: flex;
        gap: 1rem;
    }

    .registration-container .competition-header .meta-info .el-tag {
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .registration-container .progress-steps {
        margin: 2rem 0;
        padding: 20px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }

    /* Vue 2 兼容的深度选择器 */
    .registration-container .progress-steps /deep/ .el-step__title {
        font-weight: 500;
    }

    .registration-container .step-content {
        min-height: 400px;
        background: white;
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }

    .registration-container .track-selection {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
    }

    .registration-container .track-selection .track-card {
        padding: 1.5rem;
        border: 2px solid #ebeef5;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .registration-container .track-selection .track-card:hover {
        transform: translateY(-5px);
        border-color: #409EFF;
    }

    .registration-container .track-selection .track-card.active {
        border-color: #409EFF;
        background: rgba(64, 158, 255, 0.05);
    }

    .registration-container .track-selection .track-card .track-icon {
        font-size: 2.5rem;
        color: #409EFF;
        margin-bottom: 1rem;
    }

    .registration-container .track-selection .track-card h3 {
        color: #303133;
        margin: 0.5rem 0;
    }

    .registration-container .track-selection .track-card .description {
        color: #606266;
        font-size: 0.9rem;
        min-height: 60px;
        text-align: left;
    }

    .registration-container .track-selection .track-card .badges {
        margin-top: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .registration-container .info-form .declaration-box {
        height: 200px;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        padding: 10px;
        margin-bottom: 10px;
    }

    .registration-container .confirmation .signature {
        margin-top: 2rem;
        padding: 1rem;
        background: #f5f7fa;
        border-radius: 8px;
        display: flex;
        align-items: center;
    }

    .registration-container .confirmation .signature .sign-icon {
        font-size: 2rem;
        color: #67C23A;
        margin-right: 1rem;
    }

    .registration-container .action-buttons {
        margin-top: 2rem;
        display: flex;
        justify-content: center;
        gap: 2rem;
    }

    /* 过渡动画 */
    .fade-slide-enter-active,
    .fade-slide-leave-active {
        transition: all 0.3s ease;
    }

    .fade-slide-enter-from {
        opacity: 0;
        transform: translateX(20px);
    }

    .fade-slide-leave-to {
        opacity: 0;
        transform: translateX(-20px);
    }

</style>
