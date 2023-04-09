if (Java.available) {
    Java.perform(function() {

        const script_name = "string_compare";
        var MAX_SIZE = 20;
        var MIN_SIZE = 9;
        var STRING_MATCH = "";
        var FORCE_RETURN_TRUE = false;

        try {
            sendToLog(`String compare interceptor enabled (min size : ${MIN_SIZE}, max size : ${MAX_SIZE}, string to match : ${STRING_MATCH}, force return : ${FORCE_RETURN_TRUE} )`, script_name, "INFO");

            Java.performNow(function() {
                var str = Java.use('java.lang.String');
                var input;

                str.equals.overload('java.lang.Object').implementation = function(obj) {
                    var result = str.equals.overload('java.lang.Object').call(this, obj);

                    if (obj) {
                        if (obj.toString().length > MIN_SIZE && obj.toString().length < MAX_SIZE) {
                            input = str.toString.call(this)
                            if (STRING_MATCH) {
                                if (obj.toString().search(".*" + STRING_MATCH + ".*") != -1 || input.search(".*" + STRING_MATCH + ".*") != -1) {
                                    if (FORCE_RETURN_TRUE) {
                                        sendToLog(`${input} == ${obj.toString()} => should return : ${result} but force to true`, script_name)
                                        return true;
                                    }
                                    sendToLog(`${input} == ${obj.toString()} => return : ${result}`, script_name)
                                }
                            } else {
                                sendToLog(`${input} == ${obj.toString()} => return : ${result}`, script_name)
                            }
                        }
                    }
                    return result;
                }
            });

        } catch (err) {
            sendToLog(err.stack, script_name, "ERROR");
        }
    })
}