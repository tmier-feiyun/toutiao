<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>发表文章</span>
    </div>
    <div class="text item">
      <el-form label-width="120px" ref="addFormRef" :model="addForm" :rules="addFormRules">
        <el-form-item label="标题" prop="title">
          <el-input type="text" v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <quill-editor v-model="addForm.content" :options="editorOption" ></quill-editor> -->
          <quill-editor v-model="addForm.content"></quill-editor>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="addForm.cover.type">
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <ul>
            <li class="uploadbox" v-for="item in this.coverNum" :key="item" @click="showDialog(item)">
              <span>点击图标选择图片</span>
              <img v-if="addForm.cover.images[item-1]" :src="addForm.cover.images[item-1]" alt />
              <div v-else class="el-icon-picture-outline"></div>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="频道: " prop="channel_id">
          <!-- 这里是频道组件 -->
          <channel-com @slt="selectHandler"></channel-com>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addArticle(false)">发布</el-button>
          <el-button type="warning" @click="ArticleDraft(true)">保存草稿</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="封面管理" :visible.sync="dialogVisible" width="60%">
      <ul class="clearfix">
        <li class="image-box" v-for="item in imageList" :key="item.id">
          <img :src="item.url" alt="没有图片" @click="clkImage" />
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSelection">取 消</el-button>
        <el-button type="primary" @click="imageOK">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
// 引入富文本相关css文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import ChannelCom from '@/components/channel.vue'
export default {
  name: 'ArticleAdd',
  created () {
    this.getImageList()
  },
  components: {
    quillEditor,
    ChannelCom
  },
  computed: {
    coverNum () {
      if (this.addForm.cover.type > 0) {
        return this.addForm.cover.type
      } else {
        return 0
      }
    }
  },
  data () {
    return {
      materialUrl: '',
      xu: '',
      imageList: [],
      querycdt: {
        collect: false,
        page: 1,
        per_page: 20
      },
      dialogVisible: false,
      // 修改编辑器内容--开始
      // 参考文章:https://www.jianshu.com/p/8e6eeefcc588
      // editorOption: {
      //   placeholder: '请开始你的表演...',
      //   theme: 'snow',
      //   modules: {
      //     toolbar: [
      //       ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      //       ['blockquote', 'code-block'],
      //       [{ 'header': 1 }, { 'header': 2 }],
      //       [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      //       [{ 'script': 'sub' }, { 'script': 'super' }],
      //       [{ 'indent': '-1' }, { 'indent': '+1' }],
      //       // [{ 'direction': 'rtl' }],
      //       [{ 'size': ['small', false, 'large', 'huge'] }],
      //       [{ 'color': [] }, { 'background': [] }],
      //       // [{ 'font': [] }],
      //       [{ 'align': [] }]

      //     ]
      //   }
      // },
      // 修改编辑器内容--结束

      addFormRules: {
        title: [
          { required: true, message: '标题必须填写' },
          { min: 5, max: 30, message: '标题长度介于5-30个字符' }
        ],
        content: [{ required: true, message: '内容必须填写' }],
        channel_id: [{ required: true, message: '频道必选' }]
      },
      addForm: {
        title: '',
        content: '',
        cover: {
          type: 3,
          images: []
        },
        channel_id: ''
      }
    }
  },
  methods: {
    cancelSelection () {
      this.clearImage()
      this.dialogVisible = false
    },
    // 清除materialUrl的代码
    clearImage () {
      let lis = document.querySelectorAll('.image-box')
      for (let i = 0; i < lis.length; i++) {
        // lis[i].style.border = "";
        lis[i].style.opacity = 1
        lis[i].className = 'image-box'
      }
      this.materialUrl = ''
    },
    // 确定素材选择
    imageOK () {
      if (this.materialUrl) {
        this.addForm.cover.images[this.xu] = this.materialUrl
        this.dialogVisible = false
        this.clearImage()
      } else {
        this.$message.error('抱歉，您还没有选择图片呢~')
      }
    },
    // 分页尝试设置

    // 点击图片
    clkImage (evt) {
      this.clearImage()
      evt.target.parentNode.style.opacity = 0.81
      evt.target.parentNode.classList.toggle('duihao')
      this.materialUrl = evt.target.src
      // evt.target.parentNode.style.border = "4px solid purple";
    },
    // 获取素材
    getImageList () {
      let pro = this.$http.get('/user/images', { params: this.querycdt })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.imageList = result.data.data.results
          }
        })
        .catch(err => {
          return this.$message.error('获取图片失败: ' + err)
        })
    },
    // 封面打开对话框
    showDialog (n) {
      this.xu = n - 1
      this.dialogVisible = true
    },
    selectHandler (val) {
      this.addForm.channel_id = val
    },
    // 发布文章方法
    // flag为真 草稿
    // falg为假 发布
    addArticle (flag) {
      this.$confirm('确认发布?', '发布提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$refs.addFormRef.validate(valid => {
            if (valid) {
              let pro = this.$http.post('/articles', this.addForm, {
                params: { draft: flag }
              })
              pro
                .then(result => {
                  if (result.status === 201) {
                    this.$message.success('发布成功~')
                    this.$router.push('/article')
                  }
                })
                .catch(err => {
                  return this.$message.error('发表文章失败' + err)
                })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发布'
          })
        })
    },
    ArticleDraft (flag) {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.post('/articles', this.addForm, {
            params: { draft: flag }
          })
          pro
            .then(result => {
              if (result.status === 201) {
                this.$message.success('保存草稿成功~')
                this.$router.push('/article')
              }
            })
            .catch(err => {
              return this.$message.error('保存草稿失败' + err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 360px !important;
}
// 文章封面选择框样式
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img {
    width: 200px;
    height: 150px;
  }
}
.clearfix {
  overflow: hidden;
  .image-box {
    list-style: none;
    width: 200px;
    height: 140px;
    background-color: #fff;
    margin: 10px;
    float: left;
    border: 1px solid #eee;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .duihao {
    &:before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: url("./duihao.png");
      width: 200px;
      height: 200px;
      display: block;
      z-index: 6;
    }
  }
}
</style>
