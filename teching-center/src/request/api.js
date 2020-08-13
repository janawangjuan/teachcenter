const zbApiHost = 'https://zbapi.zbgedu.com'

export default {
	// 接口域名
	"host": {
		"action": "https://action.zbgedu.com",
		"actionDemo": "https://actionDemo.zbgedu.com",
		"actionDev": "https://actiondev.zbgedu.com",
		"actionMock": "http://localhost:3080",

		"api": "https://api.zbgedu.com",
		"apiDemo": "https://apiDemo.zbgedu.com",
		"apiDev": "https://apiDev.zbgedu.com",

    "apiNew":'https://zbapi.zbgedu.com',
    "apiNewDemo":'https://apiDemo.zbgedu.com',

		"static": "https://exstatic.zbgedu.com",
		"img": "https://exstatic.zbgedu.com",
		"QRCode": "https://exstatic.zbgedu.com",
		"demoQRCode": "http://192.168.10.201:9994",
		"imgAddress": "https://exstatic.zbgedu.com",
		"infoAddress": "https://www.zbgedu.com/",
		"IPLocation": "https://www.zbgedu.com/api/v2/"
	},
	// node接口前缀
	'nodePrefix': '/api/userAction/scene/mobileIndex',
	// 没有找到接口路径，默认跳转的接口
	'notFindUrl': '/help',
	// java，php，node
	'examples': {
		'name': '接口示例', // api名称
		'apiType': 'node', // api类型-java，php，node
		'isPrefix': true, // 是否使用接口前缀(/api/userAction/scene/mobileIndex)-true：使用，false：不使用
		'path': '/help', // api地址
		'type': 'GET', // api类型- GET,POST
		'isMock': false, // 是否使用假数据- true：使用，false：不使用
		'mock': '/mock/node-help.json', // 假数据地址-本地json文件
		'isQuery': false, // 是否使用默认参数
		'queryData': { // api默认请求数据
			'help': 'help'
		}
	},
	'node-login': {
		'name': '登录',
		'apiType': 'node',
		'isPrefix': true,
		'path': '/api/userAction/scene/mobileIndex/login',
		'type': 'POST',
		'isMock': false,
		'mock': '/mock/node-login.json',
		'isQuery': false,
		'queryData': {
			'type': "pcWeb", // 登录设备类型
			'username': "zpk", // 登录用户名
			'password': "123456" // 登录密码
		}
	},

	'actionTaskProgress': {
		'name': '保存任务进度',
		'apiType': 'node',
		'isPrefix': false,
		'path': '/api/userAction/course/taskProgress/v1.0/',
		'type': 'GET',
		'isMock': false,
		'mock': '/mock/taskProgress.json',
		'isQuery': false,
		'queryData': {
			'token': '2e9e8aa0-6048-4e0b-ac88-b46b3e0261c6',
			'memberId': '8a22ecb553a0b1320153a7251a1e149f',
			'courseId': '8a22ecb55678b61b0156b1b9e20702b0,ff8080814f0b1b74014f158ab55a0e33'
		}
	},

	'bbslist': {
		'isPrefix': true,
		'path': '/api/studytools/bbslist/v1.0',
		'type': 'GET',
		'isMock': false,
		'mock': '/mock/bbslist.json',
		'isQuery': false,
	},
	'bbsdetail': {
		'path': '/api/studytools/bbsdetail/v1.0',
		'mock': '/mock/bbsdetail.json',
	},
	'bbsreply': {
		'path': '/api/studytools/bbsreply/v1.0',
		'mock': '/mock/bbsreply.json',
		'type': 'POST'
	},
	'bbs_del': {
		'path': '/api/studytools/bbs_del/v1.0',
    'type': 'POST',
		'mock': '/mock/bbs_del.json',
	},

	'token': {
		'path': '/api/zbids/app/gettoken/v1.0/',
		'mock': '/mock/token.json',
    'data': {
			"appType": "pc",
			"appId": "pcWeb",
			"appKey": "e877000be408a6cb0428e0f584456e03"
		}
	},
	'login': {
		'path': '/api/zbids/member/login/v1.0',
		'mock': '/mock/login.json',
		'type': 'POST'
	},
	'logout': {
		'path': '/api/zbids/member/loginout/v1.0',
		'mock': '/mock/logout.json',
	},
	'member': {   //根据member查询查详细信息
		'path': '/api/zbids/member/getmemberinfo',
		'mock': '/mock/getmemberinfo.json',
	},
	'updateStatus': {
		'path': '/api/study/message/updateStatus/v1.0',
		'mock': '/mock/updateStatus.json',
	},
	'courseDetail': {
		'name': '查询课程下的树形',
		'path': '/api/teachsource/course/courseDetail/data',
		'urlDemo': '/api/teachsource/course/courseDetail/data',
	},




	'gettoken': {
		'name': '获取token', // api名称
		'isPrefix': true, // 是否使用接口前缀(/api/userAction/scene/mobileIndex)-true：使用，false：不使用
		'path': '/api/zbids/app/gettoken/v1.0/', // api地址
		'type': 'GET',
		'isMock': false,
		'isQuery': false,
		'queryData': {
			"appType": "pc",
			"appId": "pcWeb",
			"appKey": "e877000be408a6cb0428e0f584456e03"
		}
	},
	'login': {
		'name': '登录',
		'path': '/api/zbids/member/login/v1.0',
		'type': 'POST',
		'defaultData': {
			'account': 'zpk',
			'password': '123456',
			'token': this.token
		}
	},

	'logout': {
		'name': '登出',
		'path': '/api/zbids/member/loginout/v1.0'
	},


	'updateStatus': {
		'name': '更新消息状态',
		'path': '/api/study/message/updateStatus/v1.0',
		// 'mock': '/static/mock/updateStatus.json',
		'defaultData': {
			'token': this.token,
			'messageId': 'messageId',
			'isall': '0' // 0 更新一个 1 更新所有
		},
	},
	'member': {
		'name': '用户详细信息',
		'path': '/api/zbids/member/getmemberinfo'
	},




	'getKnowledgePoint': {
    'name':'获取知识点',
    'apiType':'php',
    'isPrefix':true,
    //"hostNameDemo": "https://apidev.zbgedu.com",
		'path': '/api/userAction/php/examen/getKnowledgeCache',
    'type':'GET'
	},
	'addExamen': { //新建试卷
    'name':'新建试卷',
    'apiType':'php',
    'isPrefix':true,
		'path': '/api/userAction/php/examen/addExamen',
		'type': 'POST'
	},
  'getExerciseList': { //获取试题列表
    'name':'获取试题列表',
    'apiType':'php',
    'isPrefix':true,
		'path': '/api/userAction/php/examen/getExerciseList',
    'type':'GET'
	},
	'getExamenData': { //获取试卷列表
    'name':'获取试卷列表',
    'apiType':'php',
    'isPrefix':true,
		'path': '/api/userAction/php/examen/getExamenData',
    'type':'GET'
	},
	'getDictData': { //获取来源，难度
    'name': '获取难度', // api名称
    'apiType': 'php', // api类型-java，php，node
    'isPrefix': true, // 是否使用接口前缀(/api/userAction/scene/mobileIndex)-true：使用，false：不使用
    'path': '/api/userAction/php/examen/getDictData', // api地址
    'type': 'GET', // api类型- GET,POST
	},
	'addExercise': { //添加试题
    'name':'添加试题',
    'apiType':'php',
    'isPrefix':true,
		'path': '/api/userAction/php/examen/addExercise',
		'type': 'POST'
	},
	'getExamenInfoData': { //获取试卷基本信息
    'name':'获取试卷基本信息',
    'apiType':'php',
    'isPrefix':true,
		'path': '/api/userAction/php/examen/getExamenInfoData',
    'type':'GET'
	},
	'getExamenExerciseData': { //获取试卷下试题的详情
    'name':'获取试卷下试题的详情',
    'apiType':'php',
    'isPrefix':true,
		'path': '/api/userAction/php/examen/getExamenExerciseData',
    'type':'GET'
	},
	'delExamenExercise': { //删除试卷下的试题
    'name':'删除试卷下的试题',
    'apiType':'php',
    'isPrefix':true,
		'path': '/api/userAction/php/examen/delExamenExercise',
		'type': 'GET'
	},
	'sortUpDown': { //试卷详情试题上移下移
    'name':'试卷详情页面中试题上移下移',
    'apiType':'php',
    'isPrefix':true,
		'path': '/api/userAction/php/examen/sortUpDown',
    'type':'GET'
	},
	'editExamen': { //编辑试卷
    'name':'编辑试卷',
    'apiType':'php',
    'isPrefix':true,
		'path': '/api/userAction/php/examen/editExamen',
		'type': 'POST'
	},
	'editExamenState': { //新建试卷修改状态
    'name':'新建试卷修改状态',
    'apiType':'php',
    'isPrefix':true,
		'path': '/api/userAction/php/examen/editExamenState',
		'type': 'POST'
	},
	'delExamen': { //删除试卷列表中的试卷
    'name':'删除试卷列表中的试卷',
    'apiType':'php',
    'isPrefix':true,
		'path': '/api/userAction/php/examen/delExamen',
    'type':'GET'
	},
	'editScore': { //修改试卷中试题的分数
    'name':'修改试卷中试题的分数',
    'apiType':'php',
    'isPrefix':true,
		'path': '/api/userAction/php/examen/editScore',
    'type':'GET'
	},
  'editSection':{
    'name':'修改试卷中试题的类别',
    'apiType':'php',
    'isPrefix':true,
	  'path':'/api/userAction/php/examen/editExamenExerciseType',
    'type': 'POST'
  },










	'getUserExamAllRecord': {
		'name': '获取班级某些试卷的所有学员的情况',
		'isPrefix': true,
		'path': '/api/userAction/php/examen/getUserExamAllRecord',
		'type': 'GET',
		'isMock': false,
		'isQuery': false,
		'queryData': {
			'classId': 'classId',
			'examId': 'examId'
		}
	},
	'getClassTasksProgress': {
		'name': '获取班级某任务或多个任务学员的每个人的进度',
		'isPrefix': true,
    'apiType': 'node',
		'path': '/api/userAction/class/getTasksProgress/v1.0',
		'type': 'GET',
		'isMock': false,
		'isQuery': false,
		'queryData': {
			'token': 'token',
			'classId': 'classId',
			'taskId': 'taskId'
		}
	},
	'getUserExerciseAllRecord': {
		'name': '获取班级某任务或多个任务学员的每个人的进度',
		'isPrefix': true,
		'path': '/api/userAction/php/examen/getUserExerciseAllRecord',
		'isMock': false,
		'isQuery': false,
		'queryData': {
			'classId': 'classId',
			'examId': 'examId'
		}
	},
	'getUserOneExamAllRecord': {
		'name': '获取单个学员获取单张卷子所有批次情况',
		'isPrefix': true,
		'path': '/api/userAction/php/examen/getUserOneExamAllRecord',
		'type': 'GET',
		'isMock': false,
		'isQuery': false,
		'queryData': {
			'memberId': 'memberId',
			'classId': 'classId',
			'examId': 'examId'
		}
	},
	'fileUpload': {
		'name': '上传图片',
		'hostNameDemo': 'https://api.zbgedu.com',
		'path': '/api/base/file/upload',
		'type': 'POST'
	},
	'insertMessage': {
		'name': '推送消息',
		'isPrefix': true,
		'path': '/api/study/message/insertMessage/v1.0',
		'type': 'POST',
	},
	'bbsClassNoSolve': {
		'name': '未解决统计按照班级',
		'isPrefix': true,
		'path': '/api/studytools/bbsClassNoSolve/v1.0',
		'type': 'GET',
	},
	'getdegree': {
		'name': '查看班级本周计划内包含的试卷的不懂错题',
		'isPrefix': true,
		'path': '/api/userAction/study/member/getdegree',
	},
	'examReport': {
		'name': '测评报告',
    'apiType': 'node',
		'isPrefix': true,
		'path': '/api/userAction/scene/mobileIndex/examReport',
    'isMock': false,
    'mock': '/mock/examReport.json',
		'queryData': {
			'knowledgePointId': "dd68b8cb-9c9c-4da4-9d24-7cbc92006d41",
			'memberId': "ff8080815133db0d0151375bfdf30c0d",
			'examenNum': 0
		}
	},
	//布置作业查看列表
	'getListPaper': {
		'name': '获取任务下试卷的列表',
		'isPrefix': true,
		'path': '/api/userAction/php/examen/getTaskExamen',
		'type': 'GET',
		'isMock': false,
		'isQuery': false,
	},
	//获取符合条件的试卷列表
	'getExamenData': {
		'name': '获取符合条件的试卷列表',
		'isPrefix': true,
		'path': '/api/userAction/php/examen/getExamenData',
		'type': 'GET',
		'isMock': false,
		'isQuery': false,
	},
	//添加试卷任务
	'addTaskExamen': {
		'name': '添加试卷任务',
		'isPrefix': true,
		'path': '/api/userAction/php/examen/addTaskExamen',
		'type': 'POST',
		'isMock': false,
		'isQuery': false,
	},
	//删除任务下的试卷
	'delTaskExamen': {
		'name': '删除任务下的试卷',
		'isPrefix': true,
		'path': '/api/userAction/php/examen/delTaskExamen'
	},
	//获取班级下所有的作业
	'getClassExam': {
		'name': '获取班级下所有的作业',
		'isPrefix': true,
		'path': '/api/userAction/php/examen/getClassExam'
	},
	//获取当前班级下的试卷列表
	'exerciseIdList': {
		'apiType': 'node',
		'name': '获取当前班级下的试卷列表',
		'isPrefix': true,
		'path': '/api/userAction/scene/mobileIndex/course/exerciseIdList'
	},
  'queryCourseArray': {
    'name': '获取教师课程列表接口',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/edu/course/queryCourseArray'
  },
  'queryCourseDetail': {
    'name': '获取课程详情信息接口',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/edu/course/queryCourseArrayDetail'
  },
  'queryCourseArrayDetailList': {
    'name': '获取上课课表列表',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/edu/course/findCourseArrayDetailList'
  },
  'getTeacherKnowledge': {
    'name': '获取教师负责的前两级，项目科目',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/userAction/php/bbs/getTeacherKnowledge'
  },
  'getCourseTeacheringType': {
    'name': '获取课程类型',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/userAction/php/bbs/getCourseTeacheringType'
  },
  'addBbs': {
    'name': '帖子加入知识库',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/userAction/php/knowledge/addBbs'
  },
  'queryClassExamen': {
    'name': '查询课表下的作业列表',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/class/queryClassExamen'
  },
  'deleteClassExamen': {
    'name': '删除课表下的作业',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/class/deleteClassExamen'
  },
  'classBbsCount': {
    'name': '获取班级下答疑统计',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/userAction/php/bbs/classBbsCount'
  },
  'saveClassExamen': {
    'name': '在课表上添加作业',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/class/saveClassExamen'
  },
  'searchCourseAppraisalTaskBySubjectId': {
    'name': '获取标准模版课作业',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/teachsource/course/searchCourseAppraisalTaskBySubjectId'
  },
  'searchCourseTaskBySubjectId': {
    'name': '获取标准模版课作业',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/course/searchFacecourseTaskList'
  },
  'getTestpaperAnalysis': {
    'name': '卷面分析',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/edu/userAction/examen/getUserExerciseAllRecord'
  },
  'getExamStatistics': {
    'name': '测评统计',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/edu/userAction/examen/getTestCount'
  },
  'getTestCountCondition': {
    'name': '根据条件查询测评统计',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/edu/userAction/examen/getTestCountCondition'
  },
  'exportTestCount': {
    'name': '测评统计-列表导出',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/edu/userAction/examen/exportTestCount'
  },
  'exportUserExerciseAllRecord': {
    'name': '卷面分析-列表导出',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/edu/userAction/examen/exportUserExerciseAllRecord'
  },
  'editPost': {
    'name': '答疑列表回复编辑',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/userAction/php/bbs/editPost'
  },
  'teacherBbsCount': {
    'name': '获取老师答疑统计接口(教辅上线版)',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/userAction/php/bbs/teacherBbsCount'
  },
  'findClassList': {
    'name': '优播课学习行为(班级列表)',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/edu/userAction/classes/yb/findClassList'
  },
  'getClassStatistics': {
    'name': '优播课学习行为(班级列表)(新版)',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/teacherClass/getClassStatistics'
  },
  'setThreadReplyState': {
    'name': '设置答疑处理中状态',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/userAction/php/bbs/setThreadReplyState'
  },
  'bbsStatisticalData': {
    'name': '教师答疑统计',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/userAction/php/bbs/bbsStatisticalData'
  },
  'bbsStatisticalInfo': {
    'name': '教师答疑明细',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/userAction/php/bbs/bbsStatisticalInfo'
  },
  'getKnowledgeCategory': {
    'name': '证书科目树',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/userAction/php/bbs/getKnowledgeCategory'
  },
  'findStudentLearnProgress': {
    'name': '获取优播课学员明细',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/edu/userAction/classes/yb/findStudentLearnProgress'
  },
  'getClassPlanDetail': {
    'name': '获取课程学习计划',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/userAction/php/class/getClassPlanDetail'
  },
  /*'findClassProgressCount': {
    'name': '优播课-学员统计-班级汇总',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/edu/userAction/classes/yb/findClassProgressCount'
  },*/
  'findClassProgressCount': {
    'name': '优播课-学员统计-班级汇总',
    'type':'POST',
    'isPrefix': true,
    'host':'https://zbapi.zbgedu.com',
    'path': '/api/study/userAction/statistics/flipped/selectStudyTaskProgressByClassId'
  },
  'findItemCategoryList': {
    'name': '优播课-查询证书科目',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/edu/userAction/classes/yb/findItemCategoryList'
  },
  'getTaskInfo':{
	  'name':'获取任务详情',
    'host':'https://zbapi.zbgedu.com',
    'hostNameDemo':'https://apidemo.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/courseResourse/getTaskInfoByIdToTech'
  },
  'getTaskInfoById':{
	  'name':'获取任务详情',
    'host':'https://zbapi.zbgedu.com',
    'hostNameDemo':'https://apidemo.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/courseResourse/getTaskInfoByIdToTech'
  },
  'queryMemberByNameAndNickname':{
    'name':'模糊查询学员姓名或昵称',
    'host':'https://zbapi.zbgedu.com',
    'hostNameDemo':'https://apidemo.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/member/queryMemberByNameAndNickname'
  },
  'getClassCourseDetail':{
	  'name':'获取课程详情',
    'apiType': 'node',
    'type':'GET',
    'isPrefix': true,
    'path': '/api/userAction/scene/mobileIndex/iClassCourseDetail'
  },
  'getYouboClasses':{
    'name':'获取班主任优播课列表',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/teacherClass/getClasses'
  },
  'getClassInfo':{
    'name':'获取优播课班级信息',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/teacherClass/getClassInfo'
  },
  'queryStudyPlanExtendSelect':{
    'name':'获取周计划下拉框',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/teacherClass/queryStudyPlanExtendSelect'
  },
  'queryStudyPlanMonth':{
    'name':'直播统计月份列表',
      'host':'https://zbapi.zbgedu.com',
      'type':'POST',
      'isPrefix': true,
      'path': '/api/study/userAction/teacherClass/queryStudyPlanMonth'
  },
  'openCourseTrailer':{
    'name':'获取优播课直播预告',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/teacherClass/openCourseTrailer'
  },
  'getYouboCourseProgress':{
    'name':'获取优播课课程进度',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/teacherClass/studyPlanProgress'
  },
  'queryStudyPlanDetail':{
    'name':'获取优播课任务列表',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/teacherClass/queryStudyPlanDetail'
  },
  'getQuestionById':{
    'name':'通过试题id获取试题信息',
    'host':'https://apitiku.zbgedu.com',
    'hostNameDemo':'http://apitikudemo.zbgedu.com',
    'type':'GET',
    'isPrefix': true,
    'path': '/manager/question/v1/getQuestionById'
  },
  'getExamenTaskList':{
    'name':'优播课测评统计',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/selectStatisticsCoursePaperList'
  },
  'getStatisticsCoursePaperByChart':{
    'name':'优播课测评统计折线图数据',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/selectStatisticsCoursePaperByChart'
  },
  'getStatisticsCoursePaperByLeader':{
    'name':'优播课测评统计排行榜',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/selectStatisticsCoursePaperByLeader'
  },
  'getStatisticsMemberPaperPage':{
    'name':'优播课测评统计完成情况列表',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/selectStatisticsMemberPaperPage'
  },
  'getStatisticsQuestionPageByTask':{
    'name':'优播课测评统计卷面分析列表',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/selectStatisticsQuestionPageByTask'
  },
  'getMemberTaskList':{
    'name':'优播课任务统计列表',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/task/selectMemberTaskList'
  },
  'getMemberTaskStatistics':{
    'name':'优播课任务统计列表柱形图',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/task/selectMemberTaskStatistics'
  },
  'getTaskInfoAndProgress':{
    'name':'查询任务详情（包含题库数据）',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/userAction/scene/java/task/getTaskDetailById'
  },
  'getOpenCourseList':{
    'name':'优播客直播统计列表',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/openCourse/selectList'
  },
  'exportStatisticsCoursePaper':{
    'name':'优播客作业统计首页列表导出',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/exportStatisticsCoursePaper'
  },
  'selectLiveListChart':{
    'name':'优播课直播统计柱状图',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/openCourse/selectListChart'
  },
  'getStudentTestPaperAnswerHistory':{
    'name':'优播课直播统计柱状图',
    'host':'https://apitiku.zbgedu.com',
    'hostNameDemo':'https://apitikudemo.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/manager/managerInterface/v1/studentTestPaperAnswerHistory'
  },
  'getStatisticsFaceCoursePaperList':{
    'name':'面授课作业统计-首页列表',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/faceCoursePaper/selectStatisticsFaceCoursePaperList'
  },
  'exportStatisticsFaceCoursePaper':{
    'name':'面授课作业统计-首页列表-导出',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/faceCoursePaper/exportStatisticsFaceCoursePaper'
  },
  'getStatisticsFaceMemberPaperPage':{
    'name':'面授课作业统计-完成情况列表',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/faceCoursePaper/selectStatisticsFaceMemberPaperPage'
  },
  'exportStatisticsFaceMemberPaper':{
    'name':'面授课作业统计-完成情况列表导出',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/faceCoursePaper/exportStatisticsFaceMemberPaper'
  },
  'getStatisticsFaceCoursePaperByChart':{
    'name':'面授课作业统计-首页图表',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/faceCoursePaper/selectStatisticsFaceCoursePaperByChart'
  },
  'getFaceStatisticsCoursePaperByLeader':{
    'name':'面授课作业统计-排行榜',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/faceCoursePaper/selectFaceStatisticsCoursePaperByLeader'
  },
  'getFaceStatisticsQuestionPageByTask':{
    'name':'面授课作业统计-卷面分析列表',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/faceCoursePaper/selectFaceStatisticsQuestionPageByTask'
  },
  'exportStatisticsFaceQuestion':{
    'name':'面授课作业统计-卷面分析列表-导出',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/statistics/faceCoursePaper/exportStatisticsFaceQuestion'
  },
  'getCourseInfoPagerByParam':{
    'name':'获取课程二维码列表',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/tech/manager/course/searchCourseInfoPagerByParam'
  },
  'updateQrcodeByCourseId':{
    'name':'课程二维码上传',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/courseTechExtend/updateQrcodeByCourseId'
  },
  'deleteQrcodeByCourseId':{
    'name':'课程二维码删除',
    'host':'https://zbapi.zbgedu.com',
    'type':'POST',
    'isPrefix': true,
    'path': '/api/study/userAction/courseTechExtend/deleteQrcodeByCourseId'
  },
  'queryExamenInfo': {
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/userAction/scene/mobileIndex/queryExamenInfo',
    'type':'GET',
    'isPrefix': true,
  },
  'getAllItemCategoryList': {
    'name':'获取项目科目列表',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/itemCategory/selectAllItemCategoryList',
    'type':'POST',
    'isPrefix': true,
  },
  'getSelectList': {
    'name':'获取角色下拉列表',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/techRole/listAll',
    'type':'POST',
    'isPrefix': true,
  },
  'getRoleList': {
    'name':'获取角色列表',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/techRole/list',
    'type':'POST',
    'isPrefix': true,
  },
  'getUserList': {
    'name':'获取用户列表',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/techMember/list',
    'type':'POST',
    'isPrefix': true,
  },
  'getUserByNumber': {
    'name':'工号查询用户',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/techMember/getUserByNumber',
    'type':'POST',
    'isPrefix': true,
  },
  'getRoleDetail': {
    'name':'角色详情',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/techRole/info',
    'type':'POST',
    'isPrefix': true,
  },
  'getMenuList': {
    'name':'查询一二级菜单列表',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/techFun/listSecondLevel',
    'type':'POST',
    'isPrefix': true,
  },
  'saveTechRole': {
    'name':'编辑/新增角色',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/techRole/save',
    'type':'POST',
    'isPrefix': true,
  },
  'saveTechUser': {
    'name':'编辑/新增用户',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/techMember/save',
    'type':'POST',
    'isPrefix': true,
  },
  'getEditUserInfo': {
    'name':'查询编辑用户详情',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/techMember/info',
    'type':'POST',
    'isPrefix': true,
  },
  'getUserInfo': {
    'name':'查询用户详情',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/techMember/detail',
    'type':'POST',
    'isPrefix': true,
  },
  'deleteUser': {
    'name':'删除用户',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/techMember/delete',
    'type':'POST',
    'isPrefix': true,
  },
  'deleteRole': {
    'name':'删除角色',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/techRole/delete',
    'type':'POST',
    'isPrefix': true,
  },
  'getTechMenu': {
    'name':'获取导航菜单',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/teacherScope/menu',
    'type':'POST',
    'isPrefix': true,
  },
  'getCourseArranges': {
    'name':'获取教师权限内的面授班列表',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/study/userAction/teacherFacecourse/getCourseArranges',
    'type':'POST',
    'isPrefix': true,
  },
  'getItemCategory': {
    'name':'教师项目科目权限范围',
    'host':'https://zbapi.zbgedu.com',
    'path':'/api/tech/manager/teacherScope/itemCategory',
    'type':'POST',
    'isPrefix': true,
  },
  'selectStatisticsOnlineCoursePage': {
    'name':'网课学生学情查询列表',
    'host':zbApiHost,
    'path':'/api/study/userAction/statistics/onlineCourse/selectStatisticsOnlineCoursePage',
    'type':'POST',
    'isPrefix': true,
  },
  'exportStatisticsOnlineCourse': {
    'name':'网课学生学情列表导出',
    'host':zbApiHost,
    'path':'/api/study/userAction/statistics/onlineCourse/exportStatisticsOnlineCourse',
    'type':'POST',
    'isPrefix': true,
  },
  'getTechBranch': {
    'name':'通用-教师分部权限范围',
    'host':zbApiHost,
    'path':'/api/tech/manager/eduOrganization/findAll',
    'type':'POST',
    'isPrefix': true,
  },
  'getLoginToken': {
    'name':'模拟登陆',
    'host':zbApiHost,
    'path':'/api/zbids/tech/login',
    'type':'POST',
    'isPrefix': true,
  },
  'getTeachingType': {
    'name':'获取教师授课方式',
    'host':zbApiHost,
    'path':'/api/tech/manager/teacherScope/teachingType',
    'type':'POST',
    'isPrefix': true,
  }
};
