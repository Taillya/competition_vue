<template>
    <div class="index">
        <headers></headers>
        <div class="index1">
            <div class="index2">
                <div class="index3">
                    激发潜能，竞逐梦想 —— e赛云 · 高校竞赛管理系统，助力学子成就未来辉煌！
                </div>
                <div class="index4">
                    Inspire potential, compete for dreams - the university competition management system helps students achieve future glory!
                </div>
                <h2 class="index5">热门话题推荐</h2>
                <div class="index5">
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

        <!-- 轮播图 -->
        <el-carousel interval="3000" arrow="always">
            <el-carousel-item v-for="(item, index) in carouselImages" :key="index">
                <img :src="item" alt="轮播图" style="width: 100%; height: 400px; object-fit: cover;">
            </el-carousel-item>
        </el-carousel>

        <div class="index7">
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
        <div class="index7">
            <div class="index8">
                <div class="index9">
                    <div class="index10">
                        <div class="section-title">竞赛报名</div>
                        <div class="index18">
                            <el-button size="small" type="success" plain @click="tostudentCompetition()">查看更多</el-button>
                        </div>
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

    export default {
        data() {
            return {
                student: JSON.parse(window.localStorage.getItem('student')),
                notices: '',
                competitions: '',
                carouselImages: [
                    'https://x0.ifengimg.com/ucms/2024_29/B85AA6D8184FAAC917CC5058E0E53C3A9532F0FE_size3801_w4343_h2487.jpg',
                    'https://img0.baidu.com/it/u=3249475431,2025187413&fm=253&fmt=auto&app=138&f=JPEG?w=1365&h=500',
                    'https://www.7claw.com/wp-content/uploads/2025/01/1736287800755_0.jpg'
                ]
            };
        },
        components: {
            headers,
            bottoms
        },
        methods: {
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
    /* 全局样式 */
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f9;
    }

    .index {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    /* 顶部宣传语样式 */
    .index1 {
        background: linear-gradient(135deg, #6a82fb, #fc5c7d);
        color: white;
        text-align: center;
        padding: 100px 0;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }

    .index3 {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .index4 {
        font-size: 18px;
        margin-bottom: 40px;
    }

    /* 热门话题推荐样式 */
    .index5 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .index6 {
        display: inline-block;
        background-color: white;
        padding: 15px 30px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin: 0 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        color: #2c3e50;
    }

    .index6:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .hot-container {
        position: relative;
    }

    .hot-label {
        position: absolute;
        top: -8px;
        right: -8px;
        background-color: red;
        color: white;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
        z-index: 1;
    }

    /* 轮播图样式 */
    .el-carousel {
        margin-bottom: 20px;
        border-radius: 10px;
        overflow: hidden;
    }

    /* 公告栏和竞赛报名模块公共样式 */
    .index7 {
        background-color: #ffffff;
        border-radius: 15px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
        padding: 25px;
        margin-bottom: 25px;
        transition: all 0.3s ease;
    }

    .index7:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
        transform: translateY(-3px);
    }

    .section-title {
        font-size: 22px;
        font-weight: 600;
        color: #333;
    }

    .index10 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .index11 {
        display: flex;
        flex-direction: column;
    }

    .notice-item,
    .competition-item {
        padding: 12px 0;
        border-bottom: 1px solid #e0e0e0;
        font-size: 16px;
        color: #555;
        transition: all 0.3s ease;
    }

    .notice-item:hover,
    .competition-item:hover {
        background-color: #f9f9f9;
        color: #2c3e50;
        cursor: pointer;
    }
</style>
