<template>
  <div class="home">
    <van-cell-group title="会员列表">
      <van-cell
        v-for="member in members"
        :key="member._id"
        :title="member.nickName"
        :value="member.points"
      ></van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { Cell, CellGroup } from "vant";

export default {
  name: "home",
  data() {
    return {
      members: []
    };
  },
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  async created() {
    const {
      data: { status, data: members }
    } = await this.$http.get("/api/members");
    console.log(this.members);
    if (status === 1) this.members = members;
    console.log(this.members);
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

