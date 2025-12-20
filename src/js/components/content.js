// Content

// <div class="content">
// 	<div class="content__group">
// 		<div class="content__title">
// 			<span class="oh"><span class="oh__inner">Andesite</span></span>
// 			<span class="oh"><span class="oh__inner">aphanitic</span></span>
// 		</div>
// 		<div class="content__meta oh">
//     <span class="oh__inner">By James Maurice Rojo</span>
//    </div>

// 	<div class="content__text">
//   <div class="oh">
//     <div class="line" style="display: block; text-align: start; width: 100%;">
//       Andesite (/ˈændəzaɪt/) is a
//     </div>
//   </div>
//   <div class="oh">
//     <div class="line" style="display: block; text-align: start; width: 100%;">volcanic rock of</div>
//   </div>
//   <div class="oh">
//     <div class="line" style="display: block; text-align: start; width: 100%;">intermediate composition.</div>
//    </div>
//   <div class="oh">
//     <div class="line" style="display: block; text-align: start; width: 100%;">In a general sense, it is</div>
//   </div>
//   <div class="oh">
//     <div class="line" style="display: block; text-align: start; width: 100%;">the intermediate type</div>
//   </div>
//   <div class="oh">
//     <div class="line" style="display: block; text-align: start; width: 100%;">between silica-poor basalt</div>
//   </div>
//   <div class="oh">
//     <div class="line" style="display: block; text-align: start; width: 100%;">and silica-rich rhyolite.</div>
//   </div>
//  </div>
// </div>

// <div class="content__thumbs">
// 	<div class="content__thumbs-item" style="background-image: url(&quot;../1_1.aebccaea.avif&quot;)"></div>
// 	<div class="content__thumbs-item" style="background-image: url(&quot;../1_2.b41da7a4.avif&quot;)"></div>
// 	<div class="content__thumbs-item" style="background-image: url(&quot;../1_3.6995f7a8.avif&quot;)"></div>
// 	<div class="content__thumbs-item" style="background-image: url(&quot;../1_4.ae1bf9f6.avif&quot;)"></div>
// </div>
// </div>

import { TextLinesReveal } from "../textLinesReveal";

export class Content {
  constructor(_contentInner) {
    this.$ = {};
    this.$.el = _contentInner;
    // console.log(this.$.el); // <div class="content__inner"></div>

    // this.$.el.inner = this.$.el.querySelector(".content__inner");
    // ⭐️遷移先から要素を突っ込む用のラッパーのDOM
    this.$.contentGroupInner = this.$.el.querySelector(".content__group-inner");
    this.$.contentThumbsInner = this.$.el.querySelector(
      ".content__thumbs-inner"
    );
    this.$.contentImageWrapper = this.$.el.querySelector(
      ".content__image-wrapper"
    );

    this.$.title = this.$.el.querySelector(".content__title");
    this.$.titleInner = [...this.$.title.querySelectorAll(".oh__inner")];
    this.$.metaInner = this.$.el.querySelector(".content__meta > .oh__inner");
    this.$.text = this.$.el.querySelector(".content__text");
    this.multiLine = new TextLinesReveal(this.$.text); // ⭐️ テキスト分割、アニメーション
    // → この時点ではまだテキスト

    this.$.thumbs = [...this.$.el.querySelectorAll(".content__thumbs-item")];
  }
}
