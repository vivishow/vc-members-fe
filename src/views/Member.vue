<template>
  <div class="member-info" v-if="member">
    <!-- 会员信息 -->
    <van-tabs sticky animated swipeable>
      <van-tab title="基本信息">
        <van-cell-group>
          <van-cell :title="member.nickName" value="昵称" />
          <van-cell v-if="member.noteName" :title="member.noteName" value="备注" />
          <van-cell :title="member.points.toString()" value="积分" />
        </van-cell-group>
        <van-cell-group title="联系方式">
          <van-address-list :list="member.contact" @add="onAdd" @edit="onEdit" />
        </van-cell-group>
      </van-tab>
      <van-tab title="积分记录">
        <van-cell-group>
          <van-cell
            v-for="(record,index) in records"
            :key="index"
            :title="record.reason"
            :value="record.value"
            :label="record.createtime"
          />
        </van-cell-group>
      </van-tab>
    </van-tabs>

    <!-- 点击右上角更多按钮显示上拉菜单 -->
    <van-action-sheet
      v-model="showMore"
      :actions="actions"
      @select="onSelect"
      close-on-click-action
    />

    <!-- 修改信息 -->
    <van-popup v-model="showUpdateInfo" round :style="{width: '70%'}">
      <van-cell-group title="修改信息">
        <van-field clearable v-model="nickName" label="昵称" placeholder="请输入新昵称" />
        <van-field clearable v-model="noteName" label="备注" placeholder="请输入新备注" />
        <van-button :loading="updateInfoLoading" type="primary" @click="updateInfo">保存</van-button>
      </van-cell-group>
    </van-popup>

    <!-- 添加积分 -->
    <van-popup v-model="showAddRecord" round :style="{width: '70%'}">
      <van-cell-group title="修改积分">
        <van-field clearable v-model="reason" label="原因" placeholder="请输入修改积分的原因" />
        <van-field
          clearable
          v-model="points"
          right-icon="question-o"
          label="分值"
          placeholder="请输入修改积分的数值"
          @click-right-icon="$toast('请输入整数！')"
        />
        <van-button :loading="addRecordLoading" type="primary" @click="addRecord">保存</van-button>
      </van-cell-group>
    </van-popup>
  </div>
  <div v-else>请稍等</div>
</template>

<script>
export default {
  name: "member-info",
  data() {
    return {
      id: this.$route.params._id,
      loading: false,
      showMore: false,
      showUpdateInfo: false,
      updateInfoLoading: false,
      showAddRecord: false,
      addRecordLoading: false,
      actions: [
        {
          name: "修改信息",
          subname: "昵称，备注"
        },
        {
          name: "添加积分"
        }
      ],
      nickName: "",
      noteName: "",
      reason: "",
      points: ""
    };
  },
  computed: {
    member() {
      return this.$store.state.members.find(m => m._id == this.id);
    },

    records() {
      let list = this.member.pointsRecord;
      return list.reverse();
    }
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
        case "修改信息":
          this.showUpdateInfo = true;
          break;

        case "添加积分":
          this.showAddRecord = true;
          break;
      }
    },

    async updateInfo() {
      if (!this.nickName && !this.noteName) {
        this.$toast.fail("请至少填写一项");
      } else {
        this.updateInfoLoading = true;
        let info = {
          id: this.id,
          update: {
            nickName: this.nickName,
            noteName: this.noteName
          }
        };

        const { code, message } = await this.$store.dispatch(
          "updateInfo",
          info
        );
        this.showUpdateInfo = false;
        this.updateInfoLoading = false;
        this.nickName = "";
        this.noteName = "";
        code === 1 ? this.$toast.success(message) : this.$toast.fail(message);
      }
    },
    async addRecord() {
      if (!this.reason || !this.points) {
        this.$toast.fail("请填写完整");
      } else if (/[^0-9-]/.test(this.points)) {
        this.$toast.fail("请填写整数数字！");
      } else {
        this.addRecordLoading = true;
        let info = {
          id: this.id,
          update: {
            reason: this.reason,
            value: this.points
          }
        };

        const { code, message } = await this.$store.dispatch("addRecord", info);
        this.showAddRecord = false;
        this.addRecordLoading = false;
        this.reason = "";
        this.points = "";
        code === 1 ? this.$toast.success(message) : this.$toast.fail(message);
      }
    },

    onAdd() {},
    onEdit() {}
  },

  async created() {
    if (!this.member) {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
.van-cell__title {
  text-align: left;
}

.van-field,
.van-button {
  margin: 5px 0;
}
</style>