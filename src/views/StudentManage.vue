<template>
    <div>
        <el-form label-width="100px" class="demo-ruleForm">
            <el-form-item label="关键字：" prop="keyWord">
                <el-input clearable v-model="keyWord" placeholder="请输入关键字" style="width: 230px;float: left"></el-input>
                <span style="margin-left: 60px">条件查询：</span>
                <el-select v-model="type">
                    <el-option label="姓名" value="name" />
                    <el-option label="账号" value="username" />
                </el-select>
                <el-button type="primary" icon="el-icon-search" style="position: relative;left: 30px;" @click="search()">搜索</el-button>
                <el-button type="success" icon="el-icon-plus" style="position: relative;left: 60px;" @click="add()">添加学生</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%">
            <el-table-column property="id" label="编号" width="130" />
            <el-table-column property="name" label="姓名" width="130" />
            <el-table-column property="username" label="账号" width="130" />
            <el-table-column property="password" label="密码" width="130" />
            <el-table-column property="age" label="年龄" width="130" />
            <el-table-column property="gender" label="性别" width="130" />
            <el-table-column property="address" label="地址" width="160" />
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

        <!-- 添加学生 -->
        <el-dialog title="添加学生" :visible.sync="dialogTableVisible" width="30%">
            <el-form :model="addForm" label-width="auto" style="max-width: 600px">
                <el-form-item label="姓名">
                    <el-input v-model="addForm.name" />
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="addForm.username" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="addForm.password" />
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="addForm.age" />
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="addForm.gender">
                        <el-radio v-model="addForm.gender" label="男">男</el-radio>
                        <el-radio v-model="addForm.gender" label="女">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="addForm.address" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addClick">添加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 修改学生 -->
        <el-dialog title="修改学生" :visible.sync="dialogTableVisible2" width="30%">
            <el-form :model="updateForm" label-width="auto" style="max-width: 600px">
                <el-form-item label="ID">
                    <el-input v-model="updateForm.id" readOnly />
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="updateForm.name" />
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="updateForm.username" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="updateForm.password" />
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="updateForm.age" />
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="updateForm.gender">
                        <el-radio v-model="updateForm.gender" label="男">男</el-radio>
                        <el-radio v-model="updateForm.gender" label="女">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="updateForm.address" />
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
                    name:'',
                    username:'',
                    password:'',
                    age:'',
                    gender:'',
                    address:''
                },
                addForm:{
                    name:'',
                    username:'',
                    password:'',
                    age:'',
                    gender:'',
                    address:''
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
                this.updateForm.name = row.name
                this.updateForm.username = row.username
                this.updateForm.password = row.password
                this.updateForm.age = row.age
                this.updateForm.gender = row.gender
                this.updateForm.address = row.address
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.currentPage = 1
                this.page(1)
            },
            page(currentPage){
                const _this = this
                axios.get('http://localhost:8181/student/list?page='+currentPage+'&size='+_this.pageSize).then(function (response) {
                    _this.tableData = response.data.data
                    _this.total = response.data.total
                })
            },
            search() {
                const _this = this
                //让翻页复原
                _this.currentPage = 1
                axios.get('http://localhost:8181/student/list?page=1&size='+_this.pageSize+'&keyWord='+_this.keyWord+"&type="+_this.type).then(function (response) {
                    _this.tableData = response.data.data
                    _this.total = response.data.total
                })
            },
            addClick(){
                const _this = this
                axios.post('http://localhost:8181/student/add',_this.addForm).then((response) => {
                    if (response.data == true) {
                        _this.$alert('学生【'+_this.addForm.name+'】添加成功', '', {
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
                axios.put('http://localhost:8181/student/update',_this.updateForm).then((response) => {
                    if (response.data == true) {
                        _this.$alert('学生【'+_this.updateForm.name+'】修改成功', '', {
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
                this.$confirm('确认删除学生【'+row.name+'】吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.delete('http://localhost:8181/student/delete/'+row.id).then(function (resp) {
                        if(resp.data == true){
                            _this.$alert('学生【'+row.name+'】已删除', '', {
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
            axios.get('http://localhost:8181/student/list?page=1&size='+_this.pageSize).then(function (response) {
                _this.tableData = response.data.data
                _this.total = response.data.total
            })
        }
    }
</script>

<style scoped>

</style>
