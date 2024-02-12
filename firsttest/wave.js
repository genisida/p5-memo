//p5.captureを使用
const map2 = (arr,func) => arr.map((r,x) => r.map((v,y) => func(v,x,y)));

function setup() {
  createCanvas(400, 400);
  noStroke();
}

function ndist(x,t){
  return 2**(-2*(x-t)**2-0.5*t**2);
}

function draw() {
  const grid = map2([...Array(8)].map(_=>[...Array(8)]),
    _=>({dx:0,dy:0,tp:0,}));
  
  function pushGrid(dt,px,py){
    map2(grid,(_,x,y)=>{
      const distance = max([x-px,y-py].map(abs));
      const tp = ndist(distance,dt*0.1);
      const [dx,dy] = [x-px,y-py].map(v=>v*20*tp);
      const old = grid[x][y];
      grid[x][y]={dx:old.dx+dx,dy:old.dy+dy,tp:old.tp+tp};
    });
  }
  
  //ここらへんマジックナンバーだらけ　意味づけする必要あり
  const freq = 10;
  for(let i = 0;i < 10;i++){
    const dt = floor(frameCount/freq)+i;
    const [px,py] = [0,1].map(v => floor(noise(dt,v)*48-16)/2);
    pushGrid(frameCount-dt*freq+40,px,py);
  }
  background(20);
  map2(grid,({dx,dy,tp},x,y)=>{
    fill(255,255,255,tp*160);
    rect(50*x+dx-tp*5,50*y+dy-tp*5,50+tp*10,50+tp*10);
  })
}
