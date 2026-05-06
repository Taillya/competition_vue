import Vue from 'vue'
import VueRouter from 'vue-router'
import StudentIndex from "../views/StudentIndex";
import StudentCompetition from "../views/StudentCompetition";
import StudentAiInnovate from "../views/StudentAiInnovate";
import StudentScore from "../views/StudentScore";
import StudentNotice from "../views/StudentNotice";
import Login from "../views/Login";
import Chat from "../views/Chat";
import AdminIndex from "../views/AdminIndex";
import CertificateManage from "../views/CertificateManage";
import CompetitionManage from "../views/CompetitionManage";
import NoticeManage from "../views/NoticeManage";
import TrackManage from "../views/TrackManage";
import RegistrationsManage from "../views/RegistrationsManage";
import RegistrationsStatistics from "../views/RegistrationsStatistics";
import ScoreManage from "../views/ScoreManage";
import StudentManage from "../views/StudentManage";
import TagManage from "../views/TagManage";
import Register from "../views/Register";
import StudentRegistrations from "../views/StudentRegistrations";

Vue.use(VueRouter)

const routes = [
  {
    path: '/adminIndex',
    name: '管理员首页',
    component: AdminIndex,
    redirect: '/certificateManage',
    children: [
      {
        path: '/certificateManage',
        name: '证书管理',
        component: CertificateManage
      },
      {
        path: '/competitionManage',
        name: '竞赛管理',
        component: CompetitionManage
      },
      {
        path: '/noticeManage',
        name: '公告管理',
        component: NoticeManage
      },
      {
        path: '/trackManage',
        name: '赛道管理',
        component: TrackManage
      },
      {
        path: '/registrationsManage',
        name: '报名管理',
        component: RegistrationsManage
      },
      {
        path: '/registrationsStatistics',
        name: '报名统计',
        component: RegistrationsStatistics
      },
      {
        path: '/scoreManage',
        name: '成绩管理',
        component: ScoreManage
      },
      {
        path: '/studentManage',
        name: '用户管理',
        component: StudentManage
      },
      {
        path: '/tagManage',
        name: '标签管理',
        component: TagManage
      }
    ]
  },
  {
    path: '/chat',
    name: 'AI对话',
    component: Chat
  },
  {
    path: '/login',
    name: '登录',
    component: Login
  },
  {
    path: '/register',
    name: '注册',
    component: Register
  },
  {
    path: '/studentNotice',
    name: '公告查询',
    component: StudentNotice
  },
  {
    path: '/studentScore',
    name: '成绩查询',
    component: StudentScore
  },
  {
    path: '/studentRegistrations',
    name: '我的报名',
    component: StudentRegistrations
  },
  {
    path: '/studentAiInnovate',
    name: 'AI竞赛',
    component: StudentAiInnovate
  },
  {
    path: '/studentCompetition',
    name: '竞赛查询',
    component: StudentCompetition
  },
  {
    path: '/studentIndex',
    name: '学生首页',
    component: StudentIndex
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
