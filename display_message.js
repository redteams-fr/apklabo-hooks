var TOAST_TEXT_TO_DISPLAY="Zog zog !";
var LOGCAT_TEXT_TO_DISPLAY="Zog zog !";

Java.perform(function () {
    var Log = Java.use("android.util.Log");
    Log.v("zogzog",LOGCAT_TEXT_TO_DISPLAY );
});

Java.perform(function () { 

    Java.scheduleOnMainThread(function() {
            var toast = Java.use("android.widget.Toast");
            toast.makeText(Java.use("android.app.ActivityThread").currentApplication().getApplicationContext(), Java.use("java.lang.String").$new(TOAST_TEXT_TO_DISPLAY), 5).show();
    });

});