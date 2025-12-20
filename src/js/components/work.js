// ⭐️preview + content
// → 2つを保持する

// <div class="preview">
// 	<div class="preview__img-wrap">
// 		<div class="preview__img">
// 			<div class="preview__img-inner" style="background-image: url(&quot;../1.13d9edcf.avif&quot;); translate: none; rotate: none; scale: none; transform-origin: 50% 0%; transform: scale(1, 1.8);"></div></div>
// 		</div>
// 	<div class="preview__title" style="translate: none; rotate: none; scale: none; transform: translate(0%, -100%) translate(0px, 116.508px);">
// 		<h2 class="preview__title-main">
// 			<span class="oh"><span class="oh__inner">Andesite</span></span>
// 			<span class="oh"><span class="oh__inner">aphanitic</span></span>
// 		</h2>
// 		<p class="preview__desc">A volcanic rock of intermediate composition, between silica-poor basalt and silica-rich rhyolite.</p>
// 	</div>
// </div>

import { INode } from "../INode";

export class Work {
  constructor(_el) {
    // ⭐️js-workに変更 .preview, .previewに見合った.content
    this.$ = {};
    this.$.el = _el;

    // 👉 TODO クラス名書き換え
    this.$.imageInner = this.$.el.querySelector("#js-work-image-inner");
    this.$.imageWrapper = this.$.imageInner.querySelector(
      "#js-work-image-wrapper"
    ); // 画像のラッパー
    this.$.image = this.$.imageWrapper.querySelector("#js-work-image"); // 画像(background)
    // this.$.imageWrap = this.$.el.querySelector(".preview-wrap");
    // this.$.image = this.$.imageWrap.querySelector(".preview__img"); // 画像のラッパー
    // this.$.imageInner = this.$.image.querySelector(".preview__img-inner"); // 画像(background)

    this.$.link = INode.getDS(this.$.image, "link");
    // console.log(this.$.link);

    this.$.title = this.$.el.querySelector("#js-work-header");
    this.$.titleInner = [...this.$.title.querySelectorAll(".oh__inner")];
    this.$.description = this.$.el.querySelector("#js-work-description");
  }
}
