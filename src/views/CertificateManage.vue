<template>
    <div>
        <el-form label-width="100px" class="demo-ruleForm">
            <el-form-item label="关键字：" prop="keyWord">
                <el-input clearable v-model="keyWord" placeholder="请输入关键字" style="width: 230px;float: left"></el-input>
                <span style="margin-left: 60px">条件查询：</span>
                <el-select v-model="type">
                    <el-option label="名称" value="title" />
                    <el-option label="竞赛" value="competition" />
                    <el-option label="等级" value="level" />
                </el-select>
                <el-button type="primary" icon="el-icon-search" style="position: relative;left: 30px;" @click="search()">搜索</el-button>
                <el-button type="success" icon="el-icon-plus" style="position: relative;left: 60px;" @click="add()">添加证书</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%">
            <el-table-column property="id" label="编号" width="80" />
            <el-table-column property="title" label="名称" width="200" />
            <el-table-column property="competition" label="竞赛" width="220" />
            <el-table-column property="level" label="等级" width="80" />
            <el-table-column property="published" label="是否颁发" width="90" />
            <el-table-column property="organization" label="组委会" width="200" />
            <el-table-column property="date" label="日期" width="130" />
            <el-table-column label="操作" width="160">
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

        <!-- 添加证书 -->
        <el-dialog title="添加证书" :visible.sync="dialogTableVisible" width="30%">
            <el-form :model="addForm" label-width="auto" style="max-width: 600px">
                <el-form-item label="名称">
                    <el-input v-model="addForm.title" />
                </el-form-item>
                <el-form-item label="竞赛">
                    <el-input v-model="addForm.competition" />
                </el-form-item>
                <el-form-item label="等级">
                    <el-select v-model="addForm.level">
                        <el-option label="一等奖" value="一等奖"/>
                        <el-option label="二等奖" value="二等奖"/>
                        <el-option label="三等奖" value="三等奖"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="组委会">
                    <el-input v-model="addForm.organization" />
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
                <el-form-item label="竞赛">
                    <el-input v-model="updateForm.competition" />
                </el-form-item>
                <el-form-item label="等级">
                    <el-select v-model="updateForm.level">
                        <el-option label="一等奖" value="一等奖"/>
                        <el-option label="二等奖" value="二等奖"/>
                        <el-option label="三等奖" value="三等奖"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否颁发">
                    <el-radio-group v-model="updateForm.published">
                        <el-radio v-model="updateForm.published" label="已颁发">已颁发</el-radio>
                        <el-radio v-model="updateForm.published" label="未颁发">未颁发</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="组委会">
                    <el-input v-model="updateForm.organization" />
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
                    competition:'',
                    level:'一等奖',
                    organization:''
                },
                updateForm:{
                    id:'',
                    title:'',
                    competition:'',
                    level:'',
                    published:'',
                    organization:''
                }
            }
        },
        methods:{
            handleSizeChange(val) {
                this.pageSize = val
                this.currentPage = 1
                this.page(1)
            },
            page(currentPage){
                const _this = this
                axios.get('http://localhost:8181/certificate/load?page='+currentPage+'&size='+_this.pageSize).then(function (response) {
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
                this.updateForm.competition = row.competition
                this.updateForm.level = row.level
                this.updateForm.published = row.published
                this.updateForm.organization = row.organization
            },
            addClick(){
                const _this = this
                console.log(_this.addForm)
                axios.post('http://localhost:8181/certificate/add',_this.addForm).then((response) => {
                    if (response.data == true) {
                        _this.$alert('证书【'+_this.addForm.title+'】添加成功', '', {
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
                if(_this.updateForm.published == '未颁发') {
                    _this.updateForm.published = 0
                } else {
                    _this.updateForm.published = 1
                }
                console.log(_this.updateForm)
                axios.put('http://localhost:8181/certificate/update',_this.updateForm).then((response) => {
                    if (response.data == true) {
                        _this.$alert('证书【'+_this.updateForm.title+'】修改成功', '', {
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
                this.$confirm('确认删除证书【'+row.title+'】吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.delete('http://localhost:8181/certificate/delete/'+row.id).then(function (resp) {
                        if(resp.data == true){
                            _this.$alert('证书【'+row.title+'】已删除', '', {
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
                axios.get('http://localhost:8181/certificate/load?page=1&size='+_this.pageSize+'&keyWord='+_this.keyWord+"&type="+_this.type).then(function (response) {
                    _this.tableData = response.data.data
                    _this.total = response.data.total
                })
            },
        },
        created() {
            const _this = this
            axios.get('http://localhost:8181/certificate/load?page=1&size='+_this.pageSize).then(function (response) {
                _this.tableData = response.data.data
                _this.total = response.data.total
            })
        }
    }
</script>

<style scoped>

</style>
