let ajaxsck;
let apisc;

var genstore = (function(global, factory) {
    //Submodulo Cookies
    return {
        setLocal: function(variable, valorvariable) {
            try {
                window.localStorage.setItem(variable, valorvariable);
            } catch (e) {
                console.log(e);
            }
        },
        getLocal: function(variable) {
            if (window.localStorage) {
                return window.localStorage.getItem(variable);
            } else {
                throw new Error('Tu navegador no soporta LocalStorage!');
            }
        },
        rmLocal: function(variable) {
            if (window.localStorage) {
                window.localStorage.removeItem(variable);
            } else {
                throw new Error('Tu navegador no soporta LocalStorage!');
            }
        },
        setSession: function(variable, valorvariable) {
            if (window.sessionStorage) {
                window.sessionStorage.setItem(variable, valorvariable);
            } else {
                throw new Error('Tu navegador no soporta SessionStorage!');
            }
        },
        getSession: function(variable) {
            if (window.sessionStorage) {
                return window.sessionStorage.getItem(variable);
            } else {
                throw new Error('Tu navegador no soporta SessionStorage!');
            }
        },
        rmSession: function(variable) {
            if (window.sessionStorage) {
                window.sessionStorage.removeItem(variable);
            } else {
                throw new Error('Tu navegador no soporta SessionStorage!');
            }
        }
    }
}(window));

var ghistory = (function(global, factory, history) {
    window.addEventListener('onload', cambiourl, false);

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            vars[key] = value;
        });
        return vars;
    };

    function getParamURL() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            vars[key] = value;
        });
        return vars;
    };

    function getUrlParam(parameter) {
        var urlparameter = '';
        if (window.location.href.indexOf(parameter) > -1) {
            urlparameter = getUrlVars()[parameter];
        }
        return urlparameter;
    };

    function cambiourl(e) {
        return genstore.setLocal('session', e);
    };
    return {
        update: function(e) {
            cambiourl(e);
            var myvar = getUrlParam('sessionkey');
            if (myvar != '') {
                var sessionvar = genstore.setLocal('sessionkey', myvar);
            }
            return 0;
        },
        show: function() {
            return genstore.getLocal('sessionkey');
        }
    };
}(window));

var SC = (function(global, factory) {
    credentials = [{}];
    return {
        api: function(defaults) {
            let idapp = genstore.getLocal('idapp');
            let apikey = genstore.getLocal('apikey');
            let secretkey = genstore.getLocal('secretkey');
            let fetchobj = genrl.ajaxapi;
            let datastr;
            let strdatajson;
            let strcomp;
            let datajson = [{}];
            let data;
            let callback;
            let endpoint;
            let rootdom;
            let rutacomp;

            if (defaults.callback !== undefined || defaults.callback !== null || defaults.callback !== '') {
                if (typeof defaults.callback === 'function') {
                    callback = defaults.callback;
                }
            } else {
                SC.log("FALTA CALLBACK!");
            }
            if (defaults.rootdomain === undefined || defaults.rootdomain == null || defaults.rootdomain == '') {
                SC.log("FALTA ROOTDOMAIN");
            }
            if (defaults.endpoint === undefined || defaults.endpoint == null || defaults.endpoint == '') {
                SC.log("FALTA ENDPOINT");
            } else {
                rootdom = defaults.rootdomain;
                endpoint = defaults.endpoint;
                rutacomp = rootdom + endpoint;
            }
            if (defaults.datajson == undefined || defaults.datajson == null || defaults.datajson == '') {
                SC.info("FALTA DATAJSON");
            }
            if (credentials != '' && callback != '') {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    datajfor = defaults.datajson;
                    strdatajfor = "";
                    i = 0;
                    //Contar cuantos elementos tiene un JSON
                    maxim = Object.keys(datajfor).length;
                    for (let dato in datajfor) {
                        if (i < maxim) {
                            if (i < (maxim - 1)) {
                                strdatajfor += '\"' + dato + '\":\"' + datajfor[dato] + '\",';
                            } else {
                                strdatajfor += '\"' + dato + '\":\"' + datajfor[dato] + '\"';
                            }
                        } else {
                            break;
                        }
                        i++;
                    }
                    if (maxim > 0) {
                        strcomp = '{\"api_key\":\"' + apikey + '\",\"secret_key\":\"' + secretkey + '\",\"app_id\":\"' + idapp + '\", ' + strdatajfor + '}';
                    } else {
                        strcomp = '{\"api_key\":\"' + apikey + '\",\"secret_key\":\"' + secretkey + '\",\"app_id\":\"' + idapp + '\"}';
                    }
                    fetchobj
                        .post(rutacomp, strcomp)
                        .then(function(data) {
                            if (typeof callback === 'function') {
                                callback(data);
                            }
                            return 0;
                        })
                        .catch(function(e) {
                            genrl.log("ERROR:" + e);
                            return 0;
                        })
                }
            }
            return 0;
        },
        getModule: function(defaults) {
            let datastr;
            let data = "";
            let retlink;
            let callback;
            let datajson;
            let idapp = genstore.getLocal('idapp');
            let apikey = genstore.getLocal('apikey');
            let secretkey = genstore.getLocal('secretkey');
            let fetchobj = genrl.ajaxapi;
            let rootdom = defaults.rootdomain;
            let endpoint = defaults.endpoint;

            if (arguments[1] !== undefined || arguments[1] !== null || arguments[1] !== '') {
                callback = arguments[1];
            } else {
                SC.log("FALTA CALLBACK, el segundo argumento!");
            }
            if (defaults.rootdomain === undefined || defaults.rootdomain == null || defaults.rootdomain == '') {
                SC.log("FALTA IDAPP");
            }
            if (defaults.endpoint === undefined || defaults.endpoint == null || defaults.endpoint == '') {
                SC.log("FALTA IDAPP");
            }
            if (defaults.datajson == undefined || defaults.datajson == null || defaults.datajson == '') {
                datajson = {};
            } else {
                datajson = defaults.datajson;
            }

            if (callback != '') {
                let urlcompleta = rootdom + endpoint;
                datajson.api_key = apikey;
                datajson.api_secret = secretkey;
                datajson.app_id = idapp;
                datastr = JSON.stringify(datajson);
                fetchobj
                    .post(urlcompleta, datastr)
                    .then(function(data) {
                        g(scriptid).html(data);
                        g(frmcontid).eval(data);
                    })
                    .catch(function(e) {
                        console.log("ERROR:" + e);
                    })
            }

            return 0;
        },
        linkToLogin: function(link) {
            location.replace(link);
        },
        loginPopUp: function(defaults) {
            this.initarr = defaults;
            let url = "https://credentials.underdevelopment.work/api/credentials/v1/sl/sysconfigpassport";
            let ventana = global.window.open(url, "Popup", "toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,width=400,height=550,left = 490,top = 300");
            // Listen for messages
            window.addEventListener("message", function(event) {
                console.log(event.data)
                if (event.data === "success") {
                    ventana.close();
                } else {
                    // Oh no!
                }
            });
        },
        loginBackend: function(datoslogin, callback) {
            //hacer una llamada a la api, que devuelva una cadena de texto
            let fetchobj = genrl.ajaxapi;
            let endpoint = "sl/login"
            let initdir = "https://credentials.underdevelopment.work/api/credentials/v1/" + endpoint;
            let datastr;
            datastr = JSON.stringify(datoslogin);
            fetchobj
                .post(initdir, datastr)
                .then(function(data) {
                    callback(data)
                })
                .catch(function(e) {
                    console.log("ERROR:" + e);
                })
            return 0;
        },
        logout: function(callback) {
            //hacer una llamada a la api, que devuelva una cadena de texto
            if (SC.api("logout")) {
                callback();
            }
            return 0;
        },
        settings: function(defaults) {
            //idapp
            //apikey
            //apisecret
            //scriptid
            //frmcontid
            //saveSession
            //callbacklogin
            if (defaults.idapp === undefined || defaults.idapp == null || defaults.idapp == '') {
                SC.log("FALTA IDAPP");
            }
            if (defaults.apikey == undefined || defaults.apikey == null || defaults.apikey == '') {
                SC.log("FALTA APIKEY");
            }
            if (defaults.secretkey == undefined || defaults.secretkey == null || defaults.secretkey == '') {
                SC.log("FALTA SECRETKEY");
            }
            if (defaults.scriptid == undefined || defaults.scriptid == null || defaults.scriptid == '') {
                SC.log("FALTA SCRIPTID");
            }
            if (defaults.frmcontid == undefined || defaults.frmcontid == null || defaults.frmcontid == '') {
                SC.log("FALTA FRMCONTID");
            }
            if (defaults.savesession == undefined || defaults.savesession == null || defaults.savesession == '') {
                SC.log("FALTA SAVESESSION");
            }
            if (defaults.callbacklogin == undefined || defaults.callbacklogin == null || defaults.callbacklogin == '') {
                SC.log("FALTA CALLBACKLOGIN");
            }
            if (defaults.idapp != '' && defaults.apikey != '' && defaults.secretkey != '') {
                genstore.setLocal('idapp', defaults.idapp);
                genstore.setLocal('apikey', defaults.apikey);
                genstore.setLocal('secretkey', defaults.secretkey);
                genstore.setLocal('scriptid', defaults.scriptid);
                genstore.setLocal('frmcontid', defaults.frmcontid);
                genstore.setLocal('savesession', defaults.savesession);
                genstore.setLocal('callbacklogin', defaults.callbacklogin);
                if (defaults.brandlogo != undefined || defaults.brandlogo != null || defaults.brandlogo != '') {
                    genstore.setLocal('brandlogo', defaults.brandlogo);
                }
                if (defaults.brandtitle != undefined || defaults.brandtitle != null || defaults.brandtitle != '') {
                    genstore.setLocal('brandtitle', defaults.brandtitle);
                }
                credenciales = defaults;
            }
        },
        check: function() {
            let sessionkey = genstore.getLocal("sessionkey");
            let idapp = genstore.getLocal('idapp');
            let apikey = genstore.getLocal('apikey');
            let secretkey = genstore.getLocal('secretkey');

            if (sessionkey == '' || !sessionkey || sessionkey == null) {
                ghistory.update(location.href);
            }
            return 0;
        },
        getSignUpLink: function() {
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    retlink = "https://credentials.underdevelopment.work/api/credentials/v1/sl/signupsysconfig/" + apikey + "/" + secretkey + "/" + idapp;
                    return retlink;
                }
            }
            return 0;
        },
        getLoginLink: function() {
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    retlink = "https://credentials.underdevelopment.work/api/credentials/v1/sl/loginsysconfig/" + apikey + "/" + secretkey + "/" + idapp;
                    return retlink;
                }
            }
            return 0;
        },
        getLoginMinimal: function(settings) {
            let llamado;
            let fetchobj = ajaxapi;
            let argjs = settings;
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            scriptid = genstore.getLocal('scriptid');
            frmcontid = genstore.getLocal('frmcontid');

            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    let strdata = "{\"api_key\":\"" + apikey + "\",\"secret_key\":\"" + secretkey + "\",\"app_id\":\"" + idapp + "\"}";
                    fetchobj
                        .post("https://credentials.underdevelopment.work/api/credentials/v1/sl/login_minimal", strdata)
                        .then(function(data) {
                            g(scriptid).html(data);
                            g(frmcontid).eval(data);
                            if (Array.isArray(argjs)) {
                                if (argjs[0] === undefined) {
                                    llamado = argjs.callback;
                                    if (typeof llamado === 'function') {
                                        llamado();
                                        return 0;
                                    }
                                }
                            }
                            return 0;
                        })
                        .catch(function(e) {
                            SC.log("ERROR:" + e);
                            return 0;
                        });
                }
            }
            return 0;
        },
        getLoginVert: function(settings) {
            let callback;
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            scriptid = genstore.getLocal('scriptid');
            frmcontid = genstore.getLocal('frmcontid');

            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    let strdata = "{\"api_key\":\"" + apikey + "\",\"secret_key\":\"" + secretkey + "\",\"app_id\":\"" + idapp + "\"}";
                    fetchobj = ajaxapi;
                    fetchobj
                        .post("https://credentials.underdevelopment.work/api/credentials/v1/sl/login_vert", strdata)
                        .then(function(data) {
                            g(scriptid).html(data);
                            g(frmcontid).eval(data);
                            if (settings.callback != '' || settings.callback != undefined || settings.callback != null) {
                                callback = settings.callback;
                                if (typeof callback === 'function') {
                                    callback();
                                }
                            }
                        })
                        .catch(function(e) {
                            SC.log("ERROR:" + e);
                            return 0;
                        });
                }
            }
            return 0;
        },
        getKeysString: function() {
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            scriptid = genstore.getLocal('scriptid');
            frmcontid = genstore.getLocal('frmcontid');

            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    appkeys = {
                        "api_key": apikey,
                        "secret_key": secretkey,
                        "app_id": idapp
                    }
                    return appkeys;
                }
            }
            return -1;
        },
        getSaveSession: function() {
            savesession = genstore.getLocal('savesession');
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            scriptid = genstore.getLocal('scriptid');
            frmcontid = genstore.getLocal('frmcontid');
            callbacklogin = genstore.getLocal('callbacklogin');

            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    let data = {
                        "savesess": savesession
                    }
                    return data;
                }
            }
            return -1;
        },
        getCallbackLogin: function() {
            savesession = genstore.getLocal('savesession');
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            scriptid = genstore.getLocal('scriptid');
            frmcontid = genstore.getLocal('frmcontid');
            cbacklogin = genstore.getLocal('callbacklogin');

            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    let data = {
                        "callbacklog": cbacklogin
                    }
                    return data;
                }
            }
            return -1;
        },
        getDevSignUp: function() {
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            scriptid = genstore.getLocal('scriptid');
            frmcontid = genstore.getLocal('frmcontid');

            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    genrl.log("credenciales completas...Entrando a la API...");
                    let strdata = "{\"api_key\":\"" + apikey + "\",\"secret_key\":\"" + secretkey + "\",\"app_id\":\"" + idapp + "\"}";
                    fetchobj = ajaxapi;
                    fetchobj
                        .post("https://credentials.underdevelopment.work/api/credentials/v1/sl/devsignup", strdata)
                        .then(function(data) {
                            g(scriptid).html(data);
                            g(frmcontid).eval(data);
                        })
                        .catch(function(e) {
                            SC.log("ERROR:" + e);
                        });
                }
            }
            return 0;
        },
        getNormalSignUp: function() {
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            scriptid = genstore.getLocal('scriptid');
            frmcontid = genstore.getLocal('frmcontid');

            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    let strdata = "{\"api_key\":\"" + apikey + "\",\"secret_key\":\"" + secretkey + "\",\"app_id\":\"" + idapp + "\"}";
                    fetchobj = ajaxapi;
                    fetchobj
                        .post("https://credentials.underdevelopment.work/api/credentials/v1/sl/signupuser", strdata)
                        .then(function(data) {
                            g(scriptid).html(data);
                            g(frmcontid).eval(data);
                        })
                        .catch(function(e) {
                            SC.log("ERROR:" + e);
                        });
                }
            }
            return 0;
        },
        getParametricSignUp: function(settings) {
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            scriptid = genstore.getLocal('scriptid');
            frmcontid = genstore.getLocal('frmcontid');
            let platform;
            let profile;
            let callbackfnc;
            let strdata;

            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    if (settings.platform != "") {
                        platform = settings.platform;
                    }
                    if (settings.profile != "") {
                        profile = settings.profile;
                    }
                    if (settings.callback != "") {
                        callbackfnc = settings.callback;
                    }
                    if (platform != '' && profile != '') {
                        strdata = "{\"api_key\":\"" + apikey + "\",\"secret_key\":\"" + secretkey + "\",\"app_id\":\"" + idapp + "\",\"platform\":\"" + platform + "\",\"profile\":\"" + profile + "\"}";
                    } else {
                        strdata = "{\"api_key\":\"" + apikey + "\",\"secret_key\":\"" + secretkey + "\",\"app_id\":\"" + idapp + "\"}";
                    }
                    fetchobj = ajaxapi;
                    fetchobj
                        .post("https://credentials.underdevelopment.work/api/credentials/v1/sl/signupuserparametric", strdata)
                        .then(function(data) {
                            g(scriptid).html(data);
                            g(frmcontid).eval(data);
                            if (callbackfnc != '') {
                                if (typeof callbackfnc === 'function') {
                                    callbackfnc();
                                }
                            }
                        })
                        .catch(function(e) {
                            SC.log("ERROR:" + e);
                        });
                }
            }
            return 0;
        },
        getParametricSignUpAffiliate: function(settings) {
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            scriptid = genstore.getLocal('scriptid');
            frmcontid = genstore.getLocal('frmcontid');
            let platform;
            let profile;
            let callbackfnc;
            let strdata;
            let affiliate;

            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    if (settings.platform != "") {
                        platform = settings.platform;
                    }
                    if (settings.profile != "") {
                        profile = settings.profile;
                    }
                    if (settings.callback != "") {
                        callbackfnc = settings.callback;
                    }
                    if (settings.affiliate != "") {
                        affiliate = settings.affiliate;
                    }

                    if (platform != '' && profile != '' && affiliate != "") {
                        strdata = "{\"api_key\":\"" + apikey + "\",\"secret_key\":\"" + secretkey + "\",\"app_id\":\"" + idapp + "\",\"platform\":\"" + platform + "\",\"profile\":\"" + profile + "\",\"affiliate\":\"" + affiliate + "\"}";
                    } else {
                        strdata = "{\"api_key\":\"" + apikey + "\",\"secret_key\":\"" + secretkey + "\",\"app_id\":\"" + idapp + "\"}";
                    }
                    fetchobj = ajaxapi;
                    fetchobj
                        .post("https://credentials.underdevelopment.work/api/credentials/v1/sl/signupuserparametricaffiliate", strdata)
                        .then(function(data) {
                            g(scriptid).html(data);
                            g(frmcontid).eval(data);
                            if (callbackfnc != '') {
                                if (typeof callbackfnc === 'function') {
                                    callbackfnc();
                                }
                            }
                        })
                        .catch(function(e) {
                            SC.log("ERROR:" + e);
                        });
                }
            }
            return 0;
        },
        getParametricEnEspera: function(settings) {
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            scriptid = genstore.getLocal('scriptid');
            frmcontid = genstore.getLocal('frmcontid');
            let platform;
            let profile;
            let callbackfnc;
            let strdata;
            let affiliate;

            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    if (settings.platform != "") {
                        platform = settings.platform;
                    }
                    if (settings.callback != "") {
                        callbackfnc = settings.callback;
                    }
                    if (platform != '') {
                        strdata = "{\"api_key\":\"" + apikey + "\",\"secret_key\":\"" + secretkey + "\",\"app_id\":\"" + idapp + "\",\"platform\":\"" + platform + "\"}";
                    } else {
                        strdata = "{\"api_key\":\"" + apikey + "\",\"secret_key\":\"" + secretkey + "\",\"app_id\":\"" + idapp + "\"}";
                    }
                    fetchobj = ajaxapi;
                    fetchobj
                        .post("https://credentials.underdevelopment.work/api/databank/show/enespera", strdata)
                        .then(function(data) {
                            g(scriptid).html(data);
                            g(frmcontid).eval(data);
                            if (callbackfnc != '') {
                                if (typeof callbackfnc === 'function') {
                                    callbackfnc();
                                }
                            }
                        })
                        .catch(function(e) {
                            SC.log("ERROR:" + e);
                        });
                }
            }
            return 0;
        },
        validUsr: function() {
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            scriptid = genstore.getLocal('scriptid');
            frmcontid = genstore.getLocal('frmcontid');

            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    let strdata = "{\"api_key\":\"" + apikey + "\",\"secret_key\":\"" + secretkey + "\",\"app_id\":\"" + idapp + "\"}";
                    fetchobj = ajaxapi;
                    fetchobj
                        .post("https://credentials.underdevelopment.work/api/credentials/v1/validuser", strdata)
                        .then(function(data) {
                            g(scriptid).html(data);
                            g(frmcontid).eval(data);
                        })
                        .catch(function(e) {
                            SC.log("ERROR:" + e);
                        });
                }
            }
            return 0;
        },
        validSes: function(idsesion) {
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            scriptid = genstore.getLocal('scriptid');
            frmcontid = genstore.getLocal('frmcontid');

            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    let strdata = "{\"api_key\":\"" + apikey + "\",\"secret_key\":\"" + secretkey + "\",\"app_id\":\"" + idapp + "\"}";
                    fetchobj = ajaxapi;
                    fetchobj
                        .post("https://credentials.underdevelopment.work/api/credentials/v1/wapivalidsession", strdata)
                        .then(function(data) {
                            g(scriptid).html(data);
                            g(frmcontid).eval(data);
                        })
                        .catch(function(e) {
                            SC.log("ERROR:" + e);
                        });
                }
            }
            return 0;
        },
        validLink: function() {
            idapp = genstore.getLocal('idapp');
            apikey = genstore.getLocal('apikey');
            secretkey = genstore.getLocal('secretkey');
            scriptid = genstore.getLocal('scriptid');
            frmcontid = genstore.getLocal('frmcontid');

            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    let strdata = "{\"api_key\":\"" + apikey + "\",\"secret_key\":\"" + secretkey + "\",\"app_id\":\"" + idapp + "\"}";
                    fetchobj = ajaxapi;
                    fetchobj
                        .post("https://credentials.underdevelopment.work/api/credentials/v1/validlink", strdata)
                        .then(function(data) {
                            g(scriptid).html(data);
                            g(frmcontid).eval(data);
                        })
                        .catch(function(e) {
                            SC.log("ERROR:" + e);
                        });
                }
            }
            return 0;
        },
        saveSession: function(datos) {
            let idapp = genstore.getLocal('idapp');
            let apikey = genstore.getLocal('apikey');
            let secretkey = genstore.getLocal('secretkey');
            let scriptid = genstore.getLocal('scriptid');
            let frmcontid = genstore.getLocal('frmcontid');
            let savesession = genstore.getLocal('savesession');
            let callbacklogin = genstore.getLocal('callbacklogin');
            let fetchobj = genrl.ajaxapi;
            fetchobj.withCredentials(true);
            let strdata;
            if (typeof datos === 'string') {
                strdata = datos
            } else {
                strdata = JSON.stringify(datos);
            }
            if (credentials) {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    fetchobj
                        .post(savesession, strdata)
                        .then(function(data) {
                            if (data == "VALID_SESSION") {
                                genrl.lhref(callbacklogin);
                            }
                        })
                        .catch(function(e) {
                            SC.log("ERROR:" + e);
                        });
                } else {
                    SC.log("ERROR:" + e);
                    return "ERROR";
                }
            }
        },
        disconnect: function() {
            let sessionkey = genstore.getLocal("sessionkey");
            if (sessionkey != '') {
                genstore.rmLocal("sessionkey");
            } else {
                return "ERROR";
            }
        },
        log: function(mensaje) {
            if (mensaje) {
                console.log(mensaje);
                return 0;
            } else {
                return "ERROR";
            }
        },
        getParam: function(parameter) {
            let paramget = '';
            paramget = getUrlParam(parameter);
            if (paramget != '') {
                return paramget;
            } else {
                return -1;
            }
        }
    }
}(window));

var dbapi = (function(global, factory) {
    credentials = [{}];
    return {
        api: function(defaults) {
            let idapp = genstore.getLocal('idapp');
            let apikey = genstore.getLocal('apikey');
            let secretkey = genstore.getLocal('secretkey');
            let fetchobj = genrl.ajaxapi;
            let datastr;
            let strdatajson;
            let strcomp;
            let datajson = [{}];
            let data;
            let callback;
            let endpoint;
            let rootdom;
            let rutacomp;

            if (defaults.callback !== undefined || defaults.callback !== null || defaults.callback !== '') {
                if (typeof defaults.callback === 'function') {
                    callback = defaults.callback;
                }
            } else {
                dbapi.log("FALTA CALLBACK!");
            }
            if (defaults.rootdomain === undefined || defaults.rootdomain == null || defaults.rootdomain == '') {
                dbapi.log("FALTA ROOTDOMAIN");
            }
            if (defaults.endpoint === undefined || defaults.endpoint == null || defaults.endpoint == '') {
                dbapi.log("FALTA ENDPOINT");
            } else {
                rootdom = defaults.rootdomain;
                endpoint = defaults.endpoint;
                rutacomp = rootdom + endpoint;
            }
            if (defaults.datajson == undefined || defaults.datajson == null || defaults.datajson == '') {
                dbapi.info("FALTA DATAJSON");
            }
            if (credentials != '' && callback != '') {
                if (idapp != '' && secretkey != '' && apikey != '') {
                    datajfor = defaults.datajson;
                    strdatajfor = "";
                    i = 0;
                    //Contar cuantos elementos tiene un JSON
                    maxim = Object.keys(datajfor).length;
                    for (let dato in datajfor) {
                        if (i < maxim) {
                            if (i < (maxim - 1)) {
                                strdatajfor += '\"' + dato + '\":\"' + datajfor[dato] + '\",';
                            } else {
                                strdatajfor += '\"' + dato + '\":\"' + datajfor[dato] + '\"';
                            }
                        } else {
                            break;
                        }
                        i++;
                    }
                    if (maxim > 0) {
                        strcomp = '{\"api_key\":\"' + apikey + '\",\"secret_key\":\"' + secretkey + '\",\"app_id\":\"' + idapp + '\", ' + strdatajfor + '}';
                    } else {
                        strcomp = '{\"api_key\":\"' + apikey + '\",\"secret_key\":\"' + secretkey + '\",\"app_id\":\"' + idapp + '\"}';
                    }
                    fetchobj
                        .post(rutacomp, strcomp)
                        .then(function(data) {
                            if (typeof callback === 'function') {
                                callback(data);
                            }
                            return 0;
                        })
                        .catch(function(e) {
                            genrl.log("ERROR:" + e);
                            return 0;
                        })
                }
            }
            return 0;
        },
        settings: function(defaults) {
            //idapp
            //apikey
            //apisecret
            //scriptid
            //frmcontid
            //saveSession
            //callbacklogin
            if (defaults.idapp === undefined || defaults.idapp == null || defaults.idapp == '') {
                dbapi.log("FALTA IDAPP");
            }
            if (defaults.apikey == undefined || defaults.apikey == null || defaults.apikey == '') {
                dbapi.log("FALTA APIKEY");
            }
            if (defaults.secretkey == undefined || defaults.secretkey == null || defaults.secretkey == '') {
                dbapi.log("FALTA SECRETKEY");
            }
            if (defaults.callbacklogin == undefined || defaults.callbacklogin == null || defaults.callbacklogin == '') {
                dbapi.log("FALTA CALLBACKLOGIN");
            }
            if (defaults.idapp != '' && defaults.apikey != '' && defaults.secretkey != '') {
                genstore.setLocal('idapp', defaults.idapp);
                genstore.setLocal('apikey', defaults.apikey);
                genstore.setLocal('secretkey', defaults.secretkey);
                genstore.setLocal('callbacklogin', defaults.callbacklogin);
                if (defaults.brandlogo != undefined || defaults.brandlogo != null || defaults.brandlogo != '') {
                    genstore.setLocal('brandlogo', defaults.brandlogo);
                }
                if (defaults.brandtitle != undefined || defaults.brandtitle != null || defaults.brandtitle != '') {
                    genstore.setLocal('brandtitle', defaults.brandtitle);
                }
                credenciales = defaults;
            }
        },
        log: function(mensaje) {
            if (mensaje) {
                console.log(mensaje);
                return 0;
            } else {
                return "ERROR";
            }
        },
        getParam: function(parameter) {
            let paramget = '';
            paramget = getUrlParam(parameter);
            if (paramget != '') {
                return paramget;
            } else {
                return -1;
            }
        },
        addPost: function(args) {

        },
        getPost: function(args) {

        },
        listPosts: function(args) {

        },
        updPost: function(args) {

        },
        rmPost: function(args) {

        },
        addCateg: function(args) {

        },
        getCateg: function(args) {

        },
        updCateg: function(args) {

        },
        rmCateg: function(args) {

        },
        listCategs: function(args) {

        },
        addMedia: function(args) {

        },
        listMedia: function(args) {

        },
        getMedia: function(args) {

        },
        updMedia: function(args) {

        },
        rmMedia: function(args) {

        },
        addProd: function(args) {

        },
        getProd: function(args) {

        },
        updProd: function(args) {

        },
        rmProd: function(args) {

        },
        listProds: function(args) {

        },
        addProdCateg: function(args) {

        },
        getProdCateg: function(args) {

        },
        listProdCateg: function(args) {

        },
        updProdCateg: function(args) {

        },
        rmProdCateg: function(args) {

        },
    }
}(window));