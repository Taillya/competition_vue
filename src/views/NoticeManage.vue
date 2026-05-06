<template>
    <div style="margin-top: 60px;margin-left:80px;border: 0px solid red;" >
        <el-form label-width="100px" class="demo-ruleForm">
            <el-form-item label="关键字：" prop="keyWord">
                <el-input clearable v-model="keyWord" placeholder="请输入关键字" style="width: 230px;float: left"></el-input>
                <span style="margin-left: 60px">条件查询：</span>
                <el-select v-model="type">
                    <el-option label="标题" value="title" />
                    <el-option label="内容" value="content" />
                </el-select>
                <el-button type="primary" icon="el-icon-search" style="position: relative;left: 30px;" @click="search()">搜索</el-button>
                <el-button type="success" icon="el-icon-plus" style="position: relative;left: 60px;" @click="add()">添加公告</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%">
            <el-table-column property="id" label="编号" width="125" />
            <el-table-column property="title" label="标题" width="300" />
            <el-table-column property="content" label="内容" width="300" />
            <el-table-column property="date" label="日期" width="300" />
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

        <!-- 添加公告 -->
        <el-dialog title="添加公告" :visible.sync="dialogTableVisible" width="30%">
            <el-form :model="addNotice" label-width="auto" style="max-width: 600px">
                <el-form-item label="标题">
                    <el-input v-model="addNotice.title" />
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="addNotice.content" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addClick">添加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 修改公告 -->
        <el-dialog title="修改公告" :visible.sync="dialogTableVisible2" width="30%">
            <el-form :model="updateNotice" label-width="auto" style="max-width: 600px">
                <el-form-item label="ID">
                    <el-input v-model="updateNotice.id" readOnly />
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="updateNotice.title" />
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="updateNotice.content" />
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
                type: 'title',
                updateNotice:{
                    id:'',
                    title:'',
                    content:''
                },
                addNotice:{
                    title:'',
                    content:''
                },
                dialogTableVisible2: false,
                dialogTableVisible: false,
                pageSize: 5,
                total: '',
                currentPage: 1,
                tableData: ''
            }
        },
        methods:{
            handleSizeChange(val) {
                this.pageSize = val
                this.currentPage = 1
                this.page(1)
            },
            add(){
                this.dialogTableVisible = true
            },
            edit(row){
                this.dialogTableVisible2 = true
                this.updateNotice.id = row.id
                this.updateNotice.title = row.title
                this.updateNotice.content = row.content
            },
            page(currentPage){
                const _this = this
                axios.get('http://localhost:8181/notice/select?page='+currentPage+'&size='+_this.pageSize).then(function (response) {
                    _this.tableData = response.data.data
                    _this.total = response.data.total
                })
            },
            search() {
                const _this = this
                //让翻页复原
                _this.currentPage = 1
                axios.get('http://localhost:8181/notice/select?page=1&size='+_this.pageSize+'&keyWord='+_this.keyWord+"&type="+_this.type).then(function (response) {
                    _this.tableData = response.data.data
                    _this.total = response.data.total
                })
            },
            addClick(){
                const _this = this
                axios.post('http://localhost:8181/notice/add',_this.addNotice).then((response) => {
                    if (response.data == true) {
                        _this.$alert('公告【'+_this.addNotice.title+'】添加成功', '', {
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
                axios.put('http://localhost:8181/notice/update',_this.updateNotice).then((response) => {
                    if (response.data == true) {
                        _this.$alert('公告【'+_this.updateNotice.title+'】修改成功', '', {
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
                this.$confirm('确认删除公告【'+row.title+'】吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.delete('http://localhost:8181/notice/delete/'+row.id).then(function (resp) {
                        if(resp.data == true){
                            _this.$alert('公告【'+row.title+'】已删除', '', {
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
            axios.get('http://localhost:8181/notice/select?page=1&size='+_this.pageSize).then(function (response) {
                _this.tableData = response.data.data
                _this.total = response.data.total
            })
        }
    }
</script>

<style scoped>

</style>
