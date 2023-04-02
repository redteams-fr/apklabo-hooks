Java.perform(function () {
        const script_name="antiroot_bypass";
        sendToLog('Loading antiroot_bypass',script_name,"INFO");

        const commonPaths = [
            "/data/local/bin/su",
            "/data/local/su",
            "/data/local/xbin/su",
            "/dev/com.koushikdutta.superuser.daemon/",
            "/sbin/su",
            "/system/app/Superuser.apk",
            "/system/bin/failsafe/su",
            "/system/bin/su",
            "/su/bin/su",
            "/system/etc/init.d/99SuperSUDaemon",
            "/system/sd/xbin/su",
            "/system/xbin/busybox",
            "/system/xbin/daemonsu",
            "/system/xbin/su",
            "/system/sbin/su",
            "/vendor/bin/su",
            "/cache/su",
            "/data/su",
            "/dev/su",
            "/system/bin/.ext/su",
            "/system/usr/we-need-root/su",
            "/system/app/Kinguser.apk",
            "/data/adb/magisk",
            "/sbin/.magisk",
            "/cache/.disable_magisk",
            "/dev/.magisk.unblock",
            "/cache/magisk.log",
            "/data/adb/magisk.img",
            "/data/adb/magisk.db",
            "/data/adb/magisk_simple",
            "/init.magisk.rc",
            "/system/xbin/ku.sud",
            "/data/local/tmp/frida",
            "/data/local/tmp/frida-server"
        ];

        const ROOTmanagementApp = [
            "com.noshufou.android.su",
            "com.noshufou.android.su.elite",
            "eu.chainfire.supersu",
            "com.koushikdutta.superuser",
            "com.thirdparty.superuser",
            "com.yellowes.su",
            "com.koushikdutta.rommanager",
            "com.koushikdutta.rommanager.license",
            "com.dimonvideo.luckypatcher",
            "com.chelpus.lackypatch",
            "com.ramdroid.appquarantine",
            "com.ramdroid.appquarantinepro",
            "com.topjohnwu.magisk"
        ];

        function bypassJavaFileCheck(){
            var UnixFileSystem = Java.use("java.io.UnixFileSystem")
            UnixFileSystem.checkAccess.implementation = function(file,access){

                const filename = file.getAbsolutePath();

                if (filename.indexOf("magisk") >= 0) {
                    sendToLog("Anti Root Detect - check file: " + filename,script_name);
                    return false;
                }

                if (commonPaths.indexOf(filename) >= 0) {
                    sendToLog("Anti Root Detect - check file: " + filename,script_name);
                    return false;
                }

                return this.checkAccess(file,access)
            }
        }

        function bypassNativeFileCheck(){
            var fopen = Module.findExportByName("libc.so","fopen")
            Interceptor.attach(fopen,{
                onEnter:function(args){
                    this.inputPath = args[0].readUtf8String()
                },
                onLeave:function(retval){
                    if(retval.toInt32() != 0){
                        if (commonPaths.indexOf(this.inputPath) >= 0) {
                            sendToLog("Anti Root Detect - fopen : " + this.inputPath,script_name);
                            retval.replace(ptr(0x0))
                        }
                    }
                }
            })

            var access = Module.findExportByName("libc.so","access")
            Interceptor.attach(access,{
                onEnter:function(args){
                    this.inputPath = args[0].readUtf8String()
                },
                onLeave:function(retval){
                    if(retval.toInt32()==0){
                        if(commonPaths.indexOf(this.inputPath) >= 0){
                            sendToLog("Anti Root Detect - access : " + this.inputPath,script_name);
                            retval.replace(ptr(-1))
                        }
                    }
                }
            })
        }

        function setProp(){
            var Build = Java.use("android.os.Build")
            var TAGS = Build.class.getDeclaredField("TAGS")
            TAGS.setAccessible(true)
            TAGS.set(null,"release-keys")

            var FINGERPRINT = Build.class.getDeclaredField("FINGERPRINT")
            FINGERPRINT.setAccessible(true)
            FINGERPRINT.set(null,"google/crosshatch/crosshatch:10/QQ3A.200805.001/6578210:user/release-keys")

            var system_property_get = Module.findExportByName("libc.so", "__system_property_get")
            Interceptor.attach(system_property_get,{
                onEnter(args){
                    this.key = args[0].readCString()
                    this.ret = args[1]
                },
                onLeave(ret){
                    if(this.key == "ro.build.fingerprint"){
                        var tmp = "google/crosshatch/crosshatch:10/QQ3A.200805.001/6578210:user/release-keys"
                        var p = Memory.allocUtf8String(tmp)
                        Memory.copy(this.ret,p,tmp.length+1)
                    }
                }
            })

        }

        function bypassRootAppCheck(){
            var ApplicationPackageManager = Java.use("android.app.ApplicationPackageManager")
            ApplicationPackageManager.getPackageInfo.overload('java.lang.String', 'int').implementation = function(str,i){
                if (ROOTmanagementApp.indexOf(str) >= 0) {
                    sendToLog("Anti Root Detect - check package : " + str,script_name);
                    str = "ashen.one.ye.not.found"
                }
                return this.getPackageInfo(str,i)
            }
        }

        function bypassShellCheck(){
            var String = Java.use('java.lang.String')

            var ProcessImpl = Java.use("java.lang.ProcessImpl")
            ProcessImpl.start.implementation = function(cmdarray,env,dir,redirects,redirectErrorStream){

                if(cmdarray[0] == "mount"){
                    sendToLog("Anti Root Detect - Shell : " + cmdarray.toString(),script_name);
                    arguments[0] = Java.array('java.lang.String',[String.$new("")])
                    return ProcessImpl.start.apply(this,arguments)
                }

                if(cmdarray[0] == "getprop"){
                    sendToLog("Anti Root Detect - Shell : " + cmdarray.toString(),script_name);
                    const prop = [
                        "ro.secure",
                        "ro.debuggable"
                    ];
                    if(prop.indexOf(cmdarray[1]) >= 0){
                        arguments[0] = Java.array('java.lang.String',[String.$new("")])
                        return ProcessImpl.start.apply(this,arguments)
                    }
                }

                if(cmdarray[0].indexOf("which") >= 0){
                    const prop = [
                        "su"
                    ];
                    if(prop.indexOf(cmdarray[1]) >= 0){
                        sendToLog("Anti Root Detect - Shell : " + cmdarray.toString(),script_name);
                        arguments[0] = Java.array('java.lang.String',[String.$new("")])
                        return ProcessImpl.start.apply(this,arguments)
                    }
                }

                return ProcessImpl.start.apply(this,arguments)
            }
        }

        bypassNativeFileCheck()
        bypassJavaFileCheck()
        setProp()
        bypassRootAppCheck()
        bypassShellCheck()

});