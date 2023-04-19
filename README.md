# os-command-kit

## Cross-platform basic commands working with Node.js

---

## Installation

```bash
    npm install darco2903-os-command-kit --save-dev
```

## Commands

### Remove files and directories

```bash
    npx rm [options] <file|directory|expression>
```

> Supported expressions: **`"path/*"`** | **`"path/file*"`** | **`"path/*.ext"`**

> :warning: if using expression you must use quotes to avoid shell expansion

| Option | Description   |
| ------ | ------------- |
| `-h`   | Print help    |
| `-v`   | Print version |
| `-s`   | Silent mode   |
