import { throttle } from "./libs/utils";
import "./polyfills.js";
import "./blocks.js";

import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import flatpickr from "flatpickr";
import { Russian } from "flatpickr/dist/l10n/ru.js"

let ourSwiper;
let gallerySwiper;

// Функции

// Единицы высоты (ширины) экрана
function updateVH() {
	const { height = window.innerHeight, width = window.innerWidth } = window.visualViewport || {};

	document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
	['resize', 'orientationchange'].forEach(event => {
		window.addEventListener(event, throttle(updateVH, 200), { passive: true });
	});
}

// Ширина скроллбара
const setScrollbarWidth = () => {
	document.documentElement.style.setProperty('--sw', `${window.innerWidth - document.documentElement.clientWidth}px`);
}

const setParallax = () => {
	const parallaxBlocks = document.querySelectorAll('[data-parallax]');

	parallaxBlocks.forEach(block => {
		const items = block.querySelectorAll('[data-parallax-item]');

		let mouseX = 0, mouseY = 0;

		block.addEventListener('mousemove', e => {
			const rect = block.getBoundingClientRect();
			mouseX = e.clientX - rect.left - rect.width / 2;
			mouseY = e.clientY - rect.top - rect.height / 2;
		});

		block.addEventListener('mouseleave', () => {
			mouseX = 0;
			mouseY = 0;
		});

		const states = Array.from(items).map(() => ({ x: 0, y: 0 }));

		function animate() {
			items.forEach((item, index) => {
				const data = item.dataset.parallaxItem.split(',');
				const radius = parseFloat(data[0]) || 10;
				const speed = parseFloat(data[1]) || 0.1;

				states[index].x += (mouseX - states[index].x) * speed;
				states[index].y += (mouseY - states[index].y) * speed;

				const translateX = (states[index].x / (block.offsetWidth / 2)) * radius;
				const translateY = (states[index].y / (block.offsetHeight / 2)) * radius;

				item.style.transform = `translate(${translateX}px, ${translateY}px)`;
			});

			requestAnimationFrame(animate);
		}

		animate();
	});
}

const setSwipers = () => {
	const reviewsSwiper = new Swiper('.reviews__swiper.swiper', {
		modules: [Navigation],
		slidesPerView: 1,
		spaceBetween: 15,
		navigation: {
			prevEl: '.reviews__nav-btn_prev',
			nextEl: '.reviews__nav-btn_next',
		},
		breakpoints: {
			768: {
				slidesPerView: 2
			},
			1024: {
				slidesPerView: 3
			}
		}
	})
	const promoBgSwiper = new Swiper('.promo__bg.swiper', {
		modules: [Autoplay, EffectFade],
		loop: true,
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		}
	});
}

const setOurSwiper = () => {
	if (window.matchMedia('(max-width: 640px)').matches) {
		ourSwiper = new Swiper('.our__swiper.swiper', {
			modules: [Navigation],
			slidesPerView: 1,
			spaceBetween: 15,
			loop: true,
			navigation: {
				prevEl: document.querySelector('.our__navigation-btn_prev'),
				nextEl: document.querySelector('.our__navigation-btn_next'),
			}
		})
	} else {
		ourSwiper?.destroy();
	}
}

const setScroll = (value) => {
	document.body.style.overflow = value ? 'hidden' : '';
	document.body.style.paddingRight = value ? 'var(--sw)' : '';
};

const setHeader = () => {
	const header = document.querySelector('.header');
	if (!header) return;

	const headerBurger = header.querySelector('.header__burger');
	const headerMenu = header.querySelector('.header__menu');

	headerBurger.addEventListener('click', () => {
		headerBurger.classList.toggle('active');
		headerMenu.classList.toggle('active');

		if (headerBurger.classList.contains('active')) {
			setScroll(true);
		} else {
			setScroll(false);
		}
	});
}

const setClickSections = () => {
	const sections = document.querySelectorAll('[data-click-section]');

	sections.forEach(section => {
		const clickItems = section.querySelectorAll('[data-click-item]');

		clickItems.forEach(item => {

			item.addEventListener('click', () => {
				section.classList.toggle('active');
			});
		});
	});
}

const setGallerySwiper = () => {
	if(window.matchMedia('(max-width: 780px)').matches) {
		const gallerySwiper = new Swiper('.gallery__photos.swiper', {
			modules: [Navigation],
			slidesPerView: 1,
			spaceBetween: 15,
			loop: true,
			navigation: {
				prevEl: document.querySelector('.gallery__navigation-btn_prev'),
				nextEl: document.querySelector('.gallery__navigation-btn_next'),
			}
		})
	} else {
		gallerySwiper?.destroy();
	}
}

const setCalendares = () => {
	flatpickr('.flatpickr', {
		inline: true,
		"locale": Russian
	});
}

// Запуск функций
document.addEventListener('DOMContentLoaded', () => {
	updateVH();
	setScrollbarWidth();
	setParallax();
	setSwipers();
	setHeader();
	setClickSections();
	setOurSwiper();
	setGallerySwiper();
	setCalendares();

	window.addEventListener("resize", throttle(setOurSwiper, 200));
	window.addEventListener("resize", throttle(setGallerySwiper, 200));
});
