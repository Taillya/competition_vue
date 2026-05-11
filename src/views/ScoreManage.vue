<template>
    <div>
        <el-form label-width="100px" class="demo-ruleForm">
            <el-form-item label="关键字：" prop="keyWord">
                <el-input clearable v-model="keyWord" placeholder="请输入关键字" style="width: 230px;float: left"></el-input>
                <span style="margin-left: 60px">条件查询：</span>
                <el-select v-model="type">
                    <el-option label="竞赛" value="competition" />
                    <el-option label="姓名" value="name" />
                </el-select>
                <el-button type="primary" icon="el-icon-search" style="position: relative;left: 30px;" @click="search()">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%">
            <el-table-column property="id" label="编号" width="130" />
            <el-table-column property="competition" label="竞赛" width="220" />
            <el-table-column property="award" label="奖项" width="180" />
            <el-table-column property="name" label="姓名" width="180" />
            <el-table-column property="score" label="成绩" width="180" />
            <el-table-column property="status" label="状态" width="180" />
            <el-table-column property="date" label="日期" width="180" show-overflow-tooltip/>
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

    </div>
</template>

<script>
    export default {
        name: "AdminManage",
        data(){
            return{
                tableData:'',
                keyWord:'',
                type:'competition',
                pageSize:5,
                total:'',
                currentPage:1,
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
                axios.get('http://localhost:8181/score/load?page='+currentPage+'&size='+_this.pageSize).then(function (response) {
                    _this.tableData = response.data.data
                    _this.total = response.data.total
                })
            },
            search() {
                const _this = this
                //让翻页复原
                _this.currentPage = 1
                axios.get('http://localhost:8181/score/load?page=1&size='+_this.pageSize+'&keyWord='+_this.keyWord+"&type="+_this.type).then(function (response) {
                    _this.tableData = response.data.data
                    _this.total = response.data.total
                })
            },
        },
        created() {
            const _this = this
            axios.get('http://localhost:8181/score/load?page=1&size='+_this.pageSize).then(function (response) {
                _this.tableData = response.data.data
                _this.total = response.data.total
            })
        }
    }
</script>

<style scoped>

</style>
