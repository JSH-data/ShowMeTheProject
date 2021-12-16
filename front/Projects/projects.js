const root = document.getElementById("root");
let _lastId = null;
// 인피니티 스크롤을 위한 인터섹션 옵저버와 실행할 콜백함수 정의
const io = new IntersectionObserver((entries, observer) => {
  if (entries[0].isIntersecting) getMoreProject(_lastId);
});
const getMoreProject = async (lastId) => {
  // await wait(1000);
  const moreProjects = await getProjectList(lastId);
  document.querySelector(".render").innerHTML += moreProjects;
  io.disconnect();
  const targets = document.querySelectorAll(".observeThis");
  const target = targets[targets.length - 1];
  io.observe(target);
};

const getDate = (date) => {
  // dateString을 얻기위한 임시 함수, 백엔드에서 형식에 맞게 보내준다면 생략 가능, 또는 dayjs이용가능(빌드필요)
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const dateString = year + "-" + month + "-" + day;
  return dateString;
};

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay)); // setTimeout을 Promise가 반환되도록 하는 함수

const getProjectList = async (lastId) => {
  // 옵저버를 이용한 인피니티 스크롤 구현 시 백엔드 요청 API에 lastID값을 날리기 위해 인자로 lastID값을 받음
  // 이용하지 않는다면 lastId는 생략 가능
  let isGetMyProject = location.pathname.match(/\w+/g)[1] === "myProjects";
  let result = "";
  let temp;
  // let fetchURL = API_URL
  let fetchURL = "";
  if (isGetMyProject) fetchURL += `http://localhost:8080/api/myData/${lastId}`;
  // LastId로 API요청
  else fetchURL += "https://jsonplaceholder.typicode.com/posts";
  let fetchedData = await fetch(fetchURL).then((res) => res.json());
  if (!isGetMyProject) {
    fetchedData = fetchedData
      .map((v) => ({
        Title: v.title,
        Image:
          "https://s3-alpha-sig.figma.com/img/b3fd/2d1d/de486d511bc4ffd77c7b74c5fcec860a?Expires=1640563200&Signature=Z51KL7qTLBT1rpd7tmydxvmrHZjzyqq4~gkPw28Pywih7yu~DPu2iJTwD1S1GRUFnTpin3SBEl7b0zxoDIWuZu6s4iB-~sE5aJ4T~lQtWM9tMr2MsL8B-ZFHYMCBl35Tkqr7re2sGr68aK9DsQzhNCP7u5XGVsf~AbghtRgtMyF91ZanxzgOAEtvRcIXBCix9~bsiGdDv2LJ8pmFkMl-rWhE2prGSR61kwx8lx15D2YEPW7el8zjt8Fd7soMKus5WkTO~wCgZ6l-8kDVEzKDrq891Hcy28bNdkxvDDAMx1dR5xzsU3GHn8FSQKj3i0uGG0GOJ48NUvnH~CsN2SzhNA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
        Rating: Math.ceil(Math.random() * 5).toString(),
        ProjectId: parseInt(Math.random() * 100000000000000, 10).toString(),
        createdAt: getDate(new Date()),
      }))
      .slice(0, 10); // 10개씩 갖고온다고 가정
  }
  await wait(1800).then(() => (temp = fetchedData)); // 백엔드에서 데이터를 받을 때 지연시간을 고려하여 임의로 1.8초 대기 후 fetchedData사용
  console.log(fetchedData);
  _lastId = fetchedData[fetchedData.length - 1].ProjectId;
  // fetch로 데이터를 갖고온 후 사용할 값에 맞게 가공하여 projects에 저장
  const projects = temp;

  // projects의 데이터를 순회하며 innerHTML로 넣을 값으로 가공하여 results생성
  projects.forEach((v, i) => {
    let isEnd = "";
    let rate = "";
    for (let i = 0; i < 5; i++) {
      if (i < parseInt(v.Rating, 10))
        rate += /*html*/ `<span class="fill-star">★</span>`;
      else rate += /*html*/ `<span class="star">☆</span>`;
    }
    if (i >= 9) isEnd = /* html */ `<div class="observeThis"></div>`;
    result += /*html*/ `
    <a href="/project/${v.ProjectId}">
      <div class="card">
        ${isEnd}
        <div>
          <div class="thumbnail">
            <img src=${v.Image} /> 
            <!-- 이미지경로 || default이미지경로 -->
          </div>
          <div class="title">
            ${v.Title}
            <!-- 제목 -->
          </div>
          <div class="rating">
            ${rate}
          </div>
        </div>
      </div>
    </a>
    `;
  });
  //innerHTML로 넣을 데이터를 반환
  return result;
};

const firstRender = () => {
  const targetEl = document.getElementById("root");
  targetEl.innerHTML = `<div class="render"></div>`;
  getProjectList().then((result) => {
    document.querySelector(".render").innerHTML = result;
    const targets = document.querySelectorAll(".observeThis");
    const target = targets[targets.length - 1];
    io.observe(target);
  });
};

window.addEventListener("popstate", firstRender);

document.addEventListener("DOMContentLoaded", firstRender);
// document.addEventListener("DOMContentLoaded", () => {
//   document.body.addEventListener("click", (e) => {
//     if (
//       e.target.matches("[id='header-home']") ||
//       e.target.matches("[id='header-my-project']")
//     ) {
//       console.log(location.pathname);
//       // e.preventDefault();
//       firstRender();
//       // return;
//     }
//   });
// });

// const dummyProjects = [];
// for (let i = 0; i < 10; i++) {
//   dummyProjects.push({
//     Title: `타이틀${i}`,
//     Image: `https://media.discordapp.net/attachments/919476237720772628/920238099198525470/unknown.png?width=722&height=663`,
//     Rating: `${Math.ceil(Math.random() * 5).toString()}`, // 평균 평점, 더미는 1~5의 값을 랜덤으로 생성
//     ProjectId: `${parseInt(Math.random() * 100000000000000, 10).toString()}`, // project의 고유ID, 랜덤값으로 생성
//     createdAt: getDate(new Date()), // createdAt, 더미는 현재날짜로 생성
//   });
// }
/* 
            dummyProject:object Array
  object:
  Title, Image, Rating, ProjectId  <- string
*/

// document.getElementById("임시버튼").addEventListener("click", getMoreProject);
