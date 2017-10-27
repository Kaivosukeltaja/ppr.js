import UniversalLoader from 'ppr.library.utils.loader';

export default class BuilderPrototype {

  build() { // eslint-disable-line
    return false;
  }

  /**
   * Initialize builder
   * @returns {Boolean}
   */
  static initialize(page) {
    if (!this.shouldBuild()) {
      return false;
    }

    const targetDependencies = this.getDependencies();
    const instance = new this();

    // Remember page
    instance.page = page;

    UniversalLoader.load(targetDependencies, (...dependencies) => {
      instance.build(...dependencies);
    });

    return true;
  }

  /**
   * Check whether builder should build
   * @returns {Boolean}
   */
  static shouldBuild() { // eslint-disable-line
    return true;
  }

  /**
   * Get list of dependencies to be loaded
   * @returns {Object[]}
   */
  static getDependencies() { // eslint-disable-line
    return [];
  }
}
