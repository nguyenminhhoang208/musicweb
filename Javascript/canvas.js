const canvas =document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
canvas.style.position = 'fixed'
const circleWatersArray = []
class CircleWater {
    constructor(){
        this.x = mouse.x
        this.y =mouse.y
        this.size = 8 
        this.lineWidth = 1
        this.opacity = 1;
    }
    update(){
        if(this.size < 200 && this.opacity > 0)
        {
            this.size += 1
            this.lineWidth += 0.05
            this.opacity -= 0.005

        } 
        else{
            this.size = 0
            this.opacity
        }
    }
    drawCircleWater(){

        for (let i = 0; i < 3; i++) {
            
            ctx.beginPath()
            ctx.arc(this.x,this.y,this.size - i * this.lineWidth,0, Math.PI* 2,)
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = 'rgb(255,255,255,' + 0.12 * (10 - i) / 10 * this.opacity + ')';
            ctx.stroke();  
        }
    }
}

const mouse = {
    x: undefined,
    y: undefined
}

function handleDraw(){
    for (let i = 0; i < circleWatersArray.length; i++) {
        circleWatersArray[i].drawCircleWater()
        circleWatersArray[i].update()
        if(circleWatersArray[i].size == 0) circleWatersArray.splice(i,1)
    }
}

function check(currX,currY){
    return Math.sqrt((currX - mouse.x)*(currX - mouse.x) +  (currY - mouse.y)*(currY - mouse.y)) < 100 ? true : false
}

canvas.addEventListener('mousemove',(e)=>{
    mouse.x = e.x
    mouse.y = e.y
    if(!circleWatersArray.find((curr)=>{
        return check(curr.x,curr.y)
    }))
    {
        circleWatersArray.push(new CircleWater())
    }

})

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    handleDraw()
    requestAnimationFrame(animate)
}
animate()