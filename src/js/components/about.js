

// ✅ About

// TODO
// アニメーションさせる場所を決める


export class About{
  constructor(_el){
    // console.log(_el); // .p-about__inner

    this.$ = {};
    this.$.el = _el;

    this.$.title = this.$.el.querySelector("#js-about-title");
    // console.log(this.$.title);
    this.$.subTitle = this.$.el.querySelector("#js-about-subtitle");
    this.$.description = this.$.el.querySelector("#js-about-description");
    this.$.image = this.$.el.querySelector("#js-about-image img");
    // console.log(this.$.image);
    
    this.$.profileTitle = this.$.el.querySelector("#js-profile-title");
    this.$.profileContents = this.$.el.querySelector("#js-profile-contents");

    this.$.skillTitle = this.$.el.querySelector("#js-skill-title");
    this.$.skillContents = this.$.el.querySelector("#js-skill-contents");

    // 👇 ここからアニメーションの初期化
  }
}

// <section class="l-about p-about">
//   <div class="p-about__inner" id="js-about-inner">
//     <div class="p-about__header">
//       <div class="p-about__title" id="js-about-title">
//         <h1>Aboutページ</h1>
//       </div>
//       <div class="p-about__subtitle" id="js-about-subtitle">サブタイトル</div>
//     </div>
//     <div class="p-about__description" id="js-about-description">
//       このページは私について記述します.
//     </div>
  
//     <div class="p-about__contents">
//       <figure class="p-about__img" id="js-about-image">
//         <img src="/img/wataru.avif" alt="">
//       </figure>

//       <div class="p-about__profiles">
//         <div class="p-about__profile p-profile">
//           <div class="p-profile__title" id="js-profile-title">profile</div>
//           <div class="p-profile__contents" id="js-profile-contents">
//             <p class="p-profile__hobby">趣味：絵画(色鉛筆)、筋トレ、銭湯・サウナ</p>
//           </div>
//         </div>

//         <div class="p-about__skill p-skill">
//           <div class="p-skill__title" id="js-skill-title">skill</div>
//           <div class="p-skill__contents" id="js-skill-contents">
//             HTML / CSS / Sass(SCSS) / JavaScript / WordPress / EJS / gulp / webpack / React / Next.js / WebGL
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>	
// </section>





