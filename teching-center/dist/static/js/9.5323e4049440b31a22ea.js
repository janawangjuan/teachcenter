webpackJsonp([9],{UYFT:function(e,t){},rqv7:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("gJ4k"),l=n("PLaU"),i=n("OOvn"),o={name:"onlineClassLearnSituation",components:{systemBreadcrumb:a.a,unfoldCollapse:l.a},computed:{techLoginInfo:function(){return JSON.parse(this.cookie.get("techLoginInfo"))}},data:function(){return{formInline:{name:"",state:"",item:"",subject:"",courseName:"",courseStatus:"",courseVersionName:"",studentName:"",isGive:"",orderType:"",mobile:"",studyStatus:"",teachingType:"",isRehear:"",minProgress:"",maxProgress:"",branchId:"",endTime:null,activeTime:null},activeTimeBegin:"",activeTimeEnd:"",endTimeBegin:"",endTimeEnd:"",pickerOptions0:{disabledDate:function(e){return e.getTime()>Date.now()}},envType:parseInt(this.cookie.get("envType")),classSelectList:[],loading:!1,tableData:[1,1,1,1,1,1,1,,,1,1,,1,11,11,1,1,1,1,1,1,1,1,1,1,1,1],totalCount:0,pageSize:20,pageNo:1,options1:"",options2:"",branchList:[]}},mounted:function(){this.getTableData(),this.findItemCategoryList(),this.getCourseType(),this.getTechBranch()},methods:{checkForm:function(){this.getTableData()},getTableData:function(){var e=this;this.loading=!0,this.formInline.minProgress&&this.formInline.maxProgress&&Number(this.formInline.maxProgress)<Number(this.formInline.minProgress)&&this.webApi.alert("总进度开始值不能大于结束值~"),i.a.ajax("selectStatisticsOnlineCoursePage",{token:this.techLoginInfo.token,itemId:this.formInline.item,courseCategoryId:this.formInline.subject,branchId:this.formInline.branchId,teachingType:this.formInline.teachingType,courseName:this.formInline.courseName,courseVersionName:this.formInline.courseVersionName,courseStatus:this.formInline.courseStatus,isGive:this.formInline.isGive,orderType:this.formInline.orderType,studentName:this.formInline.studentName,mobile:this.formInline.mobile,isRehear:this.formInline.isRehear,activeTimeBegin:this.activeTimeBegin,activeTimeEnd:this.activeTimeEnd,endTimeBegin:this.endTimeBegin,endTimeEnd:this.endTimeEnd,studyStatus:this.formInline.studyStatus,totalProgressBegin:this.formInline.minProgress,totalProgressEnd:this.formInline.maxProgress,pageIndex:this.pageNo,pageSize:this.pageSize}).then(function(t){e.loading=!1,t&&"success"==t.state?(e.tableData=t.data.result,e.totalCount=t.data.total):e.webApi.alert(t.msg||"服务器异常，请重试~")})},exportTable:function(){""!=this.formInline.courseName?this.webApi.postExcelFile({token:this.techLoginInfo.token,itemId:this.formInline.item,courseCategoryId:this.formInline.subject,branchId:this.formInline.branchId,teachingType:this.formInline.teachingType,courseName:this.formInline.courseName,courseVersionName:this.formInline.courseVersionName,courseStatus:this.formInline.courseStatus,isGive:this.formInline.isGive,orderType:this.formInline.orderType,studentName:this.formInline.studentName,mobile:this.formInline.mobile,isRehear:this.formInline.isRehear,activeTimeBeginDate:this.activeTimeBegin,activeTimeEndDate:this.activeTimeEnd,endTimeBeginDate:this.endTimeBegin,endTimeEndDate:this.endTimeEnd,studyStatus:this.formInline.studyStatus,totalProgressBeginBigDecimal:this.formInline.minProgress,totalProgressEndBigDecimal:this.formInline.maxProgress},("1"==this.envType?"https://apidemo.zbgedu.com":"https://zbapi.zbgedu.com")+"/api/study/userAction/statistics/onlineCourse/exportStatisticsOnlineCourse"):this.webApi.alert("课程名称为必填项~")},changeRangeTime:function(e){1==e?null==this.formInline.activeTime?(this.activeTimeBegin="",this.activeTimeEnd=""):(this.activeTimeBegin=this.formInline.activeTime[0],this.activeTimeEnd=this.formInline.activeTime[1]):null==this.formInline.endTime?(this.endTimeBegin="",this.endTimeEnd=""):(this.endTimeBegin=this.formInline.endTime[0],this.endTimeEnd=this.formInline.endTime[1])},findItemCategoryList:function(){var e=this;i.a.ajax("getItemCategory",{token:this.techLoginInfo.token}).then(function(t){t&&"success"==t.state?e.options1=t.data:e.webApi.alert(t.msg||"服务器异常，请重试~")})},getTechBranch:function(){var e=this;i.a.ajax("getTechBranch",{token:this.techLoginInfo.token}).then(function(t){t&&"success"==t.state?e.branchList=t.data:e.webApi.alert(t.msg||"服务器异常，请重试~")})},getCourseType:function(){var e=this;i.a.ajax("getTeachingType",{token:this.techLoginInfo.token}).then(function(t){t&&"success"==t.state&&(e.classSelectList=t.data.filter(function(e){return"flipped"!=e.value&&"facecourse"!=e.value}))})},changeItem:function(e){this.options2=""==e?[]:this.options1.filter(function(t){return e==t.itemId})[0].courseCategoryList,this.formInline.subject=""},handleCurrentChange:function(e){this.pageNo=e,this.getTableData()},handleSizeChange:function(e){this.pageSize=e,this.pageNo=1,this.getTableData()}}},r={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"onlineClassLearnSituation-wrap"},[n("systemBreadcrumb",[n("el-breadcrumb-item",{attrs:{to:{path:"/tmIndex/systemManage"}}},[e._v("查询统计分析")]),e._v(" "),n("el-breadcrumb-item",[e._v("网课学员学情查询")])],1),e._v(" "),n("div",{staticClass:"onlineClassLearnSituation-content"},[n("div",[n("unfoldCollapse",{on:{checkForm:e.checkForm}},[n("el-form",{staticClass:"demo-form-inline",attrs:{inline:!0,model:e.formInline,size:"mini","label-position":"left","label-width":"100px"}},[n("el-form-item",{attrs:{label:"项目"}},[n("el-select",{attrs:{placeholder:"项目"},on:{change:e.changeItem},model:{value:e.formInline.item,callback:function(t){e.$set(e.formInline,"item",t)},expression:"formInline.item"}},[n("el-option",{attrs:{value:"",label:"全部项目"}}),e._v(" "),e._l(e.options1,function(e,t){return n("el-option",{key:t,attrs:{value:e.itemId,label:e.itemName}})})],2)],1),e._v(" "),n("el-form-item",{attrs:{label:"科目"}},[n("el-select",{attrs:{placeholder:"科目"},model:{value:e.formInline.subject,callback:function(t){e.$set(e.formInline,"subject",t)},expression:"formInline.subject"}},[n("el-option",{attrs:{value:"",label:"全部科目"}}),e._v(" "),e._l(e.options2,function(e,t){return n("el-option",{key:t,attrs:{value:e.courseCategoryId,label:e.courseCategoryName}})})],2)],1),e._v(" "),n("el-form-item",{attrs:{label:"所属分部"}},[n("el-select",{attrs:{clearable:"",placeholder:"所属分部"},model:{value:e.formInline.branchId,callback:function(t){e.$set(e.formInline,"branchId",t)},expression:"formInline.branchId"}},e._l(e.branchList,function(e){return n("el-option",{attrs:{label:e.orgName,value:e.orgId}})}),1)],1),e._v(" "),n("el-form-item",{attrs:{label:"授课类型"}},[n("el-select",{attrs:{clearable:"",placeholder:"授课类型"},model:{value:e.formInline.teachingType,callback:function(t){e.$set(e.formInline,"teachingType",t)},expression:"formInline.teachingType"}},e._l(e.classSelectList,function(e){return n("el-option",{key:e.value,attrs:{label:e.title,value:e.value}})}),1)],1),e._v(" "),n("el-form-item",{attrs:{label:"课程名称"}},[n("el-input",{attrs:{placeholder:"请输入课程名称"},model:{value:e.formInline.courseName,callback:function(t){e.$set(e.formInline,"courseName",t)},expression:"formInline.courseName"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"教学课程名称"}},[n("el-input",{attrs:{placeholder:"请输入教学课程名称"},model:{value:e.formInline.courseVersionName,callback:function(t){e.$set(e.formInline,"courseVersionName",t)},expression:"formInline.courseVersionName"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"课程学习情况"}},[n("el-select",{attrs:{clearable:"",placeholder:"课程学习情况"},model:{value:e.formInline.courseStatus,callback:function(t){e.$set(e.formInline,"courseStatus",t)},expression:"formInline.courseStatus"}},[n("el-option",{attrs:{label:"未激活",value:"1"}}),e._v(" "),n("el-option",{attrs:{label:"学习中",value:"2"}}),e._v(" "),n("el-option",{attrs:{label:"已过期",value:"3"}})],1)],1),e._v(" "),n("el-form-item",{attrs:{label:"是否赠送"}},[n("el-select",{attrs:{clearable:"",placeholder:"状态"},model:{value:e.formInline.isGive,callback:function(t){e.$set(e.formInline,"isGive",t)},expression:"formInline.isGive"}},[n("el-option",{attrs:{label:"是",value:"1"}}),e._v(" "),n("el-option",{attrs:{label:"否",value:"0"}})],1)],1),e._v(" "),n("el-form-item",{attrs:{label:"订单类型"}},[n("el-select",{attrs:{clearable:"",placeholder:"订单类型"},model:{value:e.formInline.orderType,callback:function(t){e.$set(e.formInline,"orderType",t)},expression:"formInline.orderType"}},[n("el-option",{attrs:{label:"个人订单",value:"1"}}),e._v(" "),n("el-option",{attrs:{label:"大客户方向班订单",value:"2"}}),e._v(" "),n("el-option",{attrs:{label:"大客户精英班订单",value:"3"}})],1)],1),e._v(" "),n("el-form-item",{attrs:{label:"学员姓名"}},[n("el-input",{attrs:{placeholder:"请输入学员姓名"},model:{value:e.formInline.studentName,callback:function(t){e.$set(e.formInline,"studentName",t)},expression:"formInline.studentName"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"手机号码"}},[n("el-input",{attrs:{placeholder:"请输入学员手机号码"},model:{value:e.formInline.mobile,callback:function(t){e.$set(e.formInline,"mobile",t)},expression:"formInline.mobile"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"是否重修"}},[n("el-select",{attrs:{clearable:"",placeholder:"状态"},model:{value:e.formInline.isRehear,callback:function(t){e.$set(e.formInline,"isRehear",t)},expression:"formInline.isRehear"}},[n("el-option",{attrs:{label:"是",value:"1"}}),e._v(" "),n("el-option",{attrs:{label:"否",value:"0"}})],1)],1),e._v(" "),n("el-form-item",{attrs:{label:"激活时间"}},[n("el-date-picker",{attrs:{type:"daterange","unlink-panels":"","range-separator":"至",size:"mini","value-format":"yyyy-MM-dd HH:mm:ss","start-placeholder":"开始日期","picker-options":e.pickerOptions0,"end-placeholder":"结束日期"},on:{change:function(t){return e.changeRangeTime(1)}},model:{value:e.formInline.activeTime,callback:function(t){e.$set(e.formInline,"activeTime",t)},expression:"formInline.activeTime"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"课程到期时间"}},[n("el-date-picker",{attrs:{type:"daterange","unlink-panels":"","range-separator":"至",size:"mini","value-format":"yyyy-MM-dd HH:mm:ss","start-placeholder":"开始日期","picker-options":e.pickerOptions0,"end-placeholder":"结束日期"},on:{change:function(t){return e.changeRangeTime(2)}},model:{value:e.formInline.endTime,callback:function(t){e.$set(e.formInline,"endTime",t)},expression:"formInline.endTime"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"学籍状态"}},[n("el-select",{attrs:{clearable:"",placeholder:"状态"},model:{value:e.formInline.studyStatus,callback:function(t){e.$set(e.formInline,"studyStatus",t)},expression:"formInline.studyStatus"}},[n("el-option",{attrs:{label:"未开始",value:"1"}}),e._v(" "),n("el-option",{attrs:{label:"正常",value:"2"}}),e._v(" "),n("el-option",{attrs:{label:"已到期",value:"3"}})],1)],1),e._v(" "),n("el-form-item",{attrs:{label:"总进度"}},[n("el-input",{attrs:{placeHolder:"开始"},model:{value:e.formInline.minProgress,callback:function(t){e.$set(e.formInline,"minProgress",t)},expression:"formInline.minProgress"}},[n("template",{slot:"append"},[e._v("%")])],2),e._v("至\n            "),n("el-input",{attrs:{placeHolder:"结束"},model:{value:e.formInline.maxProgress,callback:function(t){e.$set(e.formInline,"maxProgress",t)},expression:"formInline.maxProgress"}},[n("template",{slot:"append"},[e._v("%")])],2)],1)],1)],1)],1),e._v(" "),n("div",{staticClass:"export-btn-wrap"},[n("el-button",{attrs:{size:"mini"},on:{click:e.exportTable}},[e._v("导出")])],1),e._v(" "),n("div",{staticClass:"table-wrap"},[n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:e.tableData,"tooltip-effect":"dark",stripe:!0,size:"mini"}},[n("el-table-column",{attrs:{type:"index",label:"序号",fixed:"",width:"50"}}),e._v(" "),n("el-table-column",{attrs:{prop:"studentName",fixed:"",label:"学员姓名"}}),e._v(" "),n("el-table-column",{attrs:{prop:"mobile",label:"手机号码"}}),e._v(" "),n("el-table-column",{attrs:{prop:"branchName",label:"所属分部"}}),e._v(" "),n("el-table-column",{attrs:{prop:"itemName",label:"项目"}}),e._v(" "),n("el-table-column",{attrs:{prop:"courseCategoryName",label:"科目"}}),e._v(" "),n("el-table-column",{attrs:{prop:"studyStatusName",label:"学籍状态"}}),e._v(" "),n("el-table-column",{attrs:{prop:"courseName",label:"课程名称"}}),e._v(" "),n("el-table-column",{attrs:{prop:"teachingTypeName",label:"授课类型"}}),e._v(" "),n("el-table-column",{attrs:{prop:"orderTypeName",label:"订单类型"}}),e._v(" "),n("el-table-column",{attrs:{prop:"courseStatusName",label:"课程学习情况"}}),e._v(" "),n("el-table-column",{attrs:{prop:"isGiveName",label:"是否赠送"}}),e._v(" "),n("el-table-column",{attrs:{prop:"isRehearName",label:"是否重修"}}),e._v(" "),n("el-table-column",{attrs:{prop:"rehearNum",label:"重修次数"}}),e._v(" "),n("el-table-column",{attrs:{prop:"courseVersionName",label:"教学课程名称"}}),e._v(" "),n("el-table-column",{attrs:{prop:"planTypeName",label:"学习模式"}}),e._v(" "),n("el-table-column",{attrs:{prop:"totalProgress",label:"总进度"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.row.totalProgress)+"%")]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"completedNum",label:"已完成数"}}),e._v(" "),n("el-table-column",{attrs:{prop:"unlearnedNum",label:"未开始数"}}),e._v(" "),n("el-table-column",{attrs:{prop:"learningNum",label:"学习中数"}}),e._v(" "),n("el-table-column",{attrs:{label:"激活时间"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.row.activeTime?e.webApi.formatDate(t.row.activeTime,"ALL"):"----"))]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"课程到期时间"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(t.row.endTime?e.webApi.formatDate(t.row.endTime,"ALL"):"----"))]}}])})],1)],1),e._v(" "),n("div",{staticClass:"pagination-wrap"},[n("el-pagination",{attrs:{background:"",layout:"prev, pager, next, sizes, total",pageSize:e.pageSize,total:e.totalCount},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)])],1)},staticRenderFns:[]};var s=n("C7Lr")(o,r,!1,function(e){n("UYFT")},null,null);t.default=s.exports}});
//# sourceMappingURL=9.5323e4049440b31a22ea.js.map