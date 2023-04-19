const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const colors = require("console-log-colors");

const script = path.join(process.cwd(), "src/rm.js");
const runTest = "runTest";
const dir1 = "1";
const dir2 = "2";
const file = "file";
let nbErrors = 0;

function exe(...p) {
    return `node ${script} ./${path.join(...p)}`;
}

/* ------------ initialization of the test ------------ */

process.chdir(__dirname);

if (fs.existsSync(runTest)) {
    fs.rmSync(runTest, { recursive: true });
}

fs.mkdirSync(runTest);
process.chdir(runTest);

/* ---------------------------------------------------- */

/* ------------ generation of test files ------------ */

fs.writeFileSync(file, "");
fs.mkdirSync(dir1);
fs.mkdirSync(dir2);
for (let i = 0; i < 10; i++) {
    fs.writeFileSync(`./${dir1}/${i}.js`, "");
    fs.writeFileSync(`./${dir1}/${String.fromCharCode(i + 97)}.txt`, "");
    fs.writeFileSync(`./${dir2}/${String.fromCharCode(i + 97)}.txt`, "");
}

/* ----------------  TESTS  ---------------- */

/* TEST 1: delete a file */

function test1() {
    try {
        if (!fs.readdirSync(".").includes(file)) {
            throw new Error("File not exist before test");
        }
        const test = execSync(exe(file));
        if (fs.readdirSync(".").includes(file) || test.byteLength > 0) {
            throw new Error("File not deleted");
        }
        console.log(colors.green("Test 1 passed"));
    } catch (error) {
        nbErrors++;
        console.log(error.toString());
        console.log(colors.red("Test 1 failed"));
    }
}

/* ---------------------------------------------------- */

/* TEST 2: delete exp *.js  */

function test2() {
    try {
        if (!fs.readdirSync(dir1).includes("0.js")) {
            throw new Error("File not exist before test");
        }
        const test = execSync(exe(dir1, "*.js"));
        if (test.byteLength != 0 || fs.readdirSync(dir1).includes(".js")) {
            throw new Error("File not deleted");
        }
        console.log(colors.green("Test 2 passed"));
    } catch (error) {
        nbErrors++;
        console.log(error.toString());
        console.log(colors.red("Test 2 failed"));
    }
}

/* ---------------------------------------------------- */

/* TEST 3: delete exp a.txt  */

function test3() {
    try {
        if (!fs.readdirSync(dir1).includes("a.txt")) {
            throw new Error("File not exist before test");
        }
        const test = execSync(exe(dir1, "a.txt"));
        if (test.byteLength != 0 || fs.readdirSync(dir1).includes("a.txt")) {
            throw new Error("File not deleted");
        }
        console.log(colors.green("Test 3 passed"));
    } catch (error) {
        nbErrors++;
        console.log(error.toString());
        console.log(colors.red("Test 3 failed"));
    }
}

/* ---------------------------------------------------- */

/* TEST 4: delete exp b*  */

function test4() {
    try {
        if (!fs.readdirSync(dir1).includes("b.txt")) {
            throw new Error("File not exist before test");
        }
        const test = execSync(exe(dir1, "b*"));
        if (test.byteLength != 0 || fs.readdirSync(dir1).includes("b.txt")) {
            throw new Error("File not deleted");
        }
        console.log(colors.green("Test 4 passed"));
    } catch (error) {
        nbErrors++;
        console.log(error.toString());
        console.log(colors.red("Test 4 failed"));
    }
}

/* ---------------------------------------------------- */

/* TEST 5: delete exp *  */

function test5() {
    try {
        if (!fs.readdirSync(dir1).includes("c.txt")) {
            throw new Error("File not exist before test");
        }
        const test = execSync(exe(dir1, "*"));
        if (test.byteLength != 0 || fs.readdirSync(dir1).length != 0) {
            throw new Error("File not deleted");
        }
        console.log(colors.green("Test 5 passed"));
    } catch (error) {
        nbErrors++;
        console.log(error.toString());
        console.log(colors.red("Test 5 failed"));
    }
}

/* ---------------------------------------------------- */

/* TEST 6: delete empty dir  */

function test6() {
    try {
        if (fs.readdirSync(dir1).length != 0) {
            throw new Error("Directory not empty before test");
        }
        const test = execSync(exe(dir1));
        if (test.byteLength != 0 || fs.existsSync(dir1)) {
            throw new Error("Directory not deleted");
        }
        console.log(colors.green("Test 6 passed"));
    } catch (error) {
        nbErrors++;
        console.log(error.toString());
        console.log(colors.red("Test 6 failed"));
    }
}

/* ---------------------------------------------------- */

/* TEST 7: delete dir with files  */

function test7() {
    try {
        if (fs.readdirSync(dir2).length != 10) {
            throw new Error("Directory not empty before test");
        }
        const test = execSync(exe(dir2));
        if (test.byteLength != 0 || fs.existsSync(dir2)) {
            throw new Error("Directory not deleted");
        }
        console.log(colors.green("Test 7 passed"));
    } catch (error) {
        nbErrors++;
        console.log(error.toString());
        console.log(colors.red("Test 7 failed"));
    }
}

/* ---------------------------------------------------- */

/* ------------ execution of the tests ------------ */

test1();
console.log("------------------------------------");
test2();
console.log("------------------------------------");
test3();
console.log("------------------------------------");
test4();
console.log("------------------------------------");
test5();
console.log("------------------------------------");
test6();
console.log("------------------------------------");
test7();
console.log("------------------------------------");

if (nbErrors === 0) {
    console.log(colors.green("All tests passed"));
} else {
    console.log(colors.yellow(`${nbErrors} tests failed`));
}

process.chdir(__dirname);
fs.rmSync(runTest, { recursive: true });
