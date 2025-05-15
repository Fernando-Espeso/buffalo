// Lazy Loading for images
document.addEventListener("DOMContentLoaded", function () {
  var lazyImages = Array.from(document.querySelectorAll("img.lazy"));
  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });
    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
});
$(document).ready(function () {
  $('.menu-op').on('click', function () {
    $('.sub-menu').toggleClass('active');
  });
});

$(document).ready(function () {
  // Toggle al hacer clic
  $('.credits-open').on('click', function () {
    $('.credits').toggleClass('active');
  });

  // Quitar clase al hacer scroll
  $(window).on('scroll', function () {
    $('.credits').removeClass('active');
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const infoLink = document.querySelector('.info-menu');
  const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';

  if (isHome) {
    infoLink.setAttribute('href', '#info');
  } else {
    infoLink.setAttribute('href', '/#info');
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const headerOffset = 33; // Ajusta esto a la altura de tu header
  const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';
  const infoLink = document.querySelector('.info-menu');
  // 1. Si estás en la home, modifica el href y haz scroll suave
  if (isHome && infoLink) {
    infoLink.setAttribute('href', '#info');

    infoLink.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector('#info');
      if (target) {
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }

  // 2. Si llegaste a la home con hash (#info), haz scroll manual después de cargar
  if (isHome && window.location.hash === '#info') {
    setTimeout(() => {
      const target = document.querySelector('#info');
      if (target) {
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100); // esperar un poco para asegurarse que todo esté renderizado
  }
});

$(document).ready(function() {
  

  $("#header .menu-open").click(function () {
    isMenuOpen = !isMenuOpen;
  
    $(".nav").toggleClass("active");
    $("#header").toggleClass("active");
    $("body").toggleClass("active");
  
    if (isMenuOpen) {
      // Si abrimos el menú, quitamos .stone
      $("#header").removeClass("stone");
    } else {
      // Si cerramos el menú y el scroll está por encima del límite, volvemos a poner .stone
      if ($(window).scrollTop() > scrollLimit) {
        $("#header").addClass("stone");
      }
    }
  });

         $('.sort').click(function(){
                  var t = $(this),
                  k = t.data('sort');
                  t.parent().siblings().children().removeClass('active');
                  if(!t.hasClass('active')){
                          t.addClass('active');
                          $('.product:not([data-'+ k +'="null"])').sort(function(a, b){
                                  if(!t.hasClass('invert')){
                                          return $(b).data(k) < $(a).data(k) ? 1 : -1;
                                  }else{
                                          return $(b).data(k) > $(a).data(k) ? 1 : -1;
                                  }
                          }).prependTo('#products');
                  }
          });
         const videoElement = document.querySelector('video');
         const playPauseButton = document.querySelector('button');

         playPauseButton.addEventListener('click', () => {
           playPauseButton.classList.toggle('playing');
           if (playPauseButton.classList.contains('playing')) {
             videoElement.play();
           }
           else {
             videoElement.pause();
           }
         });

         videoElement.addEventListener('ended', () => {
           playPauseButton.classList.remove('playing');
         });


     
 });



// Set height on iPhone
document.addEventListener("DOMContentLoaded", function () {
  var h = window.innerHeight;
  document.documentElement.style.setProperty("--h", h + "px");

  let menu = document.getElementById("menu");
  if (menu) {
    document.documentElement.style.setProperty("--m", menu.offsetHeight + "px");
  }

  let article = document.getElementById("article-content");
  if (article) {
    document.documentElement.style.setProperty("--a", article.offsetHeight + "px");
  }
 
});

// Update height on resize
window.addEventListener("resize", onResizeFunction);
function onResizeFunction() {
  var h = window.innerHeight;
  document.documentElement.style.setProperty("--h", h + "px");

  let menu = document.getElementById("menu");
  if (menu) {
    document.documentElement.style.setProperty("--m", menu.offsetHeight + "px");
  }

  let article = document.getElementById("article-content");
  if (article) {
    document.documentElement.style.setProperty("--a", article.offsetHeight + "px");
  }
}

let lastScrollTop = 0;
const scrollLimit = 200;
let isMenuOpen = false;



$(window).on("scroll", function () {
  if (isMenuOpen) return; // Evita modificar .stone si el menú está abierto

  let scrollTop = $(this).scrollTop();

  if (scrollTop > scrollLimit) {
    $("#header").addClass("stone");
  } else if (scrollTop < lastScrollTop && scrollTop <= scrollLimit) {
    $("#header").removeClass("stone");
  }

  lastScrollTop = scrollTop;
});