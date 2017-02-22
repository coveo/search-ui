import { $$ } from './Dom';

export function actionButton(text: string, callback: () => any) {
  let btn = $$('button', {}, text);
  btn.on('click', callback());
  return btn.el;
}
