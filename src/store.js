import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    members: JSON.parse(localStorage.getItem("members")) || []
  },

  getter: {},

  mutations: {
    setMembers(state, members) {
      // 设置全部会员信息
      state.members = members;
    },

    updateMember(
      state,
      {
        id,
        update: { nickName, noteName }
      }
    ) {
      // 更新会员的昵称或者备注
      let targetMember = state.members.find(m => m._id == id);
      if (nickName) targetMember.nickName = nickName;
      if (noteName) targetMember.noteName = noteName;
    },

    addMemberRecord(state, { id, update }) {
      // 添加会员积分记录
      let targetMember = state.members.find(m => m._id == id);
      targetMember.pointsRecord.push(update);
      targetMember.points += Number(update.value);
    }
  },

  actions: {
    async getMembers(context) {
      const {
        data: { code, message: members }
      } = await axios.get("/api/members");
      context.commit("setMembers", code === 1 ? members : []);
    },

    async addMember(context, info) {
      const { data } = await axios.post("/api/members", info);
      return data;
    },

    async delMember(context, id) {
      const { data } = await axios.delete(`/api/members/${id}`);
      if (data.code === 1) {
        context.dispatch("getMembers");
      }
      return data;
    },

    async updateInfo(context, info) {
      const { data } = await axios.post(`/api/members/${info.id}`, info.update);
      return data;
    },

    async addRecord(context, info) {
      const { data } = await axios.post(
        `/api/members/${info.id}/points`,
        info.update
      );
      if (data.code === 1) {
        context.commit("addMemberRecord", info);
      }
      return data;
    }
  }
});

store.subscribe((mutation, state) => {
  switch (mutation.type) {
    case "setMembers":
      localStorage.setItem("members", JSON.stringify(state.members));
      break;
    case "updateMember":
      localStorage.setItem("members", JSON.stringify(state.members));
      break;
    case "addMemberRecord":
      localStorage.setItem("members", JSON.stringify(state.members));
      break;
  }
});

export default store;
