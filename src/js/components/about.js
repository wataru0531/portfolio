

// ✅ About

// TODO
// アニメーションさせる場所を決める


export class About{
  constructor(_el){
    // console.log(_el); // p-about__inner

    this.$ = {};
    this.$.el = _el;

    this.$.title = this.$.el.querySelector("#js-about-title");
    // console.log(this.$.title);
    this.$.subTitle = this.$.el.querySelector("#js-about-subtitle");
    this.$.description = this.$.el.querySelector("#js-about-description");
    
    
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
//     <div class="p-about__discription" id="js-about-description">
//       このページは私について記述します.
//     </div>
  
//     <div class="p-about__contents">
//       <figure class="p-about__img">
//         <img src="/img/wataru.avif" alt="">
//       </figure>
//       <div class="p-about__profiles">
//         <div class="p-about__profile p-profile">
//           <div class="p-profile__title">profile</div>
//           <div class="p-profile__congents">
//             <p class="p-profile__hobby">趣味：絵画(色鉛筆)、筋トレ、銭湯・サウナ</p>
//           </div>
//         </div>
//         <div class="p-about__skill p-skill">
//           <div class="p-skill__title">skill</div>
//           <div class="p-skill__skills">
//             HTML / CSS / Sass(SCSS) / JavaScript / WordPress / EJS / gulp / webpack / React / Next.js / WebGL
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>	
// </section>





