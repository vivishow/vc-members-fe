<template>
  <div class="home">
    <van-cell-group title="会员列表">
      <van-skeleton v-for="index in 10" :key="index" :loading="loading" :row="2">
        <van-cell
          v-for="member in members"
          :key="member._id"
          :title="member.nickName"
          :value="member.noteName"
          is-link
          :to="`/member/${member._id}`"
        />
      </van-skeleton>
    </van-cell-group>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "home",
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState(["members"])
  },
  methods: {
    async refresh() {
      this.loading = true;
      await this.$store.dispatch("getMembers");
      this.loading = false;
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

