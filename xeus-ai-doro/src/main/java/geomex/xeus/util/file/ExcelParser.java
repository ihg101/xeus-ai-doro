package geomex.xeus.util.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import geomex.xeus.bigdata.service.BigDataAnalyUserVo;

public class ExcelParser {

	private FileInputStream file;
	private XSSFWorkbook book;
	private XSSFSheet sheet;
	private boolean isPoint;

	public ExcelParser(String fullPath, String geomType) throws IOException{
		try {
			File f = new File(fullPath);
			if(f.exists()){
				this.file = new FileInputStream(fullPath);
				book = new XSSFWorkbook(file);
				sheet = book.getSheetAt(0);

				if("point".equals(geomType)) this.isPoint = true;
			}else{
				throw new FileNotFoundException();
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}

	private void setVo(BigDataAnalyUserVo vo, int idx, String value){
		if(idx == 0 || idx == 1) value = value.replace("서울특별시 ", "").replace("서울특별시", "");

		if(idx == 0) vo.setJibnAddr(value);
		if(idx == 1) vo.setRoadAddr(value);
		if(idx == 2) vo.setLat(value);
		if(idx == 3) vo.setLon(value);

		if(idx == 4)  vo.setField1(value);
		if(idx == 5)  vo.setField2(value);
		if(idx == 6)  vo.setField3(value);
		if(idx == 7)  vo.setField4(value);
		if(idx == 8)  vo.setField5(value);
		if(idx == 9)  vo.setField6(value);
		if(idx == 10) vo.setField7(value);
		if(idx == 11) vo.setField8(value);
		if(idx == 12) vo.setField9(value);
		if(idx == 13) vo.setField10(value);

		vo.setIsError(false);
		vo.setIsPoint(this.isPoint);

		if("".equals(vo.getJibnAddr()) && "".equals(vo.getRoadAddr()) && vo.getLon() == null && vo.getLat() == null){
			vo.setIsError(true);
		}
		if("".equals(vo.getJibnAddr()) && "".equals(vo.getRoadAddr())){
			if(vo.getLon() == null || vo.getLat() == null){
				vo.setIsError(true);
			}
			if("".equals(vo.getLon()) || "".equals(vo.getLat())){
				vo.setIsError(true);
			}
		}
	}

	public ArrayList<ArrayList<BigDataAnalyUserVo>> parseBody() throws IOException{
		int rows = this.sheet.getPhysicalNumberOfRows();
		int cells = this.parseTitle().size();

		ArrayList<ArrayList<BigDataAnalyUserVo>> list = new ArrayList<ArrayList<BigDataAnalyUserVo>>();
		for(int i=1; i<rows; i++){
			XSSFRow row = this.sheet.getRow(i);
			if(row != null){
				ArrayList<BigDataAnalyUserVo> voList = new ArrayList<BigDataAnalyUserVo>();
				BigDataAnalyUserVo vo = new BigDataAnalyUserVo();

				//int cells = row.getPhysicalNumberOfCells();

				for(int l=0; l<cells; l++){
					XSSFCell cell = row.getCell(l);
					String value = "";
					if(cell == null){
						this.setVo(vo, l, value);
						continue;
					}else{
						switch (cell.getCellType()){
						case XSSFCell.CELL_TYPE_FORMULA:
							value = cell.getCellFormula();
							break;
						case XSSFCell.CELL_TYPE_STRING:
							value = cell.getStringCellValue();
							break;
						case XSSFCell.CELL_TYPE_NUMERIC:
							value = "" + cell.getNumericCellValue();
							break;
						case XSSFCell.CELL_TYPE_BLANK:
							value = "";
							break;
						case XSSFCell.CELL_TYPE_ERROR:
							value = "" + cell.getErrorCellValue();
							break;
						}
					}
					this.setVo(vo, l, value);
				}

				voList.add(vo);
				list.add(voList);
			}
		}

		return list;
	}

	public ArrayList<String> parseTitle() throws IOException{

		ArrayList<String> list = new ArrayList<String>();
		XSSFRow row = sheet.getRow(0);
		if(row != null){
			int cells = row.getPhysicalNumberOfCells();

			for(int i=0; i<cells; i++){
				XSSFCell cell = row.getCell(i);
				String value = "";
				if(cell == null){
					break;
				}else{
					switch (cell.getCellType()){
					case XSSFCell.CELL_TYPE_FORMULA:
						value = cell.getCellFormula();
						break;
					case XSSFCell.CELL_TYPE_STRING:
						value = cell.getStringCellValue();
						break;
					case XSSFCell.CELL_TYPE_NUMERIC:
						value = "" + cell.getNumericCellValue();
						break;
					case XSSFCell.CELL_TYPE_BLANK:
						value = "" + cell.getBooleanCellValue();
						break;
					case XSSFCell.CELL_TYPE_ERROR:
						value = "" + cell.getErrorCellValue();
						break;
					}
				}

				list.add(value);
			}
		}

		return list;
	}

	public boolean isPoint(){
		return this.isPoint;
	}

}
