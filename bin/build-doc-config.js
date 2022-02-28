#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

const args = process.argv;
const pathRes = path.resolve();

main();

async function main() {

    // Light check for root project
    const readdir = await fs.readdir(pathRes);
    if (readdir.indexOf('node_modules') === -1) {
        return console.log("Please run this command from the npm project root")
    }

    if (!args[2] || !args[3]) {
        return console.log("Requires atleast 2 parameters. Example: `npx build-doc-config <package_title> <githubURL> <readmeFileName || empty for 'README.MD'>");
    }

    const docName = args[2];
    const githubURL = args[3];
    const readmeFilename = typeof args[4] !== "undefined" ? ("'./" + args[4]) : "./README.md";

    console.log(docName, githubURL, readmeFilename)

    const configFile = {
        "source": {
            "include": [
                "src"
            ],
            "includePattern": ".js$",
            "excludePattern": "(node_modules/|docs)"
        },
        "opts": {
            "destination": "./docs/",
            "readme": readmeFilename,
            "recurse": true,
            "template": "node_modules/mad-doc-template",
            "tutorials": "./tutorials"
        },
        "tags": {
            "allowUnknownTags": [
                "category",
                "subcategory"
            ]
        },
        "plugins": [
            "./node_modules/mad-doc-template/category",
            "plugins/markdown"
        ],
        "templates": {
            "search": true,
            "default": {
                "staticFiles": {
                    "include": [
                        "./node_modules/mad-doc-template/doc-statics"
                    ]
                }
            },
            "better-docs": {
                "name": docName,
                "logo": "images/logo.png",
                "title": docName,
                "css": "style.css",
                "hideGenerator": false,
                "navLinks": [
                    {
                        "label": "Github",
                        "href": githubURL
                    }
                ]
            }
        }
    }

    await fs.writeFile(pathRes + "/jsdoc.json", JSON.stringify(configFile, false, 2))
    console.log("JS-DOC config file written to project root as jsdoc.json.")

}
