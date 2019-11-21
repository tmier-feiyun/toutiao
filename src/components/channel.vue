<template>
  <el-select v-model="chid" placeholder="请选择" clearable>
    <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ChannelCom',
  watch: {
    cid: function (newV, oldV) {
      this.chid = this.cid
    },
    chid: function (newV, oldV) {
      this.$emit('slt', newV)
    }
  },
  props: {
    cid: {
      default: 0
    }
  },
  data () {
    return {
      chid: '',
      channelList: []
    }
  },
  created () {
    this.getchannelList()
  },
  methods: {
    getchannelList () {
      let pro = this.$http.get('/channels')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.channelList = result.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.error('获取频道列表错误' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
