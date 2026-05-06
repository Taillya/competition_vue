<template>
    <div style="margin-top: 60px;margin-left:80px;border: 0px solid red;" >
        <el-form label-width="100px" class="demo-ruleForm">
            <el-form-item label="关键字：" prop="keyWord">
                <el-input clearable v-model="keyWord" placeholder="请输入关键字" style="width: 230px;float: left"></el-input>
                <span style="margin-left: 60px">条件查询：</span>
                <el-select v-model="type">
                    <el-option label="名称" value="title" />
                </el-select>
                <el-button type="primary" icon="el-icon-search" style="position: relative;left: 30px;" @click="search()">搜索</el-button>
                <el-button type="success" icon="el-icon-plus" style="position: relative;left: 60px;" @click="add()">添加竞赛</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%">
            <el-table-column property="id" label="编号" width="80" />
            <el-table-column property="title" label="名称" width="220" />
            <el-table-column property="type" label="类型" width="150" />
            <el-table-column property="time" label="时间" width="160" />
            <el-table-column property="status" label="状态" width="130" />
            <el-table-column property="participants" label="报名人数" width="110" />
            <el-table-column property="awards" label="奖项" width="130" />
            <el-table-column label="操作" width="160">
                <template slot-scope="scope" >
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
                       layout="prev, pager, next"
                       :page-size="pageSize"
                       :total="total"
                       :current-page.sync="currentPage"
                       @current-change="page">
        </el-pagination>

        <!-- 添加竞赛 -->
        <el-dialog title="添加竞赛" :visible.sync="dialogTableVisible" width="30%">
            <el-form :model="addForm" label-width="auto" style="max-width: 600px">
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
                <el-form-item>
                    <el-button type="primary" @click="addClick">添加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 修改证书 -->
        <el-dialog title="修改证书" :visible.sync="dialogTableVisible2" width="30%">
            <el-form :model="updateForm" label-width="auto" style="max-width: 600px">
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
                },
                updateForm:{
                    id:'',
                    title:'',
                    type:'',
                    status:'',
                    awards:''
                }
            }
        },
        methods:{
            page(currentPage){
                const _this = this
                axios.get('http://localhost:8181/competition/select?page='+currentPage+'&size='+_this.pageSize).then(function (response) {
                    _this.tableData = response.data.data
                    _this.pageSize = response.data.size
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
            },
            addClick(){
                const _this = this
                console.log(_this.addForm)
                axios.post('http://localhost:8181/competition/add',_this.addForm).then((response) => {
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
                console.log(_this.updateForm)
                axios.put('http://localhost:8181/competition/update',_this.updateForm).then((response) => {
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
                    _this.pageSize = response.data.size
                    _this.total = response.data.total
                })
            },
        },
        created() {
            const _this = this
            axios.get('http://localhost:8181/competition/select?page=1&size='+_this.pageSize).then(function (response) {
                _this.tableData = response.data.data
                _this.pageSize = response.data.size
                _this.total = response.data.total
            })
        }
    }
</script>

<style scoped>

</style>
