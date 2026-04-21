<template>
    <div style="margin-top: 60px;margin-left:80px;border: 0px solid red;" >
        <el-form label-width="100px" class="demo-ruleForm">
            <el-form-item label="关键字：" prop="keyWord">
                <el-input clearable v-model="keyWord" placeholder="请输入关键字" style="width: 230px;float: left"></el-input>
                <span style="margin-left: 60px">条件查询：</span>
                <el-select v-model="type">
                    <el-option label="名称" value="name" />
                    <el-option label="描述" value="description" />
                </el-select>
                <el-button type="primary" icon="el-icon-search" style="position: relative;left: 30px;" @click="search()">搜索</el-button>
                <el-button type="success" icon="el-icon-plus" style="position: relative;left: 60px;" @click="add()">添加赛道</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%">
            <el-table-column property="id" label="编号" width="125" />
            <el-table-column property="name" label="名称" width="300" />
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
                       layout="prev, pager, next"
                       :page-size="pageSize"
                       :total="total"
                       :current-page.sync="currentPage"
                       @current-change="page">
        </el-pagination>

        <!-- 添加赛道 -->
        <el-dialog title="添加赛道" :visible.sync="dialogTableVisible" width="30%">
            <el-form :model="addForm" label-width="auto" style="max-width: 600px">
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
                    name:'',
                    description:'',
                    tag:[]
                },
                addForm:{
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
            add(){
                this.dialogTableVisible = true
            },
            edit(row){
                this.dialogTableVisible2 = true
                this.updateForm.id = row.id
                this.updateForm.name = row.name
                this.updateForm.description = row.description
                let tagData = [];
                for(let i = 0;i < row.tagsForManage.length;i++){
                    tagData.push(row.tagsForManage[i].id);
                }
                this.updateForm.tag = tagData
            },
            page(currentPage){
                const _this = this
                axios.get('http://localhost:8181/track/load?page='+currentPage+'&size='+_this.pageSize).then(function (response) {
                    _this.tableData = response.data.data
                    _this.pageSize = response.data.size
                    _this.total = response.data.total
                })
            },
            search() {
                const _this = this
                //让翻页复原
                _this.currentPage = 1
                axios.get('http://localhost:8181/track/load?page=1&size='+_this.pageSize+'&keyWord='+_this.keyWord+"&type="+_this.type).then(function (response) {
                    _this.tableData = response.data.data
                    _this.pageSize = response.data.size
                    _this.total = response.data.total
                })
            },
            addClick(){
                const _this = this
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
            axios.get('http://localhost:8181/track/load?page=1&size='+_this.pageSize).then(function (response) {
                _this.tableData = response.data.data
                _this.pageSize = response.data.size
                _this.total = response.data.total
            })
            axios.get('http://localhost:8181/tag/list').then(function (response) {
                _this.tags = response.data
            })
        }
    }
</script>

<style scoped>

</style>
