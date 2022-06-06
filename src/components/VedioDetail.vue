<template>
  <div class="out">
    <div class="left">
      <div class="left_top">
        <div class="mv">MV</div>
        <div class="name">{{ detail.name }}</div>
        <div class="artist">--{{ detail.artist }}</div>
      </div>

      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :options="playerOptions"
        @ready="onPlayerReadied"
        @timeupdate="onTimeupdate"
        :playsinline="playsinline"
      >
      </video-player>

      <div class="left_bottom">
        <div class="shoucang" @click="addVedio()">
          <i class="el-icon-star-off" v-if="detail.isadd"></i>
          <i class="el-icon-folder-add" v-if="!detail.isadd"></i>
          <div class="text3">{{ detail.shoucang }}</div>
        </div>
        <div class="shoucang" @click="shareVedio()">
          <i class="el-icon-position"></i>
          <div class="text3">{{ detail.fenxiang }}</div>
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
    </div>

    <div class="line1" />
    <div class="right">
      <div class="text1">MV简介</div>
      <div class="line2" />
      <div class="time">发布时间:&nbsp;&nbsp;{{ detail.time }}</div>
      <div class="time">播放次数:&nbsp;&nbsp;{{ detail.playnum }}次</div>

      <div class="text1">相关推荐</div>
      <div class="line2" />

      <!-- MV列表 -->
      <div class="mv">
        <div
          v-for="(item, index) in mvList"
          :key="index"
          class="mv_box"
          @click="mvClick(item.id)"
        >
          <el-image class="mv_img" :src="item.cover"></el-image>
          <div class="mv_text">{{ item.name }}</div>
          <div class="mv_artist">by&nbsp;&nbsp;{{ item.artistName }}</div>
          <div class="mv_bofangliang">
            <i class="el-icon-view"></i>
            <div class="mv_playcount">{{ item.playCount }}</div>
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
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-contrib-hls'
import { videoPlayer } from 'vue-video-player'
import QRCode from 'qrcodejs2'

export default {
  components: {
    videoPlayer
  },
  data () {
    return {
      dialogVisible: false,
      commentList: [],
      id: '',
      detail: {
        isadd: false,
        fenxiang: '',
        shoucang: '',
        name: '',
        artist: '',
        time: '',
        playnum: ''
      },
      mvList: [],
      initialized: false,
      currentTech: '',
      streams: {
        rtmp: '',
        hls: ''
      },
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        autoplay: true,
        controls: true,
        preload: 'auto',
        muted: false,
        loop: false,
        language: 'zh-CN',
        aspectRatio: '16:9',
        fluid: true,
        sources: [],
        poster: '',
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放'
      }
    }
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    },
    currentStream () {
      return this.currentTech === 'Flash' ? 'RTMP' : 'HLS'
    },
    playsinline () {
      let ua = navigator.userAgent.toLocaleLowerCase()
      // x5内核
      if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
        return false
      } else {
        // ios端
        return true
      }
    }
  },
  watch: {},
  methods: {
    onPlayerReadied () {
      if (!this.initialized) {
        this.initialized = true
        this.currentTech = this.player.techName_
      }
    },
    // record current time
    onTimeupdate (e) {},
    // 添加或者取消收藏mv
    async addVedio () {
      const { data: res } = await this.$http.get('mv/sub', {
        params: { mvid: this.id, t: this.detail.isadd ? 2 : 1 }
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
    // 分享mv,生成二维码，可以通过微信扫码分享
    shareVedio () {
      let linkUrl = 'http://175.24.245.11:81/#/VedioDetail/?id=' + this.id
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
    // 获取热门评论
    async getComments (kind) {
      const { data: res } = await this.$http.get('comment/hot', {
        params: { id: this.id, type: kind }
      })
      console.log(res)
      if (res.code === 200) {
        this.commentList = res.hotComments
      }
    },
    // 获取新的mv详情
    mvClick (id) {
      this.id = id
      this.getMvDetail()
      this.getMvUrl()
      this.getComments(1)
      this.getMvList()
    },
    // 获取相似mv
    async getMvList () {
      const { data: res } = await this.$http.get('simi/mv', {
        params: { mvid: this.id, timestamp: Date.now() }
      })
      console.log(res)
      if (res.code === 200) {
        this.mvList = res.mvs
      }
    },
    // 获取mv详情
    async getMvDetail () {
      const { data: res } = await this.$http.get('mv/detail', {
        params: { mvid: this.id, timestamp: Date.now() }
      })
      console.log(res)
      if (res.code === 200) {
        this.detail.fenxiang = res.data.shareCount
        this.detail.shoucang = res.data.subCount
        this.detail.name = res.data.name
        this.detail.artist = res.data.artistName
        this.detail.time = res.data.publishTime
        this.detail.playnum = res.data.playCount
        this.detail.isadd = res.subed
      }
    },
    // 获取mv地址
    async getMvUrl () {
      const { data: res } = await this.$http.get('mv/url', {
        params: { id: this.id }
      })
      if (res.code === 200) {
        this.playerOptions.sources = []
        this.playerOptions.poster = '' // 封面
        const video = {
          src: res.data.url, // 路径
          type: 'video/mp4' // 类型
        }
        this.playerOptions.sources.push(video)
      }
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getMvDetail()
    this.getMvUrl()
    this.getComments(1)
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
  flex-direction: row;
  justify-content: flex-start;

  .left {
    width: 60%;
    height: auto;
    .left_top {
      margin-bottom: 30px;
      align-items: center;
      display: flex;
      .mv {
        height: 16px;
        font-weight: bold;
        padding-right: 3px;
        padding-left: 3px;
        font-size: 12px;
        background: white;
        color: rgb(248, 89, 89);
        border: 2px solid rgb(248, 89, 89);
      }
      .name {
        margin-left: 10px;
        font-weight: bold;
        font-size: 20px;
        color: black;
      }
      .artist {
        margin-left: 20px;
        font-weight: bold;
        font-size: 18px;
        color: rgb(187, 187, 243);
      }
    }

    .left_bottom {
      margin-top: 30px;
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

  .line1 {
    margin-left: 10px;
    margin-right: 10px;
    background: rgb(233, 230, 230);
    width: 2px;
    height: 450px;
  }

  .right {
    width: 40%;
    margin-left: 10px;

    .text1 {
      margin-top: 20px;
      font-weight: bold;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.664);
    }
    .line2 {
      margin-top: 15px;
      background: rgb(233, 230, 230);
      width: 100%;
      height: 2px;
    }

    .time {
      margin-top: 15px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.664);
    }

    .mv {
      margin-top: 30px;
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;

      .mv_box {
        background: rgb(248, 246, 246);
        cursor: pointer;
        margin-bottom: 20px;
        margin-right: 20px;
        border-radius: 5px;
        width: 150px;
        height: auto;

        .mv_img {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          width: 100%;
          height: 100px;
        }
        .mv_text {
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
        .mv_artist {
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
        .mv_bofangliang {
          margin-left: 10px;
          margin-bottom: 10px;
          align-items: center;
          margin-top: 10px;
          display: flex;
          color: gray;
          font-size: 12px;

          .mv_playcount {
            margin-left: 5px;
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
