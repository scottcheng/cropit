import fs from 'fs';

import options from './options';

let output = '';

['elements', 'values', 'callbacks'].forEach((k) => {
  output += `//- ${k}\n`;

  options[k].forEach((o) => {
    output += `.option#docs-options-${o.name.replace('$', '')}\n`;
    output += `  .name ${o.name}\n`;
    output += `  .type ${o.type}\n`;
    output += `  .description\n    :markdown\n      ${o.description}\n`;
    if (o.type === 'function') {
      if (o.params) {
        o.params.forEach((p) => {
          output += `  .param\n    :markdown\n      \`{${p.type}} ${p.name}\` - ${p.description}\n`;
        });
      }
    }
    else {
      if (o.type === 'string') {
        output += `  .default: code '${o.default}'\n`;
      }
      else if (Array.isArray(o.default)) {
        output += `  .default: code [${o.default}]\n`;
      }
      else {
        output += `  .default: code ${o.default}\n`;
      }
    }
  });

  output += '\n';
});

fs.writeFileSync(__dirname + '/views/_options.jade', output);
