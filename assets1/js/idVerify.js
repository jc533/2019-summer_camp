function idVerify(id) {
    if (id.length !== 10) {
        return false;
    }
    var regex = new RegExp('[A-Z]{1}[A-D]{1}[0-9]{8}') // 居留證
    if (regex.test(id)) {
        return residentVerify(id);
    }
    var code = {"A":"10","B":"11","C":"12","D":"13","E":"14","F":"15","G":"16","H":"17","I":"34","J":"18","K":"19","L":"20","M":"21","N":"22","O":"35","P":"23","Q":"24","R":"25","S":"26","T":"27","U":"28","V":"29","W":"32","X":"30","Y":"31","Z":"33"};
    var w = [1,9,8,7,6,5,4,3,2,1,1];
    id = id.replace(id.charAt(0),code[id.charAt(0)]);
    var idChars = id.split('');
    var value = 0;
    for (i = 0; i < idChars.length; i++) {
        value+=parseInt(idChars[i])*w[i]
    }

    if (value % 10 !== 0) {
        return false;
    } else {
        return true;
    }
}

function residentVerify(id) { // 居留證
    var code = {"A":"10","B":"11","C":"12","D":"13","E":"14","F":"15","G":"16","H":"17","I":"34","J":"18","K":"19","L":"20","M":"21","N":"22","O":"35","P":"23","Q":"24","R":"25","S":"26","T":"27","U":"28","V":"29","W":"32","X":"30","Y":"31","Z":"33"};
    var gender = {"A":"0","B":"1","C":"2","D":"3"};
    var w = [1,9,8,7,6,5,4,3,2,1,1];
    id = id.replace(id.charAt(0),code[id.charAt(0)]).replace(id.charAt(1),gender[id.charAt(1)]);
    var idChars = id.split('');
    var value = 0;
    for (i = 0; i < idChars.length; i++) {
        value+=parseInt(idChars[i])*w[i]
    }

    if (value % 10 !== 0) {
        return false;
    } else {
        return true;
    }
}