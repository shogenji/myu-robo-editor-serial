
const objSelectCommand = document.getElementById('selectCommand');
const objCommandDescription = document.getElementById('commandDescription');
const objEditArea = document.getElementById('editArea');
const objProgramTA = document.getElementById('programTextArea');
const objVersion = document.getElementById("version");

objSelectCommand.addEventListener('change', setDescription, false);
objSelectCommand.addEventListener('dblclick', addCommand, false);

setVersion();
setSelectBox();


function startup() {

    if (!("hid" in navigator)) {
    document.getElementById("deviceStatus").innerText = "WebHIDに未対応です。";
    }

    const btnConnect = document.getElementById('btnConnect');
    btnConnect.addEventListener('mouseup', connect, false);
    // btnConnect.addEventListener('touchend', connect, false);

    const btnDownload = document.getElementById('btnDownload');
    btnDownload.addEventListener('mouseup', download, false);
    // btnDownload.addEventListener('touchend', download, false);

    
// const btnConnect = document.getElementById('btnConnect');
// btnConnect.addEventListener('mouseup', connect, false);
// btnConnect.addEventListener('touchend', connect, false);

// const btnForward = document.getElementById('btnForward');
// const btnBackward = document.getElementById('btnBackward');
// const btnTurnLeft = document.getElementById('btnTurnLeft');
// const btnTurnRight = document.getElementById('btnTurnRight');

// btnForward.addEventListener('mousedown', remoteForward, false);
// btnForward.addEventListener('touchstart', remoteForward, false);
// btnForward.addEventListener('mouseup', remoteMouseup, false);
// btnForward.addEventListener('touchend', remoteMouseup, false);

// btnBackward.addEventListener('mousedown', remoteBackward, false);
// btnBackward.addEventListener('touchstart', remoteBackward, false);
// btnBackward.addEventListener('mouseup', remoteMouseup, false);
// btnBackward.addEventListener('touchend', remoteMouseup, false);

// btnTurnLeft.addEventListener('mousedown', remoteTurnLeft, false);
// btnTurnLeft.addEventListener('touchstart', remoteTurnLeft, false);
// btnTurnLeft.addEventListener('mouseup', remoteMouseup, false);
// btnTurnLeft.addEventListener('touchend', remoteMouseup, false);

// btnTurnRight.addEventListener('mousedown', remoteTurnRight, false);
// btnTurnRight.addEventListener('touchstart', remoteTurnRight, false);
// btnTurnRight.addEventListener('mouseup', remoteMouseup, false);
// btnTurnRight.addEventListener('touchend', remoteMouseup, false);
}

document.addEventListener("DOMContentLoaded", startup);

async function download() {
    if (!device) return;
    
    clearInterval(timer);
    let commandArray = parseCommand(objProgramTA);

    const waitFor = duration => new Promise(r => setTimeout(r, duration));
    
    console.log(device.productName);
    console.log(device.collections);

    const reportId = 0x00;
    const dataS = Uint8Array.from([  1,  16, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0]);
    const dataE = Uint8Array.from([  1,  19, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0]);

    await device.sendReport(reportId, new Uint8Array(dataS));


    for (let j = 0; j < commandArray.length; j++) {
    let command = commandArray[j].split(',');
    let data = new Uint8Array(64);
    for (let i = 0; i < 64; i++) {
        data[i] = 255;
    }
    data[1] = 16;
    
    for (let i = 0; i < commandData.length; i++) {
        if (commandData[i][0] == command[0]) {
        data[0] = commandData[i][2] + 1;
        switch (commandData[i][2]) {
            case 3:
            data[4] = parseInt(command[2], 10);
            case 2:
            data[3] = parseInt(command[1], 10);
            case 1:
            data[2] = commandData[i][1];
        }
        break;
        } else if (i == commandData.length - 1) {
        console.log(i, 'Command not found!');
        }
    }

    // console.log(data);
    await device.sendReport(reportId, new Uint8Array(data));
    // waitFor(100);
    }

    await device.sendReport(reportId, new Uint8Array(dataE));
    // timer = setInterval(checkDevice, 3000);
}

function setDescription(e) {
    // console.log(commandData[e.target.value][1]);
    objCommandDescription.innerText = commandData[e.target.value][3];
}

function addCommand(e) {
    let commands = objProgramTA.value;
    let pos      = objProgramTA.selectionStart;
    let len      = commands.length;
    let before   = commands.substr(0, pos);
    let after    = commands.substr(pos, len);
    let word     = commandData[e.target.value][0];
    for (let i = 1; i < commandData[e.target.value][2]; i++) {
    word = word + ', 10';
    }
    // word = word + '\n';
    
    // objProgramTA.focus();
    objProgramTA.value = before + word + after;
}

function parseCommand(element) {
    let commands = element.value;
    commands     = commands.replace(/ /g, "");
    commands     = commands.replace(/　/g, "");
    commands     = commands.replace(/，/g, ",");
    commands     = commands.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    commands     = commands.replace(/\n\n+/g, "\n");
    commands     = commands.replace(/\n$/g, "");
    commands     = commands.replace(/^\n/g, "");
    let commandArray = commands.split('\n');
    console.log(commandArray);

    return commandArray;
}

function saveProgram() {
    const a = document.createElement('a');
    a.href = 'data:text/plain,' + encodeURIComponent(objProgramTA.value);
    a.download = 'program.txt';

    a.click();
}

function setVersion() {
    var modified = new Date(document.lastModified);
    var year  = modified.getFullYear();
    var month = ('0' + (modified.getMonth() + 1)).slice(-2);
    var date  = ('0' + modified.getDate()).slice(-2);

    document.getElementById("version").innerHTML = 'ver. ' + year + month + date;
}

function setSelectBox() {
    // let objOption = document.createElement("option");
    for (let i = 0; i < commandData.length; i++) {
    let objOption = document.createElement('option');
    objOption.setAttribute('value', i);
    objOption.text = commandData[i][0];
    objOption.value = i;
    objSelectCommand.appendChild(objOption);
    }
}

const objLoadProgram = document.getElementById('btnLoadProgram');
let reader = new FileReader();

objLoadProgram.addEventListener('click', clearFilePath);
objLoadProgram.addEventListener('change', loadProgram);

// 保持しているファイル名を消す
function clearFilePath(e) {
    this.value = null;
}

function loadProgram(e) {
    for (file of objLoadProgram.files) {
        console.log(file);
        reader.readAsText(file, 'UTF-8');
        reader.onload = ()=> {
            objProgramTA.value = reader.result;
        };
    }
}

window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};
