let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight-40;
let c = canvas.getContext('2d');

var myvar;                                                                              //Variable to set interval for background timer
var seconds=0,minutes=0;                                                                //Variables to hold count for minutes and seconds
var d,m,f;
var second_check=9;
var bubble_number_check;                                                                //Variable to check if no. of bubbles on screen do not cross a value
var count_sec=0;                                                                        //Variable for background timer when bubbles overwhelm the screen
var pause_value='false';                                                                //Variable for pause condition


canvas.style.display="none";
document.getElementById("end").style.display="none";
document.getElementById("canvasScore").style.display="none";

function start_game()                                                                   //Function to move on to game screen from start/home screen
{
    document.getElementById("start_page").style.display="none";
    canvas.style.display="block";
    document.getElementById("canvasScore").style.display="block";
    document.getElementById("canv_score").innerHTML=score;
}

function end_game()                                                                     //Function to move on to game over screen when player has lost
{
    canvas.style.display="none";
    document.getElementById("minutes").innerHTML=minutes;
    document.getElementById("sec").innerHTML=seconds;
    document.getElementById("end").style.display="block";
    document.getElementById("canvasScore").style.display="none";
    lose.play();
}

canvas.addEventListener("mouseout",change_state);                                       //Pause and play events

canvas.addEventListener("mouseover",function(){
    pause_value='false';
    animate();
    canvas.removeEventListener("mouseover",change_state);
});

function change_state()
{
    pause_value='true';
}

var sound=new Audio();                                                                  //Creating audio elements for sound effects in the game
sound.src="sound.mp3";
var lose=new Audio();
lose.src="youlose.mp3";

class Circle {                                                                          //Bubble object
    constructor() {
        this.radius = 80;
        this.x = Math.random() * (window.innerWidth - this.radius * 2) + this.radius;
        this.y = Math.random() * (window.innerHeight - this.radius * 2) + this.radius;
        this.dx = (Math.random() - 0.5)*5;
        this.dy = (Math.random() - 0.5)*5;

        
        for(var i=1;i<circleArray.length;i++)                                           //To prevent bubbles spawning on top of each other
        {
            if(getDistance(this.x,this.y,circleArray[i].x,circleArray[i].y)<this.radius*2)
            {
                this.x = Math.random() * (window.innerWidth - this.radius * 2) + this.radius;
                this.y = Math.random() * (window.innerHeight - this.radius * 2) + this.radius;
                i=0;
            }
        }

    }
    draw() {
        c.beginPath();
        c.fillStyle="white";
        c.strokeStyle="black";
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fill();
        c.stroke();
        c.fillStyle="aqua";
        c.arc(this.x-this.radius/2,this.y-this.radius/2,this.radius/8,0,Math.PI*2,true);
        c.fill();
    }
    update(circleArray) {
        if (this.x + 80 > window.innerWidth || this.x - 80 < 0) {
            this.dx = -this.dx;
        }
        if (this.y + 80 > window.innerHeight || this.y - 80 < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        for(f=0;f<circleArray.length;f++)
        {
            d=getDistance(this.x,this.y,circleArray[f].x,circleArray[f].y);
            if(this===circleArray[f])
              continue;
              

            if(d<=this.radius*2)                                                    //Collision detection
            {   
                var xdif=-1*(this.x-circleArray[f].x);
                var ydif=-1*(this.y-circleArray[f].y);
                var vel_xdif=this.dx-circleArray[f].dx;
                var vel_ydif=this.dy-circleArray[f].dy;
                if(xdif*vel_xdif+ydif*vel_ydif>=0)                                  //This code segment deals with bubble bounce using law of conservation of momentum
                {
                    const angle=-Math.atan2(ydif,xdif);                             //The angle between the line joining the two centres and the x-axis
                                                                                    //Assuming the velocities are of a cooridate system rotated by an angle 'angle'
                    const u1x=xrotate(this.dx,this.dy,angle);                       //Transforming  x and y velocities of the two particles to the original coordinate system i.e. without rotation
                    const u1y=yrotate(this.dx,this.dy,angle);
                    const u2x=xrotate(circleArray[f].dx,circleArray[f].dy,angle);
                    const u2y=yrotate(circleArray[f].dx,circleArray[f].dy,angle);

                    const v1x=u2x;                                                  //Since masses are same for the colliding particles the elastic collision final speeds in original axis would be something like this
                    const v1y=u1y;
                    const v2x=u1x;
                    const v2y=u2y;

                    const vf1x=xrotate(v1x,v1y,-angle);                             //Reverse transforming from original coordinate system back to rotated coordinate system
                    const vf1y=yrotate(v1x,v1y,-angle);
                    const vf2x=xrotate(v2x,v2y,-angle);
                    const vf2y=yrotate(v2x,v2y,-angle);

                    this.dx=vf1x;                                                   //Equating the final resultant velocities to particles velocities
                    this.dy=vf1y;
                    circleArray[f].dx=vf2x;
                    circleArray[f].dy=vf2y;
                }
            }
            
        }

        this.draw();
    }
}

function xrotate(a, b, c)                                                            //Functions to reverse transorm on to xy plane rotated by 'angle' respectively for x and y coordinates
{
    const ret=a*Math.cos(c)-b*Math.sin(c);
    return ret;
}

function yrotate(a, b, c)
{
    const reta=a*Math.sin(c)+b*Math.cos(c);
    return reta;
}

let circleArray = [];                                                               //List to store all bubble objects

var xc,yc;
var score=0;
var k,d,r;

canvas.addEventListener("click",timing);                                            //event listener to call for background timer
canvas.addEventListener("click",function(e){
    xc=e.clientX;
    yc=e.clientY;
    for(k=0;k<circleArray.length;k++)
    {
        d=Math.sqrt((xc-circleArray[k].x)**2+(yc-circleArray[k].y)**2);
        r=circleArray[k].radius;
        if(d<r)                                                                     //Object removed when clicked on
        {
            circleArray.splice(k,1);
            score++;     
            document.getElementById("canv_score").innerHTML=score;
            sound.play();   
        }
    
    }
});


function timing()                                                                   //Function to set interval of timer increment to 1 sec
{                                                           
  myvar=setInterval(ttiming, 1000);
}

function ttiming()
{
    seconds++;
    if(seconds==60)
    {
        seconds=0;
        minutes++;
    }

    if(seconds%10==0)                                                               //To increase rate of bubble generation every 10 seconds
    {
        if(second_check>=2)
            second_check-=1;
    }

    if(seconds==1 || seconds%second_check==0){                                      //Generating bubbles
    circleArray.push(new Circle());
    }
    canvas.removeEventListener("click",timing);

    bubble_number_check=circleArray.length;                                         //Critical condition tests, where bubbles occupy majority of screen
    if(bubble_number_check>=50)
    {
        count_sec++;
    }
    else{
        count_sec=0;
    }

    if(count_sec==10)                                                               //Game over if critical condition lasts for 10 seconds
    {
        canvas.style.display="none";
        end_game();
    }
    console.log(count_sec);
}    

function getDistance(x1,y1,x2,y2)                                                   //Function to return disatnce between coordinates passed
{
    let xD=x1-x2;
    let yD=y1-y2;

    return Math.sqrt(xD**2 + yD**2);
}

function animate() {                                                                //Function to generate frames for animation
    if(pause_value=='true')
    {
        return ;
    }
    
    requestAnimationFrame(animate);
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);                       //Clears canvas after every frame
    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update(circleArray);
    }
    
}
animate();