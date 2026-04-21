<template>
    <div class="competition-container">
        <headers></headers>
        <!-- 标题部分 -->
        <div class="header">
            <h1 class="title">竞赛信息</h1>
            <div class="filters">
                <el-input
                        v-model="searchKeyword"
                        placeholder="搜索竞赛..."
                        class="search-input"
                        clearable
                >
                    <template slot="prefix">
                        <el-icon><Search /></el-icon>
                    </template>
                </el-input>
                <el-select
                        v-model="filterType"
                        placeholder="全部类型"
                        class="type-filter"
                >
                    <el-option label="全部" value="all" />
                    <el-option label="科技创新" value="tech" />
                    <el-option label="学术论文" value="academic" />
                    <el-option label="创业计划" value="business" />
                </el-select>
            </div>
        </div>

        <!-- 骨架屏加载效果 -->
        <div v-if="loading" class="skeleton-container">
            <div
                    v-for="n in 4"
                    :key="n"
                    class="skeleton-card"
            ></div>
        </div>

        <!-- 竞赛卡片列表 -->
        <transition-group
                name="list"
                tag="div"
                class="competition-list"
        >
            <div
                    v-for="competition in filteredCompetitions"
                    :key="competition.id"
                    class="competition-card"
            >
                <div class="card-content">
                    <!-- 图标区域 -->
                    <div class="icon-wrapper" :class="competition.type">
                        <i :class="competition.icon"></i>
                        <el-icon class="type-icon">
                            <component :is="competition.icon" />
                        </el-icon>
                    </div>

                    <!-- 内容区域 -->
                    <div class="info">
                        <h3 class="competition-title" style="text-align: left">{{ competition.title }}</h3>
                        <div class="meta">
              <span class="time" style="width: 100px">
                <el-icon><Clock /></el-icon>
                {{ competition.time }}
              </span>
                            <el-tag
                                    :type="statusMap[competition.status].type"
                                    effect="light"
                                    class="status-tag"
                                    style="margin-left: 40px"
                            >
                                {{ statusMap[competition.status].text }}
                            </el-tag>
                        </div>
                        <div class="stats">
              <span class="participants">
                <el-icon><User /></el-icon>
                {{ competition.participants }} 人已报名
              </span>
                            <span class="awards">
                <el-icon><Trophy /></el-icon>
                奖项：{{ competition.awards }}
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </transition-group>
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
                competitions: [],
                loading: true,
                searchKeyword: '',
                filterType: 'all',
                statusMap: {
                    ongoing: { text: '进行中', type: 'warning' },
                    upcoming: { text: '即将开始', type: 'success' },
                    ended: { text: '已结束', type: 'info' },
                    awarded: { text: '已颁奖', type: 'danger' }
                }
            };
        },
        computed: {
            filteredCompetitions() {
                return this.competitions.filter(comp => {
                    const matchesType = this.filterType === 'all' || comp.type === this.filterType;
                    const matchesSearch = comp.title.toLowerCase().includes(this.searchKeyword.toLowerCase());
                    return matchesType && matchesSearch;
                });
            }
        },
        mounted() {
            setTimeout(() => {
                this.loading = false;
            }, 1500);
        },
        created() {
            const _this = this
            axios.get('http://localhost:8181/competition/list').then(function (resp) {
                _this.competitions = resp.data
            })
        }
    };
</script>

<style scoped>
    .icon-wrapper i {
        font-size: 34px; /* 针对 i 标签的图标大小设置 */
        color: white;
    }

    /* 竞赛容器样式 */
    .competition-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    /* 头部样式 */
    .competition-container .header {
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* 标题样式 */
    .competition-container .header .title {
        color: #409EFF;
        font-size: 2.5rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* 筛选器样式 */
    .competition-container .header .filters {
        display: flex;
        gap: 1rem;
    }

    /* 搜索输入框样式 */
    .competition-container .header .filters .search-input {
        width: 250px;
    }

    /* 竞赛列表样式 */
    .competition-list {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr)); /* 每行显示 3 个卡片 */
        gap: 1.5rem;
        justify-items: center; /* 水平居中卡片 */
    }

    /* 竞赛卡片样式 */
    .competition-card {
        background: white;
        border-radius: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        width: 100%; /* 确保卡片占满列宽 */
        max-width: 350px; /* 可根据需要调整最大宽度 */
    }

    /* 竞赛卡片悬停样式 */
    .competition-card:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    }

    /* 卡片内容样式 */
    .competition-card .card-content {
        padding: 1.5rem;
        display: flex;
        gap: 1.5rem;
    }

    /* 图标容器样式 */
    .competition-card .icon-wrapper {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #409EFF 0%, #73b8ff 100%);
    }

    /* 科技类型图标容器样式 */
    .competition-card .icon-wrapper.tech {
        background: linear-gradient(135deg, #36a1f8, #69b9fc);
    }

    /* 学术类型图标容器样式 */
    .competition-card .icon-wrapper.academic {
        background: linear-gradient(135deg, #ff6b6b, #ff9e9e);
    }

    /* 商业类型图标容器样式 */
    .competition-card .icon-wrapper.business {
        background: linear-gradient(135deg, #4cd964, #7be28d);
    }

    /* 图标样式 */
    .competition-card .icon-wrapper .type-icon {
        font-size: 28px;
        color: white;
    }

    /* 信息区域样式 */
    .competition-card .info {
        flex: 1;
    }

    /* 竞赛标题样式 */
    .competition-card .info .competition-title {
        margin: 0 0 0.5rem;
        color: #333;
        font-size: 1.2rem;
    }

    /* 元数据区域样式 */
    .competition-card .info .meta {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    /* 时间样式 */
    .competition-card .info .meta .time {
        color: #666;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }

    /* 统计信息样式 */
    .competition-card .info .stats {
        font-size: 0.9rem;
        color: #666;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    /* 统计信息中的 span 样式 */
    .competition-card .info .stats span {
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }

    /* 列表过渡动画样式 */
    .list-move,
    .list-enter-active,
    .list-leave-active {
        transition: all 0.5s ease;
    }

    /* 列表进入起始状态样式 */
    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }

    /* 骨架屏容器样式 */
    .skeleton-container {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr)); /* 每行显示 3 个骨架屏 */
        gap: 1.5rem;
        justify-items: center;
    }

    /* 骨架屏卡片样式 */
    .skeleton-card {
        background: #f5f5f5;
        border-radius: 15px;
        height: 180px;
        position: relative;
        overflow: hidden;
        width: 100%;
        max-width: 350px;
    }

    /* 骨架屏卡片伪元素样式 */
    .skeleton-card::after {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 200%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
        animation: skeleton-shimmer 1.5s infinite;
    }

    /* 骨架屏闪烁动画 */
    @keyframes skeleton-shimmer {
        100% {
            left: 100%;
        }
    }
</style>
