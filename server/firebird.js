/*
 * Serve content over a socket
 */
//var FBconnect
//, _ = require('underscore')
    //, _ = require('lodash')
    //, fs = require('fs')
    //, moment = require('moment')
  //  , fb = require('node-firebird')

//var fbconnect;
//var CFG = LoadConfig();
//fb.attachOrCreate(
//    {
//        host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
//    },
//    function (err, db) {
//        if (err) {
//            console.log(err.message);
//        } else {
//            database = db;
//            //   return database;
//            console.log("\n\r db connected ");
//        }
//    }
//
//);
//function LoadConfig() {
//    var cfg = {};
//    try {
//        fs.statSync(__dirname + '/models/cfg/cfg.json');
//        var sCfg = fs.readFileSync(__dirname + '/models/cfg/cfg.json', 'utf8');
//        cfg = JSON.parse(sCfg);
//        console.log('CFG ', __dirname);
//    }
//    catch (e) {
//        console.log("Error loading config " + e.message)
//    }
//    return cfg;
//};

function logerror(err) {
    console.log(err.message);
}
//
//
//function wrapJson(results, fields, jsondata) {
//var tloop = fields;
//var ftype = '';
//_.each(tloop, function (metadesc, key) {
//        fields[key] = metadesc.alias;
//        ftype[key] = metadesc.type;
//        //   console.log(fields[key], ' :', metadesc, key)
//    }
//);
//// console.log('wrapJson ', fields)
//var maxCols = fields.length - 1;
//var holdrow = '';
//var fieldtype = '';
//var fieldname = '';
//var value = '';
//_.each(_.toArray(results), function (humheader, keyheader) {
//        holdrow = '';
//        _.each(fields, function (num, key) {
//                // for json and ngrid let get rid of spaces
//                fieldname = fields[key];
//                fieldtype = ftype[key];
//                fieldname = fieldname.replace(/ /gi, "");// golabal replace flag gi str.replace(/<br>/gi,'\r');
//                value = humheader[key];
////                if (value != undefined) {
////                   value = value.replace(/\r/gi, "\\r");
////                    value = value.replace(/\n/gi, "\\n");
////                    value = value.replace(/"/gi, "");
////                }
//
//                    if (fieldname === 'WORK_DESCRIPTION') {
//                        if (value != undefined) {
////You need to escape the "\" in your string (turning it into a double-"\"), otherwise it will become a newline in the JSON source, not the JSON data.)
////                        function parseString($string) {
////                            $string = str_replace("\\", "\\\\", $string);
////                            $string = str_replace('/', "\\/", $string);
////                            $string = str_replace('"', "\\".'"', $string);
////                            $string = str_replace("\b", "\\b", $string);
////                            $string = str_replace("\t", "\\t", $string);
////                            $string = str_replace("\n", "\\n", $string);
////                            $string = str_replace("\f", "\\f", $string);
////                            $string = str_replace("\r", "\\r", $string);
////                            $string = str_replace("\u", "\\u", $string);
////                            return '"'.$string.'"';
////                        }
//                            //value =  "Test line1.\nTest line2."  will break json.Parse
//                            // value = value.replace(/^[^(]+\(|[^}]+$/g, '');
//
//                            // dec 2013 the \\r and \\n fixes problem (see ptile still has bug)
//
//                            value = value.replace(/\r/gi, "\\r");
//                            value = value.replace(/\n/gi, "\\n");
//                            value = value.replace(/"/gi, "");
//                        }
//                    }
//
//
//
////                if (fieldname === 'WORK_DESCRIPTION') {
////                    if (value != undefined) {
////
////                      //  value = value.replace(/\r\n/gi, "");
////
////                       // value = value.replace("\\r\\n", " ");
////                        //value =  "Test line1.\nTest line2."  will break json.Parse
////                        //console.log('fieldname value',value)
////                       // value = value.replace(/^[^(]+\(|[^}]+$/g, '');
////                        value = value.replace(/\n/gi, "\\n");
////                        value = value.replace(/"/gi, "");
////                    }
////                }
//                    if (fieldname === 'DESCRIPTION') {
//                        if (value != undefined) {
//
//                            value = value.replace(/\r\n/gi, "");
//                            value = value.replace(/"/gi, "");
//                        }
//                    }
//                    if (fieldname === 'WebPassword') {
//                        if (value != undefined) {
//                            var strct = new Array();
//                            holdrow += '"role":' + userRoles.admin + ',';
//                        }
//                    }
//                    if (fieldname.match(/Date/gi)) {
//                        if (value != undefined) {
//                            value = moment(value).format("MM/DD/YYYY");
//                        }
//                    }
//                    if (key == 0) {
//                        holdrow += '{"' + fieldname + '":"' + value + '",';
//                    }
//                    else if (key == maxCols) {
//                        holdrow += '"' + fieldname + '":"' + value + '"}';
//
//                    } else {
//                        if (fieldtype === 496) {
//                            // send integer #
//                            holdrow += '"' + fieldname + '":' + value + ',';
//                        }
//                        else {
//                            if (fieldname === 'WORK_DESCRIPTION') {
////                            holdrow += '"' + fieldname + ":" + value + ',';
//                                holdrow += '"' + fieldname + '":"' + value + '",';
//                            } else
//                                holdrow += '"' + fieldname + '":"' + value + '",';
//                        }
//                    }
//                }
//            );
//            jsondata[keyheader] = JSON.parse(holdrow);
//
//            //jsondata[keyheader] = JSON{holdrow};
//        }
//    );
//    return jsondata;
//}
module.exports = {

    wrapJson: function (results, fields, jsondata) {
       // wrapJson(results, fields, jsondata)
       // return jsondata;
        return {'data':'john'}
    },
//
//    database: function() {
//        var CFGs = LoadConfig();
//        console.log('JJ cfg',CFGs)
//
//        fb.attachOrCreate(
//            {
//                host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
//            },
//            function (err, db) {
//                if (err) {
//                    console.log(err.message);
//                } else {
//                    database = db;
//                    //return database
//                    console.log("\n\r db connected ");
//                }
//            }
//        );
//
//        return database;
//    },
    GetUsers: function(){
//        var CFG = LoadConfig();
//        var jsondata = new Array();
//        qrystr = 'select ID "id", "Staff Init" "username" ,"WebPassword" "password", "role" ,"AdjusterID" "adjusterid" from "Staff" where id >0';
//
//        fb.attachOrCreate(
//            {
//                host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
//            },
//            function (err, db) {
//                if (err) {
//                    console.log(err.message);
//                } else {
//                    database = db;
//                    //return database
//                    console.log("\n\r db connected ");
//                    database.execute(qrystr, function (err, results, fields) {
//                            //    database.execute(qrystr, function (err, results, fields) {
//                            console.log('database.query result "Staff"  ', results);
//
//                            wrapJson(results, fields, jsondata);
//                        },
//                        logerror);
//                }
//            }
//        );
//
//        return jsondata;
        return {'data':'john'}
    },
    GetAdjusters: function(){
//        var CFG = LoadConfig();
//        var jsondata = new Array();
//        qrystr = 'select ADJUSTER_ID, ADJUSTER_NAME, ADJUSTER_PHONE, ADJUSTER_EXT, "Email" from ADJUSTER where ADJUSTER_ID >0';
//
//        fb.attachOrCreate(
//            {
//                host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
//            },
//            function (err, db) {
//                if (err) {
//                    console.log(err.message);
//                } else {
//                    database = db;
//                    //return database
//                    console.log("\n\r db connected ");
//                    database.execute(qrystr, function (err, results, fields) {
//                            //    database.execute(qrystr, function (err, results, fields) {
//                            console.log('database.query result "Staff"  ', results);
//
//                            wrapJson(results, fields, jsondata);
//                        },
//                        logerror);
//                }
//            }
//        );
//
//        return jsondata;
        return {'data':'john'}
    },


    getadjusters: function() {
//        var jsondata = new Array();
//        qrystr = 'select ADJUSTER_ID, ADJUSTER_NAME, ADJUSTER_PHONE, ADJUSTER_EXT, "Email" from ADJUSTER where ADJUSTER_ID >0';
//        //firebird.dbConn().
//        database.execute(qrystr, function (err, results, fields) {
//                console.log('database.query result "Staff"  ', results);
//
//                firebird.wrapJson(results, fields, jsondata);
//
//            },
//            logerror);
      //  return jsondata;
        return {'data':'john'}
    }



};