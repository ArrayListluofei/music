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
        <div :class="item.first == queryInfo.keywords?'text_select':'text'">
          {{ item.first }}
        </div>
      </div>
    </div>

    <div class="hotsearch"  v-if="isViviable">搜索结果:</div>

    <div class="list" v-if="isViviable">
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
  </div>
</template>

<script>
import { secondToFormat } from '../util.js'
export default {
  components: {},
  data () {
    return {
      hotList: [],
      isViviable: false,
      totalNum: 0,
      tableData: [],
      input: '',
      queryInfo: {
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
      this.isViviable = true
      const { data: res } = await this.$http.get('cloudsearch', {
        params: this.queryInfo
      })
      if (res.code === 200) {
        console.log(res)
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

  .hotsearch{
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
      color:rgb(240, 131, 131);
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
}
</style>
