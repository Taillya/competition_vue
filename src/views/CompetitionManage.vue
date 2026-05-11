<template>
    <div class="admin-page">
        <el-card shadow="never" class="toolbar-card">
            <el-form label-width="72px" class="toolbar-form" inline @submit.native.prevent>
                <el-form-item label="关键字">
                    <el-input clearable v-model="keyWord" placeholder="竞赛名称" class="toolbar-input"/>
                </el-form-item>
                <el-form-item label="条件">
                    <el-select v-model="type" placeholder="查询字段" class="toolbar-select">
                        <el-option label="名称" value="title"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    <el-button type="success" icon="el-icon-plus" plain @click="add()">添加竞赛</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-table
                :data="tableData"
                border
                stripe
                class="admin-table"
                style="width: 100%">
            <el-table-column property="id" label="编号" width="72" align="center"/>
            <el-table-column property="title" label="名称" min-width="200" show-overflow-tooltip/>
            <el-table-column label="类型" width="118" align="center">
                <template slot-scope="scope">
                    <el-tag size="small" :type="typeTagType(scope.row.type)" effect="plain">{{ scope.row.type }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column property="time" label="时间" width="118"/>
            <el-table-column label="状态" width="112" align="center">
                <template slot-scope="scope">
                    <el-tag size="small" :type="statusTagType(scope.row.status)">{{ scope.row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="开放报名" width="96" align="center">
                <template slot-scope="scope">
                    <el-tag size="mini" :type="Number(scope.row.registrationEnabled) === 1 ? 'success' : 'info'">
                        {{ Number(scope.row.registrationEnabled) === 1 ? '是' : '否' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="报名入口" width="108" align="center">
                <template slot-scope="scope">
                    <el-tag size="mini" type="info" effect="plain">{{ entryModeText(scope.row.registrationEntryMode) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="报名阶段" width="108" align="center">
                <template slot-scope="scope">
                    <el-tag size="mini" :type="phaseTagType(scope.row.registrationPhase)">{{ phaseText(scope.row.registrationPhase) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column property="participants" label="已通过" width="88" align="center"/>
            <el-table-column property="awards" label="奖项" min-width="120" show-overflow-tooltip/>
            <el-table-column label="操作" width="148" fixed="right" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" class="btn-edit" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" class="btn-del" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="admin-pagination"
                       background
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[5, 10, 20, 50]"
                       :page-size="pageSize"
                       :total="total"
                       :current-page.sync="currentPage"
                       @size-change="handleSizeChange"
                       @current-change="page">
        </el-pagination>

        <!-- 添加竞赛 -->
        <el-dialog title="添加竞赛" :visible.sync="dialogTableVisible" width="42%">
            <el-form :model="addForm" label-width="120px" style="max-width: 640px">
                <el-form-item label="名称">
                    <el-input v-model="addForm.title" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="addForm.type">
                        <el-option label="科技创新" value="tech"/>
                        <el-option label="学术论文" value="academic"/>
                        <el-option label="创业计划" value="business"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="奖项">
                    <el-input v-model="addForm.awards" />
                </el-form-item>
                <el-form-item label="开放网上报名">
                    <el-switch v-model="addForm.registrationEnabled" :active-value="1" :inactive-value="0" />
                </el-form-item>
                <el-form-item label="报名入口">
                    <el-select v-model="addForm.registrationEntryMode" placeholder="选择入口方式">
                        <el-option label="先选赛道（多赛道）" value="SELECT_TRACK"/>
                        <el-option label="直达报名表（须且仅有 1 条赛道）" value="DIRECT"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="报名开始">
                    <el-date-picker v-model="addForm.registrationStart" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="不选则仅受开关控制" style="width:100%"/>
                </el-form-item>
                <el-form-item label="报名截止">
                    <el-date-picker v-model="addForm.registrationEnd" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="不选则仅受开关控制" style="width:100%"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addClick">添加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 修改竞赛 -->
        <el-dialog title="修改竞赛" :visible.sync="dialogTableVisible2" width="42%">
            <el-form :model="updateForm" label-width="120px" style="max-width: 640px">
                <el-form-item label="ID">
                    <el-input v-model="updateForm.id" readOnly />
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="updateForm.title" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="updateForm.type">
                        <el-option label="科技创新" value="tech"/>
                        <el-option label="学术论文" value="academic"/>
                        <el-option label="创业计划" value="business"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="updateForm.status">
                        <el-option label="进行中" value="ongoing"/>
                        <el-option label="即将开始" value="upcoming"/>
                        <el-option label="已颁奖" value="awarded"/>
                        <el-option label="已结束" value="ended"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="奖项">
                    <el-input v-model="updateForm.awards" />
                </el-form-item>
                <el-form-item label="开放网上报名">
                    <el-switch v-model="updateForm.registrationEnabled" :active-value="1" :inactive-value="0" />
                </el-form-item>
                <el-form-item label="报名入口">
                    <el-select v-model="updateForm.registrationEntryMode" placeholder="选择入口方式">
                        <el-option label="先选赛道（多赛道）" value="SELECT_TRACK"/>
                        <el-option label="直达报名表（须且仅有 1 条赛道）" value="DIRECT"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="报名开始">
                    <el-date-picker v-model="updateForm.registrationStart" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%"/>
                </el-form-item>
                <el-form-item label="报名截止">
                    <el-date-picker v-model="updateForm.registrationEnd" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="updateClick">修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "AdminManage",
        data(){
            return{
                tableData:'',
                keyWord:'',
                type:'title',
                pageSize:5,
                total:'',
                currentPage:1,
                dialogTableVisible:false,
                dialogTableVisible2:false,
                addForm:{
                    title:'',
                    type:'',
                    awards:'',
                    registrationEnabled: 0,
                    registrationEntryMode: 'SELECT_TRACK',
                    registrationStart: '',
                    registrationEnd: ''
                },
                updateForm:{
                    id:'',
                    title:'',
                    type:'',
                    status:'',
                    awards:'',
                    registrationEnabled: 0,
                    registrationEntryMode: 'SELECT_TRACK',
                    registrationStart: '',
                    registrationEnd: ''
                }
            }
        },
        methods:{
            entryModeText(m) {
                if (m === 'DIRECT') return '直达报名'
                if (m === 'SELECT_TRACK') return '先选赛道'
                return m || '-'
            },
            phaseText(p) {
                const map = {
                    DISABLED: '未开放',
                    NOT_STARTED: '未开始',
                    ENDED: '已截止',
                    OPEN: '可报名'
                }
                return map[p] || '-'
            },
            typeTagType(typeLabel) {
                const m = {
                    '科技创新': '',
                    '学术论文': 'warning',
                    '创业计划': 'danger'
                }
                return m[typeLabel] != null ? m[typeLabel] : 'info'
            },
            statusTagType(statusLabel) {
                const m = {
                    '进行中': 'success',
                    '即将开始': 'warning',
                    '已结束': 'info',
                    '已颁奖': ''
                }
                return m[statusLabel] != null ? m[statusLabel] : 'info'
            },
            phaseTagType(p) {
                const m = {
                    DISABLED: 'danger',
                    NOT_STARTED: 'warning',
                    ENDED: 'info',
                    OPEN: 'success'
                }
                return m[p] || 'info'
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.currentPage = 1
                this.page(1)
            },
            page(currentPage){
                const _this = this
                axios.get('http://localhost:8181/competition/select?page='+currentPage+'&size='+_this.pageSize).then(function (response) {
                    _this.tableData = response.data.data
                    _this.total = response.data.total
                })
            },
            add(){
                this.dialogTableVisible = true
            },
            edit(row){
                this.dialogTableVisible2 = true
                this.updateForm.id = row.id
                this.updateForm.title = row.title
                this.updateForm.type = row.type
                this.updateForm.status = row.status
                this.updateForm.awards = row.awards
                this.updateForm.registrationEnabled = row.registrationEnabled != null ? Number(row.registrationEnabled) : 0
                this.updateForm.registrationEntryMode = row.registrationEntryMode || 'SELECT_TRACK'
                this.updateForm.registrationStart = row.registrationStart || ''
                this.updateForm.registrationEnd = row.registrationEnd || ''
            },
            addClick(){
                const _this = this
                const payload = Object.assign({}, _this.addForm)
                if (!payload.registrationStart) delete payload.registrationStart
                if (!payload.registrationEnd) delete payload.registrationEnd
                axios.post('http://localhost:8181/competition/add', payload).then((response) => {
                    if (response.data == true) {
                        _this.$alert('竞赛【'+_this.addForm.title+'】添加成功', '', {
                            confirmButtonText: '确定',
                            callback: action => {
                                location.reload()
                            }
                        });
                    }
                })
            },
            updateClick(){
                const _this = this
                const payload = Object.assign({}, _this.updateForm)
                if (!payload.registrationStart) delete payload.registrationStart
                if (!payload.registrationEnd) delete payload.registrationEnd
                axios.put('http://localhost:8181/competition/update', payload).then((response) => {
                    if (response.data == true) {
                        _this.$alert('竞赛【'+_this.updateForm.title+'】修改成功', '', {
                            confirmButtonText: '确定',
                            callback: action => {
                                location.reload()
                            }
                        });
                    }
                })
            },
            del(row){
                const _this = this
                this.$confirm('确认删除竞赛【'+row.title+'】吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.delete('http://localhost:8181/competition/delete/'+row.id).then(function (resp) {
                        if(resp.data == true){
                            _this.$alert('竞赛【'+row.title+'】已删除', '', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    location.reload()
                                }
                            });
                        }
                    });
                })
            },
            search() {
                const _this = this
                //让翻页复原
                _this.currentPage = 1
                axios.get('http://localhost:8181/competition/select?page=1&size='+_this.pageSize+'&keyWord='+_this.keyWord+"&type="+_this.type).then(function (response) {
                    _this.tableData = response.data.data
                    _this.total = response.data.total
                })
            },
        },
        created() {
            const _this = this
            axios.get('http://localhost:8181/competition/select?page=1&size='+_this.pageSize).then(function (response) {
                _this.tableData = response.data.data
                _this.total = response.data.total
            })
        }
    }
</script>

<style scoped>
.admin-page {
    margin: 0;
}

.toolbar-card {
    margin-bottom: 18px;
    border-radius: 10px;
    border: 1px solid #e8eef4;
    background: linear-gradient(180deg, #fafdff 0%, #ffffff 100%);
}

.toolbar-card ::v-deep .el-card__body {
    padding: 14px 18px 6px;
}

.toolbar-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
}

.toolbar-input {
    width: 220px;
}

.toolbar-select {
    width: 130px;
}

.admin-table {
    margin-top: 4px;
}

.admin-pagination {
    margin-top: 18px;
    display: flex;
    justify-content: flex-end;
}

.btn-edit {
    color: #0284c7 !important;
    font-weight: 500;
}

.btn-del {
    color: #dc2626 !important;
    font-weight: 500;
}
</style>
