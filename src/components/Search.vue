<template>
  <div class="out">
    <el-input
      v-model="input"
      placeholder="搜索音乐"
      suffix-icon="el-icon-search"
      clearable="true"
      class="search"
      @keyup.enter.native="searchEnter"
    >
    </el-input>
    <div class="hotsearch">热门搜索:</div>

    <div class="hot_list_out">
      <div
        class="hot_list"
        v-for="(item, index) in hotList"
        :key="index"
        @click="hotClick(item.first)"
      >
        <div :class="item.first == queryInfo.keywords ? 'text_select' : 'text'">
          {{ item.first }}
        </div>
      </div>
    </div>

    <div class="hotsearch">搜索结果:</div>

    <el-tabs @tab-click="handleClick" type="card" class="tabs">
      <el-tab-pane>
        <span slot="label"
          ><i class="el-icon-date"></i
          >&nbsp;&nbsp;&nbsp;&nbsp;音乐&nbsp;&nbsp;&nbsp;&nbsp;</span
        >
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"
          ><i class="el-icon-user"></i
          >&nbsp;&nbsp;&nbsp;&nbsp;歌手&nbsp;&nbsp;&nbsp;&nbsp;</span
        >
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"
          ><i class="el-icon-camera"></i
          >&nbsp;&nbsp;&nbsp;&nbsp;MV&nbsp;&nbsp;&nbsp;&nbsp;</span
        >
      </el-tab-pane>
    </el-tabs>
    <!--音乐列表 -->
    <div class="list" v-if="queryInfo.type === 1">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        class="table"
        @row-click="songClick"
      >
        <el-table-column prop="url" label="封面" width="120">
          <template slot-scope="scope">
            <img :src="scope.row.url" class="image" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="歌曲标题" width="200" />
        <el-table-column
          prop="duration"
          label="时长"
          width="120"
          :formatter="durationFormat"
        />
        <el-table-column prop="zhuanji" label="专辑" width="200" />
        <el-table-column prop="caozuo" label="操作" width="200">
          <template slot-scope="scope">
            <img
              src="../assets/download1.png"
              class="download"
              @click.stop="downloadMethod(scope.row.id)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="id" label="id" width="1" v-if="false" />
      </el-table>

      <div style="height: 20px;" />
    </div>

    <!--歌手列表 -->
    <div class="singer" v-if="queryInfo.type === 100">
      <div
        class="singer_box"
        v-for="(item, index) in singerList"
        :key="index"
        @click="singerClick(item.id)"
      >
        <el-image class="singer_img" :src="item.picUrl" />
        <div class="singer_name">{{ item.name }}</div>
      </div>
    </div>

    <!--mv列表 -->
    <div class="mv_list" v-if="queryInfo.type === 1004">
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
      :page-size="10"
      background
      layout="prev, pager, next"
      :total="totalNum"
    >
    </el-pagination>
  </div>
</template>

<script>
import { secondToFormat } from '../util.js'
export default {
  components: {},
  data () {
    return {
      mvList: [],
      singerList: [],
      hotList: [],
      totalNum: 0,
      tableData: [],
      input: '',
      queryInfo: {
        type: 1,
        limit: 10,
        keywords: '',
        offset: 0
      },
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
    // 歌手详情
    singerClick (id) {
      let routeData = this.$router.resolve({
        path: '/SingerDetail/',
        query: { singerid: id }
      })
      window.open(routeData.href, '_blank')
    },
    // 点击选项卡
    handleClick (tab, event) {
      this.queryInfo.offset = 0
      this.currentPage = 1
      if (tab.index === '0') {
        // 音乐
        this.queryInfo.type = 1
      } else if (tab.index === '1') {
        // 歌手
        this.queryInfo.type = 100
      } else if (tab.index === '2') {
        // mv
        this.queryInfo.type = 1004
      }
      this.getSearchSuggest()
    },
    // 点击歌曲
    songClick (row, event, coloum) {
      // 存储播放信息
      window.localStorage.setItem(
        'singleMusic',
        JSON.stringify({
          title: row.name,
          artist: this.name,
          src:
            'https://music.163.com/song/media/outer/url?id=' + row.id + '.mp3',
          pic: row.url,
          id: row.id
        })
      )
    },
    // 下载歌曲
    async downloadMethod (id) {
      const { data: res } = await this.$http.get('/song/url', {
        params: { id: id }
      })
      console.log(res)
      if (res.code === 200) {
        const filePath = res.data[0].url // 获取mp3的地址
        fetch(filePath)
          .then(res => res.blob())
          .then(blob => {
            const a = document.createElement('a')
            document.body.appendChild(a)
            a.style.display = 'none'
            // 使用获取到的blob对象创建的url
            const url = window.URL.createObjectURL(blob)
            a.href = url
            // 指定下载的文件名
            a.download = id + '.mp3'
            a.click()
            document.body.removeChild(a)
            // 移除blob对象的url
            window.URL.revokeObjectURL(url)
          })
      }
    },
    durationFormat (row, column) {
      return secondToFormat(parseInt(row.duration / 1000))
    },
    // 点击热门搜索
    hotClick (s) {
      this.input = s
      this.queryInfo.offset = 0
      this.currentPage = 1
      this.queryInfo.keywords = s
      this.getSearchSuggest()
    },
    // 自定义搜索
    searchEnter () {
      if (this.input === '') {
      } else {
        this.queryInfo.offset = 0
        this.currentPage = 1
        this.queryInfo.keywords = this.input
        this.getSearchSuggest()
      }
    },
    // 获取搜索结果(暂时只搜索音乐)
    async getSearchSuggest () {
      const { data: res } = await this.$http.get('cloudsearch', {
        params: this.queryInfo
      })
      if (res.code === 200) {
        console.log(res)
        if (this.queryInfo.type === 1) {
          this.totalNum = res.result.songCount
          // 清空数据
          this.tableData = []
          for (var i = 0; i < res.result.songs.length; i++) {
            this.tableData.push({
              url: res.result.songs[i].al.picUrl,
              zhuanji: res.result.songs[i].al.name,
              name: res.result.songs[i].name,
              duration: res.result.songs[i].dt,
              id: res.result.songs[i].id
            })
          }
        } else if (this.queryInfo.type === 100) {
          this.totalNum = res.result.artistCount
          this.singerList = []
          this.singerList = res.result.artists
        } else if (this.queryInfo.type === 1004) {
          this.totalNum = res.result.mvCount
          this.mvList = []
          this.mvList = res.result.mvs
        }
      }
    },
    // 获取热门搜索列表
    async getHotSearch () {
      const { data: res } = await this.$http.get('search/hot')
      if (res.code === 200) {
        console.log(res)
        this.hotList = res.result.hots
        this.queryInfo.keywords = res.result.hots[0].first
        this.queryInfo.offset = 0
        this.currentPage = 1
        this.getSearchSuggest()
      }
    },
    // 分页事件
    handleCurrentChange (pageNum) {
      this.queryInfo.offset = (pageNum - 1) * 10
      this.currentPage = pageNum
      this.getSearchSuggest()
    }
  },
  created () {
    this.getHotSearch()
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

  .search {
    width: 50%;
    height: auto;
  }

  .hotsearch {
    margin-top: 20px;
    font-weight: bold;
    font-size: 14px;
    color: rgb(82, 79, 79);
  }

  .hot_list_out {
    width: 50%;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 20px;
    display: flex;

    .hot_list {
      cursor: pointer;
      height: auto;
      margin-right: 20px;
      margin-bottom: 20px;
    }

    .text {
      border-radius: 5px;
      padding-left: 8px;
      padding-right: 8px;
      padding-top: 2px;
      padding-bottom: 2px;
      border: 0.5px solid #ccc9c9;
      font-size: 14px;
      color: gray;
    }

    .text_select {
      border-radius: 5px;
      padding-left: 8px;
      padding-right: 8px;
      padding-top: 2px;
      padding-bottom: 2px;
      border: 0.5px solid rgb(240, 131, 131);
      font-size: 14px;
      color: rgb(240, 131, 131);
    }
    .text:hover {
      border-radius: 5px;
      padding-left: 8px;
      padding-right: 8px;
      padding-top: 2px;
      padding-bottom: 2px;
      border: 0.5px solid rgb(240, 131, 131);
      font-size: 14px;
      color: rgb(240, 131, 131);
    }
  }

  .tabs {
    margin-top: 20px;
  }

  .list {
    margin-top: 20px;
    width: auto;
    height: auto;

    .table {
      cursor: pointer;

      .image {
        width: 50px;
        height: 50px;
        border-radius: 5px;
        display: table-cell;
        vertical-align: middle;
      }

      .download {
        display: table-cell;
        vertical-align: middle;
        width: 20px;
        height: 20px;
      }
      .download:hover {
        display: table-cell;
        vertical-align: middle;
        content: url("../assets/download2.png");
        width: 20px;
        height: 20px;
      }
    }
  }

  .singer {
    margin-top: 20px;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;

    .singer_box {
      cursor: pointer;
      margin-right: 15px;
      margin-top: 15px;
      margin-bottom: 15px;

      .singer_img {
        border-radius: 10px;
        height: 100px;
        width: 100px;
      }
      .singer_name {
        margin-top: 5px;
        height: auto;
        width: 100px;
        justify-items: center;
        color: gray;
        font-size: 12px;
      }
    }
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
