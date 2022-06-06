<template>
  <div>
    <el-menu
      class="el_menu"
      mode="horizontal"
      text-color="#ffffff"
      active-text-color="#FA6A02"
      router
      background-color="#2B2A33"
      :default-active="this.$route.path"
    >
      <el-menu-item index="/Recommend">推荐</el-menu-item>
      <el-menu-item index="/Rank">排行榜</el-menu-item>
      <el-menu-item index="/Sheet">歌单</el-menu-item>
      <el-menu-item index="/Vedio">MV</el-menu-item>
      <el-menu-item index="/Singer">歌手</el-menu-item>
      <el-menu-item index="/Search">发现</el-menu-item>
      <el-menu-item index="/My">我的音乐</el-menu-item>
    </el-menu>

    <el-main class="el_main">
      <router-view />
    </el-main>

    <aplayer
      autoplay
      :list="musicList"
      :music="musicList[0]"
      class="player"
      v-if="showfooter"
      :listFolded="true"
      :mutex="true"
      :showLrc="true"
      listMaxHeight="300px"
    >
    </aplayer>
  </div>
</template>

<script>
// 引入媒体播放器
import aplayer from 'vue-aplayer'
export default {
  components: {
    aplayer: aplayer
  },
  data () {
    return {
      // 多个音乐播放
      tempmusicList: [],
      musicList: [],
      showfooter: false
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 获取歌词
    async getLrc (id, title, artist, src, pic) {
      const { data: res } = await this.$http.get('/lyric', {
        params: { id: id }
      })
      console.log(res)
      if (res.code === 200) {
        this.musicList.push({
          title: title,
          artist: artist,
          src: src,
          pic: pic,
          lrc: res.lrc.lyric
        })
        // 框架有bug，当前页面上点击歌曲不会自动播放，所以做一次局部刷新页面
        this.$nextTick(() => {
          this.showfooter = true
        })
      }
    },

    async getLrc2 (i, length, id, title, artist, src, pic) {
      const { data: res } = await this.$http.get('/lyric', {
        params: { id: id }
      })
      console.log(res)
      if (res.code === 200) {
        // 数据因为加载时间会导致错乱，放到临时list后排序一下
        this.tempmusicList.push({
          i: i,
          title: title,
          artist: artist,
          src: src,
          pic: pic,
          lrc: res.lrc.lyric
        })
        // 数据因为加载时间会导致错乱，排序一下
        if (this.tempmusicList.length === length) {
          this.musicList = this.tempmusicList.sort((a, b) => a.i - b.i)
          this.$nextTick(() => {
            this.showfooter = true
          })
          console.log(this.musicList)
        }
      }
    }
  },
  created () {
    let _this = this
    window.addEventListener('setItemEvent', function (e) {
      // 切换歌曲先把showfooter为false否则不起作用
      _this.musicList = []
      _this.tempmusicList = []
      _this.showfooter = false
      if (e.key === 'tableData') {
        // 歌单
        var array = JSON.parse(e.newValue)
        for (var i = 0; i < array.length; i++) {
          // 歌单
          _this.getLrc2(
            i,
            array.length,
            array[i].id,
            array[i].name,
            array[i].singer,
            'https://music.163.com/song/media/outer/url?id=' +
              array[i].id +
              '.mp3',
            array[i].url
          )
        }
      } else if (e.key === 'singleMusic') {
        // 单曲
        _this.getLrc(
          JSON.parse(e.newValue)['id'],
          JSON.parse(e.newValue)['title'],
          JSON.parse(e.newValue)['artist'],
          JSON.parse(e.newValue)['src'],
          JSON.parse(e.newValue)['pic']
        )
      }
    })
  },
  mounted () {},
  destoryed () {}
}
</script>
<style lang="scss" scoped>
.el_menu {
  width: 100% height 50px;
}

.el_main {
  width: 100%;
  height: auto;
  margin-bottom: 100px;
}

.player {
  position: fixed;
  bottom: 0;
  width: 95%;
  height: auto;
  background: white;
}
</style>
