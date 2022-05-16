const currentUser = async (req, res) => {
  const { email, token, name } = req.user;

  res.json({
    status: "success",
    code: 200,
    userInfo: {
      email, token, name
    }
  });
};

module.exports = { currentUser }