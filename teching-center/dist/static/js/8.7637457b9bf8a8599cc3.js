webpackJsonp([8],{"76Xi":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=s("4YfN"),n=s.n(a),r=s("48sp"),l=s("OOvn"),o={name:"detail",computed:n()({},Object(r.d)({selectUser:function(e){return e.systemManage.selectUser}}),{techLoginInfo:function(){return JSON.parse(this.cookie.get("techLoginInfo"))}}),mounted:function(){this.getCourseType(),this.getUserInfo(),this.updateShowUserBack(!0)},data:function(){return{formData:{},userInfo:"",courseTypeList:[]}},methods:n()({},Object(r.c)("systemManage",["updateShowUserBack"]),{getUserInfo:function(){var e=this;l.a.ajax("getUserInfo",{token:this.techLoginInfo.token,memberId:this.selectUser.memberId}).then(function(t){t&&"success"==t.state?e.userInfo=t.data:e.webApi.alert(t.msg||"系统异常，请重试~")})},getCourseType:function(){var e=this;l.a.ajax("getCourseTeacheringType",{token:this.techLoginInfo.token}).then(function(t){t&&"success"==t.state&&(e.courseTypeList=t.data)})},handleType:function(e){var t="";return this.courseTypeList.forEach(function(s){s.value==e&&(t=s.title)}),t}})},i={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"user-detail-wrap"},[s("div",{staticClass:"form-wrap"},[s("el-form",{ref:"form",attrs:{model:e.formData,"label-position":"left","label-width":"140px",size:"mini"}},[s("el-form-item",{staticClass:"el-form-item-inline",attrs:{label:"个人信息"}},[e._v("\n        "+e._s(e.userInfo.loginName)+"\n      ")]),e._v(" "),s("el-form-item",{staticClass:"el-form-item-inline",attrs:{label:"姓名"}},[e._v("\n        "+e._s(e.userInfo.realName)+"\n      ")]),e._v(" "),s("el-form-item",{staticClass:"el-form-item-inline",attrs:{label:"手机号"}},[e._v("\n        "+e._s(e.userInfo.mobile)+"\n      ")]),e._v(" "),s("el-form-item",{staticClass:"el-form-item-inline",attrs:{label:"教学中心角色"}},[e._v("\n        "+e._s(e.userInfo.roleName)+"\n      ")]),e._v(" "),s("el-form-item",{attrs:{label:"菜单权限"}},[s("div",{staticStyle:{overflow:"hidden"}},[s("el-table",{staticStyle:{width:"95%"},attrs:{data:e.userInfo.funList,border:""}},[s("el-table-column",{attrs:{label:"一级功能菜单",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[s("span",{staticClass:"fs14"},[e._v(e._s(t.row.name))])]}}])}),e._v(" "),s("el-table-column",{attrs:{prop:"address",label:"二级功能菜单"},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(t.row.childList,function(t){return s("span",{key:t.id,staticClass:"mr60 usual-span fz12"},[e._v(e._s(t.name))])})}}])})],1)],1)]),e._v(" "),s("el-form-item",{attrs:{label:"授课类型"}},[1==e.userInfo.isAllScope?s("div",[e._v("全部")]):s("div",e._l(e.userInfo.teachingTypeList,function(t){return s("span",{key:t,staticClass:"mr60"},[e._v(e._s(e.handleType(t)))])}),0)]),e._v(" "),s("el-form-item",{attrs:{label:"项目科目权限"}},[1==e.userInfo.isAllScope?s("div",[e._v("全部")]):s("div",{staticStyle:{overflow:"hidden"}},[s("el-table",{staticStyle:{width:"95%"},attrs:{data:e.userInfo.scopeList,border:""}},[s("el-table-column",{attrs:{label:"项目",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[s("span",{staticClass:"fs14"},[e._v(e._s(t.row.itemName))])]}}])}),e._v(" "),s("el-table-column",{attrs:{prop:"address",label:"科目"},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(t.row.courseCategoryList,function(t){return s("span",{key:t.courseCategoryId,staticClass:"mr60 usual-span fz12"},[e._v(e._s(t.courseCategoryName))])})}}])})],1)],1)])],1)],1)])},staticRenderFns:[]};var u=s("C7Lr")(o,i,!1,function(e){s("J3vu")},null,null);t.default=u.exports},J3vu:function(e,t){}});
//# sourceMappingURL=8.7637457b9bf8a8599cc3.js.map