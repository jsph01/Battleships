document.addEventListener("DOMContentLoaded", ()=>{
    class Ship{
        static HORIZONTAL = 0;
        static VERTICAL = 1;
        constructor(size, x, y){
            this.orientation = Ship.VERTICAL;
            this.size = size;
            this.setBounds();
            this.x = x;
            this.y = y;
        }
    
        setBounds(){
            if(this.orientation == Ship.HORIZONTAL){
                this.width = this.size;
                this.height = 1;
            }else{
                this.width = 1;
                this.height = this.size;
            }
        }
    
        switchOrientation(){
            this.orientation = !this.orientation;
            this.setBounds();
        }

        //this would only be called if the ship is not drawn on the grid
        checkCollision(grid){
            var index;
            for(let i=0; i<this.width; i++){
                for(let j=0; j<this.height; j++){
                    index = Grid.getIndexFromCoordinates(this.x+i, this.y+j);
                    if(grid[index] != "water" && grid[index] != this){
                        return true;
                    }
                }
            }
            return false;
        }
    }

    class Grid{
        grid = new Array(100);

        constructor(ctx){
            this.ctx = ctx;
            for(let i=0; i<100; i++){
                this.grid[i] = "water";
            }
        }

        static getIndexFromCoordinates(x, y){
            return (y*10 + x);
        }

        static getCoordinatesFromIndex(i){
            return {
                x: i%10,
                y: parseInt(i/10)
            }
        }

        insertShip(ship){
            var index;
            for(let i=0; i<ship.width; i++){
                for(let j=0; j<ship.height; j++){
                    index = Grid.getIndexFromCoordinates(ship.x+i, ship.y+j);
                    this.grid[index] = ship;
                }
            }
        }

        removeShip(ship){
            var index;
            for(let i=0; i<ship.width; i++){
                for(let j=0; j<ship.height; j++){
                    index = Grid.getIndexFromCoordinates(ship.x+i, ship.y+j);
                    this.grid[index] = "water";
                }
            }
        }

        drawGrid(){
            var coords;
            for(let i=0; i<100; i++){
                coords = Grid.getCoordinatesFromIndex(i);
                this.ctx.beginPath();
                this.ctx.rect(coords.x*48,coords.y*48,48,48);
                
                if(this.grid[i] === 'water') {
                    this.ctx.fillStyle = 'blue';
                }else if(this.grid[i] instanceof Ship) {
                    this.ctx.fillStyle = 'green';
                }   
                
                this.ctx.fill();
                this.ctx.closePath();
            }
        }

        clickGrid(x, y) {
            var i = Grid.getIndexFromCoordinates(x, y)
            if(this.grid[i] === "water"){
                //alert("water");
            }else if(this.grid[i] instanceof Ship){
                //alert("ship");
                //if gamemode == "setup"
                var ship = this.grid[i];
                this.removeShip(this.grid[i])
                ship.switchOrientation();
                if(ship.checkCollision(this.grid))
                    ship.switchOrientation();
                this.insertShip(ship);
            }
        }
    
        dragGrid(x, y) {
            var i = Grid.getIndexFromCoordinates(x, y);

            if(this.grid[i] instanceof Ship){
                mouseShip = this.grid[i];
            }
        }
    }

    var userCanvas = document.getElementById('user-canvas');
    userCanvas.setAttribute('draggable', 'true');
    var userCtx = userCanvas.getContext('2d');

    var opponentCanvas = document.getElementById('opponent-canvas');
    opponentCanvas.setAttribute('draggable', 'true');
    var oppCtx = opponentCanvas.getContext('2d');

    var mouseShip = undefined;

    var userGrid = new Grid(userCtx);
    userGrid.insertShip(new Ship(5, 0, 0));
    userGrid.insertShip(new Ship(4, 2, 0));
    userGrid.insertShip(new Ship(3, 4, 0));
    userGrid.insertShip(new Ship(2, 6, 0));
    userGrid.insertShip(new Ship(2, 8, 0));
    userGrid.insertShip(new Ship(1, 6, 4));
    userGrid.insertShip(new Ship(1, 8, 4));


    userCanvas.addEventListener('click', (e)=>{
        var mouseX = parseInt((e.x - userCanvas.offsetLeft)/48);
        var mouseY = parseInt((e.y - userCanvas.offsetTop)/48);
        userGrid.clickGrid(mouseX, mouseY);
    });

    userCanvas.addEventListener('dragstart', (e)=>{
        var mouseX = parseInt((e.x - userCanvas.offsetLeft)/48);
        var mouseY = parseInt((e.y - userCanvas.offsetTop)/48);
        userGrid.dragGrid(mouseX, mouseY);
    });

    userCanvas.addEventListener('drag', (e)=>{
        if(mouseShip){
            var mouseX = parseInt((e.x - userCanvas.offsetLeft)/48);
            var mouseY = parseInt((e.y - userCanvas.offsetTop)/48);
            var mouseI = Grid.getIndexFromCoordinates(mouseX, mouseY);
            if(userGrid.grid[mouseI] == "water" || (userGrid.grid[mouseI] == mouseShip)){
                userGrid.removeShip(mouseShip);
                let returnX = mouseShip.x;
                let returnY = mouseShip.y;
                mouseShip.x = mouseX;
                mouseShip.y = mouseY;
                
                if(mouseShip.checkCollision(userGrid.grid)){
                    mouseShip.x = returnX;
                    mouseShip.y = returnY;
                }

                userGrid.insertShip(mouseShip);
            }
        }
    })

    var drawGame = ()=>{
        userCtx.clearRect(0,0,480,480);
        oppCtx.clearRect(0,0,480,480);
        userGrid.drawGrid();
        drawGridLines(userCtx);
        drawGridLines(oppCtx);
    }
    
    function drawGridLines(ctx){
        ctx.beginPath();
        for(let i=0; i<=10; i++){
            ctx.moveTo(0, i*48);
            ctx.lineTo(480, i*48)
        }
        for(let i=0; i<=10; i++){
            ctx.moveTo(i*48, 0);
            ctx.lineTo(i*48, 480);
        }
        ctx.stroke();
        ctx.closePath();
    }
    
    setInterval(drawGame, 1000/15);
});