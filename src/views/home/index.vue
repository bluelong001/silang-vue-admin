<template>
  <div class="home-container">
    <chart ref="chart1" :options="orgOptions" :auto-resize="true"></chart>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getData } from "@/api/home";
export default {
  name: "Home",
  data(){
    return {
      orgOptions: {},
      formData:{}
    }
  },
  mounted() {
    this.orgOptions = {

    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['视频数','主题数','回复数','用户数']
    },
    series: [
        {
            name:'数量比例',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:0, name:'视频数'},
                {value:0, name:'主题数'},
                {value:0, name:'回复数'},
                {value:0, name:'用户数'}
            ]
        }
    ]
    }
  },
  methods:{
    initData(){
      getData().then(respones=>{
        this.formData = respones.data
      });
    }
  },
  created(){
    this.initData();
  },
  watch:{
    formData:function(newData,old){
      this.orgOptions.series[0].data[0].value=newData.videoNum;
      this.orgOptions.series[0].data[1].value=newData.postNum;
      this.orgOptions.series[0].data[2].value=newData.replyNum;
      this.orgOptions.series[0].data[3].value=newData.userNum;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.home {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.chart{
  display:table-cell
}
</style>
