import { AvailableFieldsTable } from '../../../src/ui/RelevanceInspector/AvailableFieldsTable';
import { IComponentBindings } from '../../../src/ui/Base/ComponentBindings';
import { MockEnvironmentBuilder } from '../../MockEnvironment';

export function AvailableFieldsTableTest() {
  describe('AvailableFieldsTable', () => {
    let bindings: IComponentBindings;

    beforeEach(() => {
      bindings = new MockEnvironmentBuilder().build();
    });

    it('should return a top level container element', async () => {
      const built = await new AvailableFieldsTable(bindings).build();
    });
  });
}
