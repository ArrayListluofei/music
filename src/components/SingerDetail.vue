<template>
  <div class="out">
    <div class="left">
      <div class="name">{{ name }}</div>
      <el-image class="img" :src="cover"></el-image>
      <div class="jianjie">歌手简介</div>
      <div class="des">{{ des }}</div>
      <div class="anniu">
        <div class="remengequ">热门歌曲(50首)</div>
        <div>
          <el-button
            class="bofangquanbu"
            @click="addall"
            type="mini"
            icon="el-icon-video-play"
            >播放全部</el-button
          >
        </div>
      </div>
      <div class="list">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          class="table"
          @row-click="songClick"
        >
          <el-table-column prop="index" label="" width="70">
            <template slot-scope="scope">
              <div class="text6">{{ scope.$index + 1 }}</div>
            </template>
          </el-table-column>
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
      </div>
    </div>
    <div class="line"></div>
    <div class="right">
      <div class="xiangsi">相似歌手</div>
      <div class="xiangsi_list">
        <div
          v-for="(item, index) in sameSingerList"
          :key="index"
          class="item_box"
          @click="singerClick(item.id)"
        >
          <el-image class="img" :src="item.picUrl"></el-image>
          <div class="text">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { secondToFormat } from '../util.js'

export default {
  components: {},
  data () {
    return {
      singerid: '',
      name: '',
      cover: '',
      des: '',
      tableData: [],
      sameSingerList: []
    }
  },
  computed: {},
  watch: {},
  methods: {
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
    // 播放列表歌曲
    addall () {
      window.localStorage.setItem('tableData', JSON.stringify(this.tableData))
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
    durationFormat (row, column) {
      return secondToFormat(parseInt(row.duration / 1000))
    },
    // 相似歌手
    singerClick (id) {
      this.singerid = id
      this.getSameSinger()
      this.getSingerDetail()
      this.getHotList()
    },
    // 获取相似歌手
    async getSameSinger () {
      const { data: res } = await this.$http.get('/simi/artist', {
        params: { id: this.singerid }
      })
      console.log(res)
      if (res.code === 200) {
        this.sameSingerList = res.artists
      }
    },
    // 获取歌手详情
    async getSingerDetail () {
      const { data: res } = await this.$http.get('/artist/detail', {
        params: { id: this.singerid }
      })
      console.log(res)
      if (res.code === 200) {
        this.name = res.data.artist.name
        this.cover = res.data.artist.cover
        this.des = res.data.artist.briefDesc
      }
    },
    // 获取歌手热门歌曲50
    async getHotList () {
      const { data: res } = await this.$http.get('/artist/top/song', {
        params: { id: this.singerid }
      })
      console.log(res)
      if (res.code === 200) {
        let _this = this
        // 清空数据
        this.tableData = []
        for (var i = 0; i < res.songs.length; i++) {
          this.tableData.push({
            singer: _this.name,
            url: res.songs[i].al.picUrl,
            zhuanji: res.songs[i].al.name,
            name: res.songs[i].name,
            duration: res.songs[i].dt,
            id: res.songs[i].id
          })
        }
      }
    }
  },
  created () {
    this.singerid = this.$route.query.singerid
    this.getSingerDetail()
    this.getHotList()
    this.getSameSinger()
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
  flex-direction: row;
  justify-content: flex-start;

  .left {
    width: 70%;
    .name {
      margin-top: 20px;
      font-size: 20px;
      color: black;
      font-weight: bold;
    }
    .jianjie {
      font-size: 20px;
      color: black;
      font-weight: bold;
      margin-top: 20px;
    }
    .img {
      margin-top: 20px;
      border-radius: 5px;
      width: 70%;
      height: 400px;
    }

    .des {
      width: 80%;
      margin-top: 10px;
      font-size: 14px;
      color: gray;
    }

    .anniu {
      display: flex;
      margin-top: 20px;

      .remengequ {
        margin-right: 20px;
        font-size: 20px;
        color: black;
        font-weight: bold;
      }

      .bofangquanbu {
        background: rgb(237, 237, 248);
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

  .line {
    width: 5px;
    height: 1000px;
    background: rgb(226, 224, 224);
  }
  .right {
    margin-top: 20px;
    margin-left: 20px;

    .xiangsi {
      font-size: 16px;
      font-weight: bold;
      color: black;
    }
    .xiangsi_list {
      width: 100%;
      height: auto;
      margin-top: 20px;
      flex-wrap: wrap;
      display: flex;

      .item_box {
        cursor: pointer;
        width: 60px;
        height: auto;
        margin-bottom: 15px;
        margin-right: 15px;
        .img {
          width: 60px;
          height: 60px;
          border-radius: 5px;
        }

        .text {
          width: auto;
          height: auto;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
