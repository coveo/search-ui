import { Initialization } from '../Base/Initialization';

const fields = ['coveochatterfeedtopics'];

export function registerFields() {
  Initialization.registerComponentFields('ChatterTopic', fields);
}
