import Vue from "vue";
import Vuex from "vuex";
import menubar from './modules/menuBar'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        menubar
    }

})