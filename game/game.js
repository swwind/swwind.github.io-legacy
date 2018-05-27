const elem = document.querySelector('div.container');

// ************ ENGINE ************

const Engine = Matter.Engine;
const Render = Matter.Render;
const Bodies = Matter.Bodies;
const Events = Matter.Events;
const World  = Matter.World;
const Body   = Matter.Body;

const engine = Engine.create();

const render = Render.create({
  element: elem,
  engine: engine,
  options: {
    width: 500,
    height: 700,
    background: 'rgba(255, 255, 255, 0)',
    wireframes: false
  }
});

const STATIC = { isStatic: true }
const BALL = { restitution: 1, name: 'BALL' }

// 创建刚体
// rect = Bodies.circle(300, 100, 5, BALL) // 圆
// circle = Bodies.rectangle(200, 100, 50, 50), // 矩形
// polygon = Bodies.polygon(450, 100, 5, 25), // 多边形
// trapezoid = Bodies.trapezoid(590, 100, 50, 50, 3); // 梯形

const g1 = Bodies.rectangle(-25, 350, 50, 700, STATIC);
const g2 = Bodies.rectangle(250, 725, 500, 50, STATIC);
const g3 = Bodies.rectangle(525, 350, 50, 700, STATIC);
const g4 = Bodies.rectangle(250, -25, 500, 50, STATIC);

World.add(engine.world, [g1, g2, g3, g4]);

Engine.run(engine);
Render.run(render);

// ************ GAME ************

let balls = 10;
let score = 0;
let pause = true;

const addScore = (delta) => {
  let el = document.querySelector('span.score');
  el.innerHTML = score += delta;
}
const addBall = (delta) => {
  let el = document.querySelector('span.balls');
  el.innerHTML = balls += delta;
  pause = !!balls;
}

const zz = 500;
const startTurn = (x, y, ball = balls) => {
  if (y < 0) return false;
  const nx = x / ((6500 - y) * Math.sqrt(2 * y));
  for (let i = 0; i < ball; ++ i) {
    setTimeout(() => {
      let rect = Bodies.circle(250, 20, 5, BALL);
      World.add(engine.world, rect);
      Body.applyForce(rect, rect.position, { x: nx, y: 0});
    }, 100 * i);
  }
  addBall(-balls);
  return true;
}

elem.addEventListener('click', ({ offsetX, offsetY }) => {
  if (!pause) return;
  pause = !startTurn(offsetX - 250, offsetY - 20);
})

Events.on(engine, 'collisionStart', (e) => {
  let pairs = e.source.broadphase.pairs;
  const _remove = function (b) {
    if (b.name !== 'BALL')
      return false;
    World.remove(engine.world, b);
    addBall(1);
  }
  for (var g in pairs) {
    const [a, b] = pairs[g];
    if (a === g2) _remove(b);
    if (b === g2) _remove(a);
  }
})

World.add(engine.world, Bodies.rectangle(250, 200, 400, 50, STATIC))
