const menu = document.querySelector('.menu');
const cross = document.querySelector('.cross');
const activeUl = document.querySelector('.activeUl');
const searchBtn = document.querySelector('section.logoMenu .search button');
const searchInputBlock = document.querySelector('section.logoMenu .search label');
const scrollToTopBtn = document.querySelector('#scrollToTopBtn');

menu.addEventListener('click', () => {
    activeUl.classList.add('active');
})

cross.addEventListener('click', () => {
    activeUl.classList.remove('active');
})

searchBtn.addEventListener('click', () => {
  searchInputBlock.classList.toggle('active');
});

scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
function toggleScrollToTopButton() {
  if (window.scrollY > 20) {
      scrollToTopBtn.style.display = 'block';
  } else {
      scrollToTopBtn.style.display = 'none';
  }
}

window.addEventListener('scroll', toggleScrollToTopButton);

toggleScrollToTopButton();



