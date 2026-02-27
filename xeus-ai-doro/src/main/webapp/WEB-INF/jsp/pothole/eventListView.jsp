<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>이벤트 화면</title>
  <style>
   html, body {
	  height: 100%;
	  margin: 0;
	  font-family: sans-serif;
	  background-color: #121212;
	  overflow: hidden; /* 전체 페이지 스크롤 제거 */
	}
	
	#container {
	  display: flex;
	  height: 100%;
	  color: #fff;
	  overflow: hidden; /* 내부에서 필요한 곳만 스크롤 */
	}

    /* ====================== 좌측 리스트 ====================== */
    #eventList {
      width: 350px;
      display: flex;
      flex-direction: column;
      padding: 16px 12px 18px 6px;
      border-right: 1px solid #444;
    }

    #eventList > div:first-child {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 10px;
    }

    #eventListContent {
      margin-top: 5px;
      overflow-y: auto;
    }

    /* 스크롤바 커스텀 */
    .customScroll::-webkit-scrollbar {
      width: 16px;
    }

    .customScroll::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 10px;
    }

    .customScroll::-webkit-scrollbar-track {
      background-color: #1d1d1f;
    }

    .event-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 6px;
      padding: 10px 14px;
      border: 1px solid #333;
      margin-bottom: 10px;
      color: #fff;
    }

    .event-card:hover {
      background-color: #222;
    }

    .event-type {
      font-weight: 400;
      width: 75px;
      font-size: 14px;
    }

    .event-meta {
      flex-grow: 1;
      padding: 0 10px;
      font-size: 12px;
      color: #bbb;
    }

    .event-detail-btn {
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 10px;
      cursor: pointer;
      font-size: 13px;
    }

    .detail-highlight {
      background-color: #0078d4 !important;
      color: #fff !important;
    }

	.event-card.detail-highlight .event-type,
	.event-card.detail-highlight .event-time,
	.event-card.detail-highlight .event-detail-btn {
	  color: #fff !important;
	}

    .evtSubTitle {
      font-size: 13px;
      color: #aaa;
      margin-left: 10px;
    }

    /* ====================== 우측 상세 ====================== */
    #eventDetail {
      padding: 16px 6px 16px 20px;
    }

    .event-detail-container {
      display: flex;
      flex-direction: column;
    }

    .evtDetailTitle {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 16px;
    }

    .event-detail-box {
      display: flex;
      gap: 15px;
      flex-direction: column;
      align-items: flex-start;
    }

    .event-detail-image-wrapper {
      position: relative;
      width: 500px;
      height: auto; 
/*       height: 265px; */
      background-color: #000;
      border-radius: 4px;
      overflow: hidden;
    }

    .event-detail-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .img-zoom-btn {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      border: none;
      padding: 5px 8px;
      font-size: 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .img-zoom-btn:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }

    .event-detail-info {
/*       width: 320px; */
/* 	  display: grid; */
	  grid-template-columns: 1fr 1fr;
	  gap: 5px;
	  width: 100%;
 	  max-width: 600px;
    }
    

    .info-row {
      background-color: #2a2a2a;
/*       border: 1px solid #444; */
/*       border-radius: 6px; */
      padding: 4px 1px 8px 2px;
/*       margin-bottom: 12px; */
      display: flex;
      font-size: 14px;
      justify-content: space-between;
    }

    .label {
      color: #fff;
      font-weight: 500;
      width: 50%;
    }

    .value {
      color: #999;
      font-weight: 600;
      width: 100%;
    }
  </style>
</head>

<body>
  <div id="container">
    <!-- 좌측 리스트 -->
    <div id="eventList">
      <div>
        이벤트 리스트<span id="evtPotCount" class="evtSubTitle"></span>
      </div>
      <div id="eventListContent" class="customScroll">
        <!-- JS로 채워짐 -->
      </div>
    </div>

    <!-- 우측 상세 -->
    <div id="eventDetail" class="event-detail-container">
      <div class="evtDetailTitle">
      	이벤트 상세정보
      	<span id="evtSubDetail" class="evtSubTitle"></span>
      </div>
      <div class="event-detail-box">
        <div class="event-detail-image-wrapper">
          <img
            id="detailImage"
            class="event-detail-image"
            src="http://211.250.124.175:28001/api/v1/files/download?id=1235688&kind=box"
            alt="이벤트 이미지"
          />
          <button class="img-zoom-btn" title="원본 이미지 보기"><i class='fas fa-search'></i></button> <!-- 🔍 -->
        </div>

        <div class="event-detail-info">
<!--           <div class="info-row"> -->
<!--             <span class="label">이벤트 유형</span> -->
<!--             <span class="value" id="detailType">포트홀</span> -->
<!--           </div> -->
<!--           <div class="info-row"> -->
<!--             <span class="label">카메라 타입</span> -->
<!--             <span class="value" id="detailCamType">bus</span> -->
<!--           </div> -->
          <div class="info-row">
            <span class="label">발생일시</span>
            <span class="value" id="detailTime">2025-04-07 16:14:57</span>
          </div>
          <div class="info-row">
            <span class="label">발생 경위도</span>
            <span class="value" id="detailLonLat">127.747665, 37.882034</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 이미지 새창 열기 -->
  <script>
  function openImageInNewWindow() {
	  var src = document.getElementById("detailImage").currentSrc;

	  if (src) {
	    var img = new Image();
	    img.src = src;

	    img.onload = function () {
	      var imgWidth = img.naturalWidth;
	      var imgHeight = img.naturalHeight;

	      var features = "width=" + imgWidth + ",height=" + imgHeight + ",resizable=yes";
	      var imgWindow = window.open("", "_blank", features);

	      var htmlContent =
	        "<html>" +
	        "<head>" +
	        "<title>원본 이미지</title>" +
	        "<style>" +
	        "body { margin: 0; background-color: #000; display: flex; justify-content: center; align-items: center; height: 100vh; }" +
	        "img { max-width: 100%; max-height: 100%; object-fit: contain; }" +
	        "</style>" +
	        "</head>" +
	        "<body>" +
	        "<img src='" + src + "' alt='원본 이미지'>" +
	        "</body>" +
	        "</html>";

	      imgWindow.document.open();
	      imgWindow.document.write(htmlContent);
	      imgWindow.document.close();
	    };
	  }
	}

	// 버튼 클릭 또는 이미지 더블 클릭 시
	document.addEventListener("click", function (e) {
	  if (e.target.closest(".img-zoom-btn")) {
	    openImageInNewWindow();
	  }
	});

	document.getElementById("detailImage").addEventListener("dblclick", function () {
	  openImageInNewWindow();
	});

  </script>
  </body>