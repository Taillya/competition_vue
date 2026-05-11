<template>
    <div>
        <el-form label-width="100px" class="demo-ruleForm">
            <el-form-item label="关键字：" prop="keyWord">
                <el-input clearable v-model="keyWord" placeholder="请输入关键字" style="width: 230px;float: left"></el-input>
                <span style="margin-left: 60px">条件查询：</span>
                <el-select v-model="type" style="width: 120px">
                    <el-option label="姓名" value="name" />
                    <el-option label="团队" value="team_name" />
                </el-select>
                <span style="margin-left: 20px">竞赛：</span>
                <el-select v-model="filterCompetitionId" clearable placeholder="全部竞赛" style="width: 220px">
                    <el-option v-for="c in competitions" :key="c.id" :label="c.title" :value="c.id"/>
                </el-select>
                <el-button type="primary" icon="el-icon-search" style="position: relative;left: 30px;" @click="search()">搜索</el-button>
                <el-button style="margin-left: 12px" @click="resetFilters">重置筛选</el-button>
            </el-form-item>
            <el-form-item label="报名审核策略：">
                <el-switch
                        v-model="autoApprove"
                        active-text="自动通过"
                        inactive-text="人工审核"
                        @change="changeAuditStrategy">
                </el-switch>
                <span style="margin-left: 12px;color: #909399;">
                    {{ autoApprove ? '用户提交后直接通过并记录审核时间' : '用户提交后进入待审核状态' }}
                </span>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%">
            <el-table-column type="index" label="编号" width="72" align="center" :index="tableIndex"/>
            <el-table-column property="competitionName" label="所属竞赛" width="200" show-overflow-tooltip />
            <el-table-column property="trackName" label="赛道" width="180" />
            <el-table-column property="teamName" label="团队" width="180" />
            <el-table-column property="name" label="姓名" width="100" />
            <el-table-column property="idCard" label="队长身份证号" width="180" />
            <el-table-column property="phone" label="电话" width="180" />
            <el-table-column property="email" label="邮箱" width="180" />
            <el-table-column property="provinceName" label="省份" width="140" />
            <el-table-column property="provinceCode" label="省级编码" width="120" />
            <el-table-column label="审核状态" width="110">
                <template slot-scope="scope">
                    <el-tag :type="statusTagType(scope.row.status)">{{ scope.row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column property="date" label="日期" width="180" show-overflow-tooltip/>
            <el-table-column label="操作" width="220" align="center" fixed="right">
                <template slot-scope="scope">
                    <div class="reg-action-btns">
                        <el-button
                                type="primary"
                                size="mini"
                                plain
                                @click="showMembers(scope.row)">
                            成员
                        </el-button>
                        <el-button
                                type="success"
                                size="mini"
                                plain
                                :disabled="scope.row.status !== '待审核'"
                                @click="auditRegistration(scope.row, '通过')">
                            通过
                        </el-button>
                        <el-button
                                type="danger"
                                size="mini"
                                plain
                                :disabled="scope.row.status !== '待审核'"
                                @click="auditRegistration(scope.row, '驳回')">
                            驳回
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="小组成员信息" :visible.sync="memberDialogVisible" width="520px">
            <el-table :data="memberTableData" border size="mini">
                <el-table-column prop="memberName" label="姓名" />
                <el-table-column prop="memberIdCard" label="身份证号" />
            </el-table>
        </el-dialog>
        <el-pagination style="margin-top: 20px;float: right"
                       background
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[5, 10, 20, 50]"
                       :page-size="pageSize"
                       :total="total"
                       :current-page.sync="currentPage"
                       @size-change="handleSizeChange"
                       @current-change="page">
        </el-pagination>

    </div>
</template>

<script>
    export default {
        name: "AdminManage",
        data(){
            return{
                tableData:'',
                keyWord:'',
                type:'name',
                filterCompetitionId: null,
                competitions: [],
                pageSize:5,
                total:'',
                currentPage:1,
                autoApprove:false,
                memberDialogVisible:false,
                memberTableData:[]
            }
        },
        methods:{
            listQueryUrl(pageNum) {
                const p = this.pageSize
                const params = new URLSearchParams()
                params.set('page', String(pageNum))
                params.set('size', String(p))
                const kw = (this.keyWord && String(this.keyWord).trim()) ? String(this.keyWord).trim() : ''
                if (kw) {
                    params.set('keyWord', kw)
                    params.set('type', this.type || 'name')
                }
                const cid = this.filterCompetitionId
                if (cid !== null && cid !== undefined && cid !== '') {
                    params.set('competitionId', String(cid))
                }
                params.set('_t', String(Date.now()))
                return 'http://localhost:8181/registrations/list?' + params.toString()
            },
            resetFilters() {
                this.keyWord = ''
                this.filterCompetitionId = null
                this.type = 'name'
                this.currentPage = 1
                this.search()
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.currentPage = 1
                this.page(1)
            },
            statusTagType(status) {
                if (status === '通过') return 'success'
                if (status === '驳回') return 'danger'
                return 'warning'
            },
            /** 列表序号：当前筛选结果内从 1 递增，随分页连续 */
            tableIndex(index) {
                return (this.currentPage - 1) * this.pageSize + index + 1
            },
            page(currentPage){
                const _this = this
                axios.get(_this.listQueryUrl(currentPage)).then(function (response) {
                    _this.tableData = response.data.data
                    _this.total = response.data.total
                })
            },
            search() {
                const _this = this
                _this.currentPage = 1
                axios.get(_this.listQueryUrl(1)).then(function (response) {
                    _this.tableData = response.data.data
                    _this.total = response.data.total
                })
            },
            auditRegistration(row, status) {
                const _this = this
                axios.put('http://localhost:8181/registrations/audit/' + row.id + '?status=' + encodeURIComponent(status)).then(function (response) {
                    if (response.data && response.data.code === 200) {
                        _this.$message.success('审核已更新')
                        _this.page(_this.currentPage)
                    } else {
                        _this.$message.error((response.data && response.data.msg) || '审核失败')
                    }
                }).catch(function () {
                    _this.$message.error('审核失败')
                })
            },
            showMembers(row) {
                const _this = this
                axios.get('http://localhost:8181/registrations/members/' + row.id).then(function (response) {
                    if (response.data && response.data.code === 200) {
                        _this.memberTableData = response.data.data || []
                        _this.memberDialogVisible = true
                    } else {
                        _this.$message.error((response.data && response.data.msg) || '成员加载失败')
                    }
                }).catch(function () {
                    _this.$message.error('成员加载失败')
                })
            },
            loadAuditStrategy() {
                const _this = this
                axios.get('http://localhost:8181/registrations/audit-strategy').then(function (response) {
                    if (response.data && response.data.code === 200) {
                        _this.autoApprove = !!response.data.data.autoApprove
                    }
                })
            },
            changeAuditStrategy(value) {
                const _this = this
                axios.put('http://localhost:8181/registrations/audit-strategy?autoApprove=' + value).then(function (response) {
                    if (response.data && response.data.code === 200) {
                        _this.$message.success('审核策略已更新')
                    } else {
                        _this.$message.error((response.data && response.data.msg) || '更新失败')
                    }
                }).catch(function () {
                    _this.$message.error('更新失败')
                    _this.autoApprove = !value
                })
            }
        },
        created() {
            const _this = this
            axios.get('http://localhost:8181/competition/list').then(function (resp) {
                _this.competitions = resp.data || []
            })
            axios.get(_this.listQueryUrl(1)).then(function (response) {
                _this.tableData = response.data.data
                _this.total = response.data.total
            })
            _this.loadAuditStrategy()
        }
    }
</script>

<style scoped>
    .reg-action-btns {
        display: inline-flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        gap: 6px;
        white-space: nowrap;
    }

    .reg-action-btns .el-button {
        margin-left: 0;
        padding-left: 10px;
        padding-right: 10px;
    }
</style>
