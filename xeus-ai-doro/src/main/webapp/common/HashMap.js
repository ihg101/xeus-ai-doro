/**
* key:value 를 사용하는 HashMap
* @example
* <pre>
* var map = new HashMap();
* map.put("key","value");       
* map.get("key");               
* map.length;            길이 반환        
* map.keys();            모든 키 객체반환        
* map.values():            모든 값 객체반환
* map.toQuaryString([option]);   key=value[option] 문자열반환
* map.clear();            초기화               
* map.next();            다음 객체 반환
* map.indexValue(index);위치로 값 찾기    
* map.splice(key);        key 삭제 
* map.point(key);        key 의 위치반환             
* </pre>
*/
var HashMap = function()
{
    this.obj = [];
    this.length = 0;        
    
    this.put = function(key, value)
    { 
        if( this.obj[key] == null )this.length++; 
        this.obj[key] = value; 
    };
 
    this.get = function(key)
    {
    	if(this.obj[key] == undefined){
    		return "";
    	}else{
    		return this.obj[key];
    	}
    };
    
    this.keys = function()
    {
        var keys = [];
        for ( var property in this.obj ) keys.push(property);
        return keys;
    };
    
    this.values = function()
    {
        var values = [];
        for ( var property in this.obj ) values.push(this.obj[property]);
        return values;
    };
    
    this.toQueryString = function(divMark)
    {
        var divMark = (typeof divMark == "undefined") ? "&" : divMark;
        var quaryString = "";
        var key = this.keys();
        var value = this.values();
        if ( this.length < 1 ) return "";
        
        for( var i = 0 ; i < this.length ; i++ )
        {
            if ( quaryString != "" )
                quaryString += divMark;
            quaryString +=     key[i] +"="+ value[i];
        }
        return quaryString;
    };
    
    this.remove = function(index)
    {
        var keys = this.keys();
        keys.splice(index, 1);
        var temp =[];                 
        for ( var i = 0 ; i < keys.length ; i++ )
        {
            temp[keys[i]] = this.obj[keys[i]];
        }     
        this.obj = temp;
        this.length = keys.length;
        index--;
    };
    
    this.indexOf = function(key)
    {
        var cnt = 0;
        for ( var i in this.obj )
        {
            if ( key == i ) return cnt;
                cnt++;    
        }
    };
    
    this.splice = function(spliceIndex)
    {
        var keys = this.keys();
        keys.splice(spliceIndex, 1);
        var temp =[];                 
        for ( var i = 0 ; i < keys.length ; i++ )
        {
            temp[keys[i]]=this.obj[keys[i]];
        }     
        this.obj = temp;
        this.length = keys.length;
        index--;
    };
 
    
    this.point = function(key)
    {
        var cnt = 0;
        for ( var i in this.obj )
        {
            if ( key == i ) return cnt;
                cnt++;    
        }
    };
 
    this.clear = function()
    {
        this.obj = [];
        this.length = 0;
    };
        
    var index = 0;
    this.next = function()
    {
        if ( index == this.length )
        {
            index = 0;
            return -1;
        }
        var values = this.values();
        var currentValue = values[index];     
        index++;
        return currentValue;
    };
 
    this.indexValue = function(Idx)
    {
        var keys = this.keys();
        return this.obj[keys[Idx]];
    };
};