// 获取url的参数
function getQueryObj(href) {
  var result = href.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
  var resultObj = {};
  for (var i = 0; i < result.length; i++) {
    result[i] = result[i].substring(1);
    var resultSplit = result[i].split('=');
    resultObj[resultSplit[0]] = resultSplit[1];
  }
  // console.log(resultObj)
  return resultObj;
}
// console.log(getQueryString())
function setQuery(obj){
  var query = '';
  if(obj){
    for(var k in obj){
      query +=  '&' + k + '=' + obj[k]
    }
    
  }
  // console.log(query)
  return query.replace('&',"?");
}
// console.log(setQuery(getQueryString(window.location.href)))



// 获取url的参数
function GetQueryString(name){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  decodeURI(r[2]); return null;
}

// 创建script
function createScript(url, dom){
  var script=document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", url);
  if(dom){
    var dom = document.getElementById(dom);
    var domChildNodes = dom.childNodes;
    
    dom.removeChild(dom.childNodes[0]);
    dom.appendChild(script)
    // if(domChildNodes && domChildNodes.length){
    //   dom.appendChild(script);
    // }else{
    //   dom.appendChild(script);
    // }
    
  }else{
    var body = document.getElementsByTagName("body");
    if(body.length){
      body[0].appendChild(script);
    }else{
      document.documentElement.appendChild(script);
    }
  }
}

function formatSeconds(value, type) {
  var theTime = parseInt(value); // 秒
  var theTime1 = 0; // 分
  var theTime2 = 0; // 小时
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    
    if (parseInt(theTime / 60) > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  var result = "";
  
  if (type == 'h') {
    if (theTime > 9) {
      result = parseInt(theTime) + "s";
    } else if (theTime > 0) {
      result = "0" + parseInt(theTime) + "s";
    } else {
      result = "0" + "s";
    }
    if (theTime1 > 9) {
      result = parseInt(theTime1) + "m" + result;
    } else if (theTime1 > 0) {
      result = "0" + parseInt(theTime1) + "m" + result;
    } else {
      result = "0" + "m" + result;
    }
    // if(theTime > 0) {
    //     result = parseInt(theTime)+"s"+result;
    // }
    // if(theTime1 > 0) {
    //     result = parseInt(theTime1)+"m"+result;
    // }
    // if(theTime2 > 0) {
    //     result = parseInt(theTime2)+"h"+result;
    // }
    if (theTime2 > 9) {
      result = parseInt(theTime2) + "h" + result;
    } else if (theTime2 > 0) {
      result = parseInt(theTime2) + "h" + result;
    } else {
      result = "0" + "h" + result;
    }
  } else {
    // if (theTime > 9) {
    //   result = parseInt(theTime);
    // } else if (theTime > 0) {
    //   result = "0" + parseInt(theTime);
    // } else {
    //   result = "00";
    // }
    // if (theTime2 > 0) {
    //   theTime1 = theTime1 + theTime2 * 60;
    // }
    // if (theTime1 > 9) {
    //   result = parseInt(theTime1) + ":" + result;
    // } else if (theTime1 > 0) {
    //   result = "0" + parseInt(theTime1) + ":" + result;
    // } else {
    //   result = "00" + ":" + result;
    // }
    if (theTime > 9) {
      result = parseInt(theTime);
    } else if (theTime > 0) {
      result = "0" + parseInt(theTime);
    } else {
      result = "00";
    }
    if (theTime2 > 0) {
      theTime1 = theTime1 + theTime2 * 60;
    }
    if (theTime1 > 9) {
      result = parseInt(theTime1) + ":" + result;
    } else if (theTime1 > 0) {
      result = "0" + parseInt(theTime1) + ":" + result;
    } else {
      result = "00" + ":" + result;
    }

    if (theTime2 > 0) {
      result = parseInt(theTime2) + ":" + result;
    }
    
  }
  return result;
}



