<template>
  <div class="out">
    <div class="top">
      <el-image class="img" :src="detail.cover"></el-image>
      <div class="right">
        <div class="right_line1">
          <div class="gedan">歌单</div>
          <div class="name">{{ detail.name }}</div>
        </div>
        <div class="right_line2">
          <el-image class="img" :src="detail.createrimg"></el-image>
          <div class="name">{{ detail.creatername }}</div>
          <div class="time">{{ detail.updateday }}创建</div>
        </div>
        <div class="right_line3">
          <div class="shoucang" @click="addSheet()">
            <i class="el-icon-star-off" v-if="detail.isadd"></i>
            <i class="el-icon-folder-add" v-if="!detail.isadd"></i>
            <div class="text3">{{ detail.addnum }}</div>
          </div>
          <div class="shoucang" @click="shareSheet()">
            <i class="el-icon-position"></i>
            <div class="text3">{{ detail.sharenum }}</div>
          </div>
          <div class="shoucang">
            <i class="el-icon-chat-line-round"></i>
            <div class="text3">{{ detail.pinglunnum }}</div>
          </div>
        </div>

        <div class="right_line4">
          <div class="biaoqian">标签:</div>
          <div v-for="(item, index) in biaoqian" :key="index">
            <div class="biaoqian_item">{{ item }}</div>
          </div>
        </div>

        <div class="right_line5">
          <div class="jianjie">简介:&nbsp;&nbsp;&nbsp;{{ detail.jianjie }}</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottom_line1">
        <div class="anniu">
          <div class="gequliebiao">歌曲列表</div>
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
        <div class="bofang">
          <div class="text5">播放:</div>
          <div class="text4">{{ detail.bofangnum }}</div>
          <div class="text5">次</div>
        </div>
      </div>

      <div class="bottom_line2">
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
          <el-table-column prop="singer" label="歌手" width="200" />
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

    <div class="comment">
      <div class="remenpinlun">热门评论</div>
      <div class="commentList">
        <div
          v-for="(item, index) in commentList"
          :key="index"
          class="comment_box"
        >
          <el-image class="comment_img" :src="item.user.avatarUrl" />
          <div class="comment_center">
            <div class="comment_center_line1">
              <div class="name">{{ item.user.nickname }}:&nbsp;&nbsp;</div>
              <div class="content">{{ item.content }}</div>
            </div>
            <div class="comment_center_line2">
              <div class="time">{{ item.timeStr }}</div>

              <div class="dianzan">
                <el-image
                  :src="require('@/assets/dianzan.png')"
                  class="dianzan_img"
                ></el-image>
                <div class="dianzannun">({{ item.likedCount }})</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      class="share"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="扫码分享"
      width="30%"
      :visible.sync="dialogVisible"
    >
      <div class="line">
        <div class="qr" ref="qrcode"></div>
        <div class="text">使用 微信 扫码分享</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { timestampToTime, numFormat, secondToFormat } from '../util.js'
import QRCode from 'qrcodejs2'

export default {
  components: {},
  data () {
    return {
      dialogVisible: false,
      commentList: [],
      songsheetid: '',
      biaoqian: [],
      detail: {
        creatername: '',
        createrimg: '',
        cover: '',
        name: '',
        updateday: '',
        addnum: '',
        sharenum: '',
        pinglunnum: '',
        bofangnum: '',
        jianjie: '',
        isadd: false
      },
      canLoad: false,
      tableData: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 分享歌单,生成二维码，可以通过微信扫码分享
    shareSheet () {
      let linkUrl =
        'http://175.24.245.11:81/#/SheetDetail/?sheetid=' + this.songsheetid
      // 延迟解决二维码首次加载不出来的情况
      setTimeout(() => {
        // 清空已有的二维码
        this.$refs.qrcode.innerHTML = ''
        let el = this.$refs.qrcode
        // eslint-disable-next-line no-new
        new QRCode(el, {
          width: 200,
          height: 200,
          text: linkUrl,
          render: 'canvas'
        })
      }, 500)
      this.$nextTick(() => {
        this.dialogVisible = true
      })
    },
    // 添加或者取消收藏歌单
    async addSheet () {
      const { data: res } = await this.$http.get('playlist/subscribe', {
        params: { id: this.songsheetid, t: this.detail.isadd ? 2 : 1 }
      })
      console.log(res)
      if (res.code === 200) {
        if (this.detail.isadd) {
          this.$message({
            message: '已取消收藏',
            center: true,
            type: null
          })
        } else {
          this.$message({
            message: '已收藏',
            center: true,
            type: null
          })
        }
        this.detail.isadd = !this.detail.isadd
      }
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
          artist: row.singer,
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
    // 获取歌单详情
    async getSheetDetail () {
      const { data: res } = await this.$http.get('playlist/detail', {
        params: { id: this.songsheetid, timestamp: Date.now() }
      })
      console.log(res)
      if (res.code === 200) {
        this.detail.creatername = res.playlist.creator.nickname
        this.detail.createrimg = res.playlist.creator.avatarUrl
        this.detail.cover = res.playlist.coverImgUrl
        this.detail.name = res.playlist.name
        this.detail.updateday = timestampToTime(res.playlist.createTime)
        this.detail.addnum = res.playlist.subscribedCount
        this.detail.isadd = res.playlist.subscribed
        this.detail.sharenum = res.playlist.shareCount
        this.detail.pinglunnum = res.playlist.commentCount
        this.detail.bofangnum = numFormat(res.playlist.playCount)
        this.biaoqian = res.playlist.tags
        this.detail.jianjie = res.playlist.description
        // 清空数据
        this.tableData = []
        for (var i = 0; i < res.playlist.tracks.length; i++) {
          // 过滤无音源的歌曲
          if (res.playlist.tracks[i].noCopyrightRcmd == null) {
            this.tableData.push({
              zhuanji: res.playlist.tracks[i].al.name,
              url: res.playlist.tracks[i].al.picUrl,
              name: res.playlist.tracks[i].name,
              duration: res.playlist.tracks[i].dt,
              singer: res.playlist.tracks[i].ar[0].name,
              id: res.playlist.tracks[i].id
            })
          }
        }
        this.canLoad = true
      }
    },
    // 获取热门评论
    async getComments (kind) {
      const { data: res } = await this.$http.get('comment/hot', {
        params: { id: this.songsheetid, type: kind }
      })
      console.log(res)
      if (res.code === 200) {
        this.commentList = res.hotComments
      }
    }
  },
  created () {
    this.songsheetid = this.$route.query.sheetid
    this.getSheetDetail()
    this.getComments(2)
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

  .top {
    width: 100%;
    height: auto;
    display: flex;

    .img {
      width: 200px;
      height: 200px;
      border-radius: 10px;
    }

    .right {
      margin-left: 30px;
      width: auto;
      height: auto;

      .right_line1 {
        display: flex;
        .gedan {
          padding-top: 3px;
          padding-bottom: 3px;
          border-radius: 3px;
          padding-left: 10px;
          padding-right: 10px;
          color: white;
          font-size: 14px;
          font-weight: bold;
          background: rgb(236, 61, 61);
        }

        .name {
          margin-left: 20px;
          color: black;
          font-size: 16px;
          font-weight: bold;
        }
      }
      .right_line2 {
        display: flex;
        margin-top: 20px;

        .img {
          width: 50px;
          height: 50px;
          border-radius: 10px;
        }

        .name {
          align-self: center;
          color: rgb(208, 208, 250);
          margin-left: 20px;
          font-size: 14px;
          font-weight: bold;
        }

        .time {
          align-self: center;
          color: gray;
          margin-left: 20px;
          font-size: 12px;
          font-weight: bold;
        }
      }

      .right_line3 {
        display: flex;
        margin-top: 20px;
        .shoucang {
          margin-right: 10px;
          align-items: center;
          padding-left: 10px;
          padding-right: 10px;
          border-radius: 10px;
          height: 30px;
          display: flex;
          background: #eee;

          .text3 {
            margin-left: 5px;
            font-size: 12px;
          }
        }
        .shoucang:hover {
          border: 0.5px solid #ccc9c9;
          cursor: pointer;
          margin-right: 10px;
          align-items: center;
          padding-left: 10px;
          padding-right: 10px;
          border-radius: 10px;
          height: 30px;
          display: flex;
          background: #f2f2f2;

          .text3 {
            margin-left: 5px;
            font-size: 12px;
          }
        }
      }

      .right_line4 {
        display: flex;
        margin-top: 20px;
        .biaoqian {
          margin-right: 20px;
          color: gray;
          font-size: 14px;
          font-weight: bold;
        }

        .biaoqian_item {
          margin-right: 15px;
          color: black;
          font-size: 14px;
        }
      }

      .right_line5 {
        display: flex;
        margin-top: 20px;
        .jianjie {
          width: 500px;
          color: black;
          font-size: 12px;
        }
      }
    }
  }

  .bottom {
    height: auto;
    width: 100%;
    margin-top: 50px;

    .bottom_line1 {
      justify-content: flex-start;
      display: flex;
      margin-top: 20px;

      .anniu {
        display: flex;
        .gequliebiao {
          margin-right: 20px;
          font-size: 20px;
          color: black;
          font-weight: bold;
        }
        .bofangquanbu {
          background: rgb(237, 237, 248);
        }
      }

      .bofang {
        margin-left: 100px;
        align-self: center;
        display: flex;
        .text4 {
          margin-left: 5px;
          margin-right: 5px;
          color: red;
          font-size: 14px;
        }
        .text5 {
          font-size: 14px;
        }
      }
    }

    .bottom_line2 {
      margin-top: 20px;
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

  .comment {
    margin-top: 30px;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;

    .remenpinlun {
      font-weight: bold;
      font-size: 15px;
      color: black;
    }

    .commentList {
      width: 100%;
      height: 100%;
      margin-top: 20px;
    }

    .comment_box {
      display: flex;
      width: 100%;
      height: 100%;
      margin-bottom: 30px;

      .comment_img {
        width: 45px;
        height: 45px;
        border-radius: 5px;
      }

      .comment_center {
        justify-content: flex-start;
        width: 100%;
        height: auto;
        margin-left: 15px;
        flex-direction: column;
        display: flex;

        .comment_center_line1 {
          flex-flow: wrap;
          width: 100%;
          height: auto;
          display: flex;
          .name {
            white-space: nowrap;
            font-size: 12px;
            color: rgb(163, 163, 228);
          }
          .content {
            width: auto;
            font-size: 12px;
            color: gray;
          }
        }

        .comment_center_line2 {
          flex-direction: row;
          justify-content: space-between;
          display: flex;
          margin-top: 15px;

          .time {
            font-size: 12px;
            color: gray;
          }
          .dianzan {
            align-items: center;
            display: flex;

            .dianzan_img {
              cursor: pointer;
              width: 20px;
              height: 20px;
            }

            .dianzannun {
              margin-left: 5px;
              font-size: 12px;
              color: black;
            }
          }
        }
      }
    }
  }

  .share {
    flex-direction: column;
    display: flex;
    justify-content: space-around;
    border-radius: 10px;

    .line {
      margin-bottom: 20px;
      margin-top: -20px;
      align-items: center;
      flex-direction: column;
      display: flex;
      width: 100%;
      height: auto;
      .qr {
        width: 200px;
        height: 200px;
        border-radius: 5px;
      }
      .text {
        margin-top: 20px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>
