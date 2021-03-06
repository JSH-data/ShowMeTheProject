export function authorizedNaviBar() {
  const authorizedTopNaviBar = document.getElementsByClassName("naviBar")[0];

  authorizedTopNaviBar.innerHTML = `
        <div class="naviBar__left">
            <div class="naviBar__logo">
                <a class="naviBar__logo" href="../indexPage">Show Me The Feedback</a>
            </div>
            <div class="naviBar__elements-container">
                <a class="naviBar--home-link" href="../Projects">홈</a>
                <a class="naviBar--my-projects-link" href="../Projects/my-projects">마이 프로젝트</a>
                <a class="naviBar--my-page-link" href="../myPage">마이 페이지</a>
            </div>
        </div>
        <div class="naviBar__auth">
            <a class="naviBar__logOut" href="../indexPage">로그아웃</a>
            <i class="fas fa-bars"></i>
        </div>
  `;

  const bars = document.querySelector(".fa-bars");
  const naviBar = document.querySelector(".naviBar");
  bars.addEventListener("click", () => {
    naviBar.classList.toggle("open");
  });
}

export default { authorizedNaviBar };
