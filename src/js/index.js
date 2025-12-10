// TODO


// ⭐️ここから
// htmlのクラス名の修正、わかりやすくする
// CSSを変更
// jsの変数名などの修正

// popstate、ページん遷移など、挙動の確認

// aboutページの追加

// historyの種類を調べる → history.back(); // ブラウザの履歴においての戻ると同じ動
//                       history.pushState();
//                       history.replace()

// ⭕️index.html以外では画像クリックできない様にする　pointer-events: none; を付与

// ⭕️showContentをtlを使わない形に変更。hideContentのような感じ

// 画像の移動が終わってからテキスト関係を表示される

// リファクタ。関数の処理を分ける。

// アニメーションの修正、追加

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

import { utils } from "./utils.js";
// import { INode } from "./INode.js";
import { Work } from "./work.js";
import { Content } from "./content.js";

const ANIMATION_CONFIG = { duration: 1.5, ease: "power4.inOut" };

const works = [...document.querySelectorAll("#js-work")];

const backBtn = document.querySelector(".action--back");

let lenis;
let currentPreviewIdx = -1;
let isAnimating = false;

const parser = new DOMParser(); // 文字列を実際のDOMに変換するパーサー

const contentGroupInner = document.querySelector(".content__group-inner"); // タイトルなど
const contentThumbsInner = document.querySelector(".content__thumbs-inner"); // サムネイルなど

let contentInstance; // new Contentのインスタンス


// Lenis初期化
function initSmoothScrolling() {
  lenis = new Lenis();

  // gsapとLenisの描画タイミング制御機構を同期している
  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// 画像、タイトルのパララックスアニメーション
function animateOnScroll() {
  for (const previewItem of previewInstances) {
    previewItem.scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: previewItem.$.el,
        start: "top bottom", // .preview ブラウザ
        end: "bottom top",
        scrub: true, // スクロールの進捗と、アニメーションを同期
      },
    }).addLabel("start", 0) // ⭐️tlの先頭から0秒地点。後のtoは同時に実行される
    .to(previewItem.$.title,{
        ease: "none",
        yPercent: -100, // start から　end　にかけて-100%にする
      }, "start")
    .to(previewItem.$.imageInner, {
        ease: "none",
        scaleY: 1.8,
      }, "start");
  }
}


// .previewの初期化
const worksInstances = [];
works.forEach((preview, idx) => {
  // console.log(preview) // .preview
  worksInstances.push(new Work(preview));
});


// ✅ 初期化処理
utils.preloadImages(".preview__img-inner").then(async () => {
  if(isAnimating) return; // アニメーション中は処理を受け付けない
  isAnimating = true;

  const path = window.location.pathname === "/" ? "/" : window.location.pathname;
  // console.log(path); // /src/pages/page01.html

  await navigate(path); // ブラウザに履歴を残す

  await loadPage(path); // 着地したページをロード

  // console.log("then")
  document.body.classList.remove("loading");

  initSmoothScrolling(); // Lenisの初期化
  // animateOnScroll(); // 画像、タイトルのスクロールアニメーション

  initEventListeners(); // イベント関係の初期化。showContentなど

  // index.html以外に着地した時は、コンテンツを表示した状態にする
  if(path !== "/") {
    const targetPreview = worksInstances.find((preview) => preview.$.link === path); // urlが一致するitemを取得
    // console.log(targetPreview)

		if(targetPreview){
			await showContent(targetPreview, false); // アニメーションはさせない
		}
  }

  isAnimating = false;
});


// ⭐️着地したページ、遷移先のDOMを取得、挿入
// TODO aboutページなら、main全てを入れ替え
async function loadPage(_url) {
  // console.log(_url);
  try {
    const html = await fetch(_url); // ページデータを取得
    // console.log(html); // Response {type: 'basic', url: 'http://127.0.0.1:5500/about.html', redirected: false, status: 200, ok: true, …}

    const htmlString = await html.text(); // 遷移先のhtmlを全て取得(文字列)
    // console.log(htmlString); // 単なる文字列

    // console.log(parser.parseFromString(htmlString, "text/html")); // #document { http://127.0.0.1:5500/ }
    // → HTML Documentオブジェクト を取得
    const parsedHtml = parser.parseFromString(htmlString, "text/html");
    // console.log(parsedHtml); // 遷移先のhtmlを取得。#document (http://localhost:5173/src/pages/page01.html)

		const parsedTitle = parsedHtml.querySelector("title"); // headタグ内の更新
    // console.log(parsedTitle)
		if(parsedTitle) document.title = parsedTitle.textContent;

		// ⭐️ metaタグ内の処理
		[...parsedHtml.head.querySelectorAll("meta")].forEach(meta => {
			// console.log(meta);

			const name = meta.getAttribute("name"); // 👉 これら3つは更新しない。
			const httpEquiv = meta.getAttribute("http-equiv");
			const charset = meta.getAttribute("charset");
      // console.log(name, httpEquiv, charset)
			if(charset !== null || httpEquiv !== null || (name === "viewport")) return;

			// console.log(meta);

			if(meta.hasAttribute("name")) { // nameの場合の処理
				updateMetaTagByAttr("name", meta.getAttribute("name"), meta.getAttribute("content"));

			} else if (meta.hasAttribute("property")) { // propertyの場合の処理
				// console.log("property"); // OGP
				updateMetaTagByAttr("property", meta.getAttribute("property"), meta.getAttribute("content"));
			}
		});

    const parsedContentGroupInner = parsedHtml.querySelector(".content__group-inner");
    const parsedContentThumbsInner = parsedHtml.querySelector(".content__thumbs-inner");
    // console.log(parsedContentGroupInner);

    // DOMに挿入する
    contentGroupInner.innerHTML = parsedContentGroupInner.innerHTML;
    contentThumbsInner.innerHTML = parsedContentThumbsInner.innerHTML;
  } catch (error) {
    // ⭐️404の処理
    // app.innerHTML = '<h1>404 - Not Found</h1>';
  }
}

// ✅ headタグ内のmetaデータを更新(上書き)
function updateMetaTagByAttr(_attr, _name, _content) { // attr → 属性(name か content)
  let selector = _attr === "name" ? `meta[name="${_name}"]` : `meta[property="${_name}"]`;
  let tag = document.head.querySelector(selector);
	// console.log(tag);

  if(tag) {
    tag.setAttribute("content", _content); // ⭐️上書きして更新
  } else {
    tag = document.createElement("meta"); // tagがなければここで生成して挿入する
    tag.setAttribute(_attr, _name); // _attr → name か property の属性
    tag.setAttribute("content", _content); // content
    document.head.appendChild(tag);
  }
}


// ✅ イベント関係の初期化　TODO イベント関係はすべてここにまとめる
function initEventListeners() {
  // console.log(worksInstances.entries());

  // .previewのshowアニメーション
  for(const [ idx, preview ] of worksInstances.entries()) {
    preview.$.imageInner.addEventListener("click", async (event) => {
      if(isAnimating) return; // アニメーション中は処理を受け付けない
      isAnimating = true;

      // console.log(event.target)

      currentPreviewIdx = idx;
      // console.log(currentPreviewIdx);

      // console.log(worksInstances[currentPreviewIdx])
      const previewPath = worksInstances[currentPreviewIdx].$.link;
      // console.log(previewPath);

      await navigate(previewPath); // urlの更新、履歴に追加

      await loadPage(previewPath); // ページ読み込み
      
      await showContent(preview); // ⭐️コンテンツ表示

      isAnimating = false;
    });
  }

  // 戻るボタンの初期化
  attachBackButton();
}

// ✅ 指定したpreview以外で、ビューポートに少しでも入っているアイテムを配列に格納する処理
function getAdjacentItems(_work) {
  let array = [];

  for (const [idx, preview] of worksInstances.entries()) {
    // _work != preview → 現在の_work以外を次の判定に
    // ⭐️utils.inInViewport → 他のインデックスのpreviewが判定される
    if (_work != preview && utils.isInViewport(preview.$.el)) {
      array.push({ idx: idx, preview: preview });
    }
  }

  return array;
}


// ⭐️コンテンツを表示
async function showContent(_work, isAnimate = true) {
  lenis.stop();

  // duration に応じたアニメーション設定
  const config = isAnimate ? ANIMATION_CONFIG : { duration: 0, ease: "none" };

  const previewIndex = worksInstances.indexOf(_work);
  // console.log(previewIndex)
  const adjacentPreviews = getAdjacentItems(_work);
  _work.adjacentPreviews = adjacentPreviews;

  const contentInner = document.querySelector("#js-content-inner");
  // console.log(contentInner)
  contentInstance = new Content(contentInner);

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
  gsap.set([contentInstance.$.text, backBtn], {
    opacity: 0,
  });

  const scaleY =
    _work.$.imageInner.getBoundingClientRect().height /
    _work.$.imageInner.offsetHeight;
  _work.imageInnerScaleYCached = scaleY;

  const flipstate = Flip.getState(_work.$.image);
  contentInstance.$.contentImageWrapper.appendChild(_work.$.image);

  await Promise.all([
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

    ..._work.adjacentPreviews.map((el) =>
      gsap.to(el.preview.$.el, {
        y: el.idx < previewIndex ? -window.innerHeight : window.innerHeight,
        ...config,
      })
    ),

    gsap.to(backBtn, {
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
      if (!isAnimate) { // アニメーションさせたいくないとき
        setTimeout(() =>{
          contentInstance.multiLine.in(isAnimate);
          gsap.set(contentInstance.$.text, {
            opacity: 1,
            onComplete: resolve,
          });
        }, 0)
      } else {
        // アニメーションさせたい時

        setTimeout(() => {
          contentInstance.multiLine.in(isAnimate); // ライン
          gsap.set(contentInstance.$.text, {
            opacity: 1,
            duration: .3,
            onComplete: resolve,
          });
        }, 150)

      }
    }),
  ]);

}


// ⭐️戻るボタン → ここではどんな時もindex.htmlに戻す
function attachBackButton() {
  const backBtn = document.querySelector(".action--back");

  if(backBtn) {
    backBtn.addEventListener("click", async () => {
      if(isAnimating) return; // アニメーション中は処理を受け付けない
      isAnimating = true;

      const path = window.location.pathname; // ここで、パスを取得 → パスに見合った.previewを渡す
      // console.log(path); // /src/pages/page01.html 遷移前のurlを取得
      const targetPreview = worksInstances.find((preview) => preview.$.link === path); 
      // console.log(targetPreview);

      await navigate("/"); // url更新、ブラウザの履歴に記録
    
      await hideContent(targetPreview); // ⭐️コンテンツ非表示

      await loadPage("/");

      isAnimating = false;
    });
  }
}



// 一つ前のページのurlを持つ
let previousPath = window.location.pathname;

// ⭐️プラウザに履歴を残す。履歴を辿れるように設定する 
// そのページの状態をオブジェクトに格納しておくことができる。
// ⭐️history.pushState(state, title, url);
//  ブラウザの戻るボタンや進むボタン によって、この変更が反映された履歴を辿れるようになる
// history → ブラウザの履歴
// ✅state: 遷移先のページに渡したい、保持したいデータを渡す。⭐️popstateのイベントオブジェクトで取得できる
// ✅title: ページのタイトル
// ✅url: 遷移先のページのパスを渡す
async function navigate(_url) { // 遷移先のurl
  // console.log(_url)
  // ⭐️遷移前のurlを取得 →　pushStateに渡す。

  previousPath = _url;
  // console.log(previousPath);

  history.pushState({ path: _url }, "", _url);
}

// ⭐️ブラウザの戻る/進むボタンで発火。.popは取り出す、stateは状態という意味
window.addEventListener("popstate", async (event) => {
  // console.log(event)
  // ⭐️event.state → pushStateの時に渡したオブジェクトのデータを取得できる
  if(isAnimating) return; // アニメーション中は処理を受け付けない
  isAnimating = true;

  const path = event.state.path || "/"; // 遷移先のパス。なければ、/
  // console.log(path);

  if(path === previousPath) return; // 最初に着地したページから戻る/進むを選択できる場合は処理を中断

  // index.htmlに着地 ... 他ページ から index.htmlに戻る時
  if(path === "/") {
    // console.log(previousPath);
    const targetPreview = worksInstances.find((preview) => preview.$.link === previousPath);
    
    // console.log(path);
    await hideContent(targetPreview);

    await loadPage(path); // 遷移先(index.html)のページをロード

    previousPath = path; // previousPathを更新

    isAnimating = false;
    return;
  }

  // 他ページに着地 →　index.html から 他ページに戻るとき
  if(path !== "/"){
    // console.log(previousPath);
    const url = window.location.pathname;
    const targetPreview = worksInstances.find((preview) => preview.$.link === url);

    await loadPage(url);
    await showContent(targetPreview); // コンテンツを表示

    previousPath = url;

    isAnimating = false;
    return;
  }

  isAnimating = false;
});


// コンテンツを非表示する
async function hideContent(_work) {
  // console.log(_work);
  
  const flipstate = Flip.getState(_work.$.image); // FLIPの現状を記録
  _work.$.imageWrapper.appendChild(_work.$.image);  // FLIPの移動先(motonoichi)を記録

  contentInstance.multiLine.out(); // 下部のテキストアニメーション。TODO 非同期に

  await Promise.all([ // 全て並列で実行
    gsap.to(backBtn, {
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

    gsap.to(_work.adjacentPreviews.map((el) => el.preview.$.el), {
      y: 0, // ずらしたアイテムを元に戻す
      delay: 0.15,
      ...ANIMATION_CONFIG,
    }),

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
  })
}