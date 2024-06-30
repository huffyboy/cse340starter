const errorCont = {}

/* ***************************
 *  Force an error
 * ************************** */
errorCont.forceError = async function (req, res, next) {
  throw new Error("Fake Error");
};

module.exports = errorCont