<template>
  <div class="home">
    <!--  搜索框和按钮布局  -->
    <el-row :gutter="2">
      <el-col :span="16">
        <div style="margin-bottom: 1rem">
          <el-row :gutter="2">
            <el-col :offset="6" :span="8" align="center">
              <div style="display: flex; justify-content: center; align-items: center">
                <el-input
                    prefix-icon="el-icon-search"
                    placeholder="输入关键字搜索"
                    v-model="input"
                    @input="search"
                    @clear="getUsers"
                    clearable>
                </el-input>
                <el-button style="margin-left: 1rem" type="success" icon="el-icon-plus" @click="addVisible = true">新 增</el-button>

              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="4" :offset="4">
        <div style="display: flex; justify-content: center">
          <el-button type="info" @click="Out">登 出</el-button>
        </div>
      </el-col>
    </el-row>

    <!--  数据展示  -->
    <el-table
        height="266px"
        :data="users.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        style="width: 100%"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgb(243, 244, 246, 0.8)"
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
          label="权限"
          width="260"
          align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.auth }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  分页  -->
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
        <el-form-item label="权限" prop="password">
          <el-dropdown @command="command" trigger="click">
            <span class="el-dropdown-link">
              {{ addData.auth }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-user" command="普通用户">普通用户</el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-check" command="管理员">管理员</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
        <el-form-item label="权限">
          <el-dropdown @command="editCommand" trigger="click">
            <span class="el-dropdown-link">
              {{ editData.auth }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-user" command="普通用户">普通用户</el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-check" command="管理员">管理员</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
      // 添加 dialog 的 显示/隐藏
      addVisible: false,
      // 编辑 dialog 的 显示/隐藏
      editVisible: false,
      // 搜索框内容
      input: '',
      // 数据加载效果
      loading: true,
      // 默认数据页数
      total: 0,
      // 每页显示数据条数
      pageSize: 5,
      // 当前所在页数
      currentPage: 1,
      // 展示的数据
      users: [],
      // 添加表单对象
      addData: {
        name: '',
        password: '',
        auth: '普通用户'
      },
      // 编辑表单对象
      editData: {},
      // 表单规则
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
    /**
     * 获取所有人员信息
     */
    getUsers() {
      this.$http.get(`person/${this.input}`).then(res => {
        setTimeout(() => {
          this.users = res.data.data;
          this.loading = false
        }, 500)
      })
    },
    /*
    * 添加新人员数据
    * */
    addConfirm() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.$http.post('person', this.addData).then(res => {
            this.$message.success(res.data.msg);
            this.getUsers();
            this.addVisible = false;
            this.addData = {name: '', password: '', auth: '普通用户'}
          })
        }
      })
    },

    /*
    * 打开编辑弹窗，将选中的行的数据赋值给 editData
    * */
    handleEdit(index, row) {
      this.editData = row;
      this.editVisible = true;
    },

    /**
     * 提交编辑人员的信息
     */
    editConfirm() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$http.put('person', this.editData).then(res => {
            this.$message.success(res.data.msg);
            this.editVisible = false;
            this.input !== null || this.input !== '' ? this.search() : this.getUsers();
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

    /**
     * 关闭表单
     */
    handleClose() {
      this.addVisible = false;
    },

    /**
     * 换页
     */
    current_change(currentPage) {
      this.currentPage = currentPage;
    },

    /**
     * 换页
     */
    search() {
      this.$http.get(`person/${this.input}`).then(res => {
        this.loading = true;
        setTimeout(() => {
          this.users = res.data.data;
          this.loading = false;
        }, 500)
      })
    },

    /**
     *  登出
     */
    Out() {
      this.$confirm('即将退出系统，是否继续?', '提示', {
        confirmButtonText: '退出',
        cancelButtonText: '点错了',
        type: 'warning'
      }).then(() => {
        this.$router.push("/");
      }).catch(() => {

      });
    },

    /**
     *
     */
    command(c) {
      this.addData.auth = c;
    },
    editCommand(c) {
      this.editData.auth = c;
    }
  },

  created() {
    this.getUsers();
  }
}
</script>

<style scoped>
.home {
  margin-top: 20px;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #000000;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
