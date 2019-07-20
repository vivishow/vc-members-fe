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

    // 更新用户地址信息
    updateContact(state, info) {
      let targetMember = state.members.find(m => m._id == info.id);
      if (info.type == "add") {
        targetMember.contact.push(info.contact);
      } else if (info.type == "del") {
        targetMember.contact.splice(info.index, 1);
      }
    }
  },

  actions: {
    async getMembers(context) {
      const {
        data: { code, message: members }
      } = await axios.get("/api/members");
      await context.commit("setMembers", code === 1 ? members : []);
    },

    async addMember(context, info) {
      const { data } = await axios.post("/api/members", info);
      if (data.code === 1) {
        await context.dispatch("getMembers");
      }
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
        context.dispatch("getMembers");
      }
      return data;
    },

    async updateAddress(context, info) {
      let res = {};
      if (info.type == "add") {
        res = await axios.post(`/api/members/${info.id}/contact`, info.contact);
      } else if (info.type == "del") {
        let url = `/api/members/${info.id}/contact`;
        res = await axios.delete(url, {
          data: info.contact
        });
      }
      if (res.data.code === 1) {
        context.commit("updateContact", info);
      }
      return res.data;
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
    case "updateContact":
      localStorage.setItem("members", JSON.stringify(state.members));
      break;
  }
});

export default store;
