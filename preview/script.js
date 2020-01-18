function toggleTheme(evt) {
  const onoffswitch = evt.target.closest('.onoffswitch');
  if (!onoffswitch) return;

  onoffswitch.classList.toggle('onoffswitch_checked');

  const defaultClassName = 'theme_color_project-default';
  const inverseClassName = 'theme_color_project-inverse';
  const themedElements = document.querySelectorAll(`.${defaultClassName}, .${inverseClassName}`);

  if (themedElements) {
    for (let i = 0; i < themedElements.length; i++) {
      themedElements[i].classList.toggle(defaultClassName);
      themedElements[i].classList.toggle(inverseClassName);
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('click', toggleTheme);
});
function toggleAccordion(evt) {
  const short = evt.target.closest('.e-accordion__short');
  if (!short) return;

  const accordion = short.closest('.e-accordion');
  const more = accordion && accordion.querySelector('.e-accordion__more');
  if (!more) return;

  if (more.style.display === '' || more.style.display === 'none') {
    more.style.display = 'unset';
  } else {
    more.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('click', toggleAccordion);
});