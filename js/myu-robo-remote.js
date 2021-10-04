async function remoteForward() {
    if (!isConnected) return;

    if (port) {
        const writer = port.writable.getWriter();
        await writer.write(new Uint8Array([2]));
        writer.releaseLock();
    } else {
        const data = Uint8Array.from([  2,   2,   0, ...Array(61).fill(255)]);
        await device.sendReport(0x00, new Uint8Array(data));
    }
}

async function remoteBackward() {
    if (!isConnected) return;

    if (port) {
        const writer = port.writable.getWriter();
        await writer.write(new Uint8Array([8]));
        writer.releaseLock();
    } else {
        const data = Uint8Array.from([  2,   8,   0, ...Array(61).fill(255)]);
        await device.sendReport(0x00, new Uint8Array(data));
    }
}

async function remoteTurnLeft() {
    if (!isConnected) return;

    if (port) {
        const writer = port.writable.getWriter();
        await writer.write(new Uint8Array([11]));
        writer.releaseLock();
    } else {
        const data = Uint8Array.from([  2,  11,   0, ...Array(61).fill(255)]);
        await device.sendReport(0x00, new Uint8Array(data));
    }
}

async function remoteTurnRight() {
    if (!isConnected) return;

    if (port) {
        const writer = port.writable.getWriter();
        await writer.write(new Uint8Array([10]));
        writer.releaseLock();
    } else {
        const data = Uint8Array.from([  2,  10,   0, ...Array(61).fill(255)]);
        await device.sendReport(0x00, new Uint8Array(data));
    }
}

async function remoteStop() {
    if (!isConnected) return;

    if (port) {
        const writer = port.writable.getWriter();
        await writer.write(new Uint8Array([0]));
        writer.releaseLock();
    } else {
        const data = Uint8Array.from([  2,   0,   0, ...Array(61).fill(255)]);
        await device.sendReport(0x00, new Uint8Array(data));
    }
}

// RS-232C 1byte 出力
async function sendrs232c(data) {
    console.log("sendrs232c: " + data);
    try {
        const writer = port.writable.getWriter();
        await writer.write(new Uint8Array([data]));
        writer.releaseLock();
    } catch (error) {
        console.error(error.name, error.message, "COMポートの設定が不適切です？");
    }
}

