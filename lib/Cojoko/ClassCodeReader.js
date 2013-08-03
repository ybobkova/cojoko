define(['lodash'], function(_) {

  return {

    getClassCode: function (fqn) {
      throw new Error('implement getClassCode yourself');
    },

    /**
     * @param object range[start, end]
     */
    extractClassCode: function (fqn, range) {
      var classCode = this.getClassCode(fqn);

      return classCode.substring(range[0], range[1]);
    }
  };
});