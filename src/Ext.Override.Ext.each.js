//--- BYPASS FOR WHEN SINGLE ITEM + SCOPE OPTIMIZATION ---
/*Ext.each = function(array, fn, scope){
    if(Ext.isEmpty(array, true)){
        return;
    }
    if (!Ext.isIterable(array) || Ext.isPrimitive(array)) {
		if ((scope) ? fn.call(scope, array, 0, array) : fn(array, 0, array) === false) {
			return 0;
		}
	} else {
		for (var i = 0, len = array.length; i < len; i++) {
			if ((scope) ? fn.call(scope, array[i], i, array) : fn(array[i], i, array) === false) {
				return i;
			}
		}
	}
};*/
	
//--- SCOPE OPTIMIZATION ---
/*Ext.each = function(array, fn, scope){
    if(Ext.isEmpty(array, true)){
        return;
    }
    if(!Ext.isIterable(array) || Ext.isPrimitive(array)){
        array = [array];
    }
    for(var i = 0, len = array.length; i < len; i++){ 
        if((scope) ? fn.call(scope, array[i], i, array) : fn(array[i], i, array) === false){
            return i;
        }
    }
};*/

Ext.eachFn = function(array, fn, scope){
    if (Ext.isEmpty(array, true)) {
        return;
    }
    if (!Ext.isIterable(array) || Ext.isPrimitive(array)) {
        array = [array];
    }
    for (var i = 0, len = array.length; i < len; i++) {
        if (fn.call(scope || array[i], array[i], i, array) === false) {
            return i;
        }
    }
};

var total = 0, measure = function(){
	return function(array, fn, scope){
		var start = new Date();
		Ext.eachFn(array, fn, scope);
		total += (new Date() - start);
	};
};

Ext.each = measure();