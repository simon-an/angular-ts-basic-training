# TypeScript Exercises

## 1. Setup TypeScript and the first coding example

### 1.1 Install Extension tslint

### 1.2 Install TypeScript

```bash
mkdir ts-exercises
cd ts-exercises
# initialize npm package
npm init
# install TypeScript locally: npm i --save-dev typescript
# install TypeScript globally
npm install -g typescript
```

Hint: `npm i -g` installs dependencies globally so they can be used everywhere in the terminal and are added to the Windows path variable.

### 1.3 First coding example

Use `tsc` command to execute the TypeScript compiler

```bash
echo console.log('hello world') >> helloworld.ts
tsc helloworld.ts
node helloworld.js
```

Hint: You can also use the NPM package ts-node and shorten the command to execute ts files.

## 2. Your first TypeScript project

In folder ts-exercises

```bash
# initialize TypeScript project
tsc --init
mkdir src
mv helloworld.ts src
```

Set rootDir and outDir in tsconfig.json:

```json
...
"rootDir": "./src",
"outDir": "./out",
...

```

Run command `tsc` to generate helloworld.js

Run command `tsc -w` to watch the files and generate js files when something changes in the ts files.