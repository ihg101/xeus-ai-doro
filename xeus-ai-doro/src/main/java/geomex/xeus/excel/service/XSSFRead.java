package geomex.xeus.excel.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import geomex.xeus.bigdata.service.CctvInstallVo;
import geomex.xeus.bigdata.service.CovidVo;
import geomex.xeus.util.code.DateUtil;

/**
 * 2007년 이후 엑셀 파일을 읽는다.
 *  - 확장자 xlsx
 *
 * @author JSP_DEV
 *
 */
public class XSSFRead {

	private ArrayList<HashMap<String, ?>> ResultList = null;
	FileInputStream fis = null;

	public XSSFRead(String fileAuth) {
		try {
			this.fis = new FileInputStream(fileAuth);
		} catch (FileNotFoundException e) {
			System.out.println(">>>>>>>>>>>>>>>>>> XXSFRead error!! fileStream Fail!");
		}
	}

	public XSSFRead(File file) {
		try {
			this.fis = new FileInputStream(file);
		} catch (FileNotFoundException e) {
			System.out.println(">>>>>>>>>>>>>>>>>> XXSFRead error!! fileStream Fail!");
		}
	}

	public XSSFRead(FileInputStream fis) {
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
	 * COVID 엑셀 시트를 가져온다.
	 *
	 * @return
	 */
	public ArrayList<CovidVo> getCovidData(String select){

		this.readCovidSheet(select);

		return (ArrayList<CovidVo>) ResultList.get(0).get(select);

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

		XSSFWorkbook workbook = null;
		ResultList = new ArrayList<HashMap<String, ?>>();

		try {
			workbook = new XSSFWorkbook(fis);

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
			System.out.println(">>>>>>>>>>>>>>>>>> XSSFRead error!!");
		}

	}

	/**
	 * 엑셀 시트를 읽어온다.
	 *
	 */
	private void readCovidSheet(String select){

		XSSFWorkbook workbook = null;
		ResultList = new ArrayList<HashMap<String, ?>>();

		try {
			workbook = new XSSFWorkbook(fis);

			//sheet 읽기
			for(int i = 0 ; i < workbook.getNumberOfSheets(); i++) {
				if(i == 0){
					HashMap<String, ArrayList<CovidVo>> sheet = new HashMap<String, ArrayList<CovidVo>>();

					String sheetNm = workbook.getSheetName(i);

					sheet.put(sheetNm, this.readCovidData(workbook.getSheet(sheetNm)));
					ResultList.add(sheet);
				}
			}

		} catch (Exception e ) {
			System.out.println(">>>>>>>>>>>>>>>>>> XSSFRead error!!");
		}

	}

	/**
	 * 엑셀 데이터를 가져온다.
	 *
	 */
	private ArrayList<CctvInstallVo> readData(XSSFSheet sheet){

		ArrayList<CctvInstallVo> rowData = new ArrayList<CctvInstallVo>();

		//첫번째 줄 길이 ( 컬럼명 )
		int colSize = sheet.getRow(0).getLastCellNum();
		int rowSize = sheet.getLastRowNum();
		XSSFRow cols = sheet.getRow(0);

		for ( int i = 0; i < rowSize; i++ ) {

			int readIdx = i + 1;

			CctvInstallVo vo = new CctvInstallVo();

			for ( int j = 0; j < colSize; j++ ) {
				XSSFRow row = sheet.getRow(readIdx);

				String col = cols.getCell(j).toString();
				String val = this.chkColType(row.getCell(j));
				vo = ExcelUtils.setColToVo(vo, j, val);
			}

			rowData.add(vo);
		}

 		return rowData;
	}

	/**
	 * 엑셀 데이터를 가져온다.
	 *
	 */
	private ArrayList<CovidVo> readCovidData(XSSFSheet sheet){

		ArrayList<CovidVo> rowData = new ArrayList<CovidVo>();

		//첫번째 줄 길이 ( 컬럼명 )
		int colSize = sheet.getRow(0).getLastCellNum();
		int rowSize = sheet.getLastRowNum();
		XSSFRow cols = sheet.getRow(0);

		String regDat = DateUtil.getStrSec();

		for ( int i = 0; i < rowSize; i++ ) {

			int readIdx = i + 1;

			CovidVo vo = new CovidVo();

			for ( int j = 0; j < colSize; j++ ) {
				XSSFRow row = sheet.getRow(readIdx);

				String col = cols.getCell(j).toString();
				//String val = this.chkColType(row.getCell(j));
				String val = null;
				try{
					val = row.getCell(j).getStringCellValue() + "";
				}catch(Exception e){
					val = row.getCell(j).getNumericCellValue() + "";
				}
				vo = ExcelUtils.setColToVo(vo, j, val);
				vo.setRegDat(regDat);
			}

			if(vo.getLat() != null && !"".equals(vo.getLat())
			&& vo.getLon() != null && !"".equals(vo.getLon())
			&& vo.getStartDat() != null && !"".equals(vo.getStartDat())){
				rowData.add(vo);
			}
		}

		return rowData;
	}

	/**
	 * 데이터 형을 체크한다.
	 *
	 * @param cell
	 * @return
	 */
	private String chkColType(XSSFCell cell){

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
