<template>
    <el-container class="home_container" direction="vertical">
        <el-header class="home_header" height="58px">
            <div class="home_title">
                <span class="home_logo-dot" aria-hidden="true"></span>
                <span class="home_title-text">e赛云 · 高校竞赛管理系统</span>
                <span class="home_title-badge">管理端</span>
            </div>
            <div class="home_userinfoContainer">
                <el-avatar :src="imgUrl" class="user_avatar"></el-avatar>
                <el-dropdown trigger="click" class="home_dropdown">
                    <span class="el-dropdown-link home_userinfo">
                        {{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
        <el-container class="home_body">
            <el-aside width="228px" class="home_aside">
                <el-menu
                        router
                        :default-active="$route.path"
                        class="home_menu"
                        background-color="transparent"
                        text-color="#cbd5e1"
                        active-text-color="#0f172a">
                    <div class="aside_section">业务菜单</div>
                    <el-menu-item index="/certificateManage">
                        <div class="menu-item-content">
                            <i class="el-icon-star-on"></i>证书管理
                        </div>
                    </el-menu-item>
                    <el-menu-item index="/competitionManage">
                        <div class="menu-item-content">
                            <i class="el-icon-s-promotion"></i>竞赛管理
                        </div>
                    </el-menu-item>
                    <el-menu-item index="/noticeManage">
                        <div class="menu-item-content">
                            <i class="el-icon-message-solid"></i>公告管理
                        </div>
                    </el-menu-item>
                    <el-menu-item index="/registrationsManage">
                        <div class="menu-item-content">
                            <i class="el-icon-s-flag"></i>报名管理
                        </div>
                    </el-menu-item>
                    <el-menu-item index="/registrationsStatistics">
                        <div class="menu-item-content">
                            <i class="el-icon-data-analysis"></i>报名统计
                        </div>
                    </el-menu-item>
                    <el-menu-item index="/scoreManage">
                        <div class="menu-item-content">
                            <i class="el-icon-s-platform"></i>成绩管理
                        </div>
                    </el-menu-item>
                    <el-menu-item index="/studentManage">
                        <div class="menu-item-content">
                            <i class="el-icon-s-custom"></i>用户管理
                        </div>
                    </el-menu-item>
                    <el-menu-item index="/trackManage">
                        <div class="menu-item-content">
                            <i class="el-icon-menu"></i>赛道管理
                        </div>
                    </el-menu-item>
                    <el-menu-item index="/tagManage">
                        <div class="menu-item-content">
                            <i class="el-icon-success"></i>标签管理
                        </div>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main class="home_main">
                <div class="home_main_inner">
                    <div class="breadcrumb-row">
                        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                            <el-breadcrumb-item :to="{ path: '/certificateManage' }">工作台</el-breadcrumb-item>
                            <el-breadcrumb-item>{{ $route.name }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <div class="home_router_slot">
                        <router-view></router-view>
                    </div>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        methods: {
            logout() {
                let _this = this;
                this.$confirm('注销登录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    localStorage.removeItem('admin')
                    localStorage.removeItem('user')
                    localStorage.removeItem('token')
                    _this.$router.replace({ path: '/login' })
                })
            }
        },
        mounted: function () {
            this.user = JSON.parse(window.localStorage.getItem('user'))
        },
        data() {
            return {
                user: '',
                imgUrl: 'https://img1.baidu.com/it/u=3981550796,2434119925&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800'
            }
        }
    }
</script>

<style>
    .home_container {
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background: #e8edf3;
        flex-direction: column;
    }

    .home_body {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        min-height: 0;
    }

    /* 顶栏：低饱和灰蓝渐变，与内容区浅灰更协调 */
    .home_header {
        background: linear-gradient(105deg, #3d4d63 0%, #4d6078 36%, #617892 70%, #4f657d 100%);
        color: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 26px;
        box-shadow: 0 3px 14px rgba(51, 65, 85, 0.18);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 30;
        flex-shrink: 0;
    }

    .home_title {
        display: flex;
        align-items: center;
        gap: 14px;
    }

    .home_logo-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: linear-gradient(135deg, #7dd3fc, #c4b5fd);
        box-shadow: 0 0 12px rgba(125, 211, 252, 0.35);
        flex-shrink: 0;
    }

    .home_title-text {
        font-size: 22px;
        font-weight: 750;
        letter-spacing: 0.04em;
        color: #f8fafc;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .home_title-badge {
        font-size: 11px;
        font-weight: 600;
        color: #e0f2fe;
        background: rgba(255, 255, 255, 0.14);
        border: 1px solid rgba(255, 255, 255, 0.22);
        padding: 4px 12px;
        border-radius: 999px;
        letter-spacing: 0.08em;
    }

    .home_userinfoContainer {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .user_avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.35);
    }

    .home_dropdown {
        cursor: pointer;
    }

    .home_userinfo {
        font-size: 14px;
        font-weight: 500;
        color: #e2e8f0 !important;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .home_userinfo:hover {
        color: #ffffff !important;
    }

    /* 侧栏：与顶栏同款柔和灰蓝渐变 */
    .home_aside {
        background: linear-gradient(105deg, #3d4d63 0%, #4d6078 36%, #617892 70%, #4f657d 100%);
        box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.08), 4px 0 18px rgba(51, 65, 85, 0.12);
        overflow-x: hidden;
        overflow-y: auto;
        flex-shrink: 0;
    }

    .aside_section {
        padding: 22px 20px 10px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.14em;
        color: rgba(226, 232, 240, 0.42);
        text-transform: uppercase;
    }

    .home_menu {
        border-right: none !important;
        padding: 0 12px 28px;
    }

    .home_menu .el-menu-item {
        height: auto !important;
        line-height: normal !important;
        padding: 0 !important;
        margin-bottom: 6px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid transparent;
        transition: background 0.2s ease, border-color 0.2s ease;
    }

    .home_menu .el-menu-item:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        border-color: rgba(255, 255, 255, 0.14);
    }

    .home_menu .el-menu-item.is-active {
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.94), rgba(241, 245, 249, 0.9)) !important;
        border-color: rgba(255, 255, 255, 0.38);
        box-shadow: 0 6px 18px rgba(15, 23, 42, 0.22);
    }

    .home_menu .el-menu-item.is-active .menu-item-content {
        color: #0f172a !important;
        font-weight: 600;
    }

    .home_menu .el-menu-item.is-active .menu-item-content i {
        color: #0284c7 !important;
    }

    .menu-item-content {
        padding: 12px 14px;
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
        color: #e8eef4;
        line-height: 1.35;
    }

    .menu-item-content i {
        margin-right: 10px;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.78);
    }

    .home_main {
        flex: 1;
        min-width: 0;
        background: #e8edf3;
        color: #334155;
        padding: 16px 20px 22px;
        overflow-y: auto;
    }

    /* 面包屑与正文同一白卡片，顶部仅用分割线区分 */
    .home_main_inner {
        background: #fff;
        border-radius: 12px;
        border: 1px solid #dce3eb;
        box-shadow: 0 4px 28px rgba(15, 23, 42, 0.07);
        min-height: calc(100vh - 58px - 32px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .breadcrumb-row {
        flex-shrink: 0;
        padding: 14px 22px 12px;
        border-bottom: 1px solid #e8eef4;
        background: linear-gradient(180deg, #fafbfd 0%, #ffffff 100%);
        border-radius: 12px 12px 0 0;
    }

    .breadcrumb {
        margin: 0;
        padding: 0;
        background: transparent;
        border: none;
        box-shadow: none;
    }

    .breadcrumb .el-breadcrumb__inner {
        font-weight: 500;
        color: #64748b !important;
    }

    .breadcrumb .el-breadcrumb__item:last-child .el-breadcrumb__inner {
        color: #0f172a !important;
        font-weight: 600;
    }

    .home_router_slot {
        flex: 1;
        padding: 20px 22px 24px;
        min-height: 0;
        overflow-y: auto;
    }

    .home_main_inner .el-table {
        border-radius: 10px;
        overflow: hidden;
    }

    .home_main_inner .el-table th {
        background: #f8fafc !important;
        color: #475569 !important;
        font-weight: 600;
    }

    .home_main_inner .el-table--striped .el-table__body tr.el-table__row--striped td {
        background: #fafbfc !important;
    }

    .home_main_inner .el-table__body tr:hover > td {
        background: #f0f9ff !important;
    }

    .home_main_inner .el-button--primary {
        border-radius: 8px;
        background: linear-gradient(135deg, #0284c7, #6366f1);
        border: none;
        box-shadow: 0 2px 8px rgba(2, 132, 199, 0.35);
    }

    .home_main_inner .el-button--primary:hover {
        opacity: 0.94;
    }

    .home_main_inner .el-button--success {
        border-radius: 8px;
    }
</style>
