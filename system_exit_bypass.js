
Java.perform(function () 
{
    const script_name="system_exit_bypass";    
    const System = Java.use('java.lang.System')
    sendToLog('Loading System exit bypass',script_name,"INFO");

    System.exit.implementation = function()
    {
        sendToLog('Call to System.exit() bypassed',script_name,"TRACE");
    }

});