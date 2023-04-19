#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { argv, exit } = require("process");

const args = argv.slice(2);
const expression = args[0];

try {
    switch (true) {
        case !expression:
            throw "No expression provided";
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
            throw "Directory cannot contain *";
    }

    const { dir, base } = path.parse(expression);
    const verbose = args.includes("-v") ? console.log : () => {};

    if (fs.existsSync(expression)) {
        fs.rmSync(expression, { recursive: true });
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
        files.forEach((file) => {
            const filePath = path.join(dir, file);
            fs.unlinkSync(filePath);
            verbose(`${filePath}`);
        });
    }
    exit(0);
} catch (error) {
    console.error(error.toString());
    exit(1);
}
