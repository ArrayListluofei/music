<template>
  <div class="out">
    <div class="mv">推荐MV</div>
    <div class="redline" />
    <div class="mv_list">
      <div
        v-for="(item, index) in mvList"
        :key="index"
        class="item_box"
        @click="mvClick(item.id)"
      >
        <el-image class="img" :src="item.cover"></el-image>
        <div class="text">{{ item.name }}</div>
        <div class="artist">by&nbsp;&nbsp;{{ item.artistName }}</div>
        <div class="bofangliang">
          <i class="el-icon-view"></i>
          <div class="playcount">{{ item.playCount }}</div>
        </div>
      </div>
    </div>

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
      mvList: [],
      queryInfo: {
        limit: 35,
        offset: 0
      },
      totalNum: 0,
      currentPage: 1
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 跳转去详情
    mvClick (id) {
      let routeData = this.$router.resolve({
        path: '/VedioDetail/',
        query: { id: id }
      })
      window.open(routeData.href, '_blank')
    },
    // 获取mv列表
    async getMvList () {
      const { data: res } = await this.$http.get('/mv/all', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.code === 200) {
        this.mvList = res.data
        // eslint-disable-next-line eqeqeq
        if (this.currentPage == 1) {
          this.totalNum = res.count
        }
      }
    },
    // 分页事件
    handleCurrentChange (pageNum) {
      this.queryInfo.offset = (pageNum - 1) * 35
      this.currentPage = pageNum
      this.getMvList()
    }
  },
  created () {
    this.getMvList()
  },
  mounted () {},
  destoryed () {}
}
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.out {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .mv {
    font-size: 20px;
    font-weight: bold;
    color: black;
  }

  .redline {
    background: rgb(206, 13, 13);
    width: 100%;
    height: 5px;
    margin-top: 10px;
  }
  .mv_list {
    flex-wrap: wrap;
    display: flex;
    margin-top: 20px;
    width: 100%;
    height: auto;

    .item_box {
      background: rgb(248, 246, 246);
      cursor: pointer;
      margin-bottom: 20px;
      margin-right: 20px;
      border-radius: 5px;
      width: 150px;
      height: auto;

      .img {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        width: 100%;
        height: 100px;
      }
      .text {
        width: 100%;
        margin-left: 5px;
        margin-top: 10px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
        height: auto;
        width: 100px;
        justify-items: center;
        font-size: 14px;
        -webkit-box-orient: vertical;
      }
      .artist {
        margin-top: 10px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
        height: auto;
        width: 100%;
        margin-left: 10px;
        color: rgb(112, 108, 108);
        justify-items: center;
        font-size: 12px;
        -webkit-box-orient: vertical;
      }
      .bofangliang {
        margin-left: 10px;
        margin-bottom: 10px;
        align-items: center;
        margin-top: 10px;
        display: flex;
        color: gray;
        font-size: 12px;

        .playcount {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
