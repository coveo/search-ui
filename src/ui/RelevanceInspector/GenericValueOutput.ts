import { ITableDataSource, GenericHtmlRenderer } from './TableBuilder';
import { isArray, isObject, each } from 'underscore';
import { $$ } from '../../utils/Dom';

export type GenericValueOutputType = string | number | string[] | Record<string, any> | boolean | undefined;

const defaultNullOutput = '-- NULL --';

export class GenericValueOutput {
  public output(section: GenericValueOutputType): ITableDataSource {
    if (isArray(section)) {
      return this.arrayJoined(section);
    }
    if (isObject(section)) {
      return this.objectJoined(section as Record<string, any>);
    }

    return this.simpleValue(section as string | number | undefined);
  }

  private simpleValue(section: string | number | undefined) {
    return {
      content: this.valueOrNullOutput(section)
    };
  }

  private objectJoined(section: Record<string, any>): ITableDataSource {
    let content = '';
    each(section, (value, key) => {
      if (isArray(value)) {
        const list = $$('dl');
        list.append($$('dt', undefined, key).el);
        const innerList = $$('dd', undefined, this.arrayJoined(value).content);
        list.append(innerList.el);
        content += list.el.outerHTML;
      } else if (isObject(value)) {
        content += this.objectJoined(value).content;
      } else {
        const list = $$('dl');
        list.append($$('dt', undefined, key).el);
        list.append($$('dd', undefined, this.valueOrNullOutput(value)).el);

        content += list.el.outerHTML;
      }
    });

    return {
      content,
      cellRenderer: GenericHtmlRenderer
    };
  }

  private arrayJoined(section: string[] | undefined): ITableDataSource {
    if (!section || section.length == 0) {
      return {
        content: defaultNullOutput
      };
    }

    const list = $$('ul', {
      className: 'relevance-inspector-list-output'
    });

    section.forEach(sectionValue => {
      if (isObject(sectionValue)) {
        list.append($$('li', undefined, this.objectJoined(sectionValue as any).content).el);
      } else {
        list.append($$('li', undefined, this.valueOrNullOutput(sectionValue)).el);
      }
    });
    return {
      content: list.el.outerHTML,
      cellRenderer: GenericHtmlRenderer
    };
  }

  private valueOrNullOutput(value: any) {
    if (value != null && value !== '') {
      return value.toString();
    }
    return defaultNullOutput;
  }
}
