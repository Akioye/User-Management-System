const getter = (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
};

const poster = (req, res) => {
  res.redirect("/");
};

module.exports = { getter, poster };
