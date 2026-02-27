package geomex.xeus.videoSummary.model;

public class VideoSummary {
    private String rqstMgrSeq;
    private String filePath;
    private String fileName;

    private String videoId;
    private String userId;
    private String userPw;
    private String uploadPath;
    private String beginDate;
    private String title;
    private int fileSize;
    private String memo;
    private int length;
    private String accountId;
    private String uploadDt;
    private String recDt;

    public String getRqstMgrSeq() {
        return rqstMgrSeq;
    }

    public void setRqstMgrSeq(String rqstMgrSeq) {
        this.rqstMgrSeq = rqstMgrSeq;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getVideoId() {
        return videoId;
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUploadPath() {
        return uploadPath;
    }

    public void setUploadPath(String uploadPath) {
        this.uploadPath = uploadPath;
    }

    public String getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(String beginDate) {
        this.beginDate = beginDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getFileSize() {
        return fileSize;
    }

    public void setFileSize(int fileSize) {
        this.fileSize = fileSize;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

	public String getUserPw() {
		return userPw;
	}

	public void setUserPw(String userPw) {
		this.userPw = userPw;
	}

	public int getLength() {
		return length;
	}

	public void setLength(int length) {
		this.length = length;
	}

	public String getAccountId() {
		return accountId;
	}

	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}

	public String getUploadDt() {
		return uploadDt;
	}

	public void setUploadDt(String uploadDt) {
		this.uploadDt = uploadDt;
	}

	public String getRecDt() {
		return recDt;
	}

	public void setRecDt(String recDt) {
		this.recDt = recDt;
	}

	@Override
	public String toString() {
		return "VideoSummary [rqstMgrSeq=" + rqstMgrSeq + ", filePath=" + filePath + ", fileName=" + fileName
				+ ", videoId=" + videoId + ", userId=" + userId + ", userPw=" + userPw + ", uploadPath=" + uploadPath
				+ ", beginDate=" + beginDate + ", title=" + title + ", fileSize=" + fileSize + ", memo=" + memo
				+ ", length=" + length + ", accountId=" + accountId + ", uploadDt=" + uploadDt + ", recDt=" + recDt
				+ "]";
	}

}
