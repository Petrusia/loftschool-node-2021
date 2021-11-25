const fs = require("fs");
const path = require("path");

const existFolder = process.argv[2];
const newFolder = process.argv[3];
const deleteExistFolder = process.argv[4];

const sortByFileName = (existFolder, newFolder) => {
    const files = fs.readdirSync(existFolder);
    //console.log(files);

    files.forEach((item) => {
        const foldersStructure = path.join(existFolder, item);
        const state = fs.statSync(foldersStructure);

        if (state.isDirectory()) {
            sortByFileName(foldersStructure, newFolder);
        } else {
            if (!fs.existsSync(`./${newFolder}`)) {
                fs.mkdirSync(`./${newFolder}`);
            }

            if (!fs.existsSync(path.join(newFolder, item[0].toUpperCase()))) {
                fs.mkdirSync(path.join(newFolder, item[0].toUpperCase()));
            }

            fs.link(
                foldersStructure,
                path.join(newFolder, item[0].toUpperCase(), item),
                (err) => {
                    if (err) {
                        throw new Error(err);
                    }
                }
            );
        }
    });
};

const removeOldFolders = (existFolder) => {
    const files = fs.readdirSync(existFolder);

    files.forEach(async (item) => {
        const foldersStructure = path.join(existFolder, item);
        const state = fs.statSync(foldersStructure);

        if (state.isDirectory()) {
            removeOldFolders(foldersStructure);
        } else {
            fs.unlinkSync(foldersStructure);
        }
    });

    fs.rmdir(existFolder, (err) => {
        if (err) {
            console.error(err);
        }
    });
};

sortByFileName(existFolder, newFolder);

if (deleteExistFolder === "--delete") {
    removeOldFolders(existFolder);
}
