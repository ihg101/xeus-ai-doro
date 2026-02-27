package gmx.gis.excel.service;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import gmx.gis.sysmgr.service.GMT_ColumnVo;

/**
 *
 * <pre>
 * 엑셀 파일을 생성하는 서비스 입니다.
 * </pre>
 *
 * @author 이주영
 *
 */
@Service
public class GMT_ExcelFileService extends EgovAbstractServiceImpl {

	/**
	 * 데이터를 파싱하여 엑셀(xlsx - XSSFWorkbook) 객체를 생성하여 리턴합니다.
	 *
	 * @param column - GMT_ColumnMapper.getColumnInfo
	 * @param data - GMT_ColumnMapper.getTableValues
	 * @return
	 * @throws Exception
	 */
	public XSSFWorkbook createExcel(ArrayList<GMT_ColumnVo> column, ArrayList<HashMap<String, String>> data) throws Exception {

		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet();
		XSSFRow row = sheet.createRow(0);
		XSSFCell cell;

		HashMap<String, String> firstRow = (HashMap<String, String>) data.get(0);
		String geometryType =  String.valueOf(firstRow.get("geometry_wkt"));
		if(geometryType.contains("POINT")) geometryType = "POINT";
		if(geometryType.contains("LINE")) geometryType = "LINE";
		if(geometryType.contains("POLYGON")) geometryType = "POLYGON";

		String[] ignoreFields = { "_geometry", "_annox", "_annoy", "_gid" };
		for(int i=0; i<ignoreFields.length; i++){
			for(GMT_ColumnVo vo : column){
				if(ignoreFields[i].equals(vo.getColId())){
					column.remove(vo);
					break;
				}
			}
		}

		GMT_ColumnVo lonVo = new GMT_ColumnVo();
		lonVo.setColId("geometry_lon");
		lonVo.setColNm("중심점 경도 (공간 연산)");

		column.add(0, lonVo);

		GMT_ColumnVo latVo = new GMT_ColumnVo();
		latVo.setColId("geometry_lat");
		latVo.setColNm("중심점 위도 (공간 연산)");

		column.add(1, latVo);

		if("LINE".equals(geometryType)){
			GMT_ColumnVo lengthVo = new GMT_ColumnVo();
			lengthVo.setColId("geometry_length");
			lengthVo.setColNm("길이 (공간 연산)");

			column.add(2, lengthVo);
		}

		if("POLYGON".equals(geometryType)){
			GMT_ColumnVo areaVo = new GMT_ColumnVo();
			areaVo.setColId("geometry_area");
			areaVo.setColNm("면적 (공간 연산)");

			column.add(2, areaVo);
		}

		for(int i=0; i<column.size(); i++){
			String colId = column.get(i).getColId();
			String colNm = column.get(i).getColNm();

			cell = row.createCell(i);

			if(StringUtils.isEmpty(colNm)){
				cell.setCellValue(colId);
			}else{
				cell.setCellValue(colNm + "(" + colId + ")");
			}
		}

		for(int rowIdx=0; rowIdx<data.size(); rowIdx++){
			HashMap<String, String> dataItem = (HashMap<String, String>) data.get(rowIdx);

			row = sheet.createRow(rowIdx + 1);

			for(int i=0; i<column.size(); i++) {
				String colId = column.get(i).getColId();
				String colTyp = column.get(i).getDataType();
				//텍스트 필드라도 길이를 설정하지 않는 경우가 존재
				//String stringSize = column.get(i).getStringSize();
				String stringValue = String.valueOf(dataItem.get(colId));

				//if("_geometry".equals(colId) || "_annox".equals(colId) || "_annoy".equals(colId) || "_gid".equals(colId)) continue;

				boolean isNumber = false;
				if("text".equals(colTyp)) isNumber = false;
				if(StringUtils.contains(colTyp, "character")) isNumber = false;
				if(StringUtils.isEmpty(stringValue) || "null".equals(stringValue)){
					stringValue = "";
					isNumber = false;
				}

				if(isNumber){
					Number numVal = NumberFormat.getInstance().parse(stringValue);

					cell = row.createCell(i);

					if(numVal instanceof Long){
						cell.setCellValue((Long) numVal);
					}else if(numVal instanceof Double){
						cell.setCellValue((Double) numVal);
					}else if(numVal instanceof Integer){
						cell.setCellValue((Integer) numVal);
					}
				}else{
					cell = row.createCell(i);
					cell.setCellValue(stringValue);
				}
			}
		}

		return workbook;
	}
}
