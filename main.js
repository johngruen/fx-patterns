const SHAPES = [
  {
    name: 'caret',
    baseWidth: 47.16,
    baseHeight: 79.32,
    baseEl: document.getElementById('caret')
  },
  {
    name: 'circle',
    baseWidth: 25,
    baseHeight: 25,
    baseEl: document.getElementById('circle')
  },
  {
    name: 'line',
    baseWidth: 55.2,
    baseHeight: 15,
    baseEl: document.getElementById('line')
  },
  {
    name: 'moon',
    baseWidth: 47.16,
    baseHeight: 79.32,
    baseEl: document.getElementById('moon')
  }
];

class Shape {
  constructor(parent, min, max, minOpacity, maxOpacity, colors, shapes) {
    this.setShape(shapes);
    this.setScale(min, max);
    this.setTranslation(window.innerWidth, window.innerHeight);
    this.setOpacity(minOpacity, maxOpacity);
    this.setColor(colors);

    this.wrapperEl = document.createElement('div');
    this.wrapperEl.classList.add('wrapper');
    this.el = document.createElement('div');
    this.el.classList.add(this.shape.name);
    const prime = this.shape.baseEl.cloneNode(true);
    this.el.appendChild(prime);
    this.wrapperEl.appendChild(this.el);
    parent.appendChild(this.wrapperEl);
  }

  setColor(colors) {
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  setShape(shapes) {
    const shapeIndex = Math.floor(Math.random() * shapes.length);
    this.shape = shapes[shapeIndex];
  }

  setTranslation(w, h) {
    this.rotation = Math.random() * Math.PI * 2;
    this.offsetX = Math.random() * w - this.width * .5;
    this.offsetY = Math.random() * h - this.height * .5;
  }

  setScale(min, max) {
    const randOff = Math.random() * max;
    const randFloor = Math.floor(randOff);
    this.scale = randFloor + min;
    this.width = this.shape.baseWidth * this.scale;
    this.height = this.shape.baseHeight * this.scale;
  }

  setOpacity(minOpacity, maxOpacity) {
    this.opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;
  }

  setWrapper() {
    const longSide = this.width >= this.height ? this.width : this.height;
    this.wrapperEl.style.position = 'absolute';
    this.wrapperEl.style.display = 'flex';
    this.wrapperEl.style.alignItems = 'center';
    this.wrapperEl.style.justifyContent = 'center';
    this.wrapperEl.style.width = `${longSide}px`;
    this.wrapperEl.style.height = `${longSide}px`;
    this.wrapperEl.style.boxSizing = 'border-box';
    this.wrapperEl.style.transform = `translate(${this.offsetX}px, ${
      this.offsetY
    }px)`;
  }

  setTweakables(min, max, minOpacity, maxOpacity) {
    this.setTranslation(window.innerWidth, window.innerHeight);
    this.setScale(min, max);
    this.setOpacity(minOpacity, maxOpacity);
    this.setWrapper();
    this.draw();
  }

  // this gets the actual coordinates of the vertices
  // of rotated shapes. it doesn't get called for not, but
  // it will be useful if we want to eventually avoid collisions
  getVertices() {
    let vx2 = Math.cos(this.rotation) * this.width;
    let vy2 = Math.sin(this.rotation) * this.width;
    let vx3 =
      Math.cos(Math.PI - (Math.PI * 0.5 + this.rotation)) * this.height * -1;
    let vy3 = Math.sin(Math.PI - (Math.PI * 0.5 + this.rotation)) * this.height;
    ('');
    let vx4 = vx2 + vx3;
    let vy4 = vy2 + vy3;

    this.vertices = [
      this.offsetX,
      this.offsetX,
      vx2 + this.offsetX,
      vy2 + this.offsetY,
      vx3 + this.offsetX,
      vy3 + this.offsetY,
      vx4 + this.offsetX,
      vy4 + this.offsetY
    ];
  }

  draw() {
    this.el.style.height = `${this.height}px`;
    this.el.style.width = `${this.width}px`;
    this.el.style.fill = `${this.color}`;
    this.el.style.opacity = this.opacity;
    this.el.style.transform = `rotate(${this.rotation}rad)`;
  }
}

const shapeLayer = document.querySelector('#shape-layer');

const countEl = document.querySelector('#count');
const minEl = document.querySelector('#min-size');
const maxEl = document.querySelector('#max-size');
const minOpacityEl = document.querySelector('#min-opacity');
const maxOpacityEl = document.querySelector('#max-opacity');

const countReport = document.querySelector('#count-report');
const minReport = document.querySelector('#min-report');
const maxReport = document.querySelector('#max-report');
const minOpacityReport = document.querySelector('#min-opacity-report');
const maxOpacityReport = document.querySelector('#max-opacity-report');

const colorEls = document.querySelectorAll('.color-label input');
const redrawButton = document.querySelector('#redraw');
const deck = document.querySelector('.deck');

const toggleDeck = () => {
  if (deck.classList.contains('hidden')) {
    deck.classList.remove('hidden');
    localStorage.setItem('deck', 'visible');
  } else {
    deck.classList.add('hidden');
    localStorage.setItem('deck', 'hidden');
  }
};

const toggleDebug = () => {
  if (shapeLayer.classList.contains('debug'))
    shapeLayer.classList.remove('debug');
  else shapeLayer.classList.add('debug');
};

let shapeList = [];
let colorList = [];

const setColors = () => {
  colorList = [];
  colorEls.forEach(el => {
    if (el.checked) colorList.push(el.value);
  });
  setShapes();
};

const setShapes = (reset = true) => {
  if (reset) {
    shapeList = [];
    while (shapeLayer.firstChild) {
      shapeLayer.removeChild(shapeLayer.firstChild);
    }
  }
  const min = parseFloat(minEl.value, 10);
  const max = parseFloat(maxEl.value, 10);
  const minOpacity = parseFloat(minOpacityEl.value, 10);
  const maxOpacity = parseFloat(maxOpacityEl.value, 10);
  const count = countEl.value;
  countReport.textContent = count;
  minReport.textContent = min;
  maxReport.textContent = max;
  minOpacityReport.textContent = minOpacity;
  maxOpacityReport.textContent = maxOpacity;
  if (reset) {
    for (let i = 0; i < count; i++) {
      shapeList.push(
        new Shape(
          shapeLayer,
          min,
          max,
          minOpacity,
          maxOpacity,
          colorList,
          SHAPES
        )
      );
      shapeList[i].setWrapper();
      shapeList[i].draw();
    }
  } else {
    for (let i = 0; i < count; i++) {
      shapeList[i].setTweakables(min, max, minOpacity, maxOpacity);
    }
  }
};

countEl.addEventListener('input', setShapes);
minEl.addEventListener('input', setShapes);
maxEl.addEventListener('input', setShapes);
minOpacityEl.addEventListener('input', setShapes);
maxOpacityEl.addEventListener('input', setShapes);
colorEls.forEach(el => {
  el.addEventListener('change', setColors);
});
redrawButton.addEventListener('click', () => setShapes(false));
window.addEventListener('keydown', e => {
  if (e.keyCode === 82) setShapes(false);
  if (e.keyCode === 84) toggleDeck();
  if (e.keyCode === 68) toggleDebug();
});

if (localStorage.getItem('deck') !== 'hidden') {
  deck.classList.remove('hidden');
} else {
  deck.classList.add('hidden');
}

setColors();
setShapes();
