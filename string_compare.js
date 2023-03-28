
const script_name="string_compare";
var MAX_SIZE=20; 
var MIN_SIZE=9;
var STRING_MATCH="";
var FORCE_RETURN_TRUE=false;

try {
    sendToLog(`String compare interceptor enabled (min size : ${MIN_SIZE}, max size : ${MAX_SIZE} )`,script_name,"INFO");

    Java.performNow(function () 
    {
        var str = Java.use('java.lang.String');
        var input;

        str.equals.overload('java.lang.Object').implementation = function (obj) 
        {
            var result = str.equals.overload('java.lang.Object').call(this, obj);

            if (obj) 
            {
                if (obj.toString().length > MIN_SIZE && obj.toString().length < MAX_SIZE  ) 
                {
                    if (STRING_MATCH)
                    {
                        input=str.toString.call(this)
                        if (obj.toString().search(".*"+STRING_MATCH+".*")!=-1 || input.search(".*"+STRING_MATCH+".*")!=-1 ) {
                            sendToLog(input + " == " + obj.toString() + " => return : " + result,script_name)
                            if (FORCE_RETURN_TRUE) return true;
                        }
                    }  else {
                        sendToLog(str.toString.call(this) + " == " + obj.toString() + " ? => return : " + result,script_name)
                    }                  
                }
            }
            return result;
        }
    });

} catch (err) {
    console.log("Error in script "+script_name+"\n"+err)
    sendToLog(err.stack,script_name,"ERROR");
} 
