

declare module Coveo.MagicBox {
    class Result {
        expression: Expression;
        input: string;
        value: string;
        subResults: Result[];
        parent: Result;
        constructor(value: string | Result[], expression: Expression, input: string);
        isSuccess(): any;
        /**
         * Return path to this result ([parent.parent, parent, this])
         */
        path(until?: Result): Result[];
        /**
         * Return the closest parent that match the condition (can be it-self). If match is a string, it will search for the result expresion id
         */
        findParent(match: string | {
            (result: Result): boolean;
        }): Result;
        /**
         * Return the first child that match the condition (can be it-self). If match is a string, it will search for the result expresion id
         */
        find(match: string | {
            (result: Result): boolean;
        }): Result;
        /**
        * Return all children that match the condition (can be it-self). If match is a string, it will search for the result expresion id
        */
        findAll(match: string | {
            (result: Result): boolean;
        }): Result[];
        /**
         * Return the first child that match the condition (can be it-self). If match is a string, it will search for the result expresion id
         */
        resultAt(index: number, match?: string | {
            (result: Result): boolean;
        }): Result[];
        /**
        * Return all fail result.
        */
        getExpect(): Result[];
        /**
        * Return the best fail result (The farthest result who got parsed). We also remove duplicate and always return the simplest result of a kind
        */
        getBestExpect(): Result[];
        getHumanReadableExpect(): string;
        /**
         * Return a string that represent what is before this result
         */
        before(): string;
        /**
         * Return a string that represent what is after this result
         */
        after(): string;
        /**
         * Return the length of the result
         */
        getLength(): any;
        toHtmlElement(): HTMLElement;
        /**
         * Clean the result to have the most relevant result. If the result is successful just return a clone of it.
         */
        clean(path?: Result[]): Result;
        clone(): Result;
        toString(): any;
        getHumanReadable(): string;
    }
}
declare module Coveo.MagicBox {
    class EndOfInputResult extends Result {
        constructor(result: Result);
    }
}
declare module Coveo.MagicBox {
    class OptionResult extends Result {
        private result;
        expression: Expression;
        input: string;
        failAttempt: Result[];
        constructor(result: Result, expression: Expression, input: string, failAttempt: Result[]);
        /**
        * Return all fail result.
        */
        getExpect(): Result[];
        /**
         * Clean the result to have the most relevant result. If the result is successful just return a clone of it.
         */
        clean(path?: Result[]): Result;
    }
}
declare module Coveo.MagicBox {
    class RefResult extends Result {
        private results;
        expression: Expression;
        input: string;
        failAttempt: Result;
        constructor(results: Result[], expression: Expression, input: string, lastResult: Result);
        /**
        * Return all fail result.
        */
        getExpect(): Result[];
        /**
         * Clean the result to have the most relevant result. If the result is successful just return a clone of it.
         */
        clean(path?: Result[]): Result;
    }
}
declare module Coveo.MagicBox {
    type ExpressionDef = RegExp | string | string[] | ExpressionFunctionArgument;
    interface Expression {
        id: string;
        parse: (input: string, end: boolean) => Result;
    }
}
declare module Coveo.MagicBox {
    class ExpressionConstant implements Expression {
        value: string;
        id: string;
        constructor(value: string, id: string);
        parse(input: string, end: boolean): Result;
        toString(): string;
    }
}
declare module Coveo.MagicBox {
    var ExpressionEndOfInput: Expression;
}
declare module Coveo.MagicBox {
    interface ExpressionFunctionArgument {
        (input: string, end: boolean, expression: Expression): Result;
    }
    class ExpressionFunction implements Expression {
        func: ExpressionFunctionArgument;
        id: string;
        grammar: Grammar;
        constructor(func: ExpressionFunctionArgument, id: string, grammar: Grammar);
        parse(input: string, end: boolean): Result;
        toString(): string;
    }
}
declare module Coveo.MagicBox {
    class ExpressionList implements Expression {
        private parts;
        id: string;
        constructor(parts: Expression[], id: string);
        parse(input: string, end: boolean): Result;
        toString(): string;
    }
}
declare module Coveo.MagicBox {
    class ExpressionOptions implements Expression {
        parts: ExpressionRef[];
        id: string;
        constructor(parts: ExpressionRef[], id: string);
        parse(input: string, end: boolean): Result;
        toString(): string;
    }
}
declare module Coveo.MagicBox {
    class ExpressionRef implements Expression {
        ref: string;
        occurrence: string | number;
        id: string;
        grammar: Grammar;
        constructor(ref: string, occurrence: string | number, id: string, grammar: Grammar);
        parse(input: string, end: boolean): Result;
        parseOnce(input: string, end: boolean, ref: Expression): Result;
        parseMany(input: string, end: boolean, ref: Expression): RefResult;
        toString(): string;
    }
}
declare module Coveo.MagicBox {
    class ExpressionRegExp implements Expression {
        value: RegExp;
        id: string;
        constructor(value: RegExp, id: string, grammar: Grammar);
        parse(input: string, end: boolean): Result;
        toString(): string;
    }
}
declare module Coveo.MagicBox {
    class Grammar {
        start: ExpressionRef;
        expressions: {
            [id: string]: Expression;
        };
        constructor(start: string, expressions?: {
            [id: string]: ExpressionDef;
        });
        addExpressions(expressions: {
            [id: string]: ExpressionDef;
        }): void;
        addExpression(id: string, basicExpression: ExpressionDef): void;
        getExpression(id: string): Expression;
        parse(value: string): Result;
        static buildExpression(value: ExpressionDef, id: string, grammar: Grammar): Expression;
        static buildStringExpression(value: string, id: string, grammar: Grammar): Expression;
        static stringMatch(str: string, re: RegExp): string[][];
        static spliter: RegExp;
    }
}
declare module Coveo.MagicBox {
    class InputManager {
        private element;
        private onchange;
        private magicBox;
        private input;
        private clear;
        private underlay;
        private highlightContainer;
        private ghostTextContainer;
        private result;
        private wordCompletion;
        private hasFocus;
        /**
        * Binding event
        */
        onblur: () => void;
        onfocus: () => void;
        onkeyup: (key: number) => boolean;
        onkeydown: (key: number) => boolean;
        onchangecursor: () => void;
        ontabpress: () => void;
        constructor(element: HTMLElement, onchange: (text: string, wordCompletion: boolean) => void, magicBox: Instance);
        /**
        * Update the input with the result value
        */
        private updateInput();
        /**
        * Update the highlight with the result value
        */
        private updateHighlight();
        /**
        * Update the ghostText with the wordCompletion
        */
        private updateWordCompletion();
        /**
        * Update the scroll of the underlay this allowed the highlight to match the text
        */
        private updateScrollDefer;
        private updateScroll(defer?);
        /**
        * Set the result and update visual if needed
        */
        setResult(result: Result, wordCompletion?: string): void;
        /**
        * Set the word completion. will be ignore if the word completion do not start with the result input
        */
        setWordCompletion(wordCompletion: string): void;
        /**
        * Set cursor position
        */
        setCursor(index: number): void;
        getCursor(): number;
        private setupHandler();
        focus(): void;
        blur(): void;
        private keydown(e);
        private keyup(e);
        private tabPress();
        private onInputChange();
        getValue(): string;
        getWordCompletion(): string;
    }
}
declare module Coveo.MagicBox {
    interface Suggestion {
        text?: string;
        index?: number;
        html?: string;
        dom?: HTMLElement;
        separator?: string;
        onSelect?: () => void;
    }
    interface SuggestionsManagerOptions {
        selectableClass?: string;
        selectedClass?: string;
        timeout?: number;
    }
    class SuggestionsManager {
        private element;
        private pendingSuggestion;
        private options;
        hasSuggestions: boolean;
        constructor(element: HTMLElement, options?: SuggestionsManagerOptions);
        moveDown(): Suggestion;
        moveUp(): Suggestion;
        select(): HTMLElement;
        mergeSuggestions(suggestions: Array<Promise<Suggestion[]> | Suggestion[]>, callback?: (suggestions: Suggestion[]) => void): void;
        updateSuggestions(suggestions: Suggestion[]): void;
    }
}
declare module Coveo.MagicBox.Utils {
    function highlightText(text: string, highligth: string, ignoreCase?: boolean, matchClass?: string, doNotMatchClass?: string): string;
    /**
     * This is essentially an helper class for dom manipulation.<br/>
     * This is intended to provide some basic functionality normally offered by jQuery.<br/>
     * To minimize the multiple jQuery conflict we have while integrating in various system, we implemented the very small subset that the framework need.<br/>
     * See {@link $$}, which is a function that wraps this class constructor, for less verbose code.
     */
    class Dom {
        el: HTMLElement;
        private static CLASS_NAME_REGEX;
        private static ONLY_WHITE_SPACE_REGEX;
        /**
         * Create a new Dom object with the given HTMLElement
         * @param el The HTMLElement to wrap in a Dom object
         */
        constructor(el: HTMLElement);
        private static handlers;
        /**
         * Get or set the text content of the HTMLElement.<br/>
         * @param txt Optional. If given, this will set the text content of the element. If not, will return the text content.
         * @returns {string}
         */
        text(txt?: string): string;
        /**
         * Performant way to transform a NodeList to an array of HTMLElement, for manipulation<br/>
         * http://jsperf.com/nodelist-to-array/72
         * @param nodeList a {NodeList} to convert to an array
         * @returns {HTMLElement[]}
         */
        nodeListToArray(nodeList: NodeList): HTMLElement[];
        /**
         * Empty (remove all child) from the element;
         */
        empty(): void;
        /**
         * Show the element;
         */
        show(): void;
        /**
         * Hide the element;
         */
        hide(): void;
        /**
         * Toggle the element visibility.<br/>
         * Optional visible parameter, if specified will set the element visibility
         * @param visible Optional parameter to display or hide the element
         */
        toggle(visible?: boolean): void;
        /**
         * Find a child element, given a CSS selector<br/>
         * @param selector A CSS selector, can be a .className or #id
         * @returns {HTMLElement}
         */
        find(selector: string): HTMLElement;
        /**
         * Check if the element match the selector.<br/>
         * The selector can be a class, an id or a tag.<br/>
         * Eg : .is('.foo') or .is('#foo') or .is('div').
         */
        is(selector: string): boolean;
        /**
         * Get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.<br/>
         * Stops at the body of the document
         * @param selector A CSS selector, a classname
         */
        closest(selector: string): HTMLElement;
        /**
         * Find all child that match the given CSS selector<br/>
         * @param selector A CSS selector, can be a .className
         * @returns {HTMLElement[]}
         */
        findAll(selector: string): HTMLElement[];
        /**
         * Find the child elements using a className
         * @param className Class of the childs elements to find
         * @returns {HTMLElement[]}
         */
        findClass(className: string): HTMLElement[];
        /**
         * Find an element using an ID
         * @param id ID of the element to find
         * @returns {HTMLElement}
         */
        findId(id: string): HTMLElement;
        /**
         * Add a class to the element. Takes care of not adding the same class if the element already has it.
         * @param className Classname to add to the element
         */
        addClass(className: string): void;
        /**
         * Remove the class on the element. Works even if the element does not possess the class.
         * @param className Classname to remove on the the element
         */
        removeClass(className: string): void;
        toggleClass(className: string, toggle: boolean): void;
        /**
         * Return an array with all the classname on the element. Empty array if the element has not classname
         * @returns {any|Array}
         */
        getClass(): string[];
        /**
         * Check if the element has the given class name
         * @param className Classname to verify
         * @returns {boolean}
         */
        hasClass(className: string): boolean;
        /**
         * Detach the element from the DOM.
         */
        detach(): void;
        /**
         * Bind an event handler on the element. Accepts either one (a string) or multiple (Array<String>) event type.<br/>
         * @param types The {string} or {Array<String>} of types on which to bind an event handler
         * @param eventHandle The function to execute when the event is triggered
         */
        on(types: string[], eventHandle: (evt: Event, data: any) => void): any;
        on(type: string, eventHandle: (evt: Event, data: any) => void): any;
        /**
         * Bind an event handler on the element. Accepts either one (a string) or multiple (Array<String>) event type.<br/>
         * The event handler will execute only ONE time.
         * @param types The {string} or {Array<String>} of types on which to bind an event handler
         * @param eventHandle The function to execute when the event is triggered
         */
        one(types: string[], eventHandle: (evt: Event) => void): any;
        one(type: string, eventHandle: (evt: Event) => void): any;
        /**
         * Remove an event handler on the element. Accepts either one (a string) or multiple (Array<String>) event type.<br/>
         * @param types The {string} or {Array<String>} of types on which to remove an event handler
         * @param eventHandle The function to remove on the element
         */
        off(types: string[], eventHandle: (evt: Event, arg?: any) => void): any;
        off(type: string, eventHandle: (evt: Event, arg?: any) => void): any;
        /**
         * Trigger an event on the element.
         * @param type The event type to trigger
         * @param data
         */
        trigger(type: string, data?: {
            [key: string]: any;
        }): void;
        /**
         * Check if the element is "empty" (has no innerHTML content). Whitespace is considered empty</br>
         * @returns {boolean}
         */
        isEmpty(): boolean;
        /**
         * Check if the element is a descendant of parent
         * @param other
         */
        isDescendant(parent: HTMLElement): boolean;
        private getJQuery();
    }
}
declare module Coveo.MagicBox {
    /**
     * Convenience wrapper for the {@link Dom} class. Used to do $$(element)
     * @param el HTMLElement to wrap
     */
    var $$: (el: HTMLElement) => Utils.Dom;
}
declare module Coveo.MagicBox.Grammars {
    interface SubGrammar {
        grammars?: {
            [id: string]: ExpressionDef;
        };
        expressions?: string[];
        basicExpressions?: string[];
        include?: SubGrammar[];
    }
    function Expressions(...subGrammars: SubGrammar[]): {
        start: string;
        expressions: {
            [id: string]: ExpressionDef;
        };
    };
    function ExpressionsGrammar(...subGrammars: SubGrammar[]): Grammar;
}
declare module Coveo.MagicBox.Grammars {
    var notWordStart: string;
    var notInWord: string;
    var Basic: SubGrammar;
}
declare module Coveo.MagicBox.Grammars {
    var SubExpression: SubGrammar;
}
declare module Coveo.MagicBox.Grammars {
    var Date: SubGrammar;
}
declare module Coveo.MagicBox.Grammars {
    var Field: SubGrammar;
}
declare module Coveo.MagicBox.Grammars {
    var QueryExtension: SubGrammar;
}
declare module Coveo.MagicBox.Grammars {
    var NestedQuery: SubGrammar;
}
declare module Coveo.MagicBox.Grammars {
    var Complete: SubGrammar;
}
declare module Coveo.MagicBox {
    interface Options {
        inline?: boolean;
        selectableSuggestionClass?: string;
        selectedSuggestionClass?: string;
        suggestionTimeout?: number;
    }
    class Instance {
        element: HTMLElement;
        grammar: Grammar;
        options: Options;
        onblur: () => void;
        onfocus: () => void;
        onchange: () => void;
        onsuggestions: (suggestions: Suggestion[]) => void;
        onsubmit: () => void;
        onselect: (suggestion: Suggestion) => void;
        onclear: () => void;
        onmove: () => void;
        ontabpress: () => void;
        getSuggestions: () => Array<Promise<Suggestion[]> | Suggestion[]>;
        private inputManager;
        private suggestionsManager;
        private clearDom;
        private lastSuggestions;
        private result;
        private displayedResult;
        constructor(element: HTMLElement, grammar: Grammar, options?: Options);
        getResult(): Result;
        getDisplayedResult(): Result;
        setText(text: string): void;
        setCursor(index: number): void;
        getCursor(): number;
        resultAtCursor(match?: string | {
            (result: Result): boolean;
        }): Result[];
        private setupHandler();
        showSuggestion(): void;
        private updateSuggestion(suggestions);
        focus(): void;
        blur(): void;
        clearSuggestion(): void;
        private focusOnSuggestion(suggestion);
        private getFirstSuggestionText();
        getText(): string;
        getWordCompletion(): string;
        clear(): void;
        hasSuggestions(): boolean;
    }
    function create(element: HTMLElement, grammar: Grammar, options?: Options): Instance;
    function requestAnimationFrame(callback: () => void): number;
}
