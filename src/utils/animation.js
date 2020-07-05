import anime from 'animejs/lib/anime.es';

function animeStaggerIn(targets = '.stagger') {
  anime({
    targets,
    translateY: [-200, 0],
    translateX: [-150, 0],
    rotate: [-30, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
    easing: 'spring(1, 100, 15, 20)',
  });
}

function animeStaggerOut(targets = '.stagger') {
  const animation = anime.timeline({
    targets,
    delay: anime.stagger(100),
    easing: 'easeInBack',
    duration: 200,
  })
    .add({
      translateY: -150,
      opacity: 0,
      scale: 0.9,
    });
  return animation.finished;
}

export { animeStaggerIn, animeStaggerOut };
