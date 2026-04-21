<template>
    <div class="achievement-container animate__animated">
        <headers />
        <!-- 成绩展示部分 -->
        <h1 class="section-subtitle animate__animated animate__fadeIn">
            <i class="el-icon-trophy"></i>
            我的竞赛成绩
        </h1>

        <div class="achievement-list" style="margin-left: 260px">
            <transition-group name="list">
                <el-card
                        v-for="(item, index) in scores"
                        :key="item.id"
                        class="achievement-card"
                        style="width:700px;margin: 10px"
                >
                    <div class="card-content">
                        <div class="medal" :class="getMedalClass(item.award)">
                            <i class="el-icon-medal"></i>
                        </div>
                        <div class="info">
                            <h3 class="competition-name">{{ item.competition }}</h3>
                            <div class="details" style="text-align: left">
                                <el-tag :type="getStatusType(item.status)">{{ item.status }}</el-tag>
                                <p class="award">
                                    <i class="el-icon-star-off"></i>
                                    奖项：{{ item.award }}
                                </p>
                                <p class="score">
                                    <i class="el-icon-data-analysis"></i>
                                    成绩：{{ item.score }}
                                </p>
                                <p class="date">
                                    <i class="el-icon-date"></i>
                                    公布日期：{{ item.date }}
                                </p>
                            </div>
                        </div>
                    </div>
                </el-card>
            </transition-group>
        </div>

        <!-- 证书展示部分 -->
        <h1 class="section-subtitle animate__animated animate__fadeIn">
            <i class="el-icon-document"></i>
            获奖证书
        </h1>

        <div class="certificate-grid" style="margin-left: 260px">
            <transition-group name="certificate">
                <el-card
                        v-for="(cert, index) in certificates"
                        :key="cert.id"
                        class="certificate-card"
                        :style="{
            transitionDelay: `${index * 0.2}s`,
            '--cert-color': cert.color
          }"
                        style="width:700px;margin: 10px"
                >
                    <div class="cert-header">
                        <span class="cert-id">证书编号：{{ cert.id }}</span>
                        <el-tag effect="dark" :color="cert.color">{{ cert.level }}</el-tag>
                    </div>
                    <div class="cert-body" style="text-align: left">
                        <div class="cert-main">
                            <h4 class="cert-title">{{ cert.title }}</h4>
                            <p class="cert-competition">{{ cert.competition }}</p>
                            <div class="cert-info">
                                <p><i class="el-icon-user"></i>获得者：{{ studentName }}</p>
                                <p><i class="el-icon-school"></i>颁发机构：{{ cert.organization }}</p>
                            </div>
                        </div>
                        <div class="cert-decoration">
                            <div class="ribbon" :style="{ backgroundColor: cert.color }"></div>
                            <i class="el-icon-document-checked cert-icon"></i>
                        </div>
                    </div>
                    <div class="cert-footer">

                        <el-button
                                type="primary"
                                :icon="downloadIcon"
                                :disabled="!cert.publish"
                                @click="downloadCert(cert)"
                        >
                            {{ cert.publish ? '下载证书' : '证书生成中' }}
                        </el-button>
                        <span class="cert-date">{{ cert.date }}</span>
                    </div>
                    <div class="watermark-text">{{ cert.level }} CERTIFICATE</div>
                </el-card>
            </transition-group>
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
                studentName: "张三",
                scores: '',
                certificates: '',
                downloadIcon: 'el-icon-download'
            }
        },
        methods: {
            getMedalClass(award) {
                const map = {
                    '一等奖': 'gold',
                    '二等奖': 'silver',
                    '三等奖': 'bronze',
                }
                return map[award] || 'default'
            },
            getStatusType(status) {
                return status === '已公布' ? 'success' : 'warning'
            },
            downloadCert(cert) {
                const loading = this.$loading({
                    text: '证书下载中',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                    try {
                        loading.close()
                        this.$alert('证书下载成功！', '', {
                            confirmButtonText: '确定',
                            callback: action => {
                                location.href = 'http://localhost:8181/certificate/download'
                            }
                        });
                    } catch (error) {
                        loading.close()
                        this.$alert('证书下载！', '', {
                            confirmButtonText: '确定'
                        });
                    }
                }, 2000)

            }
        },
        created() {
            const _this = this
            axios.get('http://localhost:8181/score/list').then(function (resp) {
                _this.scores = resp.data
            })
            axios.get('http://localhost:8181/certificate/list').then(function (resp) {
                _this.certificates = resp.data
            })
        }
    }
</script>

<style scoped>
    .achievement-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .section-title {
        font-size: 2rem;
        color: #2c3e50;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .achievement-list {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }

    .achievement-card {
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .achievement-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    .certificate-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    .card-content {
        display: flex;
        gap: 1.5rem;
        align-items: center;
    }

    .card-content .medal {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-size: 2rem;
    }

    .card-content .medal.gold {
        background: linear-gradient(45deg, #ffd700, #ffec80);
    }

    .card-content .medal.silver {
        background: linear-gradient(45deg, #c0c0c0, #e8e8e8);
    }

    .card-content .medal.bronze {
        background: linear-gradient(45deg, #cd7f32, #e89d6e);
    }

    .card-content .medal.blue {
        background: linear-gradient(45deg, #409eff, #a0cfff);
    }

    .card-content .competition-name {
        margin: 0 0 0.8rem;
        color: #2c3e50;
    }

    .card-content .details > * {
        margin: 0.5rem 0;
    }

    .card-content .details .el-tag {
        margin-right: 0.5rem;
    }

    .certificate-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }

    .certificate-card {
        position: relative;
        overflow: hidden;
        min-height: 260px;
        transition: transform 0.3s;
        border: 2px solid var(--cert-color);
        background: linear-gradient(to bottom right, rgba(var(--cert-color-rgb), 0.05), rgba(var(--cert-color-rgb), 0.02));
    }

    .certificate-card::before {
        content: '';
        position: absolute;
        top: -50px;
        right: -50px;
        width: 100px;
        height: 100px;
        background: var(--cert-color);
        transform: rotate(45deg);
        opacity: 0.1;
    }

    .certificate-card .cert-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(var(--cert-color-rgb), 0.2);
    }

    .certificate-card .cert-header .cert-id {
        font-size: 0.9em;
        color: #666;
    }

    .certificate-card .cert-body {
        display: flex;
        gap: 1.5rem;
    }

    .certificate-card .cert-body .cert-main {
        flex: 1;
    }

    .certificate-card .cert-body .cert-main .cert-title {
        font-size: 1.4rem;
        color: #2c3e50;
        margin: 0 0 0.5rem;
    }

    .certificate-card .cert-body .cert-main .cert-competition {
        color: #666;
        font-weight: 500;
        margin-bottom: 1.5rem;
    }

    .certificate-card .cert-body .cert-main .cert-info {
        background: rgba(var(--cert-color-rgb), 0.05);
        padding: 1rem;
        border-radius: 6px;
    }

    .certificate-card .cert-body .cert-main .cert-info p {
        margin: 0.4rem 0;
        color: #444;
    }

    .certificate-card .cert-body .cert-main .cert-info p i {
        margin-right: 0.5rem;
        color: var(--cert-color);
    }

    .certificate-card .cert-body .cert-decoration {
        position: relative;
        width: 80px;
    }

    .certificate-card .cert-body .cert-decoration .ribbon {
        position: absolute;
        top: -20px;
        right: -30px;
        width: 100px;
        height: 100px;
        transform: rotate(45deg);
        opacity: 0.2;
    }

    .certificate-card .cert-body .cert-decoration .cert-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        color: rgba(var(--cert-color-rgb), 0.3);
    }

    .certificate-card .cert-footer {
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(var(--cert-color-rgb), 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .certificate-card .watermark-text {
        position: absolute;
        bottom: -20px;
        right: -30px;
        font-size: 2rem;
        color: rgba(var(--cert-color-rgb), 0.05);
        transform: rotate(-15deg);
        white-space: nowrap;
        font-weight: 900;
        pointer-events: none;
    }

    .certificate-card[style*="#ffd700"] {
        --cert-color-rgb: 255, 215, 0;
    }

    .certificate-card[style*="#c0c0c0"] {
        --cert-color-rgb: 192, 192, 192;
    }

    .certificate-card[style*="#cd7f32"] {
        --cert-color-rgb: 205, 127, 50;
    }

    .certificate-card[style*="#409eff"] {
        --cert-color-rgb: 64, 158, 255;
    }

    .list-enter-active,
    .list-leave-active {
        transition: all 0.5s ease;
    }

    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }

    .certificate-enter-active {
        transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }

    .certificate-enter-from {
        opacity: 0;
        transform: scale(0.5) rotate(-10deg);
    }

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

    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>
