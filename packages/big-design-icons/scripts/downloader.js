const { join } = require('path');
const { outputFile, pathExists } = require('fs-extra');
const fetch = require('node-fetch');
const inquirer = require('inquirer');
const inquirerAutocomplete = require('inquirer-autocomplete-prompt');

inquirer.registerPrompt('autocomplete', inquirerAutocomplete);

const DEST_PATH = join(__dirname, '..', 'svgs', 'material');

async function downloadIcon(icon) {
  console.log(`Downloading icon: ${icon.name}`);

  const response = await fetch(
    `https://fonts.gstatic.com/s/i/materialiconsround/${icon.name}/v${icon.version}/24px.svg`,
  );

  if (response.status !== 200) {
    throw new Error(`Error status: ${response.status}`);
  }

  const fileContent = await response.text();

  await outputFile(join(DEST_PATH, `${icon.name}.svg`), fileContent);
}

function iconExists(icon) {
  const iconFilePath = join(DEST_PATH, `${icon.name}.svg`);

  return pathExists(iconFilePath);
}

async function fetchIconList() {
  const response = await fetch('https://fonts.google.com/metadata/icons');
  const text = await response.text();
  const { icons } = JSON.parse(text.replace(")]}'", ''));

  return icons;
}

(async () => {
  const iconList = await fetchIconList();
  const { icon } = await inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'icon',
      message: 'Select an icon to download',
      source: (_answersSoFar, input = '') =>
        Promise.resolve(
          iconList
            .filter(icon => icon.name.startsWith(input))
            .sort()
            .map(icon => ({ name: icon.name, value: icon })),
        ),
    },
  ]);

  const iconAlreadyExists = await iconExists(icon);

  if (iconAlreadyExists) {
    console.log(`Icon "${icon.name}" already exists.`);
  } else {
    await downloadIcon(icon);
  }
})();
