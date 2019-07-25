<template>
  <div class="member-info" v-if="member">
    <!-- 会员信息 -->
    <van-tabs v-model="activeTab" sticky animated swipeable>
      <van-tab title="基本信息">
        <van-cell-group>
          <van-cell :title="member.nickName" value="昵称" />
          <van-cell v-if="member.noteName" :title="member.noteName" value="备注" />
          <van-cell :title="member.points.toString()" value="积分" />
        </van-cell-group>
        <van-cell-group title="联系方式">
          <van-address-list :list="member.contact" @add="onAddContact" @edit="onEditContact" />
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

      <van-tab title="修改积分">
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
      </van-tab>

      <van-tab title="修改信息">
        <van-field clearable v-model="nickName" label="昵称" placeholder="请输入新昵称" />
        <van-field clearable v-model="noteName" label="备注" placeholder="请输入新备注" />
        <van-button :loading="updateInfoLoading" type="primary" @click="updateInfo">保存</van-button>
      </van-tab>

      <van-tab title="添加地址">
        <van-address-edit :area-list="areaList" @save="saveAddress" />
      </van-tab>
    </van-tabs>

    <!-- 点击右上角更多按钮显示上拉菜单 -->
    <van-action-sheet
      v-model="showMore"
      :actions="actions"
      @select="onSelect"
      close-on-click-action
    />
  </div>
  <div v-else>
    <van-loading size="24px" vertical type="spinner" color="#1989fa">加载中...</van-loading>
  </div>
</template>

<script>
import areaList from "@/area.js";

export default {
  name: "member-info",
  data() {
    return {
      id: this.$route.params._id,
      loading: false,
      activeTab: 0,
      showMore: false,
      actions: [
        {
          name: "删除会员"
        }
      ],
      updateInfoLoading: false,
      nickName: "",
      noteName: "",
      addRecordLoading: false,
      reason: "",
      points: "",
      delAddressItem: {},
      delAddressIndex: 0,
      areaList
    };
  },
  computed: {
    member() {
      return this.$store.state.members.find(m => m._id == this.id);
    },

    pointsRecordlist() {
      return this.member.pointsRecord;
    },

    records() {
      let list = this.pointsRecordlist;
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
      this.actions = [{ name: "删除会员" }];
    },

    onSelect(item) {
      switch (item.name) {
        case "删除会员":
          this.$dialog
            .confirm({
              message: "确定要删除吗？"
            })
            .then(() => {
              this.$store.dispatch("delMember", this.id);
              this.$router.push("/");
            })
            .catch(() => {});
          break;
        case "删除地址":
          this.delAddress(this.delAddressItem, this.delAddressIndex);
          break;
        case "复制地址":
          this.$copyText(
            `${this.delAddressItem.address}，${this.delAddressItem.name}，${this.delAddressItem.tel}`
          ).then(
            e => {
              this.$toast.success("复制成功");
              console.log(e);
            },
            e => {
              this.$toast.fail("复制失败");
              console.log(e);
            }
          );
      }
    },

    // 修改基本信息 昵称或者备注
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

    // 添加积分记录
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
        if (code === 1) {
          this.$toast.success(message);
        } else {
          this.$toast.fail(message);
        }
      }
    },

    onAddContact() {
      this.activeTab = 4;
    },
    // 选择地址更多选项
    async onEditContact(item, index) {
      this.showMore = true;
      this.actions = [{ name: "复制地址" }, { name: "删除地址" }];
      this.delAddressItem = item;
      this.delAddressIndex = index;
    },
    // 添加地址
    async saveAddress(content) {
      this.$toast.loading({
        duration: 0,
        mask: true,
        forbidClick: true,
        message: "正在处理，请稍后……"
      });
      const { province, city, county, addressDetail, name, tel } = content;
      const contact = {
        name: name,
        tel: tel,
        address: `${province}${city}${county}${addressDetail}`
      };
      const { code, message } = await this.$store.dispatch("updateAddress", {
        id: this.id,
        contact: contact,
        type: "add"
      });
      if (code === 1) {
        this.$toast.success(message);
        this.activeTab = 0;
      } else {
        this.$toast.fail(message);
      }
    },
    // 删除地址
    async delAddress(item, index) {
      this.$toast.loading({
        duration: 0,
        mask: true,
        forbidClick: true,
        message: "正在处理，请稍后……"
      });
      const contact = { ...item };
      const { code, message } = await this.$store.dispatch("updateAddress", {
        id: this.id,
        index: index,
        contact: contact,
        type: "del"
      });
      if (code === 1) {
        this.$toast.success(message);
      } else {
        this.$toast.fail(message);
      }
    }
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