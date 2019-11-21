<template>
  <div id="app">
    <el-container>
      <el-aside
        :width="isCollapse?'65px':'200px'"
        style="transition:width 0.4s ease-out;overflow-x: hidden;
        overflow-y:scroll;"
      >
        <!-- <img :src="isCollapse?'./douyin.png':'./douyins.png'" /> -->
        <div id="logo" style="overflow:hidden;transition:none;" :width="isCollapse?'65px':'200px'">
          <img src="./douyin.png" v-show="!isCollapse" />
          <img src="./douyins.png" style="border-radius: 6px;" v-show="isCollapse" />
        </div>
        <!-- <img src="./douyins.png" /> -->
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#303133"
          text-color="#fff"
          active-text-color="#ffd04b"
          :width="isCollapse?'65px':'200px'"
          style=" overflow:hidden; border:0; padding-left:2px;"
          :collapse="isCollapse"
          router
          :default-active="$route.path"
        >
          <el-menu-item
            index="/welcome"
            style="overflow:hidden;"
            :width="isCollapse?'65px':'200px'"
          >
            <i class="el-icon-s-promotion"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <el-submenu index="2" :width="isCollapse?'65px':'200px'">
            <template slot="title">
              <i class="el-icon-orange"></i>
              <span>内容管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/articleadd">发布文章</el-menu-item>
              <el-menu-item index="/article">内容列表</el-menu-item>
              <el-menu-item index="2-3">评论列表</el-menu-item>
              <el-menu-item index="/material">素材管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="3" :width="isCollapse?'65px':'200px'">
            <template slot="title">
              <i class="el-icon-s-opportunity"></i>
              <span>粉丝管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/fans">图文数据</el-menu-item>
              <el-menu-item index="/fansnow">粉丝概况</el-menu-item>
              <el-menu-item index="3-3">粉丝画像</el-menu-item>
              <el-menu-item index="/fanslist">粉丝列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/account" :width="isCollapse?'65px':'200px'">
            <i class="el-icon-setting"></i>
            <span slot="title">账户信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="top_left">
            <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" @click="menuopen()"></i>
            <span>北京字节跳动有限公司</span>
          </div>
          <div class="top_right">
            <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="input2"></el-input>
            <span>消息</span>

            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <!-- <el-avatar
                  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                ></el-avatar>-->
                <img :src="photo" alt />
                {{name}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-s-custom" @click.native="toMyinfo()">个人信息</el-dropdown-item>
                <el-dropdown-item icon="el-icon-s-promotion" @click.native="git()">github地址</el-dropdown-item>
                <el-dropdown-item icon="el-icon-picture-outline-round" @click.native="logout()">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import medium from '@/utils/medium.js'
export default {
  name: 'HomeCom',
  data () {
    return {
      isCollapse: false,
      input2: '',
      tempname: '',
      tempphoto: ''
    }
  },
  watch: {},
  created () {
    medium.$on('upAccountName', nm => {
      this.tempname = nm
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.name = nm
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
    })
    medium.$on('upAccountPhoto', photo => {
      this.tempphoto = photo
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.photo = photo
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
    })
  },
  computed: {
    name () {
      return (
        this.tempname ||
        JSON.parse(window.sessionStorage.getItem('userinfo')).name
      )
    },
    photo () {
      return (
        this.tempphoto ||
        JSON.parse(window.sessionStorage.getItem('userinfo')).photo
      )
    }
  },
  methods: {
    toMyinfo () {
      window.open('http://www.hao2.top')
    },
    git () {
      // console.log(window.location)
      // window.location.href = 'https://github.com/1042970366'
      window.open('https://github.com/1042970366')
    },
    logout () {
      this.$confirm('确认退出?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.clear()
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出操作',
            duration: 1500
          })
        })
    },
    menuopen () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
#logo {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.el-tooltip {
  padding: 0 16px !important;
}
body {
  height: 100%;
  width: 100%;
}
.el-container {
  height: 100%;
  .el-aside {
    // position: relative;

    background: #303133;
    // background: #fff;
    img {
      // position: relative;

      // left: 51px;
      // width: 98px;
    }
  }
  .el-aside::-webkit-scrollbar {
    display: none;
  }
  .el-header {
    min-width: 992px;
    // height: 60px;
    // background: #409eff;
    display: flex;
    align-items: center;
    // line-height: 60px;
    .top_left {
      flex: 30%;
      height: 60px;
      display: flex;
      align-items: center;
      // background: #67c23a;
      font-size: 20px;
      vertical-align: middle;
      i {
        margin-top: 2px;
      }
      span {
        margin-left: 6px;
      }
    }
    .top_right {
      height: 60px;
      // display: flex;
      // justify-content: right;
      flex: 60%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      // background: purple;
      .el-input {
        width: 240px;
        box-shadow: -1px 2px 2px #888888;
        margin-right: 20px;
        border-radius: 6px;
      }
      span {
        margin: 10px;
      }
    }
  }
  .el-main {
    background: #e6a23c;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  // text-align: center;
  display: flex;
  align-items: center;
  img {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-right: 9px;
  }
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
.el-main {
  overflow-y: auto;
  min-width: 768px;
}
.el-main::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.el-main::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  // background: @borderColor;
  background: rgba(0, 0, 0, 0.52);
}
.el-main::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: transparent;
}
// .el-main::-webkit-scrollbar {
//   display: none
// }
.el-submenu /deep/.el-submenu__title:hover,
.el-menu-item:focus,
.el-menu-item:hover {
  // outline: 0;
  // background-color: #409eff !important;
  background-color: rgba(123, 147, 224, 0.96) !important;
  // background-color: #000000!important;
}
.el-submenu /deep/.el-submenu__title:hover {
  // outline: 0;
  // background-color: #409eff !important;
  background-color: rgba(123, 150, 220, 0.6) !important;
  // background-color: #000000!important;
}
</style>
