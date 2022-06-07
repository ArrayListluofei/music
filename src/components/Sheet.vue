<template>
  <div class="out">
    <div class="top">
      <div class="left">
        <div class="quanbu">全部</div>
        <div class="fenlei" @click="popClick">选择分类</div>
      </div>
      <div class="remen">热门</div>
    </div>
    <div class="redline" />
    <el-popover
      trigger="click"
      placement="bottom"
      v-model="popopen"
      width="900"
      class="pop"
    >
      <div class="quanbufenge" @click="chooseAll">全部风格</div>
      <div class="grayline"></div>
      <div class="support">
        <div
          v-for="(item, index) in categories"
          :key="index"
          class="support_item"
        >
          <div class="name">{{ item }}</div>
          <div
            v-for="(item1, index1) in filterList(index)"
            :key="index1"
            class="sub_item"
            @click="typeClick(item1.name)"
          >
            <div class="name1">{{ item1.name }}</div>
          </div>
        </div>
      </div>
    </el-popover>

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
      popopen: false,
      categories: [],
      sub: [],
      queryInfo: {
        limit: 35,
        cat: '全部',
        offset: 0
      },
      sheetList: [],
      totalNum: 0,
      currentPage: 1
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 选择分类
    popClick () {
      if (this.popopen) {
        this.popopen = false
      } else {
        this.popopen = true
      }
    },
    // 获取分类
    async getCategories () {
      const { data: res } = await this.$http.get('/playlist/catlist')
      if (res.code === 200) {
        console.log(res)
        this.categories = res.categories
        this.sub = res.sub
      }
    },
    // 筛选
    filterList (index) {
      var array = []
      for (var i = 0; i < this.sub.length; i++) {
        // eslint-disable-next-line eqeqeq
        if (this.sub[i].category == index) {
          array.push({
            name: this.sub[i].name
          })
        }
      }
      return array
    },
    // 类型点击
    typeClick (name) {
      this.queryInfo.cat = name
      this.queryInfo.offset = 0
      this.getSheetList()
      this.popopen = false
      this.currentPage = 1
    },
    // 全部风格
    chooseAll () {
      this.queryInfo.cat = '全部'
      this.queryInfo.offset = 0
      this.getSheetList()
      this.popopen = false
      this.currentPage = 1
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
    // 分页事件
    handleCurrentChange (pageNum) {
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
    this.getCategories()
    this.getSheetList()
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
}
.top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
  height: auto;

  .left {
    display: flex;
    .quanbu {
      font-size: 20px;
      font-weight: bold;
      color: black;
    }
    .fenlei {
      cursor: pointer;
      border: 1px solid rgb(228, 222, 222);
      border-radius: 3px;
      margin-left: 20px;
      font-size: 8px;
      color: rgb(140, 140, 192);
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
    }
  }

  .remen {
    border-radius: 3px;
    padding: 5px;
    font-size: 14px;
    color: white;
    background: rgb(206, 13, 13);
  }
}

.redline {
  background: rgb(206, 13, 13);
  width: 100%;
  height: 5px;
  margin-top: 10px;
}

.pop {
  .quanbufenge {
    cursor: pointer;
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  .quanbufenge:hover {
    text-decoration: underline;
  }

  .grayline {
    margin-top: 20px;
    width: 100%;
    height: 1px;
    background: rgb(230, 225, 225);
  }

  .support {
    height: auto;
    flex-wrap: wrap;
    display: flex;
    margin-top: 20px;
    width: 100%;

    .support_item {
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;

      .name {
        margin-right: 20px;
        height: auto;
        width: auto;
        font-size: 16px;
        font-weight: bold;
      }

      .sub_item {
        justify-content: flex-start;
        display: flex;
        flex-wrap: wrap;
        width: auto;

        .name1 {
          cursor: pointer;
          color: rgb(187, 179, 179);
          margin-right: 20px;
          font-size: 16px;
          margin-bottom: 10px;
          width: auto;
          height: auto;
        }
        .name1:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

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
