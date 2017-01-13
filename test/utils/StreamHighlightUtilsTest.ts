import {StreamHighlightUtils} from '../../src/utils/StreamHighlightUtils';

export function StreamHighlightUtilsTest() {
  describe('StreamHighlightUtils', () => {
    function getHighlightResultForTerm(term, group, groupTerm, cssClass = 'coveo-highlight') {
      return `<span class="${cssClass}" data-highlight-group="${group}" data-highlight-group-term="${groupTerm}">${term}</span>`;
    }

    function getHighlightResultForTermEscaped(term, group, groupTerm, cssClass = 'coveo-highlight') {
      return `<span class="${cssClass}" data-highlight-group="${group}" data-highlight-group-term="${groupTerm}">${term}</span>`;
    }

    it('should work with basics', () => {
      var toHighlight = 'a b';
      var terms: { [originalTerm: string]: string[]; } = { 'a': [], 'b': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`${getHighlightResultForTerm('a', 1, 'a')} ${getHighlightResultForTerm('b', 2, 'b')}`);
    });

    it('should allow to highlight html', ()=> {
      var toHighlight = '<div>a b</div>';
      var terms: { [originalTerm: string]: string[]; } = {'a': [], 'b': []};
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, {})).toEqual(`<div>${getHighlightResultForTerm('a', 1, 'a')} ${getHighlightResultForTerm('b', 2, 'b')}</div>`);
    });

    it('should allow to highlight html even if there is no html', ()=> {
      var toHighlight = 'a b';
      var terms: { [originalTerm: string]: string[]; } = {'a': [], 'b': []};
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, {})).toEqual(`${getHighlightResultForTerm('a', 1, 'a')} ${getHighlightResultForTerm('b', 2, 'b')}`);
    });

    it('should work with special char', () => {
      var toHighlight = ';a;';
      let terms: { [originalTerm: string]: string[]; } = { 'a': [], 'b': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`;${getHighlightResultForTerm('a', 1, 'a')};`);

      toHighlight = '___a__';
      terms = { 'a': [], 'b': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`___${getHighlightResultForTerm('a', 1, 'a')}__`);
    });

    it('should work globally in the string', () => {
      var toHighlight = 'hahaha a a a';
      var terms: { [originalTerm: string]: string[]; } = { 'a': [], 'b': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`hahaha ${getHighlightResultForTerm('a', 1, 'a')} ${getHighlightResultForTerm('a', 1, 'a') + ' ' + getHighlightResultForTerm('a', 1, 'a')}`);
    });

    it('should works correctly when terms are similar (eg: plurals)', () => {
      var toHighlight = 'tree trees';
      var terms: { [originalTerm: string]: string[]; } = { 'tree': ['trees'] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`${getHighlightResultForTerm('tree', 1, 'tree')} ${getHighlightResultForTerm('trees', 1, 'tree')}`);

      toHighlight = 'tree trees tree trees_ ;tree; .trees';
      terms = { 'tree': ['trees'] };
      var singular = getHighlightResultForTerm('tree', 1, 'tree');
      var plural = getHighlightResultForTerm('trees', 1, 'tree');

      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`${singular} ${plural} ${singular} ${plural}_ ;${singular}; .${plural}`);

      toHighlight = 'this is my friend';
      var terms2: { [originalTerm: string]: string[]; } = { 'friends': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms2, {})).toEqual('this is my friend');
    });


    it('should be case insensitive by default', () => {
      var toHighlight = 'this is my FRIEND';
      var terms: { [originalTerm: string]: string[]; } = { 'friend': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`this is my ${getHighlightResultForTerm('FRIEND', 1, 'friend')}`);

      toHighlight = 'this is my FRIEND friend Friend';
      terms = { 'friend': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`this is my ${getHighlightResultForTerm('FRIEND', 1, 'friend')} ${getHighlightResultForTerm('friend', 1, 'friend')} ${getHighlightResultForTerm('Friend', 1, 'friend')}`);
    });


    it('should allow to choose the highlight css class with an option', () => {
      var toHighlight = 'this is my friend';
      var terms: { [originalTerm: string]: string[]; } = { 'friend': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, undefined, { cssClass: 'hello-world' })).toEqual(`this is my ${getHighlightResultForTerm('friend', 1, 'friend', 'hello-world')}`);
    });

    it('should allow to change the regex flags', () => {
      var toHighlight = 'this is my Friend';
      var terms: { [originalTerm: string]: string[]; } = { 'friend': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, undefined, { regexFlags: '' })).toEqual(`this is my Friend`);


      toHighlight = 'this is my Friend friend Friend';
      terms = { 'friend': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, undefined, { regexFlags: 'i' })).toEqual(`this is my ${getHighlightResultForTerm('Friend', 1, 'friend')} friend Friend`);
    });


    it('should work with html basics', () => {
      var toHighlight = '<div>a b</div>';
      var terms: { [originalTerm: string]: string[]; } = { 'a': [], 'b': [] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, undefined)).toEqual(`<div>${getHighlightResultForTermEscaped('a', 1, 'a')} ${getHighlightResultForTermEscaped('b', 2, 'b')}</div>`);
    });


    it('should work with html and special char', () => {
      var toHighlight = '<div>;a;</div>';
      var terms: { [originalTerm: string]: string[]; } = { 'a': [], 'b': [] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, undefined)).toEqual(`<div>;${getHighlightResultForTermEscaped('a', 1, 'a')};</div>`);

      toHighlight = '<div>___a__</div>';
      terms = { 'a': [], 'b': [] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, undefined)).toEqual(`<div>___${getHighlightResultForTermEscaped('a', 1, 'a')}__</div>`);
    });

    it('should highlight html globally in the string', () => {
      var toHighlight = '<div>hahaha</div> <div>a</div> <div>a</div> <div>a</div>';
      var terms: { [originalTerm: string]: string[]; } = { 'a': [], 'b': [] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, undefined)).toEqual(`<div>hahaha</div> <div>${getHighlightResultForTermEscaped('a', 1, 'a')}</div> <div>${getHighlightResultForTermEscaped('a', 1, 'a')}</div> <div>${getHighlightResultForTermEscaped('a', 1, 'a')}</div>`);
    });


    it('should work with html when terms are similar (eg: plurals)', () => {
      var toHighlight = '<div>tree trees</div>';
      var terms: { [originalTerm: string]: string[]; } = { 'tree': ['trees'] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, undefined)).toEqual(`<div>${getHighlightResultForTermEscaped('tree', 1, 'tree')} ${getHighlightResultForTermEscaped('trees', 1, 'tree')}</div>`);

      toHighlight = '<div><div>tree trees tree</div> trees_ ;tree;<span> .trees</span></div>';
      terms = { 'tree': ['trees'] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms, undefined)).toEqual(`<div>${getHighlightResultForTermEscaped('tree', 1, 'tree')} ${getHighlightResultForTermEscaped('trees', 1, 'tree')} ${getHighlightResultForTermEscaped('tree', 1, 'tree')} ${getHighlightResultForTermEscaped('trees', 1, 'tree')}_ ;${getHighlightResultForTermEscaped('tree', 1, 'tree')}; .${getHighlightResultForTermEscaped('trees', 1, 'tree')}</div>`);

      toHighlight = '<div>this is my friend</div>';
      var terms2: { [originalTerm: string]: string[]; } = { 'friends': [] };
      expect(StreamHighlightUtils.highlightStreamHTML(toHighlight, terms2, undefined)).toEqual(`<div>this is my friend</div>`);
    });


    it('should work with multiple terms with multiple expansions', () => {
      var toHighlight = 'tree trees treetop';
      var terms: { [originalTerm: string]: string[]; } = { 'tree': ['trees', 'treetop'] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, undefined)).toEqual(`${getHighlightResultForTerm('tree', 1, 'tree')} ${getHighlightResultForTerm('trees', 1, 'tree')} ${getHighlightResultForTerm('treetop', 1, 'tree')}`);
    });

    it('should work with terms and phrases', () => {
      var toHighlight = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
      var terms: { [originalTerm: string]: string[]; } = { 'lorem': [] };
      var phrases: { [phrase: string]: { [originalTerm: string]: string[]; } } = {
        'ipsum dolor sit amet': {
          'ipsum': [],
          'dolor': [],
          'sit': [],
          'amet': []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, phrases)).toEqual(`${getHighlightResultForTerm('Lorem', 1, 'lorem')} ${getHighlightResultForTerm('ipsum dolor sit amet', 2, 'ipsum dolor sit amet')}, consectetur adipiscing elit`);
    });

    it('should work with number and point', () => {
      var toHighlight = 'Lorem ipsum 9.1.1 dolor sit amet';
      let terms: { [originalTerm: string]: string[]; } = { 'lorem': [] };
      var phrases: { [phrase: string]: { [originalTerm: string]: string[]; } } = { '9 1 1': { '9': [], '1': [] } };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, phrases)).toEqual(`${getHighlightResultForTerm('Lorem', 1, 'lorem')} ipsum ${getHighlightResultForTerm('9.1.1', 2, '9 1 1')} dolor sit amet`);

      toHighlight = 'abc.qwerty';
      terms = { 'abc': [], 'qwerty': [], 'b': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`${getHighlightResultForTerm('abc', 1, 'abc')}.${getHighlightResultForTerm('qwerty', 2, 'qwerty')}`);

      toHighlight = 'abc. qwerty';
      terms = { 'abc': [], 'qwerty': [], 'b': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`${getHighlightResultForTerm('abc', 1, 'abc')}. ${getHighlightResultForTerm('qwerty', 2, 'qwerty')}`);
    });

    it('should work with number and dash', () => {
      var toHighlight = 'Lorem ipsum 9-1-1 dolor sit amet';
      let terms: { [originalTerm: string]: string[]; } = { 'lorem': [] };
      var phrases: { [phrase: string]: { [originalTerm: string]: string[]; } } = { '9 1 1': { '9': [], '1': [] } };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, phrases)).toEqual(`${getHighlightResultForTerm('Lorem', 1, 'lorem')} ipsum ${getHighlightResultForTerm('9-1-1', 2, '9 1 1')} dolor sit amet`);

      toHighlight = 'abc-qwerty';
      terms = { 'abc': [], 'qwerty': [], 'b': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`${getHighlightResultForTerm('abc', 1, 'abc')}-${getHighlightResultForTerm('qwerty', 2, 'qwerty')}`);

      toHighlight = 'abc- qwerty';
      terms = { 'abc': [], 'qwerty': [], 'b': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`${getHighlightResultForTerm('abc', 1, 'abc')}- ${getHighlightResultForTerm('qwerty', 2, 'qwerty')}`);

      toHighlight = 'abc- qwerty. qwerty';
      terms = { 'abc': [], 'qwerty': [], 'b': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`${getHighlightResultForTerm('abc', 1, 'abc')}- ${getHighlightResultForTerm('qwerty', 2, 'qwerty')}. ${getHighlightResultForTerm('qwerty', 2, 'qwerty')}`);

      toHighlight = 'abc- qwerty- qwerty';
      terms = { 'abc': [], 'qwerty': [], 'b': [] };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, terms, {})).toEqual(`${getHighlightResultForTerm('abc', 1, 'abc')}- ${getHighlightResultForTerm('qwerty', 2, 'qwerty')}- ${getHighlightResultForTerm('qwerty', 2, 'qwerty')}`);
    });

    it('should work with parenthesis', () => {
      var toHighlight = 'Lorem (ipsum 9-1-1 dolor sit amet';
      var phrases: { [phrase: string]: { [originalTerm: string]: string[]; } } = {
        'lorem ipsum': {
          'lorem': [],
          'ipsum': []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(`${getHighlightResultForTerm('Lorem (ipsum', 1, 'lorem ipsum')} 9-1-1 dolor sit amet`);
    });

    it('should work with :', () => {
      var toHighlight = 'Lorem :ipsum 9-1-1 dolor sit amet';
      var phrases: { [phrase: string]: { [originalTerm: string]: string[]; } } = {
        'lorem ipsum': {
          'lorem': [],
          'ipsum': []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(`${getHighlightResultForTerm('Lorem :ipsum', 1, 'lorem ipsum')} 9-1-1 dolor sit amet`);
    });

    it('should work with ~', () => {
      var toHighlight = 'Lorem ~ipsum 9-1-1 dolor sit amet';
      var phrases: { [phrase: string]: { [originalTerm: string]: string[]; } } = {
        'lorem ipsum': {
          'lorem': [],
          'ipsum': []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(`${getHighlightResultForTerm('Lorem ~ipsum', 1, 'lorem ipsum')} 9-1-1 dolor sit amet`);

      toHighlight = 'Lorem~ipsum 9-1-1 dolor sit amet';
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(`${getHighlightResultForTerm('Lorem~ipsum', 1, 'lorem ipsum')} 9-1-1 dolor sit amet`);
    });

    it('should work with `', () => {
      var toHighlight = 'Lorem `ipsum 9-1-1 dolor sit amet';
      var phrases: { [phrase: string]: { [originalTerm: string]: string[]; } } = {
        'lorem ipsum': {
          'lorem': [],
          'ipsum': []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(`${getHighlightResultForTerm('Lorem &#x60;ipsum', 1, 'lorem ipsum')} 9-1-1 dolor sit amet`);
    });

    it('should work with ?', () => {
      var toHighlight = 'Lorem ipsum 9-1-1 dolor sit amet?';
      var phrases: { [phrase: string]: { [originalTerm: string]: string[]; } } = {
        'sit amet': {
          'sit': [],
          'amet': []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(`Lorem ipsum 9-1-1 dolor ${getHighlightResultForTerm('sit amet', 1, 'sit amet')}?`);
    });

    it('should work with !', () => {
      var toHighlight = 'Lorem ipsum 9-1-1 dolor sit amet!';
      var phrases: { [phrase: string]: { [originalTerm: string]: string[]; } } = {
        'sit amet': {
          'sit': [],
          'amet': []
        }
      };
      expect(StreamHighlightUtils.highlightStreamText(toHighlight, {}, phrases)).toEqual(`Lorem ipsum 9-1-1 dolor ${getHighlightResultForTerm('sit amet', 1, 'sit amet')}!`);
    });
  });
}
