//p5.captureを使用
const map2 = (arr,func) => arr.map((r,x) => r.map((v,y) => func(v,x,y)));
const arr2 = (w,h) => [...Array(w)].map(()=>[...Array(h)]);

const ndist = (x,t) => 2**(-2*(x-t)**2-0.5*t**2),
  waveForm = (x,y,px,py,dt) => ndist(max([x-px,y-py].map(abs)),dt*0.1-1);

const cellWidth = 30,
  cellHeight = 30,
  cellSize = 20,
  chance = 5,
  waveSpan = 60;

let lightPos = 0,topPos = 0;

function setup() {
  createCanvas(cellWidth*cellSize, cellHeight*cellSize);
  noStroke();
}

const waves = [];

function updateWaves() {
  if (random(chance) < 1) {
    waves.push({px:lightPos+random(cellWidth),py:topPos+random(cellHeight),st:frameCount});
  }
  while (waves.length > 0 && frameCount - waves[0].st >= waveSpan) {
    waves.shift();
  }
}

function mouseClicked() {
  console.log({px:lightPos+mouseX/width*cellWidth,py:topPos+mouseY/height*cellHeight,st:frameCount});
  waves.push({px:lightPos+mouseX/width*cellWidth,py:topPos+mouseY/height*cellHeight,st:frameCount});
}

function draw() {
  updateWaves();
  const grid = map2(arr2(cellWidth,cellHeight),(_,x,y)=>({dx:0,dy:0,tp:0,}));
  waves.forEach(({px,py,st}) => {
    const dt = frameCount - st;
    map2(grid,(v,x,y)=>{
      X = x + lightPos;
      Y = y + topPos;
      const tp = waveForm(X,Y,px,py,dt);
      const [dx,dy] = [X-px,Y-py].map(v=>v*20*tp);
      grid[x][y] = {dx:v.dx+dx,dy:v.dy+dy,tp:v.tp+tp};
    });
  });
  
  background(0,0,20);
  map2(grid,({dx,dy,tp},x,y)=>{
    fill(60,60,255,tp*160);
    const gap = tp * 5;
    rect(cellSize*x+dx-gap,cellSize*y+dy-gap,cellSize+gap*2,cellSize+gap*2);
  });
  const mousePosX = mouseX/height - 0.5;
  topPos += (mouseY/height - 0.5)/5;
  lightPos += (mouseX/width - 0.5)/5;
}
