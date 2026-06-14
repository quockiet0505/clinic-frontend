const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('Table.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const tableFiles = walk('d:/Information Technology/LV_CNTT/core_code/clinic-frontend/admin-web/src/features');

tableFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace <TableHead> classes
    // Replace `text-right pr-8` -> `pl-2`
    content = content.replace(/<TableHead className="[^"]*text-right pr-[68][^"]*">Thao tác<\/TableHead>/g, match => {
        return match.replace(/text-right pr-[68]/, 'pl-2');
    });

    // Replace the button container alignment
    // Find <TableCell className="... text-right pr-8">
    // and replace text-right pr-8 with nothing
    content = content.replace(/<TableCell className="[^"]*text-right pr-[68][^"]*">/g, match => {
        return match.replace(/text-right pr-[68]/, '');
    });
    
    // Replace justify-end with justify-start in button wrappers inside Thao tác column
    // Typically it's `<div className="flex justify-end gap-1.5">` or `gap-2`
    // We will do a generic replacement for justify-end inside TableCell
    content = content.replace(/justify-end([^>]*>[\s\n]*<Button)/g, 'justify-start$1');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed', file);
    }
});
