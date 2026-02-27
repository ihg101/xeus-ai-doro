/*
 * 파일명   : string.js
 * 파일설명 : String관련 확장 메소드 및 xml처리 함수
 * 수정이력 :
 *       2013.08.13  이규하  : 최초작성, 함수 기능별로 파일로 분리
 *       2013.08.16  이규하  : xml처리 함수 common.js에서 이전
 *       2015.10.28  이주영  : 수정, 함수추가 contains, indexOf
 */
///////////////////////////////////////////////////////////////////

(function(){
	if(!Array.indexOf){
	    Array.prototype.indexOf = function(obj){
	        for(var i=0; i<this.length; i++){
	            if(this[i]==obj){
	                return i;
	            }
	        }
	        return -1;
	    };
	}

	/**
	 * 문자열에서 모든 find문자열을 replaceWith문자열로 치환
	 * @param find
	 *          치환대상문자열
	 * @param replaceWith
	 *          치환문자열
	 * @returns 문자열
	 */
	String.prototype.replaceAll = function(find, replaceWith) {
		return this.split(find).join(replaceWith);
	};

	/**
	 * 해당 문자열이 존재하는지 검사합니다.
	 * @param str
	 * @returns {Boolean}
	 */
	String.prototype.contains = function(str) {
		var bool = false;
		if(str != null && str != ""){
			if(this.indexOf(str) != -1){ bool = true; };
		}
		return bool;
	};

	/**
	 * 문자열반복
	 * @param times
	 *          반복횟수
	 * @returns 문자열
	 */
	String.prototype.repeat = function(times) {
		return new Array(times+1).join(this);
	};

	/**
	 * 문자열trim
	 * @returns 문자열
	 */
	String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/gi, "");
	};

	/**
	 *
	 * @param n
	 * @param c
	 * @returns
	 *
	 * "1".padding(-2,"0");	결과: 01
	 * "1".padding(2,"0");	결과: 10
	 */
	String.prototype.padding = function(n, c) {
		var val = this.valueOf();
		if ( Math.abs(n) <= val.length ) {
			return val;
		}
		var m = Math.max((Math.abs(n) - this.length) || 0, 0);
		var pad = Array(m + 1).join(String(c || ' ').charAt(0));
//	var pad = String(c || ' ').charAt(0).repeat(Math.abs(n) - this.length);
		return (n < 0) ? pad + val : val + pad;
	};
})();


/**
 * xml 문서 형태의 xml개체를 문자열로 변환
 * @param xmlDom
 *          xml개체
 * @returns 문자열
 */
function xml2str(xmlDom){
    return (typeof XMLSerializer!=="undefined") ?
         (new window.XMLSerializer()).serializeToString(xmlDom) :
         xmlDom.xml;
}

/**
 * $.parseXML로 만든 xml개체를 문자열로 변환
 * @param $xmlObj
 *          xml개체
 * @returns 문자열
 */
function xmlToString($xmlObj) {
    var xmlString = '';
    $xmlObj.children().each(function() {
        xmlString += ('<'+this.nodeName);
        var attrs = this.attributes;
        for ( var i = 0; i < attrs.length; i++ ) {
           	xmlString += (' '+attrs[i].nodeName+'="'+attrs[i].nodeValue+'"');
        }
        xmlString += '>';
        if($(this).children().length > 0) {
            xmlString += xmlToString($(this));
        } else {
        	xmlString += $(this).text();
        }
        xmlString += ('</'+this.nodeName+'>');
    });
    return xmlString;
}

function xmlToStringF($xmlObj, dc) {
	if ( !dc ) dc = 0;
    var xmlString = '';
    $xmlObj.children().each(function() {
        xmlString += ('\t'.repeat(dc)+'<'+this.nodeName);
        var attrs = this.attributes;
        for ( var i = 0; i < attrs.length; i++ ) {
           	xmlString += (' '+attrs[i].nodeName+'="'+attrs[i].nodeValue+'"');
        }
        xmlString += '>';
        if($(this).children().length > 0) {
            xmlString += ( '\r\n' + xmlToStringF($(this), (dc+1)) + '\t'.repeat(dc) );
        } else {
        	xmlString += $(this).text();
        }
        xmlString += ('</'+this.nodeName+'>\r\n');
    });
    return xmlString;
}

/**
 * codelist xml을 json{cod: desc, ...}으로 변환
 * @param $codeXmlObj
 *          codelist xml
 * @returns json
 */
function codeXmltoJson($codeXmlObj) {
    var json = {};
    $codeXmlObj.children().each(function() {
    	var key = $(this).attr('cod');
    	var val = $(this).attr('desc');
    	json[key] = val;
    });
    return json;
}

function formetYMD(ymd){
	var str = "";
	str += ymd.substring(0, 4) + "-";
	str += ymd.substring(4, 6) + "-";
	str += ymd.substring(6, 8);

	return str;
}

function formetYMDHMS(ymd){
	var str = "";
	str += ymd.substring(0, 4) + "-";
	str += ymd.substring(4, 6) + "-";
	str += ymd.substring(6, 8) + " ";
	str += ymd.substring(8, 10) + ":";
	str += ymd.substring(10, 12);

	return str;
}