


// 遷移先のmainを取得して挿入、クラスを付与して遷移アニメーションを実現する処理
export async function startTransition(_url) {
  const html = await fetch(_url); // ページデータを取得
  // console.log(html); // Response {type: 'basic', url: 'http://127.0.0.1:5500/about.html', redirected: false, status: 200, ok: true, …}

  // html.text() →　レスポンスデータを文字列として取得
  //                Promiseを返すが、awaitで待機、解決
  const htmlString = await html.text();
  console.log(htmlString); // 遷移先のhtmlを全て取得(文字列)

  // DOMParser →　ここで文字列を実際のDOMに変換
  const parser = new DOMParser(); // 実際のHTML
  // console.log(parser); // DOMParser {}

  // console.log(parser.parseFromString(htmlString, "text/html")); // #document { http://127.0.0.1:5500/ }
  // → HTML Documentオブジェクト を取得
  const parsedHtml = parser.parseFromString(htmlString, "text/html").querySelector(".main");
  // console.log(parsedHtml); // 遷移先のhtmlを取得。ここではmain


	const parsedContentGroupInner = parsedHtml.querySelector(".content__group-inner");
	const parsedContentThumbsInner = parsedHtml.querySelector(".content__thumbs-inner");

	// DOMに挿入する
	contentGroupInner.innerHTML = parsedContentGroupInner.innerHTML;
	contentThumbsInner.innerHTML = parsedContentThumbsInner.innerHTML;



  // ⭐️遷移アニメーションを付与する場合
  // main.classList.add("hidden"); // mainのopacityを0に
  // main.addEventListener("transitionend", () => {
  //   // → cssのtransitionが完了したタイミングで発火
  //   //   ⭐️cssでtransitionが設定されていて、しかも、必ず何かしらの要素がtransitionしないと発火しいない
  //   // console.log("transitionend");

  //   // 遷移先のmainのhtmlを挿入
  //   main.innerHTML = parsedHtml.innerHTML; 
  //   main.classList.remove("hidden");
  // }, { once: true });

  
  // { once: true }の意味
  // → mainにはcssプロパティが複数設定してあるので、そのプロパティ分イベントが発火してしまうのでこれを防ぐ
  //   spaでaタグをクリックした場合、preventDefaultをしても実際にはページ遷移の処理が内部的に実行されている状態。
  //   なのでメモリの解放と新しいDOMへの更新してやる

  // ⭐️遷移中に何かのアニメーションを入れる方法
  // transitionDiv.classList.add("animate__in");
  // transitionDiv.addEventListener("transitionend", () => {
  //   // →　cssのtransitionが終われば発火
  //   main.innerHTML = parsedHtml.innerHTML;
  //   transitionDiv.classList.remove("animate__in");
  //   transitionDiv.classList.add("animate__out");

  //   setTimeout(() => {
  //     // .animate__outを即消す
  //     transitionDiv.style.transition = "0s";
  //     transitionDiv.classList.remove("animate__out"); 

  //     setTimeout(() => {
  //       transitionDiv.style.transition = "1s"; // 元に戻す
  //     }, 100)
  //   }, 1000);
  // })
}