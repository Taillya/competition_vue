<template>
    <div style="margin-top: 60px;margin-left:80px;border: 0px solid red;" >
        <el-button type="success" icon="el-icon-plus" style="position: relative;top: -20px;" @click="add()">添加标签</el-button>
        <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%">
            <el-table-column property="id" label="编号" width="300" />
            <el-table-column property="text" label="内容" width="600" />
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
                       layout="prev, pager, next"
                       :page-size="pageSize"
                       :total="total"
                       :current-page.sync="currentPage"
                       @current-change="page">
        </el-pagination>

        <!-- 添加标签 -->
        <el-dialog title="添加标签" :visible.sync="dialogTableVisible" width="30%">
            <el-form :model="addForm" label-width="auto" style="max-width: 600px">
                <el-form-item label="内容">
                    <el-input v-model="addForm.text" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addClick">添加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 修改标签 -->
        <el-dialog title="修改标签" :visible.sync="dialogTableVisible2" width="30%">
            <el-form :model="updateForm" label-width="auto" style="max-width: 600px">
                <el-form-item label="ID">
                    <el-input v-model="updateForm.id" readOnly />
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="updateForm.text" />
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
                updateForm:{
                    id:'',
                    text:''
                },
                addForm:{
                    text:''
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
            add(){
                this.dialogTableVisible = true
            },
            edit(row){
                this.dialogTableVisible2 = true
                this.updateForm.id = row.id
                this.updateForm.text = row.text
            },
            page(currentPage){
                const _this = this
                axios.get('http://localhost:8181/tag/select?page='+currentPage+'&size='+_this.pageSize).then(function (response) {
                    _this.tableData = response.data.data
                    _this.pageSize = response.data.size
                    _this.total = response.data.total
                })
            },
            addClick(){
                const _this = this
                axios.post('http://localhost:8181/tag/add',_this.addForm).then((response) => {
                    if (response.data == true) {
                        _this.$alert('标签【'+_this.addForm.text+'】添加成功', '', {
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
                axios.put('http://localhost:8181/tag/update',_this.updateForm).then((response) => {
                    if (response.data == true) {
                        _this.$alert('标签【'+_this.updateForm.text+'】修改成功', '', {
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
                this.$confirm('确认删除标签【'+row.text+'】吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.delete('http://localhost:8181/tag/delete/'+row.id).then(function (resp) {
                        if(resp.data == true){
                            _this.$alert('标签【'+row.text+'】已删除', '', {
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
            axios.get('http://localhost:8181/tag/select?page=1&size='+_this.pageSize).then(function (response) {
                _this.tableData = response.data.data
                _this.pageSize = response.data.size
                _this.total = response.data.total
            })
        }
    }
</script>

<style scoped>

</style>
