<template>
    <div>
        <div class="track-toolbar-wrap">
            <el-form :inline="true" label-width="84px" class="track-toolbar-form">
                <el-form-item label="关键字">
                    <el-input clearable v-model="keyWord" placeholder="请输入关键字" style="width: 168px"/>
                </el-form-item>
                <el-form-item label="条件查询">
                    <el-select v-model="type" style="width: 108px">
                        <el-option label="名称" value="name" />
                        <el-option label="描述" value="description" />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属竞赛">
                    <el-select v-model="filterCompetitionId" clearable placeholder="全部竞赛" style="width: 198px" @change="filterCompetitionChange">
                        <el-option v-for="c in competitions" :key="c.id" :label="c.title" :value="c.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="add()">添加赛道</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%">
            <el-table-column property="id" label="编号" width="125" />
            <el-table-column label="所属竞赛" width="200">
                <template slot-scope="scope">
                    {{ competitionTitle(scope.row.competitionId) }}
                </template>
            </el-table-column>
            <el-table-column property="name" label="名称" width="260" />
            <el-table-column property="description" label="描述" width="300" />
            <el-table-column property="tagsForManage" label="标签" width="300">
                <template slot-scope="scope">
                    <el-tag
                            v-for="(tag, idx) in scope.row.tagsForManage"
                            :key="idx"
                            size="small"
                            :type="tagTypes[idx % tagTypes.length]"
                            style="margin-left: 10px;margin-top: 10px"
                    >
                        {{ tag.text }}
                    </el-tag>
            　　</template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="edit(scope.row)">编辑</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
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

        <!-- 添加赛道 -->
        <el-dialog title="添加赛道" :visible.sync="dialogTableVisible" width="30%">
            <el-form :model="addForm" label-width="auto" style="max-width: 600px">
                <el-form-item label="所属竞赛" required>
                    <el-select v-model="addForm.competitionId" placeholder="请选择竞赛" style="width: 100%">
                        <el-option v-for="c in competitions" :key="c.id" :label="c.title" :value="c.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="addForm.name" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="addForm.description" />
                </el-form-item>
                <el-form-item label="标签">
                    <el-checkbox-group v-model="addForm.tag">
                        <el-checkbox v-for="item in tags" :label="item.id" name="tag">{{item.text}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addClick">添加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 修改赛道 -->
        <el-dialog title="修改赛道" :visible.sync="dialogTableVisible2" width="30%">
            <el-form :model="updateForm" label-width="auto" style="max-width: 600px">
                <el-form-item label="ID">
                    <el-input v-model="updateForm.id" readOnly />
                </el-form-item>
                <el-form-item label="所属竞赛" required>
                    <el-select v-model="updateForm.competitionId" placeholder="请选择竞赛" style="width: 100%">
                        <el-option v-for="c in competitions" :key="c.id" :label="c.title" :value="c.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="updateForm.name" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="updateForm.description" />
                </el-form-item>
                <el-form-item label="标签">
                    <el-checkbox-group v-model="updateForm.tag">
                        <el-checkbox v-for="item in tags" :label="item.id" name="tag">{{item.text}}</el-checkbox>
                    </el-checkbox-group>
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
        name: "CoachManage",
        data(){
            return{
                keyWord: '',
                type: 'name',
                updateForm:{
                    id:'',
                    competitionId: null,
                    name:'',
                    description:'',
                    tag:[]
                },
                filterCompetitionId: null,
                competitions: [],
                addForm:{
                    competitionId: null,
                    name:'',
                    description:'',
                    tag:[]
                },
                dialogTableVisible2: false,
                dialogTableVisible: false,
                pageSize: 5,
                total: '',
                currentPage: 1,
                tableData: '',
                tagTypes: ['', 'success', 'warning', 'danger', 'info'],
                tags:[]
            }
        },
        methods:{
            competitionTitle(id) {
                const c = this.competitions.find(x => x.id === id)
                return c ? c.title : ('#' + id)
            },
            filterCompetitionChange() {
                this.currentPage = 1
                this.page(1)
            },
            add(){
                this.dialogTableVisible = true
            },
            edit(row){
                this.dialogTableVisible2 = true
                this.updateForm.id = row.id
                this.updateForm.competitionId = row.competitionId
                this.updateForm.name = row.name
                this.updateForm.description = row.description
                let tagData = [];
                for(let i = 0;i < row.tagsForManage.length;i++){
                    tagData.push(row.tagsForManage[i].id);
                }
                this.updateForm.tag = tagData
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.currentPage = 1
                this.page(1)
            },
            page(currentPage){
                const _this = this
                let url = 'http://localhost:8181/track/load?page='+currentPage+'&size='+_this.pageSize
                if (_this.filterCompetitionId) {
                    url += '&competitionId=' + encodeURIComponent(_this.filterCompetitionId)
                }
                axios.get(url).then(function (response) {
                    _this.tableData = response.data.data
                    _this.total = response.data.total
                })
            },
            search() {
                const _this = this
                //让翻页复原
                _this.currentPage = 1
                let url = 'http://localhost:8181/track/load?page=1&size='+_this.pageSize+'&keyWord='+_this.keyWord+"&type="+_this.type
                if (_this.filterCompetitionId) {
                    url += '&competitionId=' + encodeURIComponent(_this.filterCompetitionId)
                }
                axios.get(url).then(function (response) {
                    _this.tableData = response.data.data
                    _this.total = response.data.total
                })
            },
            addClick(){
                const _this = this
                if (!_this.addForm.competitionId) {
                    _this.$message.warning('请选择所属竞赛')
                    return
                }
                axios.post('http://localhost:8181/track/add',_this.addForm).then((response) => {
                    if (response.data == true) {
                        _this.$alert('赛道【'+_this.addForm.name+'】添加成功', '', {
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
                axios.put('http://localhost:8181/track/update',_this.updateForm).then((response) => {
                    if (response.data == true) {
                        _this.$alert('赛道【'+_this.updateForm.name+'】修改成功', '', {
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
                this.$confirm('确认删除赛道【'+row.name+'】吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.delete('http://localhost:8181/track/delete/'+row.id).then(function (resp) {
                        if(resp.data == true){
                            _this.$alert('赛道【'+row.name+'】已删除', '', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    location.reload()
                                }
                            });
                        }
                    });
                })
            }
        },
        created() {
            const _this = this
            axios.get('http://localhost:8181/competition/list').then(function (resp) {
                _this.competitions = resp.data || []
            })
            axios.get('http://localhost:8181/track/load?page=1&size='+_this.pageSize).then(function (response) {
                _this.tableData = response.data.data
                _this.total = response.data.total
            })
            axios.get('http://localhost:8181/tag/list').then(function (response) {
                _this.tags = response.data
            })
        }
    }
</script>

<style scoped>
    .track-toolbar-wrap {
        overflow-x: auto;
        margin-bottom: 12px;
    }

    .track-toolbar-form.el-form--inline {
        display: inline-flex;
        flex-wrap: nowrap;
        align-items: center;
        white-space: nowrap;
    }

    .track-toolbar-form ::v-deep .el-form-item {
        margin-bottom: 0;
        margin-right: 10px;
        flex-shrink: 0;
    }

</style>
