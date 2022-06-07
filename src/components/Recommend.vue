<template>
  <div class="">
    <!--轮播图 -->
    <el-carousel
      height="200px"
      indicator-position="none"
      :loop="true"
      ref="carousel"
      arrow="never"
      type="card"
      :autoplay="true"
      :interval="3000"
      :initial-index="0"
      @click.native="linkTo"
    >
      <el-carousel-item v-for="(item, index) in bannerList" :key="index">
        <el-image :src="item.imageUrl" />
      </el-carousel-item>
    </el-carousel>
    <div style="height: 20px" />
    <!--分类标签 -->
    <el-tabs @tab-click="handleClick" height="50px" v-model="queryInfo.cat">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="tabList[index]"
        :name="tabList[index]"
      />
    </el-tabs>
    <!--列表 -->
    <div class="songsheet">
      <div
        class="songsheet_box"
        v-for="(item, index) in sheetList"
        :key="index"
        @click="songSheetClick(item.id)"
      >
        <el-image class="songsheet_img" :src="item.coverImgUrl" />
        <div class="songsheet_name">{{ item.name }}</div>
      </div>
    </div>

    <div style="height: 20px;" />
    <!-- 分页 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="35"
      background
      layout="prev, pager, next"
      :total="totalNum"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      totalNum: 0,
      bannerList: [],
      tabList: ['古风', '华语', '粤语', '流行'],
      sheetList: [],
      queryInfo: {
        limit: 35,
        cat: '古风',
        offset: 0
      },
      currentPage: 1
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 获取轮播
    async getBannerList () {
      const { data: res } = await this.$http.get('/banner')
      console.log(res)
      if (res.code === 200) {
        this.bannerList = res.banners
      }
    },
    // 轮播图点击跳转
    linkTo () {
      var activeIndex = this.$refs.carousel.activeIndex
      if (this.bannerList[activeIndex].url) {
        window.open(this.bannerList[activeIndex].url)
      }
    },
    // 获取歌单列表
    async getSheetList () {
      const { data: res } = await this.$http.get('/top/playlist', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.code === 200) {
        this.sheetList = res.playlists
        this.totalNum = res.total
      }
    },
    // 点击tab(重置分页页码)
    handleClick (e) {
      this.queryInfo.cat = e.name
      this.queryInfo.offset = 0
      this.currentPage = 1
      this.getSheetList()
    },
    // 分页事件
    handleCurrentChange (pageNum) {
      console.log(pageNum)
      this.queryInfo.offset = (pageNum - 1) * 35
      this.currentPage = pageNum
      this.getSheetList()
    },
    // 跳转去歌单详情页
    songSheetClick (id) {
      let routeData = this.$router.resolve({
        path: '/SheetDetail/',
        query: { sheetid: id }
      })
      window.open(routeData.href, '_blank')
    }
  },
  created () {
    this.getBannerList()
    this.getSheetList()
  },
  mounted () {},
  destoryed () {}
}
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.songsheet {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;

  .songsheet_box {
    cursor: pointer;
    margin: 10px;

    .songsheet_img {
      border-radius: 10px;
      height: 100px;
      width: 100px;
    }
    .songsheet_name {
      height: auto;
      width: 100px;
      justify-items: center;
      color: gray;
      font-size: 12px;
    }
  }
}
</style>
