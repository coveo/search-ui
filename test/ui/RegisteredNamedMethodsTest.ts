import * as RegisteredNamedMethod from '../../src/ui/Base/RegisteredNamedMethods';
import {IMockEnvironment} from "../MockEnvironment";
import {MockEnvironmentBuilder} from "../MockEnvironment";
import {$$} from "../../src/utils/Dom";
import {Component} from "../../src/ui/Base/Component";
import {Searchbox} from "../../src/ui/Searchbox/Searchbox";

export function RegisteredNamedMethodsTest() {
  describe('RegisteredNamedMethods', ()=> {
    let env: IMockEnvironment;
    let searchbox: HTMLElement;
    let root: HTMLElement;

    beforeEach(()=> {
      env = new MockEnvironmentBuilder().build();
      searchbox = $$('div', {
        className: 'CoveoSearchbox'
      }).el;
      root = $$('div').el;
      root.appendChild(searchbox);
    })

    afterEach(()=> {
      env = null;
      searchbox = null;
    })

    it('should allow to call state correctly', ()=> {
      RegisteredNamedMethod.state(env.root, 'q', 'foobar');
      expect(env.queryStateModel.set).toHaveBeenCalledWith('q', 'foobar', jasmine.any(Object));

      RegisteredNamedMethod.state(env.root, 'q');
      expect(env.queryStateModel.get).toHaveBeenCalledWith('q');
    })

    it('should allow to call init correctly', ()=> {
      expect(()=> RegisteredNamedMethod.init(root, {
        Searchbox: {addSearchButton: false},
        SearchInterface: {autoTriggerQuery: false}
      })).not.toThrow();
      expect((<Component>Component.get(searchbox)).options.addSearchButton).toBe(false);
    })

    it('should allow to call initSearchbox correctly', ()=> {
      expect(()=> RegisteredNamedMethod.initSearchbox(root, '/search', {
        Searchbox: {addSearchButton: false},
        SearchInterface: {autoTriggerQuery: false}
      })).not.toThrow();
      expect((<Component>Component.get(searchbox)).options.addSearchButton).toBe(false);
    })

    it('should allow to call init recommendation correctly', ()=> {
      expect(()=> RegisteredNamedMethod.initRecommendation(root, undefined, undefined, {
        Searchbox: {addSearchButton: false},
        SearchInterface: {autoTriggerQuery: false}
      })).not.toThrow();

      expect((<Component>Component.get(searchbox)).options.addSearchButton).toBe(false);
    })

    it('should allow to call execute query', ()=>{
      RegisteredNamedMethod.executeQuery(env.root);
      expect(env.queryController.executeQuery).toHaveBeenCalled();
    })

    it('should allow to call get', ()=>{
      RegisteredNamedMethod.init(root, {
        Searchbox: {addSearchButton: false},
        SearchInterface: {autoTriggerQuery: false}
      })

      expect(RegisteredNamedMethod.get(searchbox) instanceof Searchbox).toBe(true);
    })

    it('should allow to call result', ()=>{

    })
  })
}
