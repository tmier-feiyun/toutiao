<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>发表文章</span>
    </div>
    <div class="text item">
      <el-form label-width="120px" ref="editFormRef" :model="editForm" :rules="editFormRules">
        <el-form-item label="标题" prop="title">
          <el-input type="text" v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <quill-editor v-model="editForm.content" :options="editorOption" ></quill-editor> -->
          <quill-editor v-model="editForm.content"></quill-editor>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="editForm.cover.type">
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道: " prop="channel_id">
       <!-- 频道列表组件 -->
       <channel-com @slt = "selectHandler" :cid = "editForm.channel_id"></channel-com>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editArticle(false)">修改</el-button>
          <el-button type="warning" @click="EditDraft(true)">保存草稿</el-button>
        </el-form-item>
      </el-form>
    </div>
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
  name: 'ArticleEdit',
  components: {
    quillEditor,
    ChannelCom
  },
  created () {
    this.getArticlebyID()
  },
  data () {
    return {
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

      editFormRules: {
        title: [
          { required: true, message: '标题必须填写' },
          { min: 5, max: 30, message: '标题长度介于5-30个字符' }
        ],
        content: [{ required: true, message: '内容必须填写' }],
        channel_id: [{ required: true, message: '频道必选' }]
      },
      editForm: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: ''
      }
    }
  },
  methods: {
    selectHandler (val) {
      this.editForm.channel_id = val
    },
    // 根据文章id获取文章内容
    getArticlebyID () {
      let pro = this.$http.get(`/articles/${this.$route.params.editid}`)
      pro
        .then(result => {
          if (result.status === 200) {
            this.editForm = result.data.data
          }
        })
        .catch(err => {
          // return this.$router.push('/article')
          return this.$message.error('获取内容失败' + err)
        })
    },
    // 修改文章方法
    // flag为真 草稿
    // falg为假 修改
    editArticle (flag) {
      this.$confirm('确认修改?', '修改提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$refs.editFormRef.validate(valid => {
            if (valid) {
              let pro = this.$http.put(`/articles/${this.$route.params.editid}`, this.editForm, {
                params: { draft: flag }
              })
              pro
                .then(result => {
                  if (result.status === 201) {
                    this.$message.success('修改成功~')
                    this.$router.push('/article')
                  }
                })
                .catch(err => {
                  return this.$message.error('修改文章失败' + err)
                })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          })
        })
    },
    EditDraft (flag) {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.put('/articles', this.editForm, {
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
</style>
