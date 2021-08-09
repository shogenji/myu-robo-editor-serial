
const objSelectCommand = document.getElementById('selectCommand');
const objCommandDescription = document.getElementById('commandDescription');
const objEditArea = document.getElementById('editArea');
const objProgramTA = document.getElementById('programTextArea');
const objVersion = document.getElementById("version");
const objConnect = document.getElementById('btnConnect');
const objDownload = document.getElementById('btnDownload');
const objSaveProgram = document.getElementById('btnSaveProgram');
const objLoadProgram = document.getElementById('btnLoadProgram');


function startup() {

    if (!("hid" in navigator)) {
        document.getElementById("deviceStatus").innerText = "WebHIDに未対応です。";
    }

    objConnect.addEventListener('mouseup', connect, false);
    // btnConnect.addEventListener('touchend', connect, false);

    objDownload.addEventListener('mouseup', download, false);
    // btnDownload.addEventListener('touchend', download, false);

    objSaveProgram.addEventListener('mouseup', saveProgram, false);
    objLoadProgram.addEventListener('click', clearFilePath);
    objLoadProgram.addEventListener('change', loadProgram);

    objSelectCommand.addEventListener('change', setDescription, false);
    objSelectCommand.addEventListener('dblclick', addCommand, false);

    setVersion();
    setSelectBox();

    makeCommandDictionary();
    // console.log(commandDictionary);

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
    
    let commandArray = parseCommand(objProgramTA);
    let sendcode = compileCommand(commandArray);

    const waitFor = duration => new Promise(r => setTimeout(r, duration));
    
    console.log(device.productName);
    console.log(device.collections);

    const reportId = 0x00;
    const dataFF = Array(62).fill(255);
    const dataS = Uint8Array.from([  1,  16, ...dataFF]);
    const dataE = Uint8Array.from([  1,  19, ...dataFF]);
    // const dataS = Uint8Array.from([  1,  16, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0]);
    // const dataE = Uint8Array.from([  1,  19, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0]);
    
    await device.sendReport(reportId, new Uint8Array(dataS));

    for (let j = 0; j < commandArray.length; j++) {
        if (commandArray[j].length == 0) continue;

        let command = commandArray[j].split(',');
        let data = Array(64).fill(255, 0);
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

let commandDictionary = {};
function makeCommandDictionary() {
    for (let i = 0; i < commandData.length; i++) {
        commandDictionary[commandData[i][0]] = [];
        commandDictionary[commandData[i][0]].push(i);
        commandDictionary[commandData[i][0]].push(commandData[i][1]);
        commandDictionary[commandData[i][0]].push(commandData[i][2]);
    }
}
  
function parseCommand(element) {
    let commands = element.value;
    commands     = commands.replace(/ /g, "");
    commands     = commands.replace(/　/g, "");
    commands     = commands.replace(/，/g, ",");
    commands     = commands.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    commands     = commands.replace(/\n$/g, "");
    // commands     = commands.replace(/\n\n+/g, "\n");
    // commands     = commands.replace(/^\n/g, "");

    let commandArray = commands.split('\n');
    console.log(commandArray);

    return commandArray;
}

function compileCommand(commandArray) {
    let sendcode = [];

    for (let i = 0; i < commandArray.length; i++) {
        if (commandArray[i].length == 0) continue;

        let command = commandArray[i].split(',');

        if (command[0] in commandDictionary) {
            sendcode.push(commandDictionary[command[0]][1]);
            for (c = 1; c < commandDictionary[command[0]][2]; c++) {
                sendcode.push(parseInt(command[1], 10));
            }
        } else {
            console.log('Line ' + String(i + 1) + ': ' + command[0] + ' not found!');
        }
    }

    return sendcode;
}

function saveProgram() {
    const a = document.createElement('a');
    a.href = 'data:text/plain,' + encodeURIComponent(objProgramTA.value);
    a.download = document.getElementById('inputProgramName').value;

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

let reader = new FileReader();

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
