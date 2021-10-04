let device = undefined;
let port = undefined;
let isConnected = false;
let deviceFilter = {    // Filter on devices with the MYU robo.
    vendorId: 0x04d8,   // Microchip Technology Inc.
    productId: 0xfa8b,  // MYUUSB
};
let serialFilters = [
    {
        usbVendorId: 0x067b, // Prolific Technology, Inc.
        usbProductId: 0x2303 //
    },
    {
        usbVendorId: 0x0403, // Future Technology Devices International Limited
        usbProductId: 0x6001 //
    },
];

async function connect() {
    console.log(event.type);
    
    if (isConnected == true) {
        return;
    }

    // Prompt user to select a MYU robo device.

    let requestParams = { filters: serialFilters };
    try {
        port = await navigator.serial.requestPort(requestParams);
        if (!port) {
          return;
        }
    } catch (error) {
        console.error(error.name, error.message);
    }

    if (!port.opened) {
        try {
            await port.open({baudRate: 9600});
        } catch (error) {
            console.error(error.name, error.message);
        }   
    }

    isConnected = true;    

    // const {usbProductId, usbVendorId} = port.getInfo();
    document.getElementById("deviceStatus").innerText = "MYUロボに接続しました。";
    
    setButtonStyle();
}


// async function connect() {
//     console.log(event.type);
    
//     if (isConnected == true) {
//         return;
//     }

//     try {
//         [device] = await navigator.hid.requestDevice(requestParams);
//         if (!device) {  // Cancelled
//             return;
//         }
//     } catch (error) {
//         console.error(error.name, error.message);
//     }

//     if (!device.opened) {
//         try {
//             await device.open();
//         } catch (error) {
//             console.error(error.name, error.message);
//         }   
//     }

//     isConnected = true;    

//     document.getElementById("deviceStatus").innerText = device.productName + "に接続しました。";

//     setButtonStyle();
// }



async function handleConnectedDevice(e) {
    // console.log("Device connected: " + e.device.productName);
    console.log("Serial port connected: " + e.target);
}

async function handleDisconnectedDevice(e) {
    console.log("Device disconnected: " + e.device.productName);
    console.log("Serial port disconnected");

    isConnected = false;
    // port = undefined;
    document.getElementById("deviceStatus").innerText = "接続されていません。";
    
    setButtonStyle();
}

function handleInputReport(e) {
    console.log(e.device.productName + ": got input report " + e.reportId);
    console.log(new Uint8Array(e.data.buffer));
}

navigator.serial.getPorts().then((ports) => {
    // Initialize the list of available ports with `ports` on page load.
});

navigator.hid.addEventListener("connect", handleConnectedDevice);
navigator.hid.addEventListener("disconnect", handleDisconnectedDevice);
navigator.serial.addEventListener("connect", handleConnectedDevice);
navigator.serial.addEventListener("disconnect", handleDisconnectedDevice);
