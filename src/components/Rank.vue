<template>
  <div class="out">
    <!--左侧排行榜单-->
    <div class="left">
      <div class="text1">云音乐特色榜</div>
      <div class="left_list">
        <div
          class="list_box"
          v-for="(item, index) in rankList"
          :key="index"
          @click="chooseList(item.id, index)"
        >
          <el-image :src="item.coverImgUrl" class="list_img" />
          <div class="list_text">
            <div class="text2">{{ item.name }}</div>
            <div class="text3">{{ item.updateFrequency }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--右侧排行详情-->
    <div class="right" v-if="canLoad">
      <div class="topdetail">
        <el-image :src="detail.cover" class="img" />
        <div class="rightdetail">
          <div class="name">{{ detail.name }}</div>
          <div class="updateday">最近更新时间:{{ detail.updateday }}</div>
          <div class="bottom">
            <div class="shoucang" @click="addSheet()" >
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
          <div class="bofang">
            <div class="text5">播放:</div>
            <div class="text4">{{ detail.bofangnum }}</div>
            <div class="text5">次</div>
          </div>
        </div>
        <div></div>
      </div>

      <div class="anniu">
        <div class="text7">歌曲列表(Top30)</div>
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
      <!--右侧歌曲列表-->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        class="table"
        @row-click="songClick"
      >
        <el-table-column prop="index" label="排行" width="70">
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
        <el-table-column prop="caozuo" label="操作" width="200" >
            <template slot-scope="scope">
            <img src="../assets/download1.png" class="download" @click.stop="downloadMethod(scope.row.id)"/>
            </template>
          </el-table-column>
        <el-table-column prop="id" label="id" width="1" v-if="false" />
      </el-table>
      <!-- 评论-->
      <div class="comment">
        <div class="remenpinlun">最新评论</div>
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
      // 榜单id（就是歌单id）
      sheetid: '',
      rankList: [],
      playlist: [],
      detail: {
        isadd: false,
        cover: '',
        name: '',
        updateday: '',
        addnum: '',
        sharenum: '',
        pinglunnum: '',
        bofangnum: ''
      },
      canLoad: false,
      itemposition: 0,
      tableData: [],
      commentList: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 分享歌单,生成二维码，可以通过微信扫码分享
    shareSheet () {
      let linkUrl = 'http://175.24.245.11:81/#/SheetDetail/?sheetid=' + this.sheetid
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
        params: { id: this.sheetid, t: this.detail.isadd ? 2 : 1 }
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
        fetch(filePath).then(res => res.blob()).then(blob => {
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
    // 获取榜单列表
    async getRankList () {
      const { data: res } = await this.$http.get('toplist')
      console.log(res)
      if (res.code === 200) {
        this.rankList = res.list
        this.sheetid = res.list[0].id
        // 获取第一个id请求歌单详情
        this.getSheetDetail(res.list[0].id)
        this.getComments(2, res.list[0].id)
      }
    },
    // 获取评论
    async getComments (kind, sheetid) {
      const { data: res } = await this.$http.get('comment/playlist', {
        params: { id: sheetid, type: kind }
      })
      console.log(res)
      if (res.code === 200) {
        this.commentList = res.comments
      }
    },
    // 获取歌单详情
    async getSheetDetail (sheetid) {
      const { data: res } = await this.$http.get('playlist/detail', {
        params: { id: sheetid }
      })
      console.log(res)
      if (res.code === 200) {
        this.detail.isadd = res.playlist.subscribed
        this.detail.cover = res.playlist.coverImgUrl
        this.detail.name = res.playlist.name
        this.detail.updateday = timestampToTime(res.playlist.updateTime)
        this.detail.addnum = res.playlist.subscribedCount
        this.detail.sharenum = res.playlist.shareCount
        this.detail.pinglunnum = res.playlist.commentCount
        this.detail.bofangnum = numFormat(res.playlist.playCount)
        // 清空数据
        this.tableData = []
        // 最多加载30条
        var size = 0
        if (res.playlist.tracks.length <= 30) {
          size = res.playlist.tracks.length
        } else {
          size = 30
        }
        for (var i = 0; i < size; i++) {
          this.tableData.push({
            url: res.playlist.tracks[i].al.picUrl,
            name: res.playlist.tracks[i].name,
            duration: res.playlist.tracks[i].dt,
            singer: res.playlist.tracks[i].ar[0].name,
            id: res.playlist.tracks[i].id
          })
        }
        this.canLoad = true
      }
    },
    // 点击榜单
    chooseList (id, index) {
      this.sheetid = id
      this.getSheetDetail(id)
      this.getComments(2, id)
      this.itemposition = index
    }
  },
  created () {
    this.getRankList()
  },
  mounted () {},
  destoryed () {}
}
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类

.out {
  display: flex;
  width: 100%;
  height: auto;

  .left {
    margin-right: 10px;
    flex-direction: column;
    width: auto height auto;
    background-color: white;

    .text1 {
      margin-bottom: 30px;
      font-weight: bold;
      font-size: 20px;
      color: black;
    }

    .left_list {
      width: 300px;
      height: auto;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: flex-start;

      .list_box:hover {
        background: rgb(248, 246, 246);
      }

      .list_box {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 300px;
        height: 70px;
        align-items: center;

        .list_img {
          margin-right: 30px;
          width: 50px;
          height: 50px;
          border-radius: 10px;
        }

        .list_text {
          .text2 {
            margin-bottom: 5px;
            font-size: 14px;
            color: black;
          }
          .text3 {
            font-size: 14px;
            color: gray;
          }
        }
      }
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .topdetail {
      height: 150px;
      display: flex;

      .img {
        border-radius: 5px;
        width: 100px height 100px;
        margin-right: 30px;
      }
      .rightdetail {
        .name {
          font-size: 20px;
          font-weight: bold;
        }

        .updateday {
          margin-top: 10px;
          color: gray;
          font-size: 14px;
        }

        .bofang {
          margin-top: 20px;
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

        .bottom {
          margin-top: 20px;
          display: flex;
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
        .shoucang:hover{
          border:0.5px solid #ccc9c9;
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
      }
    }

    .text6 {
      font-size: 14px;
      color: gray;
    }

    .anniu {
      margin-top: 50px;
      display: flex;
      .text7 {
        margin-right: 20px;
        font-size: 20px;
        color: black;
        font-weight: bold;
      }

      .bofangquanbu {
        background: rgb(237, 237, 248);
      }
    }

    .table {
      cursor: pointer;
      margin-top: 20px;
      width: 100%;
      height: auto;

      .image {
          width: 50px;
          height: 50px;
          border-radius: 5px;
          display: table-cell;
          vertical-align: middle;
        }

        .download{
          display: table-cell;
          vertical-align: middle;
          width: 20px;
          height: 20px;
        }
        .download:hover {
          display: table-cell;
          vertical-align: middle;
          content: url('../assets/download2.png');
          width: 20px;
          height: 20px;
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
