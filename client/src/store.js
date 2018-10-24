import Vue from 'vue'
import Vuex from 'vuex'
import config from '../src/assets/config'
import { get } from 'https';

const {host}  = config
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser(state, payload){
      state.user = payload
    }
  },
  actions: {
    getUser({ commit, dispatch }, payload){      
      let token = localStorage.getItem('tokenHO')
      if(token){
        axios({
          method: 'GET',
          url: `${host}/users`,
          headers : {
            token: token
          }
        })
        .then((result) => {
            // console.log(result.data);
            commit('setUser', result.data)
        }).catch((err) => {
          localStorage.removeItem('tokenHO')
        });
      } else {
        commit('setUser', null)
      }
    }
  }
})
