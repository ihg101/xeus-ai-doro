package geomex.xeus.bigdata.service;

import java.io.Writer;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Service;

import com.vividsolutions.jts.geom.Envelope;

import geomex.xeus.equipmgr.service.MapScale;

@Service
public class BigDataQueryService {
    protected Logger logger = LoggerFactory.getLogger(BigDataQueryService.class);

    @Resource(name = "dataSource")
    DataSource dataSource;

    private Connection getConnection() {
        Connection con = null;
        try {
            con = DataSourceUtils.getConnection(dataSource);
        } catch (Exception e) {
            logger.error(ExceptionUtils.getStackTrace(e));
        }
        return con;
    }

    public void getResultAsHeatMapFastJson(HashMap<String, String> kvp, Writer writer) throws Exception {
        Connection con = this.getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            String mgrNo = kvp.get("MGR_NO");
            String epsg = kvp.get("EPSG");
            String widthString = kvp.get("MAP_WIDTH");
            String heightString = kvp.get("MAP_HEIGHT");
            String grid = kvp.get("GRID");
            int mapWidth = Integer.parseInt(StringUtils.trim(widthString));
            int mapHeight = Integer.parseInt(StringUtils.trim(heightString));

            Envelope env = parseBBOX(kvp.get("BBOX"));
            String extent = makeExtent(env, epsg);

            MapScale mapScale = new MapScale();
            mapScale.init(env, mapWidth, mapHeight);
            String sql = getSQL(mapScale, extent, mgrNo, grid);
            //
            ps = con.prepareStatement(sql);
            ps.execute();
            rs = ps.getResultSet();
            //
            int cnt = 0;
            writer.write("[");
            while (rs.next()) {
                double px = mapScale.toWorldX(rs.getDouble(1)); // scrx -> worldx
                double py = mapScale.toWorldY(rs.getDouble(2)); // scry -> worldy
                int rsValue = rs.getInt(3);  // result_val
                //
                if (cnt > 0) {
                    writer.write(",");
                }
                writer.write("{");
                writer.write("\"x\":");
                writer.write(String.valueOf((int) px));
                writer.write(",\"y\":");
                writer.write(String.valueOf((int) py));
                writer.write(",\"v\":");
                writer.write(String.valueOf(rsValue));
                writer.write("}");
                //
                if (cnt % 100 == 0) {
                    writer.flush();
                }
                cnt++;
            }
            writer.write("]");
            writer.flush();
        } catch (Exception e) {
            logger.error(ExceptionUtils.getStackTrace(e));
        } finally {
            close(con, ps, rs);
        }
    }

    private String getSQL(MapScale scale, String extent, String mgrNo, String grid) {
        double mapW = scale.mapWidth * 0.5;
        double mapH = scale.mapHeight * 0.5;
        double cX = scale.mapCenterX;
        double cY = scale.mapCenterY;
        double frac = scale.fracScrScaleFactor;

        //double mapx = mapW + ((cX - grid._annox) * frac);
        //double mapy = mapH + ((cY - grid._annoy) * frac);

        StringBuilder sql = new StringBuilder();
        sql.append("select ");
        sql.append("round(");
        sql.append(mapW).append("-((").append(cX).append("-grid._annox)*").append(frac).append(")) as scrx,");
        sql.append("round(");
        sql.append(mapH).append("+((").append(cY).append("-grid._annoy)*").append(frac).append(")) as scry,");
        sql.append("sum(result.result_val)");
        sql.append(" from");

        if (StringUtils.equals("100", grid)) {
            sql.append(" xeus.bigdata_grid_100m grid");
        } else {
            sql.append(" xeus.bigdata_grid_10m grid");
        }

        //sql.append(",xeus.bigdata_analy_result").append(mgrNo).append(" result");
        sql.append(",").append(mgrNo).append(" result");

        if (StringUtils.equals("100", grid)) {
            sql.append(" where grid._gid = result.grid100m_gid");
        } else {
            sql.append(" where grid._gid = result.grid10m_gid");
        }

        sql.append(" and ST_Intersects(grid._geometry,").append(extent).append(")");
        sql.append(" group by scrx, scry");
        //sql.append("  limit 4;");

        return sql.toString();
    }

    private Envelope parseBBOX(String bbox) throws Exception {
        String boxstring[] = StringUtils.split(bbox, ",");
        double minx = Double.parseDouble(boxstring[0]);
        double miny = Double.parseDouble(boxstring[1]);
        double maxx = Double.parseDouble(boxstring[2]);
        double maxy = Double.parseDouble(boxstring[3]);
        return new Envelope(minx, maxx, miny, maxy);
    }

    // Extent를 PostGIS WKT형식으로 변환한다.
    private String makeExtent(Envelope bbox, String epsg) {
        StringBuilder sb = new StringBuilder();
        sb.append("\'SRID=").append(epsg).append(";POLYGON((");
        sb.append(bbox.getMinX()).append(" ").append(bbox.getMinY()).append(",");
        sb.append(bbox.getMinX()).append(" ").append(bbox.getMaxY()).append(",");
        sb.append(bbox.getMaxX()).append(" ").append(bbox.getMaxY()).append(",");
        sb.append(bbox.getMaxX()).append(" ").append(bbox.getMinY()).append(",");
        sb.append(bbox.getMinX()).append(" ").append(bbox.getMinY());
        sb.append("))\'::geometry");
        return sb.toString();
    }

    /**
     * <b>실제 분석시 @Async 등을 이용하여 배치작업 필요.</b>
     *
     * @param analyzeParam
     */
    @Deprecated
    public void analyze(HashMap<String, Object> analyzeParam) {
        Connection con = this.getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            String analyzeMgrSeq = (String) analyzeParam.get("analyMgrSeq");
            @SuppressWarnings("unchecked") ArrayList<BigDataLayerSetVo> layerList = (ArrayList<BigDataLayerSetVo>) analyzeParam
                .get("layerList");

            for (int i = 0; i < layerList.size(); i++) {
                String tbl = layerList.get(i).getLayerId();
                String col = layerList.get(i).getItemNm();

                String query = "";
                query += " SELECT weight.weight_val, weight.impact_m, ";
                query += " 	 	  tbl." + col + ", tbl." + col + " + weight.weight_val AS result_val, ";
                query += " 	 	  grid.* ";

                query += " FROM xeus." + tbl + " AS tbl, ";
                query += " 	 	xeus.bigdata_analy_weight" + analyzeMgrSeq + " AS weight, ";
                query += " 	 	xeus.bigdata_grid_10m AS grid ";

                query += " WHERE weight.layer_id = '" + tbl + "' ";
                query += " AND weight.analy_mgr_seq = " + analyzeMgrSeq + " ";
                query += " AND tbl." + col + " >= weight.min_val AND tbl." + col + " <= weight.max_val ";
                query += " AND st_intersects(st_buffer(tbl._geometry, weight.impact_m), grid._geometry) ";

                ps = con.prepareStatement(query);
                ps.execute();
                rs = ps.getResultSet();

                ArrayList<BigDataAnalyzeResultVo> resultList = new ArrayList<BigDataAnalyzeResultVo>();
                while (rs.next()) {
                    BigDataAnalyzeResultVo vo = new BigDataAnalyzeResultVo();
                    vo.setAnalyMgrSeq(analyzeMgrSeq);
                    //vo.setGrid1kGid("1");
                    vo.setGrid100mGid("1");
                    vo.setGrid10mGid(rs.getString("_gid"));
                    vo.setGridTxt(rs.getString("grid_txt"));
                    vo.setResultVal(rs.getString("result_val"));
                    vo.setRgbTxt("주소");

                    resultList.add(vo);

                }

            }
        } catch (Exception e) {
            logger.error(ExceptionUtils.getStackTrace(e));
        } finally {
            close(con, ps, rs);
        }
    }

    /**
     * 사용자 레이어를 생성합니다.
     *
     * @param analyzeParam
     */
    public boolean createLayerTable(HashMap<String, Object> map) {
    	Connection con = this.getConnection();
    	PreparedStatement ps = null;
    	ResultSet rs = null;

    	boolean result = true;

    	String tblId = (String) map.get("tblId");
    	String tblNm = (String) map.get("tblNm");
    	String tblTyp = (String) map.get("tblTyp");
    	@SuppressWarnings("unchecked") ArrayList<String> column = (ArrayList<String>) map.get("column");
    	@SuppressWarnings("unchecked") HashMap<String, String> fieldType = (HashMap<String, String>) map.get("fieldType");
    	try {

			StringBuilder sb = new StringBuilder();

			sb.append(" CREATE TABLE xeus." + tblId + " ( ");
			for(int i=0; i<column.size(); i++){
				String type = "character varying(200)";
				if(fieldType.get(column.get(i)) != null){
					if(!"".equals(fieldType.get(column.get(i)))){
						if("numeric".equals(fieldType.get(column.get(i)))){
							type = "numeric(8,0)";
						}else if("character varying".equals(fieldType.get(column.get(i)))){
							type = "character varying(200)";
						}
					}
				}
				sb.append(" 	\"" + column.get(i) + "\" " + type + ", ");
			}

			sb.append(" 	jibn_addr character varying(200) COLLATE pg_catalog.\"default\", ");
			sb.append(" 	road_addr character varying(200) COLLATE pg_catalog.\"default\", ");
			sb.append(" 	lat numeric(24,8), ");
			sb.append(" 	lon numeric(24,8), ");
			sb.append(" 	_gid bigserial NOT NULL, ");
			sb.append(" 	_annox numeric(24,4), ");
			sb.append(" 	_annoy numeric(24,4), ");
			if("point".equals(tblTyp)){
				sb.append(" 	_geometry geometry(Point,5186), ");
			}else{
				sb.append(" 	_geometry geometry(MultiPolygon,5186), ");
			}
			sb.append(" 	CONSTRAINT " + tblId + "_pk PRIMARY KEY (_gid) ");
			sb.append(" ); ");

			//sb.append(" CREATE INDEX xeus_" + tblId + "_gidx ON xeus." + tblId + " USING gist (_geometry) TABLESPACE pg_default; ");

			if(tblNm != null && !"".equals(tblNm)){
				sb.append(" COMMENT ON TABLE  xeus." + tblId + " IS '" + tblNm + "'; ");
			}

			for(int i=0; i<column.size(); i++){
			sb.append(" COMMENT ON COLUMN xeus." + tblId + ".\"" + column.get(i) + "\" IS '" + column.get(i) + "'; ");
			}

			sb.append(" COMMENT ON COLUMN xeus." + tblId + ".jibn_addr IS '지번주소'; ");
			sb.append(" COMMENT ON COLUMN xeus." + tblId + ".road_addr IS '도로명주소'; ");
			sb.append(" COMMENT ON COLUMN xeus." + tblId + ".lat IS '위도'; ");
			sb.append(" COMMENT ON COLUMN xeus." + tblId + ".lon IS '경도'; ");
			sb.append(" COMMENT ON COLUMN xeus." + tblId + "._gid IS '도형식별번호'; ");
			sb.append(" COMMENT ON COLUMN xeus." + tblId + "._annox IS '주기X좌표'; ");
			sb.append(" COMMENT ON COLUMN xeus." + tblId + "._annoy IS '주기Y좌표'; ");
			sb.append(" COMMENT ON COLUMN xeus." + tblId + "._geometry IS '도형정보'; ");

			/*if("point".equals(tblTyp)){

				sb.append(" CREATE TABLE xeus." + tblId + " ( ");

				for(int i=0; i<column.size(); i++){
				//sb.append(" 	\"" + column.get(i) + "\" numeric(8,0), ");
				sb.append(" 	\"" + column.get(i) + "\" character varying(200), ");
				}

				sb.append(" 	lat numeric(24,8), ");
				sb.append(" 	lon numeric(24,8), ");
				sb.append(" 	_gid bigserial NOT NULL, ");
				sb.append(" 	_annox numeric(24,4), ");
				sb.append(" 	_annoy numeric(24,4), ");
				sb.append(" 	_geometry geometry(Point,5186), ");
				sb.append(" 	CONSTRAINT " + tblId + "_pk PRIMARY KEY (_gid) ");
				sb.append(" ); ");

				//sb.append(" CREATE INDEX xeus_" + tblId + "_gidx ON xeus." + tblId + " USING gist (_geometry) TABLESPACE pg_default; ");

				if(tblNm != null && !"".equals(tblNm)){
					sb.append(" COMMENT ON TABLE  xeus." + tblId + " IS '" + tblNm + "'; ");
				}

				for(int i=0; i<column.size(); i++){
				sb.append(" COMMENT ON COLUMN xeus." + tblId + ".\"" + column.get(i) + "\" IS '" + column.get(i) + "'; ");
				}

				sb.append(" COMMENT ON COLUMN xeus." + tblId + ".lat IS '위도'; ");
				sb.append(" COMMENT ON COLUMN xeus." + tblId + ".lon IS '경도'; ");
				sb.append(" COMMENT ON COLUMN xeus." + tblId + "._gid IS '도형식별번호'; ");
				sb.append(" COMMENT ON COLUMN xeus." + tblId + "._annox IS '주기X좌표'; ");
				sb.append(" COMMENT ON COLUMN xeus." + tblId + "._annoy IS '주기Y좌표'; ");
				sb.append(" COMMENT ON COLUMN xeus." + tblId + "._geometry IS '도형정보(점)'; ");

			}else{

				sb.append(" CREATE TABLE xeus." + tblId + " ( ");
				for(int i=0; i<column.size(); i++){
				//sb.append(" 	\"" + column.get(i) + "\" numeric(8,0), ");
				sb.append(" 	\"" + column.get(i) + "\" character varying(200), ");
				}

				sb.append(" 	jibn_addr character varying(200) COLLATE pg_catalog.\"default\", ");
				sb.append(" 	road_addr character varying(200) COLLATE pg_catalog.\"default\", ");
				sb.append(" 	lat numeric(24,8), ");
				sb.append(" 	lon numeric(24,8), ");
				sb.append(" 	_gid bigserial NOT NULL, ");
				sb.append(" 	_annox numeric(24,4), ");
				sb.append(" 	_annoy numeric(24,4), ");
				sb.append(" 	_geometry geometry(MultiPolygon,5186), ");
				sb.append(" 	CONSTRAINT " + tblId + "_pk PRIMARY KEY (_gid) ");
				sb.append(" ); ");

				//sb.append(" CREATE INDEX xeus_" + tblId + "_gidx ON xeus." + tblId + " USING gist (_geometry) TABLESPACE pg_default; ");

				if(tblNm != null && !"".equals(tblNm)){
					sb.append(" COMMENT ON TABLE  xeus." + tblId + " IS '" + tblNm + "'; ");
				}

				for(int i=0; i<column.size(); i++){
				sb.append(" COMMENT ON COLUMN xeus." + tblId + ".\"" + column.get(i) + "\" IS '" + column.get(i) + "'; ");
				}

				sb.append(" COMMENT ON COLUMN xeus." + tblId + ".jibn_addr IS '지번주소'; ");
				sb.append(" COMMENT ON COLUMN xeus." + tblId + ".road_addr IS '도로명주소'; ");
				sb.append(" COMMENT ON COLUMN xeus." + tblId + ".lat IS '위도'; ");
				sb.append(" COMMENT ON COLUMN xeus." + tblId + ".lon IS '경도'; ");
				sb.append(" COMMENT ON COLUMN xeus." + tblId + "._gid IS '도형식별번호'; ");
				sb.append(" COMMENT ON COLUMN xeus." + tblId + "._annox IS '주기X좌표'; ");
				sb.append(" COMMENT ON COLUMN xeus." + tblId + "._annoy IS '주기Y좌표'; ");
				sb.append(" COMMENT ON COLUMN xeus." + tblId + "._geometry IS '도형정보(점)'; ");

			}*/

			try {
				con.setAutoCommit(true);
				ps = con.prepareStatement(sb.toString());
				ps.execute();
			} catch (Exception e) {
				result = false;
				logger.error(ExceptionUtils.getStackTrace(e));
				throw e;
			} finally {
				close(con, ps, null);
			}
    	} catch (Exception e) {
    		result = false;
    		logger.error(ExceptionUtils.getStackTrace(e));
    	} finally {
    		close(con, ps, rs);
    	}

    	return result;
    }

    /**
     * 사용자 공간정보 레이어를 생성합니다.
     *
     * @param analyzeParam
     */
    public boolean createDrawLayerTable(HashMap<String, Object> map) {
    	Connection con = this.getConnection();
    	PreparedStatement ps = null;
    	ResultSet rs = null;

    	boolean result = true;

    	String tblId = (String) map.get("tblId");
    	String tblNm = (String) map.get("tblNm");
    	JSONArray headJson = (JSONArray) map.get("column");
    	try {

    		StringBuilder sb = new StringBuilder();

    		sb.append("DROP TABLE IF EXISTS xeus.").append(tblId).append(" CASCADE;");
    		//sb.append("DROP SEQUENCE IF EXISTS xeus.").append(tblId).append("__gid_seq").append(" CASCADE;");

			sb.append(" CREATE TABLE xeus." + tblId + " ( ");

			for(int i=0; i<headJson.size(); i++){
    			JSONObject headSet = (JSONObject) headJson.get(i);
    			for(Object k : headSet.keySet()){
    				String col = (String) k;
    				String colTyp = "character varying(200)";
    				if("numeric".equals((String) headSet.get(col))){
    					colTyp = "numeric(8,0)";
    				}

    				sb.append(" 	\"" + col + "\" " + colTyp + ", ");
    			}
    		}

			sb.append(" 	_gid bigserial NOT NULL, ");
			sb.append(" 	_annox numeric(24,4), ");
			sb.append(" 	_annoy numeric(24,4), ");
			sb.append(" 	_geometry geometry(Polygon,5186), ");
			sb.append(" 	CONSTRAINT " + tblId + "_pk PRIMARY KEY (_gid) ");
			sb.append(" ); ");

			sb.append(" CREATE INDEX xeus_" + tblId + "_gidx ON xeus." + tblId + " USING gist (_geometry) TABLESPACE pg_default; ");

			if(tblNm != null && !"".equals(tblNm)){
				sb.append(" COMMENT ON TABLE  xeus." + tblId + " IS '" + tblNm + "'; ");
			}

			for(int i=0; i<headJson.size(); i++){
    			JSONObject headSet = (JSONObject) headJson.get(i);
    			for(Object k : headSet.keySet()){
    				String col = (String) k;

    				sb.append(" COMMENT ON COLUMN xeus." + tblId + ".\"" + col + "\" IS '" + col + "'; ");
    			}
    		}

			sb.append(" COMMENT ON COLUMN xeus." + tblId + "._gid IS '도형식별번호'; ");
			sb.append(" COMMENT ON COLUMN xeus." + tblId + "._annox IS '주기X좌표'; ");
			sb.append(" COMMENT ON COLUMN xeus." + tblId + "._annoy IS '주기Y좌표'; ");
			sb.append(" COMMENT ON COLUMN xeus." + tblId + "._geometry IS '도형정보(면)'; ");

    		try {
    			con.setAutoCommit(true);
    			ps = con.prepareStatement(sb.toString());
    			ps.execute();
    		} catch (Exception e) {
    			result = false;
    			logger.error(ExceptionUtils.getStackTrace(e));
    			throw e;
    		} finally {
    			close(con, ps, null);
    		}
    	} catch (Exception e) {
    		result = false;
    		logger.error(ExceptionUtils.getStackTrace(e));
    	} finally {
    		close(con, ps, rs);
    	}

    	return result;
    }

    /**
     * 사용자 데이터를 추가합니다.
     *
     * @param analyzeParam
     */
    public boolean insertLayerTable(HashMap<String, Object> tblParam, ArrayList<ArrayList<BigDataAnalyUserVo>> body) {
    	Connection con = this.getConnection();
    	PreparedStatement ps = null;
    	ResultSet rs = null;

    	boolean result = true;

    	try {

    		String tblId = (String) tblParam.get("tblId");
			String tblTyp = (String) tblParam.get("tblTyp");

			@SuppressWarnings("unchecked")
			ArrayList<String> column = (ArrayList<String>) tblParam.get("column");

    		StringBuilder sb = new StringBuilder();
    		for(int l=0; l<body.size(); l++){
				ArrayList<BigDataAnalyUserVo> list = body.get(l);

				if("point".equals(tblTyp)){
					for(int i=0; i<list.size(); i++){
						if(!list.get(i).getIsError()){
							sb.append(" INSERT INTO xeus." + tblId + " ( ");

							for(int c=0; c<column.size(); c++){
								sb.append(" \"" + column.get(c) + "\", ");
							}
							sb.append(" jibn_addr, road_addr, ");

							if(list.get(i).getLat() != null && list.get(i).getLon() != null){
								if(!"".equals(list.get(i).getLat()) && !"".equals(list.get(i).getLon())){
									sb.append(" lat, lon, ");
								}
							}

							sb.append(" _geometry  ) ");

							sb.append(" VALUES ( ");

							if(list.get(i).getField1() != null)  sb.append(" '" + list.get(i).getField1() + "', ");
							if(list.get(i).getField2() != null)  sb.append(" '" + list.get(i).getField2() + "', ");
							if(list.get(i).getField3() != null)  sb.append(" '" + list.get(i).getField3() + "', ");
							if(list.get(i).getField4() != null)  sb.append(" '" + list.get(i).getField4() + "', ");
							if(list.get(i).getField5() != null)  sb.append(" '" + list.get(i).getField5() + "', ");
							if(list.get(i).getField6() != null)  sb.append(" '" + list.get(i).getField6() + "', ");
							if(list.get(i).getField7() != null)  sb.append(" '" + list.get(i).getField7() + "', ");
							if(list.get(i).getField8() != null)  sb.append(" '" + list.get(i).getField8() + "', ");
							if(list.get(i).getField9() != null)  sb.append(" '" + list.get(i).getField9() + "', ");
							if(list.get(i).getField10() != null) sb.append(" '" + list.get(i).getField10() + "', ");

							sb.append(" '" + list.get(i).getJibnAddr() + "', ");
							sb.append(" '" + list.get(i).getRoadAddr() + "', ");

							if(list.get(i).getLat() != null && list.get(i).getLon() != null){
								if(!"".equals(list.get(i).getLat()) && !"".equals(list.get(i).getLon())){
									sb.append(" '" + list.get(i).getLat() + "', ");
									sb.append(" '" + list.get(i).getLon() + "', ");
								}
							}

							String geometry = "st_transform(st_setsrid(st_makepoint(" + list.get(i).getLon() + ", " + list.get(i).getLat() + "), 4326), 5186)";
							if(list.get(i).getGeometry() != null){
								if(!"".equals(list.get(i).getGeometry())){
									geometry = "'" + list.get(i).getGeometry() + "'";
								}
							}
							sb.append(" " + geometry + " ");
							sb.append(" ); ");
						}
					}

				}else{
					for(int i=0; i<list.size(); i++){
						if(!list.get(i).getIsError()){
							sb.append(" INSERT INTO xeus." + tblId + " ( ");

							for(int c=0; c<column.size(); c++){
								sb.append(" \"" + column.get(c) + "\", ");
							}
							sb.append(" jibn_addr, road_addr, ");

							if(list.get(i).getLat() != null && list.get(i).getLon() != null){
								if(!"".equals(list.get(i).getLat()) && !"".equals(list.get(i).getLon())){
									sb.append(" lat, lon, ");
								}
							}

							sb.append(" _geometry  ) ");

							sb.append(" VALUES ( ");

							if(list.get(i).getField1() != null)  sb.append(" '" + list.get(i).getField1() + "', ");
							if(list.get(i).getField2() != null)  sb.append(" '" + list.get(i).getField2() + "', ");
							if(list.get(i).getField3() != null)  sb.append(" '" + list.get(i).getField3() + "', ");
							if(list.get(i).getField4() != null)  sb.append(" '" + list.get(i).getField4() + "', ");
							if(list.get(i).getField5() != null)  sb.append(" '" + list.get(i).getField5() + "', ");
							if(list.get(i).getField6() != null)  sb.append(" '" + list.get(i).getField6() + "', ");
							if(list.get(i).getField7() != null)  sb.append(" '" + list.get(i).getField7() + "', ");
							if(list.get(i).getField8() != null)  sb.append(" '" + list.get(i).getField8() + "', ");
							if(list.get(i).getField9() != null)  sb.append(" '" + list.get(i).getField9() + "', ");
							if(list.get(i).getField10() != null) sb.append(" '" + list.get(i).getField10() + "', ");

							sb.append(" '" + list.get(i).getJibnAddr() + "', ");
							sb.append(" '" + list.get(i).getRoadAddr() + "', ");
							if(list.get(i).getLat() != null && list.get(i).getLon() != null){
								if(!"".equals(list.get(i).getLat()) && !"".equals(list.get(i).getLon())){
									sb.append(" '" + list.get(i).getLat() + "', ");
									sb.append(" '" + list.get(i).getLon() + "', ");
								}
							}
							sb.append(" '" + list.get(i).getGeometry() + "' ");
							sb.append(" ); ");
						}
					}
				}
			}

    		try {
    			con.setAutoCommit(false);
    			ps = con.prepareStatement(sb.toString());
    			ps.execute();
    			con.commit();
    		} catch (Exception e) {
    			con.rollback();
    			result = false;
    			logger.error(ExceptionUtils.getStackTrace(e));
    			throw e;
    		} finally {
    			con.setAutoCommit(true);
    			close(con, ps, null);
    		}
    	} catch (Exception e) {
    		result = false;
    		logger.error(ExceptionUtils.getStackTrace(e));
    	} finally {
    		close(con, ps, rs);
    	}

    	return result;
    }

    /**
     * 사용자 데이터를 추가합니다.
     *
     * @param analyzeParam
     */
    public boolean insertDrawLayerTable(HashMap<String, Object> tblParam, JSONArray bodyJson) {
    	Connection con = this.getConnection();
    	PreparedStatement ps = null;
    	ResultSet rs = null;

    	boolean result = true;

    	try {

    		String tblId = (String) tblParam.get("tblId");

    		JSONArray headJson = (JSONArray) tblParam.get("column");

    		StringBuilder sb = new StringBuilder();

			for(int i=0; i<bodyJson.size(); i++){
				sb.append(" INSERT INTO xeus." + tblId + " ( ");

				for(int c=0; c<headJson.size(); c++){
	    			JSONObject headSet = (JSONObject) headJson.get(c);
	    			for(Object k : headSet.keySet()){
	    				String col = (String) k;
	    				if(!"wkt".equals(col)){
	    					sb.append(" \"" + col + "\", ");
	    				}
	    			}
	    		}
				sb.append(" _geometry ) ");

				sb.append(" VALUES ( ");

    			JSONObject bodySet = (JSONObject) bodyJson.get(i);

    			for(int c=0; c<headJson.size(); c++){
	    			JSONObject headSet = (JSONObject) headJson.get(c);
	    			for(Object k : headSet.keySet()){
	    				String col = (String) k;
	    				if(!"wkt".equals(col)){
	    					sb.append(" '" + bodySet.get(col) + "', ");
	    				}
	    			}
	    		}

				String geometry = "st_setsrid(st_geomfromtext('" + bodySet.get("wkt") + "'), 5186)";
				sb.append(" " + geometry + " ");
				sb.append(" ); ");
			}

    		try {
    			con.setAutoCommit(false);
    			ps = con.prepareStatement(sb.toString());
    			ps.execute();
    			con.commit();
    		} catch (Exception e) {
    			con.rollback();
    			result = false;
    			logger.error(ExceptionUtils.getStackTrace(e));
    			throw e;
    		} finally {
    			con.setAutoCommit(true);
    			close(con, ps, null);
    		}
    	} catch (Exception e) {
    		result = false;
    		logger.error(ExceptionUtils.getStackTrace(e));
    	} finally {
    		close(con, ps, rs);
    	}

    	return result;
    }

    private void close(Connection con, PreparedStatement ps, ResultSet rs) {
        try {
            if (rs != null) rs.clearWarnings();
        } catch (Exception e) {}
        try {
            if (rs != null) rs.close();
        } catch (Exception e) {}
        try {
            if (ps != null) ps.clearParameters();
        } catch (Exception e) {}
        try {
            if (ps != null) ps.clearWarnings();
        } catch (Exception e) {}
        try {
            if (ps != null) ps.close();
        } catch (Exception e) {}
        try {
            if (con != null) con.close();
        } catch (Exception e) {}
    }
}
