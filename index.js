const core = require('@actions/core');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

async function getOutdated () {

    try {
        console.log("debug", core.isDebug());
        const path = core.getInput('path');
        core.isDebug() && console.log("parsing package.json at: " + path + "/package.json");
        const output = await exec('npm outdated --json || true')
        core.isDebug() && console.log("output of npm outdated: " + output.stdout );
        core.isDebug() && console.log("error of npm outdated: " + output.stderr );

        const excludeList_data = core.getInput('exclude-list');
        const excludeList = excludeList_data.split(",").map(item => item.trim());
        const o_data = JSON.parse(output.stdout.trim());

        const outdated = Object.entries(o_data).filter(item => {
            if (excludeList.includes(item[0])) {
                console.log("Excluding " + item[0] + " from the list of outdated packages.");
                return false;
            }
            return true;
        }).map(([name, { current, wanted, latest }]) => {
            return [name, current, latest];
        });
        if (outdated.length > 0) {
            core.setFailed("These packages are outdated: " + JSON.stringify(outdated));
            const header = [
                {data: "Name", header: true},
                {data: "Current", header: true},
                {data: "Latest", header: true},
            ]
            await core.summary
                .addHeading('Outdated packages :broom:')
                .addTable([header, ...outdated])
                .write()
        } else {
            console.log("Everything is up to date. Enjoy!");
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

getOutdated();
