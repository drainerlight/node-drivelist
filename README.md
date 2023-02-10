# node-drivelist
> Inspired by [diskusage-ng](https://github.com/iximiuz/node-diskusage-ng)

node-drivelist-ts provides all hard used disks with disk allocation and mount point.

The project is written in Typescript and does not need node-gyp.

Windows & Linux are supported

## Usage

```js
import { getDriveList } from "node-drivelist";
//...
const drives = await getDriveList();

console.log(drives);
/**
 Output
	Linux:
	  [{
	    total: 100663296,
	    used: 31685632,
	    available: 68977664,
	    percentageUsed: 32,
	    mountpoint: '/boot/efi',
	    name: 'efi'
	  }]
	Windows:
		[{
	    total: 100663296,
	    used: 31685632,
	    available: 68977664,
	    percentageUsed: 32,
	    mountpoint: 'E:',
	    name: 'BackupDisk'
	  }]
**/
```
```js
const drive = await getDriveByName('efi');
console.log(drive);
/**
  Output
  {
    total: 100663296,
    used: 31685632,
    available: 68977664,
    percentageUsed: 32,
    mountpoint: '/boot/efi',
    name: 'efi'
  }
**/
```