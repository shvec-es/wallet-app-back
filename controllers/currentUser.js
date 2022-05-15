const currentUser = async (req, res) => {
  const { email, token, name } = req.user;

  res.json({ email, token, name });
};

module.exports = { currentUser }