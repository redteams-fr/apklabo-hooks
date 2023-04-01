Java.perform(function () {

    const script_name="Json hook";
    
    try {
        // "https://developer.android.com/reference/org/json/JSONObject#optString(java.lang.String,%20java.lang.String)",
        
        sendToLog(`Loading ${script_name}`,script_name,"INFO"); 

        var jsonLogger = Java.use('org.json.JSONObject');

        jsonLogger.$init.overload('org.json.JSONTokener').implementation = function(jsonTokener){
            var obj = JSON.parse(jsonTokener);
            var debug = JSON.stringify(obj, null, "\t");
            sendToLog('Json Dump (jsonTokener)\n'+debug,script_name);            
            return this.$init(jsonTokener);
        } ;

        jsonLogger.$init.overload('java.lang.String').implementation = function(str){
            try {
                var obj = JSON.parse(str);
                var debug = JSON.stringify(obj, null, "\t");
                sendToLog('Json Dump (str)\n'+debug,script_name);   
            }catch (err) {
                sendToLog(`Json Dump (str) Error parsing '${str}'`,script_name);
            }
            return this.$init(str);
        };
            
    } catch (err) {
        console.log("Error in script "+script_name+"\n"+err,"ERROR");
        sendToLog(err.stack,script_name,"ERROR");
    }           

});
