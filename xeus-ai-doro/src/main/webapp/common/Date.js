/**
 * Date 객체 프로포타입 이벤트 입니다.
 *
 * @author 이주영
 */
(function(){

	/**
	 * 현재 년 을 리턴합니다.
	 * @returns
	 */
	Date.prototype.getY = function() {
		var date = new Date();
		return  "" + date.getFullYear();
	};

	/**
	 * 현재 년월 을 리턴합니다.
	 * @returns
	 */
	Date.prototype.getYM = function() {
		var date = new Date();
		var month = (date.getMonth() + 1);
		if(Number(month) < 10){ month = "0" + month; }
		return  "" + date.getFullYear() +
				"" + month;
	};

	/**
	 * 현재 년월일 을 리턴합니다.
	 * @returns
	 */
	Date.prototype.getYMD = function(format) {
		var date = new Date();
		var month = (date.getMonth() + 1);
		var day = date.getDate();
		if(Number(month) < 10){ month = "0" + month; }
		if(Number(day) < 10){ day = "0" + day; }
		if(format){
			return  "" + date.getFullYear() +
					"-" + month +
					"-" + day;
		}else{
			return  "" + date.getFullYear() +
					"" + month +
					"" + day;
		}
	};

	/**
	 * 현재 년월일시 을 리턴합니다.
	 * @returns
	 */
	Date.prototype.getYMDH = function(format) {
		var date = new Date();
		var month = (date.getMonth() + 1);
		var day = date.getDate();
		var hrs = date.getHours();
		if(Number(month) < 10){ month = "0" + month; }
		if(Number(day) < 10){ day = "0" + day; }
		if(Number(hrs) < 10){ hrs = "0" + hrs; }
		if(format){
			return  "" + date.getFullYear() +
					"-" + month +
					"-" + day +
					" " + hrs;
		}else{
			return  "" + date.getFullYear() +
					"" + month +
					"" + day +
					"" + hrs;
		}
	};

	/**
	 * 현재 년월일시분 을 리턴합니다.
	 * @returns
	 */
	Date.prototype.getYMDHM = function(foramt) {
		var date = new Date();
		var month = (date.getMonth() + 1);
		var day = date.getDate();
		var hrs = date.getHours();
		var min = date.getMinutes();
		if(Number(month) < 10){ month = "0" + month; }
		if(Number(day) < 10){ day = "0" + day; }
		if(Number(hrs) < 10){ hrs = "0" + hrs; }
		if(Number(min) < 10){ min = "0" + min; }
		if(!foramt){
			return  "" + date.getFullYear() +
					"" + month +
					"" + day +
					"" + hrs +
					"" + min;
		}else{
			return  "" + date.getFullYear() +
					"-" + month +
					"-" + day +
					" " + hrs +
					":" + min;
		}
	};

	/**
	 * 현재 년월일시분초 을 리턴합니다.
	 * @returns
	 */
	Date.prototype.getYMDHMS = function(format) {
		var date = new Date();
		var month = (date.getMonth() + 1);
		var day = date.getDate();
		var hrs = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		if(Number(month) < 10){ month = "0" + month; }
		if(Number(day) < 10){ day = "0" + day; }
		if(Number(hrs) < 10){ hrs = "0" + hrs; }
		if(Number(min) < 10){ min = "0" + min; }
		if(Number(sec) < 10){ sec = "0" + sec; }
		if(format){
			return  "" + date.getFullYear() +
					"-" + month +
					"-" + day +
					" " + hrs +
					":" + min +
					":" + sec;
		}else{
			return  "" + date.getFullYear() +
					"" + month +
					"" + day +
					"" + hrs +
					"" + min +
					"" + sec;
		}
	};

	/**
	 * 현재 년월일시분초밀리초 을 리턴합니다.
	 * @returns
	 */
	Date.prototype.getYMDHMS_S = function() {
		var date = new Date();
		var month = (date.getMonth() + 1);
		var day = date.getDate();
		var hrs = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		if(Number(month) < 10){ month = "0" + month; }
		if(Number(day) < 10){ day = "0" + day; }
		if(Number(hrs) < 10){ hrs = "0" + hrs; }
		if(Number(min) < 10){ min = "0" + min; }
		if(Number(sec) < 10){ sec = "0" + sec; }
		return  "" + date.getFullYear() +
				"" + month +
				"" + day +
				"" + hrs +
				"" + min +
				"" + sec +
				"" + date.getMilliseconds();
	};


	/**
	 * 주어진 시간을 더하여 년월일시분초를 리턴합니다.
	 * @returns
	 */
	Date.prototype.addSecond = function(mins, format) {
		var now = new Date();
		var date = new Date(Date.parse(now) + 1000 * (mins * 60));
		var month = (date.getMonth() + 1);
		var day = date.getDate();
		var hrs = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		if(Number(month) < 10){ month = "0" + month; }
		if(Number(day) < 10){ day = "0" + day; }
		if(Number(hrs) < 10){ hrs = "0" + hrs; }
		if(Number(min) < 10){ min = "0" + min; }
		if(Number(sec) < 10){ sec = "0" + sec; }
		if(format){
			return  "" + date.getFullYear() +
					"-" + month +
					"-" + day +
					" " + hrs +
					":" + min +
					":" + sec;
		}else{
			return  "" + date.getFullYear() +
					"" + month +
					"" + day +
					"" + hrs +
					"" + min +
					"" + sec;
		}
	};

	/**
	 * 파라미터 Date 기준으로 분을 뺍니다.
	 * @returns
	 */
	Date.prototype.subtractMinutes = function(date, min, format) {
		if(date instanceof Date == false) date = new Date(date);

		date.setMinutes(date.getMinutes() - min);

		if(format){
			return new Date().formatYMDHMS(date.formatDateToStr(date));
		}else{
			return date;
		}
	};

	/**
	 * 파라미터 Date 기준으로 시간을 뺍니다.
	 * @returns
	 */
	Date.prototype.subtractHours = function(date, hour, format) {
		if(date instanceof Date == false) date = new Date(date);

		date.setHours(date.getHours() - hour);

		if(format){
			return new Date().formatYMDHMS(date.formatDateToStr(date));
		}else{
			return date;
		}
	};

	/**
	 * 파라미터 Date 기준으로 월을 뺍니다.
	 * @returns
	 */
	Date.prototype.subtractMonth = function(date, month, format) {
		if(date instanceof Date == false) date = new Date(date);

		date.setMonth(date.getMonth() - month);

		if(format){
			return new Date().formatYMDHMS(date.formatDateToStr(date));
		}else{
			return date;
		}
	};

	/**
	 * 주어진 일자를 포맷팅 합니다.
	 * @returns
	 */
	Date.prototype.formatYMDHMS = function(ymdhms) {
		if(typeof ymdhms == "number") ymdhms = "" + ymdhms;

		var date = ymdhms.substring(0, 4);
		var mon = ymdhms.substr(4, 2);  if(mon != "") mon = "-" + mon;
		var day = ymdhms.substr(6, 2);  if(day != "") day = "-" + day;
		var hrs = ymdhms.substr(8, 2);  if(hrs != "") hrs = " " + hrs;
		var min = ymdhms.substr(10, 2); if(min != "") min = ":" + min;
		var sec = ymdhms.substring(12); if(sec != "") sec = ":" + sec;

		return  "" + date +
				"" + mon +
				"" + day +
				"" + hrs +
				"" + min +
				"" + sec;
	};

	/**
	 * 주어진 일자를 포맷팅 합니다.
	 * @returns
	 */
	Date.prototype.formatMDHMS = function(ymdhms) {
		if(typeof ymdhms == "number") ymdhms = "" + ymdhms;

		var date = ymdhms.substring(0, 4);
		var mon = ymdhms.substr(4, 2);  if(mon != "") mon = "" + mon;
		var day = ymdhms.substr(6, 2);  if(day != "") day = "-" + day;
		var hrs = ymdhms.substr(8, 2);  if(hrs != "") hrs = " " + hrs;
		var min = ymdhms.substr(10, 2); if(min != "") min = ":" + min;
		var sec = ymdhms.substring(12); if(sec != "") sec = ":" + sec;

		return  "" +
				"" + mon +
				"" + day +
				"" + hrs +
				"" + min +
				"" + sec;
	};

	/**
	 * 주어진 날짜의 월 일을 리턴합니다.
	 * @returns
	 */
	Date.prototype.formatMD = function(ymdhms) {
		if(typeof ymdhms == "number") ymdhms = "" + ymdhms;

		var mon = ymdhms.substr(4, 2);  if(mon != "") mon = mon;
		var day = ymdhms.substr(6, 2);  if(day != "") day = "/" + day;

		return  "" + mon + "" + day;
	};

	/**
	 * 월, 일의 포멧을 변경합니다.
	 * 1~9 -> 01~09
	 * @param _Date
	 * @returns {String}
	 */
	Date.prototype.formatYMD = function(_Date) {
		var month = (_Date.getMonth() + 1);
		var day = _Date.getDate();
		if(Number(month) < 10){ month = "0" + month; }
		if(Number(day) < 10){ day = "0" + day; }
		return  "" + _Date.getFullYear() +
				"" + month +
				"" + day;
	};

	/**
	 * 주어진 날짜의 차이 일을 구합니다.
	 * @param sday - 시작일
	 * @param eday - 종료일
	 * @returns {number}
	 */
	Date.prototype.formatDiffDays = function(sday, eday) {
		var date1 = new Date(sday.substr(0,4), sday.substr(4,2)-1, sday.substr(6,2));
		var date2 = new Date(eday.substr(0,4), eday.substr(4,2)-1, eday.substr(6,2));

		var interval = date2 - date1;
		var day = 1000*60*60*24;
		var month = day*30;
		var year = month*12;

		return parseInt(interval/day);
	};

	/**
	 * 주어진 날짜의 차이 일을 구합니다.
	 * @param sday - 시작일
	 * @param eday - 종료일
	 * @returns {number}
	 */
	Date.prototype.formatDiffTime = function(sday, eday) {
		var startTime = sday;
		var endTime  = eday;

		//시작일시
		var startDate = new Date(parseInt(startTime.substring(0,4), 10),
			parseInt(startTime.substring(4,6), 10)-1,
			parseInt(startTime.substring(6,8), 10),
			parseInt(startTime.substring(8,10), 10),
			parseInt(startTime.substring(10,12), 10),
			parseInt(startTime.substring(12,14), 10)
		);

		// 종료일시
		var endDate = new Date(parseInt(endTime.substring(0,4), 10),
			parseInt(endTime.substring(4,6), 10)-1,
			parseInt(endTime.substring(6,8), 10),
			parseInt(endTime.substring(8,10), 10),
			parseInt(endTime.substring(10,12), 10),
			parseInt(endTime.substring(12,14), 10)
		);

		//두 일자(startTime, endTime) 사이의 차이를 구한다.
		var dateGap = endDate.getTime() - startDate.getTime();
		var timeGap = new Date(0, 0, 0, 0, 0, 0, endDate - startDate);

		//두 일자(startTime, endTime) 사이의 간격을 "일-시간-분"으로 표시한다.
		var diffDay  = Math.floor(dateGap / (1000 * 60 * 60 * 24)); // 일수
		var diffHour = timeGap.getHours();   // 시간
		var diffMin  = timeGap.getMinutes(); // 분
		var diffSec  = timeGap.getSeconds(); // 초

		//alert(diffDay + "일 " + diffHour + "시간 " + diffMin + "분 "  + diffSec + "초 ");

		return {
			diffDay : diffDay,
			diffHour : diffHour,
			diffMin : diffMin,
			diffsec : diffSec
		};
	};

	/**
	 * 이전 일을 구합니다.
	 * @param dayPrefix - -일수 (number)
	 * @param format - 포맷팅 여부 (number)
	 * @returns {Date}
	 */
	Date.prototype.getBeforeDate = function(dayPrefix, format) {
		var transDate = new Date();
		var processTime = new Date().getTime() + (parseInt(dayPrefix) * 24 * 60 * 60 * 1000);
		transDate.setTime(processTime);
		if(format){
			return new Date().formatYMD(transDate);
		}else{
			return transDate;
		}
	};

	/**
	 * 날짜를 포멧하여 리턴합니다.
	 * @param ymdhms
	 * @returns {String}
	 */
	Date.prototype.formatDate = function(ymdhms) {
		var dateLen = ymdhms.length;
		var rtn = "";

		if ( dateLen > 0 ) rtn += ymdhms.substring(0, 4);
		if ( dateLen > 4 ) rtn += "-" + ymdhms.substring(4, 6);
		if ( dateLen > 6 ) rtn += "-" + ymdhms.substring(6, 8);
		if ( dateLen > 8 ) rtn += " " + ymdhms.substring(8, 10);
		if ( dateLen > 10 ) rtn += ":" + ymdhms.substring(10, 12);
		if ( dateLen > 12 ) rtn += ":" + ymdhms.substring(12, 14);
		if ( dateLen > 14 ) rtn += ":" + ymdhms.substring(14, 16);

		return rtn;
	}

	//영상반출용 추가

	/** '2014040915' 날짜시간형식의 포멧 추가해준다.
	 * @param 문자열
	 * @param typ
	 * @return '-'/':'추가 문자열
	 */
	Date.prototype.strYmdTimeAdd = function(str, typ){
		if ( typ == undefined ) typ = '-';
		var yy = str.substring(0, 4);
		var mm = str.substring(4, 6);
		var dd = str.substring(6, 8 );
		var hh = str.substring(8, 10 );
		var date = yy+typ+mm+typ+dd+' '+hh;

		if (date.length == 2) date = '';

		return date;
	};

	//영상반출용 추가

	/** Date변수를 지정된 format으로 변환한다
	 * @param date 형식 변수
	 * @return formating 문자열
	 */
	Date.prototype.formatDateToStr = function(date) {
		var month = (date.getMonth() + 1);
		var day = date.getDate();
		var hrs = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		if(Number(month) < 10){ month = "0" + month; }
		if(Number(day) < 10){ day = "0" + day; }
		if(Number(hrs) < 10){ hrs = "0" + hrs; }
		if(Number(min) < 10){ min = "0" + min; }
		if(Number(sec) < 10){ sec = "0" + sec; }
		return  "" + date.getFullYear() +
				"" + month +
				"" + day +
				"" + hrs +
				"" + min +
				"" + sec;
	};


	/**
	 * 날짜 문자열을 데이트 객체로 변환한다.
	 * @param  formating 문자열
	 * @return date 형식 변수
	 */
	Date.prototype.formatStrToDate = function(paramDate) {

		var dhArr = paramDate.split(' ');
		var dArr = dhArr[0].split('-');
		var hArr = dhArr[1].split(':');

		var dateObj = new Date();

		var convertDate = new Date(Number(dArr[0]), Number(dArr[1]-1), Number(dArr[2]), Number(hArr[0]), Number(hArr[1]), Number(hArr[2]));

		return convertDate;

	}

})();