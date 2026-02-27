/**
 * Feature 객체 편집시 사용될 Undo / Redo 의 기초 객체 입니다.
 */
if(window.Queue == null) var Queue = function(){

	var _array = new Array();
	var _callCount = 0;

	this.enqueue = function(item){ _array.push(item); };
	this.dequeue = function(){ _callCount++; return _array.shift(); };
	this.getArray = function(){ return _array; };
	this.size = function(){ return _array.length; };
	this.isFirst = function(){ return _callCount == 0 };

}

if(window.Stack == null) var Stack = function(){

	var _array = new Array();
	var _callCount = 0;

	this.push = function(item){ _array.push(item); };
	this.pop = function(){ _callCount++; return _array.pop(); };
	this.peek = function(){ return _array[_array.length - 1]; };
	this.getArray = function(){ return _array; };
	this.size = function(){ return _array.length; }
	this.isFirst = function(){ return _callCount == 0 };

}