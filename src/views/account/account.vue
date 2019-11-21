<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>用户信息</span>
    </div>
    <div class="text item main">
      <div class="lt">
        <el-form
          ref="accountFormRef"
          :model="accountForm"
          label-width="100px"
          :rules="accountFormRules"
        >
          <el-form-item label="用户名: " prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号: " prop="mobile">
            <el-input v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱: " prop="email">
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="个性签名: " prop="intro">
            <el-input v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="editAccount">保留更改</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="rt">
        <el-upload action :show-file-list="false" :http-request="httpRequest">
          <img
            v-if="accountForm.photo"
            :src="accountForm.photo"
            class="avatar"
            width="200"
            height="200"
            style="border:2px solid #ccc;"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<script>
import medium from '@/utils/medium.js'
var fd = new FormData()
console.log(fd)

export default {
  name: 'Account',
  data () {
    return {
      imageUrl: '',
      accountFormRules: {
        name: [
          { required: true, message: '用户名必须填写', trigger: 'blur' },
          {
            min: 1,
            max: 9,
            message: '用户名介于3-9个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '邮箱必须填写', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      },
      accountForm: {
        name: '',
        mobile: '',
        email: '',
        intro: ''
      }
    }
  },
  created () {
    this.getAccountInfo()
  },
  methods: {
    // 自定义上传
    httpRequest (resource) {
      let fd = new FormData()
      fd.append('photo', resource.file)
      let pro = this.$http.patch('/user/photo', fd)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.accountForm.photo = result.data.data.photo
            medium.$emit('upAccountPhoto', this.accountForm.photo)
            this.$message.success('头像更新成功')
          }
        })
        .catch(error => {
          return this.$message.error('图片上传失败' + error)
        })
    },
    editAccount () {
      this.$refs.accountFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.patch('/user/profile', this.accountForm)
          pro
            .then(result => {
              console.log(result)

              if (result.data.message === 'OK') {
                // 自己写的同步个人信息代码
                // let userinfo = JSON.parse(
                //   window.sessionStorage.getItem('userinfo')
                // )
                // userinfo.name = result.data.data.name
                // userinfo.photo = this.accountForm.photo
                // console.log(userinfo)
                // window.sessionStorage.clear()
                // window.sessionStorage.setItem(
                //   'userinfo',
                //   JSON.stringify(userinfo)
                // )

                // 同步个人信息
                medium.$emit('upAccountName', this.accountForm.name)

                this.$message.success('信息更新成功,请刷新')
              }
            })
            .catch(err => {
              return this.$message.error('编辑用户信息错误' + err)
            })
        }
      })
    },
    getAccountInfo () {
      let pro = this.$http.get('/user/profile')
      pro
        .then(result => {
          console.log(result)
          if (result.data.message === 'OK') {
            this.accountForm = result.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获取账户信息错误' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.lt {
  width: 40%;
}
.rt {
  width: 30%;
}
.main {
  display: flex;
  justify-content: space-around;
}
</style>
