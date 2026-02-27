package geomex.xeus.stat.service;


/**
 * <pre>
 * 파일명 :  MonEvtStatVo.java
 * 설  명 :
 *   이벤트 모니터링 통계 Vo
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2018-11-02      최환주          최초 생성
 *
 * </pre>
 *
 * @since   :  2018. 10. 30.
 * @version :  1.0
 * @see
 */

public class MonEvtStatVo {

	//기관별 월 테이블용
	//gbn은 기관별 연월일에서 공통으로 사용된다.
    private String gbn;
    private String all;
    private String jan;
    private String feb;
    private String mar;
    private String apr;
    private String may;
    private String jun;
    private String jul;
    private String aug;
    private String sep;
    private String oct;
    private String nov;
    private String dec;

    //기관별 일 테이블용
    private String day01;
    private String day02;
    private String day03;
    private String day04;
    private String day05;
    private String day06;
    private String day07;
    private String day08;
    private String day09;
    private String day10;
    private String day11;
    private String day12;
    private String day13;
    private String day14;
    private String day15;
    private String day16;
    private String day17;
    private String day18;
    private String day19;
    private String day20;
    private String day21;
    private String day22;
    private String day23;
    private String day24;
    private String day25;
    private String day26;
    private String day27;
    private String day28;
    private String day29;
    private String day30;
    private String day31;

    //기관별 연 현황은 기관명을 파라미터로 각 년도당 갯수를 가져옴.
    private String orgNm;

    //전체 연월일별 접속현황
    private String year;
    private String month;
    private String day;
    private String count;
    private String useTime;

    private String evtNm;
    private String evtTypCd;

    public String getGbn() {
        return gbn;
    }
    public void setGbn(String gbn) {
        this.gbn = gbn;
    }
    public String getAll() {
        return all;
    }
    public void setAll(String all) {
        this.all = all;
    }
    public String getJan() {
        return jan;
    }
    public void setJan(String jan) {
        this.jan = jan;
    }
    public String getFeb() {
        return feb;
    }
    public void setFeb(String feb) {
        this.feb = feb;
    }
    public String getMar() {
        return mar;
    }
    public void setMar(String mar) {
        this.mar = mar;
    }
    public String getApr() {
        return apr;
    }
    public void setApr(String apr) {
        this.apr = apr;
    }
    public String getMay() {
        return may;
    }
    public void setMay(String may) {
        this.may = may;
    }
    public String getJun() {
        return jun;
    }
    public void setJun(String jun) {
        this.jun = jun;
    }
    public String getJul() {
        return jul;
    }
    public void setJul(String jul) {
        this.jul = jul;
    }
    public String getAug() {
        return aug;
    }
    public void setAug(String aug) {
        this.aug = aug;
    }
    public String getSep() {
        return sep;
    }
    public void setSep(String sep) {
        this.sep = sep;
    }
    public String getOct() {
        return oct;
    }
    public void setOct(String oct) {
        this.oct = oct;
    }
    public String getNov() {
        return nov;
    }
    public void setNov(String nov) {
        this.nov = nov;
    }
    public String getDec() {
        return dec;
    }
    public void setDec(String dec) {
        this.dec = dec;
    }

    public String getDay01() {
		return day01;
	}
	public void setDay01(String day01) {
		this.day01 = day01;
	}
	public String getDay02() {
		return day02;
	}
	public void setDay02(String day02) {
		this.day02 = day02;
	}
	public String getDay03() {
		return day03;
	}
	public void setDay03(String day03) {
		this.day03 = day03;
	}
	public String getDay04() {
		return day04;
	}
	public void setDay04(String day04) {
		this.day04 = day04;
	}
	public String getDay05() {
		return day05;
	}
	public void setDay05(String day05) {
		this.day05 = day05;
	}
	public String getDay06() {
		return day06;
	}
	public void setDay06(String day06) {
		this.day06 = day06;
	}
	public String getDay07() {
		return day07;
	}
	public void setDay07(String day07) {
		this.day07 = day07;
	}
	public String getDay08() {
		return day08;
	}
	public void setDay08(String day08) {
		this.day08 = day08;
	}
	public String getDay09() {
		return day09;
	}
	public void setDay09(String day09) {
		this.day09 = day09;
	}
	public String getDay10() {
		return day10;
	}
	public void setDay10(String day10) {
		this.day10 = day10;
	}
	public String getDay11() {
		return day11;
	}
	public void setDay11(String day11) {
		this.day11 = day11;
	}
	public String getDay12() {
		return day12;
	}
	public void setDay12(String day12) {
		this.day12 = day12;
	}
	public String getDay13() {
		return day13;
	}
	public void setDay13(String day13) {
		this.day13 = day13;
	}
	public String getDay14() {
		return day14;
	}
	public void setDay14(String day14) {
		this.day14 = day14;
	}
	public String getDay15() {
		return day15;
	}
	public void setDay15(String day15) {
		this.day15 = day15;
	}
	public String getDay16() {
		return day16;
	}
	public void setDay16(String day16) {
		this.day16 = day16;
	}
	public String getDay17() {
		return day17;
	}
	public void setDay17(String day17) {
		this.day17 = day17;
	}
	public String getDay18() {
		return day18;
	}
	public void setDay18(String day18) {
		this.day18 = day18;
	}
	public String getDay19() {
		return day19;
	}
	public void setDay19(String day19) {
		this.day19 = day19;
	}
	public String getDay20() {
		return day20;
	}
	public void setDay20(String day20) {
		this.day20 = day20;
	}
	public String getDay21() {
		return day21;
	}
	public void setDay21(String day21) {
		this.day21 = day21;
	}
	public String getDay22() {
		return day22;
	}
	public void setDay22(String day22) {
		this.day22 = day22;
	}
	public String getDay23() {
		return day23;
	}
	public void setDay23(String day23) {
		this.day23 = day23;
	}
	public String getDay24() {
		return day24;
	}
	public void setDay24(String day24) {
		this.day24 = day24;
	}
	public String getDay25() {
		return day25;
	}
	public void setDay25(String day25) {
		this.day25 = day25;
	}
	public String getDay26() {
		return day26;
	}
	public void setDay26(String day26) {
		this.day26 = day26;
	}
	public String getDay27() {
		return day27;
	}
	public void setDay27(String day27) {
		this.day27 = day27;
	}
	public String getDay28() {
		return day28;
	}
	public void setDay28(String day28) {
		this.day28 = day28;
	}
	public String getDay29() {
		return day29;
	}
	public void setDay29(String day29) {
		this.day29 = day29;
	}
	public String getDay30() {
		return day30;
	}
	public void setDay30(String day30) {
		this.day30 = day30;
	}
	public String getDay31() {
		return day31;
	}
	public void setDay31(String day31) {
		this.day31 = day31;
	}
	public String getOrgNm() {
		return orgNm;
	}
	public void setOrgNm(String orgNm) {
		this.orgNm = orgNm;
	}
	public String getYear() {
		return year;
	}
	public void setYear(String year) {
		this.year = year;
	}
	public String getMonth() {
		return month;
	}
	public void setMonth(String month) {
		this.month = month;
	}
	public String getDay() {
		return day;
	}
	public void setDay(String day) {
		this.day = day;
	}
	public String getCount() {
		return count;
	}
	public void setCount(String count) {
		this.count = count;
	}
	public String getUseTime() {
		return useTime;
	}
	public void setUseTime(String useTime) {
		this.useTime = useTime;
	}
	public String getEvtNm() {
		return evtNm;
	}
	public void setEvtNm(String evtNm) {
		this.evtNm = evtNm;
	}

	public String getEvtTypCd() {
		return evtTypCd;
	}
	public void setEvtTypCd(String evtTypCd) {
		this.evtTypCd = evtTypCd;
	}
	@Override
	public String toString() {
		return "MonEvtStatVo [gbn=" + gbn + ", all=" + all + ", jan=" + jan + ", feb=" + feb + ", mar=" + mar + ", apr="
				+ apr + ", may=" + may + ", jun=" + jun + ", jul=" + jul + ", aug=" + aug + ", sep=" + sep + ", oct="
				+ oct + ", nov=" + nov + ", dec=" + dec + ", day01=" + day01 + ", day02=" + day02 + ", day03=" + day03
				+ ", day04=" + day04 + ", day05=" + day05 + ", day06=" + day06 + ", day07=" + day07 + ", day08=" + day08
				+ ", day09=" + day09 + ", day10=" + day10 + ", day11=" + day11 + ", day12=" + day12 + ", day13=" + day13
				+ ", day14=" + day14 + ", day15=" + day15 + ", day16=" + day16 + ", day17=" + day17 + ", day18=" + day18
				+ ", day19=" + day19 + ", day20=" + day20 + ", day21=" + day21 + ", day22=" + day22 + ", day23=" + day23
				+ ", day24=" + day24 + ", day25=" + day25 + ", day26=" + day26 + ", day27=" + day27 + ", day28=" + day28
				+ ", day29=" + day29 + ", day30=" + day30 + ", day31=" + day31 + ", orgNm=" + orgNm + ", year=" + year
				+ ", month=" + month + ", day=" + day + ", count=" + count + ", useTime=" + useTime + ", evtNm=" + evtNm
				+ ", evtTypCd=" + evtTypCd + "]";
	}


}
