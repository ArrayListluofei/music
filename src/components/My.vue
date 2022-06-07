<template>
  <div class="out">
    <el-dialog
      class="login"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleCancle"
      title="扫码登录"
      width="30%"
      :visible.sync="dialogVisible"
    >
      <div class="line">
        <el-image class="img" :src="img" />
        <div class="text">使用 网易云音乐APP 扫码登录</div>
      </div>
    </el-dialog>

    <div class="top">
      <el-image :src="detail.headurl" class="head" />
      <div class="right">
        <div class="line1">
          <div class="name">{{ detail.nickname }}</div>
          <el-image
            class="sex"
            :src="
              detail.gender == 1
                ? require('@/assets/boy.png')
                : require('@/assets/girl.png')
            "
          />
          <div class="level">VIP{{ detail.level }}</div>
          <img
            class="logout"
            src="../assets/logout.png"
            title="点击退出登录"
            @click="logoutMethod"
          />
        </div>
        <div class="line2" />
        <div class="des">个人介绍:&nbsp;&nbsp;{{ detail.des }}</div>
        <div class="des">生日:&nbsp;&nbsp;{{ detail.birthday }}</div>
        <div class="line3">
          <div class="dongtai">
            <div class="dongtainum">{{ detail.dongtainum }}</div>
            <div class="text">动态</div>
          </div>
          <div class="dongtai">
            <div class="dongtainum">{{ detail.guanzhunum }}</div>
            <div class="text">关注</div>
          </div>
          <div class="dongtai">
            <div class="dongtainum">{{ detail.fensinum }}</div>
            <div class="text">粉丝</div>
          </div>
        </div>
      </div>
    </div>

    <div class="redline"></div>

    <div class="bottom">
      <div class="bottom_left">
        <div
          v-for="(item, index) in tabList"
          class="item"
          :key="index"
          @click="tabClick(index)"
        >
          <div :class="activeTab == index ? 'oral_red' : 'oral'" />
          <div :class="activeTab == index ? 'tab_left_red' : 'tab_left'">
            {{ item }}
          </div>
        </div>
      </div>

      <div class="line4" />

      <div class="bottom_right">
        <!-- 歌手列表 -->
        <div class="singer" v-if="activeTab == 0">
          <div
            class="singer_box"
            v-for="(item, index) in artistList"
            :key="index"
            @click="singerClick(item.id)"
          >
            <el-image class="singer_img" :src="item.picUrl" />
            <div class="singer_name">{{ item.name }}</div>
          </div>
        </div>

        <!-- MV列表 -->
        <div class="mv" v-if="activeTab == 1">
          <div
            v-for="(item, index) in filterList"
            :key="index"
            class="mv_box"
            @click="mvClick(item.vid)"
          >
            <el-image class="mv_img" :src="item.coverUrl"></el-image>
            <div class="mv_text">{{ item.title }}</div>
            <div class="mv_artist">
              by&nbsp;&nbsp;{{ item.creator[0].userName }}
            </div>
            <div class="mv_bofangliang">
              <i class="el-icon-view"></i>
              <div class="mv_playcount">{{ item.playTime }}</div>
            </div>
          </div>
        </div>

        <!-- 歌单列表 -->
        <div class="songsheet" v-if="activeTab == 2">
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
      </div>
    </div>
  </div>
</template>

<script>
import { timestampToTime } from '../util.js'
export default {
  components: {},
  data () {
    return {
      dialogVisible: '',
      img: '',
      key: '',
      timer: '',
      detail: {
        birthday: '',
        accountId: '',
        nickname: '',
        headurl: '',
        gender: '',
        des: '',
        dongtainum: '',
        guanzhunum: '',
        fensinum: '',
        level: ''
      },
      tabList: ['我的歌手', '我的MV', '我的歌单'],
      activeTab: 0,
      artistList: [],
      mvList: [],
      sheetList: []
    }
  },
  computed: {
    // 过滤数组
    filterList () {
      return this.mvList.filter(function (data) {
        return data.type === 0
      })
    }
  },
  watch: {},
  methods: {
    // 手动关闭弹窗
    handleCancle () {
      this.dialogVisible = false
      window.clearInterval(this.timer)
    },
    // 退出登录
    logoutMethod () {
      // 清除token
      window.localStorage.removeItem('token')
      this.dialogVisible = true
      this.$message({
        message: '账号已退出',
        center: true,
        type: null
      })
      // 重新获取二维码
      this.getKey()
    },
    // 跳转去mv详情
    mvClick (id) {
      let routeData = this.$router.resolve({
        path: '/VedioDetail/',
        query: { id: id }
      })
      window.open(routeData.href, '_blank')
    },
    // 跳转去歌单详情页
    songSheetClick (id) {
      let routeData = this.$router.resolve({
        path: '/SheetDetail/',
        query: { sheetid: id }
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
    // ①获取key
    async getKey () {
      const { data: res } = await this.$http.get('login/qr/key', {
        params: Date.now()
      })
      console.log(res)
      if (res.code === 200) {
        this.key = res.data.unikey
        this.getZCode()
      }
    },
    // ②生成二维码
    async getZCode () {
      const { data: res } = await this.$http.get('login/qr/create', {
        params: { key: this.key, qrimg: 0, timestamp: Date.now() }
      })
      console.log(res)
      if (res.code === 200) {
        this.img = res.data.qrimg
        this.lunxunMethod()
      }
    },
    // 轮询
    lunxunMethod () {
      this.timer = window.setInterval(() => {
        setTimeout(() => {
          this.checkZCode()
        }, 0)
      }, 3000)
    },
    // ③查询登录状态
    async checkZCode () {
      const { data: res } = await this.$http.get('login/qr/check', {
        params: { key: this.key, timestamp: Date.now() }
      })
      console.log(res)
      if (res.code === 803) {
        // 803为授权成功
        window.localStorage.setItem('token', res.cookie)
        this.$message({
          message: '登陆成功',
          center: true,
          type: null
        })
        // 关闭轮询
        window.clearInterval(this.timer)
        this.dialogVisible = false
        this.getAccountInfo()
      } else if (res.code === 800) {
        // 800为过期
        this.$message({
          message: '二维码已过期,请扫描最新二维码',
          center: true,
          type: null
        })

        // 关闭轮询
        window.clearInterval(this.timer)
        this.getZCode()
      }
    },
    // 获取账号信息
    async getAccountInfo () {
      const { data: res } = await this.$http.get('user/account')
      console.log(res)
      if (res.code === 200) {
        this.detail.accountId = res.account.id
        this.getPersonInfo()
        this.getSingerInfo()
        this.getMvInfo()
        this.getSheetInfo()
      }
    },
    // 获取收藏的歌单信息
    async getSheetInfo () {
      const { data: res } = await this.$http.get('user/playlist', {
        params: { uid: this.detail.accountId, timestamp: Date.now() }
      })
      console.log(res)
      if (res.code === 200) {
        this.sheetList = res.playlist
      }
    },
    // 获取收藏的MV信息
    async getMvInfo () {
      const { data: res } = await this.$http.get('mv/sublist', {
        params: Date.now()
      })
      console.log(res)
      if (res.code === 200) {
        this.mvList = res.data
      }
    },
    // 获取收藏的歌手
    async getSingerInfo () {
      const { data: res } = await this.$http.get('artist/sublist', {
        params: Date.now()
      })
      console.log(res)
      if (res.code === 200) {
        this.artistList = res.data
      }
    },
    // 获取用户信息
    async getPersonInfo () {
      const { data: res } = await this.$http.get('user/detail', {
        params: { uid: this.detail.accountId }
      })
      console.log(res)
      if (res.code === 200) {
        this.detail.nickname = res.profile.nickname
        this.detail.headurl = res.profile.avatarUrl
        this.detail.gender = res.profile.gender
        this.detail.des = res.profile.signature
        this.detail.dongtainum = res.profile.eventCount
        this.detail.guanzhunum = res.profile.follows
        this.detail.fensinum = res.profile.followeds
        this.detail.birthday = timestampToTime(res.profile.birthday)
        this.detail.level = res.level
      }
    },
    // 点击左侧tab
    tabClick (position) {
      this.activeTab = position
    }
  },
  created () {
    // 判断有无token
    const token = window.localStorage.getItem('token')
    console.log(token)
    if (token == null) {
      this.dialogVisible = true
      this.getKey()
    } else {
      this.dialogVisible = false
      this.getAccountInfo()
    }
  },
  mounted () {},
  destoryed () {},
  beforeDestroy () {}
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
  flex-wrap: wrap;

  .login {
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
      .img {
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

  .top {
    margin-top: 20px;
    display: flex;

    .head {
      width: 150px;
      height: 150px;
      border-radius: 10px;
    }
    .right {
      width: 80%;
      margin-left: 40px;

      .line1 {
        display: flex;
        align-items: center;
        .name {
          font-size: 20px;
          font-weight: bold;
          color: black;
        }
        .sex {
          margin-left: 15px;
          width: 20px;
          height: 20px;
        }
        .level {
          padding-left: 10px;
          padding-right: 10px;
          border-radius: 5px;
          color: white;
          background: rgb(241, 185, 185);
          margin-left: 20px;
          font-size: 14px;
          font-weight: bold;
        }

        .logout {
          cursor: pointer;
          margin-left: 50px;
          width: 25px;
          height: 25px;
        }
      }
      .line2 {
        margin-top: 10px;
        width: 300px;
        background: rgb(199, 197, 197);
        height: 1px;
      }
      .des {
        font-size: 14px;
        color: gray;
        margin-top: 20px;
      }

      .line3 {
        margin-top: 20px;
        display: flex;
        .dongtai {
          align-items: center;
          margin-right: 30px;
          display: flex;
          flex-direction: column;

          .text {
            font-size: 14px;
            color: gray;
          }

          .dongtainum {
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: bold;
            color: black;
          }
        }
      }
    }
  }

  .redline {
    background: rgb(206, 13, 13);
    width: 100%;
    height: 2px;
    margin-top: 40px;
  }

  .bottom {
    display: flex;
    margin-top: 40px;
    width: 100%;
    height: auto;

    .bottom_left {
      flex-direction: column;
      display: flex;
      height: 400px;
      background: rgb(247, 244, 244);
      width: 125px;
      padding-top: 20px;
      padding-left: 10px;
      padding-right: 20px;
      padding-bottom: 10px;

      .item {
        display: flex;
        padding-left: 10px;

        .oral {
          align-self: center;
          width: 4px;
          height: 4px;
          background: gray;
          border-radius: 50px;
          margin-right: 10px;
          margin-bottom: 20px;
        }
        .oral_red {
          margin-bottom: 20px;
          align-self: center;
          width: 4px;
          height: 4px;
          background: rgb(206, 13, 13);
          border-radius: 50px;
          margin-right: 10px;
        }

        .tab_left_red {
          margin-left: 5px;
          margin-bottom: 20px;
          color: rgb(206, 13, 13);
        }
        .tab_left_red:hover {
          margin-left: 5px;
          cursor: pointer;
          text-decoration: underline;
        }
        .tab_left {
          margin-left: 5px;
          margin-bottom: 20px;
          color: gray;
        }
        .tab_left:hover {
          margin-left: 5px;
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }

    .bottom_right {
      width: 100%;
      height: auto;
      margin-left: 30px;

      .singer {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;

        .singer_box {
          cursor: pointer;
          margin-right: 30px;
          margin-bottom: 30px;

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

      .mv {
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

      .songsheet {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;

        .songsheet_box {
          cursor: pointer;
          margin-bottom: 20px;
          margin-right: 20px;

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
    }
  }
}
</style>
