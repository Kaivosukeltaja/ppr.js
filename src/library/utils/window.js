import _ from 'lodash';
import Config from 'ppr.config';

export default {

  configList: {
    breakpoints: {},
    mobile_breakpoints: [],
  },

  isInitialized: false,

  initialize() {
    // Already initialized
    if (this.isInitialized === true) {
      return;
    }

    // Configure
    this.configList = Object.assign(this.configList, Config.get('window'));

    // Mark as initialized
    this.isInitialized = true;
  },

  /*
   * Check whether given breakpoint exists
   * @param {string} breakpoint target breakpoint
   * @returns {Boolean}
   */
  isBreakpoint(breakpoint) {
    this.initialize();
    return typeof this.configList.breakpoints[breakpoint] !== 'undefined';
  },

  /**
   * Check whether current window matches to mobile breakpoint
   * @returns {Boolean}
   */
  isMobile() {
    this.initialize();

    let isMobile = false;

    _.each(this.configList.mobile_breakpoints, (breakpoint) => {
      if (!isMobile) {
        isMobile = this.matchBreakpoint(breakpoint);
      }
    });

    return isMobile;
  },

  /**
   * Check whether current window match to breakpoint
   * @param {string} breakpoint name of breakpoint
   * @returns {Boolean}
   */
  matchBreakpoint(breakpoint) {
    this.initialize();

    // Breakpoint doesn't exist
    if (!this.isBreakpoint(breakpoint)) {
      return false;
    }

    // Match media is not supported
    if (typeof window.matchMedia !== 'function') {
      return false;
    }

    const breakpointDetails = this.configList.breakpoints[breakpoint];
    const targetWidth = _.replace(breakpointDetails, /[<>]/, '').trim();

    if (_.startsWith(breakpointDetails, '<')) { // Smaller than
      return window.matchMedia(`(max-width: ${targetWidth}px)`).matches;
    } else if (_.startsWith(breakpointDetails, '>')) { // Bigger than
      return window.matchMedia(`(min-width: ${targetWidth}px)`).matches;
    }

    return false;
  },

  /**
   * Get prefixed transformations
   * @param  {string} transform
   * @return {Object}
   */
  transformations(transform) {
    return {
      '-webkit-transform': transform,
      '-moz-transform': transform,
      '-ms-transform': transform,
      '-o-transform': transform,
      transform,
    };
  },

  /**
   * Transition callback
   */
  whichTransitionEvent() {
    const el = document.createElement('fakeelement');
    const transitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd',
    };

    // eslint-disable-next-line
    for (let a in transitions) {
      if (el.style[a] !== undefined) {
        return transitions[a];
      }
    }

    return null;
  },
};
