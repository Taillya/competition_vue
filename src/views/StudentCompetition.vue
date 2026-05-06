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
                        prefix-icon="el-icon-search"
                >
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

        <!-- 仅在请求列表接口期间显示骨架屏（无人为延时） -->
        <div v-if="loading" class="skeleton-container" aria-busy="true">
            <div v-for="n in 6" :key="'sk-' + n" class="skeleton-card"></div>
        </div>

        <!-- 竞赛卡片列表 -->
        <transition-group
                v-show="!loading"
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
                    <div class="icon-wrapper" :class="competition.type">
                        <i :class="[competition.icon || 'el-icon-s-flag', 'card-type-icon']"></i>
                    </div>

                    <div class="info">
                        <h3 class="competition-title">{{ competition.title }}</h3>

                        <div class="meta">
                            <div class="meta-time">
                                <i class="el-icon-time meta-glyph"></i>
                                <span>{{ competition.time }}</span>
                            </div>
                            <div class="meta-tags">
                                <el-tag
                                        :type="(statusMap[competition.status] || { type: 'info' }).type"
                                        effect="plain"
                                        size="small"
                                        class="status-tag"
                                >
                                    {{ (statusMap[competition.status] || { text: competition.status || '-' }).text }}
                                </el-tag>
                                <el-tag
                                        v-if="competition.registrationPhase"
                                        :type="registrationPhaseStyle(competition.registrationPhase).type"
                                        effect="dark"
                                        size="small"
                                        class="status-tag"
                                >
                                    {{ registrationPhaseStyle(competition.registrationPhase).text }}
                                </el-tag>
                            </div>
                        </div>

                        <div class="stats">
                            <div class="stat-line">
                                <i class="el-icon-user-solid stat-glyph"></i>
                                <span>{{ competition.participants }} 支队伍已通过审核</span>
                            </div>
                            <div class="stat-line stat-award">
                                <i class="el-icon-medal stat-glyph"></i>
                                <span>奖项：{{ competition.awards }}</span>
                            </div>
                        </div>

                        <div class="card-actions">
                            <el-button
                                    type="primary"
                                    size="small"
                                    @click="goRegister(competition)"
                            >
                                报名参赛
                            </el-button>
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
        methods: {
            registrationPhaseStyle(phase) {
                const map = {
                    DISABLED: { text: '未开放报名', type: 'info' },
                    NOT_STARTED: { text: '报名未开始', type: 'warning' },
                    ENDED: { text: '报名已结束', type: 'danger' },
                    OPEN: { text: '可报名', type: 'success' }
                };
                return map[phase] || { text: phase || '', type: 'info' };
            },
            goRegister(competition) {
                if (!competition || !competition.id) {
                    return;
                }
                // 始终进入报名页；是否在报名窗口内由报名页与后端校验提示
                if (competition.registrationPhase && competition.registrationPhase !== 'OPEN') {
                    const tip = this.registrationPhaseStyle(competition.registrationPhase).text;
                    this.$message.warning(tip + '，仍可查看报名页');
                }
                this.$router.push({
                    path: '/studentAiInnovate',
                    query: {
                        competitionId: String(competition.id),
                        _nav: String(Date.now())
                    }
                }).catch(function () {
                    /* 忽略重复导航等 */
                });
            }
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
        created() {
            const _this = this
            _this.loading = true
            axios.get('http://localhost:8181/competition/list').then(function (resp) {
                _this.competitions = resp.data || []
            }).catch(function () {
                _this.competitions = []
                _this.$message.error('竞赛列表加载失败，请检查网络或稍后重试')
            }).then(function () {
                _this.loading = false
            })
        }
    };
</script>

<style scoped>
    .competition-card .icon-wrapper .card-type-icon {
        font-size: 28px;
        color: #fff;
        line-height: 1;
    }

    /* 竞赛容器样式：底部留白，避免最后一行贴近页脚 */
    .competition-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px 20px 48px;
        box-sizing: border-box;
        overflow: visible;
        min-height: min-content;
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
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.5rem;
        align-items: stretch;
        justify-items: stretch;
        width: 100%;
        padding-bottom: 8px;
        overflow: visible;
    }

    @media (max-width: 992px) {
        .competition-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 600px) {
        .competition-list {
            grid-template-columns: 1fr;
        }
    }

    /* 竞赛卡片样式（不要用 overflow:hidden 裁切标签与长文案） */
    .competition-card {
        background: white;
        border-radius: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s ease, transform 0.3s ease;
        position: relative;
        overflow: visible;
        width: 100%;
        max-width: none;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }

    /* 竞赛卡片悬停样式（缩小缩放幅度，减少边缘被裁切的观感） */
    .competition-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
    }

    /* 卡片内容样式 */
    .competition-card .card-content {
        padding: 1.25rem 1.35rem 1.35rem;
        display: flex;
        gap: 1rem;
        flex: 1;
        align-items: flex-start;
        min-height: 0;
    }

    /* 图标容器样式 */
    .competition-card .icon-wrapper {
        flex-shrink: 0;
        width: 56px;
        height: 56px;
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

    /* 信息区域：纵向撑满，按钮沉底对齐 */
    .competition-card .info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        text-align: left;
    }

    /* 竞赛标题样式 */
    .competition-card .info .competition-title {
        margin: 0 0 0.75rem;
        color: #303133;
        font-size: 1.05rem;
        line-height: 1.5;
        font-weight: 600;
        word-break: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        letter-spacing: 0.02em;
    }

    /* 元数据：时间单独一行，标签下一行，层次更清晰 */
    .competition-card .info .meta {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.45rem;
        margin-bottom: 0.65rem;
    }

    .competition-card .info .meta-time {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        color: #606266;
        font-size: 0.8125rem;
    }

    .competition-card .info .meta-time .meta-glyph {
        font-size: 14px;
        color: #909399;
    }

    .competition-card .info .meta-tags {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.35rem 0.45rem;
        width: 100%;
    }

    .competition-card .info .meta .status-tag {
        margin: 0;
    }

    /* 统计信息：与上方区隔开 */
    .competition-card .info .stats {
        font-size: 0.8125rem;
        color: #606266;
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        flex: 1 1 auto;
        margin: 0;
        padding: 0.65rem 0 0;
        border-top: 1px solid #ebeef5;
    }

    .competition-card .info .stats .stat-line {
        display: flex;
        align-items: flex-start;
        gap: 0.4rem;
        line-height: 1.5;
        word-break: break-word;
        overflow-wrap: anywhere;
    }

    .competition-card .info .stats .stat-glyph {
        flex-shrink: 0;
        margin-top: 2px;
        font-size: 14px;
        color: #909399;
    }

    .competition-card .info .stats .stat-award {
        color: #606266;
    }

    .competition-container .card-actions {
        margin-top: auto;
        padding-top: 0.85rem;
        display: flex;
        justify-content: flex-end;
        flex-shrink: 0;
    }

    /* 列表过渡：缩短时间，减轻「整页挪位」感 */
    .list-move,
    .list-enter-active,
    .list-leave-active {
        transition: opacity 0.2s ease, transform 0.2s ease;
    }

    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateY(8px);
    }

    /* 骨架屏容器样式 */
    .skeleton-container {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.5rem;
        align-items: stretch;
        width: 100%;
    }

    @media (max-width: 992px) {
        .skeleton-container {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 600px) {
        .skeleton-container {
            grid-template-columns: 1fr;
        }
    }

    /* 骨架屏卡片样式 */
    .skeleton-card {
        background: #f5f5f5;
        border-radius: 15px;
        min-height: 220px;
        height: auto;
        position: relative;
        overflow: hidden;
        width: 100%;
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
