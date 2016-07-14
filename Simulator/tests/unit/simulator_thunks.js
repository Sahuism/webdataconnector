import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import should from 'should';
import jsdom from  'jsdom';
import sinon from 'sinon';

import * as consts from '../../utils/consts.js';
import * as simulatorActions from '../../actions/simulator_actions.js';
import * as messagingActions from '../../actions/messaging_actions.js';


const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

// Simulator Thunk Tests
describe('Thunks', () => {
  // setup the simplest document possible
  global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
  // get the window object out of the document
  global.window = document.defaultView;

  describe('startConnector Thunk', sinon.test(function() {
    it('startConnector Creates the Right Actions', function () {
      const input = consts.phases.INTERACTIVE;
      const closeSimulatorActions = [
        { type: "SET_SHOULD_HAVE_GATHER_DATA_FRAME", payload: false },
        { type: "SET_SIMULATOR_WINDOW" },
      ];

      const setWindowAsExternalActions = [{ type: "SET_SIMULATOR_WINDOW" }];
      const expectedActions = [
        { type: "SET_MOST_RECENT_URLS", payload: consts.samples},
        { type: "RESET_TABLES" },
        { type: "SET_CURRENT_PHASE", payload: input },
        { type: "SET_PHASE_IN_PROGRESS", payload: true },
        ...closeSimulatorActions,
        ...setWindowAsExternalActions,
      ];

      const store = mockStore(consts.defaultState);

      store.dispatch(simulatorActions.startConnector(input));
      store.getActions().should.deepEqual(expectedActions);
    });
  }));

  describe('startGatherDataPhase Thunk', sinon.test(function() {
    it('startGatherDataPhase Creates the Right Actions', function () {
      const closeSimulatorActions = [
        { type: "SET_SHOULD_HAVE_GATHER_DATA_FRAME", payload: false },
        { type: "SET_SIMULATOR_WINDOW" },
      ];

      const expectedActions = [
        { type: "SET_CURRENT_PHASE", payload: consts.phases.GATHER_DATA },
        { type: "SET_PHASE_IN_PROGRESS", payload: true },
        ...closeSimulatorActions,
        { type: "SET_SHOULD_HAVE_GATHER_DATA_FRAME", payload: true },
      ];

      const store = mockStore(consts.defaultState);

      store.dispatch(simulatorActions.startGatherDataPhase());
      store.getActions().should.deepEqual(expectedActions);
    });
  }));

  describe('setWindowAsExternal', sinon.test(function() {
    // spy on window.open
    let spy = sinon.spy(window, "open");

    it('setWindowAsExternal Creates the Right Actions', function () {
      const expectedActions = [{ type: "SET_SIMULATOR_WINDOW" }];
      const store = mockStore(consts.defaultState);

      //make sure spy is clean
      spy.reset();
      store.dispatch(simulatorActions.setWindowAsExternal())
      store.getActions().should.deepEqual(expectedActions);
    });

    it('Should Call window.open', function() {
      spy.calledOnce.should.be.true();
    });
  }));

  describe('setWindowAsGatherFrame', sinon.test(function() {
    it('setWindowAsGatherFrame Creates the Right Actions', function () {
      let input = {contentWindow: "mock window"};
      const expectedActions = [
        { type: "SET_SIMULATOR_WINDOW", payload: input.contentWindow }
      ];
      const store = mockStore(consts.defaultState);

      store.dispatch(simulatorActions.setWindowAsGatherFrame(input))
      store.getActions().should.deepEqual(expectedActions);
    });
  }));
});
