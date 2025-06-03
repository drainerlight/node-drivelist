# node-drivelist

[![NPM Version](https://img.shields.io/npm/v/node-drivelist.svg?style=flat-square)](https://www.npmjs.com/package/node-drivelist)
[![License](https://img.shields.io/npm/l/node-drivelist.svg?style=flat-square)](https://github.com/drainerlight/node-drivelist/blob/master/LICENSE)
[![Build Status](https://img.shields.io/travis/com/drainerlight/node-drivelist.svg?style=flat-square)](https://travis-ci.com/drainerlight/node-drivelist) <!-- Replace with actual build status badge if available -->

`node-drivelist` is a TypeScript library for discovering connected hard drives/storage devices and retrieving their usage information (total, used, available space) and mount points.

Inspired by [diskusage-ng](https://github.com/iximiuz/node-diskusage-ng).

## Features

-   **Cross-Platform Support**: Works on Windows (including Windows 10, Windows 11), Linux, and macOS.
    -   Linux and macOS support is achieved using the standard POSIX-compatible `df -kP` command and the same robust parsing logic (`src/posix.ts`).
-   **Detailed Drive Information**: Provides total space, used space, available space, percentage used, mount point, and a derived name for each drive.
-   **Robust POSIX Parsing**: The parser for `df` output correctly handles various output formats, including mount points with spaces and other special characters. This benefits Linux and macOS.
-   **No Native Compilation**: Does not require `node-gyp` or other build tools post-installation.
-   **Promise-Based API**: Modern asynchronous API for easy integration.
-   **TypeScript Native**: Written in TypeScript, offering strong typing and intellisense.

## Installation

```bash
npm install node-drivelist
# or
yarn add node-drivelist
```

### Using Pre-compiled JavaScript
This repository includes pre-compiled JavaScript files in the `dist` directory. If you prefer not to use TypeScript or want to use the files directly, you can find them there.

## API and Usage

The library exports two main asynchronous functions: `getDriveList()` and `getDriveByName()`.

### `DriveDataInterface`

Both functions return data conforming to the `DriveDataInterface` (or an array of it for `getDriveList()`), which has the following structure:

```typescript
interface DriveDataInterface {
  total: number;         // Total space in bytes
  used: number;          // Used space in bytes
  available: number;     // Available space in bytes
  percentageUsed: number; // Percentage of space used (e.g., 32 for 32%)
  mountpoint: string;    // Mount point (e.g., '/boot/efi' on Linux, 'C:' on Windows, '/Volumes/My Passport' on macOS)
  name: string;          // Name of the drive (e.g., 'efi', 'C:', 'My Passport')
}
```
*Note: The `name` is typically derived from the last component of the `mountpoint` on POSIX systems (Linux, macOS), or it's the drive letter/volume label on Windows.*

### `getDriveList(): Promise<DriveDataInterface[]>`

Asynchronously retrieves a list of all connected and mounted drives.

**Example:**

```javascript
import { getDriveList } from "node-drivelist";

async function logAllDrives() {
  try {
    const drives = await getDriveList();
    console.log("Discovered drives:", drives);
    /*
    Example Output (structure and values will vary by system):

    Linux:
    [
      {
        total: 524288000,     // ~500MB
        used:  104857600,     // ~100MB
        available: 419430400, // ~400MB
        percentageUsed: 20,
        mountpoint: '/boot',
        name: 'boot'
      },
      {
        total: 250000000000,  // ~250GB
        used: 100000000000,  // ~100GB
        available: 150000000000, // ~150GB
        percentageUsed: 40,
        mountpoint: '/',
        name: '' // Root mount point name is empty if mountpoint is '/'
      }
      // ... more drives
    ]

    Windows:
    [
      {
        total: 120000000000, // ~120GB
        used: 80000000000,   // ~80GB
        available: 40000000000, // ~40GB
        percentageUsed: 67,
        mountpoint: 'C:',
        name: 'C:' // Or a volume label if parsed
      },
      // ... more drives
    ]

    macOS:
    [
      {
        total: 499963174912,  // ~500GB
        used:  250000000000,  // ~250GB
        available: 249963174912, // ~250GB
        percentageUsed: 50,
        mountpoint: '/',
        name: '' // Root mount point name is empty if mountpoint is '/'
      },
      {
        total: 1000204886016, // ~1TB
        used:  500000000000,  // ~500GB
        available: 500204886016, // ~500GB
        percentageUsed: 50,
        mountpoint: '/Volumes/My External Drive',
        name: 'My External Drive'
      }
      // ... more drives
    ]
    */
  } catch (error) {
    console.error("Error getting drive list:", error);
  }
}

logAllDrives();
```

### `getDriveByName(driveName: string): Promise<DriveDataInterface | null>`

Asynchronously retrieves information for a specific drive identified by its `name`.

**Example:**

```javascript
import { getDriveByName } from "node-drivelist";

async function findSpecificDrive(name) {
  try {
    const drive = await getDriveByName(name);
    if (drive) {
      console.log(\`Details for drive "\${name}":\`, drive);
      /*
      Example Output (if drive with name 'My External Drive' exists on macOS):
      {
        total: 1000204886016,
        used:  500000000000,
        available: 500204886016,
        percentageUsed: 50,
        mountpoint: '/Volumes/My External Drive',
        name: 'My External Drive'
      }
      */
    } else {
      console.log(\`Drive with name "\${name}" not found.\`);
    }
  } catch (error) {
    console.error(\`Error getting drive "\${name}":\`, error);
  }
}

// Example usage:
// findSpecificDrive('My External Drive'); // For macOS/Linux with such a volume
// findSpecificDrive('D:');               // For Windows
// findSpecificDrive('boot');             // For a Linux system with /boot
```

## Example Script

The package includes a ready-to-use example script to demonstrate the functionality:

```bash
# Run the example script to list all drives on your system
node examples/list-drives.js
```

This script displays a formatted list of all drives found on your system, including their mount points, names, total size, available space, used space, and usage percentage. The example works on all supported platforms (Windows, macOS, Linux) and provides a quick way to verify the library's functionality on your system.

## Building the Project

To compile the TypeScript source code to JavaScript (output to `dist/` directory):

```bash
npm run build
```
This uses the `tsc` command as defined in `package.json`.

## Running Tests

To execute the test suite:

```bash
npm test
```
Tests are located in the `tests/` directory and use `tape` with `ts-node` for execution, as defined in `package.json`.

## Contributing

Contributions are welcome! Please follow these general steps:
1.  Fork the repository.
2.  Create a new branch for your feature or fix (e.g., `git checkout -b feature/awesome-feature` or `fix/bug-description`).
3.  Make your changes and add/update tests accordingly.
4.  Ensure all tests pass (`npm test`).
5.  Ensure your code is formatted (`npm run prettier-all` or follow project style).
6.  Commit your changes with clear, descriptive messages.
7.  Push your branch to your fork.
8.  Submit a pull request to the main `node-drivelist` repository.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/drainerlight/node-drivelist/blob/master/LICENSE) file for details.
(The `LICENSE` file is assumed to be present at the specified path or will be added by the project maintainers. The NPM license badge also indicates MIT.)