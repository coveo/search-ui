import {$$, Dom} from './Dom'

export enum BUTTON {
  OK = 1,
  APPLY = 2,
  YES = 4,
  NO = 8,
  CANCEL = 16,
}

export interface ModalBox {
  modalBox: Dom;
  overlay: Dom;
  wrapper: Dom;
  buttons: Dom;
  content: Dom;
  close: (button?: BUTTON, forceClose?: boolean) => boolean;
}

export interface Options {
  fullscreen?: boolean;
  titleClose?: boolean;
  overlayClose?: boolean;
  className?: string;
  buttons?: number;
  validation?: (button: BUTTON) => boolean;
  title?: string | Dom;
  body?:HTMLElement;
}

var closeFunctions: { (button?: BUTTON, forceClose?: boolean): boolean }[] = [];

export function openModalBox(content: Dom, options: Options = <Options>{}): ModalBox {
  let body = options.body || document.body;
  let bodyDom = $$(body)
  bodyDom.addClass('coveo-modalBox-opened');
  var modalBox = $$('div');
  modalBox.addClass('coveo-modalBox');
  bodyDom.append(modalBox.el)
  if (options.fullscreen === true) {
    modalBox.addClass('coveo-fullscreen');
  }
  
  var overlay = $$('div')
  overlay.addClass('coveo-overlay');
  modalBox.append(overlay.el);
  
  var wrapper = $$('div') 
  wrapper.addClass('coveo-wrapper')
  modalBox.append(wrapper.el);
  if (options.title != null) {
    var title = $$('div');
    title.addClass('coveo-title');
    wrapper.append(title.el);
    if(<any>options.title instanceof Dom){
      title.append((<Dom>options.title).el);
    } else {
      title.el.innerHTML = <string>options.title;
    }
    if (options.titleClose === true) {
      title.on('click', () => close())
    }
  }

  if (content.el.childNodes.length > 1) {
    let div = $$('div')
    div.append(content.el);
    content = div;
  }
  content.addClass('coveo-body');
  wrapper.append(content.el);

  var close = (button: BUTTON = 0, forceClose: boolean = false) => {
    var valid = options.validation == null || options.validation(button);
    if (valid !== false || forceClose) {
      modalBox.detach();
      var index = closeFunctions.indexOf(close);
      if (index >= 0) {
        closeFunctions.splice(index, 1);
      }
      if($$(body).find('.coveo-modalBox') != undefined){
        $$(body).removeClass('coveo-modalBox-opened');
      }
      return true;
    }
    return false;
  };

  var buttonsContainer:Dom;
  if (options.buttons != null) {
    var buttonClick = (button: BUTTON) => () => close(button);
    buttonsContainer = $$('div');
    buttonsContainer.addClass('coveo-buttons');
    wrapper.append(buttonsContainer.el);
    
    if (options.buttons & BUTTON.OK) {
      let div = $$('div');
      div.addClass('coveo-button');
      div.text("Ok");
      div.on('click', buttonClick(BUTTON.OK));
      buttonsContainer.append(div.el);
    }
    
    if (options.buttons & BUTTON.APPLY) {
      let div = $$('div');
      div.addClass('coveo-button');
      div.text("Apply");
      div.on('click', buttonClick(BUTTON.APPLY));
      buttonsContainer.append(div.el);
    }
    
    if (options.buttons & BUTTON.YES) {
      let div = $$('div');
      div.addClass('coveo-button');
      div.text("Yes");
      div.on('click', buttonClick(BUTTON.YES));
      buttonsContainer.append(div.el);
    }
    
    if (options.buttons & BUTTON.NO) {
      let div = $$('div');
      div.addClass('coveo-button');
      div.text("No");
      div.on('click', buttonClick(BUTTON.NO));
      buttonsContainer.append(div.el);
    }
    
    if (options.buttons & BUTTON.CANCEL) {
      let div = $$('div');
      div.addClass('coveo-button');
      div.text("Cancel");
      div.on('click', buttonClick(BUTTON.CANCEL));
      buttonsContainer.append(div.el);
    }
    
  }
  closeFunctions.push(close);

  if (options.overlayClose === true) {
    overlay.on('click', () => close());
  }
  if (options.className != null) {
    modalBox.addClass(options.className)
  }

  return {
    modalBox: modalBox,
    overlay: overlay,
    wrapper: wrapper,
    buttons: buttonsContainer,
    content: content,
    close: close
  }
}

export function close(forceClose: boolean = false) {
  var i = 0;
  while (closeFunctions.length > i) {
    var closed = closeFunctions[i](0, forceClose);
    if (!closed) {
      i++;
    }
  }
}