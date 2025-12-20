
// ✅　index.htmlを生成する

export function createHomeMain(){
  const main = document.createElement("main");

  main.innerHTML = `
    <!-- l-works -->
      <section class="l-works p-works" id="js-works">
        ${ createWorks() }
      </section>
      <!-- l-works -->

      <!-- l-contents -->
      <section class="l-content p-content">
        ${ createContents() }
      </section>
    <!-- content-wrap -->
  `

  return main;
}


// ✅　各worksを生成する関数
function createWorks(){
  return `
    <!-- p-work -->
      <div class="p-work" id="js-work"> <!-- 元preview -->
        <div class="p-work__image-inner" id="js-work-image-inner"> <!-- 元preview__img-wrap -->
          <div class="p-work__image-wrapper" id="js-work-image-wrapper">
            <!-- 一番下のこの要素がe.targetになる -->
            <div
              class="p-work__image"
              id="js-work-image" 
              data-link="/pages/work01.html"
              style="background-image:url(/img/lebron.avif)"
            > <!-- 元preview__img-inner -->
            </div>
          </div>
        </div>

        <div class="p-work__header" id="js-work-header"> <!-- 元preview__title -->
          <h2 class="p-work__title"> <!-- 元preview__title-main -->
            <span class="oh"><span class="oh__inner">LeBron</span></span>
            <span class="oh"><span class="oh__inner">James</span></span>
          </h2>
          <p class="p-work__description" id="js-work-description">A four-time NBA champion known for his versatility, leadership, and basketball IQ.</p>
          <!-- 元 p-work__desc -->
        </div>	
      </div>
      <!-- p-work -->
      
      <!-- p-work -->
      <div class="p-work" id="js-work">
        <div class="p-work__image-inner" id="js-work-image-inner">
          <div class="p-work__image-wrapper" id="js-work-image-wrapper">
            <!-- 一番下のこの要素がe.targetになる -->
            <div
              data-link="/pages/work02.html"
              class="p-work__image" 
              id="js-work-image" 
              style="background-image:url(/img/curry.avif)"
            >
            </div>
          </div>
        </div>

        <div class="p-work__header" id="js-work-header">
          <h2 class="p-work__title">
            <span class="oh"><span class="oh__inner">Stephen</span></span>
            <span class="oh"><span class="oh__inner">Curry</span></span>
          </h2>
          <p class="p-work__description" id="js-work-description">Revolutionized the game with his deep three-point shooting and quick release.</p>
        </div>
      </div>
      <!-- p-work -->

      <!-- p-work -->
      <div class="p-work" id="js-work">
        <div class="p-work__image-inner" id="js-work-image-inner">
          <div class="p-work__image-wrapper" id="js-work-image-wrapper">
            <!-- 一番下のこの要素がe.targetになる -->
            <div
              data-link="/pages/work03.html"
              class="p-work__image" 
              id="js-work-image" 
              style="background-image:url(/img/durant.avif)"
            >
            </div>
          </div>
        </div>

        <div class="p-work__header" id="js-work-header">
          <h2 class="p-work__title">
            <span class="oh"><span class="oh__inner">Kevin</span></span>
            <span class="oh"><span class="oh__inner">Durant</span></span>
          </h2>
          <p class="p-work__description" id="js-work-description">A two-time MVP known for his dominance in the paint and relentless defense.</p>
        </div>
      </div>
      <!-- p-work -->

      <!-- p-work -->
      <div class="p-work" id="js-work">
        <div class="p-work__image-inner" id="js-work-image-inner">
          <div class="p-work__image-wrapper" id="js-work-image-wrapper">
            <!-- 一番下のこの要素がe.targetになる -->
            <div
              data-link="/pages/work04.html"
              class="p-work__image" 
              id="js-work-image" 
              style="background-image:url(/img/giannis.avif)"
            >
            </div>
          </div>
        </div>

        <div class="p-work__header" id="js-work-header">
          <h2 class="p-work__title">
            <span class="oh"><span class="oh__inner">Giannis</span></span>
            <span class="oh"><span class="oh__inner">Antetokounmpo</span></span>
          </h2>
          <p class="p-work__description" id="js-work-description">One of the most gifted scorers in NBA history with a smooth shooting stroke.</p>
        </div>
      </div>
      <!-- work -->
  
  `
}

function createContents(){
  return `
    <!-- 
        ⭐️work01の状態
        ⭐️この中は遷移先から取得する 
      -->
    <div class="p-content__inner" id="js-content-inner">
        <div class="content__group-inner">
          <!-- 
            <div class="content__title">
              <span class="oh"><span class="oh__inner">Andesite</span></span>
              <span class="oh"><span class="oh__inner">aphanitic</span></span>
            </div>
            <div class="content__meta oh"><span class="oh__inner">By James Maurice Rojo</span></div>
            <div class="content__text">
              Andesite (/ˈændəzaɪt/) is a volcanic rock of intermediate composition. In a general sense, it is the intermediate type between silica-poor basalt and silica-rich rhyolite. 
            </div>  
          -->
        </div> 
        
        <div class="content__thumbs-inner">
          <!-- ⭐️TODO ここスライダーにしたらおもしろい -->
          <!-- 
            <div class="content__thumbs-item" style="background-image:url(img/1_1.avif)"></div>
            <div class="content__thumbs-item" style="background-image:url(img/1_2.avif)"></div>
            <div class="content__thumbs-item" style="background-image:url(img/1_3.avif)"></div>
            <div class="content__thumbs-item" style="background-image:url(img/1_4.avif)"></div> 
          -->
        </div> 
        <div class="content__image-wrapper"></div> <!-- 元content__preview-wrapper -->
    </div>
    <!-- ⭐️.contentの最後に、gsap.Flipで画像をぶち込む -->

    <!-- 戻るボタン -->
    <button class="unbutton action action--back">
      <svg width="25px" height="25px" viewBox="0 0 25 25"><path d="M24 12.001H2.914l5.294-5.295-.707-.707L1 12.501l6.5 6.5.707-.707-5.293-5.293H24v-1z"/></svg>
      <span>Go back</span>
    </button>
  `
}

