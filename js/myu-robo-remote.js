
async function remoteForward() {
    if (!device) return;
	
	const reportId = 0x00;
    const data = Uint8Array.from([  2,   2,   0, 222, 119,  74,  10, 226, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0]);
    
    await device.sendReport(reportId, new Uint8Array(data));
    // console.log(data);
}

async function remoteBackward() {
    if (!device) return;
	
	const reportId = 0x00;
    const data = Uint8Array.from([  2,   8,   0, 222, 119,  74,  10, 226, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0]);
    
    await device.sendReport(reportId, new Uint8Array(data));
    // console.log(data);
}

async function remoteTurnLeft() {
    if (!device) return;
	
	const reportId = 0x00;
    const data = Uint8Array.from([  2,  11,   0, 222, 119,  74,  10, 226, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0]);
    
    await device.sendReport(reportId, new Uint8Array(data));
    // console.log(data);
}

async function remoteTurnRight() {
    if (!device) return;
	
	const reportId = 0x00;
    const data = Uint8Array.from([  2,  10,   0, 222, 119,  74,  10, 226, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0]);
    
    await device.sendReport(reportId, new Uint8Array(data));
    // console.log(data);
}

async function remoteMouseup() {
    if (!device) return;

	const reportId = 0x00;
    const data = Uint8Array.from([  2,   0,   0, 222, 119,  74,  10, 226, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0]);
    
    await device.sendReport(reportId, new Uint8Array(data));
    // console.log(data);
}
