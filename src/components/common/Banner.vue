<template>
    <el-carousel height="710px" :interval="3000" arrow="always">
        <el-carousel-item v-for="(value, index) in banner_list" :key="index">
            <a :href="value['link']"><img :src="value['image_url']" alt=""></a>
        </el-carousel-item>
    </el-carousel>
</template>
<script>
    export default {
        name: "Banner",
        data(){
            return{
                banner_list: [],
            }
        },
        methods:{
            //发送请求 获取后端轮播图
            get_banner_list(){
                this.$axios({
                    url: this.$settings.HOST + "home/banner/",
                    method: 'get',
                }).then(res=>{
                    this.banner_list = res.data;
                    console.log(res.data);
                }).catch(error=>{
                    console.log(error);
                    this.$message.error("获取轮播图失败")
                })
            },
        },
        //钩子函数
        created() {
            // 页面完成加载之前获取轮播图数据
            this.get_banner_list();
        }
    }
</script>

<style scoped>
.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}</style>
