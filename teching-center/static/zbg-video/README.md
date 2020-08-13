# 中博视频播放插件

![视频播放器](/public/zbg-video.png)

![视频播放器全屏](/public/zbg-video-fullscreen.png)
```
npm i
npm start
```

```
浏览器打开http://localhost:3030/demo.html

说明： 
index.html 播放器
demo.html 简单例子

```



### 食用指南

```
 
  创建一个iframe引用index.html页面

  <iframe id="iframe" name="iframe" allowfullscreen="true" allowtransparency="true" width="100%" height="100%" scrolling="no" frameborder="0" src="index.html?ccid=313A5C7994F57292&amp;seek=0&amp;token=&amp;memberId=&amp;memberName=&amp;categoryId=&amp;categoryName=&amp;subjectId=&amp;subjectName=&amp;classId=&amp;courseId=&amp;courseName=&amp;chapterId=&amp;chapterName=&amp;taskId=&amp;taskName="></iframe>

  iframe接收的参数,加*的为必填, 
  //courseType:  onlinecourse: 标准网课, ezcourse: ez课, classcourse: 优播课,facecourse: 面授课, livelesson: 直播课
  courseType="ezcourse" 
  *ccid=313A5C7994F57292
  siteid=
  seek=
  *token=
  *memberId=
  *memberName=
  *phone=
  *categoryId=
  *categoryName=
  *subjectId=
  *subjectName=
  *classId=
  *courseId=
  *courseName=
  *chapterId=
  *chapterName=
  *taskId=
  *taskName=
  isSidebar= 
<!--
  全局参数 章节列表、周列表
  // onlinecourse: 标准网课
  window.playList = {
    "chapterTitle": "Topic 3.Sales and purchases; sales tax; inventory （IAS2）",
    "chapterId": "8a22ecb55e755132015f0956c432043b",
    "knowledgePointId": "",
    "isFree": "false",
    "orderList": 5,
    "isLeaf": "true",
    "videoTime": 5077,
    "openTime": 0,
    "examTime": 0,
    "videoNum": 3,
    "openNum": 0,
    "examNum": 0,
    "pdfreadNum": 0,
    "entryNum": 0,
    "knowledgePointExerciseNum": 0,
    "tasks": [{
      "id": "8a22ecb55e755132015f006f0f8803f3",
      "taskId": "8a22ecb55e755132015f09601696044f",
      "title": "3.Sales and purchases; sales tax; inventory （IAS2）-1",
      "taskType": "video",
      "taskLevel": null,
      "orderTask": 1,
      "express": null,
      "attachmentPath": "",
      "videoTime": "1549",
      "videoSiteId": "E5DD260925A6084B",
      "apiKey": "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
      "videoCcid": "DD14CEB2A9596B089C33DC5901307461",
      // "videoCcid": "313A5C7994F57292",
      "taskTime": "1549"
    }, {
      "id": "8a22ecb55e755132015f006f404d03f4",
      "taskId": "8a22ecb55e755132015f0960447c0450",
      "title": "3.Sales and purchases; sales tax; inventory （IAS2）-2",
      "taskType": "video",
      "taskLevel": null,
      "orderTask": 2,
      "express": null,
      "attachmentPath": "",
      "videoTime": "1034",
      "videoSiteId": "E5DD260925A6084B",
      "apiKey": "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
      "videoCcid": "58C34A3DEA3220FB9C33DC5901307461",
      "taskTime": "1034"
    }, {
      "id": "2c90f89c60af8db00160c0904c60017d",
      "taskId": "69df85f689382b9d45c182c965c34292",
      "title": "3.Sales and purchases; sales tax; inventory （IAS2）-3",
      "taskType": "video",
      "taskLevel": "core",
      "orderTask": 3,
      "express": null,
      "attachmentPath": "",
      "videoTime": "2494",
      "videoSiteId": "E5DD260925A6084B",
      "apiKey": "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
      // "videoCcid": "0E37F1E6E4DFC95C9C33DC5901307461",
      "videoCcid": "313A5C7994F57292",
      "taskTime": "2494"
    }],
    "chapterFiles": [],
    "chapterExtends": [],
    "children": []
  }
  // ezcourse: ez课, classcourse: 优播课,facecourse: 面授课, livelesson: 直播课
  window.playList = [{
          "isChildren": "false",
          "isTasks": true,
          "level": 1,
          "rootNode": "0",
          "parentNode": "0",
          "node": "0",
          "orderList": 1000000,
          "isFree": "false",
          "title": "客观题",
          "chapterId": "41e69e0d39f02df58e84ea15e84a30e8",
          "tasks": [{
            "id": "992968dd95bb303f2cb87e45918858d3",
            "taskId": "85da77249a8d65e4f30fd5bb1b87b4de",
            "title": "客观题-Dec 2014-1",
            "taskType": "video",
            "taskLevel": "core",
            "orderTask": 1,
            "express": null,
            "taskTime": "1220",
            "attachmentPath": "",
            "videoSiteId": "E5DD260925A6084B",
            "videoCcid": "B9FFACAC55A96FAC9C33DC5901307461",
            "apiKey": "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
            "categoryId": "ff808081473905e701475cd3c2080001",
            "categoryName": "ACCA",
            "subjectId": "ff808081473905e701475d4ec4d60006",
            "subjectName": "F8",
            "courseId": "6e70583e916e77626f4e1ffea6d9a8d6",
            "courseName": "ACCA F8 历年客观题目解析",
            "chapterId": "41e69e0d39f02df58e84ea15e84a30e8",
            "chapterTitle": "客观题",
            "studyTime": 1008,
            "state": 0,
            "progress": 24,
            "total": 1220,
            "percentage": 2,
            "isFree": "false"
          }, {
            "id": "210ec3ca9f7485f2602635d24dfcda49",
            "taskId": "5a98bc7735613e1abaa289b4bde5c45c",
            "title": "客观题-Dec 2014-2",
            "taskType": "video",
            "taskLevel": "core",
            "orderTask": 2,
            "express": null,
            "taskTime": "839",
            "attachmentPath": "",
            "videoSiteId": "E5DD260925A6084B",
            "videoCcid": "36CC344A42FF892C9C33DC5901307461",
            "apiKey": "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
            "categoryId": "ff808081473905e701475cd3c2080001",
            "categoryName": "ACCA",
            "subjectId": "ff808081473905e701475d4ec4d60006",
            "subjectName": "F8",
            "courseId": "6e70583e916e77626f4e1ffea6d9a8d6",
            "courseName": "ACCA F8 历年客观题目解析",
            "chapterId": "41e69e0d39f02df58e84ea15e84a30e8",
            "chapterTitle": "客观题",
            "studyTime": 0,
            "state": 0,
            "progress": -1,
            "total": 0,
            "percentage": 0,
            "isFree": "false"
          }, {
            "id": "f3616e45f3e690fbc8e28bf0626be665",
            "taskId": "ba5b14d26514fad7db5c814ba07d46d6",
            "title": "客观题-Jun 2015-1",
            "taskType": "video",
            "taskLevel": "core",
            "orderTask": 3,
            "express": null,
            "taskTime": "964",
            "attachmentPath": "",
            "videoSiteId": "E5DD260925A6084B",
            "videoCcid": "E80BA6CB4ACE5EC69C33DC5901307461",
            "apiKey": "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
            "categoryId": "ff808081473905e701475cd3c2080001",
            "categoryName": "ACCA",
            "subjectId": "ff808081473905e701475d4ec4d60006",
            "subjectName": "F8",
            "courseId": "6e70583e916e77626f4e1ffea6d9a8d6",
            "courseName": "ACCA F8 历年客观题目解析",
            "chapterId": "41e69e0d39f02df58e84ea15e84a30e8",
            "chapterTitle": "客观题",
            "studyTime": 0,
            "state": 0,
            "progress": -1,
            "total": 0,
            "percentage": 0,
            "isFree": "false"
          }, {
            "id": "35685f20ea1e37caa510985475dd0447",
            "taskId": "2fd60eb13868411a4a8d541036b9ce83",
            "title": "客观题-Jun 2015-2",
            "taskType": "video",
            "taskLevel": "core",
            "orderTask": 4,
            "express": null,
            "taskTime": "868",
            "attachmentPath": "",
            "videoSiteId": "E5DD260925A6084B",
            "videoCcid": "9832C9D410948CB49C33DC5901307461",
            "apiKey": "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
            "categoryId": "ff808081473905e701475cd3c2080001",
            "categoryName": "ACCA",
            "subjectId": "ff808081473905e701475d4ec4d60006",
            "subjectName": "F8",
            "courseId": "6e70583e916e77626f4e1ffea6d9a8d6",
            "courseName": "ACCA F8 历年客观题目解析",
            "chapterId": "41e69e0d39f02df58e84ea15e84a30e8",
            "chapterTitle": "客观题",
            "studyTime": 0,
            "state": 0,
            "progress": -1,
            "total": 0,
            "percentage": 0,
            "isFree": "false"
          }, {
            "id": "01050626ec5da5dfa4d1f8b010679eb7",
            "taskId": "ad4a4f9502caa7e0e9026f16ad43835e",
            "title": "客观题-Sep 2016-1",
            "taskType": "video",
            "taskLevel": "core",
            "orderTask": 5,
            "express": null,
            "taskTime": "1010",
            "attachmentPath": "",
            "videoSiteId": "E5DD260925A6084B",
            "videoCcid": "9595BCEF7ABA2F679C33DC5901307461",
            "apiKey": "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
            "categoryId": "ff808081473905e701475cd3c2080001",
            "categoryName": "ACCA",
            "subjectId": "ff808081473905e701475d4ec4d60006",
            "subjectName": "F8",
            "courseId": "6e70583e916e77626f4e1ffea6d9a8d6",
            "courseName": "ACCA F8 历年客观题目解析",
            "chapterId": "41e69e0d39f02df58e84ea15e84a30e8",
            "chapterTitle": "客观题",
            "studyTime": 0,
            "state": 0,
            "progress": -1,
            "total": 0,
            "percentage": 0,
            "isFree": "false"
          }, {
            "id": "1eb0256d475edd17c3b57bc4bc1a9539",
            "taskId": "e8d78cc699ba3eabb898f0410b420f31",
            "title": "客观题-Sep 2016-2",
            "taskType": "video",
            "taskLevel": "core",
            "orderTask": 6,
            "express": null,
            "taskTime": "802",
            "attachmentPath": "",
            "videoSiteId": "E5DD260925A6084B",
            "videoCcid": "112CD8A9FABB6DC79C33DC5901307461",
            "apiKey": "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
            "categoryId": "ff808081473905e701475cd3c2080001",
            "categoryName": "ACCA",
            "subjectId": "ff808081473905e701475d4ec4d60006",
            "subjectName": "F8",
            "courseId": "6e70583e916e77626f4e1ffea6d9a8d6",
            "courseName": "ACCA F8 历年客观题目解析",
            "chapterId": "41e69e0d39f02df58e84ea15e84a30e8",
            "chapterTitle": "客观题",
            "studyTime": 0,
            "state": 0,
            "progress": -1,
            "total": 0,
            "percentage": 0,
            "isFree": "false"
          }, {
            "id": "90d9546e36ffffcdf7076002b1485366",
            "taskId": "659dd5b3e815c0e508b620b334a8a00d",
            "title": "客观题-Sep 2016-3",
            "taskType": "video",
            "taskLevel": "core",
            "orderTask": 7,
            "express": null,
            "taskTime": "902",
            "attachmentPath": "",
            "videoSiteId": "E5DD260925A6084B",
            "videoCcid": "9FE64C109D8B56DC9C33DC5901307461",
            "apiKey": "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
            "categoryId": "ff808081473905e701475cd3c2080001",
            "categoryName": "ACCA",
            "subjectId": "ff808081473905e701475d4ec4d60006",
            "subjectName": "F8",
            "courseId": "6e70583e916e77626f4e1ffea6d9a8d6",
            "courseName": "ACCA F8 历年客观题目解析",
            "chapterId": "41e69e0d39f02df58e84ea15e84a30e8",
            "chapterTitle": "客观题",
            "studyTime": 0,
            "state": 0,
            "progress": -1,
            "total": 0,
            "percentage": 0,
            "isFree": "false"
          }, {
            "id": "6bb7a6524aeef779096b71604d9117bb",
            "taskId": "7f9ca81b67997f565c51f414f58d569f",
            "title": "客观题-Specimen 2016-1",
            "taskType": "video",
            "taskLevel": "core",
            "orderTask": 8,
            "express": null,
            "taskTime": "801",
            "attachmentPath": "",
            "videoSiteId": "E5DD260925A6084B",
            "videoCcid": "A20E555B30440B0B9C33DC5901307461",
            "apiKey": "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
            "categoryId": "ff808081473905e701475cd3c2080001",
            "categoryName": "ACCA",
            "subjectId": "ff808081473905e701475d4ec4d60006",
            "subjectName": "F8",
            "courseId": "6e70583e916e77626f4e1ffea6d9a8d6",
            "courseName": "ACCA F8 历年客观题目解析",
            "chapterId": "41e69e0d39f02df58e84ea15e84a30e8",
            "chapterTitle": "客观题",
            "studyTime": 0,
            "state": 0,
            "progress": -1,
            "total": 0,
            "percentage": 0,
            "isFree": "false"
          }, {
            "id": "7585f3577f331ac23d6c99e8de78fae5",
            "taskId": "f93d909ff0b84442d64fbc2af25651d6",
            "title": "客观题-Specimen 2016-2",
            "taskType": "video",
            "taskLevel": "core",
            "orderTask": 9,
            "express": null,
            "taskTime": "1108",
            "attachmentPath": "",
            "videoSiteId": "E5DD260925A6084B",
            "videoCcid": "F630B60139C9689C9C33DC5901307461",
            "apiKey": "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
            "categoryId": "ff808081473905e701475cd3c2080001",
            "categoryName": "ACCA",
            "subjectId": "ff808081473905e701475d4ec4d60006",
            "subjectName": "F8",
            "courseId": "6e70583e916e77626f4e1ffea6d9a8d6",
            "courseName": "ACCA F8 历年客观题目解析",
            "chapterId": "41e69e0d39f02df58e84ea15e84a30e8",
            "chapterTitle": "客观题",
            "studyTime": 0,
            "state": 0,
            "progress": -1,
            "total": 0,
            "percentage": 0,
            "isFree": "false"
          }, {
            "id": "03742ca8d47558e641a3ab5c49b944f1",
            "taskId": "345c0a3a403eef1808194ffc07d13d4d",
            "title": "客观题-Specimen 2016-3",
            "taskType": "video",
            "taskLevel": "core",
            "orderTask": 10,
            "express": null,
            "taskTime": "786",
            "attachmentPath": "",
            "videoSiteId": "E5DD260925A6084B",
            "videoCcid": "6BC7FABA07BE6D459C33DC5901307461",
            "apiKey": "3tF0Ao1MWHEdFp4Lf4LuEgkU8LKpOPLi",
            "categoryId": "ff808081473905e701475cd3c2080001",
            "categoryName": "ACCA",
            "subjectId": "ff808081473905e701475d4ec4d60006",
            "subjectName": "F8",
            "courseId": "6e70583e916e77626f4e1ffea6d9a8d6",
            "courseName": "ACCA F8 历年客观题目解析",
            "chapterId": "41e69e0d39f02df58e84ea15e84a30e8",
            "chapterTitle": "客观题",
            "studyTime": 4,
            "state": 0,
            "progress": 1,
            "total": 786,
            "percentage": 1,
            "isFree": "false"
          }],
          "progress": 0,
          "chapterStudyTime": 1012,
          "chapterTotalTime": 9300
        }]
  
-->


```


eg：demo.html
