#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
var { name, version } = require("../package.json");

const args = process.argv.slice(2);
let deleted = [];

if (args.includes("-h") || args.includes("--help")) {
    console.log("Usage: npx rm [options] <expression>");
    console.log("Options:");
    console.log("  -h, --help     Show this help message");
    console.log("  -v, --version  Show version number");
    console.log("  -s, --silent   Do not show any output");
    process.exit(0);
} else if (args.includes("-v") || args.includes("--version")) {
    console.log(`${name}: v${version}`);
    process.exit(0);
} else if (args.includes("-s") || args.includes("--silent")) {
    console.log = () => {};
    console.error = () => {};
    args.splice(args.indexOf("-s"), 1);
}

const expression = args[args.length - 1] ?? "";
const { dir, base } = path.parse(expression);

try {
    switch (true) {
        case !expression:
            throw "No expression provided";
        case expression.startsWith("--"):
        case expression.startsWith("-") && !expression.length === 2:
            throw "Wrong usage";
        case !expression.startsWith("./") && !expression.startsWith(".\\"):
            throw 'Expression must start with "./"';
        case expression === ".":
        case expression === "/":
            throw "Cannot delete root directory";
        case expression === "..":
            throw "Cannot delete parent directory";
        case expression === "*":
            throw "Cannot delete all files";
        case expression.includes(" "):
            throw "Expression cannot contain spaces";
        case path.dirname(expression).includes("*"):
            throw "Directory name cannot contain *";
    }

    if (!expression.includes("*") && fs.existsSync(expression)) {
        fs.rmSync(expression, { recursive: true });
        deleted.push(expression);
    } else {
        const files = fs.readdirSync(dir).filter((file) => {
            if (base.includes("*")) {
                const [start, end] = base.split("*");
                return file.startsWith(start) && file.endsWith(end);
            }
        });
        if (files.length === 0) {
            throw "No files found";
        }

        // files.forEach((file) => {
        //     console.log(file);
        // });
        // console.log(`Are you sure you want to delete ${files.length} files?`);

        files.forEach((file) => {
            const filePath = path.join(dir, file);
            fs.rmSync(filePath, { recursive: true });
            deleted.push(filePath);
        });
    }

    console.log("Deleted files:");
    deleted.forEach((file) => {
        console.log(file);
    });

    process.exit(0);
} catch (error) {
    console.error(error.toString());
    process.exit(1);
}
