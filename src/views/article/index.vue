<template>
  <div>
    <!-- 搜索卡片区 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <div class="text item">
        <el-form ref="searchFormRef" v-model="searchForm" label-width="100px">
          <el-form-item label="文章状态: ">
            <el-radio-group v-model="searchForm.status">
              <!-- 0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部 -->
              <el-radio label = "">全部</el-radio>
              <el-radio label="2">审核通过</el-radio>
              <el-radio label="0">草稿</el-radio>
              <el-radio label="1">待审核</el-radio>
              <el-radio label="3">审核失败</el-radio>
            </el-radio-group>
            <!-- <el-radio v-model="searchForm.status" label="4">已删除</el-radio> -->
          </el-form-item>
          <el-form-item label="频道列表: ">
            <!-- 频道列表组件 -->
            <channel-com @slt = "selectHandler"></channel-com>
          </el-form-item>
          <el-form-item label="时间选择: ">
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 文章列表区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{tot}}条符合条件的内容</span>
      </div>
      <div class="text item">
        <el-table :data="articleList">
          <el-table-column label="封面">
            <img
              :src="stData.row.cover.images[0] || defaultImg"
              alt="封面不存在"
              width="150"
              height="100"
              slot-scope="stData"
            />
          </el-table-column>
          <el-table-column label="标题" prop="title"></el-table-column>
          <el-table-column label="状态" prop="status">
            <!-- 0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部 -->
            <template slot-scope="stData">
              <el-tag v-if="stData.row.status===0">草稿</el-tag>
              <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
              <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
              <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
              <el-tag v-else type="danger">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发表时间" prop="pubdate"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="stData">
              <el-button type="primary" icon="el-icon-edit" size="small" circle @click="$router.push(`/articleedit/${stData.row.id}`)"></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="small"
                @click.native="del(stData.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="text item">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchForm.per_page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tot"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import ChannelCom from '@/components/channel.vue'
export default {
  name: 'ArticleList',
  created () {
    this.getarticleList()
  },
  components: {
    ChannelCom
  },
  watch: {
    timetotime: function (newValue, oldValue) {
      if (newValue) {
        this.searchForm.begin_pubdate = newValue[0]
        this.searchForm.end_pubdate = newValue[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
      // this.getarticleList()
    },
    // 'searchForm.status': function (newV, oldV) {
    //   this.getarticleList()
    // },
    // 深度监听searchForm
    searchForm: {
      handler: function (newV, oldV) {
        this.getarticleList()
      },
      deep: true
    }

  },
  data () {
    return {
      defaultImg:
        'http://img.pic35.com/uploads/allimg/170330/1-1F330223J40-L.gif',
      tot: 0,
      timetotime: '', // 时间中间缓存器
      articleList: [],
      searchForm: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: '',
        page: 1,
        per_page: 10
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  methods: {
    selectHandler (val) {
      this.searchForm.channel_id = val
    },
    handleSizeChange (val) {
      this.searchForm.per_page = val
      // this.getarticleList()
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      // this.getarticleList()
    },
    del (id) {
      // console.log(id)
      this.$confirm('确认删除该文章?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let pro = this.$http.delete(`/articles/${id}`)
        pro
          .then(result => {
            console.log(result)
            if (result.status === 204) {
              this.$message.success('删除成功')
              this.getarticleList()
            }
          })
          .catch(err => {
            return this.$message.error('删除文章失败' + err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getarticleList () {
      let searchData = {}
      for (var i in this.searchForm) {
        if (this.searchForm[i]) {
          searchData[i] = this.searchForm[i]
        }
      }
      let pro = this.$http.get('/articles', { params: searchData })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // console.log(result)
            this.articleList = result.data.data.results
            this.tot = result.data.data.total_count
          }
        })
        .catch(err => {
          return this.$message.error('获取文章列表错误' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 15px;
  .el-pagination {
    margin-top: 16px;
    text-align: center;
  }
}
</style>
