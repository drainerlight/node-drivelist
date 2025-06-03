const { getDriveList } = require("../dist/index");

// Function to retrieve and display drive information
async function getDriveInfo() {
  try {
    const drives = await getDriveList();
    
    if (drives.length === 0) {
      console.log("No drives found.");
      return;
    }

    console.log("Drives found:");
    console.log("===================");
    
    drives.forEach((drive, index) => {
      console.log(`Drive ${index + 1}:`);
      console.log(`  Mountpoint: ${drive.mountpoint}`);
      console.log(`  Name: ${drive.name}`);
      console.log(`  Total size: ${formatBytes(drive.total)}`);
      console.log(`  Available: ${formatBytes(drive.available)}`);
      console.log(`  Used: ${formatBytes(drive.used)}`);
      console.log(`  Usage: ${drive.percentageUsed}%`);
      console.log("-------------------");
    });
  } catch (error) {
    console.error("Error retrieving drive information:", error);
  }
}

// Helper function to format bytes into readable sizes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

// Execute the function
getDriveInfo();

// Note: This example works on all supported platforms (Windows, macOS, Linux)
// Execution: node examples/list-drives.js
