import {route} from 'lethil';
import {thuddar} from './anchor/index.js';
import * as dictionary from './admin/dictionary.js';

const routes = route();

routes.get("",async() => '?');

routes.get('export-grammar', thuddar.update);

routes.get('export-word', dictionary.word);
routes.get('export-definition', dictionary.definition);
routes.get('export-translation', dictionary.translation);

routes.get("apple",async () => 'Did you know apple is fruit?');
routes.get("orange",async () => 'Orange is good for health');

routes.get("upgrade/:id?",
  /**
   * @param {*} req
   */
  async(req) => await import('./admin/upgrade.js').then(
    e => e.default(req)
  )
);