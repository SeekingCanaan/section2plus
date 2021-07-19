<template>
  <div class="home">
    <el-row :gutter="15">
      <el-col :span="12">
        <div>
          <el-row :gutter="24">
            <el-col :offset="6" :span="12" align="center">
              <div style="margin-top: 4px">
                <el-input
                    placeholder="请输入内容"
                    v-model="input"
                    @input="search"
                    @clear="getUsers"
                    clearable>
                </el-input>
              </div>
            </el-col>

          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="display: flex; justify-content: center">
          <el-button type="success" size="large" @click="addVisible = true">新 增</el-button>
        </div>
      </el-col>
    </el-row>
      <el-table
        height="266px"
        :data="users.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        style="width: 100%"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(229, 255, 253, 0.8)"
        stripe>
      <el-table-column type="index" label="序号" align="center" width="180">
        <template slot-scope="scope"><span>{{ scope.$index+1}}</span></template>
      </el-table-column>
      <el-table-column
          label="姓名"
          width="260"
          align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="密码"
          width="260"
          align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="分数"
          width="260"
          align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="users.length"
        @current-change="current_change">
    </el-pagination>
    <!--  添加人员信息  -->
    <el-dialog
        title="添加人员信息"
        :visible.sync="addVisible"
        width="50%"
        :before-close="handleClose">
      <el-form ref="addForm" :model="addData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addData.name" placeholder="请输入用户名" :maxlength="12" clearable
                    prefix-icon='el-icon-user' :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addData.password" placeholder="请输入密码" show-password :maxlength="16" clearable
                    prefix-icon='el-icon-lock' :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" align="center">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="addConfirm">确定</el-button>
      </div>
    </el-dialog>

    <!--  修改人员信息  -->
    <el-dialog
        title="修改人员信息"
        :visible.sync="editVisible"
        width="50%">
      <el-form ref="editForm" :model="editData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="editData.name" placeholder="请输入用户名" :maxlength="12" clearable
                    prefix-icon='el-icon-user' :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editData.password" placeholder="请输入密码" :maxlength="16" clearable
                    prefix-icon='el-icon-lock' :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="分数" prop="score">
          <el-input v-model="editData.score" placeholder="请输入新分数" :maxlength="6" clearable
                    prefix-icon='el-icon-document-remove' :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" align="center">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="editConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {

  },
  data() {
    return {
      addVisible: false,
      editVisible: false,
      input: '',
      loading: true,
      total: 0, // 默认数据页数
      pageSize: 5,  // 每页显示数据条数
      currentPage: 1, // 当前所在页数
      users: [],
      addData: {
        name: '',
        password: '',
        score: parseInt(Math.random() * 10 + 90)
      },
      editData: {},
      rules: {
        name: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
      },
    }
  },
  methods: {
    // 获取所有人员数据
    getUsers() {
      this.$http.get('person').then(res => {
        setTimeout(() => {
          console.log('查询')
          this.users = res.data.data;
          this.loading = false
        }, 500)
      })
    },
    // 添加新人员数据
    addConfirm() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.$http.post('person', this.addData).then(res => {
            console.log(res.data);
            this.$message.success(res.data.msg);
            this.getUsers();
            this.addVisible = false;
            this.addData = {name: '', password: '', score: parseInt(Math.random() * 10 + 90)}
          })
        }
      })
    },
    // 打开编辑弹窗，将选中的行的数据赋值给 editData
    handleEdit(index, row) {
      this.editData = row;
      this.editVisible = true;
    },

    // 提交修改后的人员信息
    editConfirm() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$http.put('person', this.editData).then(res => {
            this.$message.success(res.data.msg);
            this.editVisible = false;
            this.getUsers();
          })
        }
      })
    },

    /**
     * 删除选中人员信息
     * @param index 序号
     * @param row 当前行的人员数据
     */
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该人员信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`person/${row.id}`).then(res => {
          console.log(res.data);
          this.$message.success(res.data.msg);
          this.getUsers();
          this.visible = false;
          if (this.users.length > this.pageSize && this.users.length % this.pageSize === 0 && this.currentPage !== 1) {
            this.currentPage = this.currentPage - 1;
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleClose() {
      this.addVisible = false;
    },

    current_change(currentPage) {
      this.currentPage = currentPage;
    },

    search() {
      this.$http.get(`searchPerson/${this.input}`).then(res => {
        this.loading = true;
        setTimeout(() => {
          this.users = res.data.data;
          this.loading = false;
        }, 500)
      })
    }
  },

  created() {
    this.getUsers();
  }
}
</script>

<style scoped>
.home {

}

.pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
