var calender_month;
var calender_year;

$(function(){
    var myDate = new Date();
    calender_year = myDate.getFullYear();	// 年を取得
    calender_month = myDate.getMonth();	// 月を取得(0月～11月)
    setCalender(calender_year,calender_month);

    $('.next').click(function(){

        calender_month++;
        if(calender_month == 12){
            calender_month = 0;
            calender_year++;
        }
        $('#calendarbody').empty();
        $('#monthyear').empty();
        $('#calendarbody').text(setCalender(calender_year,calender_month));
    });

    $('.back').click(function(){

        calender_month--;
        if(calender_month == -1){
            calender_month = 11;
            calender_year--;
        }
        $('#calendarbody').empty();
        $('#monthyear').empty();
        $('#calendarbody').text(setCalender(calender_year,calender_month));
    });
});

/**
 * make calender
 * @param {number} y full year e.g. 2019
 * @param {number} l month minus one 0-11
 */
function setCalender(y,l){
    'use strict';

    var worktimes_for_month_l = {}

	for (var i = 0; i < WORKTIME_ARRAY.length; i++) {
        var WORKTIME = WORKTIME_ARRAY[i];
        if (WORKTIME.start.getMonth() === l){
            var key = WORKTIME.getDayKey();
            if (!worktimes_for_month_l.hasOwnProperty(key)){
                worktimes_for_month_l[key] = []
            }
            worktimes_for_month_l[key].push(WORKTIME.thfs('{h}:{m}'));
        }
    }

    var myDate = new Date();
    var myToday = myDate.getDate();	// 今日の'日'を退避
    var todayMyMonth = myDate.getMonth();	// 月を取得(0月～11月)
    var $calendarbody = $('#calendarbody');
    var $monthyear = $('#monthyear');
    var myWeekTbl = new Array('Mon','Tue','Wed','Thu','Fri','Sat','Sun');	// 曜日テーブル定義
    var myMonthTbl= new Array(31,28,31,30,31,30,31,31,30,31,30,31);	// 月テーブル定義
    var myYear = y;
    myDate = new Date(myYear,l);	// 今日の日付データ取得

    ((myYear % 4)===0 && (myYear % 100) !==0) || (myYear % 400)===0 ? myMonthTbl[1] = 29: 28;	// うるう年だったら...
    // ２月を２９日とする
    var myMonth = myDate.getMonth();	// 月を取得(0月～11月)
    var Month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    myDate.setDate(1);	// 日付を'１日'に変えて、
    var myWeek = myDate.getDay() - 1;	// '１日'の曜日を取得
    var myTblLine = Math.ceil((myWeek+myMonthTbl[myMonth])/7);	// カレンダーの行数
    var myTable = new Array(7*myTblLine);	// 表のセル数を用意
    for(var i=0; i<7*myTblLine; i++){
        myTable[i]=' ';	// セルを全て空にする
    }
    for(i=0; i<myMonthTbl[myMonth]; i++){
       myTable[i+myWeek]=i+1;	// 日付を埋め込む
    }

    var source = '';
    var td = '<td>';
    var tdC = '</td>';
    var tr = '<tr>';
    var trC = '</tr>';

    for(i=0; i<myTblLine; i++){	// 表の「行」のループ
      var thisMonth = parseInt(myMonth) + 1;
        source += tr;
        for (var j = 0; j < 7; j++) {
            var mydat = myTable[j+(i*7)];
            if (mydat === ' '){
                source += '<td> </td>';
                continue;
            } else {
                var daykey = y+"/"+thisMonth+"/"+mydat;
                if (worktimes_for_month_l.hasOwnProperty(daykey)){
                    var desc = worktimes_for_month_l[daykey].join('<br>')
                    var attr_today = todayMyMonth === myMonth && mydat === myToday ? 'id="today" ' : '';
                    source += '<td '+attr_today+'data-key="'+myYear+'/'+thisMonth+'/'+mydat
                        +'"><div class="cal_workday" data-toggle="calender_tooltip" title="勤務時間: <br>'+desc+'">' + mydat + '</div>' + tdC;
                } else {
                    var attr_today = todayMyMonth === myMonth && mydat === myToday ? 'id="today" ' : '';
                    source += '<td '+attr_today+'data-key="'+myYear+'/'+thisMonth+'/'+mydat
                        +'" onclick=""><div>' + mydat + '</div>' + tdC;
                }
            }
        }
        source += trC;
    }
    var week = '';
    for(var k=0; k<7; k++){	// 曜日
        if(k === 5){
            week += '<td class="sat">' + myWeekTbl[k] + tdC;
        }else if(k === 6){
            week += '<td class="sun">' + myWeekTbl[k] + tdC;
        }else{
            week += td + myWeekTbl[k] + tdC;
        }
    }
    var weekTr = tr + week + trC;
    var tableSource = weekTr + source;
    var mandy = Month[myMonth] + "." + myYear

    $calendarbody.append(tableSource);
    $monthyear.append(mandy);
    $('[data-toggle="calender_tooltip"]').tooltip({
        html:true,
        placement: "auto",
        template: '<div class="tooltip cal_tooltip" role="tooltip"><div class="arrow"></div><div class="calender-hover tooltip-inner"></div></div>'
    })
}


//イメージしてること！
//ok   勤務が入ってる日なら、適当になんかクラスを追加してCSSで、カレンダーを見て勤務日が分かるようにしたい
//ok   日を選べば、その日の勤務時間が分かるようにしたい！
//mada 日を選んで、その日の勤務を編集したり、その日に勤務を追加したりもしたいけど
//それは既存の関数でいけそうなきがする
//CSSの調整ぐらいは自分で頑張れる気がするけど
//勤務日かどうかの判定をどうすればいいのかさっぱり、、、
//とりあえずすべての日付のtd要素に、classを与えてみた。
//<td class="2019/01/29">29</td>みたいな
//で、worktimeオブジェクトを、プロパティで調べて、勤務があったらみたいな感じかなと思ってんけど
//いまいちworktimeオブジェクトの構造を理解してなくて、、、
