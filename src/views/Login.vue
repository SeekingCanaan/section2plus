<template>
  <div class="login">
    <el-card class="box-card">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入用户名" :maxlength="12" clearable
                    prefix-icon='el-icon-user' :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" :maxlength="16" clearable
                    prefix-icon='el-icon-lock' show-password :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="submitForm">登 陆</el-button>
          <el-button @click="resetForm">清 空</el-button>
          <span style="margin-left: 40px; color: mediumslateblue; cursor: pointer" @click="addVisible = true">
            还没账号？点击注册
          </span>
        </el-form-item>
      </el-form>
    </el-card>

    <!--  添加人员信息  -->
    <el-dialog
        title="注册"
        :visible.sync="addVisible"
        width="50%">
      <el-form ref="registerForm" :model="addData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addData.name" placeholder="请输入用户名" :maxlength="12" clearable
                    prefix-icon='el-icon-user' :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addData.password" placeholder="请输入密码" show-password :maxlength="16" clearable
                    prefix-icon='el-icon-lock' :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
          <el-input v-model="addData.password2" placeholder="请再次输入密码" show-password :maxlength="16" clearable
                    prefix-icon='el-icon-lock' :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" align="center">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="addConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      addVisible: false,

      formData: {
        name: '',
        password: '',
      },

      addData: {
        name: '',
        password: '',
        password2: '',
        auth: '普通用户'
      },

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
     * 登陆验证
     */
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          let that = this;
          this.$http.post('person/login', this.formData).then(res => {
            console.log(res.data.data === undefined)
            if (res.data.data !== undefined) {
              this.$message.success("登陆成功");
              setTimeout(() => {
                that.$router.push('/home');
              }, 300)
            } else {
              this.$message.warning("用户名或密码错误");
            }
          })
        }
      })
    },
    /**
     * 清空登陆表单
     */
    resetForm() {
      this.$refs['elForm'].resetFields()
    },

    /*
    * 仿注册
    * */
    addConfirm() {
      this.$refs['registerForm'].validate(valid => {
        if (valid) {
          if (this.addData.password === this.addData.password2) {
            this.$http.post('person', this.addData).then(res => {
              this.$message.success(res.data.msg);
              this.addVisible = false;
              this.addData = {name: '', password: '', auth: '普通用户'}
            })
          } else {
            this.$message.warning("两次输入的密码不一致");
          }
        }
      })
    },
  }
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
  height: auto;
}
</style>