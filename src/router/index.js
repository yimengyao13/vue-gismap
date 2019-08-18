import Vue from 'vue'
import Router from 'vue-router'
import HistoryMap from '@/components/HistoryMap'
import SpecialMap from '@/components/SpecialMap'
import HelperDocument from '@/components/HelperDocument'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'historymap',
      component: HistoryMap
    },{
      path: '/specialmap',
      name: 'specialmap',
      component: SpecialMap
    },{
    	path:'/helperdocument',
    	name:'helperdocument',
    	component:HelperDocument
    }
  ]
})
