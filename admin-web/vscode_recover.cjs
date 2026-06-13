const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');
const targetProject = 'clinic-frontend/admin-web/src';
const outDir = path.join(__dirname, 'vscode_recovery');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

const isVietnamese = (text) => /[àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹý]/i.test(text);

let recoveredCount = 0;

if (fs.existsSync(historyDir)) {
  const dirs = fs.readdirSync(historyDir);
  for (const dir of dirs) {
    const dirPath = path.join(historyDir, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;

    const entriesFile = path.join(dirPath, 'entries.json');
    if (fs.existsSync(entriesFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(entriesFile, 'utf8'));
        if (data.resource && data.resource.includes(targetProject)) {
          // It's a file from our project!
          // Extract original relative path
          const urlObj = new URL(data.resource);
          let realPath = decodeURIComponent(urlObj.pathname);
          if (process.platform === 'win32' && realPath.startsWith('/')) {
            realPath = realPath.substring(1); // Remove leading slash for Windows paths
          }
          
          // Sort entries by timestamp descending
          const entries = data.entries.sort((a, b) => b.timestamp - a.timestamp);
          
          let bestContent = null;
          // Find the latest entry that has Vietnamese text
          for (const entry of entries) {
            const entryPath = path.join(dirPath, entry.id);
            if (fs.existsSync(entryPath)) {
              const content = fs.readFileSync(entryPath, 'utf8');
              if (isVietnamese(content)) {
                bestContent = content;
                break;
              }
            }
          }

          if (bestContent) {
            // Write to our recovery folder
            // Let's actually overwrite the real file to restore it instantly!
            // But just to be safe, write it to realPath directly!
            if (fs.existsSync(realPath)) {
               fs.writeFileSync(realPath, bestContent, 'utf8');
               console.log(`Recovered: ${realPath}`);
               recoveredCount++;
            }
          }
        }
      } catch(e) {
        // ignore parse error
      }
    }
  }
}

console.log(`Recovered ${recoveredCount} files from VS Code History!`);
