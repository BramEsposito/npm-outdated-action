const core = require('@actions/core');
const github = require('@actions/github');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

async function getOutdated () {

    try {
        const context = github.context;
        const path = core.getInput('path');
        context.debug && console.log("parsing package.json at: " + path + "/package.json");
        const output = await exec('npm outdated --json || true')
        context.debug && console.log("output of npm outdated: " + output.stdout );
        context.debug && console.log("error of npm outdated: " + output.stderr );

        const excludeList_data = core.getInput('exclude-list');
        const excludeList = excludeList_data.split(",").map(item => item.trim());
        const o_data = JSON.parse(output.stdout.trim());

        const outdated = Object.entries(o_data).map(([name, { current, wanted, latest }]) => {
            if (excludeList.includes(name)) {
                console.log("Excluding " + name + " from the list of outdated packages.");
                return;
            }
            return {
                name,
                current,
                wanted,
                latest
            }
        });
        if (outdated.length > 0) {
            core.setFailed("These packages are outdated: " + JSON.stringify(outdated));
        } else {
            console.log("Everything is up to date. Enjoy!");
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

getOutdated();
