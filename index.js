const core = require('@actions/core');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

async function getOutdated () {

    try {
        const path = core.getInput('path');
        const output = await exec('npm outdated --json || true')

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
