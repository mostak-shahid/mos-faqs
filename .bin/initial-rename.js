const replace = require('replace-in-file');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const renameAsync = promisify(fs.rename);

const filePath = path.join(process.cwd(), '**/*.{css,scss,js,php}');

const files = glob.sync(filePath, {
    ignore: ['**/node_modules/**'],
});

const options = {
    files: files,
    from: [
        /mos-faqs/g,
        /mos_faqs/g,
        /plugin starter/g,
        /PLUGIN-STARTER/g,
        /PLUGIN_STARTER/g,
        /PLUGIN STARTER/g,
        /Plugin-Starter/g,
        /Plugin_Starter/g,
        /Plugin Starter/g,
        /PluginStarter/g,
        /Plugin starter/g,
        /Md. Mostak Shahid/g,
        /www.mdmostakshahid.com/g,
        /mostak.shahid@gmail.com/g,
    ],
    to: [
        'mos-faqs',
        'mos_faqs',
        'mos faqs',
        'MOS-FAQS',
        'MOS_FAQS',
        'MOS FAQS',
        'Mos FAQs',
        'Mos_FAQs',
        'Mos FAQs',
        'MosFAQs',
        'Mos FAQs',
        'Md. Mostak Shahid',
        'www.mdmostakshahid.com',
        'mostak.shahid@gmail.com'
    ],
    verbose: true,
    dry: false,
};

const renamedResults = [];
async function renamePHPFiles() {
    const renamePromises = files
        .filter((file) => file.endsWith('.php'))
        .filter((file) => /mos-faqs/.test(file))
        .map(async (file) => {
            const dir = path.dirname(file);
            const baseName = path.basename(file);
            const newBaseName = baseName.replace(
                /mos-faqs/gi,
                'mos-faqs'
            );
            const newFileName = path.join(dir, newBaseName);

            try {
                const baseNameOriginalFile = path.basename(file);
                const baseNameNewFile = path.basename(newFileName);
                if (baseNameOriginalFile !== baseNameNewFile) {
                    await renameAsync(file, newFileName);
                    renamedResults.push({
                        from: file,
                        to: newFileName,
                    });
                }
            } catch (error) {
                console.error(`Error renaming ${file}:`, error);
            }
        });

    await Promise.all(renamePromises);
}

async function main() {
    try {
        const results = await replace(options);
        console.log('Replacement results:', results);
        await renamePHPFiles();
        console.log('');
        console.log('File renamed results:', renamedResults);

    } catch (error) {
        console.error('Error occurred:', error);
    }
}

main();
