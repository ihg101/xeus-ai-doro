package geomex.xeus.equipmgr.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * <pre>
 * 파일명 :  CctvMapServiceMapper.java
 * 설  명 :
 *   클래스 설명을 쓰시오
 *
 * == 개정이력(Modification Information) ==
 * 수정일          수정자          수정내용
 * ----------      -----------     ---------------------------
 * 2016-12-08      김경호          최초 생성
 *
 * </pre>
 *
 * @since : 2016. 12. 8.
 * @version : 1.0
 * @see
 */

@Mapper("cctvMapServiceMapper")
public interface CctvMapServiceMapper {

    // ${} : 쿼리문에 상수로 치환됨, 쿼리문장이 됨, injection에 취약할 수 있음
    // #{} : ? 로 치환되어 값을 설정하는데 사용됨

    // @Select("SELECT id, type, label FROM salesgeometry WHERE ST_Within(" +
    //        "ST_GeomFromText('POINT(${longitude} ${latitude})', 4326), geom) " +
    //        "AND type = #{type}")
    //Geometry getGeometryAtLocation(
    //        @NotNull @Param("type") String geometryType,
    //        @NotNull @Param("longitude") BigDecimal longitude,
    //        @NotNull @Param("latitude") BigDecimal latitude
    //);

    @Select({
            "<script>",
            " SELECT ",
	        "	_gid, ",
	        "	st_x (st_centroid(_geometry)) AS _annox, ",
	        "	st_y (st_centroid(_geometry)) AS _annoy, ",
	        "	cctv.mgr_no, ",
	        "	cctv_nm, ",
	        "	device_id, ",
	        "	chnl_no, ",
	        "	gbn_cd, ",
	        "	cde_nm, ",
	        "	pan_yn, ",
	        "	tilt_yn, ",
	        "	zoom_yn, ",
	        "	talk_yn, ",
	        "	angle, ",
	        //"	view_dir, ",
	        "	vms_mgr_no, ",
	        "	stat.state_cd ",
	        " FROM ",
	        "	xeus.asset_cctv as cctv ",
	        " LEFT JOIN xeus.mt_cmm_cde ON grp_cde = 'C14' AND cde_cde = gbn_cd ",
	        " LEFT JOIN xeus.asset_status stat ON stat.mgr_no = cctv.mgr_no AND stat.state_cd = '12' ",

            " WHERE ST_Intersects(cctv._geometry, ${extent})",

            " AND cctv.mgr_no != 'CTV0000000'",

            " <if test=\"codes != null\"> ",
            " 	AND gbn_cd IN(${codes})",
            " </if>",

            " <if test=\"admNm != null and admNm != ''\"> ",
	        "   AND st_intersects((select _geometry from xeus.kais_hjd_as where adm_nm = #{admNm}), cctv._geometry) ",
	        " </if> ",

	        " <if test=\"emdCd != null and emdCd != ''\"> ",
	        "   AND st_intersects((select _geometry from xeus.kais_emd_as where emd_cd = #{emdCd}), cctv._geometry) ",
	        " </if> ",

	        " <if test=\"orgMgrNo != null and orgMgrNo != ''\"> ",
	        "   AND org_mgr_no = #{orgMgrNo} ",
	        " </if> ",

	        " <if test=\"cctvGbnCd != null and cctvGbnCd != ''\"> ",
	        "   AND gbn_cd = #{cctvGbnCd} ",
	        " </if> ",

	        " <if test=\"cctvNm != null and cctvNm != ''\"> ",
	        "   AND cctv.cctv_nm like '%'||#{cctvNm}||'%' ",
	        " </if> ",

	        " ORDER BY cctv.cctv_nm ASC",

            "</script>"
    })
    @Results({
            @Result(column = "_gid", property = "gid"),
            @Result(column = "_annox", property = "x"),
            @Result(column = "_annoy", property = "y"),
            @Result(column = "mgr_no", property = "mgrNo"),
            @Result(column = "cctv_nm", property = "cctvNm"),

            // @Result(column = "label_txt", property = "labelTxt"),
            @Result(column = "device_id", property = "deviceId"),
            @Result(column = "chnl_no", property = "channelNo"),
            @Result(column = "gbn_cd", property = "gbnCd"),
            @Result(column = "cde_nm", property = "gbnTxt"),

            @Result(column = "turn_yn", property = "turn"),
            @Result(column = "pt_yn", property = "tilt"),
            @Result(column = "zoom_yn", property = "zoom"),
            @Result(column = "talk_yn", property = "talk"),
            @Result(column = "net_yn", property = "net"),
            @Result(column = "angle", property = "angle"),
            @Result(column = "vms_mgr_no", property = "vmsMgrNo"),

            @Result(column = "state_cd", property = "stateCd")
    })
    public List<CctvSymVO> selectExtent(
    		@Param("extent") String extent,
    		@Param("codes") String codes,
    		@Param("admNm") String admNm,
    		@Param("emdCd") String emdCd,
    		@Param("orgMgrNo") String orgMgrNo,
    		@Param("cctvGbnCd") String cctvGbnCd,
    		@Param("cctvNm") String cctvNm
    );

}
