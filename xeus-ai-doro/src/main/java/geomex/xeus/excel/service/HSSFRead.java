package geomex.xeus.excel.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import geomex.xeus.bigdata.service.CctvInstallVo;

/**
 * 2007년 이후 엑셀 파일을 읽는다.
 *  - 확장자 xlsx
 *
 * @author JSP_DEV
 *
 */
public class HSSFRead {

	private ArrayList<HashMap<String, ?>> ResultList = null;
	FileInputStream fis = null;

	public HSSFRead(String fileAuth) {
		try {
			this.fis = new FileInputStream(fileAuth);
		} catch (FileNotFoundException e) {
			System.out.println(">>>>>>>>>>>>>>>>>> XXSFRead error!! fileStream Fail!");
		}
	}

	public HSSFRead(File file) {
		try {
			this.fis = new FileInputStream(file);
		} catch (FileNotFoundException e) {
			System.out.println(">>>>>>>>>>>>>>>>>> XXSFRead error!! fileStream Fail!");
		}
	}

	public HSSFRead(FileInputStream fis) {
		this.fis = fis;
	}

	/**
	 * 시트별로 객체를 생성하여 리턴한다.
	 *
	 * @return
	 */
	public ArrayList<HashMap<String, ?>> getDataList(){

		this.readSheet(null);

		return ResultList;

	}

	/**
	 * 서초구 전용 엑셀 시트를 가져온다.
	 *
	 * @return
	 */
	public ArrayList<CctvInstallVo> getCustomData(String select){

		this.readSheet(select);

		return (ArrayList<CctvInstallVo>) ResultList.get(0).get(select);

	}

	/**
	 * 특정 엑셀 시트를 가져온다.
	 *
	 * @return
	 */
	public ArrayList<HashMap<String, ?>> getData(String select){

		this.readSheet(select);

		return ResultList;

	}

	/**
	 * 엑셀 시트를 읽어온다.
	 *
	 */
	private void readSheet(String select){

		HSSFWorkbook workbook = null;
		ResultList = new ArrayList<HashMap<String, ?>>();

		try {
			workbook = new HSSFWorkbook(fis);

	        //sheet 읽기
	        for(int i = 0 ; i < workbook.getNumberOfSheets(); i++) {
	        	HashMap<String, ArrayList<CctvInstallVo>> sheet = new HashMap<String, ArrayList<CctvInstallVo>>();

	        	String sheetNm = workbook.getSheetName(i);

	        	if ( select == null || select.equals(sheetNm) ) {
	        		sheet.put(sheetNm, this.readData(workbook.getSheet(sheetNm)));
	        		ResultList.add(sheet);

	        	}
	        }

		} catch (Exception e ) {
			System.out.println(">>>>>>>>>>>>>>>>>> HSSFRead error!!");
		}

	}

	/**
	 * 엑셀 데이터를 가져온다.
	 *
	 */
	private ArrayList<CctvInstallVo> readData(HSSFSheet sheet){

		ArrayList<CctvInstallVo> rowData = new ArrayList<CctvInstallVo>();

		//첫번째 줄 길이 ( 컬럼명 )
		int colSize = sheet.getRow(0).getLastCellNum();
		int rowSize = sheet.getLastRowNum();
		HSSFRow cols = sheet.getRow(0);

		for ( int i = 1; i < rowSize; i++ ) {

			CctvInstallVo vo = new CctvInstallVo();

			for ( int j = 0; j < colSize; j++ ) {
				HSSFRow row = sheet.getRow(i);
				String col = cols.getCell(j).toString();
				String val = this.chkColType(row.getCell(j));

				vo = ExcelUtils.setColToVo(vo, j, val);

			}
			rowData.add(vo);
		}

 		return rowData;
	}

	/**
	 * 데이터 형을 체크한다.
	 *
	 * @param cell
	 * @return
	 */
	private String chkColType(HSSFCell cell){

		String value="";
		if ( cell != null ) {
			if(cell.getCellType() == 0 ){
	            value= (int)cell.getNumericCellValue()+"";
			} else if ( cell.getCellType() == 1 ) {
				value= cell.getStringCellValue()+"";
	        }

		}

		return value;
	}

}
