function sendToLog(beat,script_name,message_type="TRACE") {
    var message={};
    var stackTrace="";

    message["data"]=beat;
    message["source"]=script_name;
    message["message_type"]=message_type;
    
    if ((message_type=="TRACE") || (message_type=="ERROR"))  {
        stackTrace=getStackTrace();
        message["stackTrace"]=String(stackTrace);

    } else {
        message["stackTrace"]="";
    }    
    
    send(message);
};

function getStackTrace  () {
    var JavaThread = Java.use("java.lang.Thread");
    var th = Java.cast( JavaThread.currentThread(), JavaThread);
    var stack = th.getStackTrace(), e=null;
    var result="";
    for(var i=2; i<stack.length; i++){
        result=result+ "\t"+stack[i].getClassName()+"."+stack[i].getMethodName()+"("+stack[i].getFileName()+")"+"\n";
    }
    return result;
}

function getStackTrace2  () {
        var android_util_Log = Java.use('android.util.Log'), java_lang_Exception = Java.use('java.lang.Exception');
        // getting stacktrace by throwing an exception
        var result= android_util_Log.getStackTraceString(java_lang_Exception.$new())
        result=result.split("\n").slice(1).join("\n")
        return result;    
};

// remove duplicates from array
function uniqBy(array, key)
{
        var seen = {};
        return array.filter(function(item) {
                var k = key(item);
                return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        });
}

var byteArraytoHexString = function(byteArray) {
    if (byteArray && byteArray.map) {
        return byteArray.map(function(byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('')
    } else {
        return JSON.stringify(byteArray);
    }
};

var hexToAscii = function(input) {
    var hex = input.toString();
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
};

var byteArrayToString = function(input){
    var buffer = Java.array('byte', input);
    var result = "";
    for(var i = 0; i < buffer.length; ++i){
        if(buffer[i] > 31 && buffer[i]<127)
            result+= (String.fromCharCode(buffer[i]));
        else result += ' ';
    }
    return result;
};

function hexToBase64(str) {
    return base64Encode(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
};

function base64ToHex(str) {
    for (var i = 0, bin = base64Decode(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
        var tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1)
            tmp = "0" + tmp;
        hex[hex.length] = tmp;
    }
    return hex.join("");
};

function hexToBytes(str) {
    var pos = 0;
    var len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    var hexA = new Array();
    for (var i = 0; i < len; i++) {
        var s = str.substr(pos, 2);
        var v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;
};
