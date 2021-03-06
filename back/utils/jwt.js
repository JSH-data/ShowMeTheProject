const jwt = require("jsonwebtoken");

module.exports = {
  sign: (email) => {
    // access token 발급
    const payload = {
      // access token에 들어갈 payload
      id: email,
    };

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      // secret으로 sign하여 발급하고 return
      expiresIn: "1h", // 유효기간
    });
  },
  verify: (token) => {
    // access token 검증
    let decoded = null;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return {
        ok: true,
        id: decoded.id,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },
  refresh: () => {
    // refresh token 발급
    return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, {
      // refresh token은 payload 없이 발급
      expiresIn: "14d",
    });
  },
  refreshVerify: async (token) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      return true;
    } catch (err) {
      return false;
    }
  },
};
