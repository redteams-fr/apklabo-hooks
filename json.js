Java.perform(function () {

    const script_name="Json hook";
    
    try {
        // "https://developer.android.com/reference/org/json/JSONObject#optString(java.lang.String,%20java.lang.String)",
        sendToLog('Loading Json object interceptor',script_name,"INFO");
        var jsonLogger = Java.use('org.json.JSONObject');

        jsonLogger.$init.overload('java.util.Map').implementation = function(map){
            var debug = JSON.stringify(obj, null, "\t");            
            sendToLog('Json Dump\n'+debug,script_name);
            return this.$init(map);
        } 

        jsonLogger.$init.overload('org.json.JSONTokener').implementation = function(jsonTokener){
            var obj = JSON.parse(jsonTokener);
            var debug = JSON.stringify(obj, null, "\t");
            sendToLog('Json Dump\n'+debug,script_name);            
            return this.$init(jsonTokener);
        } ;

        jsonLogger.$init.overload('java.lang.String').implementation = function(str){
            var obj = JSON.parse(str);
            var debug = JSON.stringify(obj, null, "\t");
            sendToLog('Json Dump\n'+debug,script_name);   
            return this.$init(str);
        };
            
    } catch (err) {
        console.log("Error in script "+script_name+"\n"+err)
        sendToLog(err.stack,script_name,"ERROR");
    }           

});
