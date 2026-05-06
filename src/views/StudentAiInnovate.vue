<template>
    <div class="registration-container index">
        <headers />
        <el-alert
                v-if="competitionDetail && competitionDetail.registrationPhase && competitionDetail.registrationPhase !== 'OPEN'"
                :title="phaseAlertTitle"
                type="warning"
                show-icon
                :closable="false"
                style="margin-bottom: 16px"
        />

        <!-- 竞赛基本信息 -->
        <div class="competition-header" :style="headerStyle">
            <div class="overlay"></div>
            <h1 class="title">{{ competitionTitle }}</h1>
            <div class="meta-info">
                <el-tag type="warning" effect="dark">
                    <i class="el-icon el-icon-time"></i>
                    {{ registrationTimeHint }}
                </el-tag>
                <el-tag :type="phaseTagType" effect="light">
                    {{ phaseHint }}
                </el-tag>
            </div>
        </div>

        <!-- 报名流程步骤 -->
        <el-steps :active="stepIndex" align-center class="progress-steps">
            <el-step
                    v-for="(step, index) in stepLabels"
                    :key="index"
                    :title="step.title"
                    :icon="step.icon"
                    :status="stepStatus(index)"
            />
        </el-steps>

        <!-- 步骤内容 -->
        <transition name="fade-slide" mode="out-in">
            <div :key="stepIndex + '-' + skipTrackStep" class="step-content">
                <!-- 选择赛道 -->
                <div v-if="showTrackPanel" class="track-selection">
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
                        v-if="showFormPanel"
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

                    <el-form-item label="队长身份证号" prop="idCard">
                        <el-input v-model="formData.idCard" placeholder="请输入队长身份证号" clearable/>
                    </el-form-item>

                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="formData.phone" placeholder="请输入联系电话" clearable/>
                    </el-form-item>

                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="formData.email" placeholder="请输入邮箱" clearable/>
                    </el-form-item>

                    <el-form-item label="所在省份" prop="provinceCode">
                        <el-select v-model="formData.provinceCode" placeholder="请选择省份" filterable clearable style="width: 100%">
                            <el-option
                                    v-for="item in provinceOptions"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="团队成员（含队长）" prop="members">
                        <div class="member-list">
                            <div class="member-row member-leader">
                                <el-input v-model="formData.name" placeholder="队长姓名" disabled style="width: 30%; margin-right: 10px;"/>
                                <el-input v-model="formData.idCard" placeholder="队长身份证号" disabled style="width: 40%; margin-right: 10px;"/>
                                <el-tag type="success">队长</el-tag>
                            </div>
                            <div class="member-row" v-for="(member, index) in extraMembers" :key="index">
                                <el-input v-model="member.memberName" placeholder="成员姓名" style="width: 30%; margin-right: 10px;"/>
                                <el-input v-model="member.memberIdCard" placeholder="成员身份证号" style="width: 40%; margin-right: 10px;"/>
                                <el-button type="danger" icon="el-icon-delete" @click="removeMember(index)" circle></el-button>
                            </div>
                            <el-button type="primary" plain icon="el-icon-plus" @click="addMember">添加成员</el-button>
                        </div>
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
                <div v-if="showConfirmPanel" class="confirmation">
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
                        <el-descriptions-item label="队长身份证号">
                            {{ formData.idCard }}
                        </el-descriptions-item>
                        <el-descriptions-item label="联系电话">
                            {{ formData.phone }}
                        </el-descriptions-item>
                        <el-descriptions-item label="邮箱">
                            {{ formData.email }}
                        </el-descriptions-item>
                        <el-descriptions-item label="所在省份">
                            {{ formData.provinceName }}
                        </el-descriptions-item>
                        <el-descriptions-item label="电子签名">
                            {{ formData.signature }}
                        </el-descriptions-item>
                    </el-descriptions>
                    <div class="member-preview">
                        <div class="member-preview-title">成员信息确认</div>
                        <el-table :data="previewMembers" border size="mini">
                            <el-table-column prop="memberName" label="姓名"/>
                            <el-table-column prop="memberIdCard" label="身份证号"/>
                        </el-table>
                    </div>

                    <div class="signature">
                        <i class="sign-icon el-icon-s-check"></i>
                        <span>电子签名：{{ formData.signature }}</span>
                    </div>
                </div>
            </div>
        </transition>

        <!-- 操作按钮 -->
        <div class="action-buttons">
            <el-button :disabled="stepIndex === 0" @click="prevStep">
                <i class="el-icon el-icon-arrow-left"></i>
                上一步
            </el-button>

            <el-button v-if="stepIndex < maxStepIndex" type="primary" @click="nextStep">
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
    import { PROVINCES } from '/src/constants/provinces'

    export default {
        components: {
            headers,
            bottoms
        },
        data() {
            return {
                tracks: [],
                competitionId: null,
                competitionDetail: null,
                skipTrackStep: false,
                stepIndex: 0,
                loadError: '',
                formData: {
                    competitionId: '',
                    trackId:'',
                    trackName:'',
                    agreed: '',
                    teamName: '',
                    name: '',
                    idCard: '',
                    phone: '',
                    email: '',
                    provinceCode: '',
                    provinceName: '',
                    submitterUserId: '',
                    members: [],
                    signature: ''
                },
                extraMembers: [],
                submitting: false,
                formRules: {
                    agreed: [{ required: true, message: '请阅读并同意声明'}],
                    teamName: [{ required: true, message: '请输入团队名称' }],
                    name: [{ required: true, message: '请输入姓名' }],
                    idCard: [{ required: true, message: '请输入队长身份证号' }],
                    phone: [{ required: true, message: '请输入联系电话' }],
                    email: [
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入正确的邮箱地址' }
                    ],
                    provinceCode: [{ required: true, message: '请选择所在省份' }],
                    signature: [{ required: true, message: '请输入电子签名' }]
                },
                headerStyle: {
                    backgroundImage: `linear-gradient(45deg, #409EFF, #36a1f8)`
                },
                tagTypes: ['', 'success', 'warning', 'danger', 'info'],
                provinceOptions: PROVINCES
            }
        },
        computed: {
            previewMembers() {
                return this.buildMembersPayload()
            },
            stepLabels() {
                if (this.skipTrackStep) {
                    return [
                        { title: '填写信息', icon: 'el-icon-edit-outline' },
                        { title: '确认提交', icon: 'el-icon-folder-checked' }
                    ]
                }
                return [
                    { title: '选择赛道', icon: 'el-icon-date' },
                    { title: '填写信息', icon: 'el-icon-edit-outline' },
                    { title: '确认提交', icon: 'el-icon-folder-checked' }
                ]
            },
            maxStepIndex() {
                return this.skipTrackStep ? 1 : 2
            },
            showTrackPanel() {
                return !this.skipTrackStep && this.stepIndex === 0
            },
            showFormPanel() {
                return (this.skipTrackStep && this.stepIndex === 0) || (!this.skipTrackStep && this.stepIndex === 1)
            },
            showConfirmPanel() {
                return (this.skipTrackStep && this.stepIndex === 1) || (!this.skipTrackStep && this.stepIndex === 2)
            },
            competitionTitle() {
                return (this.competitionDetail && this.competitionDetail.title) || '竞赛报名'
            },
            registrationTimeHint() {
                const d = this.competitionDetail
                if (!d) return ''
                const s = d.registrationStart || ''
                const e = d.registrationEnd || ''
                if (s && e) return `${s} ~ ${e}`
                if (s) return `${s} 起`
                if (e) return `截止 ${e}`
                return '报名时间请见竞赛说明'
            },
            phaseHint() {
                const m = {
                    DISABLED: '本站未开放报名',
                    NOT_STARTED: '报名未开始',
                    ENDED: '报名已结束',
                    OPEN: '报名进行中'
                }
                const p = this.competitionDetail && this.competitionDetail.registrationPhase
                return (p && m[p]) || '加载中'
            },
            phaseTagType() {
                const p = this.competitionDetail && this.competitionDetail.registrationPhase
                if (p === 'OPEN') return 'success'
                if (p === 'NOT_STARTED') return 'warning'
                if (p === 'ENDED') return 'danger'
                return 'info'
            },
            phaseAlertTitle() {
                return `当前不可提交报名：${this.phaseHint}`
            }
        },
        methods: {
            stepStatus(index) {
                if (index < this.stepIndex) return 'finish'
                return index === this.stepIndex ? 'process' : 'wait'
            },
            selectTrack(trackId,trackName) {
                this.formData.trackId = trackId
                this.formData.trackName = trackName
            },
            prevStep() {
                if (this.stepIndex > 0) this.stepIndex--
            },
            nextStep() {
                if (this.stepIndex >= this.maxStepIndex) return
                if (this.showTrackPanel) {
                    if (!this.formData.trackId) {
                        this.$alert('请选择参赛赛道！', '', { confirmButtonText: '确定' })
                        return
                    }
                    this.stepIndex++
                    return
                }
                if (this.showFormPanel) {
                    this.$refs['formData'].validate((valid) => {
                        if (valid) this.stepIndex++
                    })
                }
            },
            addMember() {
                this.extraMembers.push({ memberName: '', memberIdCard: '' })
            },
            removeMember(index) {
                this.extraMembers.splice(index, 1)
            },
            buildMembersPayload() {
                const members = [{
                    memberName: this.formData.name,
                    memberIdCard: this.formData.idCard
                }]
                this.extraMembers.forEach(member => {
                    if (member.memberName && member.memberIdCard) {
                        members.push({
                            memberName: member.memberName,
                            memberIdCard: member.memberIdCard
                        })
                    }
                })
                return members
            },
            submitRegistration() {
                if (!this.competitionDetail || this.competitionDetail.registrationPhase !== 'OPEN') {
                    this.$message.warning('当前不可提交（未开放报名或不在报名时间内）')
                    return
                }
                this.submitting = true
                const selectedProvince = this.provinceOptions.find(item => item.code === this.formData.provinceCode)
                this.formData.provinceName = selectedProvince ? selectedProvince.name : ''
                const members = this.buildMembersPayload()
                if (members.length === 0) {
                    this.submitting = false
                    this.$alert('请至少完善队长信息！', '', { confirmButtonText: '确定' })
                    return
                }
                const payload = {
                    ...this.formData,
                    members,
                    competitionId: this.formData.competitionId || this.competitionId
                }
                const _this = this
                axios.post('http://localhost:8181/registrations/add', payload).then(response => {
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
            },
            bootstrapRegistrationFlow() {
                const qid = this.$route.query.competitionId
                const _this = this
                _this.stepIndex = 0
                _this.skipTrackStep = false
                _this.tracks = []
                const detailUrl = qid
                    ? ('http://localhost:8181/competition/detail/' + encodeURIComponent(qid))
                    : 'http://localhost:8181/competition/defaultForRegistration'
                axios.get(detailUrl).then(function (resp) {
                    const body = resp.data || {}
                    if (body.code !== 200 || !body.data) {
                        _this.loadError = body.msg || '竞赛信息加载失败'
                        _this.$message.error(_this.loadError)
                        return
                    }
                    const d = body.data
                    _this.competitionDetail = d
                    _this.competitionId = d.id
                    _this.formData.competitionId = d.id
                    const direct = d.registrationEntryMode === 'DIRECT'
                    _this.skipTrackStep = !!direct
                    axios.get('http://localhost:8181/track/byCompetition?competitionId=' + encodeURIComponent(d.id)).then(function (tr) {
                        _this.tracks = tr.data || []
                        if (direct) {
                            if (!_this.tracks || _this.tracks.length !== 1) {
                                const n = (_this.tracks && _this.tracks.length) || 0
                                _this.$message.error(
                                    '「直达报名」表示跳过选赛道步骤，但仍需 1 条赛道用于保存报名表。' +
                                    '当前该竞赛下赛道数为 ' + n + '。请在「赛道管理」中为该竞赛新增且仅保留 1 条赛道（competition_id 指向本竞赛）。'
                                )
                                _this.skipTrackStep = false
                                return
                            }
                            const t0 = _this.tracks[0]
                            _this.formData.trackId = t0.id
                            _this.formData.trackName = t0.name
                            _this.stepIndex = 0
                        } else {
                            _this.stepIndex = 0
                        }
                    })
                }).catch(function () {
                    _this.$message.error('竞赛信息加载失败')
                })
            }
        },
        created() {
            const _this = this
            const currentUser = JSON.parse(window.localStorage.getItem('user') || '{}')
            if (currentUser && currentUser.username) {
                _this.formData.submitterUserId = currentUser.username
            }
            if (currentUser && currentUser.name) {
                _this.formData.name = currentUser.name
            }
            _this.bootstrapRegistrationFlow()
        },
        watch: {
            '$route.fullPath'() {
                this.bootstrapRegistrationFlow()
            }
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

    .registration-container .member-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .registration-container .member-row {
        display: flex;
        align-items: center;
    }

    .registration-container .member-leader {
        padding: 8px 0;
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

    .registration-container .member-preview {
        margin-top: 16px;
    }

    .registration-container .member-preview-title {
        font-weight: 600;
        margin-bottom: 8px;
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
