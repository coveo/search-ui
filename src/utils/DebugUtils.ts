import { $$ } from './Dom';

export function actionButton(text: string, callback: () => any) {
  let btn = $$('button', { type: 'button' }, text);
  btn.on('click', callback());
  return btn.el;
}
