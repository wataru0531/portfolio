
// ✅ テキスト分割、アニメーション

import { gsap } from "gsap";
import SplitText from "gsap/SplitText";
gsap.registerPlugin(SplitText);

import { utils } from "./utils.js";


export class TextLinesReveal {
  constructor(_el) {
    // console.log(_el)
    this.$ = {};
    this.$.el = _el; // .content__text
    this.isVisible = false;
    this.timerId = null;

    this.SplitTypeInstance = new SplitText(this.$.el, { type: "lines" })
		// console.log(this.SplitTypeInstance); // SplitType {isSplit: true, settings: {…}, elements: Array(1), lines: Array(7), words: Array(0), …}
  
		// 1行1行(.line)を、<div class="oh"></div>でラップ
    // console.log(this.SplitTypeInstance.lines); // (7) [div.line, div.line, div.line, div.line, div.line, div.line, div.line]
		utils.wrapElements(this.SplitTypeInstance.lines, "div", "oh");
    this.initEvents();
  }

  splitAgain(){ // 👉 改めて分割 ... 他のページからDOMを取得すれば、うまく分割できないため
    // console.log(this)
    this.SplitTypeInstance.split();
  }

  // コンテンツを表示
  in(animation = true) {
    this.splitAgain();
    utils.wrapElements(this.SplitTypeInstance.lines, "div", "oh");

    // console.log(animation)
    this.isVisible = true; // 

    // gsapでは非同期で実行されるのでアニメーションが干渉し合う可能性があるため止める
    // この場合はoutが発火しているかもしれない
    gsap.killTweensOf(this.SplitTypeInstance.lines);

    this.inTimeline = gsap .timeline({
      defaults: { duration: 1.5, ease: "power4.inOut" },
		}).addLabel("start", 0)
		.set(this.SplitTypeInstance.lines, {
			yPercent: 105,
		}, "start");

    if(animation) {
      this.inTimeline.to(this.SplitTypeInstance.lines, {
				yPercent: 0,
				stagger: 0.1,
      }, "start");
    } else {
      this.inTimeline.set(this.SplitTypeInstance.lines, {
        yPercent: 0,
      }, "start");
    }

    return this.inTimeline;
  }

  // コンテンツを閉じるとき
  out(animation = true) {
    this.isVisible = false;

    gsap.killTweensOf(this.SplitTypeInstance.lines);

    this.outTimeline = gsap.timeline({
			defaults: { duration: 1.5, ease: "power4.inOut" },
		})
		.addLabel("start", 0);

    if(animation) {
      this.outTimeline.to(this.SplitTypeInstance.lines, {
				yPercent: -105,
				stagger: 0.02,
			}, "start");
    } else {
      this.outTimeline.set(this.SplitTypeInstance.lines, {
        yPercent: -105,
      }, "start");
    }

    return this.outTimeline;
  }

  initEvents() {
    // リサイズ次に１行ごとの単語数が変化するためにリサイズのたびに変更させる
    window.addEventListener("resize", () => {
			// console.log(this.timerId);
      clearTimeout(this.timerId);

      this.timerId = setTimeout(() => {
        // console.log(this.timerId);

        this.SplitTypeInstance.split(); // 分割を再実行
        utils.wrapElements(this.SplitTypeInstance.lines, "div", "oh"); // .ohでラップ

        // コンテンツを閉じるときにラインを上げる
        if(!this.isVisible) {
          gsap.set(this.SplitTypeInstance.lines, { yPercent: -105 });
        }
      }, 500);
    });
  }
}
