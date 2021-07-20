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
                    prefix-icon='el-icon-lock' :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="submitForm">登 陆</el-button>
          <el-button @click="resetForm">清 空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      formData: {
        name: '',
        password: '',
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
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          let that = this;
          this.$http.post('login', this.formData).then(res => {
            if (res.data.msg === '登陆成功') {
              this.$message.success(res.data.msg);
              setTimeout(() => {
                that.$router.push('/home');
              }, 300)
            } else {
              this.$message.warning(res.data.msg);
            }
          })
        }
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
  }
}
</script>

<style scoped>
.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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