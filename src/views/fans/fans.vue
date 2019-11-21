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
          text: '内容创作比例',
          subtext: '纯属虚构',
          top: 10,
          left: 10
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,250,0.2)'
        },
        legend: {
          type: 'scroll',
          bottom: 10,
          data: (function () {
            var list = []
            for (var i = 1; i <= 28; i++) {
              list.push(i + 2000 + '')
            }
            return list
          })()
        },
        visualMap: {
          top: 'middle',
          right: 10,
          color: ['red', 'yellow'],
          calculable: true
        },
        radar: {
          indicator: [
            { text: 'QQ内容创作', max: 400 },
            { text: '企鹅游戏中心', max: 400 },
            { text: 'QQ看点', max: 400 },
            { text: '快报', max: 400 },
            { text: '微视', max: 400 }
          ]
        },
        series: (function () {
          var series = []
          for (var i = 1; i <= 28; i++) {
            series.push({
              name: '内容创作占比(数据纯属虚构)',
              type: 'radar',
              symbol: 'none',
              lineStyle: {
                width: 1
              },
              emphasis: {
                areaStyle: {
                  color: 'rgba(0,250,0,0.3)'
                }
              },
              data: [
                {
                  value: [
                    (40 - i) * 10,
                    (38 - i) * 4 + 60,
                    i * 5 + 10,
                    i * 9,
                    i * i / 2
                  ],
                  name: i + 2000 + ''
                }
              ]
            })
          }
          return series
        })()
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
