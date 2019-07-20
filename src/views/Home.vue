<template>
  <div class="home">
    <!-- 会员列表 -->
    <van-cell-group title="会员列表">
      <van-skeleton v-for="member in members" :key="member._id" :loading="loading" :row="2">
        <van-cell
          :title="member.nickName"
          :value="member.noteName"
          is-link
          :to="`/member/${member._id}`"
        />
      </van-skeleton>
    </van-cell-group>

    <!-- 点击右上角更多按钮显示上拉菜单 -->
    <van-action-sheet
      v-model="showMore"
      :actions="actions"
      @select="onSelect"
      close-on-click-action
    />

    <!-- 添加会员弹出层 -->
    <van-popup v-model="showAddMember" :style="{width: '80%'}" round>
      <van-cell-group title="添加会员">
        <van-field clearable v-model="nickName" label="昵称" placeholder="请输入昵称" />
        <van-field clearable v-model="noteName" label="备注" placeholder="请输入备注" />
        <van-button :loading="addMemberLoading" type="primary" @click="addMember">保存</van-button>
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "home",
  data() {
    return {
      loading: false,
      showMore: false,
      actions: [
        {
          name: "添加会员"
        }
      ],
      showAddMember: false,
      addMemberLoading: false,
      nickName: "",
      noteName: ""
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
    },

    more() {
      this.showMore = true;
    },

    onSelect(item) {
      switch (item.name) {
        case "添加会员":
          this.showAddMember = true;
          break;
      }
    },

    async addMember() {
      if (!this.nickName) {
        this.$toast.fail("请填写昵称");
      } else {
        this.addMemberLoading = true;

        const { code, message } = await this.$store.dispatch("addMember", {
          nickName: this.nickName,
          noteName: this.noteName
        });

        this.showAddMember = false;
        this.addMemberLoading = false;
        this.nickName = "";
        this.noteName = "";
        if (code === 1) {
          await this.$toast.success(message);
        } else {
          this.$toast.fail(message);
        }
      }
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

