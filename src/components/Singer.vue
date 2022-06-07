<template>
  <div class="out">
    <div class="support">
      <div
        v-for="(item, index) in categories"
        :key="index"
        class="support_item"
      >
        <div class="name">{{ item.name }}</div>
        <div
          v-for="(item1, index1) in categorieslist"
          :key="index1"
          class="sub_item"
          @click="typeClick(item.area, item1.type, item.name, item1.name)"
        >
          <div :class="item.name + item1.name == title ? 'oral_red' : 'oral'" />
          <div :class="item.name + item1.name == title ? 'name1_red' : 'name1'">
            {{ item.name + item1.name }}
          </div>
        </div>

        <div class="line"></div>
      </div>
    </div>

    <div class="right">
      <div class="quanbu">{{ title }}</div>
      <div class="redline" />

      <div class="num">
        <div
          class="num_box"
          v-for="(item, index) in numList"
          :key="index"
          @click="numClick(item)"
        >
          <div :class="item == queryInfo.initial ? 'num_item_red' : 'num_item'">
            {{ item }}
          </div>
        </div>
      </div>
      <!--列表 -->
      <div class="singer">
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
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      numList: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ],
      categories: [
        { name: '华语', area: '7' },
        { name: '欧美', area: '96' },
        { name: '日本', area: '8' },
        { name: '韩国', area: '16' },
        { name: '其他', area: '0' }
      ],
      categorieslist: [
        { name: '男歌手', type: '1' },
        { name: '女歌手', type: '2' },
        { name: '组合/乐队', type: '3' }
      ],
      title: '华语男歌手',
      singerList: [],
      queryInfo: {
        type: 1,
        area: 7,
        initial: 'A'
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 获取歌手列表
    async getSingerList () {
      const { data: res } = await this.$http.get('/artist/list', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.code === 200) {
        this.singerList = res.artists
      }
    },
    // 选择区域性别歌手
    typeClick (area, type, name, name1) {
      this.queryInfo.type = type
      this.queryInfo.area = area
      this.title = name + name1
      this.getSingerList()
    },
    // 首字母分类
    numClick (num) {
      this.queryInfo.initial = num
      this.getSingerList()
    },
    // 歌手详情
    singerClick (id) {
      let routeData = this.$router.resolve({
        path: '/SingerDetail/',
        query: { singerid: id }
      })
      window.open(routeData.href, '_blank')
    }
  },
  created () {
    this.getSingerList()
  },
  mounted () {},
  destoryed () {}
}
</script>
<style lang="scss" scoped>
.out {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  height: auto;

  .support {
    padding: 20px;
    background: rgb(250, 247, 247);
    width: auto;
    height: auto;
    .support_item {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      .name {
        font-size: 16px;
        color: black;
        font-weight: bold;
      }
      .sub_item {
        cursor: pointer;
        display: flex;
        margin-top: 15px;

        .oral {
          align-self: center;
          width: 4px;
          height: 4px;
          background: gray;
          border-radius: 50px;
          margin-right: 10px;
        }
        .oral_red {
          align-self: center;
          width: 4px;
          height: 4px;
          background: rgb(206, 13, 13);
          border-radius: 50px;
          margin-right: 10px;
        }

        .name1_red {
          font-size: 14px;
          color: rgb(206, 13, 13);
        }

        .name1 {
          font-size: 14px;
          color: gray;
        }

        .name1:hover {
          text-decoration: underline;
        }
      }

      .line {
        margin-top: 15px;
        width: auto;
        height: 1px;
        background: rgb(219, 212, 212);
      }
    }
  }

  .right {
    width: 100%;
    flex-direction: column;
    margin-left: 50px;
    display: flex;

    .quanbu {
      font-size: 20px;
      font-weight: bold;
      color: black;
    }
    .redline {
      background: rgb(206, 13, 13);
      width: 100%;
      height: 5px;
      margin-top: 20px;
    }

    .num {
      cursor: pointer;
      margin-top: 20px;
      display: flex;
      width: auto;
      height: auto;
      flex-wrap: wrap;
      justify-content: flex-start;

      .num_item {
        margin-bottom: 15px;
        border-radius: 3px;
        text-align: center;
        width: 30px;
        height: 30px;
        color: black;
        font-size: 20px;
        margin-right: 15px;
      }

      .num_item_red {
        margin-bottom: 15px;
        border-radius: 3px;
        text-align: center;
        width: 30px;
        height: 30px;
        color: white;
        font-size: 20px;
        margin-right: 15px;
        background: rgb(206, 13, 13);
      }

      .num_item:hover {
        text-decoration: underline;
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
        margin-right: 30px;
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
  }
}
</style>
