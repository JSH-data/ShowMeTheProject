const express = require("express");
const path = require("path");
// const project = require("/project");
// const loginRouter = require("./loginPage/loginRouter.js");
// const logoutRouter = require("./logoutPage/logoutRouter.js");
const cookieParser = require("cookie-parser");
// const projectRouter = 11;
const port = 5000;

const app = express();
// app.use("/", indexRouter);
// app.use(cookieParser());
app.use("/", express.static("indexPage"));
// // app.use("/reviewPage", reviewPage);
// app.use("/projects", projectsRouter);
// app.use("/login", (req, res, next) => {
//   res.redirect("/loginPage");
// });
// // app.use("/logout", logoutRouter);
// app.use("/createProject", createProjectRouter);
// app.get("/join", (req, res, next) => {
//   res.redirect("/registerMember");
// });
const reviewPageRouter = require("./reviewPage/reviewPageRouter.js");
app.use("/reviewPage", reviewPageRouter);

app.use(express.static(path.join(__dirname, "/")));
app.listen(port, () => {
  console.log("FrontEnd Server is running on port ", port);
});
