<template>
  <div>
    <van-tabs sticky animated swipeable>
      <van-tab title="基本信息">
        <van-cell-group>
          <van-skeleton :loading="loading" :row="2">
            <van-cell :title="nickName" value="昵称" />
          </van-skeleton>
          <van-skeleton v-if="noteName" :loading="loading" :row="1">
            <van-cell :title="noteName" value="备注" />
          </van-skeleton>
          <van-skeleton :loading="loading" :row="2">
            <van-cell :title="points" value="积分" />
          </van-skeleton>
        </van-cell-group>
        <van-skeleton :loading="loading" :row="3">
          <van-cell-group title="联系方式">
            <van-address-list :list="contactList" @add="onAdd" @edit="onEdit" />
          </van-cell-group>
        </van-skeleton>
      </van-tab>
      <van-tab title="积分记录"></van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Skeleton, Tab, Tabs, Cell, CellGroup, AddressList } from "vant";

export default {
  data() {
    return {
      loading: false,
      nickName: "",
      noteName: "",
      points: 0,
      contact: [],
      pointsRecord: []
    };
  },
  components: {
    [Skeleton.name]: Skeleton,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [AddressList.name]: AddressList
  },
  methods: {
    async refresh() {
      this.loading = true;
      const {
        data: { code, message: info }
      } = await this.$http.get(`/api/members/${this.id}`);
      if (code === 1) {
        this.nickName = info.nickName;
        this.noteName = info.noteName;
        this.points = info.points;
        this.contact = info.contact;
        this.pointsRecord = info.pointsRecord;
      }
      this.loading = false;
    },

    onAdd() {},
    onEdit() {}
  },
  computed: {
    id() {
      return this.$route.params.id;
    },

    contactList() {
      return this.contact.map((c, i) => {
        return { id: i, name: c.name, tel: c.phone, address: c.addr };
      });
    }
  },
  async created() {
    this.refresh();
  }
};
</script>

<style lang="scss" scoped>
</style>