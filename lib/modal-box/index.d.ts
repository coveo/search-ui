declare module Coveo.ModalBox {
    /**
     * The button to use when creating a ModalBox
     */
    enum BUTTON {
        OK = 1,
        APPLY = 2,
        YES = 4,
        NO = 8,
        CANCEL = 16,
    }
    /**
     * Content of a ModalBox
     */
    interface ModalBox {
        /**
         * The modalBox container itself
         */
        modalBox: HTMLElement;
        /**
         * The overlay added on the body, which can be clicked to close the modalbox
         */
        overlay: HTMLElement;
        /**
         * The wrapper of the content
         */
        wrapper: HTMLElement;
        /**
         * The availables buttons (Ok, Apply, Cancel, etc.)
         */
        buttons: HTMLElement;
        /**
         * The content itself
         */
        content: HTMLElement;
        /**
         * The function that can be called to close the modal box. Note that this is also called by validation button such as APPLY, YES, etc.<br/>
         * Force close will close all open modalbox and skip the validation (if one was provided)
         * @param button
         * @param forceClose
         */
        close: (button?: BUTTON, forceClose?: boolean) => boolean;
        open: (content: HTMLElement, options?: Options) => ModalBox;
    }
    /**
     * Possible options when creating a ModalBox
     */
    interface Options {
        /**
         * Specify if you wish to open the modal box full screen. Default is `false`. If false, the modal box will fit the size of the content.
         */
        fullscreen?: boolean;
        /**
         * Specify that you wish the modal box to close when the user click on the title. Default is `false`.
         */
        titleClose?: boolean;
        /**
         * Specify if you wish to close the modal box when the overlay (black background) is clicked. Default is `false`.
         */
        overlayClose?: boolean;
        /**
         * Specify that you wish to add a prefix to the class name of the modal box container, to not clash with existing css in the page
         */
        className?: string;
        /**
         * The button you wish to create (Using {@link BUTTON} enum
         */
        buttons?: number;
        /**
         * Specify a validation function, which receives the button that was pressed.<br/>
         * If the validation function return true, the modal box closes, otherwise it stays open
         * @param button
         */
        validation?: (button: BUTTON) => boolean;
        /**
         * Specify the title of the modal box
         */
        title?: string;
        /**
         * Specify the content that you wish to put inside the modal box
         */
        body?: HTMLElement;
    }
    /**
     * Open a modal box with the given content
     * @param content The content to display, as an HTMLElement
     * @param options The {@link Options} to use for this modal box
     * @returns {{modalBox: (HTMLDivElement|HTMLElement), overlay: (HTMLDivElement|HTMLElement), wrapper: (HTMLDivElement|HTMLElement), buttons: HTMLElement, content: HTMLElement, close: (function(BUTTON=, boolean=): (boolean|boolean))}}
     */
    function open(content: HTMLElement, options?: Options): ModalBox;
    /**
     * Close all open modal box instance
     * @param forceClose Will skip validation
     */
    function close(forceClose?: boolean): void;
}
