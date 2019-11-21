<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>创作数据</span>
    </div>
    <div class="text item">
      <div id="main" style="width:600px;height:400px"></div>
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'fans',
  mounted () {
    this.paintPic()
  },
  data () {
    return {
      option: {
        title: {
          text: '粉丝概况',
          subtext: '纯属虚构',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: ['粉丝年龄', '粉丝地域', '粉丝浏览量', '粉丝分享量', '粉丝转发量', '粉丝转化量', '粉丝消费', '粉丝性别']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel']
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        series: [
          {
            name: '半径模式',
            type: 'pie',
            radius: [20, 110],
            center: ['25%', '50%'],
            roseType: 'radius',
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            lableLine: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            data: [
              { value: 10, name: '粉丝年龄' },
              { value: 5, name: '粉丝地域' },
              { value: 15, name: '粉丝浏览量' },
              { value: 25, name: '粉丝分享量' },
              { value: 20, name: '粉丝转发量' },
              { value: 35, name: '粉丝转化量' },
              { value: 30, name: '粉丝消费' },
              { value: 40, name: '粉丝性别' }
            ]
          },
          {
            name: '面积模式',
            type: 'pie',
            radius: [30, 110],
            center: ['75%', '50%'],
            roseType: 'area',
            data: [
              { value: 10, name: '粉丝年龄' },
              { value: 5, name: '粉丝地域' },
              { value: 15, name: '粉丝浏览量' },
              { value: 25, name: '粉丝分享量' },
              { value: 20, name: '粉丝转发量' },
              { value: 35, name: '粉丝转化量' },
              { value: 30, name: '粉丝消费' },
              { value: 40, name: '粉丝性别' }
            ]
          }
        ]
      }
    }
  },
  methods: {
    paintPic () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      // 绘制图表
      myChart.setOption(this.option)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
