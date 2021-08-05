var device;
var timer = NaN;
  
async function connect() {
    if (device) {
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
        // Wait for the HID connection to open.
	    await device.open();
        // timer = setInterval(checkDevice, 3000);
        document.getElementById("deviceStatus").innerText = device.productName + "に接続しました。";
    } catch (error) {
        console.error(error.name, error.message);
    }
}

async function checkDevice() {
    if (!device) return;

	const reportId = 0x00;
    const data = Uint8Array.from([  2,   5,   0, 222, 119,  74,  10, 226, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0]);
    
    try {
        await device.sendReport(reportId, new Uint8Array(data));
        console.log("connected");
    } catch (err) {
    
        device = undefined;
        clearInterval(timer);
        document.getElementById("deviceStatus").innerText = "接続されていません。";
        console.log(err);
    }      
}

function handleConnectedDevice(e) {
    console.log("Device connected: " + e.device.productName);
}

function handleDisconnectedDevice(e) {
    console.log("Device disconnected: " + e.device.productName);

    device = undefined;
    document.getElementById("deviceStatus").innerText = "接続されていません。";
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
