let device;
let isConnected = false;
  
async function connect() {
    console.log(event.type);
    console.log(device);
    
    if (isConnected == true) {
        return;
    }


    // Filter on devices with the MYU robo.
    const filters = [
        {
            vendorId: 0x04d8, // Microchip Technology Inc.
            productId: 0xfa8b, // MYUUSB
            // usage: 0x01,
            // usagePage: 65280,
        },
    ];

    // Prompt user to select a MYU robo device.
    try {
        [device] = await navigator.hid.requestDevice({ filters });
        if (!device) {
            return;
        }
    } catch (error) {
        console.error(error.name, error.message);
    }

    if (device.opened == false) {
        try {
            // Wait for the HID connection to open.
            await device.open();
        
        } catch (error) {
            console.error(error.name, error.message);
        }   
    }

    document.getElementById("deviceStatus").innerText = device.productName + "に接続しました。";
    document.getElementById("btnConnect").classList.add("connected");
    isConnected = true;    

    document.getElementById("btnDownload").style.opacity = "1.0";
    document.getElementById("btnForward").style.opacity = "1.0";
    document.getElementById("btnBackward").style.opacity = "1.0";
    document.getElementById("btnTurnLeft").style.opacity = "1.0";
    document.getElementById("btnTurnRight").style.opacity = "1.0";

}

function handleConnectedDevice(e) {
    console.log("Device connected: " + e.device.productName);
    isConnected = true;
}

function handleDisconnectedDevice(e) {
    console.log("Device disconnected: " + e.device.productName);
    console.log(device);

    // device = undefined;
    document.getElementById("deviceStatus").innerText = "接続されていません。";
    document.getElementById("btnConnect").classList.remove("connected");
    isConnected = false;
    
    document.getElementById("btnDownload").style.opacity = "0.4";
    document.getElementById("btnForward").style.opacity = "0.4";
    document.getElementById("btnBackward").style.opacity = "0.4";
    document.getElementById("btnTurnLeft").style.opacity = "0.4";
    document.getElementById("btnTurnRight").style.opacity = "0.4";
}

function handleInputReport(e) {
    console.log(e.device.productName + ": got input report " + e.reportId);
    console.log(new Uint8Array(e.data.buffer));
}
  
navigator.hid.addEventListener("connect", handleConnectedDevice);
navigator.hid.addEventListener("disconnect", handleDisconnectedDevice);


window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};
