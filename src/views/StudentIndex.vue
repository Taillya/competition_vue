<template>
    <div class="index student-home">
        <headers></headers>
        <div class="index1">
            <div class="index2">
                <div class="index3">
                    激发潜能，竞逐梦想 —— e赛云 · 高校竞赛管理系统，助力学子成就未来辉煌！
                </div>
                <div class="index4">
                    Inspire potential, compete for dreams - the university competition management system helps students achieve future glory!
                </div>
                <h2 class="hero-section-label">热门入口</h2>
                <div class="hero-actions-row">
                    <div class="index6 hot-container" @click="tostudentAiInnovate">
                        <i class="el-icon-s-opportunity"></i>AI创新大赛报名
                        <span class="hot-label">hot</span>
                    </div>
                    <div class="index6" @click="tostudentCompetition">
                        <i class="el-icon-s-flag"></i>竞赛信息
                    </div>
                    <div class="index6" @click="toStudentScore">
                        <i class="el-icon-s-order"></i>成绩与证书
                    </div>
                </div>
            </div>
        </div>

        <div class="carousel-shell" ref="carouselShell">
            <el-carousel
                    class="student-carousel"
                    :height="carouselHeightPx"
                    :autoplay="true"
                    :interval="4000"
                    arrow="always"
            >
                <el-carousel-item v-for="(item, index) in carouselImages" :key="index">
                    <img :src="item" alt="轮播图" class="carousel-img">
                </el-carousel-item>
            </el-carousel>
        </div>

        <div class="index7 notice-board">
            <div class="index8">
                <div class="index9">
                    <div class="index10">
                        <div class="section-title">公告栏</div>
                        <el-button size="small" type="primary" plain @click="tostudentNotice()">查看更多</el-button>
                    </div>
                    <div class="index11" v-for="item in notices">
                        <div class="index12 notice-item">
                            <span>{{item.title}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="index7 competition-board">
            <div class="index8">
                <div class="index9">
                    <div class="index10">
                        <div class="section-title">竞赛报名</div>
                        <el-button size="small" type="primary" plain @click="tostudentCompetition()">查看更多</el-button>
                    </div>
                    <div class="index11" v-for="item in competitions">
                        <div class="index12 competition-item">
                            <span>{{item.title}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <bottoms></bottoms>
    </div>
</template>

<script>
    import bottoms from '/src/components/bottom.vue'
    import headers from '/src/components/header.vue'

    /** 与 C1.jpg 一致，用于轮播可视区域高宽比 */
    const C1_REF_WIDTH = 769
    const C1_REF_HEIGHT = 1080

    export default {
        data() {
            return {
                student: JSON.parse(window.localStorage.getItem('student')),
                notices: '',
                competitions: '',
                /** 轮播容器高度（px），随 .carousel-shell 宽度按 C1 比例计算 */
                carouselHeightPx: '720',
                /**
                 * 首页轮播图：当前使用 src/assets/image 下的 C1、C2、C3（打包时由 webpack 处理路径）。
                 * 可视区域高宽比按 C1（769×1080）适配；更换 C1 后若比例变化可改上方 C1_REF_* 常量。
                 */
                carouselImages: [
                    require('../assets/image/C1.jpg'),
                    require('../assets/image/C2.png'),
                    require('../assets/image/C3.png')
                ]
            };
        },
        components: {
            headers,
            bottoms
        },
        methods: {
            /** 按 C1 比例：高度 = 宽度 × (1080/769)；上限放宽以便大屏轮播更高、画面更大 */
            updateCarouselHeightFromShell() {
                const shell = this.$refs.carouselShell
                if (!shell) {
                    return
                }
                const w = shell.clientWidth
                if (!w) {
                    return
                }
                const ratio = C1_REF_HEIGHT / C1_REF_WIDTH
                let h = Math.round(w * ratio)
                const maxH = Math.round(window.innerHeight * 0.86)
                const minH = 400
                if (h > maxH) {
                    h = maxH
                }
                if (h < minH) {
                    h = minH
                }
                this.carouselHeightPx = String(h)
            },
            toStudentScore() {
                this.$router.push("/studentScore");
            },
            tostudentAiInnovate() {
                this.$router.push("/studentAiInnovate");
            },
            tostudentCompetition() {
                this.$router.push("/studentCompetition");
            },
            tostudentNotice() {
                this.$router.push("/studentNotice");
            }
        },
        mounted() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.$nextTick(() => {
                this.updateCarouselHeightFromShell()
                const shell = this.$refs.carouselShell
                if (shell && typeof ResizeObserver !== 'undefined') {
                    this._carouselResizeObserver = new ResizeObserver(() => this.updateCarouselHeightFromShell())
                    this._carouselResizeObserver.observe(shell)
                }
            })
            this._onWinResizeCarousel = () => this.updateCarouselHeightFromShell()
            window.addEventListener('resize', this._onWinResizeCarousel)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this._onWinResizeCarousel)
            if (this._carouselResizeObserver) {
                this._carouselResizeObserver.disconnect()
                this._carouselResizeObserver = null
            }
        },
        created() {
            const _this = this
            axios.get('http://localhost:8181/notice/load').then((response) => {
                const rows = response.data || []
                rows.sort((a, b) => {
                    const byDate = (b.date || '').localeCompare(a.date || '')
                    if (byDate !== 0) return byDate
                    return (b.id || 0) - (a.id || 0)
                })
                _this.notices = rows
            });
            axios.get('http://localhost:8181/competition/load').then(function (response) {
                _this.competitions = response.data
            })
        }
    };
</script>
<style scoped>
    /* 学生首页：蓝色系 + 浅灰底 */
    .student-home.index {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px 20px 32px;
        min-height: 100vh;
        box-sizing: border-box;
        background: linear-gradient(180deg, #eff6ff 0%, #f8fafc 42%, #f1f5f9 100%);
    }

    .student-home >>> .el-carousel__arrow {
        background: rgba(37, 99, 235, 0.45);
    }

    .student-home >>> .el-carousel__arrow:hover {
        background: rgba(37, 99, 235, 0.72);
    }

    .student-home >>> .el-carousel__indicators .el-carousel__indicator button {
        background-color: rgba(37, 99, 235, 0.35);
    }

    .student-home >>> .el-carousel__indicators .el-carousel__indicator.is-active button {
        background-color: #409eff;
    }

    /* 首屏主视觉 */
    .index1 {
        position: relative;
        overflow: hidden;
        background: linear-gradient(128deg, #1e3a8a 0%, #1d4ed8 40%, #2563eb 72%, #60a5fa 100%);
        color: #eff6ff;
        text-align: center;
        padding: 72px 28px 56px;
        border-radius: 16px;
        box-shadow: 0 16px 40px rgba(30, 64, 175, 0.28);
        margin-bottom: 28px;
        border: 1px solid rgba(255, 255, 255, 0.14);
    }

    .index1::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse 90% 55% at 18% 10%, rgba(255, 255, 255, 0.16), transparent 52%),
            radial-gradient(ellipse 70% 45% at 88% 88%, rgba(147, 197, 253, 0.28), transparent 48%);
        pointer-events: none;
    }

    .index2 {
        position: relative;
        z-index: 1;
    }

    .index3 {
        font-size: clamp(20px, 3.2vw, 30px);
        font-weight: 700;
        margin-bottom: 14px;
        letter-spacing: 0.02em;
        line-height: 1.45;
        color: #ffffff;
        text-shadow: 0 2px 18px rgba(0, 0, 0, 0.18);
    }

    .index4 {
        font-size: 14px;
        margin-bottom: 28px;
        opacity: 0.9;
        color: #dbeafe;
        line-height: 1.55;
        max-width: 820px;
        margin-left: auto;
        margin-right: auto;
    }

    .hero-section-label {
        font-size: 17px;
        font-weight: 600;
        margin: 0 0 18px;
        color: #eff6ff;
        letter-spacing: 0.12em;
    }

    .hero-actions-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 14px 16px;
    }

    .index6 {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.97);
        padding: 14px 22px;
        border-radius: 12px;
        box-shadow: 0 6px 20px rgba(30, 64, 175, 0.14);
        margin: 0;
        cursor: pointer;
        transition: transform 0.25s ease, box-shadow 0.25s ease;
        position: relative;
        color: #1e3a8a;
        font-weight: 600;
        border: 1px solid rgba(147, 197, 253, 0.65);
    }

    .index6 i {
        color: #2563eb;
        font-size: 18px;
    }

    .index6:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 28px rgba(30, 64, 175, 0.2);
    }

    .hot-container {
        position: relative;
    }

    .hot-label {
        position: absolute;
        top: -8px;
        right: -8px;
        background: linear-gradient(135deg, #ea580c, #f97316);
        color: white;
        font-size: 11px;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 6px;
        z-index: 1;
        letter-spacing: 0.04em;
    }

    .carousel-shell {
        width: 100%;
        box-sizing: border-box;
    }

    .student-carousel {
        margin-bottom: 28px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
        border: 1px solid rgba(148, 163, 184, 0.25);
    }

    .student-home >>> .student-carousel .el-carousel__item {
        overflow: hidden;
        box-sizing: border-box;
    }

    .carousel-img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
    }

    /* 公告 / 竞赛区块 */
    .index7 {
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06);
        padding: 22px 26px 18px;
        margin-bottom: 22px;
        transition: box-shadow 0.25s ease, transform 0.25s ease;
        border: 1px solid rgba(148, 163, 184, 0.22);
    }

    .index7:hover {
        box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
        transform: translateY(-2px);
    }

    /* 公告 / 竞赛列表文案居中 */
    .notice-board .notice-item,
    .competition-board .competition-item {
        text-align: center;
    }

    .notice-board .notice-item span,
    .competition-board .competition-item span {
        display: inline-block;
        width: 100%;
    }

    .section-title {
        font-size: 20px;
        font-weight: 700;
        color: #409eff;
        letter-spacing: 0.02em;
    }

    .index10 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 12px;
    }

    /* 与竞赛信息页标题「竞赛信息」同色：Element 主色 #409EFF */
    .student-home >>> .index10 .el-button--primary.is-plain {
        color: #409eff;
        border-color: rgba(64, 158, 255, 0.65);
        background: #ffffff;
    }

    .student-home >>> .index10 .el-button--primary.is-plain:hover {
        color: #ffffff;
        background: #409eff;
        border-color: #409eff;
    }

    .index11 {
        display: flex;
        flex-direction: column;
    }

    .notice-item,
    .competition-item {
        padding: 12px 4px;
        border-bottom: 1px solid #e2e8f0;
        font-size: 15px;
        color: #475569;
        transition: background-color 0.2s ease, color 0.2s ease;
    }

    .notice-item:hover,
    .competition-item:hover {
        background-color: #eff6ff;
        color: #409eff;
        cursor: pointer;
    }
</style>
