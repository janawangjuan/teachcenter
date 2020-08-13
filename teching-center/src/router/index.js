import Vue from 'vue'
import Router from 'vue-router'
import exchangeManage from '@/views/exchange/exchangeManage'
import classManage from '@/views/classManage/classManage'
import answerQuestion from '@/views/exchange/answerQuestion'
import aqReportGather from '@/views/exchange/aqReportGather'
import layout from '@/views/layout'
import classCenter from '@/views/classCenter/classCenter'
import examStatistics from '@/views/classCenter/examStatistics'
import testpaperAnalysis from '@/views/classCenter/testpaperAnalysis'
import faceTestpaperAnalysis from '@/views/classCenter/faceTestpaperAnalysis'
import faceCompletion from '@/views/classCenter/faceCompletion'
import dataStatisticsAq from '@/views/classCenter/dataStatisticsAq'
import youboStudyAction from '@/views/dataStatistics/youboStudyAction'
import dataStatistics from '@/views/dataStatistics/dataStatistics'
import teacherAQStatistics from '@/views/dataStatistics/teacherAQStatistics'
import dataStatisticsExam from '@/views/classCenter/dataStatisticsExam'
import classCenterIndex from '@/views/classCenter/classCenterIndex'
import youboCenter from '@/views/youboCenter/youboCenter'
import youboCenterIndex from '@/views/youboCenter/youboCenterIndex'
import studentReport from '@/views/youboCenter/studentReport'
import overallReport from '@/views/youboCenter/overallReport'
import practiceStatistics from '@/views/youboCenter/practiceStatistics'
import youboTestpaperAnalysis from '@/views/youboCenter/youboTestpaperAnalysis'
import youboCompletion from '@/views/youboCenter/youboCompletion'
import taskStatistics from '@/views/youboCenter/taskStatistics'
import liveStatistics from '@/views/youboCenter/liveStatistics'
import aqStatistics from '@/views/youboCenter/aqStatistics'
import login from '@/views/login'
import api from '@/global/api'
import Request from '@/request'

import store from '../store/index.js'

Vue.use(Router)

console.log(store.state)

const router =  new Router({
  routes: [
    {
      path: '/',
      redirect:'/tmIndex'
    },{
      path:'/tmIndex',
      name:'tmIndex',
      component:layout,
      children:[{
        path:'systemManage',
        name:'systemManage',
        component:() => import('../views/systemManage'),
        redirect:'/tmIndex/systemManage/roleManage',
        children:[{
          path:'roleManage',
          name:'roleManage',
          component: () => import('../views/systemManage/roleManage/roleManageLayout'),
          redirect:'/tmIndex/systemManage/roleManage/index',
          children:[{
            path:'index',
            name:'index',
            component: () => import('../views/systemManage/roleManage/index'),
          },{
            path:'addRole',
            name:'addRole',
            component: () => import('../views/systemManage/roleManage/addRole'),
          }]
        },{
          path:'userManage',
          name:'userManage',
          component: () => import('../views/systemManage/userManage/userManageLayout'),
          redirect:'/tmIndex/systemManage/userManage/index',
          children:[{
            path:'index',
            name:'index',
            component: () => import('../views/systemManage/userManage/index'),
          },{
            path:'addUser',
            name:'addUser',
            component: () => import('../views/systemManage/userManage/addUser'),
          },{
            path:'detail',
            name:'detail',
            component: () => import('../views/systemManage/userManage/detail'),
          }]
        }]
      },{
        path:'exchangeManage',
        name:'exchangeManage',
        component:exchangeManage,
        children:[{
          path:'answerQuestion',
          name:'answerQuestion',
          component:answerQuestion
        }]
      },{
        path:'classManage/:type',
        name:'classManage',
        component:classManage
      },{
        path:'dataStatistics',
        name:'dataStatistics',
        component:dataStatistics,
        children:[{
          path:'youboStudyAction',
          name:'youboStudyAction',
          component:youboStudyAction
        },{
          path:'teacherAQStatistics',
          name:'teacherAQStatistics',
          component:teacherAQStatistics
        },{
          path:'onlineClassLearnSituation',
          name:'onlineClassLearnSituation',
          component:() => import('@/views/dataStatistics/onlineClassLearnSituation')
        }]
      },{
        path:'teachService',
        name:'teachService',
        component: () => import('../views/teachService/teachServiceIndex'),
        children:[{
          path:'courseQRCode',
          name:'courseQRCode',
          component: () => import('../views/teachService/courseQRCode')
        }]
      }]
    },{
      path: '/login',
      name: 'login',
      component: login
    },{
      path:'/classCenter',
      component:classCenter,
      redirect:'/classCenter/classCenterIndex',
      children:[{
        path:'classCenterIndex/:classId',
        name:'classCenterIndex',
        component:classCenterIndex
      },{
        path:'dataStatisticsAq/:classId',
        name:'dataStatisticsAq',
        component:dataStatisticsAq
      },{
        path:'dataStatisticsExam/:classId',
        name:'dataStatisticsExam',
        component:dataStatisticsExam
      }]
    },{
      path:'/youboCenter',
      component:youboCenter,
      redirect:'/youboCenter/youboCenterIndex',
      children:[{
        path:'youboCenterIndex/:classId',
        name:'youboCenterIndex',
        component:youboCenterIndex
      },{
        path:'overallReport/:classId',
        name:'overallReport',
        component:overallReport
      },{
        path:'studentReport/:classId',
        name:'studentReport',
        component:studentReport
      },{
        path:'practiceStatistics/:classId',
        name:'practiceStatistics',
        component:practiceStatistics,
        meta:{
          keepAlive:true
        }
      },{
        path:'practiceStatistics/:classId/youboTestpaperAnalysis/:examId',
        name:'youboTestpaperAnalysis',
        component:youboTestpaperAnalysis,
        meta:{
          hideHeader:true
        }
      },{
        path:'practiceStatistics/:classId/youboCompletion/:examId',
        name:'youboCompletion',
        component:youboCompletion,
        meta:{
          hideHeader:true
        }
      },{
        path:'taskStatistics/:classId',
        name:'taskStatistics',
        component:taskStatistics
      },{
        path:'liveStatistics/:classId',
        name:'liveStatistics',
        component:liveStatistics
      },{
        path:'aqStatistics/:classId',
        name:'aqStatistics',
        component:aqStatistics
      }]
    },{
      path: '/examStatistics/:classId/:courseArrangeId/:examenId/:className',
      name: 'examStatistics',
      component: examStatistics
    },{
      path: '/testpaperAnalysis/:classId/:examenId/:className',
      name: 'testpaperAnalysis',
      component: testpaperAnalysis
    },{
      path: '/faceTestpaperAnalysis/:classId/:examenId/:className',
      name: 'faceTestpaperAnalysis',
      component: faceTestpaperAnalysis
    },{
      path: '/faceCompletion/:classId/:examenId/:className',
      name: 'faceCompletion',
      component: faceCompletion
    },{
      path: '/aqReportGather',
      name: 'aqReportGather',
      component: aqReportGather
    },{
      path: '*',
      redirect: '/',
      meta: {}
    }
  ]
})

router.beforeResolve((to, from, next) => {
  let token = api.getUrlKey('token')
  console.log(token)
  if(token){
    let techLoginInfo = null
    Request.ajax('member',{
      token:token
    }).then(res=>{
      if(res && res.state == 'success'){
        techLoginInfo = res.data
        techLoginInfo.token = token
        Vue.cookie.set('techLoginInfo',techLoginInfo)
        window.location.href='/'
      }
    })
  }else{
    if (to.name == 'login'||Vue.cookie.get('techLoginInfo')) {
      next()
    } else {
      next({ path: '/login'})
      /*if(Vue.cookie.get('techLoginInfo')){
        // let fromTask = from.matched.some(record => record.meta.task)
        // let toTask = to.matched.some(record => record.meta.task)
        // if(!fromTask && toTask){
        //   next(to.path+'?returnLink='+fromTask.path)
        // }else if(fromTask && toTask){

        //   next()
        // }else{
        //   next()
        // }
        next()
      }else{
        // next('/login?link='+from.fullPath)
        next({ path: '/#/login', query: { link: from.fullPath }})
        next()
      }*/
    }
  }
})

export default router
