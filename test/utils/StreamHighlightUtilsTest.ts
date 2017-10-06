import { StreamHighlightUtils } from '../../src/utils/StreamHighlightUtils';

export function StreamHighlightUtilsTest() {
  describe('StreamHighlightUtils', () => {
    function getHighlightResultForTerm(term, group, groupTerm, cssClass = 'coveo-highlight') {
      return `<span class="${cssClass}" data-highlight-group="${group}" data-highlight-group-term="${groupTerm}">${term}</span>`;
    }

    function getHighlightResultForTermEscaped(term, group, groupTerm, cssClass = 'coveo-highlight') {
      return `<span class="${cssClass}" data-highlight-group="${group}" data-highlight-group-term="${groupTerm}">${term}</span>`;
    }

    it('should work with basics', () => {
      const toHighlight = 'a b';
      const terms: { [originalTerm: string]: string[] } = { a: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(
        `${getHighlightResultForTerm('a', 1, 'a')} ${getHighlightResultForTerm('b', 2, 'b')}`
      );
    });

    it('should allow to highlight html', () => {
      const toHighlight = '<div>a b</div>';
      const terms: { [originalTerm: string]: string[] } = { a: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, {})).toEqual(
        `<div>${getHighlightResultForTerm('a', 1, 'a')} ${getHighlightResultForTerm('b', 2, 'b')}</div>`
      );
    });

    it('should allow to highlight html even if there is no html', () => {
      const toHighlight = 'a b';
      const terms: { [originalTerm: string]: string[] } = { a: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, {})).toEqual(
        `${getHighlightResultForTerm('a', 1, 'a')} ${getHighlightResultForTerm('b', 2, 'b')}`
      );
    });

    it('should work with special char', () => {
      let toHighlight = ';a;';
      let terms: { [originalTerm: string]: string[] } = { a: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`;${getHighlightResultForTerm('a', 1, 'a')};`);

      toHighlight = '___a__';
      terms = { a: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`___${getHighlightResultForTerm('a', 1, 'a')}__`);
    });

    it('should work globally in the string', () => {
      const toHighlight = 'hahaha a a a';
      const terms: { [originalTerm: string]: string[] } = { a: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(
        `hahaha ${getHighlightResultForTerm('a', 1, 'a')} ${getHighlightResultForTerm('a', 1, 'a') +
          ' ' +
          getHighlightResultForTerm('a', 1, 'a')}`
      );
    });

    it('should works correctly when terms are similar (eg: plurals)', () => {
      let toHighlight = 'tree trees';
      let terms: { [originalTerm: string]: string[] } = { tree: ['trees'] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(
        `${getHighlightResultForTerm('tree', 1, 'tree')} ${getHighlightResultForTerm('trees', 1, 'tree')}`
      );

      toHighlight = 'tree trees tree trees_ ;tree; .trees';
      terms = { tree: ['trees'] };
      const singular = getHighlightResultForTerm('tree', 1, 'tree');
      const plural = getHighlightResultForTerm('trees', 1, 'tree');

      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(
        `${singular} ${plural} ${singular} ${plural}_ ;${singular}; .${plural}`
      );

      toHighlight = 'this is my friend';
      const terms2: { [originalTerm: string]: string[] } = { friends: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms2, {})).toEqual('this is my friend');
    });

    it('should be case insensitive by default', () => {
      let toHighlight = 'this is my FRIEND';
      let terms: { [originalTerm: string]: string[] } = { friend: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(
        `this is my ${getHighlightResultForTerm('FRIEND', 1, 'friend')}`
      );

      toHighlight = 'this is my FRIEND friend Friend';
      terms = { friend: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(
        `this is my ${getHighlightResultForTerm('FRIEND', 1, 'friend')} ${getHighlightResultForTerm(
          'friend',
          1,
          'friend'
        )} ${getHighlightResultForTerm('Friend', 1, 'friend')}`
      );
    });

    it('should allow to choose the highlight css class with an option', () => {
      const toHighlight = 'this is my friend';
      const terms: { [originalTerm: string]: string[] } = { friend: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, undefined, { cssClass: 'hello-world' })).toEqual(
        `this is my ${getHighlightResultForTerm('friend', 1, 'friend', 'hello-world')}`
      );
    });

    it('should allow to change the regex flags', () => {
      let toHighlight = 'this is my Friend';
      let terms: { [originalTerm: string]: string[] } = { friend: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, undefined, { regexFlags: '' })).toEqual(`this is my Friend`);

      toHighlight = 'this is my Friend friend Friend';
      terms = { friend: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, undefined, { regexFlags: 'i' })).toEqual(
        `this is my ${getHighlightResultForTerm('Friend', 1, 'friend')} friend Friend`
      );
    });

    it('should work with html basics', () => {
      const toHighlight = '<div>a b</div>';
      const terms: { [originalTerm: string]: string[] } = { a: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, undefined)).toEqual(
        `<div>${getHighlightResultForTermEscaped('a', 1, 'a')} ${getHighlightResultForTermEscaped('b', 2, 'b')}</div>`
      );
    });

    it('should work with html and special char', () => {
      let toHighlight = '<div>;a;</div>';
      let terms: { [originalTerm: string]: string[] } = { a: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, undefined)).toEqual(
        `<div>;${getHighlightResultForTermEscaped('a', 1, 'a')};</div>`
      );

      toHighlight = '<div>___a__</div>';
      terms = { a: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, undefined)).toEqual(
        `<div>___${getHighlightResultForTermEscaped('a', 1, 'a')}__</div>`
      );
    });

    it('should highlight html globally in the string', () => {
      const toHighlight = '<div>hahaha</div> <div>a</div> <div>a</div> <div>a</div>';
      const terms: { [originalTerm: string]: string[] } = { a: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, undefined)).toEqual(
        `<div>hahaha</div> <div>${getHighlightResultForTermEscaped('a', 1, 'a')}</div> <div>${getHighlightResultForTermEscaped(
          'a',
          1,
          'a'
        )}</div> <div>${getHighlightResultForTermEscaped('a', 1, 'a')}</div>`
      );
    });

    it('should work with html when terms are similar (eg: plurals)', () => {
      let toHighlight = '<div>tree trees</div>';
      let terms: { [originalTerm: string]: string[] } = { tree: ['trees'] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, undefined)).toEqual(
        `<div>${getHighlightResultForTermEscaped('tree', 1, 'tree')} ${getHighlightResultForTermEscaped('trees', 1, 'tree')}</div>`
      );

      toHighlight = '<div><div>tree trees tree</div> trees_ ;tree;<span> .trees</span></div>';
      terms = { tree: ['trees'] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, undefined)).toEqual(
        `<div>${getHighlightResultForTermEscaped('tree', 1, 'tree')} ${getHighlightResultForTermEscaped(
          'trees',
          1,
          'tree'
        )} ${getHighlightResultForTermEscaped('tree', 1, 'tree')} ${getHighlightResultForTermEscaped(
          'trees',
          1,
          'tree'
        )}_ ;${getHighlightResultForTermEscaped('tree', 1, 'tree')}; .${getHighlightResultForTermEscaped('trees', 1, 'tree')}</div>`
      );

      toHighlight = '<div>this is my friend</div>';
      const terms2: { [originalTerm: string]: string[] } = { friends: [] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms2, undefined)).toEqual(`<div>this is my friend</div>`);
    });

    it('should work with multiple terms with multiple expansions', () => {
      const toHighlight = 'tree trees treetop';
      const terms: { [originalTerm: string]: string[] } = { tree: ['trees', 'treetop'] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, undefined)).toEqual(
        `${getHighlightResultForTerm('tree', 1, 'tree')} ${getHighlightResultForTerm('trees', 1, 'tree')} ${getHighlightResultForTerm(
          'treetop',
          1,
          'tree'
        )}`
      );
    });

    it('should work with terms and phrases', () => {
      const toHighlight = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
      const terms: { [originalTerm: string]: string[] } = { lorem: [] };
      const phrases: { [phrase: string]: { [originalTerm: string]: string[] } } = {
        'ipsum dolor sit amet': {
          ipsum: [],
          dolor: [],
          sit: [],
          amet: []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, phrases)).toEqual(
        `${getHighlightResultForTerm('Lorem', 1, 'lorem')} ${getHighlightResultForTerm(
          'ipsum dolor sit amet',
          2,
          'ipsum dolor sit amet'
        )}, consectetur adipiscing elit`
      );
    });

    it('should work with number and point', () => {
      const phrases: { [phrase: string]: { [originalTerm: string]: string[] } } = { '9 1 1': { '9': [], '1': [] } };
      let toHighlight = 'Lorem ipsum 9.1.1 dolor sit amet';
      let terms: { [originalTerm: string]: string[] } = { lorem: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, phrases)).toEqual(
        `${getHighlightResultForTerm('Lorem', 1, 'lorem')} ipsum ${getHighlightResultForTerm('9.1.1', 2, '9 1 1')} dolor sit amet`
      );

      toHighlight = 'abc.qwerty';
      terms = { abc: [], qwerty: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(
        `${getHighlightResultForTerm('abc', 1, 'abc')}.${getHighlightResultForTerm('qwerty', 2, 'qwerty')}`
      );

      toHighlight = 'abc. qwerty';
      terms = { abc: [], qwerty: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(
        `${getHighlightResultForTerm('abc', 1, 'abc')}. ${getHighlightResultForTerm('qwerty', 2, 'qwerty')}`
      );
    });

    it('should work with regex sensitive character', () => {
      const toHighlight = 'Lorem ipsum 9.1.1 dolor *amet*';
      const terms: { [originalTerm: string]: string[] } = { '*amet*': [] };
      const phrases: { [phrase: string]: { [originalTerm: string]: string[] } } = {};
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, phrases)).toEqual(
        `Lorem ipsum 9.1.1 dolor ${getHighlightResultForTerm('*amet*', 1, '*amet*')}`
      );
    });

    it('should work with number and dash', () => {
      const phrases: { [phrase: string]: { [originalTerm: string]: string[] } } = { '9 1 1': { '9': [], '1': [] } };
      let toHighlight = 'Lorem ipsum 9-1-1 dolor sit amet';
      let terms: { [originalTerm: string]: string[] } = { lorem: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, phrases)).toEqual(
        `${getHighlightResultForTerm('Lorem', 1, 'lorem')} ipsum ${getHighlightResultForTerm('9-1-1', 2, '9 1 1')} dolor sit amet`
      );

      toHighlight = 'abc-qwerty';
      terms = { abc: [], qwerty: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(
        `${getHighlightResultForTerm('abc', 1, 'abc')}-${getHighlightResultForTerm('qwerty', 2, 'qwerty')}`
      );

      toHighlight = 'abc- qwerty';
      terms = { abc: [], qwerty: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(
        `${getHighlightResultForTerm('abc', 1, 'abc')}- ${getHighlightResultForTerm('qwerty', 2, 'qwerty')}`
      );

      toHighlight = 'abc- qwerty. qwerty';
      terms = { abc: [], qwerty: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(
        `${getHighlightResultForTerm('abc', 1, 'abc')}- ${getHighlightResultForTerm('qwerty', 2, 'qwerty')}. ${getHighlightResultForTerm(
          'qwerty',
          2,
          'qwerty'
        )}`
      );

      toHighlight = 'abc- qwerty- qwerty';
      terms = { abc: [], qwerty: [], b: [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(
        `${getHighlightResultForTerm('abc', 1, 'abc')}- ${getHighlightResultForTerm('qwerty', 2, 'qwerty')}- ${getHighlightResultForTerm(
          'qwerty',
          2,
          'qwerty'
        )}`
      );
    });

    it('should work with parenthesis', () => {
      const toHighlight = 'Lorem (ipsum 9-1-1 dolor sit amet';
      const phrases: { [phrase: string]: { [originalTerm: string]: string[] } } = {
        'lorem ipsum': {
          lorem: [],
          ipsum: []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(
        `${getHighlightResultForTerm('Lorem (ipsum', 1, 'lorem ipsum')} 9-1-1 dolor sit amet`
      );
    });

    it('should work with :', () => {
      const toHighlight = 'Lorem :ipsum 9-1-1 dolor sit amet';
      const phrases: { [phrase: string]: { [originalTerm: string]: string[] } } = {
        'lorem ipsum': {
          lorem: [],
          ipsum: []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(
        `${getHighlightResultForTerm('Lorem :ipsum', 1, 'lorem ipsum')} 9-1-1 dolor sit amet`
      );
    });

    it('should work with ~', () => {
      const phrases: { [phrase: string]: { [originalTerm: string]: string[] } } = {
        'lorem ipsum': {
          lorem: [],
          ipsum: []
        }
      };
      let toHighlight = 'Lorem ~ipsum 9-1-1 dolor sit amet';
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(
        `${getHighlightResultForTerm('Lorem ~ipsum', 1, 'lorem ipsum')} 9-1-1 dolor sit amet`
      );

      toHighlight = 'Lorem~ipsum 9-1-1 dolor sit amet';
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(
        `${getHighlightResultForTerm('Lorem~ipsum', 1, 'lorem ipsum')} 9-1-1 dolor sit amet`
      );
    });

    it('should work with `', () => {
      const toHighlight = 'Lorem `ipsum 9-1-1 dolor sit amet';
      const phrases: { [phrase: string]: { [originalTerm: string]: string[] } } = {
        'lorem ipsum': {
          lorem: [],
          ipsum: []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(
        `${getHighlightResultForTerm('Lorem &#x60;ipsum', 1, 'lorem ipsum')} 9-1-1 dolor sit amet`
      );
    });

    it('should work with ?', () => {
      const toHighlight = 'Lorem ipsum 9-1-1 dolor sit amet?';
      const phrases: { [phrase: string]: { [originalTerm: string]: string[] } } = {
        'sit amet': {
          sit: [],
          amet: []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(
        `Lorem ipsum 9-1-1 dolor ${getHighlightResultForTerm('sit amet', 1, 'sit amet')}?`
      );
    });

    it('should work with !', () => {
      const toHighlight = 'Lorem ipsum 9-1-1 dolor sit amet!';
      const phrases: { [phrase: string]: { [originalTerm: string]: string[] } } = {
        'sit amet': {
          sit: [],
          amet: []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(
        `Lorem ipsum 9-1-1 dolor ${getHighlightResultForTerm('sit amet', 1, 'sit amet')}!`
      );
    });

    it('should work with &', () => {
      const toHighlight = 'Lorem ipsum 9-1-1 dolor sit&amet';
      const phrases: { [phrase: string]: { [originalTerm: string]: string[] } } = {
        'sit amet': {
          sit: [],
          amet: []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(
        `Lorem ipsum 9-1-1 dolor ${getHighlightResultForTerm('sit&amp;amet', 1, 'sit amet')}`
      );
    });
    it('should work with +', () => {
      const toHighlight = 'Lorem ipsum 9-1-1 dolor sit+amet';
      const phrases: { [phrase: string]: { [originalTerm: string]: string[] } } = {
        'sit amet': {
          sit: [],
          amet: []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(
        `Lorem ipsum 9-1-1 dolor ${getHighlightResultForTerm('sit+amet', 1, 'sit amet')}`
      );
    });
  });
}
