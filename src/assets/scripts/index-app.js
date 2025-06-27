import gsap, { ScrollTrigger } from 'gsap/all';
import './modules/form';
import Headroom from 'headroom.js';
import Swiper, { Autoplay, FreeMode, Pagination, Scrollbar } from 'swiper';
import { lenis } from './modules/scroll/leniscroll';
import { toggleMenuHandler } from './modules/menu';

gsap.registerPlugin(ScrollTrigger);
gsap.core.globals('ScrollTrigger', ScrollTrigger);

toggleMenuHandler();


// ScrollTrigger.create({
//     trigger: '.screen1',
//     start: 'top top',
//     end: 'bottom top',
//     onEnter: () => {
//         gsap.set('[data-logo-header]', { opacity: 0 });
//         console.log('enter');
        
//     },
//     onEnterBack: () => {
//         gsap.set('[data-logo-header]', { opacity: 0 });
//         console.log('enter back');
//     },
//     onLeave: () => {
//         gsap.set('[data-logo-header]', { opacity: 1 });
//         console.log('leave');
//     }
// });

window.addEventListener('DOMContentLoaded', () => {
    gsap.timeline({
        ease: 'none',
        scrollTrigger: {
            trigger: '.block-about-us',
            start: '0% bottom',
            end: `${window.innerHeight} top`,
            scrub: 0.1,
        }
    })
    .to('.video-screen video', {
        y: window.innerHeight,
        ease: 'none'
    })
});




const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
    if (window.screen.width < 600) return;
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

document.querySelectorAll('[data-up-arrow]').forEach(el => {
    el.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });




const transformationValues = (type) => {
    switch (type) {
        case 'tablet':
            return {
                from: {
                    y: -100,
                }, 
                to: {
                    y: 100,
                }
            }
        case 'mobile':
            return {
                from: {
                    y: -50,
                }, 
                to: {
                    y: 50,
                }
            }
    
        default:
            return {
                from: {}, 
                to: {}
            }
    }
}


function paralaxesScreens(deviceType = 'desktop') {

    document.querySelectorAll('.paralax-screen').forEach(el => {

        gsap.timeline({
            defaults: {
                force3D: true,
                ease: 'none'
            },
            scrollTrigger: {
                trigger: el,
                scrub: true,
            }
            
        })
            .fromTo(el.querySelector('.paralax-screen-wrapper-transform'), {
                y: el.dataset.transform ? +(el.dataset.transform) * -1 : -200,
                ...transformationValues(deviceType).from
            }, {
                y: el.dataset.transform ? +el.dataset.transform : 200,
                ...transformationValues(deviceType).to
            })
            .fromTo(el.querySelector('.paralax-screen-wrapper-scale'), {
                scale: el.dataset.scale ? el.dataset.scale : 1.4
            }, {
                scale: 1
            }, '<');
    })
}
paralaxesScreens();



document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[href="#contacts"]');
    if (target){
        evt.preventDefault();
        const contacts = document.querySelector('#contacts');
        contacts.scrollIntoView({ behavior: 'smooth' });
    }
});   


var myElement = document.querySelector("header");
// construct an instance of Headroom, passing the element
var headroom  = new Headroom(myElement);
// initialise
headroom.init();


function splitToLinesAndFadeUp(selector, gsap) {
    document.querySelectorAll(selector).forEach(text => {
        let mathM = text.innerHTML.match(/<\s*(\w+\b)(?:(?!<\s*\/\s*\1\b)[\s\S])*<\s*\/\s*\1\s*>|\S+/g);
        if (mathM === null) return;
        mathM = mathM.map(el => `<span style="display:inline-flex"><span>${el}</span></span>`);
        text.innerHTML = mathM.join(' ');
        gsap.set(text.children, { overflow: 'hidden' });
        gsap.set(text.querySelectorAll('span>span'), { overflow: 'initial', display: 'inline-block' });
        let tl = gsap
            .timeline({
                // paused: true,
                scrollTrigger: {
                    trigger: text,
                    once: true,
                },
            })
            .fromTo(
                text.querySelectorAll('span>span'),
                { yPercent: 100, },
                { yPercent: 0, stagger: 0.1, duration: 1, ease: 'power4.inOut' },
            )
            .add(() => {
                text.innerHTML = text.textContent;
            })
            ;

        // text.addEventListener('click',function(evt){
        //   tl.progress(0).play();
        // });
    });
}

window.addEventListener('load', () => {
    splitToLinesAndFadeUp('[data-split-lines]', gsap);
});


// pause video when is out of view
document.querySelectorAll('video').forEach(video => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    });
    observer.observe(video);
});

Swiper.use([Scrollbar, FreeMode, Pagination]);

function mobilePartnersSlider() {
    new Swiper('[data-mobile-partners-slider]', {
        slidesPerView: 1.25,
        spaceBetween: 24,
        freeMode: true,
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
        }
    });
}

if (window.screen.width <= 600) {
    mobilePartnersSlider();
}

function newsSlider() {
    new Swiper('[data-news-slider]', {
        // freeMode: true,
        // slidesPerView: 1.25,
        spaceBetween: 16,
        // centeredSlides: true,
        loop: true,
        // centeredSlides: true,
        initialSlide: 0,
        breakpoints: {
            600: {
                slidesPerView: 2,
                spaceBetween: 24,
            },
            900: {
                slidesPerView: 3,
                spaceBetween: 24,
            },
            1200: {
                slidesPerView: 4,
                spaceBetween: 24,
            }
        },
    })
}

window.addEventListener('load',newsSlider, { once: true });

;
function homeSliderSlider() {
    new Swiper('[data-home-slider]', {
        slidesPerView:1,
        pagination: {
            el: '[data-home-slider-pagination]',
            clickable: true,
        }
        
    })
}
homeSliderSlider();

function menuHoversHandler() {
    const links = document.querySelectorAll('[data-menu-hover]');
    const images = document.querySelectorAll('[data-menu-hover-image]');
    links.forEach(link => {
        link.addEventListener('mouseenter',function(evt){
            const imagetoReveal = document.querySelector(`[data-menu-hover-image="${this.dataset.menuHover}"]`);
            console.log(imagetoReveal);
            images.forEach(image => {
                image.classList.toggle('active', image === imagetoReveal);
            });
        });
    })
}
menuHoversHandler();


document.querySelectorAll('.timeline-block__list>*').forEach(el => {
    ScrollTrigger.create({
        trigger: el,
        start: '50% 80%',
        onEnter: () => {
            el.classList.add('active');
        },
        onLeaveBack: () => {
            el.classList.remove('active');
        },
    });
})


function simpleBlockSlider() {
    const slider = document.querySelector('[data-simple-block-slider]');
    if (!slider) return;
    const swiper = new Swiper(slider, {
        slidesPerView: 3,
        modules: [Autoplay],
        centeredSlides: true,
        simulateTouch: window.screen.width < 600,
        autoplay: window.screen.width < 600,
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            601: {
                slidesPerView: 3,
            },
        },
        on: {
            init: function (s) {
                if (window.screen.width < 600) return;
                setTimeout(() => {
                    s.setProgress(0.5);
                }, 1000);
            }
        }
    });

    

    const tl = gsap.timeline({
        // data-simple-block-slider
        scrollTrigger: {
            trigger: slider,
            once: true,
            start: '100% bottom',
            end: 'bottom top',
        }
    })
    .fromTo(slider.querySelectorAll('img'), {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
    }, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
        stagger: 0.1,
        duration: 4.5,
        ease: 'power3.out',
    });

}


simpleBlockSlider();

//gsap count up animation 

gsap.utils.toArray('[data-count-up-animation]').forEach(el => {
    const countUp = gsap.fromTo(el, {
        innerHTML: 0,
    }, {
        innerHTML: el.innerHTML,
        duration: 2,
        ease: 'power1.inOut',
        snap: { innerHTML: 1 },
        scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
        }
    });
});


