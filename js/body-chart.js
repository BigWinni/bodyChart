
/*v1.0.2   2017.07.06
 取消使用 hand&foot hover image
 */


/**  output!!!!!!
 _BodyChart.checkedArea ---------------------选中的身体部位ID字符串**/
/**  input!!!!!!!
 _BodyChart.AreaKeyString -------------------初始默认选中的部位ID字符串，如果有需要默认选中的部位，把名称字符串赋值到该变量中**/

var _BodyChart = _BodyChart||{};
var jsImgTagBodyChartPrefix = "";


//output！！！最后获得的选中的身体部位名称
_BodyChart.checkedArea = '';
_BodyChart.AreaKeyString = '';//例（注：英文逗号）：'77,78';


//根据页面大小重新设置长宽
_BodyChart.resizeBodyChart = function(){
    var wh = $( window ).height();
    var divheight = (wh-90)*0.76;

    //$(".body-chart-img-div").css('width',divheight+200);
    //$(".body-chart-img-div").css('height',divheight);


    $("#img_front_body").mapster('resize',divheight,divheight);
    $("#img_back_body").mapster('resize',divheight,divheight);
    $("[id^='mapster_wrap']").css("margin", "auto");
}


$(function(){
    //页面resize后尺寸自适应
    $(window).resize(function(){
        _BodyChart.resizeBodyChart();
    });


var template = {
    fillOpacity: 0.7,
    fillColor: "F23530",
    isSelectable: true,
    mapKey: 'partID',
    toolTip:'title',
    showToolTip: true,
    scaleMap: true,
    onclick:function(data) {
        console.log(data);
    }
};

//前面身子mapster初始化

var front_body_set = {
    altImage:jsImgTagBodyChartPrefix + 'img/body_front_with_PainPt.png',
    areas:[
        {
            key:'FRF',
            render_highlight:{
                altImage:jsImgTagBodyChartPrefix + 'img/body_front_hover_foot_hand.png'
            },
            isSelectable: false
        },
        {
            key:'FLF',
            render_highlight:{
                altImage: jsImgTagBodyChartPrefix + 'img/body_front_hover_foot_hand.png'
            },
            isSelectable: false
        },
        {
            key:'FLH',
            render_highlight:{
                altImage: jsImgTagBodyChartPrefix + 'img/body_front_hover_foot_hand.png'
            },
            isSelectable: false
        },
        {
            key:'FRH',
            render_highlight:{
                altImage: jsImgTagBodyChartPrefix + 'img/body_front_hover_foot_hand.png'
            },
            isSelectable: false
        }
    ]
}
$('#img_front_body').mapster($.extend({}, template,front_body_set ));


//背面身子mapster初始化

var back_body_set = {
    altImage:jsImgTagBodyChartPrefix + 'img/body_back_with_PainPt.png',
    areas:[
        {
            key:'BRF',
            render_highlight:{
                altImage:jsImgTagBodyChartPrefix + 'img/body_back_hover_foot_hand.png'
            },
            isSelectable: false
        },
        {
            key:'BLF',
            render_highlight:{
                altImage:jsImgTagBodyChartPrefix + 'img/body_back_hover_foot_hand.png'
            },
            isSelectable: false
        },
        {
            key:'BLH',
            render_highlight:{
                altImage:jsImgTagBodyChartPrefix + 'img/body_back_hover_foot_hand.png'
            },
            isSelectable: false
        },
        {
            key:'BRH',
            render_highlight:{
                altImage:jsImgTagBodyChartPrefix + 'img/body_back_hover_foot_hand.png'
            },
            isSelectable: false
        }
    ]
}
$('#img_back_body').mapster($.extend({}, template, back_body_set));

//左手mapster初始化
$('#img_left_hand').mapster($.extend({}, template, {altImage:jsImgTagBodyChartPrefix + 'img/left_hand_with_PT.png'}));

//右手mapster初始化
$('#img_right_hand').mapster($.extend({}, template, {altImage:jsImgTagBodyChartPrefix + 'img/right_hand_with_PT.png'}));

//左脚mapster初始化
$('#img_left_foot').mapster($.extend({}, template, {altImage:jsImgTagBodyChartPrefix + 'img/left_foot_with_PT.png'}));

//右脚mapster初始化
$('#img_right_foot').mapster($.extend({}, template, {altImage:jsImgTagBodyChartPrefix + 'img/right_foot_with_PT.png'}));

//resize bodychart 使其适应页面的长宽
_BodyChart.resizeBodyChart();

/*设置打开人体图时默认已经选中的部位*/
$(".bodypart_pic").mapster("set",true,_BodyChart.AreaKeyString);
});

/*数组去重*/
Array.prototype.unique = function(){
    var res = [];
    var json = {};
    for(var i = 0; i < this.length; i++){
        if(!json[this[i]]){
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
}
/**
 判断数组中是否包含某元素
 */
Array.prototype.contains = function (needle) {
    for (i in this) {
        if (this[i] == needle) return true;
    }
    return false;
}
//移除数组中某个元素
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

//获取数组arr中val的数量
function countsInArray(arr, val) {
    var num = 0;
    arr.forEach(function (ele) {
        ele === val ? num++ : '';
    });
    return num;
}

//获取最终的选中的身体部位
$("#submitResults").click(function() {
    $("#BC_MainModal").modal("hide");
});
$("#BC_MainModal").on("hide.bs.modal",function() {
    var result = '';
    $('.bodypart_pic').each(function(index){
        if ($(this).attr("alt") != null) {
            var areaHighlight = $(this).mapster("get");
            if(areaHighlight){
                result += areaHighlight;
                result += ",";
            }
        }
    });
    var BC_Arr = result.substring(0, result.length - 1).split(",");
    
    _BodyChart.checkedArea = BC_Arr.unique();

    //如果这个部位打开时已经默认选中，
    //而这个部位是有不止一个的位置可选（如身体正面和背面都可以选“右肘关节”），
    //而且最终获取到的该部位已选择的数量是1，
    //  说明这个部位是被取消选中了的，先放到arr_shouldDel中
    var arr_shouldDel = [];
    _BodyChart.checkedArea.forEach(function (ele) {
        if (_BodyChart.AreaKeyString.contains(ele)
            && $("area[partid=" + ele + "]").length > 1
            && 1 == countsInArray(BC_Arr, ele) ) {

            arr_shouldDel.push(ele);
        }
    });
    //如果有需要删除的部位，统一进行删除
    if (arr_shouldDel.length > 0) {
        arr_shouldDel.forEach(function(ele) {
            _BodyChart.checkedArea.remove(ele);
        });
        
    }
    
    console.log(_BodyChart.checkedArea);

});

//关闭modal
$("#BC_modal_ok").click(function(){
    $("#BC_Modal").modal("hide");
});

/*//清除该modal页面中所有已选的area
 $("#BC_modal_cancel").click(function(){
 var imgs = $(this).closest(".modal-body").find(".bodypart_pic");
 imgs.each(function(){
 if($(this).closest(".modal_hot_area").css("display")!="none" && $(this).attr("alt")!=null){
 var areaHighlight = $(this).mapster("get");
 if(areaHighlight){
 $(this).mapster("set",false,areaHighlight);
 }
 }
 });
 $("#BC_Modal").modal("hide");
 });
 */
//关节hover时显示关节名称
$(".joint").bind("mouseenter", function () {
    $("#bodypart_name").text($(this).attr("title"));
    $("#bodypart_name").show();
});
$(".joint").bind("mouseleave", function () {
    $("#bodypart_name").hide();
});
//关节hover时显示关节名称
$(".modal_joint").bind("mouseenter", function () {
    var partname = $(this).attr("title");
    $("#modal_bodypart_name").html(partname);
    $("#modal_bodypart_name").show();
});
$(".modal_joint").bind("mouseleave", function () {
    $("#modal_bodypart_name").hide();
});
//打开左手大图
_BodyChart.openLeftHand = function(){
    $("#BC_Modal").modal("toggle");//打开模态框
    $("#modal_bodyChart_title").text("人体图-左手");
    $(".modal_hot_area").hide();
    $("#left_hand_div").show();
}
$("#front_left_hand").click(function(){
    _BodyChart.openLeftHand();
});
$("#back_left_hand").click(function(){
    _BodyChart.openLeftHand();
});


//打开右手大图
_BodyChart.openRightHand = function(){
    $("#BC_Modal").modal("toggle");//打开模态框
    $("#modal_bodyChart_title").text("人体图-右手");
    $(".modal_hot_area").hide();
    $("#right_hand_div").show();
}
$("#front_right_hand").click(function(){
    _BodyChart.openRightHand();
});
$("#back_right_hand").click(function(){
    _BodyChart.openRightHand();
});


//打开右脚大图
_BodyChart.openRightFoot = function(){
    $("#BC_Modal").modal("toggle");//打开模态框
    $("#modal_bodyChart_title").text("人体图-右脚");
    $(".modal_hot_area").hide();
    $("#right_foot_div").show();
}
$("#front_right_foot").click(function(){
    _BodyChart.openRightFoot();
});
$("#back_right_foot").click(function(){
    _BodyChart.openRightFoot();
});



//打开左脚大图
_BodyChart.openLeftFoot = function(){
    $("#BC_Modal").modal("toggle");//打开模态框
    $("#modal_bodyChart_title").text("人体图-左脚");
    $(".modal_hot_area").hide();
    $("#left_foot_div").show();
}
$("#front_left_foot").click(function(){
    _BodyChart.openLeftFoot();
});
$("#back_left_foot").click(function(){
    _BodyChart.openLeftFoot();
});


//打开身体正面图
$("#BodyFrontPage").click(function(){
    $("#BodyFrontPage").hide();
    $("#BodyBackPage").show();
    $(".hot_area").hide();
    $("#front_body_div").show();
});
//打开身体背面图
$("#BodyBackPage").click(function(){
    $("#BodyFrontPage").show();
    $("#BodyBackPage").hide();
    $(".hot_area").hide();
    $("#back_body_div").show();
});




