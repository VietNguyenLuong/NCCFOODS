const jwt = require("jsonwebtoken");

module.exports = function requireLogin(req, res, next) {
  if (!req.session || !req.session.admin) {
    // API thì trả JSON
    console.log(req.session.admin)
    return res.render("login", {
      error: "Vui lòng đăng nhập để tiếp tục"
    });
  }

  next(); // cho đi tiếp
};
