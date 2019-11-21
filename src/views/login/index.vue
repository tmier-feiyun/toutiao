<template>
  <div id="app">
    <div class="container">
      <div class="loginbox">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
          <img src="./toutiaosloginpng.png" alt />
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号...">
              <!-- <i slot="prefix" class="iconfont icon-shouji"></i> -->
              <svg slot="prefix" class="icon" aria-hidden="true">
                <use xlink:href="#icon-shouji1" />
              </svg>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="loginForm.code" placeholder="请输入验证码...">
              <!-- <i slot="prefix" class="iconfont icon-yanzhengma-"></i> -->
              <svg slot="prefix" class="icon" aria-hidden="true">
                <use xlink:href="#icon-mima" />
              </svg>
            </el-input>
          </el-form-item>
          <el-form-item style="text-align: left;" prop="xieyi">
            <el-checkbox v-model="loginForm.xieyi"></el-checkbox>
            <span>我已阅读并同意用户协议和隐私条款</span>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="width:100%;"
              @click="login() "
              :loading="isActive"
              :disabled="isActive"
              @keyup.enter="login()"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/js/gt.js'
// import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfont/iconfont.js'

export default {
  created () {
    var that = this
    document.onkeyup = function (e) {
      if (window.event.keyCode === 13) {
        that.login()
      }
    }
    // 下面使用箭头函数咋不行呢
    // document.onkeyup(event => {
    //   if (window.event.keyCode === 13) {
    //     this.login()
    //   }
    // })
  },
  watch: {
    keyEvent: function (newV, oldV) {
      this.login = null
    }
  },
  data () {
    var xieyiTest = function (rule, value, callback) {
      //   if (value) {
      //     callback()
      //   } else {
      //     callback(new Error('您还没有同意用户协议'))
      //   }
      value ? callback() : callback(new Error('您还没有同意用户协议'))
    }
    return {
      keyEvent: true,
      isActive: false,
      // 窗口对象
      ctaObj: null,
      loginForm: {
        mobile: '',
        code: '',
        xieyi: true
      },
      // 登录校验
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号码必须填写' },
          { pattern: /^1[3567890]\d{9}$/, message: '手机号码格式不正确' }
        ],
        code: [
          { required: true, message: '验证码必须填写' },
          { pattern: /\d{4}$/, message: '请正确填写4位验证码' }
        ],
        xieyi: [{ validator: xieyiTest }]
      }
    }
  },
  methods: {
    login () {
      if (this.ctaObj != null) {
        return this.ctaObj.verify()
      }
      this.isActive = true
      // 表单域项目二次检验
      this.$refs.loginFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.get(`/captchas/${this.loginForm.mobile}`)
          pro
            .then(result => {
              // console.log(result)
              // 生成验证窗口
              let { data } = result.data
              window.initGeetest(
                {
                  // 以下配置参数来自服务端 SDK
                  gt: data.gt,
                  challenge: data.challenge,
                  offline: !data.success,
                  new_captcha: true,
                  product: 'bind'
                },
                captchaObj => {
                  // 这里可以调用验证实例 captchaObj 的实例方法
                  captchaObj
                    .onReady(() => {
                      // 验证码ready之后才能调用verify方法显示验证码
                      captchaObj.verify()
                      this.ctaObj = captchaObj
                      this.isActive = false
                    })
                    .onSuccess(() => {
                      // your code
                      
                      this.loginAct()
                    })
                    .onError(() => {
                      // your code
                    })
                }
              )
            })
            .catch(err => {
              return this.$message.error('获得秘钥信息错误:' + err)
            })

          // this.loginAct()
        } else {
          // alert('请输入无误后再次登录..')
          this.$message.error('用户名或者密码不正确,请检查后重新登陆..')
        }
      })
      //   this.$router.push({ name: 'home' })
    },
    loginAct () {
      let pro = this.$http.post('/authorizations', this.loginForm)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            window.sessionStorage.setItem(
              'userinfo',
              JSON.stringify(result.data.data)
            )
            this.$message({
              message: '登陆成功',
              type: 'success',
              duration: 1500
            })
            this.keyEvent = false
            this.$router.push({ name: 'home' })
          }
        })
        .catch(err => {
          return this.$message.error('用户名或者密码不正确..' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.container {
  height: 100%;
  width: 100%;

  // display: flex;
  // justify-content: center;
  // align-items: center;

  // background-color: purple;
  // background: url("./login_bg.jpg");
  background: url("./login_bg.jpg");
  background-size: cover;
  .loginbox {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    padding: 0;
    width: 430px;
    height: 380px;
    // background: url("./slogan.png");
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 3px 3px 20px 1px rgba(0, 0, 0, 0.05);
    border-top-left-radius: 18%;
    border-bottom-right-radius: 18%;
    // background-size: cover;
    display: flex;
    justify-content: center;

    align-items: center;
    text-align: center;
    img {
      margin: 20px auto;
      width: 52%;
    }
    .el-form {
      width: 75%;
    }
    .el-checkbox {
      margin-right: 6px;
    }
  }
}
</style>
