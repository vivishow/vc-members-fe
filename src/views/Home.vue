<template>
  <div class="home">
    <van-cell-group title="会员列表">
      <van-skeleton :loading="loading" :row="2" v-for="member in members" :key="member._id">
        <van-cell
          :title="member.nickName"
          :value="member.noteName"
          is-link
          :to="`/member/${member.id}`"
        ></van-cell>
      </van-skeleton>
    </van-cell-group>
  </div>
</template>

<script>
import { Cell, CellGroup, Skeleton } from "vant";

export default {
  name: "home",
  data() {
    return {
      loading: false
    };
  },
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Skeleton.name]: Skeleton
  },
  methods: {
    async refresh() {
      this.loading = true;
      const {
        data: { code, message: members }
      } = await this.$http.get("/api/members");
      const membersList =
        code === 1
          ? members.map(m => {
              return { id: m._id, nickName: m.nickName, noteName: m.noteName };
            })
          : [];
      this.$store.commit("setMembers", membersList);
      this.loading = false;
    }
  },
  computed: {
    members() {
      return this.$store.state.members;
    }
  },
  async created() {
    if (this.members.length === 0) {
      this.refresh();
    }
  }
};
</script>

<style lang="scss" scoped>
.van-cell-group {
  margin: 15px 0;
  .van-cell__title {
    text-align: left;
  }
}
</style>

