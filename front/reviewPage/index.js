import { stateObject, setStateObject } from "./staetObject.js";
const pathArr = window.location.pathname.split("/");
export const id = pathArr[pathArr.length - 1];
const getProejct_API_BASE_URL = "http://90u90u349jw:5000/fjiowejfoiw";

// const postCommentOption = {
//   method: "post",
//   headers: {
//     accessToken: getToken("accessToken"),
//   },
// };

// document
//   .querySelector(".커멘트전송버튼클래스")
//   .addEventListener("click", (e) => {
//     const comment = {
//       content: e.target.value,
//       rating: e.target.parentNode.querySelector(".star").value,
//     };
//     postCommentFunction(id, comment);
//   });
// const postCommentFunction = async (id, comment) => {
//   let projectData;
//   await fetch(`getProejct_API_BASE_URL/${id}`, {
//     ...postCommentOption,
//     body: comment,
//   })
//     .then((result) => result.json())
//     .then((result) => {
//       projectData = result;
//     });
//   render(projectData);
// };

//작성자 관련
function mainArea() {
  fetch("./author.json")
    .then((res) => res.json())
    .then((data) => {
      setStateObject(JSON.parse(JSON.stringify(data)));
      console.log(stateObject);
      stateProjectSave(stateObject);
      mainContentInfo(stateObject);
      mainContentImage(stateObject.gotThumbnails);
    });
}

//상세페이지 이미지 관련
// function imageArea() {
//   fetch("https://jsonplaceholder.typicode.com/photos")
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data);
//       mainContentImage(data);
//       commentCreate();
//     });
// }

// 댓글 조회 관련
function commentArea() {
  fetch("./comment.json")
    .then((res) => res.json())
    .then((data) => {
      stateCommentSave(data);
      mainContentStar(data);
      mainContentEval(data);
      commentList(stateComment);
      commentCreate();
    });
}

//댓글 작성 관련

//상태 저장

let stateProject = [];
let stateComment = [];

function stateProjectSave(data) {
  for (let i = 0; i < data.length; i++) {
    stateProject.push(data[i]);
  }
}

function stateCommentSave(data) {
  for (let i = 0; i < data.length; i++) {
    stateComment.push(data[i]);
  }
}

//날짜 출력하기
function dateFormat(dateObject) {
  let Year = dateObject.getFullYear();
  let Month = dateObject.getMonth() + 1;
  let Date = dateObject.getDate();
  let Hour = dateObject.getHours();
  let Minutes = dateObject.getMinutes();
  let Seconds = dateObject.getSeconds();

  let result =
    Year +
    "." +
    Month +
    "." +
    Date +
    " " +
    Hour +
    ":" +
    Minutes +
    ":" +
    Seconds;

  return result;
}

//이미지 및 버튼 이벤트
function mainContentImage(data) {
  console.log(data);
  let main_img = document.getElementsByClassName("main_img")[0];
  let prev_img_btn = document.getElementsByClassName("prev_img_btn")[0];
  let next_img_btn = document.getElementsByClassName("next_img_btn")[0];
  main_img.src = data[0];

  prev_img_btn.disabled = true;

  if (data.length > 1) {
    next_img_btn.disabled = false;
  } else {
    next_img_btn.disabled = true;
  }

  let main_img_index = 0;

  prev_img_btn.addEventListener("click", () => {
    if (main_img_index > 0) {
      main_img_index--;
      main_img.src = data[main_img_index];
      next_img_btn.disabled = false;
      if (main_img_index === 0) {
        prev_img_btn.disabled = true;
      }
    }
  });

  next_img_btn.addEventListener("click", () => {
    if (main_img_index < data.length - 1) {
      main_img_index++;
      main_img.src = data[main_img_index];
      prev_img_btn.disabled = false;
      if (main_img_index === data.length - 1) {
        next_img_btn.disabled = true;
      }
    }
  });
}

//상세 페이지 작성자, 제목, 날짜
function mainContentInfo(data) {
  let projectTitle = document.getElementsByClassName("project-Title")[0];
  let projectAuthor = document.getElementsByClassName("project-Author")[0];
  let projectDate = document.getElementsByClassName("project-Date")[0];
  let projectMainFunc = document.getElementsByClassName(
    "project-Container_mainFunc"
  )[0];
  let projectSkills = document.getElementsByClassName(
    "project-Container_skills"
  )[0];
  let projectMembersAndJobs = document.getElementsByClassName(
    "project-Container_MembersAndJobs"
  )[0];

  projectTitle.innerText = data.projectName;
  projectAuthor.innerText = data.teamName;
  projectDate.innerText = data.date;
  projectMainFunc.innerText = data.mainFunc;
  projectSkills.innerHTML = data.skills;
  for (let i = 0; i < data.member.length; i++) {
    projectMembersAndJobs.innerHTML += `<div class = "project-Container_MembersAndJobs_list${i}">${data.member[i].name}(${data.member[i].job}) : ${data.member[i].task}</div>`;
  }
}

//상세 페이지 본문 별점
function mainContentStar(data) {
  let scoreStarMask = document.getElementsByClassName("scoreStarMask")[0];
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum = sum + data[i].rating;
  }

  let avg = sum / data.length;

  scoreStarMask.style.width = `${avg * 10}%`;
}

//상세 페이지 본문 평가한 사람의 수
function mainContentEval(data) {
  let mainContentEval = document.getElementsByClassName("mainContentEval")[0];
  mainContentEval.innerText = data.length + "명";
}

//댓글 목록
function commentList(data) {
  let node_list = [];

  for (let i = 0; i < data.length; i++) {
    let commentTemplate = document.getElementsByClassName("commentTemplate")[0];
    let node = document.importNode(commentTemplate.content, true);

    node.querySelector(".commentAuthor").innerText = data[i].name;
    node.querySelector(".commentDate").innerText = data[i].commentDate;
    node.querySelector(".commentContent").style.width = "400px";
    node.querySelector(".commentContent").style.height = "100px";
    node.querySelector(".commentContent").innerText = data[i].body;

    node_list.push(node.querySelector(".commentContent"));
    if (data[i].body.length <= 100) {
      node.querySelector(".commentMoreContent").style.display = "none";
    } else {
      node.querySelector(".commentContent").style.overflow = "hidden";
      node
        .querySelector(".commentMoreContent")
        .addEventListener("click", (e) => {
          e.preventDefault();
          if (e.target.innerText === "전체 내용 보기") {
            node_list[i].style.height = "auto";
            e.target.innerText = "간략히 보기";
          } else {
            node_list[i].style.height = "100px";
            e.target.innerText = "전체 내용 보기";
          }
        });
    }

    node.querySelector(".commentStar").style.position = "relative";
    node.querySelector(".commentStar").style.fontSize = "1rem";
    node.querySelector(".commentStar").style.color = "#ddd";

    node.querySelector(".commentStarMask").style.position = "absolute";
    node.querySelector(".commentStarMask").style.width = `${
      data[i].rating * 10
    }%`;
    node.querySelector(".commentStarMask").style.left = "0";
    node.querySelector(".commentStarMask").style.color = "red";
    node.querySelector(".commentStarMask").style.overflow = "hidden";

    document.getElementsByClassName("commentsList")[0].appendChild(node);
  }
}

//댓글 등록

function commentCreate() {
  let commentRegStarDrag =
    document.getElementsByClassName("commentRegStarDrag")[0];
  let commentRegBtn = document.getElementsByClassName("commentRegBtn")[0];
  commentRegStarDrag.addEventListener("input", (e) => {
    let commentRegStarMask =
      document.getElementsByClassName("commentRegStarMask")[0];
    commentRegStarMask.style.width = `${e.target.value * 10}%`;
  });

  commentRegBtn.addEventListener("click", (e) => {
    const content = e.target.parentElement.querySelector(
      ".writeCommentContent"
    ).value;

    const rating =
      parseInt(
        e.target.parentElement.querySelector(".commentRegStarDrag").value,
        10
      ) / 2;
    console.log("작성한댓글은 : ", content);
    console.log("별점은 : ", rating, "점 입니다");
    console.log("게시글의 id는 :", id);
    const options = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        content: content,
        rating: rating,
      }),
    };

    // await fetch("http://localhost:8080/commentPost", options)
    //   .then((result) => result.json())
    //   .then(console.log);

    // let comment = {
    //   postId: 1,
    //   id: 1,
    //   name: "김용규",
    //   email: "Eliseo@gardner.biz",
    //   rating: document.getElementsByClassName("commentRegStarDrag")[0].value,
    //   commentDate: dateFormat(new Date()),
    //   body: document.getElementsByClassName("writeCommentContent")[0].value,
    // };
    // stateComment.push(comment);

    // fetch("http://localhost:9999/", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(stateComment),
    // })
    //   .then((res) => {
    //     if (res.status === 200 || res.status === 201) {
    //       res.json().then((json) => console.log(json));
    //     } else {
    //       console.error(res.statusText);
    //     }
    //   })
    //   .catch((err) => console.error(err));
    // commentList(stateComment);
  });
}

mainArea();
// imageArea();
commentArea();
