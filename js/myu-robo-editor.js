
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
        document.getElementById("btnConnect").style.opacity = "0.4";
    }

    objConnect.addEventListener('mouseup', connect, false);
    // btnConnect.addEventListener('touchend', connect, false);

    objDownload.addEventListener('mouseup', download, false);
    // btnDownload.addEventListener('touchend', download, false);
    objDownload.style.opacity = "0.4";
    
    objSaveProgram.addEventListener('mouseup', saveProgram, false);
    objLoadProgram.addEventListener('click', clearFilePath);
    objLoadProgram.addEventListener('change', loadProgram);

    objSelectCommand.addEventListener('change', setDescription, false);
    // objSelectCommand.addEventListener('dblclick', addCommand, false);

    setVersion();
    setSelectBox();

    makeCommandDictionary();
    console.log(commandDictionary);

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


function setVersion() {
    let modified = new Date(document.lastModified);
    let year  = modified.getFullYear();
    let month = ('0' + (modified.getMonth() + 1)).slice(-2);
    let date  = ('0' + modified.getDate()).slice(-2);

    document.getElementById("version").innerHTML = 'ver. ' + year + month + date;
}

function setSelectBox() {
    // let objOption = document.createElement("option");
    for (let i = 0; i < commandData.length; i++) {
        if (commandData[i][0] != 0) {
            let objOption = document.createElement('option');
            objOption.setAttribute('value', i);
            objOption.text = commandData[i][1];
            objOption.value = commandData[i][1]; // = i;
            objSelectCommand.appendChild(objOption);
        }
    }
}

function setDescription() {
    objCommandDescription.innerText = commandDictionary[objSelectCommand.value][2];
}


async function download() {
    if (!device) return;
    
    let commandArray = parseCommand(objProgramTA);
    // let sendcode = compileCommand(commandArray);

    const waitFor = duration => new Promise(r => setTimeout(r, duration));
    
    console.log(device.productName);
    console.log(device.collections);

    const reportId = 0x00;
    const dataS = Uint8Array.from([  1,  16, ...Array(62).fill(255)]);
    const dataE = Uint8Array.from([  1,  19, ...Array(62).fill(255)]);
    
    await device.sendReport(reportId, new Uint8Array(dataS));

    for (let i = 0; i < commandArray.length; i++) {
        if (commandArray[i].length == 0) continue;

        let command = commandArray[i].split(',');
        let data = Array(64).fill(255, 0);
        data[1] = 16;
        
        if (command[0] in commandDictionary) {
            data[0] = commandDictionary[command[0]][1] + 1;

            switch (commandDictionary[command[0]][1]) {
                case 3:
                data[4] = parseInt(command[2], 10);
                case 2:
                data[3] = parseInt(command[1], 10);
                case 1:
                data[2] = commandDictionary[command[0]][0];
            }

        } else {
            console.log(i, 'Command not found!');
        }

        // console.log(data);
        await device.sendReport(reportId, new Uint8Array(data));
        // waitFor(100);
    }

    await device.sendReport(reportId, new Uint8Array(dataE));
}

let commandDictionary = {};
// '命令':[0命令コード, 1命令サイズ（byte）, 2'命令の説明', 3'引数1名称', 4'引数1説明', 5引数1最小値, 6引数1最大値, 7'引数2名称', 8'引数2説明', 9引数2最小値, 10引数2最大値]
function makeCommandDictionary() {
    for (let i = 0; i < commandData.length; i++) {
        commandDictionary[commandData[i][1]] = [];
        commandDictionary[commandData[i][1]].push(commandData[i][2]);
        commandDictionary[commandData[i][1]].push(commandData[i][3]);
        commandDictionary[commandData[i][1]].push(commandData[i][4]);
        if (commandData[i][3] == 1) continue;
        commandDictionary[commandData[i][1]].push(commandData[i][5]);
        commandDictionary[commandData[i][1]].push(commandData[i][6]);
        commandDictionary[commandData[i][1]].push(commandData[i][7]);
        commandDictionary[commandData[i][1]].push(commandData[i][8]);
        if (commandData[i][3] == 2) continue;
        commandDictionary[commandData[i][1]].push(commandData[i][9]);
        commandDictionary[commandData[i][1]].push(commandData[i][10]);
        commandDictionary[commandData[i][1]].push(commandData[i][11]);
        commandDictionary[commandData[i][1]].push(commandData[i][12]);
    }
}
  
function parseCommand(element) {
    console.log("parseCommand");

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
            sendcode.push(commandDictionary[command[0]][0]);
            for (c = 1; c < commandDictionary[command[0]][1]; c++) {
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


// 引数入力用ダイアログボックス

// dialogPolyfillを使用する場合
// let dialogList = document.querySelectorAll('dialog');
// if (dialogList) {
//   for (let i = 0; i < dialogList.length; i++) {
//     dialogPolyfill.registerDialog(dialogList[i]);
//   }
// }

let argValue = new Array(3);

const open = document.getElementById('open');
const close = document.getElementById('close');
const dialog = document.getElementById('dialog');

objSelectCommand.addEventListener('dblclick', function() {
    if (setDialogBox()) {
        dialog.showModal();
    } else {
        addCommandToTextArea();
    }
});

close.addEventListener('click', function() {
    addCommandToTextArea();
    dialog.close();
});

dialog.addEventListener('click', function(event) {
    if (event.target === dialog) {
        dialog.close('cancelled');
    }
});

function addCommandToTextArea() {
    argValue[1] = document.getElementById("inputArg1").value;
    argValue[2] = document.getElementById("inputArg2").value;

    let commands = objProgramTA.value;
    let pos      = objProgramTA.selectionStart;
    let len      = commands.length;
    let before   = commands.substr(0, pos);
    let after    = commands.substr(pos, len);
    let word     = commandData[objSelectCommand.selectedIndex][1];

    for (let i = 1; i < commandData[objSelectCommand.selectedIndex][3]; i++) {
        word = word + ', ' + argValue[i];
    }

    if (after[0] != '\n') {
        word = word + '\n';
    }

    objProgramTA.value = before + word + after;

    objProgramTA.focus();
    let newCaret = pos + word.length;
    objProgramTA.setSelectionRange(newCaret, newCaret);
}

function setDialogBox() {
    command = objSelectCommand.value;
    console.log(command, commandDictionary[command][1]);
    
    switch (commandDictionary[command][1]) {
        case 1:
            return false;
        case 2:
            document.getElementById("arg1Name").innerText = commandDictionary[command][3];
            document.getElementById("arg1Description").innerText = commandDictionary[command][4];
            if (isNaN(argValue[1])) {
                console.log(argValue[1], commandDictionary[command][5]);
                document.getElementById("inputArg1").value = commandDictionary[command][5];
            } else {
                document.getElementById("inputArg1").value = argValue[1];
            }
            arg2Value = null;
            document.getElementById("arg2").style.display = "none";
            break;
        case 3:
            document.getElementById("arg1Name").innerText = commandDictionary[command][3];
            document.getElementById("arg1Description").innerText = commandDictionary[command][4];
            if (isNaN(argValue[1])) {
                // console.log(argValue[1], commandDictionary[command][5]);
                document.getElementById("inputArg1").value = commandDictionary[command][5];
            } else {
                document.getElementById("inputArg1").value = argValue[1];
            }
            document.getElementById("arg2").style.display = "block";
            document.getElementById("arg2Name").innerText = commandDictionary[command][7];
            document.getElementById("arg2Description").innerText = commandDictionary[command][8];
            if (isNaN(argValue[2])) {
                // console.log(argValue[2], commandDictionary[command][9]);
                document.getElementById("inputArg2").value = commandDictionary[command][9];
            } else {
                document.getElementById("inputArg2").value = argValue[2];
            }

            break;
    }

    return true;
}