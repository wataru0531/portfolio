// TODO

// ⭐️ aboutページを開いてから戻す処理 → 戻るボタンの実装から ... backAboutToIndexBtn

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

import { utils } from "./utils.js";
// import { INode } from "./INode.js";
import { Work } from "./components/work.js";
import { Content } from "./components/content.js";
import { About } from "./components/about.js";

// import { createHomeMain } from "./templates/home.js";

const ANIMATION_CONFIG = { duration: 1.5, ease: "power4.inOut" };

const works = [...document.querySelectorAll("#js-work")];

const backWorkToIndexBtn = document.querySelector(".action--back"); // 戻るボタン
const backAboutToIndexBtn = document.getElementById("js-back-about");
// console.log(backAboutToIndexBtn)
const headerAboutBtn = document.getElementById("js-header-about-btn");

let lenis;
let currentWorkIdx = -1;
let isAnimating = false;

const parser = new DOMParser(); // 文字列を実際のDOMに変換するパーサー

// ✅ 遷移前のurlとして持つ
let previousPath = window.location.pathname; // 現在表示中のパス

// 
const contentGroupInner = document.querySelector(".content__group-inner"); // タイトルなど
const contentThumbsInner = document.querySelector(".content__thumbs-inner"); // サムネイルなど

let contentInstance; // new Contentのインスタンス

// 
const aboutInner = document.getElementById("js-about-inner");
let aboutInstance; // new Aboutのインスタンス


// ✅ Lenis初期化
function initSmoothScrolling() {
  lenis = new Lenis();

  // gsapとLenisの描画タイミング制御機構を同期している
  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// ✅ 画像、タイトルのパララックスアニメーション
function animateOnScroll() {
  for (const previewItem of previewInstances) {
    previewItem.scrollTimeline = gsap
      .timeline({
        scrollTrigger: {
          trigger: previewItem.$.el,
          start: "top bottom", // .preview ブラウザ
          end: "bottom top",
          scrub: true, // スクロールの進捗と、アニメーションを同期
        },
      })
      .addLabel("start", 0) // ⭐️tlの先頭から0秒地点。後のtoは同時に実行される
      .to(
        previewItem.$.title,
        {
          ease: "none",
          yPercent: -100, // start から　end　にかけて-100%にする
        },
        "start"
      )
      .to(
        previewItem.$.imageInner,
        {
          ease: "none",
          scaleY: 1.8,
        },
        "start"
      );
  }
}

// ✅ Workの初期化
const worksInstances = [];
works.forEach((work, idx) => {
  // console.log(work) // .work
  worksInstances.push(new Work(work));
});


// ✅ 全てのWork、index付きで取得
const allWorksWithIndex = [];
worksInstances.map(( work, idx ) => {
  allWorksWithIndex.push({ idx, work })
});
// console.log(allWorksWithIndex); // (4) [{idx: 0, work: Work}, {…}, {…}, {…}]

// ✅ ビューポートに入っているWorkを取得
// function getAllWorks(){
//   let array = [];

//   worksInstances.map(( work, idx ) => {
//     array.push({ idx, work })
//   });

//   return array;
// }


// ✅ 初期化処理
document.addEventListener("DOMContentLoaded", async () => {
  if (isAnimating) return; // アニメーション中は処理を受け付けない
  isAnimating = true;

  previousPath = window.location.pathname; // 現在のパスを取得

  const path = window.location.pathname === "/" ? "/" : window.location.pathname;
  // console.log(path); // /src/pages/work01.html

  await pushHistory(path); // ブラウザに履歴を残す

  await loadPage(path); // 着地したページをロード

  initSmoothScrolling(); // Lenis初期化
  // animateOnScroll(); // 画像、タイトルのスクロールアニメーション

  initEventListeners(); // イベント関係の初期化。showContentなど

  // index.html以外に着地した時は、コンテンツを表示した状態にする
  if (path !== "/") {
    const targetWork = worksInstances.find((work) => work.$.link === path); // urlが一致するworkを取得
    // console.log(targetWork)

    if (targetWork) {
      await showContent(targetWork, false); // アニメーションはさせnai
    }
  }

  isAnimating = false;
});


// ⭐️プラウザに履歴を残す。履歴を辿れるように設定する → そのページの状態をオブジェクトに格納しておくことができる。
// ⭐️history.pushState(state, title, url);
//  → ブラウザの戻るボタンや進むボタン によって、この変更が反映された履歴を辿れるようになる
// history → ブラウザの履歴
// ✅state: 遷移先のページに渡したい、保持したいデータを渡す。⭐️popstateのイベントオブジェクトで取得できる
// ✅title: ページのタイトル
// ✅url: 遷移先のページのパスを渡す
async function pushHistory(_url) {
  // 👉 遷移先のurlを渡す
  // console.log(_url)

  previousPath = _url; // 👉 遷移前のurlとして更新 →　pushStateに渡す。
  // console.log(previousPath);

  history.pushState({ path: _url }, "", _url); // 👉 popstateでeventに渡せる
  // 第2引数 → headタブ内のtitleを変更(現在は意味がない)
  // 第3引数 → アドレスバーのパスを_urlに変更
}

// ✅　ルーティング
// → .test() ... マッチすればtrueが返る
const ROUTES = [
  { type: "home", match: (path) => path === "/" },
  { type: "about", match: (path) => /^\/pages\/about\.html$/.test(path) },
  { type: "work", match: (path) => /^\/pages\/work\d+\.html$/.test(path) }, // d+ → 数字が1文字以上続く
];

// ✅ ページ種別判定 → home about work のどれかを返す
function getPageType(_path) {
  // console.log(_path); // /, /pages/work01.html, /pages/about.html
  const route = ROUTES.find((r) => r.match(_path)); // _pathと見合ったオブジェクトが返される
  return route?.type ?? "unknown";
}

// ✅ ブラウザの戻る/進むで発火。.pop 取り出す、state 状態
// popstate → 発火してもブラウザに履歴は残らない。pushStateで残る
// 👉 TODO ... aboutページ追加した時の挙動もプラス
window.addEventListener("popstate", async (e) => {
  // console.log(e.state.path) → pushStateの時に渡したオブジェクトのデータを取得できる
  if (isAnimating) return;
  isAnimating = true;

  try {
    const path = e.state?.path || window.location.pathname || "/"; // 遷移先のパス。なければ、/
    // console.log(path);

    if (path === previousPath) return; // ページが変わらなければ処理終わり

    const pathType = getPageType(path); // 👉 ページの種別を取得
    // console.log(pathType); // home about work

    switch (pathType) {
      // ✅ workページ → index.htmlに遷移時
      //    aboutページ → index.htmlに遷移時
      //    → 処理を分岐させる
      case "home": {
        const targetWork = worksInstances.find(
          (work) => work.$.link === previousPath
        );
        await hideContent(targetWork);

        await loadPage("/");

        previousPath = "/";
        break;
      }

      // ✅ 各ページ遷移時
      case "work": {
        const url = window.location.pathname;
        const targetWork = worksInstances.find((work) => work.$.link === url);

        await loadPage(url);
        await showContent(targetWork); // コンテンツを表示

        previousPath = url;
        break;
      }

      // ✅ aboutページ遷移時
      case "about": {
        await loadPage("/about"); // ⭐️ TODO

        previousPath = "/about";
        break;
      }

      default:
        console.warn("Unknown route: ", path);
    }
  } finally {
    isAnimating = false; // 必ずfalseにしておく
  }
});

// ✅ 着地したページの内容に更新する
// ⭐️ TODO aboutページなら、main全てを入れ替え
async function loadPage(_url) {
  // console.log(_url); // /, /pages/work01.html, /pages/about.html

  try {
    const html = await fetch(_url); // ページデータを取得
    // console.log(html); // Response {type: 'basic', url: 'http://127.0.0.1:5500/about.html', redirected: false, status: 200, ok: true, …}

    const htmlString = await html.text(); // 遷移先のhtmlを全て取得(文字列)
    // console.log(typeof htmlString, htmlString); // string, 文字列で全て取得

    // console.log(parser.parseFromString(htmlString, "text/html")); // #document { http://127.0.0.1:5500/ }
    // → HTML Documentオブジェクト を取得
    const parsedHtml = parser.parseFromString(htmlString, "text/html");
    // console.log(parsedHtml); // 遷移先のhtmlを取得。#document (http://localhost:5173/src/pages/work01.html)

    renderHeadMetaData(parsedHtml); // 👉 headタグ内の更新

    const pageType = getPageType(_url); // 👉 各ページのタイプを取得
    // console.log(pageType) // home, work, about

    switch (pageType) {
      case "home":
        renderHomePage(parsedHtml);
        break;
      case "work":
        renderWorkPage(parsedHtml);
        break;
      case "about":
        renderAboutPage(parsedHtml);
        break;

      default:
        renderNotFoundPage();
    }
  } catch (error) {
    console.error("[LoadPage error]", error);
    renderNotFoundPage();
  }
}

// ✅ ヘッド内の更新
function renderHeadMetaData(_parsedHtml) {
  // console.log(_parsedHtml)
  const parsedTitle = _parsedHtml.querySelector("title"); // ⭐️ headタグ内の更新をしていく
  // console.log(parsedTitle)
  if (parsedTitle) document.title = parsedTitle.textContent;

  // ✅ metaタグ内の更新
  [..._parsedHtml.head.querySelectorAll("meta")].forEach((meta) => {
    // console.log(meta);

    const name = meta.getAttribute("name"); // 👉 これら3つは更新しない。
    const httpEquiv = meta.getAttribute("http-equiv");
    const charset = meta.getAttribute("charset");
    // console.log(name, httpEquiv, charset)
    if (charset !== null || httpEquiv !== null || name === "viewport") return;

    if (meta.hasAttribute("name")) {
      // nameの場合の処理
      updateMetaTagByAttr(
        "name",
        meta.getAttribute("name"),
        meta.getAttribute("content")
      );
    } else if (meta.hasAttribute("property")) {
      // propertyの場合の処理
      // console.log("property"); // OGP
      updateMetaTagByAttr(
        "property",
        meta.getAttribute("property"),
        meta.getAttribute("content")
      );
    }
  });
}

// ✅ headタグ内のmetaデータを更新(上書き)
function updateMetaTagByAttr(_attr, _name, _content) {
  // attr → 属性(name か content)
  let selector =
    _attr === "name" ? `meta[name="${_name}"]` : `meta[property="${_name}"]`;
  // console.log(selector);
  let tag = document.head.querySelector(selector);
  // console.log(tag);

  if (tag) {
    tag.setAttribute("content", _content); // ⭐️上書きして更新
  } else {
    tag = document.createElement("meta"); // ⭐️ tagがなければここで生成して挿入する
    tag.setAttribute(_attr, _name); // _attr → name か property の属性
    tag.setAttribute("content", _content); // content
    document.head.appendChild(tag);
  }
}

// ✅ トップページの更新
function renderHomePage(_parsedHtml) {
  // console.log(_parsedHtml); // → index.htmlの内容は全て取得

  // 元のコード
  // console.log(_parsedHtml.querySelector(".content__group-inner")); // 中は空。
  const parsedContentGroupInner = _parsedHtml.querySelector(".content__group-inner"); // 空を入れる
  const parsedContentThumbsInner = _parsedHtml.querySelector(".content__thumbs-inner"); // 空を入れる

  // console.log(parsedContentGroupInner.innerHTML)
  // console.log(contentGroupInner); // null → ⭐️ これがエラーの原因
  contentGroupInner.innerHTML = parsedContentGroupInner.innerHTML;
  contentThumbsInner.innerHTML = parsedContentThumbsInner.innerHTML;
}

// ✅ 各Workページの更新
function renderWorkPage(_parsedHtml) {
  const parsedContentGroupInner = _parsedHtml.querySelector(".content__group-inner");
  const parsedContentThumbsInner = _parsedHtml.querySelector(".content__thumbs-inner");
  // console.log(parsedContentGroupInner);

  contentGroupInner.innerHTML = parsedContentGroupInner.innerHTML;
  contentThumbsInner.innerHTML = parsedContentThumbsInner.innerHTML;
}

// ✅　aboutページの更新
function renderAboutPage(_parsedHtml) {
  // console.log(_parsedHtml);
  const parsedMain = _parsedHtml.querySelector("#js-about-inner");

  aboutInner.innerHTML = parsedMain.innerHTML
}

// ✅　404ページの更新
function renderNotFoundPage(_parsedHtml) {
  const main = _parsedHtml.querySelector("main");
  document.querySelector("main").innerHTML = main.innerHTML;
}

// ✅ イベント関係の初期化　TODO イベント関係はすべてここにまとめる
function initEventListeners() {
  // console.log(worksInstances.entries());

  // 👉　各Workクリック時
  for (const [idx, work] of worksInstances.entries()) {
    work.$.imageInner.addEventListener("click", async (event) => {
      if (isAnimating) return; // アニメーション中は処理を受け付けない
      isAnimating = true;

      currentWorkIdx = idx;
      // console.log(currentWorkIdx);

      // console.log(worksInstances[currentWorkIdx])
      const workPath = worksInstances[currentWorkIdx].$.link;
      // console.log(workPath);

      await pushHistory(workPath); // urlの更新、履歴に追加

      await loadPage(workPath); // ページ読み込み

      await showContent(work); // ⭐️コンテンツ表示

      isAnimating = false;
    });
  }

  // 👉 aboutボタンクリック時
  headerAboutBtn.addEventListener("click", async (e) => {
    if (isAnimating) return;
    isAnimating = true;

    const link = e.currentTarget.dataset.link;
    // console.log(link); // /pages/about.html

    await pushHistory(link);

    await loadPage(link);

    showAboutPage()

    isAnimating = false;
  });

  attachBackButton(); // 戻るボタンの初期化
}

// ✅ クリックしたwork以外で、ビューポートに少しでも入っているアイテムを配列に格納する処理
function getAdjacentWorks(_work) {
  let array = [];

  for (const [idx, work] of worksInstances.entries()) {
    // _work != work → 現在の_work以外を次の判定に
    if (_work != work && utils.isInViewport(work.$.el)) {
      // ビューポート内に入っているかどうka
      array.push({ idx: idx, work: work });
    }
  }

  return array;
}

// ✅ 全てのWorkを対象に、画面ないに入っているWorkのみを取得
function getVisibleWorksWorks(){
  return worksInstances
          .map((work, idx) => ({ idx: idx, work: work }))
          .filter(({ work }) => utils.isInViewport(work.$.el));
}


// ✅ コンテンツを表示
async function showContent(_work, isAnimate = true) {
  // index.html以外はアニメーションさせない
  // console.log(_work); // Work {$: {…}}
  lenis.stop();

  // ページに応じたアニメーション設定
  const config = isAnimate ? ANIMATION_CONFIG : { duration: 0, ease: "none" };

  const workIndex = worksInstances.indexOf(_work);
  // console.log(workIndex)
  const adjacentWorks = getAdjacentWorks(_work); // ビューポートに入っているworkを取得
  _work.adjacentWorks = adjacentWorks;

  const contentInner = document.querySelector("#js-content-inner");
  // console.log(contentInner)

  contentInstance = new Content(contentInner); // ⭐️ Content初期化

  document.body.classList.add("content-open");

  gsap.set([contentInstance.$.titleInner, contentInstance.$.metaInner], {
    yPercent: -101,
    opacity: 0,
  });
  gsap.set(contentInstance.$.thumbs, {
    transformOrigin: "0% 0%",
    scale: 0,
    yPercent: 150,
  });
  gsap.set([contentInstance.$.text, backWorkToIndexBtn], {
    opacity: 0,
  });

  // ⭐️ TODO
  const scaleY =
    _work.$.imageInner.getBoundingClientRect().height /
    _work.$.imageInner.offsetHeight;
  // console.log(scaleY);
  _work.imageInnerScaleYCached = scaleY;

  const flipstate = Flip.getState(_work.$.image);
  contentInstance.$.contentImageWrapper.appendChild(_work.$.image);

  await Promise.all([
    // 👉 実際にPromiseオブジェクトを返しているのは、new Promiseのみ。gsap.toは解決済みとなる。
    new Promise((resolve) => {
      Flip.from(flipstate, {
        duration: config.duration,
        ease: config.ease,
        absolute: true,
        force3D: true,
        onUpdate() {
          const progress = this.progress();
        },
        onComplete: resolve,
      });
    }),

    gsap.to(_work.$.titleInner, {
      yPercent: 101,
      opacity: 0,
      stagger: -0.03,
      ...config,
    }),

    gsap.to(_work.$.description, {
      yPercent: 101,
      opacity: 0,
      ...config,
    }),

    gsap.to(_work.$.imageInner, {
      scaleY: 1,
      ...config,
    }),

    ..._work.adjacentWorks.map((el) =>
      gsap.to(el.work.$.el, {
        y: el.idx < workIndex ? -window.innerHeight : window.innerHeight,
        ...config,
      })
    ),

    gsap.to(backWorkToIndexBtn, {
      opacity: 1,
      delay: isAnimate ? 0.15 : 0,
      ...config,
    }),

    // コンテンツ関連
    gsap.to(contentInstance.$.titleInner, {
      yPercent: 0,
      opacity: 1,
      stagger: -0.05,
      delay: isAnimate ? 0.15 : 0,
      ...config,
    }),

    gsap.to(contentInstance.$.metaInner, {
      yPercent: 0,
      opacity: 1,
      delay: isAnimate ? 0.15 : 0,
      ...config,
    }),

    gsap.to(contentInstance.$.thumbs, {
      scale: 1,
      yPercent: 0,
      stagger: -0.05,
      delay: isAnimate ? 0.15 : 0,
      ...config,
    }),

    new Promise((resolve) => {
      if (!isAnimate) {
        // アニメーションさせたいくないとき
        setTimeout(() => {
          contentInstance.multiLine.in(isAnimate);
          gsap.set(contentInstance.$.text, {
            opacity: 1,
            onComplete: resolve,
          });
        }, 0);
      } else {
        // アニメーションさせたい時

        setTimeout(() => {
          contentInstance.multiLine.in(isAnimate); // ライン

          gsap.set(contentInstance.$.text, {
            opacity: 1,
            duration: 0.3,
            onComplete: resolve,
          });
        }, 150);
      }
    }),
  ]);
}

// ✅ コンテンツを非表示
async function hideContent(_work) {
  // console.log(_work);

  const flipstate = Flip.getState(_work.$.image); // FLIPの現状を記録
  _work.$.imageWrapper.appendChild(_work.$.image); // FLIPの移動先(motonoichi)を記録

  contentInstance.multiLine.out(); // 下部のテキストアニメーション。TODO 非同期に

  await Promise.all([
    // 全て並列で実行
    gsap.to(backWorkToIndexBtn, {
      opacity: 0,
      ...ANIMATION_CONFIG,
    }),

    gsap.to(contentInstance.$.titleInner, {
      yPercent: -101,
      opacity: 0,
      stagger: 0.05,
      ...ANIMATION_CONFIG,
    }),

    gsap.to(contentInstance.$.metaInner, {
      yPercent: -101,
      opacity: 0,
      ...ANIMATION_CONFIG,
    }),

    gsap.to(contentInstance.$.thumbs, {
      scale: 0,
      yPercent: 150,
      stagger: -0.05,
      ...ANIMATION_CONFIG,
    }),

    gsap.to(
      _work.adjacentWorks.map((el) => el.work.$.el),
      {
        y: 0, // ずらしたアイテムを元に戻す
        delay: 0.15,
        ...ANIMATION_CONFIG,
      }
    ),

    gsap.to(_work.$.titleInner, {
      yPercent: 0,
      opacity: 1,
      stagger: 0.03,
      delay: 0.15,
      ...ANIMATION_CONFIG,
    }),

    gsap.to(_work.$.description, {
      yPercent: 0,
      opacity: 1,
      delay: 0.15,
      ...ANIMATION_CONFIG,
    }),

    gsap.to(_work.$.imageInner, {
      scaleY: _work.imageInnerScaleYCached,
      delay: 0.15,
      ...ANIMATION_CONFIG,
    }),

    // FLIP → Promiseオブジェクトを返さないのでラップ
    new Promise((resolve) => {
      Flip.from(flipstate, {
        duration: ANIMATION_CONFIG.duration,
        ease: ANIMATION_CONFIG.ease,
        absolute: true,
        delay: 0.15,
        onUpdate() {
          // console.log(this); // Timeline2 {vars: {…}, ...} ⭐️Flip.fromは内部でタイムラインを使っている
          const progress = this.progress();
          // console.log("FLIP進行度:", progress);
        },
        onComplete: resolve,
      });
    }),
  ]).then(() => {
    lenis.start();
    document.body.classList.remove("content-open");
  });
}


// ✅ aboutページを表示
async function showAboutPage(_about, isAnimate = true) {
   // index.html以外はアニメーションさせない
  // console.log(_work); // Work {$: {…}}
  lenis.stop();

  document.body.classList.add("js-about-open");

  // ページに応じたアニメーション設定
  const config = isAnimate ? ANIMATION_CONFIG : { duration: 0, ease: "none" };

  const aboutInner = document.querySelector("#js-about-inner");
  // console.log(aboutInner)

  aboutInstance = new About(aboutInner); // ⭐️ Content初期化 → これを使いアニメーションさせる

  // const adjacentWorks = getAdjacentWorks(_work); // ビューポートに入っているworkを取得
  // _work.adjacentWorks = adjacentWorks;

  // ビューポート内にあるWorkを取得
  const worksInViewport = getVisibleWorksWorks();
  // console.log(worksInViewport); // (3) [{idx: 0, work: Work}, {…}, {…}]

  aboutInstance.worksInViewport = worksInViewport;

  // ⭐️ ここからworkを外に出すアニメーションから → 新しい関数をつくる

  // gsap.set([contentInstance.$.titleInner, contentInstance.$.metaInner], {
  //   yPercent: -101,
  //   opacity: 0,
  // });
  // gsap.set(contentInstance.$.thumbs, {
  //   transformOrigin: "0% 0%",
  //   scale: 0,
  //   yPercent: 150,
  // });
  gsap.set(backAboutToIndexBtn, {
    opacity: 0,
  });

  // ⭐️ TODO
  // const scaleY =
  //   _work.$.imageInner.getBoundingClientRect().height /
  //   _work.$.imageInner.offsetHeight;
  // // console.log(scaleY);
  // _work.imageInnerScaleYCached = scaleY;

  // const flipstate = Flip.getState(_work.$.image);
  // contentInstance.$.contentImageWrapper.appendChild(_work.$.image);

  await Promise.all([
    // 👉 実際にPromiseオブジェクトを返しているのは、new Promiseのみ。gsap.toは解決済みとなる。
    // new Promise((resolve) => {
    //   Flip.from(flipstate, {
    //     duration: config.duration,
    //     ease: config.ease,
    //     absolute: true,
    //     force3D: true,
    //     onUpdate() {
    //       const progress = this.progress();
    //     },
    //     onComplete: resolve,
    //   });
    // }),

    // gsap.to(_work.$.titleInner, {
    //   yPercent: 101,
    //   opacity: 0,
    //   stagger: -0.03,
    //   ...config,
    // }),

    // gsap.to(_work.$.description, {
    //   yPercent: 101,
    //   opacity: 0,
    //   ...config,
    // }),

    // gsap.to(_work.$.imageInner, {
    //   scaleY: 1,
    //   ...config,
    // }),

    ...aboutInstance.worksInViewport.map((el) => { // 👉 ビューポート内にあるWorkだけ画面外に動かす
      // console.log(el)
      const viewportCenterY = window.innerHeight / 2;
      const rect = el.work.$.el.getBoundingClientRect();
      // console.log(rect); // DOMRect {x: 49.578125, y: 200, width: 591.421875, height: 400, top: 200, …}

      const rectCenterY = rect.top + rect.height / 2;
      
      const y = rectCenterY < viewportCenterY ? -window.innerHeight : window.innerHeight;

      gsap.to(el.work.$.el, {
        y,
        ...config,
      })
    }),

    gsap.to(backAboutToIndexBtn, {
      opacity: 1,
      delay: isAnimate ? 0.15 : 0,
      ...config,
    }),

    // コンテンツ関連
    // gsap.to(contentInstance.$.titleInner, {
    //   yPercent: 0,
    //   opacity: 1,
    //   stagger: -0.05,
    //   delay: isAnimate ? 0.15 : 0,
    //   ...config,
    // }),

    // gsap.to(contentInstance.$.metaInner, {
    //   yPercent: 0,
    //   opacity: 1,
    //   delay: isAnimate ? 0.15 : 0,
    //   ...config,
    // }),

    // gsap.to(contentInstance.$.thumbs, {
    //   scale: 1,
    //   yPercent: 0,
    //   stagger: -0.05,
    //   delay: isAnimate ? 0.15 : 0,
    //   ...config,
    // }),

    // new Promise((resolve) => {
    //   if (!isAnimate) {
    //     // アニメーションさせたいくないとき
    //     setTimeout(() => {
    //       contentInstance.multiLine.in(isAnimate);
    //       gsap.set(contentInstance.$.text, {
    //         opacity: 1,
    //         onComplete: resolve,
    //       });
    //     }, 0);
    //   } else {
    //     // アニメーションさせたい時

    //     setTimeout(() => {
    //       contentInstance.multiLine.in(isAnimate); // ライン

    //       gsap.set(contentInstance.$.text, {
    //         opacity: 1,
    //         duration: 0.3,
    //         onComplete: resolve,
    //       });
    //     }, 150);
    //   }
    // }),
  ]);
}

// ✅ aboutページを非表示
async function hideAboutPage(_about, isAnimate = true) {

  // contentInstance.multiLine.out(); // 下部のテキストアニメーション。TODO 非同期に

  await Promise.all([
    // 全て並列で実行
    // gsap.to(backWorkToIndexBtn, {
    //   opacity: 0,
    //   ...ANIMATION_CONFIG,
    // }),

    // gsap.to(contentInstance.$.titleInner, {
    //   yPercent: -101,
    //   opacity: 0,
    //   stagger: 0.05,
    //   ...ANIMATION_CONFIG,
    // }),

    // gsap.to(contentInstance.$.metaInner, {
    //   yPercent: -101,
    //   opacity: 0,
    //   ...ANIMATION_CONFIG,
    // }),

    // gsap.to(contentInstance.$.thumbs, {
    //   scale: 0,
    //   yPercent: 150,
    //   stagger: -0.05,
    //   ...ANIMATION_CONFIG,
    // }),

    // ✅ 画面外に移動させたWorkを元に戻す
    gsap.to(...aboutInstance.worksInViewport.map((el) => el.work.$.el), {
        y: 0, // ずらしたアイテムを元に戻す
        delay: 0.15,
        ...ANIMATION_CONFIG,
      }
    ),

    // gsap.to(_work.$.titleInner, {
    //   yPercent: 0,
    //   opacity: 1,
    //   stagger: 0.03,
    //   delay: 0.15,
    //   ...ANIMATION_CONFIG,
    // }),

    // gsap.to(_work.$.description, {
    //   yPercent: 0,
    //   opacity: 1,
    //   delay: 0.15,
    //   ...ANIMATION_CONFIG,
    // }),

    // gsap.to(_work.$.imageInner, {
    //   scaleY: _work.imageInnerScaleYCached,
    //   delay: 0.15,
    //   ...ANIMATION_CONFIG,
    // }),

    // // FLIP → Promiseオブジェクトを返さないのでラップ
    // new Promise((resolve) => {
    //   Flip.from(flipstate, {
    //     duration: ANIMATION_CONFIG.duration,
    //     ease: ANIMATION_CONFIG.ease,
    //     absolute: true,
    //     delay: 0.15,
    //     onUpdate() {
    //       // console.log(this); // Timeline2 {vars: {…}, ...} ⭐️Flip.fromは内部でタイムラインを使っている
    //       const progress = this.progress();
    //       // console.log("FLIP進行度:", progress);
    //     },
    //     onComplete: resolve,
    //   });
    // }),
  ]).then(() => {
    lenis.start();
    document.body.classList.remove("js-about-open");
  });
}


// ⭐️ 戻るボタン → どんな時もindex.htmlに戻す
function attachBackButton() {
  const backWorkToIndexBtn = document.querySelector(".action--back");

  if (backWorkToIndexBtn) {
    backWorkToIndexBtn.addEventListener("click", async () => {
      if (isAnimating) return; // アニメーション中は処理を受け付けない
      isAnimating = true;

      try {
        const path = window.location.pathname; // 現在のパス
        // console.log(path); // /pages/about.html
        const pageType = getPageType(path);
        // console.log(pageType); // home, work,about

        switch (pageType) {
          case "work": { // workページ → index.htmlに遷移の場合
            const targetWork = worksInstances.find(
              (work) => work.$.link === path
            );
            // console.log(targetWork);
            await hideContent(targetWork); // ⭐️コンテンツ非表示

            await loadPage("/");
            await pushHistory("/"); // ブラウザの履歴に記録
            break;
          }

          case "about": { // aboutページ → index.htmlに遷移の場合
            // workを元に戻す、
            // aboutの画像、テキストなどを元に戻すアニメーション


            await loadPage("/");
            await pushHistory("/");
            break;
          }
        }
      } catch (e) {
      } finally {
        isAnimating = false;
      }
    });
  }
}
